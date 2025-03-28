import { ABSOLUTE_ANCHOR, COLOR_INVERT, COLUMN, FIX_BOTTOM, TEXT_ALIGN_CENTER } from "@/lib/stylerules";
import { registerComponent, semantic, styles } from "@/main";
import type { HComponentFn, Store } from "@/main";

export type PageFooterArgument = {
    site_name: string;
};

export function pageFooter(store: Store): HComponentFn<PageFooterArgument> {
    const PageFooter = semantic("page-footer", { tag: "footer" });
    const PageFooterContent = semantic("page-footer-content");
    const PageFooterCopyright = semantic("page-footer-copyright");

    const component_styles = [
        styles(PageFooter, FIX_BOTTOM, COLOR_INVERT),
        styles(PageFooterContent, COLUMN(), ABSOLUTE_ANCHOR),
        styles(PageFooterCopyright, TEXT_ALIGN_CENTER),
    ];

    return registerComponent(
        store,
        PageFooter,
        component_styles,
        ({ site_name }) =>
            () =>
                PageFooter({})(PageFooterContent({})(), PageFooterCopyright({})(`© 2025 ${site_name}`)),
    );
}
