import { A, Li, Main, Ul } from "@/main";
import type { HRootPageFn } from "@/main";
import { getAllMarkdowns } from "@site/components/library/post";
import { Page } from "@site/components/pages/page";
import { navitem, postFmSchema, posts_dir, site } from "@site/config/site.config";
import { tag_map } from "@site/config/site.config";

type RootParameter = {
    tag: string;
};

export function rootPageFnParameters(): RootParameter[] {
    return Object.keys(tag_map).map((x) => ({ tag: x }));
}

export default function Root(): HRootPageFn<RootParameter> {
    return async (parameter) => {
        const md = (await getAllMarkdowns(posts_dir, postFmSchema)).filter((x) => x.data.tag?.includes(parameter.tag));

        return Page({
            title: `${parameter.tag || ""} | ${site.name}`,
            description: site.description,
            lang: site.lang,
            name: site.name,
            navitem: navitem,
        })(Main({})(Ul({})(...md.map((x) => Li({})(A({ href: `/posts/${x.slug}` })(x.data.title))))));
    };
}
