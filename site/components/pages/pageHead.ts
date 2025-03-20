import { Head, Link, Meta, Title } from "@/main";
import type { HComponentFn, Repository } from "@/main";

export type PageHeadArgument = {
    title: string;
    description: string;
};

export function pageHead(_repo: Repository): HComponentFn<PageHeadArgument> {
    return (attribute) =>
        Head(
            { class: "page-head" },
            // Global Metadata
            Meta({ charset: "utf-8" }),
            Meta({
                name: "viewport",
                content: "width=device-width,initial-scale=1.0",
            }),
            Link({ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }),
            Meta({ name: "generator", content: "template-engine" }),

            // Canonical URL
            Link({
                rel: "canonical",
                href: "https://template-engine.lulliecat.com",
            }),

            // Primary Meta Tags
            Title({}, attribute.title),
            Meta({ name: "description", content: attribute.description }),
            Meta({
                http_equiv: "Content-Security-Policy",
                content:
                    "default-src 'self' 'unsafe-inline'; img-src 'self' https://img.youtube.com; frame-src https://www.youtube.com;",
            }),
        );
}
