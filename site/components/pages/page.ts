import { Body, Html } from "@/main";
import type { HComponentFn, Store } from "@/main";
import { pageHead } from "@site/components/pages/pageHead";
import { pageFooter } from "@site/components/sections/pageFooter";
import { pageHeader } from "@site/components/sections/pageHeader";

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

export function page(store: Store): HComponentFn<PageArgument> {
    const PageHead = pageHead(store);
    const PageHeader = pageHeader(store);
    const PageFooter = pageFooter(store);

    return ({ lang, name, title, description, navitem }) =>
        (...child) =>
            Html({ lang })(
                PageHead({ title, description })(),
                Body({ id: "top-of-page" })(
                    PageHeader({ title: name, navitem })(),
                    ...child,
                    PageFooter({ site_name: name })(),
                ),
            );
}
