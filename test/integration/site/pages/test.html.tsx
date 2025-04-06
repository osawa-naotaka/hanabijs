import type { HRootPageFn, Store } from "hanabijs";

export default function Root(_store: Store): HRootPageFn<void> {
    return async () => (
        <html>
            <body>
                <h1>Hello World</h1>
                <h1>Hello Again</h1>
            </body>
        </html>
    );
}

// export default function Root(_store: Store): HRootPageFn<void> {
//     return async () => {
//         return jsx("html", {}, jsx("body", {}, jsx("h1", {}, "Hello World")))
//     };
// }
