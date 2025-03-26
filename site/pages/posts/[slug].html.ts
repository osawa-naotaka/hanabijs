import path from "node:path";
import { markdownToHtml } from "@/lib/markdown";
import { RawHTML, registerRootPage, semantic, style } from "@/main";
import type { HRootPageFn, Repository } from "@/main";
import { getMarkdown, listFiles } from "@site/components/library/post";
import { article } from "@site/components/module/article";
import { page } from "@site/components/pages/page";
import { navitem, posts_dir, site } from "@site/config/site.config";
import { appearence } from "@site/config/site.config";
import { postFmSchema } from "@site/config/site.config";

type RootParameter = {
    slug: string;
};

export async function rootPageFnParameters(): Promise<RootParameter[]> {
    return (await listFiles(posts_dir, ".md")).map((y) => ({ slug: path.basename(y, ".md") }));
}

export default function Root(repo: Repository): HRootPageFn<RootParameter> {
    const Page = page(repo);
    const PageMainArea = semantic("page-main-area", { class_names: ["container"], tag: "main" });
    const PageSection = semantic("page-section", { class_names: ["section", "content"], tag: "section" });
    const Article = article(repo);

    return registerRootPage(
        repo,
        "root",
        [
            style(PageMainArea, {
                margin_block_end: appearence.layout.space_block_large,
            }),
        ],
        async (argument) => {
            const md = await getMarkdown(posts_dir, argument.slug, postFmSchema);

            const raw_html = await markdownToHtml(md.content);
            return Page({
                title: `${md.data.title || ""} | ${site.name}`,
                description: site.description,
                lang: site.lang,
                name: site.name,
                navitem: navitem,
            })(PageMainArea({})(PageSection({})(Article(md)(RawHTML({})(raw_html)))));
        },
    );
}
