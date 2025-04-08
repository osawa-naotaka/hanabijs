import { component } from "@/main";
import type { HComponentFn } from "@/main";

export type PageHeadArgument = {
    title: string;
    description: string;
};

export function pageHead(): HComponentFn<PageHeadArgument> {
    return component("head", ({ title, description }) => (
        <head class="page-head">
            {/* Global Metadata */}
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1.0" />
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <meta name="generator" content="template-engine" />

            {/* // Canonical URL */}
            <link rel="canonical" href="https://template-engine.lulliecat.com" />

            {/* // Primary Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta http-equiv="content-security-policy" content="default-src 'self' https://cdn.jsdelivr.net/;" />
        </head>
    ));
}
