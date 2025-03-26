import path from "node:path";
import { markdownToHtml } from "@/lib/markdown";
import { Main, RawHTML, Section } from "@/main";
import type { HRootPageFn } from "@/main";
import { getMarkdown, listFiles } from "@site/components/library/post";
import { BlogArticle } from "@site/components/module/article";
import { Page } from "@site/components/pages/page";
import { navitem, posts_dir, site } from "@site/config/site.config";
import { postFmSchema } from "@site/config/site.config";

type RootParameter = {
    slug: string;
};

export async function rootPageFnParameters(): Promise<RootParameter[]> {
    return (await listFiles(posts_dir, ".md")).map((y) => ({ slug: path.basename(y, ".md") }));
}

export default function Root(): HRootPageFn<RootParameter> {
    return async (argument) => {
        const md = await getMarkdown(posts_dir, argument.slug, postFmSchema);

        const raw_html = await markdownToHtml(md.content);
        return Page({
            title: `${md.data.title || ""} | ${site.name}`,
            description: site.description,
            lang: site.lang,
            name: site.name,
            navitem: navitem,
        })(Main({})(Section({})(BlogArticle(md)(RawHTML({})(raw_html)))));
    };
}
