import { A, Body, H1, Head, Html, Link, Meta, Script, Title, createSimpleSemantic } from "@/main";
import type { Attribute, HNode } from "@/main";

const site = {
    lang: "en",
    name: "hanabi.js",
    description: "fast, light-weight static site generator",
};

export function page(): (attribute: Attribute, ...child: HNode[]) => HNode {
    const PageHeader = createSimpleSemantic("page-header", { class_names: ["container"], tag: "header" });
    const PageFooter = createSimpleSemantic("page-footer", { tag: "footer" });
    const PageFooterCopyright = createSimpleSemantic("page-footer-copyright");

    return (_attribute, ...child) =>
        Html(
            { lang: site.lang },
            Head(
                {},
                Meta({ charset: "utf-8" }),
                Meta({
                    name: "viewport",
                    content: "width=device-width,initial-scale=1.0",
                }),

                Title({}, site.name),
                Script({ type: "module", src: "/reload.js" }, ""),
                Link({ href: "/default.css", rel: "stylesheet" }, ""),
            ),
            Body(
                { id: "top-of-page" },
                PageHeader(H1({}, A({ href: "/" }, site.name))),
                ...child,
                PageFooter(PageFooterCopyright(`&copy; 2025 ${site.name}`)),
            ),
        );
}
