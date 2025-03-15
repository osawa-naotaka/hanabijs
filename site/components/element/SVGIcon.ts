import { ComponentFn, Img } from "@/main";

export const SVGIcon: ComponentFn<{ name: string, class?: string }> = (attribute) =>
    Img({ src: `/images/icons/${attribute.name}-icon.svg`, name: attribute.name, class: attribute.class || "" });


// export const SVGIcon = createComponent<{ name: string, class: string }>(
//     (attribute) => Img({ src: `/images/icons/${attribute.name}-icon.svg`, name: attribute.name, class: attribute.class }),
//     []
// );

// export const SVGIcon = createComponent<{ name: string }>((attribute) =>
//     Img({ src: `/images/icons/${attribute.name}-icon.svg`, name: attribute.name, class: attribute.class }),
// );
