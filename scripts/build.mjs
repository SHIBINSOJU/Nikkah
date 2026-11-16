#!/usr/bin/env node
/**
 * Static site build.
 *
 * Reads src/config.js → renders semantic HTML → writes a self-contained
 * `dist/` folder that any static host (Cloudflare Pages included) can serve.
 * No dependencies, no client framework, no runtime templating.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { invitation } from "../src/config.js";
import { buildInviteContext, escapeHtml } from "../src/lib/derive.js";
import { head, header, footer, audio } from "../src/components/layout.js";
import { opening } from "../src/components/opening.js";
import { hero } from "../src/components/hero.js";
import { message, couple } from "../src/components/couple.js";
import { family } from "../src/components/family.js";
import { details, countdown, location, blessing } from "../src/components/details.js";
import { divider } from "../src/components/ornaments.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const e = escapeHtml;

const STYLE_ORDER = [
  "global.css",
  "typography.css",
  "components.css",
  "animations.css",
  "responsive.css",
];

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}

function buildStyles() {
  const dir = path.join(root, "src/styles");
  const css = STYLE_ORDER.map((file) => {
    const full = path.join(dir, file);
    if (!fs.existsSync(full)) throw new Error(`Missing stylesheet: ${file}`);
    return `/* ── ${file} ────────────────────────────────────────────── */\n${fs.readFileSync(full, "utf8")}`;
  }).join("\n");
  fs.writeFileSync(path.join(dist, "styles/main.css"), css);
  return css.length;
}

function jsonForScript(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/-->/g, "--\\u003e");
}

async function build() {
  const started = Date.now();
  const c = invitation;
  const ctx = buildInviteContext(c);

  fs.rmSync(dist, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  fs.mkdirSync(path.join(dist, "styles"), { recursive: true });

  copyDir(path.join(root, "public"), dist);
  const cssBytes = buildStyles();
  fs.copyFileSync(path.join(root, "src/main.js"), path.join(dist, "main.js"));

  const payload = {
    countdown: {
      target: ctx.when.instant.toISOString(),
      arrived: c.countdown.arrived,
      past: c.countdown.past,
    },
    share: {
      template: ctx.shareMessage,
      copied: c.share.copied,
      copyFailed: c.share.copyFailed,
    },
    calendar: {
      ics: ctx.calendar.ics,
      filename: ctx.calendar.filename,
    },
    music: { src: c.music.src, title: c.music.title },
    personalization: { greeting: c.personalization?.greeting || "" },
    rsvp: {
      whatsapp: c.rsvp?.whatsapp || "",
      message: c.rsvp?.message || "",
    },
    couple: ctx.couple,
  };

  const html = `${head(c, ctx)}
${opening(c, ctx)}
${header(c)}
${hero(c, ctx)}
${message(c)}
${couple(c)}
${family(c)}
${details(c, ctx)}
${countdown(c, ctx)}
${location(c)}
${blessing(c)}
</main>
${footer(c, ctx)}
${audio(c)}
<script type="application/json" id="invitation-data">${jsonForScript(payload)}</script>
<script src="/main.js" defer></script>
</body>
</html>
`;

  fs.writeFileSync(path.join(dist, "index.html"), html);

  // SEO extras
  fs.writeFileSync(
    path.join(dist, "robots.txt"),
    ["User-agent: *", "Allow: /", c.site.url ? `Sitemap: ${c.site.url}/sitemap.xml` : ""]
      .filter(Boolean)
      .join("\n") + "\n",
  );

  if (c.site.url) {
    fs.writeFileSync(
      path.join(dist, "sitemap.xml"),
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${e(c.site.url)}</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
</urlset>
`,
    );
  }

  // A tiny 404 that returns guests to the invitation (handy if a shared link
  // has a typo), styled with the same palette.
  fs.writeFileSync(
    path.join(dist, "404.html"),
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Page not found — Nikkah Invitation</title>
<link rel="stylesheet" href="/styles/main.css">
</head><body class="error-page">
<main class="error-page__inner">
  ${divider("divider--section")}
  <p class="eyebrow">Nikkah Invitation</p>
  <h1>This page has wandered off</h1>
  <p class="error-page__text">The invitation is waiting for you on the home page.</p>
  <a class="btn btn--primary" href="/">Return to the invitation</a>
</main>
</body></html>
`,
  );

  const sizeKb = (fs.statSync(path.join(dist, "index.html")).size / 1024).toFixed(1);
  console.log(
    `✓ Built ${c.groom.name} & ${c.bride.name} — index.html ${sizeKb} kB, styles ${(cssBytes / 1024).toFixed(1)} kB, ${Date.now() - started} ms`,
  );
  console.log(`  Event: ${ctx.when.longDate}, ${ctx.when.time12} ${c.event.timezoneLabel} (${ctx.when.instant.toISOString()})`);
  console.log(`  → ${path.relative(root, dist)}/`);
}

await build();
