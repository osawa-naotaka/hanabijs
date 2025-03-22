import { A, Body, H1, Head, Html, Link, Meta, Script, Title, semantic } from "@/main";
import type { HArgument, HComponentFn } from "@/main";

const site = {
    lang: "en",
    name: "hanabi.js",
    description: "fast, light-weight static site generator",
};

export function page(): HComponentFn<HArgument> {
    const PageHeader = semantic("page-header", { class_names: ["container"], tag: "header" });
    const PageFooter = semantic("page-footer", { tag: "footer" });
    const PageFooterCopyright = semantic("page-footer-copyright");

    return (_attribute) =>
        (...child) =>
            Html({ lang: site.lang })(
                Head({})(
                    Meta({ charset: "utf-8" })(),
                    Meta({
                        name: "viewport",
                        content: "width=device-width,initial-scale=1.0",
                    })(),

                    Title({})(site.name),
                    Script({ type: "module", src: "/reload.js" })(""),
                    Link({ href: "/hanabi-error.css", rel: "stylesheet" })(""),
                ),
                Body({ id: "top-of-page" })(
                    PageHeader({})(H1({})(A({ href: "/" })(site.name))),
                    ...child,
                    PageFooter({})(PageFooterCopyright({})(`&copy; 2025 ${site.name}`)),
                ),
            );
}
