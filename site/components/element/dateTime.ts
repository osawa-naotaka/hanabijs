import { registerComponent, semantic, style } from "@/main";
import type { HComponentFn, Repository } from "@/main";

export type DateTimeArgument = {
    datetime: string | Date;
};

export function dateTime(repo: Repository): HComponentFn<DateTimeArgument> {
    registerComponent(repo, "date-time", [
        style("&", {
            display: "block",
        }),
    ]);

    const DateTime = semantic("date-time", { tag: "time" });

    return ({ datetime }) =>
        () => {
            const date = datetime instanceof Date ? datetime : new Date(datetime);
            const date_string = date.toLocaleDateString("ja-jp", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });

            return DateTime({ datetime: date.toISOString() })(date_string);
        };
}
