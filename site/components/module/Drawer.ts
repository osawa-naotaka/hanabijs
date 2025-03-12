import { type HNode, Input, Label, createComponent, createSemantic, style, style1 } from "@/main";

const DrawerTop = createSemantic("drawer");
const DrawerTitle = createSemantic("drawer-title");
const DrawerHeaderSpace = createSemantic("drawer-header-space");
const DrawerMenu = createSemantic("drawer-menu");

export const Drawer = createComponent<{ title: HNode; header_space: HNode; menu_button: HNode; main: HNode[] }>(
    (attribute) =>
        DrawerTop(
            { class: attribute.class },
            style({ overflow: "hidden" }),
            Input({ type: "checkbox", id: "drawer-toggle-button" }, [
                style1(["#drawer-toggle-button"], { display: "none" }),
            ]),
            DrawerTitle(
                {},
                style({
                    display: "flex",
                    justify_content: "space-between",
                    align_items: "center",
                }),
                attribute.title,
                DrawerHeaderSpace(
                    {},
                    style({
                        display: "flex",
                        gap: "1rem",
                        align_items: "center",
                    }),
                    attribute.header_space,
                    Label(
                        { class: "drawer-menu-open", for: "drawer-toggle-button" },
                        style({ cursor: "pointer" }),
                        attribute.menu_button,
                    ),
                ),
            ),
            DrawerMenu(
                {},
                [
                    style1("&", {
                        height: "0",
                        transition: ["height", "0.25s"],
                    }),
                    style1([["#drawer-toggle-button", ":checked"], "~", "&"], {
                        height: "calc-size(fit-content, size)",
                    }),
                ],
                ...attribute.main,
            ),
        )
);
