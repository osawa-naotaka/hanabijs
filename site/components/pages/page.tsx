import { DEFAULT_STYLES, INIT_CSS } from "@/lib/stylerules";
import { component, registerComponent } from "@/main";
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

    registerComponent(store, "html", styles);

    return component("html")(({ lang, name, title, description, navitem }) => (...child) => (
        <html lang={lang}>
            <PageHead title={title} description={description} />
            <body>
                <PageHeader title={name} navitem={navitem} />
                {child}
                <PageFooter site_name={name} />
            </body>
        </html>
    ));
}
