import { createComponent, H1, Header, A, style, Div } from "@/main";
import { site } from "@site/config/site.config";
import { SVGIcon } from "../element/SVGIcon";
import { Drawer } from "../module/Drawer";
import { Navigation } from "../module/Navigation";

export const PageHeader = createComponent(() =>
    Header(
        { class: ["page-header", "container"] },
        style([[[[".page-header"]], { 
            position: "sticky",
            top: "0",
            left: "0",
            width: "100%",
            margin_block_end: "2rem"
        }]]),
        Div({ class: "content" },
            Drawer({
                    title: H1({},
                        style([
                            [[["h1"]], {
                                font_size: "2rem"
                            }]
                        ]),
                        A({ href: "/" }, site.name),
                    ),

                    header_space: "",
                    
                    menu_button: SVGIcon({ name: "menu-bar" }),
                },
                Navigation({}),
            ),
        ),
    ),
);
