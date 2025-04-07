import type { AttributeOf, HElementFn, HNode } from "./component";

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

export type HanabiTag = "raw" | "unwrap" | "class";

export const hanabi_tags: HanabiTag[] = ["raw", "unwrap", "class"] as const;

// HTML要素の共通属性
export type GlobalAttributes = {
    accesskey: string;
    autocapitalize: "off" | "none" | "on" | "sentences" | "words" | "characters";
    autofocus: null;
    class: string | string[];
    contenteditable: "true" | "false" | "";
    dir: "ltr" | "rtl" | "auto";
    draggable: "true" | "false";
    enterkeyhint: "enter" | "done" | "go" | "next" | "previous" | "search" | "send";
    hidden: null | "hidden" | "until-found";
    id: string;
    inert: null;
    inputmode: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
    is: string;
    itemid: string;
    itemprop: string | string[];
    itemref: string | string[];
    itemscope: null;
    itemtype: string | string[];
    lang: string;
    nonce: string;
    part: string | string[];
    popover: null;
    slot: string;
    spellcheck: "true" | "false";
    tabindex: string;
    title: string;
    translate: "yes" | "no";
    // biome-ignore lint: using any.
    children: any;
    // biome-ignore lint: using any.
    key: any;
};

// グローバル属性の名前のユニオン型
export type GlobalAttributeNames =
    | "accesskey"
    | "autocapitalize"
    | "autofocus"
    | "class"
    | "contenteditable"
    | "dir"
    | "draggable"
    | "enterkeyhint"
    | "hidden"
    | "id"
    | "inert"
    | "inputmode"
    | "is"
    | "itemid"
    | "itemprop"
    | "itemref"
    | "itemscope"
    | "itemtype"
    | "lang"
    | "nonce"
    | "part"
    | "popover"
    | "slot"
    | "spellcheck"
    | "tabindex"
    | "title"
    | "translate";

// 全ての属性名のユニオン型
export type AttributeNames =
    | GlobalAttributeNames
    | "abbr"
    | "accept"
    | "acceptcharset"
    | "action"
    | "allow"
    | "allowfullscreen"
    | "alt"
    | "as"
    | "async"
    | "attributionsrc"
    | "autocomplete"
    | "autoplay"
    | "capture"
    | "charset"
    | "checked"
    | "cite"
    | "cols"
    | "colspan"
    | "content"
    | "controls"
    | "coords"
    | "crossorigin"
    | "data"
    | "datetime"
    | "decoding"
    | "default"
    | "defer"
    | "dirname"
    | "disabled"
    | "disablepictureinpicture"
    | "disableremoteplayback"
    | "download"
    | "enctype"
    | "fetchpriority"
    | "for"
    | "form"
    | "formaction"
    | "formenctype"
    | "formmethod"
    | "formnovalidate"
    | "formtarget"
    | "headers"
    | "height"
    | "high"
    | "href"
    | "hreflang"
    | "http-equiv"
    | "http_equiv"
    | "imagesizes"
    | "imagesrcset"
    | "integrity"
    | "ismap"
    | "kind"
    | "label"
    | "list"
    | "loading"
    | "loop"
    | "low"
    | "max"
    | "maxlength"
    | "media"
    | "method"
    | "min"
    | "minlength"
    | "multiple"
    | "muted"
    | "name"
    | "nomodule"
    | "novalidate"
    | "open"
    | "optimum"
    | "pattern"
    | "ping"
    | "placeholder"
    | "playsinline"
    | "popovertarget"
    | "popovertargetaction"
    | "poster"
    | "preload"
    | "readonly"
    | "referrerpolicy"
    | "rel"
    | "required"
    | "reversed"
    | "rows"
    | "rowspan"
    | "sandbox"
    | "scope"
    | "selected"
    | "shadowrootmode"
    | "shape"
    | "size"
    | "sizes"
    | "span"
    | "src"
    | "srcdoc"
    | "srclang"
    | "srcset"
    | "start"
    | "step"
    | "target"
    | "type"
    | "usemap"
    | "value"
    | "width"
    | "wrap"
    | "xmlns"
    | `data-${string}`;

export const attribute_names: AttributeNames[] = [
    "accesskey",
    "autocapitalize",
    "autofocus",
    "class",
    "contenteditable",
    "dir",
    "draggable",
    "enterkeyhint",
    "hidden",
    "id",
    "inert",
    "inputmode",
    "is",
    "itemid",
    "itemprop",
    "itemref",
    "itemscope",
    "itemtype",
    "lang",
    "nonce",
    "part",
    "popover",
    "slot",
    "spellcheck",
    "tabindex",
    "title",
    "translate",
    "abbr",
    "accept",
    "acceptcharset",
    "action",
    "allow",
    "allowfullscreen",
    "alt",
    "as",
    "async",
    "attributionsrc",
    "autocomplete",
    "autoplay",
    "capture",
    "charset",
    "checked",
    "cite",
    "cols",
    "colspan",
    "content",
    "controls",
    "coords",
    "crossorigin",
    "data",
    "datetime",
    "decoding",
    "default",
    "defer",
    "dirname",
    "disabled",
    "disablepictureinpicture",
    "disableremoteplayback",
    "download",
    "enctype",
    "fetchpriority",
    "for",
    "form",
    "formaction",
    "formenctype",
    "formmethod",
    "formnovalidate",
    "formtarget",
    "headers",
    "height",
    "high",
    "href",
    "hreflang",
    "http-equiv",
    "http_equiv",
    "imagesizes",
    "imagesrcset",
    "integrity",
    "ismap",
    "kind",
    "label",
    "list",
    "loading",
    "loop",
    "low",
    "max",
    "maxlength",
    "media",
    "method",
    "min",
    "minlength",
    "multiple",
    "muted",
    "name",
    "nomodule",
    "novalidate",
    "open",
    "optimum",
    "pattern",
    "ping",
    "placeholder",
    "playsinline",
    "popovertarget",
    "popovertargetaction",
    "poster",
    "preload",
    "readonly",
    "referrerpolicy",
    "rel",
    "required",
    "reversed",
    "rows",
    "rowspan",
    "sandbox",
    "scope",
    "selected",
    "shadowrootmode",
    "shape",
    "size",
    "sizes",
    "span",
    "src",
    "srcdoc",
    "srclang",
    "srcset",
    "start",
    "step",
    "target",
    "type",
    "usemap",
    "value",
    "width",
    "wrap",
    "xmlns",
] as const;

