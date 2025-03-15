import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { globExt } from "@/lib/util";
import { A, Li, Main, Ul } from "@/main";
import type { HNode } from "@/main";
import { page } from "@site/components/pages/page";
import { hero } from "@site/components/sections/hero";
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

    const Page = page();
    const Hero = hero();

    return Page(
        { title: site.name, description: site.description, lang: site.lang, name: site.name },
        Hero({}),
        Main(
            { class: "container" },
            Ul({ class: "content" }, ...slugs.map((x) => Li({}, A({ href: `/posts/${x.slug}` }, x.title)))),
        ),
    );
}
