import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { globExt } from "@/main";
import { posts_dir } from "@site/config/site.config";
import matter from "gray-matter";
import { LinearIndex, StaticSeekError, createIndex, indexToObject } from "staticseek";
import * as v from "valibot";

export default async function createSearchIndex(): Promise<string> {
    const frontmatterSchema = v.object({
        title: v.string(),
        author: v.string(),
        date: v.date(),
        principalTag: v.array(v.string()),
        associatedTags: v.optional(v.array(v.string())),
    });
    const markdownSchema = v.object({
        id: v.string(),
        data: frontmatterSchema,
        content: v.string(),
    });

    type PostType = v.InferInput<typeof markdownSchema>;
    const posts: PostType[] = [];

    const files = globExt(posts_dir, ".md");
    for await (const file of files) {
        const { data, content } = matter(await readFile(path.join(cwd(), posts_dir, file)));
        const frontmatter = v.parse(frontmatterSchema, data);
        posts.push({ id: path.basename(file, ".md"), data: frontmatter, content });
    }

    const index = createIndex(LinearIndex, posts, { key_fields: ["id", "data"], search_targets: ["data.title", "content"] });
    if (index instanceof StaticSeekError) throw index;
    return JSON.stringify(indexToObject(index));
}
