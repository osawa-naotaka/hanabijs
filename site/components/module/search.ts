import {
    A,
    compoundStyle,
    createDom,
    registerComponent,
    semanticComponent,
    simpleSemanticComponent,
    style,
} from "@/main";
import type { HArgument, HComponentFn, Repository } from "@/main";
import { svgIcon } from "@site/components/element/svgIcon";
import { appearence } from "@site/config/site.config";

export function search(repo: Repository): HComponentFn<HArgument> {
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
            style(".search-result-item-meta", {
                display: "flex",
                flex_wrap: "wrap",
                align_items: "center",
                gap: ["2px", "0.5rem"],
                border_block_end: ["2px", "solid"],
                padding_block_end: "2px",
            }),
            style(".search-result-item-tag", {
                font_size: "0.8rem",
                background_color: appearence.color.main,
                color: appearence.color.background,
                font_weight: "bold",
                padding_inline: "0.5rem",
                border_radius: "4px",
            }),
            style(".search-result-item-description", {
                font_size: "0.7rem",
            }),
        ],
        import.meta.path,
    );

    const Search = semanticComponent("search", { class_names: ["content"] });
    const SearchBar = simpleSemanticComponent("search-bar");
    const SearchInput = semanticComponent("search-input", { tag: "input" });
    const SvgIcon = svgIcon(repo);
    const SearchResult = simpleSemanticComponent("search-result", { tag: "ul" });
    const SearchResultItem = simpleSemanticComponent("search-result-item", { tag: "li" });

    return (argument) =>
        Search(
            { class: argument.class },
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
        author: v.string(),
        date: v.string(),
        principalTag: v.array(v.string()),
        associatedTags: v.optional(v.array(v.string())),
    }),
});

type SearchResultItemAttribute = {
    result: SearchResult;
};

function searchResultItem(): HComponentFn<SearchResultItemAttribute> {
    const SearchResultItem = simpleSemanticComponent("search-result-item", { tag: "li" });
    const SearchResultItemMeta = simpleSemanticComponent("search-result-item-meta");
    const SearchResultItemTag = simpleSemanticComponent("search-result-item-tag");
    const SearchResultItemTitle = simpleSemanticComponent("search-result-item-title");
    const SearchResultItemDescription = simpleSemanticComponent("search-result-item-description");

    return ({ result }) => {
        const key = v.parse(SearchKeySchema, result.key);
        return SearchResultItem(
            SearchResultItemMeta(
                key.data.author,
                key.data.date,
                ...key.data.principalTag.map((tag) => SearchResultItemTag(tag)),
                ...(key.data.associatedTags || []).map((tag) => SearchResultItemTag(tag)),
            ),
            SearchResultItemTitle(A({ href: `/posts/${key.id}` }, key.data.title)),
            SearchResultItemDescription(result.refs[0].wordaround || ""),
        );
    };
}
