import { Li, Section, Ul } from "@/main";
import type { HComponentFn } from "@/main";
import type { Markdown } from "@site/components/library/post";
import { Summary } from "@site/components/module/Summary";
import type { PostFm } from "@site/config/site.config";

export type SummariesArgument = {
    posts: Markdown<PostFm>[];
};

export const Summaries: HComponentFn<SummariesArgument> = (argument) => () =>
    Section({})(Ul({})(...argument.posts.map((post) => Li({})(Summary(post)()))));
