import type { Attribute, HNode } from "@/lib/core/component";
import { sanitizeAttributeValue, sanitizeBasic, validateAttributeKey, validateElementName } from "@/lib/core/sanityze";

// DOM Builder
export function createDom(node: HNode, d: Document = document): Node[] {
    return createDomInternal(0, [], d)(node);
}

function createDomInternal(
    depth: number,
    additional_class: string | string[],
    d: Document = document,
): (node: HNode) => Node[] {
    return (node: HNode) => {
        if (depth > 64) {
            throw new Error("stringifyToHtml: html element nesting depth must be under 64.");
        }

        if (typeof node === "string") {
            return [d.createTextNode(sanitizeBasic(node))];
        }

        if (node.tag === "raw") {
            throw new Error("Raw node must not be used in client module.");
        }

        if (!validateElementName(node.tag)) {
            throw new Error(`stringifyToHtml: invalid element name ${node.tag}.`);
        }

        if (node.tag === "unwrap") {
            return node.child.flatMap(createDomInternal(depth + 1, additional_class, d));
        }

        if (node.tag === "class") {
            return node.child.flatMap(createDomInternal(depth + 1, node.attribute.class || [], d));
        }

        const element = d.createElement(node.tag);
        setAttribute(element, node.attribute);
        const classes = typeof additional_class === "string" ? [additional_class] : additional_class;
        element.classList.add(...classes.map(sanitizeAttributeValue("class")));

        for (const child of node.child) {
            for (const child_element of createDomInternal(depth + 1, [], d)(child)) {
                element.appendChild(child_element);
            }
        }
        return [element];
    };
}

function setAttribute(element: HTMLElement, attribute: Partial<Attribute>): void {
    for (const [raw_key, value] of Object.entries(attribute)) {
        const key = raw_key.replaceAll("_", "-");

        if (!validateAttributeKey(key)) {
            throw new Error(`attributeToString: invalid attribute key ${key}.`);
        }

        if (value === "" || value === null) {
            element.setAttribute(key, "");
            return;
        }

        if (typeof value !== "string" && !Array.isArray(value)) {
            throw new Error(
                `attributeToString: invalid attribute value type ${value}. only string value or array of string value is allowd.`,
            );
        }

        for (const v of Array.isArray(value) ? value : [value]) {
            element.setAttribute(key, sanitizeAttributeValue(key)(v));
        }
    }
}
