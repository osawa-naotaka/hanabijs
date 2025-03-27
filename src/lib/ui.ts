import { BACKGROUND_COLOR, COLOR_MIX } from "./stylerules";

export const HBUTTON = {
    display: "inline-flex",
    border_radius: "4px",
    padding: ["12px", "18px"],

    font_size: "1rem",
    font_weight: "normal",
    letter_spacing: "0.05rem",

    align_items: "center",
    justif_content: "center",

    outline: "none",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",

    transition:
        "color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out",
};

export const HBUTTON_FILLED = {
    border: "none",
    background_color: "var(--color-main)",
    color: "var(--color-background)",
    box_shadow: ["0px", "1px", "3px", "rgba(0, 0, 0, 0.2)"],
};

export const HBUTTON_FILLED_HOVER = {
    box_shadow: ["0px", "2px", "4px", "rgba(0, 0, 0, 0.3)"],
    background_color: "color-mix(in srgb, var(--color-main) 85%, white)",
};

export const HBUTTON_FILLED_ACTIVE = {
    box_shadow: ["0px", "4px", "8px", "rgba(0, 0, 0, 0.4)"],
};

export const HBUTTON_OUTLINED = {
    border: ["1px", "solid", "rgba(0, 0, 0, 0.2)"],
};

const MIX_FG_BG = COLOR_MIX("var(--color-main)", "var(--color-background)");

export const HBUTTON_BG_HOVER = BACKGROUND_COLOR(MIX_FG_BG("5%"));
export const HBUTTON_BG_ACTIVE = BACKGROUND_COLOR(MIX_FG_BG("20%"));

export const HBUTTON_TEXT = {
    border: "none",
};
