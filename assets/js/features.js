/* İstanbul Trip Companion — near-me, open-now, currency and prayer times.
   All offline except the exchange rate, which is fetched when there is a
   signal and cached. */

/* ---------------------------------------------------------------------------
   1. NEIGHBOURHOOD COORDINATES
   Places carry an area name rather than a pin, so distance is resolved from
   the neighbourhood centre. Accurate to a few hundred metres, which is all
   that "what is near me" needs. Longest matching name wins.
--------------------------------------------------------------------------- */
const AREA_COORDS = {
  // Beyoğlu and the hotel's own patch
  "Fındıklı": [41.0308, 28.9857], "Tophane": [41.0270, 28.9810],
  "Galataport": [41.0248, 28.9799], "Karaköy": [41.0243, 28.9775],
  "Galata": [41.0256, 28.9741], "Tünel": [41.0281, 28.9744],
  "Kabataş": [41.0369, 28.9917], "Cihangir": [41.0322, 28.9832],
  "Çukurcuma": [41.0325, 28.9800], "Taksim": [41.0370, 28.9850],
  "İstiklal": [41.0335, 28.9780], "Asmalımescit": [41.0300, 28.9755],
  "Dolapdere": [41.0400, 28.9740], "Kasımpaşa": [41.0400, 28.9640],
  "Beyoğlu": [41.0335, 28.9770],

  // Beşiktaş and up the European shore
  "Beşiktaş": [41.0430, 29.0060], "Ulus": [41.0640, 29.0250],
  "Zincirlikuyu": [41.0680, 29.0110], "Ortaköy": [41.0475, 29.0270],
  "Bebek": [41.0776, 29.0430], "Emirgan": [41.1080, 29.0540],
  "Maslak": [41.1120, 29.0200], "Ayazağa": [41.1090, 29.0060],
  "4. Levent": [41.0880, 29.0060], "Levent": [41.0820, 29.0110],
  "Etiler": [41.0810, 29.0330], "Sarıyer": [41.1100, 29.0330],
  "Anadolu Kavağı": [41.1750, 29.0870],

  // Şişli side
  "Nişantaşı": [41.0480, 28.9940], "Osmanbey": [41.0500, 28.9880],
  "Mecidiyeköy": [41.0670, 28.9950], "Bomonti": [41.0570, 28.9770],
  "Feriköy": [41.0570, 28.9760], "Maçka": [41.0450, 28.9950],
  "Kağıthane": [41.0850, 28.9720], "Şişli": [41.0600, 28.9870],

  // Old city
  "Eminönü": [41.0170, 28.9700], "Sirkeci": [41.0155, 28.9770],
  "Gülhane": [41.0130, 28.9810], "Sultanahmet": [41.0055, 28.9770],
  "Çemberlitaş": [41.0085, 28.9710], "Beyazıt": [41.0105, 28.9640],
  "Grand Bazaar": [41.0106, 28.9680], "Mahmutpaşa": [41.0140, 28.9700],
  "Küçükpazar": [41.0180, 28.9640], "Zeyrek": [41.0195, 28.9570],
  "Aksaray": [41.0110, 28.9500], "Edirnekapı": [41.0300, 28.9380],
  "Hasköy": [41.0430, 28.9480], "Eyüpsultan": [41.0470, 28.9340],
  "Golden Horn": [41.0300, 28.9600], "Fatih": [41.0190, 28.9490],

  // West
  "Kazlıçeşme": [40.9950, 28.9130], "Zeytinburnu": [40.9930, 28.9020],
  "Ataköy": [40.9800, 28.8500], "Florya": [40.9740, 28.7870],
  "Yeşilköy": [40.9600, 28.8200], "Bakırköy": [40.9780, 28.8720],
  "Yenibosna": [40.9930, 28.8300], "Bahçelievler": [40.9970, 28.8600],
  "Bağcılar": [41.0390, 28.8330], "Güngören": [41.0100, 28.8900],
  "Bayrampaşa": [41.0450, 28.9100], "Başakşehir": [41.0930, 28.8020],
  "Esenyurt": [41.0290, 28.6800], "Beylikdüzü": [41.0030, 28.6410],
  "Küçükçekmece": [41.0000, 28.7800],

  // Asian side
  "Üsküdar": [41.0250, 29.0150], "Salacak": [41.0200, 29.0100],
  "Kadıköy": [40.9900, 29.0250], "Moda": [40.9820, 29.0250],
  "Hasanpaşa": [40.9930, 29.0430], "Acıbadem": [41.0000, 29.0450],
  "Ataşehir": [40.9920, 29.1270], "Ümraniye": [41.0230, 29.1240],
  "Beykoz": [41.1250, 29.0900], "Çamlıca": [41.0270, 29.0680],
  "Pendik": [40.8770, 29.2330], "Tuzla": [40.8160, 29.3000],

  // Further out
  "Princes' Islands": [40.8570, 29.1250], "Sea of Marmara": [40.8570, 29.1250],
  "Black Sea coast": [41.1760, 29.6120], "Kocaeli": [40.6900, 30.2600]
};

