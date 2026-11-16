/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CENTRAL INVITATION CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 *  Everything shown on the website is generated from this single file.
 *  Edit a value here, run `npm run build`, and every section updates.
 *
 *  Nothing public-facing is invented: any field left empty ("") is either
 *  hidden automatically (e.g. a missing family member or photograph) or
 *  replaced by a graceful "coming soon" state (e.g. the map link).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const invitation = {
  /* ── Site / SEO ─────────────────────────────────────────────────────────── */
  site: {
    // Set this to the live domain after deployment, e.g. "https://shibil-hiba.pages.dev".
    // Leave empty to keep canonical + og:url relative (the share URL is always
    // generated at runtime from the visitor's address bar).
    url: "",
    title: "Shibil Hussain MK & Hiba Thesni | Nikkah Invitation",
    description:
      "With the blessings of Almighty Allah, you are invited to celebrate the blessed Nikkah of Shibil Hussain MK and Hiba Thesni on 26 January 2027.",
    themeColor: "#F8F7F5",
    ogImage: "/og-image.png",
    locale: "en_IN",
    keywords:
      "Nikkah invitation, Kerala Muslim wedding, Shibil Hussain MK, Hiba Thesni, Kondotty, Malappuram, Nikkah 2027",
  },

  /* ── Couple ─────────────────────────────────────────────────────────────── */
  groom: {
    name: "Shibil Hussain MK",
    shortName: "Shibil",
    father: "Sulfikar Ali",
    mother: "Sunitha P P",
    // Optional portrait, e.g. "/assets/groom.jpg". Leave empty to keep the
    // ornamental (photograph-free) design.
    photo: "",
  },

  bride: {
    name: "Hiba Thesni",
    shortName: "Hiba",
    // Not provided yet — empty values are hidden from the public page.
    father: "",
    mother: "",
    photo: "",
  },

  /* ── Event ──────────────────────────────────────────────────────────────── */
  event: {
    title: "Nikkah Ceremony",
    label: "Nikkah Invitation",
    date: "2027-01-26",
    time: "11:00",
    timezone: "Asia/Kolkata",
    timezoneLabel: "IST",
    // Human-readable form of the timezone, shown under the time.
    timezoneName: "Indian Standard Time",
    // Calendar duration in minutes.
    durationMinutes: 180,
    // Used by Google Calendar / .ics. Couple names and the date/time are
    // appended automatically, so this only needs the invitation wording.
    description:
      "With the blessings of Almighty Allah, we cordially invite you and your family to the Nikkah of {couple}. Your presence and prayers will make this occasion complete.",
  },

  /* ── Venue ──────────────────────────────────────────────────────────────── */
  venue: {
    name: "Bride’s Residence",
    city: "Kondotty",
    district: "Malappuram",
    state: "Kerala",
    country: "India",
    // Paste the exact Google Maps link here when it is confirmed.
    // While empty, the location button stays disabled and a gentle note is shown.
    mapsUrl: "",
  },

  /* ── Invitation copy ────────────────────────────────────────────────────── */
  invitation: {
    from: "The Family of Shibil Hussain MK",
    fromLabel: "Groom’s Family",
    language: "mixed", // "mixed" | "en" | "ml"
    heroMalayalam: "രണ്ട് ഹൃദയങ്ങൾ, ഒരു മനോഹരമായ തുടക്കം.",
    coupleNoteMalayalam: "നിക്കാഹ് — രണ്ട് കുടുംബങ്ങളെ ഒന്നിപ്പിക്കുന്ന വിശുദ്ധ വേള.",
    message: {
      en: [
        "With the blessings of Almighty Allah and the love of our family, we cordially invite you and your family to join us in celebrating the blessed Nikkah of our beloved son.",
        "Your gracious presence and prayers will make this joyous occasion even more meaningful to us.",
      ],
      ml: [
        "അല്ലാഹുവിന്റെ അനുഗ്രഹത്താലും കുടുംബത്തിന്റെ സ്നേഹത്താലും ഞങ്ങളുടെ പ്രിയ മകൻ ശിബിലിന്റെ നിക്കാഹ് ചടങ്ങിലേക്ക് നിങ്ങളെയും കുടുംബത്തെയും ഹൃദയപൂർവ്വം ക്ഷണിക്കുന്നു.",
        "നിങ്ങളുടെ സാന്നിധ്യവും പ്രാർത്ഥനകളും ഈ സന്തോഷകരമായ അവസരത്തെ കൂടുതൽ മനോഹരമാക്കും.",
      ],
    },
  },

  /* ── Countdown states ───────────────────────────────────────────────────── */
  countdown: {
    heading: "Countdown to Our Nikkah",
    malayalam: "നിക്കാഹ് ദിനത്തിലേക്ക്",
    labels: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
    malayalamLabels: { days: "ദിവസം", hours: "മണിക്കൂർ", minutes: "മിനിറ്റ്", seconds: "സെക്കൻഡ്" },
    arrived: "Alhamdulillah, the blessed day has arrived.",
    arrivedMalayalam: "അൽഹംദുലില്ലാഹ്, അനുഗ്രഹീത ദിനം എത്തിയിരിക്കുന്നു.",
    past: "Alhamdulillah, the blessed Nikkah has taken place. Thank you for your prayers.",
    pastMalayalam: "അൽഹംദുലില്ലാഹ്, നിക്കാഹ് പൂർത്തിയായി. നിങ്ങളുടെ പ്രാർത്ഥനകൾക്ക് നന്ദി.",
  },

  /* ── Opening screen ─────────────────────────────────────────────────────── */
  opening: {
    label: "A Special Invitation",
    button: "Open Invitation",
    buttonMalayalam: "ക്ഷണക്കത്ത് തുറക്കുക",
    skip: "Skip the opening",
  },

  /* ── Blessing ───────────────────────────────────────────────────────────── */
  blessing: {
    arabic: "بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    english:
      "May Allah bless you both, shower His blessings upon you, and unite you in goodness.",
    malayalam:
      "ഈ വിശുദ്ധ വേളയിൽ നിങ്ങൾക്ക് എല്ലാവിധ ഐശ്വര്യങ്ങളും ഉണ്ടാകട്ടെ.",
    closingLabel: "With love and prayers",
    closingName: "The Family of Shibil Hussain MK",
  },

  /* ── Sharing ────────────────────────────────────────────────────────────── */
  share: {
    // Tokens replaced at runtime: {couple} {groom} {bride} {date} {day}
    // {time} {venue} {city} {url}. {url} is window.location.href.
    message: [
      "With the blessings of Almighty Allah, we invite you to the blessed Nikkah of {couple}.",
      "",
      "Date: {date}",
      "Time: {time}",
      "Venue: {venue}, {city}.",
      "",
      "We look forward to your presence and prayers.",
      "",
      "View Invitation: {url}",
    ].join("\n"),
    copied: "Invitation link copied",
    copyFailed: "Could not copy — please copy the address bar link.",
  },

  /* ── Optional music (lazy-loaded, off by default) ───────────────────────── */
  music: {
    // e.g. "/assets/nikkah-theme.mp3" — leave empty to hide the toggle entirely.
    src: "",
    title: "Ambient theme",
  },

  /* ── Navigation ─────────────────────────────────────────────────────────── */
  nav: [
    { label: "Invitation", href: "#message" },
    { label: "Our Families", href: "#family" },
    { label: "Details", href: "#details" },
    { label: "Countdown", href: "#countdown" },
    { label: "Blessings", href: "#blessing" },
  ],
};

export default invitation;
