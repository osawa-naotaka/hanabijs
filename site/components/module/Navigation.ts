import { A, Li, Nav, Ul, createStyles } from "@/main";
import type { HComponent } from "@/main";
import { navigation } from "@site/config/site.config";
import { SVGIcon } from "../element/SVGIcon";

export const Navigation: HComponent = {
    name: "navigation",
    attribute: {},
    style: createStyles(
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
    using: [SVGIcon],
    dom_gen: () =>
        Nav(
            { class: "navigation" },
            Ul(
                { class: "navigation-list" },
                Li({}, A({ href: "/posts" }, "BLOG")),
                ...navigation.map((item) =>
                    Li({}, A({ href: item.url, target: "__blank" }, SVGIcon.dom_gen({ name: item.icon }))),
                ),
            ),
        ),
};
