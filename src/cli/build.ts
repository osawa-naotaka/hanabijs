import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { cwd } from "node:process";
import { loadConfig } from "@/cli/config";
import { bundleCss } from "@/cli/css";
import { bundleWoff2 } from "@/cli/font";
import { bundleHtml } from "@/cli/html";
import { withoutExt } from "@/cli/route";
import { bundleScriptEsbuild } from "@/cli/script";
import type { Attribute, HRootPageFn } from "@/lib/component";
import { replaceExt } from "@/lib/coreutil";
import { Link, Script } from "@/lib/elements";
import { clearStore, generateStore } from "@/lib/repository";
import type { HComponentAsset, Store } from "@/lib/repository";
import { globExt } from "@/server";
import { glob } from "glob";

export async function build(conf_file: string | undefined) {
    const start = performance.now();

    const config = await loadConfig(conf_file);

    const root = cwd();
    const dist_dir = path.join(root, config.output.dist_dir);
    const page_dir = path.join(root, config.input.page_dir);
    const public_dir = path.join(root, config.input.public_dir);

    const store = generateStore(config.asset, config.designrule);
    const asset_store = new Map<string, HComponentAsset[]>();

    if (config.output.clean_befor_build && existsSync(dist_dir)) {
        rmSync(dist_dir, { recursive: true });
    }

    if (!existsSync(page_dir)) {
        throw new Error(`hanabi: no page directory found at ${page_dir}.`);
    }
    for (const filename_in_dir of await globExt(page_dir, ".{ts,tsx}")) {
        const import_start = performance.now();
        const page_fn = await import(path.join(page_dir, filename_in_dir));
        console.log(`import ${filename_in_dir} in ${(performance.now() - import_start).toFixed(2)}ms`);

        const relative_path = replaceExt(path.join("/", filename_in_dir), "");
        if (typeof page_fn.default === "function") {
            if (path.extname(relative_path) === ".html") {
                await processHtmlDotTs(store, relative_path, dist_dir, page_fn);

                for (const [key, value] of store.components.entries()) {
                    if (value.attachment?.assets !== undefined) {
                        asset_store.set(key, value.attachment.assets);
                    }
                }
            } else {
                await processAnyDotTs(store, relative_path, dist_dir, page_fn);
            }
        } else {
            console.warn(`${filename_in_dir} has no default export. skip processing.`);
        }
    }

    // copy assets
    for (const statics of asset_store.values()) {
        for (const entry of statics) {
            const require = createRequire(import.meta.url);
            const root_dir =
                entry.package_name === undefined
                    ? cwd()
                    : path.dirname(require.resolve(`${entry.package_name}/package.json`));
            for (const file of entry.copy_files) {
                await copyFiles(root_dir, file.src, path.join(dist_dir, config.asset.target_prefix, file.dist));
            }
        }
    }

    // copy public
    if (existsSync(public_dir)) {
        const start = performance.now();
        await copyDir(public_dir, dist_dir);
        console.log(`process public in ${(performance.now() - start).toFixed(2)}ms`);
    }

    console.log(`build in ${(performance.now() - start).toFixed(2)}ms`);
}

async function copyFiles(root: string, pattern: string, dist_dir: string) {
    for (const src of await glob(pattern, { cwd: root, nodir: true })) {
        const content = readFileSync(path.join(root, src));
        ensureDirWrite(path.join(dist_dir, path.parse(src).base), content);
    }
}

async function copyDir(root: string, dist_dir: string) {
    for (const src of await glob("**/*", { cwd: root, nodir: true })) {
        const content = readFileSync(path.join(root, src));
        ensureDirWrite(path.join(dist_dir, src), content);
    }
}

type HtmlPageFn = {
    default: (store: Store) => Promise<HRootPageFn<Attribute>>;
    rootPageFnParameters?: () => Promise<Array<Record<string, string>>>;
};

