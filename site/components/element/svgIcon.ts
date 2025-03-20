import { Img, registerComponent } from "@/main";
import type { HComponentFn, Repository } from "@/main";

export type SvgIconArgument = {
    name: string;
};

export function svgIcon(repo: Repository): HComponentFn<SvgIconArgument> {
    registerComponent(repo, "svg-icon", []);
    return ({ name }) =>
        Img({
            src: `/images/icons/${name}-icon.svg`,
            class: ["svg-icon", `svg-icon-${name}`],
            alt: `${name} icon`,
        });
}
