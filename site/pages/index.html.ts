import { COLUMN, CONTENT, SWAP_MAIN_BG } from "@/lib/stylerules";
import { hButton, hLinkedButton } from "@/lib/ui/button";
import { Body, H2, Head, Html, Link, Main, Meta, Title, registerRootPage, styles } from "@/main";
import type { HArgument, HRootPageFn, Store } from "@/main";

export default function Root(store: Store): HRootPageFn<HArgument> {
    const color = { main: "var(--color-main)", background: "var(--color-background)" };

    const HFilledButton = hButton(store, { color: SWAP_MAIN_BG(color) });
    const HOutlinedButton = hButton(store, { type: "outlined" });
    const HTextButton = hButton(store, { type: "text" });

    const HLFilledButton = hLinkedButton(store, { color: SWAP_MAIN_BG(color), padding: ["0.3rem", "0.5rem"] });
    const HLOutlinedButton = hLinkedButton(store, { type: "outlined" });
    const HLTextButton = hLinkedButton(store, { type: "text" });

    const page_styles = [styles(Body, COLUMN()), styles(Main, CONTENT)];

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
