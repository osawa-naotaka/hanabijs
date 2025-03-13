#!/usr/bin/env -S bun --hot

import { readFile } from "node:fs/promises";
import { cwd } from "node:process";
import chokidar from "chokidar";
import { page_subdir, public_subdir, site_subdir } from "../config";
import { Link, Script } from "../lib/component";
import { DOCTYPE, insertElements, stringifyToHtml } from "../lib/element";
import { createSelector, stringifyToCss } from "../lib/style";
import { contentType, replaceExt } from "../lib/util";
import { createPageRouter, createStaticRouter } from "./route";
import path from "node:path";

export async function serve() {
    const root = cwd();
    const page_dir = path.join(root, page_subdir);
    const public_dir = path.join(root, public_subdir);
    const site_dir = path.join(root, site_subdir);

    const watcher = chokidar.watch(site_dir, { persistent: true });

    let page_router = await createPageRouter(page_dir);
    let public_router = await createStaticRouter(public_dir);

    const server = Bun.serve({
        websocket: {
            open(ws) {
                watcher.on("change", async () => {
                    page_router = await createPageRouter(page_dir);
                    public_router = await createPageRouter(public_dir);
                    ws.send("reload");
                });
            },
            message(_ws, message) {
                console.log("Received:", message);
            },
        },
        async fetch(req: Request): Promise<Response> {
            if (server.upgrade(req)) {
                return new Response(null, { status: 101 });
            }

            // Page router
            const match_page = page_router(req);
            if (!(match_page instanceof Error)) {
                if (match_page.req_ext === "" || match_page.req_ext === ".html") {
                    const page = await import(path.join(page_dir, match_page.target_file));
                    if (typeof page.default === "function") {
                        const css_name = replaceExt(match_page.target_file, ".css");
                        const html = insertElements(
                            await page.default(match_page.params),
                            createSelector(["*", " ", "head"]),
                            [
                                Script({ type: "module", src: "/reload.js" }, ""),
                                Link({ href: css_name, rel: "stylesheet" }, ""),
                            ],
                        );
                        const html_text = DOCTYPE() + stringifyToHtml(html);
                        return new Response(html_text, {
                            headers: {
                                "Content-Type": "text/html",
                            },
                        });
                    }
                    return new Response(`${match_page.target_file} does not have default export.`, {
                        status: 404,
                    });
                }
                if (match_page.req_ext === ".css") {
                    const page = await import(`${page_dir}/${match_page.target_file}`);
                    if (typeof page.default === "function") {
                        const css = await page.default(match_page.params);
                        return new Response(stringifyToCss(css), {
                            headers: { "Content-Type": contentType(match_page.req_ext) },
                        });
                    }
                    return new Response(`${match_page.target_file} does not have default export.`, {
                        status: 404,
                    });
                }
                return new Response(`unsupported extension: ${match_page.req_ext}`, {
                    status: 404,
                });
            }

            // Public router
            const match_public = public_router(req);
            if (!(match_public instanceof Error)) {
                const content = await readFile(path.join(public_dir, match_public.target_file));
                return new Response(content, {
                    headers: { "Content-Type": contentType(match_public.req_ext) },
                });
            }

            // plugin
            if (new URL(req.url).pathname.endsWith("/reload.js")) {
                const reload =
                    "const ws = new WebSocket(`ws://${location.host}/reload`); ws.onmessage = (event) => { if (event.data === 'reload') { location.reload(); } }";

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
