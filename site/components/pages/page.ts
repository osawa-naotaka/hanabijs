import { Body, Html, registerComponent, style } from "@/main";
import type { HComponentFn, Repository } from "@/main";
import { pageHead } from "@site/components/pages/pageHead";
import { pageFooter } from "@site/components/sections/pageFooter";
import { pageHeader } from "@site/components/sections/pageHeader";
import { appearence } from "@site/config/site.config";

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

export function page(repo: Repository): HComponentFn<PageArgument> {
    registerComponent(repo, "page", [
        style("*", {
            margin: "0",
            padding: "0",
            box_sizing: "border-box",
        }),
        style("a", {
            text_decoration: "none",
            color: "inherit",
        }),
        {
            selectorlist: [["img"], ["svg"]],
            properties: {
                display: "block",
                max_width: "100%",
            },
        },
        style(":root", {
            font_size: "18px",
            font_family: [
                "'Helvetica Neue'",
                "Arial",
                "'Hiragino Kaku Gothic ProN'",
                "'Hiragino Sans'",
                "Meiryo",
                "sans-serif",
            ],
            line_height: "1.8",
        }),
        style("p", {
            text_indent: "1rem",
        }),
        style("body", {
            color: appearence.color.main,
            background_color: appearence.color.background,
        }),
        style(".container", {
            display: "flex",
            flex_direction: "column",
            align_items: "center",
            gap: appearence.layout.space_block_large,
        }),
        style(".content", {
            max_width: appearence.layout.content_width,
            width: "100%",
            padding_inline: appearence.layout.content_padding,
        }),
    ]);

    const PageHead = pageHead(repo);
    const PageHeader = pageHeader(repo);
    const PageFooter = pageFooter(repo);
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
