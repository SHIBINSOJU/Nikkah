import { escapeHtml } from "../lib/derive.js";
import { sprite, crest, divider, florals } from "./ornaments.js";

const e = escapeHtml;

export function head(c, ctx) {
  const { site, event, venue } = c;
  const absolute = (path) => (site.url ? new URL(path, site.url).href : path);
  const ogImage = absolute(site.ogImage);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${event.title} — ${ctx.couple}`,
    startDate: ctx.when.instant.toISOString(),
    endDate: new Date(ctx.when.instant.getTime() + event.durationMinutes * 60000).toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: site.description,
    image: [ogImage],
    url: site.url || undefined,
    inLanguage: ["en", "ar"],
    location: {
      "@type": "Place",
      name: venue.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: venue.city,
        addressRegion: `${venue.district}, ${venue.state}`,
        addressCountry: "IN",
      },
    },
    organizer: { "@type": "Person", name: `${c.groom.name} & ${c.bride.name}` },
  };

  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${e(site.title)}</title>
<meta name="description" content="${e(site.description)}">
<meta name="keywords" content="${e(site.keywords)}">
<meta name="author" content="${e(c.groom.name)} &amp; ${e(c.bride.name)}">
<meta name="theme-color" content="${e(site.themeColor)}">
<meta name="color-scheme" content="light">
<meta name="format-detection" content="telephone=no">
${site.url ? `<link rel="canonical" href="${e(site.url)}">` : ""}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${e(site.title)}">
<meta property="og:locale" content="${e(site.locale)}">
<meta property="og:title" content="${e(site.title)}">
<meta property="og:description" content="${e(site.description)}">
<meta property="og:image" content="${e(ogImage)}">
<meta property="og:image:secure_url" content="${e(ogImage)}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${e(`${c.groom.name} & ${c.bride.name} — Nikkah invitation`)}">
${site.url ? `<meta property="og:url" content="${e(site.url)}">` : ""}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${e(site.title)}">
<meta name="twitter:description" content="${e(site.description)}">
<meta name="twitter:image" content="${e(ogImage)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&amp;family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&amp;family=Manrope:wght@300;400;500;600&amp;family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&amp;display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&amp;family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&amp;family=Manrope:wght@300;400;500;600&amp;family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&amp;display=swap">
<link rel="stylesheet" href="/styles/main.css">
<script>document.documentElement.className=document.documentElement.className.replace("no-js","js");</script>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body id="top">
<a class="skip-link" href="#message">Skip to the invitation</a>
${sprite()}
`;
}

export function header(c) {
  const links = c.nav
    .map(
      (item) =>
        `<li><a class="site-nav__link" href="${e(item.href)}">${e(item.label)}</a></li>`,
    )
    .join("");

  return `<header class="site-header" data-header>
    <div class="site-header__inner">
      <a class="brand" href="#top" aria-label="${e(c.groom.name)} and ${e(c.bride.name)} — back to top">
        <span class="brand__mark" aria-hidden="true">
          <svg viewBox="0 0 34 44" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M2 42V18C2 13 4.6 9 9 6C13 3.4 15.6 1.8 17 0C18.4 1.8 21 3.4 25 6C29.4 9 32 13 32 18V42"/>
            <path d="M8 42V20C8 16.6 9.8 13.8 13 11.4L17 8.4L21 11.4C24.2 13.8 26 16.6 26 20V42"/>
            <path d="M17 33.4L19.6 36.8L17 40.2L14.4 36.8Z"/>
          </svg>
        </span>
        <span class="brand__text">
          <span class="brand__title">Nikkah Invitation</span>
          <span class="brand__sub">${e(c.groom.shortName)} &amp; ${e(c.bride.shortName)}</span>
        </span>
      </a>

      <nav class="site-nav" aria-label="Invitation sections">
        <ul class="site-nav__list">${links}</ul>
      </nav>

      <div class="site-header__actions">
        ${
          c.music.src
            ? `<button class="btn btn--icon" type="button" data-music aria-pressed="false" aria-label="Play background music">
                 <svg class="icon" aria-hidden="true"><use href="#i-music-off"/></svg>
               </button>`
            : ""
        }
        <button class="btn btn--icon btn--share" type="button" data-share aria-label="Share this invitation">
          <svg class="icon" aria-hidden="true"><use href="#i-share"/></svg>
          <span class="btn__text">Share</span>
        </button>
      </div>
    </div>
  </header>`;
}

export function footer(c, ctx) {
  const rsvpNumber = String((c.rsvp && c.rsvp.whatsapp) || "").replace(/\D/g, "");
  const rsvpButton = rsvpNumber
    ? `<a class="btn btn--primary" data-rsvp href="https://wa.me/${e(rsvpNumber)}" target="_blank" rel="noopener noreferrer">
         <svg class="icon" aria-hidden="true"><use href="#i-chat"/></svg>
         <span>${e((c.rsvp && c.rsvp.label) || "Confirm Attendance")}</span>
       </a>`
    : "";

  return `<footer class="site-footer" id="footer">
    <div class="container container--narrow">
      <div class="reveal reveal--scale">
        ${divider("divider--footer")}
      </div>
      <p class="site-footer__couple reveal reveal--up">${e(c.groom.name)} <span aria-hidden="true">&amp;</span> ${e(c.bride.name)}</p>
      <p class="site-footer__meta reveal reveal--up reveal-delay-1">${e(ctx.when.longDate)} · ${e(c.venue.city)}, ${e(c.venue.state)}</p>

      <div class="site-footer__actions reveal reveal--up reveal-delay-1">
        ${rsvpButton}
        <button class="btn btn--ghost" type="button" data-share>
          <svg class="icon" aria-hidden="true"><use href="#i-share"/></svg>
          <span>Share Invitation</span>
        </button>
        <button class="btn btn--ghost" type="button" data-copy>
          <svg class="icon" aria-hidden="true"><use href="#i-link"/></svg>
          <span>Copy Link</span>
        </button>
        <a class="btn btn--ghost" href="#top">
          <svg class="icon" aria-hidden="true"><use href="#i-arrow-up"/></svg>
          <span>Back to Top</span>
        </a>
      </div>

      <p class="site-footer__note reveal reveal--up reveal-delay-2">Made with love, gratitude, and prayers for our family.</p>
    </div>

    <div class="toast" data-toast role="status" aria-live="polite"></div>
  </footer>`;
}

export function audio(c) {
  if (!c.music.src) return "";
  return `<audio data-audio preload="none" loop src="${e(c.music.src)}" title="${e(c.music.title)}"></audio>`;
}

export { crest, divider, florals };