import { registerComponent } from "@/lib/repository";
import { A, H1, createSemantic, createStyles } from "@/main";
import type { HNode } from "@/main";
import { svgIcon } from "../element/SvgIcon";
import { drawer } from "../module/drawer";
import { navigation } from "../module/navigation";

export function pageHeader(): (attribute: { class?: string; title: string }) => HNode {
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
    const Drawer = drawer();
    const SvgIcon = svgIcon();
    const Navigation = navigation();
    const PageHeader = createSemantic(["page-header", "container"], "header");
    return (attribute) =>
        PageHeader(
            attribute,
            Drawer({
                class: "content",
                title: H1({}, A({ href: "/" }, attribute.title)),
                header_space: "",
                open_button: SvgIcon({ name: "menu-bar" }),
                content: [Navigation({})],
            }),
        );
}
