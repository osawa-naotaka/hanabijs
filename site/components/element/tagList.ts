import { A, registerComponent, semantic, style } from "@/main";
import type { HComponentFn, Repository } from "@/main";
import { appearence, tag_map } from "@site/config/site.config";

export type TagListArgument = {
    slugs: string[];
};

export function tagList(repo: Repository): HComponentFn<TagListArgument> {
    const TagList = semantic("tag-list", { tag: "ul" });
    const TagListItem = semantic("tag-list-item", { tag: "li" });

    const styles = [
        style(TagList, {
            display: "flex",
            align_items: "center",
            gap: "0.5rem",
            list_style_type: "none",
        }),
        style(TagListItem, {
            background_color: appearence.color.header_background,
            color: appearence.color.header_ext,
            font_weight: "bold",
            padding_inline: "0.5rem",
            border_radius: "4px",
        }),
    ];

    return registerComponent(
        repo,
        TagList,
        styles,
        (argument) => () =>
            TagList({ class: argument.class })(
                ...argument.slugs.map((x) => A({ href: `/tags/${x}` })(TagListItem({})(tag_map[x] || x))),
            ),
    );
}
