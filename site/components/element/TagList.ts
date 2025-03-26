import { A, Unwrap } from "@/main";
import type { HComponentFn } from "@/main";
import { tag_map } from "@site/config/site.config";

export type TagListArgument = {
    slugs: string[];
};

export const TagList: HComponentFn<TagListArgument> = (argument) => () =>
    Unwrap({})(...argument.slugs.map((x) => A({ href: `/tags/${x}`, class: "chip" })(tag_map[x] || x)));
