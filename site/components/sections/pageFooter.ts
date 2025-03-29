import { ABSOLUTE_ANCHOR, COLOR_INVERT, COLUMN, FIX_BOTTOM, TEXT_ALIGN_CENTER } from "@/lib/stylerules";
import { element, registerComponent, styles } from "@/main";
import type { HComponentFn, Store } from "@/main";

export type PageFooterArgument = {
    site_name: string;
};

export function pageFooter(store: Store): HComponentFn<PageFooterArgument> {
    const PageFooter = element("page-footer", { tag: "footer" });
    const PageFooterContent = element("page-footer-content");
    const PageFooterCopyright = element("page-footer-copyright");

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
