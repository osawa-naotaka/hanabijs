import { FONT_SIZE, F_XLARGE, MARGIN_BLOCK, S_XLARGE } from "@/lib/stylerules";
import { H2, as, component, element, registerComponent, style } from "@/main";
import type { HComponentFn, Store, StyleRule } from "@/main";
import type { PostFm } from "@site/config/site.config";
import { TAG_DESIGN } from "@site/styles/design";
import { dateTime } from "../element/dateTime";
import { hlink } from "../element/hlink";
import { tag } from "../element/tag";
import type { Markdown } from "../library/post";
import { articleHeader } from "./articleHeader";

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

    return component(Summary)(({ slug, data }) => () => (
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
