import { component, element } from "zephblaze/core";
import type { H1Attribute, HComponentFn } from "zephblaze/core";

export function siteTitle(): HComponentFn<Partial<H1Attribute>> {
    const SiteTitle = element("site-title", { tag: "h1" });
    return component(SiteTitle, (_attr, ...child) => (
        <SiteTitle>
            <a href="/">{child}</a>
        </SiteTitle>
    ));
}
