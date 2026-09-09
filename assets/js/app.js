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

  let myPos = null;   // [lat, lng] once you tap "Near me"; never stored
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
          carHtml(day) +
        "</div>" +
        '<div class="today-body">' + timelineHtml(day) + "</div>" +
      "</div>";
    wireTimeline(block);

    const notes = $("#hotelNotes");
    notes.innerHTML = TRIP.hotel.notes.map((n) => "<li>" + esc(n) + "</li>").join("");
  }

  function carHtml(day) {
    if (!day.car) return "";
    return '<div class="carnote ' + (day.car.use ? "yes" : "no") + '">' +
      "<b>" + (day.car.use ? "🚗 Take the car" : "🚊 Leave the car") + "</b>" +
      esc(day.car.text) + "</div>";
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
          carHtml(day) +
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
    const st = openState(p);
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
            "<span>" + esc(c.label) + "</span>" +
            (p.area ? '<span class="dot-sep">' + esc(p.area) + "</span>" : "") +
            '<span class="dot-sep">' + priceStr(p.price) + "</span>" +
            (dist ? '<span class="badge-dist">' + esc(dist) + "</span>" : "") +
            (st.state !== "unknown" ? '<span class="badge-open ' + st.state + '">' + esc(st.why) + "</span>" : "") +
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

    $("#resultCount").textContent = list.length + (list.length === 1 ? " place" : " places") +
      (myPos ? " · nearest first" : "");
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

    /* hire car */
    if (d.car) {
      const c = d.car;
      html += '<div class="info-card"><h3><span>🚗</span>' + esc(c.company) + " hire car</h3>" +
        (c.critical ? '<p class="warn danger-warn">' + esc(c.critical) + "</p>" : "") +
        kv([
          ["Reference", '<b class="mono">' + esc(c.ref) + "</b>", true],
          ["Vehicle", c.vehicle],
          ["Pick up", esc(c.pickUp.when) + "<br>" + esc(c.pickUp.where), true],
          ["Drop off", esc(c.dropOff.when) + "<br>" + esc(c.dropOff.where), true],
          ["Mileage", c.mileage],
          ["Deposit", c.deposit],
          ["Bring", c.bring],
          ["Paid", c.paid]
        ]) +
        '<div class="calls" style="margin-top:12px">' +
          '<a class="call" href="tel:' + esc(c.phone.tel) + '"><span>Rental desk, IST</span><b>' + esc(c.phone.value) + "</b></a>" +
          '<a class="call" target="_blank" rel="noopener" href="' + mapUrl(c.address) + '"><span>Desk location</span><b>Map</b></a>' +
        "</div>" +
        (c.warn ? '<p class="warn">' + esc(c.warn) + "</p>" : "") + "</div>";
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
      '<div class="info-card"><h3><span>🧭</span>Get me there from the hotel</h3>' +
        '<p class="muted">Opens live public-transport directions from Meclisi Mebusan Cad. 61 — needs a signal.</p>' +
        '<form id="tripForm" class="addform row" style="margin-top:12px">' +
          '<input id="tripDest" placeholder="Where to? e.g. İstinye Park" required>' +
          '<button type="submit" class="primary-btn">Route</button>' +
        "</form>" +
      "</div>" +

      /* stops */
      '<div class="info-card"><h3><span>📍</span>Your stops</h3>' +
        T.stops.map((s) =>
          '<div class="stop">' +
            '<div class="stop-top"><b>' + esc(s.icon) + " " + esc(s.name) + "</b>" +
              '<a class="inline-link" target="_blank" rel="noopener" href="' + mapUrl(s.map) + '">Map</a></div>' +
            '<div class="stop-walk">' + esc(s.walk) + "</div>" +
            '<div class="stop-note">' + esc(s.note) + "</div>" +
          "</div>").join("") +
      "</div>" +

      /* rail */
      '<div class="info-card"><h3><span>🚊</span>Tram, funicular, metro</h3>' +
        T.rail.map((r) =>
          '<div class="line">' +
            '<div class="line-top"><span class="line-badge" style="background:' + r.colour + '">' + esc(r.line) + "</span>" +
              "<b>" + esc(r.name) + "</b></div>" +
            '<div class="line-meta">' + esc(r.hours) + " · " + esc(r.freq) + "</div>" +
            '<div class="stop-note">' + esc(r.note) + "</div>" +
            '<div class="line-stops">' + esc(r.stops) + "</div>" +
          "</div>").join("") +
      "</div>" +

      /* buses */
      '<div class="info-card"><h3><span>🚌</span>Buses</h3>' +
        T.buses.map((b) =>
          '<div class="line">' +
            "<b>" + esc(b.group) + "</b>" +
            '<div class="bus-lines">' + esc(b.lines) + "</div>" +
            '<div class="stop-note">' + esc(b.note) + "</div>" +
          "</div>").join("") +
      "</div>" +

      /* ferries */
      '<div class="info-card"><h3><span>⛴️</span>Ferries</h3>' +
        T.ferries.map((f) =>
          '<div class="line">' +
            "<b>" + esc(f.route) + "</b>" +
            '<div class="line-meta">' + esc(f.time) + " · " + esc(f.freq) + "</div>" +
            '<div class="line-meta">' + esc(f.hours) + " · from " + esc(f.pier) + "</div>" +
            '<div class="stop-note">' + esc(f.note) + "</div>" +
          "</div>").join("") +
      "</div>" +

      /* islands timetable — the one fixed schedule */
      '<div class="info-card"><h3><span>🏝️</span>' + esc(T.islands.title) + "</h3>" +
        '<p class="muted">' + esc(T.islands.note) + "</p>" +
        '<div class="departures" id="departures">' +
          T.islands.departures.map((d) => '<span class="dep" data-t="' + d + '">' + d + "</span>").join("") +
        "</div>" +
        '<p class="warn">' + esc(T.islands.warn) + "</p>" +
      "</div>" +

      /* driving */
      '<div class="info-card"><h3><span>🚗</span>Driving &amp; parking</h3>' +
        T.driving.map((d) =>
          '<div class="line"><b>' + d.icon + " " + esc(d.title) + "</b>" +
          '<div class="stop-note">' + esc(d.body) + "</div></div>").join("") +
      "</div>" +

      /* live links */
      '<div class="info-card"><h3><span>🔗</span>Live times</h3>' +
        '<p class="muted">Frequencies above are reliable; exact minutes change with the season — İstanbul moves to its winter timetable in late September, during your trip. Check these on the day.</p>' +
        '<div class="calls" style="margin-top:12px">' +
          T.links.map((l) =>
            '<a class="call" target="_blank" rel="noopener" href="' + esc(l.url) + '"><span>' + esc(l.label) + "</span><b>Open</b></a>").join("") +
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
      '<div class="info-card"><h3><span>💱</span>Currency</h3>' +
        '<div class="conv">' +
          '<div class="conv-row"><input id="cvTL" type="number" inputmode="decimal" placeholder="0"><span>₺ TL</span></div>' +
          '<div class="conv-row"><input id="cvEUR" type="number" inputmode="decimal" placeholder="0"><span>€ EUR</span></div>' +
          '<div class="conv-row"><input id="cvUSD" type="number" inputmode="decimal" placeholder="0"><span>$ USD</span></div>' +
        "</div>" +
        '<p class="saved-hint" id="rateNote">' +
          (r ? "1 € = " + r.eur.toFixed(2) + " ₺ · 1 $ = " + r.usd.toFixed(2) + " ₺ · " +
               (age < 1 ? "just updated" : age + "h old") + (r.source === "manual" ? " (entered by you)" : "")
             : "No rate yet — connect once, or enter one below.") +
        "</p>" +
        '<form id="rateForm" class="addform row" style="margin-top:10px">' +
          '<input id="rateInput" type="number" inputmode="decimal" step="0.01" placeholder="TL per 1 €">' +
          '<button type="button" class="ghost-btn" id="rateFetch">Update</button>' +
          '<button type="submit" class="ghost-btn">Set</button>' +
        "</form>" +
      "</div>" +

      /* ---- haggling ---- */
      '<div class="info-card"><h3><span>🤝</span>Haggling</h3>' +
        '<p class="muted">In the Grand Bazaar, Spice Bazaar and Mahmutpaşa the first price is usually two to three times the real one. Not in malls, restaurants or supermarkets.</p>' +
        '<form id="hagForm" class="addform row" style="margin-top:12px">' +
          '<input id="hagAsk" type="number" inputmode="decimal" placeholder="They asked (₺)" required>' +
          '<button type="submit" class="primary-btn">Work it out</button>' +
        "</form>" +
        '<div id="hagOut"></div>' +
      "</div>" +

      /* ---- prayer times ---- */
      '<div class="info-card"><h3><span>🕌</span>Prayer times — İstanbul</h3>' +
        '<div id="prayerNext" class="next-prayer"></div>' +
        '<div id="prayerList" class="prayers"></div>' +
        '<p class="saved-hint">Calculated on the device (Diyanet convention: Fajr 18°, Isha 17°), so it works with no signal. Expect it to be within a minute or two of the mosque — check locally if you need it exact.</p>' +
        '<p class="warn">Mosques close to visitors for about 30 minutes around each of these, and for longer around Friday midday.</p>' +
      "</div>" +
    "</div>";

    /* currency wiring */
    const tl = $("#cvTL"), eu = $("#cvEUR"), us = $("#cvUSD");
    function convert(from) {
      const rr = cachedRates();
      if (!rr) { toast("Set a rate first"); return; }
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
      this.textContent = "Update";
      if (got && got.source === "live") { renderTools(); toast("Rate updated"); }
      else toast("No signal — enter a rate by hand");
    });
    $("#rateForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const v = parseFloat($("#rateInput").value);
      if (isNaN(v) || v <= 0) { toast("Enter TL per 1 euro"); return; }
      const prev = cachedRates();
      storeRates({ eur: v, usd: prev && prev.usd && prev.eur ? v * (prev.usd / prev.eur) : v / 1.08,
                   at: Date.now(), source: "manual" });
      renderTools(); toast("Rate saved");
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
          "<dt>Open at</dt><dd><b>" + Math.round(ask * 0.4) + " ₺</b>" + eurOf(ask * 0.4) + "</dd>" +
          "<dt>Settle near</dt><dd><b>" + Math.round(ask * 0.55) + " ₺</b>" + eurOf(ask * 0.55) + "</dd>" +
          "<dt>Walk away above</dt><dd><b>" + Math.round(ask * 0.7) + " ₺</b>" + eurOf(ask * 0.7) + "</dd>" +
        "</dl>" +
        '<p class="muted" style="margin-top:8px">Say <b>çok pahalı</b> (too expensive), then <b>son fiyat ne?</b> (what is your best price). Walking away once is the strongest move you have.</p>';
    });

    /* prayer wiring */
    const np = nextPrayer();
    $("#prayerNext").innerHTML =
      "<span>Next</span><b>" + esc(np.name) + "</b><span>" + esc(np.time) + " · in " + esc(np.inText) + "</span>";
    $("#prayerList").innerHTML = prayerTimes(new Date()).list.map((p) =>
      '<div class="prayer' + (p.minor ? " minor" : "") + (p.key === np.name.toLowerCase() ? " is-next" : "") + '">' +
        "<span>" + esc(p.label) + "</span><b>" + esc(p.time) + "</b></div>").join("");
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
  $("#openNow").addEventListener("change", renderPlaces);

  /* ---- near me ---- */
  $("#nearBtn").addEventListener("click", function () {
    if (myPos) {                       // tapping again turns it off
      myPos = null; this.classList.remove("is-on");
      this.textContent = "📍 Near me"; renderPlaces(); return;
    }
    if (!navigator.geolocation) { toast("This browser can't do location"); return; }
    const btn = this;
    btn.textContent = "Locating…"; btn.disabled = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        myPos = [pos.coords.latitude, pos.coords.longitude];
        btn.disabled = false; btn.classList.add("is-on"); btn.textContent = "📍 Near me ✓";
        renderPlaces();
        toast("Sorted by how far you'd walk");
      },
      (err) => {
        btn.disabled = false; btn.textContent = "📍 Near me";
        toast(err.code === 1 ? "Location permission denied" : "Couldn't get your location");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 120000 }
    );
  });

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
  renderTools();
  renderTransport();

  // Docs always leads the Guide tab — it either shows your documents or
  // offers to import them.
  $("#pane-docs").hidden = false;
  $("#pane-essentials").hidden = true;

  // Deep links: #places, #guide, and #guide:tools for a specific guide pane
  const start = (location.hash || "").replace("#", "").split(":");
  go(["today", "plan", "places", "saved", "guide"].indexOf(start[0]) > -1 ? start[0] : "today");
  if (start[0] === "guide" && start[1]) showPane(start[1]);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
