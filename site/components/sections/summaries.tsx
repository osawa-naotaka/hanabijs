import { summary } from "@site/components/module/summary";
import type { PostFm } from "@site/site.config";
import { component, element } from "zephblaze/core";
import type { HComponentFn, Markdown, Store } from "zephblaze/core";

export type SummariesArgument = {
    posts: Markdown<PostFm>[];
};

export function summaries(store: Store): HComponentFn<SummariesArgument> {
    const Summaries = element("summaries", { tag: "section" });
    const Summary = summary(store);

    return component(Summaries, ({ posts }) => (
        <Summaries>
            {posts.map((post) => (
                <Summary slug={post.slug} data={post.data} content={post.content} key={post.slug} />
            ))}
        </Summaries>
    ));
}
