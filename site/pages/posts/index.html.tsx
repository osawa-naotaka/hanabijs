import { page } from "@site/components/pages/page";
import { summaries } from "@site/components/sections/summaries";
import { navitem, postFmSchema, posts_dir, site } from "@site/site.config";
import { element, registerRootPage, style } from "zephblaze/core";
import type { HRootPageFn, Store } from "zephblaze/core";
import { DEFAULT_RESPONSIVE_PAGE_WIDTH } from "zephblaze/core";
import { getAllMarkdowns } from "zephblaze/server";

export default function Root(store: Store): HRootPageFn<void> {
    const Page = page(store);
    const PageMainArea = element("page-main-area", { tag: "main" });
    const Summaries = summaries(store);

    const styles = [style(PageMainArea)(DEFAULT_RESPONSIVE_PAGE_WIDTH(store))];

    registerRootPage(store, styles);

    return async () => {
        const posts = await getAllMarkdowns(posts_dir, postFmSchema);
        const posts_sorted = posts.sort((a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime());

        return (
            <Page title={site.name} description={site.description} lang={site.lang} name={site.name} navitem={navitem}>
                <PageMainArea>
                    <Summaries posts={posts_sorted} />
                </PageMainArea>
            </Page>
        );
    };
}
