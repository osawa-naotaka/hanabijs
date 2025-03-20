import type { HanabiTag, Tag } from "./define";
import type { ComplexSelector, CompoundSelector, Selector, StyleRule } from "./style";
import { isCompoundSelector } from "./style";
import { sanitizeAttributeValue, sanitizeBasic, validateAttributeKey, validateElementName } from "./util";

// HTML DOM Node = string or HTML Element
export type HNode<T extends Attribute = Attribute> = string | HElement<Partial<T>>;

// HTML Element, with custon element name
export type HElement<T> = {
    element_name: string;
    tag: Tag | HanabiTag;
    attribute: T;
    child: HNode<Attribute>[];
};

// Attribute of HTML Element
export type Attribute = Record<string, AttributeValue>;
export type AttributeValue = string | string[] | undefined;

// hanabi semantic data structure for register semantic to repository, internal use only.
export type HComponent = {
    component_name: string;
    path?: string;
    style: StyleRule[];
};

// hanabi Component (is function)
export type HComponentFn<T extends HArgument> = (
    argument: T & { class?: string | string[]; id?: string },
) => (...child: HNode[]) => HNode;
export type HArgument = Record<string, unknown>;

// hanabi HTML Top export function
export type HRootPageFn<T> = (parameter: T) => Promise<HNode>;

export type HPath<T> = { params: T }[];

// Element
export function DOCTYPE(): string {
    return "<!DOCTYPE html>";
}

// add class string to record.
export function addClassInRecord<T extends { class?: string | string[] }>(record: T, className: string): T {
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

function mergeRecord<
    T1 extends Record<string | number | symbol, unknown>,
    T2 extends Record<string | number | symbol, unknown>,
>(attribute1: T1, attribute2: T2): T1 & T2 {
    const new_attribute = JSON.parse(JSON.stringify(attribute1));
    for (const [key, value] of Object.entries(attribute2)) {
        new_attribute[key] = value;
    }
    return new_attribute;
}

// Strigify
export function stringifyToHtml(depth: number): (node: HNode) => string {
    return (node: HNode) => {
        if (depth > 64) {
            throw new Error("stringifyToHtml: html element nesting depth must be under 64.");
        }

        if (typeof node === "string") {
            return sanitizeBasic(node);
        }

        // ad-hock tag "raw". this tag must be removed for security.
        if (node.tag === "raw") {
            return node.child.join("");
        }

        if (!validateElementName(node.tag)) {
            throw new Error(`stringifyToHtml: invalid element name ${node.tag}.`);
        }

        if (node.tag === "unwrap") {
            return node.child.map(stringifyToHtml(depth + 1)).join("");
        }

        if (node.child.length === 0) {
            return `<${node.tag}${attributeToString(node.attribute)} />`;
        }
        return `<${node.tag}${attributeToString(node.attribute)}>${node.child.map(stringifyToHtml(depth + 1)).join("")}</${node.tag}>`;
    };
}

function attributeToString(attribute: Partial<Attribute>): string {
    return Object.entries(attribute)
        .map(([raw_key, value]) => {
            const key = raw_key.replaceAll("_", "-");

            if (!validateAttributeKey(key)) {
                throw new Error(`attributeToString: invalid attribute key ${key}.`);
            }

            if (value === "" || value === null) {
                return ` ${key}`;
            }

            if (typeof value !== "string" && !Array.isArray(value)) {
                throw new Error(
                    `attributeToString: invalid attribute value type ${value}. only string value or array of string value is allowd.`,
                );
            }

            const sanitized = Array.isArray(value)
                ? value.map(sanitizeAttributeValue(key))
                : [sanitizeAttributeValue(key)(value)];

            return ` ${key}="${sanitized.join(" ")}"`;
        })
        .join("");
}

// DOM Builder
export function createDom(node: HNode, d: Document = document): Node[] {
    return createDomInternal(0, d)(node);
}

function createDomInternal(depth: number, d: Document = document): (node: HNode) => Node[] {
    return (node: HNode) => {
        if (depth > 64) {
            throw new Error("stringifyToHtml: html element nesting depth must be under 64.");
        }

        if (typeof node === "string") {
            return [d.createTextNode(sanitizeBasic(node))];
        }

        // ad-hock tag "raw". this tag must be removed for security.
        if (node.tag === "raw") {
            const parser = new DOMParser();
            return node.child.map((child) => {
                if (typeof child === "string") {
                    return parser.parseFromString(child, "text/html");
                }
                throw new Error("Raw node must be string.");
            });
        }

        if (!validateElementName(node.tag)) {
            throw new Error(`stringifyToHtml: invalid element name ${node.tag}.`);
        }

        if (node.tag === "unwrap") {
            return node.child.flatMap(createDomInternal(depth + 1, d));
        }

        const element = d.createElement(node.tag);
        setAttribute(element, node.attribute);

        for (const child of node.child) {
            for (const child_element of createDomInternal(depth + 1, d)(child)) {
                element.appendChild(child_element);
            }
        }
        return [element];
    };
}

function setAttribute(element: HTMLElement, attribute: Partial<Attribute>): void {
    for (const [raw_key, value] of Object.entries(attribute)) {
        const key = raw_key.replaceAll("_", "-");

        if (!validateAttributeKey(key)) {
            throw new Error(`attributeToString: invalid attribute key ${key}.`);
        }

        if (value === "" || value === null) {
            element.setAttribute(key, "");
            return;
        }

        if (typeof value !== "string" && !Array.isArray(value)) {
            throw new Error(
                `attributeToString: invalid attribute value type ${value}. only string value or array of string value is allowd.`,
            );
        }

        for (const v of Array.isArray(value) ? value : [value]) {
            element.setAttribute(key, sanitizeAttributeValue(key)(v));
        }
    }
}

// Traverser
export function selectNode(nodes: HNode[], selector: Selector, search_deep = false): HNode[] {
    const result = new Set<HNode>();

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (typeof node !== "string") {
            if (isCompoundSelector(selector)) {
                if (matchCompoundSelector(selector, node)) {
                    result.add(node);
                }
            } else {
                if (matchCompoundSelector(selector.compound, node)) {
                    selectNodeCombinator(nodes, i, selector).map((e) => result.add(e));
                } else if (search_deep) {
                    selectNode(node.child, selector, true).map((e) => result.add(e));
                }
            }
        }
    }
    return Array.from(result);
}

