/* Istanbul Trip Companion — trip + places dataset
   Base: Zimmer Bosphorus Hotel, Meclisi Mebusan Cad. 61, Fındıklı, Beyoğlu 34427
   Trip: Friday 11 Sep 2026 -> Friday 18 Sep 2026 */

const TRIP = {
  title: "Istanbul",
  start: "2026-09-11",
  end: "2026-09-18",
  hotel: {
    name: "Zimmer Bosphorus Hotel",
    address: "Meclisi Mebusan Cad. No 61, Fındıklı, Beyoğlu 34427, İstanbul",
    map: "Zimmer Bosphorus Hotel Meclisi Mebusan Caddesi Fındıklı",
    notes: [
      "T1 tram — the Fındıklı stop is directly in front of the hotel. Direct, no changes, to Tophane, Karaköy, Eminönü, Sirkeci, Gülhane, Sultanahmet and Beyazıt (Grand Bazaar).",
      "Kabataş pier — 7 min walk. Ferries to Kadıköy, Üsküdar and the Princes' Islands, plus the F1 funicular up to Taksim in 90 seconds.",
      "Galataport & İstanbul Modern — 8 min walk along the water.",
      "Dolmabahçe Palace — 10 min walk north along the shore road.",
      "Cihangir cafés — 10 min walk uphill behind the hotel.",
      "Taksim Square — 12 min walk uphill, or 3 min via the Kabataş funicular."
    ]
  }
};

const CATEGORIES = [
  { id: "eat",       label: "Restaurants",        icon: "🍽️", blurb: "Kebab houses, meyhanes, seafood, breakfast" },
  { id: "cafe",      label: "Cafés & Sweets",     icon: "☕",  blurb: "Coffee, baklava, künefe, tea gardens" },
  { id: "district",  label: "New & Reborn",       icon: "🏗️", blurb: "Recently opened lifestyle, culture and entertainment complexes" },
  { id: "mall",      label: "Malls & Shopping",   icon: "🛍️", blurb: "Every mall worth the trip, both sides, plus the outlets" },
  { id: "bazaar",    label: "Bazaars & Markets",  icon: "🧿", blurb: "Wholesale districts, antiques, and the weekly street markets" },
  { id: "sight",     label: "Landmarks",          icon: "🕌", blurb: "Mosques, palaces, museums, historic sites" },
  { id: "view",      label: "Views & Rooftops",   icon: "🌇", blurb: "The shots you actually want" },
  { id: "bosphorus", label: "Bosphorus & Ferries",icon: "⛴️", blurb: "Cruises, piers, waterfront villages" },
  { id: "night",     label: "Evenings",           icon: "🌙", blurb: "Shows, night cruises, bars, late food" },
  { id: "trip",      label: "Day Trips",          icon: "🧭", blurb: "Islands, forests, escapes out of the city" }
];

/* price: 0 = free, 1 = cheap, 2 = mid, 3 = splurge
   alcohol: true where the venue serves alcohol (flagged, not judged)
   from:  how to get there from the hotel in Fındıklı */
