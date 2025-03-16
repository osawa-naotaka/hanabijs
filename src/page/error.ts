import type { HNode } from "@/main";
import { H2, Main, P } from "@/lib/element";
import { page } from "@/page/page";

export async function ErrorPage(arg: { name: string; cause: string }): Promise<HNode> {
    const Page = page();
    return Page({}, Main({ class: "container" }, H2({}, arg.name), P({}, arg.cause)));
}
