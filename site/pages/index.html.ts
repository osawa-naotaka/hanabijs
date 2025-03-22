import { semantic } from "@/main";
import type { HRootPageFn, Repository } from "@/main";
import { page } from "@site/components/pages/page";
import { hero } from "@site/components/sections/hero";
import { navitem, site } from "@site/config/site.config";
import { summaries } from "@site/components/sections/summaries";

export default function Root(repo: Repository): HRootPageFn<void> {
    const Page = page(repo);
    const Hero = hero(repo);
    const PageMainArea = semantic("page-main-area", { class_names: ["container"], tag: "main" });
    const Summaries = summaries(repo);

    return async () => {
        return Page({
            title: site.name,
            description: site.description,
            lang: site.lang,
            name: site.name,
            navitem: navitem,
        })(
            Hero({})(),
            PageMainArea({})(
                await Summaries({})(),
            ),
        );
    };
}
