import type { HNode } from "@/lib/core/component";
import { H2, Main, P } from "@/lib/core/elements";
import { page } from "@/page/page";

export async function ErrorPage(arg: { name: string; cause: string }): Promise<HNode> {
    const Page = page();
    return Page({}, Main({ class: "container" }, H2({}, arg.name), P({}, arg.cause)));
}
