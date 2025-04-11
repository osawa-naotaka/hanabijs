import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { loadConfig } from "@/cli/config";
import { createAssetRouter, createPageRouter, createStaticRouter, withoutExt } from "@/cli/route";
import type { Router } from "@/cli/route";
import { DOCTYPE, Link, Script } from "@/lib/elements";
import { clearStore, generateStore } from "@/lib/repository";
import type { HComponentAsset, HComponentInsert, Store } from "@/lib/repository";
import { stringifyToHtml } from "@/lib/serverfn";
import { insertNodes, stringifyToCss } from "@/lib/style";
import { contentType, replaceExt } from "@/lib/util";
import { ErrorPage } from "@/page/error";
import hanabi_error_css from "@/page/hanabi-error.css" assert { type: "text" };
import chokidar from "chokidar";
import esbuild from "esbuild";
import { generateCss, svg2woff2 } from "svg2woff2";
import type { Svg } from "svg2woff2";

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

                    // auto generation of .css and .js from .html.ts
                    if (match_page.auto_generate) {
                        switch (match_page.req_ext) {
                            case ".css": {
                                return bundleCss(store, withoutExt(withoutExt(match_page.target_file)));
                            }
                            case ".js": {
                                const js = await bundleScript(store);
                                return normalResponse(js, match_page.req_ext);
                            }
                            case ".woff2": {
                                const woff2 = await bundleWoff2(store);
                                return normalResponse(woff2, match_page.req_ext);
                            }
                            default:
                                return errorResponse(500, `auto generation of ${match_page.req_ext} is not supported.`);
                        }
                    }

                    switch (match_page.req_ext) {
                        case ".html": {
                            // create asset router
                            const asset_files: [string, HComponentAsset[]][] = [];
                            for (const [key, value] of store.components.entries()) {
                                if (value.attachment?.assets !== undefined) {
                                    asset_files.push([key, value.attachment.assets]);
                                }
                            }

                            for (const asset of asset_files) {
                                asset_router.set(
                                    asset[0],
                                    await createAssetRouter(config.asset.target_prefix, asset[1]),
                                );
                            }

                            // generate html
                            const top_component = await root_page_fn(match_page.params);
                            const css_name = replaceExt(replaceExt(match_page.target_file, ""), ".css");
                            const js_name = replaceExt(replaceExt(match_page.target_file, ""), ".js");

                            const insert_nodes: [string, HComponentInsert[]][] = [];
                            for (const [key, value] of store.components.entries()) {
                                if (value.attachment?.inserts !== undefined) {
                                    insert_nodes.push([key, value.attachment.inserts]);
                                }
                            }

                            const inserted = insert_nodes.reduce(
                                (p, c) => c[1].reduce((pp, cc) => insertNodes(pp, cc.selector, cc.nodes, true), p),
                                top_component,
                            );

                            const html = insertNodes(
                                inserted,
                                ["head"],
                                [
                                    Script({ type: "module", src: "/reload.js" }),
                                    Script({ type: "module", src: js_name }),
                                    Link({ href: css_name, rel: "stylesheet" }),
                                ],
                                true,
                            );
                            const html_text = DOCTYPE() + stringifyToHtml(0, [])(html);
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

async function bundleCss(store: Store, base_name: string): Promise<Response> {
    const font_css = generateFontCss(store, base_name);

    const css_files = Array.from(store.components.values())
        .map((x) => x.attachment?.script)
        .filter((x) => x !== undefined);
    for (const client of css_files) {
        const client_fn = await import(client);
        if (typeof client_fn.default === "function") {
            await client_fn.default(store);
        } else {
            return await errorResponse(500, `${client} does not have default export.`);
        }
    }
    const css = stringifyToCss(Array.from(store.components.values()));
    return normalResponse(`${css}${font_css}`, ".css");
}

async function bundleScript(store: Store): Promise<string> {
    const script_files = Array.from(store.components.values())
        .map((x) => x.attachment?.script)
        .filter((x) => x !== undefined);
    const entry = `import { generateStore } from "@/main"; const store = generateStore(); ${script_files.map((x, idx) => `import scr${idx} from "${x}"; await scr${idx}(store)();`).join("\n")}`;
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
        format: "esm",
        sourcemap: "inline",
        platform: "browser",
        target: "es2024",
        treeShaking: true,
        write: false,
    });

    return bundle.outputFiles[0].text;
}

type SvgName = {
    name: string;
    src: string;
};

async function bundleWoff2(store: Store): Promise<Buffer> {
    const svg_names = listSvgNames(store);

    const svgs: Svg[] = await Promise.all(
        svg_names.map(async (n) => {
            const content = (await readFile(n.src)).toString();
            return { name: n.name, content };
        }),
    );

    const woff2 = await svg2woff2(svgs, {
        font_family: "hanabi generated font",
        version: "1.0",
        description: "hanabi font generated from svgs",
        url: "https://github.com/osawa-naotaka/hanabijs.git",
    });

    return woff2;
}

function generateFontCss(store: Store, base_name: string): string {
    const svg_names: Svg[] = listSvgNames(store).map((n) => ({ name: n.name, content: "" }));
    return generateCss(svg_names, { font_family: "hanabi generated font", url: `${base_name}.woff2` });
}

function listSvgNames(store: Store): SvgName[] {
    const font_components = Array.from(store.components.values())
        .map((x) => x.attachment?.fonts)
        .filter((x) => x !== undefined);

    return font_components.flatMap((component) =>
        component.flatMap((chars) => {
            const base_dir = path.dirname(require.resolve(`${chars.package_name}/package.json`));
            return chars.chars.map((c) => ({ name: c.name, src: path.join(base_dir, c.src) }));
        }),
    );
}
