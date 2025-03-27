import { A, H1, registerComponent, semantic, style } from "@/main";
import type { HComponentFn, Repository } from "@/main";
import { svgIcon } from "@site/components/element/svgIcon";
import { drawer } from "@site/components/module/drawer";
import { navigation } from "@site/components/module/navigation";
import { popover } from "@site/components/module/popover";
import { search } from "@site/components/module/search";
import { appearence } from "@site/config/site.config";

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

    const styles = [
        style(PageHeader, {
            position: "sticky",
            top: "0",
            left: "0",
            width: "100%",
            margin_block_end: "2rem",
            background_color: appearence.color.background,
            opacity: "0.8",
        }),
    ];

    return registerComponent(
        repo,
        PageHeader,
        styles,
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
