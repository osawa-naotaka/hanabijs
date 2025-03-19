import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { createPageRouter, createStaticRouter } from "@/cli/route";
import { page_subdir, public_subdir, site_subdir } from "@/config";
import { Link, Script } from "@/lib/element";
import type { HComponent, HRootPageFn } from "@/lib/element";
import { DOCTYPE, insertNodes, stringifyToHtml } from "@/lib/element";
import { clearRepository } from "@/lib/repository";
import type { Repository } from "@/lib/repository";
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
                watcher.removeAllListeners();
                watcher.on("change", async () => {
                    page_router = await createPageRouter(page_dir);
                    public_router = await createPageRouter(public_dir);
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
                    clearRepository(repository);
                    const root_page_fn = await page_fn.default(repository);

                    // auto generation of .css and .js from .html.ts
                    if (match_page.auto_generate) {
                        switch (match_page.req_ext) {
                            case ".css": {
                                const css = stringifyToCss(Array.from(repository.values()));
                                return normalResponse(css, match_page.req_ext);
                            }
                            case ".js": {
                                const js = await bundleScript(repository, page_fn.default);
                                return normalResponse(js, match_page.req_ext);
                            }
                            default:
                                return errorResponse(
                                    "500",
                                    `hanabi: server internal error. auto generation ${match_page.req_ext} is not supported.`,
                                );
                        }
                    }

                    switch (match_page.req_ext) {
                        case ".html": {
                            const top_component = await root_page_fn(match_page.params);
                            const css_name = replaceExt(replaceExt(match_page.target_file, ""), ".css");
                            const js_name = replaceExt(replaceExt(match_page.target_file, ""), ".js");

                            const html = insertNodes(top_component, createSelector(["*", " ", "head"]), [
                                Script({ type: "module", src: "/reload.js" }, ""),
                                Script({ type: "module", src: js_name }, ""),
                                Link({ href: css_name, rel: "stylesheet" }, ""),
                            ]);
                            const html_text = DOCTYPE() + stringifyToHtml(0)(html);
                            return normalResponse(html_text, ".html");
                        }
                        default:
                            return normalResponse(await root_page_fn, match_page.req_ext);
                    }
                }
                return await errorResponse("500", `${match_page.target_file} does not have default export.`);
            }

            // Public router
            const match_public = public_router(req);
            if (!(match_public instanceof Error)) {
                const content = await readFile(path.join(public_dir, match_public.target_file));
                return normalResponse(content, match_public.req_ext);
            }

            // reload plugin
            if (new URL(req.url).pathname.endsWith("/reload.js")) {
                const reload =
                    "const ws = new WebSocket(`ws://${location.host}/reload`); ws.onmessage = (event) => { if (event.data === 'reload') { location.reload(); } }";
                return normalResponse(reload, ".js");
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

function normalResponse(content: string | Buffer<ArrayBufferLike>, ext: string): Response {
    return new Response(content, {
        headers: { "Content-Type": contentType(ext) },
    });
}

async function errorResponse(name: string, cause: string): Promise<Response> {
    return new Response(stringifyToHtml(0)(await ErrorPage({ name, cause })), {
        headers: { "Content-Type": "text/html" },
    });
}

async function bundleScript(
    repository: Repository,
    page_fn: (repo: Repository) => Promise<HRootPageFn<Record<string, unknown>>>,
): Promise<string> {
    clearRepository(repository);
    await page_fn(repository);
    const script_files = Array.from(repository.values())
        .map((x) => x.path)
        .filter(Boolean);
    const entry = script_files.map((x, idx) => `import scr${idx} from "${x}"; scr${idx}();`).join("\n");
    const bundle = await esbuild.build({
        stdin: {
            contents: entry,
            loader: "ts",
            resolveDir: cwd(),
        },
        // supress esbuild warning not to define import.meta in browser.
        define: {
            "import.meta.path": "undefined",
        },
        bundle: true,
        format: "iife",
        sourcemap: "inline",
        platform: "browser",
        target: "es2024",
        treeShaking: true,
        write: false,
    });

    return bundle.outputFiles[0].text;
}