const AREA_KEYS = Object.keys(AREA_COORDS).sort((a, b) => b.length - a.length);

function coordsFor(place) {
  if (place.coords) return place.coords;
  const a = (place.area || "") + " " + (place.name || "");
  for (let i = 0; i < AREA_KEYS.length; i++) {
    if (a.indexOf(AREA_KEYS[i]) > -1) return AREA_COORDS[AREA_KEYS[i]];
  }
  return null;
}

/* Great-circle distance in metres. */
function haversine(a, b) {
  const R = 6371000, toRad = Math.PI / 180;
  const dLat = (b[0] - a[0]) * toRad, dLng = (b[1] - a[1]) * toRad;
  const la1 = a[0] * toRad, la2 = b[0] * toRad;
  const h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

/* Straight-line distance from a neighbourhood centre, so it is deliberately
   shown as an approximation and without a walking time: İstanbul's hills and
   dead-end streets make minute estimates from crow-flies distance wrong more
   often than right. Each place already carries a hand-written "getting there"
   note, which stays the authority on how long it actually takes. */
function walkText(metres) {
  if (metres < 950) return "~" + Math.round(metres / 50) * 50 + " m";
  if (metres < 10000) return "~" + (metres / 1000).toFixed(1) + " km";
  return "~" + Math.round(metres / 1000) + " km";
}

/* ---------------------------------------------------------------------------
   2. OPEN NOW
   The hours strings are written for humans, so they are parsed rather than
   duplicated. Anything the parser cannot read honestly reports "unknown".
--------------------------------------------------------------------------- */
const DAY_IDS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseHours(str) {
  if (!str) return { kind: "unknown" };
  const s = str.trim();

  if (/^(anytime|always open|24 hours|daylight)/i.test(s)) return { kind: "always" };

  const out = { kind: "unknown", closedDay: null, onlyDays: null, from: null, to: null };

  const closed = s.match(/closed\s+(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i);
  if (closed) out.closedDay = DAY_IDS.indexOf(
    closed[1][0].toUpperCase() + closed[1].slice(1, 3).toLowerCase());

  const only = s.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b(?:\s+only)?/i);
  if (only) out.onlyDays = [DAY_IDS.indexOf(
    only[1][0].toUpperCase() + only[1].slice(1, 3).toLowerCase())];

  const t = s.match(/(\d{1,2}):(\d{2})\s*[–—-]\s*(\d{1,2}):(\d{2})/);
  if (t) {
    out.from = (+t[1]) * 60 + (+t[2]);
    out.to = (+t[3]) * 60 + (+t[4]);
    out.kind = "hours";
  } else if (out.onlyDays || out.closedDay !== null) {
    out.kind = "days";
  }
  return out;
}

/* -> "open" | "closed" | "unknown", plus a short reason */
function openState(place, now) {
  now = now || new Date();
  const h = parseHours(place.hours);
  if (h.kind === "always") return { state: "open", why: "Open anytime", key: "anytime" };
  if (h.kind === "unknown") return { state: "unknown", why: "", key: "unknown" };

  const day = now.getDay();
  if (h.onlyDays && h.onlyDays.indexOf(day) === -1) {
    return { state: "closed", why: DAY_IDS[h.onlyDays[0]] + " only", key: "onlyDay", day: h.onlyDays[0] };
  }
  if (h.closedDay === day) return { state: "closed", why: "Closed " + DAY_IDS[day] + "s", key: "closedDay", day: day };
  if (h.kind === "days") return { state: "open", why: "Running today", key: "runningToday" };

  const mins = now.getHours() * 60 + now.getMinutes();
  const overnight = h.to <= h.from;
  const isOpen = overnight ? (mins >= h.from || mins < h.to) : (mins >= h.from && mins < h.to);
  if (!isOpen) {
    const opensIn = (h.from - mins + 1440) % 1440;
    if (opensIn <= 180) return { state: "closed", why: "Opens in " + Math.round(opensIn / 5) * 5 + " min", key: "opensIn", n: Math.round(opensIn / 5) * 5 };
    return { state: "closed", why: "Closed now", key: "closedNow" };
  }
  const closesIn = (h.to - mins + 1440) % 1440;
  if (closesIn <= 60) return { state: "open", why: "Closes in " + closesIn + " min", key: "closesIn", n: closesIn };
  return { state: "open", why: "Open now", key: "openNow" };
}

/* ---------------------------------------------------------------------------
   3. PRAYER TIMES — computed locally, no network.
   Diyanet convention: Fajr 18°, Isha 17°, Asr at shadow factor 1.
--------------------------------------------------------------------------- */
const IST = { lat: 41.0082, lng: 28.9784, tz: 3 };

function prayerTimes(date, loc) {
  loc = loc || IST;
  const rad = Math.PI / 180, deg = 180 / Math.PI;
  const sin = (x) => Math.sin(x * rad), cos = (x) => Math.cos(x * rad), tan = (x) => Math.tan(x * rad);
  const asin = (x) => Math.asin(x) * deg, acos = (x) => Math.acos(x) * deg;
  const atan2 = (y, x) => Math.atan2(y, x) * deg;
  const acot = (x) => Math.atan(1 / x) * deg;

  // Julian day for 00:00 UT
  let y = date.getFullYear(), m = date.getMonth() + 1;
  const d = date.getDate();
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;

  const n = jd - 2451545.0;
  // These grow without bound over time, so wrap them into [0,360) before use —
  // otherwise the equation of time below comes out hundreds of hours wrong.
  const fix = (a) => ((a % 360) + 360) % 360;
  const g = fix(357.529 + 0.98560028 * n);
  const q = fix(280.459 + 0.98564736 * n);
  const L = fix(q + 1.915 * sin(g) + 0.020 * sin(2 * g));
  const e = 23.439 - 0.00000036 * n;

  let ra = atan2(cos(e) * sin(L), cos(L)) / 15;
  ra = ((ra % 24) + 24) % 24;
  // equation of time, hours, wrapped to the nearest ±12h so it stays small
  const eqt = (((q / 15 - ra) + 12) % 24 + 24) % 24 - 12;
  const decl = asin(sin(e) * sin(L));

  const dhuhr = 12 + loc.tz - loc.lng / 15 - eqt;

  function T(angle) {
    const c = (-sin(angle) - sin(loc.lat) * sin(decl)) / (cos(loc.lat) * cos(decl));
    if (c > 1 || c < -1) return null;            // sun never reaches that angle
    return acos(c) / 15;
  }
  function asrHour(shadow) {
    const alt = -acot(shadow + tan(Math.abs(loc.lat - decl)));
    const t = T(alt);
    return t === null ? null : dhuhr + t;
  }

  const fmt = (h) => {
    if (h === null || isNaN(h)) return "—";
    let hh = ((h % 24) + 24) % 24;
    let mm = Math.round((hh - Math.floor(hh)) * 60);
    hh = Math.floor(hh);
    if (mm === 60) { mm = 0; hh = (hh + 1) % 24; }
    return (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm;
  };

  const t18 = T(18), t17 = T(17), t083 = T(0.833);
  const raw = {
    fajr:    t18  === null ? null : dhuhr - t18,
    sunrise: t083 === null ? null : dhuhr - t083,
    dhuhr:   dhuhr,
    asr:     asrHour(1),
    maghrib: t083 === null ? null : dhuhr + t083,
    isha:    t17  === null ? null : dhuhr + t17
  };

  return {
    raw: raw,
    list: [
      { key: "fajr",    label: "Fajr",    time: fmt(raw.fajr) },
      { key: "sunrise", label: "Sunrise", time: fmt(raw.sunrise), minor: true },
      { key: "dhuhr",   label: "Dhuhr",   time: fmt(raw.dhuhr) },
      { key: "asr",     label: "Asr",     time: fmt(raw.asr) },
      { key: "maghrib", label: "Maghrib", time: fmt(raw.maghrib) },
      { key: "isha",    label: "Isha",    time: fmt(raw.isha) }
    ]
  };
}

/* Which prayer is next, and how long until it. */
function nextPrayer(now) {
  now = now || new Date();
  const p = prayerTimes(now);
  const mins = now.getHours() + now.getMinutes() / 60;
  const order = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
  for (let i = 0; i < order.length; i++) {
    const t = p.raw[order[i]];
    if (t !== null && t > mins) {
      const diff = (t - mins) * 60;
      return {
        name: order[i][0].toUpperCase() + order[i].slice(1),
        time: p.list.filter((x) => x.key === order[i])[0].time,
        inText: diff < 60 ? Math.round(diff) + " min" :
                Math.floor(diff / 60) + "h " + Math.round(diff % 60) + "m"
      };
    }
  }
  const tomorrow = prayerTimes(new Date(now.getTime() + 86400000));
  return { name: "Fajr", time: tomorrow.list[0].time, inText: "tomorrow" };
}

/* ---------------------------------------------------------------------------
   5. WEATHER — Open-Meteo, no API key. Fetched when there is a signal and
   cached, so an old forecast still shows offline with its age on it.
--------------------------------------------------------------------------- */
const WX_KEY = "ist2026wx";

/* WMO weather codes → something readable */
const WMO = {
  0:  ["Clear", "☀️"],            1:  ["Mostly clear", "🌤️"],
  2:  ["Partly cloudy", "⛅"],    3:  ["Overcast", "☁️"],
  45: ["Fog", "🌫️"],             48: ["Freezing fog", "🌫️"],
  51: ["Light drizzle", "🌦️"],   53: ["Drizzle", "🌦️"],
  55: ["Heavy drizzle", "🌦️"],   61: ["Light rain", "🌧️"],
  63: ["Rain", "🌧️"],            65: ["Heavy rain", "🌧️"],
  71: ["Light snow", "🌨️"],      73: ["Snow", "🌨️"],
  75: ["Heavy snow", "🌨️"],      80: ["Showers", "🌦️"],
  81: ["Showers", "🌦️"],         82: ["Heavy showers", "⛈️"],
  95: ["Thunderstorm", "⛈️"],    96: ["Thunderstorm", "⛈️"],
  99: ["Thunderstorm", "⛈️"]
};
const wmo = (c) => WMO[c] || ["—", "•"];

function cachedWeather() {
  try { return JSON.parse(localStorage.getItem(WX_KEY) || "null"); } catch (e) { return null; }
}

async function fetchWeather() {
  const url = "https://api.open-meteo.com/v1/forecast" +
    "?latitude=41.0082&longitude=28.9784" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
    "&timezone=Europe%2FIstanbul&forecast_days=16";
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return cachedWeather();
    const j = await res.json();
    if (!j.daily || !j.daily.time) return cachedWeather();
    const days = j.daily.time.map((d, i) => ({
      date: d,
      code: j.daily.weather_code[i],
      max: Math.round(j.daily.temperature_2m_max[i]),
      min: Math.round(j.daily.temperature_2m_min[i]),
      rain: j.daily.precipitation_probability_max[i]
    }));
    const out = { days: days, at: Date.now() };
    try { localStorage.setItem(WX_KEY, JSON.stringify(out)); } catch (e) {}
    return out;
  } catch (e) {
    return cachedWeather();      // offline — show what we have
  }
}

/* ---------------------------------------------------------------------------
   4. EXCHANGE RATE — fetched when online, cached, manually overridable.
--------------------------------------------------------------------------- */
const RATE_KEY = "ist2026rates";

function cachedRates() {
  try { return JSON.parse(localStorage.getItem(RATE_KEY) || "null"); } catch (e) { return null; }
}
function storeRates(r) {
  try { localStorage.setItem(RATE_KEY, JSON.stringify(r)); } catch (e) {}
}

/* Returns { TRY_per_EUR, TRY_per_USD, at, source } */
async function fetchRates() {
  const tries = [
    { url: "https://api.frankfurter.app/latest?from=EUR&to=TRY,USD",
      pick: (j) => ({ eur: j.rates.TRY, usd: j.rates.TRY / j.rates.USD }) },
    { url: "https://open.er-api.com/v6/latest/EUR",
      pick: (j) => ({ eur: j.rates.TRY, usd: j.rates.TRY / j.rates.USD }) }
  ];
  for (const t of tries) {
    try {
      const res = await fetch(t.url, { cache: "no-store" });
      if (!res.ok) continue;
      const got = t.pick(await res.json());
      if (!got.eur || !isFinite(got.eur)) continue;
      const r = { eur: got.eur, usd: got.usd, at: Date.now(), source: "live" };
      storeRates(r);
      return r;
    } catch (e) { /* offline, try the next one */ }
  }
  return cachedRates();
}
