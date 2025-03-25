import { A, H2, compoundStyle, registerComponent, semantic, style } from "@/main";
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

    const styles = [
        style(Summary, { margin_block_end: "1.5rem" }),
        compoundStyle([Summary, " ", ArticleHeader, " ", "h2"], {
            font_size: "1.2rem",
        }),
    ];

    return registerComponent(
        repo,
        Summary,
        styles,
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
