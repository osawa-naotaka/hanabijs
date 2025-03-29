import type { AttributeValue, HComponentFn, HNode } from "./component";

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

type AttributeType<T extends string> = Record<T, AttributeValue> & Record<Exclude<AttributeName, T>, undefined>;

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
export type AAttribute = AttributeType<AAttributeName>;
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
export type AbbrAttribute = AttributeType<CommonAttributeName>;
export const abbr_attribute_names: AbbrAttributeName[] = common_attribute_names;

export type AddressAttributeName = CommonAttributeName;
export type AddressAttribute = AttributeType<CommonAttributeName>;
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
export type AreaAttribute = AttributeType<AreaAttributeName>;
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
export type ArticleAttribute = AttributeType<CommonAttributeName>;
export const article_attribute_names: ArticleAttributeName[] = common_attribute_names;

export type AsideAttributeName = CommonAttributeName;
export type AsideAttribute = AttributeType<CommonAttributeName>;
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
export type AudioAttribute = AttributeType<AudioAttributeName>;
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
export type BAttribute = AttributeType<CommonAttributeName>;
export const b_attribute_names: BAttributeName[] = common_attribute_names;

export type BaseAttributeName = "href" | "target" | CommonAttributeName;
export type BaseAttribute = AttributeType<BaseAttributeName>;
export const base_attribute_names: BaseAttributeName[] = ["href", "target", ...common_attribute_names];

export type BdiAttributeName = CommonAttributeName;
export type BdiAttribute = AttributeType<CommonAttributeName>;
export const bdi_attribute_names: BdiAttributeName[] = common_attribute_names;

export type BdoAttributeName = CommonAttributeName;
export type BdoAttribute = AttributeType<CommonAttributeName>;
export const bdo_attribute_names: BdoAttributeName[] = common_attribute_names;

export type BlockquoteAttributeName = "cite" | CommonAttributeName;
export type BlockquoteAttribute = AttributeType<BlockquoteAttributeName>;
export const blockquote_attribute_names: BlockquoteAttributeName[] = ["cite", ...common_attribute_names];

export type BodyAttributeName = "background" | "bgcolor" | CommonAttributeName;
export type BodyAttribute = AttributeType<BodyAttributeName>;
export const body_attribute_names: BodyAttributeName[] = ["background", "bgcolor", ...common_attribute_names];

export type BrAttributeName = CommonAttributeName;
export type BrAttribute = AttributeType<CommonAttributeName>;
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
export type ButtonAttribute = AttributeType<ButtonAttributeName>;
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
export type CanvasAttribute = AttributeType<CanvasAttributeName>;
export const canvas_attribute_names: CanvasAttributeName[] = ["height", "width", ...common_attribute_names];

export type CaptionAttributeName = CommonAttributeName;
export type CaptionAttribute = AttributeType<CommonAttributeName>;
export const caption_attribute_names: CaptionAttributeName[] = common_attribute_names;

export type CiteAttributeName = CommonAttributeName;
export type CiteAttribute = AttributeType<CommonAttributeName>;
export const cite_attribute_names: CiteAttributeName[] = common_attribute_names;

export type CodeAttributeName = CommonAttributeName;
export type CodeAttribute = AttributeType<CommonAttributeName>;
export const code_attribute_names: CodeAttributeName[] = common_attribute_names;

export type ColAttributeName = "bgcolor" | "span" | CommonAttributeName;
export type ColAttribute = AttributeType<ColAttributeName>;
export const col_attribute_names: ColAttributeName[] = ["bgcolor", "span", ...common_attribute_names];

export type ColgroupAttributeName = "bgcolor" | "span" | CommonAttributeName;
export type ColgroupAttribute = AttributeType<ColgroupAttributeName>;
export const colgroup_attribute_names: ColgroupAttributeName[] = ["bgcolor", "span", ...common_attribute_names];

export type DataAttributeName = "value" | CommonAttributeName;
export type DataAttribute = AttributeType<DataAttributeName>;
export const data_attribute_names: DataAttributeName[] = ["value", ...common_attribute_names];

export type DatalistAttributeName = CommonAttributeName;
export type DatalistAttribute = AttributeType<CommonAttributeName>;
export const datalist_attribute_names: DatalistAttributeName[] = common_attribute_names;

