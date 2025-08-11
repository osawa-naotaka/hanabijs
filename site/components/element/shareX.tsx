import { hSvgIconFont } from "@/lib/ui/svgIconFont";
import { TAG_DESIGN } from "@site/styles/design";
import { BG_COLOR, C_TEXT, DISPLAY, PADDING, ROW, S_SMALL, S_TINY, TEXT_COLOR } from "zephblaze/core";
import { as, component, element, registerComponent, style } from "zephblaze/core";
import type { HComponentFn, Store } from "zephblaze/core";

export type ShareXArgument = {
    title: string;
    url: string;
};

export function shareX(store: Store): HComponentFn<ShareXArgument> {
    const ShareX = element("share-x", { tag: "a" });
    const Text = element("share-x-text");
    const XIcon = as("share-x-icon", hSvgIconFont(store, { type: "brands", name: "x-twitter" }));

    const styles = [
        TAG_DESIGN(store, "background", ShareX),
        style(ShareX)(ROW("0"), PADDING("0"), BG_COLOR("transparent")),
        style(XIcon)(DISPLAY("block"), BG_COLOR(C_TEXT(store)), PADDING(S_TINY(store), S_SMALL(store))),
        style(Text)(PADDING(S_TINY(store), S_SMALL(store)), TEXT_COLOR(C_TEXT(store)), BG_COLOR("transparent"), {
            box_shadow: ["0", "0", "0", "2px", "inset"],
            border_radius: ["0", "4px", "4px", "0"],
        }),
    ];

    registerComponent(store, ShareX, styles);

    return component(ShareX, ({ title, url }) => {
        const href = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

        return (
            <ShareX href={href} target="__blank">
                <XIcon />
                <Text>SHARE</Text>
            </ShareX>
        );
    });
}
