import { registerComponent } from "@/lib/repository";
import { createSemantic, createSimpleSemantic, createStyles } from "@/main";
import type { HNode } from "@/main";
import { appearence } from "@site/config/site.config";

export function pageFooter(): (attribute: { class?: string; site_name: string }) => HNode {
    registerComponent(
        "page-footer",
        createStyles(
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
    );

    const PageFooter = createSemantic("page-footer", "footer");
    const PageFooterContent = createSimpleSemantic("page-footer-content");
    const PageFooterCopyright = createSimpleSemantic("page-footer-copyright");

    return (attribute) =>
        PageFooter(attribute, PageFooterContent(), PageFooterCopyright(`&copy; 2025 ${attribute.site_name}`));
}