export type DdAttributeName = CommonAttributeName;
export type DdAttribute = AttributeType<CommonAttributeName>;
export const dd_attribute_names: DdAttributeName[] = common_attribute_names;

export type DelAttributeName = "cite" | "datetime" | CommonAttributeName;
export type DelAttribute = AttributeType<DelAttributeName>;
export const del_attribute_names: DelAttributeName[] = ["cite", "datetime", ...common_attribute_names];

export type DetailsAttributeName = "open" | CommonAttributeName;
export type DetailsAttribute = AttributeType<DetailsAttributeName>;
export const details_attribute_names: DetailsAttributeName[] = ["open", ...common_attribute_names];

export type DfnAttributeName = CommonAttributeName;
export type DfnAttribute = AttributeType<CommonAttributeName>;
export const dfn_attribute_names: DfnAttributeName[] = common_attribute_names;

export type DialogAttributeName = "open" | CommonAttributeName;
export type DialogAttribute = AttributeType<DialogAttributeName>;
export const dialog_attribute_names: DialogAttributeName[] = ["open", ...common_attribute_names];

export type DivAttributeName = CommonAttributeName;
export type DivAttribute = AttributeType<CommonAttributeName>;
export const div_attribute_names: DivAttributeName[] = common_attribute_names;

export type DlAttributeName = CommonAttributeName;
export type DlAttribute = AttributeType<CommonAttributeName>;
export const dl_attribute_names: DlAttributeName[] = common_attribute_names;

export type DtAttributeName = CommonAttributeName;
export type DtAttribute = AttributeType<CommonAttributeName>;
export const dt_attribute_names: DtAttributeName[] = common_attribute_names;

export type EmAttributeName = CommonAttributeName;
export type EmAttribute = AttributeType<CommonAttributeName>;
export const em_attribute_names: EmAttributeName[] = common_attribute_names;

export type EmbedAttributeName = "height" | "src" | "type" | "width" | CommonAttributeName;
export type EmbedAttribute = AttributeType<EmbedAttributeName>;
export const embed_attribute_names: EmbedAttributeName[] = [
    "height",
    "src",
    "type",
    "width",
    ...common_attribute_names,
];

export type FieldsetAttributeName = "disabled" | "form" | "name" | CommonAttributeName;
export type FieldsetAttribute = AttributeType<FieldsetAttributeName>;
export const fieldset_attribute_names: FieldsetAttributeName[] = [
    "disabled",
    "form",
    "name",
    ...common_attribute_names,
];

export type FigcaptionAttributeName = CommonAttributeName;
export type FigcaptionAttribute = AttributeType<CommonAttributeName>;
export const figcaption_attribute_names: FigcaptionAttributeName[] = common_attribute_names;

export type FigureAttributeName = CommonAttributeName;
export type FigureAttribute = AttributeType<CommonAttributeName>;
export const figure_attribute_names: FigureAttributeName[] = common_attribute_names;

export type FontAttributeName = "color" | CommonAttributeName;
export type FontAttribute = AttributeType<FontAttributeName>;
export const font_attribute_names: FontAttributeName[] = ["color", ...common_attribute_names];

export type FooterAttributeName = CommonAttributeName;
export type FooterAttribute = AttributeType<CommonAttributeName>;
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
export type FormAttribute = AttributeType<FormAttributeName>;
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
export type H1Attribute = AttributeType<CommonAttributeName>;
export const h1_attribute_names: H1AttributeName[] = common_attribute_names;

export type H2AttributeName = CommonAttributeName;
export type H2Attribute = AttributeType<CommonAttributeName>;
export const h2_attribute_names: H2AttributeName[] = common_attribute_names;

export type H3AttributeName = CommonAttributeName;
export type H3Attribute = AttributeType<CommonAttributeName>;
export const h3_attribute_names: H3AttributeName[] = common_attribute_names;

export type H4AttributeName = CommonAttributeName;
export type H4Attribute = AttributeType<CommonAttributeName>;
export const h4_attribute_names: H4AttributeName[] = common_attribute_names;

