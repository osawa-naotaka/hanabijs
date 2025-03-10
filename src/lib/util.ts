import { Glob } from "bun";

export function replaceExt(filename: string, ext: string) {
    return filename.replace(/\.[^/.]+$/, ext);
}

export function globTs(base: string): AsyncIterableIterator<string> {
    const glob = new Glob("**/*.ts");
    return glob.scan(base);
}
