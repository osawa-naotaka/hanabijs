import { FONT_SIZE, F_XLARGE, MARGIN_BLOCK, S_XLARGE } from "@/lib/stylerules";
import { A, H2, compoundStyles, element, registerComponent, styles } from "@/main";
import type { HComponentFn, Store } from "@/main";
import type { PostFm } from "@site/config/site.config";
import { dateTime } from "../element/dateTime";
import { tagList } from "../element/tagList";
import type { Markdown } from "../library/post";
import { articleHeader } from "./articleHeader";

export type SummaryArgument = Markdown<PostFm>;

export function summary(store: Store): HComponentFn<SummaryArgument> {
    const Summary = element("summary", { tag: "article", class_names: ["neu"] });
    const ArticleHeader = articleHeader(store);
    const Author = element("author");
    const TagList = tagList(store);
    const DateTime = dateTime(store);

    const component_styles = [
        styles(Summary, MARGIN_BLOCK(S_XLARGE(store))),
        compoundStyles([Summary, " ", ArticleHeader, " ", H2], FONT_SIZE(F_XLARGE(store))),
    ];

    return registerComponent(
        store,
        Summary,
        component_styles,
        (argument) => () =>
            Summary({ class: argument.class })(
                ArticleHeader({
                    title: A({ href: `/posts/${argument.slug}` })(H2({})(argument.data.title)),
                })(
                    Author({})(argument.data.author),
                    DateTime({ datetime: argument.data.date })(),
                    TagList({ slugs: argument.data.tag || [] })(),
                ),
            ),
    );
}
