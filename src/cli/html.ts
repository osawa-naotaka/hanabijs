import type { Attribute, HNode, HRootPageFn } from "@/lib/core/component";
import { DOCTYPE } from "@/lib/core/elements";
import type { HComponentInsert, Store } from "@/lib/core/store";
import { insertNodes } from "@/lib/server/inserter";
import { stringifyToHtml } from "@/lib/server/stringify";

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
