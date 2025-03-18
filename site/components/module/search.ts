import { compoundStyle, createSemantic, createSimpleSemantic, registerComponent, style } from "@/main";
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

import { createSearchFn } from "staticseek";

export default async function clientFunction(d: Document): Promise<void> {
    const search_fn = createSearchFn("/search-index.json");
    const result_element = d.querySelector<HTMLUListElement>(".search-result");
    if (result_element !== null) {
        const result = await search_fn("staticseek");
        console.log(result);
    }
}
