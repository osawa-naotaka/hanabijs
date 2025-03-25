import type { HArgument, HComponent, HComponentFn } from "./element";
import type { StyleRule } from "./style";

export type Repository = Map<string, HComponent>;

// using any. fix it.
export function registerComponent<T extends HArgument>(
    repo: Repository,
    name_fn: HComponentFn<Record<string, any>>,
    style: StyleRule[],
    component_fn: HComponentFn<T>,
    path?: string,
): HComponentFn<T> {
    const component_name = name_fn.name;
    repo.set(component_name, { component_name, path, style });
    return { [component_name]: component_fn }[component_name];
}

export function clearRepository(repo: Repository): void {
    repo.clear();
}
