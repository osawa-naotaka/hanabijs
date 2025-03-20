import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { A, globExt, semantic } from "@/main";
import type { HRootPageFn, Repository } from "@/main";
import { page } from "@site/components/pages/page";
import { hero } from "@site/components/sections/hero";
import { navitem, posts_dir, site } from "@site/config/site.config";
import matter from "gray-matter";

export default function Root(repo: Repository): HRootPageFn<void> {
    const Page = page(repo);
    const Hero = hero(repo);
    const PageMainArea = semantic("page-main-area", { class_names: ["container"], tag: "main" });
    const ArticleList = semantic("article-list", { class_names: ["content"], tag: "ul" });
    const ArticleListItem = semantic("article-list-item", { tag: "li" });

    return async () => {
        const items = globExt(path.join(cwd(), posts_dir), ".md");
        const slugs = (
            await Promise.all(
                (
                    await Array.fromAsync(items)
                ).map(async (x) => {
                    const { data } = matter(await readFile(path.join(cwd(), posts_dir, x), "utf-8"));
                    return {
                        slug: path.basename(x, ".md"),
                        title: data.title,
                    };
                }),
            )
        ).sort((a, b) => a.slug.localeCompare(b.slug));

        return Page(
            { title: site.name, description: site.description, lang: site.lang, name: site.name, navitem: navitem },
            Hero({}),
            PageMainArea(
                {},
                ArticleList({}, ...slugs.map((x) => ArticleListItem({}, A({ href: `/posts/${x.slug}` }, x.title)))),
            ),
        );
    };
}
