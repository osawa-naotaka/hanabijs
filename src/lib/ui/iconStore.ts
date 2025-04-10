import { hIcon } from "@/lib/ui/icon";
import type { HIconArg } from "@/lib/ui/icon";
import type { Attribute, HComponentFn, Store } from "@/main";
import { hash_djb2 } from "@/main";

export type HIconStoreArg = {
    icon: HIconArg;
};

export function hIconStore(store: Store, icons: HIconArg[]): HComponentFn<HIconStoreArg> {
    const icon_map = new Map<number, HComponentFn<Attribute>>();
    for (const icon of icons) {
        icon_map.set(hash_djb2(icon), hIcon(store, icon));
    }

    return ({ icon }) => {
        const icon_fn = icon_map.get(hash_djb2(icon));
        return icon_fn !== undefined ? icon_fn({}) : "";
    };
}
