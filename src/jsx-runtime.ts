import type { Attribute, HComponentFn, HNode } from "@/lib/core/component";
import type { AttributeMap, Tag } from "@/lib/core/elements";

export namespace JSX {
    export interface IntrinsicElements extends IntrinsicElements_ {}
}

export type Component<T extends Attribute> = string | HComponentFn<T>;

export type IntrinsicElements_ = { [key in keyof AttributeMap]: Partial<AttributeMap[key]> };

export namespace JSX {
    export interface IntrinsicElements extends IntrinsicElements_ {}
}

export type JSXChildren = HNode | HNode[] | JSXChildren[];

export function jsx<T extends Attribute>(element: Component<T>, props: Partial<T> & { children?: JSXChildren }): HNode {
    const { children, ...attribute } = props;
    const child = normalizeChildren(children);

    if (typeof element === "string") {
        return {
            tag: element as Tag,
            attribute,
            child,
        };
    }
    return element(attribute as T, ...child);
}

export const jsxs = jsx;

function normalizeChildren(children: JSXChildren | undefined): HNode[] {
    if (children === undefined) {
        return [];
    }

    if (Array.isArray(children)) {
        return children.flat().flatMap(normalizeChildren);
    }

    return [children];
}
