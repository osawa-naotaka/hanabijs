import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { createPageRouter, createStaticRouter } from "@/cli/route";
import { page_subdir, public_subdir, site_subdir } from "@/config";
import { Link, Script } from "@/lib/element";
import type { HComponent } from "@/lib/element";
import { DOCTYPE, insertNodes, stringifyToHtml } from "@/lib/element";
import { clearRepository } from "@/lib/repository";
import { createSelector, stringifyToCss } from "@/lib/style";
import { contentType, replaceExt } from "@/lib/util";
import { ErrorPage } from "@/page/error";
import chokidar from "chokidar";
import esbuild from "esbuild";

export async function serve() {
    const root = cwd();
    const page_dir = path.join(root, page_subdir);
    const public_dir = path.join(root, public_subdir);
    const site_dir = path.join(root, site_subdir);
    const repository = new Map<string, HComponent>();

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
                    const page_fn = await import(path.join(page_dir, match_page.target_file));
                    if (typeof page_fn.default === "function") {
                        const css_name = replaceExt(match_page.target_file, ".css");
                        clearRepository(repository);
                        const root_page_fn = page_fn.default(repository);
                        const top_component = await root_page_fn(match_page.params);
                        const html = insertNodes(top_component, createSelector(["*", " ", "head"]), [
                            Script({ type: "module", src: "/reload.js" }, ""),
                            Script({ type: "module", src: "/glue.js" }, ""),
                            Link({ href: css_name, rel: "stylesheet" }, ""),
                        ]);
                        const html_text = DOCTYPE() + stringifyToHtml(html);
                        return new Response(html_text, {
                            headers: {
                                "Content-Type": "text/html",
                            },
                        });
                    }
                    return await errorResponse("500", `${match_page.target_file} does not have default export.`);
                }
                if (match_page.req_ext === ".css") {
                    const page_fn = await import(path.join(page_dir, match_page.target_file));
                    if (typeof page_fn.default === "function") {
                        clearRepository(repository);
                        page_fn.default(repository);
                        const css = stringifyToCss(Array.from(repository.values()));
                        return new Response(css, {
                            headers: { "Content-Type": contentType(match_page.req_ext) },
                        });
                    }
                    return await errorResponse("500", `${match_page.target_file} does not have default export.`);
                }
                return await errorResponse("404", `unsupported extension: ${match_page.req_ext}`);
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
            if (new URL(req.url).pathname.endsWith("/glue.js")) {
                const entry = `import clientScript from "./site/client/client.ts"; clientScript(document);`;
                const bundle = await esbuild.build({
                    stdin: {
                        contents: entry,
                        loader: "ts",
                        resolveDir: cwd(),
                    },
                    bundle: true,
                    format: "iife",
                    sourcemap: "inline",
                    platform: "browser",
                    target: "es2024",
                    treeShaking: true,
                    write: false,
                });

                return new Response(bundle.outputFiles[0].text, {
                    headers: {
                        "Content-Type": "application/javascript",
                    },
                });
            }
            if (new URL(req.url).pathname.endsWith("/default.css")) {
                const default_css = await readFile(path.join(root, "src/page/default.css"));

                return new Response(default_css, {
                    headers: {
                        "Content-Type": "text/css",
                    },
                });
            }

            return await errorResponse("404", "Route Not Found");
        },
        port: 4132,
        hostname: "localhost",
        async error(error) {
            console.error(error);
            return await errorResponse(error.name, error.message);
        },
    });
}

async function errorResponse(name: string, cause: string): Promise<Response> {
    return new Response(stringifyToHtml(await ErrorPage({ name, cause })), {
        headers: { "Content-Type": "text/html" },
    });
}
