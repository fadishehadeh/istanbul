/* Copy this file to documents.js and fill it in.
   documents.js is gitignored — it never leaves your machine.
   If documents.js is absent the app simply hides the Documents tab. */

const DOCS = {
  travellers: [{ name: "", passport: "", dob: "" }],
  flights: {
    ref: "", airline: "", baggage: "", fare: "",
    legs: [{ no: "", date: "", from: "", fromFull: "", dep: "", to: "", toFull: "", arr: "", duration: "", aircraft: "" }]
  },
  hotel: { name: "", address: "", map: "", ref: "", guest: "", checkIn: "", checkOut: "", nights: 0, booked: "", note: "" },
  insurance: {
    provider: "", assistance: "", cover: "", valid: "",
    policies: [{ name: "", no: "" }],
    phones: [{ label: "", value: "", tel: "" }],
    email: "", critical: ""
  },
  emergency: [{ label: "", value: "", tel: "" }]
};
