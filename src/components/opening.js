import { escapeHtml } from "../lib/derive.js";
import { arch, crest, divider, florals, lantern } from "./ornaments.js";

const e = escapeHtml;

export function opening(c) {
  return `<div class="opening" id="opening" data-opening>
    <div class="opening__bg" aria-hidden="true">
      <div class="opening__pattern"></div>
      ${lantern("opening__lantern opening__lantern--left", 40)}
      ${lantern("opening__lantern opening__lantern--right", 84)}
      ${florals("opening__florals opening__florals--left")}
      ${florals("opening__florals opening__florals--right", true)}
    </div>

    <div class="opening__frame" data-opening-frame>
      ${arch("opening__arch")}

      <div class="opening__content">
        <p class="arabic opening__bismillah" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p class="opening__meaning">In the name of Allah,<br>the Most Gracious, the Most Merciful</p>

        ${divider("divider--opening")}

        <p class="opening__to" data-guest hidden></p>

        <p class="eyebrow opening__label">${e(c.opening.label)}</p>
        <p class="opening__names">${e(c.groom.name)} <span class="opening__amp" aria-hidden="true">&amp;</span> ${e(c.bride.name)}</p>

        <button class="btn btn--open" type="button" data-open>
          <span>${e(c.opening.button)}</span>
          <svg class="icon" aria-hidden="true"><use href="#i-chevron"/></svg>
        </button>
        <p class="opening__ml" lang="ml">${e(c.opening.buttonMalayalam)}</p>

        <button class="opening__skip" type="button" data-skip>${e(c.opening.skip)}</button>
      </div>

      <span class="opening__crest" aria-hidden="true">${crest()}</span>
    </div>
  </div>`;
}
