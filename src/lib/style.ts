import type { HAnyComponentFn } from "./component";
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

export function isCompoundSelector(s: Selector): s is CompoundSelector {
    return Array.isArray(s);
}

export function style(context: SelectorContext, ...properties: Properties[]): StyleRule {
    return {
        selector: [context],
        properties: unionArrayOfRecords(properties),
    };
}

export function createSelector(context: SelectorContextItem[]): Selector {
    switch (context.length) {
        case 0:
            throw new Error("createSelector: no selector specified.");
        case 1:
            return normalizeSelector(context[0]);
        case 2:
            if (tokenIsCombinator(context[0]) || tokenIsCombinator(context[1])) {
                throw new Error(
                    `createSelector: a combinator must be surrounded by two selector "${context[0]}" "${context[1]}" `,
                );
            }
            return {
                compound: normalizeSelector(context[0]),
                combinator: " ",
                descendant: normalizeSelector(context[1]),
            };
        default:
            if (tokenIsCombinator(context[0])) {
                throw new Error(`createSelector: two selector appear twice in a row. "${context[0]}"`);
            }
            if (tokenIsCombinator(context[1])) {
                return {
                    compound: normalizeSelector(context[0]),
                    combinator: context[1],
                    descendant: createSelector(context.slice(2)),
                };
            }
            return {
                compound: normalizeSelector(context[0]),
                combinator: " ",
                descendant: createSelector(context.slice(1)),
            };
    }
}

function normalizeSelector(context: SelectorContextItem): CompoundSelector {
    if (tokenIsCombinator(context)) {
        throw new Error(`createSelector: SimpleSelector or CompoundSelector must be specified. ${context[0]}`);
    }
    if (tokenIsCompoundSelector(context)) {
        return context;
    }
    if (simpleSelectorIsString(context)) {
        return [context];
    }
    if (simpleSelectorIsComponentFn(context)) {
        return [context.name];
    }
    throw new Error(`createSelector: internal error. type mismatch 1 at ${context}`);
}

function tokenIsCombinator(c: SelectorContextItem): c is Combinator {
    return typeof c === "string" && (c === " " || c === ">" || c === "+" || c === "~");
}

function tokenIsCompoundSelector(s: SelectorContextItem): s is CompoundSelector {
    return Array.isArray(s);
}

function simpleSelectorIsString(selector: SimpleSelector): selector is string {
    return typeof selector === "string";
}

function simpleSelectorIsComponentFn(selector: SimpleSelector): selector is HAnyComponentFn {
    return typeof selector === "function";
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

function stringifySelector(selector: CompoundSelector): string {
    return selector
        .map((s) => {
            const sel = typeof s === "function" ? s.name : s;
            if (sel.length > 64) {
                throw new Error(`stringifySelector: selector length must be under 64 characters. (${sel}).`);
            }
            return sel;
        })
        .join("");
}

function selectorToString(selector: SelectorContext): string {
    if (selectorContextIsSelectorContextItem(selector)) {
        return selector.map(selectorToString).join(" ");
    }
    const selector_str = simpleSelectorIsString(selector) ? selector : selector.name;
    if(selector_str.length > 64) {
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
