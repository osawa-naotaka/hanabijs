import {
    ALIGN_NOMAL,
    BG_COLOR,
    BORDER_LEFT_THIC,
    BORDER_UNDERLINE,
    COLUMN,
    C_BG,
    FONT_SIZE,
    F_XLARGE,
    LIST_DECIMAL,
    LIST_DISC,
    MARGIN_BLOCK,
    MARGIN_INLINE,
    PADDING,
    PADDING_BLOCK,
    PADDING_INLINE,
    ROUND,
    S_2XLARGE,
    S_MEDIUM,
    S_SMALL,
    S_TINY,
    TEXT_COLOR,
    TEXT_JUSTIFY,
    TEXT_UNDERLINE,
} from "@/lib/stylerules";
import { A, H2, H3, H4, H5, Li, Ol, Pre, Ul, buttonStyles, component, element, registerComponent, style } from "@/main";
import type { HComponentFn, Store } from "@/main";
import type { PostFm } from "@site/config/site.config";
import { dateTime } from "../element/dateTime";
import { shareX } from "../element/shareX";
import { tag } from "../element/tag";
import type { Markdown } from "../library/post";
import { articleHeader } from "./articleHeader";

export type ArticleArgument = Markdown<PostFm>;

export function article(store: Store): HComponentFn<ArticleArgument> {
    const Article = element("article", { tag: "article" });
    const ArticleHeader = articleHeader(store);
    const Author = element("author");
    const Tag = tag();
    const DateTime = dateTime();
    const ArticleText = element("article-text");
    const ShareX = shareX();

    const component_styles = [
        style(Article, MARGIN_BLOCK(S_2XLARGE(store))),

        style([ArticleHeader, H2], FONT_SIZE(F_XLARGE(store))),
        ...buttonStyles(Tag, "filled", store, { padding: [S_TINY(store), S_SMALL(store)] }),
        ...buttonStyles(ShareX, "filled", store, { padding: [S_TINY(store), S_SMALL(store)] }),

        style(ArticleText, COLUMN(S_2XLARGE(store)), TEXT_JUSTIFY, ALIGN_NOMAL),
        style(
            [ArticleText, H3],
            FONT_SIZE(F_XLARGE(store)),
            ROUND("4px"),
            PADDING_INLINE(S_MEDIUM(store)),
            PADDING_BLOCK("3px"),
            TEXT_COLOR(C_BG(store)),
            BG_COLOR(store.designrule.color.main.text.light),
            MARGIN_BLOCK(S_MEDIUM(store)),
        ),
        style([ArticleText, H4], BORDER_UNDERLINE, MARGIN_BLOCK(S_MEDIUM(store))),
        style([ArticleText, H5], BORDER_LEFT_THIC),
        style([ArticleText, Ul], LIST_DISC),
        style([ArticleText, Ol], LIST_DECIMAL),
        style([ArticleText, A], TEXT_UNDERLINE),
        style([ArticleText, Li], MARGIN_INLINE(S_2XLARGE(store))),
        style([ArticleText, Pre], PADDING(S_MEDIUM(store))),
    ];

    registerComponent(store, Article, component_styles);

    return component(
        Article,
        ({ data, slug }) =>
            (...child) =>
                Article({})(
                    ArticleHeader({
                        title: H2({})(data.title),
                    })(
                        Author({})(data.author),
                        DateTime({ datetime: data.date })(),
                        ...(data.tag || []).map((x) => Tag({ slug: x })()),
                        ShareX({ title: data.title, url: `http://localhost/posts/${slug}` })(),
                    ),
                    ArticleText({})(...child),
                ),
    );
}
