import { A, ComponentFn, createSemantic, style } from "@/main";
import { navigation } from "@site/config/site.config";
import { SVGIcon } from "../element/SVGIcon";

const NavigationTop = createSemantic("navigation",
    style({
        font_weight: "bold",
        font_size: "1.4rem",
    }),
    "nav");

const NavigationList = createSemantic("navigation-list", 
    style({
        display: "flex",
        justify_content: "center",
        align_items: "center",
        list_style_type: "none",
        gap: "2rem",
    }),
    "ul");

const NavigationItem = createSemantic("navigation-item", [], "li");

export const Navigation: ComponentFn = (attribute) =>
    NavigationTop(
        { class: attribute.class || "" },
        NavigationList(
            {},
            NavigationItem({}, A({ href: "/blog" }, "BLOG")),
            ...navigation.map((item) =>
                NavigationItem({}, A({ href: item.url, target: "__blank" }, SVGIcon({ name: item.icon }))),
            ),
        ),
    );
