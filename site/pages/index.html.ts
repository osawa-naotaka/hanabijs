import { COLUMN, CONTENT } from "@/lib/stylerules";
import {
    HBUTTON,
    HBUTTON_BG_ACTIVE,
    HBUTTON_BG_HOVER,
    HBUTTON_FILLED,
    HBUTTON_FILLED_ACTIVE,
    HBUTTON_FILLED_HOVER,
    HBUTTON_OUTLINED,
    HBUTTON_TEXT,
} from "@/lib/ui";
import {
    Body,
    H2,
    Head,
    Html,
    Link,
    Main,
    Meta,
    Title,
    compoundStyles,
    registerRootPage,
    semantic,
    styles,
} from "@/main";
import type { HArgument, HRootPageFn, Repository } from "@/main";

export default function Root(repo: Repository): HRootPageFn<HArgument> {
    const HFilledButton = semantic("h-filled-button", { tag: "button" });
    const HOutlinedButton = semantic("h-outlined-button", { tag: "button" });
    const HTextButton = semantic("h-text-button", { tag: "button" });

    const page_styles = [
        styles(Body, COLUMN()),
        styles(Main, CONTENT),
        styles(HFilledButton, HBUTTON, HBUTTON_FILLED),
        compoundStyles([[HFilledButton, ":hover"]], HBUTTON_FILLED_HOVER),
        compoundStyles([[HFilledButton, ":active"]], HBUTTON_FILLED_ACTIVE),

        styles(HOutlinedButton, HBUTTON, HBUTTON_OUTLINED),
        compoundStyles([[HOutlinedButton, ":hover"]], HBUTTON_BG_HOVER),
        compoundStyles([[HOutlinedButton, ":active"]], HBUTTON_BG_ACTIVE),

        styles(HTextButton, HBUTTON, HBUTTON_TEXT),
        compoundStyles([[HTextButton, ":hover"]], HBUTTON_BG_HOVER),
        compoundStyles([[HTextButton, ":active"]], HBUTTON_BG_ACTIVE),
    ];

    return registerRootPage(repo, "root-page", page_styles, async () =>
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
                    H2({})("Button With Icon"),
                    HFilledButton({})("BUTTON"),
                    HOutlinedButton({})("BUTTON"),
                    HTextButton({})("BUTTON"),
                ),
            ),
        ),
    );
}