const PLACES = [

  /* ============ RESTAURANTS ============ */
  { id:"karakoy-lokantasi", cat:"eat", name:"Karaköy Lokantası", area:"Karaköy", price:2, alcohol:true,
    from:"12 min walk along the shore, or 1 tram stop to Tophane",
    why:"Turquoise-tiled dining room and the most reliable 'classic Istanbul' meal in the city. Meze at lunch, full ocakbaşı at night.",
    tip:"Dinner needs a reservation, lunch usually doesn't. Order the çökertme kebabı.", hours:"12:00–24:00" },

  { id:"ciya-sofrasi", cat:"eat", name:"Çiya Sofrası", area:"Kadıköy (Asian side)", price:1,
    from:"Ferry Kabataş → Kadıköy (20 min), then 5 min walk",
    why:"The single most important restaurant in Istanbul. Regional Anatolian dishes that exist nowhere else, and the menu rotates daily.",
    tip:"Point-at-what-you-want counter, priced by weight. Take a bit of everything. Arrive before 13:00.", hours:"11:00–22:00" },

  { id:"hamdi", cat:"eat", name:"Hamdi Restaurant", area:"Eminönü", price:2, alcohol:true,
    from:"T1 tram to Eminönü (~12 min), then 3 min walk",
    why:"Southeastern kebab done properly, on a terrace looking straight at the Golden Horn, Galata Tower and the Süleymaniye.",
    tip:"Ask for the top-floor terrace when you book or they'll seat you downstairs with no view. Get the fıstıklı kebab.", hours:"11:30–23:00" },

  { id:"zubeyir", cat:"eat", name:"Zübeyir Ocakbaşı", area:"Beyoğlu / Taksim", price:2, alcohol:true,
    from:"12 min walk uphill, or funicular to Taksim + 5 min",
    why:"Open charcoal grill in the middle of the room — you watch your meat cook. The local benchmark for ocakbaşı.",
    tip:"Sit at the grill counter, not the tables. Book ahead; it is small and always full.", hours:"12:00–24:00" },

  { id:"sehzade-cag", cat:"eat", name:"Şehzade Cağ Kebabı", area:"Sirkeci", price:1,
    from:"T1 tram to Sirkeci (~14 min), then 4 min walk",
    why:"Erzurum-style lamb roasted horizontally over wood, sliced onto a skewer at your table. Tiny, cheap, unforgettable.",
    tip:"Order by the skewer (şiş) — three each is normal. No alcohol, no fuss.", hours:"11:00–22:00" },

  { id:"durumzade", cat:"eat", name:"Dürümzade", area:"Beyoğlu, off İstiklal", price:1,
    from:"15 min walk uphill via Cihangir",
    why:"A hole in the wall doing the best dürüm in Beyoğlu — the bread is buttered and grilled before wrapping.",
    tip:"Adana dürüm, extra spicy. Standing room only at peak, and it stays open very late.", hours:"11:00–03:00" },

  { id:"antiochia", cat:"eat", name:"Antiochia", area:"Asmalımescit, Beyoğlu", price:2, alcohol:true,
    from:"15 min walk uphill",
    why:"Hatay/Antakya cooking, the most distinctive regional food in Turkey — muhammara, humus with pine nuts, dry-aged tuzlu kebab.",
    tip:"Go meze-heavy and share one kebab. Small room, so book it.", hours:"12:00–23:30" },

  { id:"balikci-sabahattin", cat:"eat", name:"Balıkçı Sabahattin", area:"Sultanahmet", price:3, alcohol:true,
    from:"T1 tram to Sultanahmet (~18 min), then 5 min walk",
    why:"Seafood in a 1920s wooden house under the plane trees. The old-city meal that is worth spending on.",
    tip:"No printed menu — they bring the fish tray and you pick. Confirm the price when you choose.", hours:"12:00–24:00" },

  { id:"van-kahvalti", cat:"eat", name:"Van Kahvaltı Evi", area:"Cihangir", price:1,
    from:"10 min walk uphill behind the hotel",
    why:"The Turkish breakfast benchmark — eastern-style, with otlu peynir, kaymak and honey, murtuğa, and endless bread.",
    tip:"Before 10:00 at the weekend or you will queue. Order the serpme (full spread) for two.", hours:"07:30–16:00" },

  { id:"namli-gurme", cat:"eat", name:"Namlı Gurme", area:"Karaköy", price:2,
    from:"12 min walk, or 1 tram stop",
    why:"Deli-counter breakfast on the waterfront: forty cheeses, cured meats, olives, pastırma with eggs.",
    tip:"Ideal for a fast, big breakfast before a Bosphorus ferry from Karaköy.", hours:"07:00–21:00" },

  { id:"ficcin", cat:"eat", name:"Fıccın", area:"Beyoğlu (Kallavi Sokak)", price:1, alcohol:true,
    from:"15 min walk uphill",
    why:"Circassian home cooking — çerkez tavuğu, and the fıccın meat pie the place is named after. Half a street of small dining rooms.",
    tip:"Cheap, fast and consistently good when İstiklal has worn you down.", hours:"09:00–23:00" },

  { id:"sur-ocakbasi", cat:"eat", name:"Sur Ocakbaşı", area:"Fatih (Küçükpazar)", price:1,
    from:"T1 to Eminönü + 10 min walk uphill",
    why:"Southeastern grill in a working quarter — no tourists, and absurdly good lamb and beyti.",
    tip:"Cash. No alcohol. Go at lunch and pair it with the Süleymaniye above it.", hours:"11:00–23:00" },

  { id:"kadi-nimet", cat:"eat", name:"Kadı Nimet Balıkçılık", area:"Kadıköy fish market", price:2, alcohol:true,
    from:"Ferry Kabataş → Kadıköy, then 6 min walk",
    why:"Fishmonger downstairs, restaurant upstairs. The freshest seafood in the city for the money.",
    tip:"Grilled levrek or çupra, plus the deniz börülcesi (samphire) meze.", hours:"11:00–23:00" },

  { id:"mikla", cat:"eat", name:"Mikla", area:"Beyoğlu (Marmara Pera rooftop)", price:3, alcohol:true,
    from:"18 min walk uphill, or a 10 min taxi",
    why:"New Anatolian tasting menu on the best restaurant roof in Istanbul — two seas and two continents from one table.",
    tip:"The splurge night. Book 2–3 weeks ahead. The terrace bar upstairs takes non-diners for a drink and the view.", hours:"18:00–24:00" },

  { id:"neolokal", cat:"eat", name:"Neolokal", area:"Karaköy (SALT Galata)", price:3, alcohol:true,
    from:"14 min walk",
    why:"Anatolian recipes rebuilt as fine dining, in a landmark Ottoman bank building facing the old-city skyline.",
    tip:"Ask for a window table at sunset. Tasting menu or à la carte both work.", hours:"12:00–23:00" },

  { id:"sultanahmet-koftecisi", cat:"eat", name:"Tarihi Sultanahmet Köftecisi", area:"Sultanahmet", price:1,
    from:"T1 tram to Sultanahmet, right at the stop",
    why:"Since 1920, and they still only really do one thing: grilled meatballs, bean salad, semolina halva.",
    tip:"Copycats with near-identical names line the same street. The original is Divanyolu Cad. No 12.", hours:"10:30–23:00" },

  { id:"pandeli", cat:"eat", name:"Pandeli", area:"Above the Spice Bazaar, Eminönü", price:2, alcohol:true,
    from:"T1 to Eminönü (~12 min)",
    why:"1901, turquoise-tiled rooms over the Spice Bazaar gate. Sea bass baked in paper, aubergine börek.",
    tip:"Lunch only in practice. Pair it with the Spice Bazaar on the same trip.", hours:"12:00–16:00" },

  { id:"ortakoy-kumpir", cat:"eat", name:"Ortaköy Kumpir & Waffle Street", area:"Ortaköy", price:1,
    from:"Bus or taxi 15 min along the shore",
    why:"A whole alley of loaded baked potatoes and dessert waffles behind the Ortaköy mosque. Pure street-food fun.",
    tip:"Point at what you want in the topping tray, then eat it on the waterfront with the bridge behind you.", hours:"10:00–02:00" },

  { id:"kizilkayalar", cat:"eat", name:"Kızılkayalar (ıslak burger)", area:"Taksim Square", price:1,
    from:"Funicular from Kabataş, 3 min",
    why:"The 'wet burger' steaming in its glass box, garlicky tomato sauce soaked into the bun. A 2am Istanbul rite.",
    tip:"Costs pocket change. Eat two. Do not overthink it.", hours:"24 hours" },

  { id:"develi", cat:"eat", name:"Develi Kebap", area:"Etiler / Samatya", price:2, alcohol:true,
    from:"Taxi 20 min to the Etiler branch",
    why:"Gaziantep kebab dynasty since 1912 — the pistachio kebab and the künefe are the reference versions.",
    tip:"Etiler has the terrace; Samatya is the original and more atmospheric.", hours:"12:00–23:30" },

  { id:"nusret", cat:"eat", name:"Nusr-Et Steakhouse", area:"Etiler / Nişantaşı", price:3, alcohol:true,
    from:"Taxi 20 min",
    why:"Yes, that one. Genuinely good meat, theatrical service, and prices to match the meme.",
    tip:"Go at lunch for the same experience at a fraction of the dinner bill.", hours:"12:00–24:00" },

  { id:"asmali-cavit", cat:"eat", name:"Asmalı Cavit", area:"Asmalımescit, Beyoğlu", price:2, alcohol:true,
    from:"15 min walk uphill",
    why:"The archetypal meyhane — paper tablecloths, a meze trolley, rakı, and no concessions to tourism.",
    tip:"A drinking-and-meze house, so skip it if you would rather not be around alcohol. Book for 20:00.", hours:"12:00–24:00" },

  /* ============ CAFÉS & SWEETS ============ */
  { id:"karakoy-gulluoglu", cat:"cafe", name:"Karaköy Güllüoğlu", area:"Karaköy", price:1,
    from:"12 min walk along the water",
    why:"The baklava benchmark since 1949. Buy by weight at the counter and eat standing up with a tea.",
    tip:"Ask for fıstıklı (pistachio) warm, plus a portion of kaymaklı. Vacuum-packed boxes travel home fine.", hours:"07:00–23:00" },

  { id:"hafiz-mustafa", cat:"cafe", name:"Hafız Mustafa 1864", area:"Eminönü / Sirkeci / Taksim", price:1,
    from:"T1 tram, or the Taksim branch a short walk uphill",
    why:"Turkish delight, künefe, şöbiyet and a proper sahlep — plus beautiful boxes for taking home.",
    tip:"The Hamidiye (Sirkeci) branch has the best upstairs seating. Try the fırın sütlaç.", hours:"08:00–01:00" },

  { id:"mandabatmaz", cat:"cafe", name:"Mandabatmaz", area:"Off İstiklal, Beyoğlu", price:1,
    from:"15 min walk uphill",
    why:"A four-table cubbyhole serving what is widely called the thickest, best Turkish coffee in the city.",
    tip:"Order it orta (medium sweet). It comes with a lokum. Total stop time: ten minutes.", hours:"09:00–23:00" },

  { id:"kronotrop", cat:"cafe", name:"Kronotrop", area:"Cihangir", price:2,
    from:"10 min walk uphill behind the hotel",
    why:"The roaster that started Istanbul's third-wave coffee scene. Your neighbourhood café for this trip.",
    tip:"The closest genuinely good espresso to the hotel, and a good spot to sit for an hour.", hours:"08:00–21:00" },

  { id:"norm-coffee", cat:"cafe", name:"Norm Coffee", area:"Karaköy", price:2,
    from:"12 min walk",
    why:"Small, serious and filter-forward — the best coffee between the hotel and Galata.",
    tip:"Grab a cup before walking up to Galata Tower. You will want it for the hill.", hours:"08:00–19:00" },

  { id:"set-ustu", cat:"cafe", name:"Set Üstü Çay Bahçesi", area:"Gülhane Park", price:1,
    from:"T1 tram to Gülhane (~16 min), then 8 min through the park",
    why:"Tea garden on the point of the old city, with the Bosphorus mouth, Üsküdar and the Asian shore all at once. Locals only.",
    tip:"Order çay, stay an hour. The cheapest world-class view in Istanbul.", hours:"08:00–23:00" },

  { id:"pierre-loti", cat:"cafe", name:"Pierre Loti Café", area:"Eyüpsultan", price:1,
    from:"Ferry or taxi to Eyüp, then the cable car up the hill",
    why:"Hilltop tea terrace over the whole Golden Horn. The cable-car ride over the cemetery is half the point.",
    tip:"Late afternoon, combined with Eyüp Sultan Mosque at the bottom.", hours:"08:00–23:00" },

  { id:"baylan", cat:"cafe", name:"Baylan Pastanesi", area:"Kadıköy", price:1,
    from:"Ferry Kabataş → Kadıköy, then 6 min walk",
    why:"A 1923 patisserie with a garden courtyard. Order the Kup Griye — caramel, croquant, cream — which was invented here.",
    tip:"The perfect mid-afternoon stop on the Kadıköy food walk.", hours:"08:00–23:00" },

  { id:"seker-cafer-erol", cat:"cafe", name:"Şekerci Cafer Erol", area:"Kadıköy", price:1,
    from:"Ferry to Kadıköy, then 5 min walk",
    why:"1807. Hand-made lokum, marzipan fruit and boiled sweets in an old-world shop — the best edible souvenirs in Istanbul.",
    tip:"Buy your lokum box here rather than at the Spice Bazaar: better quality, better price.", hours:"08:00–21:00" },

  { id:"fazil-bey", cat:"cafe", name:"Fazıl Bey Türk Kahvesi", area:"Kadıköy", price:1,
    from:"Ferry to Kadıköy, then 4 min walk",
    why:"Roasting their own since 1923 — menengiç and cardamom coffee alongside the classic.",
    tip:"Take a bag of ground coffee home; they vacuum-seal it at the counter.", hours:"07:00–23:00" },

  { id:"emirgan-sutis", cat:"cafe", name:"Emirgan Sütiş", area:"Emirgan (Bosphorus)", price:2,
    from:"Taxi or bus 25 min up the European shore",
    why:"Breakfast and milk puddings right on the water, under the Fatih Sultan Mehmet Bridge.",
    tip:"A serpme kahvaltı here on a Bosphorus morning is a classic Istanbul weekend move. Pair with Emirgan Park.", hours:"07:00–24:00" },

  { id:"bebek-sahil", cat:"cafe", name:"Bebek waterfront cafés", area:"Bebek", price:2,
    from:"Bus or taxi 20 min along the shore",
    why:"Istanbul's most desirable stretch of promenade — Petra, Lucca, Mangerie, and the Bebek Starbucks everyone photographs.",
    tip:"Walk Bebek → Rumeli Hisarı along the water (20 min) for the best casual Bosphorus stroll in the city.", hours:"08:00–24:00" },

  { id:"moda-iskele", cat:"cafe", name:"Tarihi Moda İskelesi", area:"Moda, Kadıköy", price:1,
    from:"Ferry to Kadıköy, then 15 min walk or the nostalgic tram",
    why:"Tea on a restored 1917 ferry pier sticking out into the Marmara. The best sunset on the Asian side.",
    tip:"Arrive about 45 minutes before sunset for a rail-side table.", hours:"08:00–23:00" },

  /* ============ MALLS & SHOPPING ============ */
  { id:"istinye-park", cat:"mall", name:"İstinye Park", area:"Sarıyer", price:3,
    from:"Taxi 25–30 min, or M2 metro plus a short taxi",
    why:"The best mall in Turkey — a full luxury wing, all the good Turkish brands (Vakko, Beymen, Machka), an open-air 'bazaar' section and a serious food floor.",
    tip:"If you only do one mall, do this one. Weekday afternoons are calm. Tax-free forms at the ground-floor desk.", hours:"10:00–22:00" },

  { id:"zorlu", cat:"mall", name:"Zorlu Center", area:"Zincirlikuyu / Beşiktaş", price:3,
    from:"M2 metro to Gayrettepe/Zincirlikuyu, about 20 min door to door",
    why:"Luxury, architecture, and the city's main performing-arts centre. Apple Store, Louis Vuitton, and a strong restaurant terrace.",
    tip:"The closest premium mall to the hotel. Check what is on at Zorlu PSM for the evening you go.", hours:"10:00–22:00" },

  { id:"kanyon", cat:"mall", name:"Kanyon", area:"Levent", price:2,
    from:"M2 metro to Levent (~25 min), exit straight into the mall",
    why:"An open-air curved canyon of shops — the nicest mall simply to walk around. Mid-to-high street brands.",
    tip:"Pairs with Metrocity across the road if you want volume. Good cinema.", hours:"10:00–22:00" },

  { id:"cevahir", cat:"mall", name:"İstanbul Cevahir", area:"Şişli", price:2,
    from:"M2 metro to Şişli-Mecidiyeköy (~15 min)",
    why:"One of Europe's largest malls: six floors, 300+ shops, mid-market pricing, enormous food court.",
    tip:"Best value-for-money shopping close to the centre. Very busy at weekends.", hours:"10:00–22:00" },

  { id:"mall-of-istanbul", cat:"mall", name:"Mall of İstanbul", area:"Başakşehir", price:2,
    from:"M3 metro or a 45 min taxi — it is genuinely far out",
    why:"Enormous, with a theme-park-scale entertainment floor and every high-street brand at local prices.",
    tip:"Only worth a half-day if you are serious about volume. Otherwise İstinye Park or Cevahir.", hours:"10:00–22:00" },

  { id:"emaar-square", cat:"mall", name:"Emaar Square Mall", area:"Üsküdar (Asian side)", price:3,
    from:"Ferry Kabataş → Üsküdar plus a 10 min taxi, or the M5 metro",
    why:"Marble, luxury brands, and the Emaar Aquarium & Underwater Zoo attached.",
    tip:"Pairs well with an Asian-side day: Üsküdar shore in the morning, mall in the afternoon.", hours:"10:00–22:00" },

  { id:"akasya", cat:"mall", name:"Akasya AVM", area:"Acıbadem, Asian side", price:2,
    from:"Ferry to Kadıköy then M4 metro, about 35 min",
    why:"Where Istanbul's Asian-side middle class actually shops — great food court, rooftop terrace with a Bosphorus view.",
    tip:"Less touristy, less crowded, the same brands.", hours:"10:00–22:00" },

  { id:"nisantasi", cat:"mall", name:"Nişantaşı (Abdi İpekçi Cad.)", area:"Nişantaşı", price:3,
    from:"Taxi 12 min, or M2 metro to Osmanbey plus a 5 min walk",
    why:"Istanbul's luxury street rather than a mall — flagship stores, designer boutiques, and the city's best café-watching.",
    tip:"Do it on foot: Abdi İpekçi → Teşvikiye → Akkavak Sokak for local designers. Lunch at Kantin.", hours:"10:00–20:00" },

  { id:"galataport", cat:"district", isNew:true, name:"Galataport İstanbul", area:"Karaköy waterfront", price:2,
    from:"8 min walk — the closest shopping to you",
    why:"A new 1.2km waterfront promenade of shops and restaurants with İstanbul Modern built into it, and cruise ships docking underground.",
    tip:"Your default evening walk: sunset here, then dinner in Karaköy.", hours:"10:00–24:00" },

  { id:"istiklal", cat:"mall", name:"İstiklal Caddesi", area:"Beyoğlu", price:2,
    from:"12 min walk uphill, or funicular to Taksim then walk down",
    why:"The 1.4km pedestrian spine of modern Istanbul — high-street shops, the red nostalgic tram, arcades, and side streets worth more than the main drag.",
    tip:"The value is in the passages: Çiçek Pasajı, Hazzopulo, Atlas. Walk it downhill from Taksim to Tünel, not up.", hours:"Always open" },

  { id:"olivium", cat:"mall", name:"Olivium Outlet Center", area:"Zeytinburnu", price:1,
    from:"T1 tram direct from Fındıklı to Zeytinburnu (~35 min)",
    why:"Genuine outlet pricing on Turkish and international brands, on the same tram line as your hotel.",
    tip:"The best-value clothes shopping in the city if you are happy with last season.", hours:"10:00–22:00" },

  { id:"fisekhane", cat:"district", isNew:true, name:"Fişekhane", area:"Kazlıçeşme, Zeytinburnu", price:2,
    from:"T1 tram direct from Fındıklı toward Zeytinburnu (~35 min), or Marmaray to Kazlıçeşme",
    why:"A 19th-century Ottoman ammunition factory restored into one of the city's best food-and-culture complexes — gourmet restaurants, galleries, boutiques, theatre, cinema and concerts inside the old brick halls.",
    tip:"Check fisekhane.com for what's on the night you go — it's a live venue as much as a dining spot. Gizia Brasserie and Zennup1844 are the standout restaurants. A footbridge takes you over the road to the seafront for a walk afterwards.", hours:"10:00–24:00" },

  { id:"tersane-istanbul", cat:"district", isNew:true, name:"Tersane İstanbul (Haliç Port)", area:"Golden Horn, Beyoğlu", price:3,
    from:"Taxi 15–20 min around the Golden Horn, or a Haliç ferry to Kasımpaşa/Hasköy",
    why:"The Ottoman Imperial Shipyard turned into a 242,000 m² waterfront district: a Foster + Partners open-air 'Fashion Avenue', four luxury hotels, museums, a marina and a long shoreline promenade.",
    tip:"Newest thing in the city and still opening in phases, so expect some hoardings. Bardot Bleu on the water and Josephine's terrace at Rixos are the ones to book. Best at sunset with the Golden Horn in front of you.", hours:"10:00–24:00" },

  { id:"tema-world", cat:"district", isNew:true, name:"Tema World", area:"Küçükçekmece", price:2,
    from:"Taxi ~40 min west, or Marmaray/M1 plus a short taxi",
    why:"A 264,000 m² entertainment and lifestyle centre — proper theme-park rides, an indoor experience centre, a live-performance venue, a 15,000 m² biological pond, plus shops and a big food line-up.",
    tip:"Entry and parking are both free, open 10:00–23:00 daily. It's 20 minutes from İstanbul Airport, so it works beautifully as the last stop on your departure day if your flight is in the evening.", hours:"10:00–23:00, free entry" },

  { id:"bomontiada", cat:"district", isNew:true, name:"Bomontiada", area:"Bomonti, Şişli", price:2, alcohol:true,
    from:"Taxi 15 min, or M2 metro to Osmanbey and a short walk",
    why:"The 1890 Bomonti beer factory turned into a courtyard of galleries, restaurants, a microbrewery, the Ara Güler Museum and the Babylon music venue. Outdoor concerts and film screenings all summer.",
    tip:"The best-programmed cultural complex in the city. Check the Babylon listings before you pick the night. The courtyard fills up from about 20:00.", hours:"10:00–02:00" },

  { id:"muze-gazhane", cat:"district", isNew:true, name:"Müze Gazhane", area:"Hasanpaşa, Kadıköy", price:0,
    from:"Ferry to Kadıköy then a 10 min taxi, or the M4 metro to Ünalan",
    why:"An 1892 gasworks rebuilt into a 32,000 m² public campus — climate museum, cartoon museum, a huge library, theatre halls, exhibition space and cafés, wrapped around the original gas tanks.",
    tip:"Free to walk in, and the least touristy 'new Istanbul' thing on the Asian side. Excellent on a Sunday. The café in the old boiler house is the one to sit in.", hours:"08:00–24:00, closed Mon" },

  { id:"vadistanbul", cat:"district", isNew:true, name:"Vadistanbul", area:"Ayazağa, Sarıyer", price:2,
    from:"M2 metro to Seyrantepe, then 5 min",
    why:"An open-air boulevard rather than a box — a long pedestrian strip of shops with a proper restaurant row along a stream, backing onto Belgrad Forest.",
    tip:"Much nicer than an enclosed mall on a warm September evening. Pair it with Belgrad Forest in the same trip north.", hours:"10:00–22:00" },

  { id:"watergarden", cat:"district", isNew:true, name:"Watergarden İstanbul", area:"Ataşehir, Asian side", price:2, alcohol:true,
    from:"Ferry to Kadıköy then a 20 min taxi, or M4 metro",
    why:"An open-air complex built around a huge lake with a choreographed dancing-fountain and light show, ringed by restaurants, bars and a cinema.",
    tip:"Go after dark — the whole point is the fountain show on the hour. Very popular with locals, almost no foreign tourists.", hours:"10:00–02:00" },

  { id:"isfanbul", cat:"district", name:"İsfanbul (formerly Vialand)", area:"Eyüpsultan", price:2,
    from:"Taxi 25 min, or M7 metro plus a short hop",
    why:"Turkey's biggest theme park — proper roller coasters — bolted onto a large mall and an entertainment strip.",
    tip:"The serious ride day out. Buy the park ticket online; the mall side is free to enter. Weekdays are dramatically quieter.", hours:"11:00–22:00" },

  { id:"uniq-istanbul", cat:"district", isNew:true, name:"UNIQ İstanbul", area:"Maslak, Sarıyer", price:2, alcohol:true,
    from:"M2 metro to İTÜ-Ayazağa, then 5 min",
    why:"An open-air campus of restaurants and bars around UNIQ Hall and an open-air amphitheatre — one of the city's main mid-size concert venues.",
    tip:"Worth building an evening around only if something is on. Check the UNIQ Hall programme first, then book dinner on site.", hours:"Event-led, restaurants 12:00–01:00" },

  { id:"beykoz-kundura", cat:"district", isNew:true, name:"Beykoz Kundura", area:"Beykoz, Asian side", price:1,
    from:"Ferry or taxi up the Asian shore, 35–45 min",
    why:"A vast abandoned shoe factory on the Bosphorus, now a film studio and cultural venue — exhibitions, festivals, cinema, and a waterfront café in the old works.",
    tip:"Access depends on the programme rather than fixed opening hours, so check what's on before making the trip. When there is an event, it is the most atmospheric space in Istanbul.", hours:"Programme-dependent" },

  { id:"arter", cat:"district", isNew:true, name:"Arter", area:"Dolapdere, Beyoğlu", price:2,
    from:"Taxi 10 min, or 20 min walk from the hotel",
    why:"A purpose-built contemporary art museum — several floors of exhibitions, two performance halls, a bookshop and a top-floor terrace café.",
    tip:"Free on Thursdays. Twenty minutes from your hotel and almost never crowded. The terrace has an unexpected view.", hours:"11:00–20:00, closed Mon" },

  { id:"akm", cat:"district", isNew:true, name:"Atatürk Kültür Merkezi (AKM)", area:"Taksim Square", price:2,
    from:"Funicular from Kabataş, 3 min",
    why:"The rebuilt cultural centre on Taksim Square — opera and concert halls inside a red glass sphere, plus a library, cinema, design shop and a rooftop restaurant over the square.",
    tip:"Even without a ticket you can walk the foyers and go up to the terrace. Check the opera and symphony schedule; tickets are startlingly cheap.", hours:"10:00–24:00" },

  { id:"cinili-hamam", cat:"district", isNew:true, name:"Zeyrek Çinili Hamam & Museum", area:"Zeyrek, Fatih", price:3,
    from:"T1 tram to Eminönü then a 10 min taxi uphill",
    why:"A Mimar Sinan bathhouse from the 1540s, reopened in 2024 after thirteen years of restoration — a working hammam sitting on a Byzantine cistern, with a purpose-built museum of İznik tile fragments found during the dig.",
    tip:"You can visit the museum alone or book a bathing session (25 to 100 minutes). Museum entry is free on Thursdays. Book the bath well ahead — it is small and in demand.", hours:"Museum 10:00–18:00; bathing by appointment" },

  { id:"kucukciftlik", cat:"district", name:"KüçükÇiftlik Park", area:"Maçka, Şişli", price:2, alcohol:true,
    from:"Taxi 10 min, or 20 min walk up through Maçka Park",
    why:"The city's main open-air concert ground, in a park between Nişantaşı and Beşiktaş. Big-name summer shows.",
    tip:"Purely event-led — check the September listings. Walk down through Maçka Park to Beşiktaş afterwards.", hours:"Event nights" },

  { id:"salt-galata", cat:"district", name:"SALT Galata", area:"Karaköy", price:0,
    from:"14 min walk from the hotel",
    why:"The old Ottoman Bank headquarters turned into a research institute and exhibition space, with a spectacular reading room and the Neolokal restaurant upstairs.",
    tip:"Free. Walk in for the building alone — the banking hall and the old vaults in the basement museum. Ten minutes or two hours, your call.", hours:"10:00–20:00, closed Mon" },

  { id:"akaretler", cat:"district", name:"Akaretler Sıraevler", area:"Beşiktaş", price:3,
    from:"15 min walk along the shore, or a 5 min taxi",
    why:"A restored row of 1870s terraced houses running uphill from Dolmabahçe — designer boutiques, galleries, cafés and the W Hotel behind the original stone facades.",
    tip:"Ten minutes past Dolmabahçe on foot, so it pairs perfectly with the palace. Best browsing street in Beşiktaş.", hours:"10:00–20:00" },

  { id:"piyalepasa", cat:"district", isNew:true, name:"Piyalepaşa İstanbul", area:"Kasımpaşa, Beyoğlu", price:2,
    from:"Taxi 12 min",
    why:"A new mixed-use quarter above the Golden Horn — an open shopping street, restaurants, cinema and a hotel, aimed at locals rather than visitors.",
    tip:"Convenient rather than remarkable, but genuinely new and useful if you are heading toward Tersane or the Golden Horn anyway.", hours:"10:00–22:00" },

  { id:"istanbul-marina", cat:"district", name:"Ataköy Marina (İstanbul Marina)", area:"Ataköy, Bakırköy", price:3, alcohol:true,
    from:"T1 tram toward Zeytinburnu then a short taxi, ~40 min",
    why:"A superyacht marina with a waterfront strip of restaurants and cafés looking out at the Marmara and the old city skyline.",
    tip:"Sunset dinner with boats rather than bridges. Pairs naturally with Fişekhane and Galleria on the same western run.", hours:"09:00–01:00" },

  { id:"kuzguncuk", cat:"district", name:"Kuzguncuk (İcadiye Caddesi)", area:"Üsküdar, Asian side", price:1,
    from:"Ferry to Üsküdar then a 10 min taxi or a 25 min shore walk",
    why:"A single pastel-coloured street of wooden houses, bakeries, bookshops and small cafés, with a synagogue, a church and a mosque within a few hundred metres of each other.",
    tip:"An hour, maximum, and worth every minute. Best late morning. The market garden (bostan) halfway up is a nice pause.", hours:"Anytime" },

  { id:"yeldegirmeni", cat:"district", name:"Yeldeğirmeni", area:"Kadıköy", price:1, alcohol:true,
    from:"Ferry Kabataş → Kadıköy, then 10 min walk",
    why:"Kadıköy's arts quarter — giant murals across the apartment blocks, independent galleries, record shops, third-wave cafés and small bars.",
    tip:"The mural walk takes about 40 minutes. Slot it in before lunch at Çiya on your Asian-side day.", hours:"Anytime" },

  /* ---- more malls: European side ---- */
  { id:"akmerkez", cat:"mall", name:"Akmerkez", area:"Etiler", price:3,
    from:"Taxi 20 min, or M2 metro to Levent plus a short hop",
    why:"The original upscale Istanbul mall, and still where Etiler and Bebek actually shop. Calmer and better edited than the giants.",
    tip:"Good if you want brands without the İstinye Park scale. Combine with a Bebek waterfront afternoon.", hours:"10:00–22:00" },

  { id:"metrocity", cat:"mall", name:"Metrocity", area:"Levent", price:2,
    from:"M2 metro to Levent, exit directly into the mall",
    why:"Mid-market and practical, straight off the metro, directly opposite Kanyon.",
    tip:"Do Kanyon and Metrocity together — they are 200 metres apart and cover very different price brackets.", hours:"10:00–22:00" },

  { id:"ozdilek-park", cat:"mall", name:"Özdilek Park", area:"Levent", price:2,
    from:"M2 metro to Levent",
    why:"A big department-store-anchored mall in the Levent cluster, strong on homeware and Turkish mid-market brands.",
    tip:"The third stop in a Levent shopping loop with Kanyon and Metrocity, all within walking distance.", hours:"10:00–22:00" },

  { id:"sapphire", cat:"mall", name:"Sapphire Çarşı & Seyir Terası", area:"4. Levent", price:2,
    from:"M2 metro to 4. Levent",
    why:"A mall in the base of one of Turkey's tallest towers, with a paid observation deck on the 54th floor that looks down on the whole city.",
    tip:"Go up on a clear afternoon — you can see both bridges and the Princes' Islands. The mall itself is small; the view is the reason.", hours:"10:00–22:00" },

  { id:"trump-towers", cat:"mall", name:"Trump Towers Mall", area:"Mecidiyeköy, Şişli", price:2,
    from:"M2 metro to Şişli-Mecidiyeköy",
    why:"Compact, central and rarely crowded, with a good cinema and food floor under the twin towers.",
    tip:"Useful as a quick, low-effort stop rather than a destination. Cevahir is one stop further if you want scale.", hours:"10:00–22:00" },

  { id:"citys-nisantasi", cat:"mall", name:"City's Nişantaşı", area:"Nişantaşı", price:3,
    from:"Taxi 12 min, or M2 to Osmanbey",
    why:"The small luxury mall in the middle of Nişantaşı, useful when the weather turns on your street-shopping day.",
    tip:"Do the Abdi İpekçi street boutiques first, and use this as the indoor backup.", hours:"10:00–22:00" },

  { id:"demiroren", cat:"mall", name:"Demirören İstiklal", area:"İstiklal Caddesi, Beyoğlu", price:2,
    from:"12 min walk uphill",
    why:"The main mall on İstiklal itself — high-street brands over several floors, with a top-floor food court looking down the avenue.",
    tip:"Genuinely handy as a bathroom-and-coffee stop mid-İstiklal. The terrace view down the street is better than the shops.", hours:"10:00–22:00" },

  { id:"grand-pera", cat:"mall", name:"Grand Pera (Cercle d'Orient)", area:"İstiklal Caddesi, Beyoğlu", price:2,
    from:"14 min walk uphill",
    why:"The restored 1880s Cercle d'Orient — the historic Emek cinema, exhibition halls, restaurants and shops inside one of İstiklal's grandest buildings.",
    tip:"Worth stepping into for the architecture even if you buy nothing. Check what is showing at the cinema.", hours:"10:00–22:00" },

  { id:"forum-istanbul", cat:"mall", name:"Forum İstanbul", area:"Bayrampaşa", price:2,
    from:"M1 metro to Kocatepe, ~35 min",
    why:"One of the largest malls in the country, with the Sea Life aquarium and a big entertainment floor attached.",
    tip:"Mid-market pricing and a good family option. Not worth the trip for the shops alone if you are doing İstinye Park.", hours:"10:00–22:00" },

  { id:"akbati", cat:"mall", name:"Akbatı", area:"Esenyurt / Başakşehir", price:2,
    from:"Taxi 40 min west",
    why:"A well-designed mall with an open-air street section, popular with the western suburbs.",
    tip:"Only worth it if you are already out west for Mall of İstanbul or Tema World. Combine the three.", hours:"10:00–22:00" },

  { id:"marmara-park", cat:"mall", name:"Marmara Park", area:"Beylikdüzü", price:2,
    from:"Taxi 45 min west, or Metrobüs",
    why:"Huge, modern, and priced for locals rather than tourists, with a large entertainment and food floor.",
    tip:"Far out. Justifiable only as part of a western shopping day.", hours:"10:00–22:00" },

  { id:"marmara-forum", cat:"mall", name:"Marmara Forum", area:"Bakırköy", price:2,
    from:"T1 tram to Zeytinburnu then a short taxi, ~40 min",
    why:"A big, well-stocked mall on the western side with all the Turkish high-street brands and a strong food court.",
    tip:"Sits close to Capacity and Galleria — three malls within a few kilometres if you want a concentrated day.", hours:"10:00–22:00" },

  { id:"capacity", cat:"mall", name:"Capacity", area:"Bakırköy", price:2,
    from:"T1 tram west then a short taxi",
    why:"Mid-market and busy, a short hop from the Bakırköy seafront.",
    tip:"Pairs with a walk along the Bakırköy shore, which is where Istanbul actually strolls on a Sunday.", hours:"10:00–22:00" },

  { id:"galleria-atakoy", cat:"mall", name:"Galleria Ataköy", area:"Ataköy, Bakırköy", price:2,
    from:"T1 tram west plus a short taxi, ~40 min",
    why:"Turkey's very first shopping mall, opened in 1988 and since refurbished. Historically interesting, and right beside the marina.",
    tip:"Combine with Ataköy Marina next door for dinner on the water.", hours:"10:00–22:00" },

  { id:"aqua-florya", cat:"mall", name:"Aqua Florya", area:"Florya, Bakırköy", price:2,
    from:"Marmaray or T1 plus a taxi, ~45 min",
    why:"A seaside mall built right on the Marmara shore, with an aquarium and terraces over the water.",
    tip:"The only mall in Istanbul where you can eat with waves under the terrace. Good on the way back from the western outlets.", hours:"10:00–22:00" },

  { id:"historia", cat:"mall", name:"Historia", area:"Fatih", price:1,
    from:"T1 tram to Aksaray area, ~25 min",
    why:"A mid-market mall in the middle of the old city, handy when you are around Aksaray or Laleli and want air conditioning and a food court.",
    tip:"Practical rather than exciting. Its real use is as a break in the middle of a Laleli or Grand Bazaar day.", hours:"10:00–22:00" },

  { id:"axis-istanbul", cat:"mall", name:"Axis İstanbul", area:"Kağıthane", price:2,
    from:"Taxi 20 min",
    why:"A newer mall serving the fast-growing Kağıthane district, quiet on weekdays and well laid out.",
    tip:"Convenient if you are heading up toward Vadistanbul or Maslak anyway.", hours:"10:00–22:00" },

  { id:"maslak-42", cat:"mall", name:"42 Maslak", area:"Maslak, Sarıyer", price:2,
    from:"M2 metro to Atatürk Oto Sanayi",
    why:"A compact modern mall in the business district, with a good food line-up aimed at the office crowd.",
    tip:"Best used as a lunch stop attached to a UNIQ İstanbul or Vadistanbul trip.", hours:"10:00–22:00" },

  /* ---- more malls: Asian side ---- */
  { id:"palladium", cat:"mall", name:"Palladium Ataşehir", area:"Ataşehir", price:2,
    from:"Ferry to Kadıköy then M4 metro, ~40 min",
    why:"The main upscale-ish mall of the Asian business district, with a good restaurant floor.",
    tip:"Ten minutes from Watergarden — do both, mall by day, fountains after dark.", hours:"10:00–22:00" },

  { id:"metropol-istanbul", cat:"mall", name:"Metropol İstanbul", area:"Ataşehir", price:2,
    from:"M4 metro to Yenisahra",
    why:"A newer open-plan complex with an outdoor square, cinema and a strong cluster of restaurants.",
    tip:"Very local, very relaxed. Good for an evening meal on the Asian side away from Kadıköy crowds.", hours:"10:00–22:00" },

  { id:"buyaka", cat:"mall", name:"Buyaka", area:"Ümraniye", price:2,
    from:"M5 metro from Üsküdar, ~35 min",
    why:"Distinctive architecture — glass spheres over a shopping street — plus a big cinema complex.",
    tip:"Combine with Meydan İstanbul across the road for a full Ümraniye run.", hours:"10:00–22:00" },

  { id:"meydan-istanbul", cat:"mall", name:"Meydan İstanbul", area:"Ümraniye", price:2,
    from:"M5 metro from Üsküdar",
    why:"An open-air mall built around a central square, with IKEA and a good cinema attached.",
    tip:"Pleasant in September when the weather is still warm — it is essentially an outdoor street.", hours:"10:00–22:00" },

  { id:"tepe-nautilus", cat:"mall", name:"Tepe Nautilus", area:"Acıbadem, Kadıköy", price:2,
    from:"Ferry to Kadıköy then M4 metro, 15 min",
    why:"One of the oldest Asian-side malls, mid-market, easy to reach from Kadıköy.",
    tip:"Only if you are already in Kadıköy and it rains. Akasya is the better Asian-side mall.", hours:"10:00–22:00" },

  /* ---- outlets ---- */
  { id:"optimum-outlet", cat:"mall", name:"Optimum Outlet", area:"Yenibosna, Bahçelievler", price:1,
    from:"M1 metro toward the airport, ~35 min",
    why:"One of the best-stocked outlet malls in the city — Turkish and international brands at genuine end-of-season pricing.",
    tip:"Pairs with Starcity across the district. Weekday mornings are empty.", hours:"10:00–22:00" },

  { id:"starcity-outlet", cat:"mall", name:"Starcity Outlet", area:"Yenibosna", price:1,
    from:"M1 metro, ~35 min",
    why:"A straightforward outlet mall with deep discounts on sportswear and high-street labels.",
    tip:"Do Optimum and Starcity in one run — they are minutes apart.", hours:"10:00–22:00" },

  { id:"212-outlet", cat:"mall", name:"212 İstanbul Power Outlet", area:"Bağcılar", price:1,
    from:"Taxi 35 min, or Metrobüs",
    why:"A very large outlet centre with the widest brand list of the western outlets.",
    tip:"The most productive single outlet stop if you only make one. Bring a folding bag.", hours:"10:00–22:00" },

  { id:"viaport-outlet", cat:"mall", name:"Viaport Outlet & Marina", area:"Pendik / Tuzla, Asian side", price:1,
    from:"Marmaray east or a 50 min taxi",
    why:"An outlet mall out east with a separate marina complex nearby for waterfront restaurants and a small amusement area.",
    tip:"Only sensible if you are on the Asian side already or heading to Sabiha Gökçen airport — it is close to SAW.", hours:"10:00–22:00" },

  { id:"torium", cat:"mall", name:"Torium", area:"Esenyurt", price:1,
    from:"Taxi 45 min west",
    why:"Big western mall with outlet-level pricing on many brands and a large entertainment floor.",
    tip:"Deep in the western suburbs — bundle it with Mall of İstanbul or Tema World or skip it.", hours:"10:00–22:00" },

  /* ============ BAZAARS & MARKETS ============ */
  { id:"grand-bazaar", cat:"bazaar", name:"Grand Bazaar (Kapalıçarşı)", area:"Beyazıt / Fatih", price:2,
    from:"T1 tram direct to Beyazıt-Kapalıçarşı (~20 min)",
    why:"Four thousand shops under one roof since 1461 — carpets, gold, ceramics, lamps, leather. The world's oldest shopping mall.",
    tip:"CLOSED SUNDAYS. Expect to pay 50–60% of the first price. Go deep into Zincirli Han and the Cevahir Bedesten for quality over tat.", hours:"09:00–19:00, closed Sun" },

  { id:"spice-bazaar", cat:"bazaar", name:"Spice Bazaar (Mısır Çarşısı)", area:"Eminönü", price:1,
    from:"T1 tram to Eminönü (~12 min)",
    why:"Spices, dried fruit, Turkish delight, saffron and tea — smaller and far easier to handle than the Grand Bazaar.",
    tip:"The good stuff is in the streets around the bazaar where locals shop, at half the price. Malatya Pazarı for dried apricots.", hours:"08:00–19:30" },

  { id:"arasta", cat:"bazaar", name:"Arasta Bazaar", area:"Sultanahmet", price:2,
    from:"T1 tram to Sultanahmet, behind the Blue Mosque",
    why:"A single calm lane of quality ceramics, textiles and rugs — no hassle, near-fixed prices, real craftsmanship.",
    tip:"Where to buy İznik ceramics if you do not want to fight the Grand Bazaar.", hours:"09:00–20:00" },

  { id:"sahaflar", cat:"bazaar", name:"Sahaflar Çarşısı (Book Bazaar)", area:"Beyazıt", price:1,
    from:"T1 tram to Beyazıt, next to the Grand Bazaar",
    why:"A courtyard of booksellers going back to Byzantine times — old maps, miniatures, calligraphy prints.",
    tip:"Good for small, flat, light souvenirs that survive a suitcase.", hours:"09:00–19:00" },

  { id:"cukurcuma", cat:"bazaar", name:"Çukurcuma Antiques Quarter", area:"Cihangir / Beyoğlu", price:2,
    from:"12 min walk uphill from the hotel",
    why:"Steep lanes of antique dealers, vintage furniture and bric-à-brac, plus the Museum of Innocence.",
    tip:"The most photogenic aimless wander in the neighbourhood, and it is on your doorstep.", hours:"10:00–19:00" },

  { id:"kadikoy-carsi", cat:"bazaar", name:"Kadıköy Çarşı (market streets)", area:"Kadıköy", price:1,
    from:"Ferry Kabataş → Kadıköy (20 min)",
    why:"The real food market of Istanbul — fish, cheese, pickles, coffee and spices packed into a few pedestrian blocks.",
    tip:"Do it as a graze: pickle juice at Özcan Turşucusu, coffee at Fazıl Bey, lunch at Çiya.", hours:"08:00–20:00" },

  { id:"ferikoy-organik", cat:"bazaar", name:"Feriköy Organic Market", area:"Feriköy, Şişli", price:1,
    from:"Taxi 15 min",
    why:"A Saturday-only organic farmers' market — producers, cheeses, breads, village olive oil.",
    tip:"SATURDAYS ONLY, 08:00–17:00. Your trip has exactly two Saturdays.", hours:"Sat only, 08:00–17:00" },

  { id:"mahmutpasa", cat:"bazaar", name:"Mahmutpaşa Yokuşu", area:"Eminönü ↔ Grand Bazaar", price:1,
    from:"T1 to Eminönü, then walk uphill",
    why:"The chaotic wholesale slope between the Spice Bazaar and the Grand Bazaar: textiles, luggage, everything, at local prices.",
    tip:"Where Istanbullus actually buy things. Keep your bag in front of you — it is shoulder to shoulder.", hours:"09:00–19:00" },

  { id:"tahtakale", cat:"bazaar", name:"Tahtakale", area:"Eminönü, Fatih", price:1,
    from:"T1 tram to Eminönü, then walk inland",
    why:"The wholesale engine room behind the Spice Bazaar — coffee, nuts, kitchen equipment, packaging, cheap electronics, party supplies. Chaotic and entirely local.",
    tip:"This is where the Spice Bazaar shops buy their stock, at a third of the price. Kurukahveci Mehmet Efendi's original counter is here. Mornings only; it dies after 17:00 and is shut Sundays.", hours:"08:00–17:30, closed Sun" },

  { id:"hasircilar", cat:"bazaar", name:"Hasırcılar Caddesi", area:"Eminönü, Fatih", price:1,
    why:"The street running alongside the Spice Bazaar where locals actually buy their spices, cheese, coffee and dried fruit — same goods, no tourist markup.",
    from:"T1 tram to Eminönü, immediately beside the Spice Bazaar",
    tip:"Walk past the bazaar entrance and shop on this street instead. Namlı and Kurukahveci Mehmet Efendi are both here.", hours:"08:00–19:00" },

  { id:"persembe-pazari", cat:"bazaar", name:"Perşembe Pazarı", area:"Karaköy", price:1,
    from:"12 min walk from the hotel",
    why:"The hardware and ship-chandler district below Galata — tools, brass, rope, marine fittings, in and around crumbling Genoese-era hans.",
    tip:"Not shopping so much as wandering. Duck into the hans off the main lanes; several have courtyards nobody photographs. Closed Sundays.", hours:"08:00–18:00, closed Sun" },

  { id:"horhor", cat:"bazaar", name:"Horhor Antique Market", area:"Aksaray, Fatih", price:2,
    from:"T1 tram to Aksaray, then 8 min walk",
    why:"Five or six floors of antique dealers in one building — Ottoman furniture, chandeliers, calligraphy, silver, ceramics. The serious end of Istanbul antiques.",
    tip:"Prices are negotiable and dealers ship. Far better stock than Çukurcuma, and almost no foreign buyers. Closed Sundays.", hours:"09:00–19:00, closed Sun" },

  { id:"ferikoy-antika", cat:"bazaar", name:"Feriköy Antika Pazarı", area:"Feriköy, Şişli", price:1,
    from:"Taxi 15 min",
    why:"The Sunday flea market — vinyl, cameras, Ottoman ephemera, watches, coins, mid-century bric-à-brac, laid out under one big canopy.",
    tip:"SUNDAYS ONLY. Your trip has one Sunday, 13 September, which is also your Bosphorus day — take it early or swap. Go before 11:00 for the good stuff.", hours:"Sun only, 08:00–17:00" },

  { id:"ulus-pazari", cat:"bazaar", name:"Ulus Pazarı", area:"Ulus, Beşiktaş", price:1,
    from:"Taxi 15 min uphill",
    why:"The Saturday market where Istanbul's export garment overruns surface — genuine branded stock at market-stall prices, alongside food and household goods.",
    tip:"SATURDAYS. You have two: 12 and 19 September. Bring cash and dig through the piles; the labels are real more often than not.", hours:"Sat only, 08:00–17:00" },

  { id:"kadikoy-sali", cat:"bazaar", name:"Kadıköy Salı Pazarı", area:"Kadıköy", price:1,
    from:"Ferry Kabataş → Kadıköy, then 15 min walk",
    why:"One of the largest street markets in the city — clothes, textiles, shoes and household goods across an enormous covered ground.",
    tip:"TUESDAYS. That is 15 September on your trip, which currently has the mall day — an easy swap if you would rather bargain than browse.", hours:"Tue, 08:00–18:00" },

  { id:"besiktas-pazari", cat:"bazaar", name:"Beşiktaş Cumartesi Pazarı", area:"Beşiktaş", price:1,
    from:"15 min walk or a 5 min taxi along the shore",
    why:"The closest proper neighbourhood market to your hotel — produce, cheese, clothes and household goods, in the middle of Beşiktaş.",
    tip:"SATURDAYS. Walk there along the shore past Dolmabahçe, then eat at the Beşiktaş fish market on the way back.", hours:"Sat, 08:00–18:00" },

  { id:"carsamba-pazari", cat:"bazaar", name:"Fatih Çarşamba Pazarı", area:"Fatih", price:1,
    from:"T1 tram plus a short taxi, ~30 min",
    why:"The biggest weekly market in Istanbul, spilling through the streets around Fatih Mosque. Vast, cheap and completely untouristed.",
    tip:"WEDNESDAYS — 16 September on your trip. A conservative neighbourhood, so dress accordingly. Astonishing photography.", hours:"Wed, 08:00–18:00" },

  { id:"yesilkoy-pazari", cat:"bazaar", name:"Yeşilköy Pazarı", area:"Yeşilköy, Bakırköy", price:2,
    from:"Marmaray west, ~35 min",
    why:"The upmarket weekly market — better quality clothing and produce than the average semt pazarı, in a genteel seaside suburb.",
    tip:"WEDNESDAYS. Pair it with a walk along the Yeşilköy seafront, which very few visitors ever see.", hours:"Wed, 08:00–18:00" },

  { id:"laleli", cat:"bazaar", name:"Laleli", area:"Fatih", price:1,
    from:"T1 tram to Laleli-Üniversite, ~22 min",
    why:"The wholesale fashion district — hundreds of showrooms supplying buyers from Russia, Central Asia and the Gulf. Whole buildings of clothing at wholesale rates.",
    tip:"Many places want minimum quantities, but plenty will sell single pieces if you ask. Closed Sundays. Go with a clear idea of what you want.", hours:"09:00–19:00, closed Sun" },

  { id:"osmanbey", cat:"bazaar", name:"Osmanbey textile district", area:"Osmanbey, Şişli", price:2,
    from:"M2 metro to Osmanbey, ~20 min",
    why:"Turkey's womenswear wholesale centre — the showrooms that supply European high-street chains, a few streets from Nişantaşı's retail prices.",
    tip:"Higher quality than Laleli, and more design-led. Weekdays only, and closed Sundays.", hours:"09:00–19:00, closed Sun" },

  { id:"merter", cat:"bazaar", name:"Merter", area:"Güngören", price:1,
    from:"M1 metro to Merter, ~35 min",
    why:"The garment manufacturing quarter — the largest concentration of clothing wholesalers in the country, block after block.",
    tip:"Only for serious buying. If you just want cheap clothes, the outlets or Ulus Pazarı are far less work.", hours:"09:00–19:00, closed Sun" },

  { id:"kazlicesme-leather", cat:"bazaar", name:"Zeytinburnu leather district", area:"Kazlıçeşme, Zeytinburnu", price:2,
    from:"T1 tram direct to Zeytinburnu, ~35 min",
    why:"Istanbul's historic tannery quarter and still the centre of Turkish leather — jackets, bags and coats direct from the workshops.",
    tip:"Quality varies enormously; check the stitching and the lining, and never accept the first price. Fişekhane is in the same district, so combine them.", hours:"09:00–19:00" },

  { id:"nuruosmaniye", cat:"bazaar", name:"Nuruosmaniye Caddesi", area:"Çemberlitaş, Fatih", price:3,
    from:"T1 tram to Çemberlitaş, ~20 min",
    why:"The elegant street running from the Grand Bazaar's Nuruosmaniye gate — serious antique dealers, old carpets, jewellery and calligraphy, in proper shops rather than stalls.",
    tip:"Where you go when you want a real piece and not a souvenir. Fixed, high prices, and expertise to match.", hours:"09:00–19:00, closed Sun" },

  { id:"cevahir-bedesten", cat:"bazaar", name:"Cevahir Bedesten (İç Bedesten)", area:"Inside the Grand Bazaar", price:3,
    from:"T1 tram to Beyazıt-Kapalıçarşı",
    why:"The oldest, walled core at the centre of the Grand Bazaar — the antiques and genuine-valuables section, where the dealers themselves buy.",
    tip:"Head straight here and ignore the outer lanes. Silver, icons, old watches, Ottoman weapons. Closed Sundays with the rest of the bazaar.", hours:"09:00–19:00, closed Sun" },

  /* ============ LANDMARKS ============ */
  { id:"hagia-sophia", cat:"sight", name:"Hagia Sophia (Ayasofya)", area:"Sultanahmet", price:2,
    from:"T1 tram direct to Sultanahmet (~18 min)",
    why:"Fifteen hundred years old and still the most astonishing interior on earth. Cathedral, then mosque, then museum, now a mosque again.",
    tip:"Visitors use the upper gallery on a paid ticket with its own entrance on the north side. Go at opening or after 16:00; closed to visitors around Friday midday prayer.", hours:"09:00–19:00 (visitor gallery)" },

  { id:"blue-mosque", cat:"sight", name:"Blue Mosque (Sultanahmet Camii)", area:"Sultanahmet", price:0,
    from:"T1 tram to Sultanahmet",
    why:"Six minarets, twenty thousand İznik tiles, and still a working neighbourhood mosque. Free to enter.",
    tip:"Closed to visitors for about 30 minutes around each of the five prayer times. Shoes off, shoulders and knees covered; scarves are provided at the door.", hours:"Outside prayer times" },

  { id:"topkapi", cat:"sight", name:"Topkapı Palace & Harem", area:"Sultanahmet", price:3,
    from:"T1 tram to Gülhane or Sultanahmet",
    why:"The Ottoman court for four hundred years — the Treasury, the sacred relics, and a fourth-courtyard terrace looking down the Bosphorus.",
    tip:"The Harem is a separate ticket and it is the best part, so buy both. CLOSED TUESDAYS. Allow three hours.", hours:"09:00–18:00, closed Tue" },

  { id:"basilica-cistern", cat:"sight", name:"Basilica Cistern (Yerebatan)", area:"Sultanahmet", price:2,
    from:"T1 tram to Sultanahmet, then 3 min walk",
    why:"336 columns holding up a 6th-century underground reservoir, now lit like a film set. The Medusa heads are at the back.",
    tip:"Buy the timed ticket online — the walk-up queue is the worst in the old city. Forty-five minutes is plenty.", hours:"09:00–22:00" },

  { id:"dolmabahce", cat:"sight", name:"Dolmabahçe Palace", area:"Beşiktaş", price:2,
    from:"10 min walk north along the shore road — your closest major sight",
    why:"Six hundred metres of European-style Ottoman excess on the water: a 4.5-tonne Bohemian chandelier, fourteen tonnes of gold leaf, and Atatürk's death room.",
    tip:"CLOSED MONDAYS. Go early; entry is timed and guided. Combine with the clock tower and a tea by the gate.", hours:"09:00–16:00, closed Mon" },

  { id:"galata-tower", cat:"sight", name:"Galata Tower", area:"Galata / Karaköy", price:2,
    from:"14 min walk, or tram to Karaköy then the Tünel funicular",
    why:"A 1348 Genoese tower with a 360° balcony over the Golden Horn, the old city and the Bosphorus.",
    tip:"Book a timed slot online. Best light is 90 minutes before sunset, which is also the longest queue. The streets around it are as good as the view.", hours:"08:30–23:00" },

  { id:"suleymaniye", cat:"sight", name:"Süleymaniye Mosque", area:"Fatih", price:0,
    from:"T1 tram to Eminönü plus a 12 min walk uphill",
    why:"Sinan's masterpiece and, honestly, a finer building than the Blue Mosque. The terrace behind it has the best free view of the Golden Horn.",
    tip:"Free, calm and rarely crowded. Go for the terrace at sunset even if you skip the interior.", hours:"Outside prayer times" },

  { id:"chora", cat:"sight", name:"Chora (Kariye) Mosque", area:"Edirnekapı, Fatih", price:2,
    from:"Taxi 25 min — there is no direct tram",
    why:"The finest Byzantine mosaics and frescoes anywhere, in a small building most visitors skip.",
    tip:"Pair it with a Balat and Fener walk the same afternoon; they are close together.", hours:"09:00–18:00" },

  { id:"istanbul-modern", cat:"sight", name:"İstanbul Modern", area:"Galataport, Karaköy", price:2,
    from:"8 min walk from the hotel",
    why:"A Renzo Piano building on the water — Turkish modern art plus a rooftop terrace and reflecting pool facing the old city.",
    tip:"The roof terrace café is worth the ticket on its own. The best rainy-day option, and it is next door to you.", hours:"10:00–18:00, closed Mon" },

  { id:"balat-fener", cat:"sight", name:"Balat & Fener", area:"Golden Horn, Fatih", price:0,
    from:"Ferry to the Fener/Balat pier, or a 20 min taxi",
    why:"Rainbow houses, Greek and Jewish heritage, antique shops, and the most photographed staircase streets in Istanbul.",
    tip:"Kiremit Caddesi and Merdivenli Yokuş for the colour. Best in late-morning light.", hours:"Anytime" },

  { id:"kiz-kulesi", cat:"sight", name:"Maiden's Tower (Kız Kulesi)", area:"Üsküdar / Salacak", price:2,
    from:"Ferry Kabataş → Üsküdar (15 min) plus the shuttle boat",
    why:"The little tower on its own islet, restored and reopened with a café at the top.",
    tip:"Even if you do not go out to it, the Salacak shore opposite is the classic sunset viewpoint.", hours:"09:00–19:00" },

  { id:"rumeli-hisari", cat:"sight", name:"Rumeli Hisarı", area:"Sarıyer", price:1,
    from:"Bus or taxi 25 min up the shore",
    why:"The fortress Mehmed II threw up in four months in 1452 to strangle Constantinople, with ramparts over the narrowest point of the Bosphorus.",
    tip:"Walk here from Bebek along the water. Steep, uneven steps, so wear proper shoes.", hours:"09:00–19:00" },

  { id:"ortakoy-mosque", cat:"sight", name:"Ortaköy Mosque", area:"Ortaköy", price:0,
    from:"Bus or taxi 15 min along the shore",
    why:"The postcard — a small baroque mosque on the water with the Bosphorus Bridge framed directly behind it.",
    tip:"Sunset, from the waterfront square to the left of the mosque, then kumpir afterwards.", hours:"Outside prayer times" },

  { id:"camlica", cat:"sight", name:"Çamlıca Hill & Mosque", area:"Üsküdar, Asian side", price:0,
    from:"Ferry to Üsküdar plus a 15 min taxi",
    why:"The highest point in Istanbul: Turkey's largest mosque, and a terrace over the entire city and both bridges.",
    tip:"Go at dusk for the city lights. The Çamlıca TV Tower next door has a paid observation deck and restaurant.", hours:"Anytime" },

  { id:"kilic-ali-hamam", cat:"sight", name:"Kılıç Ali Paşa Hamamı", area:"Tophane", price:3,
    from:"7 min walk — the closest hammam to the hotel",
    why:"A 1580 Sinan bathhouse, beautifully restored, and the best-run traditional hammam experience in the city.",
    tip:"Book ahead; men and women have separate time blocks. Save it for the evening your legs are wrecked.", hours:"Separate men's & women's sessions" },

  { id:"archaeology-museum", cat:"sight", name:"İstanbul Archaeology Museums", area:"Gülhane", price:2,
    from:"T1 tram to Gülhane (~16 min)",
    why:"The Alexander Sarcophagus, the Treaty of Kadesh, Troy — world-class and half empty, right next door to Topkapı.",
    tip:"Ideal when Sultanahmet is heaving. Enter from the Topkapı first-courtyard path.", hours:"09:00–18:30, closed Mon" },

  { id:"rahmi-koc", cat:"sight", name:"Rahmi M. Koç Museum", area:"Hasköy, Golden Horn", price:2,
    from:"Ferry or taxi, about 20 min",
    why:"An industrial museum on the water — a submarine you can walk through, plus planes, steam engines and vintage cars.",
    tip:"The best non-mosque, non-palace museum in Istanbul. Allow half a day.", hours:"09:30–18:00, closed Mon" },

  /* ============ VIEWS & ROOFTOPS ============ */
  { id:"mikla-terrace", cat:"view", name:"Mikla Terrace Bar", area:"Beyoğlu", price:3, alcohol:true,
    from:"18 min walk uphill",
    why:"The open-air roof above the restaurant, and the single best drink-in-hand panorama in Istanbul.",
    tip:"You can go up just for a drink, no dinner required. Arrive 30 minutes before sunset.", hours:"18:00–02:00, seasonal" },

  { id:"seven-hills", cat:"view", name:"Seven Hills Restaurant Terrace", area:"Sultanahmet", price:3, alcohol:true,
    from:"T1 to Sultanahmet plus a 5 min walk",
    why:"Hagia Sophia on one side, the Blue Mosque on the other, the Marmara straight ahead. The old-city rooftop shot.",
    tip:"The food is fine but not the point — come for tea or a drink at golden hour.", hours:"09:00–24:00" },

  { id:"buyuk-valide-han", cat:"view", name:"Büyük Valide Han rooftop", area:"Eminönü", price:1,
    from:"T1 to Eminönü plus an 8 min walk",
    why:"A crumbling 1651 caravanserai where a man on the roof charges a few lira for the most photogenic rooftop in the old city.",
    tip:"Hard to find — ask for 'çatı' at the entrance. Not for anyone nervous about stairs. Mornings are best.", hours:"Daylight hours" },

  { id:"360-istanbul", cat:"view", name:"360 İstanbul", area:"İstiklal, Beyoğlu", price:3, alcohol:true,
    from:"15 min walk uphill",
    why:"A glass-walled rooftop over İstiklal with a full sweep down to the Golden Horn.",
    tip:"Sunset drinks, then dinner elsewhere — it turns into a club later.", hours:"12:00–02:00" },

  { id:"ulus-29", cat:"view", name:"Ulus 29 / Sunset Grill", area:"Ulus, Beşiktaş", price:3, alcohol:true,
    from:"Taxi 20 min uphill",
    why:"Hillside terraces looking down the Bosphorus at both bridges — the city's classic special-occasion view.",
    tip:"Book a terrace table at sunset. This is the 'last night in Istanbul' dinner.", hours:"19:00–01:00" },

  { id:"galata-bridge", cat:"view", name:"Galata Bridge (lower deck)", area:"Eminönü ↔ Karaköy", price:1,
    from:"T1 tram to Karaköy, then walk on",
    why:"Fishermen above, fish restaurants and tea below, the old-city skyline dead ahead. Free and constantly alive.",
    tip:"Walk it at sunset from Karaköy to Eminönü. Balık ekmek boats at the Eminönü end.", hours:"Anytime" },

  { id:"eyup-teleferik", cat:"view", name:"Eyüp Teleferik & Golden Horn view", area:"Eyüpsultan", price:1,
    from:"Taxi or Golden Horn ferry, about 30 min",
    why:"A cable car over a hillside Ottoman cemetery to a tea terrace above the whole Golden Horn.",
    tip:"Pay with your İstanbulkart. Late afternoon, paired with Pierre Loti Café.", hours:"08:00–23:00" },

  /* ============ BOSPHORUS & FERRIES ============ */
  { id:"full-bosphorus", cat:"bosphorus", name:"Full Bosphorus Cruise (Şehir Hatları)", area:"Eminönü → Anadolu Kavağı", price:1,
    from:"T1 tram to Eminönü, boat pier no. 3",
    why:"The official city ferry all the way to the Black Sea mouth and back — six hours including a stop, for about the price of a coffee.",
    tip:"The long tour leaves Eminönü around 10:35 daily and returns about 17:00. Sit on the RIGHT going out for the palaces. Lunch is fish at Anadolu Kavağı.", hours:"Departs ~10:35" },

  { id:"short-bosphorus", cat:"bosphorus", name:"Short Bosphorus Cruise (2 hrs)", area:"Eminönü / Kabataş", price:1,
    from:"T1 to Eminönü, or Kabataş pier 7 min walk",
    why:"A two-hour round trip up to the second bridge and back — all of the view, none of the day gone.",
    tip:"The better option if you also want to shop that day. Afternoon departures catch the best light.", hours:"Several daily" },

  { id:"kabatas-kadikoy", cat:"bosphorus", name:"Kabataş → Kadıköy ferry", area:"Kabataş pier", price:1,
    from:"7 min walk from the hotel",
    why:"Your everyday commuter ferry to the Asian side — twenty minutes, a glass of tea, gulls, and the whole skyline for pennies.",
    tip:"Tap the İstanbulkart at the turnstile and sit outside at the back. Worth doing twice.", hours:"07:00–23:00, every 20–30 min" },

  { id:"kabatas-uskudar", cat:"bosphorus", name:"Kabataş / Beşiktaş → Üsküdar ferry", area:"Kabataş pier", price:1,
    from:"7 min walk",
    why:"Fifteen minutes to the Asian shore, passing the Maiden's Tower and Dolmabahçe on the way.",
    tip:"The best boat for sunset photos back toward the old city.", hours:"Frequent, all day" },

  { id:"ortakoy", cat:"bosphorus", name:"Ortaköy waterfront", area:"Ortaköy", price:1,
    from:"Bus 15 min along the shore, or a short taxi",
    why:"Mosque, bridge, boats, kumpir alley and a weekend craft market on one small square.",
    tip:"Sunday is liveliest and sunset is the shot. Walk on to Kuruçeşme afterwards.", hours:"Anytime" },

  { id:"bebek-hisari-walk", cat:"bosphorus", name:"Bebek → Rumeli Hisarı shore walk", area:"Bebek / Sarıyer", price:0,
    from:"Bus or taxi 20 min to Bebek, then walk",
    why:"Twenty minutes of waterfront promenade past yalı mansions, rowers, and the narrowest point of the strait.",
    tip:"Coffee in Bebek, walk north, fortress at the end, taxi back. A perfect low-effort morning.", hours:"Anytime" },

  { id:"sunset-cruise", cat:"bosphorus", name:"Private sunset boat (Dentur / Turyol)", area:"Kabataş / Karaköy", price:2,
    from:"7–12 min walk to either pier",
    why:"Small-boat sunset cruises leave hourly in the evening — no commentary, no crowd, just the strait lighting up.",
    tip:"Agree the price and the duration before boarding. Ninety minutes is the sweet spot.", hours:"Evening departures" },

  /* ============ EVENINGS ============ */
  { id:"nevizade", cat:"night", name:"Nevizade Sokak", area:"Beyoğlu", price:2, alcohol:true,
    from:"15 min walk uphill",
    why:"A single narrow lane of meyhanes with tables end to end, live fasıl music, and meze until late.",
    tip:"Loud, boozy and very fun. Skip it if you would rather not be around alcohol — Kumkapı and Kadıköy have calmer versions.", hours:"18:00–02:00" },

  { id:"hodjapasha", cat:"night", name:"Hodjapasha Whirling Dervish Show", area:"Sirkeci", price:2,
    from:"T1 tram to Sirkeci (~14 min)",
    why:"The sema ceremony performed in a restored 550-year-old hammam — the atmospheric version, not the hotel-lobby one.",
    tip:"Book online. About sixty minutes, no photos during the ceremony. A Turkish dance show runs on alternate nights.", hours:"Evening performances" },

  { id:"galata-mevlevi", cat:"night", name:"Galata Mevlevi Lodge", area:"Tünel, Beyoğlu", price:1,
    from:"14 min walk uphill",
    why:"The historic dervish lodge and museum, with authentic sema ceremonies on selected evenings.",
    tip:"More museum than show — the real thing rather than a performance. Check which nights the ceremony runs.", hours:"09:00–17:00 plus evening sema" },

  { id:"karakoy-bars", cat:"night", name:"Karaköy backstreets", area:"Karaköy", price:2, alcohol:true,
    from:"12 min walk",
    why:"The nightlife closest to you — small bars, rooftops and late cafés packed into a few converted-warehouse blocks.",
    tip:"Walkable home at 2am, which matters. Start at Galataport and work uphill.", hours:"18:00–02:00" },

  { id:"kadikoy-bar-street", cat:"night", name:"Kadıköy Kadife Sokak", area:"Kadıköy", price:1, alcohol:true,
    from:"Ferry from Kabataş — check the last boat, usually around 23:00",
    why:"Student-priced, music-led and far more local than Beyoğlu. Arkaoda for records, Karga for the building.",
    tip:"Watch the last ferry or you are taking a long taxi over the bridge.", hours:"19:00–03:00" },

  { id:"night-cruise", cat:"night", name:"Bosphorus dinner cruise", area:"Departs Kabataş / Eminönü", price:2,
    from:"7 min walk to Kabataş",
    why:"The bridges and shore palaces lit up, seen from the water. Touristy, and still genuinely lovely.",
    tip:"The cheap ones are a buffet and a bellydancer; the good ones are quiet boats. Ask exactly what is included.", hours:"~20:00 departures" },

  /* ============ DAY TRIPS ============ */
  { id:"buyukada", cat:"trip", name:"Büyükada (Princes' Islands)", area:"Sea of Marmara", price:1,
    from:"Ferry from Kabataş, about 1h20 direct",
    why:"A car-free island of wooden Victorian mansions, pine forest and sea, with electric carts and bicycles only.",
    tip:"Take the first ferry out (~09:00) and a 17:00–18:00 boat back. Rent bikes at the pier and ride the coast loop. Sundays are packed.", hours:"Full day" },

  { id:"heybeliada", cat:"trip", name:"Heybeliada", area:"Princes' Islands", price:1,
    from:"Same ferry line, one stop before Büyükada",
    why:"Quieter, greener and smaller than Büyükada — better if you want a beach and a nap over sightseeing.",
    tip:"Combine them: Heybeliada in the morning, then the inter-island boat to Büyükada in the afternoon.", hours:"Full day" },

  { id:"sile-agva", cat:"trip", name:"Şile & Ağva", area:"Black Sea coast", price:2,
    from:"Bus or taxi, about 90 min from the Asian side",
    why:"Black Sea beaches, a white lighthouse, river valleys and fish restaurants — a total change of scene.",
    tip:"Only worth it with a car or a driver for the day. Mid-September still works for the beach.", hours:"Full day" },

  { id:"belgrad-forest", cat:"trip", name:"Belgrad Forest", area:"Sarıyer", price:0,
    from:"Taxi, about 40 min",
    why:"Ottoman aqueducts, running trails and picnic grounds in deep forest forty minutes from your hotel.",
    tip:"Half a day, best on a clear morning. Pair it with a late lunch in Sarıyer for börek and fish.", hours:"Daylight" },

  { id:"sapanca", cat:"trip", name:"Sapanca & Maşukiye", area:"Kocaeli, ~2h east", price:2,
    from:"Organised tour or a private driver, two hours each way",
    why:"Lake, waterfalls and mountain trout restaurants — the standard Istanbul weekend escape.",
    tip:"Only if you want a full day out of the city; otherwise the Bosphorus does the same job in less time.", hours:"Full day" }
];

