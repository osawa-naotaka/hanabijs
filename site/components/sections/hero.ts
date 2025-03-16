import { registerComponent } from "@/lib/repository";
import { Em, createSemantic, createSimpleSemantic, createStyles } from "@/main";
import type { HNode } from "@/main";
import { appearence } from "@site/config/site.config";

export function hero(): (attribute: { class?: string }) => HNode {
    registerComponent(
        "hero",
        createStyles(
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
    );

    const Hero = createSemantic(["hero", "container"]);
    const HeroText = createSimpleSemantic(["hero-text", "content"]);

    return (attribute) => Hero(attribute, HeroText("LULLIECA", Em({}, "T"), " IS ", Em({}, "A"), "LIVE"));
}
