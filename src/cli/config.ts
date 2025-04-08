import { existsSync } from "node:fs";
import path from "node:path";
import { cwd } from "node:process";
import { type DesignRule, default_design_rule } from "@/lib/design";

export type AssetConfig = {
    target_prefix: string;
};

export type HanabiConfig = {
    server: {
        hostname: string;
        port: number;
        watch_dir: string;
    };
    input: {
        page_dir: string;
        public_dir: string;
    };
    output: {
        clean_befor_build: boolean;
        dist_dir: string;
    };
    asset: AssetConfig;
    designrule: DesignRule;
};

const defaultConfig: HanabiConfig = {
    server: {
        hostname: "localhost",
        port: 4132,
        watch_dir: "site",
    },
    input: {
        page_dir: "site/pages",
        public_dir: "site/public",
    },
    output: {
        clean_befor_build: true,
        dist_dir: "dist",
    },
    asset: {
        target_prefix: "/assets",
    },
    designrule: default_design_rule,
};

export function defineConfig(config: Partial<HanabiConfig>): HanabiConfig {
    return { ...config, ...defaultConfig };
}

export async function loadConfig(relative_path?: string): Promise<HanabiConfig> {
    const abs_path = path.join(cwd(), relative_path || "hanabi.config.ts");
    if (!existsSync(abs_path)) {
        if (relative_path !== undefined) {
            console.warn(`hanabi.js: config file "${abs_path}" is not found. use default.`);
        }
        return defaultConfig;
    }

    try {
        const config = await import(abs_path);
        if (typeof config.default !== "object") {
            console.warn(`hanabi.js: config file "${abs_path}" has no default export. use default configuration.`);
            return defaultConfig;
        }
        return config.default;
    } catch (_e) {
        console.warn(`hanabi.js: fail to read config file "${abs_path}". use default.`);
        return defaultConfig;
    }
}
