# İstanbul — Trip Companion PWA

Personal trip app for 11–18 September 2026, based at **Zimmer Bosphorus Hotel**, Meclisi Mebusan Cad. 61, Fındıklı, Beyoğlu.

Plain HTML/CSS/JS. No build step, no dependencies, no API keys.

## Running it

**On this PC (XAMPP):** http://localhost/istanbul/

**On your phone:** it must be served over **HTTPS**. Service workers — the thing that makes it installable and work offline — only run on `https://` or `localhost`. Opening it over your home network by IP (`http://192.168.x.x/istanbul`) will show the app but it will *not* install and will *not* work offline.

Fastest route to HTTPS (about 30 seconds, free):

1. Go to https://app.netlify.com/drop
2. Drag the `istanbul` folder (or `istanbul-pwa.zip`) onto the page
3. You get a URL like `https://something.netlify.app`
4. Open that on your phone → Chrome menu → **Install app** / Safari share sheet → **Add to Home Screen**

Cloudflare Pages and GitHub Pages work identically.

## Installing

- **Android / Chrome / Edge:** an “Install” button appears in the app header, or use the browser menu → Install app.
- **iOS / Safari:** Share → Add to Home Screen. Launches full screen with its own icon.

Once installed it runs with no signal — useful on the tram and on the ferries.

## Files

```
index.html                     app shell + all views
manifest.webmanifest           PWA manifest (icons, name, standalone display)
sw.js                          service worker, precaches everything for offline
assets/css/app.css             styling, light + dark theme
assets/js/data.js              99 places, essentials, phrases, packing list
assets/js/itinerary.js         the 8-day plan
assets/js/app.js               all app logic
assets/icons/                  generated PWA icons
```

## Editing it

Add or change places in `assets/js/data.js` — each entry takes `id, cat, name, area, price, from, why, tip, hours` and an optional `alcohol: true`. Categories are defined at the top of the same file.

Change the plan in `assets/js/itinerary.js`. An item's `place` field must match a place `id` to get a map link.

**After editing, bump `VERSION` in `sw.js`** (e.g. `ist-2026-09-v2`) or installed copies will keep serving the old cached files.

You can also add places from inside the app — the List tab has an "Add your own place" form. Those live in the phone's local storage, along with your ticks, saved spots, notes and spending log.
