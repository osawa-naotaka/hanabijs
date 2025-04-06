import type { AttributeOf, HComponentFn, Store } from "@/main";
import { component, element, LIGHTEST, registerComponent, style, TEXT_COLOR, TRANSITION } from "@/main";

export function hlink(store: Store): HComponentFn<Partial<AttributeOf<"a">>> {
    const Top = element("link", { tag: "a" });

    const styles = [
        style([Top])(TRANSITION("all", "0.25s", "ease-in-out")),
        style([Top, ":hover"])(TEXT_COLOR(LIGHTEST(store, "text"))),
    ];

    registerComponent(store, Top, styles);

    return component(Top)(Top);
}
