import type { Attribute, HComponentFn, HNode } from "./lib/component";
import type { AttributeMap, Tag } from "./lib/elements";

type Component<T extends Attribute> = string | HComponentFn<Partial<T>>;

type IntrinsicElements_ = { [key in keyof AttributeMap]: Partial<AttributeMap[key]> };

export namespace JSX {
    export interface IntrinsicElements extends IntrinsicElements_ {}
}

// biome-ignore lint: using any.
export function jsxDEV<T extends Attribute>(element: Component<T>, props: Partial<T> & { children?: any }): HNode {
    const { children, ...attribute } = props;
    const child = (children === undefined ? [] : Array.isArray(children) ? children : [children]) as HNode[];

    if (typeof element === "string") {
        return {
            tag: element as Tag,
            attribute,
            child,
        };
    }
    return element(attribute as T)(...child);
}

// biome-ignore lint: using any.
export function jsxsDEV<T extends Attribute>(element: Component<T>, props: Partial<T> & { children?: any }): HNode {
    const { children, ...attribute } = props;
    const child = (children === undefined ? [] : Array.isArray(children) ? children : [children]) as HNode[];

    if (typeof element === "string") {
        return {
            tag: element as Tag,
            attribute,
            child,
        };
    }
    return element(attribute as T)(...child);
}
