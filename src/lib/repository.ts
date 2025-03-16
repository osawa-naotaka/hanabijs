import type { HComponent } from "./element";
import type { StyleRule } from "./style";

export type Repository = Map<string, HComponent>;

export function registerStyle(repo: Repository, component_name: string, style: StyleRule[]) {
    repo.set(component_name, { component_name, style });
}

export function clearRepository(repo: Repository): void {
    repo.clear();
}
