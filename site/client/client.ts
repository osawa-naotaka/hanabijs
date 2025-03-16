import type { HComponentFn, Repository } from "@/main";
import { createSimpleSemantic } from "@/main";

export function client(_repo: Repository): HComponentFn {
    const PlaceHolder = createSimpleSemantic("place-holder");
    const PlaceHolderButton = createSimpleSemantic("place-holder-button", { tag: "button" });
    const PlaceHolderResult = createSimpleSemantic("place-holder-result");

    return () => PlaceHolder(PlaceHolderButton("click me!"), PlaceHolderResult("waiting to click..."));
}

export default function clientScript(d: Document): void {
    const button = d.querySelector<HTMLDivElement>(".place-holder-button");
    if (button === null) return;
    button.addEventListener("click", () => {
        const result = d.querySelector<HTMLDivElement>(".place-holder-result");
        if (result === null) return;
        result.innerText = "clicked.";
    });
}
