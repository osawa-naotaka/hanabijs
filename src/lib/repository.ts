import type { HAnyComponentFn, HArgument, HComponent, HComponentFn, HRootPageFn } from "./element";
import type { StyleRule } from "./style";

export type Repository = Map<string, HComponent>;

export function registerComponent<T extends HArgument>(
    repo: Repository,
    name_fn: HAnyComponentFn | string,
    style: StyleRule[],
    component_fn: HComponentFn<T>,
    path?: string,
): HComponentFn<T> {
    const component_name = typeof name_fn === "string" ? name_fn : name_fn.name;
    repo.set(component_name, { component_name, path, style });
    return { [component_name]: component_fn }[component_name];
}

export function registerRootPage<T extends HArgument>(
    repo: Repository,
    name_fn: HAnyComponentFn | string,
    style: StyleRule[],
    root_page_fn: HRootPageFn<T>,
    path?: string,
): HRootPageFn<T> {
    const component_name = typeof name_fn === "string" ? name_fn : name_fn.name;
    repo.set(root_page_fn.name, { component_name, path, style });
    return root_page_fn;
}

export function clearRepository(repo: Repository): void {
    repo.clear();
}
