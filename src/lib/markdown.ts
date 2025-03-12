import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkToc from "remark-toc";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { readFile } from "node:fs/promises";
import type { Value } from "vfile"

export async function markdownToHtml(markdown: string): Promise<Value> {
    return (await unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkFrontmatter)
            .use(remarkToc)
            .use(remarkRehype)
            .use(rehypeStringify)
            .process(markdown)).value;
}
