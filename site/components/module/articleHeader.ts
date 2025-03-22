import { registerComponent, semantic, style } from "@/main";
import type { HComponentFn, HNode, Repository } from "@/main";

export type ArticleHeaderArgument = {
    title: HNode;
};

export function articleHeader(repo: Repository): HComponentFn<ArticleHeaderArgument> {
    registerComponent(repo, "article-header", [
        style("&", { margin_block_end: "1.5rem" }),
        style(".article-header-title", {
            border_bottom: "3px solid",
        }),
        style(".article-header-meta", {
            display: "flex",
            justify_content: "flex-end",
            align_items: "center",
            margin_block_start: "4px",
            gap: "0.5rem",
            flex_wrap: "wrap",
            font_size: "0.8rem",
        }),
    ]);

    const ArticleHeader = semantic("article-header", { tag: "header" });
    const ArticleHeaderTitle = semantic("article-header-title");
    const ArticleHeaderMeta = semantic("article-header-meta");

    return (argument) =>
        (...child) =>
            ArticleHeader({ class: argument.class })(
                ArticleHeaderTitle({})(argument.title),
                ArticleHeaderMeta({})(...child),
            );
}
