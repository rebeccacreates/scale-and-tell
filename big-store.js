/* Scale & Tell · big-store.js (v1)
 * Browsers only give a website about 5 MB of localStorage, and gallery photos + health-photo
 * attachments live there as images, so keepers with lots of photos hit "Photo storage is full".
 * This moves just those two big keys into IndexedDB (hundreds of MB), while the app keeps using
 * localStorage.getItem/setItem exactly as before. Everything else stays in localStorage.
 * It loads first, copies the two keys into memory, then starts app.js. If IndexedDB isn't
 * available (some private windows), nothing changes and the app works the old way. */
(function () {
  "use strict";
  var BIG = { scaleTellPhotos10: 1, scaleTellApprovedPreview: 1 };
  var DB = "stBigStore", STORE = "kv";
  var mem = Object.create(null), db = null, on = false;
  var ls = window.localStorage;
  var P = Storage.prototype, get = P.getItem, set = P.setItem, del = P.removeItem, clr = P.clear;

  function open() {
    return new Promise(function (ok, bad) {
      var t = setTimeout(function () { bad(Error("timeout")); }, 10000);
      try {
        var r = indexedDB.open(DB, 1);
        r.onupgradeneeded = function () { r.result.createObjectStore(STORE); };
        r.onsuccess = function () { clearTimeout(t); ok(r.result); };
        r.onerror = function () { clearTimeout(t); bad(r.error); };
        r.onblocked = function () { clearTimeout(t); bad(Error("blocked")); };
      } catch (e) { clearTimeout(t); bad(e); }
    });
  }
  function tx(mode, fn) {
    return new Promise(function (ok, bad) {
      var t = db.transaction(STORE, mode), s = t.objectStore(STORE), out;
      out = fn(s);
      t.oncomplete = function () { ok(out && out.result); };
      t.onerror = t.onabort = function () { bad(t.error || Error("idb")); };
    });
  }
  var queue = Promise.resolve();
  function save(key) {
    // Writes run one after another so the newest value always lands last.
    queue = queue.then(function () {
      var v = mem[key];
      return tx("readwrite", function (s) { return v == null ? s.delete(key) : s.put(v, key); });
    }).catch(function (e) {
      try { console.warn("[big-store] could not save", key, e); } catch (_) {}
      // Last resort: try the old place so nothing is lost.
      try { if (mem[key] != null) { set.call(ls, key, mem[key]); set.call(ls, "stBigFallback:" + key, "1"); } } catch (_) {
        try { alert("Your phone is out of space for Scale & Tell photos. Your photos are still saved to your account."); } catch (__) {}
      }
    });
    return queue;
  }

  async function boot() {
    db = await open();
    var keys = Object.keys(BIG);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var v = await tx("readonly", function (s) { return s.get(k); });
      var old = null;
      try { old = get.call(ls, k); } catch (e) {}
      if (old != null) {
        // First run, or a session that had to fall back to localStorage. Pick the copy to keep:
        // a flagged fallback write is newest; otherwise keep the bigger one (galleries mostly grow)
        // and save the other under "<key>:backup" so nothing is ever thrown away.
        var flagged = false;
        try { flagged = get.call(ls, "stBigFallback:" + k) === "1"; } catch (e) {}
        var keepOld = v == null || flagged || String(old).length >= String(v).length;
        var other = keepOld ? v : old;
        if (keepOld) v = old;
        var keep = v;
        await tx("readwrite", function (s) { s.put(keep, k); if (other != null) s.put(other, k + ":backup"); return null; });
        try { del.call(ls, k); del.call(ls, "stBigFallback:" + k); } catch (e) {}
      }
      if (typeof v === "string") mem[k] = v;
    }
    on = true;
    P.getItem = function (key) {
      if (on && this === ls && BIG[key]) return key in mem ? mem[key] : null;
      return get.call(this, key);
    };
    P.setItem = function (key, value) {
      if (on && this === ls && BIG[key]) { mem[key] = String(value); save(key); return; }
      return set.call(this, key, value);
    };
    P.removeItem = function (key) {
      if (on && this === ls && BIG[key]) { delete mem[key]; save(key); return; }
      return del.call(this, key);
    };
    P.clear = function () {
      if (on && this === ls) { mem = Object.create(null); queue = queue.then(function () { return tx("readwrite", function (s) { return s.clear(); }); }).catch(function () {}); }
      return clr.call(this);
    };
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
  }

  window.stBigReady = (function () {
    try { if (!window.indexedDB || !ls) return Promise.resolve(false); } catch (e) { return Promise.resolve(false); }
    return boot().then(function () { return true; }, function (e) {
      on = false;
      try { console.warn("[big-store] off, using localStorage", e); } catch (_) {}
      return false;
    });
  })();
  window.stBigFlush = function () { return queue; };
})();
