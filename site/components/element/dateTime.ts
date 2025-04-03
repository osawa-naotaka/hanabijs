import { component, element } from "@/main";
import type { HComponentFn } from "@/main";

export type DateTimeArgument = {
    datetime: string | Date;
    lang?: string;
};

export function dateTime(): HComponentFn<DateTimeArgument> {
    const DateTime = element("date-time", { tag: "time" });
    return component(DateTime, (argument) => () => {
        const date = argument.datetime instanceof Date ? argument.datetime : new Date(argument.datetime);
        const lang = argument.lang || "en-us";
        const date_string = date.toLocaleDateString(lang, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        return DateTime({ datetime: date.toISOString() })(date_string);
    });
}
