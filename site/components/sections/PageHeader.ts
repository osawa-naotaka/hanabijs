import { A, Button, Div, H1, Header, I, Input, Nav } from "@/main";
import type { HComponentFn } from "@/main";

export type PageHeaderArgument = {
    title: string;
};

export const PageHeader: HComponentFn<PageHeaderArgument> =
    ({ title }) =>
    () =>
        Header({ class: ["fixed", "responsive"] })(
            Nav({})(
                H1({ class: "max" })(A({ href: "/" })(title)),
                Div({ class: ["field", "fill", "round", "prefix"] })(I({})("search"), Input({ type: "search" })()),
                Button({ class: ["circle", "transparent"] })(I({})("menu")),
            ),
        );