/* Turkish worth having offline */
const PHRASES = [
  { tr:"Merhaba", en:"Hello", say:"mer-ha-BA" },
  { tr:"Teşekkür ederim", en:"Thank you", say:"te-shek-KYUR e-de-rim" },
  { tr:"Lütfen", en:"Please", say:"LEWT-fen" },
  { tr:"Ne kadar?", en:"How much is it?", say:"ne ka-DAR" },
  { tr:"Çok pahalı", en:"Too expensive", say:"chok pa-ha-LUH" },
  { tr:"Son fiyat ne?", en:"What's your best price?", say:"son fee-YAT ne" },
  { tr:"Hesap, lütfen", en:"The bill, please", say:"he-SAP lewt-fen" },
  { tr:"Bir çay, lütfen", en:"One tea, please", say:"beer CHAI lewt-fen" },
  { tr:"Nerede?", en:"Where is it?", say:"NE-re-de" },
  { tr:"Anlamıyorum", en:"I don't understand", say:"an-la-MUH-yo-rum" },
  { tr:"İngilizce biliyor musunuz?", en:"Do you speak English?", say:"in-ghi-LIZ-je bi-li-yor mu-su-nuz" },
  { tr:"Afiyet olsun", en:"Enjoy your meal", say:"a-fi-YET ol-sun" },
  { tr:"Kartla ödeyebilir miyim?", en:"Can I pay by card?", say:"kart-LA eu-de-ye-bi-lir mi-yim" },
  { tr:"Tuvalet nerede?", en:"Where is the toilet?", say:"tu-va-LET ne-re-de" },
  { tr:"Yardım edin!", en:"Help!", say:"yar-DUHM e-din" }
];

