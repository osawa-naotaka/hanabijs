import { Img } from "@/main";
import type { HComponentFn, Repository } from "@/main";

export type SvgIconArgument = {
    name: string;
};

export function svgIcon(_repo: Repository): HComponentFn<SvgIconArgument> {
    return ({ name }) =>
        () =>
            Img({
                src: `/images/icons/${name}-icon.svg`,
                class: ["svg-icon", `svg-icon-${name}`],
                alt: `${name} icon`,
            })();
}
