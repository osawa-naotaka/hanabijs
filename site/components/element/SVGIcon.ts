import { Img } from "@/main";
import type { HComponentFn } from "@/main";

export const SVGIcon: HComponentFn<{ name: string; class?: string }> = (attribute) =>
    Img({ src: `/images/icons/${attribute.name}-icon.svg`, name: attribute.name, class: attribute.class || "" });
