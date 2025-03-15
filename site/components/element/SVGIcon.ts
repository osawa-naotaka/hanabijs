import { Img } from "@/main";
import type { HComponent } from "@/main";

export const SVGIcon: HComponent<{ name: string; class?: string }> = {
    name: "svgicon",
    attribute: {},
    style: [],
    using: [],
    dom_gen: (attribute) =>
        Img({ src: `/images/icons/${attribute.name}-icon.svg`, name: attribute.name, class: attribute.class || "" }),
};
