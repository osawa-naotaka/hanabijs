import type {Attribute, ComponentFn, Tag } from "./element";
import { addClassToAttribute } from "./element";
import type { Rule } from "./style";


export function createSemantic<T extends Attribute>(className: string, style: Rule[] = [], tag: Tag = "div"): ComponentFn<T> {
    return (attribute, ...child) => [{ tag, attribute: addClassToAttribute<T>(attribute, className), child}, style];
};

function gt<T extends Attribute = Attribute>(tag: Tag): ComponentFn<T> {
    return (attribute, ...child) => [{ tag, attribute, child}, []];
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
export const Input = gt("input");
export const Label = gt("label");
export const Nav = gt("nav");
export const Em = gt("em");
export const RawHTML = gt("raw");
