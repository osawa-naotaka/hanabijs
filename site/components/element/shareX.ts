import { registerComponent, semantic } from "@/main";
import type { HComponentFn, Store } from "@/main";
import { svgIcon } from "./svgIcon";

export type ShareXArgument = {
    title: string;
    url: string;
};

export function shareX(store: Store): HComponentFn<ShareXArgument> {
    const ShareX = semantic("share-x", { tag: "a" });
    const SvgIcon = svgIcon(store);

    return registerComponent(store, ShareX, [], (argument) => () => {
        const link = `https://x.com/intent/tweet?text=${encodeURIComponent(argument.title)}&url=${encodeURIComponent(argument.url)}`;

        return ShareX({ href: link, target: "__blank" })(SvgIcon({ name: "x-share" })());
    });
}
