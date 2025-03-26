import { Div, Header } from "@/main";
import type { HComponentFn, HNode } from "@/main";

export type ArticleHeaderArgument = {
    title: HNode;
};

export const BlogArticleHeader: HComponentFn<ArticleHeaderArgument> =
    (argument): ((...child: HNode[]) => HNode) =>
    (...child) =>
        Header({})(Div({})(argument.title), Div({ class: "row" })(...child));
