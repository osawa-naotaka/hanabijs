import { generateFontCss } from "@/cli/font";
import type { Store } from "@/lib/core/store";
import { stringifyToCss } from "@/lib/server/stringify";

export async function bundleCss(
    store: Store,
    base_name: string,
    require: NodeJS.Require,
): Promise<string | null | Error> {
    const font_css = generateFontCss(store, base_name);

    const css_files = Array.from(store.components.values())
        .map((x) => x.attachment?.script)
        .filter((x) => x !== undefined);

    for (const client of css_files) {
        const client_fn = require(client.replace("file://", ""));
        if (typeof client_fn.default === "function") {
            await client_fn.default(store);
        } else {
            return new Error(`bundleCss: import file "${client}" does not have default export.`);
        }
    }

    const css = stringifyToCss(Array.from(store.components.values()));
    return `${css}${font_css}`;
}
