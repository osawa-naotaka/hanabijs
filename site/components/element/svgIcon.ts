import { Img, registerStyle } from "@/main";
import type { HComponentFn, Repository } from "@/main";

export type SvgIconAttribute = {
    name: string;
};

export function svgIcon(repo: Repository): HComponentFn<SvgIconAttribute> {
    registerStyle(repo, "svg-icon", []);
    return (attribute) =>
        Img({
            src: `/images/icons/${attribute.name}-icon.svg`,
            class: ["svg-icon", `svg-icon-${attribute.name}`],
            alt: `${attribute.name} icon`,
        });
}
