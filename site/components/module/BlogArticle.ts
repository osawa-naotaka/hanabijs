import { Article, Div, H2 } from "@/main";
import type { HComponentFn } from "@/main";
import type { PostFm } from "@site/config/site.config";
import { DateTime } from "../element/DateTime";
import { ShareX } from "../element/ShareX";
import { TagList } from "../element/TagList";
import type { Markdown } from "../library/post";
import { BlogArticleHeader } from "./BlogArticleHeader";

export type BlogArticleArgument = Markdown<PostFm>;

export const BlogArticle: HComponentFn<BlogArticleArgument> =
    (argument) =>
    (...child) =>
        Article({})(
            BlogArticleHeader({
                title: H2({})(argument.data.title),
            })(
                Div({})(argument.data.author),
                DateTime({ datetime: argument.data.date })(),
                TagList({ slugs: argument.data.tag || [] })(),
                ShareX({ title: argument.data.title, url: `http://localhost/posts/${argument.slug}` })(),
            ),
            Div({})(...child),
        );
