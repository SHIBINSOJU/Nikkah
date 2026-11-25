# Shibil Hussain MK & Hiba Thesni — Nikkah Invitation

A single-page, photograph-free Nikkah invitation for **24 January 2027**, Kondotty,
Malappuram. Everything is generated at build time into plain HTML, CSS and a small
amount of JavaScript — no framework, no backend, no database, no external assets
other than the Google Fonts stylesheet.

The design language is a hand-drawn mihrab arch, layered roses, hanging lanterns and
a mosque skyline, all authored as inline SVG, over a white-and-silver palette with
Playfair Display, Cormorant Garamond, Manrope, Amiri and Noto Sans Malayalam.

---

## 1. Run it locally

Requires **Node 18 or newer**. There are no dependencies to install.

```bash
npm run dev        # builds, serves http://localhost:4173 and rebuilds on change
npm run build      # one-off production build into dist/
npm run preview    # serves the existing dist/ on http://localhost:4173
```

`npm run dev` watches `src/` and `public/`; refresh the browser after a change.

---

## 2. Where everything lives

```
src/
  config.js                 ← ALL invitation content lives here
  lib/derive.js             date/time formatting, Google Calendar + .ics builders
  components/
    ornaments.js            arch, crest, divider, roses, lanterns, skyline, icon sprite
    layout.js               <head>, header, footer, audio element
    opening.js              the "Open Invitation" curtain
    hero.js                 the arch hero
    couple.js               invitation message panel + couple introduction
    family.js               family cards (empty members are never rendered)
    details.js              event details, live countdown, location, blessing
  main.js                   opening, countdown, share, copy, .ics, reveals, music
  styles/
    global.css              tokens, reset, layout, buttons, header, footer
    typography.css          type scale for every section
    components.css          section composition
    animations.css          motion + reduced-motion behaviour
    responsive.css          breakpoints from 320 px to 1920 px
public/                     favicon.svg, webmanifest, og-image.png, apple-touch-icon.png
scripts/
  build.mjs                 renders src/ → dist/
  serve.mjs                 tiny static server (port 4173)
  dev.mjs                   build + serve + watch
  shot.mjs                  DevTools-protocol screenshots for design QA
  og.mjs                    regenerates the social card + Apple touch icon
dist/                       build output — deploy this folder
```

`dist/` is disposable. Never edit it; edit `src/` and rebuild.

---

## 3. Editing the invitation

Open **`src/config.js`** and change values. Run `npm run build` (or leave
`npm run dev` running) and every section updates together.

### Couple and family

```js
groom: { name: "…", shortName: "…", father: "…", mother: "…", photo: "" },
bride: { name: "…", shortName: "…", father: "",  mother: "",  photo: "" },
```

* **Missing family details** — leave the value as `""`. That person is dropped from the
  card, and if a whole side is empty the card itself disappears and the layout
  re-centres around the remaining family. Nothing ever reads "TBD" or "Unknown", and
  the family heading switches between "Our Family" and "Our Families" automatically.
* **To complete the bride's family**, fill `bride.father` / `bride.mother` and rebuild.

### Date, time, timezone

```js
event: {
  date: "2027-01-24",
  time: "11:30",              // 24-hour clock
  timezone: "Asia/Kolkata",   // IANA name — used by the countdown and calendar
  timezoneLabel: "IST",
  timezoneName: "Indian Standard Time",
  durationMinutes: 180,
}
```

The weekday, the formatted date, the countdown target, the Google Calendar link and
the downloadable `.ics` file are all derived from these six values, so they can never
disagree. Change the timezone and every output follows.

### Venue and map

```js
venue: {
  name: "Bride’s Residence",
  city: "Kondotty",
  district: "Malappuram",
  state: "Kerala",
  country: "India",
  mapsUrl: "",                                  // ← paste the Google Maps link here
}
```

While `mapsUrl` is empty the **View Location** button is disabled and a quiet note
("Location details will be shared soon.") is shown instead. As soon as you paste the
link, the button becomes a working "Open in Google Maps" action and the note
disappears.

### Text, languages, share message, music

* `invitation.message.en` / `.ml` — arrays of paragraphs; set
  `invitation.language` to `"en"`, `"ml"` or `"mixed"`.
* `share.message` — the WhatsApp text. Placeholders `{couple}`, `{date}`, `{time}`,
  `{venue}`, `{city}` and `{url}` are filled automatically; `{url}` resolves to the
  live address at runtime.
* `music.src` — leave empty to hide the music button entirely. Point it at an MP3 and
  the button appears, off by default.

### Personalization, RSVP, guest notes, QR card

* `personalization.greeting` — share the link as `https://…/?to=Rahman%20Family` and the
  opening greets that guest ("Dear Rahman Family,"). Works together with the share
  button: each recipient can be sent their own personalized link.
