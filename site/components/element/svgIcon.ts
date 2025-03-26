import { registerComponent, semantic } from "@/main";
import type { HComponentFn, Repository } from "@/main";

export type SvgIconArgument = {
    name: string;
};

export function svgIcon(repo: Repository): HComponentFn<SvgIconArgument> {
    const SvgIcon = semantic("svg-icon", { tag: "img" });
    return registerComponent(
        repo,
        SvgIcon,
        [],
        ({ name }) =>
            () =>
                SvgIcon({
                    src: `/images/icons/${name}-icon.svg`,
                    class: `svg-icon-${name}`,
                    alt: `${name} icon`,
                })(),
    );
}
