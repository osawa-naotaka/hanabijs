import { createComponent, Img } from "@/main";

export const SVGIcon = createComponent<{ name: string }>((attribute) =>
    Img({ src: `/images/icons/${attribute.name}-icon.svg`, name: attribute.name })
);
