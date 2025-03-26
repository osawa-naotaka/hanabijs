import { A, Li, Main, Ul } from "@/main";
import type { HRootPageFn } from "@/main";
import { getAllMarkdowns } from "@site/components/library/post";
import { Page } from "@site/components/pages/Page";
import { navitem, postFmSchema, posts_dir, site } from "@site/config/site.config";

export default function Root(): HRootPageFn<void> {
    return async () => {
        const posts = await getAllMarkdowns(posts_dir, postFmSchema);
        const posts_sorted = posts.sort((a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime());

        return Page({
            title: site.name,
            description: site.description,
            lang: site.lang,
            name: site.name,
            navitem: navitem,
        })(
            Main({})(
                Ul({ class: "article-list" })(
                    ...posts_sorted.map((x) => Li({})(A({ href: `/posts/${x.slug}` })(x.data.title))),
                ),
            ),
        );
    };
}
