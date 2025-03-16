import { A, H1, createSimpleSemantic, registerComponent, style } from "@/main";
import type { Attribute, HNode, Repository } from "@/main";
import { svgIcon } from "@site/components/element/svgIcon";
import { drawer } from "@site/components/module/drawer";
import { navigation } from "@site/components/module/navigation";

export type PageHeaderAttribute = {
    title: string;
    navitem: {
        url: string;
        icon: string;
    }[];
} & Attribute;

export function pageHeader(repo: Repository): (attribute: PageHeaderAttribute) => HNode {
    registerComponent(repo, "page-header", [
        style("&", {
            position: "sticky",
            top: "0",
            left: "0",
            width: "100%",
            margin_block_end: "2rem",
        }),
    ]);

    const Drawer = drawer(repo, "page-header-toggle-button");
    const SvgIcon = svgIcon(repo);
    const Navigation = navigation(repo);
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
