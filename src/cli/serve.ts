import { readFile } from "node:fs/promises";
import http from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { cwd } from "node:process";
import type { Duplex } from "node:stream";
import { loadConfig } from "@/cli/config";
import type { ZephblazeConfig } from "@/cli/config";
import { bundleCss } from "@/cli/css";
import { bundleWoff2 } from "@/cli/font";
import { bundleHtml } from "@/cli/html";
import { stringifyToHtml } from "@/cli/html";
import { createAssetRouter, createPageRouter, createStaticRouter, withoutExt } from "@/cli/route";
import type { Router } from "@/cli/route";
import { bundleScriptEsbuild } from "@/cli/script";
import { Link, Script } from "@/lib/core/elements";
import { clearStore, generateStore } from "@/lib/core/store";
import type { Store } from "@/lib/core/store";
import { contentType } from "@/lib/core/util";
import { ErrorPage } from "@/page/error";
import { zephblaze_error_css } from "@/page/zephblaze-error";
import chokidar from "chokidar";
import type { FSWatcher } from "chokidar";
import { WebSocketServer } from "ws";

export async function serve(conf_file: string | undefined): Promise<void> {
    const config = await loadConfig(conf_file);
    const watch_dir = path.join(cwd(), config.server.watch_dir);
    const watcher = chokidar.watch(watch_dir, { persistent: true });

    const [proc, reload] = createReqProcessor(config);

    if (
        typeof process !== "undefined" &&
        process.versions &&
        Object.prototype.hasOwnProperty.call(process.versions, "bun")
    ) {
        createAndStartBunServer(config, proc, reload, watcher);
    } else if (typeof globalThis !== "undefined" && globalThis.Deno) {
        createAndStartDenoServer(config, proc, reload, watcher);
    } else {
        createAndStartNodeServer(config, proc, reload, watcher);
    }
}

type Resp = {
    status: number;
    type: string;
    content: ArrayBuffer;
};

type ReqProcessFn = (req: Request) => Promise<Resp>;
type ReloadFn = () => void;

function createAndStartDenoServer(
    config: ZephblazeConfig,
    proc: ReqProcessFn,
    reload: ReloadFn,
    watcher: FSWatcher,
): void {
    Deno.serve({ port: config.server.port, hostname: config.server.hostname }, async (req: Request) => {
        if (req.headers.get("upgrade") === "websocket") {
            const { socket, response } = Deno.upgradeWebSocket(req);
            socket.addEventListener("open", () => {
                watcher.removeAllListeners();
                watcher.on("change", () => {
                    reload();
                    socket.send("reload");
                });
            });
            socket.addEventListener("close", () => {
                watcher.removeAllListeners();
            });
            return response;
        }

        const rv = await proc(req);
        return new Response(rv.content, { status: rv.status, headers: { "Content-Type": rv.type } });
    });
}

function createAndStartBunServer(
    config: ZephblazeConfig,
    proc: ReqProcessFn,
    reload: ReloadFn,
    watcher: FSWatcher,
): void {
    const server = Bun.serve({
        websocket: {
            open(ws) {
                watcher.removeAllListeners();
                watcher.on("change", () => {
                    reload();
                    ws.send("reload");
                });
            },
            message(_ws, message) {
                console.log("Received:", message);
            },
            close() {
                watcher.removeAllListeners();
            },
        },
        async fetch(req: Request): Promise<Response> {
            if (server.upgrade(req)) {
                return new Response(null, { status: 101 });
            }
            const rv = await proc(req);
            return new Response(rv.content, { status: rv.status, headers: { "Content-Type": rv.type } });
        },
        port: config.server.port,
        hostname: config.server.hostname,
        async error(error) {
            console.error(error);
            return new Response(error.message, { status: 500, headers: { "Content-Type": "text/plain" } });
        },
    });
}

