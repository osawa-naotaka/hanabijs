import { defineConfig } from "tsup";

export default defineConfig({
    entry: {
        "hanabi": "src/bin.ts",
        "core/main": "src/core.ts",
        "server/main": "src/server.ts",
        "jsx-runtime/main": "src/jsx-runtime.ts",
        "jsx-dev-runtime/main": "src/jsx-dev-runtime.ts",
    },
    sourcemap: false,
    minify: true,
    splitting: false,
    clean: true,
    dts: true,
    format: ["esm"],
    outDir: "build",
});
