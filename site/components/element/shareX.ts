import { BOLD, FONT_SIZE, F_SMALL, PADDING, S_SMALL, S_TINY } from "@/lib/stylerules";
import { hLinkedButton } from "@/lib/ui/button";
import { hIcone } from "@/lib/ui/icon";
import { Span } from "@/main";
import type { HComponentFn, Store } from "@/main";

export type ShareXArgument = {
    title: string;
    url: string;
};

export function shareX(store: Store): HComponentFn<ShareXArgument> {
    const ShareX = hLinkedButton(
        store,
        { type: "filled" },
        FONT_SIZE(F_SMALL(store)),
        BOLD,
        PADDING(S_TINY(store), S_SMALL(store)),
    );
    const XIcon = hIcone({ type: "brands", name: "x-twitter" })({})();

    return {
        ".share-x": (argument: ShareXArgument) => () => {
            const href = `https://x.com/intent/tweet?text=${encodeURIComponent(argument.title)}&url=${encodeURIComponent(argument.url)}`;
            return ShareX({ href })(XIcon, Span({})("SHARE"));
        },
    }[".share-x"];
}
