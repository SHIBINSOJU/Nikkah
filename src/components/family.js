import { escapeHtml } from "../lib/derive.js";
import { divider, florals } from "./ornaments.js";

const e = escapeHtml;

function member(name, role) {
  if (!name) return "";
  return `<li class="family__member">
    <span class="family__name">${e(name)}</span>
    <span class="family__role">${e(role)}</span>
  </li>`;
}

function card({ title, subtitle, members, emphasis = false }) {
  const list = members.map((m) => member(m.name, m.role)).filter(Boolean).join("");
  if (!list) return "";

  return `<article class="family__card${emphasis ? " family__card--emphasis" : ""}">
    <header class="family__head">
      <p class="family__title">${e(title)}</p>
      <p class="family__subtitle">${e(subtitle)}</p>
    </header>
    <ul class="family__list">${list}</ul>
    <span class="family__corner family__corner--tl" aria-hidden="true"></span>
    <span class="family__corner family__corner--tr" aria-hidden="true"></span>
    <span class="family__corner family__corner--bl" aria-hidden="true"></span>
    <span class="family__corner family__corner--br" aria-hidden="true"></span>
  </article>`;
}

export function family(c) {
  const groomMembers = [
    { name: c.groom.father, role: "Father of the Groom" },
    { name: c.groom.mother, role: "Mother of the Groom" },
  ];
  const brideMembers = [
    { name: c.bride.father, role: "Father of the Bride" },
    { name: c.bride.mother, role: "Mother of the Bride" },
  ];

  const groomCard = card({
    title: "Groom’s Family",
    subtitle: c.groom.name,
    members: groomMembers,
    emphasis: true,
  });
  const brideCard = card({
    title: "Bride’s Family",
    subtitle: c.bride.name,
    members: brideMembers,
  });

  // When no bride family members are configured, the bride card is omitted
  // entirely (no "TBD", no empty labels) and the layout re-centres.
  const single = !brideCard;

  const groomWrapped = groomCard
    ? groomCard.replace(
        '<article class="family__card',
        `<article class="family__card reveal ${single ? "reveal--up" : "reveal--left"}`,
      )
    : "";
  const brideWrapped = brideCard
    ? brideCard.replace(
        '<article class="family__card',
        '<article class="family__card reveal reveal--right',
      )
    : "";

  return `<section class="section section--family" id="family" aria-labelledby="family-title">
    <div class="container container--wide">
      <header class="section__head reveal reveal--up">
        <p class="eyebrow center">${single ? "With gratitude to our family" : "With gratitude to our families"}</p>
        <h2 class="section__title center" id="family-title">${single ? "Our Family" : "Our Families"}</h2>
        ${divider("divider--section")}
      </header>

      <div class="family${single ? " family--single" : ""}">
        <span class="family__floral family__floral--left" aria-hidden="true">${florals()}</span>
        <span class="family__floral family__floral--right" aria-hidden="true">${florals("", true)}</span>
        ${groomWrapped}
        ${brideWrapped}
      </div>
    </div>
  </section>`;
}
