#!/usr/bin/env node
/**
 * Development loop: build once, serve, rebuild on any change in src/ or public/.
 * The browser is not auto-refreshed — reload to see the update.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function runBuild() {
  return new Promise((resolve) => {
    const build = spawn(process.execPath, [path.join(root, "scripts/build.mjs")], {
      stdio: "inherit",
    });
    build.on("close", () => resolve());
  });
}

await runBuild();

spawn(process.execPath, [path.join(root, "scripts/serve.mjs")], { stdio: "inherit" });

let queued = null;
const rebuild = () => {
  clearTimeout(queued);
  queued = setTimeout(async () => {
    console.log("↻ change detected — rebuilding");
    await runBuild();
  }, 120);
};

for (const dir of ["src", "public"]) {
  const target = path.join(root, dir);
  if (!fs.existsSync(target)) continue;
  fs.watch(target, { recursive: true }, rebuild);
}

console.log("  Watching src/ and public/ for changes…\n");
