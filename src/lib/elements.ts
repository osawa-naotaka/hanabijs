import type { Attribute, AttributeValue, HComponentFn, HNode } from "./component";

export type Tag =
    | "a"
    | "abbr"
    | "address"
    | "area"
    | "article"
    | "aside"
    | "audio"
    | "b"
    | "base"
    | "bdi"
    | "bdo"
    | "blockquote"
    | "body"
    | "br"
    | "button"
    | "canvas"
    | "caption"
    | "cite"
    | "code"
    | "col"
    | "colgroup"
    | "data"
    | "datalist"
    | "dd"
    | "del"
    | "details"
    | "dfn"
    | "dialog"
    | "div"
    | "dl"
    | "dt"
    | "em"
    | "embed"
    | "fieldset"
    | "figcaption"
    | "figure"
    | "font"
    | "footer"
    | "form"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "head"
    | "header"
    | "hgroup"
    | "hr"
    | "html"
    | "i"
    | "iframe"
    | "img"
    | "input"
    | "ins"
    | "kbd"
    | "label"
    | "legend"
    | "li"
    | "link"
    | "main"
    | "map"
    | "mark"
    | "marquee"
    | "menu"
    | "meta"
    | "meter"
    | "nav"
    | "noscript"
    | "object"
    | "ol"
    | "optgroup"
    | "option"
    | "output"
    | "p"
    | "param"
    | "picture"
    | "pre"
    | "progress"
    | "q"
    | "rp"
    | "rt"
    | "ruby"
    | "s"
    | "samp"
    | "script"
    | "section"
    | "select"
    | "small"
    | "source"
    | "span"
    | "strong"
    | "sub"
    | "summary"
    | "sup"
    | "table"
    | "tbody"
    | "td"
    | "template"
    | "textarea"
    | "tfoot"
    | "th"
    | "thead"
    | "time"
    | "title"
    | "tr"
    | "track"
    | "u"
    | "ul"
    | "var"
    | "video"
    | "wbr";

export const tags: Tag[] = [
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strong",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
] as const;

export type HanabiTag = "raw" | "unwrap";

export const hanabi_tags: HanabiTag[] = ["raw", "unwrap"] as const;

export type AttributeName =
    | "accept"
    | "accept-charset"
    | "accesskey"
    | "action"
    | "align"
    | "alt"
    | "async"
    | "autocapitalize"
    | "autocomplete"
    | "autofocus"
    | "autoplay"
    | "bgcolor"
    | "border"
    | "buffered"
    | "challenge"
    | "charset"
    | "checked"
    | "cite"
    | "class"
    | "code"
    | "codebase"
    | "color"
    | "cols"
    | "colspan"
    | "content"
    | "contenteditable"
    | "contextmenu"
    | "controls"
    | "coords"
    | "crossorigin"
    | "datetime"
    | "decoding"
    | "default"
    | "defer"
    | "dir"
    | "dirname"
    | "disabled"
    | "download"
    | "draggable"
    | "enctype"
    | "enterkeyhint"
    | "for"
    | "form"
    | "formaction"
    | "formenctype"
    | "formmethod"
    | "formnovalidate"
    | "formtarget"
    | "headers"
    | "height"
    | "hidden"
    | "high"
    | "href"
    | "hreflang"
    | "http_equiv"
    | "http-equiv"
    | "icon"
    | "id"
    | "importance"
    | "integrity"
    | "intrinsicsize"
    | "inputmode"
    | "is"
    | "itemid"
    | "itemprop"
    | "itemref"
    | "itemscope"
    | "itemtype"
    | "kind"
    | "label"
    | "lang"
    | "list"
    | "loading"
    | "loop"
    | "low"
    | "manifest"
    | "max"
    | "maxlength"
    | "minlength"
    | "media"
    | "method"
    | "min"
    | "multiple"
    | "muted"
    | "name"
    | "novalidate"
    | "open"
    | "optimum"
    | "pattern"
    | "ping"
    | "placeholder"
    | "popover"
    | "popovertarget"
    | "poster"
    | "preload"
    | "radiogroup"
    | "readonly"
    | "referrerpolicy"
    | "rel"
    | "required"
    | "reversed"
    | "rows"
    | "rowspan"
    | "sandbox"
    | "scope"
    | "scoped"
    | "selected"
    | "shape"
    | "size"
    | "sizes"
    | "slot"
    | "span"
    | "spellcheck"
    | "src"
    | "srcdoc"
    | "srclang"
    | "srcset"
    | "start"
    | "step"
    | "summary"
    | "tabindex"
    | "target"
    | "title"
    | "translate"
    | "type"
    | "usemap"
    | "value"
    | "width"
    | "wrap";

