import type { HComponentFn, HComponentFnArg, HElementFn, HNode } from "./component";
import { default_design_rule } from "./design";
import type { DesignRule } from "./design";
import type { StyleRule } from "./style";

// hanabi element data structure for register element to repository, internal use only.
export type HComponent = {
    component_name: string;
    path?: string;
    style: StyleRule[];
};

export type Store = {
    components: Map<string, HComponent>;
    designrule: DesignRule;
};

export function generateStore(rule: Partial<DesignRule> = {}): Store {
    return {
        components: new Map<string, HComponent>(),
        designrule: { ...default_design_rule, ...rule },
    };
}

export function component<K>(name_fn: HComponentFn<K> | string): <T>(component_fn: HComponentFn<T>) => HComponentFn<T> {
    return <T>(component_fn: HComponentFn<T>) => {
        const component_name = typeof name_fn === "string" ? name_fn : name_fn.name;
        return {
            [component_name]: (argument: HComponentFnArg<T>, ...child: HNode[]) => component_fn(argument, ...child),
        }[component_name];
    };
}

export function registerComponent<K>(
    store: Store,
    name_fn: HComponentFn<K> | string,
    raw_style: (StyleRule | StyleRule[])[],
    path?: string,
): void {
    const component_name = typeof name_fn === "string" ? name_fn : name_fn.name;
    const style = raw_style.flatMap((x) => (Array.isArray(x) ? x : [x]));

    store.components.set(component_name, { component_name, path, style });
}

export function registerElement<K>(
    store: Store,
    element_fn: HElementFn<K>,
    raw_style: (StyleRule | StyleRule[])[],
    path?: string,
): void {
    const component_name = element_fn.name;
    const style = raw_style.flatMap((x) => (Array.isArray(x) ? x : [x]));

    store.components.set(component_name, { component_name, path, style });
}

export function registerRootPage(store: Store, raw_style: (StyleRule | StyleRule[])[], path?: string): void {
    const component_name = "hanabi-root-page";
    const style = raw_style.flatMap((x) => (Array.isArray(x) ? x : [x]));

    store.components.set(component_name, { component_name, path, style });
}

export function clearStore(store: Store): void {
    store.components.clear();
}
