import { createComponent, createSemantic, rule } from "@/main";
import { appearence } from "@site/config/site.config";

const PageFooterTop = createSemantic("page-footer", "footer");
const PageFooterContent = createSemantic("page-footer-content");
const PageFooterCopyright = createSemantic("page-footer-copyright");

export const PageFooter = createComponent<{ site_name: string }>((attribute) =>
    PageFooterTop(
        { class: attribute.class },
        rule("&", {
            position: "fixed",
            bottom: "0",
            left: "0",
            width: "100%",
            background_color: appearence.color.main,
            color: appearence.color.background,
        }),
        PageFooterContent(
            {},
            rule("&", {
                position: "relative",
                max_width: appearence.layout.content_width,
                margin_inline: "auto",
            }),
        ),
        PageFooterCopyright({}, rule("&", { text_align: "center" }), `&copy; 2025 ${attribute.site_name}`),
    ),
);
