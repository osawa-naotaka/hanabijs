import { registerComponent, semantic } from "@/main";
import type { HComponentFn, Repository } from "@/main";

export type DateTimeArgument = {
    datetime: string | Date;
};

export function dateTime(repo: Repository): HComponentFn<DateTimeArgument> {
    const DateTime = semantic("date-time", { tag: "time" });

    return registerComponent(repo, DateTime, [], ({ datetime }) => () => {
        const date = datetime instanceof Date ? datetime : new Date(datetime);
        const date_string = date.toLocaleDateString("en-us", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        return DateTime({ datetime: date.toISOString() })(date_string);
    });
}
