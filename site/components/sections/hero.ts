import { Em, compoundStyle, registerComponent, semantic, style } from "@/main";
import type { HArgument, HComponentFn, Repository } from "@/main";
import { appearence } from "@site/config/site.config";

export function hero(repo: Repository): HComponentFn<HArgument> {
    registerComponent(repo, "hero", [
        style("&", {
            font_size: "min(17vw, 7rem)",
            font_weight: "bold",
            line_height: "1.2",
            margin_block_end: appearence.layout.space_block_large,
        }),
        compoundStyle([".hero-text", " ", "em"], {
            font_style: "normal",
            font_weight: "bold",
            color: appearence.color.accent,
        }),
    ]);

    const Hero = semantic("hero", { class_names: ["container"] });
    const HeroText = semantic("hero-text", { class_names: ["content"] });

    return () => Hero({}, HeroText({}, "LULLIECA", Em({}, "T"), " IS ", Em({}, "A"), "LIVE"));
}
