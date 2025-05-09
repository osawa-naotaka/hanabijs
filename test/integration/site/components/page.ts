import { A, Body, H1, Html, Link, Meta, Title, element, registerComponent, style } from "hanabijs";
import type { HComponentFn, Store } from "hanabijs";

export type PageAttribute = {
    title: string;
    description: string;
};

export default function page(store: Store): HComponentFn<PageAttribute> {
    registerComponent(store, "page", [style(".page-header")({ width: "100%" })]);

    const PageHead = element("page-head", { tag: "head" });
    const PageHeader = element("page-header", { tag: "header" });
    const PageFooter = element("page-footer", { tag: "footer" });

    return (attribute) =>
        (...child) =>
            Html({ lang: "en" })(
                PageHead({})(
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
                    Title({})(attribute.title),
                    Meta({ name: "description", content: attribute.description })(),
                    Meta({
                        http_equiv: "content-security-policy",
                        content:
                            "default-src 'self' 'unsafe-inline'; img-src 'self' https://img.youtube.com; frame-src https://www.youtube.com;",
                    })(),
                ),
                Body({ id: "top-of-page" })(
                    PageHeader({})(H1({})(A({ href: "/" })(attribute.title))),
                    ...child,
                    PageFooter({})("&copy; 2025 lulliecat"),
                ),
            );
}
