import { defineConfig } from "tsup";

export default defineConfig({
    entry: {
        "hanabi-lib": "src/main.ts",
        "hanabi": "src/bin.ts",
    },
    sourcemap: false,
    minify: true,
    splitting: false,
    clean: true,
    dts: true,
    format: ["esm"],
    outDir: "build",
});
