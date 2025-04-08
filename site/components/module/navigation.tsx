import { BOLD, FONT_SIZE, F_XLARGE, JUSTIFY_CENTER, ROW, S_XLARGE } from "@/lib/stylerules";
import { component, element, hIcon, registerComponent, style } from "@/main";
import type { HBrandIconName, HComponentFn, Store } from "@/main";
import { hlink } from "../element/hlink";

export type NavigationArgument = {
    navitem: {
        url: string;
        icon: HBrandIconName;
    }[];
};

export function navigation(store: Store): HComponentFn<NavigationArgument> {
    const Navigation = element("navigation", { tag: "nav" });
    const List = element("navigation-list", { tag: "ul" });
    const Item = element("navigation-list-item", { tag: "li" });
    const Icon = hIcon(store);
    const HLink = hlink(store);

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
                        <Icon type="brands" name={item.icon} />
                    </HLink>
                ))}
            </List>
        </Navigation>
    ));
}
