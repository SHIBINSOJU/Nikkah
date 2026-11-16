import { escapeHtml } from "../lib/derive.js";
import { crest, divider } from "./ornaments.js";

const e = escapeHtml;

export function message(c) {
  const { en, ml } = c.invitation.message;
  const showEn = c.invitation.language !== "ml";
  const showMl = c.invitation.language !== "en";

  return `<section class="section section--message" id="message" aria-labelledby="message-title">
    <div class="container container--narrow">
      <article class="panel reveal">
        <span class="panel__crest" aria-hidden="true">${crest()}</span>

        <p class="eyebrow center">Bismillah</p>
        <h2 class="section__title center" id="message-title">An invitation from our family to yours</h2>

        <div class="panel__body">
          ${
            showEn
              ? `<div class="panel__lang" lang="en">
                  ${en.map((p) => `<p>${e(p)}</p>`).join("")}
                </div>`
              : ""
          }

          ${showEn && showMl ? divider("divider--small") : ""}

          ${
            showMl
              ? `<div class="panel__lang panel__lang--ml" lang="ml">
                  ${ml.map((p) => `<p>${e(p)}</p>`).join("")}
                </div>`
              : ""
          }
        </div>

        <p class="panel__signature">
          <span class="panel__signature-label">${e(c.invitation.fromLabel)}</span>
          <span class="panel__signature-name">${e(c.invitation.from)}</span>
        </p>
      </article>
    </div>
  </section>`;
}

export function couple(c) {
  const person = (data, role, roleMalayalam, side) => {
    const photo = data.photo
      ? `<figure class="couple__portrait">
           <img src="${e(data.photo)}" alt="${e(data.name)}" width="360" height="460" loading="lazy" decoding="async">
         </figure>`
      : `<span class="couple__medallion" aria-hidden="true">${crest()}</span>`;

    return `<article class="couple__person couple__person--${side}">
      ${photo}
      <p class="eyebrow couple__role">${e(role)}</p>
      <h3 class="couple__name">${e(data.name)}</h3>
      <p class="couple__ml" lang="ml">${e(roleMalayalam)}</p>
    </article>`;
  };

  return `<section class="section section--couple" id="couple" aria-labelledby="couple-title">
    <div class="container container--narrow">
      <h2 class="sr-only" id="couple-title">The couple</h2>
      <p class="eyebrow center">Two hearts, one beginning</p>

      <div class="couple">
        ${person(c.groom, "The Groom", "വരൻ", "groom")}

        <div class="couple__join" aria-hidden="true">
          <span class="couple__join-amp">&amp;</span>
          <span class="couple__join-ring"></span>
        </div>

        ${person(c.bride, "The Bride", "വധു", "bride")}
      </div>

      <p class="couple__note" lang="ml">${e(c.invitation.coupleNoteMalayalam)}</p>
    </div>
  </section>`;
}
