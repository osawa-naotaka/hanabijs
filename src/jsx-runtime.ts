import type { Attribute, HComponentFn, HNode } from "./lib/component";
import type { AttributeMap, Tag } from "./lib/elements";

type Component<T extends Attribute> = string | HComponentFn<Partial<T>>;

type IntrinsicElements_ = {
    [key in keyof AttributeMap]: Partial<AttributeMap[key]> & { children?: HNode | HNode[]; key?: unknown };
};

export namespace JSX {
    export interface IntrinsicElements extends IntrinsicElements_ {}
}

export function jsx<T extends Attribute>(
    element: Component<T>,
    props: Partial<T> & { children?: JSXChildren },
): HNode {
    if(props.children !== undefined) {
        props.children = normalizeChildren(props.children);
    }
    if (typeof element === "string") {
        return {
            tag: element as Tag,
            attribute: props,
        };
    }
    return element(props);
}

export const jsxs = jsx;

type JSXChild = HNode | string | number | boolean | null | undefined;
type JSXChildren = JSXChild | JSXChild[] | JSXChildren[];

function normalizeChildren(children: JSXChildren): HNode[] {
    if (Array.isArray(children)) {
        return children.flat().flatMap((child) => normalizeChildren(child));
    }

    if (children === null || children === false || children === true || children === undefined) {
        return [];
    }

    if (typeof children === "string" || typeof children === "number") {
        return [children.toString()];
    }

    return [children];
}
