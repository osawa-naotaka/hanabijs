import { registerComponent } from "@/lib/repository";
import { A, createSemantic, createSimpleSemantic, createStyles } from "@/main";
import type { Attribute, HNode } from "@/main";
import { navitem } from "@site/config/site.config";
import { svgIcon } from "../element/svgIcon";

export function navigation(): (attribute: Attribute) => HNode {
    registerComponent(
        "navigation",
        createStyles(
            [
                [[".navigation"]],
                {
                    font_weight: "bold",
                    font_size: "1.4rem",
                },
            ],
            [
                [[".navigation-list"]],
                {
                    display: "flex",
                    justify_content: "center",
                    align_items: "center",
                    list_style_type: "none",
                    gap: "2rem",
                },
            ],
        ),
    );

    const Navigation = createSemantic("navigation", { tag: "nav" });
    const NavigationList = createSimpleSemantic("navigation-list", { tag: "ul" });
    const NavigationListItem = createSimpleSemantic("navigation-list-item", { tag: "li" });

    const SvgIcon = svgIcon();
    return (attribute) =>
        Navigation(
            { class: attribute.class },
            NavigationList(
                NavigationListItem(A({ href: "/posts" }, "BLOG")),
                ...navitem.map((item) =>
                    NavigationListItem(A({ href: item.url, target: "__blank" }, SvgIcon({ name: item.icon }))),
                ),
            ),
        );
}
