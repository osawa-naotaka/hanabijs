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

export async function createPageRouteTable(rootdir: string): Promise<RouteTable[]> {
    return (await Array.fromAsync(globExt(rootdir, ".ts"))).flatMap((file) => {
        const target_file = path.join("/", file);
        const path_without_ts = withoutExt(target_file);
        const path_without_ts_p = path.parse(path_without_ts);

        if (path_without_ts_p.ext !== ".html") {
            const escaped = path_without_ts.replaceAll("[", "\\[").replaceAll("]", "\\]");
            const path_regexp = new RegExp(`^${escaped}$`);
            return [{ path_regexp, target_file, target_ext: path_without_ts_p.ext, auto_generate: false }];
        }
        const path_base = withoutExt(path_without_ts);
        const path_dir = path.dirname(path_without_ts);

        // .css and .js
        const css_js = [".css", ".js"].map((ext) => ({
            path_regexp: new RegExp(`^${path_base}${ext}$`),
            target_file,
            target_ext: ext,
            auto_generate: true,
        }));

        // .html
        const param_names = Array.from(path_base.matchAll(/\[(?<key>[^\]]+)\]/g)).map((m) => m.groups?.key || "");
        const html = ["/index.html", "/"].map((name) => {
            const regexp_str = param_names.reduce(
                (p, c) => p.replaceAll(`[${c}]`, `(?<${c}>.+)`),
                path.join(path_dir, name),
            );
            const path_regexp = new RegExp(`^${regexp_str}$`);
            return { path_regexp, target_file, target_ext: ".html", auto_generate: false };
        });
        return [...css_js, ...html];
    });
}

async function createStaticRouteTable(rootdir: string): Promise<RouteTable[]> {
    return (await Array.fromAsync(globExt(rootdir, ""))).map((name) => {
        const target_file = path.join("/", name);
        const path_exact = target_file;
        const path_regexp = new RegExp(`^${path_exact}$`);
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
