#!/usr/bin/env -S bun --hot

import { cwd } from "node:process";
import chokidar from "chokidar";
import { page_subdir } from "../config";
import { Link, Script } from "../lib/component";
import { DOCTYPE, insertElements, stringifyToHtml } from "../lib/element";
import { createSelector, stringifyToCss } from "../lib/style";
import { replaceExt } from "../lib/util";
import { createRouter } from "./route";

export async function serve() {
    const root = cwd();
    const page_dir = `${root}/${page_subdir}`;

    const watcher = chokidar.watch(page_dir, { persistent: true });

    let router = await createRouter(page_dir);

    const server = Bun.serve({
        websocket: {
            open(ws) {
                console.log("Client connected");
                watcher.on("change", async (p) => {
                    router = await createRouter(page_dir);
                    ws.send("reload");
                });
            },
            message(ws, message) {
                console.log("Received:", message);
            },
        },
        async fetch(req: Request): Promise<Response> {
            if (server.upgrade(req)) {
                return new Response(null, { status: 101 });
            }
            const match = router(req);
            if (!(match instanceof Error)) {
                if (match.req_ext === "" || match.req_ext === ".html") {
                    const page = await import(`${page_dir}/${match.file_path}`);
                    if (typeof page.default === "function") {
                        const css_name = replaceExt(match.file_path, ".css");
                        const html = insertElements(page.default(match.params), createSelector(["*", " ", "head"]), [
                            Script({ type: "module", src: "/reload.js" }, ""),
                            Link({ href: css_name, rel: "stylesheet" }, ""),
                        ]);
                        const html_text = DOCTYPE() + stringifyToHtml(html);
                        return new Response(html_text, {
                            headers: {
                                "Content-Type": "text/html",
                            },
                        });
                    }
                    return new Response(`${match.file_path} does not have default export.`, {
                        status: 404,
                    });
                }
                if (match.req_ext === ".css") {
                    const page = await import(`${page_dir}/${match.file_path}`);
                    if (typeof page.default === "function") {
                        const css = page.default(match.params);
                        return new Response(stringifyToCss(css), {
                            headers: { "Content-Type": "text/css" },
                        });
                    }
                    return new Response(`${match.file_path} does not have default export.`, {
                        status: 404,
                    });
                }
                return new Response(`unsupported extension: ${match.req_ext}`, {
                    status: 404,
                });
            }

            // plugin
            if (new URL(req.url).pathname.endsWith("/reload.js")) {
                const reload =
                    "const ws = new WebSocket(`ws://${location.host}/reload`); ws.onmessage = (event) => { console.log('reloader message:', event.data); if (event.data === 'reload') { location.reload(); } }";

                return new Response(reload, {
                    headers: {
                        "Content-Type": "application/javascript",
                    },
                });
            }

            return new Response("Route Not Found", { status: 404 });
        },
        port: 4132,
        hostname: "localhost",
        error(error) {
            console.error(error);
            return new Response("Internal Server Error", { status: 500 });
        },
    });
}

await serve();
