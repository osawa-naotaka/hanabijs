import { hIcon } from "@/lib/ui/icon";
import { Span, component, element } from "@/main";
import type { HComponentFn } from "@/main";

export type ShareXArgument = {
    title: string;
    url: string;
};

export function shareX(): HComponentFn<ShareXArgument> {
    const ShareX = element("share-x", { tag: "a" });
    const XIcon = hIcon()({ type: "brands", name: "x-twitter" })();

    return component(ShareX)(({ title, url }) => () => {
        const href = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        return ShareX({ href, target: "__blank" })(XIcon, Span({})("SHARE"));
    });
}
