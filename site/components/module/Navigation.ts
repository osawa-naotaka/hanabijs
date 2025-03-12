import { createComponent, Nav, Ul, Li, A, rule } from "@/main";
import { navigation } from "@site/config/site.config";
import { SVGIcon } from "../element/SVGIcon";

export const Navigation = createComponent(() => 
    Nav({ class: "navigator"},
        [
            rule([".navigator"], {
                font_weight: "bold",
                font_size: "1.4rem",
            }),
        ],
        Ul({ class: "navigator-list" },
            [
                rule([".navigator-list"], {
                    display: "flex",
                    justify_content: "center",
                    align_items: "center",
                    list_style_type: "none",
                    gap: "2rem"
                })
            ],
            Li({ class: "text" }, A({ href: "/blog"}, "BLOG")),
            ...navigation.map((item) => Li({}, 
                A({ href: item.url, target: "__blank" }, 
                    SVGIcon({ name: item.icon })
                )
            ))
        )
    )
);
