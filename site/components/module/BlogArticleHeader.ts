import { Div, Header } from "@/main";
import type { HComponentFn, HNode } from "@/main";

export type ArticleHeaderArgument = {
    title: HNode;
};

export const BlogArticleHeader: HComponentFn<ArticleHeaderArgument> =
    (argument): ((...child: HNode[]) => HNode) =>
    (...child) =>
        Header({ class: ["article-header"] })(
            Div({ class: "article-header-title" })(argument.title),
            Div({ class: "article-header-meta" })(...child),
        );
