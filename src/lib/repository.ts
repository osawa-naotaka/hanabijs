import type { HComponent } from "./element";
import type { StyleRule } from "./style";

const repository = new Map<string, HComponent>();

export function registerComponent(name: string, style: StyleRule[]) {
    repository.set(name, { name, style });
}

export function getComponent(name: string): HComponent | Error {
    return repository.get(name) || new Error("Component not found.");
}

export function getRepository(): Map<string, HComponent> {
    return repository;
}

export function clearRepository(): void {
    repository.clear();
}
