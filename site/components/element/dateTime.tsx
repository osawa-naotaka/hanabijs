import { component, element } from "zephblaze/core";
import type { HComponentFn } from "zephblaze/core";

export type DateTimeArgument = {
    datetime: string | Date;
    lang?: string;
};

export function dateTime(): HComponentFn<DateTimeArgument> {
    const DateTime = element("date-time", { tag: "time" });
    return component(DateTime, ({ datetime, lang = "en-us" }) => {
        const date = datetime instanceof Date ? datetime : new Date(datetime);
        const date_string = date.toLocaleDateString(lang, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        return <DateTime datetime={date.toISOString()}>{date_string}</DateTime>;
    });
}
