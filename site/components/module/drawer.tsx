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
} from "hanabijs/core";
import type { HComponentFn, HNode, Store } from "hanabijs/core";

export type DrawerArgument = {
    title: HNode;
    header_space: HNode;
    open_button: HNode;
    content: HNode;
};

export function drawer(store: Store, button_id: string): HComponentFn<DrawerArgument> {
    const Drawer = element("drawer");
    const Title = element("drawer-title");
    const HeaderSpace = element("drawer-header-space");
    const Content = element("drawer-content");
    const OpenState = element("drawer-open-state", { tag: "input" });
    const OpenButton = element("drawer-open-button", { tag: "label" });

    const styles = [
        style(Drawer)({ overflow: "hidden" }),
        style(Title)(DEFAULT_ROW(store), SPACE_BETWEEN),
        style(HeaderSpace)(DEFAULT_ROW(store)),
        style(OpenState)(DISPLAY("none")),
        style(OpenButton)(CURSOR("pointer")),
        style(Content)(HEIGHT("0"), TRANSITION("height", "0.25s")),
        style([`#${button_id}`, ":checked"], "~", Content)(HEIGHT("calc-size(fit-content, size)")),
    ];

    registerComponent(store, Drawer, styles);

    return component(Drawer, ({ title, header_space, open_button, content }) => (
        <Drawer>
            <OpenState type="checkbox" id={button_id} />
            <Title>
                {title}
                <HeaderSpace>
                    {header_space}
                    <OpenButton for={button_id}>{open_button}</OpenButton>
                </HeaderSpace>
            </Title>
            <Content>{content}</Content>
        </Drawer>
    ));
}
