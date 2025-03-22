import { A, registerComponent } from "@/main";
import type { HComponentFn, Repository } from "@/main";
import { svgIcon } from "./svgIcon";

export type ShareXArgument = {
    title: string;
    url: string;
};

export function shareX(repo: Repository): HComponentFn<ShareXArgument> {
    registerComponent(repo, "share-x", []);
    const SvgIcon = svgIcon(repo);

    return (argument) =>
        () => {
            const link = `https://x.com/intent/tweet?text=${encodeURIComponent(argument.title)}&url=${encodeURIComponent(argument.url)}`;

            return A({ href: link, target: "__blank" })(SvgIcon({ name: "x-share" })());
        }
}