export const attribute_names: AttributeName[] = [
    "accept",
    "accept-charset",
    "accesskey",
    "action",
    "align",
    "alt",
    "async",
    "autocapitalize",
    "autocomplete",
    "autofocus",
    "autoplay",
    "bgcolor",
    "border",
    "buffered",
    "challenge",
    "charset",
    "checked",
    "cite",
    "class",
    "code",
    "codebase",
    "color",
    "cols",
    "colspan",
    "content",
    "contenteditable",
    "contextmenu",
    "controls",
    "coords",
    "crossorigin",
    "datetime",
    "decoding",
    "default",
    "defer",
    "dir",
    "dirname",
    "disabled",
    "download",
    "draggable",
    "enctype",
    "enterkeyhint",
    "for",
    "form",
    "formaction",
    "formenctype",
    "formmethod",
    "formnovalidate",
    "formtarget",
    "headers",
    "height",
    "hidden",
    "high",
    "href",
    "hreflang",
    "http_equiv",
    "http-equiv",
    "icon",
    "id",
    "importance",
    "integrity",
    "intrinsicsize",
    "inputmode",
    "is",
    "itemid",
    "itemprop",
    "itemref",
    "itemscope",
    "itemtype",
    "kind",
    "label",
    "lang",
    "list",
    "loading",
    "loop",
    "low",
    "manifest",
    "max",
    "maxlength",
    "minlength",
    "media",
    "method",
    "min",
    "multiple",
    "muted",
    "name",
    "novalidate",
    "open",
    "optimum",
    "pattern",
    "ping",
    "placeholder",
    "poster",
    "popover",
    "popovertarget",
    "preload",
    "radiogroup",
    "readonly",
    "referrerpolicy",
    "rel",
    "required",
    "reversed",
    "rows",
    "rowspan",
    "sandbox",
    "scope",
    "scoped",
    "selected",
    "shape",
    "size",
    "sizes",
    "slot",
    "span",
    "spellcheck",
    "src",
    "srcdoc",
    "srclang",
    "srcset",
    "start",
    "step",
    "summary",
    "tabindex",
    "target",
    "title",
    "translate",
    "type",
    "usemap",
    "value",
    "width",
    "wrap",
] as const;

// Common attribute_names (global attribute_names that can be used on any element)
export type CommonAttributeName =
    | "accesskey"
    | "autocapitalize"
    | "class"
    | "contenteditable"
    | "dir"
    | "draggable"
    | "hidden"
    | "id"
    | "itemprop"
    | "lang"
    | "popover"
    | "popovertarget"
    | "role"
    | "slot"
    | "spellcheck"
    | "tabindex"
    | "title"
    | "translate";

export const common_attribute_names: CommonAttributeName[] = [
    "accesskey",
    "autocapitalize",
    "class",
    "contenteditable",
    "dir",
    "draggable",
    "hidden",
    "id",
    "itemprop",
    "lang",
    "popover",
    "popovertarget",
    "role",
    "slot",
    "spellcheck",
    "tabindex",
    "title",
    "translate",
];

// Element-specific attribute_names
export type AAttributeName =
    | "download"
    | "href"
    | "hreflang"
    | "media"
    | "ping"
    | "referrerpolicy"
    | "rel"
    | "shape"
    | "target"
    | CommonAttributeName;
export type AAttribute = Record<AAttributeName, AttributeValue>;
export const a_attribute_names: AAttributeName[] = [
    "download",
    "href",
    "hreflang",
    "media",
    "ping",
    "referrerpolicy",
    "rel",
    "shape",
    "target",
    ...common_attribute_names,
];

export type AbbrAttributeName = CommonAttributeName;
export type AbbrAttribute = Record<CommonAttributeName, AttributeValue>;
export const abbr_attribute_names: AbbrAttributeName[] = common_attribute_names;

export type AddressAttributeName = CommonAttributeName;
export type AddressAttribute = Record<CommonAttributeName, AttributeValue>;
export const address_attribute_names: AddressAttributeName[] = common_attribute_names;

export type AreaAttributeName =
    | "alt"
    | "coords"
    | "download"
    | "href"
    | "hreflang"
    | "media"
    | "ping"
    | "referrerpolicy"
    | "rel"
    | "shape"
    | "target"
    | CommonAttributeName;
export type AreaAttribute = Record<AreaAttributeName, AttributeValue>;
export const area_attribute_names: AreaAttributeName[] = [
    "alt",
    "coords",
    "download",
    "href",
    "hreflang",
    "media",
    "ping",
    "referrerpolicy",
    "rel",
    "shape",
    "target",
    ...common_attribute_names,
];

export type ArticleAttributeName = CommonAttributeName;
export type ArticleAttribute = Record<CommonAttributeName, AttributeValue>;
export const article_attribute_names: ArticleAttributeName[] = common_attribute_names;

export type AsideAttributeName = CommonAttributeName;
export type AsideAttribute = Record<CommonAttributeName, AttributeValue>;
export const aside_attribute_names: AsideAttributeName[] = common_attribute_names;

export type AudioAttributeName =
    | "autoplay"
    | "controls"
    | "crossorigin"
    | "loop"
    | "muted"
    | "preload"
    | "src"
    | CommonAttributeName;
export type AudioAttribute = Record<AudioAttributeName, AttributeValue>;
export const audio_attribute_names: AudioAttributeName[] = [
    "autoplay",
    "controls",
    "crossorigin",
    "loop",
    "muted",
    "preload",
    "src",
    ...common_attribute_names,
];

