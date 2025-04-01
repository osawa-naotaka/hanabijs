import {
    BORDER_UNDERLINE,
    FLEX_END,
    FLEX_WRAP,
    FONT_SIZE,
    F_SMALL,
    LINE_HEIGHT,
    MARGIN_BLOCK,
    ROW,
    S_2XLARGE,
    S_SMALL,
    S_TINY,
} from "@/lib/stylerules";
import { element, registerComponent, style } from "@/main";
import type { HComponentFn, HNode, Store } from "@/main";

export type ArticleHeaderArgument = {
    title: HNode;
};

export function articleHeader(store: Store): HComponentFn<ArticleHeaderArgument> {
    const ArticleHeader = element("article-header", { tag: "header" });
    const ArticleHeaderTitle = element("article-header-title");
    const ArticleHeaderMeta = element("article-header-meta");

    const component_styles = [
        style(ArticleHeader, MARGIN_BLOCK(S_2XLARGE(store))),
        style(ArticleHeaderTitle, BORDER_UNDERLINE),
        style(
            ArticleHeaderMeta,
            ROW(S_SMALL(store)),
            FLEX_END,
            FLEX_WRAP,
            FONT_SIZE(F_SMALL(store)),
            LINE_HEIGHT("1"),
            MARGIN_BLOCK(S_TINY(store), "0"),
        ),
    ];

    return registerComponent(
        store,
        ArticleHeader,
        component_styles,
        (argument) =>
            (...child) =>
                ArticleHeader({ class: argument.class })(
                    ArticleHeaderTitle({})(argument.title),
                    ArticleHeaderMeta({})(...child),
                ),
    );
}
