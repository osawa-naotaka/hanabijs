import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { markdownToHtml } from "@/lib/markdown";
import { globExt } from "@/lib/util";
import { Article, type Attribute, H2, type HNode, Main, RawHTML } from "@/main";
import { Page } from "@site/components/pages/Page";
import { site } from "@site/config/site.config";
import { posts_dir } from "@site/config/site.config";
import matter from "gray-matter";

export async function getStaticPaths() {
    const items = globExt(path.join(cwd(), posts_dir), ".md");
    return (await Array.fromAsync(items)).map((x) => ({ params: { id: path.basename(x, ".md") } }));
}

export default async function Top(arg: Attribute): Promise<HNode> {
    const markdown = arg.id === undefined ? "" : await readFile(path.join(cwd(), posts_dir, `${arg.id}.md`), "utf-8");
    const { data } = matter(markdown);
    return Page(
        { title: `${data.title} | ${site.name}` },
        Main(
            { class: "container" },
            Article({ class: "content" }, H2({}, data.title || ""), RawHTML({}, await markdownToHtml(markdown))),
        ),
    );
}
