import { BOLD, C_ACCENT, DEFAULT_RESPONSIVE_PAGE_WIDTH, TEXT_COLOR } from "@/lib/stylerules";
import { Em, element, registerComponent, style } from "@/main";
import type { HArgument, HComponentFn, Store } from "@/main";
import { appearence } from "@site/config/site.config";

export function hero(store: Store): HComponentFn<HArgument> {
    const Hero = element("hero");
    const HeroText = element("hero-text");

    const component_styles = [
        style(Hero, BOLD, {
            font_size: "min(17vw, 7rem)",
            line_height: "1.2",
            margin_block_end: appearence.layout.space_block_large,
        }),
        style(HeroText, DEFAULT_RESPONSIVE_PAGE_WIDTH(store)),
        style([HeroText, "em"], BOLD, TEXT_COLOR(C_ACCENT(store))),
    ];

    return registerComponent(
        store,
        Hero,
        component_styles,
        () => () => Hero({})(HeroText({})("LULLIECA", Em({})("T"), " IS ", Em({})("A"), "LIVE")),
    );
}
