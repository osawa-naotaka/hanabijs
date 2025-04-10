import { hSvgIcon } from "@/lib/ui/svgIcon";
import type { HSvgIconArg } from "@/lib/ui/svgIcon";
import type { Attribute, HComponentFn, Store } from "@/main";
import { as, hash_djb2 } from "@/main";

export type HSvgIconStoreArg = {
    icon: HSvgIconArg;
};

export function hSvgIconStore(store: Store, icons: HSvgIconArg[]): HComponentFn<HSvgIconStoreArg> {
    const icon_map = new Map<number, HComponentFn<Attribute>>();
    for (const icon of icons) {
        icon_map.set(hash_djb2(icon), hSvgIcon(store, icon));
    }

    return ({ icon }) => {
        const icon_fn = icon_map.get(hash_djb2(icon));
        if (icon_fn !== undefined) {
            return as(`svg-icon-${icon.name}-${icon.type}`, icon_fn)({});
        }
        return "";
    };
}
