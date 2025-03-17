import { A, createSemantic, createSimpleSemantic, registerComponent, style } from "@/main";
import type { HComponentFn, Repository } from "@/main";
import { svgIcon } from "@site/components/element/svgIcon";

export type NavigationAttribute = {
    navitem: {
        url: string;
        icon: string;
    }[];
};

export function navigation(repo: Repository): HComponentFn<NavigationAttribute> {
    registerComponent(repo, "navigation", [
        style("&", {
            font_weight: "bold",
            font_size: "1.4rem",
        }),
        style(".navigation-list", {
            display: "flex",
            justify_content: "center",
            align_items: "center",
            list_style_type: "none",
            gap: "2rem",
        }),
    ]);

    const Navigation = createSemantic("navigation", { tag: "nav" });
    const NavigationList = createSimpleSemantic("navigation-list", { tag: "ul" });
    const NavigationListItem = createSimpleSemantic("navigation-list-item", { tag: "li" });

    const SvgIcon = svgIcon(repo);
    return (attribute) =>
        Navigation(
            { class: attribute.class },
            NavigationList(
                NavigationListItem(A({ href: "/posts" }, "blog")),
                ...attribute.navitem.map((item) =>
                    NavigationListItem(A({ href: item.url, target: "__blank" }, SvgIcon({ name: item.icon }))),
                ),
            ),
        );
}
