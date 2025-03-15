import { registerComponent } from "@/lib/repository";
import { Div, Input, Label, createStyles } from "@/main";
import type { HNode } from "@/main";

type DrawerAttribute = {
    class?: string;
    title: HNode;
    header_space: HNode;
    menu_button: HNode;
    main: HNode[];
};

export function Drawer(attribute: DrawerAttribute): HNode {
    registerComponent(
        "drawer",
        createStyles(
            [
                [[".drawer"]],
                {
                    overflow: "hidden",
                },
            ],
            [
                [[".drawer-title"]],
                {
                    display: "flex",
                    justify_content: "space-between",
                    align_items: "center",
                },
            ],
            [
                [[".drawer-header-space"]],
                {
                    display: "flex",
                    gap: "1rem",
                    align_items: "center",
                },
            ],
            [
                [[".drawer-open-state"]],
                {
                    display: "none",
                },
            ],
            [
                [[".drawer-open-button"]],
                {
                    cursor: "pointer",
                },
            ],
            [
                [[".drawer-content"]],
                {
                    height: "0",
                    transition: ["height", "0.25s"],
                },
            ],
            [
                [[["#drawer-toggle-button", ":checked"], "~", ".drawer-content"]],
                {
                    height: "calc-size(fit-content, size)",
                },
            ],
        ),
    );

    return Div(
        { class: `drawer ${attribute.class || ""}` },
        Input({ class: "drawer-open-state", type: "checkbox", id: "drawer-toggle-button" }),
        Div(
            { class: "drawer-title" },
            attribute.title,
            Div(
                { class: "drawer-header-space" },
                attribute.header_space,
                Label({ class: "drawer-open-button", for: "drawer-toggle-button" }, attribute.menu_button),
            ),
        ),
        Div({ class: "drawer-content" }, ...attribute.main),
    );
}
