import { H2, registerComponent, component, style } from "hanabijs";
import type { HPath, HRootPageFn, Repository } from "hanabijs";
import page from "../../../components/page";
import { site } from "../../../config";

type RootParameter = {
    id: string;
};

export async function getStaticPaths(): Promise<HPath<RootParameter>> {
    return [{ params: { id: "1" } }, { params: { id: "2" } }, { params: { id: "3" } }];
}

export default function Root(repo: Repository): HRootPageFn<RootParameter> {
    registerComponent(repo, "page-main-area", [
        style("h2", {
            color: "red",
        }),
    ]);
    const Page = page(repo);
    const PageMainArea = component("page-main-area", { tag: "main" });

    return async (parameter) => {
        const title = `Post Page ${parameter.id}`;

        return Page({ title: site.title, description: site.description }, PageMainArea(H2({}, title)));
    };
}
