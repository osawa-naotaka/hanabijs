import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkToc from "remark-toc";
import { unified } from "unified";

export async function markdownToHtml(markdown: string): Promise<string> {
    return (
        await unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkFrontmatter)
            .use(remarkToc)
            .use(remarkRehype)
            .use(rehypeStringify)
            .process(markdown)
    ).value.toString();
}
