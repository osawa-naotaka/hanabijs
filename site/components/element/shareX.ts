import { A } from "@/main";
import type { HComponentFn } from "@/main";
import { SvgIcon } from "./svgIcon";

export type ShareXArgument = {
    title: string;
    url: string;
};

export const ShareX: HComponentFn<ShareXArgument> = (argument) => () => {
    const link = `https://x.com/intent/tweet?text=${encodeURIComponent(argument.title)}&url=${encodeURIComponent(argument.url)}`;

    return A({ href: link, target: "__blank" })(SvgIcon({ name: "x-share" })());
};
