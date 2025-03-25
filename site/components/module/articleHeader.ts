import { registerComponent, semantic, style } from "@/main";
import type { HComponentFn, HNode, Repository } from "@/main";

export type ArticleHeaderArgument = {
    title: HNode;
};

export function articleHeader(repo: Repository): HComponentFn<ArticleHeaderArgument> {
    const ArticleHeader = semantic("article-header", { tag: "header" });
    const ArticleHeaderTitle = semantic("article-header-title");
    const ArticleHeaderMeta = semantic("article-header-meta");

    const styles = [
        style(ArticleHeader, { margin_block_end: "1.5rem" }),
        style(ArticleHeaderTitle, {
            border_bottom: "3px solid",
        }),
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
        repo,
        ArticleHeader,
        styles,
        (argument): ((...child: HNode[]) => HNode) =>
            (...child) =>
                ArticleHeader({ class: argument.class })(
                    ArticleHeaderTitle({})(argument.title),
                    ArticleHeaderMeta({})(...child),
                ),
    );
}
