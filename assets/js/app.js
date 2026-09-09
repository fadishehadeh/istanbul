/* İstanbul Trip Companion — app logic */
(function () {
  "use strict";

  /* ---------------- storage ---------------- */
  const KEY = "ist2026";
  const defaults = {
    theme: "light", saved: [], visited: [], ticks: {}, packing: [],
    spend: [], notes: "", custom: [], cat: "all"
  };
  let S;
  try { S = Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || "{}")); }
  catch (e) { S = Object.assign({}, defaults); }

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const mapUrl = (q) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q + ", İstanbul");

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

  /* ---------------- dates ---------------- */
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const toDate = (iso) => { const p = iso.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
  const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayDiff = (a, b) => Math.round((midnight(a) - midnight(b)) / 86400000);
  const fmt = (iso) => { const d = toDate(iso); return d.getDate() + " " + MONTHS[d.getMonth()].slice(0, 3); };

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
    $("#tripRange").textContent = fmt(TRIP.start) + " – " + fmt(TRIP.end);

    const kicker = $("#heroKicker"), title = $("#heroTitle"), sub = $("#heroSub"), count = $("#heroCount");

    if (idx === null && d < START) {
      const n = dayDiff(START, d);
      kicker.textContent = "Counting down";
      title.textContent = "İstanbul";
      sub.textContent = range + " · staying at " + TRIP.hotel.name + ", Fındıklı.";
      count.innerHTML = "<b>" + n + "</b><span>" + (n === 1 ? "day to go" : "days to go") + "</span>";
    } else if (idx === null) {
      kicker.textContent = "That's a wrap";
      title.textContent = "İstanbul";
      sub.textContent = "Hope it was a good one. Everything you saved is still in your list.";
      count.innerHTML = "<b>✈️</b><span>Home</span>";
    } else {
      const day = ITINERARY[idx];
      kicker.textContent = day.dow + " · " + fmt(day.date);
      title.textContent = day.title;
      sub.textContent = day.subtitle;
      count.innerHTML = "<b>" + day.n + "</b><span>of " + ITINERARY.length + "</span>";
    }

    $("#qHotel").href = mapUrl(TRIP.hotel.map);
    $("#placeCount").textContent = allPlaces().length + " spots";

    const block = $("#todayBlock");
    const day = idx === null ? ITINERARY[0] : ITINERARY[idx];
    const label = idx === null ? "Day 1 · " + day.dow + " " + fmt(day.date) : "Today · " + day.dow;
    block.innerHTML =
      '<div class="today-card">' +
        '<div class="today-top">' +
          '<div class="today-day">' + esc(label) + "</div>" +
          '<h2 class="today-title">' + esc(day.title) + "</h2>" +
          '<p class="today-sub">' + esc(day.subtitle) + "</p>" +
        "</div>" +
        '<div class="today-body">' + timelineHtml(day) + "</div>" +
      "</div>";
    wireTimeline(block);

    const notes = $("#hotelNotes");
    notes.innerHTML = TRIP.hotel.notes.map((n) => "<li>" + esc(n) + "</li>").join("");
  }

  /* ================= PLAN ================= */
  function timelineHtml(day) {
    const ticks = S.ticks[day.n] || [];
    return '<ul class="tl">' + day.items.map((it, i) => {
      const done = ticks.indexOf(i) > -1;
      const p = it.place ? findPlace(it.place) : null;
      return '<li class="' + (done ? "done" : "") + '" data-day="' + day.n + '" data-i="' + i + '">' +
        '<button class="tl-dot" aria-label="Mark done"></button>' +
        '<div class="tl-time">' + esc(it.time) + "</div>" +
        '<div class="tl-t">' + esc(it.title) + "</div>" +
        '<div class="tl-n">' + esc(it.note) + "</div>" +
        (p ? '<a class="tl-link" target="_blank" rel="noopener" href="' + mapUrl(p.name + " " + p.area) + '">📍 ' + esc(p.name) + "</a>" : "") +
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
          '<span class="day-num"><small>Day</small><b>' + day.n + "</b></span>" +
          '<span class="day-meta">' +
            '<span class="dow">' + esc(day.dow) + " · " + fmt(day.date) + "</span>" +
            "<h3>" + esc(day.title) + "</h3>" +
            '<span class="prog">' + (done ? done + " of " + day.items.length + " done" : day.items.length + " stops") + "</span>" +
          "</span>" +
          '<span class="day-caret">▶</span>' +
        "</button>" +
        '<div class="day-panel">' +
          '<p class="day-sub">' + esc(day.subtitle) + "</p>" +
          '<div class="tagrow">' + day.tags.map((t) => '<span class="tag">' + esc(t) + "</span>").join("") + "</div>" +
          timelineHtml(day) +
          '<div class="swap"><b>Swap / backup</b>' + esc(day.swap) + "</div>" +
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
    if (p === 0) return "Free";
    return "₺".repeat(Math.max(1, p || 1));
  }

  function placeCard(p, opts) {
    opts = opts || {};
    const c = catById[p.cat] || { icon: "📍", label: "Place" };
    const isSaved = S.saved.indexOf(p.id) > -1;
    const isVisited = S.visited.indexOf(p.id) > -1;
    return '<article class="place' + (isVisited ? " visited" : "") + '" data-id="' + esc(p.id) + '">' +
      '<div class="place-head">' +
        '<span class="place-ic">' + c.icon + "</span>" +
        '<div class="place-main">' +
          '<div class="place-name">' + esc(p.name) + "</div>" +
          '<div class="place-meta">' +
            "<span>" + esc(c.label) + "</span>" +
            (p.area ? '<span class="dot-sep">' + esc(p.area) + "</span>" : "") +
            '<span class="dot-sep">' + priceStr(p.price) + "</span>" +
            (p.isNew ? '<span class="badge-new">recently opened</span>' : "") +
            (p.alcohol ? '<span class="badge-alc">serves alcohol</span>' : "") +
            (p.mine ? '<span class="badge-mine">yours</span>' : "") +
          "</div>" +
          (p.why ? '<p class="place-why">' + esc(p.why) + "</p>" : "") +
        "</div>" +
        '<button class="save-btn' + (isSaved ? " is-on" : "") + '" data-act="save" aria-label="Save">' + (isSaved ? "★" : "☆") + "</button>" +
      "</div>" +
      '<div class="place-more">' +
        '<div class="detail">' +
          (p.from  ? '<div><span class="ic">🚋</span><b>Getting there:</b> ' + esc(p.from) + "</div>" : "") +
          (p.tip   ? '<div><span class="ic">💡</span><b>Tip:</b> ' + esc(p.tip) + "</div>" : "") +
          (p.hours ? '<div><span class="ic">🕒</span><b>Hours:</b> ' + esc(p.hours) + "</div>" : "") +
        "</div>" +
        '<div class="place-actions">' +
          '<a class="act map" target="_blank" rel="noopener" href="' + mapUrl(p.name + " " + (p.area || "")) + '">Open in Maps</a>' +
          '<button class="act' + (isVisited ? " is-on" : "") + '" data-act="visit">' + (isVisited ? "✓ Been there" : "Mark as been") + "</button>" +
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
      '<button class="chip' + (S.cat === "all" ? " is-on" : "") + '" data-cat="all">All ' + allPlaces().length + "</button>" +
      CATEGORIES.map((c) =>
        '<button class="chip' + (S.cat === c.id ? " is-on" : "") + '" data-cat="' + c.id + '">' +
        c.icon + " " + esc(c.label) + " " + (counts[c.id] || 0) + "</button>").join("");
    $$(".chip", wrap).forEach((b) => b.addEventListener("click", () => {
      S.cat = b.getAttribute("data-cat"); save(); renderChips(); renderPlaces();
    }));
  }

  function renderPlaces() {
    const q = ($("#search").value || "").trim().toLowerCase();
    const onlySaved = $("#onlySaved").checked, hideVisited = $("#hideVisited").checked;

    let list = allPlaces();
    if (S.cat !== "all") list = list.filter((p) => p.cat === S.cat);
    if (onlySaved) list = list.filter((p) => S.saved.indexOf(p.id) > -1);
    if (hideVisited) list = list.filter((p) => S.visited.indexOf(p.id) === -1);
    if (q) {
      list = list.filter((p) => [p.name, p.area, p.why, p.tip, p.from, (catById[p.cat] || {}).label]
        .join(" ").toLowerCase().indexOf(q) > -1);
    }

    $("#resultCount").textContent = list.length + (list.length === 1 ? " place" : " places");
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
      : '<div class="empty">Tap the ☆ on any place to keep it here.</div>';
    wirePlaces(sv);

    const vs = $("#visitedList");
    vs.innerHTML = visited.length ? visited.map((p) => placeCard(p)).join("")
      : '<div class="empty">Nothing ticked off yet.</div>';
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

  let bioReady = false;
  Vault.biometricAvailable().then((v) => { bioReady = v; });

  function renderDocs() {
    /* 1. Nothing stored yet — offer import */
    if (!Vault.exists()) { renderDocsImport(); return; }
    /* 2. Stored but locked */
    if (!Vault.isUnlocked()) { renderDocsLocked(); return; }
    /* 3. Open */
    renderDocsOpen(Vault.data());
  }

  function pane(html) { $("#pane-docs").innerHTML = '<div class="info">' + html + "</div>"; }

  function renderDocsImport() {
    const pre = docsData();   // local documents.js or a legacy plain import
    pane('<div class="info-card">' +
      "<h3><span>🔐</span>Set up your travel documents</h3>" +
      "<p>Flights, hotel, insurance and emergency numbers, encrypted on this device. They are never part of the published site — nobody else can read them, and neither can the server.</p>" +
      '<form id="docsImportForm" class="addform" style="margin-top:14px">' +
        (pre ? '<p class="muted">Documents found on this device. Choose a PIN to encrypt them.</p>'
             : '<textarea id="docsImportText" rows="4" placeholder="Paste your travel document code here…"></textarea>') +
        '<input id="docsPin" type="password" inputmode="numeric" autocomplete="new-password" placeholder="Choose a PIN (6+ characters)" minlength="4" required>' +
        '<button type="submit" class="primary-btn">Encrypt &amp; save</button>' +
      "</form>" +
      '<p class="saved-hint">The PIN is the only recovery route — there is no reset. Add your fingerprint next for day-to-day unlocking.</p>' +
    "</div>");

    $("#docsImportForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      const pin = $("#docsPin").value;
      if (!pin || pin.length < 4) { toast("PIN needs at least 4 characters"); return; }

      let obj = pre;
      if (!obj) {
        const raw = ($("#docsImportText").value || "").trim();
        if (!raw) { toast("Paste your document code first"); return; }
        try { obj = JSON.parse(raw); }
        catch (e1) {
          try { obj = JSON.parse(b64decode(raw.replace(/^.*[#&]docs=/, ""))); }
          catch (e2) { toast("Could not read that — check you copied all of it"); return; }
        }
      }
      try {
        await Vault.create(obj, pin);
        if (S.docs) { delete S.docs; save(); }   // drop any earlier plaintext copy
        renderDocs();
        toast("Encrypted and saved to this device");
      } catch (err) { toast("Could not encrypt — " + err.message); }
    });
  }

  function renderDocsLocked() {
    const bio = Vault.hasBiometric();
    pane('<div class="info-card locked-card">' +
      "<h3><span>🔒</span>Documents locked</h3>" +
      "<p>Encrypted on this device. Unlock to see your flights, hotel, insurance and emergency numbers.</p>" +
      (bio ? '<button class="primary-btn wide" id="bioUnlock" style="margin-top:14px">👆 Unlock with fingerprint</button>' : "") +
      '<form id="pinForm" class="addform" style="margin-top:10px">' +
        '<input id="pinInput" type="password" inputmode="numeric" autocomplete="current-password" placeholder="' + (bio ? "or enter your PIN" : "Enter your PIN") + '" required>' +
        '<button type="submit" class="ghost-btn">Unlock</button>' +
      "</form>" +
      '<div class="reset-row"><button class="ghost-btn danger" id="wipeDocs">Forget documents on this device</button></div>' +
    "</div>");

    const bu = $("#bioUnlock");
    if (bu) bu.addEventListener("click", async function () {
      this.disabled = true; this.textContent = "Waiting for fingerprint…";
      try { await Vault.unlockWithBiometric(); renderDocs(); }
      catch (err) {
        this.disabled = false; this.textContent = "👆 Unlock with fingerprint";
        toast(err && err.name === "NotAllowedError" ? "Fingerprint cancelled" : "Fingerprint unlock failed — use your PIN");
      }
    });

    $("#pinForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      try { await Vault.unlockWithPin($("#pinInput").value); renderDocs(); }
      catch (err) { toast(err.message === "BAD_PIN" ? "Wrong PIN" : "Could not unlock"); }
    });

    $("#wipeDocs").addEventListener("click", () => {
      if (!confirm("Forget your travel documents on this device? You will need your import code to set them up again.")) return;
      Vault.destroy(); renderDocs(); toast("Removed from this device");
    });
  }

  function renderDocsOpen(d) {
    let html = "";

    /* flights */
    if (d.flights) {
      html += '<div class="info-card"><h3><span>✈️</span>Flights</h3>' +
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
          ["Booking reference", '<b class="mono">' + esc(d.flights.ref) + "</b>", true],
          ["Airline", d.flights.airline],
          ["Baggage", d.flights.baggage],
          ["Fare rules", d.flights.fare]
        ]) + "</div>";
    }

    /* hotel */
    if (d.hotel) {
      const h = d.hotel;
      html += '<div class="info-card"><h3><span>🏨</span>' + esc(h.name) + "</h3>" +
        kv([
          ["Address", esc(h.address) + ' · <a class="inline-link" target="_blank" rel="noopener" href="' + mapUrl(h.map || h.name) + '">Maps</a>', true],
          ["Confirmation", '<b class="mono">' + esc(h.ref) + "</b>", true],
          ["Guest", h.guest],
          ["Check in", h.checkIn],
          ["Check out", h.checkOut + (h.nights ? " · " + h.nights + " nights" : "")],
          h.booked ? ["Paid with", h.booked] : null
        ]) +
        (h.note ? '<p class="warn">' + esc(h.note) + "</p>" : "") + "</div>";
    }

    /* insurance */
    if (d.insurance) {
      const i = d.insurance;
      html += '<div class="info-card"><h3><span>🛡️</span>Travel insurance</h3>' +
        kv([
          ["Insurer", i.provider],
          ["Assistance", i.assistance],
          ["Valid", i.valid],
          ["Cover", i.cover]
        ]) +
        '<dl class="kv">' + i.policies.map((p) =>
          "<dt>" + esc(p.name) + '</dt><dd><b class="mono">' + esc(p.no) + "</b></dd>").join("") + "</dl>" +
        '<div class="calls">' + i.phones.map((p) =>
          '<a class="call" href="tel:' + esc(p.tel) + '"><span>' + esc(p.label) + "</span><b>" + esc(p.value) + "</b></a>").join("") +
          (i.email ? '<a class="call" href="mailto:' + esc(i.email) + '"><span>Claims email</span><b>' + esc(i.email) + "</b></a>" : "") +
        "</div>" +
        (i.critical ? '<p class="warn">' + esc(i.critical) + "</p>" : "") + "</div>";
    }

    /* travellers */
    if (d.travellers && d.travellers.length) {
      html += '<div class="info-card"><h3><span>🛂</span>Travellers</h3>' +
        '<dl class="kv">' + d.travellers.map((t) =>
          "<dt>" + esc(t.name) + '</dt><dd><b class="mono">' + esc(t.passport) + "</b></dd>").join("") + "</dl>" +
        '<p class="muted">Passport numbers only — kept here because the insurance helpline asks for one before they will open a case.</p></div>';
    }

    /* emergency numbers */
    if (d.emergency && d.emergency.length) {
      html += '<div class="info-card"><h3><span>🆘</span>Emergency numbers</h3><div class="calls">' +
        d.emergency.map((e) =>
          '<a class="call" href="tel:' + esc(e.tel) + '"><span>' + esc(e.label) + "</span><b>" + esc(e.value) + "</b></a>").join("") +
        "</div></div>";
    }

    const hasBio = Vault.hasBiometric();
    html += '<div class="info-card"><h3><span>🔐</span>Security</h3>' +
      '<p class="muted">Encrypted on this device with AES-GCM. The key is never stored unwrapped, and nothing is sent to the server.</p>' +
      '<div class="calls" style="margin-top:12px">' +
        (hasBio
          ? '<button class="act" id="bioOff">Turn off fingerprint unlock</button>'
          : (bioReady ? '<button class="act map" id="bioOn">👆 Add fingerprint unlock</button>'
                      : '<span class="muted">This device or browser does not offer fingerprint unlock for web apps — your PIN is the way in.</span>')) +
        '<button class="act" id="lockNow">Lock now</button>' +
      "</div>" +
      '<div class="reset-row"><button class="ghost-btn danger" id="wipeDocs">Forget documents on this device</button></div>' +
    "</div>";

    pane(html);

    const on = $("#bioOn");
    if (on) on.addEventListener("click", async function () {
      this.disabled = true; this.textContent = "Waiting for fingerprint…";
      try { await Vault.enableBiometric(); renderDocs(); toast("Fingerprint unlock enabled"); }
      catch (err) {
        this.disabled = false; this.textContent = "👆 Add fingerprint unlock";
        toast(err.message === "PRF_UNSUPPORTED"
          ? "This browser can't derive a key from your fingerprint — PIN only"
          : (err && err.name === "NotAllowedError" ? "Cancelled" : "Could not enable fingerprint unlock"));
      }
    });

    const off = $("#bioOff");
    if (off) off.addEventListener("click", async () => {
      if (!confirm("Turn off fingerprint unlock? Your PIN will still work.")) return;
      await Vault.disableBiometric(); renderDocs(); toast("Fingerprint unlock removed");
    });

    $("#lockNow").addEventListener("click", () => { Vault.lock(); renderDocs(); toast("Locked"); });

    $("#wipeDocs").addEventListener("click", () => {
      if (!confirm("Forget your travel documents on this device? You will need your import code to set them up again.")) return;
      Vault.destroy(); renderDocs(); toast("Removed from this device");
    });
  }

  /* ================= GUIDE ================= */
  function renderGuide() {
    $("#pane-essentials").innerHTML = '<div class="info">' + ESSENTIALS.map((e) =>
      '<div class="info-card"><h3><span>' + e.icon + "</span>" + esc(e.title) + "</h3><p>" + esc(e.body) + "</p></div>"
    ).join("") + "</div>";

    $("#pane-phrases").innerHTML = '<div class="info">' + PHRASES.map((p) =>
      '<div class="phrase"><span class="phrase-tr">' + esc(p.tr) + '</span>' +
      '<span class="phrase-en">' + esc(p.en) + '</span>' +
      '<span class="phrase-say">' + esc(p.say) + "</span></div>"
    ).join("") + "</div>";

    $("#packList").innerHTML = PACKING.map((item, i) => {
      const done = S.packing.indexOf(i) > -1;
      return '<label class="check' + (done ? " done" : "") + '"><input type="checkbox" data-i="' + i + '"' +
        (done ? " checked" : "") + "><span>" + esc(item) + "</span></label>";
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
          ' TL</b><button data-id="' + s.id + '" aria-label="Delete">×</button></div>').join("")
      : '<div class="empty">Nothing logged yet.</div>';
    $$("#spendList button").forEach((b) => b.addEventListener("click", function () {
      S.spend = S.spend.filter((s) => s.id !== this.getAttribute("data-id"));
      save(); renderSpend();
    }));
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

  $$("#guideSeg .seg-btn").forEach((b) => b.addEventListener("click", function () {
    $$("#guideSeg .seg-btn").forEach((x) => x.classList.remove("is-on"));
    this.classList.add("is-on");
    const pane = this.getAttribute("data-pane");
    $$(".pane").forEach((p) => { p.hidden = p.id !== "pane-" + pane; });
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
      area: $("#addArea").value.trim() || "Added by you",
      price: 2, why: $("#addNote").value.trim(), mine: true
    };
    S.custom.push(p); S.saved.push(p.id); save();
    this.reset();
    renderChips(); renderPlaces(); renderSaved(); renderToday();
    toast("Added to your list");
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
    noteT = setTimeout(() => { save(); $("#notesHint").textContent = "Saved on this device ✓"; }, 400);
  });

  $("#search").addEventListener("input", renderPlaces);
  $("#onlySaved").addEventListener("change", renderPlaces);
  $("#hideVisited").addEventListener("change", renderPlaces);

  $("#resetTicks").addEventListener("click", () => {
    if (!confirm("Clear every ticked item across all eight days?")) return;
    S.ticks = {}; save(); renderPlan(); renderToday(); toast("Cleared");
  });
  $("#resetPack").addEventListener("click", () => {
    if (!confirm("Reset the packing list?")) return;
    S.packing = []; save(); renderGuide(); toast("Reset");
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
  window.addEventListener("appinstalled", () => { $("#installBtn").hidden = true; toast("Installed 🎉"); });

  /* ================= boot ================= */
  renderToday();
  renderPlan();
  renderChips();
  renderPlaces();
  renderSaved();
  renderGuide();
  renderDocs();

  // Docs always leads the Guide tab — it either shows your documents or
  // offers to import them.
  $("#pane-docs").hidden = false;
  $("#pane-essentials").hidden = true;

  const start = (location.hash || "").replace("#", "");
  go(["today", "plan", "places", "saved", "guide"].indexOf(start) > -1 ? start : "today");

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
