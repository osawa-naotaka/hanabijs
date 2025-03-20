import { A, compoundStyle, createDom, createSemantic, createSimpleSemantic, registerComponent, style } from "@/main";
import type { HComponentFn, Repository } from "@/main";
import { svgIcon } from "@site/components/element/svgIcon";
import { appearence } from "@site/config/site.config";

export function search(repo: Repository): HComponentFn {
    registerComponent(
        repo,
        "search",
        [
            style(".search-bar", {
                display: "flex",
                align_items: "center",
                gap: "0.5rem",
                padding_block_end: "0.25rem",
                border_block_end: ["2px", "solid"],
            }),
            style(".search-input", {
                width: "100%",
                height: "1.5rem",
                border: ["0", "none"],
                outline: "none",
                font_size: "1rem",
                background_color: appearence.color.background,
            }),
            compoundStyle([[".search-input", "::placeholder"]], {
                opacity: "0.5",
            }),
            style(".search-result", {
                margin_block: "2rem",
                list_style_type: "none",
            }),
            style(".search-result-item", {
                margin_block: "2rem",
            }),
        ],
        import.meta.path,
    );

    const Search = createSemantic("search", { class_names: ["content"] });
    const SearchBar = createSimpleSemantic("search-bar");
    const SearchInput = createSemantic("search-input", { tag: "input" });
    const SvgIcon = svgIcon(repo);
    const SearchResult = createSimpleSemantic("search-result", { tag: "ul" });
    const SearchResultItem = createSimpleSemantic("search-result-item", { tag: "li" });

    return (attribute) =>
        Search(
            { class: attribute.class },
            SearchBar(
                SearchInput({ type: "search", placeholder: "SEARCH KEYWORDS" }),
                SvgIcon({ name: "magnifier-glass" }),
            ),
            SearchResult(SearchResultItem("no result.")),
        );
}

import { StaticSeekError, createSearchFn } from "staticseek";
import type { SearchResult } from "staticseek";

export default async function clientFunction(): Promise<void> {
    const search_fn = createSearchFn("/search-index.json");
    const search_result_e = document.querySelector<HTMLUListElement>(".search-result");
    const search_input_e = document.querySelector<HTMLInputElement>(".search-input");
    if (search_result_e === null || search_input_e === null) {
        throw new Error("search element not found.");
    }
    const SearchResultItem = searchResultItem();

    search_input_e.addEventListener("input", async () => {
        const result = await search_fn(search_input_e.value);
        if (result instanceof StaticSeekError) {
            search_result_e.innerHTML = "<li>search function internal errror</li>";
        } else {
            search_result_e.innerText = "";
            for (const r of result) {
                const node = SearchResultItem({ result: r });
                for (const n of createDom(node)) {
                    search_result_e.appendChild(n);
                }
            }
        }
    });
}

import * as v from "valibot";

export const SearchKeySchema = v.object({
    id: v.string(),
    data: v.object({
        title: v.string(),
    }),
});

type SearchResultItemAttribute = {
    result: SearchResult;
};

function searchResultItem(): HComponentFn<SearchResultItemAttribute> {
    const SearchResultItem = createSimpleSemantic("search-result-item", { tag: "li" });
    const SearchResultItemTitle = createSimpleSemantic("search-result-item-title");
    const SearchResultItemDescription = createSimpleSemantic("search-result-item-description");

    return (attribute) => {
        const key = v.parse(SearchKeySchema, attribute.result.key);
        return SearchResultItem(
            SearchResultItemTitle(A({ href: `/posts/${key.id}` }, key.data.title)),
            SearchResultItemDescription(attribute.result.refs[0].wordaround || ""),
        );
    };
}
