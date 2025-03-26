import { A, Article, Div, H2 } from "@/main";
import type { HComponentFn } from "@/main";
import { DateTime } from "@site/components/element/DateTime";
import { TagList } from "@site/components/element/TagList";
import type { Markdown } from "@site/components/library/post";
import { BlogArticleHeader } from "@site/components/module/BlogArticleHeader";
import type { PostFm } from "@site/config/site.config";

export type SummaryArgument = Markdown<PostFm>;

export const Summary: HComponentFn<SummaryArgument> = (argument) => () =>
    Article({})(
        BlogArticleHeader({
            title: A({ href: `/posts/${argument.slug}` })(H2({})(argument.data.title)),
        })(
            Div({})(argument.data.author),
            DateTime({ datetime: argument.data.date })(),
            TagList({ slugs: argument.data.tag || [] })(),
        ),
    );
