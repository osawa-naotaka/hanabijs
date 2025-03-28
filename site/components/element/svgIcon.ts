import { registerComponent, semantic } from "@/main";
import type { HComponentFn, Store } from "@/main";

export type SvgIconArgument = {
    name: string;
};

export function svgIcon(store: Store): HComponentFn<SvgIconArgument> {
    const SvgIcon = semantic("svg-icon", { tag: "img" });
    return registerComponent(
        store,
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
