import { Div, Footer } from "@/main";
import type { HComponentFn } from "@/main";

export type PageFooterArgument = {
    site_name: string;
};

export const PageFooter: HComponentFn<PageFooterArgument> =
    ({ site_name }) =>
    () =>
        Footer({ class: ["fixed", "secondary"] })(Div({ class: "center-align" })(`© 2025 ${site_name}`));
