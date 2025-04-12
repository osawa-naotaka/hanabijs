import {
    BOLD,
    BORDER_RADIUS,
    BORDER_UNDERLINE,
    BOX_FILLED,
    BOX_FILLED_EM_LIGHT,
    CURSOR,
    INLINE_FLEX,
    LINE_HEIGHT,
    OVERFLOW,
    PADDING,
    S_SMALL,
    S_TINY,
    TRANSITION,
    style,
} from "@/core";
import type { Selector, StyleRule } from "@/core";
import type { ColorKind, HComponentFn, Store } from "@/core";

export function TAG_DESIGN<T>(store: Store, kind: ColorKind, top: HComponentFn<T>): StyleRule[] {
    return [
        style(top)(BOX_FILLED(store, kind)),
        style(top)(
            INLINE_FLEX,
            BOLD,
            LINE_HEIGHT("1"),
            OVERFLOW("hidden"),
            BORDER_RADIUS("4px"),
            CURSOR("pointer"),
            TRANSITION("all", "0.25s", "ease-in-out"),
            PADDING(S_TINY(store), S_SMALL(store)),
        ),
        style([top, ":hover"])(BOX_FILLED_EM_LIGHT(store, kind)),
    ];
}

export function LINK_DESIGN(...sel: Selector[]): StyleRule[] {
    return [style(...sel)(BORDER_UNDERLINE)];
}
