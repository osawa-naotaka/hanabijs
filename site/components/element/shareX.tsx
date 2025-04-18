import { hSvgIconFont } from "@/lib/ui/svgIconFont";
import { DISPLAY, ROW, S_SMALL, component, element, registerComponent, style } from "hanabijs/core";
import type { HComponentFn, Store } from "hanabijs/core";

export type ShareXArgument = {
    title: string;
    url: string;
};

export function shareX(store: Store): HComponentFn<ShareXArgument> {
    const ShareX = element("share-x", { tag: "a" });
    const Text = element("share-x-text");
    const XIcon = hSvgIconFont(store, { type: "brands", name: "x-twitter" });

    const styles = [style(ShareX)(ROW(S_SMALL(store))), style(XIcon)(DISPLAY("block"))];

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
