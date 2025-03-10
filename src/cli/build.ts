import { existsSync } from "node:fs";
import { rmdir } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { glob } from "glob";
import { dist_subdir, page_subdir } from "../config";
import { Link } from "../lib/component";
import { DOCTYPE, insertElements, stringifyToHtml } from "../lib/element";
import { createSelector, stringifyToCss } from "../lib/style";
import { replaceExt } from "../lib/util";

export async function build() {
    const root = cwd();
    const dist_dir = path.join(root, dist_subdir);
    const page_dir = path.join(root, page_subdir);

    if (existsSync(dist_dir)) {
        await rmdir(dist_dir, { recursive: true });
    }

    for (const file of await glob("**/*.ts", { cwd: page_dir })) {
        const page_fn = await import(`${page_dir}/${file}`);
        if (typeof page_fn.default === "function") {
            const fullpath = path.join(dist_dir, file);

            if ("getStaticPaths" in page_fn) {
                const param_list = await page_fn.getStaticPaths();
                const param_names = Array.from(fullpath.matchAll(/\[(?<key>[^\]]+)\]/g)).map(
                    (m) => m.groups?.key || "",
                );

                for (const param of param_list) {
                    const replaced = param_names.reduce((p, c) => p.replaceAll(`[${c}]`, param.params[c]), fullpath);
                    const html_name = replaceExt(replaced, ".html");
                    const page = page_fn.default(param.params);
                    const css_name = `/${replaceExt(file, ".css")}`;
                    const inserted = insertElements(page, createSelector(["*", " ", "head"]), [
                        Link({ href: css_name, rel: "stylesheet" }, ""),
                    ]);

                    const html = DOCTYPE() + stringifyToHtml(inserted);
                    Bun.write(html_name, html);
                }

                const css_name = replaceExt(fullpath, ".css");
                const css = stringifyToCss(page_fn.default(param_list[0].params));
                Bun.write(css_name, css);
            } else {
                const page = page_fn.default();
                const html_name = path.join(dist_dir, replaceExt(file, ".html"));

                const css_name = `/${replaceExt(file, ".css")}`;
                const inserted = insertElements(page, createSelector(["*", " ", "head"]), [
                    Link({ href: css_name, rel: "stylesheet" }, ""),
                ]);

                const html = DOCTYPE() + stringifyToHtml(inserted);
                Bun.write(html_name, html);
                const css = stringifyToCss(page);
                Bun.write(path.join(dist_dir, css_name), css);
            }
        }
    }
}
