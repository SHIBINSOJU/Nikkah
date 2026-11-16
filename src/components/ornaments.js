/**
 * Hand-drawn ornament system.
 *
 * Everything decorative on this site is inline SVG: no images, no icon fonts,
 * nothing that delays the first paint. The artwork is deliberately monoline
 * silver so it stays quiet behind the typography.
 */

/* ── Small utilities ─────────────────────────────────────────────────────── */

const px = (n) => Math.round(n * 100) / 100;

/** A rose: overlapping petals in two rings around a small heart. */
const PETAL = "M0 0C-9.6 -5.6 -11.6 -18 0 -26C11.6 -18 9.6 -5.6 0 0Z";

function rose(x, y, scale = 1, rotate = 0) {
  const ring = (count, offset, size) =>
    Array.from(
      { length: count },
      (_, index) =>
        `<path d="${PETAL}" transform="rotate(${px(offset + (index * 360) / count)}) scale(${size})"/>`,
    ).join("");

  return `<g class="floral__bloom" transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})">
      <g class="floral__petals">${ring(9, 0, 1)}</g>
      <g class="floral__inner">${ring(6, 20, 0.62)}</g>
      <path class="floral__heart" d="M0 -5.6C3.4 -3.4 2.6 1.4 0 3.4C-2.6 1.4 -3.4 -3.4 0 -5.6Z"/>
    </g>`;
}

function leaf(x, y, rotate, scale = 1) {
  return `<g class="floral__leaf" transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})">
      <path d="M0 0C11 -10 27 -13 41 -6C29 7 13 10 0 0Z"/>
      <path d="M2 -0.6C14 -2.4 27 -4.2 39 -5.8"/>
    </g>`;
}

function bud(x, y, rotate, scale = 1) {
  return `<g class="floral__bud" transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})">
      <path d="M0 0C4.6 -10.4 16 -11.6 19.4 -1.4C15.6 7.6 4.6 8.6 0 0Z"/>
      <path d="M2.4 -1C7 -3 12.6 -4 17.4 -2"/>
    </g>`;
}

/* ── Arch ────────────────────────────────────────────────────────────────── */

/**
 * The mihrab arch: vertical jambs that sweep into a soft ogee shoulder and meet
 * at a point. The box is stretched to the frame, so every stroke opts into
 * `vector-effect: non-scaling-stroke` (see components.css) and the second line
 * is drawn as truncated inner jambs — a scaled copy of the whole outline would
 * drift apart under a non-uniform stretch.
 */
export function arch(cls = "") {
  const outline =
    "M2 100V35C2 20.5 29 10.6 50 3.8C71 10.6 98 20.5 98 35V100";

  return `<svg class="arch ${cls}" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="arch-wash" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity=".7"/>
        <stop offset=".5" stop-color="#ffffff" stop-opacity=".32"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity=".06"/>
      </linearGradient>
    </defs>
    <g fill="none" stroke-linecap="round">
      <path class="arch__wash" d="${outline}Z" fill="url(#arch-wash)" stroke="none"/>
      <path class="arch__outer" d="${outline}"/>
    </g>
  </svg>`;
}

/** Small mihrab crest used at the top of bordered panels. */
export function crest(cls = "") {
  return `<svg class="crest ${cls}" viewBox="0 0 72 34" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
      <path d="M4 30V18C4 12.6 15 6.4 36 0C57 6.4 68 12.6 68 18V30"/>
      <path d="M10 30V19.4C10 15 19 9.8 36 4.6C53 9.8 62 15 62 19.4V30"/>
      <path d="M36 11.4L40 17L36 22.6L32 17Z"/>
      <path d="M0 30H4M68 30H72"/>
    </g>
  </svg>`;
}

/** Ornamental rule with a diamond heart. */
export function divider(cls = "") {
  return `<svg class="divider ${cls}" viewBox="0 0 260 26" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
      <path d="M0 13H96" stroke-opacity=".55"/>
      <path d="M164 13H260" stroke-opacity=".55"/>
      <path d="M104 13H112M148 13H156"/>
      <path d="M130 6.5L136.5 13L130 19.5L123.5 13Z"/>
      <path d="M116 13C110 13 107 10 107 5.5M144 13C150 13 153 10 153 5.5"/>
      <circle cx="104" cy="13" r="1.4" fill="currentColor" stroke="none"/>
      <circle cx="156" cy="13" r="1.4" fill="currentColor" stroke="none"/>
    </g>
  </svg>`;
}

/* ── Floral cluster ──────────────────────────────────────────────────────── */

