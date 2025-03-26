import { Img } from "@/main";
import type { HComponentFn } from "@/main";

export type SvgIconArgument = {
    name: string;
};

export const SvgIcon: HComponentFn<SvgIconArgument> =
    ({ name }) =>
    () =>
        Img({
            src: `/images/icons/${name}-icon.svg`,
            class: ["svg-icon", `svg-icon-${name}`],
            alt: `${name} icon`,
        })();
