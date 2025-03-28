import type { HComponentFn, HNode, HRootPageFn } from "./component";
import { type DesignRule, type DesignRuleScaling, generateDesignRule } from "./design";
import type { StyleRule } from "./style";

// hanabi semantic data structure for register semantic to repository, internal use only.
export type HComponent = {
    component_name: string;
    path?: string;
    style: StyleRule[];
};

export type Store = {
    components: Map<string, HComponent>;
    designrule: Required<DesignRule>;
};

export function generateStore(rule: Partial<DesignRule> = {}, scale: Partial<DesignRuleScaling> = {}): Store {
    return {
        components: new Map<string, HComponent>(),
        designrule: generateDesignRule(rule, scale),
    };
}

export function registerComponent<T, K>(
    store: Store,
    name_fn: HComponentFn<K> | string,
    style: StyleRule[],
    component_fn: HComponentFn<T>,
    path?: string,
): HComponentFn<T> {
    const component_name = typeof name_fn === "string" ? name_fn : name_fn.name;
    store.components.set(component_name, { component_name, path, style });
    return {
        [component_name]:
            (argument: T & { class?: string | string[]; id?: string }) =>
            (...child: HNode[]) =>
                component_fn(argument)(...child),
    }[component_name];
}

export function registerRootPage<T, K>(
    store: Store,
    name_fn: HComponentFn<K> | string,
    style: StyleRule[],
    root_page_fn: HRootPageFn<T>,
    path?: string,
): HRootPageFn<T> {
    const component_name = typeof name_fn === "string" ? name_fn : name_fn.name;
    store.components.set(component_name, { component_name, path, style });
    return root_page_fn;
}

export function clearStore(store: Store): void {
    store.components.clear();
}
