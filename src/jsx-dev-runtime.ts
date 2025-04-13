import type { Attribute, HNode } from "@/lib/core/component";
import type { Component, IntrinsicElements_, JSXChildren } from "./jsx-runtime";
import { jsx } from "./jsx-runtime";

export namespace JSX {
    export interface IntrinsicElements extends IntrinsicElements_ {}
}

export function jsxDEV<T extends Attribute>(
    element: Component<T>,
    props: Partial<T> & { children?: JSXChildren },
    // biome-ignore lint: using any.
    _d1: any,
    // biome-ignore lint: using any.
    _d2: any,
    // biome-ignore lint: using any.
    _d3: any,
    // biome-ignore lint: using any.
    _d4: any,
): HNode {
    return jsx(element, props);
}

export const jsxsDEV = jsxDEV;
