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
