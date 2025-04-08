import {
    BOLD,
    C_ACCENT,
    DEFAULT_RESPONSIVE_PAGE_WIDTH,
    FONT_SIZE,
    LINE_HEIGHT,
    MARGIN_BLOCK,
    S_2XLARGE,
    TEXT_COLOR,
} from "@/lib/stylerules";
import { component, element, registerComponent, style } from "@/main";
import type { HArgument, HComponentFn, Store } from "@/main";

export function hero(store: Store): HComponentFn<HArgument> {
    const Hero = element("hero");
    const HeroText = element("hero-text");

    const component_styles = [
        style(Hero)(BOLD, MARGIN_BLOCK("0", S_2XLARGE(store)), FONT_SIZE("min(17vw, 7rem)"), LINE_HEIGHT("1.2")),
        style(HeroText)(DEFAULT_RESPONSIVE_PAGE_WIDTH(store)),
        style(HeroText, "em")(BOLD, TEXT_COLOR(C_ACCENT(store))),
    ];

    registerComponent(store, Hero, component_styles);

    return component(Hero, () => (
        <Hero>
            <HeroText>
                LULLIECA<em>T</em> IS <em>A</em>LIVE
            </HeroText>
        </Hero>
    ));
}
