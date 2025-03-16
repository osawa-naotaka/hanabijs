import { existsSync } from "node:fs";
import { rmdir } from "node:fs/promises";
import path from "node:path";
import { cwd, exit } from "node:process";
import { dist_subdir, page_subdir, public_subdir } from "@/config";
import { Link } from "@/lib/element";
import type { HComponent } from "@/lib/element";
import { DOCTYPE, insertNodes, stringifyToHtml } from "@/lib/element";
import { clearRepository } from "@/lib/repository";
import { createSelector, stringifyToCss } from "@/lib/style";
import { globExt, replaceExt } from "@/lib/util";

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
        let start = performance.now();

        const page_fn = await import(path.join(page_dir, file));
        if (typeof page_fn.default === "function") {
            clearRepository(repository);
            const root_page_fn = page_fn.default(repository);
            const fullpath = path.join(dist_dir, file);

            if ("getStaticPaths" in page_fn) {
                const param_list = await page_fn.getStaticPaths();
                const param_names = Array.from(fullpath.matchAll(/\[(?<key>[^\]]+)\]/g)).map(
                    (m) => m.groups?.key || "",
                );

                for (const param of param_list) {
                    const file_replaced = param_names.reduce((p, c) => p.replaceAll(`[${c}]`, param.params[c]), file);
                    const replaced = path.join(dist_dir, file_replaced);
                    const html_name = replaceExt(replaced, ".html");
                    const top_component = await root_page_fn(param.params);
                    const css_name = path.join("/", replaceExt(file, ".css"));
                    const inserted = insertNodes(top_component, createSelector(["*", " ", "head"]), [
                        Link({ href: css_name, rel: "stylesheet" }, ""),
                    ]);

                    const html = DOCTYPE() + stringifyToHtml(inserted);
                    Bun.write(html_name, html);
                    const end = performance.now();
                    console.log(`process ${file}: ${file_replaced} in ${(end - start).toFixed(2)}ms`);
                    start = end;
                }

                const file_css = replaceExt(file, ".css");
                const css_name = path.join(dist_dir, file_css);
                const css = stringifyToCss(Array.from(repository.values()));
                Bun.write(css_name, css);
                console.log(`process ${file_css} in ${(performance.now() - start).toFixed(2)}ms`);
            } else {
                const top_component = await root_page_fn();
                const html_name = path.join(dist_dir, replaceExt(file, ".html"));

                const css_name = path.join("/", replaceExt(file, ".css"));
                const inserted = insertNodes(top_component, createSelector(["*", " ", "head"]), [
                    Link({ href: css_name, rel: "stylesheet" }, ""),
                ]);

                const html = DOCTYPE() + stringifyToHtml(inserted);
                Bun.write(html_name, html);
                const css = stringifyToCss(Array.from(repository.values()));
                Bun.write(path.join(dist_dir, css_name), css);
                console.log(`process ${file} in ${(performance.now() - start).toFixed(2)}ms`);
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
