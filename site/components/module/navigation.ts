import { registerComponent } from "@/lib/repository";
import { A, Li, Nav, Ul, createStyles } from "@/main";
import type { HNode } from "@/main";
import { navitem } from "@site/config/site.config";
import { svgIcon } from "../element/SvgIcon";

export function navigation(): () => HNode {
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

    const SvgIcon = svgIcon();
    return () =>
        Nav(
            { class: "navigation" },
            Ul(
                { class: "navigation-list" },
                Li({}, A({ href: "/posts" }, "BLOG")),
                ...navitem.map((item) =>
                    Li({}, A({ href: item.url, target: "__blank" }, SvgIcon({ name: item.icon }))),
                ),
            ),
        );
}
