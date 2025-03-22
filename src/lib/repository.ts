import type { HComponent } from "./element";
import type { StyleRule } from "./style";

export type Repository = Map<string, HComponent>;

export function registerComponent(repo: Repository, component_name: string, style: StyleRule[], path?: string) {
    repo.set(component_name, { component_name, path, style });
}

export function clearRepository(repo: Repository): void {
    repo.clear();
}
