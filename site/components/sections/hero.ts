import { BOLD, C_ACCENT, DEFAULT_RESPONSIVE_PAGE_WIDTH, MARGIN_BLOCK, S_2XLARGE, TEXT_COLOR } from "@/lib/stylerules";
import { Em, component, element, registerComponent, style } from "@/main";
import type { HArgument, HComponentFn, Store } from "@/main";

export function hero(store: Store): HComponentFn<HArgument> {
    const Hero = element("hero");
    const HeroText = element("hero-text");

    const component_styles = [
        style(Hero, BOLD, MARGIN_BLOCK("0", S_2XLARGE(store)), {
            font_size: "min(17vw, 7rem)",
            line_height: "1.2",
        }),
        style(HeroText, DEFAULT_RESPONSIVE_PAGE_WIDTH(store)),
        style([HeroText, "em"], BOLD, TEXT_COLOR(C_ACCENT(store))),
    ];

    registerComponent(store, Hero, component_styles);

    return component(Hero, () => () => Hero({})(HeroText({})("LULLIECA", Em({})("T"), " IS ", Em({})("A"), "LIVE")));
}
