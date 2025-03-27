import { BOLD, FONT_SIZE, JUSTIFY_CENTER, ROW, SIZE_XL } from "@/lib/stylerules";
import { A, registerComponent, semantic, styles } from "@/main";
import type { HComponentFn, Repository } from "@/main";
import { svgIcon } from "@site/components/element/svgIcon";

export type NavigationArgument = {
    navitem: {
        url: string;
        icon: string;
    }[];
};

export function navigation(repo: Repository): HComponentFn<NavigationArgument> {
    const Navigation = semantic("navigation", { tag: "nav" });
    const NavigationList = semantic("navigation-list", { tag: "ul" });
    const NavigationListItem = semantic("navigation-list-item", { tag: "li" });
    const SvgIcon = svgIcon(repo);

    const component_styles = [
        styles(Navigation, BOLD, FONT_SIZE(SIZE_XL)),
        styles(NavigationList, ROW(SIZE_XL), JUSTIFY_CENTER),
    ];

    return registerComponent(
        repo,
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
