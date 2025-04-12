import { attribute_names, hanabi_tags, tags } from "./elements";
import { property_names } from "./properties";

export function replaceExt(filename: string, ext: string) {
    return filename.replace(/\.[^/.]+$/, ext);
}

export function cloneAndMergeRecord<
    T1 extends Record<string | number | symbol, unknown>,
    T2 extends Record<string | number | symbol, unknown>,
>(record1: T1, record2: T2): T1 & T2 {
    const new_record1 = JSON.parse(JSON.stringify(record1));
    const new_record2 = JSON.parse(JSON.stringify(record2));
    for (const [key, value] of Object.entries(new_record2)) {
        new_record1[key] = value;
    }
    return new_record1;
}

export function joinAll<T extends {}, S extends {}>(base: T, items: S[]): T & S {
    return Object.assign({}, base, ...items);
}

export function unionRecords<T extends {}>(...items: T[]) {
    return unionArrayOfRecords(items);
}

export function unionArrayOfRecords<T extends {}>(items: T[]) {
    return Object.assign({}, ...items);
}

export function hash_djb2(...jsons: Record<string, unknown>[]) {
    let hash = 5381;
    const chars = jsons.map((x) => JSON.stringify(x)).join("");
    for (const char of [...chars]) {
        hash = ((hash << 5) + hash + char.charCodeAt(0)) & 0xffffffff;
    }
    return hash >>> 0;
}

const contentTypes: [string, string][] = [
    [".aac", "audio/aac"],
    [".abw", "application/x-abiword"],
    [".arc", "application/x-freearc"],
    [".avi", "video/x-msvideo"],
    [".azw", "application/vnd.amazon.ebook"],
    [".bin", "application/octet-stream"],
    [".bmp", "image/bmp"],
    [".bz", "application/x-bzip"],
    [".bz2", "application/x-bzip2"],
    [".csh", "application/x-csh"],
    [".css", "text/css"],
    [".csv", "text/csv"],
    [".doc", "application/msword"],
    [".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    [".eot", "application/vnd.ms-fontobject"],
    [".epub", "application/epub+zip"],
    [".gz", "application/gzip"],
    [".gif", "image/gif"],
    [".htm", "text/html"],
    [".html", "text/html"],
    [".ico", "image/vnd.microsoft.icon"],
    [".ics", "text/calendar"],
    [".jar", "application/java-archive"],
    [".jpeg", "image/jpeg"],
    [".jpg", "image/jpeg"],
    [".js", "text/javascript"],
    [".json", "application/json"],
    [".jsonld", "application/ld+json"],
    [".mid", "audio/midi"],
    [".midi", "audio/x-midi"],
    [".mjs", "text/javascript"],
    [".mp3", "audio/mpeg"],
    [".mpeg", "video/mpeg"],
    [".mpkg", "application/vnd.apple.installer+xml"],
    [".odp", "application/vnd.oasis.opendocument.presentation"],
    [".ods", "application/vnd.oasis.opendocument.spreadsheet"],
    [".odt", "application/vnd.oasis.opendocument.text"],
    [".oga", "audio/ogg"],
    [".ogv", "video/ogg"],
    [".ogx", "application/ogg"],
    [".opus", "audio/opus"],
    [".otf", "font/otf"],
    [".png", "image/png"],
    [".pdf", "application/pdf"],
    [".php", "application/x-httpd-php"],
    [".ppt", "application/vnd.ms-powerpoint"],
    [".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
    [".rar", "application/vnd.rar"],
    [".rtf", "application/rtf"],
    [".sh", "application/x-sh"],
    [".svg", "image/svg+xml"],
    [".swf", "application/x-shockwave-flash"],
    [".tar", "application/x-tar"],
    [".tif", "image/tiff"],
    [".tiff", "image/tiff"],
    [".ts", "video/mp2t"],
    [".ttf", "font/ttf"],
    [".txt", "text/plain"],
    [".vsd", "application/vnd.visio"],
    [".wav", "audio/wav"],
    [".weba", "audio/webm"],
    [".webm", "video/webm"],
    [".webp", "image/webp"],
    [".woff", "font/woff"],
    [".woff2", "font/woff2"],
    [".xhtml", "application/xhtml+xml"],
    [".xls", "application/vnd.ms-excel"],
    [".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    [".xml", "application/xml"],
    [".xul", "application/vnd.mozilla.xul+xml"],
    [".zip", "application/zip"],
    [".3gp", "video/3gpp"],
    [".3g2", "video/3gpp2"],
    [".7z", "application/x-7z-compressed"],
];

export function contentType(ext: string): string {
    return contentTypes.find((c) => c[0] === ext)?.[1] || "text/plain";
}

const allowed_elements = /* @__PURE__*/ new Set<string>([...tags, ...hanabi_tags]);

export function validateElementName(name: string): boolean {
    return allowed_elements.has(name.toLowerCase());
}

const allowed_attribute_names = /* @__PURE__*/ new Set<string>(attribute_names);

export function validateAttributeKey(key: string): boolean {
    return allowed_attribute_names.has(key.toLowerCase()) || key.toLowerCase().startsWith("data-");
}

const allowed_property_names = /* @__PURE__*/ new Set<string>(property_names);

export function validatePropertyName(name: string): boolean {
    return allowed_property_names.has(name);
}

export function sanitizeAttributeValue(key: string): (value: string) => string {
    return (value: string) => {
        if (!validateAttributeKey(key)) {
            throw new Error(`Attribute '${key}' is not allowed`);
        }

        if (value.length > 1024 * 1024) {
            throw new Error(`Attribute '${key}' value is too long: < 1MByte is allowed.`);
        }

        const lowerKey = key.toLowerCase();

        if (lowerKey.startsWith("on")) {
            throw new Error(`Event handler attributes are not allowed: ${key}`);
        }

        if (lowerKey === "style") {
            throw new Error("Style attribute is not allowed");
        }

        if (lowerKey === "href" || lowerKey === "src") {
            return sanitizeURLAttribute(value);
        }

        if (lowerKey === "srcset") {
            const srcsetEntries = value.split(",").map((entry) => entry.trim());
            for (const entry of srcsetEntries) {
                const urlPart = entry.split(/\s+/)[0];
                if (urlPart) {
                    sanitizeURLAttribute(urlPart);
                }
            }
            return value;
        }

        return sanitizeBasic(value);
    };
}

export function sanitizeURLAttribute(value: string): string {
    const decodedValue = decodeURIComponent(value);

    const forbiddenPattern = /(^|\/)\.\.(\/|$)/;
    if (forbiddenPattern.test(decodedValue)) {
        throw new Error('Path traversal is not allowed. Do not use ".." as a path(url, src, srcset).');
    }

    if (/[<>"']/.test(decodedValue)) {
        throw new Error("Invalid characters in URL. Do not use <>\"'.");
    }

    let url: URL;
    try {
        url = new URL(decodedValue);
    } catch (e) {
        if (e instanceof TypeError) {
            url = new URL(decodedValue, "https://localhost"); // this url is dummy. for sanity check only.
        } else {
            throw e;
        }
    }

    const allowedProtocols = ["http:", "https:", "mailto:", "tel:", "ftp:"];
    if (url.protocol === "data:") {
        if (!/^data:image\/(png|jpeg|gif|webp);base64,/.test(decodedValue)) {
            throw new Error("Invalid data URL. only data:image/png,jpg,gif,webp is allowed.");
        }
    } else if (!allowedProtocols.includes(url.protocol)) {
        throw new Error(`Invalid protocol: ${url.protocol}`);
    }

    // all inappropriate URLs throw Error. return original value.
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
