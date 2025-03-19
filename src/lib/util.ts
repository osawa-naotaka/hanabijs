export function replaceExt(filename: string, ext: string) {
    return filename.replace(/\.[^/.]+$/, ext);
}

export function globExt(base: string, ext: string): AsyncIterableIterator<string> {
    const glob = new Bun.Glob(`**/*${ext}`);
    return glob.scan(base);
}

const contentTypes: [string, string][] = [
    [".html", "text/html"],
    [".css", "text/css"],
    [".js", "text/javascript"],
    [".json", "application/json"],
    [".png", "image/png"],
    [".jpg", "image/jpeg"],
    [".gif", "image/gif"],
    [".svg", "image/svg+xml"],
    [".ico", "image/x-icon"],
    [".pdf", "application/pdf"],
];

export function contentType(ext: string): string {
    return contentTypes.find((c) => c[0] === ext)?.[1] || "text/plain";
}

// 許可されたHTML要素のリスト
const ALLOWED_ELEMENTS = new Set([
    "div",
    "span",
    "p",
    "a",
    "img",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "table",
    "tr",
    "td",
    "th",
    "thead",
    "tbody",
    "button",
    "input",
    "select",
    "option",
    "form",
    "label",
    "strong",
    "em",
    "br",
    "hr",
    "pre",
    "code",
    "blockquote",
    "script",
    "link",
    "meta",
    "html",
    "head",
    "title",
    "body",
    "nav",
    "header",
    "footer",
    "article",
    "section",
    "aside",
    "main",
    // その他許可する要素
    // hanabi独自要素
    "unwrap",
]);

// 要素名の検証
export function validateElementName(name: string): boolean {
    return ALLOWED_ELEMENTS.has(name.toLowerCase());
}

// 許可された属性のリスト
const ALLOWED_ATTRIBUTES = new Set([
    // 基本属性
    "id",
    "class",
    "name",
    "title",

    // アクセシビリティ
    "aria-label",
    "aria-hidden",
    "aria-expanded",
    "aria-controls",
    "aria-haspopup",
    "role",
    "tabindex",

    // リンク関連
    "href",
    "target",
    "rel",
    "download",

    // メディア関連
    "src",
    "srcset",
    "alt",
    "loading",
    "width",
    "height",

    // フォーム関連
    "type",
    "value",
    "placeholder",
    "disabled",
    "required",
    "readonly",
    "checked",
    "selected",
    "maxlength",
    "minlength",
    "max",
    "min",
    "step",

    // テーブル関連
    "colspan",
    "rowspan",

    // その他
    "lang",
    "dir",
    "charset",
    "content",
    "http-equiv",
    "popover",
    "popovertarget",
    "for",
]);

// 属性名の検証
export function validateAttributeKey(key: string): boolean {
    return ALLOWED_ATTRIBUTES.has(key.toLowerCase()) || key.toLowerCase().startsWith("data-");
}

export function sanitizeAttributeValue(key: string): (value: string) => string {
    return (value: string) => {
        // まず属性名を検証
        if (!validateAttributeKey(key)) {
            throw new Error(`Attribute '${key}' is not allowed`);
        }

        // 長いValueは禁止
        if (value.length > 1024 * 1024) {
            throw new Error(`Attribute '${key}' value is too long: < 1MByte is allowed.`);
        }

        const lowerKey = key.toLowerCase();

        // イベントハンドラ属性を禁止
        if (lowerKey.startsWith("on")) {
            throw new Error(`Event handler attributes are not allowed: ${key}`);
        }

        // style属性を禁止
        if (lowerKey === "style") {
            throw new Error("Style attribute is not allowed");
        }

        // URL属性の特別処理
        if (lowerKey === "href" || lowerKey === "src") {
            return sanitizeURLAttribute(value);
        }

        if (lowerKey === "srcset") {
            // srcsetは複数のURLとサイズ指定を含む可能性がある
            const srcsetEntries = value.split(",").map((entry) => entry.trim());
            for (const entry of srcsetEntries) {
                // URL部分を抽出（サイズ指定を除く）
                const urlPart = entry.split(/\s+/)[0];
                if (urlPart) {
                    sanitizeURLAttribute(urlPart); // 各URLを検証
                }
            }
            return value; // 全てのURLが安全であれば元の値を返す
        }

        // 一般的な属性値のサニタイズ
        return sanitizeBasic(value);
    };
}

export function sanitizeURLAttribute(value: string): string {
    // %エンコードをデコード
    const decodedValue = decodeURIComponent(value);

    // `..` を含むパスはエラー
    const forbiddenPattern = /(^|\/)\.\.(\/|$)/;
    if (forbiddenPattern.test(decodedValue)) {
        throw new Error('Path traversal is not allowed. Do not use ".." as a path(url, src, srcset).');
    }

    // 不正な文字のチェック
    if (/[<>"']/.test(decodedValue)) {
        throw new Error("Invalid characters in URL. Do not use <>\"'.");
    }

    // `decodedValue` が既に絶対URLか判定
    let url: URL;
    try {
        url = new URL(decodedValue); // 直接URLとして解釈可能か試す
    } catch (e) {
        if (e instanceof TypeError) {
            url = new URL(decodedValue, "https://localhost"); // 相対パスとして処理、ダミーURLのためこの値をそのまま返すことはしない
        } else {
            throw e;
        }
    }

    // 許可するスキーム
    const allowedProtocols = ["http:", "https:", "mailto:", "tel:", "ftp:"];
    if (url.protocol === "data:") {
        if (!/^data:image\/(png|jpeg|gif|webp);base64,/.test(decodedValue)) {
            throw new Error("Invalid data URL. only data:image/png,jpg,gif,webp is allowed.");
        }
    } else if (!allowedProtocols.includes(url.protocol)) {
        throw new Error(`Invalid protocol: ${url.protocol}`);
    }

    // &以外の `sanitizeBasic()` で変換される要素はエラーをthrowするため、そのまま返して安全
    return value;
}

export function sanitizeBasic(input: string): string {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
