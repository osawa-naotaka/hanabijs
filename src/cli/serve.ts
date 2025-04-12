import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { loadConfig } from "@/cli/config";
import { bundleCss } from "@/cli/css";
import { bundleWoff2 } from "@/cli/font";
import { bundleHtml } from "@/cli/html";
import { createAssetRouter, createPageRouter, createStaticRouter, withoutExt } from "@/cli/route";
import type { Router } from "@/cli/route";
import { bundleScriptEsbuild } from "@/cli/script";
import { Link, Script } from "@/lib/elements";
import { clearStore, generateStore } from "@/lib/repository";
import type { Store } from "@/lib/repository";
import { stringifyToHtml } from "@/lib/serverfn";
import { contentType } from "@/lib/coreutil";
import { ErrorPage } from "@/page/error";
import hanabi_error_css from "@/page/hanabi-error.css" assert { type: "text" };
import chokidar from "chokidar";

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

    const server = Bun.serve({
        websocket: {
            open(ws) {
                watcher.removeAllListeners();
                watcher.on("change", async () => {
                    page_router = await createPageRouter(page_dir);
                    public_router = await createStaticRouter(public_dir);
                    asset_router = new Map<string, Router>();
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

            // Page router
            const match_page = page_router(req);
            if (!(match_page instanceof Error)) {
                const page_fn = await import(path.join(page_dir, match_page.target_file));
                if (typeof page_fn.default === "function") {
                    clearStore(store);
                    const root_page_fn = await page_fn.default(store);

                    // auto generation of .css , .js and .woff2 from .html.ts
                    if (match_page.auto_generate) {
                        switch (match_page.req_ext) {
                            case ".css": {
                                const css_name = withoutExt(withoutExt(match_page.target_file));
                                const css = await bundleCss(store, css_name);
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

                            return normalResponse(html_text, ".html");
                        }
                        default:
                            return normalResponse(await root_page_fn, match_page.req_ext);
                    }
                }
                return await errorResponse(500, `${match_page.target_file} does not have default export.`);
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
            if (new URL(req.url).pathname.localeCompare("/hanabi-error.css") === 0) {
                return normalResponse(hanabi_error_css, ".css");
            }

            return await errorResponse(404, `route for url "${req.url}" not found.`);
        },
        port: config.server.port,
        hostname: config.server.hostname,
        async error(error) {
            console.error(error);
            return await errorResponse(500, error.message);
        },
    });
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

function normalResponse(content: string | Buffer<ArrayBufferLike>, ext: string): Response {
    return new Response(content, {
        headers: { "Content-Type": contentType(ext) },
    });
}

async function errorResponse(status: number, cause: string): Promise<Response> {
    return new Response(stringifyToHtml(0, [])(await ErrorPage({ name: status.toString(), cause })), {
        status,
        statusText: cause,
        headers: { "Content-Type": "text/html" },
    });
}
