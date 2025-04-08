import { existsSync } from "node:fs";
import { rmdir } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import type { Attribute, HRootPageFn } from "@/lib/component";
import { DOCTYPE, Link, Script } from "@/lib/elements";
import { clearStore, generateStore } from "@/lib/repository";
import type { HComponentAsset, HComponentInsert, Store } from "@/lib/repository";
import { stringifyToHtml } from "@/lib/serverfn";
import { insertNodes, stringifyToCss } from "@/lib/style";
import { globExt, replaceExt } from "@/lib/util";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import virtual from "@rollup/plugin-virtual";
import esbuild from "esbuild";
import { rollup } from "rollup";
import { loadConfig } from "./config";

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
        await rmdir(dist_dir, { recursive: true });
    }

    if (!existsSync(page_dir)) {
        throw new Error(`hanabi: no page directory found at ${page_dir}.`);
    }
    for await (const filename_in_dir of globExt(page_dir, ".{ts,tsx}")) {
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
            const root_dir =
                entry.package_name === undefined
                    ? cwd()
                    : path.dirname(require.resolve(`${entry.package_name}/package.json`));
            console.log(root_dir);
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
    const glob = new Bun.Glob(pattern);
    for await (const src of glob.scan(root)) {
        const content = Bun.file(path.join(root, src));
        await Bun.write(path.join(dist_dir, path.parse(src).base), content);
    }
}

async function copyDir(root: string, dist_dir: string) {
    const glob = new Bun.Glob("**/*");
    for await (const src of glob.scan(root)) {
        const content = Bun.file(path.join(root, src));
        await Bun.write(path.join(dist_dir, src), content);
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
    Bun.write(absolute_path, output_string);
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

    const top_component = await root_page_fn(params);

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
            css_link !== "" ? Link({ href: css_link, rel: "stylesheet" }) : "",
            js_src !== "" ? Script({ type: "module", src: js_src }) : "",
        ],
        true,
    );

    const doctype_html = DOCTYPE() + stringifyToHtml(0, [])(html);
    writeToFile(doctype_html, relative_path, dist_dir, ".html", html_start);
}

async function bundleAndWriteCssJs(relative_path: string, dist_dir: string, store: Store): Promise<[string, string]> {
    // process css
    const css_start = performance.now();
    let css_link = "";
    const css_files = Array.from(store.components.values())
        .map((x) => x.attachment?.script)
        .filter((x) => x !== undefined);
    for (const client of css_files) {
        const client_fn = await import(client);
        if (typeof client_fn.default === "function") {
            await client_fn.default(store);
        } else {
            console.log(`${client} has no default export. skip processing.`);
        }
    }

    const css_content = stringifyToCss(Array.from(store.components.values()));
    if (css_content !== "") {
        css_link = writeToFile(css_content, relative_path, dist_dir, ".css", css_start);
    }

    // process js
    const js_start = performance.now();
    let js_src = "";
    const script_content = await bundleScriptEsbuild(store);
    if (script_content !== null) {
        js_src = writeToFile(script_content, relative_path, dist_dir, ".js", js_start);
    }

    return [css_link, js_src];
}

function writeToFile(content: string, file_name: string, dist_dir: string, ext: string, start: number): string {
    const file_ext = replaceExt(file_name, ext);
    const absolute_path = path.join(dist_dir, file_ext);
    Bun.write(absolute_path, content);
    console.log(`process ${file_ext} in ${(performance.now() - start).toFixed(2)}ms`);

    return file_ext;
}

export async function bundleScriptEsbuild(store: Store): Promise<string | null> {
    const script_files = Array.from(store.components.values())
        .map((x) => x.attachment?.script)
        .filter((x) => x !== undefined);
    if (script_files.length === 0) {
        return null;
    }
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
        platform: "browser",
        target: "es2024",
        treeShaking: true,
        sourcemap: false,
        write: false,
        minify: true,
    });

    return bundle.outputFiles[0].text;
}

export async function bundleScriptRollup(store: Store): Promise<string | null> {
    const script_files = Array.from(store.components.values())
        .map((x) => x.attachment?.script)
        .filter(Boolean);
    if (script_files.length === 0) {
        return null;
    }

    const entry = `import { generateStore } from "@/main"; const store = generateStore(); ${script_files.map((x, idx) => `import scr${idx} from "${x}"; await scr${idx}(store)();`).join("\n")}`;
    const bundle = await rollup({
        input: "entry.ts",
        treeshake: "smallest",
        plugins: [
            virtual({
                "entry.ts": entry,
            }),
            typescript(),
            terser(),
            nodeResolve(),
            commonjs(),
        ],
    });

    const { output } = await bundle.generate({ format: "esm" });
    return output[0].code;
}
