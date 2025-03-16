import { registerComponent } from "@/lib/repository";
import { Body, Html, style } from "@/main";
import type { Attribute, HNode } from "@/main";
import { appearence } from "@site/config/site.config";
import { pageFooter } from "../sections/pageFooter";
import { pageHeader } from "../sections/pageHeader";
import { PageHead } from "./PageHead";

export type PageAttribute = {
    title: string;
    description: string;
    lang: string;
    name: string;
    navitem: {
        url: string;
        icon: string;
    }[];
} & Attribute;

export function page(): (attribute: PageAttribute, ...child: HNode[]) => HNode {
    registerComponent("page", [
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

    const PageHeader = pageHeader();
    const PageFooter = pageFooter();
    return (attribute, ...child) =>
        Html(
            { lang: attribute.lang },
            PageHead(attribute),
            Body(
                { id: "top-of-page" },
                PageHeader({ title: attribute.name, navitem: attribute.navitem }),
                ...child,
                PageFooter({ site_name: attribute.name }),
            ),
        );
}