export type BAttributeName = CommonAttributeName;
export type BAttribute = Record<CommonAttributeName, AttributeValue>;
export const b_attribute_names: BAttributeName[] = common_attribute_names;

export type BaseAttributeName = "href" | "target" | CommonAttributeName;
export type BaseAttribute = Record<BaseAttributeName, AttributeValue>;
export const base_attribute_names: BaseAttributeName[] = ["href", "target", ...common_attribute_names];

export type BdiAttributeName = CommonAttributeName;
export type BdiAttribute = Record<CommonAttributeName, AttributeValue>;
export const bdi_attribute_names: BdiAttributeName[] = common_attribute_names;

export type BdoAttributeName = CommonAttributeName;
export type BdoAttribute = Record<CommonAttributeName, AttributeValue>;
export const bdo_attribute_names: BdoAttributeName[] = common_attribute_names;

export type BlockquoteAttributeName = "cite" | CommonAttributeName;
export type BlockquoteAttribute = Record<BlockquoteAttributeName, AttributeValue>;
export const blockquote_attribute_names: BlockquoteAttributeName[] = ["cite", ...common_attribute_names];

export type BodyAttributeName = "background" | "bgcolor" | CommonAttributeName;
export type BodyAttribute = Record<BodyAttributeName, AttributeValue>;
export const body_attribute_names: BodyAttributeName[] = ["background", "bgcolor", ...common_attribute_names];

export type BrAttributeName = CommonAttributeName;
export type BrAttribute = Record<CommonAttributeName, AttributeValue>;
export const br_attribute_names: BrAttributeName[] = common_attribute_names;

export type ButtonAttributeName =
    | "disabled"
    | "form"
    | "formaction"
    | "formenctype"
    | "formmethod"
    | "formnovalidate"
    | "formtarget"
    | "name"
    | "type"
    | "value"
    | CommonAttributeName;
export type ButtonAttribute = Record<ButtonAttributeName, AttributeValue>;
export const button_attribute_names: ButtonAttributeName[] = [
    "disabled",
    "form",
    "formaction",
    "formenctype",
    "formmethod",
    "formnovalidate",
    "formtarget",
    "name",
    "type",
    "value",
    ...common_attribute_names,
];

export type CanvasAttributeName = "height" | "width" | CommonAttributeName;
export type CanvasAttribute = Record<CanvasAttributeName, AttributeValue>;
export const canvas_attribute_names: CanvasAttributeName[] = ["height", "width", ...common_attribute_names];

export type CiteAttributeName = CommonAttributeName;
export type CiteAttribute = Record<CommonAttributeName, AttributeValue>;
export const cite_attribute_names: CiteAttributeName[] = common_attribute_names;

export type CodeAttributeName = CommonAttributeName;
export type CodeAttribute = Record<CommonAttributeName, AttributeValue>;
export const code_attribute_names: CodeAttributeName[] = common_attribute_names;

export type ColAttributeName = "bgcolor" | "span" | CommonAttributeName;
export type ColAttribute = Record<ColAttributeName, AttributeValue>;
export const col_attribute_names: ColAttributeName[] = ["bgcolor", "span", ...common_attribute_names];

export type ColgroupAttributeName = "bgcolor" | "span" | CommonAttributeName;
export type ColgroupAttribute = Record<ColgroupAttributeName, AttributeValue>;
export const colgroup_attribute_names: ColgroupAttributeName[] = ["bgcolor", "span", ...common_attribute_names];

export type DataAttributeName = "value" | CommonAttributeName;
export type DataAttribute = Record<DataAttributeName, AttributeValue>;
export const data_attribute_names: DataAttributeName[] = ["value", ...common_attribute_names];

export type DatalistAttributeName = CommonAttributeName;
export type DatalistAttribute = Record<CommonAttributeName, AttributeValue>;
export const datalist_attribute_names: DatalistAttributeName[] = common_attribute_names;

export type DdAttributeName = CommonAttributeName;
export type DdAttribute = Record<CommonAttributeName, AttributeValue>;
export const dd_attribute_names: DdAttributeName[] = common_attribute_names;

export type DelAttributeName = "cite" | "datetime" | CommonAttributeName;
export type DelAttribute = Record<DelAttributeName, AttributeValue>;
export const del_attribute_names: DelAttributeName[] = ["cite", "datetime", ...common_attribute_names];

export type DetailsAttributeName = "open" | CommonAttributeName;
export type DetailsAttribute = Record<DetailsAttributeName, AttributeValue>;
export const details_attribute_names: DetailsAttributeName[] = ["open", ...common_attribute_names];

export type DfnAttributeName = CommonAttributeName;
export type DfnAttribute = Record<CommonAttributeName, AttributeValue>;
export const dfn_attribute_names: DfnAttributeName[] = common_attribute_names;

export type DialogAttributeName = "open" | CommonAttributeName;
export type DialogAttribute = Record<DialogAttributeName, AttributeValue>;
export const dialog_attribute_names: DialogAttributeName[] = ["open", ...common_attribute_names];

export type DivAttributeName = CommonAttributeName;
export type DivAttribute = Record<CommonAttributeName, AttributeValue>;
export const div_attribute_names: DivAttributeName[] = common_attribute_names;

