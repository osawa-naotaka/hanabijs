import type { ComplexSelector, CompoundSelector, Rule, Selector } from "./style";
import { isCompoundSelector } from "./style";

export type Elem = {
    tag: Tag;
    attribute: Attribute;
    style: Rule[];
    child: HNode[];
};

export type HOElem<A> = (arg: A) => Elem;

export type Attribute = Record<string, unknown>;

export type Tag =
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
    | "footer";

export type HNode = string | Elem;

// Element
export function DOCTYPE(): string {
    return "<!DOCTYPE html>";
}

export function createElem(tag: Tag, attribute: Attribute, args: (Rule[] | HNode)[]): Elem {
    const { style, child } = classifyElemArgs(args);
    return { tag, attribute, style, child };
}

export function classifyElemArgs(args: (Rule[] | HNode)[]): {
    style: Rule[];
    child: HNode[];
} {
    let style: Rule[] = [];
    const child: HNode[] = [];

    for (const arg of args) {
        if (isNode(arg)) {
            child.push(arg);
        } else if (isStyle(arg)) {
            style = arg;
        }
    }

    return { style, child };
}

function isNode(arg: Rule[] | HNode): arg is HNode {
    if (typeof arg === "string") {
        return true;
    }

    if (Array.isArray(arg)) {
        return false;
    }

    return (
        Object.hasOwn(arg, "tag") &&
        Object.hasOwn(arg, "attribute") &&
        Object.hasOwn(arg, "style") &&
        Object.hasOwn(arg, "child")
    );
}

function isStyle(arg: Rule[] | HNode): arg is Rule[] {
    if (Array.isArray(arg)) {
        for (const a of arg) {
            if (!Object.hasOwn(a, "selectorlist") || !Object.hasOwn(a, "properties")) {
                return false;
            }
        }
        return true;
    }
    return false;
}

// Strigify
export function stringifyToHtml(node: HNode): string {
    if (typeof node === "string") {
        return node;
    }
    if (node.child.length === 0) {
        return `<${node.tag}${attributeToString(node.attribute)} />`;
    }
    return `<${node.tag}${attributeToString(node.attribute)}>${node.child.map(stringifyToHtml).join("")}</${node.tag}>`;
}

function attributeToString(attribute: Attribute): string {
    return Object.entries(attribute)
        .map(([raw_key, value]) => {
            if (typeof value === "string") {
                const key = (raw_key === "className" ? "class" : raw_key).replace("_", "-");
                return value === "" || value === null ? ` ${key}"` : ` ${key}="${value}"`;
            }
        })
        .join("");
}

// Traverser
export function selectElements(nodes: HNode[], selector: Selector, search_deep = false): Elem[] {
    const result = new Set<Elem>();

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (typeof node !== "string") {
            if (isCompoundSelector(selector)) {
                if (matchCompoundSelector(selector, node)) {
                    result.add(node);
                }
            } else {
                if (matchCompoundSelector(selector.compound, node)) {
                    selectElementsCombinator(nodes, i, selector).map((e) => result.add(e));
                } else if (search_deep) {
                    selectElements(node.child, selector, true).map((e) => result.add(e));
                }
            }
        }
    }
    return Array.from(result);
}

function matchCompoundSelector(selector: CompoundSelector, element: Elem): boolean {
    for (const s of selector) {
        if (s.startsWith(".")) {
            if (!hasClass(s.slice(1), element.attribute)) {
                return false;
            }
        } else if (s.startsWith("#")) {
            if (element.attribute.id !== s.slice(1)) {
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
    if (attribute.className === undefined || typeof attribute.className !== "string") {
        return false;
    }
    return attribute.className.includes(className);
}

function selectElementsCombinator(nodes: HNode[], index: number, selector: ComplexSelector): Elem[] {
    const result = new Set<Elem>();
    const parent = nodes[index];

    if (typeof parent === "string") {
        return [];
    }

    switch (selector.combinator) {
        case " ":
            selectElements(parent.child, selector.descendant, true).map((e) => result.add(e));
            selectElements(parent.child, selector, true).map((e) => result.add(e));
            break;
        case ">":
            selectElements(parent.child, selector.descendant).map((e) => result.add(e));
            break;
        case "+":
            if (nodes.length > index + 1) {
                const next_node = nodes[index + 1];
                if (typeof next_node !== "string") {
                    selectElements([next_node], selector.descendant).map((e) => result.add(e));
                }
            }
            break;
        case "~":
            for (let i = index + 1; i < nodes.length; i++) {
                const next_node = nodes[i];
                if (typeof next_node !== "string") {
                    selectElements([next_node], selector.descendant).map((e) => result.add(e));
                }
            }
            break;
        default:
            throw new Error("selectElementsCombinator: unsupported combinator.");
    }

    return Array.from(result);
}

// Inserter
export function insertElements(root: HNode, selector: Selector, insert: HNode[], search_deep = false): HNode {
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
                    tag: result.tag,
                    attribute: result.attribute,
                    style: result.style,
                    child: result.child.map((e) => insertElementsCombinator(e, selector, insert)),
                };
            } else if (search_deep) {
                result = {
                    tag: result.tag,
                    attribute: result.attribute,
                    style: result.style,
                    child: result.child.map((e) => insertElements(e, selector, insert, true)),
                };
            }
        }
    }

    return result;
}

function insertElementsCombinator(root: HNode, selector: ComplexSelector, insert: HNode[]): HNode {
    let result = root;

    if (typeof result === "string") {
        return result;
    }

    switch (selector.combinator) {
        case " ":
            result = insertElements(result, selector.descendant, insert, true);
            break;
        case ">":
            result = insertElements(result, selector.descendant, insert);
            break;
        default:
            throw new Error("insertElementsCombinator: unsupported combinator.");
    }

    return result;
}
