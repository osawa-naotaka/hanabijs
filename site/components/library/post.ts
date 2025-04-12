import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { globExt } from "@/server";
import { posts_dir } from "@site/config/site.config";
import matter from "gray-matter";
import * as v from "valibot";

export type Markdown<T> = {
    slug: string;
    data: T;
    content: string;
};

export async function getAllMarkdowns<T>(
    dir: string,
    schema: v.BaseSchema<unknown, T, v.BaseIssue<unknown>>,
): Promise<Markdown<T>[]> {
    return Promise.all(
        (await listFiles(dir, ".md")).map(async (slug) => {
            const { data, content } = matter(await readFile(path.join(cwd(), posts_dir, slug), "utf-8"));
            const data_parsed = v.parse(schema, data);
            return { slug: path.basename(slug, ".md"), data: data_parsed, content };
        }),
    );
}

export async function getMarkdown<T>(
    dir: string,
    slug: string,
    schema: v.BaseSchema<unknown, T, v.BaseIssue<unknown>>,
): Promise<Markdown<T>> {
    const markdown = await readFile(path.join(cwd(), dir, `${slug}.md`), "utf-8");
    const { data, content } = matter(markdown);
    const parsed_data = v.parse(schema, data);
    return { slug, data: parsed_data, content };
}

export async function listFiles(dir: string, ext: string): Promise<string[]> {
    return await globExt(path.join(cwd(), dir), ext);
}