export type DlAttributeName = CommonAttributeName;
export type DlAttribute = Record<CommonAttributeName, AttributeValue>;
export const dl_attribute_names: DlAttributeName[] = common_attribute_names;

export type DtAttributeName = CommonAttributeName;
export type DtAttribute = Record<CommonAttributeName, AttributeValue>;
export const dt_attribute_names: DtAttributeName[] = common_attribute_names;

export type EmAttributeName = CommonAttributeName;
export type EmAttribute = Record<CommonAttributeName, AttributeValue>;
export const em_attribute_names: EmAttributeName[] = common_attribute_names;

export type EmbedAttributeName = "height" | "src" | "type" | "width" | CommonAttributeName;
export type EmbedAttribute = Record<EmbedAttributeName, AttributeValue>;
export const embed_attribute_names: EmbedAttributeName[] = [
    "height",
    "src",
    "type",
    "width",
    ...common_attribute_names,
];

export type FieldsetAttributeName = "disabled" | "form" | "name" | CommonAttributeName;
export type FieldsetAttribute = Record<FieldsetAttributeName, AttributeValue>;
export const fieldset_attribute_names: FieldsetAttributeName[] = [
    "disabled",
    "form",
    "name",
    ...common_attribute_names,
];

export type FigcaptionAttributeName = CommonAttributeName;
export type FigcaptionAttribute = Record<CommonAttributeName, AttributeValue>;
export const figcaption_attribute_names: FigcaptionAttributeName[] = common_attribute_names;

export type FigureAttributeName = CommonAttributeName;
export type FigureAttribute = Record<CommonAttributeName, AttributeValue>;
export const figure_attribute_names: FigureAttributeName[] = common_attribute_names;

export type FontAttributeName = "color" | CommonAttributeName;
export type FontAttribute = Record<FontAttributeName, AttributeValue>;
export const font_attribute_names: FontAttributeName[] = ["color", ...common_attribute_names];

export type FooterAttributeName = CommonAttributeName;
export type FooterAttribute = Record<CommonAttributeName, AttributeValue>;
export const footer_attribute_names: FooterAttributeName[] = common_attribute_names;

export type FormAttributeName =
    | "accept-charset"
    | "action"
    | "autocomplete"
    | "enctype"
    | "method"
    | "name"
    | "novalidate"
    | "target"
    | CommonAttributeName;
export type FormAttribute = Record<FormAttributeName, AttributeValue>;
export const form_attribute_names: FormAttributeName[] = [
    "accept-charset",
    "action",
    "autocomplete",
    "enctype",
    "method",
    "name",
    "novalidate",
    "target",
    ...common_attribute_names,
];

export type H1AttributeName = CommonAttributeName;
export type H1Attribute = Record<CommonAttributeName, AttributeValue>;
export const h1_attribute_names: H1AttributeName[] = common_attribute_names;

export type H2AttributeName = CommonAttributeName;
export type H2Attribute = Record<CommonAttributeName, AttributeValue>;
export const h2_attribute_names: H2AttributeName[] = common_attribute_names;

export type H3AttributeName = CommonAttributeName;
export type H3Attribute = Record<CommonAttributeName, AttributeValue>;
export const h3_attribute_names: H3AttributeName[] = common_attribute_names;

export type H4AttributeName = CommonAttributeName;
export type H4Attribute = Record<CommonAttributeName, AttributeValue>;
export const h4_attribute_names: H4AttributeName[] = common_attribute_names;

export type H5AttributeName = CommonAttributeName;
export type H5Attribute = Record<CommonAttributeName, AttributeValue>;
export const h5_attribute_names: H5AttributeName[] = common_attribute_names;

export type H6AttributeName = CommonAttributeName;
export type H6Attribute = Record<CommonAttributeName, AttributeValue>;
export const h6_attribute_names: H6AttributeName[] = common_attribute_names;

export type HeadAttributeName = CommonAttributeName;
export type HeadAttribute = Record<CommonAttributeName, AttributeValue>;
export const head_attribute_names: HeadAttributeName[] = common_attribute_names;

export type HeaderAttributeName = CommonAttributeName;
export type HeaderAttribute = Record<CommonAttributeName, AttributeValue>;
export const header_attribute_names: HeaderAttributeName[] = common_attribute_names;

export type HgroupAttributeName = CommonAttributeName;
export type HgroupAttribute = Record<CommonAttributeName, AttributeValue>;
export const hgroup_attribute_names: HgroupAttributeName[] = common_attribute_names;

export type HrAttributeName = "color" | CommonAttributeName;
export type HrAttribute = Record<HrAttributeName, AttributeValue>;
export const hr_attribute_names: HrAttributeName[] = ["color", ...common_attribute_names];

export type HtmlAttributeName = CommonAttributeName;
export type HtmlAttribute = Record<CommonAttributeName, AttributeValue>;
export const html_attribute_names: HtmlAttributeName[] = common_attribute_names;

export type IAttributeName = CommonAttributeName;
export type IAttribute = Record<CommonAttributeName, AttributeValue>;
export const i_attribute_names: IAttributeName[] = common_attribute_names;

