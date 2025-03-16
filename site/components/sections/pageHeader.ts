import { registerComponent } from "@/lib/repository";
import { A, H1, createSimpleSemantic, style } from "@/main";
import type { Attribute, HNode } from "@/main";
import { svgIcon } from "../element/svgIcon";
import { drawer } from "../module/drawer";
import { navigation } from "../module/navigation";

export type PageHeaderAttribute = {
    title: string;
    navitem: {
        url: string;
        icon: string;
    }[];
} & Attribute;

export function pageHeader(): (attribute: PageHeaderAttribute) => HNode {
    registerComponent("page-header", [
        style("&", {
            position: "sticky",
            top: "0",
            left: "0",
            width: "100%",
            margin_block_end: "2rem",
        }),
    ]);

    const Drawer = drawer();
    const SvgIcon = svgIcon();
    const Navigation = navigation();
    const PageHeader = createSimpleSemantic("page-header", { class_names: ["container"], tag: "header" });
    return (attribute) =>
        PageHeader(
            Drawer({
                class: "content",
                title: H1({}, A({ href: "/" }, attribute.title)),
                header_space: "",
                open_button: SvgIcon({ name: "menu-bar" }),
                content: [Navigation(attribute)],
            }),
        );
}
