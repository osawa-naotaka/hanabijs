import type { Properties } from "@/lib/properties";
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
} from "@/lib/stylerules";
import { Body, H2, Head, Html, Link, Main, Meta, Title, element, registerRootPage, style, unionRecords } from "@/main";
import type { ColorKind, HArgument, HRootPageFn, Store } from "@/main";

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
        style(Main, DEFAULT_RESPONSIVE_PAGE_WIDTH(store)),

        style(BText, BOX_TEXT(store, kind), default_styles),
        style([[BText, ":hover"]], BOX_TEXT_EM_LIGHT(store, kind)),
        style([[BText, ":active"]], BOX_TEXT_EM_STRONG(store, kind)),

        style(BOutlined, BOX_OUTLINED(store, kind), default_styles),
        style([[BOutlined, ":hover"]], BOX_OUTLINED_EM_LIGHT(store, kind)),
        style([[BOutlined, ":active"]], BOX_OUTLINED_EM_STRONG(store, kind)),

        style(BTonal, BOX_TONAL(store, kind), default_styles),
        style([[BTonal, ":hover"]], BOX_TONAL_EM_LIGHT(store, kind)),
        style([[BTonal, ":active"]], BOX_TONAL_EM_STRONG(store, kind)),

        style(BFilled, BOX_FILLED(store, kind), default_styles),
        style([[BFilled, ":hover"]], BOX_FILLED_EM_LIGHT(store, kind)),
        style([[BFilled, ":active"]], BOX_FILLED_EM_STRONG(store, kind)),

        style(BElevated, BOX_ELEVATED(store, kind), default_styles),
        style([[BElevated, ":hover"]], BOX_ELEVATED_EM_LIGHT(store, kind)),
        style([[BElevated, ":active"]], BOX_ELEVATED_EM_STRONG(store, kind)),
    ];

    registerRootPage(store, page_styles);

    return async () =>
        Html({ lang: "en" })(
            Head({ class: "page-head" })(
                Meta({ charset: "utf-8" })(),
                Meta({
                    name: "viewport",
                    content: "width=device-width,initial-scale=1.0",
                })(),
                Link({ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" })(),
                Meta({ name: "generator", content: "template-engine" })(),

                Title({})("ui test"),
            ),
            Body({})(
                Main({})(
                    H2({})("Buttons"),
                    BText({})("text"),
                    BOutlined({})("outlined"),
                    BTonal({})("tonal"),
                    BFilled({})("filled"),
                    BElevated({})("elevated"),
                ),
            ),
        );
}
