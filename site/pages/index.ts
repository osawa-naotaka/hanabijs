import type { HNode } from "@/main";
import { Page } from "@site/components/pages/Page";
import { site } from "@site/config/site.config";

export default function Top(): HNode {
    return Page({ title: site.name });
}
