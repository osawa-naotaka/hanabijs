import { type HComponentFn, createSemantic, style } from "@/main";
import { appearence } from "@site/config/site.config";

const PageFooterTop = createSemantic(
    "page-footer",
    style({
        position: "fixed",
        bottom: "0",
        left: "0",
        width: "100%",
        background_color: appearence.color.main,
        color: appearence.color.background,
    }),
    "footer",
);
const PageFooterContent = createSemantic(
    "page-footer-content",
    style({
        position: "relative",
        max_width: appearence.layout.content_width,
        margin_inline: "auto",
    }),
);

const PageFooterCopyright = createSemantic("page-footer-copyright", style({ text_align: "center" }));

export const PageFooter: HComponentFn<{ class?: string; site_name: string }> = (attribute) =>
    PageFooterTop(
        { class: attribute.class || "" },
        PageFooterContent({}),
        PageFooterCopyright({}, `&copy; 2025 ${attribute.site_name}`),
    );
