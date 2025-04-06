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
    const Top = element("popover");
    const Button = element("popover-button", { tag: "button" });
    const CloseArea = element("popover-close-area");
    const Container = element("popover-container");
    const Content = element("popover-content");

    const styles = [
        style(Container)(
            PADDING_BLOCK(S_MEDIUM(store)),
            FULL_WIDTH_HEIGHT,
            BG_COLOR(C_BG(store)),
            BORDER_NONE,
            OPACITY("0"),
            DISPLAY("none"),
            TRANSITION("all", "0.25s", "allow-discrete"),
        ),
        style([Container, ":popover-open"])(DEFAULT_COLUMN(store), OPACITY("1")),
        atStyle(["@layer", "high"], ["@starting-style"])([Container, ":popover-open"])(OPACITY("0")),
        style(Content)(DEFAULT_RESPONSIVE_PAGE_WIDTH(store)),
        style(Button)(BORDER_NONE, CURSOR("pointer")),
        style(CloseArea)(MARGIN_BLOCK("0", S_MEDIUM(store)), DEFAULT_ROW(store), FLEX_END),
    ];

    registerComponent(store, Top, styles);

    return component(Top)((argument) => () => (
        <Top>
            <Button type="button" popovertarget={button_id}>
                {argument.open_button}
            </Button>
            <Container popover={null} id={button_id}>
                <Content>
                    <CloseArea>
                        <Button type="button" popovertarget={button_id}>
                            {argument.close_button}
                        </Button>
                    </CloseArea>
                    {argument.body}
                </Content>
            </Container>
        </Top>
    ));
}