* `rsvp.whatsapp` — a WhatsApp number in international format, digits only (e.g.
  `"919400000000"`). Fills in a **Confirm Attendance** button in the footer that opens a
  chat with a pre-filled message (`rsvp.message`; `{guest}` and `{couple}` tokens are
  replaced at runtime). Leave empty to hide the button.
* `guestNotes.notes` — a list like `{ icon: "clock", text: "Kindly be seated by 10:30 AM." }`
  for dress code, parking, directions, etc. Shown under the Location section; the whole
  block stays hidden while the list is empty. Available icons: `clock`, `pin`, `info`,
  `check`, `chat`, `calendar`.
* **QR card** — once `site.url` is set, `npm run build` downloads a QR code for the site
  into the footer ("Scan to open the invitation"), useful for printed invitations. The
  build needs network access; if the download fails it prints a note and skips the card.

### Social preview

`site.url` should be set to the deployed URL (e.g. `https://shibil-hiba.pages.dev`)
so the canonical link, Open Graph and Twitter tags become absolute. `site.ogImage`
points at `/og-image.png`.

To regenerate the 1200×630 social card and the 180×180 Apple touch icon after changing
names or wording, run this **while the preview server is running**:

```bash
npm run preview      # in one terminal
npm run og           # in another — writes public/og-image.png + apple-touch-icon.png
npm run build        # copies them into dist/
```

Both images are rendered from the site's own SVG ornaments and CSS, so they can never
drift away from the page design.

---

## 4. Deploying to Cloudflare Pages

1. Push this repository to GitHub/GitLab.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Build settings:
   * **Framework preset:** None
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
   * **Node version:** 18 or newer (set `NODE_VERSION=20` under environment variables
     if the default is older).
4. Deploy, then set `site.url` in `src/config.js` to the assigned domain and redeploy so
   the canonical and social tags are absolute.

Any static host works the same way — Netlify, Vercel, GitHub Pages, an S3 bucket or
plain nginx. Upload the contents of `dist/`.

`dist/robots.txt`, `dist/sitemap.xml` and `dist/404.html` are generated automatically.

---

## 5. What is included

* **Opening curtain** — bismillah, names and an "Open Invitation" button, dismissed
  with a click, `Esc`, or automatically when the URL already points at a section. The
  page behind it is `inert` with a proper focus trap while the curtain is up, and the
  curtain is skipped entirely when JavaScript is unavailable.
* **Hero** — pointed mihrab arch, two swaying lanterns, corner roses, mosque skyline,
  bismillah, both names, Malayalam line and the date / time / place summary.
* **Message** — the English and Malayalam invitation in a double-ruled panel, signed by
  the groom's family.
* **Couple** — groom and bride with Malayalam role names (cards, not photographs).
* **Family** — the groom's parents, presented without inventing anything about the
  bride's family.
* **Details** — date, time (with the human-readable timezone) and venue, plus
  **Add to Calendar** (Google Calendar) and an Apple/Outlook `.ics` download.
* **Live countdown** — days, hours, minutes and seconds in English and Malayalam,
  corrected for `Asia/Kolkata` regardless of the visitor's clock, with polite
  "today" and "has passed" states.
* **Location** — a typographic place card plus the map-link state described above, and
  the optional guest-notes panel (dress code, parking, contact numbers).
* **Blessing** — the Arabic dua, its English translation and a Malayalam blessing.
* **Footer** — optional WhatsApp RSVP, Share (Web Share API with a WhatsApp fallback),
  Copy link with a toast confirmation, Back to top, and — once `site.url` is set — a
  printable QR card.

### Accessibility and performance

* Semantic landmarks, one `<h1>`, labelled sections, `sr-only` helpers, visible focus
  rings, 44 px minimum touch targets and iOS safe-area padding.
* `lang`/`dir` set correctly for Arabic and Malayalam; letter-spacing is switched off on
  both scripts so conjuncts and vowel signs are never broken apart.
* Full `prefers-reduced-motion` support — animations and reveals collapse to a
  static page.
* No images in the page flow, no icon fonts, no runtime framework: one HTML file, one
  CSS file and one small deferred script from the same origin. Fonts are the only
  third-party request.

### Design QA helpers

`npm run shot` drives a local Chromium-based browser (Chrome, Brave, Edge or Chromium)
through the DevTools protocol, so screenshots match the real CSS pixel viewport:

```bash
npm run shot -- --url http://localhost:4173/ --width 390 --height 844 \
  --out shots/mobile.png --click "[data-open]" --wait 1600

npm run shot -- --url http://localhost:4173/ --width 1440 --height 900 \
  --out shots/desktop.png --section "#details"
```

Flags: `--width --height --out --full --click <selector> --clickWait <ms> --wait <ms>
--section <selector> --scroll <y> --scale <n> --reduced`. Console errors and uncaught
exceptions are printed to the terminal.
