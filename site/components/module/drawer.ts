import { component, element, registerComponent, style } from "@/main";
import type { HComponentFn, HNode, Store } from "@/main";

export type DrawerArgument = {
    title: HNode;
    header_space: HNode;
    open_button: HNode;
    content: HNode;
};

export function drawer(store: Store, button_id: string): HComponentFn<DrawerArgument> {
    const Drawer = element("drawer");
    const DrawerTitle = element("drawer-title");
    const DrawerHeaderSpace = element("drawer-header-space");
    const DrawerContent = element("drawer-content");
    const DrawerOpenState = element("drawer-open-state", { tag: "input" });
    const DrawerOpenButton = element("drawer-open-button", { tag: "label" });

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
        style([[`#${button_id}`, ":checked"], "~", DrawerContent], {
            height: "calc-size(fit-content, size)",
        }),
    ];

    registerComponent(store, Drawer, styles);

    return component(
        Drawer,
        (argument) => () =>
            Drawer({})(
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
