import { escapeHtml } from "../lib/derive.js";
import { arch, divider, florals, lantern, skyline } from "./ornaments.js";

const e = escapeHtml;

export function hero(c, ctx) {
  const { when } = ctx;
  const dateShort = when.shortDate;

  return `<main id="main">
  <section class="hero" id="invitation" aria-labelledby="hero-title">
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__pattern"></div>
      <div class="hero__glow"></div>
      ${lantern("hero__lantern hero__lantern--left", 96)}
      ${lantern("hero__lantern hero__lantern--right", 140)}
      ${florals("hero__florals hero__florals--left")}
      ${florals("hero__florals hero__florals--right", true)}
      ${skyline("hero__skyline")}
    </div>

    <div class="hero__frame">
      ${arch("hero__arch")}

      <div class="hero__inner">
        <p class="arabic hero__bismillah" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p class="hero__bismillah-meaning">In the name of Allah,<br class="only-mobile"> the Most Gracious, the Most Merciful</p>

        ${divider("divider--hero")}

        <p class="eyebrow hero__kicker">${e(c.event.label)}</p>

        <h1 class="hero__names" id="hero-title">
          <span class="hero__name">${e(c.groom.name)}</span>
          <span class="hero__amp">
            <span class="hero__rule" aria-hidden="true"></span>
            <span class="hero__amp-mark">&amp;</span>
            <span class="hero__rule" aria-hidden="true"></span>
          </span>
          <span class="hero__name">${e(c.bride.name)}</span>
        </h1>

        <p class="hero__ml" lang="ml">${e(c.invitation.heroMalayalam)}</p>

        <ul class="hero__meta">
          <li class="hero__meta-item">
            <svg class="icon" aria-hidden="true"><use href="#i-calendar"/></svg>
            <span><span class="sr-only">Date: </span>${e(dateShort)}</span>
          </li>
          <li class="hero__meta-item">
            <svg class="icon" aria-hidden="true"><use href="#i-clock"/></svg>
            <span><span class="sr-only">Time: </span>${e(when.time12)} ${e(c.event.timezoneLabel)}</span>
          </li>
          <li class="hero__meta-item">
            <svg class="icon" aria-hidden="true"><use href="#i-pin"/></svg>
            <span><span class="sr-only">Venue: </span>${e(c.venue.city)}, ${e(c.venue.state)}</span>
          </li>
        </ul>

        <div class="hero__actions">
          <a class="btn btn--soft" href="#details">
            <span>View invitation details</span>
            <svg class="icon" aria-hidden="true"><use href="#i-arrow-down"/></svg>
          </a>
        </div>
      </div>
    </div>
  </section>`;
}
