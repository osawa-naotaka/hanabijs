import { A, Div, Input, Li, Ul, createDom } from "@/main";
import type { HArgument, HClientFn, HComponentFn, HNode } from "@/main";
import { SvgIcon } from "@site/components/element/svgIcon";

export const Search: HComponentFn<HArgument> = () => () =>
    Div({ class: "search" })(
        Div({ class: "search-bar" })(
            Input({ class: "search-input", type: "search", placeholder: "SEARCH KEYWORDS" })(),
            SvgIcon({ name: "magnifier-glass" })(),
        ),
        Ul({ class: "search-result" })(Li({ class: "search-result-item" })("no result.")),
    );

import { StaticSeekError, createSearchFn } from "staticseek";
import type { SearchResult } from "staticseek";

export default function clientFunction(): HClientFn {
    return async () => {
        const search_fn = createSearchFn("/search-index.json");
        const search_result_e = querySelector<HTMLUListElement>(".search-result");
        const search_input_e = querySelector<HTMLInputElement>(".search-input");

        search_input_e.addEventListener("input", async () => {
            const results = await search_fn(search_input_e.value);
            if (results instanceof StaticSeekError) {
                setChild(search_result_e, [Li({})(`search function internal errror: ${results}`)]);
            } else {
                setChild(
                    search_result_e,
                    results.map((result) => SearchResultItem({ result })()),
                );
            }
        });
    };
}

function querySelector<T extends Element>(selector: string, d: Document = document): T {
    const e = d.querySelector<T>(selector);
    if (e === null) {
        throw new Error(`element not found: ${selector}`);
    }
    return e;
}

function setChild(element: HTMLElement, nodes: HNode[]): void {
    element.innerText = "";
    for (const node of nodes) {
        for (const n of createDom(node)) {
            element.appendChild(n);
        }
    }
}

import { v } from "@/main";
import { DateTime } from "@site/components/element/dateTime";
import { TagList } from "@site/components/element/tagList";
import { postFmSchema } from "@site/config/site.config";

export const SearchKeySchema = v.object({
    slug: v.string(),
    data: postFmSchema,
});

type SearchResultItemAttribute = {
    result: SearchResult;
};

const SearchResultItem: HComponentFn<SearchResultItemAttribute> =
    ({ result }) =>
    () => {
        const key = v.parse(SearchKeySchema, result.key);

        return Li({ class: "search-result-item" })(
            Div({ class: "search-result-item-meta" })(
                Div({})(key.data.author),
                DateTime({ datetime: key.data.date })(),
                TagList({ slugs: key.data.tag || [] })(),
            ),
            Div({ class: "search-result-item-title" })(A({ href: `/posts/${key.slug}` })(key.data.title)),
            Div({ class: "search-result-item-description" })(result.refs[0].wordaround || ""),
        );
    };
