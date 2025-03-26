import { A, Li, Nav, Ul } from "@/main";
import type { HComponentFn } from "@/main";
import { SvgIcon } from "@site/components/element/SvgIcon";

export type NavigationArgument = {
    navitem: {
        url: string;
        icon: string;
    }[];
};

export const Navigation: HComponentFn<NavigationArgument> = (argument) => () =>
    Nav({})(
        Ul({})(
            Li({})(A({ href: "/posts" })("blog")),
            ...argument.navitem.map((item) =>
                Li({})(A({ href: item.url, target: "__blank" })(SvgIcon({ name: item.icon })())),
            ),
        ),
    );
