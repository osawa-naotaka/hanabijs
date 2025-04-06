import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { type Attribute, type HNode, addClassInRecord } from "./component";
import { sanitizeAttributeValue, sanitizeBasic, validateAttributeKey, validateElementName } from "./util";

// Strigify
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