// AttributeType型定義
// type AttributeType<T, K extends string> = T & Record<Exclude<AttributeNames, K | GlobalAttributeNames>, undefined>;
type AttributeType<T, _K extends string> = T;

// HTML要素ごとの属性型定義
export type AAttributeBase = {
    attributionsrc: string | string[];
    download: string | null;
    href: string;
    hreflang: string;
    ping: string | string[];
    referrerpolicy:
        | "no-referrer"
        | "no-referrer-when-downgrade"
        | "origin"
        | "origin-when-cross-origin"
        | "same-origin"
        | "strict-origin"
        | "strict-origin-when-cross-origin"
        | "unsafe-url";
    rel: string | string[];
    target: string;
    type: string;
} & GlobalAttributes;

export type AAttributeNames =
    | GlobalAttributeNames
    | "attributionsrc"
    | "download"
    | "href"
    | "hreflang"
    | "ping"
    | "referrerpolicy"
    | "rel"
    | "target"
    | "type";

export type AAttribute = AttributeType<AAttributeBase, AAttributeNames>;

export type AbbrAttributeBase = GlobalAttributes;

export type AbbrAttributeNames = GlobalAttributeNames;

export type AbbrAttribute = AttributeType<AbbrAttributeBase, AbbrAttributeNames>;

export type AddressAttributeBase = GlobalAttributes;

export type AddressAttributeNames = GlobalAttributeNames;

export type AddressAttribute = AttributeType<AddressAttributeBase, AddressAttributeNames>;

export type AreaAttributeBase = {
    alt: string;
    coords: string;
    download: string | null;
    href: string;
    hreflang: string;
    ping: string | string[];
    referrerpolicy:
        | "no-referrer"
        | "no-referrer-when-downgrade"
        | "origin"
        | "origin-when-cross-origin"
        | "same-origin"
        | "strict-origin"
        | "strict-origin-when-cross-origin"
        | "unsafe-url";
    rel: string | string[];
    shape: "rect" | "circle" | "poly" | "default";
    target: string;
} & GlobalAttributes;

export type AreaAttributeNames =
    | GlobalAttributeNames
    | "alt"
    | "coords"
    | "download"
    | "href"
    | "hreflang"
    | "ping"
    | "referrerpolicy"
    | "rel"
    | "shape"
    | "target";

export type AreaAttribute = AttributeType<AreaAttributeBase, AreaAttributeNames>;

export type ArticleAttributeBase = GlobalAttributes;

export type ArticleAttributeNames = GlobalAttributeNames;

export type ArticleAttribute = AttributeType<ArticleAttributeBase, ArticleAttributeNames>;

export type AsideAttributeBase = GlobalAttributes;

export type AsideAttributeNames = GlobalAttributeNames;

export type AsideAttribute = AttributeType<AsideAttributeBase, AsideAttributeNames>;

export type AudioAttributeBase = {
    autoplay: null;
    controls: null;
    crossorigin: "anonymous" | "use-credentials";
    disableremoteplayback: null;
    loop: null;
    muted: null;
    preload: "none" | "metadata" | "auto" | "";
    src: string;
} & GlobalAttributes;

export type AudioAttributeNames =
    | GlobalAttributeNames
    | "autoplay"
    | "controls"
    | "crossorigin"
    | "disableremoteplayback"
    | "loop"
    | "muted"
    | "preload"
    | "src";

export type AudioAttribute = AttributeType<AudioAttributeBase, AudioAttributeNames>;

export type BAttributeBase = GlobalAttributes;

export type BAttributeNames = GlobalAttributeNames;

export type BAttribute = AttributeType<BAttributeBase, BAttributeNames>;

export type BaseAttributeBase = {
    href: string;
    target: string;
} & GlobalAttributes;

export type BaseAttributeNames = GlobalAttributeNames | "href" | "target";

export type BaseAttribute = AttributeType<BaseAttributeBase, BaseAttributeNames>;

export type BdiAttributeBase = GlobalAttributes;

export type BdiAttributeNames = GlobalAttributeNames;

export type BdiAttribute = AttributeType<BdiAttributeBase, BdiAttributeNames>;

export type BdoAttributeBase = {
    dir: "ltr" | "rtl";
} & GlobalAttributes;

export type BdoAttributeNames = GlobalAttributeNames | "dir";

export type BdoAttribute = AttributeType<BdoAttributeBase, BdoAttributeNames>;

export type BlockquoteAttributeBase = {
    cite: string;
} & GlobalAttributes;

export type BlockquoteAttributeNames = GlobalAttributeNames | "cite";

export type BlockquoteAttribute = AttributeType<BlockquoteAttributeBase, BlockquoteAttributeNames>;

export type BodyAttributeBase = GlobalAttributes;

export type BodyAttributeNames = GlobalAttributeNames;

export type BodyAttribute = AttributeType<BodyAttributeBase, BodyAttributeNames>;

export type BrAttributeBase = GlobalAttributes;

export type BrAttributeNames = GlobalAttributeNames;

export type BrAttribute = AttributeType<BrAttributeBase, BrAttributeNames>;

export type ButtonAttributeBase = {
    disabled: null;
    form: string;
    formaction: string;
    formenctype: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
    formmethod: "post" | "get" | "dialog";
    formnovalidate: null;
    formtarget: string;
    name: string;
    popovertarget: string;
    popovertargetaction: "toggle" | "show" | "hide";
    type: "submit" | "reset" | "button";
    value: string;
} & GlobalAttributes;

export type ButtonAttributeNames =
    | GlobalAttributeNames
    | "disabled"
    | "form"
    | "formaction"
    | "formenctype"
    | "formmethod"
    | "formnovalidate"
    | "formtarget"
    | "name"
    | "popovertarget"
    | "popovertargetaction"
    | "type"
    | "value";

export type ButtonAttribute = AttributeType<ButtonAttributeBase, ButtonAttributeNames>;

export type CanvasAttributeBase = {
    height: string;
    width: string;
} & GlobalAttributes;

export type CanvasAttributeNames = GlobalAttributeNames | "height" | "width";

