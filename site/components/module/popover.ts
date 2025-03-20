import { compoundStyle, registerComponent, semantic, style } from "@/main";
import type { HComponentFn, HNode, Repository } from "@/main";
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

    const Popover = semantic("popover");
    const PopoverButton = semantic("popover-button", { tag: "button" });
    const PopoverCloseArea = semantic("popover-close-area");
    const PopoverContainer = semantic("popover-container", { class_names: ["container"] });
    const PopoverContent = semantic("popover-content", { class_names: ["content"] });

    return (argument) =>
        (...child) =>
            Popover({ class: argument.class })(
                PopoverButton({ type: "button", popovertarget: button_id })(argument.open_button),
                PopoverContainer({ popover: "", id: button_id })(
                    PopoverContent({})(
                        PopoverCloseArea({})(
                            PopoverButton({ type: "button", popovertarget: button_id })(argument.close_button),
                        ),
                        ...child,
                    ),
                ),
            );
}
