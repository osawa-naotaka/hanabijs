import type { Attribute, HNode } from "@/lib/core/component";
import { addClassInRecord } from "@/lib/core/component";
import type { Properties } from "@/lib/core/properties";
import {
    sanitizeAttributeValue,
    sanitizeBasic,
    validateAttributeKey,
    validateElementName,
    validatePropertyName,
} from "@/lib/core/sanityze";
import type { HComponent } from "@/lib/core/store";
import { isCompoundSelector, normalizeSelector } from "@/lib/core/style";
import type { Selector, SelectorContext } from "@/lib/core/style";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

// Node To HTML
export function stringifyToHtml(depth: number, additional_class: string | string[]): (node: HNode) => string {
    return (node: HNode) => {
        if (depth > 64) {
            throw new Error("stringifyToHtml: html element nesting depth must be under 64.");
        }

        if (typeof node === "string") {
            return sanitizeBasic(node);
        }

        if (node.tag === "raw") {
            const window = new JSDOM("").window;
            const purify = DOMPurify(window);
            return node.child
                .map((x) => {
                    if (typeof x !== "string") {
                        throw new Error(`Raw node must be string at '${node}'.`);
                    }
                    return purify.sanitize(x);
                })
                .join("");
        }

        if (!validateElementName(node.tag)) {
            throw new Error(`stringifyToHtml: invalid element name ${node.tag}.`);
        }

        if (node.tag === "unwrap") {
            return node.child.map(stringifyToHtml(depth + 1, additional_class)).join("");
        }

        if (node.tag === "class") {
            return node.child.map(stringifyToHtml(depth + 1, node.attribute.class || [])).join("");
        }

        const attribute =
            additional_class.length === 0 ? node.attribute : addClassInRecord(node.attribute, additional_class);
        return `<${node.tag}${attributeToString(attribute)}>${node.child.map(stringifyToHtml(depth + 1, [])).join("")}</${node.tag}>`;
    };
}

function attributeToString(attribute: Partial<Attribute>): string {
    return Object.entries(attribute)
        .map(([raw_key, value]) => {
            const key = raw_key.replaceAll("_", "-");

            if (!validateAttributeKey(key)) {
                throw new Error(`attributeToString: invalid attribute key ${key}.`);
            }

            if (key.length > 64) {
                throw new Error(`attributeToString: key length must be under 64 characters. (${key})`);
            }

            if (value === "" || value === null) {
                return ` ${key}`;
            }

            if (typeof value !== "string" && !Array.isArray(value)) {
                throw new Error(
                    `attributeToString: invalid attribute value type ${value}. only string value or array of string value is allowd.`,
                );
            }

            const sanitized = Array.isArray(value)
                ? value.map(sanitizeAttributeValue(key))
                : [sanitizeAttributeValue(key)(value)];

            return ` ${key}="${sanitized.join(" ")}"`;
        })
        .join("");
}

// Rule To CSS
export function stringifyToCss(components: HComponent[]): string {
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