export function florals(cls = "", flip = false) {
  return `<svg class="florals ${cls}${flip ? " florals--flip" : ""}" viewBox="0 0 260 260" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
      <g class="floral__stems">
        <path d="M-4 262C38 210 78 168 118 124S196 46 204 30"/>
        <path d="M26 262C52 220 96 192 140 172"/>
        <path d="M-2 190C26 172 48 142 56 108"/>
        <path d="M70 258C92 236 118 226 150 220"/>
        <path d="M118 124C138 110 156 92 162 70"/>
        <path d="M56 108C72 96 90 88 110 86"/>
      </g>
      <g class="floral__leaves">
        ${leaf(94, 152, -58, 0.6)}
        ${leaf(128, 104, -32, 0.66)}
        ${leaf(50, 180, 60, 0.62)}
        ${leaf(150, 150, 16, 0.58)}
        ${leaf(142, 78, -72, 0.54)}
        ${leaf(80, 120, -104, 0.5)}
        ${leaf(174, 192, 28, 0.54)}
        ${leaf(36, 124, 46, 0.46)}
        ${leaf(182, 100, -16, 0.5)}
      </g>
      <g class="floral__berries">
        <circle cx="108" cy="190" r="2.4"/>
        <circle cx="118" cy="200" r="1.6"/>
        <circle cx="72" cy="152" r="2"/>
        <circle cx="176" cy="126" r="2.2"/>
        <circle cx="188" cy="138" r="1.5"/>
        <circle cx="44" cy="218" r="2"/>
      </g>
      <g class="floral__buds">
        ${bud(162, 214, 14, 0.78)}
        ${bud(88, 78, -44, 0.7)}
        ${bud(194, 152, -10, 0.62)}
      </g>
      ${rose(200, 28, 1.06, 14)}
      ${rose(124, 130, 1.18, -8)}
      ${rose(58, 104, 0.86, 26)}
      ${rose(148, 210, 0.76, 6)}
      ${rose(18, 250, 0.66, 42)}
    </g>
  </svg>`;
}

/* ── Lantern ─────────────────────────────────────────────────────────────── */

export function lantern(cls = "", chain = 88) {
  const c = chain;
  return `<svg class="lantern ${cls}" viewBox="0 0 80 ${px(c + 116)}" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1">
      <path d="M40 0V${c}" stroke-dasharray="1 6" stroke-opacity=".55"/>
      <circle cx="40" cy="${c + 3}" r="2"/>
      <path d="M40 ${c + 5}v5"/>
      <path d="M40 ${c + 10}l3.4 4.4-3.4 4.4-3.4-4.4Z"/>
      <path d="M40 ${c + 18}v3"/>
      <path d="M26 ${c + 21}h28l4.5 6H21.5Z" fill="#fff"/>
      <path d="M24 ${c + 27}h32l7 17-6 44H23l-6-44Z" fill="#fdfcf9"/>
      <path d="M30 ${c + 32}h20l6 12-5 38H29l-5-38Z" fill="#ffffff" stroke-opacity=".85"/>
      <path d="M40 ${c + 31}v51" stroke-opacity=".38"/>
      <path d="M28.5 ${c + 44}h23" stroke-opacity=".38"/>
      <path d="M33 ${c + 70}a7 8 0 0 1 14 0" stroke-opacity=".6"/>
      <path d="M17 ${c + 88}h46l-7 9H24Z" fill="#fff"/>
      <path d="M40 ${c + 97}v5"/>
      <path d="M40 ${c + 102}l3 4-3 4-3-4Z"/>
      <path d="M40 ${c + 110}v6" stroke-opacity=".4"/>
    </g>
  </svg>`;
}

/* ── Mosque skyline ──────────────────────────────────────────────────────── */

function dome(cx, baseY, halfWidth, height) {
  const w = halfWidth;
  const top = baseY - height;
  return (
    `M${cx - w} ${baseY}V${baseY - height * 0.36}` +
    `C${cx - w} ${baseY - height * 0.7} ${cx - w * 0.52} ${baseY - height * 0.92} ${cx} ${top}` +
    `C${cx + w * 0.52} ${baseY - height * 0.92} ${cx + w} ${baseY - height * 0.7} ${cx + w} ${baseY - height * 0.36}` +
    `V${baseY}Z` +
    `M${cx} ${top}V${px(top - height * 0.16)}`
  );
}

function minaret(cx, baseY, height) {
  const top = baseY - height;
  return (
    `M${cx - 4} ${baseY}V${top + 34}H${cx - 8}V${top + 24}H${cx - 4}V${top + 12}` +
    `L${cx} ${top}L${cx + 4} ${top + 12}V${top + 24}H${cx + 8}V${top + 34}H${cx + 4}V${baseY}Z`
  );
}

