import { Head, Link, Meta, Script, Title } from "@/main";
import type { HComponentFn, Store } from "@/main";

export type PageHeadArgument = {
    title: string;
    description: string;
};

export function pageHead(_repo: Store): HComponentFn<PageHeadArgument> {
    return ({ title, description }) =>
        () =>
            Head({ class: "page-head" })(
                // Global Metadata
                Meta({ charset: "utf-8" })(),
                Meta({
                    name: "viewport",
                    content: "width=device-width,initial-scale=1.0",
                })(),
                Link({ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" })(),
                Meta({ name: "generator", content: "template-engine" })(),

                // Canonical URL
                Link({
                    rel: "canonical",
                    href: "https://template-engine.lulliecat.com",
                })(),

                // Primary Meta Tags
                Title({})(title),
                Meta({ name: "description", content: description })(),
                Meta({
                    http_equiv: "content-security-policy",
                    content: "default-src 'self' https://cdn.jsdelivr.net/;",
                })(),

                // fontawesome
                Link({ rel: "stylesheet", href: "/assets/webfonts/fontawesome.css" })(),
                Link({ rel: "stylesheet", href: "/assets/webfonts/brands.css" })(),
                Link({ rel: "stylesheet", href: "/assets/webfonts/solid.css" })(),

                // Markdown code syntax highlight
                Link({ rel: "stylesheet", href: "/assets/css/prism-atom-dark.css" })(),
                Script({ src: "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-core.min.js" })(""),
                Script({
                    src: "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/autoloader/prism-autoloader.min.js",
                })(""),
            );
}
