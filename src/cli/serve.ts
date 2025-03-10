import { cwd } from "node:process";
import chokidar from "chokidar";
import { page_subdir } from "../config";
import { Link, Script } from "../lib/component";
import { DOCTYPE, insertElements, stringifyToHtml } from "../lib/element";
import { createSelector, stringifyToCss } from "../lib/style";
import { replaceExt } from "../lib/util";
import { createRouter } from "./route";
import http2 from "node:http2";
import { WebSocketServer } from "ws";

export async function serve() {
	const root = cwd();
	const page_dir = `${root}/${page_subdir}`;
	
	const watcher = chokidar.watch(page_dir, { persistent: true });
	
	let router = await createRouter(page_dir);

	const websock = new WebSocketServer({ port: 3128 });
	websock.on("connection", (ws) => {
		watcher.on("change", async () => {
			router = await createRouter(page_dir);
			ws.send("reload");
		});
	});

	http2.createServer(async (req, _res) => {
		const match = router(req);
		if (!(match instanceof Error)) {
			if (match.req_ext === "" || match.req_ext === ".html") {
				const page = await import(`${page_dir}/${match.file_path}`);
				if (typeof page.default === "function") {
					const css_name = replaceExt(match.file_path, ".css");
					const html = insertElements(
						page.default(match.params),
						createSelector(["*", " ", "head"]),
						[
							Script({ type: "module", src: "/reload.js" }, ""),
							Link({ href: css_name, rel: "stylesheet" }, ""),
						],
					);
					const html_text = DOCTYPE() + stringifyToHtml(html);
					return new Response(html_text, {
						headers: {
							"Content-Type": "text/html",
						},
					});
				}
				return new Response(
					`${match.file_path} does not have default export.`,
					{
						status: 404,
					},
				);
			}
			if (match.req_ext === ".css") {
				const page = await import(`${page_dir}/${match.file_path}`);
				if (typeof page.default === "function") {
					const css = page.default(match.params);
					return new Response(stringifyToCss(css), {
						headers: { "Content-Type": "text/css" },
					});
				}
				return new Response(
					`${match.file_path} does not have default export.`,
					{
						status: 404,
					},
				);
			}
			return new Response(`unsupported extension: ${match.req_ext}`, {
				status: 404,
			});
		}

		if((new URL(req.url).pathname).endsWith("/reload.js")) {
			const scr = "const ws = new WebSocket(`ws://${location.hostname}:3128/reload`); ws.onmessage = (event) => { if (event.data === 'reload') { location.reload(); } };";
			return new Response(scr, {
				headers: {
					"Content-Type": "application/javascript"
				},
			});	
		}

		return new Response("Route Not Found", { status: 404 });
	}).listen(4132);
}
