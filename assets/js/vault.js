/* İstanbul Trip Companion — encrypted document vault.

   Envelope encryption:
     - a random 256-bit master key K encrypts the documents (AES-GCM)
     - K is stored only in wrapped form, never in the clear:
         * wrapped by a PIN-derived key (PBKDF2-SHA256, 250k iterations)
         * optionally also wrapped by a key that only the device's
           biometric sensor can release (WebAuthn PRF extension)

   So the bytes sitting in localStorage are useless without either your PIN
   or your fingerprint. K lives in memory only while the app is open and is
   dropped on reload.

   The PIN always works. Biometrics are a convenience on top, and are only
   offered when the browser actually supports WebAuthn PRF — no pretending. */

const Vault = (function () {
  "use strict";

  const KEY = "ist2026vault";
  const ITERATIONS = 250000;
  const RP_NAME = "İstanbul Trip";

  let master = null;          // CryptoKey, in memory only
  let plain = null;           // decrypted documents object, in memory only

  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const b64 = (buf) => btoa(String.fromCharCode.apply(null, new Uint8Array(buf)));
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const rand = (n) => crypto.getRandomValues(new Uint8Array(n));

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; }
  }
  function write(v) {
    try { localStorage.setItem(KEY, JSON.stringify(v)); return true; } catch (e) { return false; }
  }

  async function pinKey(pin, salt) {
    const base = await crypto.subtle.importKey("raw", enc.encode(pin), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: salt, iterations: ITERATIONS, hash: "SHA-256" },
      base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
    );
  }

  async function wrap(k, raw) {                       // raw = ArrayBuffer of K
    const iv = rand(12);
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, k, raw);
    return { iv: b64(iv), ct: b64(ct) };
  }
  async function unwrap(k, blob) {
    const raw = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: unb64(blob.iv) }, k, unb64(blob.ct));
    return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
  }

  /* ---------------- WebAuthn PRF ---------------- */

  function webauthnPossible() {
    return !!(window.PublicKeyCredential && navigator.credentials &&
              window.isSecureContext);
  }

  async function biometricAvailable() {
    if (!webauthnPossible()) return false;
    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (e) { return false; }
  }

  // Register a platform credential and confirm the PRF extension works.
  async function createCredential() {
    const userId = rand(16);
    const cred = await navigator.credentials.create({
      publicKey: {
        challenge: rand(32),
        rp: { name: RP_NAME, id: location.hostname },
        user: { id: userId, name: "trip", displayName: "Trip documents" },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          residentKey: "required",
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "none",
        extensions: { prf: {} }
      }
    });
    const ext = cred.getClientExtensionResults();
    if (!ext || !ext.prf || ext.prf.enabled !== true) {
      throw new Error("PRF_UNSUPPORTED");
    }
    return { id: b64(cred.rawId) };
  }

  // Ask the authenticator for the PRF secret and turn it into an AES key.
  async function prfKey(credId, prfSalt) {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: rand(32),
        rpId: location.hostname,
        allowCredentials: [{ type: "public-key", id: unb64(credId) }],
        userVerification: "required",
        timeout: 60000,
        extensions: { prf: { eval: { first: unb64(prfSalt) } } }
      }
    });
    const ext = assertion.getClientExtensionResults();
    const secret = ext && ext.prf && ext.prf.results && ext.prf.results.first;
    if (!secret) throw new Error("PRF_NO_RESULT");
    return crypto.subtle.importKey("raw", secret, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
  }

  /* ---------------- public API ---------------- */

  return {
    exists() { const v = read(); return !!(v && v.ct); },
    hasBiometric() { const v = read(); return !!(v && v.bio); },
    isUnlocked() { return !!plain; },
    data() { return plain; },
    biometricAvailable: biometricAvailable,

    /* Encrypt `obj` under a new master key, wrapped by `pin`. */
    async create(obj, pin) {
      const K = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
      const iv = rand(12);
      const ct = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv }, K, enc.encode(JSON.stringify(obj)));

      const salt = rand(16);
      const pk = await pinKey(pin, salt);
      const rawK = await crypto.subtle.exportKey("raw", K);

      write({
        v: 1,
        iv: b64(iv), ct: b64(ct),
        pin: { salt: b64(salt), iterations: ITERATIONS, wrapped: await wrap(pk, rawK) },
        bio: null
      });
      master = K; plain = obj;
      return true;
    },

    /* Add fingerprint unlock for the already-unlocked vault. */
    async enableBiometric() {
      if (!master) throw new Error("LOCKED");
      const cred = await createCredential();
      const prfSalt = rand(32);
      const bk = await prfKey(cred.id, b64(prfSalt));
      const rawK = await crypto.subtle.exportKey("raw", master);
      const v = read();
      v.bio = { credId: cred.id, prfSalt: b64(prfSalt), wrapped: await wrap(bk, rawK) };
      write(v);
      return true;
    },

    async disableBiometric() {
      const v = read(); if (!v) return false;
      v.bio = null; write(v); return true;
    },

    async unlockWithPin(pin) {
      const v = read(); if (!v) throw new Error("NO_VAULT");
      const pk = await pinKey(pin, unb64(v.pin.salt));
      let K;
      try { K = await unwrap(pk, v.pin.wrapped); }
      catch (e) { throw new Error("BAD_PIN"); }
      const json = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(v.iv) }, K, unb64(v.ct));
      master = K; plain = JSON.parse(dec.decode(json));
      return plain;
    },

    async unlockWithBiometric() {
      const v = read();
      if (!v || !v.bio) throw new Error("NO_BIOMETRIC");
      const bk = await prfKey(v.bio.credId, v.bio.prfSalt);
      const K = await unwrap(bk, v.bio.wrapped);
      const json = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(v.iv) }, K, unb64(v.ct));
      master = K; plain = JSON.parse(dec.decode(json));
      return plain;
    },

    lock() { master = null; plain = null; },

    destroy() {
      master = null; plain = null;
      try { localStorage.removeItem(KEY); } catch (e) {}
    }
  };
})();
