import {
    BG_COLOR,
    BORDER_NONE,
    CURSOR,
    C_BG,
    DEFAULT_COLUMN,
    DEFAULT_RESPONSIVE_PAGE_WIDTH,
    DEFAULT_ROW,
    DISPLAY,
    FLEX_END,
    FULL_WIDTH_HEIGHT,
    MARGIN_BLOCK,
    OPACITY,
    PADDING_BLOCK,
    S_MEDIUM,
    TRANSITION,
} from "@/lib/stylerules";
import { atStyle, component, element, registerComponent, style } from "@/main";
import type { HComponentFn, HNode, Store } from "@/main";

export type PopoverArgument = {
    open_button: HNode;
    close_button: HNode;
    body: HNode;
};

export function popover(store: Store, button_id: string): HComponentFn<PopoverArgument> {
    const Popover = element("popover");
    const PopoverButton = element("popover-button", { tag: "button" });
    const PopoverCloseArea = element("popover-close-area");
    const PopoverContainer = element("popover-container");
    const PopoverContent = element("popover-content");

    const styles = [
        style(PopoverContainer)(
            PADDING_BLOCK(S_MEDIUM(store)),
            FULL_WIDTH_HEIGHT,
            BG_COLOR(C_BG(store)),
            BORDER_NONE,
            OPACITY("0"),
            DISPLAY("none"),
            TRANSITION("all", "0.25s", "allow-discrete"),
        ),
        style([PopoverContainer, ":popover-open"])(DEFAULT_COLUMN(store), OPACITY("1")),
        atStyle(["@layer", "high"], ["@starting-style"])([PopoverContainer, ":popover-open"])(OPACITY("0")),
        style(PopoverContent)(DEFAULT_RESPONSIVE_PAGE_WIDTH(store)),
        style(PopoverButton)(BORDER_NONE, CURSOR("pointer")),
        style(PopoverCloseArea)(MARGIN_BLOCK("0", S_MEDIUM(store)), DEFAULT_ROW(store), FLEX_END),
    ];

    registerComponent(store, Popover, styles);

    return component(Popover)(
        (argument) => () =>
            Popover({})(
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
