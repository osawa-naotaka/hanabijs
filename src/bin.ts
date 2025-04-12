#!/usr/bin/env -S node --watch

import { readFileSync } from "node:fs";
import path from "node:path";
import { cwd, exit } from "node:process";
import { parseArgs } from "node:util";
import { build } from "./cli/build";
import { serve } from "./cli/serve";

function getVersion() {
    try {
        const packagePath = path.join(cwd(), "package.json");
        const packageJson = JSON.parse(readFileSync(packagePath, "utf-8"));
        return packageJson.version || "unknown";
    } catch (error) {
        console.error("Warning: Could not read version from package.json");
        return "unknown";
    }
}

const VERSION = getVersion();
const PROGRAM_NAME = "hanabi";

function showHelp() {
    console.log(`
${PROGRAM_NAME} - Static site generator

Usage: 
  ${PROGRAM_NAME} <command> [options]

Commands:
  build       Build the static site
  dev         Start a preview server

Options:
  -c, --config <path>   Specify a custom config file path
  -h, --help            Show this help message
  -v, --version         Show version information

Examples:
  ${PROGRAM_NAME} build                        Build site with default config
  ${PROGRAM_NAME} dev                          Start preview server with default config
  ${PROGRAM_NAME} build --config my.config.ts  Build with custom config
`);
}

function showVersion() {
    console.log(`${PROGRAM_NAME} version ${VERSION}`);
}

async function main() {
    try {
        const args = parseArgs({
            allowPositionals: true,
            options: {
                config: {
                    type: "string",
                    short: "c",
                    description: "Specify a custom config file path",
                },
                help: {
                    type: "boolean",
                    short: "h",
                    description: "Show help information",
                },
                version: {
                    type: "boolean",
                    short: "v",
                    description: "Show version information",
                },
            },
        });

        if (args.values.help) {
            showHelp();
            exit(0);
        }

        if (args.values.version) {
            showVersion();
            exit(0);
        }

        if (args.positionals.length === 0) {
            showHelp();
            exit(1);
        }

        const command = args.positionals[0];

        switch (command) {
            case "build":
                await build(args.values.config);
                exit(0);
                break;

            case "dev":
                await serve(args.values.config);
                break;

            default:
                console.error(`Error: Unknown command '${command}'`);
                console.log("\nRun 'hanabi --help' for usage information");
                exit(1);
        }
    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
        } else {
            console.error(e);
        }
        exit(1);
    }
}

await main();
