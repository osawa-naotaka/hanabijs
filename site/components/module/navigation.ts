import { BOLD, FONT_SIZE, F_XLARGE, JUSTIFY_CENTER, ROW, S_XLARGE } from "@/lib/stylerules";
import { A, element, registerComponent, style } from "@/main";
import type { HComponentFn, Store } from "@/main";
import { svgIcon } from "@site/components/element/svgIcon";

export type NavigationArgument = {
    navitem: {
        url: string;
        icon: string;
    }[];
};

export function navigation(store: Store): HComponentFn<NavigationArgument> {
    const Navigation = element("navigation", { tag: "nav" });
    const NavigationList = element("navigation-list", { tag: "ul" });
    const NavigationListItem = element("navigation-list-item", { tag: "li" });
    const SvgIcon = svgIcon(store);

    const component_styles = [
        style(Navigation, BOLD, FONT_SIZE(F_XLARGE(store))),
        style(NavigationList, ROW(S_XLARGE(store)), JUSTIFY_CENTER),
    ];

    return registerComponent(
        store,
        Navigation,
        component_styles,
        (argument) => () =>
            Navigation({ class: argument.class })(
                NavigationList({})(
                    NavigationListItem({})(A({ href: "/posts" })("blog")),
                    ...argument.navitem.map((item) =>
                        NavigationListItem({})(
                            A({ href: item.url, target: "__blank" })(SvgIcon({ name: item.icon })()),
                        ),
                    ),
                ),
            ),
    );
}
