import { existsSync } from "node:fs";
import path from "node:path";
import type { Attribute } from "../lib/element";
import { globExt } from "../lib/util";

export type RouteTable = {
    path_regexp: RegExp;
    target_file: string;
    target_ext: string;
    auto_generate: boolean;
};

export type Route = {
    target_file: string;
    req_ext: string;
    auto_generate: boolean;
    params: Attribute;
};

export type Router = (req: Request) => Route | Error;

export async function createPageRouter(rootdir: string): Promise<Router> {
    if (existsSync(rootdir)) {
        const page_route_table = await createPageRouteTable(rootdir);

        return (req) => pageRouter(page_route_table, new URL(req.url).pathname);
    }

    return () => new Error("Path Not Found.");
}

export async function createStaticRouter(rootdir: string): Promise<Router> {
    if (existsSync(rootdir)) {
        const static_route_table = await createStaticRouteTable(rootdir);

        return (req) => staticRouter(static_route_table, new URL(req.url).pathname);
    }

    return () => new Error("Path Not Found.");
}

function withoutExt(file: string): string {
    const p = path.parse(file);
    return path.join(p.dir, p.name);
}

function escape(exp: string): string {
    return exp.replace(/[-^$\\\.*+?()[\]{}|/]/g, "\\$&");
}

export async function createPageRouteTable(rootdir: string): Promise<RouteTable[]> {
    return (await Array.fromAsync(globExt(rootdir, ".ts"))).flatMap((file) => {
        const target_file = path.join("/", file);
        const path_without_ts = withoutExt(target_file);
        const path_without_ts_p = path.parse(path_without_ts);

        if (path_without_ts_p.ext !== ".html") {
            const path_regexp = new RegExp(`^${escape(path_without_ts)}$`);
            return [{ path_regexp, target_file, target_ext: path_without_ts_p.ext, auto_generate: false }];
        }

        // .css and .js
        const path_base = withoutExt(path_without_ts);
        const route_table = [".css", ".js"].map((ext) => ({
            path_regexp: new RegExp(`^${escape(path_base)}${escape(ext)}$`),
            target_file,
            target_ext: ext,
            auto_generate: true,
        }));

        // .html
        if (path_without_ts.endsWith("/index.html")) {
            route_table.push({
                path_regexp: createHtmlRegExp(path_without_ts.replace("index.html", "")),
                target_file,
                target_ext: ".html",
                auto_generate: false,
            });
            route_table.push({
                path_regexp: createHtmlRegExp(path_without_ts.replace("/index.html", "")),
                target_file,
                target_ext: ".html",
                auto_generate: false,
            });
        } else {
            route_table.push({
                path_regexp: createHtmlRegExp(path_without_ts.replace(".html", "/")),
                target_file,
                target_ext: ".html",
                auto_generate: false,
            });
            route_table.push({
                path_regexp: createHtmlRegExp(path_without_ts.replace(".html", "")),
                target_file,
                target_ext: ".html",
                auto_generate: false,
            });
        }

        route_table.push({
            path_regexp: createHtmlRegExp(path_without_ts),
            target_file,
            target_ext: ".html",
            auto_generate: false,
        });

        return route_table;
    });
}

function createHtmlRegExp(path: string): RegExp {
    const regexp_result = path.matchAll(/\[(?<key>[^\]]+)\]/g);

    let regexp_str = "";
    let start_pos = 0;
    const param_names = new Set<string>();
    for (const r of regexp_result) {
        if (r.groups?.key) {
            param_names.add(r.groups.key);
            regexp_str += escape(path.slice(start_pos, r.index));
            regexp_str += `(?<${r.groups.key}>.+)`;
            start_pos = r.index + r[0].length;
        } else {
            throw new Error("hanabi: createPageRouteTable internal error.");
        }
    }
    regexp_str += escape(path.slice(start_pos));

    return new RegExp(`^${regexp_str}$`);
}

async function createStaticRouteTable(rootdir: string): Promise<RouteTable[]> {
    return (await Array.fromAsync(globExt(rootdir, ""))).map((name) => {
        const target_file = path.join("/", name);
        const path_exact = target_file;
        const path_regexp = new RegExp(`^${escape(path_exact)}$`);
        return { path_regexp, path_exact, target_file, target_ext: path.extname(name), auto_generate: false };
    });
}

function pageRouter(route_table: RouteTable[], req_url_path: string): Route | Error {
    for (const { path_regexp, target_file, target_ext, auto_generate } of route_table) {
        const match = req_url_path.match(path_regexp);

        if (match) {
            return { target_file, req_ext: target_ext, auto_generate, params: match.groups || {} };
        }
    }

    return new Error("Path Not Found.");
}

function staticRouter(route_table: RouteTable[], req_url_path: string): Route | Error {
    const req_url_path_persed = path.parse(req_url_path);
    const req_ext = req_url_path_persed.ext;
    for (const { target_file } of route_table) {
        if (target_file === req_url_path) {
            return { target_file, req_ext, auto_generate: false, params: {} };
        }
    }

    // check if / (=index.html) matches
    if (req_ext === "") {
        const index_name = path.join(req_url_path_persed.dir, req_url_path_persed.name, "index.html");
        for (const { target_file } of route_table) {
            if (target_file === index_name) {
                return { target_file, req_ext: ".html", auto_generate: false, params: {} };
            }
        }
    }
    return new Error("Path Not Found.");
}
