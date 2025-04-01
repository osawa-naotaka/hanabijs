import { hIcone } from "@/lib/ui/icon";
import { Span, element, registerComponent } from "@/main";
import type { HComponentFn, Store } from "@/main";

export type ShareXArgument = {
    title: string;
    url: string;
};

export function shareX(store: Store): HComponentFn<ShareXArgument> {
    const ShareX = element("share-x", { tag: "a" });
    const XIcon = hIcone({ type: "brands", name: "x-twitter" })({})();

    return registerComponent(store, ShareX, [], (argument) => () => {
        const href = `https://x.com/intent/tweet?text=${encodeURIComponent(argument.title)}&url=${encodeURIComponent(argument.url)}`;
        return ShareX({ href })(XIcon, Span({})("SHARE"));
    });
}
