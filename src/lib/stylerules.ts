import type { Store } from "./repository";

export const CONTENT = {
    max_width: "var(--layout-content-width)",
    width: "100%",
    padding_inline: "var(--layout-content-padding)",
};

export const COLUMN = (gap = "var(--layout-space-block-large)") => ({
    display: "flex",
    flex_direction: "column",
    align_items: "center",
    gap,
});

export const ROW = (gap = "var(--layout-space-block-large)") => ({
    display: "flex",
    flex_direction: "row",
    align_items: "center",
    gap,
});

export const ALIGN_NOMAL = {
    align_items: "normal",
};

export const JUSTIFY_CENTER = {
    justify_content: "center",
};

export const ROW_WRAP = {
    flex_wrap: "wrap",
};

export const BORDER_UNDERLINE = {
    border_block_end: ["2px", "solid"],
    padding_block_end: "2px",
};

export const TEXT_UNDERLINE = {
    text_decoration: ["underline", "2px"],
    text_underline_offset: "5px",
};

export const FIX_BOTTOM_STICKY = {
    position: "sticky",
    bottom: "0",
    left: "0",
    width: "100%",
};

export const FIX_BOTTOM = {
    position: "fixed",
    bottom: "0",
    left: "0",
    width: "100%",
};

export const FIX_TOP_STICKY = {
    position: "sticky",
    top: "0",
    left: "0",
    width: "100%",
};

export const FIX_TOP = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
};

export const COLOR_INVERT = {
    color: "var(--color-background)",
    background_color: "var(--color-main)",
};

export const COLOR_DEFAULT = {
    color: "var(--color-main)",
    background_color: "var(--color-background)",
};

export const COLOR_ACCENT = {
    color: "var(--color-accent)",
    background_color: "var(--color-background)",
};

export const COLOR_HEADER = {
    color: "var(--color-header-ext)",
    background_color: "var(--color-header-background)",
};

export const TEXT_JUSTIFY = {
    overflow_wrap: "anywhere",
    text_align: "justify",
};

export const OPACITY = (n: string) => ({
    opacity: n,
});

export const ROUND = (n: string) => ({
    border_radius: n,
});

export const TEXT_ALIGN_CENTER = {
    text_align: "center",
};

export const ABSOLUTE_ANCHOR = {
    position: "relative",
};

export const BOLD = {
    font_weight: "bold",
    font_style: "normal",
};

export const ITALIC = {
    font_style: "italic",
    font_weight: "normal",
};

export const FONT_SIZE = (n: string) => ({
    font_size: n,
});

export const MARGIN_INLINE = (...n: string[]) => ({
    margin_inline: n,
});

export const MARGIN_BLOCK = (...n: string[]) => ({
    margin_block: n,
});

export const MARGIN = (...n: string[]) => ({
    margin: n,
});

export const MARGINA = (n: string | string[]) => ({
    margin: n,
});

export const MARGIN_LEFT = (n: string) => ({
    margin_left: n,
});

export const MARGIN_RIGHT = (n: string) => ({
    margin_right: n,
});

export const PADDING_INLINE = (...n: string[]) => ({
    padding_inline: n,
});

export const PADDING_BLOCK = (...n: string[]) => ({
    padding_block: n,
});

export const PADDING = (...n: string[]) => ({
    padding: n,
});
export const PADDINGA = (n: string | string[]) => ({
    padding: n,
});

export const WIDTH = (n: string) => ({
    width: n,
});

export const HEIGHT = (n: string) => ({
    height: n,
});

export const BACKGROUND_COLOR = (color: string) => ({
    background_color: color,
});

export const COLOR_MIX = (color_a: string, color_b: string) => (persent: string) =>
    `color-mix(in srgb, ${color_a} ${persent}, ${color_b})`;

export const SIZE_XS = "var(--font-size-xs)";
export const SIZE_SM = "var(--font-size-sm)";
export const SIZE_BASE = "var(--font-size-base)";
export const SIZE_L = "var(--font-size-l)";
export const SIZE_LG = "var(--font-size-lg)";
export const SIZE_XL = "var(--font-size-xl)";
export const SIZE_2XL = "var(--font-size-2xl)";
export const SIZE_3XL = "var(--font-size-3xl)";
export const SIZE_4XL = "var(--font-size-4xl)";
export const SIZE_5XL = "var(--font-size-5xl)";
export const SIZE_6XL = "var(--font-size-6xl)";

export type MainBgColor = {
    color: string;
    background_color: string;
};

export function SWAP_MAIN_BG(arg: MainBgColor): MainBgColor {
    return { color: arg.background_color, background_color: arg.color };
}

export const MIX_WHITE = (color: string) => COLOR_MIX(color, "white");
export const MIX_BLACK = (color: string) => COLOR_MIX(color, "black");

export function C_PRIMARY(store: Store): string {
    return toHex(store.designrule.color.main.primary.default);
}

export function C_SECONDARY(store: Store): string {
    return toHex(store.designrule.color.main.secondary.default);
}

export function C_ACCENT(store: Store): string {
    return toHex(store.designrule.color.main.accent.default);
}

export function C_TEXT(store: Store): string {
    return toHex(store.designrule.color.main.text.default);
}

export function C_BG(store: Store): string {
    return toHex(store.designrule.color.main.background.default);
}

export function C_ERROR(store: Store): string {
    return toHex(store.designrule.color.sub.error);
}

export function C_INFO(store: Store): string {
    return toHex(store.designrule.color.sub.info);
}

export function C_SUCCESS(store: Store): string {
    return toHex(store.designrule.color.sub.success);
}

export function C_WARNING(store: Store): string {
    return toHex(store.designrule.color.sub.warning);
}

export function toHex(n: number) {
    return `#${n.toString(16)}`;
}
