import { createSemantic, style, style1 } from "@/main";
import type { HComponentFn, HNode } from "@/main";

const DrawerTop = createSemantic("drawer", style({ overflow: "hidden" }));
const DrawerTitle = createSemantic(
    "drawer-title",
    style({
        display: "flex",
        justify_content: "space-between",
        align_items: "center",
    }),
);
const DrawerHeaderSpace = createSemantic(
    "drawer-header-space",
    style({
        display: "flex",
        gap: "1rem",
        align_items: "center",
    }),
);
const DrawerContent = createSemantic("drawer-content", [
    style1("&", {
        height: "0",
        transition: ["height", "0.25s"],
    }),
    style1([["#drawer-toggle-button", ":checked"], "~", "&"], {
        height: "calc-size(fit-content, size)",
    }),
]);
const DrawerOpenState = createSemantic("drawer-open-state", style({ display: "none" }), "input");
const DrawerOpenButton = createSemantic("drawer-open-button", style({ cursor: "pointer" }), "label");

type DrawerAttribute = {
    title: HNode;
    header_space: HNode;
    menu_button: HNode;
    main: HNode[];
};

export const Drawer: HComponentFn<{ class?: string } & DrawerAttribute> = (attribute) =>
    DrawerTop(
        { class: attribute.class || "" },
        DrawerOpenState({ type: "checkbox", id: "drawer-toggle-button" }),
        DrawerTitle(
            {},
            attribute.title,
            DrawerHeaderSpace(
                {},
                attribute.header_space,
                DrawerOpenButton({ class: "drawer-menu-open", for: "drawer-toggle-button" }, attribute.menu_button),
            ),
        ),
        DrawerContent({}, ...attribute.main),
    );
