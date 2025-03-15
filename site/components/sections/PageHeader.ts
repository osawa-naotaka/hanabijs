import { registerComponent } from "@/lib/repository";
import { A, H1, Header, createStyles } from "@/main";
import type { HNode } from "@/main";
import { SVGIcon } from "../element/SVGIcon";
import { Drawer } from "../module/Drawer";
import { Navigation } from "../module/Navigation";

export function PageHeader(attribute: { class?: string; title: string }): HNode {
    registerComponent(
        "page-header",
        createStyles([
            [[".page-header"]],
            {
                position: "sticky",
                top: "0",
                left: "0",
                width: "100%",
                margin_block_end: "2rem",
            },
        ]),
    );
    return Header(
        { class: `page-header container ${attribute.class || ""}` },
        Drawer({
            class: "content",
            title: H1({}, A({ href: "/" }, attribute.title)),
            header_space: "",
            menu_button: SVGIcon({ name: "menu-bar" }),
            main: [Navigation()],
        }),
    );
}
