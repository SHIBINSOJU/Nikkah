/**
 * Build-time derivations.
 *
 * All dates are formatted in the event's own timezone (Asia/Kolkata by default)
 * using Intl, so typography, countdown, calendar links and the .ics file can
 * never disagree with each other.
 */

const pad = (n) => String(n).padStart(2, "0");

/** Milliseconds by which `date`'s wall clock in `timeZone` is ahead of UTC. */
export function zoneOffset(timeZone, date) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = {};
  for (const { type, value } of dtf.formatToParts(date)) {
    if (type !== "literal") parts[type] = Number(value);
  }
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour % 24,
    parts.minute,
    parts.second,
  );
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/** Convert a wall-clock date + time in `timeZone` to a real UTC Date. */
export function zonedToUtc(dateISO, time, timeZone) {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  let ts = guess - zoneOffset(timeZone, new Date(guess));
  ts = guess - zoneOffset(timeZone, new Date(ts));
  return new Date(ts);
}

export function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Human readable strings for the event date/time, in the event timezone. */
export function describeMoment(dateISO, time, timeZone) {
  const instant = zonedToUtc(dateISO, time, timeZone);
  const dateFmt = (opts) => new Intl.DateTimeFormat("en-GB", { timeZone, ...opts });
  return {
    instant,
    weekday: dateFmt({ weekday: "long" }).format(instant),
    day: dateFmt({ day: "numeric" }).format(instant),
    month: dateFmt({ month: "long" }).format(instant),
    monthShort: dateFmt({ month: "short" }).format(instant),
    year: dateFmt({ year: "numeric" }).format(instant),
    shortDate: dateFmt({ day: "numeric", month: "long", year: "numeric" }).format(instant),
    longDate: dateFmt({
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(instant),
    time12: dateFmt({ hour: "numeric", minute: "2-digit", hour12: true })
      .format(instant)
      .replace(/\b(am|pm)\b/i, (match) => match.toUpperCase()),
    time24: `${pad(Number(time.split(":")[0]))}:${pad(Number(time.split(":")[1] || 0))}`,
  };
}

function toCalendarStamp(date) {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

export function buildInviteContext(config) {
  const { event, venue } = config;
  const when = describeMoment(event.date, event.time, event.timezone);
  const duration = Number(event.durationMinutes) || 120;
  const end = new Date(when.instant.getTime() + duration * 60 * 1000);
  const couple = `${config.groom.name} & ${config.bride.name}`;
  const place = [venue.name, venue.city, venue.district, venue.state, venue.country]
    .filter(Boolean)
    .join(", ");

  const tokens = {
    couple,
    groom: config.groom.name,
    bride: config.bride.name,
    date: when.shortDate,
    day: when.weekday,
    time: `${when.time12} ${event.timezoneLabel}`.trim(),
    venue: venue.name,
    city: venue.city,
    place,
  };

  const fill = (template = "") =>
    String(template).replace(/\{(\w+)\}/g, (match, key) =>
      key in tokens ? tokens[key] : match,
    );

  const calendarDetails = [
    fill(event.description),
    "",
    `Date: ${when.longDate}`,
    `Time: ${when.time12} ${event.timezoneLabel}`.trim(),
    `Venue: ${place}`,
  ].join("\n");

  const googleUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(event.title + " — " + couple)}` +
    `&dates=${toCalendarStamp(when.instant)}/${toCalendarStamp(end)}` +
    `&ctz=${encodeURIComponent(event.timezone)}` +
    `&details=${encodeURIComponent(calendarDetails)}` +
    `&location=${encodeURIComponent(place)}`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nikkah Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:nikkah-${event.date.replace(/-/g, "")}@nikkah-invitation`,
    `DTSTAMP:${toCalendarStamp(new Date())}`,
    `DTSTART:${toCalendarStamp(when.instant)}`,
    `DTEND:${toCalendarStamp(end)}`,
    `SUMMARY:${event.title} — ${couple}`,
    `DESCRIPTION:${calendarDetails.replace(/\n/g, "\\n")}`,
    `LOCATION:${place}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const shareMessage = String(config.share.message).replace(/\{(\w+)\}/g, (match, key) => {
    if (key === "url") return "__URL__";
    return key in tokens ? tokens[key] : match;
  });

  return {
    when,
    place,
    couple,
    tokens,
    fill,
    calendar: {
      googleUrl,
      ics,
      filename: `nikkah-${config.groom.shortName.toLowerCase()}-${config.bride.shortName.toLowerCase()}.ics`,
      details: calendarDetails,
    },
    shareMessage,
    mapsUrl: venue.mapsUrl || "",
    weddingHasPassed: Date.now() > end.getTime(),
  };
}
