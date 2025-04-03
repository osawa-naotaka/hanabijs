import {
    ABSOLUTE_ANCHOR,
    BG_COLOR,
    C_BG,
    C_TEXT,
    DEFAULT_COLUMN,
    FIX_BOTTOM,
    TEXT_ALIGN_CENTER,
    TEXT_COLOR,
} from "@/lib/stylerules";
import { component, element, registerComponent, style } from "@/main";
import type { HComponentFn, Store } from "@/main";

export type PageFooterArgument = {
    site_name: string;
};

export function pageFooter(store: Store): HComponentFn<PageFooterArgument> {
    const PageFooter = element("page-footer", { tag: "footer" });
    const PageFooterContent = element("page-footer-content");
    const PageFooterCopyright = element("page-footer-copyright");

    const component_styles = [
        style(PageFooter, FIX_BOTTOM, TEXT_COLOR(C_BG(store)), BG_COLOR(C_TEXT(store))),
        style(PageFooterContent, DEFAULT_COLUMN(store), ABSOLUTE_ANCHOR),
        style(PageFooterCopyright, TEXT_ALIGN_CENTER),
    ];

    registerComponent(store, PageFooter, component_styles);

    return component(
        PageFooter,
        ({ site_name }) =>
            () =>
                PageFooter({})(PageFooterContent({})(), PageFooterCopyright({})(`© 2025 ${site_name}`)),
    );
}
