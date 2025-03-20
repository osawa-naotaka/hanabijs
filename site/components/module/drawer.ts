import {
    Input,
    Label,
    compoundStyle,
    registerComponent,
    component,
    style,
} from "@/main";
import type { HComponentFn, HNode, Repository } from "@/main";

export type DrawerArgument = {
    title: HNode;
    header_space: HNode;
    open_button: HNode;
    content: HNode[];
};

export function drawer(repo: Repository, button_id: string): HComponentFn<DrawerArgument> {
    registerComponent(repo, "drawer", [
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

    const Drawer = component("drawer");
    const DrawerTitle = component("drawer-title");
    const DrawerHeaderSpace = component("drawer-header-space");
    const DrawerContent = component("drawer-content");

    return (argument) =>
        Drawer(
            { class: argument.class },
            Input({ class: "drawer-open-state", type: "checkbox", id: button_id }),
            DrawerTitle(
                {},
                argument.title,
                DrawerHeaderSpace(
                    {},
                    argument.header_space,
                    Label({ class: "drawer-open-button", for: button_id }, argument.open_button),
                ),
            ),
            DrawerContent({}, ...argument.content),
        );
}
