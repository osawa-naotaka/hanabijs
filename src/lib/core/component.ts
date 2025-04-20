import type { AttributeMap, HanabiTag, Tag } from "@/lib/core/elements";
import { Class } from "@/lib/core/elements";

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

// add class string to record.
export function addClassInRecord<T extends { class?: string | string[] }>(record: T, className: string | string[]): T {
    const new_record = JSON.parse(JSON.stringify(record));
    new_record.class = addClassToHead(record, className);
    return new_record;
}

function addClassToHead<T extends { class?: string | string[] }>(
    attribute: T,
    className: string | string[],
): string | string[] {
    if (attribute.class !== undefined) {
        if (typeof className === "string") {
            return Array.isArray(attribute.class) ? [className, ...attribute.class] : [className, attribute.class];
        }
        return Array.isArray(attribute.class) ? [...className, ...attribute.class] : [...className, attribute.class];
    }
    return className;
}

// hanabi Component (is function)
export type HComponentFn<T> = (argument: HComponentFnArg<T>, ...child: HNode[]) => HNode;
// biome-ignore lint: using any.
export type HComponentFnArg<T> = T & { class?: string | string[]; id?: string; children?: any; key?: any };

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
