import { ComponentFn, Head, Link, Meta, Title } from "@/main";
import { site } from "@site/config/site.config";

export const PageHead: ComponentFn<{ title: string }> = (attribute) =>
    Head(
        {},
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
        Meta({ name: "description", content: site.description }),
        Meta({
            http_equiv: "Content-Security-Policy",
            content:
                "default-src 'self' 'unsafe-inline'; img-src 'self' https://img.youtube.com; frame-src https://www.youtube.com;",
        }),
    );
