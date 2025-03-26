import { A, Li, Ul } from "@/main";
import type { HComponentFn } from "@/main";
import { tag_map } from "@site/config/site.config";

export type TagListArgument = {
    slugs: string[];
};

export const TagList: HComponentFn<TagListArgument> = (argument) => () => {
    return Ul({ class: "tag-list" })(
        ...argument.slugs.map((x) =>
            A({ href: `/tags/${x}` })(Li({ class: ["tag-list-item", "chip"] })(tag_map[x] || x)),
        ),
    );
};
