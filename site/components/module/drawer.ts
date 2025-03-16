import { Input, Label, compoundStyle, createSemantic, createSimpleSemantic, registerStyle, style } from "@/main";
import type { HComponentFn, HNode, Repository } from "@/main";

export type DrawerAttribute = {
    title: HNode;
    header_space: HNode;
    open_button: HNode;
    content: HNode[];
};

export function drawer(repo: Repository, button_id: string): HComponentFn<DrawerAttribute> {
    registerStyle(repo, "drawer", [
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
        compoundStyle([[`#${button_id}`, ":checked"], "~", ".drawer-content"], {
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
            Input({ class: "drawer-open-state", type: "checkbox", id: button_id }),
            DrawerTitle(
                attribute.title,
                DrawerHeaderSpace(
                    attribute.header_space,
                    Label({ class: "drawer-open-button", for: button_id }, attribute.open_button),
                ),
            ),
            DrawerContent(...attribute.content),
        );
}
