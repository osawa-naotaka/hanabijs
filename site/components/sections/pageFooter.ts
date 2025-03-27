import { registerComponent, semantic, style } from "@/main";
import type { HComponentFn, Repository } from "@/main";
import { appearence } from "@site/config/site.config";

export type PageFooterArgument = {
    site_name: string;
};

export function pageFooter(repo: Repository): HComponentFn<PageFooterArgument> {
    const PageFooter = semantic("page-footer", { tag: "footer" });
    const PageFooterContent = semantic("page-footer-content");
    const PageFooterCopyright = semantic("page-footer-copyright");

    const styles = [
        style(PageFooter, {
            position: "fixed",
            bottom: "0",
            left: "0",
            width: "100%",
            background_color: appearence.color.main,
            color: appearence.color.background,
        }),
        style(PageFooterContent, {
            position: "relative",
            max_width: appearence.layout.content_width,
            margin_inline: "auto",
        }),
        style(PageFooterCopyright, {
            text_align: "center",
        }),
    ];

    return registerComponent(
        repo,
        PageFooter,
        styles,
        ({ site_name }) =>
            () =>
                PageFooter({})(PageFooterContent({})(), PageFooterCopyright({})(`© 2025 ${site_name}`)),
    );
}
