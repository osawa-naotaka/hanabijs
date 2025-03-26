import { Main } from "@/main";
import type { HRootPageFn } from "@/main";
import { getAllMarkdowns } from "@site/components/library/post";
import { Page } from "@site/components/pages/page";
import { Hero } from "@site/components/sections/hero";
import { Summaries } from "@site/components/sections/summaries";
import { navitem, site } from "@site/config/site.config";
import { postFmSchema, posts_dir } from "@site/config/site.config";

export default function Root(): HRootPageFn<void> {
    return async () => {
        const posts = await getAllMarkdowns(posts_dir, postFmSchema);
        const posts_sorted = posts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

        return Page({
            title: site.name,
            description: site.description,
            lang: site.lang,
            name: site.name,
            navitem: navitem,
        })(Hero({})(), Main({})(Summaries({ posts: posts_sorted })()));
    };
}
