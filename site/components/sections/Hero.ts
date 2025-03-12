import { createComponent, createSemantic, Em, style, style1 } from "@/main";
import { appearence } from "@site/config/site.config";

const HeroTop = createSemantic("hero");
const HeroText = createSemantic("hero-text");

export const Hero = createComponent((attribute) =>
    HeroTop({ class: new Array("container", attribute.class || "") },
        style({
            font_size: "min(17vw, 7rem)",
            font_weight: "bold",
            line_height: "1.2",
            margin_block_end: appearence.layout.space_block_large
        }),
        HeroText({ class: "content" },
            [style1(["&", " ", "em"], {
                font_style: "normal",
                font_weight: "bold",
                color: appearence.color.accent
            })],
            "LULLIECA", Em({}, "T"), " IS ", Em({}, "A"),"LIVE"
        ),
    ),
);
