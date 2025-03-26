import { Article, Div, H2 } from "@/main";
import type { HComponentFn } from "@/main";
import type { PostFm } from "@site/config/site.config";
import { DateTime } from "../element/dateTime";
import { ShareX } from "../element/shareX";
import { TagList } from "../element/tagList";
import type { Markdown } from "../library/post";
import { BlogArticleHeader } from "./articleHeader";

export type BlogArticleArgument = Markdown<PostFm>;

export const BlogArticle: HComponentFn<BlogArticleArgument> =
    (argument) =>
    (...child) => {
        return Article({})(
            BlogArticleHeader({
                title: H2({})(argument.data.title),
            })(
                Div({ class: "author" })(argument.data.author),
                DateTime({ datetime: argument.data.date })(),
                TagList({ slugs: argument.data.tag || [] })(),
                ShareX({ title: argument.data.title, url: `http://localhost/posts/${argument.slug}` })(),
            ),
            Div({ class: "article-text" })(...child),
        );
    };
