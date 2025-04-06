import { FONT_SIZE, F_XLARGE, MARGIN_BLOCK, S_XLARGE } from "@/lib/stylerules";
import { H2, as, component, element, registerComponent, style } from "@/main";
import type { HComponentFn, Store, StyleRule } from "@/main";
import type { PostFm } from "@site/config/site.config";
import { TAG_DESIGN } from "@site/styles/design";
import { dateTime } from "../element/dateTime";
import { tag } from "../element/tag";
import type { Markdown } from "../library/post";
import { articleHeader } from "./articleHeader";
import { hlink } from "../element/hlink";

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

    return component(Summary)(
        ({ slug, data }) =>
            () =>
                Summary({})(
                    ArticleHeader({
                        title: HLink({ href: `/posts/${slug}` })(H2({})(data.title)),
                    })(
                        Author({})(data.author),
                        DateTime({ datetime: data.date })(),
                        ...(data.tag || []).map((s) => SummaryTag({ slug: s })()),
                    ),
                ),
    );
}
