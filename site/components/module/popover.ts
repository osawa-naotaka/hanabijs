import {
    type HComponentFn,
    type HNode,
    type Repository,
    compoundStyle,
    createSemantic,
    createSimpleSemantic,
    registerStyle,
    style,
} from "@/main";
import { appearence } from "@site/config/site.config";

export type PopoverAttribute = {
    open_button: HNode;
    close_button: HNode;
};

export function popover(repo: Repository, button_id: string): HComponentFn<PopoverAttribute> {
    registerStyle(repo, "popover", [
        style("&", {
            display: "flex",
            align_items: "center",
        }),
        style(".popover-container", {
            width: "100%",
            height: "100svh",
            padding_block: "1rem",
            background_color: appearence.color.background,
            border: ["0px", "none"],
            display: "none",
            opacity: "0",
            transition: ["all", "0.25s", "allow-discrete"],
        }),
        compoundStyle([[".popover-container", ":popover-open"]], {
            display: "flex",
            opacity: "1",
        }),
        style(".popover-button", {
            border: ["0px", "none"],
            background: "none",
            cursor: "pointer",
        }),
        style(".popover-close-area", {
            display: "flex",
            justify_content: "flex-end",
            margin_block_end: "1rem",
        }),
    ]);

    const Popover = createSemantic("popover");
    const PopoverButton = createSemantic("popover-button", { tag: "button" });
    const PopoverCloseArea = createSimpleSemantic("popover-close-area");
    const PopoverContainer = createSemantic("popover-container", { class_names: ["container"] });
    const PopoverContent = createSimpleSemantic("popover-content", { class_names: ["content"] });

    return (attribute, ...child) =>
        Popover(
            { class: attribute.class },
            PopoverButton({ type: "button", popovertarget: button_id }, attribute.open_button),
            PopoverContainer(
                { popover: null, id: button_id },
                PopoverContent(
                    PopoverCloseArea(
                        PopoverButton({ type: "button", popovertarget: button_id }, attribute.close_button),
                    ),
                    ...child,
                ),
            ),
        );
}
