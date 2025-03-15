import { Div, Footer, type HComponent, createStyles } from "@/main";
import { appearence } from "@site/config/site.config";

export const PageFooter: HComponent<{ class?: string; site_name: string }> = {
    name: "page-footer",
    attribute: {},
    style: createStyles(
        [
            [[".page-footer"]],
            {
                position: "fixed",
                bottom: "0",
                left: "0",
                width: "100%",
                background_color: appearence.color.main,
                color: appearence.color.background,
            },
        ],
        [
            [[".page-footer-content"]],
            {
                position: "relative",
                max_width: appearence.layout.content_width,
                margin_inline: "auto",
            },
        ],
        [
            [[".page-footer-copyright"]],
            {
                text_align: "center",
            },
        ],
    ),
    using: [],
    dom_gen: (attribute) =>
        Footer(
            { class: `page-footer ${attribute.class || ""}` },
            Div({ class: "page-footer-content" }),
            Div({ class: "page-footer-copyright" }, `&copy; 2025 ${attribute.site_name}`),
        ),
};
