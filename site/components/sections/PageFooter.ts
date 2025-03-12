import { createComponent, Div, Footer, rule } from "@/main";
import { appearence } from "@site/config/site.config";

export const PageFooter = createComponent<{ site_name: string }>((attribute) => 
    Footer({ class: "page-footer" },
        [rule([".page-footer"], {
            position: "fixed",
            bottom: "0",
            left: "0",
            width: "100%",
            background_color: appearence.color.main,
            color: appearence.color.background,
    })],
        Div({ class: "page-footer-content" },
            [rule([".page-footer-content"], {
                position: "relative",
                max_width: appearence.layout.content_width,
                margin_inline: "auto",
            })]            
        ),
        Div({ class: "page-footer-copyright" },
            [rule([".page-footer-copyright"], {
                text_align: "center",
            })],
            `&copy; 2025 ${attribute.site_name}`
        ),
    )
);
