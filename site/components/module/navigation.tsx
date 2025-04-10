import { BOLD, FONT_SIZE, F_XLARGE, JUSTIFY_CENTER, ROW, S_XLARGE } from "@/lib/stylerules";
import type { HSvgBrandsIconName } from "@/lib/ui/svgIcon";
import { component, element, registerComponent, style } from "@/main";
import type { HComponentFn, Store } from "@/main";
import { hlink } from "../element/hlink";
import { hSvgIconStore } from "../element/svgIconStore";

export type NavigationArgument = {
    navitem: {
        url: string;
        icon: HSvgBrandsIconName;
    }[];
};

export function navigation(store: Store): HComponentFn<NavigationArgument> {
    const Navigation = element("navigation", { tag: "nav" });
    const List = element("navigation-list", { tag: "ul" });
    const Item = element("navigation-list-item", { tag: "li" });
    const HLink = hlink(store);

    const brands: HSvgBrandsIconName[] = ["youtube", "x-twitter", "github"];
    const HIconStore = hSvgIconStore(
        store,
        brands.map((name) => ({ type: "brands", name })),
    );

    const component_styles = [
        style(Navigation)(BOLD, FONT_SIZE(F_XLARGE(store))),
        style(List)(ROW(S_XLARGE(store)), JUSTIFY_CENTER),
    ];

    registerComponent(store, Navigation, component_styles);

    return component(Navigation, ({ navitem }) => (
        <Navigation>
            <List>
                <Item>
                    <HLink href="/posts">blog</HLink>
                </Item>
                {navitem.map((item) => (
                    <HLink href={item.url} target="__blank" key={item.url}>
                        <HIconStore icon={{ type: "brands", name: item.icon }} />
                    </HLink>
                ))}
            </List>
        </Navigation>
    ));
}
