import type { HNode } from "./element";

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
        selectorlist: selectors.map((s) => createSelector(s[0] === ":root" ? s : ["*", " ", ...s])),
        properties,
    }));
}

export function rule(selector: (SimpleSelector | CompoundSelector | Combinator)[], propaties: Properties): Rule {
    return {
        selectorlist: [createSelector(selector)],
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

    return [rulesToString(node.style), node.child.map(stringifyToCss).join("")].join("");
}

export function rulesToString(rules: Rule[]): string {
    const res: string[] = [];
    for (const rule of rules) {
        const selectors_string = rule.selectorlist.map(selectorToString).join(", ");
        const propaties_string = propatiesToString(rule.properties);
        res.push(`${selectors_string} { ${propaties_string} }\n`);
    }

    return res.join("");
}

function selectorToString(selector: Selector): string {
    if (isCompoundSelector(selector)) {
        return selector.join("");
    }
    return selector.combinator === " "
        ? `${selector.compound.join("")} ${selectorToString(selector.descendant)}`
        : `${selector.compound.join("")} ${selector.combinator} ${selectorToString(selector.descendant)}`;
}

function propatiesToString(properties: Properties): string {
    return Object.entries(properties)
        .map(([key, value]) => `${key.replaceAll("_", "-")}: ${typeof value === "string" ? value : value.join(" ")};`)
        .join(" ");
}
