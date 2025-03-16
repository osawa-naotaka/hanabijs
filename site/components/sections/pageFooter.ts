import { createSimpleSemantic, registerStyle, style } from "@/main";
import type { HComponentFn, Repository } from "@/main";
import { appearence } from "@site/config/site.config";

export type PageFooterAttribute = {
    site_name: string;
};

export function pageFooter(repo: Repository): HComponentFn<PageFooterAttribute> {
    registerStyle(repo, "page-footer", [
        style("&", {
            position: "fixed",
            bottom: "0",
            left: "0",
            width: "100%",
            background_color: appearence.color.main,
            color: appearence.color.background,
        }),
        style(".page-footer-content", {
            position: "relative",
            max_width: appearence.layout.content_width,
            margin_inline: "auto",
        }),
        style(".page-footer-copyright", {
            text_align: "center",
        }),
    ]);

    const PageFooter = createSimpleSemantic("page-footer", { tag: "footer" });
    const PageFooterContent = createSimpleSemantic("page-footer-content");
    const PageFooterCopyright = createSimpleSemantic("page-footer-copyright");

    return (attribute) => PageFooter(PageFooterContent(), PageFooterCopyright(`&copy; 2025 ${attribute.site_name}`));
}
