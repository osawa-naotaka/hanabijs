import { addClassInRecord } from "../component";
import type { HComponentFn } from "../component";
import { A, Button } from "../elements";
import type { AAttribute, ButtonAttribute } from "../elements";
import { registerComponent } from "../repository";
import type { Store } from "../repository";
import { compoundStyles, styles } from "../style";
import type { StyleRule } from "../style";
import { BACKGROUND_COLOR, MIX_BLACK, MIX_WHITE } from "../stylerules";
import { hash_djb2 } from "../util";

export type HButtonType = "filled" | "outlined" | "text";
export type HButtonProperty = {
    color: string;
    background_color: string;
    padding: string | string[];
    font_size: string;
    font_weight: string;
    letter_spacing: string;
    line_height: string;
    border_radius: string;
};

const HBUTTON = (arg: HButtonProperty) => ({
    display: "inline-flex",
    align_items: "center",
    justify_content: "center",

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

const HBUTTON_FILLED_HOVER = (arg: HButtonProperty) => ({
    box_shadow: ["0px", "2px", "4px", "rgba(0, 0, 0, 0.3)"],
    ...BACKGROUND_COLOR(MIX_WHITE(arg.background_color)("85%")),
});

const HBUTTON_FILLED_ACTIVE = {
    box_shadow: ["0px", "4px", "8px", "rgba(0, 0, 0, 0.4)"],
};

const HBUTTON_OUTLINED = {
    border: ["1px", "solid", "rgba(0, 0, 0, 0.2)"],
};

const HBUTTON_BG_HOVER = (arg: HButtonProperty) => BACKGROUND_COLOR(MIX_BLACK(arg.background_color)("95%"));
const HBUTTON_BG_ACTIVE = (arg: HButtonProperty) => BACKGROUND_COLOR(MIX_BLACK(arg.background_color)("80%"));

const HBUTTON_TEXT = {
    border: "none",
};

const common_default = {
    color: "#000000",
    background_color: "#FFFFFF",
    padding: ["12px", "18px"],
    font_size: "1rem",
    font_weight: "normal",
    letter_spacing: "0.05rem",
    line_height: "1",
    border_radius: "4px",
};

export function hButton(
    store: Store,
    type: HButtonType,
    arg: Partial<HButtonProperty> = {},
): HComponentFn<Partial<ButtonAttribute>> {
    const arg_w: HButtonProperty = { ...common_default, ...arg };
    const component_name = `.h-button-${hash_djb2(arg_w)}`;
    const component_styles = buttonStyles(component_name, type, arg_w);

    return registerComponent(
        store,
        component_name,
        component_styles,
        (attribute) =>
            (...child) =>
                Button(addClassInRecord(attribute, component_name.slice(1)))(...child),
    );
}

export function hLinkedButton(
    store: Store,
    type: HButtonType,
    arg: Partial<HButtonProperty> = {},
): HComponentFn<Partial<AAttribute>> {
    const arg_w: HButtonProperty = { ...common_default, ...arg };
    const component_name = `.h-linked-button-${hash_djb2(arg_w)}`;
    const component_styles = buttonStyles(component_name, type, arg_w);

    return registerComponent(
        store,
        component_name,
        component_styles,
        (attribute) =>
            (...child) =>
                A(addClassInRecord(attribute, component_name.slice(1)))(...child),
    );
}

function buttonStyles(component_name: string, type: HButtonType, arg: HButtonProperty): StyleRule[] {
    const component_styles = [styles(component_name, HBUTTON(arg))];
    switch (type) {
        case "filled": {
            component_styles.push(
                styles(component_name, HBUTTON_FILLED),
                compoundStyles([[component_name, ":hover"]], HBUTTON_FILLED_HOVER(arg)),
                compoundStyles([[component_name, ":active"]], HBUTTON_FILLED_ACTIVE),
            );
            break;
        }
        case "outlined": {
            component_styles.push(
                styles(component_name, HBUTTON_OUTLINED),
                compoundStyles([[component_name, ":hover"]], HBUTTON_BG_HOVER(arg)),
                compoundStyles([[component_name, ":active"]], HBUTTON_BG_ACTIVE(arg)),
            );
            break;
        }
        case "text": {
            component_styles.push(
                styles(component_name, HBUTTON_TEXT),
                compoundStyles([[component_name, ":hover"]], HBUTTON_BG_HOVER(arg)),
                compoundStyles([[component_name, ":active"]], HBUTTON_BG_ACTIVE(arg)),
            );
            break;
        }
        default: {
            throw new Error(`HButton: illegal type ${type}.`);
        }
    }

    return component_styles;
}
