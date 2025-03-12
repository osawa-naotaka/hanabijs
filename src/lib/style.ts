import type { Elem, HNode } from "./element";

// Style
export type Rule = {
    selectorlist: SelectorList;
    properties: Properties;
};

export type SelectorList = Selector[];

export type Selector = CompoundSelector | ComplexSelector;

export type CompoundSelector = SimpleSelector[];

export type SimpleSelector = string;

export type ComplexSelector = {
    compound: CompoundSelector;
    combinator: Combinator;
    descendant: Selector;
};

export type Combinator = " " | ">" | "+" | "~" | "||";

export type Properties = Record<string, string[] | string>;

export function style(...rules: [(SimpleSelector | CompoundSelector | Combinator)[][], Properties][]): Rule[] {
    return rules.map(([selectors, properties]) => ({
        selectorlist: selectors.map(createSelector),
        properties,
    }));
}

function isSelf(selector: (SimpleSelector | CompoundSelector | Combinator)[] | "&"): selector is "&" {
    return typeof selector === "string" && selector === "&";
}

export function rule(
    selector: (SimpleSelector | CompoundSelector | Combinator)[] | "&",
    propaties: Properties,
): Rule[] {
    return [
        {
            selectorlist: isSelf(selector) ? [["&"]] : [createSelector(selector)],
            properties: propaties,
        },
    ];
}

export function rule1(selector: (SimpleSelector | CompoundSelector | Combinator)[] | "&", propaties: Properties): Rule {
    return {
        selectorlist: isSelf(selector) ? [["&"]] : [createSelector(selector)],
        properties: propaties,
    };
}

export function createSelector(selector: (SimpleSelector | CompoundSelector | Combinator)[]): Selector {
    switch (selector.length) {
        case 0:
            throw new Error("S internal error 1.");
        case 1:
            if (tokenIsCombinator(selector[0])) {
                throw new Error("S internal error 2.");
            }
            return typeof selector[0] === "string" ? [selector[0]] : selector[0];
        case 2:
            throw new Error("S internal error 3.");
        default:
            if (!tokenIsCombinator(selector[0]) && tokenIsCombinator(selector[1])) {
                return {
                    compound: tokenIsCompoundSelector(selector[0]) ? selector[0] : [selector[0]],
                    combinator: selector[1],
                    descendant: createSelector(selector.slice(2)),
                };
            }
    }
    throw new Error("S internal error 4.");
}

function tokenIsCombinator(c: SimpleSelector | CompoundSelector | Combinator): c is Combinator {
    return typeof c === "string" && (c === " " || c === ">" || c === "+" || c === "~");
}

function tokenIsCompoundSelector(s: SimpleSelector | CompoundSelector | Combinator): s is CompoundSelector {
    return Array.isArray(s);
}

export function isCompoundSelector(s: Selector): s is CompoundSelector {
    return Array.isArray(s);
}

// Stringify
export function stringifyToCss(node: HNode): string {
    if (typeof node === "string") {
        return "";
    }

    return [rulesToString(node), node.child.map(stringifyToCss).join("")].join("");
}

function rulesToString(elem: Elem): string {
    const res: string[] = [];
    for (const rule of elem.style) {
        const selectors_string = rule.selectorlist.map(selectorToString(elem)).join(", ");
        const propaties_string = propatiesToString(rule.properties);
        res.push(`${selectors_string} { ${propaties_string} }\n`);
    }

    return res.join("");
}

function stringifySelector(current: Elem, selector: CompoundSelector): string {
    if (selector.length === 1 && selector[0] === "&") {
        return `.${current.attribute.class}`;
    }
    return selector.join("");
}

function selectorToString(current: Elem): (selector: Selector) => string {
    return (selector: Selector) => {
        if (isCompoundSelector(selector)) {
            return stringifySelector(current, selector);
        }
        return selector.combinator === " "
            ? `${stringifySelector(current, selector.compound)} ${selectorToString(current)(selector.descendant)}`
            : `${stringifySelector(current, selector.compound)} ${selector.combinator} ${selectorToString(current)(selector.descendant)}`;
    };
}

function propatiesToString(properties: Properties): string {
    return Object.entries(properties)
        .map(([key, value]) => `${key.replaceAll("_", "-")}: ${typeof value === "string" ? value : value.join(" ")};`)
        .join(" ");
}
