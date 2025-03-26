import { Body, Html } from "@/main";
import type { HComponentFn } from "@/main";
import { PageHead } from "@site/components/pages/pageHead";
import { PageFooter } from "@site/components/sections/pageFooter";
import { PageHeader } from "@site/components/sections/pageHeader";

export type PageArgument = {
    title: string;
    description: string;
    lang: string;
    name: string;
    navitem: {
        url: string;
        icon: string;
    }[];
};

export const Page: HComponentFn<PageArgument> =
    ({ lang, name, title, description, navitem }) =>
    (...child) =>
        Html({ lang })(
            PageHead({ title, description })(),
            Body({ id: "top-of-page", class: ["light"] })(
                PageHeader({ title: name, navitem })(),
                ...child,
                PageFooter({ site_name: name })(),
            ),
        );
