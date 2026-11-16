import { escapeHtml } from "../lib/derive.js";
import { crest, divider } from "./ornaments.js";

const e = escapeHtml;

export function message(c) {
  const paragraphs = (c.invitation.message && c.invitation.message.en) || [];

  return `<section class="section section--message" id="message" aria-labelledby="message-title">
    <div class="container container--narrow">
      <article class="panel reveal reveal--up">
        <span class="panel__crest" aria-hidden="true">${crest()}</span>

        <p class="eyebrow center reveal reveal--up">With the Blessings of Almighty Allah</p>
        <h2 class="section__title center reveal reveal--up reveal-delay-1" id="message-title">An Invitation From Our Family to Yours</h2>
        ${divider("divider--small")}

        <div class="panel__body">
          <div class="panel__lang" lang="en">
            ${paragraphs.map((p, i) => `<p class="reveal reveal--up reveal-delay-${Math.min(i + 1, 3)}">${e(p)}</p>`).join("")}
          </div>
        </div>

        <p class="panel__signature reveal reveal--up reveal-delay-2">
          <span class="panel__signature-label">${e(c.invitation.fromLabel)}</span>
          <span class="panel__signature-name">${e(c.invitation.from)}</span>
        </p>
      </article>
    </div>
  </section>`;
}

export function couple(c) {
  const person = (data, role, side, revealDir) => {
    const photo = data.photo
      ? `<figure class="couple__portrait">
           <img src="${e(data.photo)}" alt="${e(data.name)}" width="360" height="460" loading="lazy" decoding="async">
         </figure>`
      : `<span class="couple__medallion" aria-hidden="true">${crest()}</span>`;

    return `<article class="couple__person couple__person--${side} reveal ${revealDir}">
      ${photo}
      <p class="eyebrow couple__role">${e(role)}</p>
      <h3 class="couple__name">${e(data.name)}</h3>
      ${
        data.arabicName
          ? `<p class="arabic couple__arabic" lang="ar" dir="rtl">${e(data.arabicName)}</p>`
          : ""
      }
    </article>`;
  };

  return `<section class="section section--couple" id="couple" aria-labelledby="couple-title">
    <div class="container container--narrow">
      <h2 class="sr-only" id="couple-title">The Couple</h2>
      <p class="eyebrow center reveal reveal--up">The Bride &amp; Groom</p>

      <div class="couple">
        ${person(c.groom, "The Groom", "groom", "reveal--left")}

        <div class="couple__join reveal reveal--scale reveal-delay-1" aria-hidden="true">
          <span class="couple__join-amp">&amp;</span>
          <span class="couple__join-ring"></span>
        </div>

        ${person(c.bride, "The Bride", "bride", "reveal--right")}
      </div>

      ${
        c.invitation.coupleNote
          ? `<p class="couple__note reveal reveal--up reveal-delay-1">${e(c.invitation.coupleNote)}</p>`
          : ""
      }
    </div>
  </section>`;
}