export function skyline(cls = "") {
  const domes = [
    [80, 320, 54, 92],
    [250, 320, 76, 132],
    [420, 320, 40, 70],
    [600, 320, 64, 112],
    [860, 320, 96, 164],
    [1080, 320, 56, 96],
    [1260, 320, 74, 126],
    [1440, 320, 42, 74],
    [1620, 320, 78, 134],
    [1800, 320, 48, 84],
  ];
  const minarets = [
    [0, 320, 196],
    [160, 320, 236],
    [340, 320, 180],
    [510, 320, 222],
    [980, 320, 246],
    [1130, 320, 188],
    [1380, 320, 232],
    [1730, 320, 186],
    [1900, 320, 214],
  ];
  return `<svg class="skyline ${cls}" viewBox="0 0 1920 320" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
    <g fill="currentColor" fill-opacity=".7">
      ${domes.map(([x, y, w, h]) => `<path d="${dome(x, y, w, h)}"/>`).join("")}
      ${minarets.map(([x, y, h]) => `<path d="${minaret(x, y, h)}"/>`).join("")}
      <path d="M0 304h1920v16H0Z" fill-opacity=".95"/>
    </g>
    <g fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6">
      ${[80, 250, 600, 860, 1260, 1620].map((x) => `<path d="M${x - 14} 320v-18a14 14 0 0 1 28 0v18"/>`).join("")}
    </g>
  </svg>`;
}

/* ── Sprite ──────────────────────────────────────────────────────────────── */

export function sprite() {
  const icon = (id, body, extra = "") =>
    `<symbol id="${id}" viewBox="0 0 24 24" ${extra}>${body}</symbol>`;

  return `<svg class="sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="lantern-glow">
        <stop offset="0" stop-color="#f0e7d6" stop-opacity=".85"/>
        <stop offset=".6" stop-color="#f0e7d6" stop-opacity=".22"/>
        <stop offset="1" stop-color="#f0e7d6" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="skyline-fade" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="#B7B7B7" stop-opacity=".28"/>
        <stop offset="1" stop-color="#B7B7B7" stop-opacity=".02"/>
      </linearGradient>
    </defs>

    ${icon(
      "i-calendar",
      '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17.5h2M14 17.5h2"/>',
    )}
    ${icon("i-clock", '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3.2 2"/>')}
    ${icon(
      "i-pin",
      '<path d="M12 21.2s7.2-6.4 7.2-11.2a7.2 7.2 0 1 0-14.4 0c0 4.8 7.2 11.2 7.2 11.2Z"/><circle cx="12" cy="9.8" r="2.6"/>',
    )}
    ${icon(
      "i-share",
      '<path d="M12 15.4V3.6M8.2 7.4 12 3.6l3.8 3.8"/><path d="M5.4 12.4v6.8a1.4 1.4 0 0 0 1.4 1.4h10.4a1.4 1.4 0 0 0 1.4-1.4v-6.8"/>',
    )}
    ${icon(
      "i-chat",
      '<path d="M12 3.2a8.8 8.8 0 0 0-7.5 13.4L3.2 21l4.6-1.2A8.8 8.8 0 1 0 12 3.2Z"/><path d="M9 8.6c.5 3 2.4 4.9 5.4 5.4"/>',
    )}
    ${icon(
      "i-link",
      '<path d="M10 14 14 10"/><path d="M8.4 11.6 6.6 13.4a3.4 3.4 0 0 0 4.8 4.8l1.8-1.8"/><path d="M15.6 12.4l1.8-1.8a3.4 3.4 0 0 0-4.8-4.8l-1.8 1.8"/>',
    )}
    ${icon("i-check", '<path d="m4.5 12.4 5 5L19.5 7"/>')}
    ${icon("i-arrow-down", '<path d="M12 4v15M6 13.4l6 6 6-6"/>')}
    ${icon("i-arrow-up", '<path d="M12 20V5M6 10.6l6-6 6 6"/>')}
    ${icon(
      "i-music",
      '<path d="M9 17.4V5.6l10-2v11.8"/><circle cx="6.6" cy="17.8" r="2.4"/><circle cx="16.6" cy="15.8" r="2.4"/>',
    )}
    ${icon(
      "i-music-off",
      '<path d="M9 17.4V5.6l10-2v11.8"/><circle cx="6.6" cy="17.8" r="2.4"/><circle cx="16.6" cy="15.8" r="2.4"/><path d="m3.4 3.4 17.2 17.2"/>',
    )}
    ${icon(
      "i-external",
      '<path d="M14 4h6v6M20 4l-8.6 8.6"/><path d="M18 14.4v4.6a1.4 1.4 0 0 1-1.4 1.4H5.4A1.4 1.4 0 0 1 4 19V7.8a1.4 1.4 0 0 1 1.4-1.4h4.6"/>',
    )}
    ${icon("i-chevron", '<path d="m6 9.5 6 6 6-6"/>')}
    ${icon("i-info", '<circle cx="12" cy="12" r="8.6"/><path d="M12 11v5.4M12 7.6v.4"/>')}
  </svg>`;
}
