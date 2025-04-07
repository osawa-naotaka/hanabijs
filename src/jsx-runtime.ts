import type { Component, IntrinsicElements_, JSXChildren } from "./jsx-dev-runtime";
import { jsxDEV } from "./jsx-dev-runtime";
import type { Attribute, HNode } from "./lib/component";

export namespace JSX {
    export interface IntrinsicElements extends IntrinsicElements_ {}
}

export function jsx<T extends Attribute>(element: Component<T>, props: Partial<T> & { children?: JSXChildren }): HNode {
    return jsxDEV(element, props, undefined, undefined, undefined, undefined);
}

export const jsxs = jsx;
