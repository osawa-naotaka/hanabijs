import { component, element } from "zephblaze/core";
import type { HArgument, HComponentFn } from "zephblaze/core";

export function siteTitle(): HComponentFn<HArgument> {
    const SiteTitle = element("site-title", { tag: "h1" });
    return component(SiteTitle, (_attr, ...child) => (
        <SiteTitle>
            <a href="/">{child}</a>
        </SiteTitle>
    ));
}
