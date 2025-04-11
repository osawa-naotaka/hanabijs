import { BOLD, FONT_SIZE, F_XLARGE, JUSTIFY_CENTER, ROW, S_XLARGE } from "@/lib/stylerules";
import type { HBrandsIconName } from "@/lib/ui/icon";
import { hIcon } from "@/lib/ui/icon";
import { component, element, registerComponent, style } from "@/main";
import type { HComponentFn, Store } from "@/main";
import { hlink } from "../element/hlink";

export type NavigationArgument = {
    navitem: {
        url: string;
        icon: HBrandsIconName;
    }[];
};

export function navigation(store: Store): HComponentFn<NavigationArgument> {
    const Navigation = element("navigation", { tag: "nav" });
    const HLink = hlink(store);
    const Icon = hIcon(store);

    const component_styles = [
        style(Navigation)(BOLD, FONT_SIZE(F_XLARGE(store)), ROW(S_XLARGE(store)), JUSTIFY_CENTER),
    ];

    registerComponent(store, Navigation, component_styles);

    return component(Navigation, ({ navitem }) => (
        <Navigation>
            <HLink href="/posts">blog</HLink>
            {navitem.map((item) => (
                <HLink href={item.url} target="__blank" key={item.url}>
                    <Icon type="brands" name={item.icon} />
                </HLink>
            ))}
        </Navigation>
    ));
}
