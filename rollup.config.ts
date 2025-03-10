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
    },
    {
        input: "src/cli/build.ts",
        output: {
            file: "build/hanabi-build.js",
            format: "es",
        },
        plugins: [typescript(), terser()],
    },
    {
        input: "src/cli/serve.ts",
        output: {
            file: "build/hanabi-serve.js",
            format: "es",
        },
        plugins: [typescript(), terser()],
    },
];

export default config;
