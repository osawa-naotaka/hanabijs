#!/usr/bin/env -S bun --watch

import { exit } from "node:process";
import { build } from "./cli/build";
import { serve } from "./cli/serve";

async function main() {
    const cmd = process.argv[2];

    if (cmd === "build") {
        await build();
        exit(0);
    } else if (cmd === "dev") {
        await serve();
    } else {
        console.log("Usage: hanabi <command>");
        console.log("Commands:");
        console.log("  build   Build the static site");
        console.log("  dev     Start a preview server");
    }
}

try {
    await main();
} catch (e) {
    console.error(e);
    exit(-1);
}
