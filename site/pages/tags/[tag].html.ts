import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { A, Li, Ul, globExt, semantic } from "@/main";
import type { HRootPageFn, Repository } from "@/main";
import { page } from "@site/components/pages/page";
import { navitem, posts_dir, site } from "@site/config/site.config";
import matter from "gray-matter";
import * as v from "valibot";

type RootParameter = {
    tag: string;
};

export async function rootPageFnParameters(): Promise<RootParameter[]> {
    return [{ tag: "techarticle" }, { tag: "typescript" }];
}

export default function Root(repo: Repository): HRootPageFn<RootParameter> {
    const Page = page(repo);
    const PageMainArea = semantic("page-main-area", { class_names: ["container"], tag: "main" });

    const frontmatterSchema = v.object({
        title: v.string(),
        author: v.string(),
        date: v.date(),
        principalTag: v.array(v.string()),
        associatedTags: v.optional(v.array(v.string())),
    });

    return async (parameter) => {
        const files = globExt(path.join(cwd(), posts_dir), ".md");
        const result: { slug: string; title: string }[] = [];
        for await (const file of files) {
            const markdown = await readFile(path.join(cwd(), posts_dir, file), "utf-8");
            const { data } = matter(markdown);
            const frontmatter = v.parse(frontmatterSchema, data);
            if (
                frontmatter.principalTag.includes(parameter.tag) ||
                frontmatter.associatedTags?.includes(parameter.tag)
            ) {
                result.push({ slug: path.basename(file, ".md"), title: data.title });
            }
        }

        return Page({
            title: `${parameter.tag || ""} | ${site.name}`,
            description: site.description,
            lang: site.lang,
            name: site.name,
            navitem: navitem,
        })(PageMainArea({})(Ul({})(...result.map((x) => Li({})(A({ href: `/posts/${x.slug}` })(x.title))))));
    };
}
