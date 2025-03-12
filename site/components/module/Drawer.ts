import { createComponent, Div, HNode, Input, Label } from "@/main";

export const Drawer = createComponent<{ title: HNode, header_space: HNode, menu_button: HNode }>(({ title, header_space, menu_button }, _style, child) =>
    Div({ class: "drawer" },
        Input({ type: "checkbox", id: "toggle-button" }),
        Div({ class: "title" }, 
            title,
            Div({ class: "header-space" }, 
                header_space,
                Label({ class: "menu-open", for: "toggle-button"}, menu_button),
            ),
        ),
        Div({ class: "menu" }, ...child)
    ),
);
