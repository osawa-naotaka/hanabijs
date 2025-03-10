import type { Attribute, Elem, HNode, HOElem, Tag } from "./element";
import { classifyElemArgs, createElem } from "./element";
import type { Rule } from "./style";

// Component
export type Component<T> = (attribute: T, ...args: (Rule[] | HNode)[]) => Elem;
export type HOComponent<A, T> = (
	attribute: T,
	...args: (Rule[] | HNode)[]
) => HOElem<A>;

export function createComponent<T>(
	fn: (attribute: T, style: Rule[], child: HNode[]) => Elem,
): Component<T> {
	return (attribute: T, ...cargs: (Rule[] | HNode)[]) => {
		const { style, child } = classifyElemArgs(cargs);
		return fn(attribute, style, child);
	};
}

export function createHOComponent<A, T>(
	fn: (attribute: T, style: Rule[], child: HNode[]) => (args: A) => Elem,
): HOComponent<A, T> {
	return (attribute: T, ...cargs: (Rule[] | HNode)[]) =>
		(arg: A) => {
			const { style, child } = classifyElemArgs(cargs);
			return fn(attribute, style, child)(arg);
		};
}

function gt(tag: Tag): Component<Attribute> {
	return (attribute: Attribute, ...args) => createElem(tag, attribute, args);
}

export const Meta = gt("meta");
export const Link = gt("link");
export const Head = gt("head");
export const Body = gt("body");
export const Html = gt("html");
export const Div = gt("div");
export const Span = gt("span");
export const Main = gt("main");
export const Aside = gt("aside");
export const Section = gt("section");
export const Article = gt("article");
export const Ul = gt("ul");
export const Ol = gt("ol");
export const Li = gt("li");
export const Img = gt("img");
export const Title = gt("title");
export const Script = gt("script");
export const H1 = gt("h1");
export const H2 = gt("h2");
export const H3 = gt("h3");
export const H4 = gt("h4");
export const H5 = gt("h5");
export const H6 = gt("h6");
export const Header = gt("header");
export const Footer = gt("footer");
export const A = gt("a");
export const P = gt("p");