export type H5AttributeName = CommonAttributeName;
export type H5Attribute = AttributeType<CommonAttributeName>;
export const h5_attribute_names: H5AttributeName[] = common_attribute_names;

export type H6AttributeName = CommonAttributeName;
export type H6Attribute = AttributeType<CommonAttributeName>;
export const h6_attribute_names: H6AttributeName[] = common_attribute_names;

export type HeadAttributeName = CommonAttributeName;
export type HeadAttribute = AttributeType<CommonAttributeName>;
export const head_attribute_names: HeadAttributeName[] = common_attribute_names;

export type HeaderAttributeName = CommonAttributeName;
export type HeaderAttribute = AttributeType<CommonAttributeName>;
export const header_attribute_names: HeaderAttributeName[] = common_attribute_names;

export type HgroupAttributeName = CommonAttributeName;
export type HgroupAttribute = AttributeType<CommonAttributeName>;
export const hgroup_attribute_names: HgroupAttributeName[] = common_attribute_names;

export type HrAttributeName = "color" | CommonAttributeName;
export type HrAttribute = AttributeType<HrAttributeName>;
export const hr_attribute_names: HrAttributeName[] = ["color", ...common_attribute_names];

export type HtmlAttributeName = CommonAttributeName;
export type HtmlAttribute = AttributeType<CommonAttributeName>;
export const html_attribute_names: HtmlAttributeName[] = common_attribute_names;

export type IAttributeName = CommonAttributeName;
export type IAttribute = AttributeType<CommonAttributeName>;
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
export type IframeAttribute = AttributeType<IframeAttributeName>;
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
export type ImgAttribute = AttributeType<ImgAttributeName>;
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
export type InputAttribute = AttributeType<InputAttributeName>;
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
export type InsAttribute = AttributeType<InsAttributeName>;
export const ins_attribute_names: InsAttributeName[] = ["cite", "datetime", ...common_attribute_names];

export type KbdAttributeName = CommonAttributeName;
export type KbdAttribute = AttributeType<CommonAttributeName>;
export const kbd_attribute_names: KbdAttributeName[] = common_attribute_names;

export type LabelAttributeName = "for" | "form" | CommonAttributeName;
export type LabelAttribute = AttributeType<LabelAttributeName>;
export const label_attribute_names: LabelAttributeName[] = ["for", "form", ...common_attribute_names];

export type LegendAttributeName = CommonAttributeName;
export type LegendAttribute = AttributeType<CommonAttributeName>;
export const legend_attribute_names: LegendAttributeName[] = common_attribute_names;

export type LiAttributeName = "value" | CommonAttributeName;
export type LiAttribute = AttributeType<LiAttributeName>;
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
export type LinkAttribute = AttributeType<LinkAttributeName>;
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
export type MainAttribute = AttributeType<CommonAttributeName>;
export const main_attribute_names: MainAttributeName[] = common_attribute_names;

export type MapAttributeName = "name" | CommonAttributeName;
export type MapAttribute = AttributeType<MapAttributeName>;
export const map_attribute_names: MapAttributeName[] = ["name", ...common_attribute_names];

export type MarkAttributeName = CommonAttributeName;
export type MarkAttribute = AttributeType<CommonAttributeName>;
export const mark_attribute_names: MarkAttributeName[] = common_attribute_names;

export type MarqueeAttributeName = "bgcolor" | "loop" | CommonAttributeName;
export type MarqueeAttribute = AttributeType<MarqueeAttributeName>;
export const marquee_attribute_names: MarqueeAttributeName[] = ["bgcolor", "loop", ...common_attribute_names];

export type MenuAttributeName = "type" | CommonAttributeName;
export type MenuAttribute = AttributeType<MenuAttributeName>;
export const menu_attribute_names: MenuAttributeName[] = ["type", ...common_attribute_names];

export type MetaAttributeName = "charset" | "content" | "http_equiv" | "http-equiv" | "name" | CommonAttributeName;
export type MetaAttribute = AttributeType<MetaAttributeName>;
export const meta_attribute_names: MetaAttributeName[] = [
    "charset",
    "content",
    "http_equiv",
    "http-equiv",
    "name",
    ...common_attribute_names,
];

