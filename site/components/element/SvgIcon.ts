import { registerComponent } from "@/lib/repository";
import { type HNode, Img, addClass, mergeAttribute } from "@/main";

export function svgIcon(): (attribute: { class?: string | string[]; name: string }) => HNode {
    registerComponent("SvgIcon", []);
    return (attribute) =>
        Img(
            mergeAttribute(attribute, {
                src: `/images/icons/${attribute.name}-icon.svg`,
                class: addClass(attribute, `svg-icon-${attribute.name}`),
            }),
        );
}