function createAndStartNodeServer(
    config: ZephblazeConfig,
    proc: ReqProcessFn,
    reload: ReloadFn,
    watcher: FSWatcher,
): void {
    const http_server = http.createServer(async (msg: IncomingMessage, resp: ServerResponse) => {
        const req: Request = new Request(new URL(`http://${msg.headers.host}${msg.url}`));
        const rv = await proc(req);
        resp.writeHead(rv.status, { "Content-Type": rv.type });
        resp.end(Buffer.from(rv.content));
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
                watcher.on("change", () => {
                    watcher.removeAllListeners();
                    reload();
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

function createAssetRouterSet(store: Store, target_prefix: string, require: NodeJS.Require): [string, Router][] {
    const asset_files: [string, Router][] = [];
    for (const [key, value] of store.components.entries()) {
        if (value.attachment?.assets !== undefined) {
            asset_files.push([key, createAssetRouter(target_prefix, value.attachment.assets, require)]);
        }
    }

    return asset_files;
}

function normalResponse(content_arg: string | Buffer<ArrayBufferLike>, ext: string): Resp {
    const content =
        typeof content_arg === "string" ? Buffer.from(content_arg).buffer : new Uint8Array(content_arg).buffer;
    return { status: 200, content, type: contentType(ext) };
}

function errorResponse(status: number, cause: string): Resp {
    return {
        status,
        content: Buffer.from(stringifyToHtml(0, [])(ErrorPage({ name: status.toString(), cause }))).buffer,
        type: "text/html",
    };
}

function createReqProcessor(config: ZephblazeConfig): [ReqProcessFn, ReloadFn] {
    const root = cwd();
    const page_dir = path.join(root, config.input.page_dir);
    const public_dir = path.join(root, config.input.public_dir);

    const store = generateStore(config.asset, config.designrule);

    let page_router = createPageRouter(page_dir);
    let public_router = createStaticRouter(public_dir);
    let asset_router = new Map<string, Router>();

    const require = createRequire(import.meta.url);

    const reload_fn: ReloadFn = () => {
        for (const key of Object.keys(require.cache)) {
            delete require.cache[key];
        }
        page_router = createPageRouter(page_dir);
        public_router = createStaticRouter(public_dir);
        asset_router = new Map<string, Router>();
    };

    const proc_fn: ReqProcessFn = async (req: Request) => {
        try {
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
                                    return errorResponse(500, css.message);
                                }
                                return normalResponse(css || "", match_page.req_ext);
                            }
                            case ".js": {
                                const js = await bundleScriptEsbuild(store);
                                return normalResponse(js || "", match_page.req_ext);
                            }
                            case ".woff2": {
                                const woff2 = await bundleWoff2(store);
                                return normalResponse(woff2 || "", match_page.req_ext);
                            }
                            default:
                                return errorResponse(500, `auto generation of ${match_page.req_ext} is not supported.`);
                        }
                    }

                    switch (match_page.req_ext) {
                        case ".html": {
                            const router_set = createAssetRouterSet(store, config.asset.target_prefix, require);
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

                            return normalResponse(html_text, ".html");
                        }
                        default:
                            return normalResponse(root_page_fn, match_page.req_ext);
                    }
                }
                return errorResponse(500, `${match_page.target_file} does not have default export.`);
            }

            // Public router
            const match_public = public_router(req);
            if (!(match_public instanceof Error)) {
                const content = await readFile(path.join(public_dir, match_public.target_file));
                return normalResponse(content, match_public.req_ext);
            }

            // Asset router
            for (const router of asset_router.values()) {
                const match_asset = router(req);
                if (!(match_asset instanceof Error)) {
                    const content = await readFile(match_asset.target_file);
                    return normalResponse(content, match_asset.req_ext);
                }
            }

            // reload plugin
            if (new URL(req.url).pathname.endsWith("/reload.js")) {
                const reload =
                    "const ws = new WebSocket(`ws://${location.host}/reload`); ws.onmessage = (event) => { if (event.data === 'reload') { location.reload(); } }";
                return normalResponse(reload, ".js");
            }

            // css for error page
            if (new URL(req.url).pathname.localeCompare("/zephblaze-error.css") === 0) {
                return normalResponse(zephblaze_error_css, ".css");
            }

            return errorResponse(404, `route for url "${req.url}" not found.`);
        } catch (e) {
            if (e instanceof Error) {
                return errorResponse(500, e.toString());
            }
            throw e;
        }
    };

    return [proc_fn, reload_fn];
}
