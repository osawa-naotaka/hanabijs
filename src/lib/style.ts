import type { HAnyComponentFn, HComponent } from "./component";
import { mergeRecord } from "./util";

// Style
export type StyleRule = {
    selectorlist: SelectorList;
    properties: Properties;
};

export type SelectorList = Selector[];

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

export type Properties = Record<string, string[] | string>;

function simpleSelectorIsString(selector: SimpleSelector): selector is string {
    return typeof selector === "string";
}

function simpleSelectorIsComponentFn(selector: SimpleSelector): selector is HAnyComponentFn {
    return typeof selector === "function";
}

export function style(selector: SimpleSelector, properties: Properties): StyleRule {
    return {
        selectorlist: [createSelector([selector])],
        properties,
    };
}

export function styles(selector: SimpleSelector, ...propaties: Properties[][]): StyleRule {
    return {
        selectorlist: [createSelector([selector])],
        properties: propaties.reduce((p, c) => mergeRecord(p, c.reduce(mergeRecord)), {}),
    };
}

export function compoundStyle(
    selector: (SimpleSelector | CompoundSelector | Combinator)[],
    properties: Properties,
): StyleRule {
    return {
        selectorlist: [createSelector(selector)],
        properties,
    };
}

export function compoundStyles(
    selector: (SimpleSelector | CompoundSelector | Combinator)[],
    ...propaties: Properties[][]
): StyleRule {
    return {
        selectorlist: [createSelector(selector)],
        properties: propaties.reduce((p, c) => mergeRecord(p, c.reduce(mergeRecord)), {}),
    };
}


export function createSelector(selector: (SimpleSelector | CompoundSelector | Combinator)[]): Selector {
    switch (selector.length) {
        case 0:
            throw new Error("createSelector: no selector specified.");
        case 1:
            if (tokenIsCombinator(selector[0])) {
                throw new Error(`createSelector: SimpleSelector or CompoundSelector must be specified. ${selector[0]}`);
            }
            if (tokenIsCompoundSelector(selector[0])) {
                return selector[0];
            }
            if (simpleSelectorIsString(selector[0])) {
                return [selector[0]];
            }
            if (simpleSelectorIsComponentFn(selector[0])) {
                return [selector[0].name];
            }
            throw new Error(`createSelector: internal error. type mismatch 1 at ${selector[0]}`);
        case 2:
            throw new Error(`createSelector: too few argument. ${selector[0]} ${selector[1]}`);
        default:
            if (!tokenIsCombinator(selector[0]) && tokenIsCombinator(selector[1])) {
                let compound = [];
                if (tokenIsCompoundSelector(selector[0])) {
                    compound = selector[0];
                } else if (simpleSelectorIsString(selector[0])) {
                    compound = [selector[0]];
                } else if (simpleSelectorIsComponentFn(selector[0])) {
                    compound = [selector[0].name];
                } else {
                    throw new Error(`createSelector: internal error. type mismatch 2 at ${selector[0]}.`);
                }

                return {
                    compound,
                    combinator: selector[1],
                    descendant: createSelector(selector.slice(2)),
                };
            }
            throw new Error(`createSelector: type mismatch. ${selector[0]}, ${selector[1]}`);
    }
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
export function stringifyToCss(components: HComponent[]): string {
    return components.map(rulesToString).join("");
}

export function rulesToString(semantic: HComponent): string {
    const res: string[] = [];
    for (const rule of semantic.style) {
        const selectors_string = rule.selectorlist.map(selectorToString).join(", ");
        const propaties_string = propatiesToString(rule.properties);
        res.push(`${selectors_string} { ${propaties_string} }\n`);
    }

    return res.join("");
}

function stringifySelector(selector: CompoundSelector): string {
    return selector.map((s) => (typeof s === "function" ? s.name : s)).join("");
}

function selectorToString(selector: Selector): string {
    if (isCompoundSelector(selector)) {
        return stringifySelector(selector);
    }
    return selector.combinator === " "
        ? `${stringifySelector(selector.compound)} ${selectorToString(selector.descendant)}`
        : `${stringifySelector(selector.compound)} ${selector.combinator} ${selectorToString(selector.descendant)}`;
}

function propatiesToString(properties: Properties): string {
    return Object.entries(properties)
        .map(
            ([key, value]) =>
                `${key.replaceAll("_", "-")}: ${typeof value === "string" ? value : key === "font-family" || key === "font_family" ? value.join(", ") : value.join(" ")};`,
        )
        .join(" ");
}
