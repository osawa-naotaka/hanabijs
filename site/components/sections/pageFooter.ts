import { Div, Footer } from "@/main";
import type { HComponentFn } from "@/main";

export type PageFooterArgument = {
    site_name: string;
};

export const PageFooter: HComponentFn<PageFooterArgument> =
    ({ site_name }) =>
    () =>
        Footer({ class: "page-footer" })(
            Div({ class: "page-footer-content" })(),
            Div({ class: "page-footer-copyright" })(`&copy; 2025 ${site_name}`),
        );
