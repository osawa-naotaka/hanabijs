import {
    CURSOR,
    DEFAULT_ROW,
    DISPLAY,
    HEIGHT,
    SPACE_BETWEEN,
    TRANSITION,
    component,
    element,
    registerComponent,
    style,
} from "@/main";
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
        style(Drawer)({ overflow: "hidden" }),
        style(DrawerTitle)(DEFAULT_ROW(store), SPACE_BETWEEN),
        style(DrawerHeaderSpace)(DEFAULT_ROW(store)),
        style(DrawerOpenState)(DISPLAY("none")),
        style(DrawerOpenButton)(CURSOR("pointer")),
        style(DrawerContent)(HEIGHT("0"), TRANSITION("height", "0.25s")),
        style([`#${button_id}`, ":checked"], "~", DrawerContent)(HEIGHT("calc-size(fit-content, size)")),
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
