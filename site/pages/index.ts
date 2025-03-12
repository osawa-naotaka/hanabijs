import type { HNode } from "@/main";
import { Page } from "@site/components/pages/Page";
import { Hero } from "@site/components/sections/Hero";
import { site } from "@site/config/site.config";

export default function Top(): HNode {
    return Page({ title: site.name }, Hero({}));
}
