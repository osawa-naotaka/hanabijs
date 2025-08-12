import type { HRootPageFn, Store } from "zephblaze/core";
import { siteTitle } from "../components/siteTitle";

export default function Root(_store: Store): HRootPageFn<void> {
    const SiteTitle = siteTitle();
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
