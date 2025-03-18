import { describe, expect, test } from "bun:test";
import { createPageRouteTable, createPageRouter } from "../src/cli/route";

describe("createPageRouteTable", async () => {
    const router = await createPageRouteTable("test/route");

    test("directory test", () =>
        expect(
            router.sort((a, b) =>
                (a.path_regexp.toString() + a.target_ext).localeCompare(b.path_regexp.toString() + b.target_ext),
            ),
        ).toStrictEqual(
            [
                {
                    path_regexp: new RegExp(/^\/index\.css$/),
                    target_file: "/index.html.ts",
                    target_ext: ".css",
                    auto_generate: true,
                },
                {
                    path_regexp: new RegExp(/^\/index\.js$/),
                    target_file: "/index.html.ts",
                    target_ext: ".js",
                    auto_generate: true,
                },
                {
                    path_regexp: new RegExp(/^\/index\.html$/),
                    target_file: "/index.html.ts",
                    target_ext: ".html",
                    auto_generate: false,
                },
                {
                    path_regexp: new RegExp(/^\/$/),
                    target_file: "/index.html.ts",
                    target_ext: ".html",
                    auto_generate: false,
                },
                {
                    path_regexp: new RegExp(/^$/),
                    target_file: "/index.html.ts",
                    target_ext: ".html",
                    auto_generate: false,
                },
                {
                    path_regexp: new RegExp(/^\/root\.css$/),
                    target_file: "/root.css.ts",
                    target_ext: ".css",
                    auto_generate: false,
                },
                {
                    path_regexp: new RegExp(/^\/\[id\]\/index\.css$/),
                    target_file: "/[id]/index.html.ts",
                    target_ext: ".css",
                    auto_generate: true,
                },
                {
                    path_regexp: new RegExp(/^\/\[id\]\/index\.js$/),
                    target_file: "/[id]/index.html.ts",
                    target_ext: ".js",
                    auto_generate: true,
                },
                {
                    path_regexp: new RegExp(/^\/(?<id>.+)\/index\.html$/),
                    target_file: "/[id]/index.html.ts",
                    target_ext: ".html",
                    auto_generate: false,
                },
                {
                    path_regexp: new RegExp(/^\/(?<id>.+)\/$/),
                    target_file: "/[id]/index.html.ts",
                    target_ext: ".html",
                    auto_generate: false,
                },
                {
                    path_regexp: new RegExp(/^\/(?<id>.+)$/),
                    target_file: "/[id]/index.html.ts",
                    target_ext: ".html",
                    auto_generate: false,
                },
                {
                    path_regexp: new RegExp(/^\/subdir\/index\.js$/),
                    target_file: "/subdir/index.js.ts",
                    target_ext: ".js",
                    auto_generate: false,
                },
            ].sort((a, b) =>
                (a.path_regexp.toString() + a.target_ext).localeCompare(b.path_regexp.toString() + b.target_ext),
            ),
        ));
});

describe("createPageRouteTable", async () => {
    const router = await createPageRouter("test/route");

    test("route /", () =>
        expect(router(new Request("http://localhost/"))).toEqual({
            target_file: "/index.html.ts",
            req_ext: ".html",
            auto_generate: false,
            params: {},
        }));

    test("route /index.css", () =>
        expect(router(new Request("http://localhost/index.css"))).toEqual({
            target_file: "/index.html.ts",
            req_ext: ".css",
            auto_generate: true,
            params: {},
        }));

    test("route /index.js", () =>
        expect(router(new Request("http://localhost/index.js"))).toEqual({
            target_file: "/index.html.ts",
            req_ext: ".js",
            auto_generate: true,
            params: {},
        }));

    test("route /[id]/index.css", () =>
        expect(router(new Request("http://localhost/[id]/index.css"))).toEqual({
            target_file: "/[id]/index.html.ts",
            req_ext: ".css",
            auto_generate: true,
            params: {},
        }));
});
