import { DEFAULT_RESPONSIVE_PAGE_WIDTH } from "@/lib/stylerules";
import { A, Li, Ul, element, registerRootPage, style } from "@/main";
import type { HRootPageFn, Store } from "@/main";
import { getAllMarkdowns } from "@site/components/library/post";
import { page } from "@site/components/pages/page";
import { navitem, postFmSchema, posts_dir, site } from "@site/config/site.config";
import { tag_map } from "@site/config/site.config";

type RootParameter = {
    tag: string;
};

export function rootPageFnParameters(): RootParameter[] {
    return Object.keys(tag_map).map((x) => ({ tag: x }));
}

export default function Root(store: Store): HRootPageFn<RootParameter> {
    const Page = page(store);
    const PageMainArea = element("page-main-area", { tag: "main" });
    const styles = [style(PageMainArea)(DEFAULT_RESPONSIVE_PAGE_WIDTH(store))];

    registerRootPage(store, styles);

    return async ({ tag }) => {
        const md = (await getAllMarkdowns(posts_dir, postFmSchema)).filter((x) => x.data.tag?.includes(tag));

        return Page({
            title: `${tag || ""} | ${site.name}`,
            description: site.description,
            lang: site.lang,
            name: site.name,
            navitem: navitem,
        })(PageMainArea({})(Ul({})(...md.map((x) => Li({})(A({ href: `/posts/${x.slug}` })(x.data.title))))));
    };
}
