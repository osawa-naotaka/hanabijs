import { describe, expect, test } from "bun:test";
import { Body, Footer, H1, Head, Header, Html, Script, Title } from "../src/lib/elements";
import { insertNodes } from "../src/lib/style";
import { rulesToString } from "../src/lib/style";

describe("ruleToString test", () => {
    test("Sigle Selector, string", () => {
        expect(
            rulesToString({
                component_name: "div",
                style: [{ selector: ["div"], properties: { color: "red", border_radius: "10px" } }],
            }),
        ).toEqual("@layer main { div { color: red; border-radius: 10px; } }\n");
    });

    test("Single Selector, Combinator, Single Selector", () => {
        expect(
            rulesToString({
                component_name: "div",
                style: [
                    {
                        selector: [["div", ">", ".show"]],
                        properties: { color: "red", border_radius: "10px" },
                    },
                ],
            }),
        ).toEqual("@layer main { div > .show { color: red; border-radius: 10px; } }\n");
    });

    test("Single Selector, Combinator, Single Selector", () => {
        expect(
            rulesToString({
                component_name: "div",
                style: [
                    {
                        selector: [["div", ".show"]],
                        properties: { color: "red", border_radius: "10px" },
                    },
                ],
            }),
        ).toEqual("@layer main { div .show { color: red; border-radius: 10px; } }\n");
    });
});

describe("insertNodess test", () => {
    const root = Html({ lang: "ja" })(
        Head({})(Title({})("title")),
        Body({})(
            Header({ class: "page-header" })(H1({})("header")),
            Footer({ class: "page-footer" })("&amp; lulliecat"),
        ),
    );

    const insert = [Script({ type: "module", src: ".hmr.js" })()];

    test("insert script to head", () =>
        expect(insertNodes(root, ["head"], insert, true)).toEqual(
            Html({ lang: "ja" })(
                Head({})(Title({})("title"), Script({ type: "module", src: ".hmr.js" })()),
                Body({})(
                    Header({ class: "page-header" })(H1({})("header")),
                    Footer({ class: "page-footer" })("&amp; lulliecat"),
                ),
            ),
        ));

    test("insert script to header", () =>
        expect(insertNodes(root, ["body", ">", "header"], insert, true)).toEqual(
            Html({ lang: "ja" })(
                Head({})(Title({})("title")),
                Body({})(
                    Header({ class: "page-header" })(H1({})("header"), Script({ type: "module", src: ".hmr.js" })()),
                    Footer({ class: "page-footer" })("&amp; lulliecat"),
                ),
            ),
        ));
});
