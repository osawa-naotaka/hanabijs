import { element, registerComponent } from "@/main";
import type { HComponentFn, Store } from "@/main";

export type DateTimeArgument = {
    datetime: string | Date;
    lang?: string;
};

export function dateTime(store: Store): HComponentFn<DateTimeArgument> {
    const DateTime = element("date-time", { tag: "time" });

    return registerComponent(store, DateTime, [], (arg) => () => {
        const date = arg.datetime instanceof Date ? arg.datetime : new Date(arg.datetime);
        const lang = arg.lang || "en-us";
        const date_string = date.toLocaleDateString(lang, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        return DateTime({ datetime: date.toISOString() })(date_string);
    });
}
