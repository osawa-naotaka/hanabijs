import { element, registerRootPage, style, unionRecords } from "hanabijs/core";
import type { ColorKind, HArgument, HRootPageFn, Properties, Store } from "hanabijs/core";
import {
    BOLD,
    BORDER_RADIUS,
    BOX_ELEVATED,
    BOX_ELEVATED_EM_LIGHT,
    BOX_ELEVATED_EM_STRONG,
    BOX_FILLED,
    BOX_FILLED_EM_LIGHT,
    BOX_FILLED_EM_STRONG,
    BOX_OUTLINED,
    BOX_OUTLINED_EM_LIGHT,
    BOX_OUTLINED_EM_STRONG,
    BOX_TEXT,
    BOX_TEXT_EM_LIGHT,
    BOX_TEXT_EM_STRONG,
    BOX_TONAL,
    BOX_TONAL_EM_LIGHT,
    BOX_TONAL_EM_STRONG,
    CURSOR,
    DEFAULT_RESPONSIVE_PAGE_WIDTH,
    DEFAULT_STYLES,
    INIT_CSS,
    INLINE_FLEX,
    LINE_HEIGHT,
    OVERFLOW,
    PADDING,
    S_MEDIUM,
    S_SMALL,
    TRANSITION,
} from "hanabijs/core";

export default function Root(store: Store): HRootPageFn<HArgument> {
    const BText = element("b-text");
    const BOutlined = element("b-outlined");
    const BTonal = element("b-tonal");
    const BFilled = element("b-filled");
    const BElevated = element("b-elevated");

    const kind: ColorKind = "primary";

    const default_styles: Properties = unionRecords(
        INLINE_FLEX,
        PADDING(S_SMALL(store), S_MEDIUM(store)),
        BOLD,
        LINE_HEIGHT("1"),
        OVERFLOW("hidden"),
        BORDER_RADIUS("4px"),
        CURSOR("pointer"),
        TRANSITION("all", "0.25s", "ease-in-out"),
    );

    const page_styles = [
        INIT_CSS,
        DEFAULT_STYLES(store),
        style("main")(DEFAULT_RESPONSIVE_PAGE_WIDTH(store)),

        style(BText)(BOX_TEXT(store, kind), default_styles),
        style([BText, ":hover"])(BOX_TEXT_EM_LIGHT(store, kind)),
        style([BText, ":active"])(BOX_TEXT_EM_STRONG(store, kind)),

        style(BOutlined)(BOX_OUTLINED(store, kind), default_styles),
        style([BOutlined, ":hover"])(BOX_OUTLINED_EM_LIGHT(store, kind)),
        style([BOutlined, ":active"])(BOX_OUTLINED_EM_STRONG(store, kind)),

        style(BTonal)(BOX_TONAL(store, kind), default_styles),
        style([BTonal, ":hover"])(BOX_TONAL_EM_LIGHT(store, kind)),
        style([BTonal, ":active"])(BOX_TONAL_EM_STRONG(store, kind)),

        style(BFilled)(BOX_FILLED(store, kind), default_styles),
        style([BFilled, ":hover"])(BOX_FILLED_EM_LIGHT(store, kind)),
        style([BFilled, ":active"])(BOX_FILLED_EM_STRONG(store, kind)),

        style(BElevated)(BOX_ELEVATED(store, kind), default_styles),
        style([BElevated, ":hover"])(BOX_ELEVATED_EM_LIGHT(store, kind)),
        style([BElevated, ":active"])(BOX_ELEVATED_EM_STRONG(store, kind)),
    ];

    registerRootPage(store, page_styles);

    return async () => (
        <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1.0" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <meta name="generator" content="template-engine" />

                <title>ui test</title>
            </head>
            <body>
                <main>
                    <h2>Buttons</h2>
                    <BText>text</BText>
                    <BOutlined>outlined</BOutlined>
                    <BTonal>tonal</BTonal>
                    <BFilled>filled</BFilled>
                    <BElevated>elevated</BElevated>
                </main>
            </body>
        </html>
    );
}
