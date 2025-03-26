import { Body, Html } from "@/main";
import type { HComponentFn } from "@/main";
import { PageHead } from "@site/components/pages/PageHead";
import { PageFooter } from "@site/components/sections/PageFooter";
import { PageHeader } from "@site/components/sections/PageHeader";

export type PageArgument = {
    title: string;
    description: string;
    lang: string;
    name: string;
};

export const Page: HComponentFn<PageArgument> =
    ({ lang, name, title, description }) =>
    (...child) =>
        Html({ lang })(
            PageHead({ title, description })(),
            Body({})(PageHeader({ title: name })(), ...child, PageFooter({ site_name: name })()),
        );
