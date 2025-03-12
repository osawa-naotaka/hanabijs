import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { globExt } from "@/lib/util";
import { A, type HNode, Li, Main, Ul } from "@/main";
import { Page } from "@site/components/pages/Page";
import { Hero } from "@site/components/sections/Hero";
import { posts_dir, site } from "@site/config/site.config";
import matter from "gray-matter";

export default async function Top(): Promise<HNode> {
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
        { title: site.name },
        Hero({}),
        Main(
            { class: "container" },
            Ul({ class: "content" }, ...slugs.map((x) => Li({}, A({ href: `/posts/${x.slug}` }, x.title)))),
        ),
    );
}
