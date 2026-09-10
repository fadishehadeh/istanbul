/* İstanbul Trip Companion — app logic */
(function () {
  "use strict";

  /* ---------------- storage ---------------- */
  const KEY = "ist2026";
  const defaults = {
    theme: "light", saved: [], visited: [], ticks: {}, packing: [],
    spend: [], notes: "", custom: [], cat: "all", pre: [], fadiCat: "all", lang: "en"
  };
  let S;
  try { S = Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || "{}")); }
  catch (e) { S = Object.assign({}, defaults); }

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  let myPos = null;   // [lat, lng] once you tap "Near me"; never stored
  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const mapUrl = (q) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q + ", İstanbul");
  // Photos: links out to an image search rather than hosting anyone's pictures
  const photoUrl = (q) => "https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(q + " İstanbul");

  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(() => { t.hidden = true; }, 1900);
  }

  /* ---------------- theme ---------------- */
  function applyTheme() {
    const dark = S.theme ? S.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }
  applyTheme();
  $("#themeBtn").addEventListener("click", () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    S.theme = dark ? "light" : "dark"; save(); applyTheme();
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (!S.theme) applyTheme(); });

  /* ---------------- language ----------------
     Arabic falls back to the English source field by field, so a partial
     translation shows mixed rather than blank. */
  function isAr() { return S.lang === "ar"; }
  const ltr = (x) => '<span dir="ltr">' + esc(x) + "</span>";
  function TX(path, fallback) {
    if (!isAr() || typeof AR === "undefined") return fallback;
    const bits = path.split(".");
    let v = AR.ui;
    for (let i = 0; i < bits.length; i++) { v = v && v[bits[i]]; }
    return (v == null || v === "") ? fallback : v;
  }
  /* translated day, if one exists */
  /* A("essentials", 3, "title") -> Arabic string, or undefined */
  function A(section, i, field) {
    if (!isAr() || typeof AR === "undefined" || !AR[section]) return undefined;
    const row = AR[section][i];
    if (row == null) return undefined;
    return field ? row[field] : row;
  }
  function arFadi(sectionId, i) {
    if (!isAr() || typeof AR === "undefined" || !AR.fadi || !AR.fadi.items) return null;
    const rows = AR.fadi.items[sectionId];
    return (rows && rows[i]) || null;
  }
  function arFadiSection(sectionId) {
    if (!isAr() || typeof AR === "undefined" || !AR.fadi || !AR.fadi.sections) return null;
    return AR.fadi.sections[sectionId] || null;
  }
  const AR_DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  /* opening hours and transport bits, looked up by their English source */
  /* nextPrayer() hands back "45 min", "3h 12m" or "tomorrow" */
  function inLabel(t) {
    if (!isAr()) return "in " + t;
    if (t === "tomorrow") return TX("tomorrow", "tomorrow");
    let m = t.match(/^(\d+) min$/);
    if (m) return TX("inMinutes", "in") + " " + m[1] + " " + TX("minuteWord", "min");
    m = t.match(/^(\d+)h (\d+)m$/);
    if (m) return TX("inMinutes", "in") + " " + m[1] + " " + TX("hourShort", "h") + " " + m[2] + " " + TX("minShort", "m");
    return t;
  }

  function prayerName(n) { return (isAr() && AR.tools && AR.tools.prayers && AR.tools.prayers[n]) || n; }
  function hoursLabel(h) { return (isAr() && AR.hours && AR.hours[h]) || h; }
  function TH(k, en) { return (isAr() && AR.transport && AR.transport.headings && AR.transport.headings[k]) || en; }
  function TL2(section, i, field) {
    if (!isAr() || !AR.transport || !AR.transport[section]) return null;
    const row = AR.transport[section][i];
    if (!row) return null;
    return field ? row[field] : row;
  }
  function TO(k, en) { return (isAr() && AR.tools && AR.tools[k]) || en; }

  function openLabel(st) {
    if (!isAr() || !st.key) return st.why;
    switch (st.key) {
      case "anytime":      return "مفتوح دائماً";
      case "openNow":      return "مفتوح الآن";
      case "closedNow":    return "مغلق الآن";
      case "runningToday":  return "يعمل اليوم";
      case "opensIn":      return "يفتح بعد " + st.n + " دقيقة";
      case "closesIn":     return "يغلق بعد " + st.n + " دقيقة";
      case "closedDay":    return "مغلق يوم " + AR_DAYS[st.day];
      case "onlyDay":      return AR_DAYS[st.day] + " فقط";
      default:              return st.why;
    }
  }
  function catLabel(c) {
    const m = { eat: "مطاعم", cafe: "مقاهٍ وحلويات", district: "جديد ومتجدّد", mall: "مولات وتسوّق",
                bazaar: "بازارات وأسواق", sight: "معالم", view: "إطلالات وأسطح",
                bosphorus: "البوسفور والعبّارات", night: "أمسيات", trip: "رحلات يوم" };
    return (isAr() && m[c.id]) || c.label;
  }
  function arPlace(id) {
    if (!isAr() || typeof AR === "undefined" || !AR.places) return null;
    return AR.places[id] || null;
  }
  /* Arabic counts 3-10 with the plural, everything else with the singular */
  function arCount(n, singular, plural) {
    if (!isAr()) return n + " " + (n === 1 ? singular : plural);
    return n + " " + (n >= 3 && n <= 10 ? plural : singular);
  }

  function dowOf(d) { return (isAr() && AR.ui.dows && AR.ui.dows[d]) || d; }

  function arDay(n) {
    return (isAr() && typeof AR !== "undefined" && AR.itinerary) ? AR.itinerary[n] : null;
  }
  function applyLang() {
    const ar = isAr();
    document.documentElement.lang = ar ? "ar" : "en";
    document.documentElement.dir = ar ? "rtl" : "ltr";
    const b = $("#langBtn");
    if (b) b.textContent = ar ? "EN" : "ع";
  }
  applyLang();
  $("#langBtn").addEventListener("click", () => {
    S.lang = isAr() ? "en" : "ar"; save(); applyLang(); renderAll();
  });

  /* ---------------- dates ---------------- */
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const toDate = (iso) => { const p = iso.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
  const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayDiff = (a, b) => Math.round((midnight(a) - midnight(b)) / 86400000);
  const fmt = (iso) => {
    const d = toDate(iso);
    if (isAr() && AR.ui.months) return d.getDate() + " " + AR.ui.months[d.getMonth()];
    return d.getDate() + " " + MONTHS[d.getMonth()].slice(0, 3);
  };

  const START = toDate(TRIP.start), END = toDate(TRIP.end);
  const now = () => new Date();
  function tripDayIndex() {           // 0-based index into ITINERARY, or null
    const n = dayDiff(now(), START);
    return (n >= 0 && n < ITINERARY.length) ? n : null;
  }

  /* ---------------- places (built-in + custom) ---------------- */
  const catById = {};
  CATEGORIES.forEach((c) => { catById[c.id] = c; });

  const allPlaces = () => PLACES.concat(S.custom);
  const findPlace = (id) => allPlaces().filter((p) => p.id === id)[0];

  /* ================= TODAY ================= */
  function renderToday() {
    const d = now(), idx = tripDayIndex();
    const range = fmt(TRIP.start) + " – " + fmt(TRIP.end) + " " + toDate(TRIP.end).getFullYear();
    $("#tripRange").innerHTML = isAr()
      ? esc(fmt(TRIP.start) + " – " + fmt(TRIP.end))
      : ltr(fmt(TRIP.start) + " – " + fmt(TRIP.end));

    const kicker = $("#heroKicker"), title = $("#heroTitle"), sub = $("#heroSub"), count = $("#heroCount");

    if (idx === null && d < START) {
      const n = dayDiff(START, d);
      kicker.textContent = TX("heroCountdownKicker", "Counting down");
      title.textContent = "İstanbul";
      sub.innerHTML = ltr(range) + " · " + esc(TX("stayingAt", "staying at")) + " " + esc(TRIP.hotel.name) + ", Fındıklı.";
      count.innerHTML = "<b>" + n + "</b><span>" + esc(n === 1 ? TX("heroDayToGo", "day to go") : TX("heroDaysToGo", "days to go")) + "</span>";
    } else if (idx === null) {
      kicker.textContent = TX("heroDone", "That's a wrap");
      title.textContent = "İstanbul";
      sub.textContent = TX("heroDoneSub", "Hope it was a good one. Everything you saved is still in your list.");
      count.innerHTML = "<b>✈️</b><span>" + esc(TX("heroHome", "Home")) + "</span>";
    } else {
      const day = ITINERARY[idx];
      kicker.textContent = dowOf(day.dow) + " · " + fmt(day.date);
      title.textContent = (arDay(day.n) || {}).title || day.title;
      sub.textContent = (arDay(day.n) || {}).subtitle || day.subtitle;
      count.innerHTML = "<b>" + day.n + "</b><span>" + esc(TX("heroOf", "of")) + " " + ITINERARY.length + "</span>";
    }

    $("#qHotel").href = mapUrl(TRIP.hotel.map);
    $("#placeCount").textContent = isAr()
      ? allPlaces().length + " " + TX("spots", "spots")
      : allPlaces().length + " spots";

    const block = $("#todayBlock");
    const day = idx === null ? ITINERARY[0] : ITINERARY[idx];
    const label = idx === null
      ? TX("dayLabel", "Day") + " 1 · " + dowOf(day.dow) + " " + fmt(day.date)
      : TX("todayLabel", "Today") + " · " + dowOf(day.dow);
    block.innerHTML =
      '<div class="today-card">' +
        '<div class="today-top">' +
          '<div class="today-day">' + esc(label) + "</div>" +
          '<h2 class="today-title">' + esc((arDay(day.n) || {}).title || day.title) + "</h2>" +
          '<p class="today-sub">' + esc((arDay(day.n) || {}).subtitle || day.subtitle) + "</p>" +
          carHtml(day) +
        "</div>" +
        '<div class="today-body">' + timelineHtml(day) + "</div>" +
      "</div>";
    wireTimeline(block);

    const notes = $("#hotelNotes");
    notes.innerHTML = TRIP.hotel.notes.map((n, i) => "<li>" + esc((isAr() && AR.hotelNotes && AR.hotelNotes[i]) || n) + "</li>").join("");
  }

  function carHtml(day) {
    if (!day.car) return "";
    return '<div class="carnote ' + (day.car.use ? "yes" : "no") + '">' +
      "<b>" + (day.car.use ? TX("takeCar", "🚗 Take the car") : TX("leaveCar", "🚊 Leave the car")) + "</b>" +
      esc((arDay(day.n) || {}).car || day.car.text) + "</div>";
  }

  /* ================= PLAN ================= */
  function timelineHtml(day) {
    const ticks = S.ticks[day.n] || [];
    const tr = arDay(day.n);
    return '<ul class="tl">' + day.items.map((it, i) => {
      const done = ticks.indexOf(i) > -1;
      const p = it.place ? findPlace(it.place) : null;
      return '<li class="' + (done ? "done" : "") + '" data-day="' + day.n + '" data-i="' + i + '">' +
        '<button class="tl-dot" aria-label="Mark done"></button>' +
        '<div class="tl-time">' + esc(it.time) + "</div>" +
        '<div class="tl-t">' + esc((tr && tr.items && tr.items[i] && tr.items[i].title) || it.title) + "</div>" +
        '<div class="tl-n">' + esc((tr && tr.items && tr.items[i] && tr.items[i].note) || it.note) + "</div>" +
        (function () {
          const q = p ? (p.name + " " + p.area) : (it.map || "");
          if (!q) return "";
          return '<a class="tl-link" target="_blank" rel="noopener" href="' + mapUrl(q) + '">📍 ' + esc(p ? p.name : TX("openInMaps", "Open in Maps")) + "</a>" +
                 '<a class="tl-link photo" target="_blank" rel="noopener" href="' + photoUrl(q) + '">' + TX("photos", "📷 Photos") + "</a>";
        })() +
      "</li>";
    }).join("") + "</ul>";
  }

  function wireTimeline(root) {
    $$(".tl-dot", root).forEach((btn) => {
      btn.addEventListener("click", function () {
        const li = this.closest("li");
        const dn = li.getAttribute("data-day"), i = +li.getAttribute("data-i");
        const arr = S.ticks[dn] || (S.ticks[dn] = []);
        const at = arr.indexOf(i);
        if (at > -1) arr.splice(at, 1); else arr.push(i);
        save();
        li.classList.toggle("done");
        const day = $("#view-plan .day[data-n='" + dn + "']");
        if (day) updateProgress(day, dn);
      });
    });
  }

  function updateProgress(dayEl, n) {
    const total = ITINERARY[+n - 1].items.length;
    const done = (S.ticks[n] || []).length;
    const el = $(".prog", dayEl);
    if (el) el.textContent = done ? done + " of " + total + " done" : total + " stops";
  }

  function renderPlan() {
    const idx = tripDayIndex();
    $("#dayList").innerHTML = ITINERARY.map((day, i) => {
      const done = (S.ticks[day.n] || []).length;
      const cls = ["day"];
      if (idx !== null && i === idx) cls.push("is-today", "is-open");
      if (idx !== null && i < idx) cls.push("is-past");
      return '<article class="' + cls.join(" ") + '" data-n="' + day.n + '">' +
        '<button class="day-head">' +
          '<span class="day-num"><small>' + esc(TX("dayWord", "Day")) + '</small><b>' + day.n + "</b></span>" +
          '<span class="day-meta">' +
            '<span class="dow">' + esc(dowOf(day.dow)) + " · " + fmt(day.date) + "</span>" +
            "<h3>" + esc((arDay(day.n) || {}).title || day.title) + "</h3>" +
            '<span class="prog">' + (done ? done + " " + TX("doneOf", "of") + " " + day.items.length + " " + TX("done", "done") : arCount(day.items.length, TX("stops", "stop"), TX("stopsPlural", "stops"))) + "</span>" +
          "</span>" +
          '<span class="day-caret">▶</span>' +
        "</button>" +
        '<div class="day-panel">' +
          '<p class="day-sub">' + esc((arDay(day.n) || {}).subtitle || day.subtitle) + "</p>" +
          '<div class="tagrow">' + (((arDay(day.n) || {}).tags) || day.tags).map((t) => '<span class="tag">' + esc(t) + "</span>").join("") + "</div>" +
          carHtml(day) +
          timelineHtml(day) +
          '<div class="swap"><b>' + TX("swapLabel", "Swap / backup") + "</b>" + esc((arDay(day.n) || {}).swap || day.swap) + "</div>" +
        "</div>" +
      "</article>";
    }).join("");

    $$("#dayList .day-head").forEach((h) => {
      h.addEventListener("click", () => h.parentNode.classList.toggle("is-open"));
    });
    wireTimeline($("#dayList"));
  }

  /* ================= PLACES ================= */
  function priceStr(p) {
    if (p === 0) return TX("free", "Free");
    return "₺".repeat(Math.max(1, p || 1));
  }

  function placeCard(p, opts) {
    opts = opts || {};
    const c = catById[p.cat] || { icon: "📍", label: "Place" };
    const isSaved = S.saved.indexOf(p.id) > -1;
    const isVisited = S.visited.indexOf(p.id) > -1;
    const st = openState(p);
    const ap = arPlace(p.id);
    const dist = myPos ? (function () {
      const co = coordsFor(p);
      return co ? walkText(haversine(myPos, co)) : null;
    })() : null;
    return '<article class="place' + (isVisited ? " visited" : "") + '" data-id="' + esc(p.id) + '">' +
      '<div class="place-head">' +
        '<span class="place-ic">' + c.icon + "</span>" +
        '<div class="place-main">' +
          '<div class="place-name">' + esc(p.name) + "</div>" +
          '<div class="place-meta">' +
            "<span>" + esc(catLabel(c)) + "</span>" +
            (p.area ? '<span class="dot-sep">' + esc((ap && ap.a) || p.area) + "</span>" : "") +
            '<span class="dot-sep">' + priceStr(p.price) + "</span>" +
            (dist ? '<span class="badge-dist">' + esc(dist) + "</span>" : "") +
            (st.state !== "unknown" ? '<span class="badge-open ' + st.state + '">' + esc(openLabel(st)) + "</span>" : "") +
            (p.isNew ? '<span class="badge-new">' + esc(TX("recentlyOpened", "recently opened")) + "</span>" : "") +
            (p.alcohol ? '<span class="badge-alc">' + esc(TX("servesAlcohol", "serves alcohol")) + "</span>" : "") +
            (p.mine ? '<span class="badge-mine">' + esc(TX("yours", "yours")) + "</span>" : "") +
          "</div>" +
          (p.why ? '<p class="place-why">' + esc((ap && ap.w) || p.why) + "</p>" : "") +
        "</div>" +
        '<button class="save-btn' + (isSaved ? " is-on" : "") + '" data-act="save" aria-label="Save">' + (isSaved ? "★" : "☆") + "</button>" +
      "</div>" +
      '<div class="place-more">' +
        '<div class="detail">' +
          (p.from  ? '<div><span class="ic">🚋</span><b>' + esc(TX("gettingThere", "Getting there:")) + "</b> " + esc((ap && ap.f) || p.from) + "</div>" : "") +
          (p.tip   ? '<div><span class="ic">💡</span><b>' + esc(TX("tip", "Tip:")) + "</b> " + esc((ap && ap.t) || p.tip) + "</div>" : "") +
          (p.hours ? '<div><span class="ic">🕒</span><b>' + esc(TX("hours", "Hours:")) + "</b> " + esc(hoursLabel(p.hours)) + "</div>" : "") +
        "</div>" +
        '<div class="place-actions">' +
          '<a class="act map" target="_blank" rel="noopener" href="' + mapUrl(p.name + " " + (p.area || "")) + '">' + esc(TX("openInMaps", "Open in Maps")) + "</a>" +
          '<button class="act' + (isVisited ? " is-on" : "") + '" data-act="visit">' + (isVisited ? TX("visited", "✓ Been there") : TX("markVisited", "Mark as been")) + "</button>" +
          (p.mine ? '<button class="act del" data-act="delete">Delete</button>' : "") +
        "</div>" +
      "</div>" +
    "</article>";
  }

  function wirePlaces(root) {
    $$(".place", root).forEach((el) => {
      const id = el.getAttribute("data-id");
      el.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-act]");
        if (!btn) {
          if (!e.target.closest("a")) el.classList.toggle("is-open");
          return;
        }
        const act = btn.getAttribute("data-act");
        if (act === "save") {
          const at = S.saved.indexOf(id);
          if (at > -1) { S.saved.splice(at, 1); toast("Removed from list"); }
          else { S.saved.push(id); toast("Saved to your list"); }
        } else if (act === "visit") {
          const at = S.visited.indexOf(id);
          if (at > -1) S.visited.splice(at, 1); else { S.visited.push(id); toast("Nice one ✓"); }
        } else if (act === "delete") {
          if (!confirm("Delete this place from your list?")) return;
          S.custom = S.custom.filter((p) => p.id !== id);
          S.saved = S.saved.filter((x) => x !== id);
          S.visited = S.visited.filter((x) => x !== id);
          toast("Deleted");
        }
        save(); renderPlaces(); renderSaved(); renderToday();
      });
    });
  }

  function renderChips() {
    const wrap = $("#catChips");
    const counts = {};
    allPlaces().forEach((p) => { counts[p.cat] = (counts[p.cat] || 0) + 1; });
    wrap.innerHTML =
      '<button class="chip' + (S.cat === "all" ? " is-on" : "") + '" data-cat="all">' + esc(TX("all", "All")) + " " + allPlaces().length + "</button>" +
      CATEGORIES.map((c) =>
        '<button class="chip' + (S.cat === c.id ? " is-on" : "") + '" data-cat="' + c.id + '">' +
        c.icon + " " + esc(catLabel(c)) + " " + (counts[c.id] || 0) + "</button>").join("");
    $$(".chip", wrap).forEach((b) => b.addEventListener("click", () => {
      S.cat = b.getAttribute("data-cat"); save(); renderChips(); renderPlaces();
    }));
  }

  function renderPlaces() {
    const q = ($("#search").value || "").trim().toLowerCase();
    const onlySaved = $("#onlySaved").checked, hideVisited = $("#hideVisited").checked;
    const openOnly = $("#openNow").checked;

    let list = allPlaces();
    if (S.cat !== "all") list = list.filter((p) => p.cat === S.cat);
    if (onlySaved) list = list.filter((p) => S.saved.indexOf(p.id) > -1);
    if (hideVisited) list = list.filter((p) => S.visited.indexOf(p.id) === -1);
    // "Open now" removes only what is definitely shut — places whose hours
    // can't be read stay, flagged, rather than silently disappearing.
    if (openOnly) list = list.filter((p) => openState(p).state !== "closed");
    if (q) {
      list = list.filter((p) => [p.name, p.area, p.why, p.tip, p.from, (catById[p.cat] || {}).label]
        .join(" ").toLowerCase().indexOf(q) > -1);
    }

    if (myPos) {
      list = list.map((p) => {
        const co = coordsFor(p);
        return { p: p, d: co ? haversine(myPos, co) : Infinity };
      }).sort((a, b) => a.d - b.d).map((x) => x.p);
    }

    $("#resultCount").textContent = list.length + " " + TX("placesCount", list.length === 1 ? "place" : "places") +
      (myPos ? " · " + TX("nearestFirst", "nearest first") : "");
    const el = $("#placeList");
    el.innerHTML = list.length
      ? list.map((p) => placeCard(p)).join("")
      : '<div class="empty">Nothing matches that. Try clearing the filters or searching for something else.</div>';
    wirePlaces(el);
  }

  /* ================= SAVED ================= */
  function renderSaved() {
    const saved = S.saved.map(findPlace).filter(Boolean);
    const visited = S.visited.map(findPlace).filter(Boolean);
    $("#savedCount").textContent = saved.length;
    $("#visitedCount").textContent = visited.length;

    const sv = $("#savedList");
    sv.innerHTML = saved.length ? saved.map((p) => placeCard(p)).join("")
      : '<div class="empty">' + esc(TX("emptySaved", "Tap the ☆ on any place to keep it here.")) + '</div>';
    wirePlaces(sv);

    const vs = $("#visitedList");
    vs.innerHTML = visited.length ? visited.map((p) => placeCard(p)).join("")
      : '<div class="empty">' + esc(TX("emptyVisited", "Nothing ticked off yet.")) + '</div>';
    wirePlaces(vs);
  }

  /* ================= DOCUMENTS =================
     Two possible sources, in this order:
       1. S.docs  — imported once on this device, lives in localStorage only
       2. DOCS    — the gitignored assets/js/documents.js, if it is present
     On a public deploy neither exists until you import, so the served files
     never carry booking, policy or passport numbers. */

  function b64encode(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function b64decode(b64) {
    const s = b64.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(s + "===".slice((s.length + 3) % 4));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  // One-time import link:  …/#docs=<base64url JSON>
  (function importFromHash() {
    const m = (location.hash || "").match(/[#&]docs=([A-Za-z0-9\-_]+)/);
    if (!m) return;
    try {
      const obj = JSON.parse(b64decode(m[1]));
      S.docs = obj; save();
      history.replaceState(null, "", location.pathname + "#guide");
      setTimeout(() => toast("Travel documents saved to this device"), 300);
    } catch (e) {
      history.replaceState(null, "", location.pathname + "#guide");
      setTimeout(() => toast("That import link was not readable"), 300);
    }
  })();

  const docsData = () => S.docs || (typeof DOCS !== "undefined" ? DOCS : null);

  function kv(rows) {
    return '<dl class="kv">' + rows.filter(Boolean).map((r) =>
      "<dt>" + esc(r[0]) + "</dt><dd>" + (r[2] ? r[1] : esc(r[1])) + "</dd>").join("") + "</dl>";
  }

  /* documents-tab label: looks the English label up in the Arabic dictionary */
  /* the documents-tab strings whose keys are not themselves the English text */
  const DOCS_EN = {
    setupTitle: "Set up your travel documents",
    setupBody: "Flights, hotel, insurance and emergency numbers, encrypted on this device. They are never part of the published site — nobody else can read them, and neither can the server.",
    foundOnDevice: "Documents found on this device. Choose a PIN to encrypt them.",
    pastePlaceholder: "Paste your travel document code here…",
    choosePin: "Choose a PIN (6+ characters)",
    encryptSave: "Encrypt & save",
    pinHint: "The PIN is the only recovery route — there is no reset. Add your fingerprint next for day-to-day unlocking.",
    pinTooShort: "PIN needs at least 4 characters",
    pasteFirst: "Paste your document code first",
    cannotRead: "Could not read that — check you copied all of it",
    encrypted: "Encrypted and saved to this device",
    cannotEncrypt: "Could not encrypt — ",
    lockedBody: "Encrypted on this device. Unlock to see your flights, hotel, insurance and emergency numbers.",
    orPin: "or enter your PIN",
    forget: "Forget documents on this device",
    waitingFinger: "Waiting for fingerprint…",
    fingerCancelled: "Fingerprint cancelled",
    fingerFailed: "Fingerprint unlock failed — use your PIN",
    wrongPin: "Wrong PIN",
    cannotUnlock: "Could not unlock",
    confirmForget: "Forget your travel documents on this device? You will need your import code to set them up again.",
    removed: "Removed from this device",
    securityBody: "Encrypted on this device with AES-GCM. The key is never stored unwrapped, and nothing is sent to the server.",
    bioOff: "Turn off fingerprint unlock",
    bioOn: "👆 Add fingerprint unlock",
    noBio: "This device or browser does not offer fingerprint unlock for web apps — your PIN is the way in.",
    locked: "Locked",
    bioEnabled: "Fingerprint unlock enabled",
    bioRemoved: "Fingerprint unlock removed",
    prfUnsupported: "This browser can't derive a key from your fingerprint — PIN only",
    cancelled: "Cancelled",
    bioFailed: "Could not enable fingerprint unlock",
    confirmBioOff: "Turn off fingerprint unlock? Your PIN will still work.",
    passportNote: "Lebanese passports are visa-free for Türkiye. Kept here because the insurance helpline asks for a passport number before they will open a case."
  };

  function DL(en) { return (isAr() && AR.docs && AR.docs[en]) || DOCS_EN[en] || en; }

  let bioReady = false;
  Vault.biometricAvailable().then((v) => { bioReady = v; });

  /* Arabic overlay for the documents: index-matched to the stored object, so any
     field the overlay leaves out (reference numbers, codes, phone numbers) keeps
     the value printed on the document. The overlay is read from the local
     documents.js when the encrypted copy predates it. */
  function overlay(base, over) {
    if (over === undefined || over === null) return base;
    if (Array.isArray(base) && Array.isArray(over)) return base.map((v, i) => overlay(v, over[i]));
    if (base && typeof base === "object" && !Array.isArray(base) && over && typeof over === "object") {
      const out = {};
      Object.keys(base).forEach((k) => { out[k] = overlay(base[k], over[k]); });
      return out;
    }
    return typeof over === "string" ? over : base;
  }

  function arDocs(d) {
    if (!isAr() || !d) return d;
    const layer = d.ar || (typeof DOCS !== "undefined" && DOCS && DOCS.ar) || null;
    if (!layer) return d;
    const merged = overlay(d, layer);
    delete merged.ar;
    return merged;
  }

  function renderDocs() {
    /* 1. Nothing stored yet — offer import */
    if (!Vault.exists()) { renderDocsImport(); return; }
    /* 2. Stored but locked */
    if (!Vault.isUnlocked()) { renderDocsLocked(); return; }
    /* 3. Open */
    renderDocsOpen(arDocs(Vault.data()));
  }

  function pane(html) { $("#pane-docs").innerHTML = '<div class="info">' + html + "</div>"; }

  function renderDocsImport() {
    const pre = docsData();   // local documents.js or a legacy plain import
    pane('<div class="info-card">' +
      "<h3><span>🔐</span>" + esc(DL("setupTitle")) + "</h3>" +
      "<p>" + esc(DL("setupBody")) + "</p>" +
      '<form id="docsImportForm" class="addform" style="margin-top:14px">' +
        (pre ? '<p class="muted">' + esc(DL("foundOnDevice")) + '</p>'
             : '<textarea id="docsImportText" rows="4" placeholder="' + esc(DL("pastePlaceholder")) + '"></textarea>') +
        '<input id="docsPin" type="password" inputmode="numeric" autocomplete="new-password" placeholder="' + esc(DL("choosePin")) + '" minlength="4" required>' +
        '<button type="submit" class="primary-btn">' + esc(DL("encryptSave")) + '</button>' +
      "</form>" +
      '<p class="saved-hint">' + esc(DL("pinHint")) + '</p>' +
    "</div>");

    $("#docsImportForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      const pin = $("#docsPin").value;
      if (!pin || pin.length < 4) { toast(DL("pinTooShort")); return; }

      let obj = pre;
      if (!obj) {
        const raw = ($("#docsImportText").value || "").trim();
        if (!raw) { toast(DL("pasteFirst")); return; }
        try { obj = JSON.parse(raw); }
        catch (e1) {
          try { obj = JSON.parse(b64decode(raw.replace(/^.*[#&]docs=/, ""))); }
          catch (e2) { toast(DL("cannotRead")); return; }
        }
      }
      try {
        await Vault.create(obj, pin);
        if (S.docs) { delete S.docs; save(); }   // drop any earlier plaintext copy
        renderDocs();
        toast(DL("encrypted"));
      } catch (err) { toast(DL("cannotEncrypt") + err.message); }
    });
  }

  function renderDocsLocked() {
    const bio = Vault.hasBiometric();
    pane('<div class="info-card locked-card">' +
      "<h3><span>🔒</span>" + esc(TX("lockedTitle", "Documents locked")) + "</h3>" +
      "<p>" + esc(DL("lockedBody")) + "</p>" +
      (bio ? '<button class="primary-btn wide" id="bioUnlock" style="margin-top:14px">' + esc(TX("unlockFingerprint", "👆 Unlock with fingerprint")) + '</button>' : "") +
      '<form id="pinForm" class="addform" style="margin-top:10px">' +
        '<input id="pinInput" type="password" inputmode="numeric" autocomplete="current-password" placeholder="' + (bio ? DL("orPin") : TX("unlockPin", "Enter your PIN")) + '" required>' +
        '<button type="submit" class="ghost-btn">' + esc(TX("unlock", "Unlock")) + '</button>' +
      "</form>" +
      '<div class="reset-row"><button class="ghost-btn danger" id="wipeDocs">' + esc(DL("forget")) + '</button></div>' +
    "</div>");

    const bu = $("#bioUnlock");
    if (bu) bu.addEventListener("click", async function () {
      this.disabled = true; this.textContent = DL("waitingFinger");
      try { await Vault.unlockWithBiometric(); renderDocs(); }
      catch (err) {
        this.disabled = false; this.textContent = TX("unlockFingerprint", "👆 Unlock with fingerprint");
        toast(err && err.name === "NotAllowedError" ? DL("fingerCancelled") : DL("fingerFailed"));
      }
    });

    $("#pinForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      try { await Vault.unlockWithPin($("#pinInput").value); renderDocs(); }
      catch (err) { toast(err.message === "BAD_PIN" ? DL("wrongPin") : DL("cannotUnlock")); }
    });

    $("#wipeDocs").addEventListener("click", () => {
      if (!confirm(DL("confirmForget"))) return;
      Vault.destroy(); renderDocs(); toast(DL("removed"));
    });
  }

  function renderDocsOpen(d) {
    let html = "";

    /* flights */
    if (d.flights) {
      html += '<div class="info-card"><h3><span>✈️</span>' + esc(DL("Flights")) + '</h3>' +
        d.flights.legs.map((l) =>
          '<div class="leg">' +
            '<div class="leg-top"><b>' + esc(l.no) + "</b><span>" + esc(l.date) + "</span></div>" +
            '<div class="leg-row">' +
              '<div class="leg-end"><b>' + esc(l.dep) + "</b><span>" + esc(l.from) + "</span></div>" +
              '<div class="leg-mid"><i></i><span>' + esc(l.duration) + "</span></div>" +
              '<div class="leg-end right"><b>' + esc(l.arr) + "</b><span>" + esc(l.to) + "</span></div>" +
            "</div>" +
            '<div class="leg-note">' + esc(l.aircraft) + "</div>" +
          "</div>").join("") +
        kv([
          [DL("Booking reference"), '<b class="mono">' + esc(d.flights.ref) + "</b>", true],
          [DL("Airline"), d.flights.airline],
          d.flights.cabin ? [DL("Cabin"), d.flights.cabin] : null,
          [DL("Baggage"), d.flights.baggage],
          [DL("Fare rules"), d.flights.fare],
          d.flights.booked ? [DL("Issued"), d.flights.booked] : null
        ]) +
        (d.flights.rules ? '<ul class="rulelist">' + d.flights.rules.map((r) =>
          "<li>" + esc(r) + "</li>").join("") + "</ul>" : "") + "</div>";
    }

    /* pre-flight checks */
    if (d.checks && d.checks.length) {
      html += '<div class="info-card"><h3><span>🔍</span>' + esc(DL("Cross-check")) + '</h3>' +
        d.checks.map((c) =>
          '<div class="check-row lvl-' + esc(c.level) + '">' +
            "<b>" + (c.level === "bad" ? "⚠️ " : c.level === "warn" ? "❗ " : "✅ ") + esc(c.title) + "</b>" +
            "<span>" + esc(c.body) + "</span>" +
          "</div>").join("") + "</div>";
    }

    /* hotels — arrival night, then the week */
    const hotels = d.hotels || (d.hotel ? [d.hotel] : []);
    hotels.forEach((h) => {
      html += '<div class="info-card"><h3><span>🏨</span>' + esc(h.name) +
        (h.tag ? ' <span class="hotel-tag">' + esc(h.tag) + "</span>" : "") + "</h3>" +
        kv([
          [DL("Address"), esc(h.address) + ' · <a class="inline-link" target="_blank" rel="noopener" href="' + mapUrl(h.map || h.name) + '">' + esc(DL("Maps")) + '</a>', true],
          [DL("Confirmation"), '<b class="mono">' + esc(h.ref) + "</b>" + (h.pin ? ' · PIN <b class="mono">' + esc(h.pin) + "</b>" : ""), true],
          [DL("Guest"), h.guest],
          [DL("Check in"), h.checkIn],
          [DL("Check out"), h.checkOut + (h.nights ? " · " + h.nights + (h.nights === 1 ? " " + DL("night") : " " + DL("nights")) : "")],
          h.room ? [DL("Room"), h.room] : null,
          h.booked ? [DL("Paid with"), h.booked] : null
        ]) +
        (h.extras ? kv(h.extras) : "") +
        (h.phone ? '<div class="calls" style="margin-top:12px"><a class="call" href="tel:' + esc(h.phone.tel) +
          '"><span>' + esc(DL("Call the hotel")) + '</span><b>' + esc(h.phone.value) + "</b></a></div>" : "") +
        (h.note ? '<p class="warn">' + esc(h.note) + "</p>" : "") + "</div>";
    });

    /* hire car */
    if (d.car) {
      const c = d.car;
      html += '<div class="info-card"><h3><span>🚗</span>' + (isAr() ? esc(DL("hire car")) + " " + esc(c.company) : esc(c.company) + " " + esc(DL("hire car"))) + "</h3>" +
        (c.critical ? '<p class="warn danger-warn">' + esc(c.critical) + "</p>" : "") +
        kv([
          [DL("Reference"), '<b class="mono">' + esc(c.ref) + "</b>", true],
          [DL("Vehicle"), c.vehicle],
          [DL("Pick up"), esc(c.pickUp.when) + "<br>" + esc(c.pickUp.where), true],
          [DL("Drop off"), esc(c.dropOff.when) + "<br>" + esc(c.dropOff.where), true],
          c.period ? [DL("Period"), c.period] : null,
          c.hours ? [DL("Desk hours"), c.hours] : null,
          [DL("Mileage"), c.mileage],
          [DL("Deposit"), c.deposit],
          [DL("Bring"), c.bring],
          [DL("Paid"), c.paid],
          c.paidUsd ? [DL("In USD"), c.paidUsd] : null
        ]) +
        (c.extras ? kv(c.extras) : "") +
        '<div class="calls" style="margin-top:12px">' +
          '<a class="call" href="tel:' + esc(c.phone.tel) + '"><span>' + esc(DL("Rental desk, IST")) + '</span><b>' + esc(c.phone.value) + "</b></a>" +
          '<a class="call" target="_blank" rel="noopener" href="' + mapUrl(c.address) + '"><span>' + esc(DL("Desk location")) + '</span><b>' + esc(DL("Map")) + '</b></a>' +
        "</div>" +
        (c.warn ? '<p class="warn">' + esc(c.warn) + "</p>" : "") + "</div>";
    }

    /* insurance */
    if (d.insurance) {
      const i = d.insurance;
      html += '<div class="info-card"><h3><span>🛡️</span>' + esc(DL("Travel insurance")) + '</h3>' +
        kv([
          [DL("Insurer"), i.provider],
          i.product ? [DL("Policy type"), i.product] : null,
          [DL("Assistance"), i.assistance],
          [DL("Valid"), i.valid],
          [DL("Cover"), i.cover],
          i.zone ? [DL("Where it applies"), i.zone] : null,
          i.limits ? [DL("Limits"), i.limits] : null,
          i.premium ? [DL("Premium"), i.premium] : null,
          i.issued ? [DL("Issued"), i.issued] : null,
          i.superseded ? [DL("Replaces"), i.superseded] : null
        ]) +
        '<dl class="kv">' + i.policies.map((p) =>
          "<dt>" + esc(p.name) + '</dt><dd><b class="mono">' + esc(p.no) + "</b></dd>").join("") + "</dl>" +
        '<div class="calls">' + i.phones.map((p) =>
          '<a class="call" href="tel:' + esc(p.tel) + '"><span>' + esc(p.label) + "</span><b>" + esc(p.value) + "</b></a>").join("") +
          (i.email ? '<a class="call" href="mailto:' + esc(i.email) + '"><span>' + esc(DL("Claims email")) + '</span><b>' + esc(i.email) + "</b></a>" : "") +
        "</div>" +
        (i.critical ? '<p class="warn danger-warn">' + esc(i.critical) + "</p>" : "") +
        (i.ready ? '<p class="muted" style="margin-top:12px"><b>' + esc(DL("Have this ready when you call:")) + '</b></p><ul class="rulelist">' +
          i.ready.map((r) => "<li>" + esc(r) + "</li>").join("") + "</ul>" : "") + "</div>";
    }

    /* travellers */
    if (d.travellers && d.travellers.length) {
      html += '<div class="info-card"><h3><span>🛂</span>' + esc(DL("Travellers")) + '</h3>' +
        d.travellers.map((t) =>
          '<div class="line"><b>' + esc(t.name) + "</b>" +
          kv([
            [DL("Passport"), '<b class="mono">' + esc(t.passport) + "</b>", true],
            t.passportExpires ? [DL("Expires"), t.passportExpires + (t.passportIssued ? " (" + DL("issued") + " " + t.passportIssued + ")" : "")] : null,
            [DL("Date of birth"), t.dob],
            t.ticket ? [DL("Ticket no."), '<b class="mono">' + esc(t.ticket) + "</b>", true] : null,
            t.policy ? [DL("Insurance policy"), '<b class="mono">' + esc(t.policy) + "</b>", true] : null
          ]) +
          (t.note ? '<div class="stop-note">' + esc(t.note) + "</div>" : "") +
          "</div>").join("") +
        '<p class="muted">' + esc(DL("passportNote")) + '</p></div>';
    }

    /* emergency numbers */
    if (d.emergency && d.emergency.length) {
      html += '<div class="info-card"><h3><span>🆘</span>' + esc(DL("Emergency numbers")) + '</h3><div class="calls">' +
        d.emergency.map((e) =>
          '<a class="call" href="tel:' + esc(e.tel) + '"><span>' + esc(e.label) + "</span><b>" + esc(e.value) + "</b></a>").join("") +
        "</div></div>";
    }

    const hasBio = Vault.hasBiometric();
    html += '<div class="info-card"><h3><span>🔐</span>' + esc(DL("Security")) + '</h3>' +
      '<p class="muted">' + esc(DL("securityBody")) + '</p>' +
      '<div class="calls" style="margin-top:12px">' +
        (hasBio
          ? '<button class="act" id="bioOff">' + esc(DL("bioOff")) + '</button>'
          : (bioReady ? '<button class="act map" id="bioOn">' + esc(DL("bioOn")) + '</button>'
                      : '<span class="muted">' + esc(DL("noBio")) + '</span>')) +
        '<button class="act" id="lockNow">' + esc(TX("lockNow", "Lock now")) + '</button>' +
      "</div>" +
      '<div class="reset-row"><button class="ghost-btn danger" id="wipeDocs">' + esc(DL("forget")) + '</button></div>' +
    "</div>";

    pane(html);

    const on = $("#bioOn");
    if (on) on.addEventListener("click", async function () {
      this.disabled = true; this.textContent = DL("waitingFinger");
      try { await Vault.enableBiometric(); renderDocs(); toast(DL("bioEnabled")); }
      catch (err) {
        this.disabled = false; this.textContent = DL("bioOn");
        toast(err.message === "PRF_UNSUPPORTED"
          ? DL("prfUnsupported")
          : (err && err.name === "NotAllowedError" ? DL("cancelled") : DL("bioFailed")));
      }
    });

    const off = $("#bioOff");
    if (off) off.addEventListener("click", async () => {
      if (!confirm(DL("confirmBioOff"))) return;
      await Vault.disableBiometric(); renderDocs(); toast(DL("bioRemoved"));
    });

    $("#lockNow").addEventListener("click", () => { Vault.lock(); renderDocs(); toast(DL("locked")); });

    $("#wipeDocs").addEventListener("click", () => {
      if (!confirm(DL("confirmForget"))) return;
      Vault.destroy(); renderDocs(); toast(DL("removed"));
    });
  }

  /* ================= FADI — the personal tab =================
     Collapsed rows under category chips: tap a row to open its details,
     tap again to close. Matches how the Places tab already behaves. */
  function renderFadi() {
    $("#fadiTitle").textContent = FADI.title;
    $("#fadiBlurb").textContent = (isAr() && AR.fadi && AR.fadi.blurb) || FADI.blurb;

    const sections = FADI.sections || [];
    const total = sections.reduce((a, s) => a + s.items.length, 0);

    if (!total) {
      $("#fadiBody").innerHTML =
        '<div class="empty fadi-empty">' +
          "<b>Nothing here yet</b>" +
          "<span>Send me places, links, notes or screenshots and they get sorted into categories here.</span>" +
        "</div>";
      return;
    }

    const done = S.fadi || (S.fadi = []);
    const cat = S.fadiCat || "all";
    const shown = cat === "all" ? sections : sections.filter((s) => s.id === cat);
    const doneIn = (sec) => sec.items.filter((it, i) => done.indexOf((sec.id) + "-" + i) > -1).length;

    /* category chips */
    let html = '<div class="chips" id="fadiChips">' +
      '<button class="chip' + (cat === "all" ? " is-on" : "") + '" data-cat="all">' + esc(TX("all", "All")) + " " + total + "</button>" +
      sections.map((sec) =>
        '<button class="chip' + (cat === sec.id ? " is-on" : "") + '" data-cat="' + esc(sec.id) + '">' +
          sec.icon + " " + esc((arFadiSection(sec.id) || {}).label || sec.label) + " " + sec.items.length + "</button>").join("") +
    "</div>";

    /* rows */
    html += shown.map((sec) => {
      const d = doneIn(sec);
      return '<section class="block">' +
        '<h2 class="block-h">' + sec.icon + " " + esc((arFadiSection(sec.id) || {}).label || sec.label) +
          '<span class="count-pill">' + (d ? d + " / " + sec.items.length : sec.items.length) + "</span></h2>" +
        (cat !== "all" && sec.note ? '<p class="sec-note">' + esc((arFadiSection(sec.id) || {}).note || sec.note) + "</p>" : "") +
        '<div class="frows">' + sec.items.map((it, ii) => {
          const id = sec.id + "-" + ii;
          const on = done.indexOf(id) > -1;
          const ar = arFadi(sec.id, ii);
          return '<article class="frow' + (on ? " done" : "") + '" data-id="' + esc(id) + '">' +
            '<button class="frow-head">' +
              '<span class="frow-tick" data-tick="' + esc(id) + '" role="checkbox" aria-checked="' + on + '">' + (on ? "✓" : "") + "</span>" +
              '<span class="frow-txt">' +
                '<span class="frow-name">' + esc(it.t) + "</span>" +
                '<span class="frow-sub">' + esc((ar && ar.area) || it.area || "") + "</span>" +
              "</span>" +
              (it.tag ? '<span class="fitem-tag">' + esc((ar && ar.tag) || it.tag) + "</span>" : "") +
              '<span class="frow-caret">▾</span>' +
            "</button>" +
            '<div class="frow-body">' +
              (it.d ? '<p class="fitem-d">' + esc((ar && ar.d) || it.d) + "</p>" : "") +
              ((it.hours || it.entry || it.best) ? '<dl class="kv fitem-kv">' +
                (it.hours ? "<dt>" + esc(TX("hours", "Hours")) + "</dt><dd>" + esc((ar && ar.hours) || hoursLabel(it.hours)) + "</dd>" : "") +
                (it.entry ? "<dt>" + esc(TX("entry", "Entry")) + "</dt><dd>" + esc((ar && ar.entry) || it.entry) + "</dd>" : "") +
                (it.book  ? "<dt>" + esc(TX("book",  "Book"))  + "</dt><dd>" + esc((ar && ar.book)  || it.book)  + "</dd>" : "") +
                (it.best  ? "<dt>" + esc(TX("best",  "Best"))  + "</dt><dd>" + esc((ar && ar.best)  || it.best)  + "</dd>" : "") +
              "</dl>" : "") +
              ((it.map || it.url) ? '<div class="place-actions">' +
                (it.map ? '<a class="act map" target="_blank" rel="noopener" href="' + mapUrl(it.map) + '">' + esc(TX("openInMaps", "Open in Maps")) + "</a>" : "") +
                (it.map ? '<a class="act photos" target="_blank" rel="noopener" href="' + photoUrl(it.map) + '">' + esc(TX("photos", "📷 Photos")) + "</a>" : "") +
                (it.url ? '<a class="act" target="_blank" rel="noopener" href="' + esc(it.url) + '">Open link</a>' : "") +
              "</div>" : "") +
            "</div>" +
          "</article>";
        }).join("") + "</div>" +
      "</section>";
    }).join("");

    $("#fadiBody").innerHTML = html;

    $$("#fadiChips .chip").forEach((b) => b.addEventListener("click", function () {
      S.fadiCat = this.getAttribute("data-cat"); save(); renderFadi();
      $("#view-fadi").scrollIntoView({ block: "start" });
    }));

    $$("#fadiBody .frow-head").forEach((h) => h.addEventListener("click", function (e) {
      // the tick is inside the header, so let it act on its own
      const t = e.target.closest("[data-tick]");
      if (t) {
        const id = t.getAttribute("data-tick"), at = S.fadi.indexOf(id);
        if (at > -1) S.fadi.splice(at, 1); else S.fadi.push(id);
        save(); renderFadi();
        return;
      }
      this.parentNode.classList.toggle("is-open");
    }));
  }

  /* ================= BEFORE YOU FLY ================= */
  function renderPreflight() {
    const done = S.pre || (S.pre = []);
    let n = 0, total = 0;
    PREFLIGHT.forEach((g) => { total += g.items.length; });
    done.forEach(() => n++);

    const daysOut = dayDiff(START, now());
    const head = daysOut > 0
      ? "<b>" + daysOut + " " + esc(daysOut === 1 ? TX("dayWord", "day") : TX("daysWord", "days")) + "</b> " +
        esc(TX("untilYouFly", "until you fly")) + " · " + n + " " + esc(TX("heroOf", "of")) + " " + total + " " + esc(TX("done", "done"))
      : n + " " + esc(TX("heroOf", "of")) + " " + total + " " + esc(TX("done", "done"));

    $("#pane-preflight").innerHTML = '<div class="info">' +
      '<div class="info-card"><h3><span>🧾</span>' + esc(TX("stillOutstanding", "Everything still outstanding")) + '</h3>' +
        '<p class="pre-head">' + head + "</p>" +
        '<div class="prebar"><i style="width:' + Math.round((n / total) * 100) + '%"></i></div>' +
      "</div>" +

      PREFLIGHT.map((g, gi) =>
        '<div class="info-card"><h3><span>' + (gi === 0 ? "🏠" : gi === 1 ? "🛬" : "🇹🇷") + "</span>" +
        esc((isAr() && AR.preflight && AR.preflight.groups[gi]) || g.group) + "</h3>" +
        g.items.map((it, ii) => {
          const id = gi + "-" + ii;
          const on = done.indexOf(id) > -1;
          const tr = (isAr() && AR.preflight && AR.preflight.items[gi] && AR.preflight.items[gi][ii]) || null;
          return '<label class="pre' + (on ? " done" : "") + (it.hard ? " hard" : "") + '">' +
            '<input type="checkbox" data-id="' + id + '"' + (on ? " checked" : "") + ">" +
            "<span><b>" + esc((tr && tr.t) || it.t) +
              (it.hard ? ' <em class="pre-hard">' + esc(TX("canStop", "can stop the trip")) + "</em>" : "") + "</b>" +
            '<i class="pre-by">' + esc((tr && tr.by) || it.by) + "</i>" +
            '<span class="pre-d">' + esc((tr && tr.d) || it.d) + "</span></span></label>";
        }).join("") + "</div>").join("") +

      /* reservations */
      '<div class="info-card"><h3><span>📞</span>' + esc(TX("worthBooking", "Worth booking")) + '</h3>' +
        RESERVATIONS.map((r, ri) => {
          const p = findPlace(r.place);
          if (!p) return "";
          const cls = r.urgency === "now" ? "now" : r.urgency === "soon" ? "soon" : "none";
          return '<div class="resv">' +
            '<div class="resv-top"><b>' + esc(p.name) + "</b>" +
              '<span class="resv-flag ' + cls + '">' +
                (r.urgency === "now" ? TX("bookToday", "Book today") : r.urgency === "soon" ? TX("bookSoon", "Book soon") : TX("noBooking", "No booking")) + "</span></div>" +
            '<div class="resv-day">' + esc((isAr() && AR.reservations && AR.reservations[ri] && AR.reservations[ri].day) || r.day) + "</div>" +
            '<div class="stop-note">' + esc((isAr() && AR.reservations && AR.reservations[ri] && AR.reservations[ri].why) || r.why) + "</div>" +
            '<a class="act map" target="_blank" rel="noopener" href="' + mapUrl(p.name + " " + p.area) + '">' + esc(TX("openListing", "Open listing to call")) + '</a>' +
          "</div>";
        }).join("") +
        '<p class="muted" style="margin-top:12px">' + esc(TX("resvNote", "Opens each place in Maps rather than storing phone numbers — restaurant numbers change, and a wrong one is worse than none.")) + '</p>' +
      "</div>" +
    "</div>";

    $$("#pane-preflight .pre input").forEach((cb) => cb.addEventListener("change", function () {
      const id = this.getAttribute("data-id"), at = S.pre.indexOf(id);
      if (this.checked) { if (at === -1) S.pre.push(id); } else if (at > -1) S.pre.splice(at, 1);
      save(); renderPreflight();
    }));
  }

  /* ================= WEATHER ================= */
  async function renderWeather() {
    const el = $("#weatherCard");
    if (!el) return;
    const wx = await fetchWeather();
    if (!wx || !wx.days) { el.innerHTML = ""; return; }

    const from = TRIP.start, to = TRIP.end;
    const trip = wx.days.filter((d) => d.date >= from && d.date <= to);
    const show = trip.length ? trip : wx.days.slice(0, 8);
    const ageH = Math.round((Date.now() - wx.at) / 3600000);
    const age = ageH < 1 ? TX("justNow", "just now")
      : ageH < 24 ? ageH + (isAr() ? " " + TX("hoursAgo", "h") : "h ago")
      : Math.round(ageH / 24) + (isAr() ? " " + TX("daysAgo", "d") : "d ago");

    el.innerHTML =
      '<h2 class="block-h">' + esc(TX("forecast", "İstanbul forecast")) + ' <span class="count-pill">' + esc(age) + "</span></h2>" +
      '<div class="wx">' + show.map((d) => {
        const w = wmo(d.code);
        const dt = toDate(d.date);
        const dayNames = (isAr() && typeof AR !== "undefined" && AR.ui.daysShort)
          ? AR.ui.daysShort : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        const label = trip.length ? dayNames[dt.getDay()] : fmt(d.date);
        return '<div class="wx-day' + (d.rain >= 50 ? " wet" : "") + '">' +
          "<span>" + esc(label) + "</span>" +
          '<i title="' + esc(w[0]) + '">' + w[1] + "</i>" +
          "<b>" + d.max + "°</b><u>" + d.min + "°</u>" +
          (d.rain != null ? '<em>' + d.rain + "%</em>" : "") +
        "</div>";
      }).join("") + "</div>" +
      '<p class="saved-hint">' + esc(TX("weatherHint", "Tap through to Plan if a wet day needs swapping — Wednesday's bazaars and Tuesday's malls are both mostly indoors.")) + "</p>";
  }

  /* ================= TRANSPORT ================= */
  function transitUrl(dest) {
    return "https://www.google.com/maps/dir/?api=1&travelmode=transit" +
      "&origin=" + encodeURIComponent(TRIP.hotel.address) +
      "&destination=" + encodeURIComponent(dest + ", İstanbul");
  }

  function renderTransport() {
    const T = TRANSPORT;

    $("#pane-transport").innerHTML = '<div class="info">' +

      /* journey planner */
      '<div class="info-card"><h3><span>🧭</span>' + esc(TH("planner", "Get me there from the hotel")) + '</h3>' +
        '<p class="muted">' + esc(TH("plannerBlurb", "Opens live public-transport directions from Meclisi Mebusan Cad. 61 — needs a signal.")) + '</p>' +
        '<form id="tripForm" class="addform row" style="margin-top:12px">' +
          '<input id="tripDest" placeholder="' + esc(TH("destPlaceholder", "Where to? e.g. İstinye Park")) + '" required>' +
          '<button type="submit" class="primary-btn">' + esc(TH("route", "Route")) + '</button>' +
        "</form>" +
      "</div>" +

      /* stops */
      '<div class="info-card"><h3><span>📍</span>' + esc(TH("stops", "Your stops")) + '</h3>' +
        T.stops.map((s, i) =>
          '<div class="stop">' +
            '<div class="stop-top"><b>' + esc(s.icon) + " " + esc((isAr() && AR.transport && AR.transport.stops[i] && AR.transport.stops[i].name) || s.name) + "</b>" +
              '<a class="inline-link" target="_blank" rel="noopener" href="' + mapUrl(s.map) + '">' + esc(TX("mapWord", "Map")) + "</a></div>" +
            '<div class="stop-walk">' + esc((isAr() && AR.transport && AR.transport.stops[i] && AR.transport.stops[i].walk) || s.walk) + "</div>" +
            '<div class="stop-note">' + esc((isAr() && AR.transport && AR.transport.stops[i] && AR.transport.stops[i].note) || s.note) + "</div>" +
          "</div>").join("") +
      "</div>" +

      /* rail */
      '<div class="info-card"><h3><span>🚊</span>' + esc(TH("rail", "Tram, funicular, metro")) + '</h3>' +
        T.rail.map((r, i) =>
          '<div class="line">' +
            '<div class="line-top"><span class="line-badge" style="background:' + r.colour + '">' + esc(r.line) + "</span>" +
              "<b>" + esc(TL2("rail", i, "name") || r.name) + "</b></div>" +
            '<div class="line-meta">' + esc(r.hours) + " · " + esc(TL2("rail", i, "freq") || r.freq) + "</div>" +
            '<div class="stop-note">' + esc(TL2("rail", i, "note") || r.note) + "</div>" +
            '<div class="line-stops">' + esc(r.stops) + "</div>" +
          "</div>").join("") +
      "</div>" +

      /* buses */
      '<div class="info-card"><h3><span>🚌</span>' + esc(TH("buses", "Buses")) + '</h3>' +
        T.buses.map((b, i) =>
          '<div class="line">' +
            "<b>" + esc(TL2("buses", i, "group") || b.group) + "</b>" +
            '<div class="bus-lines">' + esc(b.lines) + "</div>" +
            '<div class="stop-note">' + esc(TL2("buses", i, "note") || b.note) + "</div>" +
          "</div>").join("") +
      "</div>" +

      /* ferries */
      '<div class="info-card"><h3><span>⛴️</span>' + esc(TH("ferries", "Ferries")) + '</h3>' +
        T.ferries.map((f, i) =>
          '<div class="line">' +
            "<b>" + esc(TL2("ferries", i, "route") || f.route) + "</b>" +
            '<div class="line-meta">' + esc(TL2("ferries", i, "time") || f.time) + " · " + esc(TL2("ferries", i, "freq") || f.freq) + "</div>" +
            '<div class="line-meta">' + esc(TL2("ferries", i, "hours") || f.hours) + " · " + esc(TH("from", "from")) + " " + esc(TL2("ferries", i, "pier") || f.pier) + "</div>" +
            '<div class="stop-note">' + esc(TL2("ferries", i, "note") || f.note) + "</div>" +
          "</div>").join("") +
      "</div>" +

      /* islands timetable — the one fixed schedule */
      '<div class="info-card"><h3><span>🏝️</span>' + esc((isAr() && AR.transport && AR.transport.islands && AR.transport.islands.title) || T.islands.title) + "</h3>" +
        '<p class="muted">' + esc((isAr() && AR.transport && AR.transport.islands && AR.transport.islands.note) || T.islands.note) + "</p>" +
        '<div class="departures" id="departures">' +
          T.islands.departures.map((d) => '<span class="dep" data-t="' + d + '">' + d + "</span>").join("") +
        "</div>" +
        '<p class="warn">' + esc((isAr() && AR.transport && AR.transport.islands && AR.transport.islands.warn) || T.islands.warn) + "</p>" +
      "</div>" +

      /* driving */
      '<div class="info-card"><h3><span>🚗</span>' + esc(TH("driving", "Driving & parking")) + '</h3>' +
        T.driving.map((d, i) =>
          '<div class="line"><b>' + d.icon + " " + esc((isAr() && AR.transport && AR.transport.driving[i] && AR.transport.driving[i].title) || d.title) + "</b>" +
          '<div class="stop-note">' + esc((isAr() && AR.transport && AR.transport.driving[i] && AR.transport.driving[i].body) || d.body) + "</div></div>").join("") +
      "</div>" +

      /* live links */
      '<div class="info-card"><h3><span>🔗</span>' + esc(TH("live", "Live times")) + '</h3>' +
        '<p class="muted">' + esc(TH("liveBlurb", "Frequencies above are reliable; exact minutes change with the season.")) + '</p>' +
        '<div class="calls" style="margin-top:12px">' +
          T.links.map((l, i) =>
            '<a class="call" target="_blank" rel="noopener" href="' + esc(l.url) + '"><span>' + esc((isAr() && AR.transport && AR.transport.links && AR.transport.links[i]) || l.label) + "</span><b>" + esc(TH("open", "Open")) + "</b></a>").join("") +
        "</div>" +
      "</div>" +
    "</div>";

    $("#tripForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const d = $("#tripDest").value.trim();
      if (d) window.open(transitUrl(d), "_blank", "noopener");
    });

    /* highlight the next island departure */
    const now = new Date(), mins = now.getHours() * 60 + now.getMinutes();
    let marked = false;
    $$("#departures .dep").forEach((el) => {
      const p = el.getAttribute("data-t").split(":");
      const t = (+p[0]) * 60 + (+p[1]);
      if (t < mins) el.classList.add("gone");
      else if (!marked) { el.classList.add("next"); marked = true; }
    });
  }

  /* ================= TOOLS ================= */
  function renderTools() {
    const r = cachedRates();
    const age = r ? Math.round((Date.now() - r.at) / 3600000) : null;

    $("#pane-tools").innerHTML = '<div class="info">' +

      /* ---- currency ---- */
      '<div class="info-card"><h3><span>💱</span>' + esc(TO("currency", "Currency")) + '</h3>' +
        '<div class="conv">' +
          '<div class="conv-row"><input id="cvTL" type="number" inputmode="decimal" placeholder="0"><span>₺ TL</span></div>' +
          '<div class="conv-row"><input id="cvEUR" type="number" inputmode="decimal" placeholder="0"><span>€ EUR</span></div>' +
          '<div class="conv-row"><input id="cvUSD" type="number" inputmode="decimal" placeholder="0"><span>$ USD</span></div>' +
        "</div>" +
        '<p class="saved-hint" id="rateNote">' +
          (r ? "1 € = " + r.eur.toFixed(2) + " ₺ · 1 $ = " + r.usd.toFixed(2) + " ₺ · " +
               (age < 1 ? TO("justUpdated", "just updated") : age + (isAr() ? " " + TO("hoursOld", "h old") : "h old")) + (r.source === "manual" ? TO("manualRate", " (entered by you)") : "")
             : TO("noRate", "No rate yet — connect once, or enter one below.")) +
        "</p>" +
        '<form id="rateForm" class="addform row" style="margin-top:10px">' +
          '<input id="rateInput" type="number" inputmode="decimal" step="0.01" placeholder="' + esc(TO("ratePlaceholder", "TL per 1 €")) + '">' +
          '<button type="button" class="ghost-btn" id="rateFetch">' + esc(TO("update", "Update")) + '</button>' +
          '<button type="submit" class="ghost-btn">' + esc(TO("set", "Set")) + '</button>' +
        "</form>" +
      "</div>" +

      /* ---- haggling ---- */
      '<div class="info-card"><h3><span>🤝</span>' + esc(TO("haggling", "Haggling")) + '</h3>' +
        '<p class="muted">' + esc(TO("hagglingBlurb", "In the Grand Bazaar, Spice Bazaar and Mahmutpaşa the first price is usually two to three times the real one.")) + '</p>' +
        '<form id="hagForm" class="addform row" style="margin-top:12px">' +
          '<input id="hagAsk" type="number" inputmode="decimal" placeholder="' + esc(TO("theyAsked", "They asked (₺)")) + '" required>' +
          '<button type="submit" class="primary-btn">' + esc(TO("workItOut", "Work it out")) + '</button>' +
        "</form>" +
        '<div id="hagOut"></div>' +
      "</div>" +

      /* ---- prayer times ---- */
      '<div class="info-card"><h3><span>🕌</span>' + esc(TO("prayerTitle", "Prayer times — İstanbul")) + '</h3>' +
        '<div id="prayerNext" class="next-prayer"></div>' +
        '<div id="prayerList" class="prayers"></div>' +
        '<p class="saved-hint">' + esc(TO("prayerNote", "Calculated on the device (Diyanet convention), so it works with no signal.")) + '</p>' +
        '<p class="warn">' + esc(TO("prayerWarn", "Mosques close to visitors for about 30 minutes around each of these.")) + '</p>' +
      "</div>" +
    "</div>";

    /* currency wiring */
    const tl = $("#cvTL"), eu = $("#cvEUR"), us = $("#cvUSD");
    function convert(from) {
      const rr = cachedRates();
      if (!rr) { toast(TO("setRateFirst", "Set a rate first")); return; }
      const v = parseFloat(from.value);
      if (isNaN(v)) { [tl, eu, us].forEach((i) => { if (i !== from) i.value = ""; }); return; }
      const inTL = from === tl ? v : (from === eu ? v * rr.eur : v * rr.usd);
      if (from !== tl) tl.value = Math.round(inTL);
      if (from !== eu) eu.value = (inTL / rr.eur).toFixed(2);
      if (from !== us) us.value = (inTL / rr.usd).toFixed(2);
    }
    [tl, eu, us].forEach((i) => i.addEventListener("input", () => convert(i)));

    $("#rateFetch").addEventListener("click", async function () {
      this.textContent = "…";
      const got = await fetchRates();
      this.textContent = TO("update", "Update");
      if (got && got.source === "live") { renderTools(); toast(TO("rateUpdated", "Rate updated")); }
      else toast(TO("noSignalRate", "No signal — enter a rate by hand"));
    });
    $("#rateForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const v = parseFloat($("#rateInput").value);
      if (isNaN(v) || v <= 0) { toast(TO("enterRate", "Enter TL per 1 euro")); return; }
      const prev = cachedRates();
      storeRates({ eur: v, usd: prev && prev.usd && prev.eur ? v * (prev.usd / prev.eur) : v / 1.08,
                   at: Date.now(), source: "manual" });
      renderTools(); toast(TO("rateSaved", "Rate saved"));
    });

    /* haggling wiring */
    $("#hagForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const ask = parseFloat($("#hagAsk").value);
      if (isNaN(ask) || ask <= 0) return;
      const rr = cachedRates();
      const eurOf = (n) => rr ? " (≈ €" + (n / rr.eur).toFixed(0) + ")" : "";
      $("#hagOut").innerHTML =
        '<dl class="kv" style="margin-top:14px">' +
          "<dt>" + esc(TO("openAt", "Open at")) + "</dt><dd><b>" + Math.round(ask * 0.4) + " ₺</b>" + eurOf(ask * 0.4) + "</dd>" +
          "<dt>" + esc(TO("settleNear", "Settle near")) + "</dt><dd><b>" + Math.round(ask * 0.55) + " ₺</b>" + eurOf(ask * 0.55) + "</dd>" +
          "<dt>" + esc(TO("walkAway", "Walk away above")) + "</dt><dd><b>" + Math.round(ask * 0.7) + " ₺</b>" + eurOf(ask * 0.7) + "</dd>" +
        "</dl>" +
        '<p class="muted" style="margin-top:8px">' + TO("hagglingTip", "Say <b>çok pahalı</b> (too expensive), then <b>son fiyat ne?</b> (what is your best price). Walking away once is the strongest move you have.") + '</p>';
    });

    /* prayer wiring */
    const np = nextPrayer();
    $("#prayerNext").innerHTML =
      "<span>" + esc(TX("nextPrayer", "Next")) + "</span><b>" + esc(prayerName(np.name)) + "</b><span>" + esc(np.time) + " · " + esc(inLabel(np.inText)) + "</span>";
    $("#prayerList").innerHTML = prayerTimes(new Date()).list.map((p) =>
      '<div class="prayer' + (p.minor ? " minor" : "") + (p.key === np.name.toLowerCase() ? " is-next" : "") + '">' +
        "<span>" + esc(prayerName(p.label)) + "</span><b>" + esc(p.time) + "</b></div>").join("");
  }

  /* ================= GUIDE ================= */
  function renderGuide() {
    $("#pane-essentials").innerHTML = '<div class="info">' + ESSENTIALS.map((e, i) =>
      '<div class="info-card"><h3><span>' + e.icon + "</span>" + esc(A("essentials", i, "title") || e.title) +
      "</h3><p>" + esc(A("essentials", i, "body") || e.body) + "</p></div>"
    ).join("") + "</div>";

    $("#pane-phrases").innerHTML = '<div class="info">' + PHRASES.map((p, i) =>
      '<div class="phrase"><span class="phrase-tr" dir="ltr">' + esc(p.tr) + '</span>' +
      '<span class="phrase-en">' + esc((isAr() && AR.phrases && AR.phrases[i]) || p.en) + '</span>' +
      (isAr() && AR.phrasesSay && AR.phrasesSay[i]
        ? '<span class="phrase-say">' + esc(AR.phrasesSay[i]) + "</span></div>"
        : '<span class="phrase-say" dir="ltr">' + esc(p.say) + "</span></div>")
    ).join("") + "</div>";

    $("#packList").innerHTML = PACKING.map((item, i) => {
      const done = S.packing.indexOf(i) > -1;
      return '<label class="check' + (done ? " done" : "") + '"><input type="checkbox" data-i="' + i + '"' +
        (done ? " checked" : "") + "><span>" + esc(A("packing", i) || item) + "</span></label>";
    }).join("");
    $$("#packList input").forEach((cb) => cb.addEventListener("change", function () {
      const i = +this.getAttribute("data-i"), at = S.packing.indexOf(i);
      if (this.checked) { if (at === -1) S.packing.push(i); } else if (at > -1) S.packing.splice(at, 1);
      save(); this.closest(".check").classList.toggle("done", this.checked);
    }));

    renderSpend();
  }

  function renderSpend() {
    const total = S.spend.reduce((a, s) => a + (+s.amt || 0), 0);
    $("#spendTotal").textContent = total.toLocaleString("en-GB");
    const el = $("#spendList");
    el.innerHTML = S.spend.length
      ? S.spend.slice().reverse().map((s) =>
          '<div class="spend"><span>' + esc(s.what) + '</span><b>' + (+s.amt).toLocaleString("en-GB") +
          ' ' + (isAr() ? "ل.ت" : "TL") + '</b><button data-id="' + s.id + '" aria-label="' + esc(TX("del", "Delete")) + '">×</button></div>').join("")
      : '<div class="empty">' + esc(TX("spendEmpty", "Nothing logged yet.")) + '</div>';
    $$("#spendList button").forEach((b) => b.addEventListener("click", function () {
      S.spend = S.spend.filter((s) => s.id !== this.getAttribute("data-id"));
      save(); renderSpend();
    }));
  }

  /* translate the fixed labels that live in index.html */
  function paintChrome() {
    const set = (sel, v) => { const el = $(sel); if (el) el.textContent = v; };
    const tabs = { today: "Today", plan: "Plan", places: "Places", saved: "List", fadi: "Fadi", guide: "Guide" };
    Object.keys(tabs).forEach((k) => {
      const el = $('.tab[data-view="' + k + '"]');
      if (el) el.childNodes[1].nodeValue = TX("tabs." + k, tabs[k]);
    });
    set("#view-plan .view-head h1", TX("planTitle", "The plan"));
    set("#view-plan .view-head p",  TX("planBlurb", "Eight days, routed around the T1 tram at your hotel door. Tap any day to open it; tick items as you go."));
    set("#view-places .view-head h1", TX("placesTitle", "Places"));
    set("#view-places .view-head p",  TX("placesBlurb", "Everything worth your time, sorted by what it actually is."));
    set("#view-saved .view-head h1", TX("savedTitle", "Your list"));
    set("#view-saved .view-head p",  TX("savedBlurb", "Saved spots, what you've ticked off, your own additions and notes."));
    set("#view-guide .view-head h1", TX("guideTitle", "Survival guide"));
    set("#view-guide .view-head p",  TX("guideBlurb", "The practical things, offline, so they work when your data doesn't."));
    const segs = { docs:"Docs", essentials:"Essentials", phrases:"Turkish", preflight:"Before you fly",
                   transport:"Transport", tools:"Tools", packing:"Packing", budget:"Spend" };
    Object.keys(segs).forEach((k) => set('#guideSeg [data-pane="' + k + '"]', TX("seg." + k, segs[k])));
    const nb = $("#nearBtn"); if (nb && !myPos) nb.textContent = TX("nearMe", "📍 Near me");
    const s2 = $("#search"); if (s2) s2.placeholder = TX("searchPlaceholder", "Search places, areas, dishes…");
    set("#resetTicks", TX("clearTicks", "Clear all ticks"));
    set("#qHotel .quick-t", TX("quickHotel", "Hotel"));
    set("#qHotel .quick-s", TX("quickHotelSub", "Open in Maps"));
    const qt = $$('[data-goto="plan"], [data-goto="places"], [data-goto="guide"]');
    const labels = {
      plan:   [TX("quickPlan", "Full plan"),  TX("quickPlanSub", "8 days")],
      places: [TX("quickPlaces", "Places"),   null],
      guide:  [TX("quickGuide", "Survival"),  TX("quickGuideSub", "Transport & tips")]
    };
    qt.forEach((el) => {
      const k = el.getAttribute("data-goto"), l = labels[k];
      const t = $(".quick-t", el), sub = $(".quick-s", el);
      if (t && l) t.textContent = l[0];
      if (sub && l && l[1]) sub.textContent = l[1];
    });
    const notesEl = $("#hotelNotes");
    const hn = notesEl && notesEl.previousElementSibling;
    if (hn && hn.classList.contains("block-h")) hn.textContent = TX("fromDoor", "From your front door");
    set("#view-fadi .view-head p", TX("fadiBlurb", FADI.blurb));

    /* fixed labels, part two */
    const tog = $$(".filter-row .mini-toggle");
    const togLabels = [TX("openNow", "Open now"), TX("savedOnly", "Saved"), TX("hideVisited", "Hide visited")];
    tog.forEach((l, i) => { const n = l.childNodes[l.childNodes.length - 1]; if (n) n.nodeValue = " " + togLabels[i]; });

    const bh = $$("#view-saved .block-h");
    if (bh[0]) bh[0].textContent = TX("addOwn", "Add your own place");
    if (bh[1]) bh[1].childNodes[0].nodeValue = TX("savedHead", "Saved") + " ";
    if (bh[2]) bh[2].childNodes[0].nodeValue = TX("visitedHead", "Been there") + " ";
    if (bh[3]) bh[3].textContent = TX("tripNotes", "Trip notes");
    const ph = (sel, k, en) => { const el = $(sel); if (el) el.placeholder = TX(k, en); };
    ph("#addName", "addName", "Name");
    ph("#addArea", "addArea", "Area / neighbourhood");
    ph("#addNote", "addNote", "Why you want to go, who recommended it, anything else…");
    ph("#tripNotes", "notesPlaceholder", "Confirmation numbers, taxi receipts, who told you about that place…");
    set("#addForm .primary-btn", TX("addBtn", "Add to my list"));
    set("#notesHint", TX("savedHint", "Saved on this device"));
    set("#installBtn", TX("install", "Install"));
    set("#resetPack", TX("resetPacking", "Reset packing list"));
    set("#spendTotal + small", TX("tlLogged", "TL logged"));
    set(".budget-head .muted", TX("budgetBlurb", "Rough running tally. Stored only on this phone."));
    ph("#spendWhat", "spendWhat", "What for?");
    ph("#spendAmt", "spendAmt", "TL");
    set("#spendForm .primary-btn", TX("spendLog", "Log"));
    $("#addCat").innerHTML = CATEGORIES.map((c) => '<option value="' + c.id + '">' + c.icon + " " + esc(catLabel(c)) + "</option>").join("");
  }

  function renderAll() {
    paintChrome();
    renderToday(); renderPlan(); renderChips(); renderPlaces();
    renderSaved(); renderGuide(); renderDocs(); renderTools();
    renderTransport(); renderPreflight(); renderFadi(); renderWeather();
  }

  /* ================= navigation ================= */
  function go(view) {
    $$(".view").forEach((v) => { v.hidden = v.id !== "view-" + view; });
    $$(".tab").forEach((t) => t.classList.toggle("is-on", t.getAttribute("data-view") === view));
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    if (location.hash !== "#" + view) history.replaceState(null, "", "#" + view);
  }
  $$(".tab").forEach((t) => t.addEventListener("click", () => go(t.getAttribute("data-view"))));
  $$("[data-goto]").forEach((b) => b.addEventListener("click", () => go(b.getAttribute("data-goto"))));

  function showPane(name) {
    const btn = $('#guideSeg [data-pane="' + name + '"]');
    if (!btn) return false;
    $$("#guideSeg .seg-btn").forEach((x) => x.classList.remove("is-on"));
    btn.classList.add("is-on");
    $$(".pane").forEach((p) => { p.hidden = p.id !== "pane-" + name; });
    return true;
  }
  $$("#guideSeg .seg-btn").forEach((b) => b.addEventListener("click", function () {
    showPane(this.getAttribute("data-pane"));
  }));

  /* ================= forms ================= */
  $("#addCat").innerHTML = CATEGORIES.map((c) => '<option value="' + c.id + '">' + c.icon + " " + esc(c.label) + "</option>").join("");

  $("#addForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = $("#addName").value.trim();
    if (!name) return;
    const p = {
      id: "mine-" + Date.now().toString(36),
      cat: $("#addCat").value, name: name,
      area: $("#addArea").value.trim() || TX("addedByYou", "Added by you"),
      price: 2, why: $("#addNote").value.trim(), mine: true
    };
    S.custom.push(p); S.saved.push(p.id); save();
    this.reset();
    renderChips(); renderPlaces(); renderSaved(); renderToday();
    toast(TX("addedToList", "Added to your list"));
  });

  $("#spendForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const what = $("#spendWhat").value.trim(), amt = parseFloat($("#spendAmt").value);
    if (!what || isNaN(amt)) return;
    S.spend.push({ id: Date.now().toString(36), what: what, amt: amt });
    save(); this.reset(); renderSpend();
  });

  const notes = $("#tripNotes");
  notes.value = S.notes || "";
  let noteT;
  notes.addEventListener("input", function () {
    S.notes = this.value;
    clearTimeout(noteT);
    noteT = setTimeout(() => { save(); $("#notesHint").textContent = TX("savedHintDone", "Saved on this device ✓"); }, 400);
  });

  $("#search").addEventListener("input", renderPlaces);
  $("#onlySaved").addEventListener("change", renderPlaces);
  $("#hideVisited").addEventListener("change", renderPlaces);
  $("#openNow").addEventListener("change", renderPlaces);

  /* ---- near me ---- */
  $("#nearBtn").addEventListener("click", function () {
    if (myPos) {                       // tapping again turns it off
      myPos = null; this.classList.remove("is-on");
      this.textContent = "📍 Near me"; renderPlaces(); return;
    }
    if (!navigator.geolocation) { toast(TX("noGeo", "This browser can't do location")); return; }
    const btn = this;
    btn.textContent = TX("locating", "Locating…"); btn.disabled = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        myPos = [pos.coords.latitude, pos.coords.longitude];
        btn.disabled = false; btn.classList.add("is-on"); btn.textContent = "📍 Near me ✓";
        renderPlaces();
        toast(TX("sortedByDistance", "Sorted by how far you'd walk"));
      },
      (err) => {
        btn.disabled = false; btn.textContent = "📍 Near me";
        toast(err.code === 1 ? TX("geoDenied", "Location permission denied") : TX("geoFailed", "Couldn't get your location"));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 120000 }
    );
  });

  $("#resetTicks").addEventListener("click", () => {
    if (!confirm(TX("confirmClearTicks", "Clear every ticked item across all eight days?"))) return;
    S.ticks = {}; save(); renderPlan(); renderToday(); toast(TX("cleared", "Cleared"));
  });
  $("#resetPack").addEventListener("click", () => {
    if (!confirm(TX("confirmResetPack", "Reset the packing list?"))) return;
    S.packing = []; save(); renderGuide(); toast(TX("reset", "Reset"));
  });

  /* ================= install prompt ================= */
  let deferred = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); deferred = e; $("#installBtn").hidden = false;
  });
  $("#installBtn").addEventListener("click", async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null; $("#installBtn").hidden = true;
  });
  window.addEventListener("appinstalled", () => { $("#installBtn").hidden = true; toast(TX("installed", "Installed 🎉")); });

  /* ================= boot ================= */
  paintChrome();
  renderToday();
  renderPlan();
  renderChips();
  renderPlaces();
  renderSaved();
  renderGuide();
  renderDocs();
  renderTools();
  renderTransport();
  renderPreflight();
  renderWeather();
  renderFadi();

  // Docs always leads the Guide tab — it either shows your documents or
  // offers to import them.
  $("#pane-docs").hidden = false;
  $("#pane-essentials").hidden = true;

  // Deep links: #places, #guide, and #guide:tools for a specific guide pane
  const start = (location.hash || "").replace("#", "").split(":");
  go(["today", "plan", "places", "saved", "fadi", "guide"].indexOf(start[0]) > -1 ? start[0] : "today");
  if (start[0] === "guide" && start[1]) showPane(start[1]);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
