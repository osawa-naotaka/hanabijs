import { A, H2, compoundStyle, registerComponent, semantic, style } from "@/main";
import type { HComponentFn, Repository } from "@/main";
import { dateTime } from "../element/dateTime";
import { tagList } from "../element/tagList";
import { articleHeader } from "./articleHeader";

export type SumamryArgument = {
    slug: string;
    data: {
        title: string;
        author: string;
        date: string | Date;
        principalTag: string[];
        associatedTags?: string[];
    };
};

export function summary(repo: Repository): HComponentFn<SumamryArgument> {
    registerComponent(repo, "summary", [
        style("&", { margin_block_end: "1.5rem" }),
        compoundStyle(["&", " ", ".article-header", " ", "h2"], {
            font_size: "1.2rem",
        }),
    ]);

    const Article = semantic("summary", { tag: "article", class_names: ["neu"] });
    const ArticleHeader = articleHeader(repo);
    const Author = semantic("author");
    const TagList = tagList(repo);
    const DateTime = dateTime(repo);

    return (argument) => () =>
        Article({ class: argument.class })(
            ArticleHeader({
                title: A({ href: `/posts/${argument.slug}` })(H2({})(argument.data.title)),
            })(
                Author({})(argument.data.author),
                DateTime({ datetime: argument.data.date })(),
                TagList({ slugs: argument.data.principalTag.concat(argument.data.associatedTags || []) })(),
            ),
        );
}
