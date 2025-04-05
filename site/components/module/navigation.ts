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
    const Top = element("navigation", { tag: "nav" });
    const List = element("navigation-list", { tag: "ul" });
    const Item = element("navigation-list-item", { tag: "li" });
    const Icon = hIcon();

    const component_styles = [
        style(Top)(BOLD, FONT_SIZE(F_XLARGE(store))),
        style(List)(ROW(S_XLARGE(store)), JUSTIFY_CENTER),
    ];

    registerComponent(store, Top, component_styles);

    return component(Top)(
        ({ navitem }) =>
            () =>
                Top({})(
                    List({})(
                        Item({})(A({ href: "/posts" })("blog")),
                        ...navitem.map((item) =>
                            Item({})(
                                A({ href: item.url, target: "__blank" })(Icon({ type: "brands", name: item.icon })()),
                            ),
                        ),
                    ),
                ),
    );
}
