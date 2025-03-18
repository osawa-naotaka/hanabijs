import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import type { RollupOptions } from "rollup";
import { dts } from "rollup-plugin-dts";

const config: RollupOptions[] = [
    {
        input: "src/main.ts",
        output: {
            file: "build/hanabi-lib.d.ts",
            format: "es",
        },
        plugins: [typescript(), dts()],
    },
    {
        input: "src/main.ts",
        output: {
            file: "build/hanabi-lib.js",
            format: "es",
        },
        plugins: [typescript(), terser()],
        external: [
            "rehype-stringify",
            "remark-frontmatter",
            "remark-gfm",
            "remark-parse",
            "remark-rehype",
            "remark-toc",
            "unified",
        ]
    },
    {
        input: "src/bin.ts",
        output: {
            file: "build/hanabi.js",
            format: "es",
        },
        plugins: [typescript(), terser()],
        external: [
            "node:process",
            "node:fs",
            "node:fs/promises",
            "node:path",
            "esbuild",
            "chokidar",
            "rehype-stringify",
            "remark-frontmatter",
            "remark-gfm",
            "remark-parse",
            "remark-rehype",
            "remark-toc",
            "unified",
        ]
    },
];

export default config;
