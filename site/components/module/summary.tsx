import { H2, as, component, element, registerComponent, style } from "@/core";
import type { HComponentFn, Store, StyleRule } from "@/core";
import { FONT_SIZE, F_XLARGE, MARGIN_BLOCK, S_XLARGE } from "@/core";
import { dateTime } from "@site/components/element/dateTime";
import { hlink } from "@site/components/element/hlink";
import { tag } from "@site/components/element/tag";
import type { Markdown } from "@site/components/library/post";
import { articleHeader } from "@site/components/module/articleHeader";
import type { PostFm } from "@site/config/site.config";
import { TAG_DESIGN } from "@site/styles/design";

export type SummaryArgument = Markdown<PostFm>;

export function summary(store: Store): HComponentFn<SummaryArgument> {
    const Summary = element("summary", { tag: "article" });
    const ArticleHeader = articleHeader(store);
    const Author = element("author");
    const SummaryTag = as("summary-tag", tag());
    const DateTime = dateTime();
    const HLink = hlink(store);

    const component_styles: (StyleRule | StyleRule[])[] = [
        style(Summary)(MARGIN_BLOCK(S_XLARGE(store))),
        style(Summary, ArticleHeader, H2)(FONT_SIZE(F_XLARGE(store))),
        TAG_DESIGN(store, "text", SummaryTag),
    ];

    registerComponent(store, Summary, component_styles);

    return component(Summary, ({ slug, data }) => (
        <Summary>
            <ArticleHeader
                title={
                    <HLink href={`/posts/${slug}`}>
                        <h2>{data.title}</h2>
                    </HLink>
                }
            >
                <Author>{data.author}</Author>
                <DateTime datetime={data.date} />
                {(data.tag || []).map((x) => (
                    <SummaryTag slug={x} key={x} />
                ))}
            </ArticleHeader>
        </Summary>
    ));
}
