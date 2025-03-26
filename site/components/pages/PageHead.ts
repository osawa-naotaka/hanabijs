import { Head, Link, Meta, Script, Title } from "@/main";
import type { HComponentFn } from "@/main";

export type PageHeadArgument = {
    title: string;
    description: string;
};

export const PageHead: HComponentFn<PageHeadArgument> =
    ({ title, description }) =>
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
                http_equiv: "Content-Security-Policy",
                content: "default-src 'self' https://cdn.jsdelivr.net;",
            })(),

            // Beer CSS
            Link({ rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/beercss@3.9.7/dist/cdn/beer.min.css" })(""),
            Script({ type: "module", src: "https://cdn.jsdelivr.net/npm/beercss@3.9.7/dist/cdn/beer.min.js" })(""),
        );
