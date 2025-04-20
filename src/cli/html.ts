import type { Attribute, HNode, HRootPageFn } from "@/lib/core/component";
import { DOCTYPE } from "@/lib/core/elements";
import { sanitizeAttributeValue, sanitizeBasic, validateAttributeKey, validateElementName } from "@/lib/core/sanityze";
import type { HComponentInsert, Store } from "@/lib/core/store";
import { addClassInRecord } from "@/lib/core/util";
import { insertNodes } from "@/lib/server/inserter";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

export async function bundleHtml(
    store: Store,
    params: Attribute,
    root_page_fn: HRootPageFn<Attribute>,
    insert_nodes: HNode[],
): Promise<string> {
    const top_node = await root_page_fn(params);

    const attached = insertAttachmentNode(store, top_node);

    const all_processed = insertNodes(attached, ["head"], insert_nodes, true);

    return DOCTYPE() + stringifyToHtml(0, [])(all_processed);
}

function insertAttachmentNode(store: Store, top_node: HNode) {
    const insert_nodes: [string, HComponentInsert[]][] = [];
    for (const [key, value] of store.components.entries()) {
        if (value.attachment?.inserts !== undefined) {
            insert_nodes.push([key, value.attachment.inserts]);
        }
    }

    return insert_nodes.reduce(
        (p, c) => c[1].reduce((pp, cc) => insertNodes(pp, cc.selector, cc.nodes, true), p),
        top_node,
    );
}

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
