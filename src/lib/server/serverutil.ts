import { globSync } from "glob";

export function globExt(base: string, ext: string): string[] {
    return globSync(`**/*${ext}`, { cwd: base, nodir: true });
}
