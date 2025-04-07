import type { Attribute, HComponentFn, HNode } from "./lib/component";
import type { AttributeMap, Tag } from "./lib/elements";

type Component<T extends Attribute> = string | HComponentFn<Partial<T>>;

type IntrinsicElements_ = { [key in keyof AttributeMap]: Partial<AttributeMap[key]> };

export namespace JSX {
    export interface IntrinsicElements extends IntrinsicElements_ {}
}

export function jsx<T extends Attribute>(
    element: Component<T>,
    props: Partial<T> & { children?: HNode | HNode[] },
): HNode {
    if (typeof element === "string") {
        return {
            tag: element as Tag,
            attribute: props,
        };
    }
    return element(props);
}

export const jsxs = jsx;
