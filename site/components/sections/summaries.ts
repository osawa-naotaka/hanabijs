import { component, element } from "@/main";
import type { HComponentFn, Store } from "@/main";
import type { PostFm } from "@site/config/site.config";
import type { Markdown } from "../library/post";
import { summary } from "../module/summary";

export type SummariesArgument = {
    posts: Markdown<PostFm>[];
};

export function summaries(store: Store): HComponentFn<SummariesArgument> {
    const Summaries = element("summaries", { tag: "section" });
    const Summary = summary(store);

    return component(Summaries)(
        ({ posts }) =>
            () =>
                Summaries({})(...posts.map((post) => Summary(post)())),
    );
}
