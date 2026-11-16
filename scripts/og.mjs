#!/usr/bin/env node
/**
 * Generates the social preview image and the Apple touch icon from the site's
 * own design language, so the artwork can never drift away from the page.
 *
 *   node scripts/build.mjs && node scripts/serve.mjs &
 *   node scripts/og.mjs
 *
 * The screenshots are taken through scripts/shot.mjs, so the same browser that
 * verifies the page also produces the assets. Output lands in public/, which
 * the next build copies into dist/.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { invitation } from "../src/config.js";
import { buildInviteContext } from "../src/lib/derive.js";
import { arch, divider } from "../src/components/ornaments.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const publicDir = path.join(root, "public");
const base = process.env.SITE_URL || "http://localhost:4173";

const ctx = buildInviteContext(invitation);
const e = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// The Islamic lattice lives in one place (global.css); read it back so the
// social card uses exactly the same motif as the page.
const globalCss = fs.readFileSync(path.join(root, "src/styles/global.css"), "utf8");
const pattern = (globalCss.match(/--pattern-islamic:\s*(url\("[^"]+"\))/) || [])[1] || "none";

const fonts =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Manrope:wght@300;400;500;600&family=Amiri:wght@400;700&display=swap";

const shell = (body, css) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Asset generator</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<style>${css}</style>
</head>
<body>${body}</body>
</html>`;

/* ── Social card (1200 × 630) ─────────────────────────────────────────────── */

const ogCss = `
:root{--soft:#f8f6f1;--ink:#292725;--body:#4f4b45;--muted:#6b655d;--accent:#b9a477;--line:#d5c5a5}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{display:grid;place-items:center;background:var(--soft);font-family:"Manrope",sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.card{position:relative;width:1200px;height:630px;display:grid;place-items:center;background:
  radial-gradient(ellipse 62% 78% at 50% 34%,#fffefc 0%,rgba(255,254,252,.78) 46%,rgba(248,246,241,0) 78%),
  linear-gradient(180deg,#fffefc,#f2eee6)}
.pattern{position:absolute;inset:0;background-image:${pattern};background-size:150px;opacity:.5;
  -webkit-mask-image:radial-gradient(ellipse 70% 74% at 50% 46%,#000 6%,rgba(0,0,0,.35) 62%,transparent 84%)}
.arch{position:absolute;inset:8px 150px -60px;color:var(--accent)}
.arch path{vector-effect:non-scaling-stroke;fill:none}
.arch .arch__wash{fill:url(#arch-wash-og);stroke:none}
.arch .arch__outer{stroke:rgba(185,164,119,.7);stroke-width:1.3}
.arch .arch__inner{stroke:rgba(213,197,165,.62);stroke-width:.95}
.inner{position:relative;text-align:center;transform:translateY(14px)}
.bismillah{font-family:"Amiri",serif;font-size:38px;line-height:1.85;color:var(--ink)}
.meaning{font-size:12.5px;letter-spacing:.24em;text-transform:uppercase;color:var(--muted);margin-top:2px}
.divider{display:block;width:280px;height:22px;margin:18px auto 16px;color:var(--accent);opacity:.9}
.label{font-size:14px;font-weight:500;letter-spacing:.4em;text-indent:.4em;text-transform:uppercase;color:var(--muted)}
.names{font-family:"Playfair Display",serif;font-size:64px;font-weight:500;line-height:1.14;margin-top:12px;letter-spacing:.005em}
.names span{display:block}
.amp{display:block;font-family:"Cormorant Garamond",serif;font-size:26px;font-style:italic;color:var(--accent);line-height:1;margin:6px 0}
.meta{margin-top:22px;font-size:14px;letter-spacing:.13em;text-transform:uppercase;color:var(--body)}
.meta i{font-style:normal;color:var(--line);margin:0 12px}
.foot{position:absolute;bottom:26px;left:0;right:0;text-align:center;font-family:"Cormorant Garamond",serif;
  font-style:italic;font-size:17px;letter-spacing:.06em;color:var(--muted)}
`;

const ogHtml = shell(
  `<div class="card">
    <div class="pattern"></div>
    ${arch("arch", "og")}
    <div class="inner">
      <p class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
      <p class="meaning">In the name of Allah, the Most Gracious, the Most Merciful</p>
      ${divider("divider")}
      <p class="label">${e(invitation.event.label)}</p>
      <h1 class="names"><span>${e(invitation.groom.name)}</span><span class="amp">&amp;</span><span>${e(invitation.bride.name)}</span></h1>
      <p class="meta">${e(ctx.when.longDate)}<i>|</i>${e(ctx.when.time12)} ${e(
        invitation.event.timezoneLabel,
      )}<i>|</i>${e(invitation.venue.city)}, ${e(invitation.venue.state)}</p>
    </div>
    <p class="foot">With the blessings of Almighty Allah</p>
  </div>`,
  ogCss,
);

/* ── Apple touch icon (180 × 180) ─────────────────────────────────────────── */

const iconCss = `
*{box-sizing:border-box;margin:0}
html,body{width:180px;height:180px;overflow:hidden}
body{display:grid;place-items:center;background:#f8f7f5}
img{width:134px;height:134px;display:block}
`;

const iconHtml = shell('<img src="/favicon.svg" alt="">', iconCss);

/* ── Render ───────────────────────────────────────────────────────────────── */

fs.mkdirSync(dist, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(dist, "__og.html"), ogHtml);
fs.writeFileSync(path.join(dist, "__icon.html"), iconHtml);

function shot({ page, width, height, out }) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        path.join(root, "scripts/shot.mjs"),
        "--url",
        `${base}/${page}`,
        "--width",
        String(width),
        "--height",
        String(height),
        "--scale",
        "1",
        "--wait",
        "3200",
        "--out",
        out,
      ],
      { stdio: "inherit" },
    );
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`shot.mjs exited with ${code}`))));
  });
}

try {
  await shot({ page: "__og.html", width: 1200, height: 630, out: "public/og-image.png" });
  await shot({ page: "__icon.html", width: 180, height: 180, out: "public/apple-touch-icon.png" });
  console.log("✓ public/og-image.png (1200×630) and public/apple-touch-icon.png (180×180)");
} finally {
  for (const file of ["__og.html", "__icon.html"]) {
    try {
      fs.rmSync(path.join(dist, file));
    } catch (error) {
      /* already gone */
    }
  }
}
