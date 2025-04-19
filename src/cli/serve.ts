import { readFile } from "node:fs/promises";
import http from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { cwd } from "node:process";
import type { Duplex } from "node:stream";
import { loadConfig } from "@/cli/config";
import type { HanabiConfig } from "@/cli/config";
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
        const req: Request = new Request(new URL(`http://${msg.headers.host}${msg.url}`));
        const rv = await processRequest(
            req,
            store,
            page_router,
            asset_router,
            public_router,
            page_dir,
            public_dir,
            config,
            require,
        );
        resp.writeHead(rv.status, { "Content-Type": rv.type });
        resp.end(rv.content);
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

type Resp = {
    status: number;
    type: string;
    content: string | Buffer<ArrayBufferLike>;
};

function normalResponse(content: string | Buffer<ArrayBufferLike>, ext: string): Resp {
    return { status: 200, content, type: contentType(ext) };
}

function errorResponse(status: number, cause: string): Resp {
    return {
        status,
        content: stringifyToHtml(0, [])(ErrorPage({ name: status.toString(), cause })),
        type: "text/html",
    };
}

async function processRequest(
    req: Request,
    store: Store,
    page_router: Router,
    asset_router: Map<string, Router>,
    public_router: Router,
    page_dir: string,
    public_dir: string,
    config: HanabiConfig,
    require: NodeJS.Require,
): Promise<Resp> {
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
        if (new URL(req.url).pathname.localeCompare("/hanabi-error.css") === 0) {
            return normalResponse(hanabi_error_css, ".css");
        }

        return errorResponse(404, `route for url "${req.url}" not found.`);
    } catch (e) {
        if (e instanceof Error) {
            return errorResponse(500, e.toString());
        }
        throw e;
    }
}