export type CanvasAttribute = AttributeType<CanvasAttributeBase, CanvasAttributeNames>;

export type CaptionAttributeBase = GlobalAttributes;

export type CaptionAttributeNames = GlobalAttributeNames;

export type CaptionAttribute = AttributeType<CaptionAttributeBase, CaptionAttributeNames>;

export type CiteAttributeBase = GlobalAttributes;

export type CiteAttributeNames = GlobalAttributeNames;

export type CiteAttribute = AttributeType<CiteAttributeBase, CiteAttributeNames>;

export type CodeAttributeBase = GlobalAttributes;

export type CodeAttributeNames = GlobalAttributeNames;

export type CodeAttribute = AttributeType<CodeAttributeBase, CodeAttributeNames>;

export type ColAttributeBase = {
    span: string;
} & GlobalAttributes;

export type ColAttributeNames = GlobalAttributeNames | "span";

export type ColAttribute = AttributeType<ColAttributeBase, ColAttributeNames>;

export type ColgroupAttributeBase = {
    span: string;
} & GlobalAttributes;

export type ColgroupAttributeNames = GlobalAttributeNames | "span";

export type ColgroupAttribute = AttributeType<ColgroupAttributeBase, ColgroupAttributeNames>;

export type DataAttributeBase = {
    value: string;
} & GlobalAttributes;

export type DataAttributeNames = GlobalAttributeNames | "value";

export type DataAttribute = AttributeType<DataAttributeBase, DataAttributeNames>;

export type DatalistAttributeBase = GlobalAttributes;

export type DatalistAttributeNames = GlobalAttributeNames;

export type DatalistAttribute = AttributeType<DatalistAttributeBase, DatalistAttributeNames>;

export type DdAttributeBase = GlobalAttributes;

export type DdAttributeNames = GlobalAttributeNames;

export type DdAttribute = AttributeType<DdAttributeBase, DdAttributeNames>;

export type DelAttributeBase = {
    cite: string;
    datetime: string;
} & GlobalAttributes;

export type DelAttributeNames = GlobalAttributeNames | "cite" | "datetime";

export type DelAttribute = AttributeType<DelAttributeBase, DelAttributeNames>;

export type DetailsAttributeBase = {
    open: null;
} & GlobalAttributes;

export type DetailsAttributeNames = GlobalAttributeNames | "open";

export type DetailsAttribute = AttributeType<DetailsAttributeBase, DetailsAttributeNames>;

export type DfnAttributeBase = GlobalAttributes;

export type DfnAttributeNames = GlobalAttributeNames;

export type DfnAttribute = AttributeType<DfnAttributeBase, DfnAttributeNames>;

export type DialogAttributeBase = {
    open: null;
} & GlobalAttributes;

export type DialogAttributeNames = GlobalAttributeNames | "open";

export type DialogAttribute = AttributeType<DialogAttributeBase, DialogAttributeNames>;

export type DivAttributeBase = GlobalAttributes;

export type DivAttributeNames = GlobalAttributeNames;

export type DivAttribute = AttributeType<DivAttributeBase, DivAttributeNames>;

export type DlAttributeBase = GlobalAttributes;

export type DlAttributeNames = GlobalAttributeNames;

export type DlAttribute = AttributeType<DlAttributeBase, DlAttributeNames>;

export type DtAttributeBase = GlobalAttributes;

export type DtAttributeNames = GlobalAttributeNames;

export type DtAttribute = AttributeType<DtAttributeBase, DtAttributeNames>;

export type EmAttributeBase = GlobalAttributes;

export type EmAttributeNames = GlobalAttributeNames;

export type EmAttribute = AttributeType<EmAttributeBase, EmAttributeNames>;

export type EmbedAttributeBase = {
    height: string;
    src: string;
    type: string;
    width: string;
} & GlobalAttributes;

export type EmbedAttributeNames = GlobalAttributeNames | "height" | "src" | "type" | "width";

export type EmbedAttribute = AttributeType<EmbedAttributeBase, EmbedAttributeNames>;

export type FieldsetAttributeBase = {
    disabled: null;
    form: string;
    name: string;
} & GlobalAttributes;

export type FieldsetAttributeNames = GlobalAttributeNames | "disabled" | "form" | "name";

export type FieldsetAttribute = AttributeType<FieldsetAttributeBase, FieldsetAttributeNames>;

export type FigcaptionAttributeBase = GlobalAttributes;

export type FigcaptionAttributeNames = GlobalAttributeNames;

export type FigcaptionAttribute = AttributeType<FigcaptionAttributeBase, FigcaptionAttributeNames>;

export type FigureAttributeBase = GlobalAttributes;

export type FigureAttributeNames = GlobalAttributeNames;

export type FigureAttribute = AttributeType<FigureAttributeBase, FigureAttributeNames>;

export type FooterAttributeBase = GlobalAttributes;

export type FooterAttributeNames = GlobalAttributeNames;

export type FooterAttribute = AttributeType<FooterAttributeBase, FooterAttributeNames>;

export type FormAttributeBase = {
    acceptcharset: string;
    action: string;
    autocomplete: "on" | "off";
    enctype: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
    method: "post" | "get" | "dialog";
    name: string;
    novalidate: null;
    rel: string | string[];
    target: string;
} & GlobalAttributes;

export type FormAttributeNames =
    | GlobalAttributeNames
    | "acceptcharset"
    | "action"
    | "autocomplete"
    | "enctype"
    | "method"
    | "name"
    | "novalidate"
    | "rel"
    | "target";

export type FormAttribute = AttributeType<FormAttributeBase, FormAttributeNames>;

export type H1AttributeBase = GlobalAttributes;

export type H1AttributeNames = GlobalAttributeNames;

export type H1Attribute = AttributeType<H1AttributeBase, H1AttributeNames>;

export type H2AttributeBase = GlobalAttributes;

export type H2AttributeNames = GlobalAttributeNames;

export type H2Attribute = AttributeType<H2AttributeBase, H2AttributeNames>;

export type H3AttributeBase = GlobalAttributes;

export type H3AttributeNames = GlobalAttributeNames;

export type H3Attribute = AttributeType<H3AttributeBase, H3AttributeNames>;

export type H4AttributeBase = GlobalAttributes;

