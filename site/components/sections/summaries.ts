import { registerComponent, semantic, style } from "@/main";
import type { HComponentFn, SectionAttribute, Store, UlAttribute } from "@/main";
import type { PostFm } from "@site/config/site.config";
import type { Markdown } from "../library/post";
import { summary } from "../module/summary";

export type SummariesArgument = {
    posts: Markdown<PostFm>[];
};

export function summaries(store: Store): HComponentFn<SummariesArgument> {
    const Summaries = semantic<SectionAttribute>("summaries", { tag: "section", class_names: ["content"] });
    const SummariesList = semantic<UlAttribute>("summaries-list", { tag: "ul" });
    const Summary = summary(store);

    return registerComponent(store, Summaries, [style(Summaries, {})], (argument) => () => {
        return Summaries({ class: argument.class })(
            SummariesList({})(...argument.posts.map((post) => Summary(post)())),
        );
    });
}
