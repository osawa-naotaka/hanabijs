import { registerComponent } from "@/lib/repository";
import { Img } from "@/main";
import type { HNode } from "@/main";

export function svgIcon(): (attribute: { name: string }) => HNode {
    registerComponent("SvgIcon", []);
    return (attribute) =>
        Img({ src: `/images/icons/${attribute.name}-icon.svg`, class: `svg-icon-${attribute.name}` });
}