export type H4AttributeNames = GlobalAttributeNames;

export type H4Attribute = AttributeType<H4AttributeBase, H4AttributeNames>;

export type H5AttributeBase = GlobalAttributes;

export type H5AttributeNames = GlobalAttributeNames;

export type H5Attribute = AttributeType<H5AttributeBase, H5AttributeNames>;

export type H6AttributeBase = GlobalAttributes;

export type H6AttributeNames = GlobalAttributeNames;

export type H6Attribute = AttributeType<H6AttributeBase, H6AttributeNames>;

export type HeadAttributeBase = GlobalAttributes;

export type HeadAttributeNames = GlobalAttributeNames;

export type HeadAttribute = AttributeType<HeadAttributeBase, HeadAttributeNames>;

export type HeaderAttributeBase = GlobalAttributes;

export type HeaderAttributeNames = GlobalAttributeNames;

export type HeaderAttribute = AttributeType<HeaderAttributeBase, HeaderAttributeNames>;

export type HgroupAttributeBase = GlobalAttributes;

export type HgroupAttributeNames = GlobalAttributeNames;

export type HgroupAttribute = AttributeType<HgroupAttributeBase, HgroupAttributeNames>;

export type HrAttributeBase = GlobalAttributes;

export type HrAttributeNames = GlobalAttributeNames;

export type HrAttribute = AttributeType<HrAttributeBase, HrAttributeNames>;

export type HtmlAttributeBase = {
    xmlns: string;
} & GlobalAttributes;

export type HtmlAttributeNames = GlobalAttributeNames | "xmlns";

export type HtmlAttribute = AttributeType<HtmlAttributeBase, HtmlAttributeNames>;

export type IAttributeBase = GlobalAttributes;

export type IAttributeNames = GlobalAttributeNames;

export type IAttribute = AttributeType<IAttributeBase, IAttributeNames>;

export type IframeAttributeBase = {
    allow: string | string[];
    allowfullscreen: null;
    height: string;
    loading: "lazy" | "eager";
    name: string;
    referrerpolicy:
        | "no-referrer"
        | "no-referrer-when-downgrade"
        | "origin"
        | "origin-when-cross-origin"
        | "same-origin"
        | "strict-origin"
        | "strict-origin-when-cross-origin"
        | "unsafe-url";
    sandbox: string | string[];
    src: string;
    srcdoc: string;
    width: string;
} & GlobalAttributes;

export type IframeAttributeNames =
    | GlobalAttributeNames
    | "allow"
    | "allowfullscreen"
    | "height"
    | "loading"
    | "name"
    | "referrerpolicy"
    | "sandbox"
    | "src"
    | "srcdoc"
    | "width";

export type IframeAttribute = AttributeType<IframeAttributeBase, IframeAttributeNames>;

export type ImgAttributeBase = {
    alt: string;
    crossorigin: "anonymous" | "use-credentials";
    decoding: "sync" | "async" | "auto";
    fetchpriority: "auto" | "high" | "low";
    height: string;
    ismap: null;
    loading: "lazy" | "eager";
    referrerpolicy:
        | "no-referrer"
        | "no-referrer-when-downgrade"
        | "origin"
        | "origin-when-cross-origin"
        | "same-origin"
        | "strict-origin"
        | "strict-origin-when-cross-origin"
        | "unsafe-url";
    sizes: string | string[];
    src: string;
    srcset: string | string[];
    usemap: string;
    width: string;
} & GlobalAttributes;

export type ImgAttributeNames =
    | GlobalAttributeNames
    | "alt"
    | "crossorigin"
    | "decoding"
    | "fetchpriority"
    | "height"
    | "ismap"
    | "loading"
    | "referrerpolicy"
    | "sizes"
    | "src"
    | "srcset"
    | "usemap"
    | "width";

export type ImgAttribute = AttributeType<ImgAttributeBase, ImgAttributeNames>;

export type InputAttributeBase = {
    accept: string | string[];
    alt: string;
    autocomplete: string;
    capture: "user" | "environment" | "";
    checked: null;
    dirname: string;
    disabled: null;
    form: string;
    formaction: string;
    formenctype: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
    formmethod: "post" | "get" | "dialog";
    formnovalidate: null;
    formtarget: string;
    height: string;
    list: string;
    max: string;
    maxlength: string;
    min: string;
    minlength: string;
    multiple: null;
    name: string;
    pattern: string;
    placeholder: string;
    popovertarget: string;
    popovertargetaction: "toggle" | "show" | "hide";
    readonly: null;
    required: null;
    size: string;
    src: string;
    step: string;
    type:
        | "button"
        | "checkbox"
        | "color"
        | "date"
        | "datetime-local"
        | "email"
        | "file"
        | "hidden"
        | "image"
        | "month"
        | "number"
        | "password"
        | "radio"
        | "range"
        | "reset"
        | "search"
        | "submit"
        | "tel"
        | "text"
        | "time"
        | "url"
        | "week";
    value: string;
    width: string;
} & GlobalAttributes;

export type InputAttributeNames =
    | GlobalAttributeNames
    | "accept"
    | "alt"
    | "autocomplete"
    | "capture"
    | "checked"
    | "dirname"
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
    | "popovertarget"
    | "popovertargetaction"
    | "readonly"
    | "required"
    | "size"
    | "src"
    | "step"
    | "type"
    | "value"
    | "width";

export type InputAttribute = AttributeType<InputAttributeBase, InputAttributeNames>;

export type InsAttributeBase = {
    cite: string;
    datetime: string;
} & GlobalAttributes;

export type InsAttributeNames = GlobalAttributeNames | "cite" | "datetime";

export type InsAttribute = AttributeType<InsAttributeBase, InsAttributeNames>;

export type KbdAttributeBase = GlobalAttributes;

export type KbdAttributeNames = GlobalAttributeNames;

export type KbdAttribute = AttributeType<KbdAttributeBase, KbdAttributeNames>;

export type LabelAttributeBase = {
    for: string;
    form: string;
} & GlobalAttributes;

export type LabelAttributeNames = GlobalAttributeNames | "for" | "form";

export type LabelAttribute = AttributeType<LabelAttributeBase, LabelAttributeNames>;

export type LegendAttributeBase = GlobalAttributes;

