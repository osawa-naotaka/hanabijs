import {
    BORDER_UNDERLINE,
    FLEX_END,
    FLEX_WRAP,
    FONT_SIZE,
    F_SMALL,
    LINE_HEIGHT,
    MARGIN_BLOCK,
    ROW,
    S_SMALL,
    S_TINY,
} from "@/lib/stylerules";
import { component, element, registerComponent, style } from "@/main";
import type { HComponentFn, HNode, Store } from "@/main";

export type ArticleHeaderArgument = {
    title: HNode;
};

export function articleHeader(store: Store): HComponentFn<ArticleHeaderArgument> {
    const ArticleHeader = element("article-header", { tag: "header" });
    const Title = element("article-header-title");
    const Meta = element("article-header-meta");

    const component_styles = [
        style(Title)(BORDER_UNDERLINE),
        style(Meta)(
            ROW(S_SMALL(store)),
            FLEX_END,
            FLEX_WRAP,
            FONT_SIZE(F_SMALL(store)),
            LINE_HEIGHT("1"),
            MARGIN_BLOCK(S_TINY(store), "0"),
        ),
    ];

    registerComponent(store, ArticleHeader, component_styles);

    return component(ArticleHeader, ({ title }, ...child) => (
        <ArticleHeader>
            <Title>{title}</Title>
            <Meta>{child}</Meta>
        </ArticleHeader>
    ));
}
