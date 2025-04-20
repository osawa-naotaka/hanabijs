import { generateFontCss } from "@/cli/font";
import type { Properties } from "@/lib/core/properties";
import { validatePropertyName } from "@/lib/core/sanityze";
import type { HComponent, Store } from "@/lib/core/store";
import { isCompoundSelector, normalizeSelector } from "@/lib/core/style";
import type { Selector, SelectorContext } from "@/lib/core/style";

export async function bundleCss(
    store: Store,
    base_name: string,
    require: NodeJS.Require,
): Promise<string | null | Error> {
    const font_css = generateFontCss(store, base_name);

    const css_files = Array.from(store.components.values())
        .map((x) => x.attachment?.script)
        .filter((x) => x !== undefined);

    for (const client of css_files) {
        const client_fn = require(client.replace("file://", ""));
        if (typeof client_fn.default === "function") {
            await client_fn.default(store);
        } else {
            return new Error(`bundleCss: import file "${client}" does not have default export.`);
        }
    }

    const css = stringifyToCss(Array.from(store.components.values()));
    return `${css}${font_css}`;
}

// Rule To CSS
function stringifyToCss(components: HComponent[]): string {
    return `@charset "utf-8";\n@layer base, font, low, main, high;\n${components.map(rulesToString).join("")}`;
}

function rulesToString(element: HComponent): string {
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