export type LegendAttributeNames = GlobalAttributeNames;

export type LegendAttribute = AttributeType<LegendAttributeBase, LegendAttributeNames>;

export type LiAttributeBase = {
    value: string;
} & GlobalAttributes;

export type LiAttributeNames = GlobalAttributeNames | "value";

export type LiAttribute = AttributeType<LiAttributeBase, LiAttributeNames>;

export type LinkAttributeBase = {
    as:
        | "audio"
        | "document"
        | "embed"
        | "fetch"
        | "font"
        | "image"
        | "object"
        | "script"
        | "style"
        | "track"
        | "video"
        | "worker";
    crossorigin: "anonymous" | "use-credentials";
    disabled: null;
    fetchpriority: "auto" | "high" | "low";
    href: string;
    hreflang: string;
    imagesizes: string | string[];
    imagesrcset: string | string[];
    integrity: string;
    media: string;
    referrerpolicy:
        | "no-referrer"
        | "no-referrer-when-downgrade"
        | "origin"
        | "origin-when-cross-origin"
        | "same-origin"
        | "strict-origin"
        | "strict-origin-when-cross-origin"
        | "unsafe-url";
    rel: string | string[];
    sizes: string | string[];
    title: string;
    type: string;
} & GlobalAttributes;

export type LinkAttributeNames =
    | GlobalAttributeNames
    | "as"
    | "crossorigin"
    | "disabled"
    | "fetchpriority"
    | "href"
    | "hreflang"
    | "imagesizes"
    | "imagesrcset"
    | "integrity"
    | "media"
    | "referrerpolicy"
    | "rel"
    | "sizes"
    | "title"
    | "type";

export type LinkAttribute = AttributeType<LinkAttributeBase, LinkAttributeNames>;

export type MainAttributeBase = GlobalAttributes;

export type MainAttributeNames = GlobalAttributeNames;

export type MainAttribute = AttributeType<MainAttributeBase, MainAttributeNames>;

export type MapAttributeBase = {
    name: string;
} & GlobalAttributes;

export type MapAttributeNames = GlobalAttributeNames | "name";

export type MapAttribute = AttributeType<MapAttributeBase, MapAttributeNames>;

export type MarkAttributeBase = GlobalAttributes;

export type MarkAttributeNames = GlobalAttributeNames;

export type MarkAttribute = AttributeType<MarkAttributeBase, MarkAttributeNames>;

export type MenuAttributeBase = GlobalAttributes;

export type MenuAttributeNames = GlobalAttributeNames;

export type MenuAttribute = AttributeType<MenuAttributeBase, MenuAttributeNames>;

export type MetaAttributeBase = {
    charset: string;
    content: string;
    "http-equiv": "content-security-policy" | "content-type" | "default-style" | "x-ua-compatible" | "refresh";
    http_equiv: "content-security-policy" | "content-type" | "default-style" | "x-ua-compatible" | "refresh";
    media: string;
    name: string;
} & GlobalAttributes;

export type MetaAttributeNames =
    | GlobalAttributeNames
    | "charset"
    | "content"
    | "http-equiv"
    | "http_equiv"
    | "media"
    | "name";

export type MetaAttribute = AttributeType<MetaAttributeBase, MetaAttributeNames>;

export type MeterAttributeBase = {
    form: string;
    high: string;
    low: string;
    max: string;
    min: string;
    optimum: string;
    value: string;
} & GlobalAttributes;

export type MeterAttributeNames = GlobalAttributeNames | "form" | "high" | "low" | "max" | "min" | "optimum" | "value";

export type MeterAttribute = AttributeType<MeterAttributeBase, MeterAttributeNames>;

export type NavAttributeBase = GlobalAttributes;

export type NavAttributeNames = GlobalAttributeNames;

export type NavAttribute = AttributeType<NavAttributeBase, NavAttributeNames>;

export type NoscriptAttributeBase = GlobalAttributes;

export type NoscriptAttributeNames = GlobalAttributeNames;

export type NoscriptAttribute = AttributeType<NoscriptAttributeBase, NoscriptAttributeNames>;

export type ObjectAttributeBase = {
    data: string;
    form: string;
    height: string;
    name: string;
    type: string;
    usemap: string;
    width: string;
} & GlobalAttributes;

export type ObjectAttributeNames =
    | GlobalAttributeNames
    | "data"
    | "form"
    | "height"
    | "name"
    | "type"
    | "usemap"
    | "width";

export type ObjectAttribute = AttributeType<ObjectAttributeBase, ObjectAttributeNames>;

export type OlAttributeBase = {
    reversed: null;
    start: string;
    type: "1" | "a" | "A" | "i" | "I";
} & GlobalAttributes;

export type OlAttributeNames = GlobalAttributeNames | "reversed" | "start" | "type";

export type OlAttribute = AttributeType<OlAttributeBase, OlAttributeNames>;

export type OptgroupAttributeBase = {
    disabled: null;
    label: string;
} & GlobalAttributes;

export type OptgroupAttributeNames = GlobalAttributeNames | "disabled" | "label";

export type OptgroupAttribute = AttributeType<OptgroupAttributeBase, OptgroupAttributeNames>;

export type OptionAttributeBase = {
    disabled: null;
    label: string;
    selected: null;
    value: string;
} & GlobalAttributes;

export type OptionAttributeNames = GlobalAttributeNames | "disabled" | "label" | "selected" | "value";

export type OptionAttribute = AttributeType<OptionAttributeBase, OptionAttributeNames>;

export type OutputAttributeBase = {
    for: string | string[];
    form: string;
    name: string;
} & GlobalAttributes;

export type OutputAttributeNames = GlobalAttributeNames | "for" | "form" | "name";

export type OutputAttribute = AttributeType<OutputAttributeBase, OutputAttributeNames>;

export type PAttributeBase = GlobalAttributes;

export type PAttributeNames = GlobalAttributeNames;

export type PAttribute = AttributeType<PAttributeBase, PAttributeNames>;

export type PictureAttributeBase = GlobalAttributes;

export type PictureAttributeNames = GlobalAttributeNames;

export type PictureAttribute = AttributeType<PictureAttributeBase, PictureAttributeNames>;

export type PreAttributeBase = GlobalAttributes;

