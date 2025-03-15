import { ComponentFn, Em, createSemantic, style, style1 } from "@/main";
import { appearence } from "@site/config/site.config";

const HeroTop = createSemantic<{ class: string | string[] }>("hero",
    style({
        font_size: "min(17vw, 7rem)",
        font_weight: "bold",
        line_height: "1.2",
        margin_block_end: appearence.layout.space_block_large,
    }));

const HeroText = createSemantic("hero-text",
    [
        style1(["&", " ", "em"], {
            font_style: "normal",
            font_weight: "bold",
            color: appearence.color.accent,
        }),
    ]);

export const Hero: ComponentFn<{ class?: string }> = (attribute) =>
    HeroTop(
        { class: "container " + (attribute.class || "") },
        HeroText(
            { class: "content" },
            "LULLIECA",
            Em({}, "T"),
            " IS ",
            Em({}, "A"),
            "LIVE",
        ),
    );
