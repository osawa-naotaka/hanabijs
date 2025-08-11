import path from "node:path";
import { article } from "@site/components/module/article";
import { page } from "@site/components/pages/page";
import { navitem, postFmSchema, posts_dir, site } from "@site/site.config";
import { RawHTML, element, registerRootPage, style } from "zephblaze/core";
import type { HRootPageFn, Store } from "zephblaze/core";
import { DEFAULT_RESPONSIVE_PAGE_WIDTH, MARGIN_BLOCK, S_2XLARGE } from "zephblaze/core";
import { getMarkdown, listFiles, markdownToHtml } from "zephblaze/server";

type RootParameter = {
    slug: string;
};

export async function rootPageFnParameters(): Promise<RootParameter[]> {
    return (await listFiles(posts_dir, ".md")).map((y) => ({ slug: path.basename(y, ".md") }));
}

export default function Root(store: Store): HRootPageFn<RootParameter> {
    const Page = page(store);
    const PageMainArea = element("page-main-area", { tag: "main" });
    const Article = article(store);

    const styles = [style(PageMainArea)(MARGIN_BLOCK("0", S_2XLARGE(store)), DEFAULT_RESPONSIVE_PAGE_WIDTH(store))];

    registerRootPage(store, styles);

    return async ({ slug }) => {
        const md = await getMarkdown(posts_dir, slug, postFmSchema);

        const raw_html = await markdownToHtml(md.content);

        return (
            <Page
                title={`${md.data.title || ""} | ${site.name}`}
                description={site.description}
                lang={site.lang}
                name={site.name}
                navitem={navitem}
            >
                <PageMainArea>
                    <Article {...md}>
                        <RawHTML>{raw_html}</RawHTML>
                    </Article>
                </PageMainArea>
            </Page>
        );
    };
}
