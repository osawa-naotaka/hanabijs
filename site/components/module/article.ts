import { H2, compoundStyle, registerComponent, semantic, style } from "@/main";
import type { HComponentFn, Repository } from "@/main";
import { appearence } from "@site/config/site.config";
import { dateTime } from "../element/dateTime";
import { shareX } from "../element/shareX";
import { tagList } from "../element/tagList";
import { articleHeader } from "./articleHeader";

export type ArticleArgument = {
    slug: string;
    data: {
        title: string;
        author: string;
        date: string | Date;
        principalTag: string[];
        associatedTags?: string[];
    };
};

export function article(repo: Repository): HComponentFn<ArticleArgument> {
    registerComponent(repo, "article", [
        style("&", { margin_block_end: "1.5rem" }),
        compoundStyle([".article-header", " ", "h2"], {
            font_size: "1.2rem",
        }),
        style(".article-text", {
            display: "flex",
            flex_direction: "column",
            gap: "1.5rem",
            overflow_wrap: "anywhere",
            text_align: "justify",
        }),
        compoundStyle([".article-text", " ", "h2"], {
            font_size: "1.2rem",
        }),
        compoundStyle([".article-text", " ", "h3"], {
            font_size: "1.2rem",
            background_color: appearence.color.header_background,
            padding_inline: "1rem",
            padding_block_start: "3px",
            border_radius: "4px",
            color: appearence.color.header_ext,
            margin_block_start: "1.5rem",
        }),
        compoundStyle([".article-text", " ", "h4"], {
            border_bottom: ["2px", "solid", appearence.color.header_background],
            margin_block_start: "1rem",
        }),
        compoundStyle([".article-text", " ", "a"], {
            text_decoration: ["underline", "2px"],
            text_underline_offset: "5px",
        }),
        compoundStyle([".article-text", " ", "li"], {
            margin_inline: "2rem",
        }),
        compoundStyle([".article-text", " ", "pre"], {
            padding: "1rem",
        }),
    ]);

    const Article = semantic("article", { tag: "article", class_names: ["neu"] });
    const ArticleHeader = articleHeader(repo);
    const Author = semantic("author");
    const TagList = tagList(repo);
    const DateTime = dateTime(repo);
    const ArticleText = semantic("article-text");
    const ShareX = shareX(repo);

    return (argument) =>
        (...child) =>
            Article({ class: argument.class })(
                ArticleHeader({
                    title: H2({})(argument.data.title),
                })(
                    Author({})(argument.data.author),
                    DateTime({ datetime: argument.data.date })(),
                    TagList({ slugs: argument.data.principalTag.concat(argument.data.associatedTags || []) })(),
                    ShareX({ title: argument.data.title, url: `http://localhost/posts/${argument.slug}` })(),
                ),
                ArticleText({})(...child),
            );
}
