import { build } from "./cli/build";
import { serve } from "./cli/serve";

async function main() {
  const cmd = process.argv[2];

  if (cmd === "build") {
    await build();
  } else if (cmd === "dev") {
    await serve();
  } else {
    console.log("Usage: hanabi <command>");
    console.log("Commands:");
    console.log("  build   Build the static site");
    console.log("  dev     Start a preview server");
  }
}

main();
