import { readFile } from "node:fs/promises";
import http from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { cwd } from "node:process";
import type { Duplex } from "node:stream";
import { loadConfig } from "@/cli/config";
import { bundleCss } from "@/cli/css";
import { bundleWoff2 } from "@/cli/font";
import { bundleHtml } from "@/cli/html";
import { createAssetRouter, createPageRouter, createStaticRouter, withoutExt } from "@/cli/route";
import type { Router } from "@/cli/route";
import { bundleScriptEsbuild } from "@/cli/script";
import { contentType } from "@/lib/core/coreutil";
import { Link, Script } from "@/lib/core/elements";
import { clearStore, generateStore } from "@/lib/core/store";
import type { Store } from "@/lib/core/store";
import { stringifyToHtml } from "@/lib/server/serverfn";
import { ErrorPage } from "@/page/error";
import { hanabi_error_css } from "@/page/hanabi-error";
import chokidar from "chokidar";
import { WebSocketServer } from "ws";

export async function serve(conf_file: string | undefined) {
    const config = await loadConfig(conf_file);

    const root = cwd();
    const page_dir = path.join(root, config.input.page_dir);
    const public_dir = path.join(root, config.input.public_dir);
    const watch_dir = path.join(root, config.server.watch_dir);

    const watcher = chokidar.watch(watch_dir, { persistent: true });
    const store = generateStore(config.asset, config.designrule);

    let page_router = await createPageRouter(page_dir);
    let public_router = await createStaticRouter(public_dir);
    let asset_router = new Map<string, Router>();

    const require = createRequire(import.meta.url);

    const http_server = http.createServer(async (msg: IncomingMessage, resp: ServerResponse) => {
        try {
            const req: Request = new Request(new URL(`http://${msg.headers.host}${msg.url}`));

            // Page router
            const match_page = page_router(req);
            if (!(match_page instanceof Error)) {
                const page_fn = require(path.join(page_dir, match_page.target_file));
                if (typeof page_fn.default === "function") {
                    clearStore(store);
                    const root_page_fn = await page_fn.default(store);

                    // auto generation of .css , .js and .woff2 from .html.ts
                    if (match_page.auto_generate) {
                        switch (match_page.req_ext) {
                            case ".css": {
                                const css_name = withoutExt(withoutExt(match_page.target_file));
                                const css = await bundleCss(store, css_name, require);
                                if (css instanceof Error) {
                                    await errorResponse(resp, 500, css.message);
                                } else {
                                    normalResponse(resp, css || "", match_page.req_ext);
                                }
                                break;
                            }
                            case ".js": {
                                const js = await bundleScriptEsbuild(store);
                                normalResponse(resp, js || "", match_page.req_ext);
                                break;
                            }
                            case ".woff2": {
                                const woff2 = await bundleWoff2(store);
                                normalResponse(resp, woff2 || "", match_page.req_ext);
                                break;
                            }
                            default:
                                await errorResponse(
                                    resp,
                                    500,
                                    `auto generation of ${match_page.req_ext} is not supported.`,
                                );
                        }
                        return;
                    }

                    switch (match_page.req_ext) {
                        case ".html": {
                            const router_set = await createAssetRouterSet(store, config.asset.target_prefix);
                            for (const [key, router] of router_set) {
                                asset_router.set(key, router);
                            }

                            const css_name = `${withoutExt(withoutExt(match_page.target_file))}.css`;
                            const js_name = `${withoutExt(withoutExt(match_page.target_file))}.js`;
                            const insert_nodes = [
                                Script({ type: "module", src: "/reload.js" }),
                                Script({ type: "module", src: js_name }),
                                Link({ href: css_name, rel: "stylesheet" }),
                            ];

                            const html_text = await bundleHtml(store, match_page.params, root_page_fn, insert_nodes);

                            normalResponse(resp, html_text, ".html");
                            break;
                        }
                        default:
                            normalResponse(resp, await root_page_fn, match_page.req_ext);
                    }
                    return;
                }
                await errorResponse(resp, 500, `${match_page.target_file} does not have default export.`);
            }

            // Public router
            const match_public = public_router(req);
            if (!(match_public instanceof Error)) {
                const content = await readFile(path.join(public_dir, match_public.target_file));
                normalResponse(resp, content, match_public.req_ext);
                return;
            }

            // Asset router
            for (const router of asset_router.values()) {
                const match_asset = router(req);
                if (!(match_asset instanceof Error)) {
                    const content = await readFile(match_asset.target_file);
                    normalResponse(resp, content, match_asset.req_ext);
                    return;
                }
            }

            // reload plugin
            if (new URL(req.url).pathname.endsWith("/reload.js")) {
                const reload =
                    "const ws = new WebSocket(`ws://${location.host}/reload`); ws.onmessage = (event) => { if (event.data === 'reload') { location.reload(); } }";
                normalResponse(resp, reload, ".js");
                return;
            }

            // css for error page
            if (new URL(req.url).pathname.localeCompare("/hanabi-error.css") === 0) {
                normalResponse(resp, hanabi_error_css, ".css");
                return;
            }

            await errorResponse(resp, 404, `route for url "${req.url}" not found.`);
        } catch (e) {
            if (e instanceof Error) {
                await errorResponse(resp, 500, e.toString());
                return;
            }
            throw e;
        }
    });

    const wss = new WebSocketServer({ noServer: true });

    wss.on("connection", function connection(ws) {
        ws.on("error", console.error);

        ws.on("close", () => {
            watcher.removeAllListeners();
        });
    });

    http_server.on("upgrade", (req: IncomingMessage, socket: Duplex, head: Buffer<ArrayBufferLike>) => {
        const { pathname } = new URL(req.url || "", `wss://${config.server.hostname}`);
        if (pathname === "/reload") {
            wss.handleUpgrade(req, socket, head, (ws) => {
                watcher.on("change", async () => {
                    watcher.removeAllListeners();
                    for (const key of Object.keys(require.cache)) {
                        delete require.cache[key];
                    }
                    page_router = await createPageRouter(page_dir);
                    public_router = await createStaticRouter(public_dir);
                    asset_router = new Map<string, Router>();
                    ws.send("reload");
                });
                wss.emit("connection", ws, req);
            });
        } else {
            socket.destroy();
        }
    });

    http_server.listen(config.server.port, config.server.hostname);
}

async function createAssetRouterSet(store: Store, target_prefix: string): Promise<[string, Router][]> {
    const asset_files: [string, Router][] = [];
    for (const [key, value] of store.components.entries()) {
        if (value.attachment?.assets !== undefined) {
            asset_files.push([key, await createAssetRouter(target_prefix, value.attachment.assets)]);
        }
    }

    return asset_files;
}

function normalResponse(resp: ServerResponse, content: string | Buffer<ArrayBufferLike>, ext: string): void {
    resp.writeHead(200, { "Content-Type": contentType(ext) });
    resp.end(content);
}

async function errorResponse(resp: ServerResponse, status: number, cause: string): Promise<void> {
    resp.writeHead(status, { "Content-Type": "text/html" });
    resp.end(stringifyToHtml(0, [])(await ErrorPage({ name: status.toString(), cause })));
}
