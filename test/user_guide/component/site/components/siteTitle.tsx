import { component, element } from "zephblaze/core";
import type { HComponentFn } from "zephblaze/core";

export function siteTitle(): HComponentFn<{}> {
    const SiteTitle = element("site-title", { tag: "h1" })
    return component(SiteTitle, (_attr, ...child) => (
        <SiteTitle>
            <a href="/">{child}</a>
        </SiteTitle>
    ));
}
