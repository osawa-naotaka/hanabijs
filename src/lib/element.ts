import type { ComplexSelector, CompoundSelector, Selector } from "./style";
import { isCompoundSelector } from "./style";
import type { Rule } from "./style";

export type Attribute = Record<string, unknown> & { class?: string | string[], id?: string };

export type Elem<T extends Attribute = Attribute> = {
    tag: Tag;
    attribute: T;
    child: HNode[];
};

export type Component<T extends Attribute = Attribute> = [Elem<T>, Rule[]];
export type ComponentFn<T extends Attribute = Attribute> = (attribute: T, ...child: HNode[]) => Component;


export type Tag =
    | "raw"
    | "dimension"
    | "decoration"
    | "layout"
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
    | "em";

export type HNode<T extends Attribute = Attribute> = string | Component<T>;

// Element
export function DOCTYPE(): string {
    return "<!DOCTYPE html>";
}

// add attribute
export function addClassToAttribute<T extends Attribute = Attribute>(attribute: T, className: string): T {
    const new_attribute = JSON.parse(JSON.stringify(attribute));
    if (attribute.class !== undefined) {
        new_attribute.class = Array.isArray(attribute.class)
            ? [className, ...attribute.class]
            : [className, attribute.class];
    } else {
        new_attribute.class = className;
    }
    return new_attribute;
}


// Strigify
export function stringifyToHtml(node: HNode): string {
    if (typeof node === "string") {
        return node;
    }
    if (node[0].tag === "raw") {
        return node[0].child.join("");
    }
    if (node[0].child.length === 0) {
        return `<${node[0].tag}${attributeToString(node[0].attribute)} />`;
    }
    return `<${node[0].tag}${attributeToString(node[0].attribute)}>${node[0].child.map(stringifyToHtml).join("")}</${node[0].tag}>`;
}

function attributeToString(attribute: Attribute): string {
    return Object.entries(attribute)
        .map(([raw_key, value]) => {
            const key = raw_key.replaceAll("_", "-");
            return value === "" || value === null
                ? ` ${key}"`
                : Array.isArray(value)
                  ? ` ${key}="${value.join(" ")}"`
                  : ` ${key}="${value}"`;
        })
        .join("");
}

// Traverser
export function selectComponent(nodes: HNode[], selector: Selector, search_deep = false): Component[] {
    const result = new Set<Component>();

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (typeof node !== "string") {
            if (isCompoundSelector(selector)) {
                if (matchCompoundSelector(selector, node[0])) {
                    result.add(node);
                }
            } else {
                if (matchCompoundSelector(selector.compound, node[0])) {
                    selectComponentsCombinator(nodes, i, selector).map((e) => result.add(e));
                } else if (search_deep) {
                    selectComponent(node[0].child, selector, true).map((e) => result.add(e));
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
    if (attribute.class === undefined || typeof attribute.class !== "string") {
        return false;
    }
    return attribute.class.includes(className);
}

function selectComponentsCombinator(nodes: HNode[], index: number, selector: ComplexSelector): Component[] {
    const result = new Set<Component>();
    const parent = nodes[index];

    if (typeof parent === "string") {
        return [];
    }

    switch (selector.combinator) {
        case " ":
            selectComponent(parent[0].child, selector.descendant, true).map((e) => result.add(e));
            selectComponent(parent[0].child, selector, true).map((e) => result.add(e));
            break;
        case ">":
            selectComponent(parent[0].child, selector.descendant).map((e) => result.add(e));
            break;
        case "+":
            if (nodes.length > index + 1) {
                const next_node = nodes[index + 1];
                if (typeof next_node !== "string") {
                    selectComponent([next_node], selector.descendant).map((e) => result.add(e));
                }
            }
            break;
        case "~":
            for (let i = index + 1; i < nodes.length; i++) {
                const next_node = nodes[i];
                if (typeof next_node !== "string") {
                    selectComponent([next_node], selector.descendant).map((e) => result.add(e));
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
            if (matchCompoundSelector(selector, result[0])) {
                result = JSON.parse(JSON.stringify(root));
                if (typeof result !== "string") {
                    result[0].child.push(...insert);
                }
            }
        } else {
            if (matchCompoundSelector(selector.compound, result[0])) {
                result = [{
                    tag: result[0].tag,
                    attribute: result[0].attribute,
                    child: result[0].child.map((e) => insertNodesCombinator(e, selector, insert)),
                }, result[1]];
            } else if (search_deep) {
                result = [{
                    tag: result[0].tag,
                    attribute: result[0].attribute,
                    child: result[0].child.map((e) => insertNodes(e, selector, insert, true)),
                }, result[1]];
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
