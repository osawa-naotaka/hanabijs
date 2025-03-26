import { Li, Section } from "@/main";
import type { HComponentFn } from "@/main";
import type { Markdown } from "@site/components/library/post";
import { Summary } from "@site/components/module/Summary";
import type { PostFm } from "@site/config/site.config";

export type SummariesArgument = {
    posts: Markdown<PostFm>[];
};

export const Summaries: HComponentFn<SummariesArgument> = (argument) => () =>
    Section({})(Li({ class: "summaries-list" })(...argument.posts.map((post) => Summary(post)())));
