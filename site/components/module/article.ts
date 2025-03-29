import {
    ALIGN_NOMAL,
    BG_COLOR,
    BORDER_UNDERLINE,
    COLUMN,
    C_BG,
    FONT_SIZE,
    F_XLARGE,
    MARGIN_BLOCK,
    MARGIN_INLINE,
    PADDING,
    PADDING_BLOCK,
    PADDING_INLINE,
    ROUND,
    S_2XLARGE,
    S_MEDIUM,
    TEXT_COLOR,
    TEXT_JUSTIFY,
    TEXT_UNDERLINE,
    toHex,
} from "@/lib/stylerules";
import { A, H2, H3, H4, Li, Pre, compoundStyles, element, registerComponent, styles } from "@/main";
import type { HComponentFn, Store } from "@/main";
import type { PostFm } from "@site/config/site.config";
import { dateTime } from "../element/dateTime";
import { shareX } from "../element/shareX";
import { tagList } from "../element/tagList";
import type { Markdown } from "../library/post";
import { articleHeader } from "./articleHeader";

export type ArticleArgument = Markdown<PostFm>;

export function article(store: Store): HComponentFn<ArticleArgument> {
    const Article = element("article", { tag: "article", class_names: ["neu"] });
    const ArticleHeader = articleHeader(store);
    const Author = element("author");
    const TagList = tagList(store);
    const DateTime = dateTime(store);
    const ArticleText = element("article-text");
    const ShareX = shareX(store);

    const component_styles = [
        styles(Article, MARGIN_BLOCK(S_2XLARGE(store))),
        compoundStyles([ArticleHeader, " ", H2], FONT_SIZE(F_XLARGE(store))),
        styles(ArticleText, COLUMN(S_2XLARGE(store)), TEXT_JUSTIFY, ALIGN_NOMAL),
        compoundStyles([ArticleText, " ", H2], FONT_SIZE(F_XLARGE(store))),
        compoundStyles(
            [ArticleText, " ", H3],
            FONT_SIZE(F_XLARGE(store)),
            ROUND("4px"),
            PADDING_INLINE(S_MEDIUM(store)),
            PADDING_BLOCK("3px"),
            TEXT_COLOR(C_BG(store)),
            BG_COLOR(toHex(store.designrule.color.main.text.light)),
            MARGIN_BLOCK(S_MEDIUM(store)),
        ),
        compoundStyles([ArticleText, " ", H4], BORDER_UNDERLINE, MARGIN_BLOCK(S_MEDIUM(store))),
        compoundStyles([ArticleText, " ", A], TEXT_UNDERLINE),
        compoundStyles([ArticleText, " ", Li], MARGIN_INLINE(S_2XLARGE(store))),
        compoundStyles([ArticleText, " ", Pre], PADDING(S_MEDIUM(store))),
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
