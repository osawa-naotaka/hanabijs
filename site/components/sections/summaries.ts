import { registerComponent, semantic, style } from "@/main";
import type { HComponentFn, Repository } from "@/main";
import type { PostFm } from "@site/config/site.config";
import type { Markdown } from "../library/post";
import { summary } from "../module/summary";

export type SummariesArgument = {
    posts: Markdown<PostFm>[];
};

export function summaries(repo: Repository): HComponentFn<SummariesArgument> {
    registerComponent(repo, "summaries", [style("&", {})]);

    const Summaries = semantic("summaries", { tag: "section", class_names: ["content"] });
    const SummariesList = semantic("summaries-list", { tag: "ul" });
    const Summary = summary(repo);

    return (argument) => () => {
        return Summaries({ class: argument.class })(SummariesList({})(...argument.posts.map((x) => Summary(x)())));
    };
}
