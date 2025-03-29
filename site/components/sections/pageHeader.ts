import { COLOR_DEFAULT, FIX_TOP_STICKY, FONT_SIZE, OPACITY, SIZE_2XL } from "@/lib/stylerules";
import { A, H1, element, registerComponent, styles } from "@/main";
import type { HComponentFn, Store } from "@/main";
import { svgIcon } from "@site/components/element/svgIcon";
import { drawer } from "@site/components/module/drawer";
import { navigation } from "@site/components/module/navigation";
import { popover } from "@site/components/module/popover";
import { search } from "@site/components/module/search";

export type PageHeaderArgument = {
    title: string;
    navitem: {
        url: string;
        icon: string;
    }[];
};

export function pageHeader(store: Store): HComponentFn<PageHeaderArgument> {
    const PageHeader = element("page-header", { class_names: ["container"], tag: "header" });
    const Drawer = drawer(store, "page-header-toggle-button");
    const Popover = popover(store, "search-popover");
    const SvgIcon = svgIcon(store);
    const Navigation = navigation(store);
    const Search = search(store);

    const component_styles = [
        styles(PageHeader, FIX_TOP_STICKY, COLOR_DEFAULT, OPACITY("0.8")),
        styles(H1, FONT_SIZE(SIZE_2XL)),
    ];

    return registerComponent(
        store,
        PageHeader,
        component_styles,
        ({ title, navitem }) =>
            () =>
                PageHeader({})(
                    Drawer({
                        class: "content",
                        title: H1({})(A({ href: "/" })(title)),
                        header_space: Popover({
                            open_button: SvgIcon({ name: "magnifier-glass" })(),
                            close_button: SvgIcon({ name: "close-button" })(),
                            body: Search({})(),
                        })(),
                        open_button: SvgIcon({ name: "menu-bar" })(),
                        content: Navigation({ navitem })(),
                    })(),
                ),
    );
}
