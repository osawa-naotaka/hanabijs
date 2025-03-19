import { defineConfig } from "tsup";

export default defineConfig({
    entry: {
        "hanabi-lib": "src/main.ts",
        "hanabi": "src/bin.ts",
    },
    sourcemap: true,
    clean: true,
    dts: true,
    format: ["esm"],
    outDir: "build",
});
