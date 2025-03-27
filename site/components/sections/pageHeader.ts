import { COLOR_DEFAULT, FIX_TOP_STICKY, FONT_SIZE, OPACITY, SIZE_2XL } from "@/lib/stylerules";
import { A, H1, registerComponent, semantic, styles } from "@/main";
import type { HComponentFn, Repository } from "@/main";
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

export function pageHeader(repo: Repository): HComponentFn<PageHeaderArgument> {
    const PageHeader = semantic("page-header", { class_names: ["container"], tag: "header" });
    const Drawer = drawer(repo, "page-header-toggle-button");
    const Popover = popover(repo, "search-popover");
    const SvgIcon = svgIcon(repo);
    const Navigation = navigation(repo);
    const Search = search(repo);

    const component_styles = [
        styles(PageHeader, FIX_TOP_STICKY, COLOR_DEFAULT, OPACITY("0.8")),
        styles(H1, FONT_SIZE(SIZE_2XL)),
    ];

    return registerComponent(
        repo,
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
