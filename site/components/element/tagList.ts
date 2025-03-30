import { BOLD, FONT_SIZE, F_SMALL, PADDING, ROW, S_SMALL, S_TINY } from "@/lib/stylerules";
import { hLinkedButton } from "@/lib/ui/button";
import { element, registerComponent, styles } from "@/main";
import type { HComponentFn, Store } from "@/main";
import { tag_map } from "@site/config/site.config";

export type TagListArgument = {
    slugs: string[];
};

export function tagList(store: Store): HComponentFn<TagListArgument> {
    const TagList = element("tag-list", { tag: "ul" });
    const TagListItem = element("tag-list-item", { tag: "li" });
    const TagListItemLink = hLinkedButton(
        store,
        { type: "filled" },
        FONT_SIZE(F_SMALL(store)),
        BOLD,
        PADDING(S_TINY(store), S_SMALL(store)),
    );

    const component_styles = [styles(TagList, ROW("0.5rem"))];

    return registerComponent(
        store,
        TagList,
        component_styles,
        (argument) => () =>
            TagList({ class: argument.class })(
                ...argument.slugs.map((x) => TagListItem({})(TagListItemLink({ href: `/tags/${x}` })(tag_map[x] || x))),
            ),
    );
}
