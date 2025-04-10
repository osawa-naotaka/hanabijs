import {
    DEFAULT_RESPONSIVE_PAGE_WIDTH,
    DEFAULT_TEXT_BG,
    FIX_TOP_STICKY,
    FONT_SIZE,
    F_3XLARGE,
    F_LARGE,
    OPACITY,
} from "@/lib/stylerules";
import { A, H1, as, component, element, hIcon, registerComponent, style } from "@/main";
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
    const OpenButton = as("page-header-open-button", hIcon());
    const CloseButton = as("page-header-close-button", hIcon());
    const MenuButton = as("page-header-menu-button", hIcon());
    const Navigation = navigation(store);
    const Search = search(store);

    const component_styles = [
        style(PageHeader)(FIX_TOP_STICKY, DEFAULT_TEXT_BG(store), OPACITY("0.8")),
        style(Drawer)(DEFAULT_RESPONSIVE_PAGE_WIDTH(store)),
        style(H1)(FONT_SIZE(F_3XLARGE(store))),
        style(OpenButton)(FONT_SIZE(F_LARGE(store))),
        style(MenuButton)(FONT_SIZE(F_LARGE(store))),
    ];

    registerComponent(store, PageHeader, component_styles);

    return component(PageHeader)(
        ({ title, navitem }) =>
            () =>
                PageHeader({})(
                    Drawer({
                        title: H1({})(A({ href: "/" })(title)),
                        header_space: Popover({
                            open_button: OpenButton({ type: "solid", name: "search" })(),
                            close_button: CloseButton({ type: "solid", name: "close" })(),
                            body: Search({})(),
                        })(),
                        open_button: MenuButton({ type: "solid", name: "bars" })(),
                        content: Navigation({ navitem })(),
                    })(),
                ),
    );
}
