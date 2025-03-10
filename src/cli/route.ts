import path from "node:path";
import { glob } from "glob";
import type { Attribute } from "../lib/element";
import { Http2ServerRequest } from "node:http2";

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

export type Router = (req: Http2ServerRequest) => Route | Error;

export async function createRouter(base: string): Promise<Router> {
	const route_table: RouteTable[] = (
		await glob("**/*.ts", { cwd: base })
	).map((file_path) => {
		const p = path.parse(file_path);
		const url_exact_woext = p.dir !== "" ? `/${p.dir}/${p.name}` : `/${p.name}`;
		const param_names = Array.from(
			url_exact_woext.matchAll(/\[(?<key>[^\]]+)\]/g),
		).map((m) => m.groups?.key || "");
		const regexp_str = param_names.reduce(
			(p, c) => p.replaceAll(`[${c}]`, `(?<${c}>.+)`),
			url_exact_woext,
		);
		const url_regexp_woext = new RegExp(`^${regexp_str}$`);
		return { url_regexp_woext, url_exact_woext, file_path: `/${file_path}` };
	});

	return (req) => {
		const req_url = path.parse(new URL(req.url).pathname);
		const req_ext = req_url.ext;
		const name =
			(req_url.dir === "/" ? "" : `${req_url.dir}`) +
			(req_url.name === "" ? "/index" : `/${req_url.name}/index`);

		if (req_ext === "" || req_ext === ".html") {
			for (const { url_regexp_woext, file_path } of route_table) {
				const match = name.match(url_regexp_woext);
				if (match) {
					return { file_path, req_ext, params: match.groups || {} };
				}
			}
		} else if (req_ext === ".css" || req_ext === ".js") {
			const target =
				req_url.dir === "/"
					? `/${req_url.name}`
					: `${req_url.dir}/${req_url.name}`;
			for (const { url_exact_woext, file_path } of route_table) {
				if (target === url_exact_woext) {
					return { file_path, req_ext, params: {} };
				}
			}
		} else {
			return new Error(`Unsupported extension ${req_ext}`);
		}
		return new Error("Path Not Found.");
	};
}
