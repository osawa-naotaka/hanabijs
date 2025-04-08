import {
    DEFAULT_RESPONSIVE_PAGE_WIDTH,
    DEFAULT_TEXT_BG,
    FIX_TOP_STICKY,
    FONT_SIZE,
    F_3XLARGE,
    F_LARGE,
    OPACITY,
} from "@/lib/stylerules";
import { as, component, element, hIcon, registerComponent, style } from "@/main";
import type { HBrandIconName, HComponentFn, Store } from "@/main";
import { drawer } from "@site/components/module/drawer";
import { navigation } from "@site/components/module/navigation";
import { popover } from "@site/components/module/popover";
import { search } from "@site/components/module/search";

export type PageHeaderArgument = {
    title: string;
    navitem: {
        url: string;
        icon: HBrandIconName;
    }[];
};

export function pageHeader(store: Store): HComponentFn<PageHeaderArgument> {
    const PageHeader = element("page-header", { tag: "header" });
    const Drawer = drawer(store, "page-header-toggle-button");
    const Popover = popover(store, "search-popover");
    const Icon = as("page-header-icon", hIcon());
    const Navigation = navigation(store);
    const Search = search(store);

    const component_styles = [
        style(PageHeader)(FIX_TOP_STICKY, DEFAULT_TEXT_BG(store), OPACITY("0.8")),
        style(Drawer)(DEFAULT_RESPONSIVE_PAGE_WIDTH(store)),
        style("h1")(FONT_SIZE(F_3XLARGE(store))),
        style(Icon)(FONT_SIZE(F_LARGE(store))),
    ];

    registerComponent(store, PageHeader, component_styles);

    return component(PageHeader, ({ title, navitem }) => (
        <PageHeader>
            <Drawer
                title={
                    <h1>
                        <a href="/">{title}</a>
                    </h1>
                }
                header_space={
                    <Popover
                        open_button={<Icon type="solid" name="search" />}
                        close_button={<Icon type="solid" name="close" />}
                        body={<Search />}
                    />
                }
                open_button={<Icon type="solid" name="bars" />}
                content={<Navigation navitem={navitem} />}
            />
        </PageHeader>
    ));
}
