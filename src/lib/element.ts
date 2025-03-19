import type { ComplexSelector, CompoundSelector, Selector, StyleRule } from "./style";
import { isCompoundSelector } from "./style";
import { sanitizeAttributeValue, sanitizeBasic, validateAttributeKey, validateElementName } from "./util";

export type AttributeValue = string | string[] | unknown;
export type BaseAttribute = { class?: string | string[]; id?: string };

export type Attribute = Record<string, AttributeValue> & BaseAttribute;

export type HElement<T extends Attribute = Attribute> = {
    element_name: string;
    tag: Tag;
    attribute: T;
    child: HNode[];
};

export type HComponent = {
    component_name: string;
    path?: string;
    style: StyleRule[];
};

export type Tag =
    | "raw"
    | "dimension"
    | "decoration"
    | "layout"
    | "unwrap"
    | "a"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "meta"
    | "link"
    | "head"
    | "body"
    | "html"
    | "div"
    | "span"
    | "main"
    | "aside"
    | "section"
    | "article"
    | "ul"
    | "ol"
    | "li"
    | "p"
    | "img"
    | "title"
    | "script"
    | "header"
    | "footer"
    | "input"
    | "label"
    | "nav"
    | "em"
    | "button"
    | "style";

export type HNode<T extends Attribute = Attribute> = string | HElement<T>;

// Element
export function DOCTYPE(): string {
    return "<!DOCTYPE html>";
}

export type HComponentFn<T = Attribute> = (attribute: T & Attribute, ...child: HNode[]) => HNode;
export type HSimpleComponentFn = (...child: HNode[]) => HNode;
export type HRootPageFn<T> = (parameter: T) => Promise<HNode>;
export type HPath<T> = { params: T }[];

// add attribute
export function addClassToAttribute<T extends { class?: string | string[] }>(attribute: T, className: string): T {
    const new_attribute = JSON.parse(JSON.stringify(attribute));
    new_attribute.class = addClass(attribute, className);
    return new_attribute;
}

export function addClass<T extends { class?: string | string[] }>(
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

export function mergeAttribute<T1 extends Attribute, T2 extends Attribute>(attribute1: T1, attribute2: T2): T1 & T2 {
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

function attributeToString(attribute: Attribute): string {
    return Object.entries(attribute)
        .map(([raw_key, value]) => {
            const key = raw_key.replaceAll("_", "-");

            if (!validateAttributeKey(key)) {
                throw new Error(`attributeToString: invalid attribute key ${key}.`);
            }

            if (value === "" || value === null || value === undefined) {
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

export function createSemantic<T>(
    element_name: string,
    { class_names = [], tag = "div" }: { class_names?: string[]; tag?: Tag } = {},
): HComponentFn<T> {
    return (attribute, ...child) => ({
        element_name,
        tag,
        attribute: mergeAttribute(attribute, { class: addClass(attribute, [element_name, ...class_names]) }),
        child,
    });
}

export function createSimpleSemantic(
    element_name: string,
    { class_names = [], tag = "div" }: { class_names?: string[]; tag?: Tag } = {},
): HSimpleComponentFn {
    return (...child) => ({ element_name, tag, attribute: { class: [element_name, ...class_names] }, child });
}

export function mergeClassToAttribute<T extends Attribute>(attribute: T, className: string) {
    return mergeAttribute(attribute, { class: addClass(attribute, className) });
}

function gt(tag: Tag): HComponentFn<Attribute> {
    return (attribute, ...child) => ({ element_name: tag, tag, attribute, child });
}

export const Meta = gt("meta");
export const Link = gt("link");
export const Head = gt("head");
export const Body = gt("body");
export const Html = gt("html");
export const Div = gt("div");
export const Span = gt("span");
export const Main = gt("main");
export const Aside = gt("aside");
export const Section = gt("section");
export const Article = gt("article");
export const Ul = gt("ul");
export const Ol = gt("ol");
export const Li = gt("li");
export const Img = gt("img");
export const Title = gt("title");
export const Script = gt("script");
export const H1 = gt("h1");
export const H2 = gt("h2");
export const H3 = gt("h3");
export const H4 = gt("h4");
export const H5 = gt("h5");
export const H6 = gt("h6");
export const Header = gt("header");
export const Footer = gt("footer");
export const A = gt("a");
export const P = gt("p");
export const Input = gt("input");
export const Label = gt("label");
export const Nav = gt("nav");
export const Em = gt("em");
export const RawHTML = gt("raw");
export const Button = gt("button");
export const Style = gt("style");
export const Unwrap = gt("unwrap");
