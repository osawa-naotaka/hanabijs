import { A, H1, createComponent, createSemantic, style, style1 } from "@/main";
import { SVGIcon } from "../element/SVGIcon";
import { Drawer } from "../module/Drawer";
import { Navigation } from "../module/Navigation";

const PageHeaderTop = createSemantic("page-header", "header");

export const PageHeader = createComponent<{ title: string }>((attribute) =>
    PageHeaderTop(
        { class: new Array("container", attribute.class || "") },
        style({
            position: "sticky",
            top: "0",
            left: "0",
            width: "100%",
            margin_block_end: "2rem",
        }),
        Drawer({
            class: "content",
            title: H1({}, [style1(["h1"], { font_size: "2rem" })], A({ href: "/" }, attribute.title)),
            header_space: "",
            menu_button: SVGIcon({ name: "menu-bar" }),
            main: [Navigation({})],
        }),
    ),
);
