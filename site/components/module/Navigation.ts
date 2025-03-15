import { registerComponent } from "@/lib/repository";
import { A, Li, Nav, Ul, createStyles } from "@/main";
import type { HNode } from "@/main";
import { navigation } from "@site/config/site.config";
import { SVGIcon } from "../element/SVGIcon";

export function Navigation(): HNode {
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

    return Nav(
        { class: "navigation" },
        Ul(
            { class: "navigation-list" },
            Li({}, A({ href: "/posts" }, "BLOG")),
            ...navigation.map((item) => Li({}, A({ href: item.url, target: "__blank" }, SVGIcon({ name: item.icon })))),
        ),
    );
}
