import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { markdownToHtml } from "@/lib/markdown";
import { H2, RawHTML, globExt, semantic } from "@/main";
import type { HPath, HRootPageFn, Repository } from "@/main";
import { page } from "@site/components/pages/page";
import { navitem, posts_dir, site } from "@site/config/site.config";
import matter from "gray-matter";

type RootParameter = {
    id: string;
};

export async function getStaticPaths(): Promise<HPath<RootParameter>> {
    const items = globExt(path.join(cwd(), posts_dir), ".md");
    return (await Array.fromAsync(items)).map((x) => ({ params: { id: path.basename(x, ".md") } }));
}

export default function Root(repo: Repository): HRootPageFn<RootParameter> {
    const Page = page(repo);
    const PageMainArea = semantic("page-main-area", { class_names: ["container"], tag: "main" });
    const Article = semantic("article", { class_names: ["content"], tag: "article" });

    return async (parameter) => {
        const markdown = await readFile(path.join(cwd(), posts_dir, `${parameter.id}.md`), "utf-8");
        const { data, content } = matter(markdown);

        const raw_html = await markdownToHtml(content);
        return Page({
            title: `${data.title || ""} | ${site.name}`,
            description: site.description,
            lang: site.lang,
            name: site.name,
            navitem: navitem,
        })(PageMainArea({})(Article({})(H2({})(data.title || ""), RawHTML({})(raw_html))));
    };
}
