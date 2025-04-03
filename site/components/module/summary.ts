import { FONT_SIZE, F_XLARGE, MARGIN_BLOCK, S_SMALL, S_TINY, S_XLARGE } from "@/lib/stylerules";
import { A, H2, buttonStyles, component, element, registerComponent, style } from "@/main";
import type { HComponentFn, Store } from "@/main";
import type { PostFm } from "@site/config/site.config";
import { dateTime } from "../element/dateTime";
import { tag } from "../element/tag";
import type { Markdown } from "../library/post";
import { articleHeader } from "./articleHeader";

export type SummaryArgument = Markdown<PostFm>;

export function summary(store: Store): HComponentFn<SummaryArgument> {
    const Summary = element("summary", { tag: "article" });
    const ArticleHeader = articleHeader(store);
    const Author = element("author");
    const Tag = tag();
    const DateTime = dateTime();

    const component_styles = [
        style(Summary, MARGIN_BLOCK(S_XLARGE(store))),
        style([Summary, ArticleHeader, H2], FONT_SIZE(F_XLARGE(store))),
        ...buttonStyles(Tag, "filled", store, { padding: [S_TINY(store), S_SMALL(store)] }),
    ];

    registerComponent(store, Summary, component_styles);

    return component(
        Summary,
        ({ slug, data }) =>
            () =>
                Summary({})(
                    ArticleHeader({
                        title: A({ href: `/posts/${slug}` })(H2({})(data.title)),
                    })(
                        Author({})(data.author),
                        DateTime({ datetime: data.date })(),
                        ...(data.tag || []).map((s) => Tag({ slug: s })()),
                    ),
                ),
    );
}
