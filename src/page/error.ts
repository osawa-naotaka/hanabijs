import type { HNode } from "@/main";
import { H2, Main, P } from "../lib/component";
import { Page } from "./Page";
import { site } from "./site.config";

export async function ErrorPage(arg: { name: string; cause: string }): Promise<HNode> {
    return Page(
        { lang: site.lang, title: site.name, description: site.description },
        Main({ class: "container" }, H2({}, arg.name), P({}, arg.cause)),
    );
}
