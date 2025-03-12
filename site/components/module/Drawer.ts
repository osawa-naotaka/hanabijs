import { createComponent, Div, HNode, Input, Label, rule } from "@/main";

export const Drawer = createComponent<{ title: HNode, header_space: HNode, menu_button: HNode }>(({ title, header_space, menu_button }, _style, child) =>
    Div({ class: "drawer" },
        [rule([".drawer"], { overflow: "hidden" })],
        Input({ type: "checkbox", id: "toggle-button" },
            [rule(["#toggle-button"], { display: "none" })]
        ),
        Div({ class: "title" }, 
            [rule([".title"], { 
                display: "flex",
                justify_content: "space-between",
                align_items: "center",
            })],
            title,
            Div({ class: "header-space" }, 
                [rule([".header-space"], {
                    display: "flex", 
                    gap: "1rem",
                    align_items: "center",
                })],
                header_space,
                Label({ class: "menu-open", for: "toggle-button"}, [rule([".menu-open"], { cursor: "pointer" })], menu_button),
            ),
        ),
        Div({ class: "menu" }, [
            rule([".menu"], {
                height: "0",
                transition: ["height", "0.25s"],
            }),
            rule([["#toggle-button", ":checked"], "~", ".menu"], {
                height: "calc-size(fit-content, size)"
            })
        ], ...child)
    ),
);
