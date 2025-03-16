import { registerComponent } from "@/lib/repository";
import { Input, Label, compoundStyle, createSemantic, createSimpleSemantic, style } from "@/main";
import type { Attribute, HNode } from "@/main";

export type DrawerAttribute = {
    title: HNode;
    header_space: HNode;
    open_button: HNode;
    content: HNode[];
    button_id: string;
} & Attribute;

export function drawer(): (attribute: DrawerAttribute) => HNode {
    registerComponent("drawer", [
        style("&", { overflow: "hidden" }),
        style(".drawer-title", {
            display: "flex",
            justify_content: "space-between",
            align_items: "center",
        }),
        style(".drawer-header-space", {
            display: "flex",
            gap: "1rem",
            align_items: "center",
        }),
        style(".drawer-open-state", { display: "none" }),
        style(".drawer-open-button", { cursor: "pointer" }),
        style(".drawer-content", { height: "0", transition: ["height", "0.25s"] }),
        compoundStyle([["#drawer-toggle-button", ":checked"], "~", ".drawer-content"], {
            height: "calc-size(fit-content, size)",
        }),
    ]);

    const Drawer = createSemantic("drawer");
    const DrawerTitle = createSimpleSemantic("drawer-title");
    const DrawerHeaderSpace = createSimpleSemantic("drawer-header-space");
    const DrawerContent = createSimpleSemantic("drawer-content");

    return (attribute) =>
        Drawer(
            { class: attribute.class },
            Input({ class: "drawer-open-state", type: "checkbox", id: attribute.button_id }),
            DrawerTitle(
                attribute.title,
                DrawerHeaderSpace(
                    attribute.header_space,
                    Label({ class: "drawer-open-button", for: attribute.button_id }, attribute.open_button),
                ),
            ),
            DrawerContent(...attribute.content),
        );
}
