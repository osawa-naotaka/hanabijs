import { existsSync } from "node:fs";
import path from "node:path";
import { cwd } from "node:process";
import type { HComponentAsset } from "@/main";
import type { Attribute } from "../lib/component";
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

    throw new Error(`createPageRouter: directory "${rootdir}" not found.`);
}

export async function createStaticRouter(rootdir: string): Promise<Router> {
    if (existsSync(rootdir)) {
        const static_route_table = await createStaticRouteTable(rootdir);

        return (req) => staticRouter(static_route_table, new URL(req.url).pathname);
    }

    throw new Error(`createStaticRouter: directory "${rootdir}" not found.`);
}

export async function createAssetRouter(asset_prefix: string, assets: HComponentAsset[]): Promise<Router> {
    const asset_route_table = await createAssetRouteTable(asset_prefix, assets);

    return (req) => pageRouter(asset_route_table, new URL(req.url).pathname);
}

function withoutExt(file: string): string {
    const p = path.parse(file);
    return path.join(p.dir, p.name);
}

function escapeForRegExp(exp: string): string {
    return exp.replace(/[-^$\\\.*+?()[\]{}|/]/g, "\\$&");
}

export async function createPageRouteTable(rootdir: string): Promise<RouteTable[]> {
    const exact_route_table: RouteTable[] = [];
    const regexp_route_table: RouteTable[] = [];

    function addRoute(
        [regexp, is_exact]: [RegExp, boolean],
        target_file: string,
        target_ext: string,
        auto_generate: boolean,
    ) {
        const item = { path_regexp: regexp, target_file, target_ext, auto_generate };
        if (is_exact) {
            exact_route_table.push(item);
        } else {
            regexp_route_table.push(item);
        }
    }

    for (const file of await Array.fromAsync(globExt(rootdir, ".{ts,tsx}"))) {
        const target_file = path.join("/", file);
        const path_without_ts = withoutExt(target_file);
        const path_without_ts_p = path.parse(path_without_ts);

        //
        if (path_without_ts_p.ext !== ".html") {
            const path_regexp = new RegExp(`^${escapeForRegExp(path_without_ts)}$`);
            exact_route_table.push({
                path_regexp,
                target_file,
                target_ext: path_without_ts_p.ext,
                auto_generate: false,
            });
            continue;
        }

        // .html is expanded to generated .css and .js
        const path_base = withoutExt(path_without_ts);
        for (const ext of [".css", ".js"]) {
            exact_route_table.push({
                path_regexp: new RegExp(`^${escapeForRegExp(path_base)}${escapeForRegExp(ext)}$`),
                target_file,
                target_ext: ext,
                auto_generate: true,
            });
        }

        // .html
        if (path_without_ts.endsWith("/index.html")) {
            addRoute(createHtmlRegExp(path_without_ts.replace("index.html", "")), target_file, ".html", false);
            addRoute(createHtmlRegExp(path_without_ts.replace("/index.html", "")), target_file, ".html", false);
        } else {
            addRoute(createHtmlRegExp(path_without_ts.replace(".html", "/")), target_file, ".html", false);
            addRoute(createHtmlRegExp(path_without_ts.replace(".html", "")), target_file, ".html", false);
        }

        addRoute(createHtmlRegExp(path_without_ts), target_file, ".html", false);
    }

    return exact_route_table.concat(regexp_route_table);
}

function createHtmlRegExp(path: string): [RegExp, boolean] {
    const regexp_result = path.matchAll(/\[(?<key>[^\]]+)\]/g);

    let regexp_str = "";
    let start_pos = 0;
    const param_names = new Set<string>();
    for (const r of regexp_result) {
        if (r.groups?.key) {
            param_names.add(r.groups.key);
            regexp_str += escapeForRegExp(path.slice(start_pos, r.index));
            regexp_str += `(?<${r.groups.key}>.+)`;
            start_pos = r.index + r[0].length;
        } else {
            throw new Error("hanabi: createPageRouteTable internal error.");
        }
    }
    regexp_str += escapeForRegExp(path.slice(start_pos));

    return [new RegExp(`^${regexp_str}$`), param_names.size === 0];
}

async function createStaticRouteTable(rootdir: string): Promise<RouteTable[]> {
    return (await Array.fromAsync(globExt(rootdir, ""))).map((name) => {
        const target_file = path.join("/", name);
        const path_exact = target_file;
        const path_regexp = new RegExp(`^${escapeForRegExp(path_exact)}$`);
        return { path_regexp, path_exact, target_file, target_ext: path.extname(name), auto_generate: false };
    });
}

async function createAssetRouteTable(asset_prefix: string, assets: HComponentAsset[]): Promise<RouteTable[]> {
    return (
        await Promise.all(
            assets.map(async (entry) => {
                const root_dir =
                    entry.package_name === undefined
                        ? cwd()
                        : path.dirname(require.resolve(`${entry.package_name}/package.json`));
                return (
                    await Promise.all(
                        entry.copy_files.map(async (file) => {
                            const glob = new Bun.Glob(file.src);
                            return (await Array.fromAsync(glob.scan(root_dir))).map((src) => {
                                const path_exact = path.join("/", asset_prefix, src);

                                return {
                                    path_regexp: new RegExp(`^${escapeForRegExp(path_exact)}$`),
                                    path_exact,
                                    target_file: path.join(root_dir, src),
                                    target_ext: path.extname(src),
                                    auto_generate: false,
                                };
                            });
                        }),
                    )
                ).flat();
            }),
        )
    ).flat();
}

function pageRouter(route_table: RouteTable[], req_url_path: string): Route | Error {
    for (const { path_regexp, target_file, target_ext, auto_generate } of route_table) {
        const match = req_url_path.match(path_regexp);

        if (match) {
            return { target_file, req_ext: target_ext, auto_generate, params: match.groups || {} };
        }
    }

    return new Error(`Path for "${req_url_path}" Not Found.`);
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
    return new Error(`Path for "${req_url_path}" Not Found.`);
}
