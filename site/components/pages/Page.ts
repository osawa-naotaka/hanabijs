import { Body, createSemantic, createStyles } from "@/main";
import type { ComponentFn } from "@/main";
import { appearence, site } from "@site/config/site.config";
import { PageFooter } from "../sections/PageFooter";
import { PageHeader } from "../sections/PageHeader";
import { PageHead } from "./PageHead";

const PageTop = createSemantic("html",
    createStyles(
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
                    "Helvetica Neue",
                    "Arial",
                    "Hiragino Kaku Gothic ProN",
                    "Hiragino Sans",
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
    "html"
);

export const Page: ComponentFn<{ title: string }> = (attribute, ...child) =>
    PageTop(
        { lang: site.lang },
        PageHead(attribute),
        Body({ id: "top-of-page" }, PageHeader({ title: site.name }), ...child, PageFooter({ site_name: site.name })),
    );
