import type { HRootPageFn, Store } from "zephblaze/core";

export default function Root(_store: Store): HRootPageFn<void> {
    return async () => (
        <html lang="en">
            <head>
                <title>Hello, Zephblaze!</title>
            </head>
            <body>
                <h1>Hello, Zephblaze!</h1>
            </body>
        </html>
    );
}
