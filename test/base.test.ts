import { describe, expect, test } from "bun:test";
import { insertNodes, selectNode } from "../src/lib/component";
import {
    Article,
    Body,
    Footer,
    H1,
    H2,
    H3,
    Head,
    Header,
    Html,
    Main,
    P,
    Script,
    Section,
    Span,
    Title,
} from "../src/lib/elements";
import { createSelector, rulesToString } from "../src/lib/style";

describe("createSelector test", () => {
    test("Sigle Selector, string", () => expect(createSelector(["div"])).toEqual(["div"]));

    test("Sigle Selector, string array", () => expect(createSelector([["div", ".show"]])).toEqual(["div", ".show"]));

    test("Single Selector, Combinator, Single Selector", () =>
        expect(createSelector(["div", " ", ".show"])).toEqual({
            compound: ["div"],
            combinator: " ",
            descendant: [".show"],
        }));
});

describe("ruleToString test", () => {
    test("Sigle Selector, string", () => {
        expect(
            rulesToString({
                component_name: "div",
                style: [
                    { selectorlist: [createSelector(["div"])], properties: { color: "red", border_radius: "10px" } },
                ],
            }),
        ).toEqual("div { color: red; border-radius: 10px; }\n");
    });

    test("Single Selector, Combinator, Single Selector", () => {
        expect(
            rulesToString({
                component_name: "div",
                style: [
                    {
                        selectorlist: [createSelector(["div", ">", ".show"])],
                        properties: { color: "red", border_radius: "10px" },
                    },
                ],
            }),
        ).toEqual("div > .show { color: red; border-radius: 10px; }\n");
    });

    test("Single Selector, Combinator, Single Selector", () => {
        expect(
            rulesToString({
                component_name: "div",
                style: [
                    {
                        selectorlist: [createSelector(["div", " ", ".show"])],
                        properties: { color: "red", border_radius: "10px" },
                    },
                ],
            }),
        ).toEqual("div .show { color: red; border-radius: 10px; }\n");
    });
});

describe("selectElement test", () => {
    const root = Html({ lang: "ja" })(
        Head({})(Title({})("title")),
        Body({})(
            Header({ class: "page-header" })(H1({})("header")),
            Main({})(
                Section({ class: "content articles" })(
                    H2({})("blog"),
                    Article({})(
                        Header({})(H3({ class: "article-title" })("article title 1")),
                        Header({})(H3({ class: "article-title" })("article title 1")),
                        Section({})(P({})("text1"), P({})("text2")),
                        Section({})(P({})("text3"), P({})("text4")),
                        Footer({})(Span({ class: "tag" })("tag1"), Span({ class: "tag" })("tag2")),
                    ),
                    Article({})(
                        Header({})(H3({ class: "article-title" })("article title 2")),
                        Section({})(P({})("text5"), P({})("text6")),
                        Section({})(P({})("text7"), P({ class: "page-header" })("text8")),
                        Footer({})(Span({ class: "tag" })("tag3"), Span({ class: "tag" })("tag4")),
                    ),
                ),
            ),
            Footer({ class: "page-footer" })("&amp; lulliecat"),
        ),
    );

    test("select div, results in no elements", () =>
        expect(selectNode([root], createSelector(["*", " ", "div"]))).toEqual([]));

    test("select h1", () => expect(selectNode([root], createSelector(["*", " ", "h1"]))).toEqual([H1({})("header")]));

    test("select headers", () =>
        expect(selectNode([root], createSelector(["*", " ", "header"]))).toEqual([
            Header({ class: "page-header" })(H1({})("header")),
            Header({})(H3({ class: "article-title" })("article title 1")),
            Header({})(H3({ class: "article-title" })("article title 1")),
            Header({})(H3({ class: "article-title" })("article title 2")),
        ]));

    test("select article header", () =>
        expect(selectNode([root], createSelector(["*", " ", "article", " ", "header"]))).toEqual([
            Header({})(H3({ class: "article-title" })("article title 1")),
            Header({})(H3({ class: "article-title" })("article title 1")),
            Header({})(H3({ class: "article-title" })("article title 2")),
        ]));

    test("select body > header", () =>
        expect(selectNode([root], createSelector(["*", " ", "body", ">", "header"]))).toEqual([
            Header({ class: "page-header" })(H1({})("header")),
        ]));

    test("select .page-header", () =>
        expect(selectNode([root], createSelector(["*", " ", ".page-header"]))).toEqual([
            Header({ class: "page-header" })(H1({})("header")),
            P({ class: "page-header" })("text8"),
        ]));

    test("select header.page-header", () =>
        expect(selectNode([root], createSelector(["*", " ", ["header", ".page-header"]]))).toEqual([
            Header({ class: "page-header" })(H1({})("header")),
        ]));

    test("select section > * + *", () =>
        expect(selectNode([root], createSelector(["*", " ", "section", ">", "*", "+", "*"]))).toEqual([
            Article({})(
                Header({})(H3({ class: "article-title" })("article title 1")),
                Header({})(H3({ class: "article-title" })("article title 1")),
                Section({})(P({})("text1"), P({})("text2")),
                Section({})(P({})("text3"), P({})("text4")),
                Footer({})(Span({ class: "tag" })("tag1"), Span({ class: "tag" })("tag2")),
            ),
            Article({})(
                Header({})(H3({ class: "article-title" })("article title 2")),
                Section({})(P({})("text5"), P({})("text6")),
                Section({})(P({})("text7"), P({ class: "page-header" })("text8")),
                Footer({})(Span({ class: "tag" })("tag3"), Span({ class: "tag" })("tag4")),
            ),
            P({})("text2"),
            P({})("text4"),
            P({})("text6"),
            P({ class: "page-header" })("text8"),
        ]));
});

describe("selectElement test", () => {
    const root = Html({ lang: "ja" })(
        Head({})(Title({})("title")),
        Body({})(
            Header({ class: "page-header" })(H1({})("header")),
            Footer({ class: "page-footer" })("&amp; lulliecat"),
        ),
    );

    const insert = [Script({ type: "module", src: ".hmr.js" })()];

    test("insert script to head", () =>
        expect(insertNodes(root, createSelector(["*", " ", "head"]), insert)).toEqual(
            Html({ lang: "ja" })(
                Head({})(Title({})("title"), Script({ type: "module", src: ".hmr.js" })()),
                Body({})(
                    Header({ class: "page-header" })(H1({})("header")),
                    Footer({ class: "page-footer" })("&amp; lulliecat"),
                ),
            ),
        ));

    test("insert script to header", () =>
        expect(insertNodes(root, createSelector(["*", " ", "body", ">", "header"]), insert)).toEqual(
            Html({ lang: "ja" })(
                Head({})(Title({})("title")),
                Body({})(
                    Header({ class: "page-header" })(H1({})("header"), Script({ type: "module", src: ".hmr.js" })()),
                    Footer({ class: "page-footer" })("&amp; lulliecat"),
                ),
            ),
        ));
});
