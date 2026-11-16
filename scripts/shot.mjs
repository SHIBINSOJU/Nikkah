#!/usr/bin/env node
/**
 * Design QA helper — drives a local Chromium (Brave/Chrome) over the DevTools
 * protocol to capture accurate screenshots at any viewport, including full-page.
 *
 *   node scripts/shot.mjs --url http://localhost:4173/ --width 390 --height 844 \
 *        --out shots/mobile.png --click "[data-open]" --wait 1600
 *
 * Flags: --url --width --height --out --full --click <selector> --wait <ms>
 *        --reduced (emulate prefers-reduced-motion) --scroll <y>
 *        --section <selector> (scroll an element to the top of the viewport)
 *        --scale <n> (device pixel ratio for the capture, default 2)
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, arg, index, all) => {
    if (arg.startsWith("--")) {
      const next = all[index + 1];
      acc.push([arg.slice(2), !next || next.startsWith("--") ? true : next]);
    }
    return acc;
  }, []),
);

const url = args.url || "http://localhost:4173/";
const width = Number(args.width) || 390;
const height = Number(args.height) || 844;
const scale = Number(args.scale) || 2;
const outFile = path.resolve(args.out || "shots/screenshot.png");
const wait = Number(args.wait) || 1200;
const fullPage = Boolean(args.full);
const reduced = Boolean(args.reduced);

const CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
].filter(Boolean);

const binary = CANDIDATES.find((candidate) => fs.existsSync(candidate));
if (!binary) {
  console.error("No Chromium-based browser found. Set CHROME_PATH.");
  process.exit(1);
}

const port = 9333 + Math.floor(Math.random() * 200);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "shot-profile-"));

const browser = spawn(
  binary,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function targetSocket() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await response.json();
      const page = targets.find((target) => target.type === "page");
      if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch (error) {
      /* browser still booting */
    }
    await sleep(150);
  }
  throw new Error("Could not connect to the browser");
}

const socketUrl = await targetSocket();
const socket = new WebSocket(socketUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 1;
const pending = new Map();
const events = new Map();

socket.addEventListener("message", (message) => {
  const data = JSON.parse(message.data);
  if (data.id && pending.has(data.id)) {
    const { resolve, reject } = pending.get(data.id);
    pending.delete(data.id);
    if (data.error) reject(new Error(data.error.message));
    else resolve(data.result);
    return;
  }
  if (data.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(data.params.type)) {
    console.log(`console.${data.params.type}:`, data.params.args.map((arg) => arg.value ?? arg.description).join(" "));
  }
  if (data.method === "Runtime.exceptionThrown") {
    const details = data.params.exceptionDetails;
    console.log("page error:", details.exception?.description || details.text);
  }
  if (data.method && events.has(data.method)) {
    events.get(data.method).forEach((handler) => handler(data.params));
    events.delete(data.method);
  }
});

function send(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

function once(method) {
  return new Promise((resolve) => {
    const list = events.get(method) || [];
    list.push(resolve);
    events.set(method, list);
  });
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width,
  height,
  deviceScaleFactor: scale,
  mobile: width < 900,
  screenWidth: width,
  screenHeight: height,
});
await send("Emulation.setEmulatedMedia", {
  features: [
    { name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" },
  ],
});

const loaded = once("Page.loadEventFired");
await send("Page.navigate", { url });
await loaded;
await sleep(wait);

if (args.click) {
  const selector = JSON.stringify(String(args.click));
  await send("Runtime.evaluate", {
    expression: `(() => { const el = document.querySelector(${selector}); if (!el) return "missing"; el.click(); return "clicked"; })()`,
    returnByValue: true,
  });
  await sleep(Number(args.clickWait) || 1600);
}

if (args.scroll) {
  await send("Runtime.evaluate", {
    expression: `window.scrollTo(0, ${Number(args.scroll)});`,
    returnByValue: true,
  });
  await sleep(700);
}

if (args.section) {
  await send("Runtime.evaluate", {
    expression: `(() => { const el = document.querySelector(${JSON.stringify(String(args.section))}); if (!el) return "missing"; const h = document.querySelector(".site-header"); const offset = (h ? h.offsetHeight : 0) + 16; window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - offset); return "ok"; })()`,
    returnByValue: true,
  });
  await sleep(900);
}

let clip;
if (fullPage) {
  const metrics = await send("Page.getLayoutMetrics");
  const contentSize = metrics.cssContentSize || metrics.contentSize;
  clip = { x: 0, y: 0, width: Math.ceil(contentSize.width), height: Math.ceil(contentSize.height), scale: 1 };
}

const shot = await send("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: fullPage,
  fromSurface: true,
  ...(clip ? { clip } : {}),
});

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, Buffer.from(shot.data, "base64"));
console.log(`${outFile} — ${width}×${height}${fullPage ? " (full page)" : ""}`);
console.log(
  "layout:",
  JSON.stringify(
    (
      await send("Runtime.evaluate", {
        expression:
          "({vw: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight})",
        returnByValue: true,
      })
    ).result.value,
  ),
);

socket.close();
browser.kill();
try {
  fs.rmSync(profile, { recursive: true, force: true });
} catch (error) {
  /* the browser may still be releasing its profile — safe to ignore */
}
process.exit(0);
