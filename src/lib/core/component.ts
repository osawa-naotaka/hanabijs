import type { AttributeMap, HanabiTag, Tag } from "@/lib/core/elements";
import { Class } from "@/lib/core/elements";
import { addClassInRecord } from "@/lib/core/util";

// Attribute of HTML Element
export type AttributeValue = string | string[] | null | undefined;
export type Attribute = Record<string, AttributeValue>;
export type AttributeOf<K> = Partial<AttributeMap[K & keyof AttributeMap]>;

// HTML DOM Node = string or HTML Element
export type HNode<T extends Attribute = Attribute> = string | HElement<T>;

// HTML Element, with custom element name
export type HElement<K> = {
    tag: Tag | HanabiTag;
    attribute: Partial<K>;
    child: HNode[];
};

// hanabi Element (is function), expressing HTML element
export type HElementFn<K> = (attribute: AttributeOf<K>, ...child: HNode[]) => HNode;

export type ElementArg = {
    class?: string | string[];
    tag?: Tag | HanabiTag;
};

export function element<K extends Tag | HanabiTag>(element_name: string, arg: ElementArg = {}): HElementFn<K> {
    const dot_name = `.${element_name}`;
    const class_name = arg.class === undefined ? [] : typeof arg.class === "string" ? [arg.class] : arg.class;
    return {
        [dot_name]: (attribute: AttributeOf<K>, ...child: HNode[]) => ({
            tag: arg.tag || "div",
            attribute: addClassInRecord(attribute, [element_name, ...class_name]),
            child,
        }),
    }[dot_name];
}

// hanabi Component (is function)
export type HComponentFn<T> = (argument: HComponentFnArg<T>, ...child: HNode[]) => HNode;
// biome-ignore lint: using any.
export type HComponentFnArg<T> = T & { class?: string | string[]; id?: string; children?: any; key?: any };

export function component<K, T>(name_fn: HComponentFn<K> | string, component_fn: HComponentFn<T>): HComponentFn<T> {
    const component_name = typeof name_fn === "string" ? name_fn : name_fn.name;
    return {
        [component_name]: (argument: HComponentFnArg<T>, ...child: HNode[]) => component_fn(argument, ...child),
    }[component_name];
}

// biome-ignore lint/suspicious/noExplicitAny: HAnyComponent uses only for function.name
export type HAnyComponentFn = HComponentFn<any>;

export type HArgument = Record<string, unknown>;

export function as<T>(class_name: string, fn: HComponentFn<T>): HComponentFn<T> {
    const dot_name = `.${class_name}`;
    return {
        [dot_name]: (argument: HComponentFnArg<T>, ...child: HNode[]) =>
            Class({ class: class_name }, fn(argument, ...child)),
    }[dot_name];
}

// hanabi HTML Top export function
export type HRootPageFn<T> = (parameter: T) => Promise<HNode>;

// hanabi Client FUnction
export type HClientFn = () => Promise<void>;
