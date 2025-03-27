import { FONT_SIZE, MARGIN_BLOCK, SIZE_LG, SIZE_XL } from "@/lib/stylerules";
import { A, H2, compoundStyles, registerComponent, semantic, styles } from "@/main";
import type { HComponentFn, Repository } from "@/main";
import type { PostFm } from "@site/config/site.config";
import { dateTime } from "../element/dateTime";
import { tagList } from "../element/tagList";
import type { Markdown } from "../library/post";
import { articleHeader } from "./articleHeader";

export type SummaryArgument = Markdown<PostFm>;

export function summary(repo: Repository): HComponentFn<SummaryArgument> {
    const Summary = semantic("summary", { tag: "article", class_names: ["neu"] });
    const ArticleHeader = articleHeader(repo);
    const Author = semantic("author");
    const TagList = tagList(repo);
    const DateTime = dateTime(repo);

    const component_styles = [
        styles(Summary, MARGIN_BLOCK(SIZE_XL)),
        compoundStyles([Summary, " ", ArticleHeader, " ", H2], FONT_SIZE(SIZE_LG)),
    ];

    return registerComponent(
        repo,
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
