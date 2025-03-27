import { BOLD, COLOR_ACCENT } from "@/lib/stylerules";
import { Em, compoundStyles, registerComponent, semantic, styles } from "@/main";
import type { HArgument, HComponentFn, Repository } from "@/main";
import { appearence } from "@site/config/site.config";

export function hero(repo: Repository): HComponentFn<HArgument> {
    const Hero = semantic("hero", { class_names: ["container"] });
    const HeroText = semantic("hero-text", { class_names: ["content"] });

    const component_styles = [
        styles(Hero, BOLD, [
            {
                font_size: "min(17vw, 7rem)",
                line_height: "1.2",
                margin_block_end: appearence.layout.space_block_large,
            },
        ]),
        compoundStyles([HeroText, " ", "em"], BOLD, COLOR_ACCENT),
    ];

    return registerComponent(
        repo,
        Hero,
        component_styles,
        () => () => Hero({})(HeroText({})("LULLIECA", Em({})("T"), " IS ", Em({})("A"), "LIVE")),
    );
}
