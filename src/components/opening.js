import { escapeHtml } from "../lib/derive.js";
import { arch, crest, divider, florals, lantern } from "./ornaments.js";

const e = escapeHtml;

export function opening(c, ctx) {
  const dateShort = ctx.when.shortDate;
  const placeShort = [c.venue.city, c.venue.state].filter(Boolean).join(", ");

  return `<div class="opening" id="opening" data-opening role="dialog" aria-modal="true" aria-labelledby="opening-title">
    <div class="opening__bg" aria-hidden="true">
      <div class="opening__pattern"></div>
      <div class="opening__glow"></div>
    </div>

    <div class="opening__stage">
      ${lantern("opening__lantern opening__lantern--left", 44)}
      ${lantern("opening__lantern opening__lantern--right", 86)}
      ${florals("opening__florals opening__florals--left")}
      ${florals("opening__florals opening__florals--right", true)}

      <div class="opening__frame" data-opening-frame>
        ${arch("opening__arch", "opening")}

        <div class="opening__content">
          <p class="arabic opening__bismillah" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <p class="opening__meaning">In the name of Allah, the Most Gracious, the Most Merciful</p>

          ${divider("divider--opening")}

          <p class="opening__to" data-guest hidden></p>

          <p class="eyebrow opening__label">${e(c.opening.label)}</p>

          <h2 class="opening__names" id="opening-title">
            <span class="opening__name">${e(c.groom.name)}</span>
            <span class="opening__amp-row" aria-hidden="true">
              <span class="opening__rule"></span>
              <span class="opening__amp">&amp;</span>
              <span class="opening__rule"></span>
            </span>
            <span class="opening__name">${e(c.bride.name)}</span>
          </h2>

          ${
            c.groom.arabicName && c.bride.arabicName
              ? `<p class="arabic opening__names-ar" lang="ar" dir="rtl">${e(c.groom.arabicName)} <span class="opening__ar-amp" aria-hidden="true">و</span> ${e(c.bride.arabicName)}</p>`
              : ""
          }

          <p class="opening__meta">
            <span>${e(dateShort)}</span>
            <span class="opening__dot" aria-hidden="true">·</span>
            <span>${e(placeShort)}</span>
          </p>

          <button class="btn btn--open" type="button" data-open>
            <span>${e(c.opening.button)}</span>
            <svg class="icon" aria-hidden="true"><use href="#i-chevron"/></svg>
          </button>

          <button class="opening__skip" type="button" data-skip>${e(c.opening.skip)}</button>
        </div>

        <span class="opening__crest" aria-hidden="true">${crest()}</span>
      </div>
    </div>
  </div>`;
}
