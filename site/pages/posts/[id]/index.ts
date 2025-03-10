import { Body, H1, Head, Html, Title } from "@/main";
import type { Attribute, HNode } from "@/main";
import { style } from "@/main";

export async function getStaticPaths() {
    return [{ params: { id: "1" } }, { params: { id: "2" } }, { params: { id: "3" } }];
}

export default function Top(arg: Attribute): HNode {
    const title = `Post Page ${arg.id}`;
    return Html(
        { lang: "en" },
        Head({}, Title({}, title)),
        Body({}, H1({}, style([[[["h1"]], { color: "red" }]]), title)),
    );
}
