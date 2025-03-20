import {
    type HComponentFn,
    type HNode,
    type Repository,
    compoundStyle,
    registerComponent,
    semanticComponent,
    simpleSemanticComponent,
    style,
} from "@/main";
import { appearence } from "@site/config/site.config";

export type PopoverArgument = {
    open_button: HNode;
    close_button: HNode;
};

export function popover(repo: Repository, button_id: string): HComponentFn<PopoverArgument> {
    registerComponent(repo, "popover", [
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

    const Popover = semanticComponent("popover");
    const PopoverButton = semanticComponent("popover-button", { tag: "button" });
    const PopoverCloseArea = simpleSemanticComponent("popover-close-area");
    const PopoverContainer = semanticComponent("popover-container", { class_names: ["container"] });
    const PopoverContent = simpleSemanticComponent("popover-content", { class_names: ["content"] });

    return (attribute, ...child) =>
        Popover(
            { class: attribute.class },
            PopoverButton({ type: "button", popovertarget: button_id }, attribute.open_button),
            PopoverContainer(
                { popover: "", id: button_id },
                PopoverContent(
                    PopoverCloseArea(
                        PopoverButton({ type: "button", popovertarget: button_id }, attribute.close_button),
                    ),
                    ...child,
                ),
            ),
        );
}
