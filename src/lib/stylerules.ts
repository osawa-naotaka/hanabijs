import type { Properties } from "./properties";
import type { Store } from "./repository";
import type { PropertyOf, StyleRule } from "./style";
import { atStyle } from "./style";

export const INIT_CSS: StyleRule[] = /* @__PURE__*/ [
    atStyle([["@layer", "base"]], "*", {
        margin: "0",
        padding: "0",
        box_sizing: "border-box",
    }),
    atStyle([["@layer", "base"]], "a", {
        text_decoration: "none",
        color: "inherit",
    }),
    {
        atrules: [["@layer", "base"]],
        selector: [["ul"], ["ol"], ["menu"]],
        properties: {
            list_style_type: "none",
        },
    },
    atStyle([["@layer", "base"]], "input", {
        width: "100%",
        border: ["0", "none"],
        outline: "none",
    }),
    {
        atrules: [["@layer", "base"]],
        selector: [["img"], ["svg"]],
        properties: {
            max_width: "100%",
            display: "block",
        },
    },
];

export function DEFAULT_STYLES(store: Store) {
    return [
        atStyle([["@layer", "base"]], ":root", {
            font_size: store.designrule.font.base_size,
            line_height: store.designrule.font.line_height,
            font_family: store.designrule.font.family.join(", "),
        }),
        atStyle([["@layer", "base"]], "body", DEFAULT_TEXT_BG(store)),
    ];
}

export const BOX_TEXT = (store: Store): Properties => ({
    ...DEFAULT_TEXT_BG(store),
    ...BORDER_NONE,
});

export const BOX_OUTLINED = (store: Store): Properties => ({
    ...DEFAULT_TEXT_BG(store),
    border: ["1px", "solid", MIX_BLACK(C_TEXT(store))(B_DARKER(store))],
});

export const BOX_TONAL = (store: Store): Properties => ({
    ...DEFAULT_TEXT_BG(store),
    border: ["1px", "solid", MIX_BLACK(C_TEXT(store))(B_DARKER(store))],
});

export function RESPONSIVE_PAGE_WIDTH(
    max_width: PropertyOf<"max_width">,
    padding_inline: PropertyOf<"padding_inline">,
): Properties {
    return {
        max_width,
        width: "100%",
        padding_inline,
        margin_inline: "auto",
    };
}

export function DEFAULT_RESPONSIVE_PAGE_WIDTH(store: Store): Properties {
    return RESPONSIVE_PAGE_WIDTH(W_MEDIUM(store), S_MEDIUM(store));
}

export const FULL_WIDTH_HEIGHT: Properties = {
    width: "100%",
    height: "100svh",
};

export const BORDER_NONE: Properties = {
    border: ["0px", "none"],
};

export function COLUMN(gap: PropertyOf<"gap">): Properties {
    return {
        display: "flex",
        flex_direction: "column",
        align_items: "center",
        gap,
    };
}

export function DEFAULT_COLUMN(store: Store): Properties {
    return COLUMN(S_MEDIUM(store));
}

export function ROW(gap: PropertyOf<"gap">): Properties {
    return {
        display: "flex",
        flex_direction: "row",
        align_items: "center",
        gap,
    };
}

export function DEFAULT_ROW(store: Store): Properties {
    return ROW(store.designrule.size.spacing.medium);
}

export const ALIGN_NOMAL: Properties = {
    align_items: "normal",
};

export const ALIGN_CENTER: Properties = {
    align_items: "center",
};

export const JUSTIFY_CENTER: Properties = {
    justify_content: "center",
};

export const ROW_WRAP: Properties = {
    flex_wrap: "wrap",
};

export const BORDER_UNDERLINE: Properties = {
    border_block_end: ["2px", "solid"],
    padding_block_end: "2px",
};

export const BORDER_LEFT_THIC: Properties = {
    border_inline_start: ["8px", "solid"],
    padding_block_end: "2px",
    padding_inline_start: "1rem",
};

export const TEXT_UNDERLINE: Properties = {
    text_decoration: ["underline", "2px"],
    text_underline_offset: "5px",
};

export const FIX_BOTTOM_STICKY: Properties = {
    position: "sticky",
    bottom: "0",
    left: "0",
    width: "100%",
};

export const FIX_BOTTOM: Properties = {
    position: "fixed",
    bottom: "0",
    left: "0",
    width: "100%",
};

export const FIX_TOP_STICKY: Properties = {
    position: "sticky",
    top: "0",
    left: "0",
    width: "100%",
};

export const FIX_TOP: Properties = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
};

export const TEXT_JUSTIFY: Properties = {
    overflow_wrap: "anywhere",
    text_align: "justify",
};

export const OPACITY = (opacity: PropertyOf<"opacity">): Properties => ({ opacity });

export const ROUND = (border_radius: PropertyOf<"border_radius">): Properties => ({ border_radius });

export const TEXT_ALIGN_CENTER: Properties = {
    text_align: "center",
};

export const ABSOLUTE_ANCHOR: Properties = {
    position: "relative",
};

export const LIST_DISC: Properties = {
    list_style_type: "disc",
};

export const LIST_DECIMAL: Properties = {
    list_style_type: "decimal",
};

// font
export const FONT_SIZE = (font_size: PropertyOf<"font_size">): Properties => ({ font_size });

export const LINE_HEIGHT = (line_height: PropertyOf<"line_height">): Properties => ({ line_height });