const ESSENTIALS = [
  { icon:"💳", title:"İstanbulkart — get one immediately",
    body:"Buy it at any kiosk or from the machines at Kabataş or Fındıklı. One card can pay for several people, and it works on the tram, metro, funicular, bus, ferry and the Eyüp cable car. Load 400–600 TL to start and top up at any machine. Fares are a fraction of buying single tokens." },
  { icon:"🚊", title:"Your line is the T1 tram",
    body:"The Fındıklı stop is outside the hotel. Westbound it runs Tophane → Karaköy → Eminönü → Sirkeci → Gülhane → Sultanahmet → Çemberlitaş → Beyazıt (Grand Bazaar) → ... → Zeytinburnu. That one line covers most of your sightseeing with no changes." },
  { icon:"🚡", title:"Kabataş funicular to Taksim",
    body:"The F1 runs from Kabataş (7 min walk) to Taksim Square in 90 seconds. It beats the twelve-minute uphill walk when you are tired or it is hot." },
  { icon:"⛴️", title:"Ferries are transport, not a tour",
    body:"Kabataş → Kadıköy (20 min) and → Üsküdar (15 min) are the best-value sightseeing in Istanbul. Check the last return boat; most lines stop around 23:00." },
  { icon:"🚕", title:"Taxis: use BiTaksi or Uber",
    body:"Hailing on the street invites the 'meter is broken' routine. BiTaksi is the local app everyone uses, and Uber dispatches licensed yellow taxis. Always insist on the meter (taksimetre)." },
  { icon:"💵", title:"Money",
    body:"Turkish Lira (₺). Cards work almost everywhere, but keep cash for bazaars, tea gardens, small kebab places and taxis. Exchange at a döviz office in the Grand Bazaar or Eminönü rather than at the airport — the difference is significant." },
  { icon:"🧾", title:"Tipping",
    body:"Restaurants 5–10%, after checking whether servis is already on the bill. Round up for taxis. Hammam: 10–15%, split among the staff who worked on you." },
  { icon:"🕌", title:"Mosque etiquette",
    body:"Shoes off, phone silent, shoulders and knees covered; women cover their hair, and scarves are lent free at every tourist mosque. Avoid the five prayer times, and especially Friday midday." },
  { icon:"📶", title:"Connectivity",
    body:"An eSIM (Airalo, Holafly) is the least hassle — activate it before you fly. Turkey registers phone IMEIs, so a foreign handset on a Turkish SIM is blocked after about 120 days, which does not matter for a week." },
  { icon:"🛍️", title:"Bargaining",
    body:"Expected in the Grand Bazaar, the Spice Bazaar and Mahmutpaşa. Not in malls, restaurants or supermarkets. The opening price is usually two to three times the real one — walk away once and see what happens." },
  { icon:"🆘", title:"Emergency numbers",
    body:"112 for ambulance, fire and police on one line. 155 for police direct. Tourism police in Sultanahmet: +90 212 527 4503." },
  { icon:"✈️", title:"Airport transfer",
    body:"IST (main airport) to Fındıklı takes 45–60 minutes: Havaist bus to Taksim then a taxi or the funicular down, or a direct taxi at roughly 1,000–1,400 TL depending on traffic. SAW on the Asian side takes 60–90 minutes via the Havabus to Taksim. Leave 3.5 hours before an international flight." },
  { icon:"🌡️", title:"Mid-September weather",
    body:"Usually 24–28°C in the day and 17–19°C at night, mostly dry with the odd short shower. Pack a light layer for evening ferries and one pair of shoes you can walk 15km in." }
];

