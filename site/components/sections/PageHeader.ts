import { A, H1, Header } from "@/main";
import type { HComponentFn } from "@/main";
import { Navigation } from "@site/components/module/Navigation";

export type PageHeaderArgument = {
    title: string;
    navitem: {
        url: string;
        icon: string;
    }[];
};

export const PageHeader: HComponentFn<PageHeaderArgument> =
    ({ title, navitem }) =>
    () =>
        Header({})(H1({})(A({ href: "/" })(title)), Navigation({ navitem })());
