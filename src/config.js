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
    url: "https://nikkah.shotdevs.space",
    title: "Shibil Hussain MK & Hiba Thesni | Nikkah Invitation",
    description:
      "With the blessings of Almighty Allah, you are invited to celebrate the blessed Nikkah of Shibil Hussain MK and Hiba Thesni on 24 January 2027.",
    themeColor: "#F8F7F5",
    ogImage: "/og-image.png",
    locale: "en_IN",
    keywords:
      "Nikkah invitation, Islamic wedding invitation, Shibil Hussain MK, Hiba Thesni, Kondotty, Malappuram, Kerala, Nikkah 2027",
  },

  /* ── Couple ─────────────────────────────────────────────────────────────── */
  groom: {
    name: "Shibil Hussain MK",
    shortName: "Shibil",
    arabicName: "شبل حسين إم كي",
    father: "Sulfikar Ali",
    mother: "Sunitha P P",
    // Optional portrait, e.g. "/assets/groom.jpg". Leave empty to keep the
    // ornamental (photograph-free) stationery design.
    photo: "",
  },

  bride: {
    name: "Hiba Thesni",
    shortName: "Hiba",
    arabicName: "هبة تسني",
    // Not provided yet — empty values are hidden from the public page.
    father: "",
    mother: "",
    photo: "",
  },

  /* ── Event ──────────────────────────────────────────────────────────────── */
  event: {
    title: "Nikkah Ceremony",
    label: "Nikkah Invitation",
    date: "2027-01-24",
    time: "11:00",
    timezone: "Asia/Kolkata",
    timezoneLabel: "IST",
    timezoneName: "Indian Standard Time",
    durationMinutes: 180,
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
    language: "en",
    heroSubtitle: "Two hearts united in faith, grace, and lifelong devotion.",
    coupleNote: "Nikkah — the sacred covenant uniting two families in faith and love.",
    message: {
      en: [
        "With the blessings of Almighty Allah and the love of our family, we cordially invite you and your family to join us in celebrating the blessed Nikkah of our beloved son.",
        "Your gracious presence and heartfelt prayers will make this joyous occasion truly meaningful to us.",
      ],
    },
  },

  /* ── Guest name personalization ───────────────────────────────────────── */
  personalization: {
    // Share the link as .../?to=Rahman%20Family and the opening greets the
    // guest by name. Leave empty to disable.
    greeting: "Dear {name},",
  },

  /* ── RSVP via WhatsApp ──────────────────────────────────────────────────── */
  rsvp: {
    // WhatsApp number in international format, digits only, e.g. "919400000000".
    // Leave empty to hide the "Confirm Attendance" button entirely.
    whatsapp: "",
    label: "Confirm Attendance",
    message:
      "Assalamu Alaikum, with the blessings of Allah we will attend the Nikkah of {couple}.",
  },

  /* ── Notes for guests (dress code, parking, directions…) ──────────────── */
  guestNotes: {
    eyebrow: "Guest Information",
    heading: "Notes for Our Guests",
    // The whole block stays hidden while this list is empty.
    // Available icons: clock, pin, info, check, chat, calendar.
    notes: [],
  },

  /* ── Countdown states ───────────────────────────────────────────────────── */
  countdown: {
    eyebrow: "Counting the Moments",
    heading: "Countdown to the Nikkah",
    labels: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
    arrived: "Alhamdulillah, the blessed day has arrived.",
    past: "Alhamdulillah, the blessed Nikkah has taken place. Thank you for your prayers.",
  },

  /* ── Opening screen ─────────────────────────────────────────────────────── */
  opening: {
    label: "Nikkah Invitation",
    prompt: "With the blessings of Almighty Allah",
    button: "Open Invitation",
    skip: "Enter directly",
  },

  /* ── Blessing ───────────────────────────────────────────────────────────── */
  blessing: {
    arabic: "بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    english:
      "May Allah bless you both, shower His blessings upon you, and unite you in goodness.",
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
    { label: "Our Family", href: "#family" },
    { label: "Details", href: "#details" },
    { label: "Countdown", href: "#countdown" },
    { label: "Blessings", href: "#blessing" },
  ],
};

export default invitation;
