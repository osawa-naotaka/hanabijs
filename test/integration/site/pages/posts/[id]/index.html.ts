import { H2, element, registerComponent, style } from "zephblaze/core";
import type { HRootPageFn, Store } from "zephblaze/core";
import page from "../../../components/page";
import { site } from "../../../config";

type RootParameter = {
    id: string;
};

export async function getStaticPaths(): Promise<RootParameter[]> {
    return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default function Root(store: Store): HRootPageFn<RootParameter> {
    registerComponent(store, "page-main-area", [
        style("h2")({
            color: "red",
        }),
    ]);
    const Page = page(store);
    const PageMainArea = element("page-main-area", { tag: "main" });

    return async (parameter) => {
        const title = `Post Page ${parameter.id}`;

        return Page({ title: site.title, description: site.description }, PageMainArea({}, H2({}, title)));
    };
}