export const BOLD: Properties = {
    font_weight: "bold",
    font_style: "normal",
};

export const ITALIC: Properties = {
    font_style: "italic",
    font_weight: "normal",
};

// spacing
export const MARGIN_INLINE = (...n: string[]): Properties => ({ margin_inline: n });

export const MARGIN_BLOCK = (...n: string[]): Properties => ({ margin_block: n });

export const MARGIN = (...n: string[]): Properties => ({ margin: n });

export const MARGINA = (n: string | string[]): Properties => ({ margin: n });

export const MARGIN_LEFT = (margin_left: PropertyOf<"margin_left">): Properties => ({ margin_left });

export const MARGIN_RIGHT = (margin_right: PropertyOf<"margin_right">): Properties => ({ margin_right });

export const PADDING_INLINE = (...n: string[]): Properties => ({ padding_inline: n });

export const PADDING_BLOCK = (...n: string[]): Properties => ({ padding_block: n });

export const PADDING = (...n: string[]): Properties => ({ padding: n });

export const PADDINGA = (n: string | string[]): Properties => ({ padding: n });

export const WIDTH = (width: PropertyOf<"width">): Properties => ({ width });

export const HEIGHT = (height: PropertyOf<"height">): Properties => ({ height });

// color
export const TEXT_COLOR = (color: string): Properties => ({ color });

export const BG_COLOR = (background_color: string): Properties => ({ background_color });

export const MIX_WHITE = (color: string) => COLOR_MIX(color, "white");
export const MIX_BLACK = (color: string) => COLOR_MIX(color, "black");

// basic property settings
export const DISPLAY = (display: PropertyOf<"display">): Properties => ({ display });

export const CURSOR = (cursor: PropertyOf<"cursor">): Properties => ({ cursor });

export function TRANSITION(...n: string[]): Properties {
    return {
        transition: n,
    };
}

export const FLEX_END: Properties = {
    justify_content: "flex-end",
};

export const FLEX_WRAP: Properties = {
    flex_wrap: "wrap",
};

export const SPACE_BETWEEN: Properties = {
    justify_content: "space-between",
};

export function INVERT(n: string): Properties {
    return { filter: `invert(${n})` };
}

// shorthand from store
export const C_PRIMARY = (store: Store) => rgb(store.designrule.color.category.primary);
export const C_SECONDARY = (store: Store) => rgb(store.designrule.color.category.secondary);
export const C_ACCENT = (store: Store) => rgb(store.designrule.color.category.accent);
export const C_TEXT = (store: Store) => rgb(store.designrule.color.category.text);
export const C_BG = (store: Store) => rgb(store.designrule.color.category.background);
export const C_ERROR = (store: Store) => rgb(store.designrule.color.category.error);
export const C_INFO = (store: Store) => rgb(store.designrule.color.category.info);
export const C_SUCCESS = (store: Store) => rgb(store.designrule.color.category.success);
export const C_WARNING = (store: Store) => rgb(store.designrule.color.category.warning);

export const F_TINY = (store: Store) => store.designrule.size.font.tiny;
export const F_SMALL = (store: Store) => store.designrule.size.font.small;
export const F_MEDIUM = (store: Store) => store.designrule.size.font.medium;
export const F_LARGE = (store: Store) => store.designrule.size.font.large;
export const F_XLARGE = (store: Store) => store.designrule.size.font.xlarge;
export const F_2XLARGE = (store: Store) => store.designrule.size.font.x2large;
export const F_3XLARGE = (store: Store) => store.designrule.size.font.x3large;

export const S_TINY = (store: Store) => store.designrule.size.spacing.tiny;
export const S_SMALL = (store: Store) => store.designrule.size.spacing.small;
export const S_MEDIUM = (store: Store) => store.designrule.size.spacing.medium;
export const S_LARGE = (store: Store) => store.designrule.size.spacing.large;
export const S_XLARGE = (store: Store) => store.designrule.size.spacing.xlarge;
export const S_2XLARGE = (store: Store) => store.designrule.size.spacing.x2large;
export const S_3XLARGE = (store: Store) => store.designrule.size.spacing.x3large;

export const W_TINY = (store: Store) => store.designrule.size.width.tiny;
export const W_SMALL = (store: Store) => store.designrule.size.width.small;
export const W_MEDIUM = (store: Store) => store.designrule.size.width.medium;
export const W_LARGE = (store: Store) => store.designrule.size.width.large;
export const W_XLARGE = (store: Store) => store.designrule.size.width.xlarge;
export const W_2XLARGE = (store: Store) => store.designrule.size.width.x2large;
export const W_3XLARGE = (store: Store) => store.designrule.size.width.x3large;

export const B_LIGHTEST = (store: Store) => store.designrule.color.brightness.lightest;
export const B_LIGHTER = (store: Store) => store.designrule.color.brightness.light;
export const B_DARKER = (store: Store) => store.designrule.color.brightness.dark;
export const B_DARKEST = (store: Store) => store.designrule.color.brightness.darkest;

export function DEFAULT_TEXT_BG(store: Store): Properties {
    return {
        color: C_TEXT(store),
        background_color: C_BG(store),
    };
}

export function COLOR_MIX(color_a: string, color_b: string): (persent: string) => string {
    return (persent) => `color-mix(in srgb, ${color_a} ${persent}, ${color_b})`;
}

export function rgb(color: [number, number, number]): string {
    return `rgb(${color[0]} ${color[1]} ${color[2]})`;
}
