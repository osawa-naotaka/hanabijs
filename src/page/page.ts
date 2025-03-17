import { A, Body, H1, Head, Html, Meta, Script, Title, Style, createSimpleSemantic } from "@/main";
import type { Attribute, HNode } from "@/main";

const site = {
    lang: "en",
    name: "hanabi.js",
    description: "fast, light-weight static site generator",
};

const css = `
* {
    margin: 0;
    padding: 0;

    box-sizing: border-box;
}
a {
    color: inherit;
    text-decoration: none;
}
img,
svg {
    display: block;
    max-width: 100%;
}

:root {
    --space-block-large: 4rem;
    --color-main: #303030;
    --color-background: #f0f0f0;
    --color-header-background: #615c66;
    --color-header-text: #ffffff;
    --color-accent: #d7003a;
    --content-width: 740px;
    --content-padding: 1rem;
}
:root {
    font-size: 18px;
    line-height: 1.8;
    font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
}
p {
    text-indent: 1rem;
}

:root {
    scroll-behavior: smooth;
}

body {
    color: var(--color-main);
    background-color: var(--color-background);
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-block-large);
}
.content {
    max-width: var(--content-width);
    width: 100%;
    padding-inline: var(--content-padding);
}

h1 {
    font-size: 2rem;
}

.page-header {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    margin-block-end: 2rem;
}

.page-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: var(--color-main);
    color: var(--color-background);
}

.page-footer-content {
    position: relative;
    max-width: var(--content-width);
    margin-inline: auto;
}

.page-footer-copyright {
    text-align: center;
}
`;

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
                Style({}, css),
            ),
            Body(
                { id: "top-of-page" },
                PageHeader(H1({}, A({ href: "/" }, site.name))),
                ...child,
                PageFooter(PageFooterCopyright(`&copy; 2025 ${site.name}`)),
            ),
        );
}
