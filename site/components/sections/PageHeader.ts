import { A, type HComponentFn, createSemantic, style } from "@/main";
import { SVGIcon } from "../element/SVGIcon";
import { Drawer } from "../module/Drawer";
import { Navigation } from "../module/Navigation";

const PageHeaderTop = createSemantic(
    "page-header",
    style({
        position: "sticky",
        top: "0",
        left: "0",
        width: "100%",
        margin_block_end: "2rem",
    }),
    "header",
);

const PageHeaderH1 = createSemantic("page-header-h1", style({ font_size: "2rem" }), "h1");

export const PageHeader: HComponentFn<{ class?: string; title: string }> = (attribute) =>
    PageHeaderTop(
        { class: new Array("container", attribute.class || "") },
        Drawer({
            class: "content",
            title: PageHeaderH1({}, A({ href: "/" }, attribute.title)),
            header_space: "",
            menu_button: SVGIcon({ name: "menu-bar" }),
            main: [Navigation({})],
        }),
    );
