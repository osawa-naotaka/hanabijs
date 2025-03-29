import { BG_COLOR, BOLD, C_BG, C_TEXT, PADDING_INLINE, ROUND, ROW, TEXT_COLOR } from "@/lib/stylerules";
import { A, element, registerComponent, styles } from "@/main";
import type { HComponentFn, Store } from "@/main";
import { tag_map } from "@site/config/site.config";

export type TagListArgument = {
    slugs: string[];
};

export function tagList(store: Store): HComponentFn<TagListArgument> {
    const TagList = element("tag-list", { tag: "ul" });
    const TagListItem = element("tag-list-item", { tag: "li" });

    const component_styles = [
        styles(TagList, ROW("0.5rem")),
        styles(
            TagListItem,
            TEXT_COLOR(C_BG(store)),
            BG_COLOR(C_TEXT(store)),
            BOLD,
            PADDING_INLINE("0.5rem"),
            ROUND("4px"),
        ),
    ];

    return registerComponent(
        store,
        TagList,
        component_styles,
        (argument) => () =>
            TagList({ class: argument.class })(
                ...argument.slugs.map((x) => A({ href: `/tags/${x}` })(TagListItem({})(tag_map[x] || x))),
            ),
    );
}
