import { element, registerComponent } from "@/main";
import type { HComponentFn, Store } from "@/main";
import { tag_map } from "@site/config/site.config";

export type TagArgument = {
    slug: string;
};

export function tag(store: Store): HComponentFn<TagArgument> {
    const Tag = element("tag", { tag: "a" });

    return registerComponent(
        store,
        Tag,
        [],
        (argument) => () => Tag({ href: `/tags/${argument.slug}` })(tag_map[argument.slug] || argument.slug),
    );
}
