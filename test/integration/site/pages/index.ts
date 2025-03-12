import { createComponent } from "hanabijs";
import {
	A,
	Body,
	Footer,
	H1,
	Head,
	Header,
	Html,
	Link,
	Meta,
	Title,
} from "hanabijs";
import type { HNode } from "hanabijs";
import { style } from "hanabijs";

export default function Top(): HNode {
	return Page({
		title: "template engine",
		description: "template-engine sample.",
	});
}

const Page = createComponent<{ title: string; description: string }>(
	(attribute, _style, child) =>
		Html(
			{ lang: "en" },
			PageHead(attribute),
			Body(
				{ id: "top-of-page" },
				PageHeader(attribute),
				...child,
				PageFooter({}),
			),
		),
);

const PageHead = createComponent<{ title: string; description: string }>(
	(attribute) =>
		Head(
			{},
			// Global Metadata
			Meta({ charset: "utf-8" }),
			Meta({
				name: "viewport",
				content: "width=device-width,initial-scale=1.0",
			}),
			Link({ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }),
			Meta({ name: "generator", content: "template-engine" }),

			// Canonical URL
			Link({
				rel: "canonical",
				href: "https://template-engine.lulliecat.com",
			}),

			// Primary Meta Tags
			Title({}, attribute.title),
			Meta({ name: "description", content: attribute.description }),
			Meta({
				http_equiv: "Content-Security-Policy",
				content:
					"default-src 'self' 'unsafe-inline'; img-src 'self' https://img.youtube.com; frame-src https://www.youtube.com;",
			}),
		),
);

const PageHeader = createComponent<{ title: string }>((attribute) =>
	Header(
		{ class: "page-header" },
		style([[[[".page-header"]], { width: "100%" }]]),
		H1({}, A({ href: "/" }, attribute.title)),
	),
);

const PageFooter = createComponent(() =>
	Footer({ class: "page-footer" }, "&copy; 2025 lulliecat"),
);
