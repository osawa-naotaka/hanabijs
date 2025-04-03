import { component, element } from "@/main";
import type { HComponentFn } from "@/main";
import { tag_map } from "@site/config/site.config";

export type TagArgument = {
    slug: string;
};

export function tag(): HComponentFn<TagArgument> {
    const Tag = element("tag", { tag: "a" });

    return component(
        Tag,
        ({ slug }) =>
            () =>
                Tag({ href: `/tags/${slug}` })(tag_map[slug] || slug),
    );
}
