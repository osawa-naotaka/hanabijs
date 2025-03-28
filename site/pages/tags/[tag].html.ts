import { A, Li, Ul, semantic } from "@/main";
import type { HRootPageFn, Repository } from "@/main";
import { getAllMarkdowns } from "@site/components/library/post";
import { page } from "@site/components/pages/page";
import { navitem, postFmSchema, posts_dir, site } from "@site/config/site.config";
import { tag_map } from "@site/config/site.config";

type RootParameter = {
    tag: string;
};

export function rootPageFnParameters(): RootParameter[] {
    return Object.keys(tag_map).map((x) => ({ tag: x }));
}

export default function Root(repo: Repository): HRootPageFn<RootParameter> {
    const Page = page(repo);
    const PageMainArea = semantic("page-main-area", { class_names: ["container"], tag: "main" });

    return async (parameter) => {
        const md = (await getAllMarkdowns(posts_dir, postFmSchema)).filter(
            (x) => x.data.principalTag.includes(parameter.tag) || x.data.associatedTags?.includes(parameter.tag),
        );

        return Page({
            title: `${parameter.tag || ""} | ${site.name}`,
            description: site.description,
            lang: site.lang,
            name: site.name,
            navitem: navitem,
        })(PageMainArea({})(Ul({})(...md.map((x) => Li({})(A({ href: `/posts/${x.slug}` })(x.data.title))))));
    };
}