export type IframeAttributeName =
    | "allow"
    | "csp"
    | "height"
    | "loading"
    | "name"
    | "referrerpolicy"
    | "sandbox"
    | "src"
    | "srcdoc"
    | "width"
    | CommonAttributeName;
export type IframeAttribute = Record<IframeAttributeName, AttributeValue>;
export const iframe_attribute_names: IframeAttributeName[] = [
    "allow",
    "csp",
    "height",
    "loading",
    "name",
    "referrerpolicy",
    "sandbox",
    "src",
    "srcdoc",
    "width",
    ...common_attribute_names,
];

export type ImgAttributeName =
    | "alt"
    | "border"
    | "crossorigin"
    | "decoding"
    | "height"
    | "ismap"
    | "loading"
    | "referrerpolicy"
    | "sizes"
    | "src"
    | "srcset"
    | "usemap"
    | "width"
    | CommonAttributeName;
export type ImgAttribute = Record<ImgAttributeName, AttributeValue>;
export const img_attribute_names: ImgAttributeName[] = [
    "alt",
    "border",
    "crossorigin",
    "decoding",
    "height",
    "ismap",
    "loading",
    "referrerpolicy",
    "sizes",
    "src",
    "srcset",
    "usemap",
    "width",
    ...common_attribute_names,
];

export type InputAttributeName =
    | "accept"
    | "alt"
    | "autocomplete"
    | "capture"
    | "checked"
    | "disabled"
    | "form"
    | "formaction"
    | "formenctype"
    | "formmethod"
    | "formnovalidate"
    | "formtarget"
    | "height"
    | "list"
    | "max"
    | "maxlength"
    | "min"
    | "minlength"
    | "multiple"
    | "name"
    | "pattern"
    | "placeholder"
    | "readonly"
    | "required"
    | "size"
    | "src"
    | "step"
    | "type"
    | "usemap"
    | "value"
    | "width"
    | CommonAttributeName;
export type InputAttribute = Record<InputAttributeName, AttributeValue>;
export const input_attribute_names: InputAttributeName[] = [
    "accept",
    "alt",
    "autocomplete",
    "capture",
    "checked",
    "disabled",
    "form",
    "formaction",
    "formenctype",
    "formmethod",
    "formnovalidate",
    "formtarget",
    "height",
    "list",
    "max",
    "maxlength",
    "min",
    "minlength",
    "multiple",
    "name",
    "pattern",
    "placeholder",
    "readonly",
    "required",
    "size",
    "src",
    "step",
    "type",
    "usemap",
    "value",
    "width",
    ...common_attribute_names,
];

export type InsAttributeName = "cite" | "datetime" | CommonAttributeName;
export type InsAttribute = Record<InsAttributeName, AttributeValue>;
export const ins_attribute_names: InsAttributeName[] = ["cite", "datetime", ...common_attribute_names];

export type KbdAttributeName = CommonAttributeName;
export type Kbdttribute = Record<CommonAttributeName, AttributeValue>;
export const kbd_attribute_names: KbdAttributeName[] = common_attribute_names;

export type LabelAttributeName = "for" | "form" | CommonAttributeName;
export type LabelAttribute = Record<LabelAttributeName, AttributeValue>;
export const label_attribute_names: LabelAttributeName[] = ["for", "form", ...common_attribute_names];

export type LiAttributeName = "value" | CommonAttributeName;
export type LiAttribute = Record<LiAttributeName, AttributeValue>;
export const li_attribute_names: LiAttributeName[] = ["value", ...common_attribute_names];

export type LinkAttributeName =
    | "as"
    | "crossorigin"
    | "href"
    | "hreflang"
    | "integrity"
    | "media"
    | "referrerpolicy"
    | "rel"
    | "sizes"
    | "type"
    | CommonAttributeName;
export type LinkAttribute = Record<LinkAttributeName, AttributeValue>;
export const link_attribute_names: LinkAttributeName[] = [
    "as",
    "crossorigin",
    "href",
    "hreflang",
    "integrity",
    "media",
    "referrerpolicy",
    "rel",
    "sizes",
    "type",
    ...common_attribute_names,
];

export type MainAttributeName = CommonAttributeName;
export type MainAttribute = Record<CommonAttributeName, AttributeValue>;
export const main_attribute_names: MainAttributeName[] = common_attribute_names;

export type MapAttributeName = "name" | CommonAttributeName;
export type MapAttribute = Record<MapAttributeName, AttributeValue>;
export const map_attribute_names: MapAttributeName[] = ["name", ...common_attribute_names];

export type MarkAttributeName = CommonAttributeName;
export type MarkAttribute = Record<CommonAttributeName, AttributeValue>;
export const mark_attribute_names: MarkAttributeName[] = common_attribute_names;

export type MarqueeAttributeName = "bgcolor" | "loop" | CommonAttributeName;
export type MarqueeAttribute = Record<MarqueeAttributeName, AttributeValue>;
export const marquee_attribute_names: MarqueeAttributeName[] = ["bgcolor", "loop", ...common_attribute_names];

