import { C_BG, C_PRIMARY, DEFAULT_COLUMN, DEFAULT_RESPONSIVE_PAGE_WIDTH, SWAP_MAIN_BG } from "@/lib/stylerules";
import { hButton, hLinkedButton } from "@/lib/ui/button";
import { Body, H2, Head, Html, Link, Main, Meta, Title, registerRootPage, styles } from "@/main";
import type { HArgument, HRootPageFn, Store } from "@/main";

export default function Root(store: Store): HRootPageFn<HArgument> {
    const color = {
        color: C_PRIMARY(store),
        background_color: C_BG(store),
    };

    const HFilledButton = hButton(store, "filled", SWAP_MAIN_BG(color));
    const HOutlinedButton = hButton(store, "outlined", color);
    const HTextButton = hButton(store, "text", color);

    const HLFilledButton = hLinkedButton(store, "filled", { padding: ["0.3rem", "0.5rem"] }, SWAP_MAIN_BG(color));
    const HLOutlinedButton = hLinkedButton(store, "outlined", color);
    const HLTextButton = hLinkedButton(store, "text", color);

    const page_styles = [styles(Body, DEFAULT_COLUMN(store)), styles(Main, DEFAULT_RESPONSIVE_PAGE_WIDTH(store))];

    return registerRootPage(store, "root-page", page_styles, async () =>
        Html({ lang: "en" })(
            Head({ class: "page-head" })(
                Meta({ charset: "utf-8" })(),
                Meta({
                    name: "viewport",
                    content: "width=device-width,initial-scale=1.0",
                })(),
                Link({ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" })(),
                Meta({ name: "generator", content: "template-engine" })(),

                Title({})("ui test"),
                Link({ rel: "stylesheet", href: "/assets/global.css" })(),
                // Link({ rel: "stylesheet", href: "/assets/ui.css" })(),
            ),
            Body({})(
                Main({})(
                    H2({})("Buttons"),
                    HFilledButton({})("BUTTON"),
                    HOutlinedButton({})("BUTTON"),
                    HTextButton({})("BUTTON"),
                    H2({})("Linked Buttons"),
                    HLFilledButton({ href: "#" })("LINK"),
                    HLOutlinedButton({ href: "#" })("LINK"),
                    HLTextButton({ href: "#" })("LINK"),
                ),
            ),
        ),
    );
}
