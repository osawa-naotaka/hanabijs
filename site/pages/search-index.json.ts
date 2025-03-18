import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { globExt } from "@/main";
import { posts_dir } from "@site/config/site.config";
import matter from "gray-matter";
import { LinearIndex, StaticSeekError, createIndex, indexToObject } from "staticseek";
import * as v from "valibot";

export default async function createSearchIndex(): Promise<string> {
    const schema = v.object({
        data: v.object({
            title: v.string(),
        }),
        content: v.string(),
    });

    type PostType = v.InferInput<typeof schema>;
    const posts: PostType[] = [];

    const files = globExt(posts_dir, ".md");
    for await (const file of files) {
        posts.push(v.parse(schema, matter(await readFile(path.join(cwd(), posts_dir, file)))));
    }
    const index = createIndex(LinearIndex, posts, { key_fields: ["data.title"] });
    if (index instanceof StaticSeekError) throw index;
    return JSON.stringify(indexToObject(index));
}
