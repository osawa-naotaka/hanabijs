import { element } from "@/main";
import type { HArgument, HComponentFn } from "@/main";

const site = {
    lang: "en",
    name: "hanabi.js",
    description: "fast, light-weight static site generator",
};

export function page(): HComponentFn<HArgument> {
    const PageHeader = element("page-header", { tag: "header" });
    const PageFooter = element("page-footer", { tag: "footer" });
    const PageFooterCopyright = element("page-footer-copyright");

    return (attribute) => (
        <html lang={site.lang}>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1.0" />
                <title>{site.name}</title>
                <script type="module" src="/reload.js" />
                <link rel="stylesheet" href="/hanabi-error.css" />
            </head>
            <body>
                <PageHeader>
                    <h1>
                        <a href="/">hanabi.js</a>
                    </h1>
                </PageHeader>
                {attribute.children}
                <PageFooter>
                    <PageFooterCopyright>&copy; 2025 hanabi.js</PageFooterCopyright>
                </PageFooter>
            </body>
        </html>
    );
}
