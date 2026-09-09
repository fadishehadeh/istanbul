/* Day-by-day plan, routed from Zimmer Bosphorus Hotel (Fındıklı).

   Built around the real bookings:
   - TK827 departs Beirut 22:15 Fri 11 Sep, lands İstanbul 00:15 Sat 12 Sep
   - Garenta hire car collected at IST on arrival, returned there Fri 18 Sep
   - Night 1 at İstanbul Dora, Dolapdere — Zimmer does not take them until
     14:00 on the Saturday, so Saturday includes a hotel move at midday
   - Zimmer Bosphorus, Fındıklı, Sat 12 Sep to Fri 18 Sep (6 nights)
   - TK824 departs İstanbul 12:25 Fri 18 Sep

   So there is no daytime Friday in İstanbul at either end. Saturday starts
   late after a 2am check-in across town, and Friday is airport-only.

   Weighted away from the first-timer circuit: markets, wholesale districts,
   new complexes and food, with the classics left in Places for reference.
   Weekly markets are matched to the right weekday, and closures avoided:
   Grand Bazaar shut Sun, Topkapı shut Tue, Dolmabahçe / İstanbul Modern
   / Arter shut Mon. */

const ITINERARY = [
  {
    n: 1, date: "2026-09-11", dow: "Friday", title: "Fly out — TK827",
    car: { use: true, text: "Pick the car up at IST after you land. Get the passport stamp FIRST — Garenta needs it for a foreign licence." },
    subtitle: "Beirut 22:15, İstanbul 00:15. Nothing happens today except getting there.",
    tags: ["Travel day", "Late arrival", "TK827"],
    items: [
      { time: "19:00", title: "Leave for Beirut airport", note: "TK827 departs 22:15 from Rafic Hariri International. Aim to be at the terminal by 19:45 — three hours out for an international departure." },
      { time: "22:15", title: "TK827 — Beirut → İstanbul", note: "Turkish Airlines, Airbus A350-900, Economy (class U). Flight time 2 hours. Checked baggage 30 kg each, cabin 8 kg. Booking reference WJUTVX." },
      { time: "00:15", title: "Land at İstanbul Airport (IST)", note: "Now Saturday. Passport control can take 30–45 minutes at this hour." },
      { time: "00:45", title: "GET YOUR PASSPORT STAMPED", note: "Do this before you leave the arrivals hall. Garenta will not release the car on a foreign licence without the entry stamp for your most recent arrival, and İstanbul's e-gates frequently do not stamp. Ask the officer directly, or request an official Entry Record. Everything below depends on it." },
      { time: "01:15", title: "Collect the hire car — Garenta, ref 0N7C4X", note: "Desk is in the Arrivals Terminal. Bring the credit card in your own name, your licence and ID. They will hold ₺6,000 as a deposit. Check the HGS toll transponder is fitted and ask how they bill crossings. Photograph every existing scratch before you drive off." },
      { time: "01:45", title: "Drive to Dolapdere", note: "About 40 minutes on empty roads — the one hour of the day this drive is easy. Roughly 40 km via the O-7. Not Fındıklı tonight: Zimmer does not take you until Saturday afternoon." },
      { time: "02:15", title: "Check in at İstanbul Dora Hotel", note: "Dolapdere Cad. 33, Şişli. Confirmation 5751.020.465, PIN 1552. The hotel has confirmed 24-hour reception and is holding the room until midday Saturday, so arriving at 2am is fine. Parking is the loose end — they have no car park, so know where you are putting the car before you set off. Then sleep." }
    ],
    swap: "Change some money at the airport only if you need taxi cash — the rate is poor. 1,500 TL is plenty to get you to the hotel and through breakfast; do the real exchange in Eminönü later in the week."
  },

  {
    n: 2, date: "2026-09-12", dow: "Saturday", title: "Slow start, all on foot",
    car: { use: false, text: "One short drive at midday to move hotels, then park it for the day — everything after that is on foot." },
    subtitle: "You checked in at 2am in Dolapdere. Move to Fındıklı at midday, then everything is on foot.",
    tags: ["Hotel move", "Easy", "Walkable"],
    items: [
      { time: "09:30", title: "Breakfast at the Dora", note: "It is included, and you will want it. Check-out is 12:00–12:30, so there is no rush." },
      { time: "12:15", title: "Check out and drive to Fındıklı", note: "Dolapdere down to the shore is fifteen minutes. Zimmer's confirmation is 1051754682; check-in is 14:00, so drop the bags and go if you are early." },
      { time: "13:00", title: "Late breakfast: Van Kahvaltı Evi", note: "Ten minutes uphill into Cihangir from Zimmer. Eastern-style spread — otlu peynir, kaymak and honey, murtuğa.", place: "van-kahvalti" },
      { time: "14:00", title: "Check in at Zimmer Bosphorus", note: "Meclisi Mebusan Cad. 61. Ask where the car goes for the week while you are at the desk." },
      { time: "14:45", title: "İstanbulkart from Kabataş", note: "Seven minutes down to the pier. Buy two cards, load 500 TL each. Covers tram, metro, funicular, bus, ferry and the Eyüp cable car all week." },
      { time: "15:15", title: "Çukurcuma antiques", note: "The lanes right behind the hotel — antique dealers, vintage furniture, bric-à-brac, and the Museum of Innocence if you want it. Aimless is the point.", place: "cukurcuma" },
      { time: "16:15", title: "İstanbul Modern", note: "Eight minutes along the water at Galataport. The Renzo Piano building is new since most visits — go up to the roof terrace and the reflecting pool facing the old city.", place: "istanbul-modern" },
      { time: "17:45", title: "Galataport promenade", note: "1.2km of new waterfront that did not exist a few years ago. Cruise ships dock underneath it.", place: "galataport" },
      { time: "18:30", title: "Coffee at Norm, then up to Galata", note: "Small, serious, filter-forward. Fuel for the hill.", place: "norm-coffee" },
      { time: "20:00", title: "Dinner: Karaköy Lokantası", note: "Twelve minutes' walk. Book before you fly — Saturday fills. Order the çökertme kebabı.", place: "karakoy-lokantasi" },
      { time: "22:00", title: "Baklava at Karaköy Güllüoğlu", note: "Open till 23:00, two minutes away. Warm fıstıklı at the counter.", place: "karakoy-gulluoglu" }
    ],
    swap: "If you wake up earlier than expected: Ulus Pazarı in Beşiktaş runs Saturdays only, 08:00–17:00, and is where export garment overruns surface at market-stall prices. The Beşiktaş Saturday market is walkable from the hotel along the shore."
  },

  {
    n: 3, date: "2026-09-13", dow: "Sunday", title: "Bosphorus, and the Sunday flea market",
    car: { use: true, text: "The car's best day. The Bosphorus shore road north is exactly what it's for." },
    subtitle: "Feriköy Antika is Sunday-only, and it is the one market you cannot move to another day.",
    tags: ["Sunday only", "Bosphorus", "Antiques"],
    items: [
      { time: "09:00", title: "Feriköy Antika Pazarı", note: "SUNDAYS ONLY. Vinyl, cameras, Ottoman ephemera, watches, coins, under one canopy. Before 11:00 for the good stuff — dealers pick it over early.", place: "ferikoy-antika" },
      { time: "11:30", title: "Breakfast on the water: Emirgan Sütiş", note: "Twenty-five minutes up the European shore. Serpme kahvaltı under the Fatih Sultan Mehmet Bridge.", place: "emirgan-sutis" },
      { time: "13:30", title: "Bebek → Rumeli Hisarı shore walk", note: "Twenty minutes of promenade past yalı mansions and rowers, at the narrowest point of the strait.", place: "bebek-hisari-walk" },
      { time: "15:30", title: "Short Bosphorus cruise", note: "Two hours up to the second bridge and back. All of the view, none of the evening gone.", place: "short-bosphorus" },
      { time: "18:00", title: "Ortaköy — Sunday is its best day", note: "The craft market is fully out on a Sunday. Mosque, bridge, boats.", place: "ortakoy" },
      { time: "19:15", title: "Sunset, then kumpir", note: "Stand to the left of the mosque for the shot, then the loaded-potato alley behind it.", place: "ortakoy-kumpir" },
      { time: "21:00", title: "Home along the shore", note: "Fifteen minutes back down the water to Fındıklı by taxi or bus." }
    ],
    swap: "If you would rather sit still: the Şehir Hatları full-day cruise leaves Eminönü about 10:35 and returns around 17:00, running all the way to the Black Sea mouth for the price of a coffee. It costs you the flea market though."
  },

  {
    n: 4, date: "2026-09-14", dow: "Monday", title: "Asian side — food, murals, and the gasworks",
    car: { use: false, text: "Ferry to Kadıköy and leave the car at the hotel — parking there is worse than the crossing is long." },
    subtitle: "Kadıköy properly, plus Müze Gazhane, which is the best new thing on that side of the water.",
    tags: ["Food day", "Ferries", "New"],
    items: [
      { time: "09:30", title: "Ferry: Kabataş → Kadıköy", note: "Seven minutes to the pier, twenty on the water. Tea, gulls, the whole skyline. Sit outside at the back.", place: "kabatas-kadikoy" },
      { time: "10:15", title: "Kadıköy market streets", note: "Graze rather than plan — cheese, pickles, olives, dried fruit. Özcan Turşucusu for a shot of pickle juice.", place: "kadikoy-carsi" },
      { time: "11:00", title: "Fazıl Bey, then Şekerci Cafer Erol", note: "Coffee roasted since 1923, then lokum and marzipan from an 1807 shop. Buy your sweets here, not at the Spice Bazaar — better and cheaper.", place: "seker-cafer-erol" },
      { time: "12:30", title: "Lunch: Çiya Sofrası", note: "Before 13:00. Regional Anatolian dishes that rotate daily and exist nowhere else. Point at everything; you pay by weight.", place: "ciya-sofrasi" },
      { time: "14:00", title: "Yeldeğirmeni mural walk", note: "Kadıköy's arts quarter — building-sized murals, galleries, record shops. About forty minutes on foot.", place: "yeldegirmeni" },
      { time: "15:30", title: "Müze Gazhane", note: "An 1892 gasworks turned into a 32,000 m² public campus — museums, a huge library, theatre halls and cafés around the old gas tanks. Free, and almost no foreign visitors.", place: "muze-gazhane" },
      { time: "17:45", title: "Tea at Tarihi Moda İskelesi", note: "A restored 1917 pier out over the Marmara. Rail-side table about 45 minutes before sunset.", place: "moda-iskele" },
      { time: "19:30", title: "Ferry back into the sunset", note: "Kadıköy → Kabataş with the old city lighting up on your left." },
      { time: "20:45", title: "Something light in Cihangir", note: "You will have eaten all day. Ten minutes from the hotel." }
    ],
    swap: "Rain plan: Emaar Square Mall and its aquarium are twenty minutes from Kadıköy, or the Rahmi Koç Museum on the Golden Horn — a submarine you can walk through. Note İstanbul Modern and Dolmabahçe are both closed today."
  },

  {
    n: 5, date: "2026-09-15", dow: "Tuesday", title: "Malls, properly",
    car: { use: true, text: "Every stop today has an underground car park. Nişantaşı, Zorlu, İstinye Park." },
    subtitle: "Luxury street on foot in the morning, then the two best malls in the country.",
    tags: ["Shopping", "Tax-free", "Sunset dinner"],
    items: [
      { time: "10:00", title: "Nişantaşı on foot", note: "Abdi İpekçi → Teşvikiye → Akkavak Sokak. Flagships on the main street, Turkish designers on the side streets. City's Nişantaşı is the indoor backup if it turns.", place: "nisantasi" },
      { time: "13:00", title: "Lunch in Nişantaşı", note: "Kantin for modern Turkish, or any of the café terraces on Atiye Sokak." },
      { time: "14:30", title: "Zorlu Center", note: "Fifteen minutes away. Luxury wing, Apple Store, best mall architecture in the city. Check what is on at Zorlu PSM while you are there.", place: "zorlu" },
      { time: "16:00", title: "İstinye Park — the main event", note: "Luxury wing, all the good Turkish brands, and an open-air bazaar section. Do the tax-free forms at the ground-floor desk before you leave.", place: "istinye-park" },
      { time: "19:30", title: "Sunset at Ulus 29", note: "Ten minutes from İstinye Park, hillside terrace looking down the Bosphorus at both bridges.", place: "ulus-29" },
      { time: "21:00", title: "Dinner with the view", note: "Stay at Ulus 29 / Sunset Grill, or drop to Bebek for seafood on the water." }
    ],
    swap: "Tuesday is also Kadıköy Salı Pazarı — one of the largest street markets in the city, clothes and textiles across an enormous covered ground. If you would rather bargain than browse, take that instead and move the malls to Thursday."
  },

  {
    n: 6, date: "2026-09-16", dow: "Wednesday", title: "Where the bazaars actually buy",
    car: { use: false, text: "Absolutely not. Fatih, Tahtakale and the bazaar on the T1 tram from your door." },
    subtitle: "Wholesale, not souvenirs. Plus the biggest weekly market in İstanbul, which only runs today.",
    tags: ["Wednesday only", "Wholesale", "Bring cash"],
    items: [
      { time: "09:00", title: "Fatih Çarşamba Pazarı", note: "WEDNESDAYS. The largest weekly market in the city, spilling through the streets around Fatih Mosque. Vast, cheap, entirely local. A conservative neighbourhood — dress accordingly.", place: "carsamba-pazari" },
      { time: "11:30", title: "Tahtakale", note: "The wholesale engine room behind the Spice Bazaar — coffee, nuts, kitchen equipment, packaging. This is where the bazaar shops buy their stock at a third of the price. Dies after 17:00.", place: "tahtakale" },
      { time: "12:45", title: "Hasırcılar Caddesi", note: "The street beside the Spice Bazaar where locals buy the same spices, cheese and dried fruit without the markup. Skip the bazaar itself unless you want the photograph.", place: "hasircilar" },
      { time: "13:30", title: "Lunch: Sur Ocakbaşı", note: "Ten minutes uphill in Küçükpazar. Southeastern grill, no tourists, absurdly good lamb. Cash.", place: "sur-ocakbasi" },
      { time: "15:00", title: "Cevahir Bedesten", note: "The walled antique core at the centre of the Grand Bazaar, where the dealers themselves buy. Head straight there and ignore the outer lanes.", place: "cevahir-bedesten" },
      { time: "16:30", title: "Nuruosmaniye Caddesi", note: "The elegant street off the bazaar's Nuruosmaniye gate — serious carpet, jewellery and calligraphy dealers in proper shops. Fixed high prices and real expertise.", place: "nuruosmaniye" },
      { time: "18:15", title: "Süleymaniye terrace at sunset", note: "Free, calm, and the best view of the Golden Horn in the city. Ten minutes from the bazaar.", place: "suleymaniye" },
      { time: "20:00", title: "Dinner: Hamdi, Eminönü", note: "Book the TOP-FLOOR terrace explicitly. Then the T1 tram straight home from Eminönü.", place: "hamdi" }
    ],
    swap: "If you want to go deeper on buying: Horhor in Aksaray is six floors of serious antiques with no foreign buyers, and the Zeytinburnu leather district is a direct T1 ride from your hotel."
  },

  {
    n: 7, date: "2026-09-17", dow: "Thursday", title: "The İstanbul that is new since your last trip",
    car: { use: true, text: "Tersane, Arter and Bomontiada are all awkward on public transport and easy by car." },
    subtitle: "Thursday is deliberate — both Arter and the Çinili Hamam museum are free today.",
    tags: ["New & reborn", "Free Thursdays", "Book the hammam"],
    items: [
      { time: "09:30", title: "Zeyrek Çinili Hamam & Museum", note: "A Mimar Sinan bathhouse from the 1540s, reopened 2024 after thirteen years of restoration, sitting on a Byzantine cistern. Museum entry is free on Thursdays. Book a bathing session ahead if you want one.", place: "cinili-hamam" },
      { time: "11:30", title: "Balat & Fener on the way across", note: "Kiremit Caddesi and Merdivenli Yokuş. Late-morning light is the good light.", place: "balat-fener" },
      { time: "13:00", title: "Lunch in Balat", note: "Any of the courtyard cafés on Vodina Caddesi. Unhurried and cheap." },
      { time: "14:30", title: "Tersane İstanbul", note: "The Ottoman Imperial Shipyard reborn as a 242,000 m² waterfront district — Foster + Partners fashion pavilions, museums, a marina, a long promenade. Still opening in phases.", place: "tersane-istanbul" },
      { time: "16:30", title: "Arter", note: "Free on Thursdays. A purpose-built contemporary art museum in Dolapdere with a top-floor terrace, twenty minutes from your hotel and never crowded.", place: "arter" },
      { time: "18:30", title: "Bomontiada", note: "The 1890 brewery turned into a courtyard of galleries, restaurants, the Ara Güler Museum and the Babylon music venue. Check the listings — if something is on, stay for it.", place: "bomontiada" },
      { time: "20:30", title: "Dinner: Mikla, or stay at Bomontiada", note: "Mikla is the splurge — new Anatolian on the best restaurant roof in the city, two seas from one table. Book two to three weeks ahead.", place: "mikla" }
    ],
    swap: "Pack tonight, not tomorrow morning. If you would rather have a quiet last evening: Kılıç Ali Paşa Hamamı is a 1580 Sinan bathhouse seven minutes from the hotel, and your legs will have earned it."
  },

  {
    n: 8, date: "2026-09-18", dow: "Friday", title: "Check out and fly — TK824",
    car: { use: true, text: "Drop at IST by 09:30 for the 12:25 flight — not the 18:30 the booking says." },
    subtitle: "The flight is 12:25, so this is a morning of logistics. Do the shopping the night before.",
    tags: ["Departure", "Tight morning", "TK824"],
    items: [
      { time: "07:00", title: "Breakfast at the hotel", note: "No time for anywhere else. Bags packed and downstairs." },
      { time: "08:15", title: "Check out", note: "Check-out is today. Confirmation 1051754682. Do a drawer-and-safe sweep — passports, chargers, adapters." },
      { time: "08:15", title: "Fuel up, then drive to IST", note: "Return it full or they charge a premium. Allow 75 minutes: Friday morning on the coast road is the worst traffic of the week, and you are driving it at the worst hour. Fill up near the airport, not in town." },
      { time: "09:30", title: "Return the car to Garenta", note: "Your booking runs to 18:30, but the flight is 12:25 — hand it back now. Returning early costs nothing. Get the condition check signed off and keep the receipt; the ₺6,000 deposit releases afterwards." },
      { time: "10:00", title: "At the terminal", note: "Aim to be airside by 10:45. Turkish Airlines check-in, then passport control, which is the slow part at IST." },
      { time: "12:25", title: "TK824 — İstanbul → Beirut", note: "Airbus A321neo, Economy (class U). Flight time 1h 55m. Lands Beirut 14:20. Booking reference WJUTVX." }
    ],
    swap: "Do NOT plan Hagia Sophia or any mosque this morning — they close to visitors around Friday midday prayer, and you will be at the airport anyway. If you want one last thing, Karaköy Güllüoğlu opens at 07:00 and vacuum-packs baklava for the flight; it is twelve minutes from the hotel."
  }
];