export type PreAttributeNames = GlobalAttributeNames;

export type PreAttribute = AttributeType<PreAttributeBase, PreAttributeNames>;

export type ProgressAttributeBase = {
    max: string;
    value: string;
} & GlobalAttributes;

export type ProgressAttributeNames = GlobalAttributeNames | "max" | "value";

export type ProgressAttribute = AttributeType<ProgressAttributeBase, ProgressAttributeNames>;

export type QAttributeBase = {
    cite: string;
} & GlobalAttributes;

export type QAttributeNames = GlobalAttributeNames | "cite";

export type QAttribute = AttributeType<QAttributeBase, QAttributeNames>;

export type RpAttributeBase = GlobalAttributes;

export type RpAttributeNames = GlobalAttributeNames;

export type RpAttribute = AttributeType<RpAttributeBase, RpAttributeNames>;

export type RtAttributeBase = GlobalAttributes;

export type RtAttributeNames = GlobalAttributeNames;

export type RtAttribute = AttributeType<RtAttributeBase, RtAttributeNames>;

export type RubyAttributeBase = GlobalAttributes;

export type RubyAttributeNames = GlobalAttributeNames;

export type RubyAttribute = AttributeType<RubyAttributeBase, RubyAttributeNames>;

export type SAttributeBase = GlobalAttributes;

export type SAttributeNames = GlobalAttributeNames;

export type SAttribute = AttributeType<SAttributeBase, SAttributeNames>;

export type SampAttributeBase = GlobalAttributes;

export type SampAttributeNames = GlobalAttributeNames;

export type SampAttribute = AttributeType<SampAttributeBase, SampAttributeNames>;

export type ScriptAttributeBase = {
    async: null;
    crossorigin: "anonymous" | "use-credentials";
    defer: null;
    fetchpriority: "auto" | "high" | "low";
    integrity: string;
    nomodule: null;
    referrerpolicy:
        | "no-referrer"
        | "no-referrer-when-downgrade"
        | "origin"
        | "origin-when-cross-origin"
        | "same-origin"
        | "strict-origin"
        | "strict-origin-when-cross-origin"
        | "unsafe-url";
    src: string;
    type: string;
} & GlobalAttributes;

export type ScriptAttributeNames =
    | GlobalAttributeNames
    | "async"
    | "crossorigin"
    | "defer"
    | "fetchpriority"
    | "integrity"
    | "nomodule"
    | "referrerpolicy"
    | "src"
    | "type";

export type ScriptAttribute = AttributeType<ScriptAttributeBase, ScriptAttributeNames>;

export type SearchAttributeBase = GlobalAttributes;

export type SearchAttributeNames = GlobalAttributeNames;

export type SearchAttribute = AttributeType<SearchAttributeBase, SearchAttributeNames>;

export type SectionAttributeBase = GlobalAttributes;

export type SectionAttributeNames = GlobalAttributeNames;

export type SectionAttribute = AttributeType<SectionAttributeBase, SectionAttributeNames>;

export type SelectAttributeBase = {
    autocomplete: "on" | "off";
    disabled: null;
    form: string;
    multiple: null;
    name: string;
    required: null;
    size: string;
} & GlobalAttributes;

export type SelectAttributeNames =
    | GlobalAttributeNames
    | "autocomplete"
    | "disabled"
    | "form"
    | "multiple"
    | "name"
    | "required"
    | "size";

export type SelectAttribute = AttributeType<SelectAttributeBase, SelectAttributeNames>;

export type SlotAttributeBase = {
    name: string;
} & GlobalAttributes;

export type SlotAttributeNames = GlobalAttributeNames | "name";

export type SlotAttribute = AttributeType<SlotAttributeBase, SlotAttributeNames>;

export type SmallAttributeBase = GlobalAttributes;

export type SmallAttributeNames = GlobalAttributeNames;

export type SmallAttribute = AttributeType<SmallAttributeBase, SmallAttributeNames>;

export type SourceAttributeBase = {
    height: string;
    media: string;
    sizes: string | string[];
    src: string;
    srcset: string | string[];
    type: string;
    width: string;
} & GlobalAttributes;

export type SourceAttributeNames =
    | GlobalAttributeNames
    | "height"
    | "media"
    | "sizes"
    | "src"
    | "srcset"
    | "type"
    | "width";

export type SourceAttribute = AttributeType<SourceAttributeBase, SourceAttributeNames>;

export type SpanAttributeBase = GlobalAttributes;

export type SpanAttributeNames = GlobalAttributeNames;

export type SpanAttribute = AttributeType<SpanAttributeBase, SpanAttributeNames>;

export type StrongAttributeBase = GlobalAttributes;

export type StrongAttributeNames = GlobalAttributeNames;

export type StrongAttribute = AttributeType<StrongAttributeBase, StrongAttributeNames>;

export type StyleAttributeBase = {
    media: string;
    nonce: string;
    title: string;
} & GlobalAttributes;

export type StyleAttributeNames = GlobalAttributeNames | "media" | "nonce" | "title";

export type StyleAttribute = AttributeType<StyleAttributeBase, StyleAttributeNames>;

export type SubAttributeBase = GlobalAttributes;

export type SubAttributeNames = GlobalAttributeNames;

export type SubAttribute = AttributeType<SubAttributeBase, SubAttributeNames>;

export type SummaryAttributeBase = GlobalAttributes;

export type SummaryAttributeNames = GlobalAttributeNames;

export type SummaryAttribute = AttributeType<SummaryAttributeBase, SummaryAttributeNames>;

export type SupAttributeBase = GlobalAttributes;

export type SupAttributeNames = GlobalAttributeNames;

export type SupAttribute = AttributeType<SupAttributeBase, SupAttributeNames>;

export type SVGAttributeBase = {
    height: string;
    width: string;
    xmlns: string;
} & GlobalAttributes;

export type SVGAttributeNames = GlobalAttributeNames | "height" | "width" | "xmlns";

export type SVGAttribute = AttributeType<SVGAttributeBase, SVGAttributeNames>;

export type TableAttributeBase = GlobalAttributes;

export type TableAttributeNames = GlobalAttributeNames;

export type TableAttribute = AttributeType<TableAttributeBase, TableAttributeNames>;

export type TbodyAttributeBase = GlobalAttributes;

