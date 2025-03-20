import { Img, registerComponent } from "@/main";
import type { HComponentFn, Repository } from "@/main";

export type SvgIconArgument = {
    name: string;
};

export function svgIcon(repo: Repository): HComponentFn<SvgIconArgument> {
    registerComponent(repo, "svg-icon", []);
    return (attribute) =>
        Img({
            src: `/images/icons/${attribute.name}-icon.svg`,
            class: ["svg-icon", `svg-icon-${attribute.name}`],
            alt: `${attribute.name} icon`,
        });
}
