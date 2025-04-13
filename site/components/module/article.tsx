import { dateTime } from "@site/components/element/dateTime";
import { shareX } from "@site/components/element/shareX";
import { tag } from "@site/components/element/tag";
import { articleHeader } from "@site/components/module/articleHeader";
import type { PostFm } from "@site/site.config";
import { TAG_DESIGN } from "@site/styles/design";
import {
    ALIGN_NOMAL,
    BG_COLOR,
    BORDER_LEFT_THIC,
    BORDER_UNDERLINE,
    B_LIGHTER,
    COLUMN,
    C_BG,
    C_TEXT,
    FONT_SIZE,
    F_2XLARGE,
    F_XLARGE,
    HEIGHT,
    LIST_DECIMAL,
    LIST_DISC,
    Link,
    MARGIN_BLOCK,
    MARGIN_INLINE,
    MIX_WHITE,
    PADDING_BLOCK,
    PADDING_INLINE,
    ROUND,
    S_2XLARGE,
    S_MEDIUM,
    TEXT_COLOR,
    TEXT_JUSTIFY,
    TEXT_UNDERLINE,
} from "hanabijs/core";
import {
    A,
    H2,
    H3,
    H4,
    H5,
    Li,
    Ol,
    P,
    Script,
    Ul,
    as,
    component,
    element,
    registerComponent,
    style,
} from "hanabijs/core";
import type { HComponentFn, Markdown, Store } from "hanabijs/core";

export type ArticleArgument = Markdown<PostFm>;

export function article(store: Store): HComponentFn<ArticleArgument> {
    const Article = element("article", { tag: "article" });
    const ArticleHeader = articleHeader(store);
    const Author = element("author");
    const ArticleTag = as("article-tag", tag());
    const DateTime = dateTime();
    const ArticleText = element("article-text");
    const ShareX = shareX(store);

    const component_styles = [
        style(Article)(MARGIN_BLOCK(S_2XLARGE(store))),

        style(ArticleHeader, H2)(FONT_SIZE(F_XLARGE(store))),
        TAG_DESIGN(store, "text", ArticleTag),
        TAG_DESIGN(store, "text", ShareX),
        style(Article, ShareX)(HEIGHT(F_2XLARGE(store))),

        style(ArticleText)(COLUMN("0"), TEXT_JUSTIFY, ALIGN_NOMAL),
        style(ArticleText, H3)(
            FONT_SIZE(F_XLARGE(store)),
            ROUND("4px"),
            PADDING_INLINE(S_MEDIUM(store)),
            PADDING_BLOCK("3px"),
            MARGIN_BLOCK(S_2XLARGE(store), S_MEDIUM(store)),
            TEXT_COLOR(C_BG(store)),
            BG_COLOR(MIX_WHITE(C_TEXT(store))(B_LIGHTER(store))),
        ),
        style(ArticleText, P)(MARGIN_BLOCK("0", S_2XLARGE(store)), {
            text_indent: S_MEDIUM(store),
        }),
        style(ArticleText, H4)(BORDER_UNDERLINE, MARGIN_BLOCK(S_MEDIUM(store))),
        style(ArticleText, H5)(BORDER_LEFT_THIC),
        style(ArticleText, Ul)(LIST_DISC),
        style(ArticleText, Ol)(LIST_DECIMAL),
        style(ArticleText, A)(TEXT_UNDERLINE),
        style(ArticleText, Li)(MARGIN_INLINE(S_2XLARGE(store))),
    ];

    const prism_cdn = "https://cdn.jsdelivr.net/npm/prismjs@1.30.0";
    const prism_theme: string = "tomorrow";
    const css_filename = `prism${prism_theme === "" ? "" : `-${prism_theme}`}.min.css`;
    registerComponent(store, Article, component_styles, {
        inserts: [
            {
                selector: ["head"],
                nodes: [
                    Link({ href: `${prism_cdn}/themes/${css_filename}`, rel: "stylesheet" }),
                    Script({ src: `${prism_cdn}/components/prism-core.min.js` }),
                    Script({ src: `${prism_cdn}/plugins/autoloader/prism-autoloader.min.js` }),
                ],
            },
        ],
    });

    return component(Article, ({ data, slug }, ...child) => (
        <Article>
            <ArticleHeader title={<h2>{data.title}</h2>}>
                <Author>{data.author}</Author>
                <DateTime datetime={data.date} />
                {(data.tag || []).map((x) => (
                    <ArticleTag slug={x} key={x} />
                ))}
                <ShareX title={data.title} url={`http://localhost/posts/${slug}`} />
            </ArticleHeader>
            <ArticleText>{child}</ArticleText>
        </Article>
    ));
}
