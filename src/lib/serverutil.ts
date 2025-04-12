import { glob } from "glob";

export async function globExt(base: string, ext: string): Promise<string[]> {
    return await glob(`**/*${ext}`, { cwd: base });
}
