import { Div, Footer } from "@/main";
import type { HComponentFn } from "@/main";

export type PageFooterArgument = {
    site_name: string;
};

export const PageFooter: HComponentFn<PageFooterArgument> =
    ({ site_name }) =>
    () =>
        Footer({})(Div({})(`© 2025 ${site_name}`));