export type MenuAttributeName = "type" | CommonAttributeName;
export type MenuAttribute = Record<MenuAttributeName, AttributeValue>;
export const menu_attribute_names: MenuAttributeName[] = ["type", ...common_attribute_names];

export type MetaAttributeName = "charset" | "content" | "http_equiv" | "http-equiv" | "name" | CommonAttributeName;
export type MetaAttribute = Record<MetaAttributeName, AttributeValue>;
export const meta_attribute_names: MetaAttributeName[] = [
    "charset",
    "content",
    "http_equiv",
    "http-equiv",
    "name",
    ...common_attribute_names,
];

export type MeterAttributeName = "form" | "high" | "low" | "max" | "min" | "optimum" | "value" | CommonAttributeName;
export type MeterAttribute = Record<MeterAttributeName, AttributeValue>;
export const meter_attribute_names: MeterAttributeName[] = [
    "form",
    "high",
    "low",
    "max",
    "min",
    "optimum",
    "value",
    ...common_attribute_names,
];

export type NavAttributeName = CommonAttributeName;
export type NavAttribute = Record<CommonAttributeName, AttributeValue>;
export const nav_attribute_names: NavAttributeName[] = common_attribute_names;

export type NoscriptAttributeName = CommonAttributeName;
export type NoscriptAttribute = Record<CommonAttributeName, AttributeValue>;
export const noscript_attribute_names: NoscriptAttributeName[] = common_attribute_names;

export type ObjectAttributeName =
    | "border"
    | "data"
    | "form"
    | "height"
    | "name"
    | "type"
    | "usemap"
    | "width"
    | CommonAttributeName;
export type ObjectAttribute = Record<ObjectAttributeName, AttributeValue>;
export const object_attribute_names: ObjectAttributeName[] = [
    "border",
    "data",
    "form",
    "height",
    "name",
    "type",
    "usemap",
    "width",
    ...common_attribute_names,
];

export type OlAttributeName = "reversed" | "start" | "type" | CommonAttributeName;
export type OlAttribute = Record<OlAttributeName, AttributeValue>;
export const ol_attribute_names: OlAttributeName[] = ["reversed", "start", "type", ...common_attribute_names];

export type OptgroupAttributeName = "disabled" | "label" | CommonAttributeName;
export type OptgroupAttribute = Record<OptgroupAttributeName, AttributeValue>;
export const optgroup_attribute_names: OptgroupAttributeName[] = ["disabled", "label", ...common_attribute_names];

export type OptionAttributeName = "disabled" | "label" | "selected" | "value" | CommonAttributeName;
export type OptionAttribute = Record<OptionAttributeName, AttributeValue>;
export const option_attribute_names: OptionAttributeName[] = [
    "disabled",
    "label",
    "selected",
    "value",
    ...common_attribute_names,
];

export type OutputAttributeName = "for" | "form" | "name" | CommonAttributeName;
export type OutputAttribute = Record<OutputAttributeName, AttributeValue>;
export const output_attribute_names: OutputAttributeName[] = ["for", "form", "name", ...common_attribute_names];

export type PAttributeName = CommonAttributeName;
export type PAttribute = Record<CommonAttributeName, AttributeValue>;
export const p_attribute_names: PAttributeName[] = common_attribute_names;

export type ParamAttributeName = "name" | "value" | CommonAttributeName;
export type ParamAttribute = Record<ParamAttributeName, AttributeValue>;
export const param_attribute_names: ParamAttributeName[] = ["name", "value", ...common_attribute_names];

export type PictureAttributeName = CommonAttributeName;
export type PictureAttribute = Record<CommonAttributeName, AttributeValue>;
export const picture_attribute_names: PictureAttributeName[] = common_attribute_names;

export type PreAttributeName = CommonAttributeName;
export type PreAttribute = Record<CommonAttributeName, AttributeValue>;
export const pre_attribute_names: PreAttributeName[] = common_attribute_names;

export type ProgressAttributeName = "form" | "max" | "value" | CommonAttributeName;
export type ProgressAttribute = Record<ProgressAttributeName, AttributeValue>;
export const progress_attribute_names: ProgressAttributeName[] = ["form", "max", "value", ...common_attribute_names];

export type QAttributeName = "cite" | CommonAttributeName;
export type QAttribute = Record<QAttributeName, AttributeValue>;
export const q_attribute_names: QAttributeName[] = ["cite", ...common_attribute_names];

export type RpAttributeName = CommonAttributeName;
export type RpAttribute = Record<CommonAttributeName, AttributeValue>;
export const rp_attribute_names: RpAttributeName[] = common_attribute_names;

export type RtAttributeName = CommonAttributeName;
export type RtAttribute = Record<CommonAttributeName, AttributeValue>;
export const rt_attribute_names: RtAttributeName[] = common_attribute_names;

export type RubyAttributeName = CommonAttributeName;
export type RubyAttribute = Record<CommonAttributeName, AttributeValue>;
export const ruby_attribute_names: RubyAttributeName[] = common_attribute_names;

export type SAttributeName = CommonAttributeName;
export type SAttribute = Record<CommonAttributeName, AttributeValue>;
export const s_attribute_names: SAttributeName[] = common_attribute_names;

