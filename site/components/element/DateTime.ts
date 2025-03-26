import { Time } from "@/main";
import type { HComponentFn } from "@/main";

export type DateTimeArgument = {
    datetime: string | Date;
};

export const DateTime: HComponentFn<DateTimeArgument> =
    ({ datetime }) =>
    () => {
        const date = datetime instanceof Date ? datetime : new Date(datetime);
        const date_string = date.toLocaleDateString("ja-jp", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        return Time({ datetime: date.toISOString() })(date_string);
    };
