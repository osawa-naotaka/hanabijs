import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { cwd } from "node:process";
import type { Store } from "@/core";
import type { Svg } from "svg2woff2";
import { generateCss, svg2woff2 } from "svg2woff2";

type SvgName = {
    name: string;
    src: string;
};

export async function bundleWoff2(store: Store): Promise<Buffer | null> {
    const svg_names = listSvgNames(store);

    const svgs: Svg[] = await Promise.all(
        svg_names.map(async (n) => {
            const content = (await readFile(n.src)).toString();
            return { name: n.name, content };
        }),
    );

    if (svgs.length === 0) {
        return null;
    }

    const woff2 = await svg2woff2(svgs, {
        svg_font_opt: {
            font_family: "fontawesome free generated",
            ascent: 460,
            descent: -74,
            units_per_em: 512,
            horiz_adv_x: 641,
            vert_adv_y: 641,
        },
        ttf_font_opt: {
            version: "1.0",
            description: "fontawesome free font generated by hanabijs from svgs",
            url: "https://github.com/osawa-naotaka/hanabijs.git",
        },
    });

    return woff2;
}

export function generateFontCss(store: Store, base_name: string): string {
    const svg_names: Svg[] = listSvgNames(store).map((n) => ({ name: n.name, content: "" }));

    return generateCss(svg_names, {
        font_family: "fontawesome free generated",
        vertical_align: "-.125em",
        font_url: `${base_name}.woff2`,
    });
}

function listSvgNames(store: Store): SvgName[] {
    const font_components = Array.from(store.components.values())
        .map((x) => x.attachment?.fonts)
        .filter((x) => x !== undefined);

    return font_components.flatMap((component) =>
        component.flatMap((chars) => {
            const require = createRequire(import.meta.url);
            const base_dir =
                chars.package_name !== undefined
                    ? path.dirname(require.resolve(`${chars.package_name}/package.json`))
                    : cwd();
            return chars.chars.map((c) => ({ name: c.name, src: path.join(base_dir, c.src) }));
        }),
    );
}
