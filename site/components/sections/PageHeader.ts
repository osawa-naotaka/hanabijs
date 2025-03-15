import { A, H1, Header, createStyles } from "@/main";
import type { HComponent } from "@/main";
import { SVGIcon } from "../element/SVGIcon";
import { Drawer } from "../module/Drawer";
import { Navigation } from "../module/Navigation";

export const PageHeader: HComponent<{ class?: string; title: string }> = {
    name: "page-header",
    attribute: {},
    style: createStyles([
        [[".page-header"]],
        {
            position: "sticky",
            top: "0",
            left: "0",
            width: "100%",
            margin_block_end: "2rem",
        },
    ]),
    using: [Drawer, Navigation, SVGIcon],
    dom_gen: (attribute) =>
        Header(
            { class: `page-header container ${attribute.class || ""}` },
            Drawer.dom_gen({
                class: "content",
                title: H1({}, A({ href: "/" }, attribute.title)),
                header_space: "",
                menu_button: SVGIcon.dom_gen({ name: "menu-bar" }),
                main: [Navigation.dom_gen({})],
            }),
        ),
};