export type SampAttributeName = CommonAttributeName;
export type SampAttribute = Record<CommonAttributeName, AttributeValue>;
export const samp_attribute_names: SampAttributeName[] = common_attribute_names;

export type ScriptAttributeName =
    | "async"
    | "crossorigin"
    | "defer"
    | "integrity"
    | "referrerpolicy"
    | "src"
    | "type"
    | CommonAttributeName;
export type ScriptAttribute = Record<ScriptAttributeName, AttributeValue>;
export const script_attribute_names: ScriptAttributeName[] = [
    "async",
    "crossorigin",
    "defer",
    "integrity",
    "referrerpolicy",
    "src",
    "type",
    ...common_attribute_names,
];

export type SectionAttributeName = CommonAttributeName;
export type SectionAttribute = Record<CommonAttributeName, AttributeValue>;
export const section_attribute_names: SectionAttributeName[] = common_attribute_names;

export type SelectAttributeName =
    | "autocomplete"
    | "disabled"
    | "form"
    | "multiple"
    | "name"
    | "required"
    | "size"
    | CommonAttributeName;
export type SelectAttribute = Record<SelectAttributeName, AttributeValue>;
export const select_attribute_names: SelectAttributeName[] = [
    "autocomplete",
    "disabled",
    "form",
    "multiple",
    "name",
    "required",
    "size",
    ...common_attribute_names,
];

export type SmallAttributeName = CommonAttributeName;
export type SmallAttribute = Record<CommonAttributeName, AttributeValue>;
export const small_attribute_names: SmallAttributeName[] = common_attribute_names;

export type SourceAttributeName = "media" | "sizes" | "src" | "srcset" | "type" | CommonAttributeName;
export type SourceAttribute = Record<SourceAttributeName, AttributeValue>;
export const source_attribute_names: SourceAttributeName[] = [
    "media",
    "sizes",
    "src",
    "srcset",
    "type",
    ...common_attribute_names,
];

export type SpanAttributeName = CommonAttributeName;
export type SpanAttribute = Record<CommonAttributeName, AttributeValue>;
export const span_attribute_names: SpanAttributeName[] = common_attribute_names;

export type StrongAttributeName = CommonAttributeName;
export type StrongAttribute = Record<CommonAttributeName, AttributeValue>;
export const strong_attribute_names: StrongAttributeName[] = common_attribute_names;

export type SubAttributeName = CommonAttributeName;
export type SubAttribute = Record<CommonAttributeName, AttributeValue>;
export const sub_attribute_names: SubAttributeName[] = common_attribute_names;

export type SummaryAttributeName = CommonAttributeName;
export type SummaryAttribute = Record<CommonAttributeName, AttributeValue>;
export const summary_attribute_names: SummaryAttributeName[] = common_attribute_names;

export type SupAttributeName = CommonAttributeName;
export type SupAttribute = Record<CommonAttributeName, AttributeValue>;
export const sup_attribute_names: SupAttributeName[] = common_attribute_names;

export type TableAttributeName = "background" | "bgcolor" | "border" | CommonAttributeName;
export type TableAttribute = Record<TableAttributeName, AttributeValue>;
export const table_attribute_names: TableAttributeName[] = [
    "background",
    "bgcolor",
    "border",
    ...common_attribute_names,
];

export type TbodyAttributeName = "bgcolor" | CommonAttributeName;
export type TbodyAttribute = Record<TbodyAttributeName, AttributeValue>;
export const tbody_attribute_names: TbodyAttributeName[] = ["bgcolor", ...common_attribute_names];

export type TdAttributeName = "background" | "bgcolor" | "colspan" | "headers" | "rowspan" | CommonAttributeName;
export type TdAttribute = Record<TdAttributeName, AttributeValue>;
export const td_attribute_names: TdAttributeName[] = [
    "background",
    "bgcolor",
    "colspan",
    "headers",
    "rowspan",
    ...common_attribute_names,
];

export type TemplateAttributeName = CommonAttributeName;
export type TemplateAttribute = Record<CommonAttributeName, AttributeValue>;
export const template_attribute_names: TemplateAttributeName[] = common_attribute_names;

export type TextareaAttributeName =
    | "autocomplete"
    | "cols"
    | "dirname"
    | "disabled"
    | "form"
    | "maxlength"
    | "minlength"
    | "name"
    | "placeholder"
    | "readonly"
    | "required"
    | "rows"
    | "wrap"
    | CommonAttributeName;
export type TextareaAttribute = Record<TextareaAttributeName, AttributeValue>;
export const textarea_attribute_names: TextareaAttributeName[] = [
    "autocomplete",
    "cols",
    "dirname",
    "disabled",
    "form",
    "maxlength",
    "minlength",
    "name",
    "placeholder",
    "readonly",
    "required",
    "rows",
    "wrap",
    ...common_attribute_names,
];

export type TfootAttributeName = "bgcolor" | CommonAttributeName;
export type TfootAttribute = Record<TfootAttributeName, AttributeValue>;
export const tfoot_attribute_names: TfootAttributeName[] = ["bgcolor", ...common_attribute_names];