export type TbodyAttributeNames = GlobalAttributeNames;

export type TbodyAttribute = AttributeType<TbodyAttributeBase, TbodyAttributeNames>;

export type TdAttributeBase = {
    colspan: string;
    headers: string | string[];
    rowspan: string;
} & GlobalAttributes;

export type TdAttributeNames = GlobalAttributeNames | "colspan" | "headers" | "rowspan";

export type TdAttribute = AttributeType<TdAttributeBase, TdAttributeNames>;

export type TemplateAttributeBase = {
    shadowrootmode: "open" | "closed";
} & GlobalAttributes;

export type TemplateAttributeNames = GlobalAttributeNames | "shadowrootmode";

export type TemplateAttribute = AttributeType<TemplateAttributeBase, TemplateAttributeNames>;

export type TextareaAttributeBase = {
    autocomplete: "on" | "off";
    cols: string;
    dirname: string;
    disabled: null;
    form: string;
    maxlength: string;
    minlength: string;
    name: string;
    placeholder: string;
    readonly: null;
    required: null;
    rows: string;
    wrap: "hard" | "soft";
} & GlobalAttributes;

export type TextareaAttributeNames =
    | GlobalAttributeNames
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
    | "wrap";

export type TextareaAttribute = AttributeType<TextareaAttributeBase, TextareaAttributeNames>;

export type TfootAttributeBase = GlobalAttributes;

export type TfootAttributeNames = GlobalAttributeNames;

export type TfootAttribute = AttributeType<TfootAttributeBase, TfootAttributeNames>;

export type ThAttributeBase = {
    abbr: string;
    colspan: string;
    headers: string | string[];
    rowspan: string;
    scope: "row" | "col" | "rowgroup" | "colgroup";
} & GlobalAttributes;

export type ThAttributeNames = GlobalAttributeNames | "abbr" | "colspan" | "headers" | "rowspan" | "scope";

export type ThAttribute = AttributeType<ThAttributeBase, ThAttributeNames>;

export type TheadAttributeBase = GlobalAttributes;

export type TheadAttributeNames = GlobalAttributeNames;

export type TheadAttribute = AttributeType<TheadAttributeBase, TheadAttributeNames>;

export type TimeAttributeBase = {
    datetime: string;
} & GlobalAttributes;

export type TimeAttributeNames = GlobalAttributeNames | "datetime";

export type TimeAttribute = AttributeType<TimeAttributeBase, TimeAttributeNames>;

export type TitleAttributeBase = GlobalAttributes;

export type TitleAttributeNames = GlobalAttributeNames;

export type TitleAttribute = AttributeType<TitleAttributeBase, TitleAttributeNames>;

export type TrAttributeBase = GlobalAttributes;

export type TrAttributeNames = GlobalAttributeNames;

export type TrAttribute = AttributeType<TrAttributeBase, TrAttributeNames>;

export type TrackAttributeBase = {
    default: null;
    kind: "subtitles" | "captions" | "descriptions" | "chapters" | "metadata";
    label: string;
    src: string;
    srclang: string;
} & GlobalAttributes;

export type TrackAttributeNames = GlobalAttributeNames | "default" | "kind" | "label" | "src" | "srclang";

export type TrackAttribute = AttributeType<TrackAttributeBase, TrackAttributeNames>;

export type UAttributeBase = GlobalAttributes;

export type UAttributeNames = GlobalAttributeNames;

export type UAttribute = AttributeType<UAttributeBase, UAttributeNames>;

export type UlAttributeBase = GlobalAttributes;

export type UlAttributeNames = GlobalAttributeNames;

export type UlAttribute = AttributeType<UlAttributeBase, UlAttributeNames>;

export type VarAttributeBase = GlobalAttributes;

export type VarAttributeNames = GlobalAttributeNames;

export type VarAttribute = AttributeType<VarAttributeBase, VarAttributeNames>;

export type VideoAttributeBase = {
    autoplay: null;
    controls: null;
    crossorigin: "anonymous" | "use-credentials";
    disablepictureinpicture: null;
    disableremoteplayback: null;
    height: string;
    loop: null;
    muted: null;
    playsinline: null;
    poster: string;
    preload: "none" | "metadata" | "auto" | "";
    src: string;
    width: string;
} & GlobalAttributes;

export type VideoAttributeNames =
    | GlobalAttributeNames
    | "autoplay"
    | "controls"
    | "crossorigin"
    | "disablepictureinpicture"
    | "disableremoteplayback"
    | "height"
    | "loop"
    | "muted"
    | "playsinline"
    | "poster"
    | "preload"
    | "src"
    | "width";

export type VideoAttribute = AttributeType<VideoAttributeBase, VideoAttributeNames>;

export type WbrAttributeBase = GlobalAttributes;

export type WbrAttributeNames = GlobalAttributeNames;

export type WbrAttribute = AttributeType<WbrAttributeBase, WbrAttributeNames>;

// 各HTML要素に対応する属性型を表すマップ型
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
    menu: MenuAttribute;
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
    search: SearchAttribute;
    section: SectionAttribute;
    select: SelectAttribute;
    slot: SlotAttribute;
    small: SmallAttribute;
    source: SourceAttribute;
    span: SpanAttribute;
    strong: StrongAttribute;
    style: StyleAttribute;
    sub: SubAttribute;
    summary: SummaryAttribute;
    sup: SupAttribute;
    svg: SVGAttribute;
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
    class: DivAttribute;
};

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
        console.log(`export const ${capitalize(tag)} = /* @__PURE__*/ gt("${tag}");`);
    }
}

function gt<K extends Tag | HanabiTag>(tag: K): HElementFn<K> {
    return {
        [tag]:
            (attribute: AttributeOf<K>) =>
            (...child: HNode[]) => ({ tag, attribute, child }),
    }[tag];
}

