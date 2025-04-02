import DOMPurify from "dompurify";
import type { AttributeMap, HanabiTag, Tag } from "./elements";
import { sanitizeAttributeValue, sanitizeBasic, validateAttributeKey, validateElementName } from "./util";

// Attribute of HTML Element
export type AttributeValue = string | string[] | null | undefined;
export type Attribute = Record<string, AttributeValue>;
export type AttributeOf<K> = Partial<AttributeMap[K & keyof AttributeMap]>;

// HTML DOM Node = string or HTML Element
export type HNode<T extends Attribute = Attribute> = string | HElement<T>;

// HTML Element, with custom element name
export type HElement<K> = {
    element_name: string;
    tag: Tag | HanabiTag;
    attribute: Partial<K>;
    child: HNode[];
};

// hanabi Element (is function), expressing HTML element
export type HElementFn<K> = (attribute: AttributeOf<K>) => (...child: HNode[]) => HNode;

export function element<K extends Tag | HanabiTag = "div">(
    element_name: string,
    { class_names = [], tag = "div" as K }: { class_names?: string[]; tag?: K } = {},
): HElementFn<K> {
    const dot_name = `.${element_name}`;
    return {
        [dot_name]:
            (attribute: AttributeOf<K>) =>
            (...child: HNode[]) => ({
                element_name: dot_name,
                tag,
                attribute: addClassInRecord(attribute, [element_name, ...class_names]),
                child,
            }),
    }[dot_name];
}

// add class string to record.
function addClassInRecord<T extends { class?: string | string[] }>(record: T, className: string | string[]): T {
    const new_record = JSON.parse(JSON.stringify(record));
    new_record.class = addClassToHead(record, className);
    return new_record;
}

function addClassToHead<T extends { class?: string | string[] }>(
    attribute: T,
    className: string | string[],
): string | string[] {
    if (attribute.class !== undefined) {
        if (typeof className === "string") {
            return Array.isArray(attribute.class) ? [className, ...attribute.class] : [className, attribute.class];
        }
        return Array.isArray(attribute.class) ? [...className, ...attribute.class] : [...className, attribute.class];
    }
    return className;
}

// hanabi Component (is function)
export type HComponentFn<T> = (argument: HComponentFnArg<T>) => (...child: HNode[]) => HNode;
export type HComponentFnArg<T> = T & { class?: string | string[]; id?: string };

// biome-ignore lint/suspicious/noExplicitAny: HAnyComponent uses only for function.name
export type HAnyComponentFn = (argument: any) => (...child: HNode[]) => HNode;

export type HArgument = Record<string, unknown>;

// hanabi HTML Top export function
export type HRootPageFn<T> = (parameter: T) => Promise<HNode>;

// hanabi Client FUnction
export type HClientFn = () => Promise<void>;

// DOM Builder
export function createDom(node: HNode, d: Document = document): Node[] {
    return createDomInternal(0, d)(node);
}

function createDomInternal(depth: number, d: Document = document): (node: HNode) => Node[] {
    return (node: HNode) => {
        if (depth > 64) {
            throw new Error("stringifyToHtml: html element nesting depth must be under 64.");
        }

        if (typeof node === "string") {
            return [d.createTextNode(sanitizeBasic(node))];
        }

        if (node.tag === "raw") {
            const parser = new DOMParser();
            const purify = DOMPurify(window);
            return node.child.map((child) => {
                if (typeof child === "string") {
                    return parser.parseFromString(purify.sanitize(child), "text/html");
                }
                throw new Error(`Raw node must be string at ${node}.`);
            });
        }

        if (!validateElementName(node.tag)) {
            throw new Error(`stringifyToHtml: invalid element name ${node.tag}.`);
        }

        if (node.tag === "unwrap") {
            return node.child.flatMap(createDomInternal(depth + 1, d));
        }

        const element = d.createElement(node.tag);
        setAttribute(element, node.attribute);

        for (const child of node.child) {
            for (const child_element of createDomInternal(depth + 1, d)(child)) {
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
