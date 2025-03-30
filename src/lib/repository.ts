import type { HComponentFn, HComponentFnArg, HElementFn, HRootPageFn } from "./component";
import { default_design_rule, default_design_rule_scaling, generateDesignRule } from "./design";
import type { PartialDesignRule, PartialDesignRuleScaling, RequiredDesignRule } from "./design";
import type { StyleRule } from "./style";

// hanabi element data structure for register element to repository, internal use only.
export type HComponent = {
    component_name: string;
    path?: string;
    style: StyleRule[];
};

export type Store = {
    components: Map<string, HComponent>;
    designrule: RequiredDesignRule;
};

export function generateStore(
    rule: PartialDesignRule = default_design_rule,
    scale: PartialDesignRuleScaling = default_design_rule_scaling,
): Store {
    return {
        components: new Map<string, HComponent>(),
        designrule: generateDesignRule(rule, Object.assign({}, default_design_rule_scaling, scale)),
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
    return { [component_name]: (arg: HComponentFnArg<T>) => component_fn(arg) }[component_name];
}

export function registerElement<K>(
    store: Store,
    element_fn: HElementFn<K>,
    style: StyleRule[],
    path?: string,
): HElementFn<K> {
    const component_name = element_fn.name;
    store.components.set(component_name, { component_name, path, style });
    return element_fn;
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
