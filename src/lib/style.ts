import type { Attribute, HAnyComponentFn, HElement, HNode } from "./component";
import type { Properties } from "./properties";
import type { HComponent } from "./repository";
import { unionArrayOfRecords, validatePropertyName } from "./util";

export type PropertyOf<T extends keyof Properties> = Properties[T];

// Style
export type StyleRule = {
    selector: SelectorList;
    properties: Properties;
};

export type SelectorList = SelectorContext[];

export type Selector = CompoundSelector | ComplexSelector;

export type CompoundSelector = SimpleSelector[];

// using any. fix it.
export type SimpleSelector = string | HAnyComponentFn;

export type ComplexSelector = {
    compound: CompoundSelector;
    combinator: Combinator;
    descendant: Selector;
};

export type Combinator = " " | ">" | "+" | "~" | "||";

export type SelectorContextItem = SimpleSelector | CompoundSelector | Combinator;

export type SelectorContext = SimpleSelector | SelectorContextItem[];

// Inserter (HNode).
export function insertNodes(
    root: HNode,
    selector: SelectorContextItem[],
    insert: HNode[],
    search_deep: boolean,
): HNode {
    if (typeof root === "string") {
        return root;
    }

    if (selector.length === 0) {
        throw new Error("insertNodes: selector is empty.");
    }
    if (selector.length === 1) {
        if (isCombinator(selector[0])) {
            throw new Error(`selector must not end with combinator "${selector[0]}"`);
        }
        if (matchCompoundSelector(normalizeSelector(selector[0]), root)) {
            return {
                element_name: root.element_name,
                tag: root.tag,
                attribute: root.attribute,
                child: root.child ? [...root.child, ...insert] : insert,
            };
        }
        if (search_deep) {
            return {
                element_name: root.element_name,
                tag: root.tag,
                attribute: root.attribute,
                child: root.child.map((c) => insertNodes(c, selector, insert, true)),
            };
        }
    }

    if (isCombinator(selector[0])) {
        switch (selector[0]) {
            case ">":
                return insertNodes(root, selector.slice(1), insert, false);
            default:
                throw new Error("insertElementsCombinator: unsupported combinator.");
        }
    }

    if (matchCompoundSelector(normalizeSelector(selector[0]), root)) {
        return {
            element_name: root.element_name,
            tag: root.tag,
            attribute: root.attribute,
            child: root.child.map((c) => insertNodes(c, selector.slice(1), insert, true)),
        };
    }

    if (search_deep) {
        return {
            element_name: root.element_name,
            tag: root.tag,
            attribute: root.attribute,
            child: root.child.map((c) => insertNodes(c, selector, insert, true)),
        };
    }
    return root;
}

function hasClass(className: string, attribute: Attribute): boolean {
    if (attribute.class === undefined || typeof attribute.class !== "string") {
        return false;
    }
    return attribute.class.includes(className);
}

function matchCompoundSelector(selector: CompoundSelector, element: HElement<{ id?: string }>): boolean {
    for (const s of selector) {
        if (typeof s !== "string") {
            throw new Error("matchCompoundSelector: ComponentFn is not supported.");
        }
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

function isCompoundSelector(s: SelectorContextItem): s is CompoundSelector {
    return Array.isArray(s);
}

function isCombinator(s: SelectorContextItem): s is Combinator {
    return typeof s === "string" && (s === " " || s === ">" || s === "+" || s === "~");
}

function isSimpleSelector(s: SelectorContextItem): s is SimpleSelector {
    return (typeof s === "string" && !isCombinator(s)) || typeof s === "function";
}

function isString(selector: SimpleSelector): selector is string {
    return typeof selector === "string";
}

function isComponentFn(selector: SimpleSelector): selector is HAnyComponentFn {
    return typeof selector === "function";
}

export function style(context: SelectorContext, ...properties: Properties[]): StyleRule {
    return {
        selector: [context],
        properties: unionArrayOfRecords(properties),
    };
}

function normalizeSelector(context: SelectorContextItem): CompoundSelector {
    if (isCombinator(context)) {
        throw new Error(`createSelector: SimpleSelector or CompoundSelector must be specified. ${context[0]}`);
    }
    if (isCompoundSelector(context)) {
        return context;
    }
    if (isSimpleSelector(context)) {
        if (isString(context)) {
            return [context];
        }
        if (isComponentFn(context)) {
            return [context.name];
        }
    }
    throw new Error(`createSelector: internal error. type mismatch 1 at ${context}`);
}

// Stringify
export function stringifyToCss(components: HComponent[]): string {
    return components.map(rulesToString).join("");
}

export function rulesToString(element: HComponent): string {
    const res: string[] = [];
    for (const rule of element.style) {
        const selectors_string = rule.selector.map(selectorToString).join(", ");
        const propaties_string = propertiesToString(rule.properties);
        res.push(`${selectors_string} { ${propaties_string} }\n`);
    }

    return res.join("");
}

function selectorToString(selector: SelectorContext): string {
    if (selectorContextIsSelectorContextItem(selector)) {
        return selector.map(selectorToString).join(" ");
    }
    const selector_str = isString(selector) ? selector : selector.name;
    if (selector_str.length > 64) {
        throw new Error(`stringifySelector: selector length must be under 64 characters. (${selector_str}).`);
    }
    return selector_str;
}

export function selectorContextIsSelectorContextItem(context: SelectorContext): context is SelectorContextItem[] {
    return Array.isArray(context);
}

function valueToString(value: string | string[] | string[][]): string {
    if (typeof value === "string") {
        return singleValueToString(value);
    }
    if (value.every((x) => typeof x === "string")) {
        return spaceSeparatedValueToString(value);
    }
    return commaSeparatedValueToString(value);
}

function singleValueToString(value: string): string {
    if (value.length > 512) {
        throw new Error(`propertyesToString: value length must be under 512 characters. (${value})`);
    }
    return value;
}

function spaceSeparatedValueToString(value: string[]): string {
    return value.map(singleValueToString).join(" ");
}

function commaSeparatedValueToString(value: string[][]): string {
    return value
        .map((x) => (typeof x === "string" ? singleValueToString(x) : spaceSeparatedValueToString(x)))
        .join(", ");
}

function propertiesToString(properties: Properties): string {
    return Object.entries(properties)
        .map(([raw_key, raw_value]) => {
            if (!validatePropertyName(raw_key)) {
                throw new Error(`propertyesToString: invalid key. (${raw_key})})`);
            }
            if (raw_value === undefined) {
                throw new Error(`propertiesToString: undefined value is not allowed in property ${raw_key}`);
            }
            const key = raw_key.replaceAll("_", "-");
            const value = valueToString(raw_value);
            return `${key}: ${value};`;
        })
        .join(" ");
}
