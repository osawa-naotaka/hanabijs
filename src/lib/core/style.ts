import type { Attribute, HAnyComponentFn, HElement, HNode } from "@/lib/core/component";
import { unionArrayOfRecords, validatePropertyName } from "@/lib/core/coreutil";
import type { Properties } from "@/lib/core/properties";
import type { HComponent } from "@/lib/core/store";

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

// Inserter (HNode).
export function insertNodes(root: HNode, selector: Selector[], insert: HNode[], search_deep: boolean): HNode {
    if (typeof root === "string") {
        return root;
    }

    if (selector.length === 0) {
        return root;
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
        const child =
            selector.length === 1
                ? [...root.child, ...insert]
                : root.child.map((c) => insertNodes(c, selector.slice(1), insert, true));
        return {
            tag: root.tag,
            attribute: root.attribute,
            child,
        };
    }

    if (search_deep) {
        return {
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

function isCompoundSelector(s: Selector): s is CompoundSelector {
    return Array.isArray(s);
}

function isCombinator(s: Selector): s is Combinator {
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

function normalizeSelector(context: Selector): CompoundSelector {
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

// Stringify
export function stringifyToCss(components: HComponent[]): string {
    return `@charset "utf-8";\n@layer base, font, low, main, high;\n${components.map(rulesToString).join("")}`;
}

export function rulesToString(element: HComponent): string {
    const res: string[] = [];
    for (const rule of element.style) {
        const selectors_string = rule.selector.map(selectorContextToString).join(", ");
        const propaties_string = propertiesToString(rule.properties);
        if (rule.atrules) {
            const has_layer = rule.atrules.some((x) => x.length > 0 && x[0].localeCompare("@layer") === 0);
            const atrules = has_layer ? rule.atrules : [["@layer", "main"], ...rule.atrules];
            res.push(
                `${atrules.map((x) => x.join(" ")).join(" { ")} { ${selectors_string} { ${propaties_string} } ${" } ".repeat(atrules.length)}\n`,
            );
        } else {
            res.push(`@layer main { ${selectors_string} { ${propaties_string} } }\n`);
        }
    }

    return res.join("");
}

function selectorContextToString(selector: SelectorContext): string {
    if (isSelector(selector)) {
        return selector.map(selectorToString).join(" ");
    }
    return selectorToString(selector);
}

function selectorToString(selector: Selector): string {
    if (isCompoundSelector(selector)) {
        return selector.map(normalizeSelector).join("");
    }
    return normalizeSelector(selector).join("");
}

function isSelector(context: SelectorContext): context is Selector[] {
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
