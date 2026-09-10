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
      { time: "22:15", title: "TK827 — Beirut → İstanbul", note: "Turkish Airlines, Airbus A350-900, Economy (class U). Flight time 2 hours. Checked baggage 30 kg each, cabin 8 kg. Booking reference is in Guide → Docs." },
      { time: "00:15", title: "Land at İstanbul Airport (IST)", note: "Now Saturday. Passport control can take 30–45 minutes at this hour." },
      { time: "00:45", title: "GET YOUR PASSPORT STAMPED", note: "Do this before you leave the arrivals hall. Garenta will not release the car on a foreign licence without the entry stamp for your most recent arrival, and İstanbul's e-gates frequently do not stamp. Ask the officer directly, or request an official Entry Record. Everything below depends on it." },
      { time: "01:15", title: "Collect the hire car — Garenta", note: "Desk is in the Arrivals Terminal. Bring the credit card in your own name, your licence and ID. They will hold ₺6,000 as a deposit. Check the HGS toll transponder is fitted and ask how they bill crossings. Photograph every existing scratch before you drive off." },
      { time: "01:45", title: "Drive to Dolapdere", note: "About 40 minutes on empty roads — the one hour of the day this drive is easy. Roughly 40 km via the O-7. Not Fındıklı tonight: Zimmer does not take you until Saturday afternoon." },
      { time: "02:15", title: "Check in at İstanbul Dora Hotel", note: "Dolapdere Cad. 33, Şişli. Confirmation and PIN are in Guide → Docs. The hotel has confirmed 24-hour reception and is holding the room until midday Saturday, so arriving at 2am is fine. Parking is the loose end — they have no car park, so know where you are putting the car before you set off. Then sleep — you are up at 07:00, so that is about five hours." }
    ],
    swap: "Change some money at the airport only if you need taxi cash — the rate is poor. 1,500 TL is plenty to get you to the hotel and through breakfast; do the real exchange in Eminönü later in the week."
  },

  {
    n: 2, date: "2026-09-12", dow: "Saturday", title: "Move hotels, then run west",
    car: { use: true, text: "Short drive at midday to change hotels, then keep it — Tema World and Fişekhane are both west and neither is worth doing on public transport." },
    subtitle: "Up at 07:00 on five hours. The Saturday-only market first, İskender for lunch, then the coast road west for two of the places you actually came for.",
    tags: ["Saturday only", "Car", "Your list"],
    items: [
      { time: "07:30", title: "Breakfast at the Dora", note: "Included, and after five hours' sleep you will want it. Check-out is 12:00–12:30, so the morning is yours." },
      { time: "08:15", title: "Ulus Pazarı, Beşiktaş", note: "SATURDAYS ONLY, 08:00–17:00, and fifteen minutes from the Dora. Export garment overruns at market-stall prices alongside the food and household stalls — real labels more often than not. Bring cash and dig. Your only other chance is the 19th, when you are already flying.", place: "ulus-pazari" },
      { time: "11:00", title: "Back to the Dora, pack and check out", note: "Check-out window is 12:00–12:30. Load the car and leave it in Şişli — lunch is five minutes away and you are not going down to Fındıklı yet." },
      { time: "12:00", title: "Lunch: İskender, Şişli", note: "The family that invented the dish in Bursa in 1867, still trading under the name. Döner over cut pide, hot butter poured at the table, tomato and strained yoghurt. Your call — the best you have ever eaten. Confirm today's hours on the listing before you drive over.", place: "iskender-sisli" },
      { time: "13:30", title: "Drive down to Fındıklı", note: "Fifteen minutes to the shore. Drop the bags at Zimmer even if the room is not ready — they hold luggage. Ask at the desk where the car lives for the week." },
      { time: "14:00", title: "Check in at Zimmer", note: "Rooms from 14:00. Unpack, change, and take the car out again — everything after this is west." },
      { time: "15:15", title: "Drive west to Tema World", note: "Küçükçekmece, about 35 minutes on the D100 coast road. Go now rather than later: the rides and the pond are better in daylight and the traffic west is worse after 18:00." },
      { time: "16:00", title: "Tema World, Küçükçekmece", note: "264,000 m² of theme-park rides, an indoor experience centre, a live-performance venue and a 15,000 m² biological pond. Entry and parking are both free, open 10:00–23:00. Give it two hours and do not try to do all of it.", place: "tema-world" },
      { time: "18:30", title: "Drive back east to Fişekhane", note: "Twenty minutes back along the same coast road to Kazlıçeşme. You are heading home, so nothing is backtracked." },
      { time: "19:00", title: "Fişekhane, Kazlıçeşme", note: "A 19th-century Ottoman ammunition factory rebuilt into brick halls of restaurants, galleries, boutiques, theatre and concerts. Check fisekhane.com for what is on tonight — it is a live venue as much as a place to eat.", place: "fisekhane" },
      { time: "19:20", title: "Sunset on the Kazlıçeşme seafront", note: "A footbridge takes you over the road from Fişekhane straight to the Marmara shore. You are facing west here, so the sun goes down over the water rather than behind the city. Sunset is about 19:20 all week.", map: "Kazlıçeşme Sahil Parkı Zeytinburnu" },
      { time: "20:30", title: "Dinner at Fişekhane", note: "Gizia Brasserie and Zennup1844 are the ones people name, but the old halls are full of plainer places too — walk it first and pick by what looks right. Open until midnight." },
      { time: "22:30", title: "Drive home", note: "Twenty minutes back along the shore to Fındıklı, and the road is empty at this hour." }
    ],
    swap: "If five hours of sleep is not enough after all: Yıldız Parkı above Beşiktaş is a hundred hectares of wooded imperial garden with tea on the terrace at Malta Köşkü, twenty minutes from the hotel. Tema World and Fişekhane both keep — Fişekhane runs to midnight every night, and Tema World to 23:00. Ulus Pazarı does not: it is Saturdays only."
  },

  {
    n: 3, date: "2026-09-13", dow: "Sunday", title: "To the Black Sea and back",
    car: { use: true, text: "The whole point of having the car. Nothing today is reachable any other way." },
    subtitle: "Drive the European shore to the very top, where the Bosphorus opens into the Black Sea. Fishing villages and a lighthouse.",
    tags: ["Best day", "Car", "Dry forecast"],
    items: [
      { time: "08:30", title: "Feriköy Antika Pazarı", note: "SUNDAYS ONLY, and the one market that cannot move to another day. Vinyl, cameras, Ottoman ephemera, watches. Before 11:00 or the dealers have picked it over. An hour is enough.", place: "ferikoy-antika" },
      { time: "10:15", title: "Drive north up the shore road", note: "Follow the water the whole way — Bebek, Rumeli Hisarı, Emirgan, Sarıyer. About an hour to the top with stops." },
      { time: "10:45", title: "Sarıyer böreği on the way", note: "Sarıyer is known across the city for one pastry, sold by weight from shops that have made nothing else for generations. Second breakfast, standing up.", map: "Sarıyer Börekçisi Sarıyer İstanbul" },
      { time: "12:00", title: "Garipçe", note: "Thirty houses, a stone harbour and a couple of fish shacks, sitting directly beneath the Yavuz Sultan Selim bridge. Fishermen mending nets and nothing else. After ten visits this is the İstanbul you have not seen.", map: "Garipçe Sarıyer İstanbul" },
      { time: "13:30", title: "Lunch at Rumeli Feneri", note: "Ten minutes on. An 1856 lighthouse, an Ottoman fort in ruins on the headland, and fish restaurants built onto the rocks where the strait becomes open sea. Eat whatever came in this morning.", map: "Rumeli Feneri Sarıyer" },
      { time: "16:00", title: "Beyaz Park, Sarıyer", note: "Back down the shore. A quiet tea garden with tables at the water, local rather than touristic, reasonable prices for a Bosphorus seat. Sit for an hour and watch the tankers come down.", map: "Beyaz Park Sarıyer İstanbul" },
      { time: "17:30", title: "Emirgan Korusu", note: "Forty-seven hectares of woodland climbing from the shore, three restored köşks and a pond. In September it is simply a big quiet wood above the water.", map: "Emirgan Korusu Sarıyer" },
      { time: "18:45", title: "SoTepe, Baltalimanı", note: "A coffee terrace on the hill between Emirgan and Rumeli Hisarı — lawn, string lights, the strait below and the bridge lighting up. Proper coffee, not a view tax.", map: "SoTepe Baltalimanı Sarıyer" },
      { time: "20:30", title: "Home along the water", note: "Thirty minutes down the shore road, with the whole strait lit on your left." },
      { time: "21:15", title: "Late dinner: Lahmacun Plus, Şişli", note: "Up the hill from the shore rather than straight home. Thin lahmacun off the stone and kaşarlı pide, parsley and lemon, eaten with your hands. Yours, and you rated it 10/10. Lahmacun houses run late but check the listing before you drive up.", place: "lahmacun-plus" }
    ],
    swap: "If the flea market does not appeal, leave at 08:00 instead and add Rumeli Kavağı for a second, cheaper fish stop on the way up — plastic chairs on the quay, a fraction of Bebek prices."
  },

  {
    n: 4, date: "2026-09-14", dow: "Monday", title: "The Asian shore, village by village",
    car: { use: true, text: "Over the bridge and down the Asian shore. Everything shut on a Monday is avoided by design." },
    subtitle: "Yoghurt at a pier, two hilltop groves, a sleepy fortress village, and the best sunset in the city.",
    tags: ["Bosphorus", "Gardens", "Sunset"],
    items: [
      { time: "09:30", title: "Drive over to Kanlıca", note: "Thirty-five minutes over the FSM bridge. Note the HGS toll is billed back to you by Garenta." },
      { time: "10:00", title: "Kanlıca yoğurdu at the pier", note: "One dish, sold here for a century: thick strained yoghurt with icing sugar you tip over yourself, eaten standing at the ferry pier. Five minutes, pocket change, and entirely genuine.", map: "Kanlıca İskelesi Beykoz" },
      { time: "10:45", title: "Mihrabat Korusu", note: "On the bluff directly above the village. Pine woods opening onto a cleared terrace over the FSM bridge — widely held to be the best viewpoint on the Asian side. Free on foot, about 100 TL to park.", map: "Mihrabat Korusu Kanlıca Beykoz" },
      { time: "12:15", title: "Hıdiv Kasrı grove", note: "Next door in Çubuklu. An art-nouveau villa built for the Khedive of Egypt in its own wooded park on a bluff, with a garden terrace and one of the widest views on this shore. You can sit outside without going in.", map: "Hıdiv Kasrı Çubuklu Beykoz" },
      { time: "14:00", title: "Lunch at Çengelköy", note: "Down the shore to a village of wooden houses and moored fishing boats, with the white towers of the Kuleli school along the water. Plain fish places at the quay.", map: "Çengelköy Üsküdar" },
      { time: "16:00", title: "Anadolu Hisarı & Göksu", note: "The oldest Ottoman fortress on the strait, where two streams run in — the meadows the Ottomans called the Sweet Waters of Asia. Rowing boats on the creek, tea at the water, genuinely sleepy.", map: "Anadolu Hisarı Göksu Beykoz" },
      { time: "18:00", title: "Beykoz Siloları — the roof", note: "Arrive as the museum inside closes at 18:00; the roof terrace and café stay open until 21:00, which is the whole trick. Restored grain silos facing WEST from the Asian shore, so the sun sets over the water in front of you rather than behind you.", map: "Beykoz Siloları Çubuklu Beykoz" },
      { time: "19:20", title: "Sunset from the silo roof", note: "This is the one people are calling the best sunset in İstanbul right now, and it is new enough not to be crowded." },
      { time: "21:00", title: "Back over the bridge", note: "Forty minutes home. Nothing you wanted today was closed on a Monday — the palaces and museums were, which is why none are here." },
      { time: "22:00", title: "Late supper: Perlo's Burger, Karaköy", note: "Twelve minutes on foot from the hotel along the shore, so the car stays parked. Smashed patties and the truffle burger you rated the best anywhere, not just here. Only if you are still hungry after a day of eating.", place: "perlos-burger" }
    ],
    swap: "Rain plan: everything today is outdoors. If it turns, swap with Thursday — the Golden Horn day is largely indoor."
  },

  {
    n: 5, date: "2026-09-15", dow: "Tuesday", title: "Üsküdar on foot, and the sunset walk",
    car: { use: false, text: "Leave it at the hotel. Ferry across and walk — parking in Üsküdar and Kadıköy is worse than the crossing is long." },
    subtitle: "The ferry, a painted village, a hilltop park, and the best sunset walk in the city — looking west at the old city.",
    tags: ["Ferry", "Walkable", "Sunset walk"],
    items: [
      { time: "09:30", title: "Ferry Kabataş → Üsküdar", note: "Seven minutes to the pier, fifteen on the water past the Maiden's Tower. Tap the İstanbulkart, sit outside at the back.", place: "kabatas-uskudar" },
      { time: "10:15", title: "Kuzguncuk", note: "A former Jewish, Greek and Armenian village swallowed by the city but still intact — one street of painted wooden houses, a synagogue, a church and a mosque within a few hundred metres, and a market garden behind. Quieter and more lived-in than Balat.", map: "Kuzguncuk Üsküdar" },
      { time: "11:30", title: "Kaftan Sokak", note: "A painted stepped street dropping toward the water, every wall and stair tread in blocks of colour. Ten minutes, not an outing.", map: "Kaftan Sokak Sultantepe Üsküdar" },
      { time: "12:15", title: "Nakkaştepe Millet Parkı", note: "Up the hill above Kuzguncuk — a hilltop park on a former quarry with wide lawns and the strait laid out below. Open 24 hours, free, and big enough that it never feels full.", map: "Nakkaştepe Millet Bahçesi Kuzguncuk Üsküdar" },
      { time: "14:00", title: "Lunch at Çengelköy or back in Üsküdar", note: "Plain places at the water. Nothing that needs booking." },
      { time: "15:30", title: "Fethipaşa Korusu", note: "A 19th-century Ottoman grove on the hill above Üsküdar, terraced down toward the water with a restored köşk. Open 08:30–23:00, free to enter, and the closest of the Asian groves to the ferry.", map: "Fethi Paşa Korusu Üsküdar" },
      { time: "17:45", title: "Üsküdar Sahili — walk south to Salacak", note: "The best sunset walk in İstanbul and it costs nothing. The Maiden's Tower offshore, and the entire old-city skyline — Topkapı, Hagia Sophia, the Blue Mosque — directly across the water in front of you. Carpet-and-cushion tea gardens along the rail.", map: "Üsküdar Sahili Salacak" },
      { time: "19:20", title: "Sunset over the old city", note: "You are facing west from the Asian shore, so the sun goes down behind the minarets. Sit on a cushion with a tea and let it happen." },
      { time: "21:00", title: "Ferry home", note: "Üsküdar back to Kabataş with the city lit on both sides. Check the last boat when you land in the morning." },
      { time: "21:30", title: "Hür Süper Mario, Karaköy", note: "Fifteen minutes on foot from the pier. Plastic chairs at the water by Arap Camii, mackerel straight off the grill, the old city across the Horn. Widely argued to be the best fish sandwich in İstanbul and it costs almost nothing.", map: "Hür Süper Mario Emin Usta Fermeneciler Caddesi Karaköy" }
    ],
    swap: "Beylerbeyi Palace and Küçüksu Kasrı are both open today and both are on this shore — add either if you want one building. Küçüksu is the smaller and stranger of the two."
  },

  {
    n: 6, date: "2026-09-16", dow: "Wednesday", title: "The old city nobody photographs",
    car: { use: false, text: "Absolutely not. Fatih and the bazaar quarter by car is a bad afternoon. T1 tram from outside the hotel." },
    subtitle: "The biggest weekly market in the city, a Byzantine church almost nobody enters, and the wholesale streets behind the bazaar.",
    tags: ["Wednesday only", "Unusual", "Bring cash"],
    items: [
      { time: "09:00", title: "Fatih Çarşamba Pazarı", note: "WEDNESDAYS. The largest weekly market in İstanbul, spilling through the streets around Fatih Mosque. Vast, cheap, entirely local, and nothing about it is staged for visitors. A conservative quarter — dress accordingly.", place: "carsamba-pazari" },
      { time: "11:30", title: "Zeyrek Mosque (Pantokrator)", note: "The vast Byzantine monastery church of the Pantokrator, recently restored and usually empty. One of the most important buildings in the city and you will likely have it to yourself.", map: "Zeyrek Camii Molla Zeyrek Fatih" },
      { time: "12:30", title: "Lunch: Sur Ocakbaşı", note: "Ten minutes downhill in Küçükpazar. Southeastern grill in a working quarter, no tourists, absurdly good lamb. Cash, no alcohol, no fuss.", place: "sur-ocakbasi" },
      { time: "14:00", title: "Tahtakale", note: "The wholesale engine room behind the Spice Bazaar — coffee, nuts, kitchen equipment, packaging. This is where the bazaar shops buy their stock. Dies after 17:00.", place: "tahtakale" },
      { time: "15:30", title: "Hasırcılar Caddesi", note: "The street beside the Spice Bazaar where locals buy the same spices, cheese and dried fruit without the markup. Skip the bazaar itself unless you want the photograph.", place: "hasircilar" },
      { time: "16:30", title: "Büyük Valide Han rooftop", note: "A crumbling 1651 caravanserai where a man on the roof charges a few lira for the most photogenic rooftop in the old city. Ask for 'çatı' at the entrance. Not for anyone nervous about stairs.", place: "buyuk-valide-han" },
      { time: "18:15", title: "Süleymaniye terrace at sunset", note: "Twelve minutes uphill. Sinan's masterpiece, free, calm, and the terrace behind it has the best view of the Golden Horn in the city. Go for the terrace even if you skip the interior.", place: "suleymaniye" },
      { time: "19:45", title: "Balık ekmek at Eminönü", note: "Downhill to the quay. Grilled mackerel in half a loaf, handed over from boats rocking at the rail beside the Galata Bridge. Squeeze the lemon, eat standing. The cheapest famous meal in İstanbul.", map: "Eminönü balık ekmek Galata Köprüsü" },
      { time: "20:45", title: "T1 home", note: "Eminönü straight back to Fındıklı, no changes." }
    ],
    swap: "Want the truly obscure version? Yedikule Bostanları — market gardens still farmed inside the 5th-century land walls, continuously for around 1,500 years. Direct on the T1 to Zeytinburnu, then a short walk, and virtually no visitors."
  },

  {
    n: 7, date: "2026-09-17", dow: "Thursday", title: "The Golden Horn, end to end",
    car: { use: true, text: "Useful today — the Horn strings together in one drive and the stops are spread out." },
    subtitle: "A restored hammam, the colour streets, an industrial museum, and a cable car to tea above the whole Golden Horn.",
    tags: ["Free Thursday", "Rain-proof", "Last full day"],
    items: [
      { time: "09:30", title: "Zeyrek Çinili Hamam museum", note: "A Mimar Sinan bathhouse from the 1540s, reopened in 2024 after thirteen years of restoration, sitting on a Byzantine cistern. The museum is FREE on Thursdays, which is why today.", place: "cinili-hamam" },
      { time: "11:00", title: "Balat & Fener", note: "Kiremit Caddesi and Merdivenli Yokuş for the painted houses and staircase streets. Late-morning light is the good light.", place: "balat-fener" },
      { time: "13:00", title: "Lunch in Balat", note: "Courtyard cafés on Vodina Caddesi. Unhurried and cheap." },
      { time: "14:30", title: "DDM — Dijital Deneyim Merkezi, Sütlüce", note: "The city's 2,000 m² digital museum: rooms of immersive projection and interactive work. Open 10:00–18:00, closed Mondays. NO CASH — card or İstanbulkart only. Indoors, so it is your rain cover if the 47% forecast lands.", map: "Dijital Deneyim Merkezi Sütlüce İstanbul" },
      { time: "16:00", title: "santralistanbul", note: "A 1914 power station on the Horn turned into an energy museum — turbine halls, control rooms and switchgear you walk straight through. Industrial, strange, and almost empty.", map: "santralistanbul Eyüpsultan" },
      { time: "17:30", title: "Eyüp teleferik up to Pierre Loti", note: "A cable car over a hillside Ottoman cemetery to a tea terrace above the entire Golden Horn. Pay with the İstanbulkart. The ride is half the point.", place: "eyup-teleferik" },
      { time: "18:15", title: "Tea at Pierre Loti", note: "Sit on the terrace with the Horn below you and the old city stretching away. Last proper view of the trip.", place: "pierre-loti" },
      { time: "19:45", title: "Tersane İstanbul (Haliç Port)", note: "Back down the Horn toward home and it is directly on the way. The Ottoman Imperial Shipyard rebuilt as a 242,000 m² waterfront district — a Foster + Partners open-air avenue, a marina, museums and a long lit promenade along the water. Still opening in phases, so expect some hoardings.", place: "tersane-istanbul" },
      { time: "20:15", title: "Dinner: Prado's Pasta, Karaköy", note: "Five minutes round the water from Tersane. Fresh pasta finished in a parmesan wheel, and the tagliatelle with meat ragù. It CLOSES AT 21:00, so this is the one stop all week you cannot drift on — call +90 539 317 63 85 on the way. Only a few tables. If you are running late, Tersane's own waterfront places run to midnight.", place: "prados-pasta" },
      { time: "22:15", title: "Pack tonight", note: "Fifteen minutes home around the Horn. Check-out is 08:15 and the drive to IST is the worst traffic of the week — do not leave the packing to the morning." }
    ],
    swap: "If it rains hard: skip the teleferik and Pierre Loti, and give the time to Tersane instead — the avenue and the halls are covered, and it is the one stop today that works wet."
  },

  {
    n: 8, date: "2026-09-18", dow: "Friday", title: "Check out and fly — TK824",
    car: { use: true, text: "Drop at IST by 09:30 for the 12:25 flight — not the 18:30 the booking says." },
    subtitle: "The flight is 12:25, so this is a morning of logistics. Do the shopping the night before.",
    tags: ["Departure", "Tight morning", "TK824"],
    items: [
      { time: "07:00", title: "Breakfast at the hotel", note: "No time for anywhere else. Bags packed and downstairs." },
      { time: "08:15", title: "Check out", note: "Check-out is today. Do a drawer-and-safe sweep — passports, chargers, adapters." },
      { time: "08:15", title: "Fuel up, then drive to IST", note: "Return it full or they charge a premium. Allow 75 minutes: Friday morning on the coast road is the worst traffic of the week, and you are driving it at the worst hour. Fill up near the airport, not in town." },
      { time: "09:30", title: "Return the car to Garenta", note: "Your booking runs to 18:30, but the flight is 12:25 — hand it back now. Returning early costs nothing. Get the condition check signed off and keep the receipt; the ₺6,000 deposit releases afterwards." },
      { time: "10:00", title: "At the terminal", note: "Aim to be airside by 10:45. Turkish Airlines check-in, then passport control, which is the slow part at IST." },
      { time: "12:25", title: "TK824 — İstanbul → Beirut", note: "Airbus A321neo, Economy (class U). Flight time 1h 55m. Lands Beirut 14:20." }
    ],
    swap: "Do NOT plan Hagia Sophia or any mosque this morning — they close to visitors around Friday midday prayer, and you will be at the airport anyway. If you want one last thing, Karaköy Güllüoğlu opens at 07:00 and vacuum-packs baklava for the flight; it is twelve minutes from the hotel."
  }
];
