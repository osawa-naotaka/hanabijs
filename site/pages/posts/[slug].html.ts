import path from "node:path";
import { markdownToHtml } from "@/lib/markdown";
import { DEFAULT_RESPONSIVE_PAGE_WIDTH } from "@/lib/stylerules";
import { RawHTML, element, registerRootPage, style } from "@/main";
import type { HRootPageFn, Store } from "@/main";
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

export default function Root(store: Store): HRootPageFn<RootParameter> {
    const Page = page(store);
    const PageMainArea = element("page-main-area", { tag: "main" });
    const PageSection = element("page-section", { tag: "section" });
    const Article = article(store);

    const styles = [
        style(PageMainArea, {
            margin_block_end: appearence.layout.space_block_large,
        }),
        style(PageSection, DEFAULT_RESPONSIVE_PAGE_WIDTH(store)),
    ];

    return registerRootPage(store, "root", styles, async (argument) => {
        const md = await getMarkdown(posts_dir, argument.slug, postFmSchema);

        const raw_html = await markdownToHtml(md.content);
        return Page({
            title: `${md.data.title || ""} | ${site.name}`,
            description: site.description,
            lang: site.lang,
            name: site.name,
            navitem: navitem,
        })(PageMainArea({})(PageSection({})(Article(md)(RawHTML({})(raw_html)))));
    });
}
