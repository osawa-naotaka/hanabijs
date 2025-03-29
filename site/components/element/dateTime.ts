import { element, registerComponent } from "@/main";
import type { HComponentFn, Store } from "@/main";

export type DateTimeArgument = {
    datetime: string | Date;
};

export function dateTime(store: Store): HComponentFn<DateTimeArgument> {
    const DateTime = element("date-time", { tag: "time" });

    return registerComponent(store, DateTime, [], ({ datetime }) => () => {
        const date = datetime instanceof Date ? datetime : new Date(datetime);
        const date_string = date.toLocaleDateString("en-us", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        return DateTime({ datetime: date.toISOString() })(date_string);
    });
}
