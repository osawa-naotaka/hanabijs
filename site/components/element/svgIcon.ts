import { Img, registerComponent } from "@/main";
import type { Attribute, HNode } from "@/main";

export function svgIcon(): (attribute: Attribute & { name: string }) => HNode {
    registerComponent("svg-icon", []);
    return (attribute) =>
        Img({
            src: `/images/icons/${attribute.name}-icon.svg`,
            class: ["svg-icon", `svg-icon-${attribute.name}`],
            alt: `${attribute.name} icon`,
        });
}
