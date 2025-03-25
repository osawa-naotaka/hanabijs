import { compoundStyle, layout, registerComponent, semantic, style } from "@/main";
import type { HComponentFn, HNode, Repository } from "@/main";

export type DrawerArgument = {
    title: HNode;
    header_space: HNode;
    open_button: HNode;
    content: HNode;
};

export function drawer(repo: Repository, button_id: string): HComponentFn<DrawerArgument> {
    const Drawer = semantic("drawer");
    const DrawerTitle = semantic("drawer-title");
    const DrawerHeaderSpace = layout("drawer-header-space");
    const DrawerContent = layout("drawer-content");
    const DrawerOpenState = semantic("drawer-open-state", { tag: "input" });
    const DrawerOpenButton = semantic("drawer-open-button", { tag: "label" });

    const styles = [
        style(Drawer, { overflow: "hidden" }),
        style(DrawerTitle, {
            display: "flex",
            justify_content: "space-between",
            align_items: "center",
        }),
        style(DrawerHeaderSpace, {
            display: "flex",
            gap: "1rem",
            align_items: "center",
        }),
        style(DrawerOpenState, { display: "none" }),
        style(DrawerOpenButton, { cursor: "pointer" }),
        style(DrawerContent, { height: "0", transition: ["height", "0.25s"] }),
        compoundStyle([[`#${button_id}`, ":checked"], "~", DrawerContent], {
            height: "calc-size(fit-content, size)",
        }),
    ];

    return registerComponent(
        repo,
        Drawer,
        styles,
        (argument) => () =>
            Drawer({ class: argument.class })(
                DrawerOpenState({ type: "checkbox", id: button_id })(),
                DrawerTitle({})(
                    argument.title,
                    DrawerHeaderSpace({})(
                        argument.header_space,
                        DrawerOpenButton({ for: button_id })(argument.open_button),
                    ),
                ),
                DrawerContent({})(argument.content),
            ),
    );
}
