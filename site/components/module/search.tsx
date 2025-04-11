import { as, component, createDom, element, registerComponent, style } from "@/main";
import type { HArgument, HClientFn, HComponentFn, HNode, Store } from "@/main";

export function search(store: Store): HComponentFn<HArgument> {
    const Search = element("search");
    const SearchBar = element("search-bar");
    const Input = element("search-input", { tag: "input" });
    const InputIcon = hSvgIconFont(store, { type: "solid", name: "magnifying-glass" });
    const Result = element("search-result", { tag: "ul" });

    const component_sytles = [
        style(Search)(DEFAULT_RESPONSIVE_PAGE_WIDTH(store)),
        style(SearchBar)(ROW("0.5rem"), BORDER_UNDERLINE),
        style(Input)(DEFAULT_TEXT_BG(store), HEIGHT(S_2XLARGE(store))),
        style([Input, "::placeholder"])(OPACITY("0.5")),
        style(Result)(MARGIN_BLOCK(S_LARGE(store))),
    ];

    registerComponent(store, Search, component_sytles, { script: import.meta.path });

    return component(Search, () => (
        <Search>
            <SearchBar>
                <Input type="search" placeholder="SEARCH KEYWORDS" />
                <InputIcon />
            </SearchBar>
            <Result />
        </Search>
    ));
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
                setChild(search_result_e, [<li key="0">{`search function internal errror: ${results}`}</li>]);
            } else {
                setChild(
                    search_result_e,
                    results.map((result) => SearchResultItem({ result })),
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
    DEFAULT_RESPONSIVE_PAGE_WIDTH,
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
    S_LARGE,
} from "@/lib/stylerules";
import { hSvgIconFont } from "@/lib/ui/svgIconFont";
import { dateTime } from "@site/components/element/dateTime";
import { tag } from "@site/components/element/tag";
import { postFmSchema } from "@site/config/site.config";
import { TAG_DESIGN } from "@site/styles/design";
import * as v from "valibot";

export const SearchKeySchema = v.object({
    slug: v.string(),
    data: postFmSchema,
});

type SearchResultItemAttribute = {
    result: SearchResult;
};

function searchResultItem(store: Store): HComponentFn<SearchResultItemAttribute> {
    const ResultItem = element("search-result-item", { tag: "li" });
    const Meta = element("search-result-item-meta");
    const Title = element("search-result-item-title");
    const Description = element("search-result-item-description");
    const DateTime = dateTime();
    const Tag = as("serch-result-item-tag", tag());

    const component_styles = [
        style(ResultItem)(MARGIN_BLOCK(S_2XLARGE(store), "0")),
        style(Meta)(ROW("2px 0.5rem"), ROW_WRAP, FONT_SIZE(F_SMALL(store)), BORDER_UNDERLINE),
        style(Description)(FONT_SIZE(F_TINY(store))),
        TAG_DESIGN(store, "text", Tag),
    ];

    registerComponent(store, ResultItem, component_styles);

    return component(ResultItem, ({ result }) => {
        const key = v.parse(SearchKeySchema, result.key);
        return (
            <ResultItem>
                <Meta>
                    <div>{key.data.author}</div>
                    <DateTime datetime={key.data.date} />
                    {(key.data.tag || []).map((x) => (
                        <Tag slug={x} key={x} />
                    ))}
                </Meta>
                <Title>
                    <a href={`/posts/${key.slug}`}>{key.data.title}</a>
                </Title>
                <Description>{result.refs[0].wordaround || ""}</Description>
            </ResultItem>
        );
    });
}
