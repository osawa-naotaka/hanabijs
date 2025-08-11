import type { AssetConfig } from "@/cli/config";
import type { HComponentFn, HNode } from "@/lib/core/component";
import { default_design_rule } from "@/lib/core/design";
import type { DesignRule } from "@/lib/core/design";
import type { Selector, StyleRule } from "@/lib/core/style";

// zephblaze element data structure for register element to repository, internal use only.
export type HComponent = {
    component_name: string;
    style: StyleRule[];
    attachment?: HComponentAttachment;
};

export type HComponentAttachment = {
    script?: string;
    assets?: HComponentAsset[];
    inserts?: HComponentInsert[];
    fonts?: HIconFontCharacter[];
};

export type HComponentAsset = {
    package_name?: string;
    copy_files: {
        src: string;
        dist: string;
    }[];
};

export type HIconFontCharacter = {
    package_name?: string;
    chars: {
        src: string;
        name: string;
    }[];
};

export type HComponentInsert = {
    selector: Selector[];
    nodes: HNode[];
};

export type Store = {
    components: Map<string, HComponent>;
    designrule: DesignRule;
    asset: AssetConfig;
};

export function generateStore(asset: AssetConfig, rule: Partial<DesignRule> = {}): Store {
    return {
        components: new Map<string, HComponent>(),
        designrule: { ...default_design_rule, ...rule },
        asset,
    };
}

export function registerComponent<K>(
    store: Store,
    name_fn: HComponentFn<K> | string,
    raw_style: (StyleRule | StyleRule[])[],
    attachment?: HComponentAttachment,
): void {
    const component_name = typeof name_fn === "string" ? name_fn : name_fn.name;
    const style = raw_style.flatMap((x) => (Array.isArray(x) ? x : [x]));

    store.components.set(component_name, { component_name, style, attachment });
}

export function registerRootPage(
    store: Store,
    raw_style: (StyleRule | StyleRule[])[],
    attachment?: HComponentAttachment,
): void {
    const component_name = "zephblaze-root-page";
    const style = raw_style.flatMap((x) => (Array.isArray(x) ? x : [x]));

    store.components.set(component_name, { component_name, style, attachment });
}

export function clearStore(store: Store): void {
    store.components.clear();
}
