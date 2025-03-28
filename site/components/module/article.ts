import {
    ALIGN_NOMAL,
    BORDER_UNDERLINE,
    COLOR_HEADER,
    COLUMN,
    FONT_SIZE,
    MARGIN_BLOCK,
    MARGIN_INLINE,
    PADDING,
    PADDING_BLOCK,
    PADDING_INLINE,
    ROUND,
    SIZE_2XL,
    SIZE_BASE,
    SIZE_XL,
    TEXT_JUSTIFY,
    TEXT_UNDERLINE,
} from "@/lib/stylerules";
import { A, H2, H3, H4, Li, Pre, compoundStyles, registerComponent, semantic, styles } from "@/main";
import type { HComponentFn, Store } from "@/main";
import type { PostFm } from "@site/config/site.config";
import { dateTime } from "../element/dateTime";
import { shareX } from "../element/shareX";
import { tagList } from "../element/tagList";
import type { Markdown } from "../library/post";
import { articleHeader } from "./articleHeader";

export type ArticleArgument = Markdown<PostFm>;

export function article(store: Store): HComponentFn<ArticleArgument> {
    const Article = semantic("article", { tag: "article", class_names: ["neu"] });
    const ArticleHeader = articleHeader(store);
    const Author = semantic("author");
    const TagList = tagList(store);
    const DateTime = dateTime(store);
    const ArticleText = semantic("article-text");
    const ShareX = shareX(store);

    const component_styles = [
        styles(Article, MARGIN_BLOCK(SIZE_2XL)),
        compoundStyles([ArticleHeader, " ", H2], FONT_SIZE(SIZE_XL)),
        styles(ArticleText, COLUMN(SIZE_2XL), TEXT_JUSTIFY, ALIGN_NOMAL),
        compoundStyles([ArticleText, " ", H2], FONT_SIZE(SIZE_XL)),
        compoundStyles(
            [ArticleText, " ", H3],
            FONT_SIZE(SIZE_XL),
            ROUND("4px"),
            PADDING_INLINE(SIZE_BASE),
            PADDING_BLOCK("3px"),
            COLOR_HEADER,
            MARGIN_BLOCK(SIZE_2XL),
        ),
        compoundStyles([ArticleText, " ", H4], BORDER_UNDERLINE, MARGIN_BLOCK(SIZE_BASE)),
        compoundStyles([ArticleText, " ", A], TEXT_UNDERLINE),
        compoundStyles([ArticleText, " ", Li], MARGIN_INLINE(SIZE_2XL)),
        compoundStyles([ArticleText, " ", Pre], PADDING(SIZE_BASE)),
    ];

    return registerComponent(
        store,
        Article,
        component_styles,
        (argument) =>
            (...child) =>
                Article({ class: argument.class })(
                    ArticleHeader({
                        title: H2({})(argument.data.title),
                    })(
                        Author({})(argument.data.author),
                        DateTime({ datetime: argument.data.date })(),
                        TagList({ slugs: argument.data.tag || [] })(),
                        ShareX({ title: argument.data.title, url: `http://localhost/posts/${argument.slug}` })(),
                    ),
                    ArticleText({})(...child),
                ),
    );
}
