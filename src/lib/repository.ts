import type { HComponent } from "./element";
import type { StyleRule } from "./style";

const repository = new Map<string, HComponent>();

export function registerComponent(component_name: string, style: StyleRule[]) {
    repository.set(component_name, { component_name, style });
}

export function getComponent(component_name: string): HComponent | Error {
    return repository.get(component_name) || new Error("Component not found.");
}

export function getRepository(): Map<string, HComponent> {
    return repository;
}

export function clearRepository(): void {
    repository.clear();
}
