import { escapeHtml } from "../lib/derive.js";
import { divider } from "./ornaments.js";

const e = escapeHtml;

export function details(c, ctx) {
  const maps = c.venue.mapsUrl;
  const venueLine = [c.venue.city, c.venue.district, c.venue.state].filter(Boolean).join(", ");

  const locationAction = maps
    ? `<a class="btn btn--primary" href="${e(maps)}" target="_blank" rel="noopener noreferrer">
         <svg class="icon" aria-hidden="true"><use href="#i-pin"/></svg>
         <span>View Location</span>
       </a>`
    : `<button class="btn btn--primary" type="button" disabled aria-describedby="venue-note">
         <svg class="icon" aria-hidden="true"><use href="#i-pin"/></svg>
         <span>View Location</span>
       </button>`;

  return `<section class="section section--details" id="details" aria-labelledby="details-title">
    <div class="container container--wide">
      <header class="section__head">
        <p class="eyebrow center">Save the date</p>
        <h2 class="section__title center" id="details-title">The Nikkah Ceremony</h2>
        ${divider("divider--section")}
      </header>

      <div class="details reveal">
        <div class="details__item">
          <span class="details__icon" aria-hidden="true"><svg class="icon"><use href="#i-calendar"/></svg></span>
          <p class="details__label">Date</p>
          <p class="details__value">${e(ctx.when.weekday)},<br>${e(ctx.when.shortDate)}</p>
        </div>

        <div class="details__item">
          <span class="details__icon" aria-hidden="true"><svg class="icon"><use href="#i-clock"/></svg></span>
          <p class="details__label">Time</p>
          <p class="details__value">${e(ctx.when.time12)} ${e(c.event.timezoneLabel)}</p>
          <p class="details__sub">${e(c.event.timezoneName || c.event.timezone)}</p>
        </div>

        <div class="details__item">
          <span class="details__icon" aria-hidden="true"><svg class="icon"><use href="#i-pin"/></svg></span>
          <p class="details__label">Venue</p>
          <p class="details__value">${e(c.venue.name)}</p>
          <p class="details__sub">${e(venueLine)}</p>
        </div>
      </div>

      <div class="details__actions">
        ${locationAction}
        <a class="btn btn--outline" href="${e(ctx.calendar.googleUrl)}" target="_blank" rel="noopener noreferrer">
          <svg class="icon" aria-hidden="true"><use href="#i-calendar"/></svg>
          <span>Add to Calendar</span>
        </a>
      </div>

      ${
        maps
          ? ""
          : `<p class="details__note" id="venue-note">
               <svg class="icon" aria-hidden="true"><use href="#i-info"/></svg>
               <span>Location details will be shared soon.</span>
             </p>`
      }

      <p class="details__ics">
        Using Apple or Outlook? <button class="link-button" type="button" data-ics>Download the calendar file</button>
      </p>
    </div>
  </section>`;
}

export function countdown(c, ctx) {
  const target = ctx.when.instant.getTime();
  const diff = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const parts = {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };

  const unit = (key, pad = false) => `<li class="countdown__unit reveal">
      <span class="countdown__value" data-count="${key}" aria-hidden="true">${pad ? String(parts[key]).padStart(2, "0") : parts[key]}</span>
      <span class="countdown__label">${e(c.countdown.labels[key])}</span>
      <span class="countdown__ml" lang="ml">${e(c.countdown.malayalamLabels[key])}</span>
    </li>`;

  return `<section class="section section--countdown" id="countdown" aria-labelledby="countdown-title">
    <div class="container container--narrow">
      <header class="section__head">
        <p class="eyebrow center" lang="ml">${e(c.countdown.malayalam)}</p>
        <h2 class="section__title center" id="countdown-title">${e(c.countdown.heading)}</h2>
        ${divider("divider--section")}
      </header>

      <div class="countdown" data-countdown data-target="${e(ctx.when.instant.toISOString())}">
        <ul class="countdown__list">
          ${unit("days")}
          ${unit("hours", true)}
          ${unit("minutes", true)}
          ${unit("seconds", true)}
        </ul>
      </div>

      <p class="countdown__message" data-countdown-message role="status" aria-live="polite">
        <span class="countdown__message-en"></span>
        <span class="countdown__message-ml" lang="ml"></span>
      </p>

      <p class="sr-only" data-countdown-live aria-live="polite"></p>

      <p class="countdown__footnote">${e(ctx.when.longDate)} · ${e(ctx.when.time12)} ${e(c.event.timezoneLabel)}</p>
    </div>
  </section>`;
}

export function location(c) {
  const maps = c.venue.mapsUrl;
  const action = maps
    ? `<a class="btn btn--soft" href="${e(maps)}" target="_blank" rel="noopener noreferrer">
         <span>Open in Google Maps</span>
         <svg class="icon" aria-hidden="true"><use href="#i-external"/></svg>
       </a>`
    : `<p class="location__note">
         <svg class="icon" aria-hidden="true"><use href="#i-info"/></svg>
         <span>Location details will be shared soon.</span>
       </p>`;

  return `<section class="section section--location" id="location" aria-labelledby="location-title">
    <div class="container container--wide">
      <header class="section__head">
        <p class="eyebrow center">Where we celebrate</p>
        <h2 class="section__title center" id="location-title">Kondotty, Malappuram</h2>
        ${divider("divider--section")}
      </header>

      <div class="location reveal">
        <div class="location__visual" aria-hidden="true">
          <div class="location__pattern"></div>
          <div class="location__ring"></div>
          <p class="location__city">${e(c.venue.city)}</p>
          <p class="location__region">${e(c.venue.district)} · ${e(c.venue.state)} · ${e(c.venue.country)}</p>
        </div>

        <div class="location__info">
          <p class="eyebrow">The Venue</p>
          <h3 class="location__venue">${e(c.venue.name)}</h3>
          <p class="location__address">${[c.venue.city, c.venue.district, c.venue.state, c.venue.country]
            .filter(Boolean)
            .map(e)
            .join(", ")}</p>
          ${action}
        </div>
      </div>
    </div>
  </section>`;
}

export function blessing(c) {
  return `<section class="section section--blessing" id="blessing" aria-labelledby="blessing-title">
    <div class="container container--narrow">
      <h2 class="sr-only" id="blessing-title">Blessing for the couple</h2>
      <p class="arabic blessing__arabic" lang="ar" dir="rtl">${e(c.blessing.arabic)}</p>
      <p class="blessing__translation">${e(c.blessing.english)}</p>
      <p class="blessing__ml" lang="ml">${e(c.blessing.malayalam)}</p>

      ${divider("divider--blessing")}

      <div class="blessing__closing">
        <p class="eyebrow">${e(c.blessing.closingLabel)}</p>
        <p class="blessing__family">${e(c.blessing.closingName)}</p>
      </div>
    </div>
  </section>`;
}
