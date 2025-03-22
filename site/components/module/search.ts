import { A, Div, compoundStyle, createDom, registerComponent, semantic, style } from "@/main";
import type { HArgument, HClientFn, HComponentFn, Repository } from "@/main";
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
        ],
        import.meta.path,
    );

    const Search = semantic("search", { class_names: ["content"] });
    const SearchBar = semantic("search-bar");
    const SearchInput = semantic("search-input", { tag: "input" });
    const SvgIcon = svgIcon(repo);
    const SearchResult = semantic("search-result", { tag: "ul" });
    const SearchResultItem = semantic("search-result-item", { tag: "li" });

    return (argument) => () =>
        Search({ class: argument.class })(
            SearchBar({})(
                SearchInput({ type: "search", placeholder: "SEARCH KEYWORDS" })(),
                SvgIcon({ name: "magnifier-glass" })(),
            ),
            SearchResult({})(SearchResultItem({})("no result.")),
        );
}

import { StaticSeekError, createSearchFn } from "staticseek";
import type { SearchResult } from "staticseek";

export default function clientFunction(repo: Repository): HClientFn {
    const SearchResultItem = searchResultItem(repo);

    return async () => {
        const search_fn = createSearchFn("/search-index.json");
        const search_result_e = document.querySelector<HTMLUListElement>(".search-result");
        const search_input_e = document.querySelector<HTMLInputElement>(".search-input");
        if (search_result_e === null || search_input_e === null) {
            throw new Error("search element not found.");
        }

        search_input_e.addEventListener("input", async () => {
            const result = await search_fn(search_input_e.value);
            if (result instanceof StaticSeekError) {
                search_result_e.innerHTML = "<li>search function internal errror</li>";
            } else {
                search_result_e.innerText = "";
                for (const r of result) {
                    const node = SearchResultItem({ result: r })();
                    for (const n of createDom(node)) {
                        search_result_e.appendChild(n);
                    }
                }
            }
        });
    };
}

import { v } from "@/main";
import { postFmSchema } from "@site/config/site.config";
import { dateTime } from "../element/dateTime";
import { tagList } from "../element/tagList";

export const SearchKeySchema = v.object({
    slug: v.string(),
    data: postFmSchema,
});

type SearchResultItemAttribute = {
    result: SearchResult;
};

function searchResultItem(repo: Repository): HComponentFn<SearchResultItemAttribute> {
    registerComponent(repo, "search-result-item", [
        style(".search-result-item-meta", {
            display: "flex",
            flex_wrap: "wrap",
            align_items: "center",
            gap: ["2px", "0.5rem"],
            border_block_end: ["2px", "solid"],
            padding_block_end: "2px",
            font_size: "0.8rem",
        }),
        style(".search-result-item-description", {
            font_size: "0.7rem",
        }),
    ]);

    const SearchResultItem = semantic("search-result-item", { tag: "li" });
    const SearchResultItemMeta = semantic("search-result-item-meta");
    const SearchResultItemTitle = semantic("search-result-item-title");
    const SearchResultItemDescription = semantic("search-result-item-description");
    const DateTime = dateTime(repo);
    const Tags = tagList(repo);

    return ({ result }) =>
        () => {
            const key = v.parse(SearchKeySchema, result.key);
            return SearchResultItem({})(
                SearchResultItemMeta({})(
                    Div({})(key.data.author),
                    DateTime({ datetime: key.data.date })(),
                    Tags({ slugs: key.data.principalTag.concat(key.data.associatedTags || []) })(),
                ),
                SearchResultItemTitle({})(A({ href: `/posts/${key.slug}` })(key.data.title)),
                SearchResultItemDescription({})(result.refs[0].wordaround || ""),
            );
        };
}
