import type { AssetConfig } from "@/cli/config";
import type { HComponentFn, HComponentFnArg, HNode } from "./component";
import { default_design_rule } from "./design";
import type { DesignRule } from "./design";
import type { Selector, StyleRule } from "./style";

// hanabi element data structure for register element to repository, internal use only.
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

export function component<K, T>(name_fn: HComponentFn<K> | string, component_fn: HComponentFn<T>): HComponentFn<T> {
    const component_name = typeof name_fn === "string" ? name_fn : name_fn.name;
    return {
        [component_name]: (argument: HComponentFnArg<T>, ...child: HNode[]) => component_fn(argument, ...child),
    }[component_name];
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
    const component_name = "hanabi-root-page";
    const style = raw_style.flatMap((x) => (Array.isArray(x) ? x : [x]));

    store.components.set(component_name, { component_name, style, attachment });
}

export function clearStore(store: Store): void {
    store.components.clear();
}
