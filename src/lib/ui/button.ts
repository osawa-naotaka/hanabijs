import { addClassInRecord, type HComponentFn } from "../component";
import { Button } from "../elements";
import type { ButtonAttribute } from "../elements";
import { registerComponent } from "../repository";
import type { Repository } from "../repository";
import { compoundStyles, styles } from "../style";
import { BACKGROUND_COLOR, COLOR_MIX, type MainBgColor } from "../stylerules";
import { hash_djb2 } from "../util";

const HBUTTON = (color: MainBgColor) => ({
    display: "inline-flex",
    border_radius: "4px",
    padding: ["12px", "18px"],

    font_size: "1rem",
    font_weight: "normal",
    letter_spacing: "0.05rem",

    color: color.main,
    background_color: color.background,

    align_items: "center",
    justif_content: "center",

    outline: "none",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",

    transition:
        "color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out",
});

const HBUTTON_FILLED = {
    border: "none",
    box_shadow: ["0px", "1px", "3px", "rgba(0, 0, 0, 0.2)"],
};

const HBUTTON_FILLED_HOVER = (color: MainBgColor) => ({
    box_shadow: ["0px", "2px", "4px", "rgba(0, 0, 0, 0.3)"],
    background_color: `color-mix(in srgb, ${color.background} 85%, white)`,
});

const HBUTTON_FILLED_ACTIVE = {
    box_shadow: ["0px", "4px", "8px", "rgba(0, 0, 0, 0.4)"],
};

const HBUTTON_OUTLINED = {
    border: ["1px", "solid", "rgba(0, 0, 0, 0.2)"],
};

const MIX_FG_BG = (color: MainBgColor) => COLOR_MIX(color.main, color.background);

const HBUTTON_BG_HOVER = (color: MainBgColor) => BACKGROUND_COLOR(MIX_FG_BG(color)("5%"));
const HBUTTON_BG_ACTIVE = (color: MainBgColor) => BACKGROUND_COLOR(MIX_FG_BG(color)("20%"));

const HBUTTON_TEXT = {
    border: "none",
};

export type HButtonArgument = {
    type: "filled" | "outlined" | "text";
    color: MainBgColor;
};

export function HButton(repo: Repository, arg: HButtonArgument): HComponentFn<Partial<ButtonAttribute>> {
    const component_name = `.h-button-${hash_djb2(arg)}`;
    const component_styles = [styles(component_name, HBUTTON(arg.color))];
    switch (arg.type) {
        case "filled": {
            component_styles.push(
                styles(component_name, HBUTTON_FILLED),
                compoundStyles([[component_name, ":hover"]], HBUTTON_FILLED_HOVER(arg.color)),
                compoundStyles([[component_name, ":active"]], HBUTTON_FILLED_ACTIVE));
            break;
        }
        case "outlined": {
            component_styles.push(
                styles(component_name, HBUTTON_OUTLINED),
                compoundStyles([[component_name, ":hover"]], HBUTTON_BG_HOVER(arg.color)),
                compoundStyles([[component_name, ":active"]], HBUTTON_BG_ACTIVE(arg.color)))
            break;
        }
        case "text": {
            component_styles.push(
                styles(component_name, HBUTTON_TEXT),
                compoundStyles([[component_name, ":hover"]], HBUTTON_BG_HOVER(arg.color)),
                compoundStyles([[component_name, ":active"]], HBUTTON_BG_ACTIVE(arg.color)))
            break;
        }
        default: {
            throw new Error(`HButton: illegal type ${arg.type}.`);
        }
    }

    return registerComponent(
        repo,
        component_name,
        component_styles,
        (attribute) =>
            (...child) =>
                Button(addClassInRecord(attribute, component_name.slice(1)))(...child),
    );
}
