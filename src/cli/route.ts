import path from "node:path";
import type { Attribute } from "../lib/element";
import { globExt } from "../lib/util";

export type RouteTable = {
    url_regexp_woext: RegExp;
    url_exact_woext: string;
    file_path: string;
};

export type Route = {
    file_path: string;
    req_ext: string;
    params: Attribute;
};

export type Router = (req: Request) => Route | Error;

export async function createPageRouter(pagedir: string): Promise<Router> {
    const page_route_table = await createPageRouteTable(pagedir);

    return (req) => pageRouter(page_route_table, path.parse(new URL(req.url).pathname));
}

export async function createStaticRouter(staticdir: string): Promise<Router> {
    const static_route_table = await createStaticRouteTable(staticdir);

    return (req) => publicRouter(static_route_table, path.parse(new URL(req.url).pathname));
}

async function createPageRouteTable(pagedir: string): Promise<RouteTable[]> {
    return (await Array.fromAsync(globExt(pagedir, ".ts"))).map((file_path) => {
        const p = path.parse(file_path);
        const url_exact_woext = p.dir !== "" ? `/${p.dir}/${p.name}` : `/${p.name}`;
        const param_names = Array.from(url_exact_woext.matchAll(/\[(?<key>[^\]]+)\]/g)).map((m) => m.groups?.key || "");
        const regexp_str = param_names.reduce((p, c) => p.replaceAll(`[${c}]`, `(?<${c}>.+)`), url_exact_woext);
        const url_regexp_woext = new RegExp(`^${regexp_str}$`);
        return { url_regexp_woext, url_exact_woext, file_path: `/${file_path}` };
    });
}

async function createStaticRouteTable(publicdir: string): Promise<RouteTable[]> {
    return (await Array.fromAsync(globExt(publicdir, ""))).map((file_path) => {
        const url_exact = `/${file_path}`;
        const url_regexp = new RegExp(`^${url_exact}$`);
        return { url_regexp_woext: url_regexp, url_exact_woext: url_exact, file_path: `/${file_path}` };
    });
}

function pageRouter(route_table: RouteTable[], req_url_pathname: path.ParsedPath): Route | Error {
    const req_ext = req_url_pathname.ext;
    const name =
        (req_url_pathname.dir === "/" ? "" : `${req_url_pathname.dir}`) +
        (req_url_pathname.name === "" ? "/index" : `/${req_url_pathname.name}/index`);

    if (req_ext === "" || req_ext === ".html") {
        for (const { url_regexp_woext, file_path } of route_table) {
            const match = name.match(url_regexp_woext);
            if (match) {
                return { file_path, req_ext, params: match.groups || {} };
            }
        }
    } else if (req_ext === ".css" || req_ext === ".js") {
        const target =
            req_url_pathname.dir === "/"
                ? `/${req_url_pathname.name}`
                : `${req_url_pathname.dir}/${req_url_pathname.name}`;
        for (const { url_exact_woext, file_path } of route_table) {
            if (target === url_exact_woext) {
                return { file_path, req_ext, params: {} };
            }
        }
    } else {
        return new Error(`Unsupported extension ${req_ext}`);
    }
    return new Error("Path Not Found.");
}

function publicRouter(route_table: RouteTable[], req_url_pathname: path.ParsedPath): Route | Error {
    const req_ext = req_url_pathname.ext;
    const name =
        (req_url_pathname.dir === "/" ? "" : `${req_url_pathname.dir}`) +
        (req_url_pathname.name === "" ? "/index" : `/${req_url_pathname.name}/index`);

    // check if exact name matches
    const target =
        req_url_pathname.dir === "/"
            ? `/${req_url_pathname.name}${req_ext}`
            : `${req_url_pathname.dir}/${req_url_pathname.name}${req_ext}`;
    for (const { file_path } of route_table) {
        if (target === file_path) {
            return { file_path, req_ext, params: {} };
        }
    }

    // check if / (=index.html) matches
    if (req_ext === "") {
        for (const { file_path } of route_table) {
            if (file_path === name) {
                return { file_path, req_ext, params: {} };
            }
        }
    }
    return new Error("Path Not Found.");
}
