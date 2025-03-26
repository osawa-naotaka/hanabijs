import { Div, Em } from "@/main";
import type { HArgument, HComponentFn } from "@/main";

export const Hero: HComponentFn<HArgument> = () => () =>
    Div({ class: ["responsive", "hero"] })(
        Div({ class: "hero-text" })("LULLIECA", Em({})("T"), " IS ", Em({})("A"), "LIVE"),
    );