export type ThAttributeName =
    | "background"
    | "bgcolor"
    | "colspan"
    | "headers"
    | "rowspan"
    | "scope"
    | CommonAttributeName;
export type ThAttribute = Record<ThAttributeName, AttributeValue>;
export const th_attribute_names: ThAttributeName[] = [
    "background",
    "bgcolor",
    "colspan",
    "headers",
    "rowspan",
    "scope",
    ...common_attribute_names,
];

export type TheadAttributeName = CommonAttributeName;
export type TheadAttribute = Record<CommonAttributeName, AttributeValue>;
export const thead_attribute_names: TheadAttributeName[] = common_attribute_names;

export type TimeAttributeName = "datetime" | CommonAttributeName;
export type TimeAttribute = Record<TimeAttributeName, AttributeValue>;
export const time_attribute_names: TimeAttributeName[] = ["datetime", ...common_attribute_names];

export type TitleAttributeName = CommonAttributeName;
export type TitleAttribute = Record<CommonAttributeName, AttributeValue>;
export const title_attribute_names: TitleAttributeName[] = common_attribute_names;

export type TrAttributeName = "bgcolor" | CommonAttributeName;
export type TrAttribute = Record<TrAttributeName, AttributeValue>;
export const tr_attribute_names: TrAttributeName[] = ["bgcolor", ...common_attribute_names];

export type TrackAttributeName = "default" | "kind" | "label" | "src" | "srclang" | CommonAttributeName;
export type TrackAttribute = Record<TrackAttributeName, AttributeValue>;
export const track_attribute_names: TrackAttributeName[] = [
    "default",
    "kind",
    "label",
    "src",
    "srclang",
    ...common_attribute_names,
];

export type UAttributeName = CommonAttributeName;
export type UAttribute = Record<CommonAttributeName, AttributeValue>;
export const u_attribute_names: UAttributeName[] = common_attribute_names;

export type UlAttributeName = CommonAttributeName;
export type UlAttribute = Record<CommonAttributeName, AttributeValue>;
export const ul_attribute_names: UlAttributeName[] = common_attribute_names;

export type VarAttributeName = CommonAttributeName;
export type VarAttribute = Record<CommonAttributeName, AttributeValue>;
export const var_attribute_names: VarAttributeName[] = common_attribute_names;

export type VideoAttributeName =
    | "autoplay"
    | "controls"
    | "crossorigin"
    | "height"
    | "loop"
    | "muted"
    | "playsinline"
    | "poster"
    | "preload"
    | "src"
    | "width"
    | CommonAttributeName;
export type VideoAttribute = Record<VideoAttributeName, AttributeValue>;
export const video_attribute_names: VideoAttributeName[] = [
    "autoplay",
    "controls",
    "crossorigin",
    "height",
    "loop",
    "muted",
    "playsinline",
    "poster",
    "preload",
    "src",
    "width",
    ...common_attribute_names,
];

export type WbrAttributeName = CommonAttributeName;
export type WbrAttribute = Record<CommonAttributeName, AttributeValue>;
export const wbr_attribute_names: WbrAttributeName[] = common_attribute_names;

function gt<T extends Attribute>(tag: Tag | HanabiTag): HComponentFn<Partial<T>> {
    return {
        [tag]:
            (argument: Partial<T>) =>
            (...child: HNode[]) => ({ element_name: tag, tag, attribute: argument, child }),
    }[tag];
}

// add here

// add here
export const Meta = gt<MetaAttribute>("meta");
export const Link = gt<LinkAttribute>("link");
export const Head = gt<HeadAttribute>("head");
export const Body = gt<BodyAttribute>("body");
export const Html = gt<HtmlAttribute>("html");
export const Div = gt<DivAttribute>("div");
export const Span = gt<SpanAttribute>("span");
export const Main = gt<MainAttribute>("main");
export const Aside = gt<AsideAttribute>("aside");
export const Section = gt<SectionAttribute>("section");
export const Article = gt<ArticleAttribute>("article");
export const Ul = gt<UlAttribute>("ul");
export const Ol = gt<OlAttribute>("ol");
export const Li = gt<LiAttribute>("li");
export const Img = gt<ImgAttribute>("img");
export const Title = gt<TitleAttribute>("title");
export const Script = gt<ScriptAttribute>("script");
export const H1 = gt<H1Attribute>("h1");
export const H2 = gt<H2Attribute>("h2");
export const H3 = gt<H3Attribute>("h3");
export const H4 = gt<H4Attribute>("h4");
export const H5 = gt<H5Attribute>("h5");
export const H6 = gt<H6Attribute>("h6");
export const Header = gt<HeaderAttribute>("header");
export const Footer = gt<FooterAttribute>("footer");
export const A = gt<AAttribute>("a");
export const P = gt<PAttribute>("p");
export const Input = gt<InputAttribute>("input");
export const Label = gt<LabelAttribute>("label");
export const Nav = gt<NavAttribute>("nav");
export const Em = gt<EmAttribute>("em");
export const Button = gt<ButtonAttribute>("button");
export const Time = gt<TimeAttribute>("time");
export const Pre = gt<PreAttribute>("pre");

export const Unwrap = gt("unwrap");
export const RawHTML = gt("raw");
