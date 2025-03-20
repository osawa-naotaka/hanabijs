import { A, H1, registerComponent, simpleSemanticComponent, style } from "@/main";
import type { HComponentFn, Repository } from "@/main";
import { svgIcon } from "@site/components/element/svgIcon";
import { drawer } from "@site/components/module/drawer";
import { navigation } from "@site/components/module/navigation";
import { popover } from "../module/popover";
import { search } from "../module/search";

export type PageHeaderArgument = {
    title: string;
    navitem: {
        url: string;
        icon: string;
    }[];
};

export function pageHeader(repo: Repository): HComponentFn<PageHeaderArgument> {
    registerComponent(repo, "page-header", [
        style("&", {
            position: "sticky",
            top: "0",
            left: "0",
            width: "100%",
            margin_block_end: "2rem",
        }),
    ]);

    const Drawer = drawer(repo, "page-header-toggle-button");
    const Popover = popover(repo, "search-popover");
    const SvgIcon = svgIcon(repo);
    const Navigation = navigation(repo);
    const PageHeader = simpleSemanticComponent("page-header", { class_names: ["container"], tag: "header" });
    const Search = search(repo);

    return (argument) =>
        PageHeader(
            Drawer({
                class: "content",
                title: H1({}, A({ href: "/" }, argument.title)),
                header_space: Popover(
                    {
                        open_button: SvgIcon({ name: "magnifier-glass" }),
                        close_button: SvgIcon({ name: "close-button" }),
                    },
                    Search({}),
                ),
                open_button: SvgIcon({ name: "menu-bar" }),
                content: [Navigation(argument)],
            }),
        );
}
