import type { Attribute, HComponentFn, HNode } from "./lib/component";
import type { AttributeMap, Tag } from "./lib/elements";

export type Component<T extends Attribute> = string | HComponentFn<Partial<T>>;

export type IntrinsicElements_ = { [key in keyof AttributeMap]: Partial<AttributeMap[key]> };

export namespace JSX {
    export interface IntrinsicElements extends IntrinsicElements_ {}
}

export type JSXChildren = HNode | HNode[] | JSXChildren[];

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
    const { children, ...attribute } = props;
    const child = normalizeChildren(children);

    if (typeof element === "string") {
        return {
            tag: element as Tag,
            attribute,
            child,
        };
    }
    return element(attribute as T)(...child);
}

export const jsxsDEV = jsxDEV;

function normalizeChildren(children: JSXChildren | undefined): HNode[] {
    if (children === undefined) {
        return [];
    }

    if (Array.isArray(children)) {
        return children.flat().flatMap(normalizeChildren);
    }

    return [children];
}
