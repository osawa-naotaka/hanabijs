import { registerComponent } from "@/lib/repository";
import { Img } from "@/main";
import type { HNode } from "@/main";

export function SVGIcon(attribute: { name: string }): HNode {
    const name = `svg-icon-${attribute.name}`;
    registerComponent(name, []);
    return Img({ src: `/images/icons/${attribute.name}-icon.svg`, class: name });
}
