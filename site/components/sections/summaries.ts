import { globExt, registerComponent, semantic, style } from "@/main";
import type { HAsyncComponentFn, Repository } from "@/main";
import { posts_dir } from "@site/config/site.config";
import { readFile } from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { cwd } from "process";
import { summary } from "../module/summary";
import * as v from "valibot";

export function summaries(repo: Repository): HAsyncComponentFn<{}> {
    registerComponent(repo, "summaries", [
        style("&", {
        }),
    ]);

    const frontmatterSchema = v.object({
        title: v.string(),
        author: v.string(),
        date: v.date(),
        principalTag: v.array(v.string()),
        associatedTags: v.optional(v.array(v.string())),
    });

    const Summaries = semantic("summaries", { tag: "section", class_names: ["content"] });
    const SummariesList = semantic("summaries-list", { tag: "ul" });
    const Summary = summary(repo);

    return (argument) =>
        async () => {
            const fm = await Promise.all((await Array.fromAsync(globExt(path.join(cwd(), posts_dir), ".md")))
            .map(async (slug) => {
                const { data } = matter(await readFile(path.join(cwd(), posts_dir, slug), "utf-8"));
                const fm = v.parse(frontmatterSchema, data);
                return { slug: path.basename(slug, ".md"), data: fm };
            }));

            const fm_sorted = fm.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

            return Summaries({ class: argument.class })(
                SummariesList({})(
                    ...fm_sorted.map((x) => Summary(x)())
                )
            );
        }
}
