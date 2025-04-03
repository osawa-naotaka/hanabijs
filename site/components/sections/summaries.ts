import { DEFAULT_RESPONSIVE_PAGE_WIDTH } from "@/lib/stylerules";
import { element, registerComponent, style } from "@/main";
import type { HComponentFn, Store } from "@/main";
import type { PostFm } from "@site/config/site.config";
import type { Markdown } from "../library/post";
import { summary } from "../module/summary";

export type SummariesArgument = {
    posts: Markdown<PostFm>[];
};

export function summaries(store: Store): HComponentFn<SummariesArgument> {
    const Summaries = element("summaries", { tag: "section" });
    const SummariesList = element("summaries-list", { tag: "ul" });
    const Summary = summary(store);
    const styles = [style(Summaries, DEFAULT_RESPONSIVE_PAGE_WIDTH(store))];

    return registerComponent(store, Summaries, styles, (argument) => () => {
        return Summaries({ class: argument.class })(
            SummariesList({})(...argument.posts.map((post) => Summary(post)())),
        );
    });
}
