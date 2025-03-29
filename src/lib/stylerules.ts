import type { Store } from "./repository";

export function RESPONSIVE_PAGE_WIDTH(max_width: string, padding_inline: string) {
    return {
        max_width,
        width: "100%",
        padding_inline,
    };
}

export function DEFAULT_RESPONSIVE_PAGE_WIDTH(store: Store) {
    return {
        max_width: px(store.designrule.size.width.medium),
        width: "100%",
        padding_inline: px(store.designrule.size.spacing.medium),
    };
}

export function COLUMN(gap: string) {
    return {
        display: "flex",
        flex_direction: "column",
        align_items: "center",
        gap,
    };
}

export function DEFAULT_COLUMN(store: Store) {
    return COLUMN(px(store.designrule.size.spacing.medium));
}

export function ROW(gap: string) {
    return {
        display: "flex",
        flex_direction: "row",
        align_items: "center",
        gap,
    };
}

export function DEFAULT_ROW(store: Store) {
    return ROW(px(store.designrule.size.spacing.medium));
}

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

export const LIST_DISC = {
    list_style_type: "disc",
}

export const LIST_DECIMAL = {
    list_style_type: "decimal",
}

export const FONT_SIZE = (n: string) => ({ font_size: n });

export const MARGIN_INLINE = (...n: string[]) => ({ margin_inline: n });

export const MARGIN_BLOCK = (...n: string[]) => ({ margin_block: n });

export const MARGIN = (...n: string[]) => ({ margin: n });

export const MARGINA = (n: string | string[]) => ({ margin: n });

export const MARGIN_LEFT = (n: string) => ({ margin_left: n });

export const MARGIN_RIGHT = (n: string) => ({ margin_right: n });

export const PADDING_INLINE = (...n: string[]) => ({ padding_inline: n });

export const PADDING_BLOCK = (...n: string[]) => ({ padding_block: n });

export const PADDING = (...n: string[]) => ({ padding: n });
export const PADDINGA = (n: string | string[]) => ({ padding: n });

export const WIDTH = (n: string) => ({ width: n });

export const HEIGHT = (n: string) => ({ height: n });

export const TEXT_COLOR = (c: string) => ({ color: c });

export const BG_COLOR = (c: string) => ({ background_color: c });

export function DEFAULT_TEXT_BG(store: Store) {
    return {
        color: store.designrule.color.main.text.default,
        background_color: store.designrule.color.main.background.default,
    };
}

export function COLOR_MIX(color_a: string, color_b: string): (persent: string) => string {
    return (persent) => `color-mix(in srgb, ${color_a} ${persent}, ${color_b})`;
}

export type MainBgColor = {
    color: string;
    background_color: string;
};

export function SWAP_MAIN_BG(arg: MainBgColor): MainBgColor {
    return { color: arg.background_color, background_color: arg.color };
}

export const MIX_WHITE = (color: string) => COLOR_MIX(color, "white");
export const MIX_BLACK = (color: string) => COLOR_MIX(color, "black");

export const C_PRIMARY = (store: Store) => store.designrule.color.main.primary.default;
export const C_SECONDARY = (store: Store) => store.designrule.color.main.secondary.default;
export const C_ACCENT = (store: Store) => store.designrule.color.main.accent.default;
export const C_TEXT = (store: Store) => store.designrule.color.main.text.default;
export const C_BG = (store: Store) => store.designrule.color.main.background.default;
export const C_ERROR = (store: Store) => store.designrule.color.sub.error;
export const C_INFO = (store: Store) => store.designrule.color.sub.info;
export const C_SUCCESS = (store: Store) => store.designrule.color.sub.success;
export const C_WARNING = (store: Store) => store.designrule.color.sub.warning;

export const F_TINY = (store: Store) => px(store.designrule.size.font.tiny);
export const F_SMALL = (store: Store) => px(store.designrule.size.font.small);
export const F_MEDIUM = (store: Store) => px(store.designrule.size.font.medium);
export const F_LARGE = (store: Store) => px(store.designrule.size.font.large);
export const F_XLARGE = (store: Store) => px(store.designrule.size.font.xlarge);
export const F_2XLARGE = (store: Store) => px(store.designrule.size.font.x2large);
export const F_3XLARGE = (store: Store) => px(store.designrule.size.font.x3large);

export const S_TINY = (store: Store) => px(store.designrule.size.spacing.tiny);
export const S_SMALL = (store: Store) => px(store.designrule.size.spacing.small);
export const S_MEDIUM = (store: Store) => px(store.designrule.size.spacing.medium);
export const S_LARGE = (store: Store) => px(store.designrule.size.spacing.large);
export const S_XLARGE = (store: Store) => px(store.designrule.size.spacing.xlarge);
export const S_2XLARGE = (store: Store) => px(store.designrule.size.spacing.x2large);
export const S_3XLARGE = (store: Store) => px(store.designrule.size.spacing.x3large);

export function toHex(n: number) {
    return `#${n.toString(16)}`;
}

export function px(n: number) {
    return `${n}px`;
}