export type MeterAttributeName = "form" | "high" | "low" | "max" | "min" | "optimum" | "value" | CommonAttributeName;
export type MeterAttribute = AttributeType<MeterAttributeName>;
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
export type NavAttribute = AttributeType<CommonAttributeName>;
export const nav_attribute_names: NavAttributeName[] = common_attribute_names;

export type NoscriptAttributeName = CommonAttributeName;
export type NoscriptAttribute = AttributeType<CommonAttributeName>;
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
export type ObjectAttribute = AttributeType<ObjectAttributeName>;
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
export type OlAttribute = AttributeType<OlAttributeName>;
export const ol_attribute_names: OlAttributeName[] = ["reversed", "start", "type", ...common_attribute_names];

export type OptgroupAttributeName = "disabled" | "label" | CommonAttributeName;
export type OptgroupAttribute = AttributeType<OptgroupAttributeName>;
export const optgroup_attribute_names: OptgroupAttributeName[] = ["disabled", "label", ...common_attribute_names];

export type OptionAttributeName = "disabled" | "label" | "selected" | "value" | CommonAttributeName;
export type OptionAttribute = AttributeType<OptionAttributeName>;
export const option_attribute_names: OptionAttributeName[] = [
    "disabled",
    "label",
    "selected",
    "value",
    ...common_attribute_names,
];

export type OutputAttributeName = "for" | "form" | "name" | CommonAttributeName;
export type OutputAttribute = AttributeType<OutputAttributeName>;
export const output_attribute_names: OutputAttributeName[] = ["for", "form", "name", ...common_attribute_names];

export type PAttributeName = CommonAttributeName;
export type PAttribute = AttributeType<CommonAttributeName>;
export const p_attribute_names: PAttributeName[] = common_attribute_names;

export type ParamAttributeName = "name" | "value" | CommonAttributeName;
export type ParamAttribute = AttributeType<ParamAttributeName>;
export const param_attribute_names: ParamAttributeName[] = ["name", "value", ...common_attribute_names];

export type PictureAttributeName = CommonAttributeName;
export type PictureAttribute = AttributeType<CommonAttributeName>;
export const picture_attribute_names: PictureAttributeName[] = common_attribute_names;

export type PreAttributeName = CommonAttributeName;
export type PreAttribute = AttributeType<CommonAttributeName>;
export const pre_attribute_names: PreAttributeName[] = common_attribute_names;

export type ProgressAttributeName = "form" | "max" | "value" | CommonAttributeName;
export type ProgressAttribute = AttributeType<ProgressAttributeName>;
export const progress_attribute_names: ProgressAttributeName[] = ["form", "max", "value", ...common_attribute_names];

export type QAttributeName = "cite" | CommonAttributeName;
export type QAttribute = AttributeType<QAttributeName>;
export const q_attribute_names: QAttributeName[] = ["cite", ...common_attribute_names];

export type RpAttributeName = CommonAttributeName;
export type RpAttribute = AttributeType<CommonAttributeName>;
export const rp_attribute_names: RpAttributeName[] = common_attribute_names;

export type RtAttributeName = CommonAttributeName;
export type RtAttribute = AttributeType<CommonAttributeName>;
export const rt_attribute_names: RtAttributeName[] = common_attribute_names;

export type RubyAttributeName = CommonAttributeName;
export type RubyAttribute = AttributeType<CommonAttributeName>;
export const ruby_attribute_names: RubyAttributeName[] = common_attribute_names;

export type SAttributeName = CommonAttributeName;
export type SAttribute = AttributeType<CommonAttributeName>;
export const s_attribute_names: SAttributeName[] = common_attribute_names;

export type SampAttributeName = CommonAttributeName;
export type SampAttribute = AttributeType<CommonAttributeName>;
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
export type ScriptAttribute = AttributeType<ScriptAttributeName>;
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
export type SectionAttribute = AttributeType<CommonAttributeName>;
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
export type SelectAttribute = AttributeType<SelectAttributeName>;
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
export type SmallAttribute = AttributeType<CommonAttributeName>;
export const small_attribute_names: SmallAttributeName[] = common_attribute_names;

