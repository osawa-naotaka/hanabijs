import { A, H1, createComponent, createSemantic, rule } from "@/main";
import { SVGIcon } from "../element/SVGIcon";
import { Drawer } from "../module/Drawer";
import { Navigation } from "../module/Navigation";

const PageHeaderTop = createSemantic("page-header", "header");

export const PageHeader = createComponent<{ title: string }>((attribute) =>
    PageHeaderTop(
        { class: attribute.class },
        rule("&", {
            position: "sticky",
            top: "0",
            left: "0",
            width: "100%",
            margin_block_end: "2rem",
        }),
        Drawer({
            class: "content",
            title: H1({}, rule(["h1"], { font_size: "2rem" }), A({ href: "/" }, attribute.title)),
            header_space: "",
            menu_button: SVGIcon({ name: "menu-bar" }),
            main: [Navigation({})],
        }),
    ),
);
