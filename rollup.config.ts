import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import type { RollupOptions } from "rollup";
import { dts } from "rollup-plugin-dts";

const config: RollupOptions[] = [
    {
        input: "src/main.ts",
        output: {
            file: "build/hanabijs-lib.d.ts",
            format: "es",
        },
        plugins: [typescript(), dts()],
    },
    {
        input: "src/main.ts",
        output: {
            file: "build/hanabijs-lib.js",
            format: "es",
        },
        plugins: [typescript(), terser()],
    },
    {
        input: "src/bin.ts",
        output: {
            file: "build/hanabijs-bin.js",
            format: "es",
        },
        plugins: [typescript(), terser()],
    },
];

export default config;
