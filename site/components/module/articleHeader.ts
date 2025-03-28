import { BORDER_UNDERLINE, MARGIN_BLOCK, SIZE_2XL } from "@/lib/stylerules";
import { registerComponent, semantic, style, styles } from "@/main";
import type { HComponentFn, HNode, Store } from "@/main";

export type ArticleHeaderArgument = {
    title: HNode;
};

export function articleHeader(store: Store): HComponentFn<ArticleHeaderArgument> {
    const ArticleHeader = semantic("article-header", { tag: "header" });
    const ArticleHeaderTitle = semantic("article-header-title");
    const ArticleHeaderMeta = semantic("article-header-meta");

    const component_styles = [
        styles(ArticleHeader, MARGIN_BLOCK(SIZE_2XL)),
        styles(ArticleHeaderTitle, BORDER_UNDERLINE),
        style(ArticleHeaderMeta, {
            display: "flex",
            justify_content: "flex-end",
            align_items: "center",
            margin_block_start: "4px",
            gap: "0.5rem",
            flex_wrap: "wrap",
            font_size: "0.8rem",
        }),
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