function matchCompoundSelector(selector: CompoundSelector, element: HElement<{ id?: string }>): boolean {
    for (const s of selector) {
        if (s.startsWith(".")) {
            if (!hasClass(s.slice(1), element.attribute)) {
                return false;
            }
        } else if (s.startsWith("#")) {
            if (element.attribute.id === undefined || element.attribute.id !== s.slice(1)) {
                return false;
            }
        } else if (s !== "*") {
            if (element.tag !== s) {
                return false;
            }
        }
    }
    return true;
}

function hasClass(className: string, attribute: Attribute): boolean {
    if (attribute.class === undefined || typeof attribute.class !== "string") {
        return false;
    }
    return attribute.class.includes(className);
}

function selectNodeCombinator(nodes: HNode[], index: number, selector: ComplexSelector): HNode[] {
    const result = new Set<HNode>();
    const parent = nodes[index];

    if (typeof parent === "string") {
        return [];
    }

    switch (selector.combinator) {
        case " ":
            selectNode(parent.child, selector.descendant, true).map((e) => result.add(e));
            selectNode(parent.child, selector, true).map((e) => result.add(e));
            break;
        case ">":
            selectNode(parent.child, selector.descendant).map((e) => result.add(e));
            break;
        case "+":
            if (nodes.length > index + 1) {
                const next_node = nodes[index + 1];
                if (typeof next_node !== "string") {
                    selectNode([next_node], selector.descendant).map((e) => result.add(e));
                }
            }
            break;
        case "~":
            for (let i = index + 1; i < nodes.length; i++) {
                const next_node = nodes[i];
                if (typeof next_node !== "string") {
                    selectNode([next_node], selector.descendant).map((e) => result.add(e));
                }
            }
            break;
        default:
            throw new Error("selectComponentsCombinator: unsupported combinator.");
    }

    return Array.from(result);
}

// Inserter
export function insertNodes(root: HNode, selector: Selector, insert: HNode[], search_deep = false): HNode {
    let result = root;

    if (typeof result !== "string") {
        if (isCompoundSelector(selector)) {
            if (matchCompoundSelector(selector, result)) {
                result = JSON.parse(JSON.stringify(root));
                if (typeof result !== "string") {
                    result.child.push(...insert);
                }
            }
        } else {
            if (matchCompoundSelector(selector.compound, result)) {
                result = {
                    element_name: result.element_name,
                    tag: result.tag,
                    attribute: result.attribute,
                    child: result.child.map((e) => insertNodesCombinator(e, selector, insert)),
                };
            } else if (search_deep) {
                result = {
                    element_name: result.element_name,
                    tag: result.tag,
                    attribute: result.attribute,
                    child: result.child.map((e) => insertNodes(e, selector, insert, true)),
                };
            }
        }
    }

    return result;
}

function insertNodesCombinator(root: HNode, selector: ComplexSelector, insert: HNode[]): HNode {
    let result = root;

    if (typeof result === "string") {
        return result;
    }

    switch (selector.combinator) {
        case " ":
            result = insertNodes(result, selector.descendant, insert, true);
            break;
        case ">":
            result = insertNodes(result, selector.descendant, insert);
            break;
        default:
            throw new Error("insertElementsCombinator: unsupported combinator.");
    }

    return result;
}

// on semantic Component, argument is attribute.
export function semantic<T extends Attribute>(
    element_name: string,
    { class_names = [], tag = "div" }: { class_names?: string[]; tag?: Tag } = {},
): HComponentFn<T> {
    return (argument) =>
        (...child) => ({
            element_name,
            tag,
            attribute: mergeRecord(argument, { class: addClassToHead(argument, [element_name, ...class_names]) }),
            child,
        });
}

export function mergeClassToRecord<T extends Record<string | number | symbol, unknown>>(
    attribute: T,
    className: string,
) {
    return mergeRecord(attribute, { class: addClassToHead(attribute, className) });
}
