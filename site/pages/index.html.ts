import { semantic } from "@/main";
import type { HRootPageFn, Repository } from "@/main";
import { getAllMarkdowns } from "@site/components/library/post";
import { page } from "@site/components/pages/page";
import { hero } from "@site/components/sections/hero";
import { summaries } from "@site/components/sections/summaries";
import { navitem, site } from "@site/config/site.config";
import { postFmSchema, posts_dir } from "@site/config/site.config";

export default function Root(repo: Repository): HRootPageFn<void> {
    const Page = page(repo);
    const Hero = hero(repo);
    const PageMainArea = semantic("page-main-area", { class_names: ["container"], tag: "main" });
    const Summaries = summaries(repo);

    return async () => {
        const posts = await getAllMarkdowns(posts_dir, postFmSchema);
        const posts_sorted = posts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

        return Page({
            title: site.name,
            description: site.description,
            lang: site.lang,
            name: site.name,
            navitem: navitem,
        })(Hero({})(), PageMainArea({})(Summaries({ posts: posts_sorted })()));
    };
}
