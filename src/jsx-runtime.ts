import type { Attribute, HComponentFn, HNode } from "./lib/component";
import type { Tag } from "./lib/elements";

type Component<T extends Attribute> = string | HComponentFn<Partial<T>>;

export namespace JSX {
    export interface IntrinsicElements {
        html: {
            lang?: string;
            children?: any;
        };
        body: {
            children?: any;
        };
        h1: {
            children?: any;
        };
    };
};

export function jsx<T extends Attribute>(element: Component<T>, props: Partial<T>, child: HNode): HNode {
    if (typeof element === "string") {
        return {
            tag: element as Tag,
            attribute: props,
            child: [child],
        };
    }
    return element(props)(child);
}

export function jsxs<T extends Attribute>(element: Component<T>, props: Partial<T>, ...child: HNode[]): HNode {
    if (typeof element === "string") {
        return {
            tag: element as Tag,
            attribute: props,
            child,
        };
    }
    return element(props)(...child);
}
