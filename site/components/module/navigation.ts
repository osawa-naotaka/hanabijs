import { BOLD, FONT_SIZE, F_XLARGE, JUSTIFY_CENTER, ROW, S_XLARGE } from "@/lib/stylerules";
import { A, component, element, hIcon, registerComponent, style } from "@/main";
import type { HBrandIconName, HComponentFn, Store } from "@/main";

export type NavigationArgument = {
    navitem: {
        url: string;
        icon: HBrandIconName;
    }[];
};

export function navigation(store: Store): HComponentFn<NavigationArgument> {
    const Navigation = element("navigation", { tag: "nav" });
    const NavigationList = element("navigation-list", { tag: "ul" });
    const NavigationListItem = element("navigation-list-item", { tag: "li" });

    const component_styles = [
        style(Navigation, BOLD, FONT_SIZE(F_XLARGE(store))),
        style(NavigationList, ROW(S_XLARGE(store)), JUSTIFY_CENTER),
    ];

    registerComponent(store, Navigation, component_styles);

    return component(
        Navigation,
        (argument) => () =>
            Navigation({ class: argument.class })(
                NavigationList({})(
                    NavigationListItem({})(A({ href: "/posts" })("blog")),
                    ...argument.navitem.map((item) =>
                        NavigationListItem({})(
                            A({ href: item.url, target: "__blank" })(hIcon({ type: "brands", name: item.icon })({})()),
                        ),
                    ),
                ),
            ),
    );
}
