import { createComponent, H1, Header, A, style } from "@/main";
import { site } from "@site/config/site.config";
import { SVGIcon } from "../element/SVGIcon";

export const PageHeader = createComponent(() =>
    Header(
        { className: ["page-header", "container"] },
        style([[[[".page-header"]], { 
            position: "sticky",
            top: "0",
            left: "0",
            width: "100%",
            margin_block_end: "2rem"
        }]]),
        H1({},
            style([
                [[["h1"]], {
                    font_size: "2rem"
                }]
            ]),
            A({ href: "/" }, site.name),
        ),
        SVGIcon({ name: "menu-bar-icon" }),
    ),
);