async function processHtmlDotTs(store: Store, relative_path: string, dist_dir: string, page_fn: HtmlPageFn) {
    clearStore(store);
    const root_page_fn = await page_fn.default(store);
    const css_js = await bundleAndWriteCssJs(relative_path, dist_dir, store);
    await bundleAndWriteWoff2(relative_path, dist_dir, store);

    if (page_fn.rootPageFnParameters !== undefined) {
        const param_list = await page_fn.rootPageFnParameters();
        const param_names = Array.from(relative_path.matchAll(/\[(?<key>[^\]]+)\]/g)).map((m) => m.groups?.key || "");

        for (const param of param_list) {
            const file_replaced = param_names.reduce((p, c) => p.replaceAll(`[${c}]`, param[c]), relative_path);
            await processAndWriteHtml(file_replaced, dist_dir, css_js, root_page_fn, param, store);
        }
    } else {
        await processAndWriteHtml(relative_path, dist_dir, css_js, root_page_fn, {}, store);
    }
}

type AnyPageFn = {
    default: (store: Store) => Promise<string>;
};

async function processAnyDotTs(
    repository: Store,
    relative_path: string,
    dist_dir: string,
    page_fn: AnyPageFn,
): Promise<void> {
    const start = performance.now();
    const output_string = await page_fn.default(repository);
    const absolute_path = path.join(dist_dir, relative_path);
    writeFileSync(absolute_path, output_string);
    console.log(`process ${relative_path} in ${(performance.now() - start).toFixed(2)}ms`);
}

async function processAndWriteHtml(
    relative_path: string,
    dist_dir: string,
    [css_link, js_src]: [string, string],
    root_page_fn: HRootPageFn<Attribute>,
    params: Record<string, string>,
    store: Store,
): Promise<void> {
    const html_start = performance.now();

    const insert_nodes = [
        css_link !== "" ? Link({ href: css_link, rel: "stylesheet" }) : "",
        js_src !== "" ? Script({ type: "module", src: js_src }) : "",
    ];

    const html = await bundleHtml(store, params, root_page_fn, insert_nodes);

    writeToFile(html, relative_path, dist_dir, ".html", html_start);
}

async function bundleAndWriteWoff2(relative_path: string, dist_dir: string, store: Store) {
    const start = performance.now();
    const woff2 = await bundleWoff2(store);
    if (woff2 !== null) {
        writeToFile(woff2, relative_path, dist_dir, ".woff2", start);
    }
}

async function bundleAndWriteCssJs(relative_path: string, dist_dir: string, store: Store): Promise<[string, string]> {
    // process js
    const js_start = performance.now();
    let js_src = "";
    const script_content = await bundleScriptEsbuild(store);
    if (script_content !== null) {
        js_src = writeToFile(script_content, relative_path, dist_dir, ".js", js_start);
    }

    // process css
    const css_start = performance.now();

    const css = await bundleCss(store, withoutExt(relative_path));
    if (css instanceof Error) {
        console.warn(css);
        return ["", js_src];
    }

    let css_link = "";
    if (css !== null) {
        css_link = writeToFile(css, relative_path, dist_dir, ".css", css_start);
    }

    return [css_link, js_src];
}

function writeToFile(
    content: string | Buffer<ArrayBufferLike>,
    file_name: string,
    dist_dir: string,
    ext: string,
    start: number,
): string {
    const file_ext = replaceExt(file_name, ext);
    const absolute_path = path.join(dist_dir, file_ext);
    const base = path.dirname(absolute_path);
    if (!existsSync(base)) {
        mkdirSync(base);
    }
    ensureDirWrite(absolute_path, content);
    console.log(`process ${file_ext} in ${(performance.now() - start).toFixed(2)}ms`);

    return file_ext;
}

function ensureDirWrite(absolute_path: string, content: string | Buffer<ArrayBufferLike>) {
    const base = path.dirname(absolute_path);
    ensureDir(base);
    writeFileSync(absolute_path, content);
}

function ensureDir(base: string) {
    if (!existsSync(base)) {
        const pdir = base.endsWith("/") ? base.slice(0, -1) : base;
        ensureDir(path.dirname(pdir));
        mkdirSync(base);
    }
}