export type SourceAttributeName = "media" | "sizes" | "src" | "srcset" | "type" | CommonAttributeName;
export type SourceAttribute = AttributeType<SourceAttributeName>;
export const source_attribute_names: SourceAttributeName[] = [
    "media",
    "sizes",
    "src",
    "srcset",
    "type",
    ...common_attribute_names,
];

export type SpanAttributeName = CommonAttributeName;
export type SpanAttribute = AttributeType<CommonAttributeName>;
export const span_attribute_names: SpanAttributeName[] = common_attribute_names;

export type StrongAttributeName = CommonAttributeName;
export type StrongAttribute = AttributeType<CommonAttributeName>;
export const strong_attribute_names: StrongAttributeName[] = common_attribute_names;

export type SubAttributeName = CommonAttributeName;
export type SubAttribute = AttributeType<CommonAttributeName>;
export const sub_attribute_names: SubAttributeName[] = common_attribute_names;

export type SummaryAttributeName = CommonAttributeName;
export type SummaryAttribute = AttributeType<CommonAttributeName>;
export const summary_attribute_names: SummaryAttributeName[] = common_attribute_names;

export type SupAttributeName = CommonAttributeName;
export type SupAttribute = AttributeType<CommonAttributeName>;
export const sup_attribute_names: SupAttributeName[] = common_attribute_names;

export type TableAttributeName = "background" | "bgcolor" | "border" | CommonAttributeName;
export type TableAttribute = AttributeType<TableAttributeName>;
export const table_attribute_names: TableAttributeName[] = [
    "background",
    "bgcolor",
    "border",
    ...common_attribute_names,
];

export type TbodyAttributeName = "bgcolor" | CommonAttributeName;
export type TbodyAttribute = AttributeType<TbodyAttributeName>;
export const tbody_attribute_names: TbodyAttributeName[] = ["bgcolor", ...common_attribute_names];

export type TdAttributeName = "background" | "bgcolor" | "colspan" | "headers" | "rowspan" | CommonAttributeName;
export type TdAttribute = AttributeType<TdAttributeName>;
export const td_attribute_names: TdAttributeName[] = [
    "background",
    "bgcolor",
    "colspan",
    "headers",
    "rowspan",
    ...common_attribute_names,
];

export type TemplateAttributeName = CommonAttributeName;
export type TemplateAttribute = AttributeType<CommonAttributeName>;
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
export type TextareaAttribute = AttributeType<TextareaAttributeName>;
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
export type TfootAttribute = AttributeType<TfootAttributeName>;
export const tfoot_attribute_names: TfootAttributeName[] = ["bgcolor", ...common_attribute_names];

export type ThAttributeName =
    | "background"
    | "bgcolor"
    | "colspan"
    | "headers"
    | "rowspan"
    | "scope"
    | CommonAttributeName;
export type ThAttribute = AttributeType<ThAttributeName>;
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
export type TheadAttribute = AttributeType<CommonAttributeName>;
export const thead_attribute_names: TheadAttributeName[] = common_attribute_names;

export type TimeAttributeName = "datetime" | CommonAttributeName;
export type TimeAttribute = AttributeType<TimeAttributeName>;
export const time_attribute_names: TimeAttributeName[] = ["datetime", ...common_attribute_names];

export type TitleAttributeName = CommonAttributeName;
export type TitleAttribute = AttributeType<CommonAttributeName>;
export const title_attribute_names: TitleAttributeName[] = common_attribute_names;

export type TrAttributeName = "bgcolor" | CommonAttributeName;
export type TrAttribute = AttributeType<TrAttributeName>;
export const tr_attribute_names: TrAttributeName[] = ["bgcolor", ...common_attribute_names];

export type TrackAttributeName = "default" | "kind" | "label" | "src" | "srclang" | CommonAttributeName;
export type TrackAttribute = AttributeType<TrackAttributeName>;
export const track_attribute_names: TrackAttributeName[] = [
    "default",
    "kind",
    "label",
    "src",
    "srclang",
    ...common_attribute_names,
];

export type UAttributeName = CommonAttributeName;
export type UAttribute = AttributeType<CommonAttributeName>;
export const u_attribute_names: UAttributeName[] = common_attribute_names;

export type UlAttributeName = CommonAttributeName;
export type UlAttribute = AttributeType<CommonAttributeName>;
export const ul_attribute_names: UlAttributeName[] = common_attribute_names;

