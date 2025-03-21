import { existsSync } from "node:fs";
import { rmdir } from "node:fs/promises";
import path from "node:path";
import { cwd, exit } from "node:process";
import { dist_subdir, page_subdir, public_subdir } from "@/config";
import { Link, Script } from "@/lib/define";
import type { HComponent, HNode } from "@/lib/element";
import { DOCTYPE, insertNodes, stringifyToHtml } from "@/lib/element";
import type { Repository } from "@/lib/repository";
import { clearRepository } from "@/lib/repository";
import { createSelector, stringifyToCss } from "@/lib/style";
import { globExt } from "@/lib/util";
import type { PageList } from "@site/site.config";
import esbuild from "esbuild";

export async function build(static_list: PageList[]) {
    const start = performance.now();

    const root = cwd();
    const dist_dir = path.join(root, dist_subdir);
    const page_dir = path.join(root, page_subdir);
    const public_dir = path.join(root, public_subdir);
    const repository = new Map<string, HComponent>();

    if (existsSync(dist_dir)) {
        await rmdir(dist_dir, { recursive: true });
    }

    if (!existsSync(page_dir)) {
        console.log("hanabi: no page directory.");
        exit(-1);
    }
    for (const templates of static_list) {
        clearRepository(repository);
        const { css_js_path, pages } = await templates(repository);
        const css_js = await bundleAndWriteCssJs(css_js_path, dist_dir, repository);

        for (const page of await Promise.all(pages)) {
            await processAndWriteHtml(page.path, dist_dir, css_js, page.node);
        }
    }

    // copy public
    if (existsSync(public_dir)) {
        const start = performance.now();
        for await (const src of globExt(public_dir, "")) {
            const file = Bun.file(path.join(public_dir, src));
            await Bun.write(path.join(dist_dir, src), file);
        }
        console.log(`process public in ${(performance.now() - start).toFixed(2)}ms`);
    }

    console.log(`build in ${(performance.now() - start).toFixed(2)}ms`);
}

async function processAndWriteHtml(
    relative_path: string,
    dist_dir: string,
    [css_link, js_src]: [string, string],
    top_component: HNode,
): Promise<void> {
    const html_start = performance.now();

    const inserted = insertNodes(top_component, createSelector(["*", " ", "head"]), [
        css_link !== "" ? Link({ href: css_link, rel: "stylesheet" })("") : "",
        js_src !== "" ? Script({ type: "module", src: js_src })("") : "",
    ]);

    const html = DOCTYPE() + stringifyToHtml(0)(inserted);
    writeToFile(html, relative_path, dist_dir, ".html", html_start);
}

async function bundleAndWriteCssJs(
    relative_path: string,
    dist_dir: string,
    repository: Repository,
): Promise<[string, string]> {
    // process css
    const css_start = performance.now();
    let css_link = "";
    const css_content = stringifyToCss(Array.from(repository.values()));
    if (css_content !== "") {
        css_link = writeToFile(css_content, relative_path, dist_dir, ".css", css_start);
    }

    // process js
    const js_start = performance.now();
    let js_src = "";
    const script_content = await bundleScriptEsbuild(repository);
    if (script_content !== null) {
        js_src = writeToFile(script_content, relative_path, dist_dir, ".js", js_start);
    }

    return [css_link, js_src];
}

function writeToFile(content: string, file_name: string, dist_dir: string, ext: string, start: number): string {
    const file_ext = `${file_name}${ext}`;
    const absolute_path = path.join(dist_dir, file_ext);
    Bun.write(absolute_path, content);
    console.log(`process ${file_ext} in ${(performance.now() - start).toFixed(2)}ms`);

    return file_ext;
}

async function bundleScriptEsbuild(repository: Repository): Promise<string> {
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
