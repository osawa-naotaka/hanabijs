import type { HRootPageFn, Store } from "zephblaze/core";
import { element } from "zephblaze/core";

export default function Root(_store: Store): HRootPageFn<void> {
    const SiteTitle = element("site-title", { tag: "h1" });
    return async () => (
        <html lang="en">
            <head>
                <title>Hello, Zephblaze!</title>
            </head>
            <body>
                <SiteTitle>Hello, Zephblaze!</SiteTitle>
            </body>
        </html>
    );
}
