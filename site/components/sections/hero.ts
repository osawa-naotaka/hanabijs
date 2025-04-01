import { BOLD, C_ACCENT, TEXT_COLOR } from "@/lib/stylerules";
import { Em, compoundStyles, element, registerComponent, styles } from "@/main";
import type { HArgument, HComponentFn, Store } from "@/main";
import { appearence } from "@site/config/site.config";

export function hero(store: Store): HComponentFn<HArgument> {
    const Hero = element("hero", { class_names: ["container"] });
    const HeroText = element("hero-text", { class_names: ["content"] });

    const component_styles = [
        styles(Hero, BOLD, {
            font_size: "min(17vw, 7rem)",
            line_height: "1.2",
            margin_block_end: appearence.layout.space_block_large,
        }),
        compoundStyles([HeroText, "em"], BOLD, TEXT_COLOR(C_ACCENT(store))),
    ];

    return registerComponent(
        store,
        Hero,
        component_styles,
        () => () => Hero({})(HeroText({})("LULLIECA", Em({})("T"), " IS ", Em({})("A"), "LIVE")),
    );
}
