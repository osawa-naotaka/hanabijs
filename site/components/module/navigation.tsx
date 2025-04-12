import { BOLD, FONT_SIZE, F_XLARGE, JUSTIFY_CENTER, ROW, S_XLARGE } from "@/lib/stylerules";
import type { HSvgBrandsIconName } from "@/lib/ui/svgIconFont";
import { hSvgIconStore } from "@/lib/ui/svgIconStore";
import { component, element, registerComponent, style } from "@/core";
import type { HComponentFn, Store } from "@/core";
import { hlink } from "../element/hlink";

export type NavigationArgument = {
    navitem: {
        url: string;
        icon: HSvgBrandsIconName;
    }[];
};

export function navigation(store: Store): HComponentFn<NavigationArgument> {
    const Navigation = element("navigation", { tag: "nav" });
    const HLink = hlink(store);
    const icons: HSvgBrandsIconName[] = ["youtube", "x-twitter", "github"];
    const HSvgIconStore = hSvgIconStore(
        store,
        icons.map((x) => ({ type: "brands", name: x })),
    );

    const component_styles = [
        style(Navigation)(BOLD, FONT_SIZE(F_XLARGE(store)), ROW(S_XLARGE(store)), JUSTIFY_CENTER),
    ];

    registerComponent(store, Navigation, component_styles);

    return component(Navigation, ({ navitem }) => (
        <Navigation>
            <HLink href="/posts">blog</HLink>
            {navitem.map((item) => (
                <HLink href={item.url} target="__blank" key={item.url}>
                    <HSvgIconStore type="brands" name={item.icon} />
                </HLink>
            ))}
        </Navigation>
    ));
}
