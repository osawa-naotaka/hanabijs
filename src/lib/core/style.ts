import type { HAnyComponentFn } from "@/lib/core/component";
import type { Properties } from "@/lib/core/properties";
import { unionArrayOfRecords } from "@/lib/core/util";

export type PropertyOf<T extends keyof Properties> = Properties[T];

// Style
export type StyleRule = {
    atrules?: Atrule[];
    selector: SelectorList;
    properties: Properties;
};

export type Atrule = string[];

export type SelectorList = SelectorContext[];

export type CompoundSelector = SimpleSelector[];

export type SimpleSelector = string | HAnyComponentFn;

export type Combinator = " " | ">" | "+" | "~" | "||";

export type Selector = SimpleSelector | CompoundSelector | Combinator;

export type SelectorContext = SimpleSelector | Selector[];

export function style(...context: Selector[]): (...properties: Properties[]) => StyleRule {
    return (...properties: Properties[]) => ({
        selector: [context],
        properties: unionArrayOfRecords(properties),
    });
}

export function atStyle(
    ...atrules: Atrule[]
): (...context: SelectorContext[]) => (...properties: Properties[]) => StyleRule {
    return (context: SelectorContext) =>
        (...properties: Properties[]) => ({
            atrules,
            selector: [context],
            properties: unionArrayOfRecords(properties),
        });
}

export function normalizeSelector(context: Selector): CompoundSelector {
    if (isCombinator(context)) {
        return [context];
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

export function isCompoundSelector(s: Selector): s is CompoundSelector {
    return Array.isArray(s);
}

export function isCombinator(s: Selector): s is Combinator {
    return typeof s === "string" && (s === " " || s === ">" || s === "+" || s === "~");
}

function isSimpleSelector(s: Selector): s is SimpleSelector {
    return (typeof s === "string" && !isCombinator(s)) || typeof s === "function";
}

function isString(selector: SimpleSelector): selector is string {
    return typeof selector === "string";
}

function isComponentFn(selector: SimpleSelector): selector is HAnyComponentFn {
    return typeof selector === "function";
}
