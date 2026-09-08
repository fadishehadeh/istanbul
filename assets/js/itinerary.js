/* Day-by-day plan, routed from Zimmer Bosphorus Hotel (Fındıklı)
   Closures already worked around: Grand Bazaar closed Sun, Topkapı closed Tue,
   Dolmabahçe / İstanbul Modern / Archaeology Museum closed Mon. */

const ITINERARY = [
  {
    n: 1, date: "2026-09-11", dow: "Friday", title: "Land & first sunset",
    subtitle: "Stay local. Don't fight the jetlag — walk the waterfront on your doorstep.",
    tags: ["Easy", "Walkable", "No tickets needed"],
    items: [
      { time: "On arrival", title: "Check in at Zimmer Bosphorus", note: "Meclisi Mebusan Cad. 61, Fındıklı. Ask reception to mark the T1 Fındıklı tram stop and the Kabataş pier on a map for you." },
      { time: "16:00", title: "Get your İstanbulkart", note: "Walk 7 min to Kabataş and buy from the machine. Load 500 TL. One card covers everyone in your group and works on tram, ferry, funicular and bus.", place: null },
      { time: "17:00", title: "Galataport waterfront walk", note: "8 minutes along the sea from your door. 1.2km of promenade, shops and cruise berths.", place: "galataport" },
      { time: "18:15", title: "Galata Tower at golden hour", note: "Book the timed slot in advance. If the queue looks brutal, skip it — the streets below are the real pleasure.", place: "galata-tower" },
      { time: "20:00", title: "Dinner: Karaköy Lokantası", note: "Twelve minutes' walk back down. Reserve before you fly. Order the çökertme kebabı.", place: "karakoy-lokantasi" },
      { time: "22:00", title: "Baklava at Karaköy Güllüoğlu", note: "Open until 23:00. Warm fıstıklı, eaten standing at the counter like a local.", place: "karakoy-gulluoglu" }
    ],
    swap: "Too tired after the flight? Cut everything and just do Galataport → dinner in Karaköy. Day 1 is meant to be soft."
  },

  {
    n: 2, date: "2026-09-12", dow: "Saturday", title: "The Old City, all on one tram",
    subtitle: "Everything today is on the T1 line that stops outside your hotel. No taxis, no changes.",
    tags: ["Big day", "15k steps", "Book ahead"],
    items: [
      { time: "08:00", title: "Breakfast: Van Kahvaltı Evi", note: "Ten minutes uphill into Cihangir. Order the serpme spread. Beat the 10:00 weekend queue.", place: "van-kahvalti" },
      { time: "09:15", title: "T1 tram → Sultanahmet", note: "Board at Fındıklı, ~18 minutes, no changes. Tap your İstanbulkart." },
      { time: "09:45", title: "Hagia Sophia", note: "Visitor gallery entrance is on the north side and it's a separate paid ticket. Get there early — it's a Friday-prayer-free day so mornings are clear.", place: "hagia-sophia" },
      { time: "11:15", title: "Blue Mosque", note: "Free, two minutes across the park. Shoes off, scarves lent at the door. Avoid the prayer windows.", place: "blue-mosque" },
      { time: "12:00", title: "Basilica Cistern", note: "Buy the timed ticket online the night before or you'll lose an hour queuing. 45 minutes inside.", place: "basilica-cistern" },
      { time: "13:15", title: "Lunch: Tarihi Sultanahmet Köftecisi", note: "The original at Divanyolu 12 — not the imitators next door. Köfte, piyaz, irmik helvası.", place: "sultanahmet-koftecisi" },
      { time: "14:30", title: "Grand Bazaar", note: "Two tram stops on to Beyazıt. Open today — it's shut on Sundays. Head for Zincirli Han and the Cevahir Bedesten for the real craftsmanship.", place: "grand-bazaar" },
      { time: "17:00", title: "Walk down Mahmutpaşa to the Spice Bazaar", note: "The chaotic wholesale slope where locals actually shop. Ends at the Spice Bazaar in Eminönü.", place: "spice-bazaar" },
      { time: "18:30", title: "Süleymaniye terrace at sunset", note: "Twelve minutes uphill from Eminönü. Free, calm, and the best view of the Golden Horn in the city.", place: "suleymaniye" },
      { time: "20:00", title: "Dinner: Hamdi, Eminönü", note: "Book the TOP-FLOOR terrace explicitly or they'll seat you downstairs with no view. Then the T1 home from Eminönü.", place: "hamdi" }
    ],
    swap: "Saturday alternative: Feriköy Organic Market runs 08:00–17:00 Saturdays only. If you want it, swap it in for breakfast and push the old city an hour later."
  },

  {
    n: 3, date: "2026-09-13", dow: "Sunday", title: "Bosphorus, top to bottom",
    subtitle: "Your priority day. Waterfront breakfast, a shore walk, a cruise, and the Ortaköy sunset.",
    tags: ["Bosphorus", "Best photos", "Sunday market"],
    items: [
      { time: "09:00", title: "Breakfast on the water: Emirgan Sütiş", note: "25 min taxi up the European shore. Serpme kahvaltı under the Fatih Sultan Mehmet Bridge — a proper Istanbul Sunday.", place: "emirgan-sutis" },
      { time: "10:30", title: "Emirgan Park", note: "Walk it off in the tulip park above the café. Twenty minutes is enough." },
      { time: "11:30", title: "Bebek: coffee and the promenade", note: "Drop back down the shore to Bebek. Petra or Lucca for coffee, then the waterfront.", place: "bebek-sahil" },
      { time: "12:15", title: "Walk Bebek → Rumeli Hisarı", note: "Twenty minutes of yalı mansions along the water, ending at the 1452 fortress at the narrowest point of the strait.", place: "rumeli-hisari" },
      { time: "13:30", title: "Lunch in Bebek or Arnavutköy", note: "Seafood on the water. Arnavutköy's wooden houses are the prettier stop of the two." },
      { time: "15:30", title: "Short Bosphorus cruise", note: "Two hours up to the second bridge and back — all of the view without losing the evening.", place: "short-bosphorus" },
      { time: "17:30", title: "Ortaköy: mosque, market, kumpir", note: "Sunday is when the craft market is fully out. The mosque with the bridge behind it is the shot.", place: "ortakoy" },
      { time: "19:15", title: "Sunset on the Ortaköy waterfront", note: "Stand to the left of the mosque. Then kumpir and a waffle from the alley behind.", place: "ortakoy-kumpir" },
      { time: "21:00", title: "Back to Fındıklı", note: "Fifteen minutes down the shore road by taxi or bus — you're following the water the whole way home." }
    ],
    swap: "The all-in version: the Şehir Hatları full-day cruise leaves Eminönü at ~10:35 and gets back ~17:00, going all the way to the Black Sea mouth for the price of a coffee. Take it instead if you'd rather sit still for six hours than move around."
  },

  {
    n: 4, date: "2026-09-14", dow: "Monday", title: "The Asian side, and it's all about food",
    subtitle: "Ferry across, eat your way through Kadıköy, come back into a sunset. Nothing you need is closed on a Monday.",
    tags: ["Food day", "Ferries", "Local"],
    items: [
      { time: "09:15", title: "Ferry: Kabataş → Kadıköy", note: "Seven minutes' walk to the pier, twenty minutes on the water. Sit outside at the back with a tea.", place: "kabatas-kadikoy" },
      { time: "10:00", title: "Kadıköy market streets", note: "Graze rather than plan: cheese, pickles, olives, dried fruit. Özcan Turşucusu for a shot of pickle juice.", place: "kadikoy-carsi" },
      { time: "10:45", title: "Coffee at Fazıl Bey", note: "Roasting since 1923. Take a vacuum-sealed bag home.", place: "fazil-bey" },
      { time: "11:15", title: "Şekerci Cafer Erol", note: "1807. Buy your lokum and marzipan HERE, not at the Spice Bazaar — better and cheaper.", place: "seker-cafer-erol" },
      { time: "12:30", title: "Lunch: Çiya Sofrası", note: "The most important meal of your trip. Get there before 13:00. Point at everything; you pay by weight.", place: "ciya-sofrasi" },
      { time: "14:15", title: "Baylan Pastanesi", note: "Order the Kup Griye in the garden courtyard. Invented on this spot in the 1950s.", place: "baylan" },
      { time: "15:30", title: "Walk to Moda", note: "Or take the little nostalgic tram loop. Bookshops, record shops and sea air." },
      { time: "17:30", title: "Tea at Tarihi Moda İskelesi", note: "A restored 1917 pier out over the Marmara. Get a rail-side table 45 minutes before sunset.", place: "moda-iskele" },
      { time: "19:30", title: "Ferry back into the sunset", note: "Kadıköy → Kabataş with the old-city skyline lighting up on your left. The best free thing in Istanbul." },
      { time: "20:45", title: "Dinner near home", note: "You'll have eaten all day. Something light in Cihangir or Karaköy, ten minutes from the hotel." }
    ],
    swap: "Rain plan: İstanbul Modern is 8 minutes' walk from the hotel — but it's closed Mondays. Use the Emaar Aquarium in Üsküdar or the Rahmi Koç Museum instead."
  },

  {
    n: 5, date: "2026-09-15", dow: "Tuesday", title: "Shopping, properly",
    subtitle: "Luxury street in the morning, the two best malls in the afternoon. Topkapı is shut today anyway.",
    tags: ["Shopping", "Tax-free", "Splurge dinner"],
    items: [
      { time: "10:00", title: "Nişantaşı on foot", note: "Taxi 12 min. Abdi İpekçi → Teşvikiye → Akkavak Sokak. Flagships on the main street, Turkish designers on the side streets.", place: "nisantasi" },
      { time: "13:00", title: "Lunch in Nişantaşı", note: "Kantin for modern Turkish, or stop at any of the café terraces on Atiye Sokak." },
      { time: "14:30", title: "Zorlu Center", note: "Fifteen minutes away. Luxury wing, Apple Store, and the best mall architecture in the city.", place: "zorlu" },
      { time: "16:00", title: "İstinye Park — the main event", note: "The best mall in Turkey. Luxury wing, all the good Turkish brands, and an open-air bazaar section. Do the tax-free forms at the ground-floor desk before you leave.", place: "istinye-park" },
      { time: "19:30", title: "Sunset drinks at Ulus 29", note: "Ten minutes from İstinye Park, on the hillside looking down the Bosphorus at both bridges.", place: "ulus-29" },
      { time: "21:00", title: "Dinner with the view", note: "Stay at Ulus 29 / Sunset Grill, or drop down to Bebek for seafood on the water." }
    ],
    swap: "Want volume over labels? Swap İstinye Park for Cevahir in Şişli (300 shops, mid-market) or ride the T1 straight from your hotel to Olivium Outlet in Zeytinburnu for genuine outlet pricing."
  },

  {
    n: 6, date: "2026-09-16", dow: "Wednesday", title: "Büyükada — a car-free island day",
    subtitle: "Out early, bicycles, pine forest, wooden mansions, sea. The best day off from a big city.",
    tags: ["Day trip", "Full day", "Book nothing"],
    items: [
      { time: "08:30", title: "Ferry from Kabataş", note: "Seven minutes' walk from the hotel. Roughly 1h20 direct. Take the earliest boat you can face — the island empties out in the evening.", place: "buyukada" },
      { time: "10:00", title: "Rent bicycles at the pier", note: "Or an electric cart if you'd rather not pedal. No cars on the island at all." },
      { time: "10:30", title: "Ride the coastal loop", note: "About an hour of flat waterfront riding past the Victorian mansions. Stop wherever it looks good." },
      { time: "13:00", title: "Lunch by the water", note: "The Nizam and Yörükali sides are quieter and better than the restaurants right at the pier." },
      { time: "15:00", title: "Aya Yorgi hill", note: "The steep climb to the chapel at the top has the best view on the island. Or skip it and swim instead." },
      { time: "17:30", title: "Ferry back", note: "Check the return timetable when you land in the morning — boats thin out after 19:00." },
      { time: "20:30", title: "Dinner: Zübeyir Ocakbaşı", note: "Twelve minutes uphill from the hotel. Sit at the charcoal grill counter, not at a table. Book it.", place: "zubeyir" }
    ],
    swap: "If the sea is rough or you want it shorter: Heybeliada is one stop earlier, smaller and quieter. Or drop the islands entirely and do Belgrad Forest — 40 minutes by taxi, aqueducts and pine trails."
  },

  {
    n: 7, date: "2026-09-17", dow: "Thursday", title: "Palace, colour, and the new Golden Horn",
    subtitle: "Start with the palace 10 minutes from your bed, end at the newest district in Istanbul.",
    tags: ["Photogenic", "New Istanbul", "Hammam"],
    items: [
      { time: "09:15", title: "Dolmabahçe Palace", note: "Ten minutes' walk north along the shore road. Closed Mondays, open today. Go at opening; entry is timed and guided. Allow two hours.", place: "dolmabahce" },
      { time: "11:45", title: "Taxi to Balat & Fener", note: "Twenty minutes around the Golden Horn. Kiremit Caddesi and Merdivenli Yokuş for the rainbow houses and the staircase streets.", place: "balat-fener" },
      { time: "13:00", title: "Lunch in Balat", note: "Any of the courtyard cafés on Vodina Caddesi. Unhurried, cheap, excellent." },
      { time: "14:15", title: "Chora (Kariye) Mosque", note: "Ten minutes uphill. The finest Byzantine mosaics anywhere, and most visitors never make it here.", place: "chora" },
      { time: "16:00", title: "Tersane İstanbul", note: "The Ottoman Imperial Shipyard reborn as a waterfront district — Foster + Partners fashion pavilions, museums, a marina and a long promenade. Still opening in phases.", place: "tersane-istanbul" },
      { time: "18:30", title: "Sunset on the Tersane promenade", note: "The Golden Horn straight in front of you, with the old city on the far bank." },
      { time: "20:00", title: "Dinner: Bardot Bleu or Josephine", note: "Both on the water at Tersane. Or make tonight the splurge and book Mikla's rooftop back in Beyoğlu.", place: "mikla" },
      { time: "22:00", title: "Optional: Kılıç Ali Paşa Hamamı", note: "A 1580 Sinan bathhouse, 7 minutes from the hotel. Book ahead — men and women have separate time blocks. Your legs will need it by now.", place: "kilic-ali-hamam" }
    ],
    swap: "Prefer an evening out to a hammam? Fişekhane in Kazlıçeşme is a restored ammunition factory full of restaurants with theatre, cinema and concerts — check what's on before you commit the night."
  },

  {
    n: 8, date: "2026-09-18", dow: "Friday", title: "Last morning, then the airport",
    subtitle: "Everything today is within ten minutes of the hotel, so you can't be caught out.",
    tags: ["Departure", "Souvenirs", "Keep it simple"],
    items: [
      { time: "08:30", title: "Breakfast: Namlı Gurme", note: "Twelve minutes' walk on the Karaköy waterfront. Fast, big, and right by the shops you still need.", place: "namli-gurme" },
      { time: "09:45", title: "İstanbul Modern", note: "Eight minutes from the hotel at Galataport. The rooftop terrace facing the old city is worth the ticket on its own.", place: "istanbul-modern" },
      { time: "11:00", title: "Final souvenir run", note: "Karaköy Güllüoğlu for vacuum-packed baklava, then the Spice Bazaar (T1, 12 min) for saffron, tea and dried apricots.", place: "karakoy-gulluoglu" },
      { time: "13:00", title: "Check out, leave the bags", note: "The hotel will hold luggage. Note that Hagia Sophia and the mosques close to visitors around Friday midday prayer, so don't plan on those today." },
      { time: "14:00", title: "If your flight is late: Tema World", note: "Free entry, 264,000 m² of rides, shops and food — and it's only 20 minutes from İstanbul Airport, so it's the ideal last stop with bags in the car.", place: "tema-world" },
      { time: "—", title: "Leave for the airport", note: "IST: allow 45–60 min in traffic, and be at the terminal 3.5 hours before an international flight. SAW: allow 60–90 min." }
    ],
    swap: "Flying early? Cut all of it and just do Galataport and Güllüoğlu — both are inside a ten-minute walk of your front door."
  }
];
