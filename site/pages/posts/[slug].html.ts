import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { markdownToHtml } from "@/lib/markdown";
import { RawHTML, globExt, registerComponent, semantic, style } from "@/main";
import type { HRootPageFn, Repository } from "@/main";
import { article } from "@site/components/module/article";
import { page } from "@site/components/pages/page";
import { navitem, posts_dir, site } from "@site/config/site.config";
import { appearence } from "@site/config/site.config";
import matter from "gray-matter";
import * as v from "valibot";

type RootParameter = {
    slug: string;
};

export async function rootPageFnParameters(): Promise<RootParameter[]> {
    const items = globExt(path.join(cwd(), posts_dir), ".md");
    return (await Array.fromAsync(items)).map((x) => ({ slug: path.basename(x, ".md") }));
}

export default function Root(repo: Repository): HRootPageFn<RootParameter> {
    registerComponent(repo, "root", [
        style("page-main-area", {
            margin_block_end: appearence.layout.space_block_large,
        }),
    ]);

    const Page = page(repo);
    const PageMainArea = semantic("page-main-area", { class_names: ["container"], tag: "main" });
    const PageSection = semantic("page-section", { class_names: ["section", "content"], tag: "section" });
    const Article = article(repo);

    const frontmatterSchema = v.object({
        title: v.string(),
        author: v.string(),
        date: v.date(),
        principalTag: v.array(v.string()),
        associatedTags: v.optional(v.array(v.string())),
    });

    return async (argument) => {
        const markdown = await readFile(path.join(cwd(), posts_dir, `${argument.slug}.md`), "utf-8");
        const { data, content } = matter(markdown);
        const arg = {
            slug: argument.slug,
            data: v.parse(frontmatterSchema, data),
        }

        const raw_html = await markdownToHtml(content);
        return Page({
            title: `${data.title || ""} | ${site.name}`,
            description: site.description,
            lang: site.lang,
            name: site.name,
            navitem: navitem,
        })(PageMainArea({})(PageSection({})(Article(arg)(RawHTML({})(raw_html)))));
    };
}
