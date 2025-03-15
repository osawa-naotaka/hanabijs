import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { markdownToHtml } from "@/lib/markdown";
import { globExt } from "@/lib/util";
import { Article, H2, Main, RawHTML } from "@/main";
import type { Attribute, HNode } from "@/main";
import { Page } from "@site/components/pages/Page";
import { site } from "@site/config/site.config";
import { posts_dir } from "@site/config/site.config";
import matter from "gray-matter";

export async function getStaticPaths() {
    const items = globExt(path.join(cwd(), posts_dir), ".md");
    return (await Array.fromAsync(items)).map((x) => ({ params: { id: path.basename(x, ".md") } }));
}

export default async function Top(arg: Attribute): Promise<HNode> {
    const markdown =
        arg === undefined || arg.id === undefined
            ? ""
            : await readFile(path.join(cwd(), posts_dir, `${arg.id}.md`), "utf-8");
    const { data } = matter(markdown);

    const raw_html = await markdownToHtml(markdown);

    return Page(
        {
            title: `${data.title || ""} | ${site.name}`,
            description: site.description,
            lang: site.lang,
            name: site.name,
        },
        Main({ class: "container" }, Article({ class: "content" }, H2({}, data.title || ""), RawHTML({}, raw_html))),
    );
}
