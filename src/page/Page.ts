import { A, Body, Div, Footer, H1, Head, Header, Html, Link, Meta, Script, Title, createComponent } from "@/main";

const site = {
    lang: "en",
    name: "hanabi.js",
    description: "fast, light-weight static site generator",
};

export const Page = createComponent((_attribute, _style, child) =>
    Html(
        { lang: site.lang },
        Head(
            {},
            Meta({ charset: "utf-8" }),
            Meta({
                name: "viewport",
                content: "width=device-width,initial-scale=1.0",
            }),

            Title({}, site.name),
            Script({ type: "module", src: "/reload.js" }, ""),
            Link({ href: "/default.css", rel: "stylesheet" }, ""),
        ),
        Body(
            { id: "top-of-page" },
            Header({ class: ["page-header", "container"] }, H1({}, A({ href: "/" }, site.name))),
            ...child,
            Footer({ class: "page-footer" }, Div({ class: "page-footer-copyright" }, `&copy; 2025 ${site.name}`)),
        ),
    ),
);
