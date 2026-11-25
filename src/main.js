/* ══════════════════════════════════════════════════════════════════════════
   SHIBIL & HIBA — invite interactions
   Opening curtain · live countdown · sharing · calendar · scroll reveals
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var docEl = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var payload = {};
  try {
    var dataEl = document.getElementById("invitation-data");
    payload = dataEl ? JSON.parse(dataEl.textContent || "{}") : {};
  } catch (error) {
    payload = {};
  }

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  /* ── Guest name (?to=Family+Name) & RSVP links ────────────────────────── */

  var guestName = "";
  try {
    var params = new URLSearchParams(window.location.search);
    guestName = (params.get("to") || "").replace(/[<>`"]/g, "").trim().slice(0, 80);
  } catch (error) {
    guestName = "";
  }

  if (guestName && payload.personalization && payload.personalization.greeting) {
    var guestEl = $("[data-guest]");
    if (guestEl) {
      // textContent keeps the name injection-safe.
      guestEl.textContent = payload.personalization.greeting.replace("{name}", guestName);
      guestEl.hidden = false;
    }
  }

  $$("[data-rsvp]").forEach(function (link) {
    var cfg = payload.rsvp || {};
    var number = String(cfg.whatsapp || "").replace(/\D/g, "");
    if (!number) return;
    var message = String(cfg.message || "")
      .replace("{guest}", guestName)
      .replace("{couple}", payload.couple || "");
    link.href = "https://wa.me/" + number + (message ? "?text=" + encodeURIComponent(message) : "");
  });

  /* ── Toast ─────────────────────────────────────────────────────────────── */

  var toastEl = $("[data-toast]");
  var toastTimer = null;

  function toast(message) {
    if (!toastEl || !message) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 3200);
  }

  /* ── Opening curtain ──────────────────────────────────────────────────── */

  var opening = $("[data-opening]");
  var opened = false;

  function finishOpening() {
    if (!opening) return;
    opening.classList.add("is-gone");
    opening.setAttribute("aria-hidden", "true");
    opening.setAttribute("inert", "");
    docEl.classList.remove("opening-open");
    docEl.classList.add("is-open");

    var heading = document.getElementById("hero-title");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
    startReveals();
  }

  function openInvitation() {
    if (!opening || opened) return;
    opened = true;
    docEl.classList.add("is-open");
    opening.classList.add("is-closing");
    opening.removeAttribute("inert");

    var delay = reduceMotion ? 60 : 950;
    window.setTimeout(finishOpening, delay);
  }

  function skipOpening() {
    if (!opening) return;
    opened = true;
    opening.classList.add("is-closing", "is-gone");
    opening.setAttribute("aria-hidden", "true");
    opening.setAttribute("inert", "");
    docEl.classList.remove("opening-open");
    docEl.classList.add("is-open");
    startReveals();
  }

  if (opening) {
    var openButton = $("[data-open]", opening);
    var skipButton = $("[data-skip]", opening);

    // A link that points straight at a section (e.g. #details) should not be
    // hidden behind the curtain.
    if (window.location.hash && window.location.hash.length > 1) {
      skipOpening();
    } else {
      docEl.classList.add("opening-open");
      if (openButton) {
        window.setTimeout(function () {
          openButton.focus({ preventScroll: true });
        }, 300);
      }
    }

    if (openButton) openButton.addEventListener("click", openInvitation);
    if (skipButton) skipButton.addEventListener("click", skipOpening);

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || opened) return;
      if (!opening.classList.contains("is-closing")) {
        event.preventDefault();
        skipOpening();
      }
    });

    // Keep keyboard focus inside the curtain while it is open.
    opening.addEventListener("keydown", function (event) {
      if (event.key !== "Tab" || opened) return;
      var focusable = $$("button, a[href]", opening);
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  /* ── Scroll reveals ───────────────────────────────────────────────────── */

  var revealStarted = false;

  function startReveals() {
    if (revealStarted) return;
    revealStarted = true;

    var items = $$(".reveal");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    document.body.classList.add("reveal-ready");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" },
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  if (!opening) startReveals();

  /* ── Countdown ────────────────────────────────────────────────────────── */

  (function countdown() {
    var root = $("[data-countdown]");
    if (!root) return;

    var target = new Date(root.getAttribute("data-target") || "");
    var targetTime = target.getTime();
    if (isNaN(targetTime)) return;

    var values = {
      days: $("[data-count='days']", root),
      hours: $("[data-count='hours']", root),
      minutes: $("[data-count='minutes']", root),
      seconds: $("[data-count='seconds']", root),
    };
    var message = $("[data-countdown-message]");
    var live = $("[data-countdown-live]");
    var messageEn = message ? $(".countdown__message-en", message) : null;
    var labels = payload.countdown || {};
    var finished = false;
    var lastAnnouncement = "";

    function pad(value) {
      return value < 10 ? "0" + value : String(value);
    }

    function updateValue(element, value) {
      if (!element) return;
      var next = String(value);
      if (element.textContent === next) return;
      element.textContent = next;
      if (!reduceMotion && typeof element.animate === "function") {
        element.animate(
          [
            { opacity: 0.55, transform: "translate3d(0, -5px, 0)" },
            { opacity: 1, transform: "translate3d(0, 0, 0)" },
          ],
          { duration: 300, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
        );
      }
    }

    function announce(text) {
      if (!live) return;
      if (text === lastAnnouncement) return;
      lastAnnouncement = text;
      live.textContent = text;
    }

    function complete(kind) {
      finished = true;
      var isArrived = kind === "arrived";
      var text = isArrived ? labels.arrived || "" : labels.past || "";
      if (messageEn) messageEn.textContent = text;
      if (message) message.classList.add("is-visible");
      root.classList.add("is-complete");
      announce(text);
    }

    function tick() {
      if (finished) return;
      var now = Date.now();
      var diff = targetTime - now;

      if (diff <= 0) {
        // The ceremony lasts a few hours — celebrate it, then close the chapter.
        var weddingWindow = 6 * 60 * 60 * 1000;
        complete(now - targetTime < weddingWindow ? "arrived" : "past");
        return;
      }

      var totalSeconds = Math.floor(diff / 1000);
      var days = Math.floor(totalSeconds / 86400);
      var hours = Math.floor((totalSeconds % 86400) / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      var seconds = totalSeconds % 60;

      updateValue(values.days, days);
      updateValue(values.hours, pad(hours));
      updateValue(values.minutes, pad(minutes));
      updateValue(values.seconds, pad(seconds));

      var readable =
        days > 0
          ? days + (days === 1 ? " day, " : " days, ") + hours + (hours === 1 ? " hour" : " hours")
          : hours > 0
            ? hours + (hours === 1 ? " hour" : " hours") + ", " + minutes + " minutes"
            : minutes + (minutes === 1 ? " minute" : " minutes");
      announce(readable + " until the Nikkah.");
    }

    tick();
    var timer = window.setInterval(tick, 1000);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        window.clearInterval(timer);
      } else if (!finished) {
        tick();
        timer = window.setInterval(tick, 1000);
      }
    });
  })();

  /* ── Sharing ──────────────────────────────────────────────────────────── */

  function inviteUrl() {
    return window.location.href.split("#")[0];
  }

  function shareMessage() {
    var template = (payload.share && payload.share.template) || "";
    return template.replace("__URL__", inviteUrl());
  }

  function whatsappShare() {
    var text = shareMessage();
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener");
  }

  function shareInvitation() {
    var text = shareMessage();
    var title = document.title;

    if (navigator.share) {
      navigator
        .share({ title: title, text: text })
        .catch(function (error) {
          if (error && error.name === "AbortError") return;
          whatsappShare();
        });
      return;
    }

    whatsappShare();
  }

  $$("[data-share]").forEach(function (button) {
    button.addEventListener("click", shareInvitation);
  });

  function legacyCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (error) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  function copyLink() {
    var url = inviteUrl();
    var done = function (ok) {
      toast(
        ok
          ? (payload.share && payload.share.copied) || "Link copied"
          : (payload.share && payload.share.copyFailed) || "Copy failed",
      );
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(
        function () {
          done(true);
        },
        function () {
          done(legacyCopy(url));
        },
      );
      return;
    }
    done(legacyCopy(url));
  }

  $$("[data-copy]").forEach(function (button) {
    button.addEventListener("click", copyLink);
  });

  /* ── Calendar (.ics download) ─────────────────────────────────────────── */

  $$("[data-ics]").forEach(function (button) {
    button.addEventListener("click", function () {
      var calendar = payload.calendar || {};
      if (!calendar.ics) return;
      var blob = new Blob([calendar.ics], { type: "text/calendar;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = calendar.filename || "nikkah.ics";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1500);
      toast("Calendar file downloaded");
    });
  });

  /* ── Music (optional, off by default) ─────────────────────────────────── */

  (function music() {
    var toggle = $("[data-music]");
    var audio = $("[data-audio]");
    if (!toggle || !audio) return;

    audio.volume = 0.32;

    function paint(playing) {
      toggle.setAttribute("aria-pressed", playing ? "true" : "false");
      toggle.setAttribute("aria-label", playing ? "Pause background music" : "Play background music");
      var icon = $("use", toggle);
      if (icon) icon.setAttribute("href", playing ? "#i-music" : "#i-music-off");
    }

    toggle.addEventListener("click", function () {
      if (audio.paused) {
        audio
          .play()
          .then(function () {
            paint(true);
          })
          .catch(function () {
            paint(false);
          });
      } else {
        audio.pause();
        paint(false);
      }
    });

    audio.addEventListener("pause", function () {
      paint(false);
    });
  })();

  /* ── Header state + active navigation ─────────────────────────────────── */

  var header = $("[data-header]");
  if (header) {
    var paintHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 6);
    };
    paintHeader();
    window.addEventListener("scroll", paintHeader, { passive: true });
  }

  (function activeNav() {
    if (!("IntersectionObserver" in window)) return;
    var links = $$(".site-nav__link");
    if (!links.length) return;

    var map = {};
    links.forEach(function (link) {
      var id = link.getAttribute("href");
      if (!id || id.charAt(0) !== "#") return;
      var section = document.querySelector(id);
      if (section) map[section.id] = link;
    });

    var ids = Object.keys(map);
    if (!ids.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            link.classList.remove("is-active");
            link.removeAttribute("aria-current");
          });
          var link = map[entry.target.id];
          if (link) {
            link.classList.add("is-active");
            link.setAttribute("aria-current", "location");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    ids.forEach(function (id) {
      observer.observe(document.getElementById(id));
    });
  })();
})();
