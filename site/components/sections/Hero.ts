import { Div, Em, type HComponent, createStyles } from "@/main";
import { appearence } from "@site/config/site.config";

export const Hero: HComponent<{ class?: string }> = {
    name: "hero",
    attribute: {},
    style: createStyles(
        [
            [[".hero"]],
            {
                font_size: "min(17vw, 7rem)",
                font_weight: "bold",
                line_height: "1.2",
                margin_block_end: appearence.layout.space_block_large,
            },
        ],
        [
            [[".hero-text", " ", "em"]],
            {
                font_style: "normal",
                font_weight: "bold",
                color: appearence.color.accent,
            },
        ],
    ),
    using: [],
    dom_gen: (attribute) =>
        Div(
            { class: `hero container ${attribute.class || ""}` },
            Div({ class: "hero-text content" }, "LULLIECA", Em({}, "T"), " IS ", Em({}, "A"), "LIVE"),
        ),
};
