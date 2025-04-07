import { component } from "@/main";
import type { HComponentFn } from "@/main";

export type PageHeadArgument = {
    title: string;
    description: string;
};

export function pageHead(): HComponentFn<PageHeadArgument> {
    return component(<head />)(({ title, description }) => (
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

            {/* // fontawesome */}
            <link rel="stylesheet" href="/assets/webfonts/fontawesome.css" />
            <link rel="stylesheet" href="/assets/webfonts/brands.css" />
            <link rel="stylesheet" href="/assets/webfonts/solid.css" />

            {/* // Markdown code syntax highlight */}
            <link rel="stylesheet" href="/assets/css/prism-atom-dark.css" />
            <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-core.min.js" />
            <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/autoloader/prism-autoloader.min.js" />
        </head>
    ));
}
