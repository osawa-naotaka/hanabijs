import type { Attribute, HElement, HNode } from "@/lib/core/component";
import { type CompoundSelector, type Selector, isCombinator, normalizeSelector } from "@/lib/core/style";

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

function hasClass(className: string, attribute: Attribute): boolean {
    if (attribute.class === undefined || typeof attribute.class !== "string") {
        return false;
    }
    return attribute.class.includes(className);
}
