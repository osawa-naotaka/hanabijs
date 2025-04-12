import { hSvgIconFont } from "@/lib/ui/svgIconFont";
import { component, element } from "@/core";
import type { HComponentFn, Store } from "@/core";

export type ShareXArgument = {
    title: string;
    url: string;
};

export function shareX(store: Store): HComponentFn<ShareXArgument> {
    const ShareX = element("share-x", { tag: "a" });
    const XIcon = hSvgIconFont(store, { type: "brands", name: "x-twitter" });

    return component(ShareX, ({ title, url }) => {
        const href = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

        return (
            <ShareX href={href} target="__blank">
                <XIcon />
                <span>SHARE</span>
            </ShareX>
        );
    });
}
