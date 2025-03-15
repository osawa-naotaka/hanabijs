import { Body, type HComponent, Html, createStyles } from "@/main";
import { appearence } from "@site/config/site.config";
import { PageFooter } from "../sections/PageFooter";
import { PageHeader } from "../sections/PageHeader";
import { PageHead } from "./PageHead";

export const Page: HComponent<{ title: string; description: string; lang: string; name: string }> = {
    name: "page",
    attribute: { class: "page" },
    style: createStyles(
        // reset CSS
        [
            [["*"]],
            {
                margin: "0",
                padding: "0",
                box_sizing: "border-box",
            },
        ],
        [
            [["a"]],
            {
                text_decoration: "none",
                color: "inherit",
            },
        ],
        [
            [["img"], ["svg"]],
            {
                display: "block",
                max_width: "100%",
            },
        ],

        // default page settings
        [
            [[":root"]],
            {
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
            },
        ],
        [
            [["p"]],
            {
                text_indent: "1rem",
            },
        ],
        [
            [["body"]],
            {
                color: appearence.color.main,
                background_color: appearence.color.background,
            },
        ],

        // container
        [
            [[".container"]],
            {
                display: "flex",
                flex_direction: "column",
                align_items: "center",
                gap: appearence.layout.space_block_large,
            },
        ],
        [
            [[".content"]],
            {
                max_width: appearence.layout.content_width,
                width: "100%",
                padding_inline: appearence.layout.content_padding,
            },
        ],
    ),
    using: [PageHead, PageHeader, PageFooter],
    dom_gen: (attribute, ...child) =>
        Html(
            { lang: attribute.lang },
            PageHead.dom_gen(attribute),
            Body(
                { id: "top-of-page" },
                PageHeader.dom_gen({ title: attribute.name }),
                ...child,
                PageFooter.dom_gen({ site_name: attribute.name }),
            ),
        ),
};
