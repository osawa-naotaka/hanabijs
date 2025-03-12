import { type HNode, Input, Label, createComponent, createSemantic, rule, rule1 } from "@/main";

const DrawerTop = createSemantic("drawer");
const DrawerTitle = createSemantic("drawer-title");
const DrawerHeaderSpace = createSemantic("drawer-header-space");
const DrawerMenu = createSemantic("drawer-menu");

export const Drawer = createComponent<{ title: HNode; header_space: HNode; menu_button: HNode; main: HNode[] }>(
    (attribute, _style) =>
        DrawerTop(
            { class: attribute.class },
            rule("&", { overflow: "hidden" }),
            Input(
                { type: "checkbox", id: "drawer-toggle-button" },
                rule(["#drawer-toggle-button"], { display: "none" }),
            ),
            DrawerTitle(
                {},
                rule("&", {
                    display: "flex",
                    justify_content: "space-between",
                    align_items: "center",
                }),
                attribute.title,
                DrawerHeaderSpace(
                    {},
                    rule("&", {
                        display: "flex",
                        gap: "1rem",
                        align_items: "center",
                    }),
                    attribute.header_space,
                    Label(
                        { class: "drawer-menu-open", for: "drawer-toggle-button" },
                        rule("&", { cursor: "pointer" }),
                        attribute.menu_button,
                    ),
                ),
            ),
            DrawerMenu(
                {},
                [
                    rule1("&", {
                        height: "0",
                        transition: ["height", "0.25s"],
                    }),
                    rule1([["#drawer-toggle-button", ":checked"], "~", ".drawer-menu"], {
                        height: "calc-size(fit-content, size)",
                    }),
                ],
                ...attribute.main,
            ),
        ),
);
