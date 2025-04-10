import { DEFAULT_STYLES, INIT_CSS } from "@/lib/stylerules";
import { Body, Html, component, registerComponent } from "@/main";
import type { HBrandIconName, HComponentFn, Store } from "@/main";
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
        icon: HBrandIconName;
    }[];
};

export function page(store: Store): HComponentFn<PageArgument> {
    const PageHead = pageHead();
    const PageHeader = pageHeader(store);
    const PageFooter = pageFooter(store);

    const styles = [INIT_CSS, DEFAULT_STYLES(store)];

    registerComponent(store, Html, styles);

    return component(Html)(
        ({ lang, name, title, description, navitem }) =>
            (...child) =>
                Html({ lang })(
                    PageHead({ title, description })(),
                    Body({ id: "top-of-page" })(
                        PageHeader({ title: name, navitem })(),
                        ...child,
                        PageFooter({ site_name: name })(),
                    ),
                ),
    );
}
