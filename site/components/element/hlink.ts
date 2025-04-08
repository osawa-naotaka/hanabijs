import type { AttributeOf, HComponentFn, Store } from "@/main";
import { LIGHTEST, TEXT_COLOR, TRANSITION, component, element, registerComponent, style } from "@/main";

export function hlink(store: Store): HComponentFn<Partial<AttributeOf<"a">>> {
    const Link = element("link", { tag: "a" });

    const styles = [
        style(Link)(TRANSITION("all", "0.25s", "ease-in-out")),
        style([Link, ":hover"])(TEXT_COLOR(LIGHTEST(store, "text"))),
    ];

    registerComponent(store, Link, styles);

    return component(Link, Link);
}
