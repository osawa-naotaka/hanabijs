import { attribute_names, hanabi_tags, tags } from "./elements";
import { property_names } from "./properties";

export function replaceExt(filename: string, ext: string) {
    return filename.replace(/\.[^/.]+$/, ext);
}

export function globExt(base: string, ext: string): AsyncIterableIterator<string> {
    const glob = new Bun.Glob(`**/*${ext}`);
    return glob.scan(base);
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
