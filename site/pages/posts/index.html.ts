import { A, semantic } from "@/main";
import type { HRootPageFn, LiAttribute, MainAttribute, Store, UlAttribute } from "@/main";
import { getAllMarkdowns } from "@site/components/library/post";
import { page } from "@site/components/pages/page";
import { navitem, postFmSchema, posts_dir, site } from "@site/config/site.config";

export default function Root(store: Store): HRootPageFn<void> {
    const Page = page(store);
    const PageMainArea = semantic<MainAttribute>("page-main-area", { class_names: ["container"], tag: "main" });
    const ArticleList = semantic<UlAttribute>("article-list", { class_names: ["content"], tag: "ul" });
    const ArticleListItem = semantic<LiAttribute>("article-list-item", { tag: "li" });

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
            PageMainArea({})(
                ArticleList({})(
                    ...posts_sorted.map((x) => ArticleListItem({})(A({ href: `/posts/${x.slug}` })(x.data.title))),
                ),
            ),
        );
    };
}
