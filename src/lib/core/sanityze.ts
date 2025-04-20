import { attribute_names, hanabi_tags, tags } from "@/lib/core/elements";

const allowed_elements = /* @__PURE__*/ new Set<string>([...tags, ...hanabi_tags]);

export function validateElementName(name: string): boolean {
    return allowed_elements.has(name.toLowerCase());
}

const allowed_attribute_names = /* @__PURE__*/ new Set<string>(attribute_names);

export function validateAttributeKey(key: string): boolean {
    return allowed_attribute_names.has(key.toLowerCase()) || key.toLowerCase().startsWith("data-");
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
