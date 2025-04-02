import * as v from "valibot";

export const site = {
    lang: "ja",
    name: "lulliecat",
    description: "lulliecatは皆さまの新しい歩みを支えます",
};

export const navitem: { name: string; url: string; icon: string }[] = [
    { name: "github", url: "https://github.com/osawa-naotaka/", icon: "github" },
    { name: "x", url: "https://x.com/lulliecat", icon: "x" },
    { name: "youtube", url: "https://www.youtube.com/channel/UCUzbZRjQJSZtH715CR2OIXw", icon: "youtube" },
];

export const appearence = {
    color: {
        main: "#303030",
        background: "#f0f0f0",
        header_background: "#615c66",
        header_ext: "#ffffff",
        accent: "#d7003a",
    },
    layout: {
        content_width: "740px",
        content_padding: "1rem",
        space_block_large: "4rem",
    },
};

export const posts_dir = "site/contents/posts/";

export const tag_map: Record<string, string> = {
    techarticle: "Technology",
    staticseek: "staticseek",
};

export const postFmSchema = v.object({
    title: v.string(),
    author: v.string(),
    date: v.union([v.string(), v.date()]),
    tag: v.optional(v.array(v.string())),
});

export type PostFm = v.InferInput<typeof postFmSchema>;
