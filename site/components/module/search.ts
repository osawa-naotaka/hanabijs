import { A, Div, Li, compoundStyles, createDom, element, registerComponent, styles } from "@/main";
import type { HArgument, HClientFn, HComponentFn, HNode, Store } from "@/main";
import { svgIcon } from "@site/components/element/svgIcon";

export function search(store: Store): HComponentFn<HArgument> {
    const Search = element("search", { class_names: ["content"] });
    const SearchBar = element("search-bar");
    const SearchInput = element("search-input", { tag: "input" });
    const SearchInputIcon = svgIcon(store);
    const SearchResult = element("search-result", { tag: "ul" });
    const SearchResultItem = element("search-result-item", { tag: "li" });

    const component_sytles = [
        styles(SearchBar, ROW("0.5rem"), BORDER_UNDERLINE),
        styles(SearchInput, DEFAULT_TEXT_BG(store), HEIGHT(S_2XLARGE(store))),
        compoundStyles([[SearchInput, "::placeholder"]], OPACITY("0.5")),
        styles(SearchResult, MARGIN_BLOCK(S_3XLARGE(store))),
        styles(SearchResultItem, MARGIN_BLOCK(S_3XLARGE(store))),
    ];

    return registerComponent(
        store,
        Search,
        component_sytles,
        (argument) => () =>
            Search({ class: argument.class })(
                SearchBar({})(
                    SearchInput({ type: "search", placeholder: "SEARCH KEYWORDS" })(),
                    SearchInputIcon({ name: "magnifier-glass" })(),
                ),
                SearchResult({})(SearchResultItem({})("no result.")),
            ),
        import.meta.path,
    );
}

import { StaticSeekError, createSearchFn } from "staticseek";
import type { SearchResult } from "staticseek";

export default function clientFunction(store: Store): HClientFn {
    const SearchResultItem = searchResultItem(store);

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

import {
    BORDER_UNDERLINE,
    DEFAULT_TEXT_BG,
    FONT_SIZE,
    F_SMALL,
    F_TINY,
    HEIGHT,
    MARGIN_BLOCK,
    OPACITY,
    ROW,
    ROW_WRAP,
    S_2XLARGE,
    S_3XLARGE,
} from "@/lib/stylerules";
import { v } from "@/main";
import { dateTime } from "@site/components/element/dateTime";
import { tagList } from "@site/components/element/tagList";
import { postFmSchema } from "@site/config/site.config";

export const SearchKeySchema = v.object({
    slug: v.string(),
    data: postFmSchema,
});

type SearchResultItemAttribute = {
    result: SearchResult;
};

function searchResultItem(store: Store): HComponentFn<SearchResultItemAttribute> {
    const SearchResultItem = element("search-result-item", { tag: "li" });
    const SearchResultItemMeta = element("search-result-item-meta");
    const SearchResultItemTitle = element("search-result-item-title");
    const SearchResultItemDescription = element("search-result-item-description");
    const DateTime = dateTime(store);
    const Tags = tagList(store);

    const component_styles = [
        styles(SearchResultItemMeta, ROW("2px 0.5rem"), ROW_WRAP, FONT_SIZE(F_SMALL(store)), BORDER_UNDERLINE),
        styles(SearchResultItemDescription, FONT_SIZE(F_TINY(store))),
    ];

    return registerComponent(store, SearchResultItem, component_styles, ({ result }) => () => {
        const key = v.parse(SearchKeySchema, result.key);
        return SearchResultItem({})(
            SearchResultItemMeta({})(
                Div({})(key.data.author),
                DateTime({ datetime: key.data.date })(),
                Tags({ slugs: key.data.tag || [] })(),
            ),
            SearchResultItemTitle({})(A({ href: `/posts/${key.slug}` })(key.data.title)),
            SearchResultItemDescription({})(result.refs[0].wordaround || ""),
        );
    });
}
