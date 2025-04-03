import type { HComponentFn, HComponentFnArg, HElementFn } from "./component";
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

export function component<T, K>(name_fn: HComponentFn<K> | string, component_fn: HComponentFn<T>): HComponentFn<T> {
    const component_name = typeof name_fn === "string" ? name_fn : name_fn.name;
    return { [component_name]: (argument: HComponentFnArg<T>) => component_fn(argument) }[component_name];
}

export function registerComponent<K>(
    store: Store,
    name_fn: HComponentFn<K> | string,
    style: StyleRule[],
    path?: string,
): void {
    const component_name = typeof name_fn === "string" ? name_fn : name_fn.name;
    store.components.set(component_name, { component_name, path, style });
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

export function registerRootPage(store: Store, style: StyleRule[], path?: string): void {
    const component_name = "hanabi-root-page";
    store.components.set(component_name, { component_name, path, style });
}

export function clearStore(store: Store): void {
    store.components.clear();
}
