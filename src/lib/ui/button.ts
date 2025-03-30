import { element } from "../component";
import type { HArgument, HComponentFn, HElementFn } from "../component";
import { registerElement } from "../repository";
import type { Store } from "../repository";
import { compoundStyles, styles } from "../style";
import type { Properties, StyleRule } from "../style";
import { BG_COLOR, C_BG, C_PRIMARY, MIX_BLACK, MIX_WHITE } from "../stylerules";
import { hash_djb2, joinAll } from "../util";

export type HButtonType = "filled" | "outlined" | "text";
export type HButtonArg = {
    type: HButtonType;
};

export function hButton(store: Store, arg: HButtonArg, ...prop: Properties[]): HElementFn<"button"> {
    const prop_w = joinAll({}, prop);
    const HButton = element(`h-button-${hash_djb2(arg, prop_w)}`, { tag: "button" });
    const element_styles = buttonStyles(HButton, arg.type, store, prop_w);

    return registerElement(store, HButton, element_styles);
}

export function hLinkedButton(store: Store, arg: HButtonArg, ...prop: Properties[]): HElementFn<"a"> {
    const prop_w = joinAll({}, prop);
    const HLinkedButton = element(`h-linked-button-${hash_djb2(arg, prop_w)}`, { tag: "a" });
    const element_styles = buttonStyles(HLinkedButton, arg.type, store, prop_w);

    return registerElement(store, HLinkedButton, element_styles);
}

type HButtonProperties = {
    color: string;
    background_color: string;
};

function buttonStyles<T extends HArgument>(
    top: HComponentFn<T>,
    type: HButtonType,
    store: Store,
    prop: Properties,
): StyleRule[] {
    const color: HButtonProperties = {
        color: type === "filled" ? C_BG(store) : C_PRIMARY(store),
        background_color: type === "filled" ? C_PRIMARY(store) : C_BG(store),
    };
    const component_styles = [styles(top, color, HBUTTON(prop))];
    switch (type) {
        case "filled": {
            component_styles.push(
                styles(top, HBUTTON_FILLED),
                compoundStyles([[top, ":hover"]], HBUTTON_FILLED_HOVER(color)),
                compoundStyles([[top, ":active"]], HBUTTON_FILLED_ACTIVE),
            );
            break;
        }
        case "outlined": {
            component_styles.push(
                styles(top, HBUTTON_OUTLINED),
                compoundStyles([[top, ":hover"]], HBUTTON_BG_HOVER(color)),
                compoundStyles([[top, ":active"]], HBUTTON_BG_ACTIVE(color)),
            );
            break;
        }
        case "text": {
            component_styles.push(
                styles(top, HBUTTON_TEXT),
                compoundStyles([[top, ":hover"]], HBUTTON_BG_HOVER(color)),
                compoundStyles([[top, ":active"]], HBUTTON_BG_ACTIVE(color)),
            );
            break;
        }
        default: {
            throw new Error(`HButton: illegal type ${type}.`);
        }
    }

    return component_styles;
}

const HBUTTON = (arg: Properties) => ({
    display: "inline-flex",
    align_items: "center",
    justify_content: "center",

    padding: ["12px", "18px"],
    font_size: "1rem",
    font_weight: "normal",
    letter_spacing: "0.05rem",
    line_height: "1",
    border_radius: "4px",

    outline: "none",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",

    transition:
        "color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out",
    ...arg,
});

const HBUTTON_FILLED = {
    border: "none",
    box_shadow: ["0px", "1px", "3px", "rgba(0, 0, 0, 0.2)"],
};

const HBUTTON_FILLED_HOVER = (arg: HButtonProperties) => ({
    box_shadow: ["0px", "2px", "4px", "rgba(0, 0, 0, 0.3)"],
    ...BG_COLOR(MIX_WHITE(arg.background_color)("85%")),
});

const HBUTTON_FILLED_ACTIVE = {
    box_shadow: ["0px", "4px", "8px", "rgba(0, 0, 0, 0.4)"],
};

const HBUTTON_OUTLINED = {
    border: ["1px", "solid", "rgba(0, 0, 0, 0.2)"],
};

const HBUTTON_TEXT = {
    border: "none",
};

const HBUTTON_BG_HOVER = (arg: HButtonProperties) => BG_COLOR(MIX_BLACK(arg.background_color)("95%"));
const HBUTTON_BG_ACTIVE = (arg: HButtonProperties) => BG_COLOR(MIX_BLACK(arg.background_color)("80%"));
