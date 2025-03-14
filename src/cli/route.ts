import { existsSync } from "node:fs";
import path from "node:path";
import type { Attribute } from "../lib/element";
import { globExt } from "../lib/util";

export type RouteTable = {
    path_regexp: RegExp;
    path_exact: string;
    target_file: string;
};

export type Route = {
    target_file: string;
    req_ext: string;
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

async function createPageRouteTable(rootdir: string): Promise<RouteTable[]> {
    return (await Array.fromAsync(globExt(rootdir, ".ts"))).map((name) => {
        const target_file = path.join("/", name);
        const p = path.parse(target_file);

        const path_exact = path.join("/", p.dir, p.name);
        const param_names = Array.from(path_exact.matchAll(/\[(?<key>[^\]]+)\]/g)).map((m) => m.groups?.key || "");
        const regexp_str = param_names.reduce((p, c) => p.replaceAll(`[${c}]`, `(?<${c}>.+)`), path_exact);
        const path_regexp = new RegExp(`^${regexp_str}$`);
        return { path_regexp, path_exact, target_file };
    });
}

async function createStaticRouteTable(rootdir: string): Promise<RouteTable[]> {
    return (await Array.fromAsync(globExt(rootdir, ""))).map((name) => {
        const target_file = path.join("/", name);
        const path_exact = target_file;
        const path_regexp = new RegExp(`^${path_exact}$`);
        return { path_regexp, path_exact, target_file };
    });
}

function pageRouter(route_table: RouteTable[], req_url_path: string): Route | Error {
    const p = path.parse(req_url_path);
    const req_ext = p.ext;
    const name = path.join("/", p.dir, p.name, p.ext === "" ? "index" : "");

    if (req_ext === "" || req_ext === ".html") {
        for (const { path_regexp, target_file } of route_table) {
            const match = name.match(path_regexp);
            if (match) {
                return { target_file, req_ext, params: match.groups || {} };
            }
        }
    } else if (req_ext === ".css" || req_ext === ".js") {
        for (const { path_exact, target_file } of route_table) {
            if (name === path_exact) {
                return { target_file, req_ext, params: {} };
            }
        }
    } else {
        return new Error(`Unsupported extension ${req_ext}`);
    }
    return new Error("Path Not Found.");
}

function staticRouter(route_table: RouteTable[], req_url_path: string): Route | Error {
    const req_url_path_persed = path.parse(req_url_path);
    const req_ext = req_url_path_persed.ext;
    for (const { target_file } of route_table) {
        if (target_file === req_url_path) {
            return { target_file, req_ext, params: {} };
        }
    }

    // check if / (=index.html) matches
    if (req_ext === "") {
        const index_name = path.join(req_url_path_persed.dir, req_url_path_persed.name, "index.html");
        for (const { target_file } of route_table) {
            if (target_file === index_name) {
                return { target_file, req_ext: ".html", params: {} };
            }
        }
    }
    return new Error("Path Not Found.");
}
