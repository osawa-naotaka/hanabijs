import { cwd } from "node:process";
import type { Store } from "@/core";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import virtual from "@rollup/plugin-virtual";
import esbuild from "esbuild";
import { rollup } from "rollup";

export async function bundleScriptEsbuild(store: Store): Promise<string | null> {
    const script_files = Array.from(store.components.values())
        .map((x) => x.attachment?.script)
        .filter((x) => x !== undefined);

    if (script_files.length === 0) {
        return null;
    }

    const entry = `import { generateStore } from "@/core"; const store = generateStore(); ${script_files.map((x, idx) => `import scr${idx} from "${x}"; await scr${idx}(store)();`).join("\n")}`;
    const bundle = await esbuild.build({
        stdin: {
            contents: entry,
            loader: "ts",
            resolveDir: cwd(),
        },
        // supress esbuild warning not to define import.meta in browser.
        define: {
            "import.meta.path": "undefined",
        },
        bundle: true,
        format: "esm",
        platform: "browser",
        target: "es2024",
        treeShaking: true,
        sourcemap: false,
        write: false,
        minify: true,
    });

    return bundle.outputFiles[0].text;
}

export async function bundleScriptRollup(store: Store): Promise<string | null> {
    const script_files = Array.from(store.components.values())
        .map((x) => x.attachment?.script)
        .filter(Boolean);
    if (script_files.length === 0) {
        return null;
    }

    const entry = `import { generateStore } from "@/core"; const store = generateStore(); ${script_files.map((x, idx) => `import scr${idx} from "${x}"; await scr${idx}(store)();`).join("\n")}`;
    const bundle = await rollup({
        input: "entry.ts",
        treeshake: "smallest",
        plugins: [
            virtual({
                "entry.ts": entry,
            }),
            typescript(),
            terser(),
            nodeResolve(),
            commonjs(),
        ],
    });

    const { output } = await bundle.generate({ format: "esm" });
    return output[0].code;
}