/* ---------------------------------------------------------------------------
   TRANSPORT — stops, lines and frequencies around the hotel in Fındıklı.

   Deliberately frequencies and first/last services rather than invented
   minute-by-minute timetables: İstanbul switches to a winter schedule around
   late September, mid-trip, and a wrong departure time is worse than none.
   The one real timetable here is the Princes' Islands line, which is fixed
   and publicly listed. Live links at the bottom for the rest.
--------------------------------------------------------------------------- */
const TRANSPORT = {

  stops: [
    { name: "Fındıklı — T1 tram", walk: "Outside the front door", icon: "🚊",
      note: "Your stop. Westbound platform for the whole old city; eastbound is one stop to Kabataş, the end of the line.",
      map: "Fındıklı Tramvay Durağı" },
    { name: "Fındıklı — bus, Meclisi Mebusan Cad.", walk: "Outside the front door", icon: "🚌",
      note: "Northbound for Kabataş, Dolmabahçe and Beşiktaş; southbound for Tophane and Karaköy.",
      map: "Fındıklı otobüs durağı Meclisi Mebusan Caddesi" },
    { name: "Kabataş — tram, funicular, ferry, bus", walk: "7 min east along the shore", icon: "⛴️",
      note: "The hub you will use most. T1 terminus, F1 funicular up to Taksim, ferries to Kadıköy, Üsküdar and the Princes' Islands, and the Bosphorus shore buses.",
      map: "Kabataş İskelesi" },
    { name: "Tophane — T1 tram", walk: "7 min west", icon: "🚊",
      note: "Marginally closer than Fındıklı for İstanbul Modern, Galataport and the Kılıç Ali Paşa hammam.",
      map: "Tophane Tramvay Durağı" },
    { name: "Karaköy — tram and ferry pier", walk: "12 min west", icon: "⛴️",
      note: "Ferries to Kadıköy and Üsküdar, and the short Bosphorus boats. Walk on over the Galata Bridge for Eminönü.",
      map: "Karaköy İskelesi" },
    { name: "Beşiktaş — ferry pier and bus hub", walk: "15 min north, or 3 stops on any northbound bus", icon: "⛴️",
      note: "Best pier for Üsküdar and Kadıköy when Kabataş is busy, and the departure point for many shore buses.",
      map: "Beşiktaş İskelesi" }
  ],

  rail: [
    { line: "T1", colour: "#0a7", name: "Kabataş ↔ Bağcılar tram",
      hours: "06:00 – 00:00", freq: "Every 2–4 min at peak, about every 6 min otherwise",
      note: "The single most useful line for you — it stops outside the hotel and needs no changes.",
      stops: "Kabataş · Fındıklı · Tophane · Karaköy · Eminönü · Sirkeci · Gülhane · Sultanahmet · Çemberlitaş · Beyazıt-Kapalıçarşı · Laleli-Üniversite · Aksaray · … · Zeytinburnu · Bağcılar" },
    { line: "F1", colour: "#c60", name: "Kabataş ↔ Taksim funicular",
      hours: "06:00 – 00:00", freq: "Every 5–10 min",
      note: "A 2.5-minute ride that saves the twelve-minute uphill walk to Taksim. Tap in with the same İstanbulkart.",
      stops: "Kabataş · Taksim" },
    { line: "M2", colour: "#093", name: "Yenikapı ↔ Hacıosman metro",
      hours: "06:00 – 00:00", freq: "Every 3–8 min",
      note: "Pick it up at Taksim after the funicular. This is how you reach the malls and the business districts.",
      stops: "Taksim · Osmanbey (Nişantaşı) · Şişli-Mecidiyeköy (Cevahir) · Gayrettepe (Zorlu) · Levent (Kanyon, Metrocity) · 4. Levent (Sapphire) · Seyrantepe (Vadistanbul) · İTÜ-Ayazağa (UNIQ) · Hacıosman" }
  ],

  buses: [
    { group: "Stopping outside the hotel", lines: "22 · 22B · 26 · 26A · 26B · 27E · 27SE · 28 · 28T · 29C · 40 · 41E · 58N · DT1",
      note: "Meclisi Mebusan Caddesi is a busy shore road, so something comes along every couple of minutes. Check the destination on the front — the same street carries very different routes." },
    { group: "North, up the Bosphorus shore", lines: "22 · 25E · 40 · 40T",
      note: "From Kabataş along the water to Beşiktaş, Ortaköy, Kuruçeşme, Bebek, Emirgan, İstinye and Sarıyer. This is your Sunday: Emirgan breakfast, Bebek, Rumeli Hisarı." },
    { group: "Airport",  lines: "Havaist HVIST-4 / IST-1",
      note: "Havaist runs Taksim ↔ İstanbul Airport, roughly every 30 minutes, about 90 minutes end to end. With luggage a taxi from the hotel is worth the extra." }
  ],

  ferries: [
    { route: "Kabataş → Kadıköy", pier: "Kabataş, 7 min walk", time: "About 20 min",
      freq: "Roughly every 20–30 min", hours: "First around 07:00, last around 22:00–23:00",
      note: "Your everyday crossing to the Asian side. Sit outside at the back." },
    { route: "Kabataş / Beşiktaş → Üsküdar", pier: "Kabataş or Beşiktaş", time: "About 15 min",
      freq: "Frequent through the day", hours: "First around 07:00, last around 22:00",
      note: "Passes the Maiden's Tower and Dolmabahçe. The best boat for sunset photographs back at the old city." },
    { route: "Karaköy → Kadıköy / Üsküdar", pier: "Karaköy, 12 min walk", time: "20–25 min",
      freq: "Every 20–30 min", hours: "Roughly 07:00 – 21:00",
      note: "A useful alternative if you are already down at Galataport." },
    { route: "Eminönü → Kadıköy / Üsküdar", pier: "Eminönü, T1 tram", time: "20 min",
      freq: "Very frequent, the busiest crossing in the city", hours: "Roughly 06:30 – 23:00",
      note: "Combine with the Spice Bazaar or the Galata Bridge on the same trip." },
    { route: "Eminönü → Full Bosphorus tour", pier: "Eminönü, boat pier no. 3", time: "About 6 hours return",
      freq: "Once daily", hours: "Departs about 10:35, back around 17:00",
      note: "All the way to Anadolu Kavağı at the Black Sea mouth, with a stop for lunch. Around 53–59 ₺ with an İstanbulkart." }
  ],

  islands: {
    title: "Kabataş → Princes' Islands",
    note: "Calls at Kınalıada, Burgazada, Heybeliada and Büyükada in that order. Büyükada is about 90 minutes. Roughly 30 ₺ with an İstanbulkart.",
    departures: ["06:50", "08:20", "09:30", "10:40", "12:15", "13:45", "15:15", "17:00", "18:30", "20:00", "21:30"],
    warn: "Published times — confirm at the pier on the day, and check the last boat back the moment you land."
  },

  links: [
    { label: "Şehir Hatları — official ferry timetables", url: "https://sehirhatlari.istanbul/en/timetables" },
    { label: "İETT — bus routes and live times",        url: "https://www.iett.istanbul/en" },
    { label: "Moovit — live İstanbul transit",           url: "https://moovitapp.com/istanbul-1563/poi/en" },
    { label: "Metro İstanbul — metro, tram, funicular",  url: "https://www.metro.istanbul/en" }
  ]
};

const PACKING = [
  "Passport, plus a photo of it on your phone",
  "Flight and hotel confirmations saved offline",
  "Travel insurance details",
  "Some cash to exchange on arrival",
  "Two cards, kept in different places",
  "Comfortable walking shoes, already broken in",
  "Shoes that come off easily for mosques",
  "Light scarf and covered shoulders for mosques",
  "Light jacket for evening ferries",
  "Sunglasses and sunscreen",
  "Power bank",
  "Universal or EU (Type F) plug adapter",
  "eSIM activated before departure",
  "Small daypack that zips shut",
  "Medication and basic first aid",
  "Refillable water bottle",
  "Space in the suitcase for baklava, lokum and spices"
];
