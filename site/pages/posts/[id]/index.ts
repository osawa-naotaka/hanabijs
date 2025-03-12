import type { Attribute, HNode } from "@/main";
import { Page } from "@site/components/pages/Page";
import { site } from "@site/config/site.config";

export async function getStaticPaths() {
    return [{ params: { id: "1" } }, { params: { id: "2" } }, { params: { id: "3" } }];
}

export default function Top(arg: Attribute): HNode {
    return Page({ title: `${arg.id} | ${site.name}` });
}
