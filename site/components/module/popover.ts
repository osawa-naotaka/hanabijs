import { compoundStyle, element, registerComponent, style } from "@/main";
import type { HComponentFn, HNode, Store } from "@/main";
import { appearence } from "@site/config/site.config";

export type PopoverArgument = {
    open_button: HNode;
    close_button: HNode;
    body: HNode;
};

export function popover(store: Store, button_id: string): HComponentFn<PopoverArgument> {
    const Popover = element("popover");
    const PopoverButton = element("popover-button", { tag: "button" });
    const PopoverCloseArea = element("popover-close-area");
    const PopoverContainer = element("popover-container", { class_names: ["container"] });
    const PopoverContent = element("popover-content", { class_names: ["content"] });

    const styles = [
        style(Popover, {
            display: "flex",
            align_items: "center",
        }),
        style(PopoverContainer, {
            width: "100%",
            height: "100svh",
            padding_block: "1rem",
            background_color: appearence.color.background,
            border: ["0px", "none"],
            display: "none",
            opacity: "0",
            transition: ["all", "0.25s", "allow-discrete"],
        }),
        compoundStyle([[PopoverContainer, ":popover-open"]], {
            display: "flex",
            opacity: "1",
        }),
        style(PopoverButton, {
            border: ["0px", "none"],
            background: "none",
            cursor: "pointer",
        }),
        style(PopoverCloseArea, {
            display: "flex",
            justify_content: "flex-end",
            margin_block_end: "1rem",
        }),
    ];

    return registerComponent(
        store,
        Popover,
        styles,
        (argument) => () =>
            Popover({ class: argument.class })(
                PopoverButton({ type: "button", popovertarget: button_id })(argument.open_button),
                PopoverContainer({ popover: null, id: button_id })(
                    PopoverContent({})(
                        PopoverCloseArea({})(
                            PopoverButton({ type: "button", popovertarget: button_id })(argument.close_button),
                        ),
                        argument.body,
                    ),
                ),
            ),
    );
}
