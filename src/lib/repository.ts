import type { HComponent } from "./element";
import type { StyleRule } from "./style";

export type Repository = Map<string, HComponent>;

export function registerComponent(repo: Repository, component_name: string, style: StyleRule[]) {
    repo.set(component_name, { component_name, style });
}

export function getComponent(repo: Repository, component_name: string): HComponent | Error {
    return repo.get(component_name) || new Error("Component not found.");
}

export function clearRepository(repo: Repository): void {
    repo.clear();
}
