import type { HNode } from "@/main";
import { H2, Main, P } from "../lib/component";
import { Page } from "./Page";

export async function ErrorPage(arg: { name: string; cause: string }): Promise<HNode> {
    return Page({}, Main({ class: "container" }, H2({}, arg.name), P({}, arg.cause)));
}