export type VarAttributeName = CommonAttributeName;
export type VarAttribute = AttributeType<CommonAttributeName>;
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
export type VideoAttribute = AttributeType<VideoAttributeName>;
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
export type WbrAttribute = AttributeType<CommonAttributeName>;
export const wbr_attribute_names: WbrAttributeName[] = common_attribute_names;

export function printDefine() {
    function capitalize(t: string) {
        return `${t.slice(0, 1).toUpperCase()}${t.slice(1)}`;
    }
    console.log("export type AttributeMap = {");
    for (const tag of tags) {
        console.log(`\t${tag}: ${capitalize(tag)}Attribute;`);
    }
    console.log("};");

    for (const tag of tags) {
        console.log(`export const ${capitalize(tag)} = gt("${tag}");`);
    }
}

function gt<K extends Tag | HanabiTag>(tag: K): HComponentFn<Partial<AttributeMap[K & keyof AttributeMap]>> {
    return {
        [tag]:
            (argument: Partial<AttributeMap[K & keyof AttributeMap]>) =>
            (...child: HNode[]) => ({ element_name: tag, tag, attribute: argument, child }),
    }[tag] as HComponentFn<Partial<AttributeMap[K & keyof AttributeMap]>>;
}

export type AttributeMap = {
    a: AAttribute;
    abbr: AbbrAttribute;
    address: AddressAttribute;
    area: AreaAttribute;
    article: ArticleAttribute;
    aside: AsideAttribute;
    audio: AudioAttribute;
    b: BAttribute;
    base: BaseAttribute;
    bdi: BdiAttribute;
    bdo: BdoAttribute;
    blockquote: BlockquoteAttribute;
    body: BodyAttribute;
    br: BrAttribute;
    button: ButtonAttribute;
    canvas: CanvasAttribute;
    caption: CaptionAttribute;
    cite: CiteAttribute;
    code: CodeAttribute;
    col: ColAttribute;
    colgroup: ColgroupAttribute;
    data: DataAttribute;
    datalist: DatalistAttribute;
    dd: DdAttribute;
    del: DelAttribute;
    details: DetailsAttribute;
    dfn: DfnAttribute;
    dialog: DialogAttribute;
    div: DivAttribute;
    dl: DlAttribute;
    dt: DtAttribute;
    em: EmAttribute;
    embed: EmbedAttribute;
    fieldset: FieldsetAttribute;
    figcaption: FigcaptionAttribute;
    figure: FigureAttribute;
    footer: FooterAttribute;
    form: FormAttribute;
    h1: H1Attribute;
    h2: H2Attribute;
    h3: H3Attribute;
    h4: H4Attribute;
    h5: H5Attribute;
    h6: H6Attribute;
    head: HeadAttribute;
    header: HeaderAttribute;
    hgroup: HgroupAttribute;
    hr: HrAttribute;
    html: HtmlAttribute;
    i: IAttribute;
    iframe: IframeAttribute;
    img: ImgAttribute;
    input: InputAttribute;
    ins: InsAttribute;
    kbd: KbdAttribute;
    label: LabelAttribute;
    legend: LegendAttribute;
    li: LiAttribute;
    link: LinkAttribute;
    main: MainAttribute;
    map: MapAttribute;
    mark: MarkAttribute;
    meta: MetaAttribute;
    meter: MeterAttribute;
    nav: NavAttribute;
    noscript: NoscriptAttribute;
    object: ObjectAttribute;
    ol: OlAttribute;
    optgroup: OptgroupAttribute;
    option: OptionAttribute;
    output: OutputAttribute;
    p: PAttribute;
    param: ParamAttribute;
    picture: PictureAttribute;
    pre: PreAttribute;
    progress: ProgressAttribute;
    q: QAttribute;
    rp: RpAttribute;
    rt: RtAttribute;
    ruby: RubyAttribute;
    s: SAttribute;
    samp: SampAttribute;
    script: ScriptAttribute;
    section: SectionAttribute;
    select: SelectAttribute;
    small: SmallAttribute;
    source: SourceAttribute;
    span: SpanAttribute;
    strong: StrongAttribute;
    sub: SubAttribute;
    summary: SummaryAttribute;
    sup: SupAttribute;
    table: TableAttribute;
    tbody: TbodyAttribute;
    td: TdAttribute;
    template: TemplateAttribute;
    textarea: TextareaAttribute;
    tfoot: TfootAttribute;
    th: ThAttribute;
    thead: TheadAttribute;
    time: TimeAttribute;
    title: TitleAttribute;
    tr: TrAttribute;
    track: TrackAttribute;
    u: UAttribute;
    ul: UlAttribute;
    var: VarAttribute;
    video: VideoAttribute;
    wbr: WbrAttribute;
    
    unwrap: DivAttribute;
    raw: DivAttribute;
};

