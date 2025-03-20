import { registerComponent, component, style } from "@/main";
import type { HComponentFn, Repository } from "@/main";
import { appearence } from "@site/config/site.config";

export type PageFooterArgument = {
    site_name: string;
};

export function pageFooter(repo: Repository): HComponentFn<PageFooterArgument> {
    registerComponent(repo, "page-footer", [
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

    const PageFooter = component("page-footer", { tag: "footer" });
    const PageFooterContent = component("page-footer-content");
    const PageFooterCopyright = component("page-footer-copyright");

    return ({ site_name }) => PageFooter({}, PageFooterContent({}), PageFooterCopyright({}, `&copy; 2025 ${site_name}`));
}
