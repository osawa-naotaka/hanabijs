import { hSvgIconFont } from "@/lib/ui/svgIconFont";
import type { HSvgIconArg } from "@/lib/ui/svgIconFont";
import type { Attribute, HComponentFn, Store } from "@/main";
import { hash_djb2 } from "@/main";

export function hSvgIconStore(store: Store, icons: HSvgIconArg[]): HComponentFn<HSvgIconArg> {
    const icon_map = new Map<number, HComponentFn<Attribute>>();
    for (const icon of icons) {
        icon_map.set(hash_djb2(icon), hSvgIconFont(store, icon));
    }

    return (icon) => {
        const icon_fn = icon_map.get(hash_djb2(icon));
        if (icon_fn !== undefined) {
            return icon_fn({});
        }
        return "";
    };
}
