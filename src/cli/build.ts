import { existsSync } from "node:fs";
import { rmdir } from "node:fs/promises";
import path from "node:path";
import { cwd, exit } from "node:process";
import { dist_subdir, page_subdir, public_subdir } from "@/config";
import { Link, Script } from "@/lib/element";
import type { HComponent } from "@/lib/element";
import { DOCTYPE, insertNodes, stringifyToHtml } from "@/lib/element";
import { type Repository, clearRepository } from "@/lib/repository";
import { createSelector, stringifyToCss } from "@/lib/style";
import { globExt, replaceExt } from "@/lib/util";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import virtual from "@rollup/plugin-virtual";
import { rollup } from "rollup";

export async function build() {
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
    for await (const file of globExt(page_dir, ".ts")) {
        const import_start = performance.now();
        const page_fn = await import(path.join(page_dir, file));
        console.log(`import ${file} in ${(performance.now() - import_start).toFixed(2)}ms`);

        if (typeof page_fn.default === "function") {
            clearRepository(repository);
            const root_page_fn = page_fn.default(repository);
            const [css_link, js_src] = await bundleAndWriteCssJs(file, dist_dir, repository);

            if ("getStaticPaths" in page_fn) {
                const fullpath = path.join(dist_dir, file);
                const param_list = await page_fn.getStaticPaths();
                const param_names = Array.from(fullpath.matchAll(/\[(?<key>[^\]]+)\]/g)).map(
                    (m) => m.groups?.key || "",
                );

                for (const param of param_list) {
                    const html_start = performance.now();
                    const file_replaced = param_names.reduce((p, c) => p.replaceAll(`[${c}]`, param.params[c]), file);

                    const top_component = await root_page_fn(param.params);
                    const inserted = insertNodes(top_component, createSelector(["*", " ", "head"]), [
                        css_link !== "" ? Link({ href: css_link, rel: "stylesheet" }, "") : "",
                        js_src !== "" ? Script({ type: "module", src: js_src }, "") : "",
                    ]);

                    const html = DOCTYPE() + stringifyToHtml(inserted);
                    writeToFile(html, file_replaced, dist_dir, ".html", html_start);
                }
            } else {
                // process html
                const html_start = performance.now();
                const top_component = await root_page_fn();
                const inserted = insertNodes(top_component, createSelector(["*", " ", "head"]), [
                    css_link !== "" ? Link({ href: css_link, rel: "stylesheet" }, "") : "",
                    js_src !== "" ? Script({ type: "module", src: js_src }, "") : "",
                ]);

                const html = DOCTYPE() + stringifyToHtml(inserted);
                writeToFile(html, file, dist_dir, ".html", html_start);
            }
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
}

async function bundleAndWriteCssJs(file: string, dist_dir: string, repository: Repository): Promise<[string, string]> {
    // process css
    const css_start = performance.now();
    let css_link = "";
    const css_content = stringifyToCss(Array.from(repository.values()));
    if (css_content !== "") {
        css_link = writeToFile(css_content, file, dist_dir, ".css", css_start);
    }

    // process js
    const js_start = performance.now();
    let js_src = "";
    const script_content = await bundleScript(repository);
    if (script_content !== null) {
        js_src = writeToFile(script_content, file, dist_dir, ".js", js_start);
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

async function bundleScript(repository: Repository): Promise<string | null> {
    const script_files = Array.from(repository.values())
        .map((x) => x.path)
        .filter(Boolean);

    if (script_files.length > 0) {
        const entry = script_files.map((x, idx) => `import scr${idx} from "${x}"; scr${idx}(document);`).join("\n");

        const bundle = await rollup({
            input: "entry.ts",
            plugins: [
                virtual({
                    "entry.ts": entry,
                }),
                typescript(),
                terser(),
            ],
        });

        const { output } = await bundle.generate({ format: "iife" });
        return output[0].code;
    }

    return null;
}