export const A = gt("a");
export const Abbr = gt("abbr");
export const Address = gt("address");
export const Area = gt("area");
export const Article = gt("article");
export const Aside = gt("aside");
export const Audio = gt("audio");
export const B = gt("b");
export const Base = gt("base");
export const Bdi = gt("bdi");
export const Bdo = gt("bdo");
export const Blockquote = gt("blockquote");
export const Body = gt("body");
export const Br = gt("br");
export const Button = gt("button");
export const Canvas = gt("canvas");
export const Caption = gt("caption");
export const Cite = gt("cite");
export const Code = gt("code");
export const Col = gt("col");
export const Colgroup = gt("colgroup");
export const Data = gt("data");
export const Datalist = gt("datalist");
export const Dd = gt("dd");
export const Del = gt("del");
export const Details = gt("details");
export const Dfn = gt("dfn");
export const Dialog = gt("dialog");
export const Div = gt("div");
export const Dl = gt("dl");
export const Dt = gt("dt");
export const Em = gt("em");
export const Embed = gt("embed");
export const Fieldset = gt("fieldset");
export const Figcaption = gt("figcaption");
export const Figure = gt("figure");
export const Footer = gt("footer");
export const Form = gt("form");
export const H1 = gt("h1");
export const H2 = gt("h2");
export const H3 = gt("h3");
export const H4 = gt("h4");
export const H5 = gt("h5");
export const H6 = gt("h6");
export const Head = gt("head");
export const Header = gt("header");
export const Hgroup = gt("hgroup");
export const Hr = gt("hr");
export const Html = gt("html");
export const I = gt("i");
export const Iframe = gt("iframe");
export const Img = gt("img");
export const Input = gt("input");
export const Ins = gt("ins");
export const Kbd = gt("kbd");
export const Label = gt("label");
export const Legend = gt("legend");
export const Li = gt("li");
export const Link = gt("link");
export const Main = gt("main");
export const Map_ = gt("map");
export const Mark = gt("mark");
export const Meta = gt("meta");
export const Meter = gt("meter");
export const Nav = gt("nav");
export const Noscript = gt("noscript");
export const Object_ = gt("object");
export const Ol = gt("ol");
export const Optgroup = gt("optgroup");
export const Option = gt("option");
export const Output = gt("output");
export const P = gt("p");
export const Param = gt("param");
export const Picture = gt("picture");
export const Pre = gt("pre");
export const Progress = gt("progress");
export const Q = gt("q");
export const Rp = gt("rp");
export const Rt = gt("rt");
export const Ruby = gt("ruby");
export const S = gt("s");
export const Samp = gt("samp");
export const Script = gt("script");
export const Section = gt("section");
export const Select = gt("select");
export const Small = gt("small");
export const Source = gt("source");
export const Span = gt("span");
export const Strong = gt("strong");
export const Sub = gt("sub");
export const Summary = gt("summary");
export const Sup = gt("sup");
export const Table = gt("table");
export const Tbody = gt("tbody");
export const Td = gt("td");
export const Template = gt("template");
export const Textarea = gt("textarea");
export const Tfoot = gt("tfoot");
export const Th = gt("th");
export const Thead = gt("thead");
export const Time = gt("time");
export const Title = gt("title");
export const Tr = gt("tr");
export const Track = gt("track");
export const U = gt("u");
export const Ul = gt("ul");
export const Var = gt("var");
export const Video = gt("video");
export const Wbr = gt("wbr");

export const Unwrap = gt("unwrap");
export const RawHTML = gt("raw");