export const A = /* @__PURE__*/ gt("a");
export const Abbr = /* @__PURE__*/ gt("abbr");
export const Address = /* @__PURE__*/ gt("address");
export const Area = /* @__PURE__*/ gt("area");
export const Article = /* @__PURE__*/ gt("article");
export const Aside = /* @__PURE__*/ gt("aside");
export const Audio = /* @__PURE__*/ gt("audio");
export const B = /* @__PURE__*/ gt("b");
export const Base = /* @__PURE__*/ gt("base");
export const Bdi = /* @__PURE__*/ gt("bdi");
export const Bdo = /* @__PURE__*/ gt("bdo");
export const Blockquote = /* @__PURE__*/ gt("blockquote");
export const Body = /* @__PURE__*/ gt("body");
export const Br = /* @__PURE__*/ gt("br");
export const Button = /* @__PURE__*/ gt("button");
export const Canvas = /* @__PURE__*/ gt("canvas");
export const Caption = /* @__PURE__*/ gt("caption");
export const Cite = /* @__PURE__*/ gt("cite");
export const Code = /* @__PURE__*/ gt("code");
export const Col = /* @__PURE__*/ gt("col");
export const Colgroup = /* @__PURE__*/ gt("colgroup");
export const Data = /* @__PURE__*/ gt("data");
export const Datalist = /* @__PURE__*/ gt("datalist");
export const Dd = /* @__PURE__*/ gt("dd");
export const Del = /* @__PURE__*/ gt("del");
export const Details = /* @__PURE__*/ gt("details");
export const Dfn = /* @__PURE__*/ gt("dfn");
export const Dialog = /* @__PURE__*/ gt("dialog");
export const Div = /* @__PURE__*/ gt("div");
export const Dl = /* @__PURE__*/ gt("dl");
export const Dt = /* @__PURE__*/ gt("dt");
export const Em = /* @__PURE__*/ gt("em");
export const Embed = /* @__PURE__*/ gt("embed");
export const Fieldset = /* @__PURE__*/ gt("fieldset");
export const Figcaption = /* @__PURE__*/ gt("figcaption");
export const Figure = /* @__PURE__*/ gt("figure");
export const Footer = /* @__PURE__*/ gt("footer");
export const Form = /* @__PURE__*/ gt("form");
export const H1 = /* @__PURE__*/ gt("h1");
export const H2 = /* @__PURE__*/ gt("h2");
export const H3 = /* @__PURE__*/ gt("h3");
export const H4 = /* @__PURE__*/ gt("h4");
export const H5 = /* @__PURE__*/ gt("h5");
export const H6 = /* @__PURE__*/ gt("h6");
export const Head = /* @__PURE__*/ gt("head");
export const Header = /* @__PURE__*/ gt("header");
export const Hgroup = /* @__PURE__*/ gt("hgroup");
export const Hr = /* @__PURE__*/ gt("hr");
export const Html = /* @__PURE__*/ gt("html");
export const I = /* @__PURE__*/ gt("i");
export const Iframe = /* @__PURE__*/ gt("iframe");
export const Img = /* @__PURE__*/ gt("img");
export const Input = /* @__PURE__*/ gt("input");
export const Ins = /* @__PURE__*/ gt("ins");
export const Kbd = /* @__PURE__*/ gt("kbd");
export const Label = /* @__PURE__*/ gt("label");
export const Legend = /* @__PURE__*/ gt("legend");
export const Li = /* @__PURE__*/ gt("li");
export const Link = /* @__PURE__*/ gt("link");
export const Main = /* @__PURE__*/ gt("main");
export const Map_ = /* @__PURE__*/ gt("map");
export const Mark = /* @__PURE__*/ gt("mark");
export const Meta = /* @__PURE__*/ gt("meta");
export const Meter = /* @__PURE__*/ gt("meter");
export const Nav = /* @__PURE__*/ gt("nav");
export const Noscript = /* @__PURE__*/ gt("noscript");
export const Object_ = /* @__PURE__*/ gt("object");
export const Ol = /* @__PURE__*/ gt("ol");
export const Optgroup = /* @__PURE__*/ gt("optgroup");
export const Option = /* @__PURE__*/ gt("option");
export const Output = /* @__PURE__*/ gt("output");
export const P = /* @__PURE__*/ gt("p");
export const Param = /* @__PURE__*/ gt("param");
export const Picture = /* @__PURE__*/ gt("picture");
export const Pre = /* @__PURE__*/ gt("pre");
export const Progress = /* @__PURE__*/ gt("progress");
export const Q = /* @__PURE__*/ gt("q");
export const Rp = /* @__PURE__*/ gt("rp");
export const Rt = /* @__PURE__*/ gt("rt");
export const Ruby = /* @__PURE__*/ gt("ruby");
export const S = /* @__PURE__*/ gt("s");
export const Samp = /* @__PURE__*/ gt("samp");
export const Script = /* @__PURE__*/ gt("script");
export const Section = /* @__PURE__*/ gt("section");
export const Select = /* @__PURE__*/ gt("select");
export const Small = /* @__PURE__*/ gt("small");
export const Source = /* @__PURE__*/ gt("source");
export const Span = /* @__PURE__*/ gt("span");
export const Strong = /* @__PURE__*/ gt("strong");
export const Sub = /* @__PURE__*/ gt("sub");
export const Summary = /* @__PURE__*/ gt("summary");
export const Sup = /* @__PURE__*/ gt("sup");
export const Table = /* @__PURE__*/ gt("table");
export const Tbody = /* @__PURE__*/ gt("tbody");
export const Td = /* @__PURE__*/ gt("td");
export const Template = /* @__PURE__*/ gt("template");
export const Textarea = /* @__PURE__*/ gt("textarea");
export const Tfoot = /* @__PURE__*/ gt("tfoot");
export const Th = /* @__PURE__*/ gt("th");
export const Thead = /* @__PURE__*/ gt("thead");
export const Time = /* @__PURE__*/ gt("time");
export const Title = /* @__PURE__*/ gt("title");
export const Tr = /* @__PURE__*/ gt("tr");
export const Track = /* @__PURE__*/ gt("track");
export const U = /* @__PURE__*/ gt("u");
export const Ul = /* @__PURE__*/ gt("ul");
export const Var = /* @__PURE__*/ gt("var");
export const Video = /* @__PURE__*/ gt("video");
export const Wbr = /* @__PURE__*/ gt("wbr");

export const Unwrap = /* @__PURE__*/ gt("unwrap");
export const RawHTML = /* @__PURE__*/ gt("raw");
export const Class = /* @__PURE__*/ gt("class");

export function DOCTYPE(): string {
    return "<!DOCTYPE html>";
}
