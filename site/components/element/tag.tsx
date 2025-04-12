import { component, element } from "@/core";
import type { HComponentFn } from "@/core";
import { tag_map } from "@site/site.config";

export type TagArgument = {
    slug: string;
};

export function tag(): HComponentFn<TagArgument> {
    const Tag = element("tag", { tag: "a" });

    return component(Tag, ({ slug }) => <Tag href={`/tags/${slug}`}>{tag_map[slug] || slug}</Tag>);
}
