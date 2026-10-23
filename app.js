/* V3.63 · The 12 illustrated guides are a big file, so they load right after the app opens instead of before it. */
let HERPS_GUIDES = window.HERPS_GUIDES_DATA || [];
let stGuidesLoading = false;
function stGuidesLoad() {
  if (HERPS_GUIDES.length || stGuidesLoading) return;
  stGuidesLoading = true;
  const sc = document.createElement("script");
  sc.src = "guides.js?v=" + (typeof SCALE_LC_VERSION !== "undefined" ? SCALE_LC_VERSION : "1");
  sc.onerror = () => { stGuidesLoading = false; setTimeout(stGuidesLoad, 5000); };
  document.head.appendChild(sc);
}
function stGuidesLoaded() {
  HERPS_GUIDES = window.HERPS_GUIDES_DATA || [];
  try { if (document.getElementById("sheet")?.classList.contains("on")) render(); } catch (e) {}
}
if (document.readyState === "complete") setTimeout(stGuidesLoad, 300); else window.addEventListener("load", () => setTimeout(stGuidesLoad, 300));

const SOCIAL_DEFAULT = {
  group: "https://www.facebook.com/share/g/1HxUA4zXkr/?mibextid=wwXIfr",
  facebook: "",
  instagram: "",
  tiktok: "",
};
let socialLinks = { ...SOCIAL_DEFAULT };
try {
  let v = JSON.parse(localStorage.getItem("scaleTellSocial14") || "{}");
  if (v && typeof v === "object" && !Array.isArray(v))
    for (let k of Object.keys(SOCIAL_DEFAULT))
      if (typeof v[k] === "string" && v[k] && officialSocialUrl(v[k], k)) socialLinks[k] = v[k];
} catch (e) {}
let savedVet = { name: "", phone: "", emergencyName: "", emergencyPhone: "", notes: "" };
try {
  let v = JSON.parse(localStorage.getItem("scaleTellVet14") || "{}");
  if (v && typeof v === "object" && !Array.isArray(v)) {
    savedVet.name = String(v.name || "").slice(0, 100);
    savedVet.phone = String(v.phone || "").slice(0, 32);
    savedVet.emergencyName = String(v.emergencyName || "").slice(0, 100);
    savedVet.emergencyPhone = String(v.emergencyPhone || "").slice(0, 32);
    savedVet.notes = String(v.notes || "").slice(0, 250);
  }
} catch (e) {}
let helpAnimal = "";
let helpConcern = "mouth";
let guideFilter = "";
let guidePage = 0;
let profilePhotos = {};
try {
  let v = JSON.parse(localStorage.getItem("scaleTellProfilePhotos15") || "{}");
  if (v && typeof v === "object" && !Array.isArray(v)) profilePhotos = v;
} catch (e) {}
const NOTIFY_DEFAULT = { feeding: true, shed: true, enclosure: true, other: true };
let notificationPrefs = { ...NOTIFY_DEFAULT };
try {
  let v = JSON.parse(localStorage.getItem("scaleTellNotifyPrefs15") || "{}");
  if (v && typeof v === "object" && !Array.isArray(v))
    for (let k of Object.keys(NOTIFY_DEFAULT)) if (typeof v[k] === "boolean") notificationPrefs[k] = v[k];
} catch (e) {}
const GENERIC_PORTRAITS = {
  "ball-python": "ball-python.webp",
  "corn-snake": "corn-snake.webp",
  kingsnake: "kingsnake.webp",
  hognose: "hognose.webp",
  "garter-snake": "garter-snake.webp",
  "milk-snake": "milk-snake.webp",
  "boa-constrictor": "boa-constrictor.webp",
  "reticulated-python": "reticulated-python.webp",
  "green-tree-python": "green-tree-python.webp",
  "carpet-python": "carpet-python.webp",
  "kenyan-sand-boa": "kenyan-sand-boa.webp",
  "rosy-boa": "rosy-boa.webp",
  "bearded-dragon": "bearded-dragon.webp",
  "leopard-gecko": "leopard-gecko.webp",
  "crested-gecko": "crested-gecko.webp",
  "day-gecko": "day-gecko.webp",
  chameleon: "chameleon.webp",
  skink: "skink.webp",
  tortoise: "tortoise.webp",
  "box-turtle": "box-turtle.webp",
  "aquatic-turtle": "aquatic-turtle.webp",
  frog: "frog.webp",
  axolotl: "axolotl.webp",
  tarantula: "tarantula.webp",
  "whites-tree-frog": "whites-tree-frog.webp",
  "african-dwarf-frog": "african-dwarf-frog.webp",
  "pacman-frog": "pacman-frog.webp",
  "sulcata-tortoise": "sulcata-tortoise.webp",
  scorpion: "scorpion.webp",
  millipede: "millipede.webp",
  isopod: "isopod.webp",
  snake: "ball-python.webp",
  gecko: "leopard-gecko.webp",
  lizard: "skink.webp",
  turtle: "aquatic-turtle.webp",
  amphibian: "frog.webp",
  reptile: "skink.webp",
  invertebrate: "invertebrate.webp",
  other: "other.webp",
  "jumping-spider": "invertebrate.webp",
  "tokay-gecko": "tokay-gecko.webp",
};
function speciesPortraitKey(value) {
  let s = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
  if (/african dwarf frog/.test(s)) return "african-dwarf-frog";
  if (/whites|white.s tree frog|dumpy tree frog/.test(s)) return "whites-tree-frog";
  if (/pac.?man|pacman/.test(s)) return "pacman-frog";
  if (/sulcata/.test(s)) return "sulcata-tortoise";
  if (/box turtle/.test(s)) return "box-turtle";
  if (/aquatic turtle|slider|painted turtle|musk turtle|map turtle/.test(s)) return "aquatic-turtle";
  if (/kenyan|sand boa/.test(s)) return "kenyan-sand-boa";
  if (/rosy boa/.test(s)) return "rosy-boa";
  if (/boa/.test(s)) return "boa-constrictor";
  if (/reticulated|retic python/.test(s)) return "reticulated-python";
  if (/green tree python/.test(s)) return "green-tree-python";
  if (/carpet python/.test(s)) return "carpet-python";
  if (/ball python|royal python/.test(s)) return "ball-python";
  if (/corn snake/.test(s)) return "corn-snake";
  if (/king.?snake/.test(s)) return "kingsnake";
  if (/milk.?snake/.test(s)) return "milk-snake";
  if (/hognose/.test(s)) return "hognose";
  if (/garter/.test(s)) return "garter-snake";
  if (/python/.test(s)) return "ball-python";
  if (/snake/.test(s)) return "snake";
  if (/bearded|beardie/.test(s)) return "bearded-dragon";
  if (/leopard gecko/.test(s)) return "leopard-gecko";
  if (/tokay/.test(s)) return "tokay-gecko";
  if (/crested gecko/.test(s)) return "crested-gecko";
  if (/day gecko/.test(s)) return "day-gecko";
  if (/gecko/.test(s)) return "gecko";
  if (/chameleon/.test(s)) return "chameleon";
  if (/blue tongue|blue tongued|skink/.test(s)) return "skink";
  if (/tortoise/.test(s)) return "tortoise";
  if (/turtle|terrapin/.test(s)) return "turtle";
  if (/bearded dragon|dragon|uromastyx|anole|iguana|monitor|tegu|lizard/.test(s)) return "lizard";
  if (/axolotl/.test(s)) return "axolotl";
  if (/frog|toad/.test(s)) return "frog";
  if (/newt|salamander/.test(s)) return "amphibian";
  if (/jumping spider|salticid/.test(s)) return "jumping-spider";
  if (/tarantula|spider/.test(s)) return "tarantula";
  if (/scorpion/.test(s)) return "scorpion";
  if (/millipede/.test(s)) return "millipede";
  if (/isopod|roly poly/.test(s)) return "isopod";
  if (/invert|insect/.test(s)) return "invertebrate";
  if (s === "other" || s === "unknown") return "other";
  return "other";
}
function portraitForAnimal(a) {
  let selected = chosenProfilePhoto(a);
  return {
    src: selected?.src || GENERIC_PORTRAITS[speciesPortraitKey(species[a])] || GENERIC_PORTRAITS.other,
    custom: !!selected,
  };
}
const HOME_CLEAN_SLATE = "home-clean-slate.webp";
const HOME_DEFAULT_CARDS = ["home-card-1.webp", "home-card-2.webp", "home-card-3.webp"];
const HOME_CARD_SLOTS = [
  [2.384501, 31.296572],
  [34.575261, 30.774963],
  [66.169896, 31.520119],
];
function renderHomeCards() {
  const row = document.getElementById("homeReptileRow");
  if (!row) return;
  homeNavApply();
  try { homeRescueStrip(); } catch (e) {}
  if (homeBusinessMode()) return renderHomeBusiness(row);
  homeResetPersonal();
  const count = document.getElementById("homeCount");
  const logs = entries.filter((e) => e.section !== "Calendar").length;
  if (count)
    count.innerHTML = stBadgeMarkup() + (animals.length
      ? " " + esc(animals.length + (animals.length === 1 ? " reptile" : " reptiles") + " · " + logs + (logs === 1 ? " care log" : " care logs"))
      : "");
  row.classList.toggle("homeRowEmpty", !animals.length);
  if (!animals.length) {
    row.innerHTML =
      '<button class="homeFirst" onclick="addAnimal()"><span class="homeFirstPlus" aria-hidden="true">＋</span><strong>Add your first animal</strong><small>Name, species and feeding schedule. Takes about a minute.</small></button>';
    return;
  }
  const sexMark = (a) => {
    const x = sexOf(a);
    return x === "male" ? ' <span class="sexM" aria-label="male">♂</span>' : x === "female" ? ' <span class="sexF" aria-label="female">♀</span>' : "";
  };
  row.innerHTML =
    animals
      .map(
        (a, i) =>
          '<button class="homeCard" onclick="homeAnimalClick(' +
          i +
          ')" aria-label="Open ' +
          esc(a) +
          ' profile"><img src="' +
          esc(portraitForAnimal(a).src) +
          '" alt="" loading="lazy"><span class="homeCardText"><b>' +
          esc(a) +
          sexMark(a) +
          "</b><small>" +
          esc(species[a] || "Reptile") +
          "</small></span></button>",
      )
      .join("") +
    '<button class="homeCard homeCardAdd" onclick="addAnimal()" aria-label="Add an animal"><span aria-hidden="true">＋</span><small>Add animal</small></button>';
}
function homeAnimalClick(i) {
  if (animals[i]) openPanel(animals[i]);
  else addAnimal();
}
function photoKey(p) {
  if (!p || typeof p.src !== "string") return "";
  let x = p.src,
    h = 2166136261;
  for (let i = 0; i < Math.min(360, x.length); i++) h = Math.imul(h ^ x.charCodeAt(i), 16777619);
  for (let i = Math.max(360, x.length - 360); i < x.length; i++) h = Math.imul(h ^ x.charCodeAt(i), 16777619);
  return x.length + "-" + (h >>> 0).toString(36);
}
function chosenProfilePhoto(a) {
  return (photos[a] || []).find((p) => photoKey(p) === profilePhotos[a]) || null;
}
function profilePicture(a, cls = "profilePic") {
  let p = portraitForAnimal(a);
  return (
    '<img class="' +
    cls +
    '" src="' +
    p.src +
    '" alt="' +
    esc(a) +
    (p.custom ? " profile photo" : " generic " + (species[a] || "reptile") + " illustration") +
    '">'
  );
}
function chooseProfilePhoto(i) {
  let a = document.getElementById("photoAnimal")?.value,
    p = photos[a]?.[i];
  if (!p) return;
  let next = { ...profilePhotos, [a]: photoKey(p) };
  try {
    scaleStoreSet("scaleTellProfilePhotos15", JSON.stringify(next));
    profilePhotos = next;
    renderPhotos();
    renderHomeCards();
    let hero = document.querySelector(".profileHero .profilePic");
    if (hero && current === a) {
      let nextPic = portraitForAnimal(a);
      hero.src = nextPic.src;
      hero.alt = a + " profile photo";
    }
    photoStatus("✓ " + a + "’s profile picture updated on Home, My Reptiles and their profile.", true);
  } catch (e) {
    photoStatus("Could not save the profile photo selection. Browser storage may be full.", false);
  }
}
function clearProfilePhoto() {
  let a = document.getElementById("photoAnimal")?.value;
  if (!a || !profilePhotos[a]) return;
  let next = { ...profilePhotos };
  delete next[a];
  try {
    scaleStoreSet("scaleTellProfilePhotos15", JSON.stringify(next));
    profilePhotos = next;
    renderPhotos();
    renderHomeCards();
    let hero = document.querySelector(".profileHero .profilePic");
    if (hero && current === a) {
      let fallback = portraitForAnimal(a);
      hero.src = fallback.src;
      hero.alt = a + " default illustration";
    }
    photoStatus(
      "✓ " +
        a +
        " now uses the generic " +
        (species[a] || "pet") +
        " illustration. Their saved pictures are still in the gallery.",
      true,
    );
  } catch (e) {
    photoStatus("Could not update the profile image selection.", false);
  }
}
function photoCategory(detail) {
  let d = String(detail || "").toLowerCase();
  return d.includes("feed")
    ? "feeding"
    : d.includes("shed")
      ? "shed"
      : d.includes("enclosure") || d.includes("habitat")
        ? "enclosure"
        : "other";
}
function saveNotifyPrefs() {
  let next = {};
  for (let k of Object.keys(NOTIFY_DEFAULT)) next[k] = !!document.getElementById("notify_" + k)?.checked;
  try {
    scaleStoreSet("scaleTellNotifyPrefs15", JSON.stringify(next));
    notificationPrefs = next;
    render();
    if (pushDeviceEnabled) pushSyncPreferences();
  } catch (e) {
    alert("Could not save notification preferences on this device.");
  }
}

/* V3.19: catalogue is publicly visible to signed-in keepers; extras are gated by
   an owner-scoped, server-provided entitlement. No purchase/payment is active yet.
   Client-side source is not a DRM boundary: deploy printable generation on a
   server before relying on it for strong paid-content protection. */
const ST_THEME_KEY = "scaleTellCosmeticTheme18";
const ST_THEME_IDS = ["original", "forest", "violet", "cream"];
const ST_THEME_NAMES = { original: "Original", forest: "Forest Green", violet: "Deep Purple", cream: "Warm Cream" };
let stSavedTheme = "original",
  stPreviewTheme = null,
  stEntitlementUser = null,
  stEntitlementActive = false,
  stEntitlementRequest = 0;
try {
  let v = localStorage.getItem(ST_THEME_KEY);
  if (ST_THEME_IDS.includes(v)) stSavedTheme = v;
} catch (e) {}
function stCanUsePack() {
  return !!(stEntitlementActive && cloudSession?.user?.id && stEntitlementUser === cloudSession.user.id);
}
/* V3.36 · Plans. Keepers are hobby owners; Breeders get racks, pairings and clutches. */
const ST_PLANS = {
  member: { name: "Herps & Hers Member", limit: 20 },
  founding_keeper: { name: "Founding Keeper", limit: 40, badge: true },
  founding_breeder: { name: "Founding Breeder", limit: 150, badge: true, breeder: true },
  rescue: { name: "Rescue", limit: 400, badge: true, breeder: true },
  premium_breeder: { name: "Premium Breeder", limit: 400, badge: true, breeder: true },
};
const ST_PLAN_ORDER = ["premium_breeder", "rescue", "founding_breeder", "founding_keeper", "member"];
// Founding Keepers who bought before breeder tiers existed keep their breeder tools forever.
const ST_BREEDER_CUTOFF = "2026-10-19";
let stSkus = [],
  stFkSince = "";
function stOwnsEntitlements() {
  // The home screen draws once before sign-in is set up, so this must not touch cloudSession too early.
  try {
    return !!(cloudSession?.user?.id && stEntitlementUser === cloudSession.user.id);
  } catch (e) {
    return false;
  }
}
function stPlan() {
  if (!stOwnsEntitlements()) return "";
  return ST_PLAN_ORDER.find((k) => stSkus.includes(k)) || "";
}
function stAnimalLimit() {
  const p = stPlan();
  return p ? ST_PLANS[p].limit : 20;
}
function stCanUseBreeder() {
  if (!stOwnsEntitlements()) return false;
  if (stSkus.some((k) => ST_PLANS[k]?.breeder)) return true;
  return stSkus.includes("founding_keeper") && !!stFkSince && stFkSince < ST_BREEDER_CUTOFF;
}
function stBadgeMarkup() {
  const p = stPlan();
  return p && ST_PLANS[p].badge ? '<span class="stBadge" title="' + esc(ST_PLANS[p].name) + '">✓ ' + esc(ST_PLANS[p].name) + "</span>" : "";
}
function stCanAddAnimal() {
  if (animals.length < stAnimalLimit()) return true;
  openPanel("Plans");
  stToast("Your plan holds " + stAnimalLimit() + " animals. Upgrade to add more ♡");
  return false;
}
/* A business's own brand color replaces the app design everywhere, so every device looks the same. */
function stBrandActive() {
  if (typeof window.__stBrandOn === "boolean") return window.__stBrandOn;
  try {
    const c = JSON.parse(localStorage.getItem("scaleTellBrandCache") || "null");
    return !!(c && /^#[0-9a-f]{6}$/i.test(c.brand?.accent || "") && c.uid === localStorage.getItem("scaleTellSyncOwner33"));
  } catch (e) { return false; }
}
function stSetTheme(v) {
  if (stBrandActive() && stPreviewTheme === null) v = "original";
  document.body.dataset.stTheme = ST_THEME_IDS.includes(v) ? v : "original";
  let meta = document.querySelector('meta[name="theme-color"]');
  if (meta)
    meta.content = { original: "#45205b", forest: "#142b24", violet: "#20142d", cream: "#f5eedb" }[v] || "#45205b";
}
/* V3.53 · Show a keeper's own colors instantly on launch, from the last confirmed sign-in on this device. */
function stLastOwner() {
  try { return localStorage.getItem("scaleTellSyncOwner33") || ""; } catch (e) { return ""; }
}
function stThemeCacheOk(uid) {
  try { return !!uid && localStorage.getItem("scaleTellThemeUid") === uid; } catch (e) { return false; }
}
stSetTheme(stThemeCacheOk(stLastOwner()) ? stSavedTheme : "original");
/* V3.53 · Launch splash: on a signed-in device, hold one calm loading screen until the account,
   plan, brand colors and journal are ready, so the screen never flips between layouts. */
function stBootBegin(text) {
  let who = "start";
  try { who = cloudSession?.user?.id || "start"; } catch (e) {}
  if (document.body.classList.contains("stBooting") || window.__stBootDoneFor === who) return;
  const go = () => {
    if (document.getElementById("stBoot")) return;
    document.body.classList.add("stBooting");
    const d = document.createElement("div");
    d.id = "stBoot";
    d.innerHTML = '<div class="stBootInner"><img alt="" src="icon-192.png"><b>Scale &amp; Tell</b><small>' + (text || "Loading your journal…") + '</small></div>';
    document.body.appendChild(d);
    window.__stBootAt = Date.now();
    clearInterval(window.__stBootTimer);
    window.__stBootTimer = setInterval(stBootCheck, 150);
  };
  if (document.body) go(); else document.addEventListener("DOMContentLoaded", go);
}
(function stBootStart() {
  let saved = false;
  try { if (sessionStorage.getItem("scaleTellCodeToast") !== null) saved = true; } catch (e) {}
  try { for (let i = 0; i < localStorage.length; i++) if (/^sb-.*-auth-token$/.test(localStorage.key(i) || "")) saved = true; } catch (e) {}
  if (saved) stBootBegin();
})();
function stBootDone() {
  if (!document.body.classList.contains("stBooting")) return;
  try { window.__stBootDoneFor = cloudSession?.user?.id || "start"; } catch (e) { window.__stBootDoneFor = "start"; }
  clearInterval(window.__stBootTimer);
  document.body.classList.remove("stBooting");
  const d = document.getElementById("stBoot");
  if (d) { d.classList.add("out"); setTimeout(() => d.remove(), 350); }
}
function stBootCheck() {
  try {
    if (Date.now() - (window.__stBootAt || 0) > 12000) return stBootDone();
    if (typeof cloudAuthReady === "undefined" || !cloudAuthReady) return;
    if (!cloudSession) return stBootDone();
    if (!stAccessChecked) return;
    if (window.__stReloading) return;
    let pend = "";
    try { pend = localStorage.getItem("scaleTellPendingCode") || ""; } catch (e) {}
    if (pend && !stPendingCodeTried) return; // still applying a code typed at sign-up
    if (!stCanUseApp()) return stBootDone();
    if (!["synced", "empty", "error", "offline", "other-user", "migration", "choose", "conflict", "merge-review", "remote-ready"].includes(cloudAutoStatus)) return;
    if (!window.__stBrandLoaded) return;
    try { renderHomeCards(); } catch (e) {}
    stBootDone();
  } catch (e) { stBootDone(); }
}
let stMemberAccess = false,
  stAccessChecked = false,
  stAccessFailed = false;
function stCanUseApp() {
  return !!(cloudSession?.user?.id && stEntitlementUser === cloudSession.user.id && (stEntitlementActive || stMemberAccess));
}
function founderClearEntitlement() {
  stSkus = [];
  stFkSince = "";
  stEntitlementRequest++;
  stEntitlementUser = null;
  stEntitlementActive = false;
  stMemberAccess = false;
  stAccessChecked = false;
  stAccessFailed = false;
  stPreviewTheme = null;
  stSetTheme("original");
  window.__stIsAdmin = false;
  try { stEmailPref = null; } catch (e) {}
  try { bizBrand = null; bizApplyBrand(); } catch (e) {}
  if (current === "Founding Keeper Studio") render();
}
async function founderRefreshEntitlement() {
  const requestedId = cloudSession?.user?.id;
  const request = ++stEntitlementRequest;
  stEntitlementUser = null;
  stEntitlementActive = false;
  stPreviewTheme = null;
  stSetTheme(stThemeCacheOk(requestedId) ? stSavedTheme : "original");
  if (current === "Founding Keeper Studio") render();
  if (!requestedId || !cloudClient) return;
  try {
    const user = await cloudAuthorizedUser();
    if ((user.realId || user.id) !== requestedId) return;
    const { data, error } = await cloudClient
      .from("keeper_entitlements")
      .select("sku,status,verified_at,expires_at")
      .eq("user_id", requestedId);
    if (error) throw error;
    if (request !== stEntitlementRequest || cloudSession?.user?.id !== requestedId) return;
    const rows = Array.isArray(data) ? data : data ? [data] : [];
    stEntitlementUser = requestedId;
    const live = rows.filter((r) => r.status === "active" && (!r.expires_at || new Date(r.expires_at) > new Date()));
    stSkus = live.map((r) => r.sku);
    const team = await stSyncTeam();
    if (request !== stEntitlementRequest) return;
    if (team?.role === "member") {
      stSkus = Array.from(new Set([...(team.skus || []), ...stSkus]));
      live.push({ sku: "team" });
    }
    stFkSince = String(live.find((r) => r.sku === "founding_keeper")?.verified_at || "").slice(0, 10);
    // Every paid plan includes the Founding Keeper extras (designs, Care Binder, keepsakes).
    stEntitlementActive = live.some((r) => r.sku !== "member");
    stMemberAccess = rows.some((r) => r.sku === "member" && r.status === "active");
    stAccessChecked = true;
    stAccessFailed = false;
    stSetTheme(stEntitlementActive ? stSavedTheme : "original");
    try {
      if (stEntitlementActive) localStorage.setItem("scaleTellThemeUid", requestedId);
      else localStorage.removeItem("scaleTellThemeUid");
    } catch (e) {}
  } catch (e) {
    if (request !== stEntitlementRequest) return;
    stEntitlementActive = false;
    stEntitlementUser = null;
    // A network problem must not lock a keeper out; the server still checks access on every save.
    stAccessChecked = true;
    stAccessFailed = true;
    stSetTheme(stThemeCacheOk(requestedId) ? stSavedTheme : "original");
  } finally {
    if (request === stEntitlementRequest) {
      updateAuthGate();
      if (stCanUseApp() && ["empty", "synced"].includes(cloudAutoStatus)) cloudSetStatus(cloudAutoStatus);
      setTimeout(stMaybeShowUpgrade, 1500);
      setTimeout(() => { try { if (stCanUseApp() && ["empty", "synced"].includes(cloudAutoStatus)) cloudSetStatus(cloudAutoStatus); } catch (e) {} }, 1200);
      setTimeout(rescueMaybeAskLayout, 1800);
      setTimeout(stAdminCheck, 1200);
      setTimeout(stApplySignupEmailChoice, 1400);
      try { renderHomeCards(); } catch (e) {}
      setTimeout(bizQueueAuto, 2500);
      if (!window.__stTransferChecked) { window.__stTransferChecked = true; setTimeout(transferCheck, 3500); }
      if (["Founding Keeper Studio", "Plans", "Upgrade"].includes(current)) render();
    }
  }
}
function founderChooseTheme(v) {
  if (!stCanUsePack() || !ST_THEME_IDS.includes(v)) return;
  stPreviewTheme = v;
  stSetTheme(v);
  document
    .querySelectorAll(".studioTheme")
    .forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.theme === v)));
  let t = document.getElementById("studioThemeStatus");
  if (t) t.textContent = "Showing " + ST_THEME_NAMES[v] + ". Save to apply your selection.";
}
function founderCancelPreview() {
  if (stPreviewTheme !== null) {
    stPreviewTheme = null;
    stSetTheme(stCanUsePack() ? stSavedTheme : "original");
  }
}
function founderSaveTheme() {
  if (!stCanUsePack()) return;
  const v = stPreviewTheme || stSavedTheme;
  try {
    localStorage.setItem(ST_THEME_KEY, v);
    stSavedTheme = v;
    stPreviewTheme = null;
    stSetTheme(v);
    try { accountPrefsSet("theme", v); save(); } catch (e) {}
    let t = document.getElementById("studioThemeStatus");
    if (t)
      t.textContent = "✓ " + ST_THEME_NAMES[v] + " saved on all your devices. Your journal and photos were not changed.";
  } catch (e) {
    let t = document.getElementById("studioThemeStatus");
    if (t) t.textContent = "Could not save this preference. Your records were not changed.";
  }
}
function founderThemeButton(id, description, bg, panel, accent) {
  let inner =
    '<div class="studioSwatch" style="background:' +
    bg +
    '"><i style="background:' +
    panel +
    '"></i><i style="background:' +
    accent +
    ';width:23%"></i></div><strong>' +
    ST_THEME_NAMES[id] +
    "</strong><small>" +
    description +
    "</small>";
  if (!stCanUsePack())
    return (
      '<div class="studioTheme studioThemeLook" role="img" aria-label="' +
      ST_THEME_NAMES[id] +
      ' theme design. Available with Founding Keeper Pack">' +
      inner +
      '<span class="themeLock">' +
      (id === "original" ? "Current free look" : "♡ Pack design") +
      "</span></div>"
    );
  return (
    '<button type="button" class="studioTheme" data-theme="' +
    id +
    '" aria-pressed="' +
    String((stPreviewTheme || stSavedTheme) === id) +
    '" onclick="founderChooseTheme(\'' +
    id +
    "')\">" +
    inner +
    "</button>"
  );
}
function founderPackAction(kind, label) {
  return stCanUsePack()
    ? '<button class="action" onclick="founderOpenPrint(\'' + kind + "')\">" + label + "</button>"
    : "";
}
/* ===================== V3.22 · Founding Keeper checkout (PayPal) ===================== */
/* The PayPal account (test or live) is decided on the server, so switching to live needs no app update. */
let paypalConfig = null,
  paypalSdkLoader = null,
  founderPaying = false;
function founderCheckoutMarkup() {
  if (!cloudSession) return '<p class="lcSmall">Sign in to purchase.</p>';
  return (
    '<div class="founderCheckout">' +
    '<p class="founderTestNote" id="founderTestNote" hidden>Test mode: use a PayPal sandbox account. No real money is charged.</p>' +
    (stOwnsEntitlements() && stSkus.includes("member")
      ? '<label class="authField" for="founderGroupName">Your name in the Herps &amp; Hers group (optional)</label><input id="founderGroupName" maxlength="80" autocomplete="name" placeholder="So we can add your badge in the group ♡">'
      : "") +
    '<div id="paypalButtons" aria-label="Pay with PayPal"></div><p id="founderPayStatus" class="studioStatus" role="status"></p><p class="lcSmall">Every paid plan supports the Herps &amp; Hers community&#39;s growth and future projects, and Scale &amp; Tell&#39;s growth. 10% of paid-plan profits are donated to a nonprofit reptile rescue.</p></div>'
  );
}
function founderPayStatus(msg) {
  const el = document.getElementById("founderPayStatus");
  if (el) el.textContent = msg;
}
async function founderPayPalConfig() {
  if (paypalConfig) return paypalConfig;
  const { data, error } = await cloudClient.functions.invoke("founder-checkout", { body: { action: "config" } });
  if (error || !data?.ready || typeof data.clientId !== "string" || !/^[A-Za-z0-9_-]{40,}$/.test(data.clientId))
    throw Error("Checkout is being set up. Please check back soon.");
  paypalConfig = data;
  return data;
}
function founderLoadPayPal(clientId) {
  if (window.paypal?.Buttons) return Promise.resolve(window.paypal);
  if (paypalSdkLoader) return paypalSdkLoader;
  paypalSdkLoader = new Promise((resolve, reject) => {
    const tag = document.createElement("script");
    tag.src =
      "https://www.paypal.com/sdk/js?client-id=" +
      encodeURIComponent(clientId) +
      "&currency=USD&intent=capture&components=buttons&enable-funding=venmo";
    tag.onload = () => (window.paypal?.Buttons ? resolve(window.paypal) : reject(Error("PayPal did not load.")));
    tag.onerror = () => reject(Error("PayPal could not load. Check your connection and try again."));
    document.head.appendChild(tag);
  }).catch((e) => {
    paypalSdkLoader = null;
    throw e;
  });
  return paypalSdkLoader;
}
/* A sign-in that went stale (other tab, long sleep) is refreshed once. If it can't be, the person is sent to Sign In with a clear note. */
async function stSessionRecover() {
  try {
    const { data, error } = await cloudClient.auth.refreshSession();
    if (!error && data?.session) { cloudSession = data.session; return true; }
  } catch (e) {}
  try { await cloudClient.auth.signOut({ scope: "local" }); } catch (e) {}
  cloudSession = null;
  try { authMode = "signin"; updateAuthGate(); setTimeout(() => cloudMsg("For your security, please sign in again. Nothing was charged and nothing was lost."), 50); } catch (e) {}
  return false;
}
async function founderInvoke(body) {
  let { data, error } = await cloudClient.functions.invoke("founder-checkout", { body });
  if (error && error.context?.status === 401 && (await stSessionRecover())) ({ data, error } = await cloudClient.functions.invoke("founder-checkout", { body }));
  if (error) {
    let msg = "";
    try {
      msg = (await error.context?.json?.())?.error || "";
    } catch (e) {}
    throw Error(msg || "Checkout is unavailable right now. Please try again.");
  }
  return data || {};
}
async function founderMountPayPal() {
  const box = document.getElementById("paypalButtons");
  if (!box || box.dataset.mounted || stCanUsePack() || !cloudSession || !cloudClient) return;
  box.dataset.mounted = "1";
  founderPayStatus("Loading secure checkout…");
  try {
    const conf = await founderPayPalConfig();
    const note = document.getElementById("founderTestNote");
    if (note) note.hidden = !!conf.live;
    const paypal = await founderLoadPayPal(conf.clientId);
    if (!document.body.contains(box)) return;
    founderPayStatus("");
    await paypal
      .Buttons({
        style: { layout: "vertical", color: "gold", shape: "pill", label: "pay", height: 45 },
        createOrder: async () => {
          founderPayStatus("");
          const data = await founderInvoke({ action: "create" });
          if (data.active) {
            founderPayStatus("✓ You already have Founding Keeper access.");
            founderRefreshEntitlement();
            throw Error("already owned");
          }
          if (!data.id) throw Error(data.error || "Could not start checkout.");
          return data.id;
        },
        onApprove: async (d) => {
          if (founderPaying) return;
          founderPaying = true;
          founderPayStatus("Confirming your payment with PayPal…");
          try {
            const data = await founderInvoke({
              action: "capture",
              orderId: d.orderID,
              groupName: (document.getElementById("founderGroupName")?.value || "").trim().slice(0, 80),
            });
            if (!data.active) throw Error(data.error || "Payment could not be confirmed.");
            founderPayStatus("✓ Thank you, Founding Keeper ♡ Everything is unlocked.");
            await founderRefreshEntitlement();
            cloudSetStatus(cloudAutoStatus);
          } catch (e) {
            founderPayStatus(
              e?.message || "Payment could not be confirmed. If you were charged, contact " + SCALE_SUPPORT_EMAIL + ".",
            );
          } finally {
            founderPaying = false;
          }
        },
        onCancel: () => founderPayStatus("Checkout cancelled. You were not charged."),
        onError: (err) => {
          if (String(err?.message || err).includes("already owned")) return;
          founderPayStatus("Something went wrong with checkout. You were not charged. Please try again.");
        },
      })
      .render(box);
  } catch (e) {
    box.dataset.mounted = "";
    founderPayStatus(e?.message || "Checkout could not load.");
  }
}
function founderStudioMarkup() {
  let access = stCanUsePack();
  return (
    '<div class="studioTile studioIntro"><h3>Here’s what you get as a Founding Keeper ♡</h3><p><strong>$14.99 · one-time, optional.</strong> Your everyday care tracking and cloud journal remain free.</p><p><b>Everything you get:</b></p><ul class="fkList"><li>Room for <b>40 animals</b></li><li><b>3 logins</b> to share your journal with family</li><li><b>Vet &amp; medication reminders</b> on your phone</li><li><b>Shed predictions</b> from each animal’s own history</li><li><b>Photo progress</b>: then-and-now growth photos to share</li><li><b>Emergency card</b>: printable and lock-screen</li><li>Four app designs, your Care Binder, My Year in Scales and keeper printables</li><li>Your ✓ Founding Keeper badge</li></ul><p>Browse the designs and keepsakes below.</p>' +
    (access
      ? '<p class="studioPackNote">✓ Your verified Founding Keeper access is active.</p>'
      : '<p class="studioPackNote">Unlocks automatically on this account right after payment. No subscription.</p>' +
        founderCheckoutMarkup()) +
    "</div>" +
    '<div class="studioTile"><h3>Four beautiful app looks ♡</h3><p>The classic look is free. Preview the three additional styles here; applying them requires a verified Founding Keeper purchase.</p><div class="studioThemes">' +
    founderThemeButton("original", "Classic lavender and ivory", "#f4e5f3", "#fff8f3", "#79538e") +
    founderThemeButton("forest", "Dark evergreen and sage", "#142b24", "#223d32", "#bcd5a0") +
    founderThemeButton("violet", "Dark plum and lilac", "#20142d", "#302040", "#d6afea") +
    founderThemeButton("cream", "Ivory and warm natural tones", "#f5eedb", "#fffaf0", "#765b42") +
    "</div>" +
    (access
      ? '<div class="studioActions"><button class="action" onclick="founderSaveTheme()">Save theme</button><button class="action secondary" onclick="founderCancelPreview();render()">Cancel selection</button></div><p id="studioThemeStatus" class="studioStatus" role="status">Choose a look to apply.</p>'
      : "") +
    "</div>" +
    '<div class="studioTile"><h3>Breeder tools ♡</h3><p>Racks and tubs, feed a whole rack in one go, pairings with lock and ovulation dates, clutches and incubation, and hatchlings linked to their parents.</p>' +
    (stCanUseBreeder()
      ? '<button class="action" onclick="openPanel(&quot;Racks & Breeding&quot;)">Open Racks &amp; Breeding</button>'
      : '<p class="lcSmall">Part of <b>Founding Breeder</b> ($19.99 a year).</p><button class="action secondary" onclick="openPanel(&quot;Plans&quot;)">See plans</button>') +
    "</div>" +
    '<div class="studioTile"><h3>Personalized Care Binder</h3><p>Your animal profiles, recent care history, upcoming tasks and saved vet details.</p>' +
    founderPackAction("binder", "Open Care Binder") +
    "</div>" +
    '<div class="studioTile"><h3>My Year in Scales ♡</h3><p>Your year as a slideshow: meals, sheds, growth, busiest month and your best photos, animal by animal.</p>' +
    (stCanUsePack() ? '<button class="action" onclick="yisOpen()">▶ Play My Year in Scales</button><button class="action secondary" onclick="founderOpenPrint(\'year\')">Printable version</button>' : "") +
    "</div>" +
    '<div class="studioTile"><h3>Keeper Printables</h3><p>Large photo-based enclosure cards, emergency quick-reference cards and a blank feeding record.</p>' +
    founderPackAction("printables", "Open Keeper Printables") +
    "</div>" +
    '<p class="lcSmall">One-time $14.99, no recurring charge. Paid securely through PayPal (PayPal balance or card). Your journal, reminders and backups stay free.</p>'
  );
}
function founderText(x) {
  return esc(String(x ?? "").slice(0, 1500));
}
function founderValue(v) {
  return v === null || v === undefined || v === "" ? '<span class="nr">Not recorded</span>' : founderText(v);
}
function founderPrintRow(label, value) {
  return '<tr><th scope="row">' + founderText(label) + "</th><td>" + founderValue(value) + "</td></tr>";
}
function founderAnimalCard(a) {
  let p = profiles[a] || {};
  return (
    '<section class="animal"><div class="animalHead">' +
    founderPrintPhoto(a) +
    "<div><h2>" +
    founderText(a) +
    '</h2><span class="chip">' +
    founderText(species[a] || "Other") +
    "</span></div></div><table>" +
    founderPrintRow("Sex", p.sex) +
    founderPrintRow("Morph", p.morph) +
    founderPrintRow("Hatch/Birth date", p.hatchDate) +
    founderPrintRow("Enclosure", p.enclosure) +
    founderPrintRow("Notes", p.notes) +
    founderPrintRow("Pet-sitter instructions", p.sitterInstructions) +
    founderPrintRow("Handling notes", p.handlingNotes) +
    "</table></section>"
  );
}
function founderEntryList(a, max = 30, section = "") {
  let records = entries
    .filter((e) => e.animal === a && e.section !== "Calendar" && (!section || e.section === section))
    .slice()
    .sort((x, y) => String(y.date).localeCompare(String(x.date)))
    .slice(0, max);
  return records.length
    ? "<table><thead><tr><th>Date</th><th>Care</th><th>Details</th></tr></thead><tbody>" +
        records
          .map(
            (e) =>
              '<tr><td class="d">' +
              founderText(niceDate(e.date)) +
              '</td><td><span class="tag">' +
              founderText(e.section) +
              "</span></td><td>" +
              founderText([e.detail, e.notes, e.preyType].filter(Boolean).join(" · ")) +
              "</td></tr>",
          )
          .join("") +
        "</tbody></table>"
    : '<p class="muted">No entries recorded yet.</p>';
}
function founderPrintPhoto(a) {
  const portrait = portraitForAnimal(a);
  let url = portrait?.src || "";
  // Bundled portraits are same-site files; the print window needs their absolute address.
  if (/^[a-z0-9-]+\.webp$/.test(url)) url = new URL(url, location.href).href;
  // Only embed safe in-memory image data or the app's own portrait files. No untrusted URL injection.
  if (
    !/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(url) &&
    !(url.startsWith(new URL("./", location.href).href) && /\/[a-z0-9-]+\.webp$/.test(url))
  )
    return '<div class="labelPhotoFallback">♡</div>';
  return '<img class="labelPhoto" src="' + url + '" alt="' + founderText(a) + ' profile portrait">';
}
function founderLargeCardRow(label, value, additionalClass = "") {
  return (
    '<div class="labelInfoRow ' +
    additionalClass +
    '"><div class="labelInfoLabel">' +
    founderText(label) +
    '</div><div class="labelInfoValue">' +
    founderValue(value) +
    "</div></div>"
  );
}
function founderUpcoming(a) {
  let upcoming = entries
    .filter((e) => e.animal === a && e.section === "Calendar" && !e.done)
    .slice()
    .sort((x, y) => String(x.date).localeCompare(String(y.date)))
    .slice(0, 8);
  return upcoming.length
    ? '<ul class="upcoming">' +
        upcoming
          .map(
            (e) =>
              '<li><span class="when">' +
              founderText(niceDate(e.date)) +
              "</span>" +
              founderText(e.detail) +
              (e.date < today() ? ' <span class="overdue">overdue</span>' : "") +
              "</li>",
          )
          .join("") +
        "</ul>"
    : '<p class="muted">No pending care reminders.</p>';
}
function founderDoc(kind) {
  if (!stCanUsePack()) return "";
  let title =
    { binder: "Personalized Care Binder", year: "My Year in Scales ♡", printables: "Keeper Printables" }[kind] ||
    "Keeper Collection";
  let output =
    '<header class="docHead"><img class="docIcon" src="' +
    new URL("icon-192.png", location.href).href +
    '" alt=""><div><div class="kicker">HERPS & HERS PRESENTS</div><h1>' +
    title +
    '</h1><p class="docMeta">Scale &amp; Tell · Generated ' +
    founderText(new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })) +
    '</p></div></header><p class="muted docNote">Created from your saved journal. Please review details before sharing or using as emergency instructions.</p>';
  if (!animals.length)
    output +=
      "<section><h2>Start with your first animal</h2><p>Add an animal and a care record in Scale & Tell, then regenerate this printable.</p></section>";
  if (kind === "binder") {
    output +=
      '<section class="vetBlock"><h2>Preferred veterinary contact</h2><table>' +
      founderPrintRow("Clinic", savedVet?.name) +
      founderPrintRow("Phone", savedVet?.phone) +
      "</table></section>";
    for (let a of animals) {
      const rr = profiles[a]?.rescue, md = (profiles[a]?.meds || []).filter((m) => !m.end || m.end >= today());
      output +=
        founderAnimalCard(a) +
        (rr ? '<section class="careBlock"><h3>♡ Rescue record</h3><table>' + founderPrintRow("Status", rr.status) + founderPrintRow("Intake", rr.intakeDate ? niceDate(rr.intakeDate) + (rr.source ? " · " + rr.source : "") : "") +
          founderPrintRow("Brought in by", [rr.surrenderedBy, rr.contact].filter(Boolean).join(" · ")) + founderPrintRow("On arrival", [rr.condition, rr.issues].filter(Boolean).join(" · ")) +
          founderPrintRow("Quarantine", rescueQuarantine(a) ? "Day " + rescueQuarantine(a).day + " of " + rescueQuarantine(a).total + " (ends " + niceDate(rescueQuarantine(a).end) + ")" : "") +
          founderPrintRow("Next vet check", rr.vetDue ? niceDate(rr.vetDue) : "") + founderPrintRow("Foster", [rr.foster, rr.fosterContact].filter(Boolean).join(" · ")) +
          founderPrintRow("Adopter", [rr.adopter, rr.adopterContact, rr.adoptedDate ? niceDate(rr.adoptedDate) : ""].filter(Boolean).join(" · ")) + "</table></section>" : "") +
        (md.length ? '<section class="careBlock"><h3>♡ Medications</h3><table>' + md.map((m) => founderPrintRow(m.drug, [m.dose, "every " + (m.everyDays > 1 ? m.everyDays + " days" : "day") + " at " + (m.times || []).join(", "), m.end ? "until " + niceDate(m.end) : "", m.notes].filter(Boolean).join(" · "))).join("") + "</table></section>" : "") +
        '<section class="careBlock"><h3>♡ Upcoming care</h3>' +
        founderUpcoming(a) +
        "<h3>♡ Recent care history</h3>" +
        founderEntryList(a, 30) +
        "</section>";
    }
  }
  if (kind === "year") {
    let d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    let start = d.toISOString().slice(0, 10);
    for (let a of animals) {
      let records = entries.filter((e) => e.animal === a && e.section !== "Calendar" && e.date >= start);
      let all = photos[a] || [],
        chosen = all.slice(-4);
      output +=
        '<section class="animal">' +
        founderAnimalCard(a) +
        '<h3>Your milestones, last 12 months</h3><div class="stats"><span>' +
        records.length +
        " care entries</span><span>" +
        records.filter((e) => e.section === "Feeding Tracker" && e.detail === "Ate").length +
        " recorded meals</span><span>" +
        records.filter((e) => e.section === "Shed History").length +
        " shed entries</span><span>" +
        records.filter((e) => e.section === "Weight Tracker").length +
        ' weights logged</span></div><h3>Moments worth remembering</h3><div class="photos">' +
        chosen
          .filter((p) => typeof p.src === "string" && /^data:image\/(jpeg|png|webp);base64,/.test(p.src))
          .map(
            (p) =>
              '<figure><img src="' +
              p.src +
              '" alt="Journal photograph"><figcaption>' +
              founderText(p.caption || p.date || "Journal photo") +
              "</figcaption></figure>",
          )
          .join("") +
        "</div><h3>Care highlights</h3>" +
        founderEntryList(a, 14) +
        "</section>";
    }
  }
  if (kind === "printables") {
    for (let a of animals) {
      let p = profiles[a] || {};
      output +=
        '<section class="labelCard">' +
        '<div class="labelKicker">SCALE & TELL <span>BY HERPS & HERS</span></div>' +
        '<div class="labelHero">' +
        founderPrintPhoto(a) +
        '<div class="labelIdentity"><h2>' +
        founderText(a) +
        "</h2><p>" +
        founderText(species[a] || "Reptile") +
        "</p></div></div>" +
        '<div class="labelInfo">' +
        founderLargeCardRow("Enclosure", p.enclosure) +
        founderLargeCardRow("Special instructions", p.sitterInstructions || p.notes, "labelInstructions") +
        founderLargeCardRow("Preferred veterinarian", savedVet?.name) +
        founderLargeCardRow("Vet phone", savedVet?.phone) +
        '</div><p class="labelFoot">Confirm care and medical instructions with the keeper and veterinarian.</p></section>';
    }
    output +=
      '<section class="feedingSheet"><h2>Blank feeding record</h2><table><tr><th>Animal</th><th>Date</th><th>Prey / food</th><th>Notes</th></tr>' +
      Array.from({ length: 12 }, () => "<tr><td>&nbsp;</td><td></td><td></td><td></td></tr>").join("") +
      "</table></section>";
  }
  const styles =
    "*{box-sizing:border-box}body{font:14px Arial,sans-serif;color:#34263b;background:#fffaf5;max-width:840px;margin:0 auto;padding:24px;line-height:1.45}h1,h2,h3{color:#45205b}h1{font:italic 36px Georgia,serif}h2{font:italic 25px Georgia,serif;margin-bottom:6px}h3{font:italic 20px Georgia,serif}.kicker{color:#586c38;font-weight:bold;letter-spacing:2px;font-size:10px}.animal,section{background:white;border:1px solid #e1d3e5;border-radius:14px;padding:15px;margin:16px 0;break-inside:avoid}header{border-bottom:3px solid #79538e}.muted{font-size:12px;color:#666}table{border-collapse:collapse;width:100%;font-size:12px;margin:10px 0}td,th{border-bottom:1px solid #e3d7e7;padding:7px;text-align:left;vertical-align:top}th{width:30%;color:#45205b}small{font:12px Arial,sans-serif}.photos{display:grid;grid-template-columns:1fr 1fr;gap:9px}.photos img{display:block;width:100%;height:140px;object-fit:cover;border-radius:8px}.photos figure{margin:0}.photos figcaption{font-size:11px}.stats{display:flex;flex-wrap:wrap;gap:6px}.stats span{background:#e9ddef;padding:8px;border-radius:8px;font-size:12px}.printBar{position:sticky;top:0;background:#45205b;color:#fff;padding:12px;display:flex;justify-content:space-between;align-items:center;gap:10px}.printBar button{background:#fffaf5;color:#45205b;border:0;border-radius:7px;padding:9px 14px;font-weight:bold}.labelCard{border:2px dashed #79538e}/* High-contrast, large-format enclosure card with the animal profile picture. */.isPrintables .labelCard{background:#fff;border:2.5px solid #45205b;border-radius:16px;padding:22px 24px;margin:22px auto;max-width:7.5in;color:#27202b;break-inside:avoid;page-break-inside:avoid;overflow-wrap:anywhere}.labelKicker{display:flex;justify-content:space-between;gap:10px;align-items:center;font:bold 12px Arial,sans-serif;letter-spacing:2px;color:#586c38;border-bottom:3px solid #79538e;padding-bottom:11px}.labelKicker span{font-size:10px;letter-spacing:1px;color:#45205b}.labelHero{display:flex;gap:20px;align-items:center;margin:18px 0 16px}.labelPhoto,.labelPhotoFallback{width:1.65in;height:1.65in;flex:0 0 1.65in;object-fit:cover;object-position:center;border-radius:12px;border:2px solid #79538e;background:#f5eefa;display:block}.labelPhotoFallback{display:flex;align-items:center;justify-content:center;font-size:44px;color:#79538e}.labelIdentity{min-width:0}.labelIdentity h2{font:italic bold 36px Georgia,serif;color:#45205b;margin:0 0 9px;line-height:1.1;overflow-wrap:anywhere}.labelIdentity p{font:700 19px Arial,sans-serif;margin:0;color:#27202b}.labelInfo{border-top:2px solid #e0d5e5}.labelInfoRow{padding:12px 0 13px;border-bottom:2px solid #e0d5e5}.labelInfoLabel{text-transform:uppercase;font:700 12px Arial,sans-serif;letter-spacing:1px;color:#45205b;margin-bottom:5px}.labelInfoValue{font:700 19px/1.32 Arial,sans-serif;white-space:pre-wrap;overflow-wrap:anywhere;color:#27202b}.labelInstructions .labelInfoValue{font-size:18px;font-weight:600}.labelFoot{font-size:11px!important;line-height:1.35;color:#56505b;margin:16px 0 0!important}.isPrintables .feedingSheet{break-before:page;page-break-before:always}@media(max-width:480px){.isPrintables .labelCard{padding:15px}.labelPhoto,.labelPhotoFallback{width:105px;height:105px;flex-basis:105px}.labelIdentity h2{font-size:31px}.labelIdentity p{font-size:17px}.labelInfoValue{font-size:18px}}@media print{body{background:white;max-width:none;padding:0}.printBar{display:none}section{border-color:#ddd;break-inside:avoid}header{margin-top:0}.isPrintables .labelCard{max-width:none;margin:0 auto;padding:0.22in 0.27in;break-after:page;page-break-after:always;border:2.5px solid #45205b;min-height:6.6in}.isPrintables .labelPhoto,.isPrintables .labelPhotoFallback{width:1.65in;height:1.65in;flex-basis:1.65in}.isPrintables .labelInfoValue{font-size:19pt}.isPrintables .labelInstructions .labelInfoValue{font-size:17pt}.isPrintables .labelInfoLabel{font-size:12pt}.isPrintables .labelIdentity h2{font-size:35pt}.isPrintables header{display:none}.isPrintables .labelFoot{font-size:11pt!important}.isPrintables .feedingSheet{break-before:page;page-break-before:always}}.docHead{display:flex;gap:16px;align-items:center;background:linear-gradient(120deg,#f3e6f7,#fff6ec);border:1px solid #e6d6ec;border-bottom:3px solid #79538e;border-radius:16px;padding:18px 20px;margin-top:14px}.docIcon{width:64px;height:64px;border-radius:14px;box-shadow:0 3px 10px #45205b33;flex:none}.docHead h1{margin:2px 0 4px;font-size:34px}.docMeta{margin:0;color:#5c4b66}.docNote{margin:10px 2px 0}.animal,section{box-shadow:0 2px 10px #45205b0f}.animal{border-top:4px solid #79538e}.animalHead{display:flex;gap:14px;align-items:center;margin-bottom:6px}.animalHead h2{margin:0 0 5px}.animalHead .labelPhoto,.animalHead .labelPhotoFallback{width:72px;height:72px;flex:0 0 72px;border-radius:50%;border:2px solid #d9c3e3;font-size:26px}.chip{display:inline-block;background:#efe4f4;color:#45205b;border-radius:999px;padding:3px 11px;font-size:12px;font-weight:600}th{color:#6a4a7c;font-weight:600}tbody tr:nth-child(even) td,table tr:nth-child(even) th,table tr:nth-child(even) td{background:#fbf7fc}thead th{background:#f1e7f5;color:#45205b;font-weight:700;width:auto}.nr{color:#a497ab;font-style:italic}.careBlock{background:#fffdfb}.careBlock h3{border-bottom:1px solid #eadfee;padding-bottom:4px;margin:14px 0 8px}.careBlock h3:first-child{margin-top:2px}.upcoming{list-style:none;padding:0;margin:0;display:grid;gap:6px}.upcoming li{background:#f7f0fa;border-left:3px solid #79538e;border-radius:8px;padding:7px 10px}.upcoming .when{display:block;font-size:11px;color:#6a4a7c;font-weight:700;letter-spacing:.3px}.overdue{background:#fbe3e3;color:#8a2c2c;border-radius:999px;padding:1px 7px;font-size:10px;font-weight:700;margin-left:4px}.tag{display:inline-block;background:#eef3e6;color:#3f5428;border-radius:999px;padding:2px 8px;font-size:11px;white-space:nowrap}td.d{white-space:nowrap;color:#5c4b66}.vetBlock{background:linear-gradient(120deg,#fff,#f8f2fb)}.docFoot{text-align:center;margin:22px 0 8px}@media print{*{-webkit-print-color-adjust:exact;print-color-adjust:exact}.animal,section{box-shadow:none}}";
  return (
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' +
    title +
    " · Scale & Tell</title><style>" +
    styles +
    '</style></head><body class=\"' +
    (kind === "printables" ? "isPrintables" : "") +
    '\"><div class=\"printBar\"><span>Private preview · Review before sharing</span><button onclick="window.print()">Print / Save as PDF</button></div>' +
    output +
    '<footer class="muted docFoot">♡ Scale &amp; Tell by Herps &amp; Hers · A personal keeper record, not veterinary advice.</footer></body></html>'
  );
}
function founderOpenPrint(kind) {
  if (!stCanUsePack() || !["binder", "year", "printables"].includes(kind)) return;
  const titles = { binder: "Care Binder", year: "My Year in Scales", printables: "Keeper Printables" };
  reportShow(titles[kind], bizBrandPrint(founderDoc(kind)));
}

let tourStep = 0;
let tourDevice = /Android/i.test(navigator.userAgent || "") ? "android" : "iphone";
function tourSetDevice(d) {
  tourDevice = d;
  render();
}
/* V3.32 · Reminders turn on right inside the welcome slide, with honest guidance per phone. */
function tourReminderBlock(inApp) {
  const head = "<h4>" + (inApp ? "" : "2 · ") + "Turn on care reminders 🔔</h4>";
  if (pushDeviceEnabled)
    return (
      head +
      '<p class="tourOk">✓ Reminders are on for this phone. You&#39;ll get a daily summary of what&#39;s due, plus any timed reminders you set.</p><button class="action secondary" type="button" onclick="pushSendTest()">Send a test notification</button><p class="lcSmall" id="pushMessage" role="status"></p>'
    );
  if (pushInstalledIOS())
    return (
      head +
      '<p class="lcSmall">iPhone only sends app notifications to the <b>Home Screen icon</b>. After step 1, open Scale &amp; Tell from the new icon. This slide will then show a <b>Turn on reminders</b> button. (You can also find it later in <b>Calendar</b>.)</p>'
    );
  if (!pushCapable())
    return (
      head +
      '<p class="lcSmall">This browser can&#39;t show notifications. On Android, open Scale &amp; Tell in <b>Chrome</b>. On iPhone, open it from the Home Screen icon.</p>'
    );
  return (
    head +
    '<p class="lcSmall">Get a heads-up when feedings, cleanings and checks are due. Tap the button, then tap <b>Allow</b>.</p><button class="action" type="button" onclick="tourEnableReminders()">🔔 Turn on reminders</button><p class="lcSmall" id="pushMessage" role="status"></p>'
  );
}
async function tourEnableReminders() {
  pushNote("Connecting…");
  if (!pushReady) await pushCheckConfig();
  if (!pushReady) {
    pushNote(pushConfigError || "Reminders aren’t available right now. You can try again later from Calendar.");
    return;
  }
  await pushEnable();
  if (pushDeviceEnabled && current === "Welcome Tour") {
    render();
    pushNote("✓ Reminders are on. Tap Send a test notification to check.");
  }
}
function tourGetAppMarkup() {
  const link = "https://scaleandtell.app/";
  const tab = (id, label) =>
    '<button type="button" class="tourTab' +
    (tourDevice === id ? " on" : "") +
    '" aria-pressed="' +
    (tourDevice === id) +
    '" onclick="tourSetDevice(\'' +
    id +
    "')\">" +
    label +
    "</button>";
  const inApp = installStandalone();
  const steps =
    tourDevice === "iphone"
      ? (inApp
          ? ""
          : '<h4>1 · Add it to your Home Screen</h4><ol class="lcSteps"><li>Tap <b>Add to Home Screen</b> below. Your phone&#39;s share menu opens.</li><li>Scroll down the menu and tap <b>Add to Home Screen</b>, then <b>Add</b>.</li><li>Open Scale &amp; Tell from the new icon on your Home Screen.</li></ol><button class="action" type="button" onclick="installShare()">Add to Home Screen</button><p class="lcSmall">Not in the menu? Tap <b>Copy app link</b>, open <b>Safari</b>, paste the link, then tap Share → Add to Home Screen.</p><button class="action secondary" type="button" onclick="installCopyLink()">Copy app link</button><p class="lcSmall" id="installCopyNoteTour"></p>') +
        tourReminderBlock(inApp)
      : (inApp
          ? ""
          : "<h4>1 · Install the app</h4>" +
            (installPromptEvent
              ? '<button class="action" type="button" onclick="installNow()">Install Scale &amp; Tell</button>'
              : '<ol><li>Open <a href="' +
                link +
                '" target="_blank" rel="noopener noreferrer">Scale &amp; Tell</a> in <b>Chrome</b>.</li><li>Tap the <b>⋮</b> menu.</li><li>Tap <b>Install app</b> or <b>Add to Home screen</b>.</li><li>Open Scale &amp; Tell from its new icon and sign in.</li></ol><p class="lcSmall">Samsung Internet: tap <b>☰</b> → <b>Add page to</b> → <b>Home screen</b>. Firefox: tap <b>⋮</b> → <b>Add app to Home screen</b>.</p>')) +
        tourReminderBlock(inApp);
  return (
    '<div class="tourSlide"><h3>Get the app &amp; reminders ♡</h3><div class="tourTabs" role="group" aria-label="Choose your phone">' +
    tab("iphone", "🍎 iPhone") +
    tab("android", "🤖 Android") +
    "</div>" +
    (inApp ? '<p class="lcSmall">✓ You are already using the installed app.</p>' : "") +
    steps +
    (!inApp && tourDevice !== "iphone"
      ? '<div class="tourActions"><button class="action secondary" type="button" onclick="installCopyLink()">Copy app link</button></div><p class="lcSmall" id="installCopyNote"></p>'
      : "") +
    "</div>"
  );
}
function tourMarkup() {
  const nav =
    '<div class="tourNav"><button type="button" class="action secondary" onclick="tourDone()">Skip tour</button>' +
    (tourStep
      ? '<button type="button" class="action secondary" onclick="tourGo(' + (tourStep - 1) + ')">← Back</button>'
      : "") +
    '<span class="tourProgress" aria-label="Step ' +
    (tourStep + 1) +
    ' of 3">' +
    (tourStep + 1) +
    " / 3</span>" +
    (tourStep < 2
      ? '<button type="button" class="action" onclick="tourGo(' + (tourStep + 1) + ')">Next →</button>'
      : '<button type="button" class="action" onclick="tourDone(\'start\')">Start my journal ♡</button>') +
    "</div>";
  let page = "";
  if (tourStep === 0)
    page =
      '<div class="tourSlide"><p>One private place for your animals: feedings, sheds, weights, photos, habitat notes and care reminders.</p><ul class="tourList"><li><b>Quick Log</b>: tap once when you feed, weigh or clean.</li><li><b>Today&#39;s Care</b>: see what&#39;s due and check it off with ✓.</li><li><b>Reminders</b>: on your phone, right when care is due.</li></ul><div class="tourActions"><button class="action secondary" onclick="tourDone(\'add\')">+ Add my first animal</button><button class="action secondary" onclick="tourDone(\'import\')">Import existing records</button></div><p class="lcSmall">You can also explore care guides without entering any personal records.</p></div>';
  if (tourStep === 1) page = tourGetAppMarkup();
  if (tourStep === 2)
    page =
      stPlanChecking()
        ? '<div class="tourSlide"><p class="planChecking">Checking your plan…</p></div>'
        : stCanUsePack()
        ? '<div class="tourSlide"><div class="tourPack"><h4>You&#39;re a Founding Keeper ♡</h4><p>Thank you for supporting Scale &amp; Tell! Your extras are unlocked: Keeper Tools (vet &amp; med reminders, shed predictions, photo progress, emergency card), Family Sharing, four app designs, your Care Binder, My Year in Scales, printable keeper cards and room for ' + stAnimalLimit() + ' animals on your ' + esc(ST_PLANS[stPlan()]?.name || "plan") + ' plan.</p><button class="action secondary" onclick="tourDone(\'founder\')">Open Founding Keeper Studio</button></div></div>'
        : '<div class="tourSlide"><div class="tourPack"><h4>Want more? Become a Founding Keeper ♡</h4><p><b>$14.99 once · optional.</b> Room for 40 animals, 3 logins for family, vet &amp; medication reminders, shed predictions, photo progress, an emergency card, four app designs, a Care Binder and keepsakes. Breeding? See <b>Founding Breeder</b> for racks, pairings and clutches.</p><button class="action secondary" onclick="tourDone(\'founder\')">See the Founding Keeper extras</button></div><p class="lcSmall">Your animals, care logs, reminders, photos and backups are all included already. The extras are just a bonus.</p></div>';
  return '<div class="tourShell" aria-live="polite">' + page + nav + "</div>";
}
function tourGo(step) {
  tourStep = Math.max(0, Math.min(2, Number(step) || 0));
  if (current === "Welcome Tour") {
    render();
    const m = document.querySelector(".modal");
    if (m) m.scrollTop = 0;
  }
}
function tourDone(action = "") {
  const uid = cloudSession?.user?.id;
  if (uid) {
    try {
      localStorage.setItem("scaleTellTourSeen35:" + uid, "1");
      sessionStorage.setItem("scaleTellWelcomeShown34:" + uid, "1");
    } catch (e) {}
  }
  closePanel();
  if (!action) setTimeout(stMaybeShowUpgrade, 400);
  if (action === "add") addAnimal();
  else if (action === "import") openPanel("Import Existing Records");
  else if (action === "founder") openPanel("Founding Keeper Studio");
  else if (action === "start" && !animals.length) addAnimal();
}
function menuMarkup() {
  // Home, My Reptiles, Calendar, Care Logs and Scale Hub live in the bottom bar, so they are not repeated here.
  let main = [
    ...(bizIsBreeder() || accountPrefs?.rescueLayout === "racks" ? [["Racks & Breeding", "Racks, rack feeding, pairings, clutches & litters"]] : []),
    ["Feeders", "Feeder Freezer: frozen feeder stock, cost & when to reorder"],
    ["Photo Journal", "Photos and profile pictures"],
    ["Import Existing Records", "Bring in old care notes or screenshots"],
    ["Pet-Sitter Sheet", "Care sheet for a pet-sitter or new home"],
    ["Devices", "Sensors and camera shortcuts"],
    ["Cloud Account", "Account, reminders & settings"],
  ];
  let tools = [
    ["Data & Backup", "Download a copy of your records"],
    ["Get the App", "Add Scale & Tell to your Home Screen"],
    ["Help & Feedback", "How do I…? questions, ideas or something not working"],
    ["Welcome Tour", "Replay the introduction"],
    ["Privacy & Account", "Privacy, and deleting your account"],
  ];
  if (window.__stIsAdmin) tools.unshift(["Send Update Email", "Email or in-app banner to keepers, breeders, rescues or everyone"], ["Admin Dashboard", "Signups, plans, active accounts and feature use"]);
  if (stCanUsePack()) main.unshift(["Keeper Tools", "Vet & meds, shed predictions, photo progress, emergency card"]);
  let tiles = (group) =>
    group
      .map(
        ([name, sub]) =>
          '<button class="menuTile" onclick="openPanel(&quot;' +
          esc(name) +
          '&quot;)"><strong>' +
          esc(name === "Cloud Account" ? "My Account" : name === "Calendar" ? "Care Schedule" : name === "Feeders" ? "🧊 Feeder Freezer" : name) +
          "</strong><small>" +
          esc(sub) +
          "</small></button>",
      )
      .join("");
  return (
    (stBadgeMarkup()
      ? '<div class="menuBadgeRow">' + stBadgeMarkup() + '<button class="authLink" onclick="stShareBadge()">Share my badge</button></div>'
      : "") +
    (stPlan() === "member"
      ? '<button class="menuTile menuFeature" onclick="openPanel(&quot;Upgrade&quot;)"><strong>♡ Become a Founding Keeper</strong><small>$14.99 once · your badge in the Herps &amp; Hers group with a weekly shout-out, 40 animals, 3 logins, vet reminders and more</small></button>'
      : "") +
    '<p class="resourceIntro">Everything your keeper journal needs, in one place.</p><button class="menuTile" onclick="openPanel(&quot;Plans&quot;)"><strong>Plans &amp; animal spaces</strong><small>' +
    animals.length +
    " of " +
    stAnimalLimit() +
    ' animals used · Keeper and Breeder plans</small></button>' +
    (stPlan() === "member"
      ? ""
      : '<button class="menuTile menuFeature" onclick="openPanel(&quot;Founding Keeper Studio&quot;)"><strong>♡ Founding Keeper</strong><small>' +
        (stCanUsePack() ? "Your designs, Care Binder and keepsakes" : "$14.99 once · 40 animals, 3 logins, vet reminders, shed predictions and more") +
        "</small></button>") +
    (!stCanTeam() && (stLogins() > 1 || (stTeam?.role === "member" && !stTeamIsBiz()))
      ? '<button class="menuTile menuFeature" onclick="openPanel(&quot;Team Logins&quot;)"><strong>♡ Family Sharing</strong><small>' +
        (stTeam?.role === "member" ? "You share " + esc(stTeam.owner_email || "a") + "’s journal" : "Share your journal with up to " + (stLogins() - 1) + " people") + "</small></button>"
      : "") +
    (stCanTeam() || (stTeam?.role === "member" && stTeamIsBiz())
      ? '<button class="menuTile menuFeature" onclick="openPanel(&quot;Business Tools&quot;)"><strong>✦ Business Tools</strong><small>' +
        (stTeam?.role === "member" ? "Shared journal · Inbox" : "Team logins, Inbox, your public page" + (stCanBrand() ? ", branding, MorphMarket export" : "")) +
        (bizUnread ? " · " + bizUnread + " new" : "") + "</small></button>"
      : "") +
    (homeBusinessMode() ? tiles([["Care Logs", "Every feeding, shed, weight and note"], ["My Reptiles", "All animals, including your own pets"]]) : "") +
    tiles(main) +
    '<details class="compactDisclosure"><summary>More</summary>' +
    tiles(tools) +
    "</details>"
  );
}

function officialSocialUrl(value, platform) {
  try {
    let u = new URL(value);
    let h = u.hostname.toLowerCase();
    if (u.protocol !== "https:" || u.username || u.password || u.port) return "";
    let roots =
      platform === "group" || platform === "facebook"
        ? ["facebook.com", "www.facebook.com", "m.facebook.com"]
        : platform === "instagram"
          ? ["instagram.com", "www.instagram.com"]
          : ["tiktok.com", "www.tiktok.com"];
    if (!roots.includes(h) || !u.pathname || u.pathname === "/") return "";
    if (
      platform === "group" &&
      !(/^\/groups\/[^/]+\/?$/.test(u.pathname) || /^\/share\/g\/[A-Za-z0-9]+\/?$/.test(u.pathname))
    )
      return "";
    return u.href;
  } catch (e) {
    return "";
  }
}
function saveSocialLinks() {
  let next = {};
  for (let k of Object.keys(SOCIAL_DEFAULT)) {
    let v = document.getElementById("social_" + k)?.value.trim() || "";
    if (v && !officialSocialUrl(v, k)) {
      alert(
        "Please enter a valid official HTTPS " + k + " URL" + (k === "group" ? " in facebook.com/groups/…" : "") + ".",
      );
      return;
    }
    next[k] = v;
  }
  try {
    scaleStoreSet("scaleTellSocial14", JSON.stringify(next));
    socialLinks = next;
    alert(
      "Links saved in this browser only. For everyone to see the official links, they must be included in the published app build.",
    );
    openPanel("Community");
  } catch (e) {
    alert("Could not save these shortcuts in browser storage.");
  }
}
function saveVetShortcut() {
  let val = (id) => document.getElementById(id)?.value.trim() || "",
    name = val("vetName"),
    phone = val("vetPhone"),
    emergencyName = val("vetEmergencyName"),
    emergencyPhone = val("vetEmergencyPhone");
  if ([phone, emergencyPhone].some((p) => p && !/^[+\d() .-]{5,32}$/.test(p))) {
    alert("Please check the clinic phone number.");
    return;
  }
  let v = {
    name: name.slice(0, 100),
    phone,
    emergencyName: emergencyName.slice(0, 100),
    emergencyPhone,
    notes: val("vetNotes").slice(0, 250),
  };
  try {
    scaleStoreSet("scaleTellVet14", JSON.stringify(v));
    savedVet = v;
    openPanel("Find a Vet");
  } catch (e) {
    alert("Could not save the vet contact.");
  }
}
function phoneHref(v) {
  let p = String(v || "").replace(/[^+\d]/g, "");
  return /^\+?\d{7,15}$/.test(p) ? "tel:" + p : "";
}
function resourceBack() {
  if (!cloudSession) {
    closePanel();
    return;
  }
  openPanel("Scale Hub");
}
function guideById(id) {
  return HERPS_GUIDES.find((g) => g.id === id);
}
function openGuide(i) {
  let g = HERPS_GUIDES[i];
  if (!g) return;
  current = "Herps Guide";
  document.getElementById("heading").textContent = g.title;
  document.getElementById("heading").hidden = false;
  window.scaleGuideId = i;
  guidePage = 0;
  document.querySelector(".modal").scrollTop = 0;
  render();
}
function changeGuidePage(n) {
  let g = HERPS_GUIDES[window.scaleGuideId || 0];
  if (!g) return;
  let v = Math.max(0, Math.min(g.pages.length - 1, guidePage + n));
  if (v === guidePage) return;
  guidePage = v;
  if (!document.getElementById("guideZoom").hidden) {
    refreshGuideZoom();
    return;
  }
  let old = document.querySelector(".modal")?.scrollTop || 0;
  render();
  if (document.querySelector(".modal")) document.querySelector(".modal").scrollTop = old;
}
let inlineStart = null;
function guideSwipeStart(e) {
  if (e.touches.length === 1) inlineStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  else inlineStart = null;
}
function guideSwipeEnd(e) {
  if (!inlineStart || !e.changedTouches.length) return;
  let dx = e.changedTouches[0].clientX - inlineStart.x,
    dy = e.changedTouches[0].clientY - inlineStart.y;
  inlineStart = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) changeGuidePage(dx < 0 ? 1 : -1);
}
let zoomScale = 1,
  zoomX = 0,
  zoomY = 0,
  zoomStart = null,
  zoomPinched = false;
function guideDistance(a, b) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}
function applyGuideZoom() {
  let im = document.getElementById("guideZoomImage");
  if (im) im.style.transform = "translate(" + zoomX + "px," + zoomY + "px) scale(" + zoomScale + ")";
}
function resetGuideZoom() {
  zoomScale = 1;
  zoomX = 0;
  zoomY = 0;
  zoomPinched = false;
  zoomStart = null;
  applyGuideZoom();
}
function refreshGuideZoom() {
  let g = HERPS_GUIDES[window.scaleGuideId || 0];
  if (!g) return;
  resetGuideZoom();
  let im = document.getElementById("guideZoomImage");
  im.src = g.pages[guidePage].image;
  im.alt = g.title + " illustrated guide page " + (guidePage + 1) + " of " + g.pages.length;
  document.getElementById("guideZoomLabel").textContent = g.title + " · " + (guidePage + 1) + " / " + g.pages.length;
}
function openGuideZoom() {
  let box = document.getElementById("guideZoom");
  box.hidden = false;
  document.body.style.overflow = "hidden";
  refreshGuideZoom();
}
function closeGuideZoom() {
  let box = document.getElementById("guideZoom");
  if (box) box.hidden = true;
  document.body.style.overflow = "";
  resetGuideZoom();
}
function zoomTouchStart(e) {
  if (e.touches.length === 2) {
    zoomPinched = true;
    zoomStart = { distance: guideDistance(e.touches[0], e.touches[1]), scale: zoomScale };
    return;
  }
  if (e.touches.length === 1) {
    zoomPinched = false;
    zoomStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, panX: zoomX, panY: zoomY, changed: false };
  }
}
function zoomTouchMove(e) {
  if (e.touches.length === 2 && zoomStart?.distance) {
    e.preventDefault();
    zoomPinched = true;
    zoomScale = Math.min(
      4,
      Math.max(1, (zoomStart.scale * guideDistance(e.touches[0], e.touches[1])) / zoomStart.distance),
    );
    if (zoomScale <= 1) {
      zoomX = 0;
      zoomY = 0;
    }
    applyGuideZoom();
    return;
  }
  if (e.touches.length === 1 && zoomStart && zoomScale > 1) {
    e.preventDefault();
    zoomX = Math.max(-650, Math.min(650, zoomStart.panX + e.touches[0].clientX - zoomStart.x));
    zoomY = Math.max(-900, Math.min(900, zoomStart.panY + e.touches[0].clientY - zoomStart.y));
    zoomStart.changed = true;
    applyGuideZoom();
  }
}
function zoomTouchEnd(e) {
  if (e.touches.length) return;
  if (zoomPinched) {
    zoomStart = null;
    return;
  }
  if (!zoomStart || zoomScale > 1 || !e.changedTouches.length) {
    zoomStart = null;
    return;
  }
  let dx = e.changedTouches[0].clientX - zoomStart.x,
    dy = e.changedTouches[0].clientY - zoomStart.y;
  zoomStart = null;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) changeGuidePage(dx < 0 ? 1 : -1);
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!document.getElementById("guideZoom").hidden) closeGuideZoom();
    else closePanel();
  } else if (!document.getElementById("guideZoom").hidden && e.key === "ArrowRight") changeGuidePage(1);
  else if (!document.getElementById("guideZoom").hidden && e.key === "ArrowLeft") changeGuidePage(-1);
});
function setGuideFilter() {
  guideFilter = document.getElementById("guideSearch")?.value.toLowerCase().trim() || "";
  let t = document.getElementById("guideResults");
  if (t) t.innerHTML = guideListMarkup();
}
function guideListMarkup() {
  let found = HERPS_GUIDES.map((g, i) => ({ g, i })).filter(
    (x) => x.g.title.toLowerCase().includes(guideFilter) || x.g.id.replaceAll("_", " ").includes(guideFilter),
  );
  return found.length
    ? '<div class="guideGrid">' +
        found
          .map(
            ({ g, i }) =>
              '<button onclick="openGuide(' +
              i +
              ')"><strong>' +
              esc(g.title) +
              "</strong><small>Herps & Hers · " +
              g.count +
              " original pages →</small></button>",
          )
          .join("") +
        "</div>"
    : '<p class="muted">No guide matched your search.</p>';
}
const URGENT_CONCERNS = {
  mouth: {
    title: "Mouth, jaw or swallowing concern",
    body: "A visible obstruction, retained material, marked swelling, persistent gaping, or a change in breathing warrants prompt veterinary guidance. Do not force the jaws open, blindly pull material from inside the mouth, or attempt to flush the airway. Keep the animal quiet and contact a reptile-experienced veterinarian.",
  },
  breathing: {
    title: "Breathing concern",
    body: "Persistent open-mouth breathing, wheezing, bubbles, severe lethargy or repeated neck extension can be urgent. Contact an exotic-animal veterinarian immediately; keep handling to a minimum. Do not administer home medications or force liquids.",
  },
  injury: {
    title: "Injury, burn or swelling",
    body: "Bleeding that does not stop, burns, rapidly increasing swelling, a trapped limb or severe weakness need urgent veterinary advice. Make the enclosure safe and do not apply household ointments or attempt invasive treatment.",
  },
  behavior: {
    title: "Sudden behavior or neurological change",
    body: "Collapse, seizures, inability to right itself, severe incoordination or unresponsiveness require urgent veterinary assessment. Avoid unnecessary handling and document the timeline for the veterinarian.",
  },
  feeding: {
    title: "Feeding, vomiting or regurgitation",
    body: "A single skipped meal is not always an emergency. Regurgitation, repeated vomiting, significant weight loss, visible obstruction, dehydration or other abnormal symptoms merit veterinary attention. Do not force-feed.",
  },
  habitat: {
    title: "Heating or equipment failure",
    body: "Check independent thermometer readings and the thermostat. Remove access to a dangerously hot surface or damaged equipment safely; do not create abrupt temperature extremes. If the animal is weak, burned or appears distressed, seek urgent veterinary care.",
  },
  aquatic: {
    title: "Aquatic or amphibian concern",
    body: "Check species-appropriate water temperature and quality using reliable tests. Ammonia or nitrite exposure, trouble reaching the surface, major swelling, abnormal skin or severe lethargy can require urgent aquatic/exotics veterinary advice. Avoid unverified water treatments.",
  },
  other: {
    title: "Something else feels wrong",
    body: "When a pet has marked swelling, trouble breathing, major injury, collapse, seizures, unusual weakness or sudden severe changes, contact an appropriate veterinarian. Document what changed and when; an online community is not an emergency service.",
  },
};
function urgentMarkup() {
  let a =
      helpAnimal && animals.includes(helpAnimal)
        ? helpAnimal
        : animals.includes(selectedAnimal)
          ? selectedAnimal
          : animals[0] || "",
    o = URGENT_CONCERNS[helpConcern] || URGENT_CONCERNS.other;
  return (
    '<p class="resourceIntro">Fast information for concerning situations. This page is NOT veterinary triage, and there is no live clinician or response monitoring.</p><div class="resourceAlert"><strong>Seek emergency veterinary care now</strong> if there is breathing difficulty, collapse, seizures, serious injury or bleeding, severe swelling, a suspected obstruction or other rapidly worsening symptoms. Do not wait for a community reply.</div><label>Which animal?<select id="urgentAnimal" onchange="helpAnimal=this.value">' +
    animals.map((x) => "<option " + (x === a ? "selected" : "") + ">" + esc(x) + "</option>").join("") +
    '</select></label><label>What is happening?<select id="urgentConcern" onchange="helpConcern=this.value;document.getElementById(\'urgentDetail\').innerHTML=urgentDetailMarkup()">' +
    Object.entries(URGENT_CONCERNS)
      .map(
        ([key, v]) =>
          '<option value="' + key + '" ' + (key === helpConcern ? "selected" : "") + ">" + esc(v.title) + "</option>",
      )
      .join("") +
    '</select></label><div id="urgentDetail">' +
    urgentDetailMarkup() +
    '</div><div class="resourceActions"><button class="action" onclick="openPanel(\'Find a Vet\')">Find / call a vet</button><button class="action secondary" onclick="copyUrgentHandoff()">Copy care history for vet</button></div><p id="urgentStatus" role="status" class="resourceMuted">Care history is not shared automatically.</p><div class="communityChoice"><strong>Exotics Vet &amp; Vet Tech Q&amp;A · Facebook group</strong><p>Ask questions in this external group. Scale &amp; Tell does not verify member credentials or response times. If your animal is seriously unwell, call an exotics or emergency vet now rather than waiting for a Facebook reply.</p><a class="socialLink" href="https://www.facebook.com/share/g/1C9LFs4Z3X/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Open Facebook group for exotic animal vet and vet tech questions">Open the Exotics Vet &amp; Vet Tech Group ↗</a></div><p class="resourceMuted">Community guidance is not a diagnosis or a substitute for veterinary attention.</p><button class="action secondary" onclick="openPanel(\'Community\')">Herps &amp; Hers community for nonurgent questions</button>'
  );
}
function urgentDetailMarkup() {
  let o = URGENT_CONCERNS[helpConcern] || URGENT_CONCERNS.other;
  return '<div class="resourceNotice"><strong>' + esc(o.title) + "</strong><p>" + esc(o.body) + "</p></div>";
}
function copyUrgentHandoff() {
  let a = document.getElementById("urgentAnimal")?.value || selectedAnimal;
  if (!a || !animals.includes(a)) return;
  let str =
    careHandoffText(a) +
    "\n\nCONCERN (selected by keeper): " +
    (URGENT_CONCERNS[helpConcern]?.title || "Other") +
    "\nNOTE: This is user-entered care history, not a diagnosis.";
  let st = document.getElementById("urgentStatus");
  let fallback = () => {
    let area = document.createElement("textarea");
    area.value = str;
    document.body.append(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {}
    area.remove();
    if (st)
      st.textContent = ok
        ? "Copied. Review before sharing."
        : "Could not copy automatically. Open Care Handoff in the animal profile to copy manually.";
  };
  if (navigator.clipboard?.writeText)
    navigator.clipboard
      .writeText(str)
      .then(() => {
        if (st) st.textContent = "Copied. Review before sharing.";
      })
      .catch(fallback);
  else fallback();
}
function vetMarkup() {
  const tel = phoneHref(savedVet.phone),
    emergency = phoneHref(savedVet.emergencyPhone);
  return (
    '<p class="resourceIntro">Find a veterinarian experienced with your animal before an emergency. Call to confirm they currently treat your species and offer the hours you need.</p>' +
    '<div class="vetResourceCard"><strong>Find a reptile & amphibian vet</strong><p class="helperLine">Association of Reptile and Amphibian Veterinarians directory. Search by ZIP code or location.</p><a class="socialLink" href="https://arav.org/find-a-vet/" target="_blank" rel="noopener noreferrer">Search ARAV veterinarians ↗</a><p class="helperLine">Another community-curated directory:</p><a class="socialLink" href="https://reptifiles.com/articles/reptile-vet-directory/" target="_blank" rel="noopener noreferrer">Browse ReptiFiles reptile vets ↗</a><small class="helperLine">Directory listings are not real-time availability. Call the clinic directly.</small></div>' +
    '<div class="vetResourceCard"><h3 class="sectionTitle">Your go-to veterinarian</h3><label>Clinic / veterinarian<input id="vetName" maxlength="100" value="' +
    esc(savedVet.name || "") +
    '" placeholder="Clinic name"></label><label>Phone<input id="vetPhone" type="tel" maxlength="32" value="' +
    esc(savedVet.phone || "") +
    '" placeholder="Phone number"></label>' +
    '<h3 class="sectionTitle">After-hours / emergency clinic</h3><label>Clinic<input id="vetEmergencyName" maxlength="100" value="' +
    esc(savedVet.emergencyName || "") +
    '" placeholder="24-hour or emergency clinic"></label><label>Phone<input id="vetEmergencyPhone" type="tel" maxlength="32" value="' +
    esc(savedVet.emergencyPhone || "") +
    '" placeholder="Emergency phone"></label><label>Notes (optional)<textarea id="vetNotes" maxlength="250" rows="2" placeholder="Species seen, address, hours or directions">' +
    esc(savedVet.notes || "") +
    '</textarea></label><button class="action" onclick="saveVetShortcut()">Save clinics</button>' +
    (tel
      ? '<a class="socialLink" href="' + esc(tel) + '">Call ' + esc(savedVet.name || "your veterinarian") + " ↗</a>"
      : "") +
    (emergency
      ? '<a class="socialLink" href="' +
        esc(emergency) +
        '">Call ' +
        esc(savedVet.emergencyName || "emergency clinic") +
        " ↗</a>"
      : "") +
    '</div><p class="resourceMuted">For severe or rapidly worsening symptoms, seek urgent veterinary care. This directory is not an emergency hotline and Scale & Tell does not contact a veterinarian automatically.</p><button class="action secondary" onclick="openPanel(\'Urgent Help\')">Back to Urgent Help</button>'
  );
}
// Community engagement stays in Herps & Hers: no separate social profile or private messages.
const KEEPER_LOUNGE_INVITE = "https://m.me/cm/MI9X25MHDmGB4XmF/?send_source=cm:copy_invite_link";
/* Recommended products. Links open the maker's own shop. */
/* Chewy storefront (Impact affiliate). Paste the exact storefront link here when you have it. */
const CHEWY_STOREFRONT = "https://www.chewy.com/s?query=reptile%20supplies";
const IMPACT_UTT = "https://utt.impactcdn.com/P-A7992412-8229-4bcd-9b50-8439ba6897d91.js";
/* Load Impact only on this screen, so nothing tracks keepers elsewhere in their journal. */
function loadAffiliateLinks() {
  try {
    if (!window.impactStat) {
      window.ire_o = "impactStat";
      window.impactStat = function () { (window.impactStat.a = window.impactStat.a || []).push(arguments); };
      const t = document.createElement("script");
      t.async = true; t.src = IMPACT_UTT;
      document.head.appendChild(t);
    }
    window.impactStat("transformLinks");
    window.impactStat("trackImpression");
  } catch (_) {}
}
const RECOMMENDED = [
  {
    brand: "Amazon",
    name: "First Time Keeper Essentials",
    why: "New to reptiles? Start here: heat with a thermostat, a thermometer and hygrometer, hides, water bowl, substrate and feeding supplies.",
    url: "https://amzn.to/4efIVOu",
    affiliate: true,
  },
  {
    brand: "Amazon",
    name: "Reptile Recommendations",
    why: "Products we love and use: heat and UVB, monitoring, hides and décor, substrate, supplements, grow-out tubs and tools.",
    url: "https://amzn.to/4yQVGY9",
    affiliate: true,
  },
  {
    brand: "Chewy",
    name: "Herps & Hers Chewy picks",
    why: "Our favorite supplies, with autoship on the things you buy every month.",
    url: CHEWY_STOREFRONT,
    affiliate: true,
  },
  {
    brand: "Spyder Robotics",
    name: "Herpstat thermostats",
    tag: "Works with Scale & Tell",
    why: "Proportional thermostats made for reptile keepers and breeders. Your Herpstat can send its live temperatures, humidity and alarms into Scale & Tell (Menu → Devices → Connect Herpstat). Scale & Tell is not affiliated with, endorsed by or sponsored by Spyder Robotics.",
    url: "https://spyderrobotics.com/",
  },
  {
    brand: "SensorPush",
    name: "Smart sensors & WiFi Gateway",
    why: "Wireless sensors log each enclosure's temperature and humidity to your phone. Add the WiFi Gateway to check them from anywhere and get alerts when readings drift. Live readings in Scale & Tell are coming soon.",
    url: "https://www.sensorpush.com/products",
  },
];
function recommendedMarkup() {
  return (
    '<p class="resourceIntro">Reptile products we love and recommend.</p>' +
    RECOMMENDED.map(
      (p) =>
        '<div class="productCard"><span class="productBrand">' +
        esc(p.brand) +
        "</span>" + (p.tag ? '<span class="productTag">' + esc(p.tag) + "</span>" : "") + "<h3>" +
        esc(p.name) +
        "</h3><p>" +
        esc(p.why) +
        '</p><a class="action" href="' +
        esc(p.url) +
        '" target="_blank" rel="' + (p.affiliate ? "sponsored noopener" : "noopener noreferrer") + '">' + (p.affiliate ? "Shop on " : "View on ") +
        esc(p.brand) +
        " ↗</a></div>",
    ).join("") +
    '<p class="resourceMuted">Some links are affiliate links, at no extra cost to you. As an Amazon Associate I earn from qualifying purchases. Purchases support Herps &amp; Hers and Scale &amp; Tell, and 10% of paid-plan profits go to a nonprofit reptile rescue.</p>' +
    '<button class="action secondary" onclick="openPanel(\'Scale Hub\')">Back to Scale Hub</button>'
  );
}
function communityMarkup() {
  let group = officialSocialUrl(socialLinks.group || SOCIAL_DEFAULT.group, "group");
  let other = [
    ["facebook", "Facebook Page"],
    ["instagram", "Instagram"],
    ["tiktok", "TikTok"],
  ]
    .map(([k, label]) => {
      let u = officialSocialUrl(socialLinks[k] || SOCIAL_DEFAULT[k], k);
      return u
        ? '<a class="socialLink" href="' +
            esc(u) +
            '" target="_blank" rel="noopener noreferrer">' +
            esc(label) +
            " ↗</a>"
        : "";
    })
    .filter(Boolean)
    .join("");
  return (
    '<p class="resourceIntro">Two ways to connect with Herps & Hers. Keepers learn together in the Facebook group and get to know one another in our Messenger chat community.</p>' +
    '<div class="communityChoice"><strong>♡ Herps & Hers Facebook Group</strong><p>Share husbandry questions, photos, resources, and group discussions.</p>' +
    (group
      ? '<a class="socialLink" href="' +
        esc(group) +
        '" target="_blank" rel="noopener noreferrer" aria-label="Open Herps and Hers Facebook group">Join Our Facebook Community ↗</a>'
      : '<p class="resourceNotice">Community link is temporarily unavailable.</p>') +
    "</div>" +
    '<div class="communityChoice"><strong>♡ The Keeper Lounge</strong><p>Casual conversation, new friendships, and finding fellow reptile people. Opens our Messenger Community.</p><a class="socialLink communityMessenger" href="' +
    esc(KEEPER_LOUNGE_INVITE) +
    '" target="_blank" rel="noopener noreferrer" aria-label="Open Herps and Hers Keeper Lounge in Messenger">Enter the Keeper Lounge ↗</a></div>' +
    '<p class="resourceMuted">The Keeper Lounge is hosted in Messenger, separate from your private Scale & Tell care records. Use the Facebook group for husbandry questions so everyone can benefit from the answers.</p>' +
    (other ? '<h3 class="sectionTitle">Find us on social media</h3>' + other : "") +
    '<div class="resourceActions"><button class="action secondary" onclick="copyQuestionTemplate()">Copy a community question template</button></div><p class="resourceMuted" id="communityStatus">For urgent concerns, seek veterinary guidance instead of waiting for community replies.</p><button class="action secondary" onclick="openPanel(\'Urgent Help\')">Need urgent guidance?</button>'
  );
}
function copyQuestionTemplate() {
  let t =
    "HERPS & HERS COMMUNITY QUESTION (nonurgent)\nSpecies / age:\nEnclosure size:\nWarm and cool temperatures:\nHumidity or water parameters:\nLast meal / last shed:\nObservation and how long it has been happening:\nWhat I have already checked:\nPhotos (if helpful):\n";
  let el = document.getElementById("communityStatus");
  let fallback = () => {
    if (el)
      el.textContent = "Copy unavailable in this browser. Please write the details directly in your community post.";
  };
  if (navigator.clipboard?.writeText)
    navigator.clipboard
      .writeText(t)
      .then(() => {
        if (el) el.textContent = "Question template copied. Paste it into your community post.";
      })
      .catch(fallback);
  else fallback();
}
function socialSettingsMarkup() {
  return (
    '<p class="resourceMuted">Enter official Herps & Hers HTTPS profile links. Never paste account passwords, invitation tokens or private camera URLs. These shortcuts are local to the browser until included in the published build.</p>' +
    [
      ["group", "Facebook Community group (official link)"],
      ["facebook", "Facebook page"],
      ["instagram", "Instagram"],
      ["tiktok", "TikTok"],
    ]
      .map(
        ([k, label]) =>
          '<label class="resourceField">' +
          esc(label) +
          '<input id="social_' +
          k +
          '" inputmode="url" type="url" maxlength="400" value="' +
          esc(socialLinks[k] || SOCIAL_DEFAULT[k] || "") +
          '" placeholder="https://..."></label>',
      )
      .join("") +
    '<button class="action" onclick="saveSocialLinks()">Save official links on this device</button><button class="action secondary" onclick="openPanel(\'Community\')">Back to Community</button>'
  );
}
let isBrandNew = !["scaleTellRoster10", "scaleTellApprovedPreview", "scaleTellProfiles03", "scaleTellPhotos10"].some(
  (k) => localStorage.getItem(k) !== null,
);
// Starter portraits are illustrations, NEVER account data. Preserve every explicit keeper roster.
let animals = [],
  species = {};
try {
  let roster = JSON.parse(localStorage.getItem("scaleTellRoster10") || "null");
  if (roster && Array.isArray(roster.animals) && roster.animals.length < 501) {
    animals = roster.animals;
    species = roster.species || species;
  }
} catch (e) {}
let photos = {};
try {
  photos = JSON.parse(localStorage.getItem("scaleTellPhotos10") || "{}");
} catch (e) {}
let carePlans = {};
try {
  let saved = JSON.parse(localStorage.getItem("scaleTellCarePlans12") || "{}");
  if (saved && typeof saved === "object" && !Array.isArray(saved)) carePlans = saved;
} catch (e) {}
let devices = [];
try {
  let saved = JSON.parse(localStorage.getItem("scaleTellDevices13") || "[]");
  if (Array.isArray(saved)) devices = saved.filter((d) => d && typeof d === "object").slice(0, 300);
} catch (e) {}
function saveDevices(next) {
  try {
    scaleStoreSet("scaleTellDevices13", JSON.stringify(next));
    devices = next;
    return true;
  } catch (e) {
    alert("Device assignments could not be saved. Browser storage may be full.");
    return false;
  }
}
function deviceId() {
  return "device-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}
function cameraBrandInfo(brand) {
  return (
    {
      Wyze: {
        url: "https://my.wyze.com/live",
        name: "Wyze Web View",
        note: "Available only for compatible cameras and supported browser/account plans. On a phone, you may need the Wyze app.",
      },
      Ring: {
        url: "https://ring.com/",
        name: "Ring",
        note: "Sign in to Ring. Available viewing options depend on your device and plan.",
      },
      Blink: {
        url: "",
        name: "Blink app",
        note: "Open the installed Blink app and select your camera. No reliable direct camera web link is provided here.",
      },
      Tapo: {
        url: "",
        name: "Tapo app",
        note: "Open the installed Tapo app and select your camera. No reliable direct camera web link is provided here.",
      },
      Kasa: { url: "", name: "Kasa app", note: "Open Kasa on your device to find your camera." },
      Eufy: {
        url: "https://mysecurity.eufylife.com/",
        name: "eufy Security",
        note: "Viewing options depend on your device and account.",
      },
      Other: {
        url: "",
        name: "Manufacturer app",
        note: "Open your camera manufacturer’s app to select the correct camera.",
      },
    }[brand] || { url: "", name: "Manufacturer app", note: "Open the manufacturer app." }
  );
}
function validCameraLink(raw) {
  if (!raw) return true;
  try {
    let u = new URL(raw);
    if (u.protocol !== "https:" || u.username || u.password || u.port || u.hash) return false;
    let host = u.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      host.endsWith(".lan") ||
      /^\d+\.\d+\.\d+\.\d+$/.test(host) ||
      host.includes(":") ||
      !host.includes(".")
    )
      return false;
    let params = [...u.searchParams.keys()];
    if (params.some((k) => /token|key|auth|secret|password|pass|user|signature|session|stream/i.test(k))) return false;
    if (/rtsp|password=|token=/i.test(raw)) return false;
    return raw.length <= 350;
  } catch (e) {
    return false;
  }
}
function saveCarePlans() {
  try {
    scaleStoreSet("scaleTellCarePlans12", JSON.stringify(carePlans));
    return true;
  } catch (e) {
    alert("Could not save care targets in this browser.");
    return false;
  }
}
function saveRoster() {
  scaleStoreSet("scaleTellRoster10", JSON.stringify({ animals, species }));
  renderHomeCards();
}
function savePhotos() {
  try {
    scaleStoreSet("scaleTellPhotos10", JSON.stringify(photos));
    return true;
  } catch (e) {
    alert("Photo storage is full. Try a smaller image or export a backup before removing old photos.");
    return false;
  }
}
function animalOptions() {
  return animals
    .map((a) => "<option " + (a === selectedAnimal ? "selected" : "") + ">" + esc(a) + "</option>")
    .join("");
}

let entries = [],
  profiles = {},
  current = "",
  selectedAnimal = animals[0] || "",
  logPrefillAnimal = "";
let careEditIndex = -1,
  careEditOrigin = "Care Logs",
  careEditOriginTab = "",
  careReturnFilters = null,
  reminderEditIndex = -1,
  reminderEditOrigin = "Calendar";
let deletedRecords = [];
try {
  let saved = JSON.parse(localStorage.getItem("scaleTellDeleted25") || "[]");
  if (Array.isArray(saved))
    deletedRecords = saved
      .filter(
        (x) =>
          x &&
          x.entry &&
          typeof x.entry.animal === "string" &&
          typeof x.entry.section === "string" &&
          typeof x.entry.detail === "string",
      )
      .slice(-100);
} catch (err) {}
function saveDeletedRecords(v) {
  try {
    scaleStoreSet("scaleTellDeleted25", JSON.stringify(v));
    return true;
  } catch (err) {
    alert("Could not store a recovery copy. Nothing was deleted. Free up browser space or export your records first.");
    return false;
  }
}
function deleteWithRecovery(i) {
  let e = entries[i];
  if (!e) return;
  let next = [...deletedRecords, { entry: JSON.parse(JSON.stringify(e)), deletedAt: new Date().toISOString() }].slice(
    -100,
  );
  if (!saveDeletedRecords(next)) return;
  let original = deletedRecords;
  deletedRecords = next;
  entries.splice(i, 1);
  try {
    save();
  } catch (err) {
    entries.splice(i, 0, e);
    deletedRecords = original;
    try {
      scaleStoreSet("scaleTellDeleted25", JSON.stringify(original));
    } catch (ignored) {}
    alert("Deletion failed. Your original record is still present.");
    return;
  }
  render();
}
function deletedRecordsMarkup() {
  return deletedRecords.length
    ? deletedRecords
        .slice()
        .reverse()
        .map((item, j) => {
          let i = deletedRecords.length - 1 - j,
            e = item.entry;
          return (
            '<div class="task"><b>' +
            esc(e.animal) +
            "</b> · " +
            esc(e.detail) +
            "<small>" +
            esc(e.section) +
            " · " +
            niceDate(e.date) +
            (item.replaced ? " · Older version, replaced " : " · Deleted ") +
            esc(new Date(item.deletedAt).toLocaleDateString("en-US")) +
            '</small><div class="inlineActions"><button onclick="restoreDeletedRecord(' +
            i +
            ')">Restore record</button><button onclick="deleteForever(' +
            i +
            ')">Delete forever</button></div></div>'
          );
        })
        .join("")
    : '<p class="muted">No recently deleted care records.</p>';
}
function restoreDeletedRecord(i) {
  let item = deletedRecords[i];
  if (!item) return;
  let e = item.entry;
  if (
    e.section === "Calendar" &&
    !e.done &&
    entries.some(
      (x) => x.section === "Calendar" && !x.done && x.animal === e.animal && x.date === e.date && x.detail === e.detail,
    )
  ) {
    alert("An identical unfinished reminder already exists. Resolve it before restoring this copy.");
    return;
  }
  entries.push(e);
  try {
    save();
  } catch (err) {
    entries.pop();
    alert("Not enough browser space to restore this record. Nothing was changed.");
    return;
  }
  let next = deletedRecords.filter((_, j) => j !== i);
  if (!saveDeletedRecords(next)) {
    entries.pop();
    try {
      save();
    } catch (ignored) {}
    return;
  }
  deletedRecords = next;
  render();
}
function deleteForever(i) {
  if (!deletedRecords[i] || !confirm("Permanently erase this recovery copy? This cannot be undone.")) return;
  let next = deletedRecords.filter((_, j) => j !== i);
  if (saveDeletedRecords(next)) {
    deletedRecords = next;
    render();
  }
}
function backupGeneratedText() {
  let v = localStorage.getItem("scaleTellBackupGenerated25");
  return v
    ? "Last export generated: " +
        esc(new Date(v).toLocaleString("en-US")) +
        ". This does NOT confirm it was saved to Files."
    : "No backup export generated in this browser yet.";
}

try {
  entries = JSON.parse(localStorage.getItem("scaleTellApprovedPreview") || "[]");
} catch (e) {}
try {
  profiles = JSON.parse(localStorage.getItem("scaleTellProfiles03") || "{}");
} catch (e) {}
function esc(v) {
  return String(v ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}
function today() {
  let d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
}
function save() {
  syncStampEntries();
  scaleStoreSet("scaleTellApprovedPreview", JSON.stringify(entries));
  if (typeof bizQueueAuto === "function") bizQueueAuto();
}
function updateStats() {
  let t = today(),
    reminders = entries.filter((e) => e.section === "Calendar" && !e.done);
  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  };
  set("statReptiles", animals.length);
  set("statDue", reminders.filter((e) => e.date <= t).length);
  set("statUpcoming", reminders.filter((e) => e.date > t).length);
  set("statLogs", entries.filter((e) => e.section !== "Calendar").length);
  renderHomeToday();
}
/* V3.30 · Home "Today's Care" card fills the space above the bottom menu on taller phones. */
const HOME_TIPS = [
  "Check warm and cool side temperatures with a probe thermometer, not just the dial on the heat source.",
  "Fresh water every day, and scrub the bowl weekly.",
  "Log every shed. Stuck shed is often the first sign humidity is off.",
  "Weigh monthly at the same time of day to spot trends early.",
  "Replace UVB bulbs on schedule. They stop making UVB long before they stop glowing.",
  "Every heat source needs a thermostat.",
  "A refused meal is common during shed or seasonal changes. Watch weight, not one missed feeding.",
  "Offer at least two hides: one on the warm side, one on the cool side.",
  "Quarantine new animals for at least 30 to 90 days before they share a room routine with others.",
  "Spot clean daily, deep clean on a schedule. Add both as reminders in Calendar.",
];
function renderHomeToday() {
  const box = document.getElementById("homeToday");
  if (!box) return;
  const tipBox = document.getElementById("homeTip");
  const t = today(),
    open = entries.filter((e) => e.section === "Calendar" && !e.done),
    due = open.filter((e) => e.date <= t).sort((a, b) => a.date.localeCompare(b.date)),
    next = open.filter((e) => e.date > t).sort((a, b) => a.date.localeCompare(b.date))[0],
    tip = HOME_TIPS[Math.floor(Date.now() / 86400000) % HOME_TIPS.length];
  if (tipBox) tipBox.innerHTML = "<span>Keeper tip</span>" + esc(tip);
  if (!animals.length) {
    box.innerHTML =
      '<div class="homeTodayCard"><h2>Let&#39;s get started ♡</h2><p class="homeTodayClear">Add your first animal, then log feedings, sheds and weights in one tap. Reminders can go straight to your phone.</p><div class="homeTodayActions"><button onclick="addAnimal()">＋ Add my first animal</button><button onclick="openPanel(\'Care Library\')">Care guides</button></div></div>';
    return;
  }
  let list;
  if (due.length) {
    list =
      '<ul class="homeTodayList">' +
      due
        .slice(0, 4)
        .map((e) => {
          const i = entries.indexOf(e);
          return (
            '<li><button class="homeTodayItem" onclick="openPanel(\'Due Today\')"><b>' +
            esc(e.animal) +
            "</b> · " +
            esc(e.detail) +
            (e.date < t ? '<span class="homeOverdue">overdue</span>' : "") +
            '</button><button class="homeDone" onclick="homeMarkDone(' +
            i +
            ')" aria-label="Mark ' +
            esc(e.animal + " " + e.detail) +
            ' done">✓</button></li>'
          );
        })
        .join("") +
      "</ul>" +
      (due.length > 4
        ? '<button class="homeTodayMore" onclick="openPanel(\'Due Today\')">+ ' + (due.length - 4) + " more due</button>"
        : "");
  } else {
    list =
      '<p class="homeTodayClear">All caught up ♡ Nothing due today.' +
      (next
        ? "<br><small>Next: <b>" + esc(next.animal) + "</b> · " + esc(next.detail) + " · " + niceDate(next.date) + "</small>"
        : "") +
      "</p>";
  }
  box.innerHTML =
    '<div class="homeTodayCard"><h2>Today&#39;s Care ♡</h2>' +
    strayImportNotice() +
    list +
    '<div class="homeTodayActions"><button onclick="openQuickLog()">＋ Quick Log</button><button onclick="openPanel(\'Calendar\')">Calendar</button></div></div>';
}
/* One tap on ✓ finishes a reminder from the home screen. Repeating reminders schedule their next date. */
function homeMarkDone(i) {
  const e = entries[i];
  if (!e || e.section !== "Calendar" || e.done) return;
  const before = entries.length;
  completeReminder(i, true);
  const added = entries.slice(before);
  stToast("Done ♡ " + e.animal + " · " + e.detail, "Undo", () => {
    e.done = false;
    delete e.completedAt;
    added.forEach((x) => {
      const k = entries.indexOf(x);
      if (k >= 0) entries.splice(k, 1);
    });
    save();
    render();
  });
}

/* ---------------- V3.31 · Quick Log: one tap for the things keepers log most ---------------- */
const QUICK_LOG = [
  { id: "fed", label: "Fed", icon: "🍽", section: "Feeding Tracker", detail: "Ate" },
  { id: "refused", label: "Refused", icon: "✕", section: "Feeding Tracker", detail: "Refused" },
  { id: "shed", label: "Shed", icon: "✨", section: "Shed History", detail: "shed" },
  { id: "weight", label: "Weighed", icon: "⚖", section: "Weight Tracker", detail: "" },
  { id: "poop", label: "Pooped", icon: "💩", section: "Observations", detail: "Poop / urate" },
  { id: "clean", label: "Spot cleaned", icon: "🧽", section: "Enclosure Care", detail: "Spot clean" },
  { id: "water", label: "Fresh water", icon: "💧", section: "Enclosure Care", detail: "Water change" },
  { id: "handled", label: "Handled", icon: "🤲", section: "Observations", detail: "Handling" },
];
let quickLogDate = "";
let quickLogTime = "";
function openQuickLog(a) {
  if (a && animals.includes(a)) selectedAnimal = a;
  if (!animals.includes(selectedAnimal)) selectedAnimal = animals[0] || "";
  if (!animals.length) {
    addAnimal();
    return;
  }
  quickLogDate = today();
  quickLogTime = stFeedNowTime();
  openPanel("Quick Log", selectedAnimal);
}
/* V3.39 · Herps & Hers members (group code) get a friendly upgrade card. */
function memberUpgradeSnoozed() {
  try {
    return Date.now() < Number(localStorage.getItem("scaleTellUpgradeSnooze") || 0);
  } catch (e) {
    return false;
  }
}
function memberUpgradeSnooze() {
  try {
    localStorage.setItem("scaleTellUpgradeSnooze", String(Date.now() + 7 * 86400000));
  } catch (e) {}
  renderHomeToday();
}
function stUpgradeKey() {
  try {
    const u = cloudSession?.user;
    return u ? "scaleTellUpgradeShown:" + u.id + ":" + (u.last_sign_in_at || "") : "";
  } catch (e) {
    return "";
  }
}
/* Shown once after each sign-in (including a brand-new account), never in the middle of something else. */
function stMaybeShowUpgrade() {
  if (stPlan() !== "member" || window.__stReloading || current === "Welcome Tour") return;
  try { if (!localStorage.getItem("scaleTellTourSeen35:" + cloudSession?.user?.id)) return; } catch (e) {}
  try { if (Date.now() - new Date(cloudSession?.user?.created_at || 0).getTime() < 3 * 864e5) return; } catch (e) {}
  const key = stUpgradeKey();
  if (!key) return;
  try {
    if (localStorage.getItem(key)) return;
  } catch (e) {
    return;
  }
  if (document.getElementById("sheet")?.classList.contains("on") || document.body.classList.contains("authLocked")) return;
  try {
    localStorage.setItem(key, "1");
  } catch (e) {}
  openPanel("Upgrade");
}
function memberUpgradeMarkup(onHome) {
  return (
    '<div class="memberUpgrade">' +
    (onHome ? '<button class="memberUpgradeX" aria-label="Hide for a week" onclick="memberUpgradeSnooze()">×</button>' : "") +
    '<span class="accessTag">Herps &amp; Hers member</span><h3>Become a Founding Keeper ♡</h3><p>Upgrade once for <b>$14.99</b> and get:</p><ul>' +
    "<li>Your <b>Founding Keeper badge in the Herps &amp; Hers group</b>, announced in our weekly post</li>" +
    "<li>Room for <b>40 animals</b> (you have " + stAnimalLimit() + ")</li>" +
    "<li><b>3 logins</b> to share with family</li>" +
    "<li>Vet &amp; medication reminders, shed predictions, photo progress and an emergency card</li>" +
    "<li>Four app designs, Care Binder, My Year in Scales and printables</li>" +
    "<li>The ✓ badge in your app</li></ul>" +
    '<button class="action" onclick="openPanel(\'Founding Keeper Studio\')">Upgrade to Founding Keeper</button>' +
    '<button class="memberUpgradeBreeder" onclick="openPanel(\'Plans\')">Breeder or rescue? See those plans</button>' +
    (current === "Upgrade" ? '<button class="action secondary" onclick="closePanel()">Maybe later</button>' : "") +
    "</div>"
  );
}
function plansMarkup() {
  const mine = stPlan(),
    used = animals.length,
    // Only people who joined with the group code hear about the Herps & Hers group perks.
    isMember = stOwnsEntitlements() && stSkus.includes("member");
  const card = (key, price, who, perks, action) =>
    '<div class="planCard' +
    (mine === key ? " planMine" : "") +
    '"><div class="planHead"><h3>' +
    esc(ST_PLANS[key].name) +
    (mine === key ? ' <span class="stBadge">Your plan</span>' : "") +
    '</h3><span class="planPrice">' +
    price +
    "</span></div><p class=\"planWho\">" +
    who +
    '</p><ul>' +
    perks.map((x) => "<li>" + x + "</li>").join("") +
    "</ul>" +
    (mine === key ? "" : action) +
    "</div>";
  const soon = (sku) => '<div class="subBox" id="sub-' + sku + '"><button class="action" onclick="stStartSub(\'' + sku + '\')">Choose this plan</button></div>';
  return (
    '<p class="resourceIntro">You&#39;re using <b>' +
    used +
    " of " +
    stAnimalLimit() +
    "</b> animal spaces." +
    (stCanUseBreeder() ? " Breeder tools are on." : "") +
    "</p>" +
    '<h3 class="sectionTitle">For keepers</h3>' +
    (mine === "member" ? memberUpgradeMarkup(false) : "") +
    card(
      "founding_keeper",
      "$14.99 once",
      "For hobby keepers.",
      ["Up to <b>40 animals</b>", "Care logs, reminders, photos and backups", "Four app designs, Care Binder, My Year in Scales, printables", "<b>3 logins</b> to share with family", "Medication &amp; vet reminders, shed predictions, photo progress and an emergency card", (isMember ? "✓ Founding Keeper badge in the app <b>and in the Herps &amp; Hers group</b>, announced in our weekly post" : "✓ Founding Keeper badge")],
      '<button class="action" onclick="openPanel(\'Founding Keeper Studio\')">Become a Founding Keeper</button>',
    ) +
    '<h3 class="sectionTitle">For breeders &amp; rescues</h3><p class="lcSmall">Breeder plans add racks, rack feeding, pairings, clutches and hatchlings.</p>' +
    card("founding_breeder", "$19.99 / year", "Breeders, including hobby breeders.", ["Up to <b>150 animals</b>", "Everything in Founding Keeper", "Racks, rack feeding, pairings, clutches & litters", "3 logins for your team", "Public page, inquiry Inbox and animal sharing", (isMember ? "✓ Founding Breeder badge in the app <b>and in the Herps &amp; Hers group</b>, announced in our weekly post" : "✓ Founding Breeder badge")], soon("founding_breeder")) +
    card("premium_breeder", "$29.99 / year", "Breeding businesses.", ["Up to <b>400 animals</b>", "Everything in Founding Breeder", "<b>5 logins</b> for your team", "Your logo and colors on the app and printouts", "MorphMarket export", "Genetics calculator, invoices &amp; receipts, bulk import, shipping weather check, waitlist and sales summary"], soon("premium_breeder")) +
    card("rescue", "$29.99 / year · $14.99 verified 501(c)(3)", "Reptile rescues.", ["Up to <b>400 animals</b>", "Everything in Premium Breeder: 5 logins, your logo and colors, MorphMarket export, public page and Inbox", "Foster tracking, adoption contracts with e-signatures, a year-end impact report, a donate button and vet costs per animal", "Listing in Scale Hub → Reptile Rescues with an intake open / full switch", "Verified 501(c)(3)? Add your EIN under Business Tools → Rescue profile for the $14.99/yr price"], soon("rescue")) +
    '<p class="lcSmall">Yearly plans renew through PayPal. Cancel anytime in <a href="https://www.paypal.com/myaccount/autopay/" target="_blank" rel="noopener">PayPal → Automatic payments</a>; you keep your plan until the end of the year you paid for.</p><p class="lcSmall">Already have more animals than a plan allows? You keep them all; you just can&#39;t add more until you upgrade.</p>'
  );
}
/* Shareable badge image for Founding Keepers and Breeders. */
async function stShareBadge() {
  const p = stPlan();
  if (!p || !ST_PLANS[p].badge) return;
  const file = p === "founding_keeper" ? "badge-founding-keeper.png" : "badge-founding-breeder.png";
  try {
    const blob = await (await fetch(file)).blob(),
      f = new File([blob], file, { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [f] })) {
      await navigator.share({ files: [f], title: ST_PLANS[p].name, text: "I'm a " + ST_PLANS[p].name + " on Scale & Tell ♡ scaleandtell.app" });
      return;
    }
  } catch (e) {
    if (e && e.name === "AbortError") return;
  }
  const a = document.createElement("a");
  a.href = file;
  a.download = file;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
/* V3.52 · Feeding event time: local wall-clock HH:MM, independent of record creation timestamp. */
function stFeedNowTime() {
  const d = new Date();
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}
function stValidFeedingTime(v) {
  return typeof v === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
}
function stFeedingTimeLabel(v) {
  if (!stValidFeedingTime(v)) return "";
  const [h, m] = v.split(":").map(Number);
  return new Date(2000, 0, 1, h, m).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
function quickLogSetDate(v) {
  quickLogDate = v;
  if (v !== today()) {
    quickLogTime = "";
    const t = document.getElementById("qlTime");
    if (t) t.value = "";
  }
}
function quickLogMarkup() {
  const a = selectedAnimal;
  return (
    '<p class="muted">Tap once to log for <b>' +
    esc(a) +
    "</b>.</p>" +
    (animals.length > 1
      ? '<div class="qlAnimals" role="group" aria-label="Choose an animal">' +
        animals
          .map(
            (x, i) =>
              '<button class="qlAnimal' +
              (x === a ? " on" : "") +
              '" aria-pressed="' +
              (x === a) +
              '" onclick="quickLogPick(' +
              i +
              ')"><img src="' +
              esc(portraitForAnimal(x).src) +
              '" alt="">' +
              esc(x) +
              "</button>",
          )
          .join("") +
        "</div>"
      : "") +
    '<div class="qlGrid">' +
    QUICK_LOG.filter((q) => !(q.id === "shed" && stNoShed(a))).map(
      (q) =>
        '<button class="qlAction" onclick="quickLogDo(\'' +
        q.id +
        '\')"><span aria-hidden="true">' +
        q.icon +
        "</span>" +
        esc(q.id === "shed" && animalCareType(a) === "invertebrate" ? "Molted" : q.label) +
        "</button>",
    ).join("") +
    '</div><div class="qlWeigh" id="qlWeigh" hidden><label>Weight in grams<input type="number" id="qlGrams" min="0.1" max="100000" step="0.1" inputmode="decimal" placeholder="e.g. 1450"></label><button class="action" onclick="quickLogWeight()">Save weight</button></div>' +
    '<label class="qlDate">Date<input type="date" id="qlDate" value="' +
    esc(quickLogDate || today()) +
    '" max="' +
    today() +
    '" onchange="quickLogSetDate(this.value)"></label><label class="qlDate">Feeding time (optional)<input type="time" id="qlTime" value="' + esc(quickLogTime) + '" onchange="quickLogTime=this.value"></label>' +
    '<p class="qlStatus" id="qlStatus" role="status"></p>' +
    '<button class="action secondary" onclick="openPanel(\'Log Care\',selectedAnimal)">More options (prey, temps, notes…)</button>'
  );
}
function quickLogPick(i) {
  if (!animals[i]) return;
  selectedAnimal = animals[i];
  render();
}
function quickLogEntry(q, extra) {
  const date = validDate(quickLogDate) && quickLogDate <= today() ? quickLogDate : today();
  let detail = q.detail;
  if (q.id === "shed") detail = animalCareType(selectedAnimal) === "invertebrate" ? "Complete molt" : "Complete shed";
  const e = { section: q.section, animal: selectedAnimal, detail, date, notes: "", ...(extra || {}) };
  if (q.section === "Feeding Tracker") Object.assign(e, { preyType: "", preyWeight: "", response: detail === "Refused" ? "Refused" : "", ...(stValidFeedingTime(quickLogTime) ? { feedingTime: quickLogTime } : {}) });
  entries.push(e);
  save();
  if (e.section === "Feeding Tracker" && e.detail !== "Refused" && e.preyType) feederUse(e.preyType, 1);
  let msg = "Logged ♡ " + selectedAnimal + " · " + (q.id === "weight" ? e.detail + " g" : q.label);
  if (q.section === "Feeding Tracker") {
    const next = autoNextFeeding(selectedAnimal, date);
    if (next) msg += ". Next feeding reminder: " + niceDate(next);
  }
  render();
  const st = document.getElementById("qlStatus");
  if (st) st.textContent = msg;
  stToast(msg, "Undo", () => {
    const k = entries.indexOf(e);
    if (k >= 0) entries.splice(k, 1);
    save();
    render();
  });
}
function quickLogDo(id) {
  const q = QUICK_LOG.find((x) => x.id === id);
  if (!q || !animals.includes(selectedAnimal)) return;
  if (id === "weight") {
    const box = document.getElementById("qlWeigh");
    if (box) {
      box.hidden = false;
      document.getElementById("qlGrams")?.focus();
    }
    return;
  }
  quickLogEntry(q);
}
function quickLogWeight() {
  const g = parseFloat(document.getElementById("qlGrams")?.value || "");
  if (!Number.isFinite(g) || g <= 0 || g > 100000) {
    alert("Enter the weight in grams.");
    return;
  }
  quickLogEntry(QUICK_LOG.find((x) => x.id === "weight"), { detail: String(Number(g.toFixed(1))) });
}

/* ---------------- V3.31 · Automatic next feeding (only when the keeper set a feeding interval) ---------------- */
function feedingInterval(a) {
  const n = Number(carePlans[a]?.feedDays);
  return Number.isInteger(n) && n >= 1 && n <= 365 ? n : 0;
}
function autoNextFeeding(a, fedDate) {
  const days = feedingInterval(a);
  if (!days || !validDate(fedDate)) return "";
  const next = advanceDate(fedDate, days);
  const open = entries
    .filter((e) => e.section === "Calendar" && !e.done && e.animal === a && /feed/i.test(e.detail || ""))
    .sort((x, y) => x.date.localeCompare(y.date));
  if (open.length) {
    if (open[0].date < next) open[0].date = next;
  } else {
    entries.push({ section: "Calendar", animal: a, detail: "Feeding reminder", date: next, notes: "", repeatDays: 0, done: false, autoFeeding: true });
  }
  save();
  return open.length ? open[0].date : next;
}

/* ---------------- Small "toast" message with an optional Undo ---------------- */
let stToastTimer = null;
function stToast(text, actionLabel, action) {
  let el = document.getElementById("stToast");
  if (!el) {
    el = document.createElement("div");
    el.id = "stToast";
    el.className = "stToast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.innerHTML = "<span></span>";
  el.firstChild.textContent = text;
  if (actionLabel && action) {
    const b = document.createElement("button");
    b.textContent = actionLabel;
    b.onclick = () => {
      el.classList.remove("on");
      action();
    };
    el.appendChild(b);
  }
  el.classList.add("on");
  clearTimeout(stToastTimer);
  stToastTimer = setTimeout(() => el.classList.remove("on"), 6000);
}
/* Modal navigation remembers the previous panel, so settings > devices/account has a real Back button. */
let panelHistory = [];
function syncPanelBack() {
  const b = document.getElementById("panelBackButton");
  if (b) b.hidden = !panelHistory.length;
}
function panelHeading(name) {
  return name === "Welcome Tour"
    ? "Welcome to Scale & Tell ♡"
    : name === "Founding Keeper Studio"
      ? "Founding Keeper ♡"
      : name === "Welcome Setup"
        ? "Welcome to Scale & Tell ♡"
        : name === "Cloud Account"
          ? "My Account"
          : name === "Calendar"
            ? "Care Schedule"
            : name;
}
function panelBack() {
  if (!panelHistory.length) {
    closePanel();
    return;
  }
  if (current === "Founding Keeper Studio") founderCancelPreview();
  const previous = panelHistory.pop();
  current = previous.name;
  selectedAnimal = previous.animal;
  document.getElementById("heading").textContent = panelHeading(current);
  document.getElementById("heading").hidden = animals.includes(current);
  render();
  syncPanelBack();
  const modal = document.querySelector(".modal");
  if (modal) modal.scrollTop = 0;
}
function closePanel() {
  founderCancelPreview();
  if (!document.getElementById("guideZoom").hidden) closeGuideZoom();
  document.getElementById("sheet").classList.remove("on");
  panelHistory = [];
  syncPanelBack();
  if (cloudRemoteWaiting && !cloudAutoDirty) setTimeout(() => cloudApplyWaiting(), 0);
}
function openPanel(name, animal) {
  if (name === "Notifications") name = "Calendar";
  if (cloudAuthReady && !cloudSession && name !== "Care Library") return;
  if (current === "Founding Keeper Studio" && name !== "Founding Keeper Studio") founderCancelPreview();
  if (!document.getElementById("guideZoom").hidden) closeGuideZoom();
  if (document.getElementById("sheet").classList.contains("on") && name !== current) {
    panelHistory.push({ name: current, animal: selectedAnimal });
    if (panelHistory.length > 15) panelHistory.shift();
  }
  if (name === "Watch & Learn" && current !== name) { wlTopic = ""; wlQuery = ""; }
  logPrefillAnimal = name === "Care Logs" && animal ? animal : "";
  if (animal) selectedAnimal = animal;
  else if (animals.includes(name)) selectedAnimal = name;
  current = name;
  const headingEl = document.getElementById("heading");
  headingEl.textContent = panelHeading(name);
  // A reptile's profile card already shows its name, so the title bar stays empty there.
  headingEl.hidden = animals.includes(name);
  document.getElementById("sheet").classList.add("on");
  let modal = document.querySelector(".modal");
  if (modal) modal.scrollTop = 0;
  render();
  syncPanelBack();
  if ((name === "Calendar" || name === "Get the App") && cloudSession && !pushWorking)
    setTimeout(() => pushCheckConfig(), 0);
  if (name === "Founding Keeper Studio") founderRefreshEntitlement();
}
function niceDate(v) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v || "")) return esc(v || "");
  let [y, m, d] = v.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function advanceMonths(date, months, anchorDay) {
  let [y, m, d] = date.split("-").map(Number);
  const day = anchorDay || d;
  m += months;
  y += Math.floor((m - 1) / 12);
  m = ((((m - 1) % 12) + 12) % 12) + 1;
  const last = new Date(y, m, 0).getDate();
  return [y, String(m).padStart(2, "0"), String(Math.min(day, last)).padStart(2, "0")].join("-");
}
const REPEAT_CHOICES = [
  ["0", "One time only"],
  ["1", "Daily"],
  ["2", "Every 2 days"],
  ["3", "Every 3 days"],
  ["7", "Weekly"],
  ["14", "Every 2 weeks"],
  ["m1", "Monthly (same date)"],
  ["custom", "Custom number of days"],
];
function repeatSelectMarkup(selId, customId, labelId, e) {
  const months = Number(e?.repeatMonths) || 0,
    days = Number(e?.repeatDays) || 0,
    current = months ? "m" + months : String(days),
    preset = REPEAT_CHOICES.some(([v]) => v === current);
  const value = preset ? current : "custom";
  return (
    '<label>Repeat<select id="' +
    selId +
    '" onchange="document.getElementById(\'' +
    labelId +
    "').hidden=this.value!=='custom'\">" +
    REPEAT_CHOICES.map(
      ([v, t]) => '<option value="' + v + '"' + (v === value ? " selected" : "") + ">" + t + "</option>",
    ).join("") +
    '</select></label><label id="' +
    labelId +
    '"' +
    (value === "custom" ? "" : " hidden") +
    '>Repeat every how many days?<input type="number" id="' +
    customId +
    '" min="1" max="365" step="1" placeholder="e.g. 8" value="' +
    (value === "custom" ? days : "") +
    '"></label>'
  );
}
/* Returns {repeatDays, repeatMonths} or null after explaining the problem. */
function readRepeat(selId, customId) {
  const v = document.getElementById(selId)?.value || "0";
  if (v.startsWith("m")) return { repeatDays: 0, repeatMonths: Number(v.slice(1)) || 1 };
  const days = v === "custom" ? Number(document.getElementById(customId)?.value) : Number(v);
  if (!Number.isInteger(days) || days < 0 || days > 365 || (v === "custom" && days < 1)) {
    alert("Enter a repeat interval between 1 and 365 days, or choose One time only.");
    return null;
  }
  return { repeatDays: days, repeatMonths: 0 };
}
function advanceDate(date, days) {
  let [y, m, d] = date.split("-").map(Number),
    v = new Date(y, m - 1, d, 12);
  v.setDate(v.getDate() + days);
  return [v.getFullYear(), String(v.getMonth() + 1).padStart(2, "0"), String(v.getDate()).padStart(2, "0")].join("-");
}

/* ===================== V3.22 · care-log reminders, checklists, multiple times, UVB & supplements ===================== */
const REMINDER_LOG = {
  "Feeding reminder": ["Feeding Tracker", ""],
  "Enclosure reminder": ["Enclosure Care", ""],
  "Weight check": ["Weight Tracker", ""],
  "Shed / molt check": ["Shed History", ""],
  "UVB bulb change": ["UVB & Lighting", "UVB bulb change"],
  Supplement: ["Supplements", ""],
  "Medication / veterinary follow-up": ["Health & Vet", ""],
};
let pendingLogDetail = "";
function remTimeLabel(t) {
  const [h, m] = String(t).split(":").map(Number);
  return new Date(2026, 0, 1, h, m).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
function remTimeInputs(listId, times) {
  const list = times && times.length ? times : ["08:00"];
  return (
    '<div id="' +
    listId +
    '" class="remTimeList">' +
    list
      .map(
        (t) =>
          '<div class="remTimeRow"><input type="time" class="remTime" value="' +
          esc(t) +
          '" aria-label="Reminder time"><button type="button" class="smallbutton" onclick="reminderRemoveTime(this)" aria-label="Remove this time">✕</button></div>',
      )
      .join("") +
    '</div><button type="button" class="action secondary" onclick="reminderAddTime(\'' +
    listId +
    "')\">+ Add another time</button>"
  );
}
function reminderAddTime(listId) {
  const list = document.getElementById(listId);
  if (!list) return;
  if (list.querySelectorAll(".remTime").length >= 6) return alert("You can set up to 6 times per reminder.");
  const row = document.createElement("div");
  row.className = "remTimeRow";
  row.innerHTML =
    '<input type="time" class="remTime" value="20:00" aria-label="Reminder time"><button type="button" class="smallbutton" onclick="reminderRemoveTime(this)" aria-label="Remove this time">✕</button>';
  list.appendChild(row);
}
function reminderRemoveTime(btn) {
  const row = btn.closest(".remTimeRow"),
    list = row?.parentElement;
  if (list && list.querySelectorAll(".remTimeRow").length > 1) row.remove();
  else if (row) row.querySelector(".remTime").value = "";
}
function reminderReadTimes(listId) {
  const out = [];
  for (const el of document.querySelectorAll("#" + listId + " .remTime")) {
    const v = (el.value || "").slice(0, 5);
    if (/^([01]\d|2[0-3]):[0-5]\d$/.test(v) && !out.includes(v)) out.push(v);
  }
  return out.sort().slice(0, 6);
}
function reminderExtraFields() {
  return (
    '<div id="remChecklist" hidden><label>Checklist name<input id="remTitle" maxlength="80" placeholder="e.g. Weekly tank clean"></label><label>Checklist items, one per line<textarea id="remItems" maxlength="1500" placeholder="Spot clean&#10;Fresh water&#10;Wipe the glass"></textarea></label></div>' +
    '<label>Notify me<select id="remTimeMode" onchange="reminderTimeModeChanged()"><option value="times" selected>At a time I choose</option><option value="daily">With my daily summary</option></select></label><div id="remTimes">' +
    remTimeInputs("remTimeList", [String(pushHour).padStart(2, "0") + ":00"]) +
    '<p class="helperLine">Each reminder gets its own time. Add more times if needed, for example morning and evening misting.</p></div>'
  );
}
function reminderKindChanged() {
  const checklist = document.getElementById("remKind")?.value === "checklist";
  const detailLabel = document.getElementById("detail")?.closest("label");
  if (detailLabel) detailLabel.hidden = checklist;
  const box = document.getElementById("remChecklist");
  if (box) box.hidden = !checklist;
}
function reminderTimeModeChanged() {
  const box = document.getElementById("remTimes");
  if (box) box.hidden = document.getElementById("remTimeMode")?.value !== "times";
}
/* Reads the Add Reminder form. Returns null (after telling the keeper why) if something is missing. */
function reminderFormValues(detail) {
  const kind = document.getElementById("remKind")?.value === "checklist" ? "checklist" : "care";
  const extra = { kind };
  if (kind === "checklist") {
    const title = (document.getElementById("remTitle")?.value || "").trim().slice(0, 80),
      items = (document.getElementById("remItems")?.value || "")
        .split(/\r?\n/)
        .map((x) => x.trim().slice(0, 100))
        .filter(Boolean)
        .slice(0, 25);
    if (!title || !items.length) {
      alert("Give the checklist a name and at least one item.");
      return null;
    }
    detail = title;
    extra.checklist = items.map((t) => ({ t, done: false }));
  } else if (REMINDER_LOG[detail]) extra.logSection = REMINDER_LOG[detail][0];
  if (document.getElementById("remTimeMode")?.value === "times") {
    const times = reminderReadTimes("remTimeList");
    if (!times.length) {
      alert("Add at least one time, or choose to be notified with your daily summary.");
      return null;
    }
    extra.times = times;
  }
  return { detail, extra };
}
function reminderTimesText(e) {
  return Array.isArray(e.times) && e.times.length ? " · 🔔 " + e.times.map(remTimeLabel).join(", ") : "";
}
function checklistMarkup(e, i) {
  if (!Array.isArray(e.checklist) || !e.checklist.length) return "";
  const doneCount = e.checklist.filter((x) => x.done).length;
  return (
    '<div class="checklist"><small>' +
    doneCount +
    " of " +
    e.checklist.length +
    " done</small>" +
    e.checklist
      .map(
        (x, j) =>
          '<label class="checkItem"><input type="checkbox" ' +
          (x.done ? "checked " : "") +
          (e.done ? "disabled " : "") +
          'onchange="toggleChecklistItem(' +
          i +
          "," +
          j +
          ')"> ' +
          esc(x.t) +
          "</label>",
      )
      .join("") +
    "</div>"
  );
}
function toggleChecklistItem(i, j) {
  const e = entries[i];
  if (!e || e.done || !Array.isArray(e.checklist) || !e.checklist[j]) return;
  const before = structuredClone(e.checklist);
  e.checklist = e.checklist.map((x, k) => (k === j ? { ...x, done: !x.done } : x));
  try {
    save();
  } catch (err) {
    e.checklist = before;
    alert("Could not save this change.");
  }
  render();
}
/* What a repeating reminder carries into its next occurrence. */
function reminderCarryOver(e) {
  const out = {};
  if (e.kind) out.kind = e.kind;
  if (e.logSection) out.logSection = e.logSection;
  if (e.autoKey) out.autoKey = e.autoKey;
  if (e.category) out.category = e.category;
  if (Array.isArray(e.times) && e.times.length) out.times = [...e.times];
  if (Array.isArray(e.checklist)) out.checklist = e.checklist.map((x) => ({ t: x.t, done: false }));
  return out;
}
function reminderOfferLog(e) {
  if (!e || e.kind === "checklist") return;
  const m = REMINDER_LOG[e.detail];
  if (!m || !animals.includes(e.animal)) return;
  const label = m[0] === "Calendar" ? "your care log" : m[0];
  if (confirm("Done ♡ Would you like to add this to " + label + " for " + e.animal + " now?")) {
    pendingLogDetail = m[1];
    openPanel(m[0], e.animal);
  }
}
function reminderEditExtraFields(e) {
  const checklist = Array.isArray(e.checklist);
  return (
    (checklist
      ? '<label>Checklist items, one per line<textarea id="reminderEditItems" maxlength="1500">' +
        esc(e.checklist.map((x) => x.t).join("\n")) +
        "</textarea></label>"
      : "") +
    '<label>Notify me<select id="reminderEditTimeMode" onchange="document.getElementById(\'reminderEditTimes\').hidden=this.value!==\'times\'"><option value="daily"' +
    (e.times?.length ? "" : " selected") +
    '>With my daily summary</option><option value="times"' +
    (e.times?.length ? " selected" : "") +
    '>At a time I choose</option></select></label><div id="reminderEditTimes"' +
    (e.times?.length ? "" : " hidden") +
    ">" +
    remTimeInputs("reminderEditTimeList", e.times) +
    "</div>"
  );
}
function reminderEditReadExtra(e) {
  const out = {};
  if (Array.isArray(e.checklist)) {
    const items = (document.getElementById("reminderEditItems")?.value || "")
      .split(/\r?\n/)
      .map((x) => x.trim().slice(0, 100))
      .filter(Boolean)
      .slice(0, 25);
    if (!items.length) {
      alert("A checklist needs at least one item.");
      return null;
    }
    const was = new Map(e.checklist.map((x) => [x.t, x.done]));
    out.checklist = items.map((t) => ({ t, done: !!was.get(t) }));
  }
  if (document.getElementById("reminderEditTimeMode")?.value === "times") {
    const times = reminderReadTimes("reminderEditTimeList");
    if (!times.length) {
      alert("Add at least one time, or choose the daily summary.");
      return null;
    }
    out.times = times;
  } else out.times = undefined;
  return out;
}
function uvbLastChangeText(a) {
  const last = entries
    .filter((e) => e.animal === a && e.section === "UVB & Lighting" && e.detail === "UVB bulb change")
    .sort((x, y) => y.date.localeCompare(x.date))[0];
  if (!last) return "No UVB bulb change recorded yet for " + a + ".";
  const days = Math.max(0, Math.round((new Date(today() + "T12:00") - new Date(last.date + "T12:00")) / 864e5));
  return (
    "Last UVB bulb change for " +
    a +
    ": " +
    niceDate(last.date) +
    " (" +
    days +
    " day" +
    (days === 1 ? "" : "s") +
    " ago)" +
    (last.bulb ? " · " + last.bulb : "") +
    "."
  );
}

function repeatText(e) {
  const m = Number(e.repeatMonths) || 0,
    d = Number(e.repeatDays) || 0;
  if (m) return m === 1 ? " · Repeats monthly" : " · Repeats every " + m + " months";
  if (d === 1) return " · Repeats daily";
  if (d === 7) return " · Repeats weekly";
  if (d === 14) return " · Repeats every 2 weeks";
  return d > 0 ? " · Repeats every " + d + " days" : "";
}
function escapeAttribute(v) {
  return esc(v);
}
function toggleReminderForm() {
  let f = document.getElementById("reminderForm"),
    b = document.getElementById("addReminderButton");
  if (!f) return;
  f.hidden = !f.hidden;
  b.textContent = f.hidden ? "+ Add Reminder" : "− Hide Reminder Form";
}
function recordMeta(e) {
  return [
    e.section === "Feeding Tracker" && stValidFeedingTime(e.feedingTime) ? "Time " + stFeedingTimeLabel(e.feedingTime) : "",
    e.vetName ? "Vet " + e.vetName : "",
    e.medication ? "Medication " + e.medication : "",
    e.dose ? "Dose " + e.dose : "",
    e.nextSteps ? "Next " + e.nextSteps : "",
    e.preyType,
    e.preyWeight ? e.preyWeight + " g prey" : "",
    e.response,
    e.supplement ? "Supplement " + e.supplement : "",
    e.bulb ? "Bulb " + e.bulb : "",
    e.product,
    e.method,
    e.warmTemp !== undefined && e.warmTemp !== "" ? "Warm " + e.warmTemp + " °F" : "",
    e.coolTemp !== undefined && e.coolTemp !== "" ? "Cool " + e.coolTemp + " °F" : "",
    e.humidity !== undefined && e.humidity !== "" ? "Humidity " + e.humidity + "%" : "",
    e.notes,
  ]
    .filter(Boolean)
    .map(esc)
    .join(" · ");
}
let logLimit = 150;
const LOG_ICONS = { "Feeding Tracker": "🍽", "Shed History": "✨", "Weight Tracker": "⚖", "Enclosure Care": "🏠", "UVB & Lighting": "☀", Supplements: "💊", Observations: "👁", "Health & Vet": "🩺", Breeding: "💞", Ledger: "$" };
function logList(items) {
  if (!items.length) return '<p class="muted">No records yet ♡</p>';
  const pos = new Map(entries.map((e, i) => [e, i]));
  const sorted = items.slice().sort((a, b) => b.date.localeCompare(a.date) || pos.get(b) - pos.get(a));
  let last = "", html = "";
  sorted.slice(0, logLimit).forEach((e) => {
    if (e.date !== last) { last = e.date; html += '<h4 class="logDay">' + esc(niceDate(e.date)) + "</h4>"; }
    const i = pos.get(e), meta = recordMeta(e);
    html += '<div class="entry logRow"><span class="logIcon" aria-hidden="true">' + (LOG_ICONS[e.section] || "•") + '</span><div class="logMain"><b>' + esc(e.animal) + "</b> · " + esc(e.detail) +
      (meta ? '<br><span class="muted">' + meta + "</span>" : "") +
      (e.section === "Health & Vet" && safeHealthAttachment(e.attachment) ? '<div class="healthAttachment"><img src="' + e.attachment + '" alt="Attached care photo" loading="lazy"></div>' : "") +
      '</div><details class="logMore"><summary aria-label="Edit or delete">⋯</summary><div class="recordActions"><button onclick="editCareRecord(' + i + ')">Edit</button><button onclick="deleteCareRecord(' + i + ')">Delete</button></div></details></div>';
  });
  if (sorted.length > logLimit) html += '<button class="action secondary" onclick="logLimit+=200;filterLogs&&document.getElementById(\'filteredLogs\')?filterLogs():render()">Show more (' + (sorted.length - logLimit) + " older)</button>";
  return html;
}
function logChip(type) {
  const sel = document.getElementById("logType");
  if (sel) sel.value = type;
  document.querySelectorAll(".logChips .chip").forEach((c) => c.classList.toggle("on", c.dataset.t === type));
  logLimit = 150;
  filterLogs();
}
function editCareRecord(i) {
  let e = entries[i];
  if (!e || e.section === "Calendar") return;
  if (e.section === "Health & Vet") {
    editHealthRecord(i);
    return;
  }
  careEditIndex = i;
  careEditOrigin = current;
  careEditOriginTab = document.querySelector(".profileNav button.selected")?.textContent || "";
  careReturnFilters =
    current === "Care Logs"
      ? Object.fromEntries(
          ["logSearch", "logAnimal", "logType", "logFrom", "logTo"].map((id) => [
            id,
            document.getElementById(id)?.value || "",
          ]),
        )
      : null;
  openPanel("Edit Care Record", e.animal);
}
function careEditMarkup() {
  let e = entries[careEditIndex];
  if (!e || e.section === "Calendar")
    return '<p>This record is no longer available.</p><button class="action" onclick="openPanel(&quot;Care Logs&quot;)">Back to history</button>';
  let weight = e.section === "Weight Tracker",
    feed = e.section === "Feeding Tracker",
    habitat = e.section === "Enclosure Care",
    uvb = e.section === "UVB & Lighting",
    supp = e.section === "Supplements";
  return (
    '<p class="muted">Edit one saved record for <strong>' +
    esc(e.animal) +
    "</strong>. Your other entries are not affected.</p>" +
    '<label>Date<input type="date" id="careEditDate" value="' +
    esc(e.date) +
    '"></label>' +
    "<label>" +
    (weight ? "Weight (grams)" : "Entry / activity") +
    '<input id="careEditDetail" type="' +
    (weight ? "number" : "text") +
    '" ' +
    (weight ? 'step="0.1" min="0.1"' : 'maxlength="100"') +
    ' value="' +
    esc(weight ? parseFloat(e.detail) : e.detail) +
    '"></label>' +
    (feed
      ? '<label>Feeding time (optional)<input type="time" id="careEditFeedingTime" value="' + esc(e.feedingTime || '') + '"></label><label>Food / prey type<input id="careEditPrey" maxlength="60" value="' +
        esc(e.preyType || "") +
        '"></label><label>Food / prey weight (g)<input type="number" min="0" max="10000" step="0.1" id="careEditPreyWeight" value="' +
        esc(e.preyWeight || "") +
        '"></label><label>Feeding response<input id="careEditResponse" maxlength="80" value="' +
        esc(e.response || "") +
        '"></label><label>Supplement used<input id="careEditSupplement" maxlength="40" value="' +
        esc(e.supplement || "") +
        '"></label>'
      : "") +
    (uvb
      ? '<label>Bulb (brand / type)<input id="careEditBulb" maxlength="80" value="' + esc(e.bulb || "") + '"></label>'
      : "") +
    (supp
      ? '<label>Product<input id="careEditProduct" maxlength="60" value="' +
        esc(e.product || "") +
        '"></label><label>How it was given<input id="careEditMethod" maxlength="40" value="' +
        esc(e.method || "") +
        '"></label>'
      : "") +
    (habitat
      ? [
          ["warmTemp", "Warm-side (°F)", 130],
          ["coolTemp", "Cool-side (°F)", 130],
          ["humidity", "Humidity (%)", 100],
        ]
          .map(
            ([key, label, max]) =>
              "<label>" +
              label +
              '<input type="number" min="0" max="' +
              max +
              '" step="0.1" id="careEdit_' +
              key +
              '" value="' +
              esc(e[key] ?? "") +
              '" placeholder="Optional"></label>',
          )
          .join("")
      : "") +
    '<label>Notes<textarea id="careEditNotes" maxlength="1200">' +
    esc(e.notes || "") +
    '</textarea></label><div class="inlineActions"><button class="action" onclick="saveCareEdit()">Save changes</button><button class="action secondary" onclick="returnFromCareEdit()">Cancel</button></div>'
  );
}
function returnFromCareEdit() {
  let origin = careEditOrigin;
  careEditIndex = -1;
  if (animals.includes(origin)) {
    openPanel(origin);
    profileTab(careEditOriginTab || "History");
  } else {
    openPanel(origin === "Edit Care Record" ? "Care Logs" : origin);
    if (origin === "Care Logs" && careReturnFilters) {
      for (let [id, val] of Object.entries(careReturnFilters)) {
        let el = document.getElementById(id);
        if (el) el.value = val;
      }
      filterLogs();
    }
  }
  careReturnFilters = null;
}
function saveCareEdit() {
  let e = entries[careEditIndex];
  if (!e || e.section === "Calendar") return;
  let d = document.getElementById("careEditDate")?.value,
    detail = document.getElementById("careEditDetail")?.value.trim() || "";
  if (!validDate(d)) {
    alert("Choose a valid date.");
    return;
  }
  if (!detail) {
    alert("Enter a value for the record.");
    return;
  }
  let next = {
    ...e,
    date: d,
    detail,
    notes: document.getElementById("careEditNotes")?.value.trim().slice(0, 1200) || "",
  };
  if (e.section === "Weight Tracker") {
    let n = Number(detail);
    if (!Number.isFinite(n) || n <= 0 || n > 100000) {
      alert("Enter a valid weight in grams.");
      return;
    }
    next.detail = n + " g";
  } else next.detail = detail.slice(0, 100);
  if (e.section === "Feeding Tracker") {
    let w = document.getElementById("careEditPreyWeight").value.trim();
    if (w !== "" && (!Number.isFinite(Number(w)) || Number(w) < 0 || Number(w) > 10000)) {
      alert("Enter a valid food weight or leave blank.");
      return;
    }
    const feedingTime = (document.getElementById("careEditFeedingTime")?.value || "").trim();
    if (feedingTime && !stValidFeedingTime(feedingTime)) return alert("Enter a valid feeding time or leave it blank.");
    next.feedingTime = feedingTime;
    next.preyType = document.getElementById("careEditPrey").value.trim().slice(0, 60);
    next.preyWeight = w;
    next.response = document.getElementById("careEditResponse").value.trim().slice(0, 80);
    next.supplement = (document.getElementById("careEditSupplement")?.value || "").trim().slice(0, 40);
  }
  if (e.section === "UVB & Lighting")
    next.bulb = (document.getElementById("careEditBulb")?.value || "").trim().slice(0, 80);
  if (e.section === "Supplements") {
    next.product = (document.getElementById("careEditProduct")?.value || "").trim().slice(0, 60);
    next.method = (document.getElementById("careEditMethod")?.value || "").trim().slice(0, 40);
  }
  if (e.section === "Enclosure Care") {
    for (let [key, max] of [
      ["warmTemp", 130],
      ["coolTemp", 130],
      ["humidity", 100],
    ]) {
      let v = document.getElementById("careEdit_" + key).value.trim();
      if (v !== "" && (!Number.isFinite(Number(v)) || Number(v) < 0 || Number(v) > max)) {
        alert("Check the " + key + " reading.");
        return;
      }
      next[key] = v;
    }
  }
  let old = e;
  entries[careEditIndex] = next;
  try {
    save();
  } catch (err) {
    entries[careEditIndex] = old;
    alert("This edit could not be saved. Your previous entry is intact.");
    return;
  }
  returnFromCareEdit();
}
function deleteCareRecord(i) {
  let e = entries[i];
  if (
    !e ||
    e.section === "Calendar" ||
    !confirm("Move this " + e.section + " record for " + e.animal + " to Recently Deleted?")
  )
    return;
  deleteWithRecovery(i);
}
function validDate(d) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d || "")) return false;
  let [y, m, day] = d.split("-").map(Number),
    dt = new Date(y, m - 1, day);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === day;
}

function careValues() {
  return [
    ["feedDays", "Feeding interval (days)", 1, 365],
    ["warmMin", "Warm-side minimum (°F)", 0, 130],
    ["warmMax", "Warm-side maximum (°F)", 0, 130],
    ["coolMin", "Cool-side minimum (°F)", 0, 130],
    ["coolMax", "Cool-side maximum (°F)", 0, 130],
    ["humidityMin", "Humidity minimum (%)", 0, 100],
    ["humidityMax", "Humidity maximum (%)", 0, 100],
  ];
}
function carePlanForm(a) {
  let p = carePlans[a] || {};
  return (
    '<p class="muted">Optional goals that YOU choose for this animal. Scale & Tell does not prescribe species-specific temperatures, humidity or feeding schedules.</p>' +
    careValues()
      .map(
        ([key, label, lo, hi]) =>
          "<label>" +
          label +
          '<input type="number" step="1" id="plan_' +
          key +
          '" min="' +
          lo +
          '" max="' +
          hi +
          '" value="' +
          esc(p[key] ?? "") +
          '" placeholder="Optional"></label>',
      )
      .join("") +
    '<label>Keeper notes<textarea id="planNotes" maxlength="500" placeholder="Care routine, veterinary guidance or individual considerations">' +
    esc(p.notes || "") +
    '</textarea></label><button class="action" onclick="saveCarePlan()">Save care plan</button><button class="action secondary" onclick="openPanel(\'Care Insights\',selectedAnimal)">Back to Care Insights</button>'
  );
}
function saveCarePlan() {
  let obj = {},
    fields = careValues();
  for (let [key, label, lo, hi] of fields) {
    let raw = document.getElementById("plan_" + key).value.trim();
    if (raw === "") {
      obj[key] = "";
      continue;
    }
    let n = Number(raw);
    if (!Number.isInteger(n) || n < lo || n > hi) {
      alert("Please check " + label + ".");
      return;
    }
    obj[key] = n;
  }
  for (let [a, b] of [
    ["warmMin", "warmMax"],
    ["coolMin", "coolMax"],
    ["humidityMin", "humidityMax"],
  ]) {
    if (obj[a] !== "" && obj[b] !== "" && obj[a] > obj[b]) {
      alert("The minimum cannot be greater than the maximum.");
      return;
    }
  }
  obj.notes = document.getElementById("planNotes").value.trim().slice(0, 500);
  let old = carePlans[selectedAnimal];
  carePlans[selectedAnimal] = obj;
  if (!saveCarePlans()) {
    if (old === undefined) delete carePlans[selectedAnimal];
    else carePlans[selectedAnimal] = old;
    return;
  }
  openPanel("Care Insights", selectedAnimal);
}
function dayGap(a, b) {
  return Math.round(
    (Date.UTC(...b.split("-").map((n, i) => (i === 1 ? Number(n) - 1 : Number(n)))) -
      Date.UTC(...a.split("-").map((n, i) => (i === 1 ? Number(n) - 1 : Number(n))))) /
      86400000,
  );
}
function sortedAnimalEntries(a, section) {
  return entries
    .filter((e) => e.animal === a && (!section || e.section === section))
    .map((e, i) => ({ ...e, _order: entries.indexOf(e) }))
    .sort((x, y) => x.date.localeCompare(y.date) || x._order - y._order);
}
function latestByDate(a, section) {
  let m = new Map();
  sortedAnimalEntries(a, section).forEach((e) => m.set(e.date, e));
  return [...m.values()];
}
function compareToTarget(label, value, p, min, max, unit) {
  if (value === undefined || value === null || value === "") return "";
  let n = Number(value);
  if (!Number.isFinite(n)) return "";
  let lo = p[min] === "" || p[min] === undefined ? null : Number(p[min]),
    hi = p[max] === "" || p[max] === undefined ? null : Number(p[max]);
  let hasLo = lo !== null && Number.isFinite(lo),
    hasHi = hi !== null && Number.isFinite(hi);
  let result = hasLo && n < lo ? "below" : hasHi && n > hi ? "above" : hasLo || hasHi ? "within" : "no target set";
  return (
    label +
    ": " +
    n +
    unit +
    " · " +
    (result === "no target set"
      ? "no personal target set"
      : result === "within"
        ? "within your entered target"
        : result + " your entered target")
  );
}
function compassData(a) {
  let p = carePlans[a] || {},
    feed = latestByDate(a, "Feeding Tracker").filter((e) => e.detail === "Ate"),
    weights = latestByDate(a, "Weight Tracker").filter((e) => Number.isFinite(parseFloat(e.detail))),
    habitat = sortedAnimalEntries(a, "Enclosure Care").filter((e) =>
      ["warmTemp", "coolTemp", "humidity"].some((k) => e[k] !== undefined && e[k] !== ""),
    ),
    sheds = sortedAnimalEntries(a, "Shed History"),
    obs = sortedAnimalEntries(a, "Observations"),
    health = sortedAnimalEntries(a, "Health & Vet"),
    reminders = sortedAnimalEntries(a, "Calendar").filter((e) => !e.done);
  let lines = [];
  if (feed.length >= 2) {
    let last = feed.slice(-4),
      gaps = last.slice(1).map((e, i) => dayGap(last[i].date, e.date));
    lines.push(
      "Recorded feeding gaps: " +
        gaps.join(", ") +
        " days across the last " +
        last.length +
        " logged eating dates." +
        (p.feedDays !== undefined && p.feedDays !== "" ? " Your chosen interval is " + p.feedDays + " days." : ""),
    );
  } else if (feed.length === 1)
    lines.push("One successful feeding date recorded (" + niceDate(feed[0].date) + "). Log more to see spacing.");
  else lines.push("No successful feeding dates recorded yet.");
  if (weights.length >= 2) {
    let first = weights[0],
      last = weights[weights.length - 1],
      delta = Number((parseFloat(last.detail) - parseFloat(first.detail)).toFixed(1));
    lines.push(
      "Weight records: " +
        parseFloat(first.detail) +
        " g on " +
        niceDate(first.date) +
        " to " +
        parseFloat(last.detail) +
        " g on " +
        niceDate(last.date) +
        " (" +
        (delta > 0 ? "+" : "") +
        delta +
        " g across recorded dates).",
    );
  } else lines.push("Two dated weigh-ins will unlock a weight comparison.");
  if (habitat.length) {
    let h = habitat[habitat.length - 1],
      readings = [
        compareToTarget("Warm side", h.warmTemp, p, "warmMin", "warmMax", " °F"),
        compareToTarget("Cool side", h.coolTemp, p, "coolMin", "coolMax", " °F"),
        compareToTarget("Humidity", h.humidity, p, "humidityMin", "humidityMax", "%"),
      ].filter(Boolean);
    lines.push("Last logged habitat readings (" + niceDate(h.date) + "): " + readings.join("; ") + ".");
  } else lines.push("No habitat measurements logged yet.");
  if (sheds.length) {
    let sh = sheds[sheds.length - 1];
    lines.push("Last shed entry: " + sh.detail + " on " + niceDate(sh.date) + ".");
  }
  if (obs.length) {
    let last = obs.slice(-3);
    lines.push("Recent observations: " + last.map((o) => o.detail + " (" + niceDate(o.date) + ")").join("; ") + ".");
  }
  if (health.length) {
    let latest = health[health.length - 1];
    lines.push(
      "Last documented health / vet entry: " +
        latest.detail +
        " on " +
        niceDate(latest.date) +
        ". Refer to the complete record for details.",
    );
  } else lines.push("No health / vet entries recorded yet.");
  let pending = reminders.sort((x, y) => x.date.localeCompare(y.date)).slice(0, 3);
  return {
    p,
    feed,
    weights,
    habitat,
    sheds,
    obs,
    pending,
    lines,
    recordCount: entries.filter((e) => e.animal === a && !["Calendar", "Ledger", "Breeding"].includes(e.section)).length,
  };
}
function insightLabel(v) {
  if (/feeding/i.test(v) && !/health/i.test(v)) return "FEEDING RHYTHM";
  if (/weight|weigh-in/i.test(v)) return "WEIGHT HISTORY";
  if (/habitat/i.test(v)) return "LAST HABITAT CHECK";
  if (/shed entry/i.test(v)) return "SHED HISTORY";
  if (/observations/i.test(v)) return "RECENT NOTES";
  if (/health \/ vet/i.test(v)) return "HEALTH / VET HISTORY";
  return "CARE HISTORY";
}
function compassMarkup(a) {
  let d = compassData(a);
  return (
    '<p class="notice">Care Insights is a transparent summary of entries YOU have logged. It is not a veterinary assessment, prediction or diagnosis. Missing records do not mean a task was completed.</p><p class="muted">Based on ' +
    d.recordCount +
    " care log entries (reminders not counted) for " +
    esc(a) +
    ". Targets are optional and keeper-entered.</p>" +
    d.lines
      .map((v, i) => '<div class="compassInsight"><small>' + insightLabel(v) + "</small><p>" + esc(v) + "</p></div>")
      .join("") +
    '<div class="inlineActions"><button class="action" onclick="openPanel(\'Care Plan\',selectedAnimal)">Edit personal care targets</button><button class="action secondary" onclick="openPanel(\'Observations\',selectedAnimal)">+ Log observation</button><button class="action secondary" onclick="openPanel(\'Habitat\',selectedAnimal)">View habitat</button><button class="action secondary" onclick="openPanel(\'Care Handoff\',selectedAnimal)">Care handoff</button><button class="action secondary" onclick="openPanel(\'Health & Vet\',selectedAnimal)">Health / Vet history</button><button class="action secondary" onclick="openPanel(\'Pet-Sitter Sheet\',selectedAnimal)">Pet-sitter sheet</button></div><h3 class="sectionTitle">Next on the schedule</h3>' +
    taskMarkup(d.pending) +
    '<p class="muted">Upcoming tasks come from the existing Calendar. Insights do not create duplicate reminders or automatically adjust schedules.</p>'
  );
}
function careHandoffText(a) {
  let d = compassData(a),
    p = profiles[a] || {},
    lines = [
      "SCALE & TELL · CARE HANDOFF",
      a + " · " + (species[a] || "Reptile"),
      "Generated " + new Date().toLocaleDateString("en-US"),
      "Enclosure: " + (p.enclosure || "Not provided"),
      "Keeper notes: " + (p.notes || "None recorded"),
      "Care plan notes: " + (d.p.notes || "None recorded"),
      "",
      "DOCUMENTED CARE SUMMARY",
      ...d.lines.map((x) => "• " + x),
      "",
      "NEXT THREE PENDING REMINDERS",
      ...(d.pending.length
        ? d.pending.map((e) => "• " + e.date + " · " + e.detail)
        : ["No pending reminders recorded."]),
      "",
      "SAVED VET CONTACT",
      "Clinic: " + (savedVet.name || "Not saved"),
      "Phone: " + (savedVet.phone || "Not saved"),
      "",
      "RECENT HEALTH / VET ENTRIES",
      ...(sortedAnimalEntries(a, "Health & Vet").length
        ? sortedAnimalEntries(a, "Health & Vet")
            .slice(-3)
            .reverse()
            .map(
              (e) =>
                "• " +
                e.date +
                " · " +
                e.detail +
                (e.medication ? " · " + e.medication : "") +
                (e.nextSteps ? " · " + e.nextSteps : "") +
                (e.notes ? " · " + e.notes : ""),
            )
        : ["No health entries recorded."]),
      "",
      "RECENT OBSERVATIONS",
      ...(d.obs.length
        ? d.obs
            .slice(-5)
            .reverse()
            .map((o) => "• " + o.date + " · " + o.detail + (o.notes ? " · " + o.notes : ""))
        : ["No observations recorded."]),
      "",
      "This summary contains keeper-entered records only; it does not substitute for veterinary advice. Missing entries are unknown, not proof of normal health.",
    ];
  return lines.join("\n");
}
function copyHandoff() {
  let t = document.getElementById("handoffText"),
    status = document.getElementById("handoffStatus");
  if (!t) return;
  let str = t.value;
  let fallback = () => {
    t.focus();
    t.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {}
    status.textContent = ok ? "Care handoff copied." : "Text selected. Use Copy in your phone menu.";
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(str)
      .then(() => (status.textContent = "Care handoff copied."))
      .catch(fallback);
  } else fallback();
}

// Device directory: keeper-assigned shortcuts and manually entered readings, never fake feeds.
let deviceEditing = -1;
function showDeviceForm(kind, index = -1) {
  let d = index >= 0 ? devices[index] : null;
  if (d) {
    kind = d.kind;
    deviceEditing = index;
  } else deviceEditing = -1;
  if (!animals.length) {
    alert("Add an animal before assigning a device.");
    return;
  }
  let mount = document.getElementById("deviceFormMount");
  if (!mount) {
    openPanel("Devices");
    mount = document.getElementById("deviceFormMount");
  }
  if (!mount) return;
  const makeOptions = (values, selected) =>
    values.map((v) => "<option " + (v === selected ? "selected" : "") + ">" + esc(v) + "</option>").join("");
  const brands =
    kind === "camera"
      ? ["Wyze", "Ring", "Blink", "Tapo", "Kasa", "Eufy", "Other"]
      : ["AcuRite", "Govee", "INKBIRD", "SensorPush", "ThermoPro", "Zoo Med", "Other"];
  let model = d?.model || "";
  mount.innerHTML =
    '<div class="deviceFormCard"><h3 class="sectionTitle">' +
    (d ? "Edit" : "Add") +
    " " +
    (kind === "camera" ? "camera shortcut" : "thermometer / hygrometer") +
    "</h3>" +
    '<label>Animal<select id="devAnimal">' +
    makeOptions(animals, d?.animal || selectedAnimal) +
    "</select></label>" +
    '<label>Nickname<input id="devName" maxlength="55" placeholder="e.g. Warm-side gauge" value="' +
    esc(d?.nickname || "") +
    '"></label>' +
    '<label>Manufacturer<select id="devBrand">' +
    makeOptions(brands, d?.brand || "Other") +
    "</select></label>" +
    '<label>Model (optional)<input id="devModel" maxlength="75" placeholder="Model" value="' +
    esc(model) +
    '"></label>' +
    (kind === "sensor"
      ? '<label>Placement<select id="devPlacement">' +
        makeOptions(["Warm side", "Cool side", "Middle", "Ambient", "Other"], d?.placement || "Warm side") +
        '</select></label><label>What does it read?<select id="devMetrics">' +
        makeOptions(["Temperature + humidity", "Temperature", "Humidity"], d?.metrics || "Temperature + humidity") +
        '</select></label><p class="helperLine">Readings stay in the manufacturer app. Use Log habitat check to record the values in Scale & Tell.</p>'
      : '<label>Official HTTPS viewing link (optional)<input type="url" id="devLink" maxlength="350" placeholder="Leave blank to use the manufacturer shortcut" value="' +
        esc(d?.link || "") +
        '"></label><p class="helperLine">Never paste passwords, stream URLs, tokens or private camera credentials. This only opens the provider app or website.</p>') +
    '<div class="inlineActions"><button class="action" onclick="saveDeviceForm(&quot;' +
    kind +
    '&quot;)">Save device</button><button class="action secondary" onclick="cancelDeviceForm()">Cancel</button></div><p id="deviceFormStatus" role="status" class="helperLine"></p></div>';
  mount.scrollIntoView({ block: "nearest", behavior: "smooth" });
}
function cancelDeviceForm() {
  let mount = document.getElementById("deviceFormMount");
  if (mount) mount.innerHTML = "";
  deviceEditing = -1;
}
function saveDeviceForm(kind) {
  const read = (id) => document.getElementById(id)?.value.trim() || "";
  let name = read("devName"),
    animal = read("devAnimal"),
    brand = read("devBrand"),
    model = read("devModel"),
    link = kind === "camera" ? read("devLink") : "";
  let status = document.getElementById("deviceFormStatus");
  if (!name || name.length > 55 || !animals.includes(animal)) {
    if (status) status.textContent = "Choose an animal and enter a device nickname.";
    return;
  }
  if (link && !validCameraLink(link)) {
    if (status) status.textContent = "Use a normal public HTTPS service link, not a private stream or credential link.";
    return;
  }
  let d = {
    id: deviceEditing >= 0 ? devices[deviceEditing].id : deviceId(),
    kind,
    animal,
    nickname: name,
    brand,
    model,
    link,
    placement: kind === "sensor" ? read("devPlacement") : "",
    metrics: kind === "sensor" ? read("devMetrics") : "",
  };
  if (deviceEditing >= 0 && devices[deviceEditing]?.goveeDevice)
    Object.assign(d, { goveeSku: devices[deviceEditing].goveeSku, goveeDevice: devices[deviceEditing].goveeDevice });
  let next = devices.slice();
  if (deviceEditing >= 0) next[deviceEditing] = d;
  else next.push(d);
  if (saveDevices(next)) {
    deviceEditing = -1;
    if (current === "Devices") render();
    else profileTab("Habitat");
  }
}
function editDevice(i) {
  let d = devices[i];
  if (!d) return;
  selectedAnimal = d.animal;
  if (current === "Devices") showDeviceForm(d.kind, i);
  else showDeviceForm(d.kind, i);
}
function deleteDevice(i) {
  let d = devices[i];
  if (!d || !confirm("Remove " + d.nickname + " from Scale & Tell? No readings or care logs are deleted.")) return;
  if (saveDevices(devices.filter((_, j) => j !== i))) {
    if (current === "Devices") render();
    else profileTab("Habitat");
  }
}
function logHabitatFor(a) {
  if (!animals.includes(a)) return;
  openPanel("Enclosure Care", a);
}
function habitatReadingSummary(a) {
  let reading = entries
    .filter(
      (e) =>
        e.animal === a &&
        e.section === "Enclosure Care" &&
        [e.warmTemp, e.coolTemp, e.humidity].some((v) => v !== undefined && v !== ""),
    )
    .map((e, i) => ({ ...e, _i: entries.indexOf(e) }))
    .sort((x, y) => y.date.localeCompare(x.date) || y._i - x._i)[0];
  return reading
    ? '<div class="habitatSummary"><strong>Latest manually logged enclosure check</strong><p>' +
        niceDate(reading.date) +
        " · " +
        recordMeta(reading) +
        "</p><small>Recorded by the keeper. These readings are NOT automatically pulled from assigned devices.</small></div>"
    : '<div class="habitatSummary"><strong>No environmental readings logged yet</strong><p>Add an enclosure check to start a habitat history.</p></div>';
}
function deviceCard(d) {
  let i = devices.indexOf(d),
    camera = d.kind === "camera",
    info = cameraBrandInfo(d.brand),
    url = d.link || info.url;
  return (
    '<div class="deviceCard"><div class="deviceHeading"><b>' +
    esc(d.nickname) +
    "</b><span>" +
    esc(camera ? "Camera" : "Sensor") +
    "</span></div><p>" +
    esc(d.brand) +
    (d.model ? " · " + esc(d.model) : "") +
    (camera
      ? ""
      : " · " + esc(d.placement || "Unassigned position") + " · " + esc(d.metrics || "Temperature + humidity")) +
    "</p>" +
    (camera
      ? "<small>Shortcut only. No video is stored or streamed in Scale & Tell. " +
        esc(d.link ? "Opens your chosen HTTPS service link." : CAMERA_APPS[d.brand] ? "Opens the " + CAMERA_APPS[d.brand].name + " app on your phone. Then pick " + d.nickname + "." : info.note) +
        "</small>" +
        (!d.link && CAMERA_APPS[d.brand]
          ? '<button class="deviceLink" onclick="openCameraApp(' + i + ')">Open ' + esc(CAMERA_APPS[d.brand].name) + ' app ↗</button>'
          : url
          ? '<a class="deviceLink" href="' +
            esc(url) +
            '" target="_blank" rel="noopener noreferrer">Open camera service ↗</a>'
          : '<p class="helperLine">Open ' + esc(info.name) + " on this device and select " + esc(d.nickname) + ".</p>")
      : d.goveeDevice
        ? '<small class="deviceOffline">Linked to Govee · tap to pull the current reading into your habitat log.</small><button class="deviceLink" onclick="goveePull(' + i + ')">Pull Govee reading</button>'
        : '<small class="deviceOffline">Assigned gauge · readings entered by you, not pulled automatically.</small><button class="deviceLink" onclick="logHabitatFor(&quot;' +
        esc(d.animal) +
        '&quot;)">Log a reading</button>') +
    '<div class="recordActions"><button onclick="editDevice(' +
    i +
    ')">Edit / reassign</button><button onclick="deleteDevice(' +
    i +
    ')">Remove</button></div></div>'
  );
}
function habitatTrend(a) {
  let arr = entries
    .filter(
      (e) =>
        e.animal === a &&
        e.section === "Enclosure Care" &&
        [e.warmTemp, e.coolTemp, e.humidity].some((v) => v !== undefined && v !== "" && Number.isFinite(Number(v))),
    )
    .map((e, i) => ({ e, i }))
    .sort((x, y) => x.e.date.localeCompare(y.e.date) || x.i - y.i)
    .slice(-14)
    .map((o) => o.e);
  if (arr.length < 2)
    return '<p class="helperLine">Log two or more enclosure readings to see a historical habitat trend.</p>';
  let first = arr[0].date,
    last = arr[arr.length - 1].date;
  let lines = [
    ["warmTemp", "Warm side", "#79538e", 0, 130, "°F"],
    ["coolTemp", "Cool side", "#586c38", 0, 130, "°F"],
    ["humidity", "Humidity", "#bd7540", 0, 100, "%"],
  ];
  let charts = lines
    .map(([key, label, color, min, max, unit]) => {
      let pts = arr.map((e, i) => ({
        x: 20 + (i * 280) / Math.max(1, arr.length - 1),
        y: e[key] === "" || e[key] === undefined ? null : 115 - ((Number(e[key]) - min) / (max - min)) * 90,
      }));
      let segments = [],
        segment = [];
      for (let o of pts) {
        if (o.y === null) {
          if (segment.length > 1) segments.push(segment);
          segment = [];
        } else segment.push(o.x.toFixed(1) + "," + o.y.toFixed(1));
      }
      if (segment.length > 1) segments.push(segment);
      let dots = pts
        .filter((x) => x.y !== null)
        .map((p) => '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="2.8" fill="' + color + '"/>')
        .join("");
      return (
        segments
          .map(
            (x) =>
              '<polyline points="' +
              x.join(" ") +
              '" fill="none" stroke="' +
              color +
              '" stroke-width="2.5" stroke-linejoin="round"/>',
          )
          .join("") + dots
      );
    })
    .join("");
  return (
    '<div class="habitatChartWrap"><strong>Manual habitat readings · last ' +
    arr.length +
    ' logged checks</strong><svg viewBox="0 0 320 140" role="img" aria-label="Historical temperature and humidity measurements"><path d="M20 115H300" stroke="#d9c7dc" stroke-width="1"/>' +
    charts +
    '</svg><div class="habitatChartLegend">' +
    lines.map((x) => '<span style="--line:' + x[2] + '">' + x[1] + "</span>").join("") +
    "</div><small>" +
    niceDate(first) +
    " → " +
    niceDate(last) +
    "</small><small>Values are keeper-entered. This is NOT a live sensor feed or automatic alert system.</small></div>"
  );
}
function habitatMarkup(a) {
  let mine = devices.filter((d) => d.animal === a),
    sensors = mine.filter((d) => d.kind === "sensor"),
    cameras = mine.filter((d) => d.kind === "camera"),
    p = carePlans[a] || {},
    history = entries.filter((e) => e.animal === a && e.section === "Enclosure Care");
  let targets = [
    ["Warm", p.warmMin, p.warmMax, "°F"],
    ["Cool", p.coolMin, p.coolMax, "°F"],
    ["Humidity", p.humidityMin, p.humidityMax, "%"],
  ]
    .filter((x) => (x[1] !== undefined && x[1] !== "") || (x[2] !== undefined && x[2] !== ""))
    .map(
      (x) =>
        x[0] +
        ": " +
        (x[1] !== undefined && x[1] !== "" ? x[1] : "…") +
        "–" +
        (x[2] !== undefined && x[2] !== "" ? x[2] : "…") +
        x[3],
    );
  return (
    gaugeComingSoon() +
    habitatReadingSummary(a) +
    '<div class="inlineActions"><button class="action" onclick="openPanel(&quot;Enclosure Care&quot;,selectedAnimal)">+ Log habitat check</button><button class="action secondary" onclick="openPanel(&quot;Care Plan&quot;,selectedAnimal)">Edit personal targets</button></div><p class="helperLine">' +
    (targets.length ? "Your chosen targets: " + esc(targets.join(" · ")) : "No personal habitat targets set yet.") +
    '</p><details class="compactDisclosure"><summary>Sensors (' +
    sensors.length +
    ") & camera shortcuts (" +
    cameras.length +
    ')</summary><h3 class="sectionTitle">Assigned sensors</h3>' +
    (sensors.length ? sensors.map(deviceCard).join("") : '<p class="muted">No sensors assigned yet.</p>') +
    '<h3 class="sectionTitle">Camera shortcuts</h3>' +
    (cameras.length
      ? cameras.map(deviceCard).join("")
      : '<p class="muted">No camera shortcuts assigned. These are optional.</p>') +
    '<div class="inlineActions"><button class="action" onclick="showDeviceForm(&quot;sensor&quot;)">+ Add sensor</button><button class="action secondary" onclick="showDeviceForm(&quot;camera&quot;)">+ Add camera</button><button class="action secondary" onclick="openPanel(&quot;Devices&quot;,selectedAnimal)">Manage all devices</button></div><div id="deviceFormMount"></div></details><details class="compactDisclosure"><summary>Habitat trends (manual entries)</summary>' +
    habitatTrend(a) +
    '</details><details class="compactDisclosure"><summary>Complete Habitat History (' +
    history.length +
    ')</summary><p class="helperLine">Same records as Care Logs. Newest first.</p>' +
    logList(history) +
    "</details>"
  );
}
function gaugeComingSoon() {
  return '<section class="gaugeComingSoon" aria-label="Gauge connections"><strong>✧ Live gauge connections</strong><p><b>Govee:</b> available now. Connect your own Govee account and pull temperature and humidity straight into your habitat log. <button class="linkBtn" onclick="openPanel(\'Govee Sensors\')">Connect Govee →</button></p><p><b>Herpstat:</b> works with Scale &amp; Tell. Your Herpstat thermostat sends its temperatures, humidity and power straight to Scale &amp; Tell, with alerts when it goes out of range. <button class="linkBtn" onclick="openPanel(\'Herpstat\')">Connect Herpstat →</button></p><p><b>SensorPush:</b> SensorPush is sending us test equipment so we can build the connection. Coming soon.</p><small>Other brands: assign your gauge and log readings below. They&#39;ll appear in your habitat history.</small></section>';
}
function deviceDirectory() {
  return (
    gaugeComingSoon() +
    '<p class="resourceIntro">Keep the camera and gauge assignments for each animal in one place. No passwords or live video are stored here.</p><p class="countLine">' +
    devices.length +
    " assigned device" +
    (devices.length === 1 ? "" : "s") +
    "</p>" +
    (devices.length
      ? devices
          .slice()
          .sort((a, b) => a.animal.localeCompare(b.animal))
          .map(
            (d) =>
              '<div class="deviceDirectory"><b>' +
              esc(d.animal) +
              "</b> · " +
              esc(d.nickname) +
              " <small>(" +
              esc(d.kind) +
              ')</small><div class="inlineActions"><button class="smallbutton" onclick="editDevice(' +
              devices.indexOf(d) +
              ')">Edit</button><button class="smallbutton" onclick="deleteDevice(' +
              devices.indexOf(d) +
              ')">Remove</button></div></div>',
          )
          .join("")
      : '<p class="muted">No devices assigned yet.</p>') +
    '<div class="inlineActions"><button class="action" onclick="showDeviceForm(&quot;sensor&quot;)">+ Add gauge</button><button class="action secondary" onclick="showDeviceForm(&quot;camera&quot;)">+ Add camera</button></div><div id="deviceFormMount"></div><p class="helperLine">Assigned gauges are currently for organization and manual habitat logs only. No automatic temperature/humidity readings or background sensor alerts are active.</p><button class="action secondary" onclick="openPanel(&quot;My Reptiles&quot;)">Back to My Reptiles</button>'
  );
}

const SCALE_LC_VERSION = "3.83";
const SCALE_SUPPORT_EMAIL = "support@scaleandtell.app";
const SCALE_LC_ICON = "icon-180.png";
/* Android/desktop Chrome can install with one tap; iPhone only allows Share → Add to Home Screen. */
let installPromptEvent = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installPromptEvent = e;
  if (current === "Get the App") render();
});
window.addEventListener("appinstalled", () => {
  installPromptEvent = null;
  if (current === "Get the App") render();
});
function installStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
}
async function installNow() {
  if (!installPromptEvent) return;
  installPromptEvent.prompt();
  try {
    await installPromptEvent.userChoice;
  } catch (e) {}
  installPromptEvent = null;
  render();
}
async function installShare() {
  const url = new URL("./", location.href).href,
    note = document.getElementById("installCopyNote");
  if (navigator.share) {
    try {
      await navigator.share({ title: "Scale & Tell", url });
      return;
    } catch (e) {
      if (e && e.name === "AbortError") return;
    }
  }
  installCopyLink();
}
async function installCopyLink() {
  const link = new URL("./", location.href).href,
    note = document.getElementById("installCopyNote") || document.getElementById("installCopyNoteTour");
  try {
    await navigator.clipboard.writeText(link);
    if (note) note.textContent = "✓ Link copied. Paste it into Safari, then tap Share → Add to Home Screen.";
  } catch (e) {
    if (note) note.textContent = link;
  }
}
function installActionMarkup(isiOS) {
  if (installStandalone()) return '<p class="lcSmall">✓ You are using the installed app.</p>';
  if (installPromptEvent)
    return '<button class="action" type="button" onclick="installNow()">Install Scale &amp; Tell</button>';
  if (isiOS)
    return '<ol class="lcSteps"><li>Tap <b>Add to Home Screen</b> below. Your phone&#39;s share menu opens.</li><li>Scroll down the menu and tap <b>Add to Home Screen</b>, then <b>Add</b>.</li><li>Open Scale &amp; Tell from the new icon on your Home Screen.</li></ol><button class="action" type="button" onclick="installShare()">Add to Home Screen</button><p class="lcSmall">Not in the menu? Tap <b>Copy app link</b>, open <b>Safari</b>, paste the link, then tap Share → Add to Home Screen.</p><button class="action secondary" type="button" onclick="installCopyLink()">Copy app link</button><p class="lcSmall" id="installCopyNote"></p>';
  return "";
}
function installGuideMarkup() {
  const ua = navigator.userAgent || "";
  const isiOS = /iPhone|iPad|iPod/i.test(ua),
    android = /Android/i.test(ua);
  const isiOSChrome = isiOS && /CriOS|FxiOS|EdgiOS/i.test(ua);
  let intro = isiOS
    ? "<p><b>On iPhone:</b> open Scale & Tell in Safari, tap Share (the square with an arrow), then choose <b>Add to Home Screen</b> and tap Add.</p>"
    : android
      ? "<p><b>On Android:</b> in Chrome, tap the menu (⋮), then <b>Install app</b> or <b>Add to Home screen</b>. In Samsung Internet, tap <b>☰</b> → <b>Add page to</b> → <b>Home screen</b>. In Firefox, tap <b>⋮</b> → <b>Add app to Home screen</b>.</p>"
      : "<p>On iPhone, use Safari → Share → Add to Home Screen. On Android, use Chrome → menu (⋮) → Add to Home screen, if offered.</p>";
  return (
    '<p class="lcLead">Keep your reptile journal one tap away. <a href="https://scaleandtell.app/" target="_blank" rel="noopener noreferrer"><b>Open Scale &amp; Tell ↗</b></a></p><div class="lcPanel"><div class="lcIconPreview"><img src="' +
    SCALE_LC_ICON +
    '" alt="Scale & Tell icon"><div><h3>Scale & Tell ♡</h3><p>Your reptile journal, one tap away.</p></div></div>' +
    intro +
    installActionMarkup(isiOS) +
    (isiOSChrome
      ? '<p class="lcSmall">If you are in a different iPhone browser, first open the preview link in Safari.</p>'
      : "") +
    '<p class="lcSmall">You will still need internet access for sign-in and cloud saving. This shortcut is not an offline app.</p></div>' +
    '<div class="lcPanel"><h3>Care reminders are optional</h3><p>After installation, open the Home Screen app, sign in and choose <b>Care Schedule → Enable Reminders</b>. Notification permission is only requested there when you tap Enable.</p><button class="action secondary" onclick="openPanel(&quot;Calendar&quot;)">Open Care Schedule</button></div>' +
    '<div class="lcPanel"><h3>Need help?</h3><p>Reach us at <a href="mailto:support@scaleandtell.app?subject=Scale%20%26%20Tell%20Support">support@scaleandtell.app</a>.</p></div><div class="lcPanel"><h3>Already added it?</h3><p>Open the icon on your Home Screen and sign into the same Scale & Tell account to access your journal.</p></div>'
  );
}
function feedbackMarkup() {
  return '<p class="lcLead">Something confusing, a bug, or a feature idea? Tell us in your own words. Send an email to <a href="mailto:support@scaleandtell.app">support@scaleandtell.app</a>. You choose whether to send it.</p><div class="lcPanel"><label for="lcFeedbackKind"><b>What is this about?</b></label><select class="lcEntry" id="lcFeedbackKind"><option>Something isn’t working</option><option>Something is confusing</option><option>Feature idea</option><option>Other feedback</option></select><label for="lcFeedbackBody"><b>Tell us what happened</b></label><textarea class="lcEntry lcEntryArea" id="lcFeedbackBody" maxlength="1600" placeholder="What were you trying to do? What happened instead?"></textarea><button class="action" onclick="sendScaleFeedback()">Email support</button><p id="lcFeedbackStatus" class="lcSmall" role="status"></p><p class="lcSmall">We won’t include your email, animal photos, care logs or other private data automatically. Your email app opens with a prepared message. Review it and tap Send yourself.</p></div>';
}
function scaleSupportMail(subject, message) {
  const url =
    "mailto:" +
    SCALE_SUPPORT_EMAIL +
    "?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(message);
  window.location.href = url;
}
function sendScaleFeedback() {
  const input = document.getElementById("lcFeedbackBody"),
    el = document.getElementById("lcFeedbackStatus");
  const description = (input?.value || "").trim();
  if (description.length < 8) {
    if (el) el.textContent = "Please add a little more detail first.";
    return;
  }
  const kind = document.getElementById("lcFeedbackKind")?.value || "Feedback";
  const message = "Scale & Tell feedback\nVersion: " + SCALE_LC_VERSION + "\nType: " + kind + "\n\n" + description;
  scaleSupportMail("Scale & Tell: " + kind, message);
  if (el)
    el.textContent = "Your email app should open. Review your message and tap Send. Nothing is sent automatically.";
}
function privacyAccountMarkup() {
  const email = cloudSession?.user?.email || "your signed-in account";
  return (
    '<p class="lcLead">Your keeper journal belongs to your account. Here’s how its information is handled.</p>' +
    '<div class="lcPanel"><h3>What stays private?</h3><p>Your animal profiles, care logs, Photo Journal, reminders and saved account email are personal records. They are not published to the Herps & Hers Facebook group or the Messenger Keeper Lounge.</p><p>Those external communities have their own platform rules. Opening their links does not share your journal.</p></div>' +
    '<div class="lcPanel"><h3>Automatic saving</h3><p>When you’re signed in, Scale & Tell saves to your account. If a save fails or two copies need review, the app should tell you rather than erase changes.</p><button class="action secondary" onclick="openPanel(\'Cloud Account\')">My Account</button><button class="action secondary" onclick="openPanel(\'Data & Backup\')">Optional backup</button></div>' +
    '<div class="lcPanel lcDanger"><h3>Delete my account</h3><p>This permanently deletes your Scale & Tell account, every animal, care log, reminder, photo and setting. It can’t be undone. Download a backup first if you want a copy.</p><button class="action secondary" onclick="openPanel(\'Data & Backup\')">Download a backup first</button><details class="compactDisclosure"><summary>I want to delete my account</summary><label>Type <b>DELETE</b> to confirm<input id="deleteConfirm" autocomplete="off" autocapitalize="characters" placeholder="DELETE"></label><button class="action dangerAction" onclick="deleteMyAccount()">Permanently delete my account</button><p id="lcDeleteStatus" class="lcSmall" role="status"></p><p class="lcSmall">Lifetime purchases aren’t refunded by deleting an account. Questions? <a href="mailto:support@scaleandtell.app">support@scaleandtell.app</a></p></details></div>' +
    '<p class="lcSmall">Signed-in account: ' +
    esc(email) +
    '. Support: <a href="mailto:support@scaleandtell.app">support@scaleandtell.app</a>. See the <a href="./privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>, <a href="./terms.html" target="_blank" rel="noopener noreferrer">Terms of Use</a> and <a href="./deletion.html" target="_blank" rel="noopener noreferrer">deletion request instructions</a>.</p>'
  );
}
/* V3.31 · Keepers delete their own account: photos first (storage), then the account and everything linked to it. */
async function deleteMyAccount() {
  const status = document.getElementById("lcDeleteStatus"),
    say = (t) => {
      if (status) status.textContent = t;
    };
  if ((document.getElementById("deleteConfirm")?.value || "").trim().toUpperCase() !== "DELETE") {
    say("Type DELETE in the box to confirm.");
    return;
  }
  if (!cloudClient || !cloudSession) {
    say("Please sign in first.");
    return;
  }
  if (!confirm("Last check: permanently delete your Scale & Tell account and all of its records?")) return;
  say("Deleting your account…");
  try {
    const user = await cloudAuthorizedUser();
    // Make sure deletion is available before touching any photos.
    const probe = await cloudClient.rpc("delete_my_account", { p_confirm: "CHECK" });
    if (!probe.error || !/DELETE/.test(probe.error.message || "")) throw Error("Account deletion is not available yet.");
    try {
      await pushDisable(true);
    } catch (_) {}
    if (user.realId) throw Error("Leave the team first (Menu → Business Tools → Team logins), then delete your account.");
    for (const folder of [user.id + "/photos", user.id]) {
      for (let round = 0; round < 20; round++) {
        const { data } = await cloudClient.storage.from(CLOUD_BUCKET).list(folder, { limit: 100 });
        const files = (data || []).filter((f) => f && f.id).map((f) => folder + "/" + f.name);
        if (!files.length) break;
        const { error } = await cloudClient.storage.from(CLOUD_BUCKET).remove(files);
        if (error) break;
      }
    }
    const { error } = await cloudClient.rpc("delete_my_account", { p_confirm: "DELETE" });
    if (error) throw error;
    cloudPauseWrites = true;
    try {
      for (const key of Object.keys(CLOUD_LOCAL_KEYS)) localStorage.removeItem(key);
      ["scaleTellSyncOwner33", "scaleTellSyncRev33", "scaleTellSyncDirty33"].forEach((k) => localStorage.removeItem(k));
    } catch (_) {}
    try {
      await cloudClient.auth.signOut({ scope: "local" });
    } catch (_) {}
    alert("Your Scale & Tell account has been deleted. Thank you for being part of Herps & Hers ♡");
    location.reload();
  } catch (e) {
    say("Your account could not be deleted right now. Please try again, or email support@scaleandtell.app and we’ll delete it for you.");
  }
}
function prepareDeletionRequest() {
  const email = cloudSession?.user?.email || "(include account email)";
  const message =
    "Hello Herps & Hers,\n\nI would like to request deletion of my Scale & Tell account and associated cloud data.\n\nAccount email: " +
    email +
    "\n\nPlease confirm the next steps.\n";
  scaleSupportMail("Scale & Tell account deletion request", message);
  const el = document.getElementById("lcDeleteStatus");
  if (el) el.textContent = "Your email app should open. Review and tap Send. Your account has not been deleted.";
}

function render() {
  updateStats();
  renderHomeCards();
  let el = document.getElementById("content");
  if (current === "Menu") {
    el.innerHTML = menuMarkup();
    return;
  }
  if (current === "Welcome Tour") {
    el.innerHTML = tourMarkup();
    return;
  }
  if (current === "Get the App") {
    el.innerHTML = installGuideMarkup();
    return;
  }
  if (current === "Help & Feedback") {
    el.innerHTML = helpMarkup() + feedbackMarkup();
    return;
  }
  if (current === "Privacy & Account") {
    el.innerHTML = privacyAccountMarkup();
    return;
  }
  if (BREEDER_PANELS.includes(current)) {
    el.innerHTML = breederMarkup();
    document.getElementById("heading").textContent = breederHeading();
    return;
  }
  if (current === "Founding Keeper Studio" && stPlanChecking()) {
    el.innerHTML = '<p class="planChecking">Checking your plan…</p>';
    return;
  }
  if (current === "Founding Keeper Studio") {
    el.innerHTML = founderStudioMarkup();
    setTimeout(founderMountPayPal, 0);
    return;
  }
  if (current === "Cloud Account") {
    el.innerHTML = cloudAccountMarkup();
    return;
  }
  if (current === "Edit Care Record") {
    el.innerHTML = careEditMarkup();
    return;
  }
  if (current === "Edit Reminder") {
    el.innerHTML = reminderEditMarkup();
    return;
  }
  if (current === "Import Existing Records") {
    el.innerHTML = importRecordsMarkup();
    return;
  }
  if (current === "Welcome Setup") {
    el.innerHTML =
      '<div class="onboard"><h3>Welcome to Scale & Tell ♡</h3><p class="onboardIntro">Your animals. Their stories. All in one beautiful place.</p><button class="action" onclick="addAnimal()">+ Add My First Animal</button><button class="action secondary" onclick="openPanel(&quot;Import Existing Records&quot;)">Import Existing Records</button><button class="action secondary" onclick="openPanel(&quot;Care Library&quot;)">Explore Care Guides</button><a class="authFacebook onboardSocial" href="' +
      esc(SOCIAL_DEFAULT.group) +
      '" target="_blank" rel="noopener noreferrer"><span class="fbGlyph" aria-hidden="true">f</span>Join Our Facebook Community ↗</a><p class="muted">Your personal records save privately to your account. You can update your animal photos any time.</p></div>';
    return;
  }
  if (
    !animals.length &&
    [
      "Feeding Tracker",
      "Enclosure Care",
      "Shed History",
      "Observations",
      "UVB & Lighting",
      "Supplements",
      "Calendar",
      "Weight Tracker",
      "Health & Vet",
      "Pet-Sitter Sheet",
      "Log Care",
    ].includes(current)
  ) {
    el.innerHTML =
      '<p class="notice">Add your first animal to start recording care.</p><button class="action" onclick="addAnimal()">+ Add animal</button>';
    return;
  }
  if (animals.includes(current)) {
    let a = current,
      p = profiles[a] || {},
      history = entries.filter((e) => e.animal === a && e.section !== "Calendar"),
      feeding = history.filter((e) => e.section === "Feeding Tracker"),
      weights = history.filter((e) => e.section === "Weight Tracker"),
      last = feeding
        .filter((e) => e.detail === "Ate")
        .sort((x, y) => y.date.localeCompare(x.date) || entries.indexOf(y) - entries.indexOf(x))[0];
    el.innerHTML =
      '<div class="profileHero">' +
      profilePicture(a) +
      "<h3>" +
      esc(a) +
      " ♡</h3><p>" +
      esc(species[a] || "Reptile") +
      '</p><p class="muted">' +
      [p.sex && p.sex !== "Unknown" ? p.sex : "", p.morph, p.hatchDate ? "Born " + niceDate(p.hatchDate) : ""]
        .filter(Boolean)
        .map(esc)
        .join(" · ") +
      '</p></div><div class="profileGrid"><div><small>Last feeding</small><b>' +
      (last ? niceDate(last.date) : "Not recorded") +
      "</b></div><div><small>Latest weight</small><b>" +
      esc(
        weights
          .map((e) => ({ ...e, _i: entries.indexOf(e) }))
          .sort((x, y) => y.date.localeCompare(x.date) || y._i - x._i)
          .map((e) => (/^\d+(\.\d+)?$/.test(String(e.detail).trim()) ? String(e.detail).trim() + " g" : e.detail))[0] ||
          p.weight ||
          "Not set",
      ) +
      "</b></div><div><small>Care entries</small><b>" +
      history.length +
      "</b></div><div><small>Next care</small><b>" +
      nextCareLabel(a) +
      '</b></div></div><button class="action profilePrimaryAction" onclick="openQuickLog(selectedAnimal)">＋ Quick Log</button><div class="tabs profileNav" role="tablist" aria-label="Animal profile sections"><button type="button" onclick="profileTab(&quot;Overview&quot;)" role="tab">Overview</button><button type="button" onclick="profileTab(&quot;History&quot;)" role="tab">History</button><button type="button" onclick="profileTab(&quot;Habitat&quot;)" role="tab">Habitat</button><button type="button" onclick="profileTab(&quot;Photos&quot;)" role="tab">Photos</button></div><div id="profileTab"></div><details class="profileMore"><summary>More profile options</summary><div class="compactActions"><button onclick="editAnimalByName(selectedAnimal)">Edit animal details</button><button onclick="stShareAnimal(selectedAnimal)">Share this animal ↗</button>' + (bizIsBreeder() ? '<button onclick="geneOpen(selectedAnimal)">Genetics &amp; lineage</button>' : '') + (stIsRescue() ? '<button onclick="rescueOf(selectedAnimal) ? rescueOpen(selectedAnimal) : (profiles[selectedAnimal] = { ...(profiles[selectedAnimal] || {}), rescue: { status: \'Intake\', intakeDate: today() } }, bizSaveProfiles(), rescueOpen(selectedAnimal))">Rescue record</button>' : '') + (stIsRescue() || bizIsBreeder() || stCanUsePack() ? '<button onclick="rescueAnimal=selectedAnimal;medEditId=\'\';openPanel(\'Medication\')">Add medication</button>' : '') + keeperMoreButtons() + (homeBusinessMode() || stIsRescue() ? '<button onclick="saleOpen(selectedAnimal)">' + (stIsRescue() && !stSkus.some((k) => k === "founding_breeder" || k === "premium_breeder") ? "Adoption &amp; placement" : "Listing &amp; sale") + '</button>' : '') + '<button onclick="helpAnimal=selectedAnimal;openPanel(&quot;Urgent Help&quot;)">Urgent Help</button><button onclick="openPanel(&quot;Care Plan&quot;,selectedAnimal)">Personal care targets</button><button onclick="openPanel(&quot;Pet-Sitter Sheet&quot;,selectedAnimal)">Pet-sitter sheet</button></div></details>';
    profileTab("Overview");
    return;
  }
  if ((current === "Plans" || current === "Upgrade" || current === "Founding Keeper Studio") && stPlanChecking()) {
    el.innerHTML = '<p class="planChecking">Checking your plan…</p>';
    return;
  }
  if (current === "Plans") {
    el.innerHTML = plansMarkup();
    return;
  }
  if (current === "Upgrade") {
    el.innerHTML = memberUpgradeMarkup(false);
    return;
  }
  if (current === "Quick Log") {
    el.innerHTML = quickLogMarkup();
    return;
  }
  if (current === "Log Care") {
    el.innerHTML = logCareChooser();
    return;
  }
  if (current === "Upcoming Care" || current === "Due Today") {
    let t = today(),
      pending = entries
        .filter((e) => e.section === "Calendar" && !e.done && (current === "Due Today" ? e.date <= t : e.date > t))
        .sort((a, b) => a.date.localeCompare(b.date));
    el.innerHTML =
      '<p class="muted">' +
      (current === "Due Today" ? "Unfinished tasks due today or earlier." : "Your next three scheduled tasks.") +
      "</p>" +
      (current === "Due Today" ? strayImportNotice() : "") +
      taskMarkup(current === "Due Today" ? pending : pending.slice(0, 3)) +
      '<button class="action" onclick="openPanel(\'Calendar\')">View full calendar</button>';
    return;
  }
  if (current === "Habitat") {
    el.innerHTML =
      '<h3 class="sectionTitle">' +
      esc(selectedAnimal) +
      " · Habitat</h3>" +
      habitatMarkup(selectedAnimal) +
      '<button class="action secondary" onclick="openPanel(selectedAnimal)">Back to profile</button>';
    return;
  }
  if (current === "Devices") {
    el.innerHTML = deviceDirectory();
    return;
  }
  if (current === "Care Insights") {
    el.innerHTML =
      '<div class="compassLead"><h3>' +
      esc(selectedAnimal) +
      " · Care Insights</h3><p>Documented patterns, not medical advice.</p></div>" +
      compassMarkup(selectedAnimal) +
      '<button class="action secondary" onclick="openPanel(selectedAnimal)">Back to profile</button>';
    return;
  }
  if (current === "Care Plan") {
    el.innerHTML =
      '<h3 class="sectionTitle">' +
      esc(selectedAnimal) +
      " · Personal care targets</h3>" +
      carePlanForm(selectedAnimal);
    return;
  }
  if (current === "Health & Vet") {
    el.innerHTML = healthMarkup(selectedAnimal);
    return;
  }
  if (current === "Pet-Sitter Sheet") {
    el.innerHTML = sitterMarkup();
    return;
  }
  if (current === "Care Handoff") {
    el.innerHTML =
      '<p class="muted">A short, copyable summary for a veterinarian, pet sitter or temporary caregiver. It excludes photos and includes only documented records. Review it before sharing.</p><label>Care handoff<textarea id="handoffText" class="handoffText" readonly>' +
      esc(careHandoffText(selectedAnimal)) +
      '</textarea></label><button class="action" onclick="copyHandoff()">Copy care handoff</button><p id="handoffStatus" role="status" class="muted">Nothing is shared automatically.</p><button class="action secondary" onclick="openPanel(\'Care Insights\',selectedAnimal)">Back to Care Insights</button>';
    return;
  }
  if (current === "Animal Setup") {
    el.innerHTML = animalSetupMarkup();
    return;
  }
  if (current === "Edit Profile") {
    let p = profiles[selectedAnimal] || {};
    el.innerHTML =
      "<p>" +
      esc(selectedAnimal) +
      " · " +
      esc(species[selectedAnimal] || "") +
      '</p><label>Weight (include unit)<input id="weight" maxlength="30" placeholder="e.g. 200 g" value="' +
      esc(p.weight || "") +
      '"></label><label>Enclosure<input id="enclosure" maxlength="70" placeholder="e.g. 4 × 2 × 18" value="' +
      esc(p.enclosure || "") +
      '"></label><label>Notes<textarea id="profileNotes" maxlength="400" placeholder="Anything you want to remember">' +
      esc(p.notes || "") +
      '</textarea></label><button class="action" onclick="saveProfile()">Save profile</button><button class="action secondary" onclick="openPanel(selectedAnimal)">Cancel</button>';
    return;
  }
  if (current === "My Reptiles") {
    el.innerHTML =
      '<p class="muted">' +
      animals.length +
      " animal" +
      (animals.length === 1 ? "" : "s") +
      '. Tap one to open it.</p><button class="action" onclick="addAnimal()">+ Add animal</button>' +
      (legacySampleCandidates().length
        ? '<div class="notice">This account still contains unused starter examples: ' +
          esc(legacySampleCandidates().join(", ")) +
          '. <button class="action secondary" onclick="removeLegacySamples()">Remove old examples</button></div>'
        : "") +
      '<input aria-label="Search animals" class="rosterSearch" id="rosterSearch" type="search" oninput="filterAnimalRoster()" placeholder="Search by name or species"><p class="helperLine" id="rosterResults">' +
      animals.length +
      " of " +
      animals.length +
      " shown</p>" +
      rosterToolbar() +
      rosterOrder()
        .map(
          (i) => { const a = animals[i], st = rosterStatus(a); return (
            '<div class="task reptileListItem rosterRow" data-match="' +
            esc((a + " " + (species[a] || "")).toLowerCase()) +
            '" data-sp="' + esc(species[a] || "Other") + '"><button class="rosterTap" onclick="openAnimalAt(' + i + ')">' +
            profilePicture(a, "reptileListPic") +
            "<span><b>" +
            esc(a) +
            "</b><small>" +
            esc(species[a] || "Other") + (profiles[a]?.sex && !/unknown/i.test(profiles[a].sex) ? " · " + esc(profiles[a].sex) : "") +
            '</small><small class="rosterSt ' + st.cls + '">' + esc(st.text) + "</small></span></button>" +
            '<details class="rosterManage"><summary aria-label="More options for ' + esc(a) + '">⋯</summary><div class="rosterControl"><button onclick="renameAnimal(' +
            i +
            ')">Edit details</button><button onclick="moveAnimal(' +
            i +
            ',-1)" ' +
            (i === 0 ? "disabled" : "") +
            ' aria-label="Move ' +
            esc(a) +
            ' up">Move up ↑</button><button onclick="moveAnimal(' +
            i +
            ',1)" ' +
            (i === animals.length - 1 ? "disabled" : "") +
            ' aria-label="Move ' +
            esc(a) +
            ' down">Move down ↓</button><button onclick="archiveAnimal(' +
            i +
            ')">Archive</button></div></details></div>'); },
        )
        .join("") +
      '<details class="compactDisclosure"><summary>Archived animals and devices</summary><button class="action secondary" onclick="openPanel(&quot;Archived Reptiles&quot;)">Archived animals</button><button class="action secondary" onclick="openPanel(&quot;Devices&quot;)">Manage devices</button></details>';
    return;
  }
  if (
    [
      "Feeding Tracker",
      "Enclosure Care",
      "Shed History",
      "Observations",
      "UVB & Lighting",
      "Supplements",
      "Calendar",
    ].includes(current)
  ) {
    let options = careOptions(current, selectedAnimal);
    el.innerHTML =
      (current === "Calendar"
        ? '<div id="calendarList">' +
          calendarMarkup() +
          '</div><button class="action" id="addReminderButton" onclick="toggleReminderForm()">+ Add Reminder</button><div id="reminderForm" hidden>'
        : "") +
      (current === "Calendar"
        ? '<p class="helperLine">Set a care date below. Repeat reminders schedule their next occurrence when the current one is marked Done.</p><label>Reminder type<select id="remKind" onchange="reminderKindChanged()"><option value="care">Care log reminder</option><option value="checklist">Checklist</option></select></label>'
        : "") +
      '<label>Animal<select id="animal" onchange="refreshCareOptions()">' +
      animalOptions() +
      '</select></label><label>Date<input type="date" id="date"></label>' +
      (current === "Feeding Tracker" ? '<label>Feeding time (optional)<input type="time" id="feedTime"></label>' : '') +
      '<label>Entry<select id="detail">' +
      options.map((x) => "<option>" + x + "</option>").join("") +
      "</select></label>" +
      (current === "Calendar"
        ? reminderExtraFields() +
          "" +
          repeatSelectMarkup("repeatDays", "repeatCustom", "repeatCustomLabel") +
          '<p class="helperLine">Repeating tasks schedule the next occurrence when you mark the current one Done. If you set a feeding schedule for an animal, logging a feeding moves its next feeding reminder automatically.</p>'
        : "") +
      (current === "Feeding Tracker"
        ? '<label id="foodTypeLabel">' +
          foodTypeLabel(selectedAnimal) +
          '<input id="preyType" maxlength="60" placeholder="e.g. rat fuzzy or crickets"></label><p class="helperLine" id="speciesCareHint">' +
          esc(careFormHint(selectedAnimal)) +
          '</p><label>Food / prey weight (grams, optional)<input id="preyWeight" type="number" min="0" max="10000" step="0.1" placeholder="e.g. 16"></label><label>Feeding response<select id="feedingResponse"><option value="">Select response (optional)</option><option>Immediate strike</option><option>Delayed strike</option><option>Tong-fed</option><option>Left overnight</option><option>Refused</option><option>Other</option></select></label>'
        : "") +
      (current === "Feeding Tracker"
        ? '<label>Supplement used (optional)<select id="feedSupplement"><option value="">None</option><option>Calcium</option><option>Calcium + D3</option><option>Multivitamin</option><option>Other</option></select></label>'
        : "") +
      (current === "UVB & Lighting"
        ? '<p class="helperLine" id="uvbLast">' +
          esc(uvbLastChangeText(selectedAnimal)) +
          '</p><label>Bulb (brand / type, optional)<input id="bulbInfo" maxlength="80" placeholder="e.g. T5 HO 10.0, 22 in"></label>'
        : "") +
      (current === "Supplements"
        ? '<label>Product (optional)<input id="suppProduct" maxlength="60" placeholder="e.g. brand name"></label><label>How it was given (optional)<select id="suppMethod"><option value="">Select</option><option>Dusted on feeders</option><option>Mixed into food</option><option>In water</option><option>Given directly</option></select></label>'
        : "") +
      (current === "Enclosure Care"
        ? '<label>Warm-side reading (°F, optional)<input id="warmTemp" type="number" min="0" max="130" step="0.1"></label><label>Cool-side reading (°F, optional)<input id="coolTemp" type="number" min="0" max="130" step="0.1"></label><label>Humidity (%, optional)<input id="humidity" type="number" min="0" max="100" step="0.1"></label>'
        : "") +
      '<label>Optional notes<textarea id="entryNotes" maxlength="300" placeholder="Observations..."></textarea></label><button class="action" onclick="saveEntry()">Save entry</button>' +
      (current === "Calendar"
        ? "</div>"
        : "<h3>Saved preview entries</h3>" + logList(entries.filter((e) => e.section === current)));
    document.getElementById("date").value = today();
    if (current === "Feeding Tracker") {
      document.getElementById("feedTime").value = stFeedNowTime();
      document.getElementById("date").addEventListener("change", function () {
        if (this.value !== today()) document.getElementById("feedTime").value = "";
      });
    }
    if (pendingLogDetail) {
      const sel = document.getElementById("detail");
      if (sel && [...sel.options].some((o) => o.value === pendingLogDetail)) sel.value = pendingLogDetail;
    }
    pendingLogDetail = "";
    if (current === "Calendar") {
      document.getElementById("repeatDays").addEventListener("change", toggleRepeatCustom);
    }
    return;
  }
  if (current === "Weight Tracker") {
    el.innerHTML =
      '<div class="notice">Record a weight for ' +
      esc(selectedAnimal) +
      '. Enter grams only.</div><label>Date<input type="date" id="date"></label><label>Weight (g)<input type="number" min="0.1" max="100000" step="0.1" id="weightValue" placeholder="e.g. 200"></label><button class="action" onclick="saveWeight()">Save weight</button><h3>Weight history</h3>' +
      logList(entries.filter((e) => e.section === "Weight Tracker" && e.animal === selectedAnimal));
    document.getElementById("date").value = today();
    return;
  }
  if (current === "Care Logs") {
    let names = [...new Set([...animals, ...entries.filter((e) => e.section !== "Calendar").map((e) => e.animal)])];
    el.innerHTML =
      '<p class="muted">One shared care history for every animal.</p><button class="action secondary" onclick="openPanel(&quot;Import Existing Records&quot;)">📷 Import old logs from a screenshot</button><label class="logSearchLabel">Search care records<input type="search" id="logSearch" maxlength="100" placeholder="Feeding, prey, notes…" oninput="filterLogs()"></label><div class="chipRow logChips"><button class="chip on" data-t="" onclick="logChip(\'\')">All</button><button class="chip" data-t="Feeding Tracker" onclick="logChip(\'Feeding Tracker\')">🍽 Feedings</button><button class="chip" data-t="Shed History" onclick="logChip(\'Shed History\')">✨ Sheds</button><button class="chip" data-t="Weight Tracker" onclick="logChip(\'Weight Tracker\')">⚖ Weights</button><button class="chip" data-t="Health & Vet" onclick="logChip(\'Health & Vet\')">🩺 Health</button><button class="chip" data-t="Observations" onclick="logChip(\'Observations\')">👁 Notes</button></div><details class="compactDisclosure" id="careFilterDetails" ' +
      (logPrefillAnimal ? "open" : "") +
      '><summary>Filter by animal, activity or date</summary><div class="filters"><label>Animal<select id="logAnimal" onchange="filterLogs()"><option value="">All animals</option>' +
      names.map((a) => '<option value="' + esc(a) + '">' + esc(a) + "</option>").join("") +
      '</select></label><label>Activity<select id="logType" onchange="filterLogs()"><option value="">All care</option>' +
      [
        "Feeding Tracker",
        "Enclosure Care",
        "UVB & Lighting",
        "Supplements",
        "Shed History",
        "Weight Tracker",
        "Observations",
        "Health & Vet",
        "Breeding",
      ]
        .map((x) => "<option>" + x + "</option>")
        .join("") +
      '</select></label><label>From date<input type="date" id="logFrom" onchange="filterLogs()"></label><label>To date<input type="date" id="logTo" onchange="filterLogs()"></label></div><button class="action secondary" onclick="resetLogFilters()">Clear filters</button></details><p class="countLine" id="logCount" aria-live="polite"></p><div id="filteredLogs"></div>';
    if (logPrefillAnimal) {
      document.getElementById("logAnimal").value = logPrefillAnimal;
      logPrefillAnimal = "";
    }
    filterLogs();
    return;
  }
  if (current === "Data & Backup") {
    el.innerHTML =
      '<p class="muted">Your journal saves automatically to your account. You can also download a separate copy whenever you want.</p><button class="action" onclick="exportBackup()">Download a backup</button><p id="backupStatus" class="helperLine" role="status"></p><details class="compactDisclosure"><summary>Restore or recover</summary><p class="notice">Restoring a file replaces this browser’s records. Your account copy is not changed until you choose to save it.</p><label>Choose backup file<input type="file" id="backupFile" accept=".json,application/json"></label><button class="action secondary" onclick="importBackup()">Review backup</button><details class="compactDisclosure"><summary>Recently deleted (' +
      deletedRecords.length +
      ")</summary>" +
      deletedRecordsMarkup() +
      "</details></details>";
    return;
  }
  if (current === "Photo Journal") {
    el.innerHTML = photoWorkspaceMarkup(selectedAnimal, true);
    renderPhotos();
    return;
  }
  if (current === "Scale Hub") {
    el.innerHTML =
      '<p class="resourceIntro">Herps &amp; Hers · Learn ♡ Share ♡ Grow. Care help, guides, videos and community in one place.</p><button class="resourceTile" onclick="openPanel(\'Urgent Help\')"><strong>♡ Urgent Help</strong><small>Warning signs, what to avoid, care-history handoff and veterinary contacts.</small></button><button class="resourceTile" onclick="openPanel(\'Care Library\')"><strong>✧ Herps & Hers Care Guides</strong><small>All 12 original illustrated New Keeper Series guides, right inside the app.</small></button><button class="resourceTile" onclick="openPanel(\'Community\')"><strong>♧ Community & Social Media</strong><small>Join the Facebook community and find the official Herps & Hers accounts.</small></button><button class="resourceTile" onclick="openPanel(\'Find a Vet\')"><strong>✚ Find a Reptile Vet</strong><small>Find a specialist, save your regular and emergency clinic.</small></button><button class="resourceTile" onclick="openPanel(\'Reptile Rescues\')"><strong>♧ Reptile Rescues</strong><small>Rescues using Scale &amp; Tell, with their intake status.</small></button><button class="resourceTile" onclick="openPanel(\'Bioactive & DIY\')"><strong>❦ Bioactive & DIY How-Tos</strong><small>Build a bioactive setup, pick a cleanup crew, and make safe hides, backgrounds and decor.</small></button><button class="resourceTile" onclick="openPanel(\'Watch & Learn\')"><strong>▷ Watch &amp; Learn ♡</strong><small>Hand-picked videos by topic, from setup to feeding and health.</small></button><button class="resourceTile" onclick="openPanel(\'Recommended Products\')"><strong>✦ Reptile Products</strong><small>First Time Keeper Essentials, our Amazon and Chewy picks, and gear that works with the app.</small></button>';
    return;
  }
  if (BIZ_PANELS[current]) {
    el.innerHTML = BIZ_PANELS[current]();
    bizAfterRender(current);
    return;
  }
  if (current === "Govee Sensors") {
    el.innerHTML = goveeMarkup();
    goveeLoad();
    return;
  }
  if (current === "Watch & Learn") {
    el.innerHTML = watchLearnMarkup();
    return;
  }
  if (current === "Bioactive & DIY") {
    el.innerHTML = diyMarkup();
    hubLoadPeer();
    return;
  }
  if (current === "Recommended Products") {
    el.innerHTML = recommendedMarkup();
    loadAffiliateLinks();
    return;
  }
  if (current === "Urgent Help") {
    el.innerHTML = urgentMarkup();
    return;
  }
  if (current === "Care Library" && !HERPS_GUIDES.length) {
    stGuidesLoad();
    el.innerHTML = '<p class="helperLine">Loading the guides…</p>';
    return;
  }
  if (current === "Care Library") {
    el.innerHTML =
      '<p class="resourceIntro">The original Herps & Hers New Keeper Series. These are faithful views of the guides we created, with swipeable, tap-to-enlarge illustrated pages. Educational starting points, not personal veterinary advice.</p><label>Find a guide<input id="guideSearch" type="search" value="' +
      esc(guideFilter) +
      '" oninput="setGuideFilter()" placeholder="Search species..."></label><div id="guideResults">' +
      guideListMarkup() +
      '</div><p class="resourceMuted">Standards can evolve. Review species-specific recommendations and consult a qualified veterinarian about medical decisions.</p><button class="action secondary" onclick="resourceBack()">' +
      (!cloudSession ? "Back to Sign In" : "Back to Scale Hub") +
      "</button>";
    return;
  }
  if (current === "Herps Guide") {
    let g = HERPS_GUIDES[window.scaleGuideId || 0];
    let p = g.pages[guidePage];
    el.innerHTML =
      '<p class="resourceIntro">HERPS & HERS · NEW KEEPER SERIES · ' +
      esc(g.title) +
      '</p><button class="action secondary" onclick="openPanel(\'Care Library\')">← All 12 guides</button><div class="guideReader"><div class="guideSwipe" ontouchstart="guideSwipeStart(event)" ontouchend="guideSwipeEnd(event)"><img class="guideMainImage" src="' +
      p.image +
      '" alt="' +
      esc(g.title) +
      " original illustrated guide page " +
      (guidePage + 1) +
      " of " +
      g.pages.length +
      '; tap to enlarge" onclick="openGuideZoom()"></div><div class="guideControls"><button ' +
      (guidePage === 0 ? "disabled" : "") +
      ' onclick="changeGuidePage(-1)">← Previous</button><span class="guideCount">Page ' +
      (guidePage + 1) +
      " of " +
      g.pages.length +
      "</span><button " +
      (guidePage === g.pages.length - 1 ? "disabled" : "") +
      ' onclick="changeGuidePage(1)">Next →</button></div><p class="guideHint">Swipe left or right to turn pages. Tap the illustrated page to enlarge it; pinch to zoom.</p></div><button class="action secondary" onclick="openPanel(\'Care Library\')">Back to Care Library</button>';
    return;
  }
  if (current === "Community") {
    el.innerHTML = communityMarkup();
    return;
  }
  if (current === "Social Links") {
    el.innerHTML = socialSettingsMarkup();
    return;
  }
  if (current === "Find a Vet") {
    el.innerHTML = vetMarkup();
    return;
  }
  if (current === "Archived Reptiles") {
    let ar = JSON.parse(localStorage.getItem("scaleTellArchived10") || "[]");
    el.innerHTML = ar.length
      ? ar
          .map(
            (a, i) =>
              '<div class="task"><b>' +
              esc(a.name) +
              "</b> · " +
              esc(a.species) +
              ' <button onclick="restoreAnimal(' +
              i +
              ')">Restore</button></div>',
          )
          .join("")
      : '<p class="muted">No archived animals.</p>';
    return;
  }

  el.innerHTML =
    '<p class="muted">Scale & Tell saves signed-in care records automatically.</p><button class="action" onclick="openPanel(\'My Reptiles\')">Manage animals</button><button class="action" onclick="openPanel(\'Photo Journal\')">Photo Journal</button><button class="action" onclick="openPanel(\'Data & Backup\')">Data & Backup</button>';
}

/* Safe, opt-in existing-record import. Nothing is saved until the keeper reviews. */
let importDraft = [],
  importScreenshotUrl = "",
  importStatus = "";
const importSections = [
  "Feeding Tracker",
  "UVB & Lighting",
  "Supplements",
  "Shed History",
  "Weight Tracker",
  "Enclosure Care",
  "Observations",
  "Health & Vet",
];
function importDate(raw) {
  let v = String(raw || "").trim(),
    m,
    y,
    mo,
    day;
  if ((m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(v))) {
    y = +m[1];
    mo = +m[2];
    day = +m[3];
  } else if ((m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(v))) {
    y = +m[3];
    mo = +m[1];
    day = +m[2];
  } else if (/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(v) && /\b\d{4}\b/.test(v)) {
    let d = new Date(v);
    if (!Number.isFinite(d.getTime())) return "";
    y = d.getFullYear();
    mo = d.getMonth() + 1;
    day = d.getDate();
  } else return "";
  let d = new Date(y, mo - 1, day);
  return y >= 1990 && y <= 2100 && d.getFullYear() === y && d.getMonth() + 1 === mo && d.getDate() === day
    ? [y, String(mo).padStart(2, "0"), String(day).padStart(2, "0")].join("-")
    : "";
}
function importSection(v) {
  let t = String(v || "").toLowerCase();
  return t.includes("weight") || t.includes("weigh")
      ? "Weight Tracker"
      : t.includes("feed") || t.includes("prey") || t.includes("meal")
        ? "Feeding Tracker"
        : t.includes("shed") || t.includes("molt")
          ? "Shed History"
          : t.includes("humid") || t.includes("enclos") || t.includes("habitat") || t.includes("temp")
            ? "Enclosure Care"
            : t.includes("vet") || t.includes("health") || t.includes("medication") || t.includes("treatment")
              ? "Health & Vet"
              : "Observations";
}
function importCSVRows(text) {
  let rows = [],
    row = [],
    field = "",
    quoted = false;
  for (let i = 0; i < text.length; i++) {
    let c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        field += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((x) => x.trim())) rows.push(row);
      field = "";
      row = [];
    } else field += c;
  }
  if (quoted) throw Error("This CSV has an unfinished quoted field.");
  row.push(field);
  if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}
function importParseCSV(text) {
  let rows = importCSVRows(text.replace(/^\uFEFF/, ""));
  if (!rows.length) throw Error("The CSV is empty.");
  let keys = rows[0].map((v) => v.toLowerCase().replace(/[^a-z0-9]/g, ""));
  let pick = (r, aliases) => {
    for (let x of aliases) {
      let i = keys.indexOf(x);
      if (i >= 0) return (r[i] || "").trim();
    }
    return "";
  };
  if (rows.length > 301) throw Error("Import up to 300 CSV rows at a time.");
  if (!keys.some((x) => ["date", "entrydate", "loggedat", "timestamp"].includes(x)))
    throw Error("CSV needs a Date column.");
  if (!keys.some((x) => ["animal", "name", "reptile", "pet"].includes(x))) throw Error("CSV needs an Animal column.");
  return rows.slice(1, 301).map((r) => {
    let date = pick(r, ["date", "entrydate", "loggedat", "timestamp"]),
      animal = pick(r, ["animal", "name", "reptile", "pet"]),
      type = pick(r, ["type", "category", "activity", "section", "event"]),
      detail = pick(r, ["detail", "event", "action", "entry", "description", "result"]),
      notes = pick(r, ["notes", "note", "comments", "comment", "extra"]);
    if (!detail) detail = type || "Observation";
    let section = importSection(type || detail);
    let weight = pick(r, ["weightg", "weightgrams", "weight"]);
    let temp = pick(r, ["temperature", "temperaturef", "warmtemp", "warmtemperature"]),
      humidity = pick(r, ["humidity", "humiditypercent"]);
    if (section === "Weight Tracker" && weight) detail = weight + " g";
    if (section === "Enclosure Care")
      notes = [notes, temp ? "Temperature: " + temp : "", humidity ? "Humidity: " + humidity + "%" : ""]
        .filter(Boolean)
        .join(" · ");
    return { date: importDate(date), animal, section, detail, notes, originalDate: date };
  });
}
function importParseNotes(text) {
  let lines = String(text || "")
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);
  return lines.slice(0, 301).map((line) => {
    let parts = line.split(/\s*\|\s*/);
    if (parts.length >= 4) {
      let date = importDate(parts[0]);
      return {
        date,
        animal: parts[1],
        section: importSection(parts[2]),
        detail: parts[3] || "Observation",
        notes: parts.slice(4).join(" · "),
        originalDate: parts[0],
      };
    }
    let d =
      (line.match(
        /\b\d{4}-\d{1,2}-\d{1,2}\b|\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4}\b/i,
      ) || [])[0] || "";
    let found = animals.find((a) => line.toLowerCase().includes(a.toLowerCase()));
    let section = importSection(line);
    let detail =
      section === "Feeding Tracker"
        ? /refus|skip/i.test(line)
          ? "Refused"
          : "Ate"
        : section === "Shed History"
          ? "Shed"
          : section === "Weight Tracker"
            ? (line.match(/\b\d+(?:\.\d+)?\s*g\b/i) || [])[0] || "Weighed"
            : section === "Enclosure Care"
              ? "Habitat check"
              : section === "Health & Vet"
                ? "Health note"
                : section === "Calendar"
                  ? "Care reminder"
                  : "Observation";
    return { date: importDate(d), animal: found || "", section, detail, notes: line, originalDate: d };
  });
}
function importNewDraft(rows) {
  const dk = (e) => [e.date, String(e.animal || "").toLowerCase(), e.section, String(e.detail || "").toLowerCase()].join("¦");
  const seen = new Set(entries.map(dk));
  importDraft = rows.map((r, i) => {
    const k = dk(r), dup = seen.has(k);
    seen.add(k);
    return { ...r, dup, checked: !dup && !!r.date && !!animals.includes(r.animal), line: i + 1 };
  });
  importStatus = rows.length
    ? "Review the dates and animals carefully. Nothing has been saved yet."
    : "No entries recognized.";
  render();
}
function importTextNow() {
  let t = document.getElementById("importPaste")?.value || "";
  if (t.length > 100000) return importSetStatus("Please paste fewer than 100,000 characters at once.");
  let lines = t.split(/\r?\n/).filter((x) => x.trim());
  if (lines.length > 300) return importSetStatus("Please import up to 300 lines at a time.");
  importNewDraft(importParseNotes(t));
}
async function importFileNow(el) {
  const f = el?.files?.[0];
  if (!f) return;
  if (f.size > 1024 * 1024) return importSetStatus("CSV files must be under 1 MB.");
  try {
    let str = await f.text();
    let rows = importParseCSV(str);
    if (rows.length > 300) throw Error("Import up to 300 rows at a time.");
    importNewDraft(rows);
  } catch (e) {
    importSetStatus(e.message || "Could not read this CSV.");
  }
}
function importScreenshotPanel() {
  const chosen = importDefaultAnimal();
  return (
    '<div class="lcPanel importShotPanel"><h3>Read a care-log screenshot ♡</h3><p>Upload a screenshot or photo of your existing feeding, shed or care log. Scale &amp; Tell reads it on your phone and lists each dated line for you to check. Nothing is added until you approve it.</p>' +
    '<label>Which animal is this log for?<select id="importShotAnimal" onchange="importScreenshotAnimal=this.value">' +
    importOptionHTML(animals, chosen) +
    "</select></label>" +
    '<input aria-label="Select a care-log screenshot" type="file" accept="image/*" onchange="importScreenshotNow(this)"><div id="importScreenshotPreview"></div>' +
    '<p class="lcSmall">Lines that name another of your reptiles are matched to that reptile. Dates without a year are read as this year.</p></div>'
  );
}
let importLastOcrText = "";
let importScreenshotFile = null,
  importScreenshotBusy = false,
  importOcrLoader = null;
function importScreenshotNow(el) {
  const f = el?.files?.[0];
  if (!f) return;
  if (!/^image\//i.test(f.type || "image/") || f.size > 15 * 1024 * 1024)
    return importSetStatus("Choose a screenshot or photo under 15 MB.");
  importScreenshotFile = f;
  importScreenshotUrl = "";
  let reader = new FileReader();
  reader.onload = () => {
    importScreenshotUrl = reader.result;
    const target = document.getElementById("importScreenshotPreview");
    if (target)
      target.innerHTML =
        '<img alt="Selected notes screenshot to read" style="max-width:100%;max-height:350px;object-fit:contain;border-radius:12px" src="' +
        importScreenshotUrl +
        '"><button class="action secondary" type="button" id="importReadImage" onclick="importReadScreenshot()">Read Screenshot ♡</button><p class="helperLine" id="importOcrStatus" role="status">Text recognition can take a little while the first time. Nothing is saved until you review and approve it.</p><div id="importOcrResults"></div>';
  };
  reader.onerror = () => importSetStatus("Could not open this screenshot.");
  reader.readAsDataURL(f);
}
function importLoadOCR() {
  if (window.Tesseract?.createWorker) return Promise.resolve(window.Tesseract);
  if (importOcrLoader) return importOcrLoader;
  importOcrLoader = new Promise((resolve, reject) => {
    const tag = document.createElement("script");
    tag.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
    tag.crossOrigin = "anonymous";
    tag.onload = () =>
      window.Tesseract?.createWorker ? resolve(window.Tesseract) : reject(Error("Image reader could not start."));
    tag.onerror = () => reject(Error("Image reader could not download. Check internet and try again."));
    document.head.appendChild(tag);
  }).catch((e) => {
    importOcrLoader = null;
    throw e;
  });
  return importOcrLoader;
}
async function importReadScreenshot() {
  if (importScreenshotBusy || !importScreenshotFile || !importScreenshotUrl) return;
  const button = document.getElementById("importReadImage"),
    status = document.getElementById("importOcrStatus"),
    results = document.getElementById("importOcrResults");
  importScreenshotBusy = true;
  if (button) button.disabled = true;
  let worker = null;
  try {
    if (status) status.textContent = "Loading image reader…";
    const ocr = await importLoadOCR();
    worker = await ocr.createWorker("eng", 1, {
      logger: (m) => {
        if (status && m.status) {
          status.textContent =
            m.status + (Number.isFinite(m.progress) ? " · " + Math.round(m.progress * 100) + "%" : "");
        }
      },
    });
    if (status) status.textContent = "Preparing the screenshot…";
    const recognized = await worker.recognize(await importPrepImage(importScreenshotUrl));
    const text = String(recognized?.data?.text || "")
      .slice(0, 20000)
      .trim();
    if (!text) throw Error("No readable text found. Try a sharper screenshot or paste the notes manually.");
    const rows = importParseLog(text, importDefaultAnimal());
    importLastOcrText = text;
    importNewDraft(rows);
    setTimeout(
      () => document.getElementById("importStatus")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      60,
    );
    importSetStatus(
      rows.length
        ? "✓ Found " +
            rows.length +
            " dated line" +
            (rows.length === 1 ? "" : "s") +
            ". Check each row below, then tap Add Approved Records. Nothing has been saved yet."
        : "The screenshot was read, but no dated care lines were recognized. You can correct the text below and try again.",
    );
    if (!rows.length) {
      const r = document.getElementById("importOcrResults");
      if (r) {
        r.innerHTML =
          '<label for="importOCRText"><b>Text found in the screenshot</b></label><textarea id="importOCRText" class="lcEntry lcEntryArea" maxlength="20000"></textarea><button class="action secondary" type="button" onclick="importReviewOCR()">Review this text</button>';
        document.getElementById("importOCRText").value = text;
      }
    }
    return;
  } catch (e) {
    if (status)
      status.textContent = e?.message || "Could not read the screenshot. You can still paste or import notes manually.";
  } finally {
    if (worker)
      try {
        await worker.terminate();
      } catch (e) {}
    importScreenshotBusy = false;
    if (button) button.disabled = false;
  }
}
function importReviewOCR() {
  const text = document.getElementById("importOCRText")?.value?.trim() || "";
  if (!text) return importSetStatus("Nothing extracted to review. Edit the text or try another screenshot.");
  if (text.split(/\r?\n/).filter(Boolean).length > 300)
    return importSetStatus("Please review at most 300 text lines at once.");
  importNewDraft(importParseLog(text, importDefaultAnimal()));
}

/* ===================== V3.21 · screenshot care-log reader =====================
   Reads a photo or screenshot of an existing care log on the phone itself (Tesseract OCR),
   turns each line into a draft record for the reptile the keeper picked, and saves nothing
   until the keeper reviews the rows and confirms. */
let importScreenshotAnimal = "";
function importDefaultAnimal() {
  if (animals.includes(importScreenshotAnimal)) return importScreenshotAnimal;
  return animals.includes(selectedAnimal) ? selectedAnimal : animals[0] || "";
}
const IMPORT_MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
/* Finds a date anywhere in a line, with or without a year. Returns {date, raw} or null. */
function importFindDate(line) {
  const t = String(line || "");
  const finish = (y, mo, d, raw) => {
    if (y == null) {
      const now = new Date();
      y = now.getFullYear();
      // A log date without a year that would land well in the future belongs to last year.
      if (new Date(y, mo - 1, d) > new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)) y--;
    } else if (y < 100) y += 2000;
    const iso = importDate([y, String(mo).padStart(2, "0"), String(d).padStart(2, "0")].join("-"));
    return iso ? { date: iso, raw } : null;
  };
  let m;
  if ((m = /\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/.exec(t))) return finish(+m[1], +m[2], +m[3], m[0]);
  // 10/12/2026, 10-12-26, 10.12.26: numeric dates with a year can appear anywhere in the line.
  if ((m = /\b(\d{1,2})([/.-])(\d{1,2})\2(\d{4}|\d{2})\b/.exec(t))) {
    if (+m[1] <= 12 && +m[3] <= 31) return finish(+m[4], +m[1], +m[3], m[0]);
    // 13/10/2026 can only be day-first.
    if (+m[1] <= 31 && +m[3] <= 12) return finish(+m[4], +m[3], +m[1], m[0]);
  }
  // 10/12 without a year only counts at the start of a line, so "1/2 rat" or "2-3 crickets" are not dates.
  if ((m = /^[\s•·*\-–—]*(\d{1,2})[/-](\d{1,2})(?![\d/.-])/.exec(t)) && +m[1] <= 12 && +m[2] <= 31)
    return finish(null, +m[1], +m[2], m[0].replace(/^[\s•·*\-–—]+/, ""));
  // "may" is also an everyday word ("may need 2 rats"), so it only counts as a month when written as one.
  const mon = "(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?";
  const realMonth = (x, i) => x && (x[i].toLowerCase() !== "may" || x[i] === "May");
  if ((m = new RegExp("\\b" + mon + "\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?", "i").exec(t)) && realMonth(m, 1))
    return finish(m[3] ? +m[3] : null, IMPORT_MONTHS.indexOf(m[1].toLowerCase().slice(0, 3)) + 1, +m[2], m[0]);
  if ((m = new RegExp("\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+" + mon + "(?:,?\\s+(\\d{4}))?", "i").exec(t)) && realMonth(m, 2))
    return finish(m[3] ? +m[3] : null, IMPORT_MONTHS.indexOf(m[2].toLowerCase().slice(0, 3)) + 1, +m[1], m[0]);
  return null;
}
function importGuessSection(t) {
  const s = t.toLowerCase();
  // A keeper's own rule: grams and prey words mean a feeding, unless the line says weigh/weight.
  // "prey weight 45g" or "rat weighed 60g" describes the meal, not the animal.
  const preyWord = "(?:prey|feeders?|rats?|mouse|mice|pinky|pinkies|pinkie|fuzzy|fuzzies|hoppers?|chicks?|meal|food|f\\/t|ft)";
  const animalWeigh = s.replace(new RegExp("\\b" + preyWord + "\\s*(?:weigh\\w*|weight|wt)\\b", "g"), " ").replace(/\b(?:weigh\w*|weight|wt)\s*(?:of\s*)?(?:the\s*)?(?:prey|rat|mouse|feeder)\b/g, " ");
  if (/\bweigh|\bweight\b/.test(animalWeigh)) return "Weight Tracker";
  if (/uvb|bulb/.test(s)) return "UVB & Lighting";
  if (/supplement|calcium|\bd3\b|multivit|vitamin/.test(s)) return "Supplements";
  if (
    /feed|\bfed\b|\bate\b|\beat\b|refus|skip|prey|meal|\brats?\b|mouse|mice|pinky|pinkie|fuzzy|fuzzies|hopper|\bsmall\b|\bmedium\b|\blarge\b|crick|dubia|roach|worm|chick|f\/t|\bft\b/.test(
      s,
    ) ||
    /\d\s*(?:g|gr|grams?)\b/.test(s)
  )
    return "Feeding Tracker";
  if (/shed|molt|in blue|opaque|\bblue\b/.test(s)) return "Shed History";
  if (/clean|substrate|water|humid|temp|enclos|habitat|tank|misted|mist/.test(s)) return "Enclosure Care";
  if (/vet|health|medic|treat|mites|wound|injur|sick/.test(s)) return "Health & Vet";
  if (/\b\d+(?:\.\d+)?\s*(?:kg|lbs?|oz)\b/.test(s)) return "Weight Tracker";
  return "Observations";
}
function importWeightDetail(t) {
  const m = /\b(\d+(?:\.\d+)?)\s*(kg|lbs?|oz|g|gr|grams?)\b/i.exec(t);
  if (!m) return "Weighed";
  const n = Number(m[1]),
    u = m[2].toLowerCase(),
    grams = u === "kg" ? n * 1000 : u.startsWith("lb") ? n * 453.592 : u === "oz" ? n * 28.3495 : n;
  return Math.round(grams * 10) / 10 + " g";
}
/* One draft per dated line. Undated lines are treated as the continuation of the line above. */
function importDetailFor(section, rest) {
  return section === "Feeding Tracker"
    ? /didn'?t feed|did not feed|no feed|not fed|skipp?ed feed|skip/i.test(rest)
      ? "Skipped feeding"
      : /refus|didn'?t eat|did not eat|no eat|not eat/i.test(rest)
        ? "Refused"
        : "Ate"
    : section === "UVB & Lighting"
      ? /bask|heat/i.test(rest)
        ? "Basking / heat bulb change"
        : "UVB bulb change"
      : section === "Supplements"
        ? /d3/i.test(rest)
          ? "Calcium + D3"
          : /calcium/i.test(rest)
            ? "Calcium"
            : /multi|vitamin/i.test(rest)
              ? "Multivitamin"
              : "Other supplement"
        : section === "Shed History"
          ? /blue|opaque/i.test(rest)
            ? "In blue"
            : /incomplete|stuck|partial/i.test(rest)
              ? "Incomplete shed"
              : "Complete shed"
          : section === "Weight Tracker"
            ? importWeightDetail(rest)
            : section === "Enclosure Care"
              ? /substrate/i.test(rest)
                ? "Substrate change"
                : /water/i.test(rest)
                  ? "Water change"
                  : /temp|humid/i.test(rest)
                    ? "Temperature / humidity check"
                    : /spot/i.test(rest)
                      ? "Spot clean"
                      : /mist/i.test(rest)
                        ? "Misting"
                        : "Enclosure refresh"
              : section === "Health & Vet"
                ? "Health note"
                : "Other observation";
}
function importParseLog(text, defaultAnimal) {
  const rows = [];
  for (const rawLine of String(text || "").split(/\r?\n/)) {
    const line = rawLine.replace(/\s+/g, " ").trim();
    if (line.length < 3) continue;
    const found = importFindDate(line);
    if (!found) {
      if (rows.length && /[a-z]{2}/i.test(line)) rows[rows.length - 1].notes += " " + line;
      continue;
    }
    const named = animals.find((a) =>
      new RegExp("\\b" + a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(line),
    );
    const rest = line
      .replace(found.raw, "")
      .replace(/^[\s|:,·•–—-]+/, "")
      .trim();
    const section = importGuessSection(rest);
    const detail = importDetailFor(section, rest);
    const row = {
      date: found.date,
      animal: named || defaultAnimal,
      section,
      detail,
      notes: rest,
      originalDate: found.raw,
    };
    if (section === "Feeding Tracker") {
      const g = /(\d+(?:\.\d+)?)\s*(?:g|gr|grams?)\b/i.exec(rest);
      if (g) row.preyWeight = g[1];
      const prey =
        /(?:(?:x?-?small|medium|large|xl|adult|weaned|hopper|jumbo)\s+)?(?:rats?|mouse|mice|pinky|pinkies|pinkie|fuzzy|fuzzies|hoppers?|chicks?|crickets?|dubias?|roach(?:es)?|(?:super|meal|horn|silk|butter)?worms?)/i.exec(
          rest,
        );
      if (prey) row.preyType = prey[0].trim().slice(0, 60);
    }
    rows.push(row);
    if (rows.length >= 300) break;
  }
  return rows;
}
/* Sharper text recognition: enlarge small screenshots, grey-scale and boost contrast.
   Drawing through a canvas also lets iPhones read HEIC photos. */
function importPrepImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(3, Math.max(1, 1800 / Math.max(img.naturalWidth, 1)));
        const w = Math.round(img.naturalWidth * scale),
          h = Math.round(img.naturalHeight * scale);
        if (w * h > 24e6) return resolve(url);
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const g = c.getContext("2d", { willReadFrequently: true });
        g.imageSmoothingQuality = "high";
        g.drawImage(img, 0, 0, w, h);
        const px = g.getImageData(0, 0, w, h),
          d = px.data;
        let sum = 0;
        for (let i = 0; i < d.length; i += 4) sum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        const darkMode = sum / (d.length / 4) < 110; // light text on a dark background
        for (let i = 0; i < d.length; i += 4) {
          let y = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          if (darkMode) y = 255 - y;
          y = Math.max(0, Math.min(255, (y - 128) * 1.5 + 128));
          d[i] = d[i + 1] = d[i + 2] = y;
        }
        g.putImageData(px, 0, 0);
        resolve(c.toDataURL("image/png"));
      } catch (e) {
        resolve(url);
      }
    };
    img.onerror = () => resolve(url);
    img.src = url;
  });
}
function importSetAllAnimals(value) {
  if (!animals.includes(value)) return;
  importDraft.forEach((r, i) => {
    const sel = document.getElementById("importAnimal" + i);
    if (sel) sel.value = value;
    r.animal = value;
  });
  importSetStatus("All rows set to " + value + ". Review and confirm when ready.");
}

function importSetStatus(s) {
  importStatus = s;
  const e = document.getElementById("importStatus");
  if (e) e.textContent = s;
}
function importOptionHTML(opts, value) {
  return opts
    .map((v) => '<option value="' + esc(v) + '" ' + (v === value ? "selected" : "") + ">" + esc(v) + "</option>")
    .join("");
}
function importActivityChanged(i) {
  const sectionEl = document.getElementById("importSection" + i),
    detailEl = document.getElementById("importDetail" + i);
  if (!sectionEl || !detailEl || !importDraft[i]) return;
  const previous = detailEl.value.trim();
  const initial = String(importDraft[i].detail || "").trim();
  const generic =
    /^(observation|observed|feeding|feed|ate|refused|shed|weighed|habitat check|health note|care reminder)$/i.test(
      previous,
    );
  const previouslyAuto = detailEl.dataset.autoFilledDetail;
  // Do not overwrite a meaningful original or a keeper's hand-edited description.
  if (previous === previouslyAuto || (previous === initial && generic)) {
    const defaults = {
      "Feeding Tracker": /refus|skip/i.test(importDraft[i].notes || "") ? "Refused" : "Ate",
      "Shed History": "Shed",
      "Weight Tracker": "Weighed",
      "Enclosure Care": "Habitat check",
      Observations: "Observation",
      "Health & Vet": "Health note",
      Calendar: "Care reminder",
    };
    detailEl.value = defaults[sectionEl.value] || "Observation";
    detailEl.dataset.autoFilledDetail = detailEl.value;
  }
}

function importRecordsMarkup() {
  return (
    '<p class="lcLead">Bring in older feeding, shedding, weight and other care records. Review every entry before adding it to your journal.</p>' +
    (!animals.length
      ? '<div class="lcNotice">Add your reptile first, then return here to import its history. <button class="action secondary" onclick="addAnimal()">Add an animal</button></div>'
      : importScreenshotPanel() +
        '<div class="lcPanel"><h3>Upload a CSV</h3><p>Use columns Date, Animal, Type, Detail and Notes. Dates should include the year (YYYY-MM-DD or MM/DD/YYYY).</p><input aria-label="Choose CSV" type="file" accept=".csv,text/csv" onchange="importFileNow(this)"></div><div class="lcPanel"><h3>Paste old notes</h3><p>One record per line, e.g. <strong>2026-10-12 | Oro | Feeding | Ate | Rat fuzzy</strong>. Notes with a recognizable animal and full date are also supported.</p><textarea id="importPaste" class="lcEntry lcEntryArea" maxlength="100000" placeholder="2026-10-12 | Oro | Feeding | Ate | Rat fuzzy"></textarea><button class="action secondary" onclick="importTextNow()">Review pasted notes</button></div>') +
    '<p class="helperLine" id="importStatus" role="status">' +
    esc(importStatus) +
    "</p>" +
    (importDraft.length
      ? '<h3 class="sectionTitle">Review ' +
        importDraft.length +
        ' entries</h3><p class="muted">Untick anything you do not want to import. Check dates and animal names before saving.</p>' +
        '<label class="importAllAnimal">Set every row to<select onchange="importSetAllAnimals(this.value)"><option value="">Choose an animal</option>' +
        importOptionHTML(animals, "") +
        "</select></label>" +
        importDraft
          .map(
            (r, i) =>
              '<div class="lcPanel importRow"><label><input type="checkbox" id="importCheck' +
              i +
              '" ' +
              (r.checked ? "checked" : "") +
              "> Include entry " +
              (i + 1) +
              (r.dup ? ' <span class="importDup">Possible duplicate: already in your journal or listed above</span>' : "") +
              '</label><label>Date<input id="importDate' +
              i +
              '" type="date" value="' +
              esc(r.date) +
              '"></label>' +
              (r.originalDate && !r.date ? "<small>Unrecognized date: " + esc(r.originalDate) + "</small>" : "") +
              '<label>Animal<select id="importAnimal' +
              i +
              '"><option value="">Choose animal</option>' +
              importOptionHTML(animals, r.animal) +
              '</select></label><label>Activity<select id="importSection' +
              i +
              '" onchange="importActivityChanged(' +
              i +
              ')">' +
              importOptionHTML(importSections, r.section) +
              '</select></label><label>Entry / Description<input id="importDetail' +
              i +
              '" maxlength="100" value="' +
              esc(r.detail) +
              '"></label><label>Notes<textarea id="importNotes' +
              i +
              '" maxlength="1500">' +
              esc(r.notes) +
              "</textarea></label></div>",
          )
          .join("") +
        '<button class="action" onclick="importApprovedRecords()">Add Approved Records</button><button class="action secondary" onclick="importDraft=[];importStatus=\'Import cancelled. Nothing was saved.\';render()">Cancel review</button>'
      : "") +
    '<p class="lcSmall">Nothing is imported until you approve it. Imported records sync with your signed-in account using the normal automatic saving process.</p>'
  );
}
function importApprovedRecords() {
  if (!importDraft.length) return;
  let accepted = [];
  for (let i = 0; i < importDraft.length; i++) {
    if (!document.getElementById("importCheck" + i)?.checked) continue;
    let date = document.getElementById("importDate" + i)?.value || "",
      animal = document.getElementById("importAnimal" + i)?.value || "",
      section = document.getElementById("importSection" + i)?.value || "",
      detail = document.getElementById("importDetail" + i)?.value?.trim() || "",
      notes = document.getElementById("importNotes" + i)?.value?.trim() || "";
    if (!importDate(date) || !animals.includes(animal) || !importSections.includes(section) || !detail)
      return importSetStatus("Please correct the date, animal and entry for every selected row. Nothing was imported.");
    if (
      section === "Calendar" &&
      entries.some(
        (e) => e.section === "Calendar" && !e.done && e.date === date && e.animal === animal && e.detail === detail,
      )
    )
      continue;
    const draft = importDraft[i] || {};
    accepted.push({
      date,
      animal,
      section,
      detail,
      notes,
      ...(section === "Calendar" ? { repeatDays: 0 } : {}),
      ...(section === "Feeding Tracker" && draft.preyWeight ? { preyWeight: draft.preyWeight } : {}),
      ...(section === "Feeding Tracker" && draft.preyType ? { preyType: draft.preyType } : {}),
    });
  }
  if (!accepted.length) return importSetStatus("Select at least one valid, new entry. Nothing was imported.");
  let key = (e) =>
    [e.date, e.animal.toLowerCase(), e.section, e.detail.toLowerCase()].join("¦");
  let existing = new Set(entries.map(key));
  let unique = [];
  for (const e of accepted) {
    let k = key(e);
    if (!existing.has(k)) {
      unique.push(e);
      existing.add(k);
    }
  }
  if (!unique.length) return importSetStatus("All selected entries are already in your journal. Nothing was added.");
  const perAnimal = {};
  for (const e of unique) perAnimal[e.animal] = (perAnimal[e.animal] || 0) + 1;
  if (
    !confirm(
      "Add " +
        unique.length +
        " care record" +
        (unique.length === 1 ? "" : "s") +
        " to your journal?\n\n" +
        Object.entries(perAnimal)
          .map(([a, n]) => "• " + a + ": " + n)
          .join("\n"),
    )
  )
    return importSetStatus("Nothing was added. Your reviewed rows are still here.");
  let before = entries;
  entries = [...entries, ...unique];
  try {
    save();
  } catch (err) {
    entries = before;
    return importSetStatus("Could not save imported records. Your original journal is unchanged.");
  }
  importDraft = [];
  importStatus =
    "✓ Added " +
    unique.length +
    " care record" +
    (unique.length === 1 ? "" : "s") +
    ". " +
    (accepted.length - unique.length) +
    " exact duplicate" +
    (accepted.length - unique.length === 1 ? " was" : "s were") +
    " skipped. Your journal will sync automatically.";
  render();
}
function taskMarkup(tasks) {
  return tasks.length
    ? tasks
        .map((e) => {
          let i = entries.indexOf(e);
          return (
            '<div class="task"><b>' +
            esc(e.animal) +
            "</b> · " +
            esc(e.detail) +
            "<small>" +
            niceDate(e.date) +
            (e.notes ? " · " + esc(e.notes) : "") +
            esc(repeatText(e)) +
            esc(reminderTimesText(e)) +
            "</small>" +
            checklistMarkup(e, i) +
            '<button onclick="openTaskAnimal(' +
            i +
            ')">View profile</button>' +
            (e.done
              ? '<small class="completedLabel">✓ Completed</small>'
              : '<button onclick="completeReminder(' +
                i +
                ')">Mark Done</button><button onclick="editReminder(' +
                i +
                ')">Edit</button><button onclick="deleteReminder(' +
                i +
                ')">Delete</button>') +
            "</div>"
          );
        })
        .join("")
    : '<p class="muted">No tasks here ♡</p>';
}
function openTaskAnimal(i) {
  let e = entries[i];
  if (e && animals.includes(e.animal)) openPanel(e.animal);
  else alert("This animal is archived. Restore it from My Reptiles to open the profile.");
}
function editReminder(i) {
  let e = entries[i];
  if (!e || e.section !== "Calendar" || e.done) return;
  reminderEditIndex = i;
  reminderEditOrigin = current;
  openPanel("Edit Reminder", e.animal);
}
function reminderEditMarkup() {
  let e = entries[reminderEditIndex];
  if (!e || e.section !== "Calendar")
    return '<p>This reminder is no longer available.</p><button class="action" onclick="openPanel(&quot;Calendar&quot;)">Back to calendar</button>';
  return (
    '<p class="muted">Edit this reminder without re-entering everything.</p><label>Animal<select id="reminderEditAnimal">' +
    [...new Set([e.animal, ...animals])]
      .map((a) => "<option " + (a === e.animal ? "selected" : "") + ">" + esc(a) + "</option>")
      .join("") +
    '</select></label><label>Date<input type="date" id="reminderEditDate" value="' +
    esc(e.date) +
    '"></label>' +
    (Array.isArray(e.checklist)
      ? '<label>Checklist name<input id="reminderEditDetail" maxlength="80" value="' + esc(e.detail) + '"></label>'
      : '<label>Reminder type<select id="reminderEditDetail">' +
        [...new Set([...careOptions("Calendar", e.animal), e.detail])]
          .map((o) => "<option" + (o === e.detail ? " selected" : "") + ">" + esc(o) + "</option>")
          .join("") +
        "</select></label>") +
    reminderEditExtraFields(e) +
    repeatSelectMarkup("reminderEditRepeat", "reminderEditRepeatCustom", "reminderEditRepeatLabel", e) +
    '<label>Notes<textarea id="reminderEditNotes" maxlength="300">' +
    esc(e.notes || "") +
    '</textarea></label><div class="inlineActions"><button class="action" onclick="saveReminderEdit()">Save changes</button><button class="action secondary" onclick="returnFromReminderEdit()">Cancel</button></div>' +
    (Array.isArray(e.checklist)
      ? ""
      : '<details class="compactDisclosure"><summary>Not a reminder? Move it to Care Logs</summary><p class="helperLine">Turns this into a care record on the same date, with its notes. It will no longer appear in Due Today.</p><label>Care log type<select id="reminderMoveSection">' +
        importSections
          .filter((x) => x !== "Calendar")
          .map((x) => "<option" + (x === importGuessSection(e.notes || "") ? " selected" : "") + ">" + x + "</option>")
          .join("") +
        '</select></label><button class="action secondary" onclick="reminderMoveToLog()">Move to Care Logs</button></details>')
  );
}
/* V3.34 · Old screenshot imports that landed as "due" reminders: past-dated "Other care" with written notes,
   no repeat, no notify times, no checklist. Real reminders are left alone. */
function strayImportedReminders() {
  const t = today();
  return entries.filter(
    (e) =>
      e.section === "Calendar" &&
      !e.done &&
      e.detail === "Other care" &&
      e.date < t &&
      String(e.notes || "").trim().length > 3 &&
      !Number(e.repeatDays) &&
      !Number(e.repeatMonths) &&
      !(Array.isArray(e.times) && e.times.length) &&
      !Array.isArray(e.checklist),
  );
}
function strayImportNotice() {
  const n = strayImportedReminders().length;
  return n
    ? '<div class="importFixNote"><b>' +
        n +
        (n === 1 ? " item looks" : " items look") +
        ' like old care records</b> from a screenshot import, not reminders. <button class="action" onclick="moveStrayImports()">Move ' +
        (n === 1 ? "it" : "all " + n) +
        " to Care Logs</button></div>"
    : "";
}
function moveStrayImports() {
  const list = strayImportedReminders();
  if (!list.length) return;
  if (!confirm("Move " + list.length + " old imported record" + (list.length === 1 ? "" : "s") + " out of your reminders and into Care Logs? Dates and notes are kept.")) return;
  const backup = entries.slice();
  list.forEach((e) => {
    const i = entries.indexOf(e),
      notes = String(e.notes || "").trim().slice(0, 1200),
      section = importGuessSection(notes);
    entries[i] = { id: e.id, section, animal: e.animal, date: e.date, detail: importDetailFor(section, notes), notes };
  });
  try {
    save();
  } catch (err) {
    entries = backup;
    alert("Could not move these records. Nothing was changed.");
    return;
  }
  render();
  stToast("Moved ♡ " + list.length + " record" + (list.length === 1 ? "" : "s") + " now in Care Logs.");
}
function reminderMoveToLog() {
  const e = entries[reminderEditIndex];
  if (!e || e.section !== "Calendar") return;
  const section = document.getElementById("reminderMoveSection")?.value;
  if (!section || section === "Calendar") return;
  const notes = (document.getElementById("reminderEditNotes")?.value ?? e.notes ?? "").trim().slice(0, 1200);
  const moved = {
    id: e.id,
    section,
    animal: document.getElementById("reminderEditAnimal")?.value || e.animal,
    date: document.getElementById("reminderEditDate")?.value || e.date,
    detail: importDetailFor(section, notes),
    notes,
  };
  const old = e;
  entries[reminderEditIndex] = moved;
  try {
    save();
  } catch (err) {
    entries[reminderEditIndex] = old;
    alert("Could not move this record. Nothing was changed.");
    return;
  }
  openPanel("Care Logs", moved.animal);
}
function returnFromReminderEdit() {
  let origin = reminderEditOrigin;
  reminderEditIndex = -1;
  openPanel(origin === "Edit Reminder" ? "Calendar" : origin);
}
function saveReminderEdit() {
  let e = entries[reminderEditIndex];
  if (!e || e.section !== "Calendar" || e.done) return;
  let d = document.getElementById("reminderEditDate")?.value,
    type = document.getElementById("reminderEditDetail")?.value.trim() || "",
    a = document.getElementById("reminderEditAnimal")?.value,
    repeat = readRepeat("reminderEditRepeat", "reminderEditRepeatCustom"),
    n = repeat ? repeat.repeatDays : -1;
  if (!repeat) return;
  if (!validDate(d)) {
    alert("Choose a valid date.");
    return;
  }
  if (!type || !a) {
    alert("Choose an animal and reminder type.");
    return;
  }
  if (!Number.isInteger(n) || n < 0 || n > 365) {
    alert("Repeat must be a whole number from 0 to 365.");
    return;
  }
  if (
    entries.some(
      (x, j) =>
        j !== reminderEditIndex &&
        x.section === "Calendar" &&
        !x.done &&
        x.animal === a &&
        x.date === d &&
        x.detail === type,
    )
  ) {
    alert("An identical unfinished reminder already exists.");
    return;
  }
  let extra = reminderEditReadExtra(e);
  if (!extra) return;
  let old = e;
  entries[reminderEditIndex] = {
    ...e,
    ...extra,
    animal: a,
    date: d,
    detail: type.slice(0, 80),
    repeatDays: n,
    repeatMonths: repeat.repeatMonths || undefined,
    repeatAnchor: repeat.repeatMonths ? Number(d.slice(8, 10)) : undefined,
    notes: document.getElementById("reminderEditNotes").value.trim().slice(0, 300),
  };
  for (const k of ["times", "repeatMonths", "repeatAnchor"])
    if (entries[reminderEditIndex][k] === undefined) delete entries[reminderEditIndex][k];
  if (REMINDER_LOG[entries[reminderEditIndex].detail] && entries[reminderEditIndex].kind !== "checklist")
    entries[reminderEditIndex].logSection = REMINDER_LOG[entries[reminderEditIndex].detail][0];
  try {
    save();
  } catch (err) {
    entries[reminderEditIndex] = old;
    alert("Could not save this reminder. The previous version is intact.");
    return;
  }
  returnFromReminderEdit();
}
function deleteReminder(i) {
  if (!entries[i] || entries[i].section !== "Calendar" || !confirm("Move this reminder to Recently Deleted?")) return;
  deleteWithRecovery(i);
}
function calendarMarkup() {
  let tasks = entries.filter((e) => e.section === "Calendar").sort((a, b) => a.date.localeCompare(b.date)),
    t = today(),
    due = tasks.filter((e) => !e.done && e.date <= t),
    upcoming = tasks.filter((e) => !e.done && e.date > t),
    done = tasks.filter((e) => e.done);
  return (
    '<p class="muted">All your saved reminders in one place.</p>' +
    (typeof pushDeviceEnabled !== "undefined" && pushDeviceEnabled ? '<details class="compactDisclosure"><summary>🔔 Phone reminders are on · settings</summary>' + pushSettingsMarkup() + "</details>" : pushSettingsMarkup()) +
    '<h3 class="sectionTitle">Due & overdue (' +
    due.length +
    ")</h3>" +
    (due.length > 1 ? '<button class="action secondary" onclick="completeAllDue()">✓ Mark all ' + due.length + " done</button>" : "") +
    taskMarkup(due) +
    '<h3 class="sectionTitle">Coming up (' +
    upcoming.length +
    ")</h3>" +
    taskMarkup(upcoming) +
    '<details class="compactDisclosure"><summary>Completed (' +
    done.length +
    ")</summary>" +
    taskMarkup(done) +
    "</details>"
  );
}
function filterLogs() {
  let a = document.getElementById("logAnimal")?.value || "",
    t = document.getElementById("logType")?.value || "",
    from = document.getElementById("logFrom")?.value || "",
    to = document.getElementById("logTo")?.value || "",
    q = (document.getElementById("logSearch")?.value || "").trim().toLowerCase(),
    target = document.getElementById("filteredLogs");
  if (!target) return;
  let filtered = entries.filter(
    (e) =>
      e.section !== "Calendar" &&
      (!a || e.animal === a) &&
      (!t || e.section === t) &&
      (!from || e.date >= from) &&
      (!to || e.date <= to) &&
      (!q ||
        [
          e.animal,
          e.section,
          e.detail,
          e.date,
          e.notes,
          e.preyType,
          e.preyWeight,
          e.response,
          e.warmTemp,
          e.coolTemp,
          e.humidity,
          e.vetName,
          e.medication,
          e.dose,
          e.nextSteps,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)),
  );
  let count = document.getElementById("logCount");
  if (count) count.textContent = filtered.length + " matching care record" + (filtered.length === 1 ? "" : "s");
  target.innerHTML = logList(filtered);
}
function resetLogFilters() {
  ["logAnimal", "logType", "logFrom", "logTo", "logSearch"].forEach((id) => {
    let el = document.getElementById(id);
    if (el) el.value = "";
  });
  filterLogs();
}
function toggleRepeatCustom() {
  let sel = document.getElementById("repeatDays"),
    label = document.getElementById("repeatCustomLabel");
  if (label) label.hidden = sel?.value !== "custom";
}
function growthChart(a) {
  let byDate = new Map();
  entries
    .filter((e) => e.animal === a && e.section === "Weight Tracker")
    .forEach((e) => {
      let n = parseFloat(e.detail);
      if (Number.isFinite(n) && n > 0) byDate.set(e.date, n);
    });
  let w = [...byDate].map(([date, n]) => ({ date, n })).sort((x, y) => x.date.localeCompare(y.date)).slice(-24);
  if (w.length < 2)
    return '<p class="muted">Log weights on two different dates to see a growth chart. Quick Log → Weighed is the fastest way.</p>';
  let lo = Math.min(...w.map((x) => x.n)),
    hi = Math.max(...w.map((x) => x.n)),
    pad = (hi - lo) * 0.12 || hi * 0.05 || 1;
  lo = Math.max(0, lo - pad);
  hi = hi + pad;
  const X = (i) => 46 + (i * 262) / (w.length - 1),
    Y = (n) => 120 - ((n - lo) / (hi - lo)) * 100,
    pts = w.map((x, i) => X(i).toFixed(1) + "," + Y(x.n).toFixed(1)),
    first = w[0],
    last = w[w.length - 1],
    delta = Number((last.n - first.n).toFixed(1)),
    pct = first.n ? Math.round((delta / first.n) * 100) : 0,
    fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(2).replace(/\.?0+$/, "") + " kg" : Number(n.toFixed(1)) + " g");
  return (
    '<div class="growth"><strong>Weight trend</strong><svg viewBox="0 0 320 150" role="img" aria-label="Weight history for ' +
    esc(a) +
    '">' +
    '<line x1="46" y1="20" x2="308" y2="20" class="gGrid"/><line x1="46" y1="70" x2="308" y2="70" class="gGrid"/><line x1="46" y1="120" x2="308" y2="120" class="gGrid"/>' +
    '<text x="40" y="24" class="gLab" text-anchor="end">' + esc(fmt(hi)) + '</text><text x="40" y="124" class="gLab" text-anchor="end">' + esc(fmt(lo)) + "</text>" +
    '<polyline points="' + pts.join(" ") + '" class="gLine"/>' +
    pts.map((p, i) => '<circle cx="' + p.split(",")[0] + '" cy="' + p.split(",")[1] + '" r="' + (i === pts.length - 1 ? 4.5 : 3) + '" class="gDot"/>').join("") +
    '<text x="46" y="142" class="gLab">' + esc(niceDate(first.date).replace(/^\w+, /, "")) + '</text><text x="308" y="142" class="gLab" text-anchor="end">' + esc(niceDate(last.date).replace(/^\w+, /, "")) + "</text>" +
    "</svg><small>" +
    esc(fmt(first.n)) + " → <b>" + esc(fmt(last.n)) + "</b> (" + (delta >= 0 ? "+" : "") + esc(fmt(Math.abs(delta)).replace(/^/, delta < 0 ? "−" : "")) + ", " + (pct >= 0 ? "+" : "") + pct + "%) across " + w.length + " weigh-ins" +
    "</small></div>"
  );
}
function nextCareLabel(a) {
  let task = entries
    .filter((e) => e.animal === a && e.section === "Calendar" && !e.done)
    .sort((x, y) => x.date.localeCompare(y.date))[0];
  return task ? niceDate(task.date) : "Nothing due";
}
function editAnimalByName(a) {
  let i = animals.indexOf(a);
  if (i >= 0) editAnimalForm(i);
}
function logCareChooser() {
  return (
    '<p class="muted">Choose what you want to record for <b>' +
    esc(selectedAnimal) +
    '</b>. Everything saves into the same care history.</p><div class="logCareChoices">' +
    [
      ["Feeding Tracker", "Feeding", "utensils"],
      ["Weight Tracker", "Weight", "scale"],
      ...(stNoShed(selectedAnimal) ? [] : [["Shed History", animalCareType(selectedAnimal) === "invertebrate" ? "Molt" : "Shed", "sparkles"]]),
      ["Enclosure Care", "Habitat check", "thermometer"],
      ...(stNoShed(selectedAnimal) ? [] : [["UVB & Lighting", "UVB / lighting", "sun"]]),
      ["Supplements", "Supplements", "pill"],
      ["Observations", "Observation", "eye"],
      ["Health & Vet", "Health / Vet", "heart"],
    ]
      .map(
        ([key, label, ic]) =>
          '<button onclick="quickLog(&quot;' +
          esc(key) +
          '&quot;)"><span aria-hidden="true">♡</span><strong>' +
          esc(label) +
          "</strong></button>",
      )
      .join("") +
    '</div><button class="action secondary" onclick="importScreenshotAnimal=selectedAnimal;openPanel(&quot;Import Existing Records&quot;)">📷 Import old logs from a screenshot</button><button class="action secondary" onclick="openPanel(selectedAnimal)">Back to profile</button>'
  );
}
function compactUpcomingMarkup(tasks) {
  return tasks.length
    ? tasks
        .map(
          (e) =>
            '<div class="timeline"><strong>' +
            esc(e.detail) +
            "</strong><small>" +
            niceDate(e.date) +
            esc(repeatText(e)) +
            '</small><button class="smallbutton" onclick="completeReminder(' +
            entries.indexOf(e) +
            ')">Mark Done</button></div>',
        )
        .join("")
    : '<p class="muted">No care tasks scheduled.</p>';
}
function compactRecentMarkup(items) {
  return items.length
    ? items
        .map(
          (e) =>
            '<div class="compactRecent"><strong>' +
            esc(e.detail) +
            "</strong><small>" +
            niceDate(e.date) +
            " · " +
            esc(e.section) +
            "</small></div>",
        )
        .join("")
    : '<p class="muted">No care records yet.</p>';
}
function profileOverviewMarkup(a) {
  let history = entries
      .filter((e) => e.animal === a && e.section !== "Calendar")
      .sort((x, y) => y.date.localeCompare(x.date) || entries.indexOf(y) - entries.indexOf(x)),
    future = entries
      .filter((e) => e.animal === a && e.section === "Calendar" && !e.done)
      .sort((x, y) => x.date.localeCompare(y.date))
      .slice(0, 3),
    d = compassData(a);
  return (
    '<h3 class="sectionTitle">Coming up</h3>' +
    compactUpcomingMarkup(future) +
    (entries.some((e) => e.animal === a && e.section === "Weight Tracker") ? growthChart(a) : "") +
    '<button class="action secondary" onclick="openPanel(&quot;Calendar&quot;,selectedAnimal)">View full calendar / add reminder</button><details class="profileFold"><summary>Care insights · ' +
    d.recordCount +
    ' care log entries</summary><p class="helperLine">Keeper-recorded trends, not a diagnosis.</p>' +
    d.lines
      .slice(0, 4)
      .map((v) => '<div class="compassInsight"><p>' + esc(v) + "</p></div>")
      .join("") +
    '<button class="action secondary" onclick="openPanel(&quot;Care Insights&quot;,selectedAnimal)">Explore all insights</button></details><h3 class="sectionTitle">Recent activity</h3>' +
    compactRecentMarkup(history.slice(0, 3)) +
    '<button class="action secondary" onclick="profileTab(&quot;History&quot;)">View all history</button>'
  );
}
const PROFILE_TYPES = {
  "Feeding Tracker": "Feeding Tracker",
  "Weight Tracker": "Weight Tracker",
  "Shed History": "Shed History",
  "Enclosure Care": "Enclosure Care",
  Observations: "Observations",
  "UVB & Lighting": "UVB & Lighting",
  Supplements: "Supplements",
  "Health & Vet": "Health & Vet",
  Breeding: "Breeding",
};
function profileHistoryMarkup(a) {
  let all = entries.filter((e) => e.animal === a && e.section !== "Calendar");
  return (
    '<h3 class="sectionTitle">Care history (' +
    all.length +
    ')</h3><label>Show activity<select id="profileHistoryType" onchange="filterProfileHistory()"><option value="">All care</option>' +
    Object.keys(PROFILE_TYPES)
      .map((v) => "<option>" + esc(v) + "</option>")
      .join("") +
    '</select></label><div id="profileHistoryResults"></div>'
  );
}
function filterProfileHistory() {
  let a = current,
    type = document.getElementById("profileHistoryType")?.value || "",
    el = document.getElementById("profileHistoryResults");
  if (!el) return;
  let all = entries.filter((e) => e.animal === a && e.section !== "Calendar" && (!type || e.section === type));
  el.innerHTML =
    '<p class="helperLine">' +
    all.length +
    " record" +
    (all.length === 1 ? "" : "s") +
    "</p>" +
    (type === "Weight Tracker" ? growthChart(a) : "") +
    logList(all);
}
function photoWorkspaceMarkup(a, choose) {
  return (
    '<p class="muted">Your selected picture appears on Home and your profile. Without one, Scale & Tell uses a matching illustrated default.</p>' +
    (choose
      ? '<label>Animal<select id="photoAnimal" onchange="selectedAnimal=this.value;renderPhotos()">' +
        animalOptions() +
        "</select></label>"
      : '<select id="photoAnimal" aria-label="Selected animal" hidden><option selected>' +
        esc(a) +
        "</option></select>") +
    '<label>Photo<input id="photoInput" type="file" accept="image/*"></label><label>Caption<input id="photoCaption" maxlength="100" placeholder="Optional memory"></label><button class="action" id="photoSaveButton" onclick="addPhoto()">Add photo</button><p id="photoStatus" role="status" aria-live="polite" class="muted">Select a photo, then tap Add photo.</p><div id="photoGallery"></div>'
  );
}
function profileTab(tab) {
  let a = current,
    el = document.getElementById("profileTab");
  if (!el || !animals.includes(a)) return;
  document.querySelectorAll(".profileNav button").forEach((b) => {
    let chosen = b.textContent === tab;
    b.classList.toggle("selected", chosen);
    b.setAttribute("aria-selected", String(chosen));
  });
  if (tab === "Overview") {
    el.innerHTML = profileOverviewMarkup(a);
    return;
  }
  if (tab === "History") {
    el.innerHTML = profileHistoryMarkup(a);
    filterProfileHistory();
    return;
  }
  if (tab === "Habitat") {
    el.innerHTML = habitatMarkup(a);
    return;
  }
  if (tab === "Photos") {
    el.innerHTML = photoWorkspaceMarkup(a, false);
    renderPhotos();
    return;
  }
}
function exportBackup() {
  let status = document.getElementById("backupStatus");
  try {
    let data = {
      format: "scale-and-tell-backup",
      version: 8,
      exportedAt: new Date().toISOString(),
      entries,
      profiles,
      roster: { animals, species },
      photos,
      carePlans,
      devices,
      socialLinks,
      savedVet,
      profilePhotos,
      notificationPrefs,
      sitterSettings,
      archived: JSON.parse(localStorage.getItem("scaleTellArchived10") || "[]"),
      deletedRecords,
    };
    let raw = JSON.stringify(data, null, 2),
      blob = new Blob([raw], { type: "application/json" }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "scale-and-tell-backup-" + today() + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    try {
      localStorage.setItem("scaleTellBackupGenerated25", new Date().toISOString());
    } catch (ignored) {}
    if (status) status.textContent = "Backup ready. Save the downloaded file to Files to keep your copy.";
    else alert("Backup ready. Save the downloaded file to Files to keep your copy.");
  } catch (e) {
    if (status) status.textContent = "Could not create your backup. Please try again.";
    else alert("Could not create your backup. Please try again.");
  }
}

async function importBackup() {
  let f = document.getElementById("backupFile")?.files?.[0];
  if (!f) {
    alert("Choose a backup file first.");
    return;
  }
  if (f.size > 20000000) {
    alert("This backup is over 20 MB; it is too large for this local beta.");
    return;
  }
  let data;
  try {
    data = JSON.parse(await f.text());
  } catch (e) {
    alert("This is not a valid JSON backup.");
    return;
  }
  if (
    data?.format !== "scale-and-tell-backup" ||
    ![1, 2, 3, 4, 5, 6, 7, 8].includes(data.version) ||
    !Array.isArray(data.entries) ||
    !data.profiles ||
    typeof data.profiles !== "object" ||
    Array.isArray(data.profiles) ||
    data.entries.length > 10000 ||
    !data.entries.every(
      (e) =>
        e &&
        typeof e === "object" &&
        typeof e.animal === "string" &&
        e.animal.length <= 100 &&
        typeof e.section === "string" &&
        typeof e.date === "string" &&
        validDate(e.date) &&
        typeof e.detail === "string",
    )
  ) {
    alert("This file is not a compatible Scale & Tell backup.");
    return;
  }
  let incomingRoster = data.roster,
    incomingPhotos = data.photos;
  if (data.version >= 2) {
    if (
      !incomingRoster ||
      !Array.isArray(incomingRoster.animals) ||
      incomingRoster.animals.length > 500 ||
      !incomingRoster.animals.every((a) => typeof a === "string" && a.length <= 50) ||
      !incomingRoster.species ||
      typeof incomingRoster.species !== "object" ||
      !incomingPhotos ||
      typeof incomingPhotos !== "object" ||
      Array.isArray(incomingPhotos) ||
      !Object.values(incomingPhotos).every(
        (g) =>
          Array.isArray(g) &&
          g.length <= 100 &&
          g.every(
            (p) =>
              p &&
              typeof p.src === "string" &&
              /^data:image\/(?:jpeg|png|webp);base64,/.test(p.src) &&
              p.src.length <= 2500000 &&
              typeof p.date === "string" &&
              validDate(p.date) &&
              typeof p.caption === "string",
          ),
      )
    ) {
      alert("The backup roster or photo gallery is damaged. No changes were made.");
      return;
    }
  }
  if (
    data.version >= 3 &&
    (!data.carePlans ||
      typeof data.carePlans !== "object" ||
      Array.isArray(data.carePlans) ||
      Object.keys(data.carePlans).length > 100 ||
      !Object.values(data.carePlans).every(
        (p) =>
          p &&
          typeof p === "object" &&
          !Array.isArray(p) &&
          (!p.notes || (typeof p.notes === "string" && p.notes.length <= 500)) &&
          careValues().every(
            ([k, , lo, hi]) =>
              p[k] === undefined || p[k] === "" || (Number.isInteger(p[k]) && p[k] >= lo && p[k] <= hi),
          ),
      ))
  ) {
    alert("This backup contains invalid personal care targets. No changes were made.");
    return;
  }
  if (
    data.version >= 4 &&
    (!Array.isArray(data.devices) ||
      data.devices.length > 300 ||
      !data.devices.every(
        (d) =>
          d &&
          typeof d === "object" &&
          typeof d.id === "string" &&
          d.id.length <= 90 &&
          ["sensor", "camera"].includes(d.kind) &&
          typeof d.animal === "string" &&
          d.animal.length <= 50 &&
          typeof d.nickname === "string" &&
          d.nickname.length > 0 &&
          d.nickname.length <= 55 &&
          typeof d.brand === "string" &&
          d.brand.length <= 55 &&
          typeof d.model === "string" &&
          d.model.length <= 75 &&
          typeof d.link === "string" &&
          validCameraLink(d.link) &&
          typeof d.placement === "string" &&
          d.placement.length <= 40 &&
          typeof d.metrics === "string" &&
          d.metrics.length <= 40,
      ))
  ) {
    alert("This backup contains invalid device assignments. No changes were made.");
    return;
  }
  if (
    data.version >= 5 &&
    (!data.socialLinks ||
      typeof data.socialLinks !== "object" ||
      Array.isArray(data.socialLinks) ||
      Object.keys(SOCIAL_DEFAULT).some(
        (k) =>
          typeof data.socialLinks[k] !== "string" ||
          data.socialLinks[k].length > 400 ||
          (data.socialLinks[k] && !officialSocialUrl(data.socialLinks[k], k)),
      ) ||
      !data.savedVet ||
      typeof data.savedVet !== "object" ||
      Array.isArray(data.savedVet) ||
      typeof data.savedVet.name !== "string" ||
      data.savedVet.name.length > 100 ||
      typeof data.savedVet.phone !== "string" ||
      data.savedVet.phone.length > 32 ||
      (data.savedVet.phone && !/^[+\d() .-]{5,32}$/.test(data.savedVet.phone)))
  ) {
    alert("The backup contains invalid community or veterinary shortcuts. No changes were made.");
    return;
  }
  if (
    data.version >= 6 &&
    (!data.profilePhotos ||
      typeof data.profilePhotos !== "object" ||
      Array.isArray(data.profilePhotos) ||
      Object.keys(data.profilePhotos).length > 100 ||
      !Object.values(data.profilePhotos).every((v) => typeof v === "string" && v.length <= 100) ||
      !data.notificationPrefs ||
      typeof data.notificationPrefs !== "object" ||
      Array.isArray(data.notificationPrefs) ||
      Object.keys(NOTIFY_DEFAULT).some((k) => typeof data.notificationPrefs[k] !== "boolean"))
  ) {
    alert("This backup has invalid profile-photo choices or notification preferences. No changes made.");
    return;
  }
  if (
    data.version >= 7 &&
    (!data.sitterSettings ||
      typeof data.sitterSettings !== "object" ||
      Array.isArray(data.sitterSettings) ||
      ["keeper", "phone", "alternate", "general"].some(
        (k) =>
          typeof data.sitterSettings[k] !== "string" || data.sitterSettings[k].length > (k === "general" ? 1200 : 160),
      ))
  ) {
    alert("The sitter-sheet settings in this backup are invalid. No changes were made.");
    return;
  }
  if (
    data.version >= 8 &&
    (!Array.isArray(data.deletedRecords) ||
      data.deletedRecords.length > 30 ||
      !data.deletedRecords.every(
        (x) =>
          x &&
          typeof x.deletedAt === "string" &&
          !Number.isNaN(Date.parse(x.deletedAt)) &&
          x.entry &&
          typeof x.entry.animal === "string" &&
          x.entry.animal.length <= 100 &&
          typeof x.entry.section === "string" &&
          typeof x.entry.detail === "string" &&
          typeof x.entry.date === "string" &&
          validDate(x.entry.date),
      ))
  ) {
    alert("The recovery records in this backup are invalid. Nothing changed.");
    return;
  }
  let photoCount = data.version >= 2 ? Object.values(incomingPhotos).reduce((n, g) => n + g.length, 0) : "unchanged";
  if (
    !confirm(
      "Review this backup:\nExported: " +
        (data.exportedAt ? new Date(data.exportedAt).toLocaleString("en-US") : "Date unknown") +
        "\nCare entries: " +
        data.entries.length +
        "\nPhotos: " +
        photoCount +
        "\n\nRestoring REPLACES the records currently in this browser. Continue only if you saved your existing data.",
    )
  )
    return;
  let updates = {
    scaleTellApprovedPreview: JSON.stringify(data.entries),
    scaleTellProfiles03: JSON.stringify(data.profiles),
  };
  if (data.version >= 8) updates.scaleTellDeleted25 = JSON.stringify(data.deletedRecords);
  if (data.version >= 2) {
    updates.scaleTellRoster10 = JSON.stringify(incomingRoster);
    updates.scaleTellPhotos10 = JSON.stringify(incomingPhotos);
    updates.scaleTellArchived10 = JSON.stringify(Array.isArray(data.archived) ? data.archived : []);
  }
  if (data.version >= 3) updates.scaleTellCarePlans12 = JSON.stringify(data.carePlans);
  if (data.version >= 4) updates.scaleTellDevices13 = JSON.stringify(data.devices);
  if (data.version >= 5) {
    updates.scaleTellSocial14 = JSON.stringify(data.socialLinks);
    updates.scaleTellVet14 = JSON.stringify(data.savedVet);
  }
  if (data.version >= 6) {
    updates.scaleTellProfilePhotos15 = JSON.stringify(data.profilePhotos);
    updates.scaleTellNotifyPrefs15 = JSON.stringify(data.notificationPrefs);
  } else if (data.version >= 2) {
    updates.scaleTellProfilePhotos15 = "{}";
  }
  if (data.version >= 7) updates.scaleTellSitter18 = JSON.stringify(data.sitterSettings);
  let previous = {};
  Object.keys(updates).forEach((key) => (previous[key] = localStorage.getItem(key)));
  try {
    for (let [key, value] of Object.entries(updates)) scaleStoreSet(key, value);
  } catch (e) {
    for (let [key, value] of Object.entries(previous)) {
      try {
        if (value === null) localStorage.removeItem(key);
        else scaleStoreSet(key, value);
      } catch (ignored) {}
    }
    alert(
      "Not enough browser storage to restore this file. Existing records were restored where possible. Please do not clear browser data.",
    );
    return;
  }
  entries = data.entries;
  profiles = data.profiles;
  if (data.version >= 2) {
    animals = incomingRoster.animals;
    species = incomingRoster.species;
    photos = incomingPhotos;
  }
  if (data.version >= 3) carePlans = data.carePlans;
  if (data.version >= 4) devices = data.devices;
  if (data.version >= 5) {
    socialLinks = data.socialLinks;
    savedVet = data.savedVet;
  }
  if (data.version >= 6) {
    profilePhotos = data.profilePhotos;
    notificationPrefs = data.notificationPrefs;
  } else if (data.version >= 2) profilePhotos = {};
  if (data.version >= 7) sitterSettings = data.sitterSettings;
  if (data.version >= 8) deletedRecords = data.deletedRecords;
  selectedAnimal = animals[0] || "";
  alert("Backup restored successfully.");
  render();
}
function saveWeight() {
  let date = document.getElementById("date").value,
    w = Number(document.getElementById("weightValue").value);
  if (!validDate(date) || !Number.isFinite(w) || w <= 0) {
    alert("Enter a valid date and weight in grams.");
    return;
  }
  entries.push({ section: "Weight Tracker", animal: selectedAnimal, detail: w + " g", date, notes: "" });
  save();
  render();
}
function completeReminder(i, quiet) {
  let e = entries[i];
  if (!e || e.section !== "Calendar" || e.done) return;
  e.done = true;
  e.completedAt = new Date().toISOString();
  let n = Number(e.repeatDays) || 0,
    months = Number(e.repeatMonths) || 0;
  if ((n > 0 && Number.isInteger(n) && n <= 365) || (months > 0 && months <= 12)) {
    let base = e.date > today() ? e.date : today(),
      next = n > 0 ? advanceDate(base, n) : advanceMonths(e.date, months, e.repeatAnchor);
    if (months) while (next <= today()) next = advanceMonths(next, months, e.repeatAnchor);
    if (
      !entries.some(
        (x) => x.section === "Calendar" && !x.done && x.animal === e.animal && x.detail === e.detail && x.date === next,
      )
    ) {
      entries.push({
        section: "Calendar",
        animal: e.animal,
        detail: e.detail,
        date: next,
        notes: e.notes || "",
        repeatDays: n,
        ...(months ? { repeatMonths: months, repeatAnchor: e.repeatAnchor || Number(e.date.slice(8, 10)) } : {}),
        done: false,
        ...reminderCarryOver(e),
      });
    }
  }
  save();
  render();
  if (!quiet) reminderOfferLog(e);
}
function editProfile(a) {
  let i = animals.indexOf(a);
  if (i >= 0) editAnimalForm(i);
}
function saveProfile() {
  profiles[selectedAnimal] = {
    ...(profiles[selectedAnimal] || {}),
    weight: document.getElementById("weight").value.trim(),
    enclosure: document.getElementById("enclosure").value.trim(),
    notes: document.getElementById("profileNotes").value.trim(),
  };
  scaleStoreSet("scaleTellProfiles03", JSON.stringify(profiles));
  openPanel(selectedAnimal);
}
function saveEntry() {
  let date = document.getElementById("date").value;
  if (!validDate(date)) {
    alert("Please choose a valid date.");
    return;
  }
  selectedAnimal = document.getElementById("animal").value;
  let detail = document.getElementById("detail").value,
    notes = document.getElementById("entryNotes").value.trim();
  let rem = current === "Calendar" ? reminderFormValues(detail) : null;
  if (current === "Calendar") {
    if (!rem) return;
    detail = rem.detail;
  }
  if (
    current === "Calendar" &&
    entries.some(
      (e) =>
        e.section === "Calendar" && !e.done && e.animal === selectedAnimal && e.date === date && e.detail === detail,
    )
  ) {
    alert("This animal already has an unfinished " + detail.toLowerCase() + " on that date.");
    return;
  }
  const feedingTime = current === "Feeding Tracker" ? (document.getElementById("feedTime")?.value || "").trim() : "";
  if (feedingTime && !stValidFeedingTime(feedingTime)) return alert("Enter a valid feeding time or leave it blank.");
  let preyType = document.getElementById("preyType")?.value.trim() || "",
    preyWeight = document.getElementById("preyWeight")?.value || "",
    response = document.getElementById("feedingResponse")?.value || "",
    warmTemp = document.getElementById("warmTemp")?.value || "",
    coolTemp = document.getElementById("coolTemp")?.value || "",
    humidity = document.getElementById("humidity")?.value || "";
  if (preyWeight && (!Number.isFinite(Number(preyWeight)) || Number(preyWeight) < 0)) {
    alert("Enter a valid prey weight.");
    return;
  }
  if (
    current === "Enclosure Care" &&
    [
      [warmTemp, 0, 130],
      [coolTemp, 0, 130],
      [humidity, 0, 100],
    ].some(([v, lo, hi]) => v !== "" && (!Number.isFinite(Number(v)) || Number(v) < lo || Number(v) > hi))
  ) {
    alert("Check the temperature and humidity readings.");
    return;
  }
  let repeat = current === "Calendar" ? readRepeat("repeatDays", "repeatCustom") : null;
  if (current === "Calendar" && !repeat) return;
  entries.push({
    section: current,
    animal: selectedAnimal,
    detail,
    date,
    notes,
    ...(current === "Feeding Tracker" ? { preyType, preyWeight, response, ...(feedingTime ? { feedingTime } : {}) } : {}),
    ...(current === "Enclosure Care" ? { warmTemp, coolTemp, humidity } : {}),
    ...(current === "Calendar"
      ? {
          repeatDays: repeat.repeatDays,
          ...(repeat.repeatMonths
            ? { repeatMonths: repeat.repeatMonths, repeatAnchor: Number(date.slice(8, 10)) }
            : {}),
          ...rem.extra,
        }
      : {}),
    ...(current === "Feeding Tracker" && document.getElementById("feedSupplement")?.value
      ? { supplement: document.getElementById("feedSupplement").value }
      : {}),
    ...(current === "UVB & Lighting"
      ? { bulb: (document.getElementById("bulbInfo")?.value || "").trim().slice(0, 80) }
      : {}),
    ...(current === "Supplements"
      ? {
          product: (document.getElementById("suppProduct")?.value || "").trim().slice(0, 60),
          method: document.getElementById("suppMethod")?.value || "",
        }
      : {}),
  });
  let nextFeed = current === "Feeding Tracker" ? autoNextFeeding(selectedAnimal, date) : "";
  if (current === "Feeding Tracker" && detail === "Ate" && preyType) try { feederUse(preyType, 1); } catch (e) {}
  save();
  render();
  if (nextFeed) stToast("Saved ♡ Next feeding reminder: " + niceDate(nextFeed));
}

const SPECIES_GROUPS = [
  ["Snakes", ["Ball Python", "Corn Snake", "Kingsnake", "Milk Snake", "Western Hognose", "Garter Snake", "Boa Constrictor", "Reticulated Python", "Burmese Python", "Blood Python", "Children’s Python", "Spotted Python", "Green Tree Python", "Carpet Python", "Woma Python", "Kenyan Sand Boa", "Rosy Boa", "Dumeril’s Boa", "Rat Snake", "Bull / Gopher Snake", "Pine Snake", "Rough Green Snake"]],
  ["Lizards", ["Bearded Dragon", "Leopard Gecko", "Crested Gecko", "Gargoyle Gecko", "Leachianus Gecko", "African Fat-Tailed Gecko", "Tokay Gecko", "Day Gecko", "Mourning Gecko", "Veiled Chameleon", "Panther Chameleon", "Jackson’s Chameleon", "Uromastyx", "Ackie Monitor", "Savannah Monitor", "Argentine Tegu", "Green Iguana", "Frilled Dragon", "Chinese Water Dragon", "Rankin’s Dragon", "Green Anole", "Skink", "Blue Tongue Skink"]],
  ["Turtles & tortoises", ["Sulcata Tortoise", "Russian Tortoise", "Hermann’s Tortoise", "Leopard Tortoise", "Red-Footed Tortoise", "Tortoise", "Box Turtle", "Red-Eared Slider", "Musk Turtle", "Aquatic Turtle"]],
  ["Amphibians", ["White’s Tree Frog", "African Dwarf Frog", "Pac-Man Frog", "Tomato Frog", "Red-Eyed Tree Frog", "Frog", "Axolotl", "Dart Frog", "Tree Frog", "Toad", "Fire-Bellied Toad", "Newt", "Salamander"]],
  ["Invertebrates", ["Tarantula", "Jumping Spider", "Scorpion", "Millipede", "Isopod", "Mantis", "Hermit Crab", "Snail"]],
  ["Rodents", ["Rat", "Mouse", "Hamster", "Gerbil", "Guinea Pig", "Chinchilla", "Degu", "African Soft-Furred Rat", "Multimammate Mouse", "Spiny Mouse", "Feeder Mice (colony)", "Feeder Rats (colony)"]],
  ["Small mammals", ["Rabbit", "Hedgehog", "Sugar Glider", "Ferret"]],
  ["Fish & aquatic", ["Fish", "Betta", "Aquarium / tank"]],
  ["Birds", ["Bird"]],
];
const PET_SPECIES = SPECIES_GROUPS.flatMap((g) => g[1]).concat("Other");
/* Breeders see rodents near the top, for pet and feeder rodent breeders alike. */
function speciesGroupsFor() {
  const g = SPECIES_GROUPS.slice();
  try { if (typeof bizIsBreeder === "function" && bizIsBreeder()) { const i = g.findIndex((x) => x[0] === "Rodents"); g.unshift(g.splice(i, 1)[0]); } } catch (e) {}
  return g;
}
let animalEditIndex = -1;
function editAnimalForm(i) {
  animalEditIndex = i;
  selectedAnimal = animals[i] || selectedAnimal;
  openPanel("Animal Setup");
}
function speciesFieldValue() {
  let pick = document.getElementById("speciesChoice")?.value || "Other";
  return pick === "Other" ? document.getElementById("customSpecies")?.value.trim() || "Other" : pick;
}
function updateAnimalPortraitPreview() {
  let select = document.getElementById("speciesChoice"),
    custom = document.getElementById("customSpeciesLabel");
  if (!select) return;
  let other = select.value === "Other";
  if (custom) custom.hidden = !other;
  let key = speciesPortraitKey(speciesFieldValue());
  let img = document.getElementById("animalDefaultPortrait"),
    label = document.getElementById("animalDefaultLabel");
  if (img) img.src = GENERIC_PORTRAITS[key] || GENERIC_PORTRAITS.other;
  if (label) label.textContent = speciesFieldValue() || "Other";
}
function animalSetupMarkup() {
  let isEdit = animalEditIndex >= 0 && !!animals[animalEditIndex],
    name = isEdit ? animals[animalEditIndex] : "",
    p = isEdit ? profiles[name] || {} : {},
    sp = isEdit ? species[name] || "Other" : "Ball Python",
    chosen = PET_SPECIES.includes(sp) ? sp : "Other",
    title = isEdit ? "Edit " + name : "Add an animal";
  return (
    '<p class="muted">' +
    (isEdit
      ? "Changes to an animal’s name or species keep its linked care records, photos and devices."
      : "Choose a species to automatically select its default illustrated portrait. Every animal can have its own gallery photo instead.") +
    '</p><h3 class="sectionTitle">' +
    esc(title) +
    '</h3><label>Name<input id="animalSetupName" maxlength="50" placeholder="e.g. Kane" value="' +
    esc(name) +
    '"></label><label>Species<select id="speciesChoice" onchange="updateAnimalPortraitPreview()">' +
    speciesGroupsFor().map(([label, list]) => '<optgroup label="' + esc(label) + '">' + list.map(
      (v) => '<option value="' + esc(v) + '" ' + (v === chosen ? "selected" : "") + ">" + esc(v) + "</option>",
    ).join("") + "</optgroup>").join("") +
    '<option value="Other" ' + (chosen === "Other" ? "selected" : "") + ">Other</option>" +
    '</select></label><label id="customSpeciesLabel" ' +
    (chosen === "Other" ? "" : "hidden") +
    '>Other species (optional)<input id="customSpecies" maxlength="80" oninput="updateAnimalPortraitPreview()" placeholder="Enter species or type" value="' +
    esc(chosen === "Other" && sp !== "Other" ? sp : "") +
    '"></label><div class="animalPortraitPreview"><img id="animalDefaultPortrait" src="' +
    (GENERIC_PORTRAITS[speciesPortraitKey(sp)] || GENERIC_PORTRAITS.other) +
    '" alt="Default species portrait"><div><strong id="animalDefaultLabel">' +
    esc(sp) +
    '</strong><small>Generic image used until a Photo Journal profile picture is selected.</small></div></div><label>Feeding schedule (optional)<span class="feedEvery">Every <input type="number" id="animalFeedDays" min="1" max="365" step="1" inputmode="numeric" placeholder="7" value="' +
    esc(isEdit ? carePlans[name]?.feedDays ?? "" : "") +
    '"> days</span></label><p class="helperLine">Set this and every logged feeding schedules the next feeding reminder for you. Leave blank to schedule your own.</p><details class="compactDisclosure animalMore"' +
    (isEdit ? " open" : "") +
    '><summary>More details (optional): sex, morph, dates, enclosure, notes</summary><div class="animalFormGrid"><label>Sex<select id="animalSex">' +
    ["Unknown", "Male", "Female", "Unsexed"]
      .map((v) => "<option " + ((p.sex || "Unknown") === v ? "selected" : "") + ">" + v + "</option>")
      .join("") +
    '</select></label><label>Morph / variety (optional)<input id="animalMorph" maxlength="70" value="' +
    esc(p.morph || "") +
    '" placeholder="e.g. Enchi"></label><label>Birth / hatch date (optional)<input type="date" id="animalHatch" value="' +
    esc(p.hatchDate || "") +
    '"></label><label>Date acquired (optional)<input type="date" id="animalAcquired" value="' +
    esc(p.acquiredDate || "") +
    '"></label></div><label>Enclosure (optional)<input id="animalEnclosure" maxlength="70" value="' +
    esc(p.enclosure || "") +
    '" placeholder="e.g. 4 × 2 × 2 ft"></label><label>Starting weight (optional)<input id="animalWeight" maxlength="30" value="' +
    esc(p.weight || "") +
    '" placeholder="e.g. 200 g"></label><label>Notes<textarea id="animalNotes" maxlength="400" placeholder="Anything to remember">' +
    esc(p.notes || "") +
    '</textarea></label><label>Pet-sitter care instructions (optional)<textarea id="animalSitterInstructions" maxlength="1200" placeholder="Water, feeding, access, routines...">' +
    esc(p.sitterInstructions || "") +
    '</textarea></label><label>Handling precautions for a caregiver (optional)<textarea id="animalHandlingNotes" maxlength="500" placeholder="e.g. No handling unless needed">' +
    esc(p.handlingNotes || "") +
    '</textarea></label></details><button class="action" onclick="saveAnimalSetup()">' +
    (isEdit ? "Save animal" : "Add animal") +
    '</button><button class="action secondary" onclick="openPanel(&quot;My Reptiles&quot;)">Cancel</button>'
  );
}
function saveAnimalSetup() {
  let old = animalEditIndex >= 0 ? animals[animalEditIndex] : null,
    name = document.getElementById("animalSetupName")?.value.trim() || "",
    sp = speciesFieldValue();
  let hatch = document.getElementById("animalHatch")?.value || "",
    acquired = document.getElementById("animalAcquired")?.value || "";
  if (!name || name.length > 50) {
    alert("Enter an animal name (up to 50 characters).");
    return;
  }
  if (
    [
      "Menu",
      "Notifications",
      "Care Logs",
      "Calendar",
      "Scale Hub",
      "Animal Setup",
      "Photo Journal",
      "My Reptiles",
      "Habitat",
      "Devices",
      "Urgent Help",
      "Health & Vet",
      "Pet-Sitter Sheet",
      "Welcome Setup",
      "Quick Log",
      "Plans",
      ...BREEDER_PANELS,
    ].some((x) => x.toLowerCase() === name.toLowerCase())
  ) {
    alert("This name is reserved for navigation. Please choose a different name.");
    return;
  }
  if (animals.some((a, i) => i !== animalEditIndex && a.toLowerCase() === name.toLowerCase())) {
    alert("An active animal already uses that name.");
    return;
  }
  if (!sp || sp.length > 80) {
    alert("Enter a species or choose Other.");
    return;
  }
  if ((hatch && !validDate(hatch)) || (acquired && !validDate(acquired))) {
    alert("Enter valid dates or leave them blank.");
    return;
  }
  let feedRaw = (document.getElementById("animalFeedDays")?.value || "").trim(),
    feedDays = feedRaw === "" ? "" : Number(feedRaw);
  if (feedDays !== "" && !(Number.isInteger(feedDays) && feedDays >= 1 && feedDays <= 365)) {
    alert("Feeding schedule must be a whole number of days from 1 to 365, or blank.");
    return;
  }
  let wasFirst = !old && !animals.length;
  let nextP = {
    ...(old ? profiles[old] || {} : {}),
    sex: document.getElementById("animalSex").value,
    morph: document.getElementById("animalMorph").value.trim().slice(0, 70),
    hatchDate: hatch,
    acquiredDate: acquired,
    enclosure: document.getElementById("animalEnclosure").value.trim().slice(0, 70),
    weight: document.getElementById("animalWeight").value.trim().slice(0, 30),
    notes: document.getElementById("animalNotes").value.trim().slice(0, 400),
    sitterInstructions: document.getElementById("animalSitterInstructions").value.trim().slice(0, 1200),
    handlingNotes: document.getElementById("animalHandlingNotes").value.trim().slice(0, 500),
  };
  if (old) {
    animals[animalEditIndex] = name;
    if (name !== old) {
      delete species[old];
      entries.forEach((e) => {
        if (e.animal === old) e.animal = name;
      });
      photos[name] = photos[old] || [];
      delete photos[old];
      if (Object.prototype.hasOwnProperty.call(profilePhotos, old)) {
        profilePhotos[name] = profilePhotos[old];
        delete profilePhotos[old];
        scaleStoreSet("scaleTellProfilePhotos15", JSON.stringify(profilePhotos));
      }
      if (Object.prototype.hasOwnProperty.call(carePlans, old)) {
        carePlans[name] = carePlans[old];
        delete carePlans[old];
        saveCarePlans();
      }
      breederRename(old, name);
      let moved = devices.map((d) => (d.animal === old ? { ...d, animal: name } : d));
      saveDevices(moved);
      delete profiles[old];
      savePhotos();
      save();
    }
  } else {
    if (animals.length >= 500) {
      alert("Scale & Tell supports up to 500 active animals.");
      return;
    }
    if (cloudSession && stOwnsEntitlements() && animals.length >= stAnimalLimit()) {
      stCanAddAnimal();
      return;
    }
    animals.push(name);
  }
  species[name] = sp;
  profiles[name] = nextP;
  if (feedDays !== "" || carePlans[name]?.feedDays !== undefined) {
    carePlans[name] = { ...(carePlans[name] || {}), feedDays };
    saveCarePlans();
  }
  try {
    scaleStoreSet("scaleTellProfiles03", JSON.stringify(profiles));
    saveRoster();
  } catch (e) {
    alert("Could not save your animal. Browser storage may be full.");
    return;
  }
  selectedAnimal = name;
  openPanel(name);
  if (wasFirst)
    stToast("Welcome, " + name + " ♡ Tap Quick Log whenever you feed, weigh or clean.");
}
function moveAnimal(i, delta) {
  let j = i + delta;
  if (i < 0 || j < 0 || j >= animals.length) return;
  [animals[i], animals[j]] = [animals[j], animals[i]];
  saveRoster();
  render();
}
// Legacy previews sometimes stored starter pictures as actual animals. Never delete
// a name with any personal profile, log, photo, device, or care target.
function legacySampleCandidates() {
  if (!animals.some((x) => !["Oro", "Kane", "Roux"].includes(x))) return [];
  return ["Oro", "Kane", "Roux"].filter(
    (x) =>
      animals.includes(x) &&
      ((x === "Roux" && species[x] === "Corn Snake") || (x !== "Roux" && species[x] === "Ball Python")) &&
      !Object.keys(profiles[x] || {}).length &&
      !(photos[x] || []).length &&
      !profilePhotos[x] &&
      !Object.keys(carePlans[x] || {}).length &&
      !entries.some((e) => e.animal === x) &&
      !devices.some((d) => d.animal === x),
  );
}
function removeLegacySamples() {
  let names = legacySampleCandidates();
  if (!names.length) return;
  if (
    !confirm(
      "Remove these unused example records from your roster?\n\n" +
        names.join(", ") +
        "\n\nAnimals with any saved care, photo, profile, or device information will not be touched.",
    )
  )
    return;
  animals = animals.filter((a) => !names.includes(a));
  names.forEach((a) => delete species[a]);
  saveRoster();
  openPanel("My Reptiles");
}
function filterAnimalRoster() {
  let q = (document.getElementById("rosterSearch")?.value || "").toLowerCase().trim();
  document.querySelectorAll(".reptileListItem").forEach((x) => {
    x.hidden = !!q && !x.getAttribute("data-match").includes(q);
  });
  let count = document.getElementById("rosterResults");
  if (count)
    count.textContent =
      document.querySelectorAll(".reptileListItem:not([hidden])").length + " of " + animals.length + " shown";
}
function quickLog(type) {
  openPanel(type, selectedAnimal);
}
function openAnimalAt(i) {
  if (animals[i]) openPanel(animals[i]);
}
function addAnimal() {
  if (cloudSession && stOwnsEntitlements() && !stCanAddAnimal()) return;
  animalEditIndex = -1;
  openPanel("Animal Setup");
}
function renameAnimal(i) {
  editAnimalForm(i);
}
function archiveAnimal(i) {
  let name = animals[i];
  if (!name || !confirm("Archive " + name + "? Records are kept and will return when restored.")) return;
  let ar = JSON.parse(localStorage.getItem("scaleTellArchived10") || "[]");
  ar.push({ name, species: species[name] || "Reptile" });
  scaleStoreSet("scaleTellArchived10", JSON.stringify(ar));
  animals.splice(i, 1);
  saveRoster();
  openPanel("My Reptiles");
}
function restoreAnimal(i) {
  let ar = JSON.parse(localStorage.getItem("scaleTellArchived10") || "[]"),
    a = ar[i];
  if (!a) return;
  if (animals.includes(a.name)) {
    alert("An active reptile already uses this name.");
    return;
  }
  animals.push(a.name);
  species[a.name] = a.species;
  ar.splice(i, 1);
  scaleStoreSet("scaleTellArchived10", JSON.stringify(ar));
  saveRoster();
  openPanel("My Reptiles");
}
function renderPhotos() {
  let a = document.getElementById("photoAnimal")?.value || selectedAnimal,
    el = document.getElementById("photoGallery");
  if (!el) return;
  let gallery = photos[a] || [];
  el.innerHTML =
    '<h3 class="photoGalleryTitle">' +
    esc(a) +
    '’s gallery</h3><p class="countLine">' +
    gallery.length +
    " photo" +
    (gallery.length === 1 ? "" : "s") +
    "</p>" +
    (gallery.length
      ? gallery
          .map(
            (p, i) =>
              '<div class="photoCard"><img loading="lazy" src="' +
              p.src +
              '" alt="' +
              esc(p.caption || "Reptile photo") +
              '"><p>' +
              esc(p.caption || "Photo") +
              " · " +
              niceDate(p.date) +
              '</p><div class="recordActions">' +
              (profilePhotos[a] === photoKey(p)
                ? '<span class="profileSelected">✓ Profile photo</span>'
                : '<button onclick="chooseProfilePhoto(' + i + ')">Set as profile photo</button>') +
              (profilePhotos[a] === photoKey(p)
                ? '<button onclick="clearProfilePhoto()">Use species default</button>'
                : "") +
              '<button onclick="editPhotoCaption(' +
              i +
              ')">Edit caption</button><button onclick="deletePhoto(' +
              i +
              ')">Delete photo</button></div></div>',
          )
          .join("")
      : '<p class="muted">No photos for this animal yet.</p>');
}
function persistPhotoChange(a, gallery) {
  let all = { ...photos, [a]: gallery };
  try {
    scaleStoreSet("scaleTellPhotos10", JSON.stringify(all));
    let check = JSON.parse(localStorage.getItem("scaleTellPhotos10") || "{}");
    if (!Array.isArray(check[a]) || check[a].length !== gallery.length) throw Error("Save verification failed");
    photos = all;
    return true;
  } catch (e) {
    photoStatus("Changes were not saved. Browser storage may be full.", false);
    return false;
  }
}
function editPhotoCaption(i) {
  let a = document.getElementById("photoAnimal")?.value,
    old = photos[a]?.[i];
  if (!old) return;
  let caption = prompt("Photo caption", old.caption || "");
  if (caption === null) return;
  let gallery = photos[a].map((p, j) => (j === i ? { ...p, caption: caption.trim().slice(0, 100) } : p));
  if (persistPhotoChange(a, gallery)) {
    renderPhotos();
    photoStatus("✓ Photo caption updated.", true);
  }
}
function deletePhoto(i) {
  let a = document.getElementById("photoAnimal")?.value;
  if (!a || !photos[a]?.[i] || !confirm("Delete this photo?")) return;
  let gallery = photos[a].filter((_, j) => j !== i);
  if (persistPhotoChange(a, gallery)) {
    let still = gallery.some((p) => photoKey(p) === profilePhotos[a]);
    if (!still && profilePhotos[a]) {
      let next = { ...profilePhotos };
      delete next[a];
      try {
        scaleStoreSet("scaleTellProfilePhotos15", JSON.stringify(next));
        profilePhotos = next;
      } catch (e) {}
    }
    renderPhotos();
    renderHomeCards();
    photoStatus(
      "Photo deleted from " + a + "’s gallery. The species default appears if it was their profile image.",
      true,
    );
  }
}
function photoStatus(message, ok) {
  let el = document.getElementById("photoStatus");
  if (el) {
    el.textContent = message;
    el.style.color = ok ? "#42613c" : "#9b3155";
  }
}
function addPhoto() {
  let select = document.getElementById("photoAnimal"),
    input = document.getElementById("photoInput"),
    caption = document.getElementById("photoCaption"),
    button = document.getElementById("photoSaveButton");
  let a = select?.value,
    f = input?.files?.[0];
  if (!a || !f) {
    photoStatus("Please choose an animal and a photo.", false);
    return;
  }
  if (!f.type.startsWith("image/") || f.size > 12000000) {
    photoStatus("Choose an image smaller than 12 MB.", false);
    return;
  }
  if (button) {
    button.disabled = true;
    button.textContent = "Saving photo…";
  }
  photoStatus("Processing your photo…", true);
  const finish = () => {
    if (button) {
      button.disabled = false;
      button.textContent = "Add photo";
    }
  };
  const fail = (message) => {
    photoStatus(message, false);
    finish();
  };
  try {
    let r = new FileReader();
    r.onerror = () => fail("Could not read this photo. Please try another image.");
    r.onload = () => {
      let img = new Image();
      img.onerror = () => fail("Could not decode this image. Try saving it as a JPEG first.");
      img.onload = () => {
        try {
          let c = document.createElement("canvas"),
            scale = Math.min(1, 700 / img.width, 700 / img.height);
          c.width = Math.max(1, Math.round(img.width * scale));
          c.height = Math.max(1, Math.round(img.height * scale));
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          let src = c.toDataURL("image/jpeg", 0.52);
          if (!src.startsWith("data:image/jpeg;base64,")) {
            fail("Photo conversion failed. Try a JPEG image.");
            return;
          }
          let item = { src, caption: caption?.value.trim() || "", date: today() },
            before = photos[a] || [],
            updated = [...before, item];
          // Commit to browser storage before changing the visible gallery.
          try {
            let all = { ...photos, [a]: updated };
            scaleStoreSet("scaleTellPhotos10", JSON.stringify(all));
            let verify = JSON.parse(localStorage.getItem("scaleTellPhotos10") || "{}");
            if (!verify[a] || verify[a].length !== updated.length) throw Error("Storage verification failed");
            photos = all;
          } catch (e) {
            fail("Photo was NOT saved. Browser storage may be full. Export a backup and try a smaller image.");
            return;
          }
          if (input) input.value = "";
          if (caption) caption.value = "";
          if (select) select.value = a;
          renderPhotos();
          photoStatus("✓ Photo saved to " + a + "’s gallery (" + updated.length + " total).", true);
          finish();
        } catch (e) {
          fail("Photo processing failed. Try a different or smaller image.");
        }
      };
      img.src = r.result;
    };
    r.readAsDataURL(f);
  } catch (e) {
    fail("Could not start the photo upload. Please try again.");
  }
}

// V1.8: species-aware care labels, with keeper-set targets rather than invented default ranges.
function animalCareType(a) {
  let sp = (species[a] || "").toLowerCase();
  if (/snake|python|boa\b|hognose/.test(sp)) return "snake";
  if (/\b(rats?|mouse|mice|hamsters?|gerbils?|guinea pigs?|chinchillas?|degus?|rabbits?|hedgehogs?|sugar gliders?|ferrets?)\b|multimammate|rodent/.test(sp)) return "mammal";
  if (/\bfish|betta|aquarium/.test(sp)) return "fish";
  if (/\bbirds?\b|parrot|parakeet|budgie|cockatiel/.test(sp)) return "bird";
  if (/spider|tarantula|scorpion|isopod|millipede|mantis|invertebrate/.test(sp)) return "invertebrate";
  if (/frog|toad|axolotl|newt|salamander/.test(sp)) return "amphibian";
  if (/tortoise|turtle|terrapin|slider|cooter/.test(sp)) return "chelonian";
  if (/gecko|dragon|chameleon|skink|anole|iguana|lizard|uromastyx|monitor|tegu|leachi/.test(sp)) return "lizard";
  if (/snake|python|boa|hognose/.test(sp)) return "snake";
  return "other";
}
/* Mammals, fish and birds don't shed or need UVB logs; mammals have litters instead of clutches. */
function stNoShed(a) {
  return ["mammal", "fish", "bird"].includes(animalCareType(a));
}
function stLiveBirth(a) {
  return animalCareType(a) === "mammal";
}
function foodTypeLabel(a) {
  return (
    {
      snake: "Prey type",
      invertebrate: "Food / feeder type",
      amphibian: "Food / prey offered",
      lizard: "Food / feeder type",
      chelonian: "Food / diet item",
      mammal: "Food / diet",
      fish: "Food",
      bird: "Food / diet",
    }[animalCareType(a)] || "Food / prey offered"
  );
}
function careFormHint(a) {
  return (
    {
      snake: "Record prey size, weight and feeding response when useful.",
      invertebrate:
        "Track feeder insects, molts and webbing or enclosure observations. No automatic care recommendations.",
      amphibian: "Track food offered, water maintenance and environmental observations.",
      lizard: "Track insects, greens or prepared diets as appropriate for your species.",
      chelonian: "Track diet items, UVB / lighting checks and water or substrate maintenance.",
    }[animalCareType(a)] || "Log the information relevant to your animal."
  );
}
function careOptions(section, a) {
  let type = animalCareType(a);
  if (section === "Calendar")
    return [
      "Feeding reminder",
      "Enclosure reminder",
      "Weight check",
      "Shed / molt check",
      "Medication / veterinary follow-up",
      "UVB bulb change",
      "Supplement",
      "Other care",
    ];
  if (section === "UVB & Lighting")
    return ["UVB bulb change", "Basking / heat bulb change", "UVB output check", "Lighting schedule change"];
  if (section === "Supplements") return ["Calcium", "Calcium + D3", "Multivitamin", "Other supplement"];
  if (section === "Feeding Tracker") return ["Ate", "Refused", "Offered"];
  if (section === "Shed History")
    return type === "invertebrate"
      ? ["Complete molt", "Incomplete molt", "Premolt", "Molt observation"]
      : ["Complete shed", "Incomplete shed", "In blue", "Shed observation"];
  if (section === "Enclosure Care") {
    let base = ["Spot clean", "Water change", "Full cleanout", "Substrate change", "Temperature / humidity check", "Enclosure refresh"];
    if (type === "invertebrate" || type === "amphibian") base.splice(1, 0, "Misting");
    if (type === "chelonian" || type === "lizard") base.push("Lighting / UVB check");
    return base;
  }
  if (section === "Observations") {
    let base = [
      "Poop / urate",
      "Exploration / activity",
      "Hiding more",
      "Behavior change",
      "Feeding behavior note",
      "Handling",
      "Other observation",
    ];
    if (type === "invertebrate") base.splice(1, 0, "Webbing / burrow activity", "Premolt behavior");
    if (type === "amphibian") base.splice(1, 0, "Water / skin observation");
    return base;
  }
  return [];
}
function refreshCareOptions() {
  let a = document.getElementById("animal")?.value,
    sel = document.getElementById("detail");
  if (sel && a) {
    let previous = sel.value;
    sel.innerHTML = careOptions(current, a)
      .map((v) => "<option>" + esc(v) + "</option>")
      .join("");
    if ([...sel.options].some((o) => o.value === previous)) sel.value = previous;
  }
  let label = document.getElementById("foodTypeLabel");
  if (label) label.firstChild.textContent = foodTypeLabel(a);
  let hint = document.getElementById("speciesCareHint");
  if (hint) hint.textContent = careFormHint(a);
  let uvb = document.getElementById("uvbLast");
  if (uvb && a) uvb.textContent = uvbLastChangeText(a);
}
// A health entry is a regular care record. Optional photo attachments are compressed before saving.
let healthEditing = -1;
function safeHealthAttachment(value) {
  return typeof value === "string" && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(value) && value.length < 1500000;
}
function healthMarkup(a) {
  let items = entries.filter((e) => e.animal === a && e.section === "Health & Vet");
  let edit =
    healthEditing >= 0 && entries[healthEditing]?.animal === a && entries[healthEditing]?.section === "Health & Vet"
      ? entries[healthEditing]
      : null;
  return (
    '<p class="notice">A private record of keeper-entered symptoms, vet visits, treatments and medication administration. This is not medical advice. For emergencies, contact an appropriate veterinarian.</p><h3 class="sectionTitle">' +
    esc(a) +
    ' · Health & Vet</h3><p id="healthStatus" role="status" aria-live="polite" class="savedFeedback"></p><details id="healthForm" ' +
    (edit ? "open" : "") +
    '><summary class="formSummary">' +
    (edit ? "Edit health / vet record" : "+ Add health / vet record") +
    '</summary><div class="healthForm"><label>Date<input type="date" id="healthDate" value="' +
    esc(edit?.date || today()) +
    '"></label><label>Record type<select id="healthType">' +
    ["Vet visit", "Symptom / concern", "Medication dose", "Test / result", "Treatment", "Recovery / follow-up", "Other"]
      .map((v) => "<option " + (edit?.detail === v ? "selected" : "") + ">" + v + "</option>")
      .join("") +
    '</select></label><label>Veterinarian / clinic (optional)<input id="healthVet" maxlength="100" value="' +
    esc(edit?.vetName || "") +
    '"></label><label>Medication or treatment (optional)<input id="healthMedication" maxlength="120" value="' +
    esc(edit?.medication || "") +
    '"></label><label>Dose / administration (optional)<input id="healthDose" maxlength="90" value="' +
    esc(edit?.dose || "") +
    '" placeholder="Document exactly as directed by your vet"></label><label>Observations / visit notes<textarea id="healthNotes" maxlength="1200" placeholder="What you observed, what your vet advised...">' +
    esc(edit?.notes || "") +
    '</textarea></label><label>Next steps / follow-up (optional)<textarea id="healthNext" maxlength="500">' +
    esc(edit?.nextSteps || "") +
    '</textarea></label><label>Attach one photo (optional, compressed)<input type="file" id="healthFile" accept="image/*"></label>' +
    (edit?.attachment && safeHealthAttachment(edit.attachment)
      ? '<p class="helperLine">Existing photo will be kept unless you choose a new one.</p>'
      : "") +
    '<p class="helperLine">A saved record does not automatically schedule medication or follow-up. Use Calendar separately to set reminders.</p><button class="action" onclick="saveHealthRecord()">' +
    (edit ? "Save changes" : "Save health record") +
    "</button>" +
    (edit ? '<button class="action secondary" onclick="cancelHealthEdit()">Cancel edit</button>' : "") +
    '<p id="healthFormStatus" role="status" aria-live="polite" class="helperLine"></p></div></details><h3 class="sectionTitle">Health history (' +
    items.length +
    ")</h3>" +
    logList(items) +
    '<button class="action secondary" onclick="openPanel(\'Calendar\',selectedAnimal)">Schedule a follow-up reminder</button>'
  );
}
function editHealthRecord(i) {
  if (entries[i]?.section !== "Health & Vet") return;
  healthEditing = i;
  openPanel("Health & Vet", entries[i].animal);
}
function cancelHealthEdit() {
  healthEditing = -1;
  render();
}
async function compressedHealthPhoto(file) {
  if (!file) return "";
  if (!file.type.startsWith("image/") || file.size > 12000000) throw Error("Choose an image under 12 MB.");
  let src = await new Promise((ok, bad) => {
    let r = new FileReader();
    r.onload = () => ok(r.result);
    r.onerror = () => bad(Error("Could not read photo"));
    r.readAsDataURL(file);
  });
  let img = await new Promise((ok, bad) => {
    let im = new Image();
    im.onload = () => ok(im);
    im.onerror = () => bad(Error("Image could not be opened"));
    im.src = src;
  });
  let canvas = document.createElement("canvas"),
    scale = Math.min(1, 850 / img.width, 850 / img.height);
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.62);
}
async function saveHealthRecord() {
  let status = document.getElementById("healthFormStatus"),
    date = document.getElementById("healthDate")?.value,
    detail = document.getElementById("healthType")?.value,
    a = selectedAnimal;
  if (!validDate(date) || !a || !detail) {
    if (status) status.textContent = "Choose an animal, date and record type.";
    return;
  }
  let old = healthEditing >= 0 ? entries[healthEditing] : null;
  let data = {
    section: "Health & Vet",
    animal: a,
    date,
    detail,
    vetName: document.getElementById("healthVet").value.trim().slice(0, 100),
    medication: document.getElementById("healthMedication").value.trim().slice(0, 120),
    dose: document.getElementById("healthDose").value.trim().slice(0, 90),
    notes: document.getElementById("healthNotes").value.trim().slice(0, 1200),
    nextSteps: document.getElementById("healthNext").value.trim().slice(0, 500),
    attachment: old?.attachment || "",
  };
  try {
    let file = document.getElementById("healthFile")?.files?.[0];
    if (file) data.attachment = await compressedHealthPhoto(file);
    let next = entries.slice();
    if (old) next[healthEditing] = { ...old, ...data };
    else next.push(data);
    scaleStoreSet("scaleTellApprovedPreview", JSON.stringify(next));
    entries = next;
    healthEditing = -1;
    render();
    let summary = document.getElementById("healthStatus");
    if (summary) summary.textContent = "✓ Health record saved. The entry is in this animal’s history and Care Logs.";
  } catch (e) {
    if (status)
      status.textContent =
        "Record was NOT saved: " +
        (e?.name === "QuotaExceededError"
          ? "Browser storage is full. Back up your records and try a smaller attachment."
          : e.message || "Please try again.");
  }
}
// Pet-sitter sheet: reviewable plain-text document, generated locally. No implicit sharing.
const SITTER_DEFAULT = { keeper: "", phone: "", alternate: "", general: "" };
let sitterSettings = { ...SITTER_DEFAULT };
try {
  let v = JSON.parse(localStorage.getItem("scaleTellSitter18") || "{}");
  if (v && typeof v === "object" && !Array.isArray(v))
    for (let k of Object.keys(SITTER_DEFAULT))
      if (typeof v[k] === "string") sitterSettings[k] = v[k].slice(0, k === "general" ? 1200 : 160);
} catch (e) {}
function sitterMarkup() {
  return (
    '<p class="notice">Create a pet-sitter or emergency care sheet from your recorded information. Review before sharing. No contacts or medical notes leave your device automatically.</p><div class="sitterForm"><label>Keeper name (optional)<input id="sitKeeper" maxlength="160" value="' +
    esc(sitterSettings.keeper) +
    '"></label><label>Contact number (optional)<input id="sitPhone" maxlength="160" value="' +
    esc(sitterSettings.phone) +
    '"></label><label>Alternate contact (optional)<input id="sitAlternate" maxlength="160" value="' +
    esc(sitterSettings.alternate) +
    '"></label><label>General household instructions<textarea id="sitGeneral" maxlength="1200">' +
    esc(sitterSettings.general) +
    '</textarea></label><h3 class="sectionTitle">Include animals</h3>' +
    animals
      .map(
        (a, i) =>
          '<label class="sitterCheck"><input type="checkbox" class="sitterAnimal" value="' +
          i +
          '" checked> ' +
          esc(a) +
          " · " +
          esc(species[a] || "Other") +
          "</label>",
      )
      .join("") +
    '<label class="sitterCheck"><input type="checkbox" id="sitIncludeHealth"> Include up to 3 recent health / vet records per animal (optional, potentially private)</label><button class="action" onclick="generateSitterSheet()">Generate care sheet</button><p id="sitterStatus" class="helperLine" role="status">No document is shared automatically.</p><label>Review your document<textarea id="sitterPreview" class="handoffText" readonly placeholder="Tap Generate care sheet"></textarea></label><div class="inlineActions"><button class="action secondary" onclick="downloadSitterSheet()">Download .txt</button><button class="action secondary" onclick="copySitterSheet()">Copy text</button></div><p class="muted">Care instructions are editable under My Reptiles → Edit details. The saved vet shortcut is also included when configured.</p></div>'
  );
}
function sitterDocument(names, includeHealth) {
  let lines = [
    "SCALE & TELL · PET-SITTER / EMERGENCY CARE SHEET",
    "Generated: " + new Date().toLocaleString("en-US"),
    "Review this sheet before sharing. It reflects keeper-entered records only.",
    "",
    "KEEPER",
    "Name: " + (sitterSettings.keeper || "Not provided"),
    "Phone: " + (sitterSettings.phone || "Not provided"),
    "Alternate contact: " + (sitterSettings.alternate || "Not provided"),
    "General instructions: " + (sitterSettings.general || "None recorded"),
    "",
    "PREFERRED VETERINARIAN",
    "Clinic: " + (savedVet.name || "Not saved"),
    "Phone: " + (savedVet.phone || "Not saved"),
    "",
  ];
  for (let a of names) {
    let p = profiles[a] || {},
      feed = sortedAnimalEntries(a, "Feeding Tracker").filter((e) => e.detail === "Ate"),
      last = feed.length ? feed[feed.length - 1] : null,
      scheduled = sortedAnimalEntries(a, "Calendar")
        .filter((e) => !e.done)
        .sort((x, y) => x.date.localeCompare(y.date))
        .slice(0, 3);
    lines.push(
      "================================",
      "ANIMAL: " + a + " · " + (species[a] || "Other"),
      "Sex: " + (p.sex || "Not recorded"),
      "Enclosure: " + (p.enclosure || "Not recorded"),
      "Care instructions: " + (p.sitterInstructions || p.notes || "Not provided"),
      "Handling precautions: " + (p.handlingNotes || "Not provided"),
      "Last logged successful feeding: " +
        (last ? last.date + (last.preyType ? " · " + last.preyType : "") : "No record"),
      "Next three pending tasks:",
    );
    lines.push(
      ...(scheduled.length
        ? scheduled.map((e) => "• " + e.date + " · " + e.detail + (e.notes ? " · " + e.notes : ""))
        : ["• No pending tasks recorded"]),
    );
    if (includeHealth) {
      let hs = sortedAnimalEntries(a, "Health & Vet").slice(-3).reverse();
      lines.push(
        "Recent health / vet records (included by keeper choice):",
        ...(hs.length
          ? hs.map(
              (e) =>
                "• " +
                e.date +
                " " +
                e.detail +
                (e.medication ? " · " + e.medication : "") +
                (e.dose ? " · " + e.dose : "") +
                (e.nextSteps ? " · " + e.nextSteps : "") +
                (e.notes ? " · " + e.notes : ""),
            )
          : ["• No health records logged"]),
      );
    }
    lines.push("");
  }
  lines.push(
    "IMPORTANT: A missing record is unknown, not evidence a task was completed. Follow the keeper’s instructions. Seek qualified veterinary care when needed.",
  );
  return lines.join("\n");
}
function generateSitterSheet() {
  for (let k of Object.keys(SITTER_DEFAULT)) {
    let id = { keeper: "sitKeeper", phone: "sitPhone", alternate: "sitAlternate", general: "sitGeneral" }[k];
    sitterSettings[k] = (document.getElementById(id)?.value || "").trim().slice(0, k === "general" ? 1200 : 160);
  }
  let checks = [...document.querySelectorAll(".sitterAnimal:checked")],
    names = checks.map((e) => animals[Number(e.value)]).filter(Boolean),
    status = document.getElementById("sitterStatus");
  if (!names.length) {
    status.textContent = "Choose at least one animal.";
    return;
  }
  try {
    scaleStoreSet("scaleTellSitter18", JSON.stringify(sitterSettings));
  } catch (e) {
    status.textContent = "Could not save your sheet settings. The document may still be generated.";
  }
  let text = sitterDocument(names, !!document.getElementById("sitIncludeHealth")?.checked);
  document.getElementById("sitterPreview").value = text;
  status.textContent =
    "✓ Generated a private care sheet for " +
    names.length +
    " animal" +
    (names.length === 1 ? "" : "s") +
    ". Review before sharing.";
}
function downloadSitterSheet() {
  let text = document.getElementById("sitterPreview")?.value;
  if (!text) {
    generateSitterSheet();
    text = document.getElementById("sitterPreview")?.value;
  }
  if (!text) return;
  let blob = new Blob([text], { type: "text/plain;charset=utf-8" }),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = "scale-and-tell-pet-sitter-" + today() + ".txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
function copySitterSheet() {
  let t = document.getElementById("sitterPreview");
  if (!t?.value) {
    generateSitterSheet();
    if (!t?.value) return;
  }
  let status = document.getElementById("sitterStatus");
  let fallback = () => {
    t.focus();
    t.select();
    try {
      if (document.execCommand("copy")) {
        status.textContent = "✓ Sheet copied";
        return;
      }
    } catch (e) {}
    status.textContent = "Text selected. Tap Copy in your phone menu.";
  };
  if (navigator.clipboard?.writeText)
    navigator.clipboard
      .writeText(t.value)
      .then(() => (status.textContent = "✓ Sheet copied"))
      .catch(fallback);
  else fallback();
}
updateStats();
renderHomeCards();

/* Scale & Tell staging cloud foundation: an EXPLICIT, MANUAL sync workflow.
   All authenticated data access relies on the owner-only SQL policies and RPC.
   The browser contains a public publishable key only, NEVER a service-role key. */
const CLOUD_URL = "https://fitlubsbesadknkjimqd.supabase.co";
const CLOUD_PUBLIC_KEY = "sb_publishable_-aCjAUOdC1u3Vr0L0IQFbg_M8T88XwG";
const CLOUD_BUCKET = "scale-tell-private";
let cloudClient = null,
  cloudSession = null,
  cloudRow = null,
  cloudWorking = false,
  cloudRecovery = false,
  cloudInitialized = false,
  cloudPendingEmail = "";
const CLOUD_LOCAL_KEYS = {
  scaleTellApprovedPreview: "entries",
  scaleTellProfiles03: "profiles",
  scaleTellRoster10: "roster",
  scaleTellPhotos10: "photos",
  scaleTellCarePlans12: "carePlans",
  scaleTellDevices13: "devices",
  scaleTellSocial14: "socialLinks",
  scaleTellVet14: "savedVet",
  scaleTellProfilePhotos15: "profilePhotos",
  scaleTellNotifyPrefs15: "notificationPrefs",
  scaleTellSitter18: "sitterSettings",
  scaleTellArchived10: "archived",
  scaleTellDeleted25: "deletedRecords",
};
function cloudMsg(msg) {
  let el = document.getElementById("cloudStatus");
  if (el) el.textContent = msg;
}
function cloudLocalSummary() {
  return {
    animals: animals.length,
    records: entries.filter((e) => e.section !== "Calendar").length,
    reminders: entries.filter((e) => e.section === "Calendar").length,
    photos: Object.values(photos).reduce((n, p) => n + (Array.isArray(p) ? p.length : 0), 0),
  };
}
function cloudRemoteSummary(p) {
  return p && typeof p === "object" && Array.isArray(p.entries) && p.roster && Array.isArray(p.roster.animals)
    ? {
        animals: p.roster.animals.length,
        records: p.entries.filter((e) => e.section !== "Calendar").length,
        reminders: p.entries.filter((e) => e.section === "Calendar").length,
        photos: Object.values(p.photos || {}).reduce((n, v) => n + (Array.isArray(v) ? v.length : 0), 0),
      }
    : null;
}
function cloudSummaryText(x) {
  return x
    ? x.animals + " animals · " + x.records + " care records · " + x.reminders + " reminders · " + x.photos + " photos"
    : "No cloud snapshot yet";
}

/* V3.4: login-first presentation. No mock auth, every action uses Supabase. */
let cloudAuthReady = false,
  authMode = "signin";
const AUTH_STAY_KEY = "scaleTellStaySigned34";
function authStayEnabled() {
  return localStorage.getItem(AUTH_STAY_KEY) !== "0";
}
const authStorage = {
  getItem: (k) => (authStayEnabled() ? localStorage : sessionStorage).getItem(k),
  setItem: (k, v) => {
    let target = authStayEnabled() ? localStorage : sessionStorage,
      other = authStayEnabled() ? sessionStorage : localStorage;
    target.setItem(k, v);
    other.removeItem(k);
  },
  removeItem: (k) => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  },
};
let welcomeSlide = 0,
  welcomeTouchX = null,
  welcomeTouchY = null;
function setWelcomeSlide(index) {
  welcomeSlide = Math.min(2, Math.max(0, Number(index) || 0));
  for (const [id, active] of [
    ["welcomeSlideOne", welcomeSlide === 0],
    ["welcomeSlideTwo", welcomeSlide === 1],
    ["welcomeSlideThree", welcomeSlide === 2],
  ]) {
    const slide = document.getElementById(id);
    if (slide) slide.hidden = !active;
  }
  for (const [id, active] of [
    ["welcomeDotOne", welcomeSlide === 0],
    ["welcomeDotTwo", welcomeSlide === 1],
    ["welcomeDotThree", welcomeSlide === 2],
  ]) {
    const btn = document.getElementById(id);
    if (!btn) continue;
    btn.classList.toggle("isActive", active);
    btn.setAttribute("aria-current", String(active));
  }
  const next = document.getElementById("welcomeNext");
  if (next) next.textContent = ["Get the App →", "Care Reminders →", "← Welcome"][welcomeSlide];
}
function welcomeTouchStart(event) {
  if (event.touches.length !== 1) return;
  welcomeTouchX = event.touches[0].clientX;
  welcomeTouchY = event.touches[0].clientY;
}
function welcomeTouchEnd(event) {
  if (welcomeTouchX === null || !event.changedTouches.length) return;
  const dx = event.changedTouches[0].clientX - welcomeTouchX,
    dy = event.changedTouches[0].clientY - welcomeTouchY;
  welcomeTouchX = null;
  welcomeTouchY = null;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) setWelcomeSlide(welcomeSlide + (dx < 0 ? 1 : -1));
}
function authChooseMode(v) {
  authMode = v;
  updateAuthGate();
}
function authSetStay() {
  let checked = document.getElementById("cloudStay")?.checked !== false;
  localStorage.setItem(AUTH_STAY_KEY, checked ? "1" : "0");
}
function authLogin() {
  authSetStay();
  cloudSignIn();
}
function authCreate() {
  authSetStay();
  const code = (document.getElementById("signupMemberCode")?.value || "").trim().slice(0, 40);
  try { localStorage.setItem("scaleTellPendingUpdates", document.getElementById("signupUpdates")?.checked === false ? "0" : "1"); } catch (e) {}
  try {
    if (code) localStorage.setItem("scaleTellPendingCode", code);
    else localStorage.removeItem("scaleTellPendingCode");
  } catch (e) {}
  cloudSignUp();
}
/* After the first sign-in, a code typed on Create Account is used automatically. */
let stPendingCodeTried = false;
async function stRedeemPendingCode() {
  let code = "";
  try {
    code = localStorage.getItem("scaleTellPendingCode") || "";
  } catch (e) {}
  if (!code || stPendingCodeTried || !cloudClient || !cloudSession) return;
  stPendingCodeTried = true;
  try {
    const { data, error } = await stRedeemCall(code);
    if (!error && data !== "limit") localStorage.removeItem("scaleTellPendingCode");
    if (!error && data === "ok") {
      await founderRefreshEntitlement();
      stCodeReload(stCodeWelcome());
      return;
    }
    updateAuthGate();
    if (error?.stale) {
      const st = document.getElementById("memberCodeStatus"), d = document.getElementById("memberCodeBox");
      if (d) d.open = true;
      const inp = document.getElementById("memberCode");
      if (inp) inp.value = code;
      if (st) st.textContent = "We couldn’t reach the server just now. Check your connection, then tap Use code again.";
    }
    if (!error && (data === "invalid" || data === "used")) {
      const st = document.getElementById("memberCodeStatus");
      if (st) st.textContent = data === "used" ? "That code has already been used up. Choose a plan below." : "That code didn't work. Check it and try again, or choose a plan.";
      const d = document.getElementById("memberCodeBox");
      if (d) d.open = true;
    }
  } catch (e) { try { updateAuthGate(); } catch (x) {} }
}
function authGuestGuides() {
  openPanel("Care Library");
}
/* ===================== Launch access: Herps & Hers member code or $14.99 lifetime ===================== */
function accessGateMarkup() {
  return (
    '<div id="accessGate"><h1>Welcome to Scale &amp; Tell ♡</h1><p class="authIntro">Signed in as <b>' +
    esc(cloudSession?.user?.email || "your account") +
    "</b>. One last step to open your journal.</p>" +
    '<div class="accessCard"><h2>Founding Keeper · $14.99 once</h2><p>For hobby keepers. One payment, yours forever. Up to <b>40 animals</b> and <b>3 logins</b> for family, vet &amp; medication reminders, shed predictions, photo progress, an emergency card, four app designs, Care Binder, My Year in Scales and keeper printables.</p>' +
    founderCheckoutMarkup() +
    '</div>' +
    '<div class="accessCard accessBreeder"><span class="accessTag">Breeders &amp; rescues</span><h2>More animals? Racks? A rescue?</h2><div class="accessPlans">' +
    '<div><b>Founding Breeder</b><span>$19.99 / year</span><small>150 animals · racks, rack feeding, pairings, clutches · 3 logins</small></div>' +
    '<div><b>Premium Breeder</b><span>$29.99 / year</span><small>400 animals · genetics calculator, invoices, waitlist · 5 logins</small></div>' +
    '<div><b>Rescue</b><span>$29.99 / year · $14.99 verified 501(c)(3)</span><small>400 animals · intake, fosters, e-sign contracts · 5 logins</small></div>' +
    '</div><button class="authButton" type="button" onclick="openPanel(\'Plans\')">See breeder &amp; rescue plans</button></div>' +
    '<details class="accessCode" id="memberCodeBox"><summary>Have a member or promo code?</summary><label class="authField" for="memberCode">Member or promo code</label><input id="memberCode" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="40" placeholder="Member code" onkeydown="if(event.key===\'Enter\')accessRedeemCode()"><button class="authButton" type="button" onclick="accessRedeemCode()">Use code</button><p id="memberCodeStatus" class="authMessage" role="status"></p></details>' +
    '<button class="authLink" type="button" onclick="cloudSignOut()">Sign out</button></div>'
  );
}
/* Redeem a code. A stale sign-in (common when the confirmation email opened in another tab) is refreshed and retried once. */
async function stRedeemCall(code) {
  const call = () => cloudClient.rpc("redeem_member_code", { p_code: code });
  let r = await call();
  const stale = (e) => e && (e.status === 401 || e.code === "42501" || e.code === "PGRST301" || /jwt|permission denied|sign in required/i.test(e.message || ""));
  if (stale(r.error)) {
    try { await cloudClient.auth.refreshSession(); } catch (e) {}
    r = await call();
    if (stale(r.error)) r.error.stale = true;
  }
  return r;
}
async function accessRedeemCode() {
  const input = document.getElementById("memberCode"),
    status = document.getElementById("memberCodeStatus"),
    code = (input?.value || "").trim();
  const say = (t) => status && (status.textContent = t);
  if (!code) return say("Enter the member code first.");
  if (!cloudClient || !cloudSession) return say("Please sign in again.");
  say("Checking your code…");
  try {
    const { data, error } = await stRedeemCall(code);
    if (error?.stale) return say("We couldn’t reach the server just now. Check your connection and try again.");
    if (error) throw error;
    if (data === "ok") {
      await founderRefreshEntitlement();
      say("✓ " + stCodeWelcome() + " Opening your account…");
      stCodeReload(stCodeWelcome());
    } else if (data === "limit") say("Too many tries. Please wait an hour and try again.");
    else if (data === "used") say("That code has already been used up.");
    else say("That code didn't work. Check it and try again.");
  } catch (e) {
    say("Could not check the code right now. Please try again.");
  }
}
/* After a code unlocks a plan, reload once so every screen, menu and tool opens with the new plan. */
function stBootForce(text) {
  window.__stBootDoneFor = null;
  document.body.classList.remove("stBooting");
  document.getElementById("stBoot")?.remove();
  stBootBegin(text);
}
function stCodeReload(msg) {
  window.__stReloading = true;
  try { sessionStorage.setItem("scaleTellCodeToast", msg || ""); } catch (e) {}
  try { closePanel(); } catch (e) {}
  stBootForce("Setting up your account…");
  setTimeout(() => location.reload(), 250);
}
setTimeout(() => {
  try {
    const m = sessionStorage.getItem("scaleTellCodeToast");
    if (m) { sessionStorage.removeItem("scaleTellCodeToast"); setTimeout(() => stToast(m), 2500); }
  } catch (e) {}
}, 0);
function stPlanChecking() {
  return !!(cloudSession && !stAccessChecked);
}
function updateAuthGate() {
  document.body.classList.toggle("planChecking", stPlanChecking());
  if (cloudSession && !stAccessChecked && window.__stBootDoneFor !== cloudSession.user.id) stBootBegin("Setting up your account…");
  const gate = document.getElementById("authGate"),
    body = document.getElementById("authGateBody");
  if (!gate || !body) return;
  const owner = localStorage.getItem("scaleTellSyncOwner33");
  const accountMismatch = !!(cloudSession && owner && owner !== cloudJournalUid() && cloudHasLocal());
  const needsAccess = !!(
    cloudAuthReady &&
    cloudSession &&
    !cloudRecovery &&
    !accountMismatch &&
    stAccessChecked &&
    !stAccessFailed &&
    !stCanUseApp()
  );
  const show = !(cloudAuthReady && cloudSession && !cloudRecovery && !accountMismatch) || needsAccess;
  gate.hidden = !show;
  document.body.classList.toggle("authLocked", show);
  if (!show) return;
  if (needsAccess) {
    if (document.getElementById("sheet")?.classList.contains("on")) closePanel();
    let pendCode = "";
    try { pendCode = localStorage.getItem("scaleTellPendingCode") || ""; } catch (e) {}
    if (pendCode && !stPendingCodeTried) {
      if (!document.getElementById("codeApplying")) { body.innerHTML = '<div id="codeApplying"><h1>Welcome ♡</h1><p class="authIntro">Setting up your account… one moment.</p></div>'; if (!document.getElementById("stBoot")) stBootForce("Setting up your account…"); }
      setTimeout(stRedeemPendingCode, 0);
      return;
    }
    if (!document.getElementById("accessGate")) {
      setTimeout(stRedeemPendingCode, 0);
      body.innerHTML = accessGateMarkup();
      setTimeout(founderMountPayPal, 0);
    }
    return;
  }
  if (cloudRecovery) {
    body.innerHTML =
      '<h1>Choose a new password ♡</h1><p class="authIntro">Finish resetting your Scale & Tell password.</p><label class="authField" for="cloudNewPassword">New password</label><input id="cloudNewPassword" type="password" autocomplete="new-password" minlength="8" placeholder="At least 8 characters"><button class="authButton" onclick="cloudUpdatePassword()">Save new password</button>' + (cloudSession ? '<button class="authButton light" onclick="cloudRecovery=false;authMode=\'signin\';updateAuthGate()">Cancel</button>' : '') + '<p class="authMessage" id="cloudStatus" role="status"></p>';
    return;
  }
  if (cloudAuthReady && accountMismatch) {
    body.innerHTML =
      '<h1>Different account ♡</h1><p class="authIntro">You’re signed in as <b>' + esc(cloudSession?.user?.email || "another account") + '</b>, but this device holds the journal for a different Scale &amp; Tell account. To keep both journals safe, nothing was mixed or changed.</p><p class="authSupport">Tap below, then sign in with the account you normally use on this device. To use this account here instead, open Scale &amp; Tell in a private window.</p><button class="authButton" onclick="cloudSignOut()">Sign out of ' + esc(cloudSession?.user?.email || "this account") + '</button><p class="authMessage" id="cloudStatus" role="status"></p>';
    return;
  }
  if (!cloudAuthReady) {
    body.innerHTML = '<h1>Scale & Tell ♡</h1><p class="authIntro">Checking your saved sign-in…</p>';
    return;
  }
  if (!cloudClient) {
    body.innerHTML =
      '<h1>Scale & Tell ♡</h1><p class="authIntro">Unable to connect to sign-in right now. Please check your connection and reload.</p><button class="authButton light" onclick="location.reload()">Retry connection</button>' +
      authGuestActions() +
      '<p class="authMessage" id="cloudStatus" role="status"></p>';
    return;
  }
  if (cloudPendingEmail || authMode === "email") {
    body.innerHTML =
      '<h1>Check your email ♡</h1><p class="authIntro">We sent a confirmation link to <b>' +
      esc(cloudPendingEmail || "your address") +
      '</b>. Open it to activate your account, then come back and sign in.</p><button class="authButton" onclick="cloudBackToSignIn()">Back to Sign In</button><button class="authButton light" onclick="cloudResendConfirmation()">Resend confirmation email</button><p class="authSupport">If the email opens Scale & Tell in a different browser, simply sign in there with the same account. Your records will follow after syncing.</p><p class="authMessage" id="cloudStatus" role="status"></p>';
    return;
  }
  const reset = authMode === "reset",
    signup = authMode === "signup";
  body.innerHTML =
    "<h1>" +
    (reset ? "Reset your password" : signup ? "Create your keeper account" : "Welcome to Scale & Tell ♡") +
    '</h1><p class="authTagline">EVERY SCALE. EVERY SHED. EVERY MILESTONE.</p><p class="authIntro">' +
    (reset
      ? "Enter your email and we’ll send a secure reset link."
      : signup
        ? "One private account for your animals, photos and care history."
        : "Your animals. Their stories. All in one beautiful place.") +
    "</p>" +
    '<label class="authField" for="cloudEmail">Email</label><input type="email" id="cloudEmail" autocomplete="email" placeholder="you@example.com" autocapitalize="none" spellcheck="false">' +
    (reset
      ? ""
      : '<label class="authField" for="cloudPassword">Password</label><input type="password" id="cloudPassword" autocomplete="' +
        (signup ? "new-password" : "current-password") +
        '" minlength="8" placeholder="' +
        (signup ? "At least 8 characters" : "Enter your password") +
        '"><label class="authStay"><input type="checkbox" id="cloudStay" ' +
        (authStayEnabled() ? "checked" : "") +
        "><span>Keep me signed in on this device</span></label>" +
        (signup
          ? '<label class="authField" for="signupMemberCode">Member or promo code (optional)</label><input id="signupMemberCode" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="40" placeholder="Leave blank if you don&#39;t have one"><label class="authStay"><input type="checkbox" id="signupUpdates" checked><span>Email me about app updates and new features. Unsubscribe anytime.</span></label><p class="authMessage" style="font-size:12px">By creating an account you agree to the <a href="./terms.html" target="_blank" rel="noopener">Terms of Use</a> and <a href="./privacy.html" target="_blank" rel="noopener">Privacy Policy</a>.</p>'
          : "")) +
    (reset
      ? '<button class="authButton" onclick="cloudResetEmail()">Send reset link</button><button class="authButton light" onclick="authChooseMode(\'signin\')">Back to Sign In</button>'
      : signup
        ? '<button class="authButton" onclick="authCreate()">Create Account</button><button class="authButton light" onclick="authChooseMode(\'signin\')">Already registered? Sign In</button>'
        : '<button class="authButton" onclick="authLogin()">Sign In</button><div class="authMeta"><button class="authLink" onclick="authChooseMode(\'signup\')">Create Account</button><button class="authLink" onclick="authChooseMode(\'reset\')">Forgot Password?</button></div>') +
    '<p id="cloudStatus" class="authMessage" role="status"></p>' +
    authGuestActions() +
    (!reset && !signup && landingFirstVisit() ? landingBottom() : "");
  if (!reset && !signup && landingFirstVisit()) body.insertAdjacentHTML("afterbegin", landingTop());
}
function authGuestActions() {
  return '<div class="authDivider">Browse without an account</div><button class="authButton outline" onclick="authGuestGuides()">Explore Our Care Guides</button><a class="authFacebook" href="https://www.facebook.com/share/g/1HxUA4zXkr/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"><span class="fbGlyph" aria-hidden="true">f</span>Join Our Facebook Community ↗</a><p class="authSupport">Viewing guides is free. Sign in to keep personal care records synced across devices.</p>';
}

/* V3.6, one-time reviewed migration for two pre-existing collections.
   Nothing is written until preview + explicit final confirmation. */
let cloudMergeDraft = null;
function mergeStable(value) {
  if (Array.isArray(value)) return value.map(mergeStable);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .filter((k) => !["id", "createdAt", "updatedAt"].includes(k))
        .map((k) => [k, mergeStable(value[k])]),
    );
  return value;
}
function mergeExact(e) {
  return JSON.stringify(mergeStable(e));
}
function mergeAnchor(e) {
  return [e.animal || "", e.section || "", e.date || "", e.detail || ""].join("\u001f");
}
function mergeUnionEntries(local, remote) {
  let result = (local || []).map((x) => structuredClone(x)),
    exact = new Set(result.map(mergeExact)),
    anchors = new Map();
  result.forEach((e) => {
    let k = mergeAnchor(e);
    if (!anchors.has(k)) anchors.set(k, []);
    anchors.get(k).push(e);
  });
  let duplicate = 0,
    ambiguous = 0,
    added = 0,
    overlaps = [];
  for (let entry of remote || []) {
    let sig = mergeExact(entry);
    if (exact.has(sig)) {
      duplicate++;
      continue;
    }
    let same = anchors.get(mergeAnchor(entry)) || [];
    if (same.length) {
      ambiguous++;
      if (overlaps.length < 12)
        overlaps.push({ animal: entry.animal, section: entry.section, date: entry.date, detail: entry.detail });
    }
    // Preserve distinct data on both sides, including notes and completion differences.
    // An anchor match is a REVIEW CANDIDATE, never permission to delete a record.
    let copy = structuredClone(entry);
    result.push(copy);
    added++;
    exact.add(sig);
    let k = mergeAnchor(copy);
    if (!anchors.has(k)) anchors.set(k, []);
    anchors.get(k).push(copy);
  }
  return { result, duplicate, ambiguous, added, overlaps };
}
function mergeGallery(local, remote) {
  let result = (local || []).map((x) => structuredClone(x)),
    seen = new Set(result.map((x) => photoKey(x)));
  let added = 0,
    duplicate = 0;
  for (let photo of remote || []) {
    let key = photoKey(photo);
    if (seen.has(key)) {
      duplicate++;
      continue;
    }
    result.push(structuredClone(photo));
    seen.add(key);
    added++;
  }
  return { result, added, duplicate };
}
function mergeValueMap(local, remote, prefer) {
  let result = structuredClone(remote || {});
  for (let [k, v] of Object.entries(local || {}))
    if (prefer === "browser" || !Object.prototype.hasOwnProperty.call(result, k)) result[k] = structuredClone(v);
  return result;
}
function cloudBuildMerge(local, remote, prefer) {
  return syncMergeV2(local, remote);
}
function cloudBuildMergeLegacy(local, remote, prefer) {
  let out = structuredClone(local),
    warnings = [],
    stats = { addedRecords: 0, duplicateRecords: 0, ambiguousRecords: 0, addedPhotos: 0, duplicatePhotos: 0 };
  out.roster = {
    animals: [...new Set([...(local.roster?.animals || []), ...(remote.roster?.animals || [])])],
    species: mergeValueMap(local.roster?.species, remote.roster?.species, prefer),
  };
  if (out.roster.animals.length > 500)
    throw Error("Combined animal roster exceeds the current 500-animal limit. Nothing was changed.");
  const e = mergeUnionEntries(local.entries, remote.entries, prefer);
  out.entries = e.result;
  stats.addedRecords = e.added;
  stats.duplicateRecords = e.duplicate;
  stats.ambiguousRecords = e.ambiguous;
  out.photos = {};
  for (let a of new Set([...Object.keys(local.photos || {}), ...Object.keys(remote.photos || {})])) {
    let g = mergeGallery(local.photos?.[a], remote.photos?.[a]);
    out.photos[a] = g.result;
    stats.addedPhotos += g.added;
    stats.duplicatePhotos += g.duplicate;
    if (g.result.length > 100) throw Error("Too many combined photos for " + a + ". Nothing was changed.");
  }
  for (let field of [
    "profiles",
    "carePlans",
    "socialLinks",
    "savedVet",
    "profilePhotos",
    "notificationPrefs",
    "sitterSettings",
  ])
    out[field] = mergeValueMap(local[field], remote[field], prefer);
  // Never discard a keeper-selected profile photo simply because its gallery came from the other source.
  for (let a of Object.keys(out.profilePhotos || {})) {
    let selected = out.profilePhotos[a],
      has = (out.photos[a] || []).some((p) => photoKey(p) === selected);
    if (!has) {
      let fallback = [local.profilePhotos?.[a], remote.profilePhotos?.[a]].find((k) =>
        (out.photos[a] || []).some((p) => photoKey(p) === k),
      );
      if (fallback) out.profilePhotos[a] = fallback;
      else delete out.profilePhotos[a];
    }
  }
  let d1 = local.devices || [],
    d2 = remote.devices || [],
    deviceSet = new Set();
  out.devices = [];
  for (let device of prefer === "browser" ? [...d1, ...d2] : [...d2, ...d1]) {
    let id = String(device.id || JSON.stringify(mergeStable(device)));
    if (deviceSet.has(id)) continue;
    deviceSet.add(id);
    out.devices.push(structuredClone(device));
  }
  out.archived = [
    ...new Map([...(remote.archived || []), ...(local.archived || [])].map((x) => [x.name, x])).values(),
  ].filter((a) => !out.roster.animals.includes(a.name));
  out.deletedRecords = [
    ...new Map(
      [...(remote.deletedRecords || []), ...(local.deletedRecords || [])].map((x) => [mergeExact(x), x]),
    ).values(),
  ].slice(-30);
  if (e.ambiguous)
    warnings.push(
      e.ambiguous +
        " possible overlap(s) share the same animal, activity, date and description but differ in their saved details. Both versions remain in the combined preview so nothing unique is lost. Review them in Care Logs afterward: " +
        e.overlaps.map((x) => x.animal + " · " + x.section + " · " + x.date + " · " + x.detail).join("; "),
    );
  if (out.entries.length > 10000) throw Error("Combined care record count is too large. Nothing was changed.");
  out.format = "scale-and-tell-cloud";
  out.version = 1;
  return { payload: out, stats, warnings };
}
/* Routine cloud reconciliation is automatic only if it can be proved lossless.
   Different edits to the same field, uncertain duplicate rows and deletions still need review. */
function cloudSafeAutoPlan(local, remote) {
  try {
    return { safe: true, plan: syncMergeV2(local, remote) };
  } catch (e) {
    return { safe: false, reason: e?.message || "merge limit reached" };
  }
}
function cloudSafeAutoPlanLegacy(local, remote) {
  const plan = cloudBuildMerge(local, remote, "browser");
  if (plan.stats.ambiguousRecords) return { safe: false, reason: "overlapping entries need review" };
  const same = (a, b) => JSON.stringify(mergeStable(a)) === JSON.stringify(mergeStable(b));
  // Two copies of the same record ID edited differently are a conflict even if
  // date/activity/description changed and the weaker anchor no longer matches.
  const localIds = new Map((local.entries || []).filter((e) => e.id != null).map((e) => [String(e.id), e]));
  for (const entry of remote.entries || [])
    if (entry.id != null && localIds.has(String(entry.id)) && !same(localIds.get(String(entry.id)), entry))
      return { safe: false, reason: "the same care record was changed differently" };
  const maps = [
    ["roster.species", local.roster?.species, remote.roster?.species],
    ...["profiles", "carePlans", "socialLinks", "savedVet", "profilePhotos", "notificationPrefs", "sitterSettings"].map(
      (k) => [k, local[k], remote[k]],
    ),
  ];
  for (const [name, l, r] of maps)
    for (const k of Object.keys(l || {})) {
      if (Object.prototype.hasOwnProperty.call(r || {}, k) && !same(l[k], r[k]))
        return { safe: false, reason: "conflicting " + name + " for " + k };
    }
  const localDevices = new Map((local.devices || []).map((d) => [String(d.id || JSON.stringify(mergeStable(d))), d]));
  for (const d of remote.devices || []) {
    const id = String(d.id || JSON.stringify(mergeStable(d)));
    if (localDevices.has(id) && !same(localDevices.get(id), d)) return { safe: false, reason: "conflicting device" };
  }
  const localArchive = new Map((local.archived || []).map((d) => [d.name, d]));
  for (const d of remote.archived || [])
    if (localArchive.has(d.name) && !same(localArchive.get(d.name), d))
      return { safe: false, reason: "conflicting archive" };
  // A deletion made in one browser must never be undone by an older browser's union.
  if (!same(local.deletedRecords || [], remote.deletedRecords || []))
    return { safe: false, reason: "deleted-record history differs" };
  if (!same(local.archived || [], remote.archived || []) && (local.archived?.length || remote.archived?.length))
    return { safe: false, reason: "archive histories differ" };
  return { safe: true, plan };
}
let cloudAutoMergeAttempt = "",
  cloudConfirmedRevision = 0,
  cloudConfirmedAt = 0;
function cloudConfirmRemote(rev) {
  cloudConfirmedRevision = Number(rev) || 0;
  cloudConfirmedAt = Date.now();
}
async function cloudTryLosslessAutoMerge(user, remote, mode) {
  if (!remote || cloudAutoBusy || !cloudSession || user.id !== cloudJournalUid()) return false;
  // Do not re-download all photo galleries every polling tick when human review is required.
  const attempt = [user.id, mode, remote.revision, cloudLocalRev(), cloudAutoGeneration].join(":");
  if (cloudAutoMergeAttempt === attempt) return false;
  cloudAutoMergeAttempt = attempt;
  cloudAutoBusy = true;
  try {
    cloudSetStatus("checking", "Checking both copies for a safe automatic merge…");
    const generation = cloudAutoGeneration,
      local = cloudMakeLocalSnapshot(),
      fingerprint = JSON.stringify(local);
    const full = await cloudHydratePayload(user, remote.payload);
    const evaluation = cloudSafeAutoPlan(local, full);
    if (!evaluation.safe) {
      cloudSetStatus(
        mode === "first" ? "choose" : "conflict",
        "Different edits need a one-time review. Both browser and account copies are intact.",
      );
      return false;
    }
    if (generation !== cloudAutoGeneration || fingerprint !== JSON.stringify(cloudMakeLocalSnapshot())) {
      cloudSetStatus("pending");
      return false;
    }
    const payload = await cloudPreparePayload(user.id, evaluation.plan.payload);
    if (generation !== cloudAutoGeneration || fingerprint !== JSON.stringify(cloudMakeLocalSnapshot())) {
      cloudSetStatus("pending");
      return false;
    }
    const { data, error } = await cloudSaveRpc({
      p_expected_revision: Number(remote.revision),
      p_schema_version: 1,
      p_payload: payload,
    });
    if (error) throw error;
    const saved = Array.isArray(data) ? data[0] : data;
    if (!saved?.saved) {
      cloudSetStatus("pending", "Cloud changed while syncing; checking again without replacing either copy.");
      cloudAutoMergeAttempt = "";
      return false;
    }
    const newRev = Number(saved.new_revision);
    cloudRow = { revision: newRev, updated_at: new Date().toISOString(), payload };
    if (generation !== cloudAutoGeneration || fingerprint !== JSON.stringify(cloudMakeLocalSnapshot())) {
      cloudAutoDirty = true;
      localStorage.setItem(CLOUD_DIRTY_KEY, "1");
      cloudSetStatus("pending", "Newer changes were made during the sync. Both are retained; reconciling again.");
      cloudAutoMergeAttempt = "";
      return false;
    }
    cloudPauseWrites = true;
    try {
      cloudApplyLocalSnapshot(evaluation.plan.payload);
      cloudSetOwner(user.id, newRev);
    } finally {
      cloudPauseWrites = false;
    }
    cloudRemoteWaiting = null;
    cloudConfirmRemote(newRev);
    cloudSetStatus("synced", "✓ Both collections safely combined in your account.");
    location.reload();
    return true;
  } catch (e) {
    cloudSetStatus("error");
    cloudReportError(e);
    return false;
  } finally {
    cloudAutoBusy = false;
  }
}
function cloudMergeCountPreview() {
  if (!cloudMergeDraft) return null;
  return cloudBuildMerge(cloudMergeDraft.local, cloudMergeDraft.remote, cloudMergeDraft.prefer);
}
function cloudMergeSelect(v) {
  if (!cloudMergeDraft || !["browser", "cloud"].includes(v)) return;
  cloudMergeDraft.prefer = v;
  if (current === "Cloud Account") render();
}
function cloudCancelMerge() {
  cloudMergeDraft = null;
  cloudSetStatus(cloudAutoDirty ? "conflict" : "choose");
}
async function cloudPreviewMerge() {
  if (cloudAutoBusy || !cloudSession) return;
  cloudAutoBusy = true;
  try {
    let { user, remote } = await cloudFetchState();
    if (!remote) throw Error("Account copy is missing. Nothing has changed.");
    cloudMsg("Preparing the comparison, including private photos…");
    let full = await cloudHydratePayload(user, remote.payload);
    let local = cloudMakeLocalSnapshot();
    let fingerprint = JSON.stringify(local);
    cloudMergeDraft = {
      uid: user.id,
      revision: Number(remote.revision),
      local,
      remote: full,
      fingerprint,
      prefer: "browser",
    };
    cloudBuildMerge(local, full, "browser");
    cloudSetStatus("merge-review");
  } catch (e) {
    cloudMergeDraft = null;
    cloudSetStatus("error");
    cloudReportError(e);
  } finally {
    cloudAutoBusy = false;
  }
}
async function cloudConfirmMerge() {
  let draft = cloudMergeDraft;
  if (!draft || cloudAutoBusy || !cloudSession) return;
  if (!document.getElementById("mergeSavedCopy")?.checked) {
    cloudMsg("First export this browser and save its JSON file to Files/iCloud, then check the confirmation box.");
    return;
  }
  const currentPlan = cloudMergeCountPreview();
  if (currentPlan?.stats.ambiguous && !document.getElementById("mergeOverlapAck")?.checked) {
    cloudMsg("Review the possible overlaps and acknowledge that both distinct versions will be retained.");
    return;
  }
  if (JSON.stringify(cloudMakeLocalSnapshot()) !== draft.fingerprint) {
    cloudMsg("This browser has changed since the preview. Reopen the comparison before merging.");
    return;
  }
  const plan = cloudMergeCountPreview();
  if (!plan) return;
  if (
    !confirm(
      "Merge two collections for " +
        (cloudSession.user?.email || "this account") +
        "?\n\nThe combined copy will include " +
        cloudSummaryText(cloudRemoteSummary(plan.payload)) +
        ".\n\nMatching records with different details use your selected preference. Your source browser will not be erased if the cloud save fails. Continue?",
    )
  )
    return;
  cloudAutoBusy = true;
  let cloudCommitted = false;
  try {
    const user = await cloudAuthorizedUser();
    if (user.id !== draft.uid) throw Error("Signed-in account changed; no data was uploaded.");
    let { data: remote, error } = await cloudClient
      .from("keeper_state")
      .select("revision")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw error;
    if (!remote || Number(remote.revision) !== draft.revision)
      throw Error("Cloud records changed during review. Reopen the comparison. Nothing was replaced.");
    let payload = await cloudPreparePayload(user.id, plan.payload);
    let { data, error: saveError } = await cloudSaveRpc({
      p_expected_revision: draft.revision,
      p_schema_version: 1,
      p_payload: payload,
    });
    if (saveError) throw saveError;
    let result = Array.isArray(data) ? data[0] : data;
    if (!result?.saved)
      throw Error("Another browser saved first. Your collections were preserved. Reopen the comparison.");
    cloudCommitted = true;
    // The server accepted this exact reviewed snapshot, then and only then replace local state.
    cloudPauseWrites = true;
    try {
      cloudApplyLocalSnapshot(plan.payload);
      cloudSetOwner(user.id, Number(result.new_revision));
    } finally {
      cloudPauseWrites = false;
    }
    cloudRow = { revision: Number(result.new_revision), updated_at: new Date().toISOString(), payload };
    cloudMergeDraft = null;
    cloudSetStatus("synced");
    alert("Your collections were combined and saved to your private account. The app will reload now.");
    location.reload();
  } catch (e) {
    cloudMergeDraft = null;
    cloudSetStatus("error");
    cloudReportError(e);
    if (cloudCommitted)
      cloudMsg(
        "The combined cloud copy WAS saved, but this browser could not load it. Refresh and check your account. Do not clear browser records.",
      );
  } finally {
    cloudAutoBusy = false;
  }
}
function cloudMergeMarkup() {
  let d = cloudMergeDraft;
  if (!d) return '<p class="notice">Review expired. Reopen the comparison.</p>';
  let plan;
  try {
    plan = cloudMergeCountPreview();
  } catch (e) {
    return (
      '<div class="cloudWarn">' +
      esc(e.message) +
      '</div><button class="action secondary" onclick="cloudCancelMerge()">Back</button>'
    );
  }
  const count = cloudRemoteSummary(plan.payload);
  return (
    '<div class="cloudMergeSummary"><h3>Review combined records ♡</h3><p><b>This browser:</b> ' +
    esc(cloudSummaryText(cloudRemoteSummary(d.local))) +
    "</p><p><b>Your account:</b> " +
    esc(cloudSummaryText(cloudRemoteSummary(d.remote))) +
    "</p><p><b>Combined preview:</b> " +
    esc(cloudSummaryText(count)) +
    '</p><p class="muted">' +
    plan.stats.addedRecords +
    " account-only care entries added · " +
    plan.stats.duplicateRecords +
    " exact duplicate entries skipped · " +
    plan.stats.addedPhotos +
    " account-only photos added · " +
    plan.stats.duplicatePhotos +
    ' duplicate photos skipped.</p><label>When the same record or animal detail differs, keep:<select aria-label="Preferred version for overlapping records" onchange="cloudMergeSelect(this.value)"><option value="browser" ' +
    (d.prefer === "browser" ? "selected" : "") +
    '>This browser\'s version</option><option value="cloud" ' +
    (d.prefer === "cloud" ? "selected" : "") +
    ">My account's version</option></select></label>" +
    (plan.warnings.length ? '<p class="cloudWarn">' + esc(plan.warnings.join(" ")) + "</p>" : "") +
    '<p class="muted">Exact duplicates are skipped. Unique care entries and photos from both sources are retained. This is a one-time recovery operation, not an everyday sync step.</p><button class="action secondary" onclick="exportBackup()">Export this browser before merging</button><label><input type="checkbox" id="mergeSavedCopy">I saved my browser export outside this app</label>' +
    (plan.stats.ambiguous
      ? '<label><input type="checkbox" id="mergeOverlapAck">I understand that ' +
        plan.stats.ambiguous +
        " possible overlap(s) are kept separately for later review</label>"
      : "") +
    '<button class="action" onclick="cloudConfirmMerge()">Combine and save to my account</button><button class="action secondary" onclick="cloudCancelMerge()">Not now</button></div>'
  );
}

function cloudAccountMarkup() {
  if (!cloudInitialized)
    return '<div class="cloudPane"><h3>My Account ♡</h3><p class="cloudSafe" role="status">Connecting…</p></div>';
  if (!cloudClient)
    return '<div class="cloudPane"><h3>My Account ♡</h3><p class="cloudWarn" role="status">Could not connect. Please try again.</p></div>';
  if (!cloudSession && cloudPendingEmail)
    return '<div class="cloudPane"><h3>Check your email ♡</h3><p>Open your confirmation link, then come back and sign in.</p><button class="action" onclick="cloudBackToSignIn()">Back to Sign In</button><button class="action secondary" onclick="cloudResendConfirmation()">Resend email</button><p id="cloudStatus" role="status"></p></div>';
  if (!cloudSession)
    return '<div class="cloudPane"><h3>My Account ♡</h3><p>Sign in to save your reptile journal across devices.</p><button class="action" onclick="authChooseMode(\'signin\')">Sign in</button></div>';
  let state = cloudAutoStatus;
  let label =
    state === "synced" || state === "empty"
      ? "✓ Synced to account · revision " + cloudLocalRev()
      : state === "saving" || state === "checking"
        ? "Syncing…"
        : state === "pending"
          ? "Waiting to sync…"
          : state === "migration"
            ? "Finish setting up your account"
            : state === "choose" || state === "conflict" || state === "merge-review"
              ? "We found changes to review"
              : state === "other-user"
                ? "Please check your account"
                : state === "remote-ready"
                  ? "New changes are ready"
                  : state === "error"
                    ? "Could not save. Try again."
                    : "Connecting…";
  let action = "";
  if (state === "migration")
    action =
      '<p>You already have a journal in this browser. Add it to your account to keep using it across devices.</p><button class="action" onclick="cloudBeginMigration()">Keep my existing journal</button>';
  if (state === "choose" || state === "conflict")
    action =
      '<p>Your journal has changes from two places. We kept both safe. Review them together before saving.</p><button class="action" onclick="cloudPreviewMerge()">Review changes</button>';
  if (state === "merge-review") action = cloudMergeMarkup();
  if (state === "remote-ready")
    action = '<button class="action" onclick="cloudApplyWaiting()">Continue with latest changes</button>';
  if (state === "other-user")
    action =
      "<p>This browser was previously used with another account. Please sign into that account to protect its journal.</p>";
  if (state === "error") action = '<button class="action secondary" onclick="cloudRefresh()">Try again</button>';
  const advanced =
    '<details class="compactDisclosure"><summary>Advanced</summary><p class="muted">Optional tools if you ever need them.</p><button class="action secondary" onclick="openPanel(\'Data & Backup\')">Backup & restore</button><button class="action secondary" onclick="cloudRefresh()">Check connection</button>' +
    (state === "choose" || state === "conflict"
      ? '<details class="compactDisclosure"><summary>Other recovery options</summary><button class="action secondary" onclick="exportBackup()">Download this browser’s backup</button><button class="action secondary" onclick="' +
        (state === "choose" ? "cloudChooseRemote()" : "cloudReviewConflict()") +
        '">Review using only account copy</button></details>'
      : "") +
    "</details>";
  return (
    '<div class="cloudPane"><h3>My Account ♡</h3><p class="muted">' +
    esc(cloudSession.user?.email || "Keeper") +
    '</p><p class="cloudSafe simpleSaveStatus" role="status"><b>' +
    esc(label) +
    "</b></p>" +
    action +
    stEmailPrefMarkup() +
    advanced +
    '<button class="action secondary" onclick="stPwOpen()">Change password</button><button class="action secondary" onclick="openPanel(\'Privacy & Account\')">Privacy & account options</button><button class="action secondary" onclick="cloudSignOut()">Sign out</button><p class="muted">' +
    (state === "synced" && cloudConfirmedAt
      ? "Cloud confirmed " +
        esc(
          new Date(cloudConfirmedAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
          }),
        )
      : "Offline or unresolved changes will stay on this browser until safely synced.") +
    '</p><p id="cloudStatus" class="helperLine" role="status"></p></div>'
  );
}

/* Clear, friendly reasons for the sign-in and sign-up problems people actually hit. */
function cloudFriendlyError(error) {
  const m = String(error?.message || error || ""), code = String(error?.code || "");
  if (/weak_password|known to be weak|easy to guess|pwned/i.test(code + " " + m))
    return /should contain|at least one character/i.test(m)
      ? "That password needs a lowercase letter, an UPPERCASE letter, a number and a symbol (like ! or #)."
      : "That password is on a list of common or leaked passwords. Please choose a different one. A few words mixed with numbers and a symbol works great.";
  if (/should contain|at least one character of each/i.test(m))
    return "That password needs a lowercase letter, an UPPERCASE letter, a number and a symbol (like ! or #).";
  if (/at least \d+ characters|password should be at least/i.test(m)) return "Use a password with at least 8 characters.";
  if (/invalid login credentials/i.test(m)) return "That email and password don’t match. Check for typos, or tap “Forgot Password?”.";
  if (/email not confirmed/i.test(m)) return "Please confirm your email first. Open the email from Scale & Tell and tap the link, then sign in.";
  if (/rate limit|too many|security purposes|after \d+ seconds/i.test(m)) return "Too many tries in a row. Please wait a minute, then try again.";
  if (/invalid.*email|unable to validate email|email address .* invalid/i.test(m)) return "That email address doesn’t look right. Please check it.";
  if (/already registered|already exists/i.test(m)) return "This email already has an account. Sign in, or tap “Forgot Password?”.";
  if (/failed to fetch|network|load failed/i.test(m)) return "Couldn’t reach Scale & Tell. Check your internet connection and try again.";
  return "";
}
function cloudReportError(error) {
  cloudMsg(cloudFriendlyError(error) || "That didn’t work. Please try again. Your existing journal has not been erased.");
}
async function cloudAuthorizedUser() {
  if (!cloudClient || !cloudSession) throw Error("Please sign in first.");
  let { data, error } = await cloudClient.auth.getUser();
  if (error || !data?.user) throw error || Error("Your sign-in has expired. Sign in again.");
  if (data.user.id !== cloudSession.user?.id) throw Error("Account changed. Refresh and sign in again.");
  // Team members work in the plan owner's journal: same records, photos and saves.
  const team = stTeamOwnerId();
  return team ? { ...data.user, id: team, realId: data.user.id } : data.user;
}
async function cloudSignUp() {
  if (cloudWorking) return;
  let email = document.getElementById("cloudEmail")?.value.trim(),
    password = document.getElementById("cloudPassword")?.value || "";
  if (!email || password.length < 8) {
    cloudMsg("Enter your email and a password with at least 8 characters.");
    return;
  }
  cloudWorking = true;
  cloudMsg("Creating your private keeper account…");
  try {
    let { data, error } = await cloudClient.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: location.origin + location.pathname },
    });
    if (error) throw error;
    if (!data.session && data.user && Array.isArray(data.user.identities) && !data.user.identities.length) {
      // This email already has an account: no new email is sent, so send them to sign in instead.
      authMode = "signin";
      updateAuthGate();
      render();
      const em = document.getElementById("cloudEmail");
      if (em) em.value = email;
      cloudMsg("This email already has an account. Sign in, or tap “Forgot Password?” to get a reset link.");
      return;
    }
    if (data.session) {
      cloudSession = data.session;
      cloudRow = null;
      updateAuthGate();
      render();
      cloudMsg(
        "Account created and signed in. Your browser records are not transferred without your first-time import approval.",
      );
      await cloudRefresh();
    } else {
      cloudPendingEmail = email;
      authMode = "email";
      updateAuthGate();
      render();
      cloudMsg("Check your inbox for the confirmation message. Nothing was uploaded.");
    }
  } catch (e) {
    cloudReportError(e);
  } finally {
    cloudWorking = false;
  }
}
function cloudBackToSignIn() {
  cloudPendingEmail = "";
  authMode = "signin";
  updateAuthGate();
  render();
  cloudMsg("You can sign in after confirming your email.");
}
async function cloudResendConfirmation() {
  if (cloudWorking || !cloudPendingEmail) return;
  cloudWorking = true;
  cloudMsg("Requesting a new confirmation email…");
  try {
    let { error } = await cloudClient.auth.resend({
      type: "signup",
      email: cloudPendingEmail,
      options: { emailRedirectTo: location.origin + location.pathname },
    });
    if (error) throw error;
    cloudMsg("If confirmation is still needed, check your inbox for the new message.");
  } catch (e) {
    cloudReportError(e);
  } finally {
    cloudWorking = false;
  }
}
async function cloudSignIn() {
  if (cloudWorking) return;
  let email = document.getElementById("cloudEmail")?.value.trim(),
    password = document.getElementById("cloudPassword")?.value || "";
  if (!email || !password) {
    cloudMsg("Enter both your email and password.");
    return;
  }
  cloudWorking = true;
  cloudMsg("Signing in…");
  try {
    let { data, error } = await cloudClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    cloudSession = data.session;
    cloudPendingEmail = "";
    cloudRow = null;
    updateAuthGate();
    render();
    await cloudRefresh();
  } catch (e) {
    cloudReportError(e);
  } finally {
    cloudWorking = false;
  }
}
async function cloudResetEmail() {
  let email = document.getElementById("cloudEmail")?.value.trim();
  if (!email) {
    cloudMsg("Enter your email address first.");
    return;
  }
  try {
    let { error } = await cloudClient.auth.resetPasswordForEmail(email, {
      redirectTo: location.origin + location.pathname,
    });
    if (error) throw error;
    cloudMsg("If the address has an account, a reset email will arrive. Open the link to set your new password.");
  } catch (e) {
    cloudReportError(e);
  }
}
async function cloudUpdatePassword() {
  let password = document.getElementById("cloudNewPassword")?.value || "";
  if (password.length < 8) {
    cloudMsg("Use at least 8 characters.");
    return;
  }
  try {
    let { error } = await cloudClient.auth.updateUser({ password });
    if (error) throw error;
    cloudRecovery = false;
    authMode = "signin";
    updateAuthGate();
    render();
    cloudMsg("Password updated.");
    stToast("Password updated ♡ Use your new password next time you sign in.");
  } catch (e) {
    cloudReportError(e);
  }
}
async function cloudSignOut() {
  if (cloudWorking) return;
  if (cloudAutoDirty || cloudAutoStatus === "pending" || cloudAutoStatus === "conflict") {
    cloudMsg("Changes must finish syncing or be reviewed before you sign out. Nothing was deleted.");
    return;
  }
  const userId = cloudJournalUid(),
    owner = localStorage.getItem("scaleTellSyncOwner33");
  if (owner === userId && cloudHasLocal()) {
    if (!cloudRow || Number(cloudRow.revision) !== cloudLocalRev()) {
      cloudMsg("Please verify your saved cloud copy before signing out. No records were deleted.");
      return;
    }
    if (
      !confirm(
        "Sign out? Your account copy is saved in the cloud. The signed-in cache on THIS browser will be cleared to protect your privacy. Continue?",
      )
    )
      return;
  } else if (!confirm("Sign out of Scale & Tell?")) return;
  try {
    cloudMsg("Signing out…");
    // Turn off this device's phone reminders first, but never let that block signing out
    // (Safari tabs have no push support, and a slow connection shouldn't trap anyone).
    try { await Promise.race([pushDisable(true), new Promise((ok) => setTimeout(() => ok(false), 4000))]); } catch (e) {}
    let { error } = await cloudClient.auth.signOut();
    if (error) {
      const r = await cloudClient.auth.signOut({ scope: "local" });
      if (r.error) throw r.error;
    }
    if (owner === userId) {
      cloudPauseWrites = true;
      try {
        for (let key of Object.keys(CLOUD_LOCAL_KEYS)) localStorage.removeItem(key);
        localStorage.removeItem("scaleTellSyncOwner33");
        localStorage.removeItem("scaleTellSyncRev33");
        localStorage.removeItem("scaleTellSyncDirty33");
      } finally {
        cloudPauseWrites = false;
      }
    }
    cloudSession = null;
    cloudRow = null;
    cloudAutoActive = false;
    cloudAutoStatus = "idle";
    location.reload();
  } catch (e) {
    cloudReportError(e);
  }
}
async function cloudRefresh() {
  return cloudAutoCheck();
}
function cloudDataBlob(src) {
  let m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(src || "");
  if (!m) throw Error("A photo has an unsupported data format. Export your local backup and check the gallery.");
  let binary = atob(m[2]),
    bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: m[1] });
}
function cloudBlobData(blob) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(Error("Could not read a cloud photo"));
    reader.readAsDataURL(blob);
  });
}
async function cloudPhotoPath(userId, src) {
  let blob = cloudDataBlob(src);
  let hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", await blob.arrayBuffer())))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  let ext = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
  return { path: userId + "/photos/" + hash + "." + ext, blob };
}
async function cloudEnsurePhoto(userId, src, cached) {
  let { path, blob } = await cloudPhotoPath(userId, src);
  if (cached.has(path)) return path;
  let { error } = await cloudClient.storage
    .from(CLOUD_BUCKET)
    .upload(path, blob, { upsert: true, contentType: blob.type, cacheControl: "3600" });
  if (error) throw error;
  cached.add(path);
  return path;
}
function cloudMakeLocalSnapshot() {
  return {
    format: "scale-and-tell-cloud",
    version: 1,
    roster: { animals: [...animals], species: structuredClone(species) },
    entries: structuredClone(entries),
    profiles: structuredClone(profiles),
    photos: structuredClone(photos),
    carePlans: structuredClone(carePlans),
    devices: structuredClone(devices),
    socialLinks: structuredClone(socialLinks),
    savedVet: structuredClone(savedVet),
    profilePhotos: structuredClone(profilePhotos),
    notificationPrefs: structuredClone(notificationPrefs),
    sitterSettings: structuredClone(sitterSettings),
    archived: JSON.parse(localStorage.getItem("scaleTellArchived10") || "[]"),
    deletedRecords: structuredClone(deletedRecords),
    tombstones: structuredClone(syncTombstones),
    stamps: structuredClone(syncStamps),
    accountPrefs: structuredClone(accountPrefs),
    racks: structuredClone(racks),
  };
}
async function cloudPreparePayload(userId, source = cloudMakeLocalSnapshot()) {
  let p = structuredClone(source),
    cached = new Set(),
    total =
      Object.values(p.photos).reduce((n, v) => n + (Array.isArray(v) ? v.length : 0), 0) +
      p.entries.filter((e) => typeof e.attachment === "string" && e.attachment.startsWith("data:image/")).length;
  let complete = 0;
  for (let [animal, gallery] of Object.entries(p.photos)) {
    if (!Array.isArray(gallery)) throw Error("Invalid gallery for " + animal);
    for (let item of gallery) {
      if (!item.src?.startsWith("data:image/"))
        throw Error("Local gallery photo is missing or invalid. Please save a backup before syncing.");
      item.cloudPath = await cloudEnsurePhoto(userId, item.src, cached);
      item.key = photoKey(item);
      delete item.src;
      complete++;
      cloudMsg("Uploading private photos: " + complete + " / " + total);
    }
  }
  for (let item of p.entries) {
    if (typeof item.attachment === "string" && item.attachment.startsWith("data:image/")) {
      item.attachmentPath = await cloudEnsurePhoto(userId, item.attachment, cached);
      delete item.attachment;
      complete++;
      cloudMsg("Uploading private photos: " + complete + " / " + total);
    }
  }
  let size = new TextEncoder().encode(JSON.stringify(p)).length;
  if (size > (homeBusinessMode() || stIsRescue() ? 24500000 : 4900000)) throw Error("This cloud snapshot is too large. Your browser records remain unchanged.");
  return p;
}
async function cloudUpload() {
  if (cloudWorking) return;
  let local = cloudLocalSummary(),
    remote = cloudRow ? cloudRemoteSummary(cloudRow.payload) : null;
  if (!local.animals && !local.records && !local.reminders && !local.photos) {
    cloudMsg(
      "This browser is empty. Nothing was uploaded. If your animals are stored in another browser or app window, open that original window and sign in there first.",
    );
    return;
  }
  let names = animals.length ? animals.join(", ") : "(no animals listed)";
  let msg =
    "Signed-in account: " +
    (cloudSession?.user?.email || "Keeper") +
    "\n\nANIMALS IN THIS BROWSER: " +
    names +
    "\n\nSave " +
    cloudSummaryText(local) +
    " to your PRIVATE cloud account? This can include Health & Vet details and saved contact fields.\n\n" +
    (cloudRow
      ? "This will replace the existing cloud snapshot (" +
        cloudSummaryText(remote) +
        ") only if its revision has not changed."
      : "This will create your first cloud snapshot.") +
    "\n\nIf these are not the animal names you expected, CANCEL and return to the browser with your original records. This browser stays untouched. Continue?";
  if (!confirm(msg)) return;
  cloudWorking = true;
  try {
    let user = await cloudAuthorizedUser();
    cloudMsg("Preparing private cloud copy. Do not close this tab…");
    let expected = cloudRow ? Number(cloudRow.revision) : 0;
    let payload = await cloudPreparePayload(user.id);
    let { data, error } = await cloudSaveRpc({
      p_expected_revision: expected,
      p_schema_version: 1,
      p_payload: payload,
    });
    if (error) throw error;
    let result = Array.isArray(data) ? data[0] : data;
    if (!result?.saved) {
      cloudMsg(
        "Cloud copy changed on another device. Nothing was overwritten. Refresh cloud status and review both copies before trying again.",
      );
      return;
    }
    await cloudRefresh();
    cloudMsg(
      "✓ Saved " +
        cloudSummaryText(local) +
        " to your private cloud. Revision " +
        Number(result.new_revision) +
        ". Local records remain on this device.",
    );
  } catch (e) {
    cloudReportError(e);
  } finally {
    cloudWorking = false;
  }
}
function cloudCheckPayload(p) {
  if (
    !p ||
    p.format !== "scale-and-tell-cloud" ||
    p.version !== 1 ||
    !p.roster ||
    !Array.isArray(p.roster.animals) ||
    p.roster.animals.length > 500 ||
    !p.roster.animals.every((a) => typeof a === "string" && a.length <= 50) ||
    !p.roster.species ||
    typeof p.roster.species !== "object" ||
    !Array.isArray(p.entries) ||
    p.entries.length > 10000 ||
    !p.entries.every(
      (e) =>
        e &&
        typeof e.animal === "string" &&
        typeof e.section === "string" &&
        typeof e.detail === "string" &&
        typeof e.date === "string" &&
        validDate(e.date),
    ) ||
    !p.photos ||
    typeof p.photos !== "object" ||
    Array.isArray(p.photos) ||
    !Object.values(p.photos).every(
      (g) =>
        Array.isArray(g) &&
        g.length <= 100 &&
        g.every(
          (photo) =>
            photo && typeof photo.cloudPath === "string" && typeof photo.caption === "string" && validDate(photo.date),
        ),
    )
  )
    throw Error("The cloud copy has an incompatible or invalid format. No local data was changed.");
}
async function cloudHydratePayload(user, p) {
  cloudCheckPayload(p);
  let next = structuredClone(p);
  let mediaCache = new Map();
  async function fetchPhoto(path) {
    if (!path.startsWith(user.id + "/photos/") || !/^[a-z0-9-/.]+$/.test(path))
      throw Error("Cloud photo path failed validation.");
    if (!mediaCache.has(path)) {
      let { data, error } = await cloudClient.storage.from(CLOUD_BUCKET).download(path);
      if (error || !data) throw error || Error("Could not download a photo.");
      mediaCache.set(path, await cloudBlobData(data));
    }
    return mediaCache.get(path);
  }
  let count = 0;
  for (let gallery of Object.values(next.photos)) {
    for (let item of gallery) {
      item.src = await fetchPhoto(item.cloudPath);
      count++;
      cloudMsg("Downloading private photos: " + count);
    }
  }
  for (let item of next.entries) {
    if (item.attachmentPath) {
      item.attachment = await fetchPhoto(item.attachmentPath);
      count++;
      cloudMsg("Downloading private photos: " + count);
    }
  }
  return next;
}
function cloudApplyLocalSnapshot(p) {
  p = syncPrepareIncoming(p);
  let pairs = Object.entries(CLOUD_LOCAL_KEYS).map(([key, field]) => [
    key,
    JSON.stringify(
      p[field] ??
        (field === "entries" || field === "devices" || field === "archived" || field === "deletedRecords" ? [] : {}),
    ),
  ]);
  // Remember old values so partial localStorage writes can be rolled back on failure.
  let old = pairs.map(([key]) => [key, localStorage.getItem(key)]);
  try {
    for (let [key, value] of pairs) localStorage.setItem(key, value);
  } catch (e) {
    try {
      for (let [key, value] of old) {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      }
    } catch (rollback) {
      alert(
        "Browser storage failed during restore and could not fully roll back. Keep your saved external JSON backup and do not clear this browser.",
      );
    }
    throw Error(
      "This browser could not store the full cloud snapshot. No intentional deletion was performed. " +
        (e?.message || ""),
    );
  }
  stThemeFromPrefs(p.accountPrefs);
}
/* V3.53 · The chosen app design follows the keeper to every device. */
function stThemeFromPrefs(prefs) {
  const v = prefs && prefs.theme;
  if (!ST_THEME_IDS.includes(v) || v === stSavedTheme) return;
  stSavedTheme = v;
  try { localStorage.setItem(ST_THEME_KEY, v); } catch (e) {}
  if (stPreviewTheme === null && (stCanUsePack() || stThemeCacheOk(stLastOwner()))) stSetTheme(v);
}
async function cloudRestore() {
  if (cloudWorking) return;
  if (!document.getElementById("cloudSavedBackup")?.checked) {
    cloudMsg("Save your existing local backup in Files/iCloud first, then check the box to continue.");
    return;
  }
  if (!cloudRow) {
    cloudMsg("Check cloud status first. There is no cloud copy to restore.");
    return;
  }
  let remote = cloudRemoteSummary(cloudRow.payload),
    local = cloudLocalSummary();
  let expected = Number(cloudRow.revision);
  if (
    !confirm(
      "Signed-in account: " +
        (cloudSession?.user?.email || "Keeper") +
        "\nREPLACE THIS BROWSER’S DATA?\n\nCloud: " +
        cloudSummaryText(remote) +
        "\nThis browser now: " +
        cloudSummaryText(local) +
        "\n\nThis is NOT a merge. The current browser copy will be replaced after all photos download. Only proceed after SAVING the local backup outside the app.",
    )
  )
    return;
  cloudWorking = true;
  try {
    let user = await cloudAuthorizedUser();
    let { data, error } = await cloudClient
      .from("keeper_state")
      .select("revision,payload")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw error;
    if (!data || Number(data.revision) !== expected)
      throw Error("The cloud copy changed since your last review. Refresh and compare before restoring.");
    cloudMsg("Downloading your private cloud data. Do not close the tab…");
    let payload = await cloudHydratePayload(user, data.payload);
    cloudApplyLocalSnapshot(payload);
    alert("Cloud copy restored to this browser. The app will reload now. Your remote cloud copy remains unchanged.");
    location.reload();
  } catch (e) {
    cloudReportError(e);
  } finally {
    cloudWorking = false;
  }
}

/* V3.3 automatic, revision-checked sync. Browser-local copy is the offline working copy.
   Existing browser data is NEVER silently sent as the first cloud copy. */
const CLOUD_OWNER_KEY = "scaleTellSyncOwner33",
  CLOUD_REV_KEY = "scaleTellSyncRev33",
  CLOUD_DIRTY_KEY = "scaleTellSyncDirty33";
const CLOUD_SYNC_FIELDS = new Set(Object.keys(CLOUD_LOCAL_KEYS));
let cloudAutoActive = false,
  cloudAutoStatus = "idle",
  cloudAutoDirty = false,
  cloudAutoBusy = false,
  cloudAutoCheckBusy = false,
  cloudAutoTimer = null,
  cloudAutoTimerTick = null,
  cloudAutoGeneration = 0,
  cloudRemoteWaiting = null,
  cloudPauseWrites = false,
  cloudSyncInitStarted = false;
function cloudSetStatus(status, msg) {
  cloudAutoStatus = status;
  if (status === "other-user") updateAuthGate();
  if (current === "Cloud Account") render();
  if (msg) cloudMsg(msg);
  const uid = cloudSession?.user?.id;
  if (
    (status === "empty" || (status === "synced" && !cloudHasLocal())) &&
    cloudAuthReady &&
    uid &&
    stCanUseApp() &&
    !animals.length &&
    !localStorage.getItem("scaleTellTourSeen35:" + uid) &&
    !window.__stReloading
  ) {
    // The tour keeps coming back (even after a refresh) until it's finished or skipped.
    setTimeout(() => {
      if (
        cloudSession?.user?.id === uid &&
        !window.__stReloading &&
        current !== "Welcome Tour" &&
        ["empty", "synced"].includes(cloudAutoStatus) &&
        !animals.length &&
        !localStorage.getItem("scaleTellTourSeen35:" + uid) &&
        !document.getElementById("sheet").classList.contains("on") &&
        !document.body.classList.contains("authLocked")
      ) {
        tourStep = 0;
        openPanel("Welcome Tour");
      }
    }, 300);
  }
}
function scaleStoreSet(key, value) {
  if (!cloudPauseWrites) syncStampWrite(key, value);
  localStorage.setItem(key, value);
  if (!cloudPauseWrites && CLOUD_SYNC_FIELDS.has(key)) cloudMarkDirty();
}
function cloudMarkDirty() {
  let owner = localStorage.getItem(CLOUD_OWNER_KEY);
  if (!owner) return;
  cloudAutoDirty = true;
  cloudAutoGeneration++;
  localStorage.setItem(CLOUD_DIRTY_KEY, "1");
  if (!cloudSession || cloudJournalUid() !== owner) {
    cloudSetStatus("pending");
    return;
  }
  cloudSetStatus("pending");
  cloudQueueSave();
}
function cloudQueueSave() {
  clearTimeout(cloudAutoTimer);
  if (!cloudAutoActive || !cloudAutoDirty || !cloudSession) return;
  cloudAutoTimer = setTimeout(() => cloudAutoSave(), 1100);
}
function cloudRemoteRev() {
  return cloudRow ? Number(cloudRow.revision) : 0;
}
function cloudLocalRev() {
  return Number(localStorage.getItem(CLOUD_REV_KEY) || "0");
}
function cloudHasLocal() {
  let s = cloudLocalSummary();
  return !!(s.animals || s.records || s.reminders || s.photos);
}
function cloudSetOwner(uid, rev) {
  localStorage.setItem(CLOUD_OWNER_KEY, uid);
  localStorage.setItem(CLOUD_REV_KEY, String(rev));
  localStorage.setItem(CLOUD_DIRTY_KEY, "0");
  cloudAutoDirty = false;
  cloudAutoActive = true;
  cloudConfirmRemote(rev);
}
async function cloudFetchState() {
  let user = await cloudAuthorizedUser();
  let { data, error } = await cloudClient
    .from("keeper_state")
    .select("revision,updated_at,payload,schema_version")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  cloudRow = data || null;
  return { user, remote: data || null };
}
async function cloudAutoCheck() {
  if (cloudMergeDraft || !cloudClient || !cloudSession || cloudAutoBusy || cloudAutoCheckBusy) return;
  cloudAutoCheckBusy = true;
  try {
    let { user, remote } = await cloudFetchState(),
      uid = user.id,
      owner = localStorage.getItem(CLOUD_OWNER_KEY),
      rev = cloudLocalRev(),
      remoteRev = remote ? Number(remote.revision) : 0;
    if (owner && owner !== uid) {
      if (cloudHasLocal()) {
        cloudAutoActive = false;
        cloudSetStatus("other-user");
        return;
      }
      localStorage.removeItem(CLOUD_OWNER_KEY);
      localStorage.removeItem(CLOUD_REV_KEY);
      localStorage.removeItem(CLOUD_DIRTY_KEY);
      owner = null;
    }
    if (!owner) {
      cloudAutoActive = false;
      if (cloudHasLocal()) {
        if (remote && (await cloudTryLosslessAutoMerge(user, remote, "first"))) return;
        if (["error", "pending"].includes(cloudAutoStatus)) return;
        cloudSetStatus(remote ? "choose" : "migration");
        return;
      }
      if (remote) {
        await cloudAutoLoad(user, remote, true);
        return;
      }
      cloudSetOwner(uid, 0);
      cloudSetStatus("empty");
      return;
    }
    cloudAutoActive = true;
    cloudAutoDirty = localStorage.getItem(CLOUD_DIRTY_KEY) === "1";
    if (cloudAutoDirty) {
      if (remoteRev !== rev) {
        if (remote && (await cloudTryLosslessAutoMerge(user, remote, "concurrent"))) return;
        if (["error", "pending"].includes(cloudAutoStatus)) return;
        cloudSetStatus("conflict");
        return;
      }
      cloudSetStatus("pending");
      cloudQueueSave();
      return;
    }
    if (remoteRev !== rev) {
      if (!remote) {
        cloudSetStatus("conflict", "Your cloud copy could not be found. Nothing was deleted.");
        return;
      }
      if (document.getElementById("sheet")?.classList.contains("on") && current !== "Cloud Account") {
        cloudRemoteWaiting = remote;
        cloudSetStatus("remote-ready");
        return;
      }
      await cloudAutoLoad(user, remote, false);
      return;
    }
    // A matching revision is not a verified sync if two browser caches somehow have different record totals.
    const local = cloudLocalSummary(),
      server = cloudRemoteSummary(remote?.payload);
    if (server && ["animals", "records", "reminders", "photos"].some((k) => local[k] !== server[k])) {
      if (await cloudTryLosslessAutoMerge(user, remote, "mismatch")) return;
      if (["error", "pending"].includes(cloudAutoStatus)) return;
      cloudSetStatus(
        "conflict",
        "This browser differs from its account copy, despite matching revision numbers. Both copies are protected.",
      );
      return;
    }
    cloudConfirmRemote(remoteRev);
    cloudSetStatus(remote ? "synced" : "empty");
  } catch (e) {
    cloudSetStatus("error");
    cloudReportError(e);
  } finally {
    cloudAutoCheckBusy = false;
    if (cloudAutoActive && cloudAutoDirty && cloudAutoStatus === "pending") cloudQueueSave();
  }
}
async function cloudAutoLoad(user, remote, first, discard = false) {
  if (cloudAutoBusy || (cloudAutoDirty && !discard)) return;
  cloudAutoBusy = true;
  try {
    cloudSetStatus("checking", "Retrieving your private records and photos…");
    let full = await cloudHydratePayload(user, remote.payload);
    if ((cloudAutoDirty && !discard) || (!first && Number(remote.revision) < cloudLocalRev())) {
      cloudSetStatus("conflict");
      return;
    }
    cloudPauseWrites = true;
    try {
      cloudApplyLocalSnapshot(full);
      cloudSetOwner(user.id, Number(remote.revision));
    } finally {
      cloudPauseWrites = false;
    }
    cloudRemoteWaiting = null;
    cloudConfirmRemote(Number(remote.revision));
    cloudSetStatus("synced");
    location.reload();
  } catch (e) {
    cloudSetStatus("error");
    cloudReportError(e);
  } finally {
    cloudAutoBusy = false;
  }
}
async function cloudAutoSave() {
  if (!cloudAutoActive || !cloudAutoDirty || cloudAutoBusy || !cloudSession) return;
  if (cloudAutoCheckBusy) {
    cloudQueueSave();
    return;
  }
  cloudAutoBusy = true;
  let generation = cloudAutoGeneration;
  try {
    let user = await cloudAuthorizedUser(),
      owner = localStorage.getItem(CLOUD_OWNER_KEY);
    if (owner !== user.id) throw Error("Account mismatch. No changes were uploaded.");
    let expected = cloudLocalRev();
    cloudSetStatus("saving");
    let payload = await cloudPreparePayload(user.id);
    let { data, error } = await cloudSaveRpc({
      p_expected_revision: expected,
      p_schema_version: 1,
      p_payload: payload,
    });
    if (error) throw error;
    let result = Array.isArray(data) ? data[0] : data;
    if (!result?.saved) {
      cloudAutoActive = true;
      cloudSetStatus("pending", "Another device saved first. Reconciling your changes automatically if safe.");
      cloudAutoMergeAttempt = "";
      setTimeout(() => cloudAutoCheck(), 100);
      return;
    }
    let newRev = Number(result.new_revision);
    localStorage.setItem(CLOUD_REV_KEY, String(newRev));
    cloudRow = { revision: newRev, updated_at: new Date().toISOString(), payload };
    if (generation === cloudAutoGeneration) {
      cloudAutoDirty = false;
      localStorage.setItem(CLOUD_DIRTY_KEY, "0");
      cloudConfirmRemote(newRev);
      cloudSetStatus("synced");
    } else {
      cloudAutoDirty = true;
      localStorage.setItem(CLOUD_DIRTY_KEY, "1");
      cloudSetStatus("pending");
    }
  } catch (e) {
    cloudSetStatus(navigator.onLine === false ? "pending" : "error");
    cloudReportError(e);
  } finally {
    cloudAutoBusy = false;
    if (cloudAutoActive && cloudAutoDirty && !["conflict", "choose"].includes(cloudAutoStatus))
      cloudAutoTimer = setTimeout(
        () => (cloudAutoStatus === "pending" ? cloudAutoCheck() : cloudAutoSave()),
        navigator.onLine === false ? 20000 : 5000,
      );
  }
}
async function cloudBeginMigration() {
  if (cloudAutoBusy || !cloudSession) return;
  let local = cloudLocalSummary();
  if (!cloudHasLocal()) {
    cloudSetStatus("empty");
    return;
  }
  if (cloudRow) {
    cloudSetStatus("choose");
    return;
  }
  let names = animals.join(", ") || "(no animal names)";
  if (
    !confirm(
      "One-time import to your private Scale & Tell account:\n\n" +
        names +
        "\n\n" +
        cloudSummaryText(local) +
        "\n\nIs this the browser with the records you want to keep? This will not erase them.",
    )
  )
    return;
  cloudAutoBusy = true;
  try {
    let { user, remote } = await cloudFetchState();
    if (remote) {
      cloudSetStatus("choose");
      return;
    }
    cloudSetStatus("saving", "Importing your animal records and private photos…");
    let payload = await cloudPreparePayload(user.id);
    let { data, error } = await cloudSaveRpc({
      p_expected_revision: 0,
      p_schema_version: 1,
      p_payload: payload,
    });
    if (error) throw error;
    let result = Array.isArray(data) ? data[0] : data;
    if (!result?.saved) {
      cloudSetStatus("choose");
      return;
    }
    cloudSetOwner(user.id, Number(result.new_revision));
    cloudRow = { revision: Number(result.new_revision), updated_at: new Date().toISOString(), payload };
    cloudSetStatus("synced", "✓ Your existing animals are now saved to your account. Future edits sync automatically.");
  } catch (e) {
    cloudSetStatus("error");
    cloudReportError(e);
  } finally {
    cloudAutoBusy = false;
  }
}
async function cloudChooseRemote() {
  if (!cloudRow || !cloudSession) return;
  if (
    !confirm(
      "This browser has separate local data. Loading the account copy will replace its current local records. Only continue after saving any browser-only records you want to keep elsewhere. Continue?",
    )
  )
    return;
  let { user, remote } = await cloudFetchState();
  if (!remote) return cloudSetStatus("error", "Account copy unavailable. Nothing was replaced.");
  await cloudAutoLoad(user, remote, true);
}
async function cloudReviewConflict() {
  if (!cloudRow || !cloudSession) return;
  if (
    !confirm(
      "Your device contains unsynced changes and the account has a newer copy. This will DISCARD this device’s unsynced changes and load the account copy. Export any changes you want to keep first. Continue?",
    )
  )
    return;
  let { user, remote } = await cloudFetchState();
  if (!remote) return cloudSetStatus("error");
  await cloudAutoLoad(user, remote, true, true);
}
async function cloudApplyWaiting() {
  if (!cloudRemoteWaiting || !cloudSession) return;
  let user = await cloudAuthorizedUser();
  await cloudAutoLoad(user, cloudRemoteWaiting, false);
}
function cloudInitialize() {
  cloudInitialized = true;
  try {
    if (!window.supabase?.createClient) {
      cloudClient = null;
      cloudAuthReady = true;
      updateAuthGate();
      if (current === "Cloud Account") render();
      return;
    }
    cloudClient = window.supabase.createClient(CLOUD_URL, CLOUD_PUBLIC_KEY, {
      auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, storage: authStorage },
      global: { fetch: (u, o) => stAuthFetch(u, o) },
    });
    cloudClient.auth.onAuthStateChange((event, session) => {
      let prior = cloudSession?.user?.id;
      cloudSession = session;
      if (session) cloudPendingEmail = "";
      if (prior !== session?.user?.id) {
        cloudRow = null;
        cloudAutoActive = false;
        founderClearEntitlement();
        if (session) setTimeout(() => founderRefreshEntitlement(), 300);
      }
      if (event === "PASSWORD_RECOVERY") {
        cloudRecovery = true;
        authMode = "recovery";
      }
      if (cloudAuthReady) {
        if (!session) {
          document.getElementById("sheet").classList.remove("on");
          document.getElementById("content").replaceChildren();
        }
        updateAuthGate();
      }
      if (current === "Cloud Account" && session) render();
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        setTimeout(() => cloudAutoCheck(), 100);
        setTimeout(() => pushCheckConfig(), 500);
      }
    });
    cloudClient.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        cloudSession = data.session;
        cloudAuthReady = true;
        updateAuthGate();
        if (current === "Cloud Account") render();
        if (cloudSession) {
          setTimeout(() => cloudAutoCheck(), 250);
          setTimeout(() => pushCheckConfig(), 650);
          setTimeout(() => founderRefreshEntitlement(), 400);
        }
      })
      .catch((e) => {
        cloudAuthReady = true;
        updateAuthGate();
        cloudSetStatus("error");
        cloudReportError(e);
      });
    window.addEventListener("online", () => cloudAutoCheck());
    window.addEventListener("pageshow", () => {
      if (cloudSession) cloudAutoCheck();
    });
    window.addEventListener("focus", () => {
      if (cloudSession) cloudAutoCheck();
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) cloudAutoCheck();
    });
    cloudAutoTimerTick = setInterval(() => {
      if (!document.hidden && cloudSession && !cloudAutoBusy) cloudAutoCheck();
    }, 10000);
  } catch (e) {
    cloudClient = null;
    cloudAuthReady = true;
    updateAuthGate();
    cloudSetStatus("error");
  }
  if (current === "Cloud Account") render();
}

/* Scale & Tell 3.15: optional REAL web push, disabled unless secure sender is installed. */
let pushReady = false,
  pushConfigChecked = false,
  pushVapidKey = "",
  pushDeviceEnabled = false,
  pushWorking = false,
  pushConfigError = "";
let pushHour = (() => {
  let h = Number(localStorage.getItem("scaleTellPushHour16") ?? "17");
  return Number.isInteger(h) && h >= 0 && h <= 23 ? h : 17;
})();
const pushCategories = ["feeding", "shed", "enclosure", "other"];
function pushInstalledIOS() {
  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent || "") &&
    !window.matchMedia("(display-mode: standalone)").matches &&
    !navigator.standalone
  );
}
function pushCapable() {
  return isSecureContext && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}
function pushNote(text) {
  const el = document.getElementById("pushMessage");
  if (el) el.textContent = text;
}
function pushSettingsMarkup() {
  let state = pushInstalledIOS()
    ? "Reminders are almost ready."
    : !pushCapable()
      ? "Phone alerts are not available in this browser. You can still use Care Schedule."
      : !pushConfigChecked
        ? "Checking phone reminder availability…"
        : !pushReady
          ? pushConfigError || "Phone alerts are being prepared. Care Schedule still works normally."
          : pushDeviceEnabled
            ? "✓ Reminders enabled on this device."
            : "Phone reminders are optional. Receive alerts for care due today, around your chosen time.";
  let control =
    pushReady && pushCapable() && !pushInstalledIOS()
      ? pushDeviceEnabled
        ? '<button class="action secondary" type="button" onclick="pushSendTest()">Send Test Notification</button><button class="action secondary" type="button" onclick="pushDisable()">Turn Off Reminders</button>'
        : '<button class="action" type="button" onclick="pushEnable()">Enable Reminders</button>'
      : pushCapable() && !pushInstalledIOS() && pushConfigChecked
        ? '<button class="action secondary" type="button" onclick="pushCheckConfig()">Check Notification Setup Again</button>'
        : "";
  return (
    '<div class="pushPanel"><h3>🔔 Phone care reminders</h3><p>' +
    esc(state) +
    (pushInstalledIOS()
      ? '</p><p><b>iPhone only allows reminders from the Home Screen app.</b></p><ol class="lcSteps"><li>Tap <b>Add to Home Screen</b> below. Your phone&#39;s share menu opens.</li><li>Scroll down the menu and tap <b>Add to Home Screen</b>, then <b>Add</b>.</li><li>Open Scale &amp; Tell from the new icon on your Home Screen.</li></ol><button class="action" type="button" onclick="installShare()">Add to Home Screen</button><p class="lcSmall">Not in the menu? Tap <b>Copy app link</b>, open <b>Safari</b>, paste the link, then tap Share → Add to Home Screen.</p><button class="action secondary" type="button" onclick="installCopyLink()">Copy app link</button><p class="lcSmall" id="installCopyNote">'
      : "") +
    '</p><label>Daily summary time<select id="pushHourChoice" onchange="pushSetHour(this.value)">' +
    Array.from(
      { length: 24 },
      (_, h) =>
        '<option value="' +
        h +
        '" ' +
        (h === pushHour ? "selected" : "") +
        ">" +
        new Date(2026, 0, 1, h).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) +
        "</option>",
    ).join("") +
    '</select></label><p class="helperLine">Reminders without their own time arrive together at this time. Reminders with set times arrive at those times. Applies to all your signed-in devices.</p>' +
    control +
    '<p id="pushMessage" class="helperLine" role="status" aria-live="polite"></p><small>Optional · No alerts for completed tasks · Manage or turn off here anytime. Requires an internet connection and notification permission.</small></div>'
  );
}
function pushRefreshPanel() {
  if (["Calendar", "Get the App"].includes(current) && document.getElementById("sheet").classList.contains("on"))
    render();
}
async function pushCheckConfig() {
  if (!cloudSession || !cloudClient || pushWorking) return;
  pushConfigChecked = true;
  if (!pushCapable() || pushInstalledIOS()) {
    pushRefreshPanel();
    return;
  }
  try {
    const { data, error } = await cloudClient.functions.invoke("care-push", { body: { action: "config" } });
    if (error) throw Error("Could not contact the notification server. Please try Check Notification Setup Again.");
    if (data?.ready === false)
      throw Error("The notification server is not fully configured yet. No alerts have been enabled.");
    if (!data?.ready || typeof data.vapidPublic !== "string" || !data.vapidPublic.trim())
      throw Error("The notification server returned an unexpected setup response.");
    pushReady = true;
    pushConfigError = "";
    pushVapidKey = data.vapidPublic;
    let reg;
    try {
      reg = await navigator.serviceWorker.register("./sw.js", { scope: "./", updateViaCache: "none" });
    } catch (e) {
      throw Error("The phone app could not register its notification worker. Try reopening the installed app.");
    }
    const sub = await reg.pushManager.getSubscription();
    pushDeviceEnabled = !!sub;
    // The reminder time is account-wide: if it was changed on another device, update this one too.
    if (sub && localStorage.getItem("scaleTellPushHour16") !== String(pushHour)) {
      localStorage.setItem("scaleTellPushHour16", String(pushHour));
      setTimeout(() => pushSyncPreferences(), 0);
    }
  } catch (e) {
    pushReady = false;
    pushDeviceEnabled = false;
    pushConfigError = e?.message || "Could not verify phone reminders. Tap Check Notification Setup Again.";
  }
  pushRefreshPanel();
}
function pushKeyBytes(key) {
  let b64 = key.replace(/-/g, "+").replace(/_/g, "/");
  b64 += "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob(b64);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}
async function pushEnable() {
  if (pushWorking) return;
  if (!cloudSession) {
    pushNote("Please sign in first.");
    return;
  }
  if (pushInstalledIOS()) {
    pushNote("Open Scale & Tell using the icon you added to your iPhone Home Screen.");
    return;
  }
  if (!pushCapable()) {
    pushNote("This browser does not support phone reminders.");
    return;
  }
  if (!pushReady) {
    pushNote("Check Notification Setup Again first. The phone has not requested permission yet.");
    return;
  }
  pushWorking = true;
  try {
    // The permission request is deliberately within the user's tap handler.
    const permission = await Notification.requestPermission();
    if (permission !== "granted")
      throw Error("Notifications were not allowed. You can change this in your phone settings.");
    const reg = await navigator.serviceWorker.register("./sw.js", { scope: "./", updateViaCache: "none" });
    let sub = await reg.pushManager.getSubscription();
    const newlySubscribed = !sub;
    if (!sub)
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: pushKeyBytes(pushVapidKey),
      });
    const obj = sub.toJSON();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const pref = pushCategories.filter((k) => notificationPrefs[k] !== false);
    const { error } = await cloudClient.rpc("care_push_register", {
      p_endpoint: sub.endpoint,
      p_p256dh: obj.keys?.p256dh,
      p_auth: obj.keys?.auth,
      p_timezone: tz,
      p_categories: pref,
      p_reminder_hour: pushHour,
    });
    if (error) {
      if (newlySubscribed) await sub.unsubscribe();
      throw error;
    }
    pushDeviceEnabled = true;
    pushRefreshPanel();
    pushNote("✓ Reminders are enabled. Try Send Test Notification.");
  } catch (e) {
    pushNote(e?.message || "Could not enable phone reminders.");
  } finally {
    pushWorking = false;
  }
}
async function pushSetHour(value) {
  const hour = Number(value);
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return;
  const previous = pushHour;
  pushHour = hour;
  try {
    if (pushDeviceEnabled && cloudClient && cloudSession) {
      const reg = await navigator.serviceWorker.getRegistration("./"),
        sub = reg ? await reg.pushManager.getSubscription() : null;
      if (!sub) throw Error("Please enable reminders again to update the time.");
      const keys = sub.toJSON().keys || {};
      const { error } = await cloudClient.rpc("care_push_register", {
        p_endpoint: sub.endpoint,
        p_p256dh: keys.p256dh,
        p_auth: keys.auth,
        p_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        p_categories: pushCategories.filter((k) => notificationPrefs[k] !== false),
        p_reminder_hour: hour,
      });
      if (error) throw error;
    }
    localStorage.setItem("scaleTellPushHour16", String(hour));
    accountPrefsSet("reminderHour", hour);
    pushNote("✓ Reminder time saved for all your signed-in devices.");
  } catch (e) {
    pushHour = previous;
    const sel = document.getElementById("pushHourChoice");
    if (sel) sel.value = String(previous);
    pushNote("Could not update reminder time. Try again.");
  }
}
async function pushDisable(silent = false) {
  try {
    if (!("serviceWorker" in navigator)) return true;
    const reg = await navigator.serviceWorker.getRegistration("./");
    const sub = reg && reg.pushManager ? await reg.pushManager.getSubscription() : null;
    if (sub) {
      // Do not falsely claim an opt-out if the server is still scheduled to send.
      if (!cloudSession || !cloudClient) throw Error("Sign in and reconnect before turning off reminders.");
      const { error } = await cloudClient.rpc("care_push_unregister", { p_endpoint: sub.endpoint });
      if (error) throw error;
      await sub.unsubscribe();
    }
    pushDeviceEnabled = false;
    if (!silent) {
      pushRefreshPanel();
      pushNote("Reminders are off on this device.");
    }
    return true;
  } catch (e) {
    if (!silent)
      pushNote("Could not confirm opt-out with the server. Your subscription is unchanged. Reconnect and try again.");
    return false;
  }
}
async function pushSyncPreferences() {
  if (!pushDeviceEnabled || !cloudSession || !cloudClient || !pushReady) return;
  try {
    const reg = await navigator.serviceWorker.getRegistration("./");
    const sub = reg ? await reg.pushManager.getSubscription() : null;
    if (!sub) {
      pushDeviceEnabled = false;
      pushRefreshPanel();
      return;
    }
    const keys = sub.toJSON().keys || {};
    const { error } = await cloudClient.rpc("care_push_register", {
      p_endpoint: sub.endpoint,
      p_p256dh: keys.p256dh,
      p_auth: keys.auth,
      p_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      p_categories: pushCategories.filter((k) => notificationPrefs[k] !== false),
      p_reminder_hour: pushHour,
    });
    if (error) throw error;
    pushNote("✓ Phone notification categories updated.");
  } catch (e) {
    pushNote(
      "Your journal preferences were saved, but phone alert categories could not sync. Reconnect and try again.",
    );
  }
}
async function pushSendTest() {
  if (!cloudSession || !pushReady) return pushNote("Phone alerts are not ready yet.");
  try {
    let reg = await navigator.serviceWorker.getRegistration("./"),
      sub = reg ? await reg.pushManager.getSubscription() : null;
    if (!sub) throw Error("Enable reminders first.");
    const { data, error } = await cloudClient.functions.invoke("care-push", {
      body: { action: "test", endpoint: sub.endpoint },
    });
    if (error || !data?.sent) throw Error(data?.error || "Could not send a test alert.");
    pushNote("✓ Test sent. Check your phone notifications.");
  } catch (e) {
    pushNote(e?.message || "Test failed. Please try again.");
  }
}

navigator.serviceWorker?.addEventListener("message", (event) => {
  if (event.data?.type === "OPEN_CARE_SCHEDULE" && cloudSession) openPanel("Calendar");
});
if (new URLSearchParams(location.search).has("care")) {
  let tries = 0;
  const timer = setInterval(() => {
    if (cloudSession && cloudAuthReady) {
      clearInterval(timer);
      openPanel("Calendar");
    } else if (++tries > 50) clearInterval(timer);
  }, 300);
}

/* ===================== V3.21 · record identity and lossless sync =====================
   Every care record gets a permanent ID and an "updatedAt" time. Deleting a record leaves a
   small tombstone (ID + time) so other devices know it was deleted on purpose, instead of
   guessing from missing rows. Settings remember when each item last changed.
   Merging two copies is then automatic:
   • a record on either side is kept;
   • the same record edited on two devices keeps the newer edit, and the older version goes
     into Recently Deleted so it can be restored;
   • a record deleted on one device is removed everywhere, unless it was edited or restored later.
   Nothing is ever dropped silently, and every cloud revision is also kept server-side. */
const SYNC_TOMB_KEY = "scaleTellTombstones21",
  SYNC_STAMP_KEY = "scaleTellStamps21",
  ACCOUNT_PREFS_KEY = "scaleTellAccountPrefs21",
  RECOVERY_LIMIT = 100;
// "var" on purpose: readable (as undefined) by save() during start-up, before this block runs.
var syncReady = false;
CLOUD_LOCAL_KEYS[SYNC_TOMB_KEY] = "tombstones";
CLOUD_LOCAL_KEYS[SYNC_STAMP_KEY] = "stamps";
CLOUD_LOCAL_KEYS[ACCOUNT_PREFS_KEY] = "accountPrefs";
for (const k of [SYNC_TOMB_KEY, SYNC_STAMP_KEY, ACCOUNT_PREFS_KEY]) CLOUD_SYNC_FIELDS.add(k);
const SYNC_MAP_KEYS = {
  scaleTellProfiles03: "profiles",
  scaleTellCarePlans12: "carePlans",
  scaleTellSocial14: "socialLinks",
  scaleTellVet14: "savedVet",
  scaleTellProfilePhotos15: "profilePhotos",
  scaleTellNotifyPrefs15: "notificationPrefs",
  scaleTellSitter18: "sitterSettings",
  [ACCOUNT_PREFS_KEY]: "accountPrefs",
};
const SYNC_MAP_FIELDS = Object.values(SYNC_MAP_KEYS);

function syncReadObject(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "{}");
    return v && typeof v === "object" && !Array.isArray(v) ? v : {};
  } catch (e) {
    return {};
  }
}
let syncTombstones = syncReadObject(SYNC_TOMB_KEY),
  syncStamps = syncReadObject(SYNC_STAMP_KEY),
  accountPrefs = syncReadObject(ACCOUNT_PREFS_KEY),
  syncKnown = new Map();

function syncNow() {
  return new Date().toISOString();
}
function syncNewId() {
  try {
    if (crypto.randomUUID) return "r_" + crypto.randomUUID();
  } catch (e) {}
  return "r_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 12);
}
function syncHash(str) {
  let h1 = 0x811c9dc5,
    h2 = 0x9747b28c;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 16777619);
    h2 = Math.imul(h2 ^ c, 2246822519);
  }
  return (h1 >>> 0).toString(36) + (h2 >>> 0).toString(36);
}
/* Records saved before V3.21 had no ID. Two devices holding the same old record must agree on its ID,
   so it is derived from what the record is (animal, activity, date, description), plus a counter
   for genuine duplicates. Notes, completion and photos are left out on purpose, so a reminder
   completed on one phone and still open on the other is recognised as the same reminder. */
function syncLegacySignature(e) {
  return [e.animal || "", e.section || "", e.date || "", e.detail || ""].join("\u001f");
}
function syncAssignLegacyIds(list, mutate) {
  const seen = new Map(),
    out = [];
  for (const original of list || []) {
    const e = mutate ? original : structuredClone(original);
    if (e.id == null || e.id === "") {
      const sig = syncLegacySignature(e),
        n = seen.get(sig) || 0;
      seen.set(sig, n + 1);
      e.id = "lg_" + syncHash(sig + "#" + n);
    } else e.id = String(e.id);
    out.push(e);
  }
  return out;
}
function syncSig(e) {
  return JSON.stringify(mergeStable(e));
}
function syncPersistMeta() {
  try {
    localStorage.setItem(SYNC_TOMB_KEY, JSON.stringify(syncTombstones));
    localStorage.setItem(SYNC_STAMP_KEY, JSON.stringify(syncStamps));
  } catch (e) {}
}
/* Called by save(): gives new records an ID, notices edits and deletions. */
function syncStampEntries() {
  if (!syncReady) return;
  const now = syncNow(),
    seen = new Set();
  let metaChanged = false;
  for (const e of entries) {
    if (e.id == null || e.id === "" || seen.has(String(e.id))) {
      e.id = syncNewId();
      e.updatedAt = now;
    }
    const id = String(e.id);
    e.id = id;
    seen.add(id);
    if (syncTombstones[id]) {
      // A record coming back after deletion (Restore) must win over the older deletion everywhere.
      delete syncTombstones[id];
      e.updatedAt = now;
      metaChanged = true;
    } else if (!syncKnown.has(id)) {
      if (!e.updatedAt) e.updatedAt = now;
    } else if (syncKnown.get(id) !== syncSig(e)) e.updatedAt = now;
  }
  for (const id of syncKnown.keys())
    if (!seen.has(id)) {
      syncTombstones[id] = now;
      metaChanged = true;
    }
  syncKnown = new Map(entries.map((e) => [String(e.id), syncSig(e)]));
  if (metaChanged) syncPersistMeta();
}
/* Called by scaleStoreSet(): remembers when each profile, care plan, setting or device changed. */
function syncStampWrite(key, value) {
  if (!syncReady) return;
  const now = syncNow();
  let changed = false;
  try {
    if (SYNC_MAP_KEYS[key]) {
      const field = SYNC_MAP_KEYS[key],
        before = JSON.parse(localStorage.getItem(key) || "{}") || {},
        after = JSON.parse(value) || {};
      for (const k of new Set([...Object.keys(before), ...Object.keys(after)]))
        if (JSON.stringify(before[k]) !== JSON.stringify(after[k])) {
          syncStamps[field + "/" + k] = now;
          changed = true;
        }
    } else if (key === "scaleTellRoster10") {
      const before = (JSON.parse(localStorage.getItem(key) || "{}") || {}).species || {},
        after = (JSON.parse(value) || {}).species || {};
      for (const k of new Set([...Object.keys(before), ...Object.keys(after)]))
        if (before[k] !== after[k]) {
          syncStamps["species/" + k] = now;
          changed = true;
        }
    } else if (key === "scaleTellDevices13") {
      const before = new Map((JSON.parse(localStorage.getItem(key) || "[]") || []).map((d) => [String(d.id), d])),
        after = JSON.parse(value) || [];
      for (const d of after)
        if (JSON.stringify(before.get(String(d.id))) !== JSON.stringify(d)) {
          syncStamps["devices/" + d.id] = now;
          changed = true;
        }
    }
  } catch (e) {}
  if (changed) syncPersistMeta();
}
function syncNewer(a, b) {
  return String(a || "") > String(b || "");
}
function syncMergeTimes(a, b) {
  const out = { ...(a || {}) };
  for (const [k, v] of Object.entries(b || {})) if (syncNewer(v, out[k])) out[k] = v;
  return out;
}
/* Pick between two versions of the same record that were edited separately. */
function syncPickEntry(a, b) {
  if (syncNewer(a.updatedAt, b.updatedAt)) return [a, b];
  if (syncNewer(b.updatedAt, a.updatedAt)) return [b, a];
  // Same (or no) edit time: a completed reminder is progress, so keep it; otherwise keep the fuller one.
  if (!!b.done !== !!a.done) return b.done ? [b, a] : [a, b];
  return JSON.stringify(b).length > JSON.stringify(a).length ? [b, a] : [a, b];
}
function syncMergeMap(field, local, remote, stampsL, stampsR) {
  const out = {};
  for (const k of new Set([...Object.keys(local || {}), ...Object.keys(remote || {})])) {
    const hasL = Object.prototype.hasOwnProperty.call(local || {}, k),
      hasR = Object.prototype.hasOwnProperty.call(remote || {}, k);
    if (hasL && !hasR) out[k] = structuredClone(local[k]);
    else if (hasR && !hasL) out[k] = structuredClone(remote[k]);
    else out[k] = structuredClone(syncNewer(stampsR[field + "/" + k], stampsL[field + "/" + k]) ? remote[k] : local[k]);
  }
  return out;
}
/* The V3.21 merge. Same return shape as the earlier reviewed merge. */
function syncMergeV2(local, remote) {
  const now = syncNow(),
    stampsL = local.stamps || {},
    stampsR = remote.stamps || {},
    tombs = syncMergeTimes(local.tombstones, remote.tombstones),
    stats = { addedRecords: 0, duplicateRecords: 0, ambiguousRecords: 0, addedPhotos: 0, duplicatePhotos: 0 },
    replaced = [];
  // Old devices recorded deletions only in their recovery list; treat those as deletions too.
  for (const item of [...(local.deletedRecords || []), ...(remote.deletedRecords || [])]) {
    if (!item?.entry || item.replaced) continue;
    const id = syncAssignLegacyIds([item.entry])[0].id;
    if (item.deletedAt && syncNewer(item.deletedAt, tombs[id])) tombs[id] = item.deletedAt;
  }
  const L = syncAssignLegacyIds(local.entries),
    R = syncAssignLegacyIds(remote.entries),
    byId = new Map(),
    order = [];
  for (const e of L) {
    if (byId.has(e.id)) continue;
    byId.set(e.id, e);
    order.push(e.id);
  }
  for (const e of R) {
    const have = byId.get(e.id);
    if (!have) {
      byId.set(e.id, e);
      order.push(e.id);
      stats.addedRecords++;
    } else if (syncSig(have) === syncSig(e)) {
      stats.duplicateRecords++;
      if (syncNewer(e.updatedAt, have.updatedAt)) byId.set(e.id, e);
    } else {
      const [win, lose] = syncPickEntry(have, e);
      byId.set(e.id, win);
      replaced.push({ entry: lose, deletedAt: now, replaced: true });
    }
  }
  const entriesOut = [];
  for (const id of order) {
    const e = byId.get(id),
      gone = tombs[id];
    if (gone && !syncNewer(e.updatedAt, gone)) continue;
    if (gone) delete tombs[id];
    entriesOut.push(e);
  }
  const out = structuredClone(local);
  out.entries = entriesOut;
  out.tombstones = tombs;
  out.stamps = syncMergeTimes(stampsL, stampsR);
  out.roster = {
    animals: [...new Set([...(local.roster?.animals || []), ...(remote.roster?.animals || [])])],
    species: syncMergeMap("species", local.roster?.species, remote.roster?.species, stampsL, stampsR),
  };
  if (out.roster.animals.length > 500)
    throw Error("Combined animal roster exceeds the current 500-animal limit. Nothing was changed.");
  out.photos = {};
  for (const a of new Set([...Object.keys(local.photos || {}), ...Object.keys(remote.photos || {})])) {
    const g = mergeGallery(local.photos?.[a], remote.photos?.[a]);
    out.photos[a] = g.result;
    stats.addedPhotos += g.added;
    stats.duplicatePhotos += g.duplicate;
    if (g.result.length > 100) throw Error("Too many combined photos for " + a + ". Nothing was changed.");
  }
  for (const field of SYNC_MAP_FIELDS) out[field] = syncMergeMap(field, local[field], remote[field], stampsL, stampsR);
  for (const a of Object.keys(out.profilePhotos || {})) {
    const selected = out.profilePhotos[a];
    if (!(out.photos[a] || []).some((p) => photoKey(p) === selected)) {
      const fallback = [local.profilePhotos?.[a], remote.profilePhotos?.[a]].find((k) =>
        (out.photos[a] || []).some((p) => photoKey(p) === k),
      );
      if (fallback) out.profilePhotos[a] = fallback;
      else delete out.profilePhotos[a];
    }
  }
  const devicesById = new Map();
  for (const d of local.devices || []) devicesById.set(String(d.id || JSON.stringify(mergeStable(d))), d);
  for (const d of remote.devices || []) {
    const id = String(d.id || JSON.stringify(mergeStable(d))),
      have = devicesById.get(id);
    if (!have || syncNewer(stampsR["devices/" + id], stampsL["devices/" + id])) devicesById.set(id, d);
  }
  out.devices = [...devicesById.values()].map((d) => structuredClone(d));
  out.archived = [
    ...new Map([...(remote.archived || []), ...(local.archived || [])].map((x) => [x.name, x])).values(),
  ].filter((a) => !out.roster.animals.includes(a.name));
  out.deletedRecords = [
    ...new Map(
      [...(remote.deletedRecords || []), ...(local.deletedRecords || []), ...replaced].map((x) => [
        mergeExact(x.entry || x) + (x.replaced ? "#r" : ""),
        x,
      ]),
    ).values(),
  ]
    .sort((a, b) => String(a.deletedAt || "").localeCompare(String(b.deletedAt || "")))
    .slice(-RECOVERY_LIMIT);
  if (out.entries.length > 10000) throw Error("Combined care record count is too large. Nothing was changed.");
  out.format = "scale-and-tell-cloud";
  out.version = 1;
  const warnings = replaced.length
    ? [
        replaced.length +
          " record(s) were edited on two devices. The newest edit was kept; the other version is in Recently Deleted if you need it.",
      ]
    : [];
  return { payload: out, stats, warnings };
}
/* Apply a downloaded copy without forgetting deletions this device already knows about. */
function syncPrepareIncoming(p) {
  const next = { ...p };
  next.tombstones = syncMergeTimes(syncTombstones, p.tombstones);
  next.stamps = syncMergeTimes(syncStamps, p.stamps);
  if (!p.accountPrefs || typeof p.accountPrefs !== "object") next.accountPrefs = accountPrefs;
  return next;
}
function accountPrefsSet(key, value) {
  const next = { ...accountPrefs, [key]: value };
  scaleStoreSet(ACCOUNT_PREFS_KEY, JSON.stringify(next));
  accountPrefs = next;
}
/* One-time upgrade of this device's records: permanent IDs + deletions from the recovery list. */
(function syncInitialize() {
  try {
    const before = JSON.stringify(entries);
    syncAssignLegacyIds(entries, true);
    for (const item of deletedRecords) {
      if (!item?.entry) continue;
      if (item.entry.id == null || item.entry.id === "") item.entry.id = syncAssignLegacyIds([item.entry])[0].id;
      const id = String(item.entry.id);
      if (
        !item.replaced &&
        item.deletedAt &&
        !entries.some((e) => e.id === id) &&
        syncNewer(item.deletedAt, syncTombstones[id])
      )
        syncTombstones[id] = item.deletedAt;
    }
    syncKnown = new Map(entries.map((e) => [String(e.id), syncSig(e)]));
    syncPersistMeta();
    if (JSON.stringify(entries) !== before) {
      localStorage.setItem("scaleTellApprovedPreview", JSON.stringify(entries));
      localStorage.setItem("scaleTellDeleted25", JSON.stringify(deletedRecords));
    }
  } catch (e) {
    console.warn("Record ID upgrade skipped", e);
  }
  syncReady = true;
  // Account-wide daily reminder time (same on every signed-in device).
  const h = Number(accountPrefs.reminderHour);
  if (Number.isInteger(h) && h >= 0 && h <= 23) pushHour = h;
})();


/* ===================== V3.23 · Breeder tools (Founding Keeper): racks, rack feeding, pairings, clutches ===================== */
const RACKS_KEY = "scaleTellRacks22",
  BREEDER_PANELS = ["Racks & Breeding", "Rack View", "Rack Feeding", "Rack Setup", "Pairing", "Clutch"],
  PAIRING_EVENTS = ["Introduced", "Lock", "Ovulation", "Pre-lay shed", "Separated", "Other"];
var racks = {};
try {
  const v = JSON.parse(localStorage.getItem(RACKS_KEY) || "{}");
  if (v && typeof v === "object" && !Array.isArray(v)) racks = v;
} catch (e) {}
CLOUD_LOCAL_KEYS[RACKS_KEY] = "racks";
CLOUD_SYNC_FIELDS.add(RACKS_KEY);
SYNC_MAP_KEYS[RACKS_KEY] = "racks";
if (!SYNC_MAP_FIELDS.includes("racks")) SYNC_MAP_FIELDS.push("racks");
let breederRackId = "",
  breederEditId = "",
  breederTub = "";

function saveRacks(next) {
  try {
    scaleStoreSet(RACKS_KEY, JSON.stringify(next));
    racks = next;
    return true;
  } catch (e) {
    alert("Could not save the rack. Browser storage may be full.");
    return false;
  }
}
function rackList() {
  return Object.values(racks)
    .filter((r) => r && r.id)
    .sort((a, b) => String(a.name).localeCompare(String(b.name)));
}
function tubLabel(r, c) {
  return String.fromCharCode(65 + r) + (c + 1);
}
function tubKey(r, c) {
  return r + "-" + c;
}
function rackOfAnimal(a) {
  for (const rack of rackList())
    for (const [k, v] of Object.entries(rack.slots || {}))
      if (v === a) {
        const [r, c] = k.split("-").map(Number);
        return { rack, key: k, label: tubLabel(r, c) };
      }
  return null;
}
function lastFeed(a) {
  return entries
    .filter((e) => e.animal === a && e.section === "Feeding Tracker")
    .sort((x, y) => y.date.localeCompare(x.date))[0];
}
function daysSince(date) {
  return Math.max(0, Math.round((new Date(today() + "T12:00") - new Date(date + "T12:00")) / 864e5));
}
function agoText(date) {
  const d = daysSince(date);
  return d === 0 ? "today" : d === 1 ? "yesterday" : d + "d ago";
}
function breederLocked() {
  return (
    '<div class="studioTile"><h3>Breeder tools ♡</h3><p>Racks and tubs, feeding a whole rack in one go, pairings with lock and ovulation dates, clutches and incubation, and hatchlings linked to their parents.</p><p><b>Included with Founding Breeder</b> ($19.99 a year, up to 150 animals) and every breeder and rescue plan.</p><button class="action" onclick="openPanel(&quot;Plans&quot;)">See plans</button></div>'
  );
}
function breederHome() {
  const rs = rackList(),
    breeding = entries.filter((e) => e.section === "Breeding");
  const pairings = breeding.filter((e) => e.kind === "pairing").sort((a, b) => b.date.localeCompare(a.date)),
    clutches = breeding.filter((e) => e.kind === "clutch").sort((a, b) => b.date.localeCompare(a.date));
  const activePairings = pairings.filter((p) => p.status !== "done"),
    incubating = clutches.filter((c) => !c.hatchDate);
  const pairingCard = (p) =>
    '<button class="breedCard" onclick="breederOpen(&quot;Pairing&quot;,&quot;' +
    esc(p.id) +
    '&quot;)"><b>' +
    esc(p.animal) +
    " × " +
    esc(p.partner || "?") +
    "</b><small>Started " +
    esc(niceDate(p.date)) +
    (Array.isArray(p.events) && p.events.length
      ? " · " + esc(p.events[p.events.length - 1].type) + " " + esc(niceDate(p.events[p.events.length - 1].date))
      : "") +
    (p.status === "done" ? " · finished" : "") +
    "</small></button>";
  const clutchCard = (c) =>
    '<button class="breedCard" onclick="breederOpen(&quot;Clutch&quot;,&quot;' +
    esc(c.id) +
    '&quot;)"><b>' +
    esc(c.animal) +
    (c.partner ? " × " + esc(c.partner) : "") +
    "</b><small>Laid " +
    esc(niceDate(c.date)) +
    " · " +
    (Number(c.good) || 0) +
    " good" +
    (Number(c.slugs) ? ", " + Number(c.slugs) + (Number(c.slugs) === 1 ? " slug" : " slugs") : "") +
    (c.hatchDate
      ? " · hatched " + esc(niceDate(c.hatchDate))
      : c.dueDate
        ? " · due " + esc(niceDate(c.dueDate)) + (c.dueDate >= today() ? " (in " + Math.round((new Date(c.dueDate + "T12:00") - new Date(today() + "T12:00")) / 864e5) + " days)" : "")
        : "") +
    "</small></button>";
  return (
    '<p class="muted">Breeder tools ♡</p>' +
    '<h3 class="sectionTitle">Racks (' +
    rs.length +
    ")</h3>" +
    (rs.length
      ? '<div class="breedList">' +
        rs
          .map((r) => {
            const filled = Object.values(r.slots || {}).filter(Boolean).length;
            return (
              '<button class="breedCard" onclick="breederOpen(&quot;Rack View&quot;,&quot;' +
              esc(r.id) +
              '&quot;)"><b>' +
              esc(r.name) +
              "</b><small>" +
              r.rows +
              " × " +
              r.cols +
              " · " +
              filled +
              " of " +
              r.rows * r.cols +
              " tubs in use</small></button>"
            );
          })
          .join("") +
        "</div>"
      : '<p class="muted">No racks yet. Set one up to see your collection by tub and feed a whole rack at once.</p>') +
    '<button class="action" onclick="breederOpen(&quot;Rack Setup&quot;,&quot;&quot;)">+ New rack</button>' +
    '<h3 class="sectionTitle">Pairings (' +
    activePairings.length +
    " active)</h3>" +
    (pairings.length ? '<div class="breedList">' + pairings.slice(0, 20).map(pairingCard).join("") + "</div>" : "") +
    '<button class="action secondary" onclick="breederOpen(&quot;Pairing&quot;,&quot;&quot;)">+ New pairing</button>' +
    '<h3 class="sectionTitle">Clutches (' +
    incubating.length +
    " incubating)</h3>" +
    (clutches.length ? '<div class="breedList">' + clutches.slice(0, 20).map(clutchCard).join("") + "</div>" : "") +
    '<button class="action secondary" onclick="breederOpen(&quot;Clutch&quot;,&quot;&quot;)">+ Log a clutch or litter</button>'
  );
}
function breederOpen(panel, id) {
  if (panel === "Rack View" || panel === "Rack Feeding" || panel === "Rack Setup") breederRackId = id || "";
  else breederEditId = id || "";
  breederTub = "";
  openPanel(panel);
}
function rackSetupMarkup() {
  const r = racks[breederRackId];
  return (
    '<p class="muted">' +
    (r ? "Change the name or size of this rack. Animals stay in their tubs." : "Rows are lettered (A, B, C…) and columns numbered, so tubs read like A1, B3.") +
    '</p><label>Rack name<input id="rackName" maxlength="40" placeholder="e.g. Rack A or Hatchling rack" value="' +
    esc(r?.name || "") +
    '"></label><div class="twoCol"><label>Rows<input id="rackRows" type="number" min="1" max="26" value="' +
    (r?.rows || 4) +
    '"></label><label>Tubs per row<input id="rackCols" type="number" min="1" max="12" value="' +
    (r?.cols || 3) +
    '"></label></div><div class="inlineActions"><button class="action" onclick="saveRackSetup()">Save rack</button><button class="action secondary" onclick="openPanel(&quot;Racks & Breeding&quot;)">Cancel</button></div>' +
    (r
      ? '<details class="compactDisclosure"><summary>Delete this rack</summary><p class="helperLine">Animals and their records are kept; they are simply no longer placed in a tub.</p><button class="action secondary" onclick="deleteRack()">Delete rack</button></details>'
      : "")
  );
}
function saveRackSetup() {
  const name = (document.getElementById("rackName")?.value || "").trim().slice(0, 40),
    rows = Number(document.getElementById("rackRows")?.value),
    cols = Number(document.getElementById("rackCols")?.value);
  if (!name) return alert("Give the rack a name.");
  if (!Number.isInteger(rows) || rows < 1 || rows > 26 || !Number.isInteger(cols) || cols < 1 || cols > 12)
    return alert("Rows can be 1–26 and tubs per row 1–12.");
  const old = racks[breederRackId];
  const slots = {};
  const lost = [];
  for (const [k, v] of Object.entries(old?.slots || {})) {
    const [r, c] = k.split("-").map(Number);
    if (r < rows && c < cols) slots[k] = v;
    else if (v) lost.push(v);
  }
  if (lost.length && !confirm("Making the rack smaller removes " + lost.join(", ") + " from their tubs. Continue?")) return;
  const id = old?.id || "rack_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  if (saveRacks({ ...racks, [id]: { id, name, rows, cols, slots } })) breederOpen("Rack View", id);
}
function deleteRack() {
  const r = racks[breederRackId];
  if (!r || !confirm("Delete " + r.name + "? Animals and records are kept.")) return;
  const next = { ...racks };
  delete next[r.id];
  if (saveRacks(next)) openPanel("Racks & Breeding");
}
function rackViewMarkup() {
  const r = racks[breederRackId];
  if (!r) return '<p class="muted">This rack is no longer available.</p>';
  let grid = '<div class="rackGrid" style="grid-template-columns:repeat(' + r.cols + ',minmax(0,1fr))">';
  for (let i = 0; i < r.rows; i++)
    for (let j = 0; j < r.cols; j++) {
      const k = tubKey(i, j),
        a = r.slots?.[k] || "",
        f = a ? lastFeed(a) : null,
        archived = a && !animals.includes(a);
      grid +=
        '<button class="tub' +
        (a ? "" : " empty") +
        (breederTub === k ? " sel" : "") +
        '" onclick="rackPickTub(&quot;' +
        k +
        '&quot;)"><span class="tubId">' +
        tubLabel(i, j) +
        "</span>" +
        (a
          ? "<b>" +
            esc(a) +
            "</b><small>" +
            (archived ? "archived" : f ? (f.detail === "Ate" ? "ate " : esc(f.detail.toLowerCase()) + " ") + agoText(f.date) : "no feedings yet") +
            "</small>"
          : "<small>empty</small>") +
        "</button>";
    }
  grid += "</div>";
  let editor = "";
  if (breederTub) {
    const [i, j] = breederTub.split("-").map(Number),
      a = r.slots?.[breederTub] || "";
    const placed = new Set(rackList().flatMap((x) => Object.values(x.slots || {})));
    const choices = animals.filter((x) => x === a || !placed.has(x));
    editor =
      '<div class="tubEditor"><h4>Tub ' +
      tubLabel(i, j) +
      '</h4><label>Animal in this tub<select id="tubAnimal"><option value="">Empty</option>' +
      choices.map((x) => '<option value="' + esc(x) + '"' + (x === a ? " selected" : "") + ">" + esc(x) + "</option>").join("") +
      '</select></label><div class="inlineActions"><button class="action" onclick="saveTub()">Save tub</button>' +
      (a && animals.includes(a) ? '<button class="action secondary" onclick="openPanel(&quot;' + esc(a).replace(/'/g, "&#39;") + '&quot;)">Open ' + esc(a) + "</button>" : "") +
      "</div><p class=\"helperLine\">Only animals not already in a tub are listed.</p></div>";
  }
  const filled = Object.values(r.slots || {}).filter((a) => a && animals.includes(a)).length;
  return (
    '<p class="muted">' +
    r.rows +
    " rows × " +
    r.cols +
    " tubs · " +
    filled +
    " animals. Tap a tub to place or move an animal.</p>" +
    grid +
    editor +
    '<div class="inlineActions">' +
    (filled ? '<button class="action" onclick="breederOpen(&quot;Rack Feeding&quot;,&quot;' + esc(r.id) + '&quot;)">🍽 Feed this rack</button><div class="inlineActions"><button class="action secondary" onclick="breederRackId=&quot;' + esc(r.id) + '&quot;;openPanel(&quot;Rack Weigh&quot;)">⚖ Weigh this rack</button><button class="action secondary" onclick="tubLabelsOpen(&quot;' + esc(r.id) + '&quot;)">▦ Print tub labels (QR)</button></div>' : "") +
    '<button class="action secondary" onclick="breederOpen(&quot;Rack Setup&quot;,&quot;' +
    esc(r.id) +
    '&quot;)">Edit rack</button><button class="action secondary" onclick="openPanel(&quot;Racks & Breeding&quot;)">All racks</button></div>'
  );
}
function rackPickTub(k) {
  breederTub = breederTub === k ? "" : k;
  render();
}
function saveTub() {
  const r = racks[breederRackId];
  if (!r || !breederTub) return;
  const a = document.getElementById("tubAnimal")?.value || "";
  const next = structuredClone(racks);
  if (a) for (const x of Object.values(next)) for (const [k, v] of Object.entries(x.slots || {})) if (v === a) delete x.slots[k];
  next[r.id].slots = next[r.id].slots || {};
  if (a) next[r.id].slots[breederTub] = a;
  else delete next[r.id].slots[breederTub];
  if (saveRacks(next)) {
    breederTub = "";
    render();
  }
}
function rackFeedingMarkup() {
  const r = racks[breederRackId];
  if (!r) return '<p class="muted">This rack is no longer available.</p>';
  const rows = [];
  for (let i = 0; i < r.rows; i++)
    for (let j = 0; j < r.cols; j++) {
      const a = r.slots?.[tubKey(i, j)];
      if (a && animals.includes(a)) rows.push({ a, label: tubLabel(i, j) });
    }
  return (
    '<p class="muted">Mark each tub, then save once. Tubs left blank are not logged.</p><label>Feeding date<input type="date" id="rfDate" value="' +
    today() +
    '"></label><label>Feeding time (optional, applies to selected tubs)<input type="time" id="rfTime"></label><div class="rfAll"><span>Mark all:</span><button type="button" onclick="rackFeedAll(&quot;Ate&quot;)">Ate</button><button type="button" onclick="rackFeedAll(&quot;&quot;)">Clear</button></div>' +
    rows
      .map((x, n) => {
        const f = lastFeed(x.a);
        return (
          '<div class="rfRow"><div class="rfName"><span class="tubId">' +
          x.label +
          "</span><b>" +
          esc(x.a) +
          "</b>" +
          (f ? "<small>last: " + esc(f.detail) + " " + agoText(f.date) + "</small>" : "") +
          '</div><div class="rfChoice" role="radiogroup" aria-label="' +
          esc(x.a) +
          '">' +
          ["Ate", "Refused", "Skipped feeding"]
            .map(
              (o) =>
                '<label><input type="radio" name="rf' +
                n +
                '" value="' +
                o +
                '"><span>' +
                (o === "Skipped feeding" ? "Skip" : o) +
                "</span></label>",
            )
            .join("") +
          '</div><input class="rfPrey" id="rfPrey' +
          n +
          '" maxlength="60" placeholder="Prey (optional)" value="' +
          esc(f?.preyType || "") +
          '" data-animal="' +
          esc(x.a) +
          '" data-tub="' +
          x.label +
          '"></div>'
        );
      })
      .join("") +
    '<div class="inlineActions"><button class="action" onclick="saveRackFeeding(' +
    rows.length +
    ')">Save feedings</button><button class="action secondary" onclick="breederOpen(&quot;Rack View&quot;,&quot;' +
    esc(r.id) +
    '&quot;)">Cancel</button></div><p class="helperLine" id="rfStatus" role="status"></p>'
  );
}
function rackFeedAll(v) {
  document.querySelectorAll(".rfChoice").forEach((g) => {
    g.querySelectorAll("input").forEach((i) => (i.checked = v && i.value === v));
  });
}
function saveRackFeeding(n) {
  const r = racks[breederRackId],
    date = document.getElementById("rfDate")?.value;
  if (!r || !validDate(date)) return alert("Choose a valid date.");
  const feedingTime = (document.getElementById("rfTime")?.value || "").trim();
  if (feedingTime && !stValidFeedingTime(feedingTime)) return alert("Enter a valid feeding time or leave it blank.");
  const add = [];
  for (let i = 0; i < n; i++) {
    const choice = document.querySelector('input[name="rf' + i + '"]:checked')?.value;
    if (!choice) continue;
    const prey = document.getElementById("rfPrey" + i);
    add.push({
      section: "Feeding Tracker",
      animal: prey.dataset.animal,
      detail: choice,
      date,
      notes: "Rack feeding · " + r.name + " " + prey.dataset.tub,
      ...(feedingTime ? { feedingTime } : {}),
      ...(choice !== "Skipped feeding" && prey.value.trim() ? { preyType: prey.value.trim().slice(0, 60) } : {}),
    });
  }
  if (!add.length) return alert("Mark at least one tub first.");
  const before = entries;
  entries = [...entries, ...add];
  try {
    save();
  } catch (e) {
    entries = before;
    return alert("Could not save these feedings. Nothing was added.");
  }
  const used = {};
  add.filter((e) => e.detail === "Ate" && e.preyType).forEach((e) => (used[e.preyType] = (used[e.preyType] || 0) + 1));
  Object.entries(used).forEach(([p, n]) => feederUse(p, n));
  breederOpen("Rack View", r.id);
  alert("✓ Logged " + add.length + " feeding" + (add.length === 1 ? "" : "s") + " for " + r.name + ".");
}
function breedRecord() {
  return entries.find((e) => e.section === "Breeding" && String(e.id) === breederEditId) || null;
}
function animalSelect(id, value, filter) {
  const list = animals.filter(filter || (() => true));
  const all = value && !list.includes(value) ? [value, ...list] : list;
  return (
    '<select id="' +
    id +
    '"><option value="">Choose</option>' +
    all.map((a) => '<option value="' + esc(a) + '"' + (a === value ? " selected" : "") + ">" + esc(a) + "</option>").join("") +
    "</select>"
  );
}
function sexOf(a) {
  return String(profiles[a]?.sex || "").toLowerCase();
}
function pairingMarkup() {
  const p = breedRecord();
  const ev = Array.isArray(p?.events) ? p.events : [];
  return (
    '<label>Female' +
    animalSelect("pairFemale", p?.animal, (a) => sexOf(a) !== "male") +
    "</label><label>Male" +
    animalSelect("pairMale", p?.partner, (a) => sexOf(a) !== "female") +
    '</label><label>Paired on<input type="date" id="pairDate" value="' +
    esc(p?.date || today()) +
    '"></label><h4>Events</h4><p class="helperLine">Add locks, ovulation, pre-lay shed and separation as they happen.</p><div id="pairEvents">' +
    ev.map((x) => pairEventRow(x)).join("") +
    '</div><button type="button" class="action secondary" onclick="addPairEvent()">+ Add event</button><label>Notes<textarea id="pairNotes" maxlength="600">' +
    esc(p?.notes || "") +
    '</textarea></label><label class="checkLine"><input type="checkbox" id="pairDone"' +
    (p?.status === "done" ? " checked" : "") +
    '> This pairing is finished</label><div class="inlineActions"><button class="action" onclick="savePairing()">Save pairing</button><button class="action secondary" onclick="openPanel(&quot;Racks & Breeding&quot;)">Cancel</button></div>' +
    (p ? '<button class="action secondary" onclick="breederNewClutchFrom()">+ Log a clutch or litter from this pairing</button>' : "")
  );
}
function pairEventRow(x) {
  return (
    '<div class="evRow"><select class="evType">' +
    PAIRING_EVENTS.map((t) => "<option" + (t === x?.type ? " selected" : "") + ">" + t + "</option>").join("") +
    '</select><input type="date" class="evDate" value="' +
    esc(x?.date || today()) +
    '"><button type="button" class="smallbutton" onclick="this.parentElement.remove()" aria-label="Remove event">✕</button></div>'
  );
}
function addPairEvent() {
  document.getElementById("pairEvents")?.insertAdjacentHTML("beforeend", pairEventRow({ type: "Lock", date: today() }));
}
function savePairing() {
  const female = document.getElementById("pairFemale")?.value,
    male = document.getElementById("pairMale")?.value,
    date = document.getElementById("pairDate")?.value;
  if (!female || !male) return alert("Choose both the female and the male.");
  if (female === male) return alert("Choose two different animals.");
  if (!validDate(date)) return alert("Choose a valid pairing date.");
  if (!breedSpeciesOk(female, male)) return;
  const events = [...document.querySelectorAll("#pairEvents .evRow")]
    .map((row) => ({ type: row.querySelector(".evType").value, date: row.querySelector(".evDate").value }))
    .filter((x) => validDate(x.date))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 40);
  const old = breedRecord();
  const rec = {
    ...(old || {}),
    section: "Breeding",
    kind: "pairing",
    animal: female,
    partner: male,
    detail: "Paired with " + male,
    date,
    events,
    notes: (document.getElementById("pairNotes")?.value || "").trim().slice(0, 600),
    status: document.getElementById("pairDone")?.checked ? "done" : "active",
  };
  commitBreed(old, rec);
}
function breederNewClutchFrom() {
  const p = breedRecord();
  breederEditId = "";
  openPanel("Clutch");
  setTimeout(() => {
    const d = document.getElementById("clutchDam"),
      s = document.getElementById("clutchSire");
    if (d && p) d.value = p.animal;
    try { clutchModeUpdate(); } catch (e) {}
    if (s && p) s.value = p.partner || "";
  }, 0);
}
function clutchMarkup() {
  const c = breedRecord();
  const live = stLiveBirth(c?.animal || animals.find((a) => sexOf(a) !== "male") || "");
  const L = (egg, lv) => '<span class="eg">' + egg + '</span><span class="lv">' + lv + "</span>";
  return (
    '<div id="clutchForm" class="' + (live ? "live" : "egg") + '">' +
    "<label>Dam (mother)" +
    animalSelect("clutchDam", c?.animal, (a) => sexOf(a) !== "male").replace("<select", '<select onchange="clutchModeUpdate()"') +
    "</label><label>Sire (father)" +
    animalSelect("clutchSire", c?.partner, (a) => sexOf(a) !== "female") +
    '</label><label>' + L("Laid on", "Paired / bred on") + '<input type="date" id="clutchLaid" value="' +
    esc(c?.date || today()) +
    '"></label><div class="twoCol"><label>' + L("Good eggs", "Pups born alive") + '<input type="number" id="clutchGood" min="0" max="200" value="' +
    esc(c?.good ?? "") +
    '"></label><label>' + L("Slugs / bad eggs", "Stillborn / lost") + '<input type="number" id="clutchSlugs" min="0" max="200" value="' +
    esc(c?.slugs ?? "") +
    '"></label></div><label class="eg">Incubation temperature (°F)<input type="number" id="clutchTemp" min="60" max="100" step="0.1" value="' +
    esc(c?.incubTemp ?? "") +
    '"></label><label>' + L("Expected hatch date", "Expected birth date") + '<input type="date" id="clutchDue" value="' +
    esc(c?.dueDate || "") +
    '"></label><p class="helperLine">A Care Schedule reminder is added for the expected ' + L("hatch", "birth") + ' date.</p><label>' + L("Hatched on", "Born on") + '<input type="date" id="clutchHatch" value="' +
    esc(c?.hatchDate || "") +
    '"></label><label>' + L("Number hatched", "Pups weaned") + '<input type="number" id="clutchHatched" min="0" max="200" value="' +
    esc(c?.hatched ?? "") +
    '"></label><label>Notes<textarea id="clutchNotes" maxlength="600">' +
    esc(c?.notes || "") +
    '</textarea></label><div class="inlineActions"><button class="action" onclick="saveClutch()">Save ' + L("clutch", "litter") + '</button><button class="action secondary" onclick="openPanel(&quot;Racks & Breeding&quot;)">Cancel</button></div>' +
    (c ? '<button class="action secondary eg" onclick="incClutchId=\'' + esc(c.id) + '\';openPanel(\'Incubation\')">🌡 Incubation log' + (c.incLog?.length ? " (" + c.incLog.length + ")" : "") + "</button>" : "") +
    (c
      ? '<div class="tubEditor"><h4>' + L("Hatchlings", "Pups") + '</h4>' +
        (Array.isArray(c.hatchlings) && c.hatchlings.length
          ? "<p>" + c.hatchlings.map(esc).join(", ") + "</p>"
          : '<p class="helperLine">Add each ' + L("hatchling", "pup") + ' as its own animal, linked to its parents.</p>') +
        '<label>How many to add<input type="number" id="hatchCount" min="1" max="50" value="' +
        esc(Math.max(1, (Number(c.hatched) || Number(c.good) || 1) - (c.hatchlings?.length || 0))) +
        '"></label><button class="action" onclick="addHatchlings()">+ Add ' + L("hatchlings", "pups") + ' to My Animals</button></div>'
      : "") + "</div>"
  );
}
function clutchModeUpdate() {
  const f = document.getElementById("clutchForm"), d = document.getElementById("clutchDam")?.value;
  if (f) f.className = stLiveBirth(d) ? "live" : "egg";
}
function saveClutch() {
  const dam = document.getElementById("clutchDam")?.value,
    sire = document.getElementById("clutchSire")?.value || "",
    laid = document.getElementById("clutchLaid")?.value,
    due = document.getElementById("clutchDue")?.value || "",
    hatch = document.getElementById("clutchHatch")?.value || "";
  const num = (id, max) => {
    const v = document.getElementById(id)?.value;
    if (v === "" || v == null) return "";
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 && n <= max ? n : NaN;
  };
  const good = num("clutchGood", 200),
    slugs = num("clutchSlugs", 200),
    hatched = num("clutchHatched", 200),
    temp = num("clutchTemp", 100);
  if (!dam) return alert("Choose the dam (mother).");
  if (sire && !breedSpeciesOk(dam, sire)) return;
  const live = stLiveBirth(dam);
  if (!validDate(laid)) return alert(live ? "Choose the date they were paired." : "Choose the date the clutch was laid.");
  if ((due && !validDate(due)) || (hatch && !validDate(hatch))) return alert("Check the dates.");
  if ([good, slugs, hatched, temp].some((n) => Number.isNaN(n))) return alert("Check the numbers.");
  const old = breedRecord();
  const rec = {
    ...(old || {}),
    section: "Breeding",
    kind: "clutch",
    animal: dam,
    partner: sire,
    litter: live || undefined,
    detail: live ? "Litter" + (good !== "" ? " · " + good + " pup" + (good === 1 ? "" : "s") : "") : "Clutch" + (good !== "" ? " · " + good + " good egg" + (good === 1 ? "" : "s") : ""),
    date: laid,
    good,
    slugs,
    incubTemp: temp,
    dueDate: due,
    hatchDate: hatch,
    hatched,
    notes: (document.getElementById("clutchNotes")?.value || "").trim().slice(0, 600),
  };
  commitBreed(old, rec);
}
function commitBreed(old, rec) {
  const before = entries;
  let next = old ? entries.map((e) => (e === old ? rec : e)) : [...entries, rec];
  entries = next;
  try {
    save();
    // A Care Schedule reminder for the expected hatch date (one per clutch and date).
    if (
      rec.kind === "clutch" &&
      rec.dueDate &&
      !rec.hatchDate &&
      !entries.some((e) => e.section === "Calendar" && String(e.clutchId) === String(rec.id) && e.date === rec.dueDate)
    ) {
      entries.push({
        section: "Calendar",
        animal: rec.animal,
        detail: rec.litter ? "Litter due" : "Clutch due to hatch",
        date: rec.dueDate,
        notes: (rec.litter ? "Paired " : "Clutch laid ") + rec.date,
        repeatDays: 0,
        done: false,
        clutchId: rec.id,
      });
      save();
    }
  } catch (e) {
    entries = before;
    return alert("Could not save. Nothing was changed.");
  }
  openPanel("Racks & Breeding");
}
function addHatchlings() {
  const c = breedRecord();
  if (!c) return;
  const n = Number(document.getElementById("hatchCount")?.value);
  if (!Number.isInteger(n) || n < 1 || n > 50) return alert("Add between 1 and 50 " + (c.litter ? "pups." : "hatchlings."));
  if (animals.length + n > 500) return alert("That would go over the 500-animal limit.");
  const year = (c.hatchDate || today()).slice(0, 4),
    base = (c.animal + (c.partner ? " × " + c.partner : "")).slice(0, 34);
  const made = [];
  let k = (c.hatchlings?.length || 0) + 1;
  while (made.length < n) {
    const name = (base + " " + year + " #" + k).slice(0, 50);
    k++;
    if (animals.some((a) => a.toLowerCase() === name.toLowerCase())) continue;
    made.push(name);
  }
  for (const name of made) {
    animals.push(name);
    species[name] = species[c.animal] || "Reptile";
    const ini = (x) => String(x || "").replace(/[^A-Za-z]/g, "").slice(0, 1).toUpperCase() || "X";
    profiles[name] = {
      code: year.slice(2) + "-" + ini(c.animal) + ini(c.partner) + "-" + String(k - 1).padStart(2, "0"),
      sex: "Unknown",
      hatchDate: c.hatchDate || today(),
      dam: c.animal,
      sire: c.partner || "",
      notes: c.litter ? "Born to " + c.animal + (c.partner ? " × " + c.partner : "") + " litter." : "Hatched from " + c.animal + (c.partner ? " × " + c.partner : "") + " clutch laid " + c.date + ".",
    };
  }
  const updated = { ...c, hatchlings: [...(c.hatchlings || []), ...made] };
  entries = entries.map((e) => (e === c ? updated : e));
  try {
    saveRoster();
    scaleStoreSet("scaleTellProfiles03", JSON.stringify(profiles));
    save();
  } catch (e) {
    return alert("Could not add hatchlings. Browser storage may be full.");
  }
  alert("✓ Added " + made.length + " hatchling" + (made.length === 1 ? "" : "s") + " to My Reptiles. You can rename them anytime.");
  render();
}
function breederMarkup() {
  if (!stCanUseBreeder()) return breederLocked();
  if (current === "Racks & Breeding") return breederHome();
  if (current === "Rack Setup") return rackSetupMarkup();
  if (current === "Rack View") return rackViewMarkup();
  if (current === "Rack Feeding") return rackFeedingMarkup();
  if (current === "Pairing") return pairingMarkup();
  if (current === "Clutch") return clutchMarkup();
  return "";
}
function breederHeading() {
  const r = racks[breederRackId];
  if (current === "Rack View") return r ? r.name : "Rack";
  if (current === "Rack Feeding") return r ? "Feed " + r.name : "Rack feeding";
  if (current === "Rack Setup") return r ? "Edit rack" : "New rack";
  if (current === "Pairing") return breederEditId ? "Pairing" : "New pairing";
  if (current === "Clutch") return breederEditId ? (breedRecord()?.litter ? "Litter" : "Clutch") : "Log a clutch or litter";
  return current;
}
/* Keep tubs, partners and parents pointing at the right animal after a rename. */
function breederRename(oldName, newName) {
  let changed = false;
  const next = structuredClone(racks);
  for (const r of Object.values(next))
    for (const [k, v] of Object.entries(r.slots || {}))
      if (v === oldName) {
        r.slots[k] = newName;
        changed = true;
      }
  if (changed) saveRacks(next);
  entries.forEach((e) => {
    if (e.partner === oldName) e.partner = newName;
    if (Array.isArray(e.hatchlings)) e.hatchlings = e.hatchlings.map((h) => (h === oldName ? newName : h));
  });
  for (const p of Object.values(profiles)) {
    if (p && p.dam === oldName) p.dam = newName;
    if (p && p.sire === oldName) p.sire = newName;
  }
}

if ("serviceWorker" in navigator && isSecureContext)
  navigator.serviceWorker.register("./sw.js", { scope: "./", updateViaCache: "none" }).catch(() => {});
cloudInitialize();

/* V3.41 · Scale Hub: Bioactive & DIY How-Tos */
const DIY_GUIDES = [
  { t: "Bioactive basics", tag: "Bioactive", steps: [
    "Bioactive means a living, self-cleaning enclosure: soil, live plants and a cleanup crew (CUC) that breaks down waste and shed.",
    "Match it to the species. Tropical setups (crested geckos, many snakes and frogs) need steady humidity; arid setups (bearded dragons, leopard geckos) need dry soil and drought-hardy plants.",
    "Layers, bottom to top: drainage layer (tropical only), a mesh barrier, 3–6 in (8–15 cm) of soil mix, then leaf litter.",
    "Plant, then add the CUC. Let the enclosure settle 2–4 weeks before the animal moves in so plants root and the crew establishes.",
    "Still spot-clean large waste, and keep logging temps and humidity. A bioactive setup reduces cleaning; it doesn't replace care."] },
  { t: "Tropical soil mix", tag: "Bioactive", steps: [
    "A common base: about 40% organic topsoil (no fertilizer, pesticide or perlite), 20% coco fiber, 20% sphagnum or peat, 20% orchid bark, plus a handful of leaf litter and charcoal.",
    "Moisten until it clumps when squeezed but doesn't drip.",
    "Drainage layer under it: clay balls or lava rock, 1–2 in, separated from the soil by mesh so the soil doesn't wash down.",
    "If water pools in the drainage layer, remove it before it reaches the soil."] },
  { t: "Arid soil mix", tag: "Bioactive", steps: [
    "A common base: about 60% organic topsoil and 40% play sand (washed, no calcium sand), with some excavator clay if you want burrows to hold shape.",
    "Skip the drainage layer. Keep one corner slightly moist deeper down for the cleanup crew and plant roots.",
    "Use drought-hardy plants such as haworthia, gasteria and some aloe; avoid spiky or toxic species within reach."] },
  { t: "Choosing a cleanup crew", tag: "Bioactive", steps: [
    "Springtails handle mold and fine waste; isopods break down waste, shed and leaf litter. Most setups use both.",
    "Tropical: temperate white springtails plus isopods like dwarf whites or powder orange. Arid: dwarf white or other dry-tolerant isopods and a moist corner.",
    "Feed the crew lightly at first (fish flakes, leaf litter, cuttlebone for calcium).",
    "Add more leaf litter as it breaks down. A few isopods being eaten is normal; replace the crew if numbers crash."] },
  { t: "Safe plants", tag: "Bioactive", steps: [
    "Popular safe picks for tropical setups: pothos, snake plant (sansevieria), bromeliads, peperomia, ferns like bird's nest fern, and fittonia.",
    "Rinse plants and replace nursery soil, which can contain fertilizer and pesticides. Some keepers quarantine new plants for a few weeks first.",
    "Check each plant against a reptile-safe plant list for your species, especially for herbivores and omnivores that may eat them."] },
  { t: "DIY foam background", tag: "DIY", steps: [
    "Cut a styrofoam or rigid foam panel to the back wall and carve ledges and caves.",
    "Secure it with aquarium-safe silicone and fill gaps with low-expansion foam (use a pet-safe, fully cured product).",
    "Coat with grout or a cement/tile-grout mix in thin layers, colored with non-toxic paint or pigment.",
    "Seal with a water-based, non-toxic sealer (often several coats), then let it cure and air out fully, often a week or more, before any animal goes in."] },
  { t: "Using found wood, rocks and leaves", tag: "DIY", steps: [
    "Avoid aromatic or sappy woods such as cedar and pine. Hardwoods like oak, maple and grapewood are common choices.",
    "Avoid anything from sprayed areas or roadsides.",
    "Scrub, then bake wood at low heat (about 200–250°F / 95–120°C) until dry, or soak in a dilute bleach solution then rinse and dry very thoroughly.",
    "Boil or bake rocks; bake leaf litter (oak, magnolia) briefly to kill pests.",
    "Stack heavy rocks directly on the enclosure floor, not on substrate, so burrowing can't topple them."] },
  { t: "DIY hides and humid hides", tag: "DIY", steps: [
    "Quick hide: a plastic food container with an entry hole, sanded smooth so no sharp edges remain.",
    "Humid hide: the same container filled with damp sphagnum moss. Re-wet and replace the moss regularly to prevent mold.",
    "Cork bark rounds and flats make easy natural hides.",
    "Give every animal at least one hide on the warm side and one on the cool side."] },
];
let diyFilter = "";
function diyMarkup() {
  const tags = ["", "Bioactive", "DIY"];
  return '<p class="resourceIntro">Bioactive &amp; DIY How-Tos. Practical starting points from the Herps &amp; Hers community. Always check what your species needs.</p>' +
    '<div class="diyTabs">' + tags.map((t) => '<button class="' + (diyFilter === t ? "on" : "") + '" onclick="diyFilter=\'' + t + '\';render()">' + (t || "All") + "</button>").join("") + "</div>" +
    DIY_GUIDES.filter((g) => !diyFilter || g.tag === diyFilter).map((g) =>
      '<details class="diyGuide"><summary><b>' + esc(g.t) + '</b><span>' + g.tag + '</span></summary><ol>' + g.steps.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ol></details>").join("") +
    '<div id="hubPeer"></div><details class="diyGuide diySubmit"><summary><b>✎ Submit your own how-to</b><span>Reviewed first</span></summary>' + hubSubmitForm() + '</details><button class="action secondary" onclick="openPanel(\'Scale Hub\')">Back to Scale Hub</button>';
}

/* V3.41 · yearly plans through PayPal subscriptions */
let paypalSubLoader = null, stPlanIds = null;
function stLoadPayPalSub(clientId) {
  if (window.paypalSub?.Buttons) return Promise.resolve(window.paypalSub);
  if (paypalSubLoader) return paypalSubLoader;
  paypalSubLoader = new Promise((resolve, reject) => {
    const tag = document.createElement("script");
    tag.src = "https://www.paypal.com/sdk/js?client-id=" + encodeURIComponent(clientId) + "&vault=true&intent=subscription&components=buttons";
    tag.setAttribute("data-namespace", "paypalSub");
    tag.onload = () => (window.paypalSub?.Buttons ? resolve(window.paypalSub) : reject(Error("PayPal did not load.")));
    tag.onerror = () => reject(Error("PayPal could not load. Check your connection and try again."));
    document.head.appendChild(tag);
  }).catch((e) => { paypalSubLoader = null; throw e; });
  return paypalSubLoader;
}
async function stStartSub(sku) {
  const box = document.getElementById("sub-" + sku);
  if (!box) return;
  if (!cloudSession || !cloudClient) { box.innerHTML = '<p class="planSoon">Sign in first, then choose your plan.</p>'; return; }
  const isMember = stOwnsEntitlements() && stSkus.includes("member");
  box.innerHTML = (isMember ? '<label class="lcSmall">Your name in the Herps &amp; Hers group (optional)<input id="subGroup-' + sku + '" maxlength="80"></label>' : "") +
    '<p class="planSoon" id="subMsg-' + sku + '">Loading secure checkout…</p><div id="subBtns-' + sku + '"></div>';
  const msg = (t) => { const m = document.getElementById("subMsg-" + sku); if (m) m.textContent = t; };
  try {
    const conf = await founderPayPalConfig();
    if (!stPlanIds) stPlanIds = (await founderInvoke({ action: "plans" })).plans || {};
    const planKey = sku === "rescue" && stPlanIds.rescue_verified ? "rescue_verified" : sku;
    if (!stPlanIds[planKey]) throw Error("This plan isn't available yet. Please try again soon.");
    const pp = await stLoadPayPalSub(conf.clientId);
    msg(conf.live ? "Billed yearly. Cancel anytime in PayPal." : "Test mode: no real money is charged.");
    await pp.Buttons({
      style: { shape: "pill", label: "subscribe" },
      createSubscription: (data, actions) => actions.subscription.create({ plan_id: stPlanIds[planKey], custom_id: cloudSession.user.id }),
      onApprove: async (data) => {
        msg("Confirming with PayPal…");
        const groupName = document.getElementById("subGroup-" + sku)?.value || "";
        for (let i = 0; i < 6; i++) {
          try {
            const r = await founderInvoke({ action: "subscribed", subscriptionId: data.subscriptionID, groupName });
            if (r.active) { await founderRefreshEntitlement(); stToast("Welcome, " + ST_PLANS[sku].name + " ♡"); render(); return; }
          } catch (e) { msg(e.message); }
          await new Promise((r) => setTimeout(r, 5000));
        }
        msg("Payment received. Your plan unlocks automatically within a few minutes.");
      },
      onError: () => msg("PayPal had a problem. Please try again."),
    }).render("#subBtns-" + sku);
  } catch (e) { msg(e.message || "Checkout is unavailable right now."); }
}

/* V3.54 · App update emails: keepers choose in My Account; admins send updates from the Menu. */
let stEmailPref = null;
function stEmailPrefMarkup() {
  if (stEmailPref === null) setTimeout(stEmailPrefLoad, 0);
  return '<label class="emailPref"><input type="checkbox" id="emailUpd" ' + (stEmailPref ? "checked" : "") + (stEmailPref === null ? " disabled" : "") +
    ' onchange="stEmailPrefSet(this.checked)"> Email me about app updates and new features</label><p class="lcSmall" id="emailUpdMsg">A few emails a year. Unsubscribe anytime.</p>';
}
async function stEmailPrefLoad() {
  if (!cloudClient || !cloudSession || stEmailPref !== null) return;
  try {
    const { data } = await cloudClient.from("email_prefs").select("updates").eq("user_id", cloudSession.user.id).maybeSingle();
    stEmailPref = data ? !!data.updates : false;
  } catch (e) { stEmailPref = false; }
  const b = document.getElementById("emailUpd");
  if (b) { b.disabled = false; b.checked = stEmailPref; }
}
async function stEmailPrefSet(on) {
  const m = document.getElementById("emailUpdMsg");
  try {
    const { error } = await cloudClient.from("email_prefs").update({ updates: on, updated_at: new Date().toISOString() }).eq("user_id", cloudSession.user.id);
    if (error) throw error;
    stEmailPref = on;
    if (m) m.textContent = on ? "✓ You’ll get app update emails." : "✓ You won’t get app update emails.";
  } catch (e) {
    if (m) m.textContent = "Couldn’t save. Please try again.";
    const b = document.getElementById("emailUpd"); if (b) b.checked = !on;
  }
}
async function stAdminCheck() {
  if (!cloudClient || !cloudSession) return;
  try {
    const { data } = await cloudClient.from("app_admins").select("user_id").eq("user_id", cloudSession.user.id).maybeSingle();
    window.__stIsAdmin = !!data;
    if (window.__stIsAdmin && current === "Menu") render();
  } catch (e) {}
}
let stMailState = { subject: "", body: "", msg: "", stats: null };
async function stMailStats() {
  try { stMailState.stats = await hubInvoke({ action: "email_count" }); if (current === "Send Update Email") render(); } catch (e) {}
}
async function stMailSend(test) {
  stMailState.subject = document.getElementById("mailSubj")?.value.trim() || "";
  stMailState.body = document.getElementById("mailBody")?.value.trim() || "";
  const msg = (t) => { stMailState.msg = t; const m = document.getElementById("mailMsg"); if (m) m.textContent = t; };
  if (!stMailState.subject || !stMailState.body) return msg("Add a subject and a message.");
  const grp = stMailState.aud || "all";
  if (!test && !confirm("Send “" + stMailState.subject + "” to " + (stMailState.stats?.groups?.[grp] ?? "everyone in this group who's subscribed") + " " + (grp === "all" ? "" : grp + " ") + "now?")) return;
  msg(test ? "Sending you a test…" : "Sending…");
  try {
    const r = await hubInvoke({ action: "email_broadcast", subject: stMailState.subject, body: stMailState.body, test, audience: stMailState.aud || "all" });
    if (test) msg("✓ Test sent to " + (r.to || cloudSession?.user?.email || "you") + ". It can take a few minutes; check spam too.");
    else { stMailState = { subject: "", body: "", msg: "✓ Sent to " + r.sent + " people ♡", stats: null, aud: stMailState.aud }; render(); }
  } catch (e) { msg(e.message); }
}

/* V3.41 · Govee: keepers connect their own Govee API key (stored on our server, never in the browser) */
async function hubInvoke(body) {
  if (!cloudClient || !cloudSession) throw Error("Sign in first.");
  const { data, error } = await cloudClient.functions.invoke("scale-hub", { body });
  if (error) {
    let m = "";
    try { m = (await error.context?.json?.())?.error || ""; } catch (e) {}
    throw Error(m || "Something went wrong. Please try again.");
  }
  return data || {};
}
let goveeState = { connected: null, devices: null, msg: "" };
function goveeMarkup() {
  const g = goveeState, linked = devices.filter((d) => d.goveeDevice);
  let body = "";
  if (g.connected === null) body = '<p class="helperLine">Checking your Govee connection…</p>';
  else if (!g.connected)
    body = '<h3 class="sectionTitle">1 · Get your Govee API key</h3><ol class="goveeSteps"><li>Open the <b>Govee Home</b> app.</li><li>Tap <b>Profile</b>, then the <b>⚙ Settings</b> gear.</li><li>Tap <b>Apply for API Key</b>, fill in your name and reason (for example “Logging my reptile enclosure temps in Scale &amp; Tell”).</li><li>Govee emails you the key, usually within minutes.</li></ol>' +
      '<h3 class="sectionTitle">2 · Paste it here</h3><label>Govee API key<input id="goveeKey" autocomplete="off" spellcheck="false" placeholder="Paste the key from Govee’s email"></label><button class="action" onclick="goveeConnect()">Connect Govee</button>' +
      '<p class="lcSmall">Your key is stored securely on the Scale &amp; Tell server and only used to read your sensors. You can disconnect anytime. Works with Govee thermometer-hygrometers on Wi-Fi or linked to a Govee gateway; Bluetooth-only sensors don’t share readings with Govee’s cloud.</p>';
  else {
    const opts = animals.map((a) => '<option>' + esc(a) + "</option>").join("");
    body = '<p class="helperLine">✓ Govee connected.</p>' +
      (linked.length ? '<h3 class="sectionTitle">Linked sensors</h3>' + linked.map((d) => '<div class="deviceCard"><div class="deviceHeading"><b>' + esc(d.nickname) + "</b><span>" + esc(d.animal) + " · " + esc(d.placement) + '</span></div><small class="lcSmall">' + esc(sensorAlertText(d)) + '</small><button class="deviceLink" onclick="sensorAlertIdx=' + devices.indexOf(d) + ';openPanel(\'Sensor Alerts\')">🔔 Alert range</button><button class="deviceLink" onclick="goveePull(' + devices.indexOf(d) + ')">Pull reading</button></div>').join("") + '<button class="action" onclick="goveePullAll()">Pull all readings now</button>' : "") +
      '<h3 class="sectionTitle">Your Govee sensors</h3>' +
      (g.devices === null ? '<p class="helperLine">Loading your sensors…</p>'
        : !g.devices.length ? '<p class="helperLine">No Govee thermometers found on this account. Make sure the sensor is set up in the Govee Home app and online.</p>'
        : g.devices.map((x, k) => {
            const on = linked.find((d) => d.goveeDevice === x.device);
            return '<div class="deviceCard"><div class="deviceHeading"><b>' + esc(x.name) + "</b><span>" + esc(x.sku) + "</span></div>" +
              (on ? '<small>Linked to ' + esc(on.animal) + "</small>"
                : animals.length ? '<div class="goveeLink"><select id="gvA' + k + '">' + opts + '</select><select id="gvP' + k + '">' + ["Warm side", "Cool side", "Ambient"].map((o) => "<option>" + o + "</option>").join("") + '</select><button class="action" onclick="goveeLinkDevice(' + k + ')">Link</button></div>'
                : '<small>Add an animal first, then link this sensor.</small>') + "</div>";
          }).join("")) +
      '<button class="action secondary" onclick="goveeDisconnect()">Disconnect Govee</button>';
  }
  return '<p class="resourceIntro">Connect your Govee thermometers and pull temperature and humidity into each animal’s habitat log.</p>' + body +
    '<p id="goveeMsg" role="status" class="helperLine">' + esc(g.msg) + "</p>";
}
async function goveeLoad() {
  if (goveeState.connected !== null && (goveeState.connected === false || goveeState.devices !== null)) return;
  if (!cloudSession) { goveeState.msg = "Sign in to connect Govee."; goveeState.connected = false; return goveeRerender(); }
  try {
    if (goveeState.connected === null) goveeState.connected = !!(await hubInvoke({ action: "govee_status" })).connected;
    if (goveeState.connected && goveeState.devices === null) goveeState.devices = (await hubInvoke({ action: "govee_devices" })).devices || [];
  } catch (e) { goveeState.msg = e.message; if (goveeState.connected === null) goveeState.connected = false; if (goveeState.devices === null) goveeState.devices = []; }
  goveeRerender();
}
function goveeRerender() { if (current === "Govee Sensors") render(); }
async function goveeConnect() {
  const key = document.getElementById("goveeKey")?.value.trim();
  if (!key) return;
  goveeState.msg = "Checking your key with Govee…"; goveeRerender();
  try { await hubInvoke({ action: "govee_connect", key }); goveeState = { connected: true, devices: null, msg: "Connected ♡" }; }
  catch (e) { goveeState.msg = e.message; }
  goveeRerender(); goveeLoad();
}
async function goveeDisconnect() {
  if (!confirm("Disconnect Govee? Your logged readings stay in your journal.")) return;
  try { await hubInvoke({ action: "govee_disconnect" }); } catch (e) {}
  saveDevices(devices.map((d) => { if (!d.goveeDevice) return d; const c = { ...d }; delete c.goveeDevice; delete c.goveeSku; return c; }));
  goveeState = { connected: false, devices: null, msg: "Govee disconnected." };
  goveeRerender();
}
function goveeLinkDevice(k) {
  const x = goveeState.devices?.[k], animal = document.getElementById("gvA" + k)?.value, placement = document.getElementById("gvP" + k)?.value || "Warm side";
  if (!x || !animals.includes(animal)) return;
  saveDevices(devices.concat([{ id: deviceId(), kind: "sensor", animal, nickname: x.name.slice(0, 55), brand: "Govee", model: x.sku, link: "", placement, metrics: "Temperature + humidity", goveeSku: x.sku, goveeDevice: x.device }]));
  goveeState.msg = x.name + " linked to " + animal + " ♡";
  sensorAlertIdx = devices.length - 1;
  openPanel("Sensor Alerts");
}
async function goveePull(i, quiet) {
  const d = devices[i];
  if (!d?.goveeDevice) return false;
  try {
    const r = await hubInvoke({ action: "govee_read", sku: d.goveeSku, device: d.goveeDevice });
    // V3.83: Govee sends an empty reading (shows up as 0°F / 0%) when the sensor isn't reachable online. Never log that.
    const z = (v) => v == null || v === "" || Number(v) === 0;
    if (r.online === false || (z(r.tempF) && z(r.humidity)))
      throw Error("Govee didn’t send a reading for " + (d.nickname || "this sensor") + ". Bluetooth-only Govee thermometers (like the H5075 and H5104) need a Govee Wi-Fi gateway (like the H5151) to share readings online. Check that it shows as online in the Govee Home app.");
    const t = r.tempF == null ? "" : String(Math.round(r.tempF * 10) / 10), h = r.humidity == null ? "" : String(Math.round(r.humidity));
    const e = { section: "Enclosure Care", animal: d.animal, detail: "Govee reading", date: today(), warmTemp: "", coolTemp: "", humidity: h,
      notes: "Pulled from Govee · " + d.nickname + " (" + d.placement + ")" + (d.placement === "Ambient" && t ? " · ambient " + t + "°F" : "") };
    if (d.placement === "Cool side") e.coolTemp = t; else if (d.placement !== "Ambient") e.warmTemp = t;
    entries.push(e); save();
    if (!quiet) { stToast(d.animal + ": " + (t ? t + "°F" : "") + (t && h ? " · " : "") + (h ? h + "% humidity" : "") + " logged ♡"); render(); }
    return true;
  } catch (err) { if (!quiet) stToast(err.message); return false; }
}
async function goveePullAll() {
  const list = devices.map((d, i) => (d.goveeDevice ? i : -1)).filter((i) => i >= 0);
  let ok = 0;
  for (const i of list) if (await goveePull(i, true)) ok++;
  stToast(ok + " of " + list.length + " Govee readings logged ♡");
  render();
}

/* V3.41 · Scale Hub community how-tos (reviewed before posting, then tagged "Peer reviewed") */
let hubPeer = null;
async function hubLoadPeer() {
  if (hubPeer === null && cloudClient) {
    try {
      const { data } = await cloudClient.from("hub_submissions").select("id,category,title,steps,credit_name,status").eq("status", "approved").order("created_at", { ascending: false }).limit(100);
      hubPeer = data || [];
    } catch (e) { hubPeer = []; }
  }
  const box = document.getElementById("hubPeer");
  if (!box || !hubPeer) return;
  const list = hubPeer.filter((g) => !diyFilter || g.category === diyFilter);
  box.innerHTML = list.length ? '<h3 class="sectionTitle">From the community</h3>' + list.map((g) =>
    '<details class="diyGuide"><summary><b>' + esc(g.title) + '</b><span class="peerTag">✓ Peer reviewed</span></summary><ol>' + (g.steps || []).map((x) => "<li>" + esc(x) + "</li>").join("") + "</ol>" +
    (g.credit_name ? '<small class="diyCredit">Shared by ' + esc(g.credit_name) + " · " + esc(g.category) + "</small>" : "") + "</details>").join("") : "";
}
function hubSubmitForm() {
  return '<p class="lcSmall">Share a build, mix or method. We review every how-to before it’s posted, then it appears here with a <b>Peer reviewed</b> tag.</p>' +
    '<label>Category<select id="hubCat"><option>Bioactive</option><option>DIY</option></select></label>' +
    '<label>Title<input id="hubTitle" maxlength="90" placeholder="e.g. Budget isopod culture for bioactive"></label>' +
    '<label>Steps (one per line)<textarea id="hubSteps" rows="6" maxlength="6000" placeholder="1. What you used&#10;2. How you did it&#10;3. Tips or what to avoid"></textarea></label>' +
    '<label>Credit me as (optional)<input id="hubCredit" maxlength="60" placeholder="Your name or handle"></label>' +
    '<button class="action" onclick="hubSubmit()">Send for review</button><p id="hubMsg" role="status" class="helperLine"></p>';
}
async function hubSubmit() {
  const v = (id) => document.getElementById(id)?.value || "", msg = (t) => { const m = document.getElementById("hubMsg"); if (m) m.textContent = t; };
  const steps = v("hubSteps").split(/\n+/).map((x) => x.replace(/^\s*\d+[.)]\s*/, "").trim()).filter(Boolean);
  if (v("hubTitle").trim().length < 3 || !steps.length) return msg("Add a title and at least one step.");
  msg("Sending…");
  try {
    await hubInvoke({ action: "submit_howto", category: v("hubCat"), title: v("hubTitle"), steps, credit: v("hubCredit") });
    ["hubTitle", "hubSteps", "hubCredit"].forEach((id) => { const el = document.getElementById(id); if (el) el.value = ""; });
    msg("Thank you ♡ Your how-to was sent for review. Once approved it appears here, tagged Peer reviewed.");
  } catch (e) { msg(e.message); }
}

/* V3.43 · camera shortcuts open the brand's own app (falls back to the app store if it isn't installed) */
const CAMERA_APPS = {
  Wyze: { name: "Wyze", ios: "wyze://", android: "com.hualai" },
  Ring: { name: "Ring", ios: "ring://", android: "com.ringapp" },
  Blink: { name: "Blink", ios: "immedia-blink://", android: "com.immediasemi.android.blink" },
  Tapo: { name: "Tapo", ios: "tapo://", android: "com.tplink.iot" },
  Kasa: { name: "Kasa", ios: "kasa://", android: "com.tplink.kasa_android" },
  Eufy: { name: "eufy Security", ios: "eufysecurity://", android: "com.oceanwing.battery.cam" },
};
function openCameraApp(i) {
  const d = devices[i], app = d && CAMERA_APPS[d.brand];
  if (!app) return;
  const ua = navigator.userAgent || "";
  if (/Android/i.test(ua)) {
    // Android opens the app, or its Play Store page if it isn't installed.
    location.href = "intent://#Intent;package=" + app.android + ";S.browser_fallback_url=" + encodeURIComponent("https://play.google.com/store/apps/details?id=" + app.android) + ";end";
    return;
  }
  if (/iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
    let left = false;
    const away = () => { left = true; };
    document.addEventListener("visibilitychange", away, { once: true });
    window.addEventListener("pagehide", away, { once: true });
    location.href = app.ios;
    // If the app didn't open, show it in the App Store (tap "Open" there if it's installed).
    setTimeout(() => {
      if (!left && document.visibilityState === "visible")
        location.href = "itms-apps://search.itunes.apple.com/WebObjects/MZSearch.woa/wa/search?media=software&term=" + encodeURIComponent(app.name + " camera");
    }, 1600);
    return;
  }
  stToast("Open the " + app.name + " app on your phone to view " + d.nickname + ".");
}

/* ===================== V3.43 · Business Tools =====================
   Team logins (3 per breeder/rescue plan), public page + inquiry Inbox, branding,
   rescue profile & directory, MorphMarket export, and sharing an animal. */
function stTeamOwnerId() {
  try {
    const me = cloudSession?.user?.id;
    return (me && localStorage.getItem("scaleTellTeamOwner:" + me)) || null;
  } catch (e) {
    return null;
  }
}
function cloudJournalUid() {
  return stTeamOwnerId() || cloudSession?.user?.id;
}
function cloudSaveRpc(args) {
  const team = stTeamOwnerId();
  return team ? cloudClient.rpc("save_state_for", { p_owner: team, ...args }) : cloudClient.rpc("save_keeper_state", args);
}
let stTeam = null, bizUnread = 0, bizBrand = null, bizSeller = null, bizRescue = null, bizInbox = null, bizMsg = "";
const BIZ_TEAM_SKUS = ["founding_breeder", "rescue", "premium_breeder"];
function stCanTeam() {
  return stOwnsEntitlements() && stTeam?.role !== "member" && stSkus.some((k) => BIZ_TEAM_SKUS.includes(k));
}
function stCanBrand() {
  return stOwnsEntitlements() && stTeam?.role !== "member" && stSkus.some((k) => k === "rescue" || k === "premium_breeder");
}
function stIsRescue() {
  return stOwnsEntitlements() && stTeam?.role !== "member" && stSkus.includes("rescue");
}
/** Accept any waiting invite, learn the team role, and switch this browser to the right journal. */
async function stSyncTeam() {
  const me = cloudSession?.user?.id;
  if (!me || !cloudClient) return null;
  try {
    await cloudClient.rpc("accept_team_invites");
  } catch (e) {}
  let ctx = null;
  try {
    const r = await cloudClient.rpc("team_context");
    if (r.error) return stTeam;
    ctx = r.data;
  } catch (e) {
    return stTeam;
  }
  stTeam = ctx;
  const next = ctx?.role === "member" ? ctx.owner_id : null,
    prev = stTeamOwnerId();
  if ((next || null) !== (prev || null)) {
    const key = "scaleTellTeamOwner:" + me,
      owner = localStorage.getItem("scaleTellSyncOwner33"),
      dirty = localStorage.getItem("scaleTellSyncDirty33") === "1";
    // Only switch journals when this browser's copy is safely saved to its own account.
    if (dirty || (cloudHasLocal() && owner !== (prev || me))) return ctx;
    cloudPauseWrites = true;
    try {
      for (let k of Object.keys(CLOUD_LOCAL_KEYS)) localStorage.removeItem(k);
      ["scaleTellSyncOwner33", "scaleTellSyncRev33", "scaleTellSyncDirty33"].forEach((k) => localStorage.removeItem(k));
      if (next) localStorage.setItem(key, next);
      else localStorage.removeItem(key);
    } finally {
      cloudPauseWrites = false;
    }
    stToast(next ? "Opening the shared journal…" : "Opening your own journal…");
    setTimeout(() => location.reload(), 700);
  }
  bizLoadBrand();
  bizCountUnread();
  return ctx;
}
async function bizCountUnread() {
  if (!cloudClient || !(stCanTeam() || stTeam?.role === "member")) return;
  try {
    const { count } = await cloudClient.from("inquiries").select("id", { count: "exact", head: true }).eq("owner_id", cloudJournalUid()).eq("status", "new");
    bizUnread = count || 0;
    if (current === "Menu") render();
  } catch (e) {}
}

/* ---------- Branding (Premium Breeder & Rescue; team members see the owner's) ---------- */
async function bizLoadBrand() {
  if (!cloudClient || !cloudSession) return;
  const uid = cloudSession.user.id;
  try {
    const { data, error } = await cloudClient.from("brand_settings").select("business_name,accent,logo_path").eq("user_id", cloudJournalUid()).maybeSingle();
    if (error) throw error;
    bizBrand = data || null;
    if (bizBrand?.logo_path) {
      const r = await cloudClient.storage.from(CLOUD_BUCKET).createSignedUrl(bizBrand.logo_path, 3600 * 12);
      bizBrand.logoUrl = r.data?.signedUrl || "";
    }
    try {
      if (bizBrand) localStorage.setItem("scaleTellBrandCache", JSON.stringify({ uid, brand: bizBrand }));
      else localStorage.removeItem("scaleTellBrandCache");
    } catch (e) {}
  } catch (e) {
    // Offline or slow: keep the colors already showing rather than flashing back to the default.
  }
  window.__stBrandLoaded = true;
  bizApplyBrand();
}
/* Apply the last saved business colors right away on launch; the live copy replaces them a moment later. */
function bizApplyCachedBrand() {
  try {
    const c = JSON.parse(localStorage.getItem("scaleTellBrandCache") || "null");
    if (c && c.uid && c.uid === stLastOwner() && c.brand) { bizBrand = c.brand; bizApplyBrand(); }
  } catch (e) {}
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(bizApplyCachedBrand, 0));
else setTimeout(bizApplyCachedBrand, 0);
function bizLum(hex) {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function bizContrast(x, y) {
  const a = bizLum(x), b = bizLum(y);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
function bizShade(hex, amt) {
  // amt < 0 darkens toward black, amt > 0 lightens toward white.
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
}
function bizApplyBrand() {
  document.getElementById("bizBrandChip")?.remove();
  const hello = document.querySelector(".homeHello");
  let banner = document.getElementById("bizBanner"), css = document.getElementById("bizBrandCss");
  const on = bizBrand && (bizBrand.business_name || bizBrand.logoUrl);
  if (!on) {
    if (window.__stBrandOn) { window.__stBrandOn = false; stSetTheme(stCanUsePack() ? stSavedTheme : "original"); }
    banner?.remove();
    css?.remove();
    if (hello) hello.style.display = "";
    return;
  }
  // Their brand replaces the welcome banner on the home screen.
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "bizBanner";
    hello?.after(banner);
  }
  if (hello) hello.style.display = "none";
  banner.innerHTML = (bizBrand.logoUrl ? '<img alt="" src="' + esc(bizBrand.logoUrl) + '">' : "") +
    '<div><b>' + esc(bizBrand.business_name || "") + '</b><small>Powered by Scale &amp; Tell ♡ Herps &amp; Hers</small></div>';
  // Their color becomes the app's accent: buttons, headings, tabs and badges.
  const a = /^#[0-9a-f]{6}$/i.test(bizBrand.accent || "") ? bizBrand.accent : null;
  const was = window.__stBrandOn;
  window.__stBrandOn = !!a;
  if (was !== window.__stBrandOn) stSetTheme(stCanUsePack() ? stSavedTheme : "original");
  if (!a) { css?.remove(); return; }
  if (!css) { css = document.createElement("style"); css.id = "bizBrandCss"; document.head.appendChild(css); }
  // Every color is checked for contrast, so any brand color a keeper picks stays easy to read.
  const light = bizShade(a, 0.85), soft = bizShade(a, 0.93);
  let dark = bizShade(a, -0.35);
  for (let k = -0.45; bizContrast(dark, "#ffffff") < 5 && k >= -0.9; k -= 0.1) dark = bizShade(a, k);
  let glow = bizShade(a, 0.45); // text on the dark app designs
  for (let k = 0.55; bizContrast(glow, "#1d2a24") < 5.5 && k <= 0.95; k += 0.1) glow = bizShade(a, k);
  const onFill = bizContrast(a, "#ffffff") >= 4.5 ? "#ffffff" : bizContrast(a, "#ffffff") >= 3 && bizContrast(a, "#1b1b1b") < 6 ? "#ffffff" : "#1b1b1b";
  const D = (sel) => sel.split(",").map((x) => 'body[data-st-theme="forest"] ' + x + ',body[data-st-theme="violet"] ' + x).join(",");
  const heads = ".homeSecHead h2,.sectionTitle,.sheet h2,.modal h2,.resourceTile strong,.menuTile strong,.homeCardText b,.homeToday h2,.homeToday h3,.lcPanel h3,.productCard h3";
  css.textContent =
    ".action:not(.secondary),.homeViewAll,.homeTodayActions button,.diyTabs button.on,.menuFeature,#bizBanner{background:" + a + "!important;color:" + onFill + "!important;border-color:" + a + "!important}" +
    ".action.secondary,.homeTodayActions button+button{background:" + light + "!important;color:" + dark + "!important}" +
    heads + "{color:" + dark + "!important}" +
    ".stBadge{background:" + dark + "!important;color:#fff!important}.rackMini i{background:" + light + "}.rackMini i.on{background:" + a + "!important}.rackMini{background:" + soft + "!important}" +
    ".homeCard,.resourceTile,.menuTile,.deviceCard,.diyGuide{border-color:" + light + "!important}" +
    ".homeCardAdd,.homePetsLink{border-color:" + a + "!important;color:" + dark + "!important}" +
    "a{color:" + dark + "}" +
    // Dark app designs (Forest Green, Deep Purple): headings and links switch to a light tint of the brand color.
    D(heads + ",.homeCardAdd,.homePetsLink,a") + "{color:" + glow + "!important}" +
    D(".rackMini") + "{background:rgba(255,255,255,.06)!important}" +
    // The bottom bar is artwork, so it is re-tinted from the app's purple to the brand hue.
    ".homeNav img{filter:hue-rotate(" + bizHueShift(a) + "deg) saturate(" + bizSatScale(a) + ")}" +
    // Text sitting on a filled brand color uses whichever of white or near-black reads best.
    ".menuFeature strong,.menuFeature small,.action:not(.secondary) *,#bizBanner b,#bizBanner small{color:" + onFill + "!important}";
}

function bizBrandPrint(html) {
  if (!bizBrand || !(bizBrand.business_name || bizBrand.logoUrl)) return html;
  const bar = '<div style="display:flex;align-items:center;gap:10px;padding:8px 0 10px;margin-bottom:10px;border-bottom:3px solid ' + esc(bizBrand.accent || "#45205b") + ';font-family:Arial,sans-serif">' +
    (bizBrand.logoUrl ? '<img src="' + esc(bizBrand.logoUrl) + '" style="height:44px;max-width:120px;object-fit:contain">' : "") +
    '<b style="font-size:18px;color:' + esc(bizBrand.accent || "#45205b") + '">' + esc(bizBrand.business_name || "") + "</b></div>";
  return html.replace(/<body([^>]*)>/i, (m) => m + bar);
}
async function bizSaveBrand() {
  const v = (id) => document.getElementById(id)?.value || "";
  const say = (t) => { bizMsg = t; const m = document.getElementById("bizMsg"); if (m) m.textContent = t; };
  let logo = bizBrand?.logo_path || "";
  const file = document.getElementById("bizLogo")?.files?.[0];
  try {
    if (file) {
      if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 1500000) return say("Use a PNG, JPG or WebP logo under 1.5 MB.");
      logo = cloudSession.user.id + "/brand/logo-" + Date.now() + "." + (file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg");
      const up = await cloudClient.storage.from(CLOUD_BUCKET).upload(logo, file, { upsert: true, contentType: file.type });
      if (up.error) throw up.error;
    }
    const accent = /^#[0-9a-f]{6}$/i.test(v("bizAccent")) ? v("bizAccent") : null;
    const { data, error } = await cloudClient.rpc("save_brand", { p_name: v("bizName").trim().slice(0, 60), p_accent: accent, p_logo: logo || null });
    if (error) throw error;
    if (data !== "ok") return say(data === "plan" ? "Branding is part of Premium Breeder and Rescue plans." : "Couldn’t save that logo.");
    await bizLoadBrand();
    say("Saved ♡ Your logo and color now show in the app and on your Care Binder printouts.");
  } catch (e) {
    say(e.message || "Couldn’t save your branding.");
  }
}

/* ---------- Share an animal (any app via the phone's share menu) ---------- */
async function stShareAnimal(a) {
  if (!animals.includes(a)) return;
  const p = profiles[a] || {},
    w = entries.filter((e) => e.animal === a && e.section === "Weight Tracker").sort((x, y) => y.date.localeCompare(x.date))[0];
  const lines = [
    a + (p.morph ? " · " + p.morph : ""),
    [species[a], p.sex].filter(Boolean).join(" · "),
    p.hatchDate ? "Hatched " + niceDate(p.hatchDate) : "",
    w ? "Weight " + w.detail : p.weight ? "Weight " + p.weight : "",
    bizBrand?.business_name ? "From " + bizBrand.business_name : "",
  ].filter(Boolean);
  const text = lines.join("\n") + "\n\nTracked with Scale & Tell ♡ scaleandtell.app";
  try {
    const ph = typeof chosenProfilePhoto === "function" ? chosenProfilePhoto(a) || (photos[a] || [])[0] : null;
    let files = [];
    if (ph?.src && /^data:image\//.test(ph.src)) {
      const blob = await (await fetch(ph.src)).blob();
      files = [new File([blob], a.replace(/[^\w-]+/g, "_") + "." + (blob.type.split("/")[1] || "jpg"), { type: blob.type })];
    }
    if (navigator.share) {
      const data = files.length && navigator.canShare?.({ files }) ? { text, files } : { text };
      await navigator.share(data);
      return;
    }
    await navigator.clipboard.writeText(text);
    stToast("Copied ♡ Paste it into your post.");
  } catch (e) {
    if (e?.name !== "AbortError") stToast("Couldn’t open sharing on this device.");
  }
}

/* ---------- MorphMarket bulk-import export ---------- */
function mmMaturity(hatch) {
  if (!hatch || !validDate(hatch)) return "";
  const months = (Date.now() - new Date(hatch + "T12:00:00").getTime()) / (30.44 * 86400000);
  return months < 4 ? "baby" : months < 12 ? "juvenile" : months < 24 ? "subadult" : "adult";
}
function mmCsv() {
  const pick = Array.from(document.querySelectorAll(".mmPick:checked")).map((x) => x.value);
  if (!pick.length) return "";
  const head = ["Category", "Title", "Animal_Id", "Maturity", "Price", "State", "Visibility", "Enabled", "Sex", "Dob", "Weight", "Quantity", "Traits", "Desc", "Origin", "Prey_Food", "Is_Rep_Photo"];
  const q = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
  const rows = pick.filter((a) => animals.includes(a)).map((a) => {
    const p = profiles[a] || {},
      sex = /^m/i.test(p.sex || "") ? "male" : /^f/i.test(p.sex || "") ? "female" : "unknown",
      w = entries.filter((e) => e.animal === a && e.section === "Weight Tracker").sort((x, y) => y.date.localeCompare(x.date))[0],
      grams = String((w ? w.detail : p.weight) || "").match(/[\d.]+/)?.[0] || "",
      dob = p.hatchDate && validDate(p.hatchDate) ? p.hatchDate.slice(8, 10) + "-" + p.hatchDate.slice(5, 7) + "-" + p.hatchDate.slice(0, 4) : "",
      prey = entries.filter((e) => e.animal === a && e.section === "Feeding Tracker" && e.preyType).sort((x, y) => y.date.localeCompare(x.date))[0]?.preyType || "";
    const sl = p.sale || {}, forSale = ["Listed", "Pending"].includes(sl.status);
    return [String(species[a] || "").toLowerCase(), a, a, mmMaturity(p.hatchDate), sl.price || "", forSale ? (sl.status === "Pending" ? "On Hold" : "For Sale") : "Not For Sale", "private", "inactive", sex, dob, grams, 1,
      String(p.morph || "").replace(/[,/]+/g, " ").replace(/\s+/g, " ").trim().toLowerCase(), "", "self produced", prey, "FALSE"].map(q).join(",");
  });
  return [head.join(",")].concat(rows).join("\r\n");
}
function mmDownload() {
  const csv = mmCsv();
  const m = document.getElementById("bizMsg");
  if (!csv) { if (m) m.textContent = "Pick at least one animal."; return; }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" }));
  a.download = "scale-and-tell-morphmarket-" + today() + ".csv";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  if (m) m.textContent = "Downloaded ♡ On MorphMarket: Seller tools → Import → upload this file. Listings come in as private drafts, so add prices and photos, then publish.";
}

/* ---------- Panels ---------- */
const bizBack = () => '<button class="action secondary" onclick="openPanel(\'Business Tools\')">← Business Tools</button>';
const BIZ_PANELS = {
  "Business Tools": () => {
    if (stTeam?.role === "member")
      return '<p class="resourceIntro">You’re on <b>' + esc(stTeam.owner_email || "a") + '</b>’s team. You share their journal: animals, racks, logs, reminders and photos.</p>' +
        '<button class="resourceTile" onclick="openPanel(\'Inbox\')"><strong>✉ Inbox' + (bizUnread ? " · " + bizUnread + " new" : "") + '</strong><small>Inquiries from their public page.</small></button>' +
        '<button class="action secondary" onclick="bizLeaveTeam()">Leave this team</button><p id="bizMsg" class="helperLine" role="status"></p>';
    if (!stCanTeam()) return '<p class="resourceIntro">Business Tools come with Founding Breeder, Premium Breeder and Rescue plans.</p><button class="action" onclick="openPanel(\'Plans\')">See plans</button>';
    const t = (name, title, sub) => '<button class="resourceTile" onclick="openPanel(\'' + name + '\')"><strong>' + title + "</strong><small>" + sub + "</small></button>";
    const R = stIsRescue(), B = bizIsBreeder(), P = stIsPremium(), h = (x) => '<h3 class="sectionTitle">' + x + "</h3>", RO = R && !B;
    return '<p class="resourceIntro">Tools for running your ' + (RO ? "rescue" : "breeding business") + '.</p>' +
      h("Team &amp; messages") +
      t("Team Logins", "♡ Team logins", "Invite up to " + (stLogins() - 1) + " people (" + stLogins() + " logins total).") +
      t("Inbox", "✉ Inbox" + (bizUnread ? " · " + bizUnread + " new" : ""), R ? "Messages, adoption applications and surrender requests." : "Inquiries from your public page and website.") +
      t("My Public Page", "✦ Public page &amp; social links", "Your link for your website, Facebook and Instagram bio.") +
      t("Alerts", "🔔 Alerts", "Choose which notifications reach your phone.") +
      (R ? h("Rescue") + t("Rescue Animals", "♧ Rescue animals", "Intake, quarantine, medical, available, adopted.") +
        t("Fosters", "⌂ Foster homes", "Who is fostering which animal, with their own login.") +
        t("Adoption Contract", "✍ Adoption contracts", "Adopters sign on their phone. Signed copies are saved.") +
        t("Impact Report", "★ Year-end impact report", "Intakes, adoptions and vet costs for grants and donors.") +
        t("Rescue Profile", "♧ Rescue profile &amp; intake", "Your Scale Hub listing, intake open/full and 501(c)(3) verification.") +
        t("Donate Button", "♡ Donate button", "Add a donate link to your public page.") +
        t("Rescue Layout", "⚙ Racks or enclosures", "Currently: " + (accountPrefs?.rescueLayout === "racks" ? "racks" : "enclosures") + ".") : "") +
      h(RO ? "Adoptions &amp; money" : "Sales &amp; money") +
      t("Sales", RO ? "$ Adoption listings" : "$ Listings &amp; sales", RO ? "Available, pending and adopted, with fees." : "Listed, holds and deposits, sold, shipped and received. Expo mode for shows.") +
      t("Money", "◎ Income &amp; expenses", "Money in and out, and a spreadsheet for taxes.") +
      t("Customers", "♡ Customers", RO ? "Adopters and what they took home." : "Buyers, repeat customers and what they took home.") +
      (P ? t("Invoices", "🧾 Invoices &amp; receipts", "Branded invoices and paid receipts. Download or email.") + t("Sales Summary", "📈 " + (RO ? "Adoption" : "Sales") + " summary", "By month and species, average price and repeat " + (RO ? "adopters" : "buyers") + ".") : "") +
      (P && !RO ? t("Waitlist", "⏳ Waitlist", "Buyers waiting on a pairing, first come first served.") + t("Ship Weather", "🌡 Shipping weather check", "Is it safe to ship that day, at both ends?") : "") +
      h("Animals") +
      (B ? t("Hatchlings", "🐣 Hatchlings &amp; babies", "First shed, first meal and a ready-to-sell checklist.") : "") +
      (P && !RO ? t("Genetics Calculator", "🧬 Genetics calculator", "Pick two animals and see the possible babies.") : "") +
      t("Feeders", "🐁 Feeder stock", "Counts go down as you feed. A reminder before you run out.") +
      (P ? t("Bulk Import", "⇩ Bulk import", "Add many animals from a spreadsheet or MorphMarket export.") : "") +
      (stCanBrand() ? h("Your brand") + t("Branding", "❦ Your logo &amp; colors", "Shows in the app and on printouts.") + t("MorphMarket Export", "⇪ MorphMarket export", "Download your animals in MorphMarket’s bulk-import format.")
        : '<p class="lcSmall">Premium Breeder adds a genetics calculator, invoices, bulk import, a shipping weather check, a waitlist, a sales summary, your logo &amp; colors and MorphMarket export.</p>');
  },
  "Team Logins": () => {
    if (stTeam?.role === "member")
      return '<p class="resourceIntro">You’re sharing <b>' + esc(stTeam.owner_email || "their") + '</b>’s journal: animals, logs, reminders and photos.</p><button class="action secondary" onclick="bizLeaveTeam()">Leave this journal</button><p id="bizMsg" class="helperLine" role="status"></p>';
    const mem = stTeam?.members || [], L = stLogins(), back = stCanTeam() ? bizBack() : '<button class="action secondary" onclick="openPanel(\'Menu\')">← Menu</button>';
    if (L < 2) return '<p class="resourceIntro">Share your journal with family or helpers. Founding Keeper includes 3 logins; $29.99 plans include 5.</p><button class="action" onclick="openPanel(\'Plans\')">See plans</button>' + back;
    return '<p class="resourceIntro">Invite up to ' + (L - 1) + ' people (' + L + ' logins total, including you). They sign in with their own email and password and share your journal: animals, logs, reminders and photos.</p>' +
      (mem.length ? mem.map((m) => '<div class="deviceCard"><div class="deviceHeading"><b>' + esc(m.email) + "</b><span>" + (m.status === "active" ? "✓ Joined" : "Invite sent") + '</span></div><div class="recordActions"><button onclick="bizRemoveMember(' + Number(m.id) + ')">Remove</button></div></div>').join("") : '<p class="helperLine">No one invited yet.</p>') +
      (mem.length < L - 1 ? '<label>Their email<input id="bizInvite" type="email" maxlength="254" placeholder="helper@example.com"></label><button class="action" onclick="bizInviteMember()">Send invite</button>' : '<p class="lcSmall">You’re using all ' + L + ' logins.</p>') +
      '<p class="lcSmall">They’ll get an email. Once they sign in or create an account with that email, your journal opens for them automatically. Your plan covers them; they don’t need their own.</p><p id="bizMsg" class="helperLine" role="status">' + esc(bizMsg) + "</p>" + back;
  },
  Inbox: () => '<p class="resourceIntro">Messages sent from your public page. Replies are emailed from Scale &amp; Tell, and their replies come straight to your email.</p><div id="bizInbox"><p class="helperLine">Loading…</p></div><p id="bizMsg" class="helperLine" role="status"></p>' + bizBack(),
  "My Public Page": () => {
    const s = bizSeller || {}, link = s.slug ? "https://scaleandtell.app/inquire.html?b=" + s.slug : "";
    const f = (id, label, val, ph) => '<label>' + label + '<input id="' + id + '" maxlength="200" value="' + esc(val || "") + '" placeholder="' + ph + '"></label>';
    return '<p class="resourceIntro">Your public page shows your name, social links and a message form. Put the link in your website, Facebook and Instagram bio. Messages land in your Inbox.</p>' +
      (link ? '<div class="habitatSummary"><strong>Your link</strong><p><a href="' + esc(link) + '" target="_blank" rel="noopener">' + esc(link) + '</a></p><button class="action secondary" onclick="navigator.clipboard.writeText(\'' + esc(link) + '\').then(()=>stToast(\'Link copied ♡\'))">Copy link</button></div>' : "") +
      f("spName", "Business or rescue name", s.display_name, "Your business name") +
      f("spSlug", "Link name (letters, numbers, dashes)", s.slug, "e.g. sunny-scales") +
      '<label>Short bio<textarea id="spBio" maxlength="300" rows="3" placeholder="What you breed or rescue, where you are">' + esc(s.bio || "") + "</textarea></label>" +
      f("spFacebook", "Facebook link", s.facebook, "https://facebook.com/…") + f("spInstagram", "Instagram link", s.instagram, "https://instagram.com/…") +
      f("spTiktok", "TikTok link", s.tiktok, "https://tiktok.com/@…") + f("spWebsite", "Website", s.website, "https://…") + f("spMorphmarket", "MorphMarket store", s.morphmarket, "https://morphmarket.com/stores/…") +
      '<label class="checkLine"><input type="checkbox" id="spInq" ' + (s.inquiries_on === false ? "" : "checked") + "> Accept messages</label>" +
      '<button class="action" onclick="bizSaveSeller()">Save public page</button><p id="bizMsg" class="helperLine" role="status">' + esc(bizMsg) + "</p>" + bizBack();
  },
  Branding: () => {
    const b = bizBrand || {};
    return '<p class="resourceIntro">Add your logo and brand color. They show at the top of the app for you and your team, and on your Care Binder and printables.</p>' +
      (b.logoUrl ? '<img class="bizLogoPreview" alt="Your logo" src="' + esc(b.logoUrl) + '">' : "") +
      '<label>Business name<input id="bizName" maxlength="60" value="' + esc(b.business_name || "") + '"></label>' +
      '<label>Logo (PNG, JPG or WebP)<input id="bizLogo" type="file" accept="image/png,image/jpeg,image/webp"></label>' +
      '<label>Brand color<input id="bizAccent" type="color" value="' + esc(b.accent || "#79538e") + '"></label>' +
      '<button class="action" onclick="bizSaveBrand()">Save branding</button><p id="bizMsg" class="helperLine" role="status">' + esc(bizMsg) + "</p>" + bizBack();
  },
  "Rescue Profile": () => {
    const r = bizRescue || {}, f = (id, label, val, ph, max = 90) => '<label>' + label + '<input id="' + id + '" maxlength="' + max + '" value="' + esc(val || "") + '" placeholder="' + ph + '"></label>';
    const ver = { none: "Not verified", pending: "⏳ Verification pending", approved: "✓ Verified 501(c)(3)", declined: "Not approved. Contact support@scaleandtell.app" }[r.verification || "none"];
    return '<p class="resourceIntro">Your rescue’s listing in Scale Hub → Reptile Rescues. Add your EIN to verify your 501(c)(3): verified rescues pay $14.99/yr instead of $29.99 and get a ✓ Verified mark.</p>' +
      '<div class="habitatSummary"><strong>Intake</strong><p>' + (r.org_name ? (r.intake_open === false ? "🔴 Intake full" : "🟢 Intake open") : "Save your profile first.") + "</p>" +
      (r.org_name ? '<button class="action secondary" onclick="bizSetIntake(' + (r.intake_open === false) + ')">' + (r.intake_open === false ? "Mark intake open" : "Mark intake full") + "</button>" : "") + "</div>" +
      f("rpOrg", "Rescue name", r.org_name, "Your rescue") + f("rpEin", "EIN (for 501(c)(3) verification, optional)", r.ein, "12-3456789", 12) +
      '<p class="lcSmall">Status: <b>' + esc(ver) + "</b></p>" +
      f("rpArea", "Area served", r.area, "City, State") + f("rpEmail", "Contact email", r.contact_email, "intake@yourrescue.org", 254) +
      f("rpPhone", "Phone (optional)", r.phone, "", 30) + f("rpWeb", "Website (https://…)", r.website, "https://", 200) +
      '<label>About<textarea id="rpAbout" maxlength="400" rows="3">' + esc(r.about || "") + "</textarea></label>" +
      '<label class="checkLine"><input type="checkbox" id="rpListed" ' + (r.listed === false ? "" : "checked") + "> Show my rescue in Scale Hub</label>" +
      '<button class="action" onclick="bizSaveRescue()">Save rescue profile</button><p id="bizMsg" class="helperLine" role="status">' + esc(bizMsg) + "</p>" + bizBack();
  },
  "MorphMarket Export": () =>
    '<p class="resourceIntro">Pick animals and download a file in MorphMarket’s bulk-import format. On MorphMarket, go to your seller tools → <b>Import</b> and upload it. Listings arrive as private drafts so you can add prices and photos before publishing.</p>' +
    '<div class="mmActions"><button class="action secondary" onclick="document.querySelectorAll(\'.mmPick\').forEach(x=>x.checked=true)">Select all</button><button class="action secondary" onclick="document.querySelectorAll(\'.mmPick\').forEach(x=>x.checked=false)">Clear</button></div>' +
    '<div class="mmList">' + animals.map((a) => '<label class="checkLine"><input type="checkbox" class="mmPick" value="' + esc(a) + '"> ' + esc(a) + ' <small>' + esc([species[a], profiles[a]?.morph].filter(Boolean).join(" · ")) + "</small></label>").join("") + "</div>" +
    '<button class="action" onclick="mmDownload()">Download MorphMarket file</button><p id="bizMsg" class="helperLine" role="status"></p>' + bizBack(),
  "Reptile Rescues": () => '<p class="resourceIntro">Reptile rescues using Scale &amp; Tell. Reach out before dropping off an animal: intake changes quickly.</p><div id="bizRescues"><p class="helperLine">Loading…</p></div><button class="action secondary" onclick="openPanel(\'Scale Hub\')">Back to Scale Hub</button>',
};
async function bizAfterRender(name) {
  bizMsg = "";
  try {
    if (name === "Inbox") return bizLoadInbox();
    if (name === "Reptile Rescues") return bizLoadRescues();
    if (name === "Team Logins" && cloudClient) { const r = await cloudClient.rpc("team_context"); if (!r.error && r.data) { const changed = JSON.stringify(r.data.members) !== JSON.stringify(stTeam?.members); stTeam = r.data; if (changed && current === name) render(); } }
    if (name === "My Public Page" && bizSeller === null && cloudClient) { const { data } = await cloudClient.from("seller_profiles").select("*").eq("user_id", cloudSession.user.id).maybeSingle(); bizSeller = data || {}; if (current === name) render(); }
    if (name === "Rescue Profile" && bizRescue === null && cloudClient) { const { data } = await cloudClient.from("rescue_profiles").select("*").eq("user_id", cloudSession.user.id).maybeSingle(); bizRescue = data || {}; if (current === name) render(); }
  } catch (e) {}
}
async function bizInviteMember() {
  const email = (document.getElementById("bizInvite")?.value || "").trim();
  try {
    const { data, error } = await cloudClient.rpc("invite_team_member", { p_email: email });
    if (error) throw error;
    const msgs = { plan: "Sharing comes with Founding Keeper and every paid plan.", invalid: "Enter a valid email.", self: "That’s your own email.", limit: "You’re using all " + stLogins() + " logins." };
    if (data !== "ok") { bizMsg = msgs[data] || "Couldn’t invite."; return render(); }
    try { await hubInvoke({ action: "team_invite_email", email }); } catch (e) {}
    bizMsg = "Invite sent to " + email + " ♡";
    const r = await cloudClient.rpc("team_context");
    if (!r.error) stTeam = r.data;
  } catch (e) { bizMsg = e.message || "Couldn’t invite."; }
  render();
}
async function bizRemoveMember(id) {
  if (!confirm("Remove this person from your team? They lose access to your journal right away.")) return;
  try { await cloudClient.rpc("remove_team_member", { p_id: id }); const r = await cloudClient.rpc("team_context"); if (!r.error) stTeam = r.data; bizMsg = "Removed."; } catch (e) { bizMsg = "Couldn’t remove."; }
  render();
}
async function bizLeaveTeam() {
  if (!confirm("Leave this team? You’ll go back to your own journal. Their journal stays with them.")) return;
  try { await cloudClient.rpc("leave_team"); } catch (e) {}
  await stSyncTeam();
}
async function bizLoadInbox() {
  const box = document.getElementById("bizInbox");
  if (!box || !cloudClient) return;
  const { data, error } = await cloudClient.from("inquiries").select("id,from_name,from_email,subject,message,status,created_at,kind,animal,details,inquiry_replies(body,created_at)").eq("owner_id", cloudJournalUid()).neq("status", "archived").order("created_at", { ascending: false }).limit(100);
  if (error) { box.innerHTML = '<p class="helperLine">Couldn’t load your Inbox.</p>'; return; }
  bizInbox = data || [];
  box.innerHTML = bizInbox.length ? bizInbox.map((m) =>
    '<details class="diyGuide inboxItem' + (m.status === "new" ? " inboxNew" : "") + '" ontoggle="if(this.open)bizMarkRead(' + m.id + ')"><summary><b>' + (m.kind && m.kind !== "message" ? '<span class="salePill sale' + (m.kind === "adoption" ? "Listed" : m.kind === "surrender" ? "Pending" : "Shipped") + '">' + { adoption: "Adoption application", surrender: "Surrender request", purchase: "Buyer" }[m.kind] + "</span> " : "") + esc(m.from_name) + (m.animal ? " · " + esc(m.animal) : m.subject ? " · " + esc(m.subject) : "") + "</b><span>" + esc(niceDate(String(m.created_at).slice(0, 10))) + (m.status === "new" ? " · new" : m.status === "replied" ? " · replied" : "") + "</span></summary>" +
    '<p class="lcSmall">' + esc(m.from_email) + '</p>' + (m.details && typeof m.details === "object" ? '<div class="incLog">' + Object.entries(m.details).map(([k, v]) => "<div><b>" + esc(k) + "</b><span>" + esc(v) + "</span></div>").join("") + "</div>" : "") + '<p class="inboxBody">' + esc(m.message) + "</p>" +
    (m.kind === "surrender" && stIsRescue() ? '<button class="action secondary" onclick="inboxToIntake(' + m.id + ')">Start intake from this request</button>' : "") +
    (m.kind === "adoption" && m.animal && animals.includes(m.animal) ? '<button class="action secondary" onclick="rescueOpen(\'' + esc(m.animal).replace(/'/g, "\\'") + '\')">Open ' + esc(m.animal) + "</button>" : "") +
    (m.inquiry_replies || []).map((r) => '<p class="inboxReply"><b>You:</b> ' + esc(r.body) + "</p>").join("") +
    '<textarea id="rep' + m.id + '" rows="3" maxlength="2000" placeholder="Write a reply…"></textarea><div class="recordActions"><button onclick="bizReply(' + m.id + ')">Send reply</button><button onclick="bizArchive(' + m.id + ')">Archive</button></div></details>').join("")
    : '<p class="helperLine">No messages yet. Share your public page link to start getting inquiries.</p>';
}
async function bizMarkRead(id) {
  const m = bizInbox?.find((x) => x.id === id);
  if (!m || m.status !== "new") return;
  m.status = "read";
  try { await cloudClient.rpc("set_inquiry_status", { p_id: id, p_status: "read" }); bizUnread = Math.max(0, bizUnread - 1); } catch (e) {}
}
async function bizReply(id) {
  const body = (document.getElementById("rep" + id)?.value || "").trim();
  if (!body) return;
  try { await hubInvoke({ action: "inquiry_reply", id, body }); stToast("Reply sent ♡"); bizLoadInbox(); } catch (e) { stToast(e.message); }
}
async function bizArchive(id) {
  try { await cloudClient.rpc("set_inquiry_status", { p_id: id, p_status: "archived" }); bizLoadInbox(); } catch (e) {}
}
async function bizSaveSeller() {
  const v = (id) => (document.getElementById(id)?.value || "").trim(), url = (x) => (x && !/^https:\/\//i.test(x) ? "https://" + x.replace(/^http:\/\//i, "") : x);
  try {
    const { data, error } = await cloudClient.rpc("save_seller_profile", { p_slug: v("spSlug").toLowerCase(), p_name: v("spName"), p_bio: v("spBio"), p_facebook: url(v("spFacebook")), p_instagram: url(v("spInstagram")),
      p_tiktok: url(v("spTiktok")), p_website: url(v("spWebsite")), p_morphmarket: url(v("spMorphmarket")), p_inquiries: !!document.getElementById("spInq")?.checked });
    if (error) throw error;
    const msgs = { plan: "Public pages come with breeder and rescue plans.", slug: "Link name: 3–40 lowercase letters, numbers or dashes.", taken: "That link name is taken. Try another." };
    if (data !== "ok") { bizMsg = msgs[data] || "Couldn’t save."; return render(); }
    bizSeller = null;
    bizMsg = "Saved ♡";
  } catch (e) { bizMsg = /check/i.test(e.message || "") ? "Check your name (2–60 characters) and links." : e.message || "Couldn’t save."; }
  render();
}
async function bizSaveRescue() {
  const v = (id) => (document.getElementById(id)?.value || "").trim();
  try {
    const web = v("rpWeb") && !/^https:\/\//i.test(v("rpWeb")) ? "https://" + v("rpWeb").replace(/^http:\/\//i, "") : v("rpWeb");
    const { data, error } = await cloudClient.rpc("save_rescue_profile", { p_org: v("rpOrg"), p_ein: v("rpEin"), p_area: v("rpArea"), p_email: v("rpEmail"), p_website: web, p_phone: v("rpPhone"), p_about: v("rpAbout"), p_listed: !!document.getElementById("rpListed")?.checked });
    if (error) throw error;
    if (data === "ein") { bizMsg = "An EIN has 9 digits, like 12-3456789."; return render(); }
    if (data === "pending") { try { await hubInvoke({ action: "rescue_submitted" }); } catch (e) {} bizMsg = "Saved ♡ We’re verifying your 501(c)(3). You’ll see the verified price once it’s approved."; }
    else bizMsg = "Saved ♡";
    bizRescue = null;
  } catch (e) { bizMsg = /check/i.test(e.message || "") ? "Check the rescue name (2–90 characters) and website (https://…)." : e.message || "Couldn’t save."; }
  render();
}
async function bizSetIntake(open) {
  try { await cloudClient.rpc("set_rescue_intake", { p_open: open }); bizRescue = null; stToast(open ? "Intake open 🟢" : "Intake full 🔴"); } catch (e) {}
  render();
}
async function bizLoadRescues() {
  const box = document.getElementById("bizRescues");
  if (!box) return;
  try {
    const client = cloudClient || window.supabase?.createClient(CLOUD_URL, CLOUD_PUBLIC_KEY);
    const { data, error } = await client.rpc("rescue_directory");
    if (error) throw error;
    box.innerHTML = (data || []).length ? data.map((r) =>
      '<div class="deviceCard"><div class="deviceHeading"><b>' + esc(r.org_name) + (r.verified ? ' <span class="peerTag">✓ Verified 501(c)(3)</span>' : "") + "</b><span>" + (r.intake_open ? "🟢 Intake open" : "🔴 Intake full") + "</span></div>" +
      (r.area ? "<p>" + esc(r.area) + "</p>" : "") + (r.about ? '<p class="lcSmall">' + esc(r.about) + "</p>" : "") +
      '<div class="recordActions">' + (r.contact_email ? '<a class="deviceLink" href="mailto:' + esc(r.contact_email) + '">Email</a>' : "") + (r.phone ? '<a class="deviceLink" href="tel:' + esc(r.phone.replace(/[^\d+]/g, "")) + '">Call</a>' : "") +
      (r.website ? '<a class="deviceLink" href="' + esc(r.website) + '" target="_blank" rel="noopener noreferrer">Website ↗</a>' : "") + "</div></div>").join("")
      : '<p class="helperLine">No rescues listed yet. Run a reptile rescue? The Rescue plan includes a free listing here.</p>';
  } catch (e) { box.innerHTML = '<p class="helperLine">Couldn’t load rescues right now.</p>'; }
}

/* V3.44 · Business home: breeders see racks and pairings first, rescues see racks; personal pets stay one tap away. */
function homeBusinessMode() {
  try {
    if (!stOwnsEntitlements()) return false;
    if (stSkus.some((k) => k === "founding_breeder" || k === "premium_breeder")) return true;
    // Rescues choose: racks get the rack layout, enclosures keep the regular layout (rescue tools either way).
    return stSkus.includes("rescue") && accountPrefs?.rescueLayout === "racks";
  } catch (e) {
    return false;
  }
}
function homeResetPersonal() {
  const t = document.getElementById("homeReptilesTitle"), v = document.querySelector(".homeReptiles .homeViewAll");
  if (t) t.textContent = "My Reptiles ♡";
  if (v) v.setAttribute("onclick", "openPanel('My Reptiles')");
  document.getElementById("homePairings")?.remove();
  document.getElementById("homePets")?.remove();
}
function rackMini(r) {
  const rows = Math.min(Number(r.rows) || 0, 8), cols = Math.min(Number(r.cols) || 0, 8);
  let cells = "";
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) cells += '<i class="' + (r.slots?.[i + "-" + j] ? "on" : "") + '"></i>';
  return '<span class="rackMini" style="grid-template-columns:repeat(' + Math.max(cols, 1) + ',1fr)" aria-hidden="true">' + cells + "</span>";
}
function renderHomeBusiness(row) {
  const rescue = stSkus.includes("rescue") && !stSkus.some((k) => k === "founding_breeder" || k === "premium_breeder");
  const rs = rackList(), inRacks = new Set(rs.flatMap((r) => Object.values(r.slots || {}).filter(Boolean)));
  const breeding = entries.filter((e) => e.section === "Breeding");
  const pairings = breeding.filter((e) => e.kind === "pairing" && e.status !== "done").sort((a, b) => b.date.localeCompare(a.date));
  const incubating = breeding.filter((e) => e.kind === "clutch" && !e.hatchDate);
  const pets = animals.filter((a) => !inRacks.has(a));
  const sec = row.closest(".homeReptiles");
  const t = document.getElementById("homeReptilesTitle"), v = sec?.querySelector(".homeViewAll");
  if (t) t.textContent = "My Racks ♡";
  if (v) v.setAttribute("onclick", "openPanel('Racks & Breeding')");
  const count = document.getElementById("homeCount");
  if (count)
    count.innerHTML = stBadgeMarkup() + " " + esc(rs.length + (rs.length === 1 ? " rack" : " racks") + " · " + animals.length + (animals.length === 1 ? " animal" : " animals") +
      (rescue ? "" : " · " + pairings.length + " active " + (pairings.length === 1 ? "pairing" : "pairings") + (incubating.length ? " · " + incubating.length + " incubating" : "")));
  row.classList.toggle("homeRowEmpty", !rs.length);
  row.innerHTML = rs.length
    ? rs.map((r) => {
        const filled = Object.values(r.slots || {}).filter(Boolean).length, total = (Number(r.rows) || 0) * (Number(r.cols) || 0);
        const due = Object.values(r.slots || {}).filter(Boolean).filter((a) => { const f = lastFeed(a); const n = carePlans[a]?.feedDays; return n && (!f || daysSince(f.date) >= n); }).length;
        return '<button class="homeCard rackCard" onclick="breederOpen(&quot;Rack View&quot;,&quot;' + esc(r.id) + '&quot;)">' + rackMini(r) +
          '<span class="homeCardText"><b>' + esc(r.name) + "</b><small>" + filled + " of " + total + " tubs" + (due ? " · " + due + " to feed" : "") + "</small></span></button>";
      }).join("") + '<button class="homeCard homeCardAdd" onclick="breederOpen(&quot;Rack Setup&quot;,&quot;&quot;)"><span aria-hidden="true">＋</span><small>Add rack</small></button>'
    : '<button class="homeFirst" onclick="breederOpen(&quot;Rack Setup&quot;,&quot;&quot;)"><span class="homeFirstPlus" aria-hidden="true">＋</span><strong>Set up your first rack</strong><small>Rows and tubs, then place your animals. Feed a whole rack in one go.</small></button>';
  // Pairings (breeders only)
  let ps = document.getElementById("homePairings");
  if (rescue) ps?.remove();
  else {
    if (!ps) { ps = document.createElement("section"); ps.id = "homePairings"; ps.className = "homeReptiles homeBizSec"; sec.after(ps); }
    ps.innerHTML = '<div class="homeSecHead"><h2>My Pairings ♡</h2><button class="homeViewAll" onclick="openPanel(\'Racks & Breeding\')">View All ›</button></div>' +
      '<div class="homeRow homePairRow">' +
      (pairings.length ? pairings.slice(0, 8).map((p) => {
        const last = Array.isArray(p.events) && p.events.length ? p.events[p.events.length - 1] : null;
        return '<button class="homeCard pairCard" onclick="breederOpen(&quot;Pairing&quot;,&quot;' + esc(p.id) + '&quot;)"><span class="homeCardText"><b>' + esc(p.animal) + " × " + esc(p.partner || "?") +
          "</b><small>" + (last ? esc(last.type) + " · " + agoText(last.date) : "Started " + agoText(p.date)) + "</small></span></button>";
      }).join("") : "") +
      '<button class="homeCard homeCardAdd" onclick="breederOpen(&quot;Pairing&quot;,&quot;&quot;)"><span aria-hidden="true">＋</span><small>New pairing</small></button>' +
      (incubating.length ? '<button class="homeCard pairCard clutchCard" onclick="openPanel(\'Racks & Breeding\')"><span class="homeCardText"><b>' + incubating.length + " incubating</b><small>Clutches</small></span></button>" : "") +
      "</div>";
  }
  // Sales strip
  let sp = document.getElementById("homeSales");
  const sr = saleRows().filter((r) => r.st !== "Received");
  if (!sr.length) sp?.remove();
  else {
    if (!sp) { sp = document.createElement("section"); sp.id = "homeSales"; sp.className = "homePets"; (ps && !rescue ? ps : sec).after(sp); }
    const c = (st) => sr.filter((r) => r.st === st).length;
    sp.innerHTML = '<button class="homePetsLink" onclick="openPanel(\'Sales\')"><b>My Sales</b><small>' + c("Listed") + " listed · " + c("Pending") + " pending · " + c("Sold") + " to ship · " + c("Shipped") + ' in transit</small><span aria-hidden="true">›</span></button>';
  }
  // Personal pets: animals not placed in a rack
  let pp = document.getElementById("homePets");
  if (!pp) { pp = document.createElement("section"); pp.id = "homePets"; pp.className = "homePets"; (document.getElementById("homeSales") || (ps && !rescue ? ps : sec)).after(pp); }
  pp.innerHTML = '<button class="homePetsLink" onclick="openPanel(\'My Reptiles\')"><b>' + (rescue ? "All animals" : "My pets &amp; all animals") + "</b><small>" +
    (pets.length ? esc(pets.slice(0, 4).join(", ")) + (pets.length > 4 ? " +" + (pets.length - 4) : "") + " not in a rack" : animals.length + " animals") + "</small><span aria-hidden=\"true\">›</span></button>";
}

/* V3.44 · Listings & sales (breeder / rescue accounts). Saved on each animal's profile so it syncs. */
const SALE_STATUSES = ["Not listed", "Listed", "Pending", "Sold", "Shipped", "Received"];
const SALE_SITES = ["MorphMarket", "Facebook", "Expo / in person", "Website", "Other"];
let saleAnimal = "", saleFilter = "Active";
function saleOf(a) {
  return (profiles[a] && profiles[a].sale) || {};
}
function saleStage(x) {
  // Dates move a sale forward even if the status wasn't changed by hand.
  if (x.receivedDate) return "Received";
  if (x.shippedDate) return "Shipped";
  return SALE_STATUSES.includes(x.status) ? x.status : "Not listed";
}
function saleOpen(a) {
  if (!animals.includes(a)) return;
  saleAnimal = a;
  openPanel("Sale Details");
}
function saleSave() {
  const a = saleAnimal;
  if (!animals.includes(a)) return;
  const v = (id) => (document.getElementById(id)?.value || "").trim();
  const d = (id) => (validDate(v(id)) ? v(id) : "");
  let url = v("slUrl");
  if (url && !/^https:\/\//i.test(url)) url = "https://" + url.replace(/^http:\/\//i, "");
  const next = { status: v("slStatus"), site: v("slSite"), price: v("slPrice").replace(/[^\d.]/g, "").slice(0, 10), url: url.slice(0, 300), listedDate: d("slListed"),
    buyer: v("slBuyer").slice(0, 80), buyerContact: v("slContact").slice(0, 120), soldDate: d("slSold"), shippedDate: d("slShipped"), receivedDate: d("slReceived"),
    tracking: v("slTracking").slice(0, 80), notes: v("slNotes").slice(0, 400), updated: today(),
    public: !!document.getElementById("slPublic")?.checked, publicNote: v("slPublicNote").slice(0, 300), holdFor: v("slHoldFor").slice(0, 80),
    deposit: v("slDeposit").replace(/[^\d.]/g, "").slice(0, 10), depositDate: d("slDepositDate"), balanceDue: d("slBalanceDue"), holdUntil: d("slHoldUntil"), shipDate: d("slShipDate") };
  if (next.status === "Not listed" && !next.buyer && !next.price) delete profiles[a].sale;
  else profiles[a] = { ...(profiles[a] || {}), sale: next };
  bizSaveProfiles();
  stToast(a + " · " + saleStage(next) + " ♡");
  openPanel("Sales");
}
function saleRows() {
  return animals.filter((a) => saleStage(saleOf(a)) !== "Not listed").map((a) => ({ a, x: saleOf(a), st: saleStage(saleOf(a)) }));
}
const salePill = (st) => '<span class="salePill sale' + st.replace(/\W/g, "") + '">' + esc(st) + "</span>";
BIZ_PANELS["Sale Details"] = () => {
  const a = saleAnimal, x = saleOf(a);
  if (!animals.includes(a)) return '<p class="helperLine">Pick an animal first.</p>';
  const f = (id, label, val, type = "text", ph = "") => '<label>' + label + '<input id="' + id + '" type="' + type + '" value="' + esc(val || "") + '" placeholder="' + ph + '"></label>';
  const sel = (id, label, opts, val) => '<label>' + label + '<select id="' + id + '">' + opts.map((o) => '<option' + (o === val ? " selected" : "") + ">" + esc(o) + "</option>").join("") + "</select></label>";
  return '<p class="resourceIntro"><b>' + esc(a) + "</b> · " + esc([species[a], profiles[a]?.morph].filter(Boolean).join(" · ")) + "</p>" +
    '<div class="saleGrid">' + sel("slStatus", "Status", SALE_STATUSES.slice(0, 4), x.status || "Listed") + sel("slSite", "Listed on", SALE_SITES, x.site || "MorphMarket") +
    f("slPrice", "Price ($)", x.price, "text", "250") + f("slListed", "Listed date", x.listedDate || (x.status ? "" : today()), "date") + "</div>" +
    f("slUrl", "Listing link (optional)", x.url, "url", "https://www.morphmarket.com/…") +
    '<label class="checkLine"><input type="checkbox" id="slPublic" ' + (x.public === false ? "" : "checked") + '> Show on my public page while listed</label>' +
    f("slPublicNote", "Public note (optional)", x.publicNote, "text", "Eating f/t hoppers, great feeder") +
    '<h3 class="sectionTitle">Hold &amp; deposit</h3><div class="saleGrid">' + f("slHoldFor", "On hold for", x.holdFor, "text", "Name") + f("slDeposit", "Deposit ($)", x.deposit) +
    f("slDepositDate", "Deposit received", x.depositDate, "date") + f("slBalanceDue", "Balance due", x.balanceDue, "date") + f("slHoldUntil", "Hold expires", x.holdUntil, "date") + "</div>" +
    '<h3 class="sectionTitle">Buyer</h3><div class="saleGrid">' + f("slBuyer", "Buyer name", x.buyer, "text", "Who bought") + f("slContact", "Buyer email or phone", x.buyerContact) +
    f("slSold", "Sold date", x.soldDate, "date") + "</div>" +
    '<h3 class="sectionTitle">Shipping</h3><div class="saleGrid">' + f("slShipDate", "Planned ship date", x.shipDate, "date") + f("slShipped", "Shipped date", x.shippedDate, "date") + f("slReceived", "Received date", x.receivedDate, "date") +
    f("slTracking", "Tracking number", x.tracking) + "</div>" +
    '<label>Notes<textarea id="slNotes" rows="3" maxlength="400" placeholder="Deposit, payment method, live arrival guarantee…">' + esc(x.notes || "") + "</textarea></label>" +
    '<p class="lcSmall">Adding a shipped or received date moves the sale along automatically.</p>' +
    '<div class="inlineActions"><button class="action" onclick="saleSave()">Save</button><button class="action secondary" onclick="packetOpen(saleAnimal,\'buyer\')">Buyer packet</button><button class="action secondary" onclick="transferAsk(saleAnimal)">Send records to buyer</button><button class="action secondary" onclick="openPanel(\'Sales\')">All sales</button><button class="action secondary" onclick="openPanel(saleAnimal)">Back to ' + esc(a) + "</button></div>";
};
BIZ_PANELS.Sales = () => {
  const all = saleRows(), count = (st) => all.filter((r) => r.st === st).length;
  const groups = { Active: ["Listed", "Pending", "Sold", "Shipped"], Listed: ["Listed"], Pending: ["Pending"], "To ship": ["Sold"], Shipped: ["Shipped"], Done: ["Received"] };
  const list = all.filter((r) => groups[saleFilter].includes(r.st)).sort((p, q) => SALE_STATUSES.indexOf(q.st) - SALE_STATUSES.indexOf(p.st) || p.a.localeCompare(q.a));
  const total = all.filter((r) => ["Sold", "Shipped", "Received"].includes(r.st)).reduce((s, r) => s + (Number(r.x.price) || 0), 0);
  return '<p class="resourceIntro">Track each animal from listing to arrival. Open an animal → More profile options → <b>Listing &amp; sale</b> to add one.</p>' +
    '<div class="saleStats"><span><b>' + count("Listed") + "</b> listed</span><span><b>" + count("Pending") + "</b> pending</span><span><b>" + count("Sold") + "</b> to ship</span><span><b>" + count("Shipped") + "</b> in transit</span><span><b>$" + total.toFixed(0) + "</b> sold</span></div>" +
    '<div class="diyTabs">' + Object.keys(groups).map((g) => '<button class="' + (g === saleFilter ? "on" : "") + '" onclick="saleFilter=\'' + g + '\';render()">' + g + "</button>").join("") + "</div>" +
    (list.length ? list.map(({ a, x, st }) => '<button class="resourceTile saleTile" onclick="saleOpen(\'' + esc(a).replace(/'/g, "\\'") + '\')"><strong>' + esc(a) + " " + salePill(st) + "</strong><small>" +
      esc([x.price ? "$" + x.price : "", x.site, x.buyer ? "Buyer: " + x.buyer : "", st === "Sold" && x.soldDate ? "sold " + niceDate(x.soldDate) : "", x.shippedDate ? "shipped " + niceDate(x.shippedDate) : "", x.receivedDate ? "received " + niceDate(x.receivedDate) : ""].filter(Boolean).join(" · ")) + "</small></button>").join("")
      : '<p class="helperLine">Nothing here yet.</p>') +
    '<button class="action secondary" onclick="openPanel(\'Expo Mode\')">🏷 Expo mode</button>' +
    '<label class="logSearchLabel">Add an animal<select id="saleAdd" onchange="if(this.value)saleOpen(this.value)"><option value="">Choose…</option>' + animals.filter((a) => saleStage(saleOf(a)) === "Not listed").map((a) => "<option>" + esc(a) + "</option>").join("") + "</select></label>" +
    '<button class="action secondary" onclick="openPanel(\'Business Tools\')">← Business Tools</button>';
};

/* V3.45 · My Year in Scales: a full-screen story slideshow built from the last 12 months. */
let yisSlides = [], yisIdx = 0, yisTimer = null, yisPaused = false;
const YIS_MS = 6500;
function yisGrams(e) {
  const m = String(e.detail || "").replace(",", ".").match(/([\d.]+)\s*(kg|g|lb|oz)?/i);
  if (!m) return null;
  const n = Number(m[1]), u = (m[2] || "g").toLowerCase();
  return u === "kg" ? n * 1000 : u === "lb" ? n * 453.6 : u === "oz" ? n * 28.35 : n;
}
function yisPhotos(a) {
  return (photos[a] || []).filter((p) => typeof p.src === "string" && /^data:image\/|^https?:|^blob:/.test(p.src));
}
function yisBuild() {
  const d = new Date(); d.setFullYear(d.getFullYear() - 1);
  const start = d.toISOString().slice(0, 10), yr = new Date().getFullYear();
  const recs = entries.filter((e) => e.section !== "Calendar" && e.date >= start && animals.includes(e.animal));
  const meals = recs.filter((e) => e.section === "Feeding Tracker" && e.detail !== "Refused");
  const refused = recs.filter((e) => e.section === "Feeding Tracker" && e.detail === "Refused");
  const sheds = recs.filter((e) => e.section === "Shed History");
  const days = new Set(recs.map((e) => e.date)).size;
  const top = (list) => { const c = {}; list.forEach((e) => (c[e.animal] = (c[e.animal] || 0) + 1)); return Object.entries(c).sort((x, y) => y[1] - x[1])[0]; };
  const preyC = {}; meals.forEach((e) => e.preyType && (preyC[e.preyType] = (preyC[e.preyType] || 0) + 1));
  const prey = Object.entries(preyC).sort((x, y) => y[1] - x[1])[0];
  const months = Array(12).fill(0), mNames = [];
  for (let i = 11; i >= 0; i--) { const m = new Date(); m.setDate(1); m.setMonth(m.getMonth() - i); mNames.push(m.toLocaleDateString("en-US", { month: "short" })); }
  recs.forEach((e) => { const dt = new Date(e.date + "T12:00"), now = new Date(); const diff = (now.getFullYear() - dt.getFullYear()) * 12 + now.getMonth() - dt.getMonth(); if (diff >= 0 && diff < 12) months[11 - diff]++; });
  const busiest = months.indexOf(Math.max(...months));
  const growth = animals.map((a) => {
    const w = recs.filter((e) => e.animal === a && e.section === "Weight Tracker").map((e) => ({ d: e.date, g: yisGrams(e) })).filter((x) => x.g).sort((x, y) => x.d.localeCompare(y.d));
    return w.length >= 2 ? { a, from: w[0].g, to: w[w.length - 1].g, pts: w } : null;
  }).filter(Boolean).sort((x, y) => (y.to - y.from) - (x.to - x.from));
  const allPhotos = animals.flatMap((a) => yisPhotos(a).filter((p) => !p.date || p.date >= start).map((p) => p.src));
  const portraits = animals.slice(0, 9).map((a) => portraitForAnimal(a).src);
  const pic = (src) => '<img alt="" src="' + esc(src) + '">';
  const S = [];
  S.push({ cls: "yisIntro", html: '<div class="yisCollage">' + portraits.map(pic).join("") + '</div><div class="yisCap"><small>Scale &amp; Tell presents</small><h1>My Year in Scales</h1><p>' + (bizBrand?.business_name ? esc(bizBrand.business_name) + " · " : "") + niceDate(start) + " – today</p></div>" });
  S.push({ html: '<small>This year you logged</small><div class="yisBig">' + recs.length + '</div><p>care moments for <b>' + animals.length + "</b> " + (animals.length === 1 ? "animal" : "animals") + ", on <b>" + days + "</b> different days.</p><p class=\"yisSub\">That's real dedication ♡</p>" });
  if (meals.length) {
    const t = top(meals);
    S.push({ html: '<small>Dinner is served</small><div class="yisBig">' + meals.length + "</div><p>meals eaten" + (refused.length ? " · " + refused.length + " refused (we see you, picky eaters)" : "") + ".</p>" +
      (t ? '<div class="yisStar">' + pic(portraitForAnimal(t[0]).src) + "<p><b>" + esc(t[0]) + "</b> was your biggest eater with <b>" + t[1] + "</b> meals.</p></div>" : "") +
      (prey ? '<p class="yisSub">Most served: ' + esc(prey[0]) + " (" + prey[1] + "×)</p>" : "") });
  }
  if (sheds.length) {
    const t = top(sheds);
    S.push({ html: '<small>Out with the old</small><div class="yisBig">' + sheds.length + "</div><p>sheds logged.</p>" + (t ? '<div class="yisStar">' + pic(portraitForAnimal(t[0]).src) + "<p><b>" + esc(t[0]) + "</b> shed the most: <b>" + t[1] + "</b> times.</p></div>" : "") });
  }
  if (growth.length) {
    const g = growth[0], min = Math.min(...g.pts.map((x) => x.g)), max = Math.max(...g.pts.map((x) => x.g)), rng = max - min || 1;
    const pts = g.pts.map((x, i) => (10 + (i * 280) / Math.max(1, g.pts.length - 1)).toFixed(1) + "," + (110 - ((x.g - min) / rng) * 90).toFixed(1)).join(" ");
    const diff = Math.round(g.to - g.from);
    S.push({ html: '<small>Growing up</small><div class="yisStar">' + pic(portraitForAnimal(g.a).src) + "<p><b>" + esc(g.a) + "</b> went from <b>" + Math.round(g.from) + " g</b> to <b>" + Math.round(g.to) + " g</b>.</p></div>" +
      '<div class="yisBig">' + (diff >= 0 ? "+" : "") + diff + ' g</div><svg class="yisChart" viewBox="0 0 300 120" aria-hidden="true"><polyline points="' + pts + '" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></svg>' +
      (growth.length > 1 ? '<p class="yisSub">Also growing: ' + growth.slice(1, 4).map((x) => esc(x.a) + " +" + Math.round(x.to - x.from) + " g").join(" · ") + "</p>" : "") });
  }
  if (recs.length) {
    const max = Math.max(...months, 1);
    S.push({ html: "<small>Your busiest month</small><h2>" + mNames[busiest] + '</h2><p><b>' + months[busiest] + '</b> care moments</p><div class="yisBars">' +
      months.map((v, i) => '<div class="' + (i === busiest ? "on" : "") + '"><i style="height:' + Math.max(4, (v / max) * 100) + '%"></i><span>' + mNames[i][0] + "</span></div>").join("") + "</div>" });
  }
  const breeding = entries.filter((e) => e.section === "Breeding" && e.date >= start);
  const clutches = breeding.filter((e) => e.kind === "clutch");
  if (breeding.length) {
    const eggs = clutches.reduce((n, c) => n + (Number(c.good) || 0), 0);
    S.push({ html: "<small>Breeding season</small><div class=\"yisTrio\"><div><b>" + breeding.filter((e) => e.kind === "pairing").length + "</b>pairings</div><div><b>" + clutches.length + "</b>clutches</div><div><b>" + eggs + "</b>good eggs</div></div><p>" + clutches.filter((c) => c.hatchDate).length + " clutches hatched this year.</p>" });
  }
  const sold = animals.filter((a) => { const x = profiles[a]?.sale; return x && ["Sold", "Shipped", "Received"].includes(x.status) || x?.shippedDate; });
  if (sold.length) S.push({ html: "<small>Sent to new homes</small><div class=\"yisBig\">" + sold.length + "</div><p>animals sold and on their way to new keepers ♡</p>" });
  // One slide per animal (up to 12)
  animals.slice(0, 12).forEach((a) => {
    const r = recs.filter((e) => e.animal === a), p = profiles[a] || {};
    const m = r.filter((e) => e.section === "Feeding Tracker" && e.detail !== "Refused").length, sh = r.filter((e) => e.section === "Shed History").length;
    const gr = growth.find((x) => x.a === a), ph = yisPhotos(a).length;
    S.push({ cls: "yisAnimal", bg: portraitForAnimal(a).src, html: '<div class="yisCap"><small>' + esc([species[a], p.morph].filter(Boolean).join(" · ")) + "</small><h2>" + esc(a) + '</h2><div class="yisTrio"><div><b>' + m + "</b>meals</div><div><b>" + sh + "</b>sheds</div><div><b>" + (gr ? (gr.to - gr.from >= 0 ? "+" : "") + Math.round(gr.to - gr.from) + "g" : ph) + "</b>" + (gr ? "grown" : "photos") + "</div></div></div>" });
  });
  if (allPhotos.length >= 3) S.push({ cls: "yisPhotos", html: '<div class="yisGrid">' + allPhotos.slice(-12).reverse().map(pic).join("") + '</div><div class="yisCap"><h2>Moments worth remembering</h2><p>' + allPhotos.length + " photos this year</p></div>" });
  S.push({ cls: "yisEnd", html: '<div class="yisCollage">' + portraits.map(pic).join("") + '</div><div class="yisCap"><h2>Here\'s to another year ♡</h2><p>Every scale. Every shed. Every milestone.</p><div class="yisBtns"><button onclick="event.stopPropagation();yisShare()">Share my year</button><button onclick="event.stopPropagation();yisGo(0)">Watch again</button></div><small>Scale &amp; Tell · Herps &amp; Hers</small></div>' });
  return { S, recs, meals, sheds, days };
}
function yisOpen() {
  if (!stCanUsePack()) return;
  if (!animals.length) { stToast("Add an animal first ♡"); return; }
  closePanel?.();
  yisSlides = yisBuild().S;
  let o = document.getElementById("yis");
  if (!o) {
    o = document.createElement("div");
    o.id = "yis";
    o.setAttribute("role", "dialog");
    o.setAttribute("aria-label", "My Year in Scales");
    document.body.appendChild(o);
    o.addEventListener("click", (e) => { if (e.target.closest("button")) return; const x = e.clientX / window.innerWidth; yisGo(yisIdx + (x < 0.3 ? -1 : 1)); });
    o.addEventListener("pointerdown", () => (yisPaused = true));
    o.addEventListener("pointerup", () => (yisPaused = false));
    document.addEventListener("keydown", (e) => { if (!document.getElementById("yis")?.classList.contains("on")) return; if (e.key === "Escape") yisClose(); if (e.key === "ArrowRight") yisGo(yisIdx + 1); if (e.key === "ArrowLeft") yisGo(yisIdx - 1); });
  }
  o.innerHTML = '<div class="yisBars2">' + yisSlides.map(() => "<i><b></b></i>").join("") + '</div><button class="yisClose" aria-label="Close" onclick="yisClose()">×</button><div class="yisStage"></div>';
  o.classList.add("on");
  document.body.style.overflow = "hidden";
  yisGo(0);
}
function yisGo(i) {
  if (i < 0) i = 0;
  if (i >= yisSlides.length) return yisClose();
  yisIdx = i;
  const o = document.getElementById("yis"), sl = yisSlides[i];
  if (!o) return;
  const stage = o.querySelector(".yisStage");
  stage.className = "yisStage " + (sl.cls || "") + " yisHue" + (i % 5);
  stage.style.backgroundImage = sl.bg ? 'url("' + sl.bg.replace(/"/g, "%22") + '")' : "";
  stage.innerHTML = '<div class="yisInner">' + sl.html + "</div>";
  o.querySelectorAll(".yisBars2 i").forEach((b, k) => { b.className = k < i ? "done" : k === i ? "now" : ""; });
  clearInterval(yisTimer);
  let t = 0;
  const bar = o.querySelectorAll(".yisBars2 i b")[i];
  if (i === yisSlides.length - 1) { if (bar) bar.style.width = "100%"; return; }
  yisTimer = setInterval(() => {
    if (yisPaused) return;
    t += 100;
    if (bar) bar.style.width = Math.min(100, (t / YIS_MS) * 100) + "%";
    if (t >= YIS_MS) yisGo(yisIdx + 1);
  }, 100);
}
function yisClose() {
  clearInterval(yisTimer);
  document.getElementById("yis")?.classList.remove("on");
  document.body.style.overflow = "";
}
async function yisShare() {
  const b = yisBuild();
  const text = "My Year in Scales ♡\n" + animals.length + " animals · " + b.recs.length + " care moments · " + b.meals.length + " meals · " + b.sheds.length + " sheds\nTracked with Scale & Tell · scaleandtell.app";
  try {
    if (navigator.share) await navigator.share({ text });
    else { await navigator.clipboard.writeText(text); stToast("Copied ♡ Paste it into your post."); }
  } catch (e) {}
}

/* V3.46 · Bottom bar for business accounts: breeders get My Racks + Pairings, rescues get My Racks. */
var HOME_NAVS = {
  personal: { img: "home-nav-hub.webp", slots: [["My Reptiles", "openPanel('My Reptiles')"], ["Calendar", "openPanel('Calendar')"], ["Care Logs", "openPanel('Care Logs')"]] },
  breeder: { img: "home-nav-breeder.webp", slots: [["My Racks", "openPanel('Racks & Breeding')"], ["Pairings", "homeOpenPairings()"], ["Calendar", "openPanel('Calendar')"]] },
  rescue: { img: "home-nav-rescue.webp", slots: [["My Racks", "openPanel('Racks & Breeding')"], ["Calendar", "openPanel('Calendar')"], ["Care Logs", "openPanel('Care Logs')"]] },
};
function homeNavApply() {
  const nav = document.querySelector(".homeNav .art");
  if (!nav) return;
  let kind = "personal";
  if (homeBusinessMode()) kind = stSkus.some((k) => k === "founding_breeder" || k === "premium_breeder") ? "breeder" : "rescue";
  if (nav.dataset.kind === kind || !HOME_NAVS) return;
  nav.dataset.kind = kind;
  const cfg = HOME_NAVS[kind], img = nav.querySelector("img"), hots = nav.querySelectorAll("button.hot");
  if (img) img.src = cfg.img;
  cfg.slots.forEach(([label, fn], i) => {
    const b = hots[i + 1];
    if (b) { b.setAttribute("aria-label", label); b.setAttribute("onclick", fn); }
  });
}
function homeOpenPairings() {
  openPanel("Racks & Breeding");
  setTimeout(() => {
    const h = Array.from(document.querySelectorAll("#sheet .sectionTitle")).find((x) => /^Pairings/.test(x.textContent));
    h?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 150);
}

/* V3.46 · Rescues pick their home layout once (changeable in Business Tools). */
function rescueMaybeAskLayout() {
  try {
    if (!stIsRescue() || stSkus.some((k) => k === "founding_breeder" || k === "premium_breeder")) return;
    if (accountPrefs?.rescueLayout) return;
    // Wait until the account's saved settings have arrived, so a keeper who already chose is never asked again.
    if (document.body.classList.contains("stBooting") || !["synced", "empty"].includes(cloudAutoStatus)) { setTimeout(rescueMaybeAskLayout, 1500); return; }
    if (accountPrefs?.rescueLayout) return;
    if (document.getElementById("sheet")?.classList.contains("on") || document.body.classList.contains("authLocked")) { setTimeout(rescueMaybeAskLayout, 4000); return; }
    openPanel("Rescue Layout");
  } catch (e) {}
}
function rescueSetLayout(v) {
  accountPrefsSet("rescueLayout", v);
  const nav = document.querySelector(".homeNav .art");
  if (nav) delete nav.dataset.kind;
  renderHomeCards();
  stToast(v === "racks" ? "Rack layout is on ♡" : "Enclosure layout is on ♡");
  closePanel();
}
BIZ_PANELS["Rescue Layout"] = () => {
  const cur = accountPrefs?.rescueLayout || "";
  return '<p class="resourceIntro"><b>Welcome, rescue ♡</b> Do you have racks set up, or enclosures? This helps us set up your account so you can manage your animals best.</p>' +
    '<button class="resourceTile' + (cur === "racks" ? " pickOn" : "") + '" onclick="rescueSetLayout(\'racks\')"><strong>▤ Racks</strong><small>Your home screen shows your racks and tubs first. Feed a whole rack at once.</small></button>' +
    '<button class="resourceTile' + (cur === "enclosures" ? " pickOn" : "") + '" onclick="rescueSetLayout(\'enclosures\')"><strong>⌂ Enclosures</strong><small>Your home screen shows each animal with its photo, like a keeper’s journal.</small></button>' +
    '<p class="lcSmall">Either way you keep every rescue tool: intake status, your listing, team logins, Inbox and adoption tracking. You can change this anytime in Business Tools.</p>';
};

function bizHsl(hex) {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  let h = 0, s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
}
function bizHueShift(hex) {
  return Math.round(bizHsl(hex).h - bizHsl("#79538e").h);
}
function bizSatScale(hex) {
  const s = bizHsl(hex).s, base = bizHsl("#79538e").s;
  return Math.max(0.15, Math.min(2, s / base)).toFixed(2);
}

/* ===================== V3.49 · Rescue & breeder toolkit + business alerts ===================== */
const bizUid = (p) => p + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
function bizSaveProfiles() {
  scaleStoreSet("scaleTellProfiles03", JSON.stringify(profiles));
  bizQueueAuto();
}
function bizIsBreeder() {
  return stOwnsEntitlements() && stSkus.some((k) => k === "founding_breeder" || k === "premium_breeder");
}
function bizDays(a, b) {
  return Math.round((new Date(b + "T12:00") - new Date(a + "T12:00")) / 864e5);
}
const bizMoney = (n) => "$" + (Number(n) || 0).toFixed(2).replace(/\.00$/, "");
function bizField(id, label, val, type = "text", ph = "", extra = "") {
  return '<label>' + label + '<input id="' + id + '" type="' + type + '" value="' + esc(val ?? "") + '" placeholder="' + esc(ph) + '" ' + extra + "></label>";
}
function bizSelect(id, label, opts, val) {
  return '<label>' + label + '<select id="' + id + '">' + opts.map((o) => '<option' + (o === val ? " selected" : "") + ">" + esc(o) + "</option>").join("") + "</select></label>";
}
const bizV = (id) => (document.getElementById(id)?.value || "").trim();
const bizD = (id) => (validDate(bizV(id)) ? bizV(id) : "");

/* ---------------- Rescue: statuses, intake, record, medications ---------------- */
const RESCUE_STATUSES = ["Intake", "Quarantine", "Medical hold", "Available", "Adoption pending", "Adopted", "Fostered", "Returned", "Passed"];
const RESCUE_SOURCES = ["Owner surrender", "Stray / found", "Seized / confiscated", "Transfer from another rescue", "Returned adoption", "Other"];
function rescueOf(a) {
  return (profiles[a] && profiles[a].rescue) || null;
}
function rescueStatus(a) {
  return rescueOf(a)?.status || "";
}
function rescueQuarantine(a) {
  const r = rescueOf(a);
  if (!r?.quarantineStart) return null;
  const total = Number(r.quarantineDays) || 90, day = bizDays(r.quarantineStart, today()) + 1;
  return { day: Math.max(1, day), total, end: advanceDate(r.quarantineStart, total), done: day > total };
}
let rescueAnimal = "", rescueFilter = "Active", medEditId = "";
function rescueOpen(a) {
  rescueAnimal = a;
  openPanel("Rescue Record");
}
BIZ_PANELS["Rescue Animals"] = () => {
  const list = animals.filter((a) => rescueOf(a));
  const count = (st) => list.filter((a) => rescueStatus(a) === st).length;
  const active = ["Intake", "Quarantine", "Medical hold", "Available", "Adoption pending", "Fostered"];
  const groups = { Active: active, Intake: ["Intake"], Quarantine: ["Quarantine"], Medical: ["Medical hold"], Available: ["Available", "Adoption pending"], Fostered: ["Fostered"], Adopted: ["Adopted"], Other: ["Returned", "Passed"] };
  const shown = list.filter((a) => groups[rescueFilter].includes(rescueStatus(a)));
  return '<div class="inlineActions"><button class="action" onclick="openPanel(\'Intake\')">＋ New intake</button><button class="action secondary" onclick="openPanel(\'Inbox\')">Applications &amp; surrenders</button></div>' +
    '<div class="rescueStages">' + active.concat(["Adopted"]).map((st) => '<button onclick="rescueFilter=\'' + (st === "Adoption pending" ? "Available" : st === "Medical hold" ? "Medical" : st) + '\';render()"><b>' + count(st) + "</b><span>" + st + "</span></button>").join("") + "</div>" +
    '<div class="diyTabs">' + Object.keys(groups).map((g) => '<button class="' + (g === rescueFilter ? "on" : "") + '" onclick="rescueFilter=\'' + g + '\';render()">' + g + "</button>").join("") + "</div>" +
    (shown.length ? shown.map((a) => {
      const r = rescueOf(a), q = rescueQuarantine(a), meds = (profiles[a]?.meds || []).filter((m) => !m.end || m.end >= today());
      return '<button class="resourceTile saleTile" onclick="rescueOpen(\'' + esc(a).replace(/'/g, "\\'") + '\')"><strong>' + esc(a) + ' <span class="salePill">' + esc(r.status) + "</span></strong><small>" +
        esc([species[a], r.intakeDate ? "in " + bizDays(r.intakeDate, today()) + " days" : "", q && !q.done && r.status === "Quarantine" ? "quarantine day " + q.day + "/" + q.total : "", meds.length ? meds.length + " active med" + (meds.length > 1 ? "s" : "") : "", r.foster ? "foster: " + r.foster : ""].filter(Boolean).join(" · ")) + "</small></button>";
    }).join("") : '<p class="helperLine">No animals here. Tap New intake to add one.</p>') +
    '<button class="action secondary" onclick="openPanel(\'Business Tools\')">← Business Tools</button>';
};
BIZ_PANELS.Intake = () =>
  '<p class="resourceIntro">Everything about a new arrival on one screen. Quarantine starts automatically and the animal joins your Intake list.</p>' +
  '<div class="saleGrid">' + bizField("inName", "Name or ID", "", "text", "e.g. Rescue 26-014") + bizField("inSpecies", "Species", "", "text", "Ball Python") +
  bizSelect("inSex", "Sex", ["Unknown", "Male", "Female"], "Unknown") + bizField("inDate", "Intake date", today(), "date") + "</div>" +
  '<div class="saleGrid">' + bizSelect("inSource", "How they came in", RESCUE_SOURCES, "Owner surrender") + bizField("inFrom", "Surrendered / brought by", "", "text", "Name") +
  bizField("inContact", "Their phone or email", "") + bizField("inWeight", "Intake weight (g)", "", "number", "", 'min="0" step="1"') + "</div>" +
  bizSelect("inCondition", "Body condition", ["Healthy", "Underweight", "Very thin", "Overweight", "Injured", "Unknown"], "Unknown") +
  '<label>Health problems on arrival<textarea id="inIssues" rows="3" maxlength="600" placeholder="Mites, stuck shed, burns, respiratory signs…"></textarea></label>' +
  '<div class="saleGrid">' + bizField("inQDays", "Quarantine length (days)", 90, "number", "", 'min="0" max="365"') + bizField("inVet", "Vet check due", advanceDate(today(), 7), "date") + "</div>" +
  '<label>Before photo (optional)<input type="file" id="inPhoto" accept="image/*"></label>' +
  '<div class="inlineActions"><button class="action" onclick="rescueSaveIntake()">Save intake</button><button class="action secondary" onclick="openPanel(\'Rescue Animals\')">Cancel</button></div><p id="bizMsg" class="helperLine" role="status"></p>';
async function rescueSaveIntake(fromInquiry) {
  const name = bizV("inName").slice(0, 50), sp = bizV("inSpecies").slice(0, 80) || "Animal", date = bizD("inDate") || today();
  const msg = (t) => { const m = document.getElementById("bizMsg"); if (m) m.textContent = t; };
  if (!name) return msg("Give the animal a name or ID.");
  if (animals.some((a) => a.toLowerCase() === name.toLowerCase())) return msg("That name is already used. Add a number, like " + name + " 2.");
  if (cloudSession && stOwnsEntitlements() && animals.length >= stAnimalLimit()) return stCanAddAnimal();
  const qd = Math.max(0, Math.min(365, Number(bizV("inQDays")) || 0));
  animals.push(name);
  species[name] = sp;
  profiles[name] = { sex: bizV("inSex") || "Unknown", rescue: { status: qd ? "Quarantine" : "Intake", intakeDate: date, source: bizV("inSource"), surrenderedBy: bizV("inFrom").slice(0, 80),
    contact: bizV("inContact").slice(0, 120), condition: bizV("inCondition"), issues: (document.getElementById("inIssues")?.value || "").trim().slice(0, 600),
    quarantineStart: qd ? date : "", quarantineDays: qd, vetDue: bizD("inVet"), fromInquiry: fromInquiry || "" } };
  const w = Number(bizV("inWeight"));
  entries.push({ section: "Observations", animal: name, detail: "Intake", date, notes: [bizV("inSource"), bizV("inCondition") !== "Unknown" ? "Condition: " + bizV("inCondition") : "", profiles[name].rescue.issues].filter(Boolean).join(" · ") });
  if (w > 0) entries.push({ section: "Weight Tracker", animal: name, detail: w + " g", date, notes: "Intake weight" });
  const file = document.getElementById("inPhoto")?.files?.[0];
  if (file) {
    try {
      const src = await new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = no; r.readAsDataURL(file); });
      if (typeof src === "string" && /^data:image\//.test(src)) { photos[name] = [...(photos[name] || []), { src, caption: "Intake", date }]; savePhotos(); }
    } catch (e) {}
  }
  saveRoster();
  bizSaveProfiles();
  save();
  stToast(name + " checked in ♡" + (qd ? " Quarantine: " + qd + " days" : ""));
  rescueOpen(name);
}
BIZ_PANELS["Rescue Record"] = () => {
  const a = rescueAnimal;
  if (!animals.includes(a)) return '<p class="helperLine">Pick an animal first.</p>';
  const r = rescueOf(a) || {}, q = rescueQuarantine(a), meds = profiles[a]?.meds || [];
  return '<p class="resourceIntro"><b>' + esc(a) + "</b> · " + esc(species[a] || "") + (r.intakeDate ? " · in rescue " + bizDays(r.intakeDate, today()) + " days" : "") + "</p>" +
    (q ? '<div class="habitatSummary"><strong>Quarantine ' + (q.done ? "complete ✓" : "day " + q.day + " of " + q.total) + "</strong><p>" + (q.done ? "Finished " + niceDate(q.end) : "Ends " + niceDate(q.end)) + "</p></div>" : "") +
    '<div class="saleGrid">' + bizSelect("rrStatus", "Status", RESCUE_STATUSES, r.status || "Intake") + bizField("rrQStart", "Quarantine start", r.quarantineStart, "date") +
    bizField("rrQDays", "Quarantine days", r.quarantineDays ?? 90, "number", "", 'min="0" max="365"') + bizField("rrVet", "Next vet check / follow-up", r.vetDue, "date") + "</div>" +
    '<h3 class="sectionTitle">Foster</h3><div class="saleGrid">' + bizField("rrFoster", "Foster home", r.foster, "text", "Name") + bizField("rrFosterContact", "Foster contact", r.fosterContact) + "</div>" +
    '<h3 class="sectionTitle">Adoption</h3><div class="saleGrid">' + bizField("rrFee", "Adoption fee ($)", r.fee) + bizField("rrAdopter", "Adopter", r.adopter) +
    bizField("rrAdopterContact", "Adopter email or phone", r.adopterContact) + bizField("rrAdopted", "Adoption date", r.adoptedDate, "date") + "</div>" +
    '<label>Public note for your page<input id="rrPublic" maxlength="300" value="' + esc(r.publicNote || "") + '" placeholder="Shy at first, eating f/t weekly, great beginner snake"></label>' +
    '<h3 class="sectionTitle">Intake details</h3><p class="lcSmall">' + esc([r.source, r.surrenderedBy ? "from " + r.surrenderedBy : "", r.contact, r.condition ? "condition: " + r.condition : ""].filter(Boolean).join(" · ") || "Not recorded") + "</p>" +
    (r.issues ? '<p class="lcSmall">' + esc(r.issues) + "</p>" : "") +
    '<h3 class="sectionTitle">Vet costs</h3><p class="lcSmall">' + bizMoney(vetCostOf(a)) + ' so far <button class="authLink" onclick="vetCostAdd(\'' + esc(a).replace(/'/g, "\\'") + '\')">＋ Add vet cost</button></p>' +
    '<h3 class="sectionTitle">Medications</h3>' + (meds.length ? meds.map((m) => '<div class="deviceCard"><div class="deviceHeading"><b>💊 ' + esc(m.drug) + " " + esc(m.dose || "") + "</b><span>" + (m.end && m.end < today() ? "finished" : "every " + (m.everyDays > 1 ? m.everyDays + " days" : "day") + " · " + esc((m.times || []).join(", "))) + '</span></div><div class="recordActions"><button onclick="medGiven(\'' + esc(m.id) + '\')">Dose given</button><button onclick="medEditId=\'' + esc(m.id) + '\';openPanel(\'Medication\')">Edit</button></div></div>').join("") : '<p class="helperLine">No medications.</p>') +
    '<button class="action secondary" onclick="medEditId=\'\';openPanel(\'Medication\')">＋ Add medication</button>' +
    '<div class="inlineActions"><button class="action" onclick="rescueSaveRecord()">Save</button><button class="action secondary" onclick="packetOpen(rescueAnimal,\'adoption\')">Adoption packet</button><button class="action secondary" onclick="transferAsk(rescueAnimal)">Send records to adopter</button><button class="action secondary" onclick="openPanel(rescueAnimal)">Open ' + esc(a) + "</button></div>" +
    '<button class="action secondary" onclick="openPanel(\'Rescue Animals\')">← All rescue animals</button><p id="bizMsg" class="helperLine" role="status"></p>';
};
function rescueSaveRecord() {
  const a = rescueAnimal;
  if (!animals.includes(a)) return;
  const old = rescueOf(a) || {}, st = bizV("rrStatus");
  const r = { ...old, status: st, quarantineStart: bizD("rrQStart"), quarantineDays: Math.max(0, Math.min(365, Number(bizV("rrQDays")) || 0)), vetDue: bizD("rrVet"),
    foster: bizV("rrFoster").slice(0, 80), fosterContact: bizV("rrFosterContact").slice(0, 120), fee: bizV("rrFee").replace(/[^\d.]/g, "").slice(0, 10),
    adopter: bizV("rrAdopter").slice(0, 80), adopterContact: bizV("rrAdopterContact").slice(0, 120), adoptedDate: bizD("rrAdopted") || (st === "Adopted" && !old.adoptedDate ? today() : old.adoptedDate || ""),
    publicNote: bizV("rrPublic").slice(0, 300) };
  if (st !== old.status) entries.push({ section: "Observations", animal: a, detail: "Status: " + st, date: today(), notes: "" });
  if (st === "Adopted" && r.fee && !entries.some((e) => e.section === "Ledger" && e.animal === a && e.ref === "adoption")) entries.push({ section: "Ledger", animal: a, detail: "Adoption fee", type: "income", amount: Number(r.fee) || 0, category: "Adoption fees", date: r.adoptedDate || today(), ref: "adoption" });
  profiles[a] = { ...(profiles[a] || {}), rescue: r };
  bizSaveProfiles();
  save();
  stToast(a + " · " + st + " ♡");
  render();
}
BIZ_PANELS.Medication = () => {
  const a = rescueAnimal || selectedAnimal, m = (profiles[a]?.meds || []).find((x) => x.id === medEditId) || {};
  return '<p class="resourceIntro">Medication for <b>' + esc(a) + "</b>. Each dose time sends a phone reminder, and one tap logs the dose.</p>" +
    '<div class="saleGrid">' + bizField("mdDrug", "Medication", m.drug, "text", "e.g. Panacur") + bizField("mdDose", "Dose", m.dose, "text", "0.2 ml") +
    bizField("mdEvery", "Every how many days", m.everyDays || 1, "number", "", 'min="1" max="30"') + bizField("mdTimes", "Times (24h, comma separated)", (m.times || ["08:00"]).join(", "), "text", "08:00, 20:00") +
    bizField("mdStart", "Start", m.start || today(), "date") + bizField("mdEnd", "Last day", m.end, "date") + "</div>" +
    '<label>Notes<input id="mdNotes" maxlength="200" value="' + esc(m.notes || "") + '" placeholder="Given orally, with food, prescribed by Dr. …"></label>' +
    '<div class="inlineActions"><button class="action" onclick="medSave()">Save medication</button>' + (m.id ? '<button class="action secondary" onclick="medDelete()">Remove</button>' : "") + '<button class="action secondary" onclick="rescueOf(rescueAnimal)?rescueOpen(rescueAnimal):openPanel(rescueAnimal)">Back</button></div><p id="bizMsg" class="helperLine" role="status"></p>';
};
function medSave() {
  const a = rescueAnimal || selectedAnimal;
  if (!animals.includes(a)) return;
  const times = bizV("mdTimes").split(/[,\s]+/).map((t) => t.replace(/^(\d):/, "0$1:")).filter((t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t)).slice(0, 6);
  if (!bizV("mdDrug")) { document.getElementById("bizMsg").textContent = "Name the medication."; return; }
  const m = { id: medEditId || bizUid("med"), drug: bizV("mdDrug").slice(0, 60), dose: bizV("mdDose").slice(0, 40), everyDays: Math.max(1, Math.min(30, Number(bizV("mdEvery")) || 1)),
    times: times.length ? times : ["08:00"], start: bizD("mdStart") || today(), end: bizD("mdEnd"), notes: bizV("mdNotes").slice(0, 200) };
  const list = (profiles[a]?.meds || []).filter((x) => x.id !== m.id);
  profiles[a] = { ...(profiles[a] || {}), meds: [...list, m] };
  bizSaveProfiles();
  stToast("💊 " + m.drug + " saved. Dose reminders are on.");
  rescueOf(a) ? rescueOpen(a) : openPanel(a);
}
function medDelete() {
  const a = rescueAnimal || selectedAnimal;
  profiles[a] = { ...(profiles[a] || {}), meds: (profiles[a]?.meds || []).filter((x) => x.id !== medEditId) };
  bizSaveProfiles();
  rescueOf(a) ? rescueOpen(a) : openPanel(a);
}
function medGiven(id) {
  const a = rescueAnimal || selectedAnimal, m = (profiles[a]?.meds || []).find((x) => x.id === id);
  if (!m) return;
  entries.push({ section: "Health & Vet", animal: a, detail: "Medication given: " + m.drug + (m.dose ? " " + m.dose : ""), date: today(), notes: "Dose logged " + new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) });
  save();
  stToast("💊 Logged " + m.drug + " for " + a);
}

/* ---------------- Breeder: hatchlings, genetics & lineage, incubation ---------------- */
function hatchlingInfo(a) {
  const p = profiles[a] || {};
  if (!p.dam && !p.sire) return null;
  const mine = entries.filter((e) => e.animal === a);
  const meals = mine.filter((e) => e.section === "Feeding Tracker").sort((x, y) => x.date.localeCompare(y.date));
  let streak = 0, best = 0;
  meals.forEach((e) => { streak = e.detail === "Ate" || (e.detail !== "Refused" && e.detail !== "Skipped feeding") ? streak + 1 : 0; best = Math.max(best, streak); });
  const shed = mine.filter((e) => e.section === "Shed History").sort((x, y) => x.date.localeCompare(y.date))[0];
  const first = meals.find((e) => e.detail !== "Refused" && e.detail !== "Skipped feeding");
  const sexed = !!p.sex && !/unknown/i.test(p.sex);
  const steps = { "First shed": shed?.date || "", "First meal": first?.date || "", "3 meals in a row": best >= 3 ? "✓" : "", Sexed: sexed ? "✓" : "" };
  return { steps, ready: !!(first && best >= 3), age: p.hatchDate ? bizDays(p.hatchDate, today()) : null };
}
BIZ_PANELS.Hatchlings = () => {
  const list = animals.filter((a) => { const p = profiles[a] || {}; return (p.dam || p.sire) && p.hatchDate && bizDays(p.hatchDate, today()) <= 400; })
    .sort((x, y) => String(profiles[y].hatchDate).localeCompare(String(profiles[x].hatchDate)));
  return '<p class="resourceIntro">Every baby from your clutches, with its checklist. A hatchling is <b>Ready to sell</b> once it has eaten 3 meals in a row.</p>' +
    (list.length ? list.map((a) => {
      const h = hatchlingInfo(a), p = profiles[a];
      return '<div class="deviceCard"><div class="deviceHeading"><b>' + esc(a) + (p.code ? ' <small class="lcSmall">' + esc(p.code) + "</small>" : "") + "</b><span>" + (h.ready ? '<span class="salePill saleReceived">Ready to sell</span>' : h.age + " days old") + "</span></div>" +
        '<div class="hatchSteps">' + Object.entries(h.steps).map(([k, v]) => '<span class="' + (v ? "on" : "") + '">' + (v ? "✓ " : "○ ") + k + (v && v !== "✓" ? " · " + niceDate(v) : "") + "</span>").join("") + "</div>" +
        '<div class="recordActions"><button onclick="selectedAnimal=\'' + esc(a).replace(/'/g, "\\'") + '\';openQuickLog(selectedAnimal)">Quick log</button><button onclick="saleOpen(\'' + esc(a).replace(/'/g, "\\'") + '\')">Listing &amp; sale</button><button onclick="geneOpen(\'' + esc(a).replace(/'/g, "\\'") + '\')">Genetics</button></div></div>';
    }).join("") : '<p class="helperLine">No hatchlings yet. Open a clutch and tap Add hatchlings when they hatch.</p>') +
    '<button class="action secondary" onclick="openPanel(\'Racks & Breeding\')">← Racks &amp; Breeding</button>';
};
let geneAnimal = "";
function geneOpen(a) {
  geneAnimal = a;
  openPanel("Genetics");
}
function lineageOf(a, depth = 0) {
  const p = profiles[a] || {};
  return { a, dam: depth < 2 && p.dam ? lineageOf(p.dam, depth + 1) : p.dam ? { a: p.dam } : null, sire: depth < 2 && p.sire ? lineageOf(p.sire, depth + 1) : p.sire ? { a: p.sire } : null };
}
function lineageBox(n, role) {
  if (!n) return '<div class="famBox famEmpty"><small>' + role + "</small>Unknown</div>";
  const g = profiles[n.a]?.genes || profiles[n.a]?.morph || "";
  return '<div class="famBox"><small>' + role + "</small><b>" + esc(n.a) + "</b>" + (g ? "<span>" + esc(g) + "</span>" : "") + "</div>";
}
BIZ_PANELS.Genetics = () => {
  const a = geneAnimal;
  if (!animals.includes(a)) return '<p class="helperLine">Pick an animal first.</p>';
  const p = profiles[a] || {}, t = lineageOf(a), kids = animals.filter((x) => profiles[x]?.dam === a || profiles[x]?.sire === a);
  const others = animals.filter((x) => x !== a);
  const opt = (id, label, val) => '<label>' + label + '<select id="' + id + '"><option value="">Unknown / not in my collection</option>' + others.map((x) => '<option' + (x === val ? " selected" : "") + ">" + esc(x) + "</option>").join("") + "</select></label>";
  return '<p class="resourceIntro"><b>' + esc(a) + "</b> · " + esc(species[a] || "") + "</p>" +
    '<label>Genes<input id="gnGenes" maxlength="200" value="' + esc(p.genes || "") + '" placeholder="Pastel, Enchi, het Clown, 66% het Pied"></label>' +
    '<p class="lcSmall">List visual genes first, then hets (het Clown) and possible hets with their percentage (50% het Pied).</p>' +
    '<div class="saleGrid">' + opt("gnDam", "Dam (mother)", p.dam) + opt("gnSire", "Sire (father)", p.sire) + bizField("gnCode", "ID code", p.code, "text", "26-OK-01") + "</div>" +
    '<button class="action" onclick="geneSave()">Save genetics</button>' +
    '<h3 class="sectionTitle">Family tree</h3><div class="famTree"><div class="famCol">' + lineageBox(t.dam?.dam, "Grand-dam") + lineageBox(t.dam?.sire, "Grand-sire") + lineageBox(t.sire?.dam, "Grand-dam") + lineageBox(t.sire?.sire, "Grand-sire") +
    '</div><div class="famCol">' + lineageBox(t.dam, "Dam") + lineageBox(t.sire, "Sire") + '</div><div class="famCol famMe">' + lineageBox({ a }, "This animal") + "</div></div>" +
    (kids.length ? '<h3 class="sectionTitle">Offspring (' + kids.length + ')</h3><p class="lcSmall">' + kids.map(esc).join(", ") + "</p>" : "") +
    '<p class="lcSmall">Planning a pairing? <a href="https://www.morphmarket.com/us/search?q=' + encodeURIComponent((p.genes || p.morph || species[a] || "").split(",")[0]) + '" target="_blank" rel="noopener noreferrer">Open MorphMarket’s genetic calculator ↗</a></p>' +
    '<button class="action secondary" onclick="openPanel(geneAnimal)">Back to ' + esc(a) + "</button>";
};
function geneSave() {
  const a = geneAnimal;
  if (!animals.includes(a)) return;
  profiles[a] = { ...(profiles[a] || {}), genes: bizV("gnGenes").slice(0, 200), dam: bizV("gnDam"), sire: bizV("gnSire"), code: bizV("gnCode").slice(0, 30) };
  bizSaveProfiles();
  stToast("Genetics saved ♡");
  render();
}
let incClutchId = "";
BIZ_PANELS.Incubation = () => {
  const c = entries.find((e) => e.section === "Breeding" && String(e.id) === incClutchId);
  if (!c) return '<p class="helperLine">Clutch not found.</p>';
  const log = (c.incLog || []).slice().sort((x, y) => y.date.localeCompare(x.date));
  const day = bizDays(c.date, today()) + 1, left = c.dueDate ? bizDays(today(), c.dueDate) : null;
  return '<p class="resourceIntro"><b>' + esc(c.animal) + (c.partner ? " × " + esc(c.partner) : "") + "</b> · laid " + niceDate(c.date) + "</p>" +
    '<div class="habitatSummary"><strong>Day ' + day + " of incubation</strong><p>" + (c.hatchDate ? "Hatched " + niceDate(c.hatchDate) : left === null ? "Add an expected hatch date on the clutch." : left > 0 ? "Hatch window in " + left + " days (" + niceDate(c.dueDate) + ")" : "In the hatch window now") + "</p></div>" +
    '<div class="saleGrid">' + bizField("icDate", "Date", today(), "date") + bizField("icTemp", "Incubator temp (°F)", "", "number", "88.5", 'step="0.1"') + bizField("icHum", "Humidity (%)", "", "number", "", 'step="1"') + "</div>" +
    '<label>Candling / notes<input id="icNote" maxlength="200" placeholder="All 6 veined, 1 yellowing"></label><button class="action" onclick="incAdd()">Add to log</button>' +
    (log.length ? '<div class="incLog">' + log.map((x) => "<div><b>" + niceDate(x.date) + "</b><span>" + [x.temp ? x.temp + "°F" : "", x.hum ? x.hum + "%" : "", esc(x.note || "")].filter(Boolean).join(" · ") + "</span></div>").join("") + "</div>" : "") +
    '<button class="action secondary" onclick="breederOpen(\'Clutch\',incClutchId)">Back to clutch</button>';
};
function incAdd() {
  const c = entries.find((e) => e.section === "Breeding" && String(e.id) === incClutchId);
  if (!c) return;
  const rec = { date: bizD("icDate") || today(), temp: bizV("icTemp").slice(0, 6), hum: bizV("icHum").slice(0, 5), note: bizV("icNote").slice(0, 200) };
  if (!rec.temp && !rec.hum && !rec.note) return;
  const updated = { ...c, incLog: [...(c.incLog || []), rec].slice(-200) };
  entries = entries.map((e) => (e === c ? updated : e));
  save();
  render();
}

/* ---------------- Money: income & expenses, profit per clutch ---------------- */
const LEDGER_CATS = { income: ["Animal sales", "Adoption fees", "Deposits", "Donations", "Other income"], expense: ["Feeders", "Supplies & enclosures", "Vet & medical", "Shipping", "Shows & expos", "Marketing", "Other expense"] };
let ledgerYear = String(new Date().getFullYear());
function ledgerRows() {
  const rows = entries.filter((e) => e.section === "Ledger").map((e) => ({ ...e, _auto: false }));
  // Sales recorded on animals count as income automatically.
  animals.forEach((a) => {
    const s = profiles[a]?.sale;
    if (s && ["Sold", "Shipped", "Received"].includes(s.status) && Number(s.price) > 0 && !rows.some((r) => r.animal === a && r.ref === "sale"))
      rows.push({ section: "Ledger", animal: a, type: "income", amount: Number(s.price), category: "Animal sales", detail: "Sale: " + a + (s.buyer ? " to " + s.buyer : ""), date: s.soldDate || s.updated || today(), ref: "sale", _auto: true });
    if (s && Number(s.deposit) > 0 && !["Sold", "Shipped", "Received"].includes(s.status))
      rows.push({ section: "Ledger", animal: a, type: "income", amount: Number(s.deposit), category: "Deposits", detail: "Deposit: " + a + (s.holdFor ? " from " + s.holdFor : ""), date: s.depositDate || s.updated || today(), ref: "deposit", _auto: true });
  });
  return rows;
}
function clutchOfAnimal(a) {
  return entries.find((e) => e.section === "Breeding" && e.kind === "clutch" && Array.isArray(e.hatchlings) && e.hatchlings.includes(a)) || null;
}
BIZ_PANELS.Money = () => {
  const rows = ledgerRows().filter((r) => String(r.date).startsWith(ledgerYear)).sort((x, y) => y.date.localeCompare(x.date));
  const sum = (t) => rows.filter((r) => r.type === t).reduce((n, r) => n + (Number(r.amount) || 0), 0);
  const clutches = entries.filter((e) => e.section === "Breeding" && e.kind === "clutch");
  const per = clutches.map((c) => {
    const inc = ledgerRows().filter((r) => r.type === "income" && ((r.animal && clutchOfAnimal(r.animal) === c) || r.clutchId === c.id)).reduce((n, r) => n + (Number(r.amount) || 0), 0);
    const exp = ledgerRows().filter((r) => r.type === "expense" && r.clutchId === c.id).reduce((n, r) => n + (Number(r.amount) || 0), 0);
    return { c, inc, exp };
  }).filter((x) => x.inc || x.exp);
  const years = Array.from(new Set(ledgerRows().map((r) => String(r.date).slice(0, 4)).concat([String(new Date().getFullYear())]))).sort().reverse();
  const cats = (t) => LEDGER_CATS[t].map((c) => "<option>" + c + "</option>").join("");
  return '<div class="diyTabs">' + years.map((y) => '<button class="' + (y === ledgerYear ? "on" : "") + '" onclick="ledgerYear=\'' + y + '\';render()">' + y + "</button>").join("") + "</div>" +
    '<div class="yisTrio moneyTrio"><div><b>' + bizMoney(sum("income")) + "</b>income</div><div><b>" + bizMoney(sum("expense")) + "</b>expenses</div><div><b>" + bizMoney(sum("income") - sum("expense")) + "</b>profit</div></div>" +
    '<h3 class="sectionTitle">Add income or expense</h3><div class="saleGrid">' + bizSelect("lgType", "Type", ["expense", "income"], "expense") +
    '<label>Category<select id="lgCat"><optgroup label="Expenses">' + cats("expense") + '</optgroup><optgroup label="Income">' + cats("income") + "</optgroup></select></label>" +
    bizField("lgAmount", "Amount ($)", "", "number", "", 'min="0" step="0.01"') + bizField("lgDate", "Date", today(), "date") + "</div>" +
    '<div class="saleGrid">' + bizField("lgNote", "What for", "", "text", "Rat order, 3 boxes") +
    '<label>Clutch (optional)<select id="lgClutch"><option value="">None</option>' + clutches.map((c) => '<option value="' + esc(c.id) + '">' + esc(c.animal + (c.partner ? " × " + c.partner : "") + " · " + c.date) + "</option>").join("") + "</select></label></div>" +
    '<button class="action" onclick="ledgerAdd()">Add</button>' +
    (per.length ? '<h3 class="sectionTitle">Profit per clutch</h3>' + per.map((x) => '<div class="deviceCard"><div class="deviceHeading"><b>' + esc(x.c.animal + (x.c.partner ? " × " + x.c.partner : "")) + "</b><span>" + bizMoney(x.inc - x.exp) + "</span></div><p class=\"lcSmall\">" + bizMoney(x.inc) + " sales · " + bizMoney(x.exp) + " costs</p></div>").join("") : "") +
    '<h3 class="sectionTitle">' + ledgerYear + " entries</h3>" +
    (rows.length ? '<div class="incLog">' + rows.map((r) => "<div><b>" + niceDate(r.date) + "</b><span>" + (r.type === "income" ? "+" : "−") + bizMoney(r.amount) + " · " + esc(r.category || "") + " · " + esc(r.detail || "") + (r._auto ? " (from sale)" : "") + "</span></div>").join("") + "</div>" : '<p class="helperLine">Nothing yet.</p>') +
    '<button class="action secondary" onclick="ledgerCsv()">Download ' + ledgerYear + ' spreadsheet (CSV)</button><button class="action secondary" onclick="openPanel(\'Business Tools\')">← Business Tools</button>';
};
function ledgerAdd() {
  const amt = Number(bizV("lgAmount"));
  if (!(amt > 0)) return stToast("Enter an amount.");
  const cat = bizV("lgCat"), type = LEDGER_CATS.income.includes(cat) ? "income" : LEDGER_CATS.expense.includes(cat) ? "expense" : bizV("lgType");
  entries.push({ section: "Ledger", animal: "", type, amount: Math.round(amt * 100) / 100, category: cat, detail: bizV("lgNote").slice(0, 120) || cat, date: bizD("lgDate") || today(), clutchId: bizV("lgClutch") });
  save();
  stToast((type === "income" ? "+" : "−") + bizMoney(amt) + " added");
  render();
}
function ledgerCsv() {
  const rows = ledgerRows().filter((r) => String(r.date).startsWith(ledgerYear)).sort((x, y) => x.date.localeCompare(y.date));
  const q = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
  const csv = ["Date,Type,Category,Amount,Description,Animal"].concat(rows.map((r) => [r.date, r.type, r.category, (Number(r.amount) || 0).toFixed(2), r.detail, r.animal].map(q).join(","))).join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" }));
  a.download = "scale-and-tell-money-" + ledgerYear + ".csv";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

/* ---------------- Feeder stock (goes down with rack feeding and quick logs) ---------------- */
function feederList() {
  return Array.isArray(accountPrefs?.feeders) ? accountPrefs.feeders : [];
}
function feederUse(prey, n) {
  if (!prey || !n) return;
  const list = feederList().map((f) => ({ ...f }));
  const f = list.find((x) => x.name && (prey.toLowerCase().includes(x.name.toLowerCase()) || x.name.toLowerCase().includes(prey.toLowerCase())));
  if (!f) return;
  f.count = Math.max(0, (Number(f.count) || 0) - n);
  accountPrefsSet("feeders", list);
}
BIZ_PANELS.Feeders = () => {
  const list = feederList();
  return '<p class="resourceIntro">Your frozen feeder stock. Counts go down automatically when you log a feeding with that prey (rack feeding or quick log), and you get a reminder when one runs low.</p>' +
    (list.length ? list.map((f, i) => '<div class="deviceCard"><div class="deviceHeading"><b>' + esc(f.name) + "</b><span>" + (Number(f.count) <= Number(f.low) ? '<span class="salePill saleSold">Low</span> ' : "") + Number(f.count) + " left</span></div>" +
      '<div class="recordActions"><button onclick="feederAdj(' + i + ',-1)">−1</button><button onclick="feederAdj(' + i + ',1)">+1</button><button onclick="feederAdj(' + i + ',25)">+25 (new box)</button><button onclick="feederAdj(' + i + ',\'x\')">Remove</button></div></div>').join("") : '<p class="helperLine">No feeders tracked yet.</p>') +
    '<h3 class="sectionTitle">Add a feeder</h3><div class="saleGrid">' + bizField("fdName", "Prey (as you log it)", "", "text", "Small rat") + bizField("fdCount", "How many you have", "", "number", "", 'min="0"') + bizField("fdLow", "Remind me at", 10, "number", "", 'min="0"') + "</div>" +
    '<button class="action" onclick="feederAddNew()">Add feeder</button><button class="action secondary" onclick="openPanel(\'Business Tools\')">← Business Tools</button>';
};
function feederAddNew() {
  const name = bizV("fdName").slice(0, 60);
  if (!name) return;
  accountPrefsSet("feeders", [...feederList(), { name, count: Math.max(0, Number(bizV("fdCount")) || 0), low: Math.max(0, Number(bizV("fdLow")) || 0) }]);
  bizQueueAuto();
  render();
}
function feederAdj(i, d) {
  const list = feederList().map((f) => ({ ...f }));
  if (d === "x") list.splice(i, 1);
  else if (list[i]) list[i].count = Math.max(0, (Number(list[i].count) || 0) + d);
  accountPrefsSet("feeders", list);
  bizQueueAuto();
  render();
}

/* ---------------- Rack weigh session ---------------- */
BIZ_PANELS["Rack Weigh"] = () => {
  const r = racks[breederRackId];
  if (!r) return '<p class="helperLine">Pick a rack first.</p>';
  const rows = [];
  for (let i = 0; i < r.rows; i++) for (let j = 0; j < r.cols; j++) { const a = r.slots?.[i + "-" + j]; if (a) rows.push({ a, label: tubLabel(i, j) }); }
  return '<p class="resourceIntro">Weigh ' + esc(r.name) + ' tub by tub. Leave a box empty to skip it.</p>' + bizField("rwDate", "Date", today(), "date") +
    rows.map((x, n) => { const last = entries.filter((e) => e.animal === x.a && e.section === "Weight Tracker").sort((p, q) => q.date.localeCompare(p.date))[0];
      return '<div class="rfRow"><div class="rfName"><span class="tubId">' + x.label + "</span><b>" + esc(x.a) + "</b>" + (last ? "<small>last: " + esc(last.detail) + " " + agoText(last.date) + "</small>" : "") + '</div><input class="rfPrey" id="rw' + n + '" type="number" min="0" step="1" inputmode="numeric" placeholder="grams" data-animal="' + esc(x.a) + '"></div>'; }).join("") +
    '<div class="inlineActions"><button class="action" onclick="rackWeighSave(' + rows.length + ')">Save weights</button><button class="action secondary" onclick="breederOpen(\'Rack View\',breederRackId)">Cancel</button></div>';
};
function rackWeighSave(n) {
  const date = bizD("rwDate") || today();
  let k = 0;
  for (let i = 0; i < n; i++) { const el = document.getElementById("rw" + i), g = Number(el?.value); if (g > 0) { entries.push({ section: "Weight Tracker", animal: el.dataset.animal, detail: Math.round(g) + " g", date, notes: "Rack weigh session" }); k++; } }
  if (!k) return stToast("Enter at least one weight.");
  save();
  stToast("⚖ Logged " + k + " weights");
  breederOpen("Rack View", breederRackId);
}

/* ---------------- Customers & expo mode ---------------- */
BIZ_PANELS.Customers = () => {
  const map = {};
  animals.forEach((a) => {
    const s = profiles[a]?.sale, r = profiles[a]?.rescue;
    const who = s?.buyer || r?.adopter;
    if (!who) return;
    const k = who.toLowerCase();
    map[k] = map[k] || { name: who, contact: s?.buyerContact || r?.adopterContact || "", items: [] };
    map[k].items.push({ a, price: s?.price || r?.fee || "", date: s?.soldDate || r?.adoptedDate || "", kind: s?.buyer ? "bought" : "adopted" });
  });
  const list = Object.values(map).sort((x, y) => y.items.length - x.items.length);
  return '<p class="resourceIntro">Everyone who has bought or adopted from you, from your sales and adoption records.</p>' +
    (list.length ? list.map((c) => '<div class="deviceCard"><div class="deviceHeading"><b>' + esc(c.name) + "</b><span>" + c.items.length + (c.items.length > 1 ? " animals · repeat ♡" : " animal") + "</span></div>" +
      (c.contact ? '<p class="lcSmall">' + esc(c.contact) + "</p>" : "") + '<p class="lcSmall">' + c.items.map((x) => esc(x.a) + " (" + x.kind + (x.price ? " " + bizMoney(x.price) : "") + (x.date ? ", " + niceDate(x.date) : "") + ")").join(" · ") + "</p></div>").join("")
      : '<p class="helperLine">Add a buyer on a sale (or an adopter on a rescue record) and they show up here.</p>') +
    '<button class="action secondary" onclick="openPanel(\'Business Tools\')">← Business Tools</button>';
};
BIZ_PANELS["Expo Mode"] = () => {
  const list = animals.filter((a) => ["Listed", "Pending"].includes(profiles[a]?.sale?.status));
  return '<p class="resourceIntro">Your table at a show. Works without signal. Tap <b>Sold</b> when one goes home.</p>' +
    (list.length ? '<div class="expoGrid">' + list.map((a) => { const s = profiles[a].sale;
      return '<div class="expoCard"><img alt="" src="' + esc(portraitForAnimal(a).src) + '"><b>' + esc(a) + "</b><small>" + esc([profiles[a]?.genes || profiles[a]?.morph, profiles[a]?.sex].filter(Boolean).join(" · ")) + '</small><div class="expoPrice">' + (s.price ? bizMoney(s.price) : "Ask") + "</div>" +
        (s.status === "Pending" ? '<span class="salePill salePending">On hold' + (s.holdFor ? ": " + esc(s.holdFor) : "") + "</span>" : "") + '<button class="action" onclick="expoSold(\'' + esc(a).replace(/'/g, "\\'") + '\')">Sold</button></div>'; }).join("") + "</div>"
      : '<p class="helperLine">Nothing listed. Mark animals as Listed in Listings &amp; sales first.</p>') +
    '<button class="action secondary" onclick="openPanel(\'Sales\')">← Listings &amp; sales</button>';
};
function expoSold(a) {
  const s = profiles[a]?.sale;
  if (!s) return;
  const buyer = prompt("Buyer name (optional)") || "";
  profiles[a] = { ...profiles[a], sale: { ...s, status: "Sold", soldDate: today(), buyer: buyer.slice(0, 80) || s.buyer || "", site: s.site || "Expo / in person", updated: today() } };
  bizSaveProfiles();
  stToast("Sold ♡ " + a);
  render();
}

/* ---------------- Printables: buyer / adoption packet, tub labels ---------------- */
function packetOpen(a, kind) {
  if (!animals.includes(a)) return;
  const sl = profiles[a]?.sale, rs = profiles[a]?.rescue;
  const to = ((kind === "adoption" ? rs?.adopterContact : sl?.buyerContact) || "").match(/[^@\s]+@[^@\s]+\.[^@\s]+/)?.[0] || "";
  reportShow(a + " · " + (kind === "adoption" ? "Adoption Packet" : "Welcome Home Packet"), bizBrandPrint(packetDoc(a, kind)), to);
}
function packetDoc(a, kind) {
  const p = profiles[a] || {}, r = p.rescue || {}, s = p.sale || {};
  const recs = entries.filter((e) => e.animal === a && e.section !== "Calendar" && e.section !== "Ledger").sort((x, y) => y.date.localeCompare(x.date));
  const w = recs.filter((e) => e.section === "Weight Tracker").slice(0, 12).reverse();
  const feeds = recs.filter((e) => e.section === "Feeding Tracker").slice(0, 15);
  const sheds = recs.filter((e) => e.section === "Shed History").slice(0, 8);
  const vet = recs.filter((e) => e.section === "Health & Vet").slice(0, 15);
  const photo = portraitForAnimal(a).src, who = bizBrand?.business_name || "";
  const rows = (list, f) => list.length ? "<table>" + list.map(f).join("") + "</table>" : '<p class="muted">None recorded.</p>';
  const plan = carePlans[a] || {};
  const title = kind === "adoption" ? "Adoption Packet" : "Welcome Home Packet";
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(a) + " · " + title + "</title><style>body{font:14px/1.5 Arial,sans-serif;color:#34263b;max-width:800px;margin:0 auto;padding:24px;background:#fff}h1{font:italic 32px Georgia,serif;color:#45205b;margin:0}h2{color:#45205b;border-bottom:2px solid #e3d4ea;padding-bottom:4px;margin-top:26px}.hero{display:flex;gap:18px;align-items:center}.hero img{width:170px;height:170px;object-fit:cover;border-radius:16px}table{width:100%;border-collapse:collapse}td{padding:5px 8px;border-bottom:1px solid #eee;vertical-align:top}td:first-child{width:120px;color:#7a6a80}.muted{color:#888}.note{background:#f6f0f8;border-radius:10px;padding:12px 14px}@media print{body{padding:0}}</style></head><body>" +
    '<div class="hero"><img src="' + esc(photo) + '" alt=""><div><small>' + esc(title.toUpperCase()) + "</small><h1>" + esc(a) + "</h1><p>" + esc([species[a], p.sex, p.genes || p.morph, p.hatchDate ? "hatched " + niceDate(p.hatchDate) : ""].filter(Boolean).join(" · ")) + "</p>" +
    (p.dam || p.sire ? "<p>Parents: " + esc([p.dam, p.sire].filter(Boolean).join(" × ")) + "</p>" : "") + "</div></div>" +
    '<p class="note">' + (kind === "adoption" ? "Thank you for adopting " + esc(a) + (who ? " from " + esc(who) : "") + "! Everything we know about " + esc(a) + "'s care is below. Keep this packet, and reach out anytime with questions."
      : "Congratulations on your new " + esc(species[a] || "reptile") + "! This packet has " + esc(a) + "'s care history so far" + (who ? " from " + esc(who) : "") + ". Give them about a week to settle in before the first meal and handling.") + "</p>" +
    "<h2>Care at a glance</h2><table>" + [["Feeding", plan.feedDays ? "Every " + plan.feedDays + " days" : ""], ["Last prey", feeds.find((f) => f.preyType)?.preyType || ""], ["Warm side", plan.warmMin || plan.warmMax ? (plan.warmMin || "…") + "–" + (plan.warmMax || "…") + "°F" : ""],
      ["Cool side", plan.coolMin || plan.coolMax ? (plan.coolMin || "…") + "–" + (plan.coolMax || "…") + "°F" : ""], ["Humidity", plan.humidityMin || plan.humidityMax ? (plan.humidityMin || "…") + "–" + (plan.humidityMax || "…") + "%" : ""],
      ["Handling", p.handlingNotes || ""], ["Notes", p.sitterInstructions || p.notes || ""]].filter((x) => x[1]).map((x) => "<tr><td>" + x[0] + "</td><td>" + esc(x[1]) + "</td></tr>").join("") + "</table>" +
    "<h2>Weights</h2>" + rows(w, (e) => "<tr><td>" + niceDate(e.date) + "</td><td>" + esc(e.detail) + "</td></tr>") +
    "<h2>Recent feedings</h2>" + rows(feeds, (e) => "<tr><td>" + niceDate(e.date) + "</td><td>" + esc(e.detail + (e.preyType ? " · " + e.preyType : "")) + "</td></tr>") +
    "<h2>Sheds</h2>" + rows(sheds, (e) => "<tr><td>" + niceDate(e.date) + "</td><td>" + esc(e.detail) + "</td></tr>") +
    "<h2>Health &amp; vet</h2>" + rows(vet, (e) => "<tr><td>" + niceDate(e.date) + "</td><td>" + esc(e.detail + (e.notes ? " · " + e.notes : "")) + "</td></tr>") +
    (kind === "adoption" && (r.intakeDate || r.issues) ? "<h2>Rescue history</h2><table>" + [["Came to us", r.intakeDate ? niceDate(r.intakeDate) + (r.source ? " · " + r.source : "") : ""], ["On arrival", [r.condition, r.issues].filter(Boolean).join(" · ")], ["Quarantine", r.quarantineStart ? (r.quarantineDays || 90) + " days from " + niceDate(r.quarantineStart) : ""]].filter((x) => x[1]).map((x) => "<tr><td>" + x[0] + "</td><td>" + esc(x[1]) + "</td></tr>").join("") + "</table>" : "") +
    (kind !== "adoption" && s.price ? "<h2>Purchase</h2><table><tr><td>Price</td><td>" + bizMoney(s.price) + "</td></tr>" + (s.soldDate ? "<tr><td>Date</td><td>" + niceDate(s.soldDate) + "</td></tr>" : "") + (s.notes ? "<tr><td>Notes</td><td>" + esc(s.notes) + "</td></tr>" : "") + "</table>" : "") +
    '<p class="muted" style="margin-top:28px">Keep tracking ' + esc(a) + "’s care free at scaleandtell.app ♡ Generated " + niceDate(today()) + "</p></body></html>";
}
function tubLabelsOpen(id) {
  const r = racks[id];
  if (!r) return;
  const tubs = [];
  for (let i = 0; i < r.rows; i++) for (let j = 0; j < r.cols; j++) { const a = r.slots?.[i + "-" + j]; if (a) tubs.push({ a, label: tubLabel(i, j) }); }
  const tab = window.open("", "_blank");
  if (!tab) return alert("Allow pop-ups to open the labels.");
  const base = location.origin + location.pathname;
  tab.document.open();
  tab.document.write('<!doctype html><html><head><meta charset="utf-8"><title>' + esc(r.name) + ' · Tub labels</title><script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script><style>body{font:12px Arial,sans-serif;margin:12px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}.lb{display:flex;gap:8px;align-items:center;border:1px dashed #aaa;border-radius:8px;padding:8px;break-inside:avoid}.lb b{display:block;font-size:15px}.q{width:72px;height:72px;flex:none}.q img,.q canvas{width:72px!important;height:72px!important}h1{font:italic 20px Georgia,serif}</style></head><body><h1>' + esc(r.name) + ' · tub labels</h1><p>Print, cut and tape to each tub. Scanning a label with your phone camera opens that animal in Scale &amp; Tell.</p><div class="grid">' +
    tubs.map((t, k) => '<div class="lb"><div class="q" id="q' + k + '"></div><div><small>' + esc(r.name) + " · " + t.label + "</small><b>" + esc(t.a) + "</b>" + esc([species[t.a], profiles[t.a]?.genes || profiles[t.a]?.morph, profiles[t.a]?.sex].filter(Boolean).join(" · ")) + (profiles[t.a]?.code ? "<br>" + esc(profiles[t.a].code) : "") + "</div></div>").join("") +
    "</div><script>window.onload=function(){" + JSON.stringify(tubs.map((t) => base + "?animal=" + encodeURIComponent(t.a))) + ".forEach(function(u,k){new QRCode(document.getElementById('q'+k),{text:u,width:144,height:144,correctLevel:QRCode.CorrectLevel.M})})}<\/script></body></html>");
  tab.document.close();
}
// Opening the app from a tub label's QR code jumps to that animal.
(function bizDeepLink() {
  const want = new URLSearchParams(location.search).get("animal");
  if (!want) return;
  let tries = 0;
  const t = setInterval(() => {
    tries++;
    if (animals.includes(want) && typeof cloudAuthReady !== "undefined" && cloudAuthReady && !document.body.classList.contains("authLocked")) {
      clearInterval(t);
      history.replaceState(null, "", location.pathname);
      openPanel(want);
    }
    if (tries > 60) clearInterval(t);
  }, 500);
})();

/* ---------------- Send records to a new owner / receive them ---------------- */
function transferAsk(a) {
  if (!animals.includes(a)) return;
  const sl = profiles[a]?.sale, rs = profiles[a]?.rescue;
  const guess = (sl?.buyerContact || rs?.adopterContact || "").match(/[^@\s]+@[^@\s]+\.[^@\s]+/)?.[0] || "";
  const email = prompt("New owner's email. They'll get " + a + "'s care history, photos and notes in their own free Scale & Tell account.", guess);
  if (email) transferSend(a, email.trim());
}
async function transferSend(a, email) {
  try {
    const paths = (cloudRow?.payload?.photos?.[a] || []).filter((x) => x?.cloudPath).slice(-30).map((x) => ({ cloudPath: x.cloudPath, caption: x.caption || "", date: x.date || "" }));
    const p = { ...(profiles[a] || {}) };
    delete p.sale; delete p.rescue; delete p.meds;
    const bundle = { species: species[a] || "", profile: p, carePlan: carePlans[a] || null, photos: paths,
      entries: entries.filter((e) => e.animal === a && !["Calendar", "Ledger", "Breeding"].includes(e.section)).slice(-1500).map((e) => { const x = { ...e }; delete x.id; delete x.attachment; delete x.attachmentPath; return x; }) };
    await hubInvoke({ action: "transfer_send", animal: a, email, bundle, owner: cloudJournalUid() });
    stToast("Sent ♡ " + email + " will get " + a + "'s records.");
  } catch (e) { stToast(e.message || "Couldn’t send the records."); }
}
let transfersWaiting = [];
async function transferCheck() {
  if (!cloudSession || !cloudClient) return;
  try {
    transfersWaiting = (await hubInvoke({ action: "transfer_list" })).items || [];
    if (transfersWaiting.length && !document.getElementById("sheet")?.classList.contains("on")) openPanel("Records For You");
  } catch (e) {}
}
BIZ_PANELS["Records For You"] = () =>
  '<p class="resourceIntro">Someone sent you an animal’s care history ♡ Accept to add the animal, with its feedings, sheds, weights, notes and photos, to your journal.</p>' +
  (transfersWaiting.length ? transfersWaiting.map((t) => '<div class="deviceCard"><div class="deviceHeading"><b>' + esc(t.animal) + "</b><span>from " + esc(t.from_name || "a keeper") + '</span></div><div class="recordActions"><button onclick="transferAccept(\'' + esc(t.id) + '\')">Accept</button><button onclick="transferDecline(\'' + esc(t.id) + '\')">No thanks</button></div></div>').join("") : '<p class="helperLine">Nothing waiting.</p>');
async function transferAccept(id) {
  try {
    stToast("Bringing them home…");
    const r = await hubInvoke({ action: "transfer_accept", id, owner: cloudJournalUid() }), b = r.bundle || {};
    let name = String(r.animal || "New animal").slice(0, 50), k = 2;
    while (animals.some((x) => x.toLowerCase() === name.toLowerCase())) name = String(r.animal).slice(0, 46) + " " + k++;
    if (cloudSession && stOwnsEntitlements() && animals.length >= stAnimalLimit()) return stCanAddAnimal();
    animals.push(name);
    species[name] = String(b.species || "Reptile").slice(0, 80);
    const pr = b.profile && typeof b.profile === "object" ? b.profile : {};
    profiles[name] = { ...pr, notes: ((pr.notes ? pr.notes + " " : "") + "Records from " + (r.from || "previous keeper") + ".").slice(0, 400) };
    if (b.carePlan && typeof b.carePlan === "object") { carePlans[name] = b.carePlan; saveCarePlans(); }
    (Array.isArray(b.entries) ? b.entries : []).forEach((e) => { if (e && typeof e === "object" && validDate(e.date)) entries.push({ ...e, animal: name }); });
    const gallery = [];
    for (const ph of Array.isArray(b.photos) ? b.photos : []) {
      if (!ph?.cloudPath) continue;
      try { const { data } = await cloudClient.storage.from(CLOUD_BUCKET).download(ph.cloudPath); if (data) gallery.push({ src: await new Promise((ok) => { const fr = new FileReader(); fr.onload = () => ok(fr.result); fr.readAsDataURL(data); }), caption: ph.caption || "", date: ph.date || "" }); } catch (e) {}
    }
    if (gallery.length) { photos[name] = gallery; savePhotos(); }
    saveRoster();
    bizSaveProfiles();
    save();
    transfersWaiting = transfersWaiting.filter((t) => t.id !== id);
    stToast("Welcome home, " + name + " ♡");
    openPanel(name);
  } catch (e) { stToast(e.message || "Couldn’t accept right now."); }
}
async function transferDecline(id) {
  try { await hubInvoke({ action: "transfer_decline", id }); } catch (e) {}
  transfersWaiting = transfersWaiting.filter((t) => t.id !== id);
  render();
}

/* ---------------- Alerts: settings + automatic reminders ---------------- */
const BIZ_ALERTS = [
  ["inquiry", "New messages from your public page", "server"], ["application", "Adoption applications", "server"], ["surrender", "Surrender requests", "server"],
  ["team", "Someone joins your team", "server"], ["weekly", "Sunday weekly summary", "server"], ["renewal", "Plan renewal reminders", "server"], ["sensor", "Govee sensor out of range", "server"], ["transfer", "A new owner accepts records", "server"],
  ["hatch", "Clutch hatch window", "auto"], ["rackFeed", "Rack feeding day", "auto"], ["hatchling", "Hatchlings not eating yet", "auto"], ["hold", "Hold & deposit due dates", "auto"],
  ["ship", "Shipping day & arrival check", "auto"], ["feeder", "Feeder stock low", "auto"], ["pairing", "Pairing follow-ups", "auto"], ["meds", "Medication doses", "auto"],
  ["quarantine", "Quarantine finished", "auto"], ["vet", "Vet follow-ups", "auto"], ["adoptFollow", "Check in with adopters", "auto"],
];
function bizAlertOn(k) {
  return accountPrefs?.notify?.[k] !== false;
}
BIZ_PANELS.Alerts = () => {
  const rescue = stIsRescue(), breeder = bizIsBreeder();
  const show = (k) => !(!breeder && ["hatch", "rackFeed", "hatchling", "pairing"].includes(k)) && !(!rescue && ["application", "surrender", "quarantine", "adoptFollow"].includes(k));
  return '<p class="resourceIntro">Choose what reaches your phone. Alerts go to everyone on your team who has reminders turned on. ' + (pushDeviceEnabled ? "" : "<b>Turn on reminders on this phone</b> (Calendar → Reminders) to receive them.") + "</p>" +
    BIZ_ALERTS.filter(([k]) => show(k)).map(([k, label]) => '<label class="checkLine alertLine"><input type="checkbox" ' + (bizAlertOn(k) ? "checked" : "") + ' onchange="bizAlertSet(\'' + k + '\',this.checked)"> ' + label + "</label>").join("") +
    '<p class="lcSmall">Medication, rack feeding, hatch and other dated alerts also appear in your Calendar, so you can mark them done there.</p><button class="action secondary" onclick="openPanel(\'Business Tools\')">← Business Tools</button>';
};
function bizAlertSet(k, on) {
  accountPrefsSet("notify", { ...(accountPrefs?.notify || {}), [k]: on ? true : false });
  bizQueueAuto();
}
let bizAutoTimer = null, bizAutoBusy = false;
function bizQueueAuto() {
  clearTimeout(bizAutoTimer);
  bizAutoTimer = setTimeout(bizSyncAuto, 800);
}
/* Dated business alerts live in the Care Schedule as normal reminders (so they reach phones), tagged with autoKey.
   A reminder the keeper completed is never re-created; one whose reason went away is removed if still open. */
function bizSyncAuto() {
  if (bizAutoBusy) return;
  try {
    if (!(homeBusinessMode() || stIsRescue() || bizIsBreeder() || stCanUsePack())) return;
  } catch (e) { return; }
  bizAutoBusy = true;
  try {
    const want = new Map(), t = today(), add = (k, kind, e) => { if (bizAlertOn(kind)) want.set(k, { section: "Calendar", repeatDays: 0, done: false, notes: "", category: "other", ...e, autoKey: k }); };
    const breeding = entries.filter((e) => e.section === "Breeding");
    breeding.filter((c) => c.kind === "clutch" && c.dueDate && !c.hatchDate).forEach((c) => add("hatch:" + c.id, "hatch", { animal: c.animal, detail: "🥚 Hatch window opens (" + niceDate(c.dueDate) + ")", date: advanceDate(c.dueDate, -3) }));
    breeding.filter((p) => p.kind === "pairing" && p.status !== "done").forEach((p) => {
      const lock = (p.events || []).filter((x) => x.type === "Lock").map((x) => x.date).sort().pop();
      if (lock) add("pair:" + p.id + ":" + lock, "pairing", { animal: p.animal, detail: "💞 " + p.animal + " × " + (p.partner || "?") + ": 2 weeks since lock, watch for ovulation", date: advanceDate(lock, 14) });
    });
    rackList().forEach((r) => {
      const due = Object.values(r.slots || {}).filter(Boolean).filter((a) => { const f = lastFeed(a), n = carePlans[a]?.feedDays; return n && (!f || daysSince(f.date) >= n); });
      if (due.length >= 2) add("rack:" + r.id + ":" + t, "rackFeed", { animal: r.name, detail: "🍽 " + due.length + " animals due to feed", date: t, category: "feeding" });
    });
    animals.forEach((a) => {
      const p = profiles[a] || {}, s = p.sale || {}, r = p.rescue || null;
      if ((p.dam || p.sire) && p.hatchDate && bizDays(p.hatchDate, t) >= 14 && bizDays(p.hatchDate, t) <= 120 && !entries.some((e) => e.animal === a && e.section === "Feeding Tracker" && e.detail !== "Refused" && e.detail !== "Skipped feeding"))
        add("hatchling:" + a, "hatchling", { animal: a, detail: "🐣 Hasn’t eaten yet (" + bizDays(p.hatchDate, t) + " days old)", date: t });
      if (s.balanceDue && s.status === "Pending") add("hold:" + a + ":" + s.balanceDue, "hold", { animal: a, detail: "💰 Balance due" + (s.holdFor ? " from " + s.holdFor : ""), date: s.balanceDue });
      if (s.holdUntil && s.status === "Pending") add("holdend:" + a + ":" + s.holdUntil, "hold", { animal: a, detail: "⏳ Hold ends" + (s.holdFor ? " for " + s.holdFor : ""), date: s.holdUntil });
      if (s.shipDate && !s.shippedDate) add("ship:" + a + ":" + s.shipDate, "ship", { animal: a, detail: "📦 Ships tomorrow: check weather at both ends", date: advanceDate(s.shipDate, -1) });
      if (s.shippedDate && !s.receivedDate) add("arrive:" + a + ":" + s.shippedDate, "ship", { animal: a, detail: "📦 Did it arrive? Mark received", date: advanceDate(s.shippedDate, 2) });
      (p.meds || []).forEach((m) => { if (!m.end || m.end >= t) add("med:" + m.id, "meds", { animal: a, detail: "💊 " + m.drug + (m.dose ? " " + m.dose : ""), date: m.start > t ? m.start : t, times: m.times || [], repeatDays: m.everyDays || 1 }); });
      if (r) {
        const q = rescueQuarantine(a);
        if (q && r.status === "Quarantine") add("quar:" + a + ":" + q.end, "quarantine", { animal: a, detail: "⏳ Quarantine finished: ready to move to Available?", date: q.end });
        if (r.vetDue) add("vet:" + a + ":" + r.vetDue, "vet", { animal: a, detail: "🩺 Vet follow-up due", date: r.vetDue });
      }
      if (!r && p.vetDue && stCanUsePack()) add("vet:" + a + ":" + p.vetDue, "vet", { animal: a, detail: "🩺 Vet follow-up" + (p.vetNote ? ": " + p.vetNote : ""), date: p.vetDue });
      if (r) {
        if (r.status === "Adopted" && r.adoptedDate) add("adopt:" + a + ":" + r.adoptedDate, "adoptFollow", { animal: a, detail: "🏠 Check in with " + (r.adopter || "the adopter"), date: advanceDate(r.adoptedDate, 14) });
      }
    });
    feederList().forEach((f) => { if (Number(f.count) <= Number(f.low)) add("feeder:" + f.name + ":" + t.slice(0, 7), "feeder", { animal: "Feeders", detail: "🐁 " + f.name + ": " + Number(f.count) + " left, time to reorder", date: t }); });
    let changed = false;
    const have = new Map(entries.filter((e) => e.autoKey).map((e) => [e.autoKey, e]));
    // Remove open auto reminders whose reason went away (or whose alert was switched off).
    const before = entries.length;
    entries = entries.filter((e) => !e.autoKey || e.done || want.has(e.autoKey) || (e.autoKey.startsWith("med:") && want.has(e.autoKey)));
    if (entries.length !== before) changed = true;
    want.forEach((e, k) => {
      const old = have.get(k);
      if (!old) { entries.push(e); changed = true; }
      else if (!old.done && (old.detail !== e.detail)) { old.detail = e.detail; changed = true; }
    });
    if (changed) { syncStampEntries(); scaleStoreSet("scaleTellApprovedPreview", JSON.stringify(entries)); try { updateStats(); } catch (e) {} }
  } catch (e) {
  } finally {
    bizAutoBusy = false;
  }
}

let inboxIntake = null;
function inboxToIntake(id) {
  const m = (bizInbox || []).find((x) => x.id === id);
  if (!m) return;
  inboxIntake = m;
  openPanel("Intake");
  setTimeout(() => {
    const d = m.details || {}, set = (k, v) => { const el = document.getElementById(k); if (el && v) el.value = v; };
    set("inName", m.animal || d.Name || d["Animal name"] || "");
    set("inSpecies", d.Species || "");
    set("inSource", "Owner surrender");
    set("inFrom", m.from_name);
    set("inContact", m.from_email);
    const iss = document.getElementById("inIssues");
    if (iss) iss.value = [d["Health concerns"], m.message].filter(Boolean).join(" · ").slice(0, 600);
  }, 50);
}
/* Rescue pipeline strip on the home screen (both layouts). */
function homeRescueStrip() {
  let el = document.getElementById("homeRescue");
  if (!stIsRescue()) { el?.remove(); return; }
  const list = animals.filter((a) => rescueOf(a)), c = (st) => list.filter((a) => rescueStatus(a) === st).length;
  const sec = document.querySelector(".homeReptiles");
  if (!sec) return;
  if (!el) { el = document.createElement("section"); el.id = "homeRescue"; el.className = "homeRescue"; sec.before(el); }
  el.innerHTML = '<div class="homeSecHead"><h2>My Rescue ♡</h2><button class="homeViewAll" onclick="openPanel(\'Intake\')">＋ Intake</button></div><div class="rescueStages">' +
    [["Intake", "Intake"], ["Quarantine", "Quarantine"], ["Medical hold", "Medical"], ["Available", "Available"], ["Adoption pending", "Pending"], ["Adopted", "Adopted"]]
      .map(([st, lab]) => '<button onclick="rescueFilter=\'' + (st === "Adoption pending" ? "Available" : st === "Medical hold" ? "Medical" : st) + '\';openPanel(\'Rescue Animals\')"><b>' + c(st) + "</b><span>" + lab + "</span></button>").join("") + "</div>";
}

/* Welcome text after a code: promo codes never mention the Herps & Hers group. */
function stCodeWelcome() {
  const p = stPlan();
  return p && p !== "member" ? "Welcome ♡ Your " + ST_PLANS[p].name + " plan is active." : "Welcome, Herps & Hers member ♡";
}

/* ===================== V3.51 · Reports: view & print, download PDF, email or share a link ===================== */
let reportCur = null;
function reportShow(title, html, to) {
  reportCur = { title, html, to: to || "", url: "" };
  openPanel("Report");
}
BIZ_PANELS.Report = () => {
  const r = reportCur;
  if (!r) return '<p class="helperLine">Open a binder or packet first.</p>';
  return '<p class="resourceIntro"><b>' + esc(r.title) + '</b> is ready. View and print it, save a PDF, or send it as a link anyone can open on their phone or computer.</p>' +
    '<div class="reportBtns"><button class="action" onclick="reportView()">👁 View &amp; print</button><button class="action" onclick="reportPdf()">⬇ Download PDF</button></div>' +
    '<h3 class="sectionTitle">Email it</h3>' + bizField("rpTo", "Their email", r.to, "email", "adopter@example.com") +
    '<label>Note (optional)<textarea id="rpNote" rows="3" maxlength="600" placeholder="Here’s everything about Pip’s care so far ♡"></textarea></label>' +
    '<div class="reportBtns"><button class="action" onclick="reportSend(true)">✉ Email the link</button><button class="action secondary" onclick="reportSend(false)">🔗 Copy share link</button></div>' +
    (r.url ? '<p class="lcSmall">Link: <a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.url) + "</a></p>" : "") +
    '<p class="lcSmall">Shared links open for 6 months. Anyone with the link can view it, so only send it to people you trust.</p><p id="bizMsg" class="helperLine" role="status"></p>';
};
function reportView() {
  const r = reportCur;
  if (!r) return;
  const tab = window.open("", "_blank");
  if (!tab) return stToast("Allow pop-ups to view the report.");
  tab.document.open();
  tab.document.write(r.html);
  tab.document.close();
}
let html2pdfLoader = null;
function reportLoadPdfLib() {
  if (window.html2pdf) return Promise.resolve(window.html2pdf);
  if (!html2pdfLoader)
    html2pdfLoader = new Promise((ok, no) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      s.onload = () => (window.html2pdf ? ok(window.html2pdf) : no(Error("PDF tool did not load")));
      s.onerror = () => { html2pdfLoader = null; no(Error("PDF tool could not load")); };
      document.head.appendChild(s);
    });
  return html2pdfLoader;
}
async function reportPdf() {
  const r = reportCur, msg = (t) => { const m = document.getElementById("bizMsg"); if (m) m.textContent = t; };
  if (!r) return;
  const name = r.title.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-").slice(0, 60) || "scale-and-tell-report";
  msg("Making your PDF…");
  let box;
  try {
    const lib = await reportLoadPdfLib();
    // Render the report in its own scoped box so its styles can't touch the app (and the app's can't touch it).
    const doc = new DOMParser().parseFromString(r.html, "text/html");
    const css = Array.from(doc.querySelectorAll("style")).map((x) => x.textContent).join("\n")
      .replace(/@media\s+print\s*\{[^{}]*(\{[^{}]*\}[^{}]*)*\}/g, "")
      .replace(/(^|[},;\s])(html|body)(?=[\s{,.:#[])/g, "$1.rptRoot")
      .replace(/(^|\})\s*\*\s*\{/g, "$1 .rptRoot, .rptRoot *{");
    doc.querySelectorAll("script,style,.printBar").forEach((x) => x.remove());
    box = document.createElement("div");
    box.style.cssText = "position:fixed;left:-12000px;top:0;width:740px;z-index:-1";
    box.innerHTML = "<style>" + css + " .rptRoot *{max-width:100%;box-sizing:border-box}</style><div class=\"rptRoot\" style=\"width:740px;max-width:740px;margin:0;padding:16px;background:#fff;color:#34263b;box-sizing:border-box\">" + doc.body.innerHTML + "</div>";
    document.body.appendChild(box);
    await new Promise((ok) => setTimeout(ok, 500));
    await lib().set({ margin: [8, 8, 10, 8], filename: name + ".pdf", image: { type: "jpeg", quality: 0.92 }, html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff", windowWidth: 760 },
      jsPDF: { unit: "mm", format: "letter", orientation: "portrait" }, pagebreak: { mode: ["css", "legacy"], avoid: ["tr", "img", ".hero", "section", "figure", ".lb"] } }).from(box.querySelector(".rptRoot")).save();
    msg("✓ PDF downloaded");
  } catch (e) {
    // Fallback: a web page file that opens and prints anywhere.
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([r.html], { type: "text/html" }));
    a.download = name + ".html";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    msg("Saved as a web page file (opens in any browser, where you can print or save as PDF).");
  } finally {
    box?.remove();
  }
}
async function reportSend(byEmail) {
  const r = reportCur, msg = (t) => { const m = document.getElementById("bizMsg"); if (m) m.textContent = t; };
  if (!r) return;
  const to = byEmail ? bizV("rpTo") : "";
  if (byEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) return msg("Enter their email address.");
  if (!cloudSession) return msg("Sign in to share reports.");
  msg(byEmail ? "Sending…" : "Making a link…");
  try {
    const out = await hubInvoke({ action: "doc_share", title: r.title, html: r.html.replace(/<div class="printBar">[\s\S]*?<\/div>/, ""), to, note: byEmail ? (document.getElementById("rpNote")?.value || "") : "", owner: cloudJournalUid() });
    r.url = out.url || "";
    if (!byEmail && r.url) {
      try { await navigator.clipboard.writeText(r.url); stToast("Link copied ♡"); } catch (e) { if (navigator.share) try { await navigator.share({ title: r.title, url: r.url }); } catch (x) {} }
    }
    if (byEmail) { r.to = to; stToast("Sent to " + to + " ♡"); }
    render();
  } catch (e) { msg(e.message || "Couldn’t share right now."); }
}

/* Pairings and clutches: warn when the two parents are different species (a typo or the wrong animal picked). */
function breedSpeciesKey(a) {
  return String(species[a] || "").toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();
}
function breedSpeciesOk(a, b) {
  const x = breedSpeciesKey(a), y = breedSpeciesKey(b);
  if (!x || !y || x === y || x.includes(y) || y.includes(x)) return true;
  return confirm(a + " is listed as a " + species[a] + " and " + b + " as a " + species[b] + ". These are different species and can't produce a clutch together.\n\nSave anyway? (Choose Cancel to fix the animals or their species.)");
}
BIZ_PANELS["Send Update Email"] = () => {
  if (!window.__stIsAdmin) return "<p>Only Scale &amp; Tell admins can send update emails.</p>";
  if (!stMailState.stats) setTimeout(stMailStats, 0);
  const st = stMailState.stats;
  return '<p class="resourceIntro">Email everyone who has app update emails turned on. Each email has an unsubscribe link.</p>' +
    '<label>Send to<select id="mailAud" onchange="stMailState.aud=this.value;render()">' + [["all", "Everyone"], ["keepers", "Keepers"], ["breeders", "Breeders"], ["rescues", "Rescues"]].map(([k, l]) => '<option value="' + k + '"' + ((stMailState.aud || "all") === k ? " selected" : "") + ">" + l + (st?.groups ? " (" + (st.groups[k] ?? 0) + ")" : "") + "</option>").join("") + "</select></label>" +
    '<p class="lcSmall"><b>' + (st ? (st.groups?.[stMailState.aud || "all"] ?? st.on) + " people" : "…") + "</b> will get this email (everyone in that group with update emails on).</p>" +
    '<label>Subject<input id="mailSubj" maxlength="140" value="' + esc(stMailState.subject) + '" placeholder="e.g. New in Scale & Tell: Watch & Learn"></label>' +
    '<label>Message<textarea id="mailBody" rows="10" maxlength="8000" placeholder="Hi keepers ♡&#10;&#10;Here’s what’s new…">' + esc(stMailState.body) + "</textarea></label>" +
    '<p class="lcSmall">Leave a blank line between paragraphs. An “Open Scale &amp; Tell” button and the unsubscribe link are added for you.</p>' +
    '<div class="inlineActions"><button class="action secondary" onclick="stMailSend(true)">Send me a test</button><button class="action" onclick="stMailSend(false)">Send to everyone</button></div>' +
    '<p class="helperLine" id="mailMsg" role="status">' + esc(stMailState.msg) + "</p>" +
    (st?.past?.length ? '<h3 class="sectionTitle">Sent before</h3>' + st.past.map((x) => '<div class="deviceCard"><b>' + esc(x.subject) + '</b><p class="lcSmall">' + niceDate(String(x.created_at).slice(0, 10)) + " · " + x.recipients + " people</p></div>").join("") : "");
};

/* =====================================================================
   V3.57 · Logins by plan, keeper tools, Premium Breeder tools, rescue tools
   ===================================================================== */
function stLogins() {
  if (stSkus.some((k) => k === "premium_breeder" || k === "rescue")) return 5;
  if (stSkus.some((k) => k === "founding_keeper" || k === "founding_breeder")) return 3;
  return 1;
}
function stTeamIsBiz() {
  return (stTeam?.skus || stSkus).some((k) => BIZ_TEAM_SKUS.includes(k));
}
function stIsPremium() {
  return stSkus.includes("premium_breeder") || stSkus.includes("rescue");
}
const v57Back = (to, label) => '<button class="action secondary" onclick="openPanel(\'' + to + '\')">← ' + (label || to) + "</button>";
const v57Msg = (t) => { const m = document.getElementById("bizMsg"); if (m) m.textContent = t; };
function v57AnimalSelect(id, val, filter) {
  const list = animals.filter(filter || (() => true));
  return '<select id="' + id + '">' + list.map((a) => "<option" + (a === val ? " selected" : "") + ">" + esc(a) + "</option>").join("") + "</select>";
}
function v57Download(name, blob) {
  const u = URL.createObjectURL(blob), l = document.createElement("a");
  l.href = u; l.download = name; document.body.appendChild(l); l.click(); l.remove();
  setTimeout(() => URL.revokeObjectURL(u), 4000);
}
async function v57ShareCanvas(c, name, title) {
  const blob = await new Promise((ok) => c.toBlob(ok, "image/png"));
  if (!blob) return;
  try {
    const f = new File([blob], name, { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], title }); return; }
  } catch (e) { if (e && e.name === "AbortError") return; }
  v57Download(name, blob);
}

/* ---------- Brumation (every plan) ---------- */
function brumationOf(a) { return profiles[a]?.brumation || null; }
function brumationStart(a) {
  if (!animals.includes(a) || brumationOf(a)) return;
  const isFeed = (e) => e.section === "Calendar" && e.animal === a && !e.done && (/feed/i.test(e.detail || "") || e.category === "feeding" || e.autoFeeding);
  const saved = entries.filter(isFeed).map((e) => ({ ...e }));
  entries = entries.filter((e) => !isFeed(e));
  profiles[a] = { ...(profiles[a] || {}), brumation: { since: today(), saved } };
  bizSaveProfiles();
  save();
  stToast("💤 " + a + " is in brumation. Feeding reminders are paused.");
  render();
}
function brumationEnd(a) {
  const b = brumationOf(a);
  if (!b) return;
  const t = today();
  (b.saved || []).forEach((e) => entries.push({ ...e, date: e.date > t ? e.date : t, done: false }));
  const p = { ...(profiles[a] || {}) };
  delete p.brumation;
  profiles[a] = p;
  entries.push({ section: "Observations", animal: a, detail: "Out of brumation", date: t, notes: "Brumated since " + niceDate(b.since) });
  bizSaveProfiles();
  save();
  stToast("☀ Welcome back, " + a + "! Feeding reminders are back on.");
  render();
}

/* ---------- Shed prediction (Founding Keeper +) ---------- */
function shedPredict(a) {
  const d = entries.filter((e) => e.animal === a && e.section === "Shed History").map((e) => e.date).filter(validDate).sort();
  const u = [...new Set(d)];
  if (u.length < 3) return null;
  const gaps = [];
  for (let i = 1; i < u.length; i++) { const g = bizDays(u[i - 1], u[i]); if (g >= 7 && g <= 365) gaps.push(g); }
  if (gaps.length < 2) return null;
  const recent = gaps.slice(-6).sort((x, y) => x - y), mid = recent[Math.floor(recent.length / 2)];
  const last = u[u.length - 1], next = advanceDate(last, mid);
  return { every: mid, last, next, count: u.length };
}
function keeperExtrasMarkup(a) {
  let h = "";
  const b = brumationOf(a);
  if (b) h += '<div class="v57Card v57Brum"><b>💤 In brumation since ' + esc(niceDate(b.since)) + '</b><p>Feeding reminders are paused.</p><button class="action secondary" onclick="brumationEnd(\'' + esc(a).replace(/'/g, "\\'") + '\')">☀ End brumation</button></div>';
  if (stCanUsePack()) {
    const sp = shedPredict(a);
    const word = animalCareType(a) === "invertebrate" ? "molt" : "shed";
    if (sp && !stNoShed(a)) {
      const left = bizDays(today(), sp.next);
      h += '<div class="v57Card"><b>✨ Next ' + word + ' around ' + esc(niceDate(sp.next)) + "</b><p>" + esc(a) + " usually " + word + "s every ~" + (sp.every >= 14 ? Math.round(sp.every / 7) + " weeks" : sp.every + " days") +
        " (from " + sp.count + " logged " + word + "s). " + (left > 0 ? "About " + left + " days to go." : left === 0 ? "Due about now." : "Running " + -left + " days past the usual.") + "</p></div>";
    }
    const p = profiles[a] || {};
    if (p.vetDue) h += '<div class="v57Card"><b>🩺 Vet follow-up ' + esc(niceDate(p.vetDue)) + "</b>" + (p.vetNote ? "<p>" + esc(p.vetNote) + "</p>" : "") + "</div>";
  }
  return h;
}
function keeperMoreButtons() {
  const q = "'" + esc(selectedAnimal).replace(/'/g, "\\'") + "'";
  return (brumationOf(selectedAnimal) ? '<button onclick="brumationEnd(' + q + ')">☀ End brumation</button>' : '<button onclick="if(confirm(\'Pause feeding reminders while ' + esc(selectedAnimal).replace(/'/g, "\\'") + ' brumates?\'))brumationStart(' + q + ')">💤 Pause for brumation</button>') +
    (stCanUsePack() ? '<button onclick="vetAnimal=' + q + ';openPanel(\'Vet Follow-up\')">🩺 Vet follow-up</button><button onclick="progressAnimal=' + q + ';openPanel(\'Photo Progress\')">📷 Photo progress</button>' : "");
}
(function () {
  const base = profileOverviewMarkup;
  profileOverviewMarkup = function (a) { return keeperExtrasMarkup(a) + base(a); };
})();

/* ---------- Keeper Tools hub (Founding Keeper +) ---------- */
let vetAnimal = "", progressAnimal = "";
BIZ_PANELS["Keeper Tools"] = () => {
  if (!stCanUsePack()) return '<p class="resourceIntro">Keeper Tools come with Founding Keeper ($14.99 once) and every paid plan.</p><button class="action" onclick="openPanel(\'Founding Keeper Studio\')">Become a Founding Keeper</button>';
  const t = (name, title, sub) => '<button class="resourceTile" onclick="' + name + '"><strong>' + title + "</strong><small>" + sub + "</small></button>";
  const preds = animals.map((a) => [a, shedPredict(a)]).filter(([a, x]) => x && !stNoShed(a)).sort((x, y) => x[1].next.localeCompare(y[1].next)).slice(0, 6);
  const meds = animals.flatMap((a) => (profiles[a]?.meds || []).filter((m) => !m.end || m.end >= today()).map((m) => a + ": " + m.drug));
  const vets = animals.filter((a) => profiles[a]?.vetDue >= today()).map((a) => a + ": " + niceDate(profiles[a].vetDue));
  return '<p class="resourceIntro">Extra care tools for Founding Keepers ♡</p>' +
    t("vetAnimal=selectedAnimal||animals[0]||'';openPanel('Vet Follow-up')", "🩺 Vet follow-ups &amp; medication", vets.length || meds.length ? esc([...vets, ...meds].slice(0, 4).join(" · ")) : "Set a vet follow-up date or a medication schedule. Reminders go to your phone.") +
    t("progressAnimal=selectedAnimal||animals[0]||'';openPanel('Photo Progress')", "📷 Photo progress", "Side-by-side growth photos, ready to share.") +
    t("openPanel('Emergency Card')", "🚨 Emergency card", "A printable card and lock-screen image with your animals, vet and emergency contact.") +
    '<h3 class="sectionTitle">Shed predictions</h3>' +
    (preds.length ? preds.map(([a, x]) => '<div class="deviceCard"><div class="deviceHeading"><b>' + esc(a) + "</b><span>~" + esc(niceDate(x.next)) + '</span></div><p class="lcSmall">Every ~' + (x.every >= 14 ? Math.round(x.every / 7) + " weeks" : x.every + " days") + " · last " + esc(niceDate(x.last)) + "</p></div>").join("")
      : '<p class="helperLine">Log at least 3 sheds for an animal and its next shed is predicted here.</p>') +
    '<p class="lcSmall">💤 Brumation: open an animal → More profile options → Pause for brumation.</p>' + v57Back("Menu");
};

/* ---------- Vet follow-up + medications ---------- */
BIZ_PANELS["Vet Follow-up"] = () => {
  const a = animals.includes(vetAnimal) ? vetAnimal : animals[0];
  if (!a) return '<p class="helperLine">Add an animal first.</p>';
  const p = profiles[a] || {}, meds = p.meds || [];
  return '<label>Animal<select onchange="vetAnimal=this.value;render()">' + animals.map((x) => "<option" + (x === a ? " selected" : "") + ">" + esc(x) + "</option>").join("") + "</select></label>" +
    '<h3 class="sectionTitle">Vet follow-up</h3><div class="saleGrid">' + bizField("vfDate", "Follow-up date", p.vetDue, "date") + bizField("vfNote", "What for", p.vetNote, "text", "Recheck mites, fecal test…") + "</div>" +
    '<div class="inlineActions"><button class="action" onclick="vetSave()">Save follow-up</button>' + (p.vetDue ? '<button class="action secondary" onclick="vetClear()">Clear</button>' : "") + "</div>" +
    '<h3 class="sectionTitle">Medications</h3>' +
    (meds.length ? meds.map((m) => '<div class="deviceCard"><div class="deviceHeading"><b>💊 ' + esc(m.drug) + " " + esc(m.dose || "") + "</b><span>" + (m.end && m.end < today() ? "finished" : "every " + (m.everyDays > 1 ? m.everyDays + " days" : "day")) +
      '</span></div><div class="recordActions"><button onclick="rescueAnimal=\'' + esc(a).replace(/'/g, "\\'") + '\';medGiven(\'' + m.id + '\')">Log dose</button><button onclick="rescueAnimal=\'' + esc(a).replace(/'/g, "\\'") + '\';medEditId=\'' + m.id + '\';openPanel(\'Medication\')">Edit</button></div></div>').join("") : '<p class="helperLine">No medications.</p>') +
    '<button class="action secondary" onclick="rescueAnimal=\'' + esc(a).replace(/'/g, "\\'") + '\';medEditId=\'\';openPanel(\'Medication\')">＋ Add medication</button>' +
    '<p class="lcSmall">Turn on phone reminders in My Account to get dose and vet reminders.</p><p id="bizMsg" class="helperLine" role="status"></p>' + v57Back("Keeper Tools");
};
function vetSave() {
  const a = animals.includes(vetAnimal) ? vetAnimal : animals[0];
  const d = bizD("vfDate");
  if (!d) return v57Msg("Choose a date.");
  profiles[a] = { ...(profiles[a] || {}), vetDue: d, vetNote: bizV("vfNote").slice(0, 120) };
  bizSaveProfiles(); save();
  stToast("🩺 Vet follow-up saved for " + niceDate(d));
  render();
}
function vetClear() {
  const a = animals.includes(vetAnimal) ? vetAnimal : animals[0], p = { ...(profiles[a] || {}) };
  delete p.vetDue; delete p.vetNote;
  profiles[a] = p; bizSaveProfiles(); save(); render();
}

/* ---------- Photo progress ---------- */
let progressPick = [];
BIZ_PANELS["Photo Progress"] = () => {
  const a = animals.includes(progressAnimal) ? progressAnimal : animals[0];
  if (!a) return '<p class="helperLine">Add an animal first.</p>';
  const g = (photos[a] || []).map((p, i) => ({ ...p, i })).filter((p) => p.src).sort((x, y) => String(x.date).localeCompare(String(y.date)));
  if (progressPick.length !== 2 || !progressPick.every((i) => g.some((p) => p.i === i))) progressPick = g.length >= 2 ? [g[0].i, g[g.length - 1].i] : [];
  setTimeout(progressDraw, 0);
  return '<label>Animal<select onchange="progressAnimal=this.value;progressPick=[];render()">' + animals.map((x) => "<option" + (x === a ? " selected" : "") + ">" + esc(x) + "</option>").join("") + "</select></label>" +
    (g.length < 2 ? '<p class="helperLine">Add at least 2 photos of ' + esc(a) + ' in the Photo Journal to compare them.</p>' :
      '<p class="lcSmall">Tap two photos: before, then after.</p><div class="v57Pick">' + g.map((p) => '<button class="' + (progressPick.includes(p.i) ? "on" : "") + '" onclick="progressToggle(' + p.i + ')"><img loading="lazy" src="' + p.src + '" alt=""><small>' + esc(niceDate(p.date)) + "</small></button>").join("") + "</div>" +
      '<canvas id="progressCanvas" class="v57Canvas" width="1080" height="1350"></canvas><div class="inlineActions"><button class="action" onclick="progressShare()">Share / save image</button></div>') +
    v57Back("Keeper Tools");
};
function progressToggle(i) {
  progressPick = progressPick.includes(i) ? progressPick.filter((x) => x !== i) : [...progressPick, i].slice(-2);
  render();
}
function weightNear(a, date) {
  const w = entries.filter((e) => e.animal === a && e.section === "Weight Tracker" && validDate(e.date)).map((e) => ({ d: e.date, g: parseFloat(String(e.detail).replace(/[^\d.]/g, "")) })).filter((x) => x.g > 0);
  if (!w.length || !validDate(date)) return "";
  w.sort((x, y) => Math.abs(bizDays(x.d, date)) - Math.abs(bizDays(y.d, date)));
  return Math.abs(bizDays(w[0].d, date)) <= 21 ? (w[0].g >= 1000 ? (w[0].g / 1000).toFixed(2) + " kg" : Math.round(w[0].g) + " g") : "";
}
async function progressDraw() {
  const c = document.getElementById("progressCanvas"), a = animals.includes(progressAnimal) ? progressAnimal : animals[0];
  if (!c || progressPick.length !== 2) return;
  const pics = progressPick.map((i) => photos[a]?.[i]).filter(Boolean).sort((x, y) => String(x.date).localeCompare(String(y.date)));
  const g = c.getContext("2d"), W = 1080, H = 1350;
  g.fillStyle = "#f6effa"; g.fillRect(0, 0, W, H);
  g.fillStyle = "#45205b"; g.textAlign = "center"; g.font = "italic 700 64px Georgia, serif"; g.fillText(a, W / 2, 110);
  const span = validDate(pics[0]?.date) && validDate(pics[1]?.date) ? bizDays(pics[0].date, pics[1].date) : 0;
  g.font = "34px Arial, sans-serif"; g.fillStyle = "#5b4566";
  g.fillText(span > 0 ? (span >= 60 ? Math.round(span / 30.4) + " months" : span + " days") + " of growing ♡" : "Then & now ♡", W / 2, 165);
  const load = (src) => new Promise((ok) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => ok(null); im.src = src; });
  for (let k = 0; k < 2; k++) {
    const p = pics[k], im = p && (await load(p.src)), x = 40 + k * 520, y = 210, w = 480, h = 860;
    g.fillStyle = "#fff"; g.fillRect(x - 8, y - 8, w + 16, h + 16);
    if (im) { const r = Math.max(w / im.width, h / im.height), sw = w / r, sh = h / r; g.drawImage(im, (im.width - sw) / 2, (im.height - sh) / 2, sw, sh, x, y, w, h); }
    g.fillStyle = "#45205b"; g.font = "700 40px Arial, sans-serif"; g.fillText(k ? "NOW" : "THEN", x + w / 2, y + h + 70);
    g.font = "32px Arial, sans-serif"; g.fillStyle = "#34213f";
    g.fillText([p?.date ? niceDate(p.date) : "", weightNear(a, p?.date)].filter(Boolean).join(" · "), x + w / 2, y + h + 118);
  }
  g.font = "italic 30px Georgia, serif"; g.fillStyle = "#79538e"; g.fillText("Scale & Tell ♡ every scale, every shed, every milestone", W / 2, H - 40);
}
function progressShare() {
  const c = document.getElementById("progressCanvas");
  if (c) v57ShareCanvas(c, "progress.png", (progressAnimal || "My reptile") + " then & now");
}

/* ---------- Emergency card ---------- */
BIZ_PANELS["Emergency Card"] = () => {
  const e = accountPrefs?.emergency || {};
  return '<p class="resourceIntro">One card with your animals, your vet and who to call. Print it for your enclosure room or wallet, or save it as your lock screen so first responders and pet-sitters can see it.</p>' +
    '<div class="saleGrid">' + bizField("emName", "Emergency contact", e.name, "text", "Name") + bizField("emPhone", "Their phone", e.phone, "tel", "555-555-5555") + bizField("emOwner", "Your name", e.owner, "text") + bizField("emOwnerPhone", "Your phone", e.ownerPhone, "tel") + "</div>" +
    '<label>Notes for responders<input id="emNotes" maxlength="160" value="' + esc(e.notes || "") + '" placeholder="Venomous: none · Feeders in garage freezer · Key under the mat"></label>' +
    '<p class="lcSmall">Vet: <b>' + esc(savedVet.name || "not set") + "</b>" + (savedVet.phone ? " · " + esc(savedVet.phone) : "") + (savedVet.emergencyName ? " · Emergency: " + esc(savedVet.emergencyName) + " " + esc(savedVet.emergencyPhone || "") : "") +
    ' <button class="authLink" onclick="openPanel(\'Find a Vet\')">Change</button></p>' +
    '<div class="inlineActions"><button class="action" onclick="emSave();emPrint()">🖨 Printable card</button><button class="action" onclick="emSave();emLock()">📱 Lock-screen image</button></div><p id="bizMsg" class="helperLine" role="status"></p>' + v57Back("Keeper Tools");
};
function emSave() {
  accountPrefsSet("emergency", { name: bizV("emName").slice(0, 60), phone: bizV("emPhone").slice(0, 30), owner: bizV("emOwner").slice(0, 60), ownerPhone: bizV("emOwnerPhone").slice(0, 30), notes: bizV("emNotes").slice(0, 160) });
  try { save(); } catch (e) {}
}
function emLines() {
  const e = accountPrefs?.emergency || {};
  return {
    e, list: animals.slice(0, 40).map((a) => a + " · " + (species[a] || "")),
    vet: [savedVet.name, savedVet.phone].filter(Boolean).join(" · "), er: [savedVet.emergencyName, savedVet.emergencyPhone].filter(Boolean).join(" · "),
  };
}
function emPrint() {
  const { e, list, vet, er } = emLines();
  const html = '<!doctype html><html><head><meta charset="utf-8"><title>Emergency card</title><style>body{font:15px/1.45 Arial,sans-serif;color:#222;max-width:720px;margin:0 auto;padding:24px}h1{color:#b3261e;font-size:30px;margin:0 0 4px}.box{border:3px solid #b3261e;border-radius:14px;padding:16px 20px;margin:14px 0}h2{font-size:17px;margin:0 0 6px;color:#45205b}ul{columns:2;padding-left:18px;margin:0}small{color:#666}</style></head><body>' +
    "<h1>🚨 Animals live here</h1><small>Emergency information · Scale &amp; Tell</small>" +
    '<div class="box"><h2>Emergency contact</h2><b>' + esc(e.name || "—") + "</b> " + esc(e.phone || "") + "<br>Owner: " + esc(e.owner || "—") + " " + esc(e.ownerPhone || "") + "</div>" +
    '<div class="box"><h2>Veterinarian</h2>' + esc(vet || "—") + (er ? "<br>Emergency clinic: " + esc(er) : "") + "</div>" +
    '<div class="box"><h2>' + list.length + " animal" + (list.length === 1 ? "" : "s") + "</h2><ul>" + list.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul></div>" +
    (e.notes ? '<div class="box"><h2>Notes</h2>' + esc(e.notes) + "</div>" : "") + "</body></html>";
  reportShow("Emergency card", html);
}
function emLock() {
  const { e, list, vet, er } = emLines();
  const c = document.createElement("canvas"); c.width = 1170; c.height = 2532;
  const g = c.getContext("2d");
  g.fillStyle = "#1d1424"; g.fillRect(0, 0, c.width, c.height);
  g.textAlign = "center"; g.fillStyle = "#fff";
  let y = 980;
  const line = (t, font, color, step) => { g.font = font; g.fillStyle = color; g.fillText(t, 585, y); y += step; };
  line("🚨 IN CASE OF EMERGENCY", "700 64px Arial, sans-serif", "#ff8a80", 90);
  line("Animals live here", "italic 52px Georgia, serif", "#e7d3f0", 110);
  if (e.name) line("Call " + e.name + "  " + (e.phone || ""), "700 50px Arial, sans-serif", "#fff", 80);
  if (e.owner) line("Owner: " + e.owner + "  " + (e.ownerPhone || ""), "44px Arial, sans-serif", "#fff", 80);
  if (vet) line("Vet: " + vet, "42px Arial, sans-serif", "#e7d3f0", 70);
  if (er) line("ER: " + er, "42px Arial, sans-serif", "#e7d3f0", 90);
  line(list.length + " animal" + (list.length === 1 ? "" : "s") + ": " + list.slice(0, 3).map((x) => x.split(" · ")[0]).join(", ") + (list.length > 3 ? "…" : ""), "40px Arial, sans-serif", "#bba8c4", 70);
  if (e.notes) line(e.notes.slice(0, 60), "38px Arial, sans-serif", "#bba8c4", 70);
  v57ShareCanvas(c, "emergency-lock-screen.png", "Emergency lock screen");
}

/* ---------- Premium: genetics calculator ---------- */
const GENE_TYPES = {
  // Recessive (r), incomplete dominant (i), dominant (d). Common ball python, corn snake, leopard gecko and boa genes.
  clown: "r", piebald: "r", pied: "r", albino: "r", axanthic: "r", "red axanthic": "r", hypo: "r", ghost: "r", "desert ghost": "r", "lavender albino": "r", "genetic stripe": "r", ultramel: "r", caramel: "r",
  monsoon: "r", puzzle: "r", "candy": "r", toffee: "r", "ivory": "r", amel: "r", anery: "r", anerythristic: "r", charcoal: "r", lavender: "r", motley: "r", stripe: "r", bloodred: "r", diffused: "r", "hypo lux": "r",
  sunkissed: "r", "tremper albino": "r", "bell albino": "r", rainwater: "r", eclipse: "r", blizzard: "r", "murphy patternless": "r", marble: "r", "sunglow": "r", kahl: "r", sharp: "r", "anery a": "r",
  pastel: "i", enchi: "i", fire: "i", "yellow belly": "i", mojave: "i", lesser: "i", butter: "i", cinnamon: "i", "black pastel": "i", mystic: "i", special: "i", "orange dream": "i", banana: "i", "coral glow": "i",
  "het red axanthic": "i", leopard: "i", gravel: "i", asphalt: "i", "spotnose": "i", "black head": "i", "mack snow": "i", "lemon frost": "i", phantom: "i", "huffman": "i", hypo_boa: "i", jungle: "i", "het daddy": "i",
  spider: "d", "gHI": "d", ghi: "d", pinstripe: "d", "woma": "d", "calico": "d", "bongo": "d", "enigma": "d", "white and yellow": "d", "w&y": "d", tessera: "d", "palmetto": "d", "motley boa": "i",
};
const GENE_TYPE_NAMES = { r: "Recessive", i: "Incomplete dominant", d: "Dominant" };
let geneOverrides = {}, genePair = { a: "", b: "", ta: "", tb: "" };
function geneParse(text) {
  // Returns { gene: { visual: 0/1/2 copies or null, het: probability of carrying one copy } }
  const out = {};
  let t = " " + String(text || "").toLowerCase().replace(/[,;/+|]+/g, " ").replace(/\s+/g, " ") + " ";
  const names = Object.keys(GENE_TYPES).concat(Object.keys(geneOverrides)).sort((x, y) => y.length - x.length);
  // "66% het pied", "pos het clown", "het clown"
  t = t.replace(/(\d{2,3})\s*%\s*(?:poss(?:ible)?\s*)?het\s+([a-z&]+(?:\s[a-z&]+)?)/g, (m, pc, g) => { const n = names.find((x) => (g + " ").startsWith(x + " ")) || g.split(" ")[0]; out[n] = { copies: 1, p: Math.min(1, Number(pc) / 100) }; return " "; });
  t = t.replace(/(?:pos(?:sible)?|ph)\s+het\s+([a-z&]+(?:\s[a-z&]+)?)/g, (m, g) => { const n = names.find((x) => (g + " ").startsWith(x + " ")) || g.split(" ")[0]; out[n] = { copies: 1, p: 0.5 }; return " "; });
  t = t.replace(/\bhet\s+([a-z&]+(?:\s[a-z&]+)?)/g, (m, g) => { const n = names.find((x) => (g + " ").startsWith(x + " ")) || g.split(" ")[0]; out[n] = { copies: 1, p: 1 }; return " "; });
  t = t.replace(/\bsuper\s+([a-z&]+(?:\s[a-z&]+)?)/g, (m, g) => { const n = names.find((x) => (g + " ").startsWith(x + " ")) || g.split(" ")[0]; out[n] = { copies: 2, p: 1 }; return " "; });
  for (const n of names) {
    const re = new RegExp("(^|\\s)" + n.replace(/[.*+?^${}()|[\]\\&]/g, "\\$&") + "(?=\\s)", "g");
    if (re.test(t)) {
      t = t.replace(re, " ");
      const ty = geneTypeOf(n);
      if (!out[n]) out[n] = { copies: ty === "r" ? 2 : 1, p: 1 };
    }
  }
  t.split(" ").filter((w) => w.length > 2 && !/^(normal|classic|wild|type|het|pos|possible|male|female|the|and|het)$/.test(w)).forEach((w) => { if (!out[w]) out[w] = { copies: 1, p: 1, unknown: true }; });
  return out;
}
function geneTypeOf(n) { return geneOverrides[n] || GENE_TYPES[n] || "i"; }
function geneLabel(n, copies) {
  const ty = geneTypeOf(n), N = n.replace(/\b\w/g, (c) => c.toUpperCase());
  if (ty === "r") return copies === 2 ? N : copies === 1 ? "het " + N : "";
  if (ty === "d") return copies ? N : "";
  return copies === 2 ? "Super " + N : copies === 1 ? N : "";
}
function geneCross(pa, pb) {
  const genes = [...new Set([...Object.keys(pa), ...Object.keys(pb)])].slice(0, 10);
  // Per gene: distribution over offspring copies 0/1/2.
  const per = genes.map((g) => {
    const passP = (x) => (x ? (x.copies === 2 ? 1 : 0.5) * x.p : 0);
    const a = passP(pa[g]), b = passP(pb[g]);
    return { g, d: [(1 - a) * (1 - b), a * (1 - b) + (1 - a) * b, a * b] };
  });
  let combos = [{ labels: [], hets: [], p: 1 }];
  per.forEach(({ g, d }) => {
    const next = [];
    combos.forEach((c) => d.forEach((pr, copies) => { if (pr > 1e-9) next.push({ labels: [...c.labels, geneLabel(g, copies)].filter(Boolean), p: c.p * pr }); }));
    combos = next;
  });
  const merged = new Map();
  combos.forEach((c) => { const ty = (l) => /^het /.test(l); const vis = c.labels.filter((l) => !ty(l)), het = c.labels.filter(ty); const k = (vis.join(" ") || "Normal") + (het.length ? " " + het.join(" ") : ""); merged.set(k, (merged.get(k) || 0) + c.p); });
  return { genes: per.map((x) => x.g), out: [...merged.entries()].sort((x, y) => y[1] - x[1]) };
}
BIZ_PANELS["Genetics Calculator"] = () => {
  if (!stIsPremium()) return '<p class="resourceIntro">The genetics calculator comes with Premium Breeder.</p><button class="action" onclick="openPanel(\'Plans\')">See plans</button>';
  const females = animals.filter((a) => v57Sex(a) !== "male"), males = animals.filter((a) => v57Sex(a) !== "female");
  const txt = (a) => [profiles[a]?.genes, profiles[a]?.morph].filter(Boolean).join(" ");
  if (!genePair.ta && genePair.a) genePair.ta = txt(genePair.a);
  if (!genePair.tb && genePair.b) genePair.tb = txt(genePair.b);
  const pa = geneParse(genePair.ta), pb = geneParse(genePair.tb), r = geneCross(pa, pb);
  const pick = (k, list) => '<select onchange="genePair.' + k + '=this.value;genePair.t' + k + '=\'\';render()"><option value="">Type genes instead</option>' + list.map((a) => '<option' + (a === genePair[k] ? " selected" : "") + ">" + esc(a) + "</option>").join("") + "</select>";
  return '<p class="resourceIntro">Pick two animals or type their genes, like <i>Pastel Enchi het Clown</i> or <i>66% het Pied</i>.</p>' +
    '<div class="saleGrid"><label>Female' + pick("a", females) + '<input id="gnA" value="' + esc(genePair.ta) + '" placeholder="Pastel het Clown" onchange="genePair.ta=this.value;render()"></label>' +
    '<label>Male' + pick("b", males) + '<input id="gnB" value="' + esc(genePair.tb) + '" placeholder="Clown" onchange="genePair.tb=this.value;render()"></label></div>' +
    (r.genes.length ? '<details class="compactDisclosure"><summary>Gene types (' + r.genes.length + ")</summary>" + r.genes.map((g) => '<label class="v57Gene">' + esc(g) + ' <select onchange="geneOverrides[\'' + esc(g).replace(/'/g, "\\'") + '\']=this.value;render()">' +
      Object.entries(GENE_TYPE_NAMES).map(([k, v]) => '<option value="' + k + '"' + (geneTypeOf(g) === k ? " selected" : "") + ">" + v + "</option>").join("") + "</select>" + (!GENE_TYPES[g] && !geneOverrides[g] ? " <small>⚠ check</small>" : "") + "</label>").join("") + "</details>" : "") +
    (r.genes.length ? '<h3 class="sectionTitle">Possible babies</h3><table class="v57Table"><tr><th>Outcome</th><th>Chance</th></tr>' +
      r.out.slice(0, 40).map(([k, p]) => "<tr><td>" + esc(k) + "</td><td>" + (p * 100 >= 1 ? Math.round(p * 1000) / 10 : (p * 100).toFixed(2)) + "%</td></tr>").join("") + "</table>" +
      (r.out.length > 40 ? '<p class="lcSmall">Showing the 40 most likely of ' + r.out.length + " outcomes.</p>" : "")
      : '<p class="helperLine">Add genes for at least one parent.</p>') +
    '<p class="lcSmall">Odds are per baby. Possible hets are averaged in. Polygenic traits and line-bred looks aren’t predictable. Check any gene marked ⚠.</p>' + bizBack();
};
function v57Sex(a) { const s = String(profiles[a]?.sex || "").toLowerCase(); return /^f|female/.test(s) ? "female" : /^m|male/.test(s) ? "male" : "unknown"; }

/* ---------- Premium: invoices & receipts ---------- */
let invoiceAnimal = "";
BIZ_PANELS.Invoices = () => {
  if (!stIsPremium()) return '<p class="resourceIntro">Invoices come with Premium Breeder.</p>' + bizBack();
  const sold = animals.filter((a) => Number(saleOf(a).price) > 0 && saleStage(saleOf(a)) !== "Not listed");
  if (!sold.length) return '<p class="helperLine">Add a price and buyer on an animal’s Listing &amp; sale first.</p>' + bizBack();
  const a = sold.includes(invoiceAnimal) ? invoiceAnimal : sold[0], s = saleOf(a);
  return '<label>Animal<select onchange="invoiceAnimal=this.value;render()">' + sold.map((x) => "<option" + (x === a ? " selected" : "") + ">" + esc(x) + " · " + esc(saleStage(saleOf(x))) + "</option>").join("") + "</select></label>" +
    '<div class="saleGrid">' + bizField("ivBuyer", "Buyer", s.buyer || s.holdFor) + bizField("ivEmail", "Buyer email", (String(s.buyerContact || "").match(/[^@\s]+@[^@\s]+\.[^@\s]+/) || [""])[0], "email") +
    bizField("ivShip", "Shipping ($)", s.shipFee || "", "number", "0") + bizField("ivTax", "Tax ($)", s.tax || "", "number", "0") + "</div>" +
    '<label>Note on invoice<input id="ivNote" maxlength="200" value="' + esc(s.invoiceNote || "") + '" placeholder="Thank you! Live arrival guaranteed with overnight shipping."></label>' +
    '<div class="inlineActions"><button class="action" onclick="invoiceMake(false)">🧾 Invoice</button><button class="action secondary" onclick="invoiceMake(true)">✓ Paid receipt</button></div>' + bizBack();
};
function invoiceMake(paid) {
  const a = invoiceAnimal && animals.includes(invoiceAnimal) ? invoiceAnimal : animals.find((x) => Number(saleOf(x).price) > 0);
  if (!a) return;
  const s = { ...saleOf(a) };
  const shipFee = Math.max(0, Number(bizV("ivShip")) || 0), tax = Math.max(0, Number(bizV("ivTax")) || 0), buyer = bizV("ivBuyer"), email = bizV("ivEmail"), note = bizV("ivNote");
  const no = s.invoiceNo || "INV-" + new Date().getFullYear() + "-" + String(Date.now()).slice(-5);
  profiles[a] = { ...(profiles[a] || {}), sale: { ...s, invoiceNo: no, shipFee: shipFee || "", tax: tax || "", invoiceNote: note, buyer: s.buyer || buyer } };
  bizSaveProfiles(); save();
  const price = Number(s.price) || 0, dep = Number(s.deposit) || 0, total = price + shipFee + tax, due = paid ? 0 : Math.max(0, total - dep);
  const biz = bizBrand?.business_name || "", p = profiles[a] || {};
  const row = (l, v, b) => "<tr><td>" + l + '</td><td style="text-align:right">' + (b ? "<b>" + v + "</b>" : v) + "</td></tr>";
  const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + (paid ? "Receipt" : "Invoice") + " " + esc(no) + '</title><style>body{font:15px/1.5 Arial,sans-serif;color:#34263b;max-width:720px;margin:0 auto;padding:28px}h1{font:italic 34px Georgia,serif;color:#45205b;margin:0}table{width:100%;border-collapse:collapse;margin:14px 0}td{padding:8px 4px;border-bottom:1px solid #eee}.paid{display:inline-block;border:3px solid #2f6a1c;color:#2f6a1c;font-weight:700;padding:4px 14px;border-radius:8px;transform:rotate(-4deg)}small{color:#777}</style></head><body>' +
    "<h1>" + (paid ? "Receipt" : "Invoice") + "</h1><p><b>" + esc(biz || "Scale & Tell keeper") + "</b><br><small>" + esc(no) + " · " + esc(niceDate(today())) + "</small></p>" +
    "<p>Bill to: <b>" + esc(buyer || "—") + "</b>" + (email ? "<br>" + esc(email) : "") + "</p>" +
    "<table>" + row(esc(a) + " · " + esc([species[a], p.sex, p.genes || p.morph].filter(Boolean).join(" · ")), bizMoney(price)) + (shipFee ? row("Shipping", bizMoney(shipFee)) : "") + (tax ? row("Tax", bizMoney(tax)) : "") +
    row("Total", bizMoney(total), true) + (dep && !paid ? row("Deposit received" + (s.depositDate ? " " + esc(niceDate(s.depositDate)) : ""), "−" + bizMoney(dep)) : "") +
    (paid ? row("Paid in full", bizMoney(total), true) : row("Balance due" + (s.balanceDue ? " by " + esc(niceDate(s.balanceDue)) : ""), bizMoney(due), true)) + "</table>" +
    (paid ? '<p class="paid">PAID</p>' : "") + (note ? "<p>" + esc(note) + "</p>" : "") + "<p><small>Made with Scale &amp; Tell ♡</small></p></body></html>";
  reportShow((paid ? "Receipt " : "Invoice ") + no + " · " + a, bizBrandPrint(html), email);
}

/* ---------- Premium: bulk import ---------- */
let bulkRows = [];
BIZ_PANELS["Bulk Import"] = () => {
  if (!stIsPremium()) return '<p class="resourceIntro">Bulk import comes with Premium Breeder.</p>' + bizBack();
  const room = stAnimalLimit() - animals.length;
  return '<p class="resourceIntro">Add many animals at once from a spreadsheet (CSV). Works with a MorphMarket export, or columns like <b>Name, Species, Sex, Traits, Birth date, Weight, Price, Status, ID</b>.</p>' +
    '<input type="file" accept=".csv,text/csv" onchange="bulkRead(this)"><p class="lcSmall">Room for ' + Math.max(0, room) + " more animals on your plan. Names already in your journal are skipped.</p>" +
    (bulkRows.length ? '<h3 class="sectionTitle">' + bulkRows.length + ' ready to add</h3><table class="v57Table"><tr><th>Name</th><th>Species</th><th>Sex</th><th>Traits</th></tr>' +
      bulkRows.slice(0, 50).map((r) => "<tr><td>" + esc(r.name) + "</td><td>" + esc(r.species) + "</td><td>" + esc(r.sex) + "</td><td>" + esc(r.genes) + "</td></tr>").join("") + "</table>" +
      (bulkRows.length > 50 ? '<p class="lcSmall">…and ' + (bulkRows.length - 50) + " more.</p>" : "") +
      '<div class="inlineActions"><button class="action" onclick="bulkAdd()">Add ' + Math.min(bulkRows.length, Math.max(0, room)) + ' animals</button><button class="action secondary" onclick="bulkRows=[];render()">Cancel</button></div>' : "") +
    '<p id="bizMsg" class="helperLine" role="status"></p>' + bizBack();
};
function bulkCsv(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim()));
}
function bulkRead(input) {
  const f = input.files?.[0];
  if (!f) return;
  if (f.size > 3e6) return v57Msg("That file is too big (3 MB max).");
  const fr = new FileReader();
  fr.onload = () => {
    const rows = bulkCsv(String(fr.result || ""));
    if (rows.length < 2) return v57Msg("No rows found.");
    const h = rows[0].map((x) => x.toLowerCase().trim());
    const col = (...names) => h.findIndex((x) => names.some((n) => x === n || x.includes(n)));
    const ci = { name: col("name", "title", "animal"), id: col("animal_id", "id", "code"), species: col("species", "category"), sex: col("sex", "gender"), traits: col("traits", "genes", "morph"),
      dob: col("dob", "birth", "hatch"), weight: col("weight"), price: col("price"), status: col("state", "status") };
    const seen = new Set(animals.map((a) => a.toLowerCase()));
    bulkRows = rows.slice(1).map((r) => {
      const g = (k) => (ci[k] >= 0 ? String(r[ci[k]] || "").trim() : "");
      let name = (g("name") || g("id")).slice(0, 50);
      const dob = g("dob"), d = /^\d{4}-\d{2}-\d{2}/.test(dob) ? dob.slice(0, 10) : (() => { const m = dob.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/); return m ? (m[3].length === 2 ? "20" + m[3] : m[3]) + "-" + m[1].padStart(2, "0") + "-" + m[2].padStart(2, "0") : ""; })();
      const sx = g("sex").toLowerCase();
      return { name, code: g("id").slice(0, 30), species: g("species").replace(/^\w/, (c) => c.toUpperCase()).slice(0, 60) || "Other", sex: /^(f|female|0\.1)/.test(sx) ? "Female" : /^(m|male|1\.0)/.test(sx) ? "Male" : "Unknown",
        genes: g("traits").slice(0, 200), hatchDate: validDate(d) ? d : "", weight: parseFloat(g("weight")) || 0, price: g("price").replace(/[^\d.]/g, "").slice(0, 10), status: /sold/i.test(g("status")) ? "Sold" : /hold|pending/i.test(g("status")) ? "Pending" : g("price") ? "Listed" : "" };
    }).filter((r) => r.name && !seen.has(r.name.toLowerCase()) && (seen.add(r.name.toLowerCase()), true)).slice(0, 500);
    render();
    if (!bulkRows.length) setTimeout(() => v57Msg("No new animals found (names may already exist)."), 50);
  };
  fr.readAsText(f);
}
function bulkAdd() {
  const room = Math.max(0, stAnimalLimit() - animals.length), list = bulkRows.slice(0, room);
  if (!list.length) return v57Msg("No room left on your plan.");
  if (!confirm("Add " + list.length + " animals to your journal?")) return;
  list.forEach((r) => {
    animals.push(r.name);
    species[r.name] = r.species;
    profiles[r.name] = { ...(profiles[r.name] || {}), sex: r.sex, genes: r.genes, ...(r.hatchDate ? { hatchDate: r.hatchDate } : {}), ...(r.code ? { code: r.code } : {}),
      ...(r.status ? { sale: { status: r.status, price: r.price, updated: today(), site: "MorphMarket" } } : {}) };
    if (r.weight > 0) entries.push({ section: "Weight Tracker", animal: r.name, date: today(), detail: String(r.weight), notes: "Imported" });
  });
  saveRoster(); bizSaveProfiles(); save();
  stToast("Added " + list.length + " animals ♡");
  bulkRows = [];
  render();
}

/* ---------- Premium: shipping weather check (Open-Meteo, no key) ---------- */
let shipWx = { from: "", to: "", date: "", out: "" };
BIZ_PANELS["Ship Weather"] = () => {
  if (!stIsPremium()) return '<p class="resourceIntro">The shipping weather check comes with Premium Breeder.</p>' + bizBack();
  if (!shipWx.from) shipWx.from = accountPrefs?.shipFrom || "";
  if (!shipWx.date) shipWx.date = advanceDate(today(), 1);
  return '<p class="resourceIntro">Checks the forecast high and low at both ends on ship day and the day it arrives. Most keepers ship between about 40°F and 90°F with heat or cold packs.</p>' +
    '<div class="saleGrid">' + bizField("swFrom", "Shipping from (city or ZIP)", shipWx.from, "text", "Tampa, FL") + bizField("swTo", "Shipping to (city or ZIP)", shipWx.to, "text", "Denver, CO") + bizField("swDate", "Ship date", shipWx.date, "date") + "</div>" +
    '<button class="action" onclick="shipCheck()">Check weather</button><div id="swOut">' + shipWx.out + '</div><p class="lcSmall">Forecasts go out about 2 weeks. Weather data from Open-Meteo.</p>' + bizBack();
};
async function shipGeo(q) {
  const zip = /^\d{5}$/.test(q.trim());
  const u = "https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&format=json&name=" + encodeURIComponent(zip ? q.trim() : q.split(",")[0].trim()) + (zip ? "&countryCode=US" : "");
  const j = await (await fetch(u)).json();
  const r = j?.results?.[0];
  if (!r) throw Error("Couldn’t find “" + q + "”.");
  return { lat: r.latitude, lon: r.longitude, name: r.name + (r.admin1 ? ", " + r.admin1 : "") };
}
async function shipCheck() {
  shipWx.from = bizV("swFrom"); shipWx.to = bizV("swTo"); shipWx.date = bizD("swDate") || shipWx.date;
  accountPrefsSet("shipFrom", shipWx.from);
  const out = document.getElementById("swOut");
  if (!shipWx.from || !shipWx.to) { if (out) out.innerHTML = '<p class="helperLine">Add both places.</p>'; return; }
  if (out) out.innerHTML = '<p class="helperLine">Checking…</p>';
  try {
    const end = advanceDate(shipWx.date, 1);
    const places = await Promise.all([shipGeo(shipWx.from), shipGeo(shipWx.to)]);
    const fc = await Promise.all(places.map((p) => fetch("https://api.open-meteo.com/v1/forecast?latitude=" + p.lat + "&longitude=" + p.lon + "&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto&start_date=" + shipWx.date + "&end_date=" + end).then((r) => r.json())));
    let bad = false;
    const rows = places.map((p, i) => {
      const d = fc[i]?.daily;
      if (!d?.time?.length) throw Error("No forecast for that date yet. Try a date within the next 2 weeks.");
      return d.time.map((t, k) => {
        const hi = Math.round(d.temperature_2m_max[k]), lo = Math.round(d.temperature_2m_min[k]), warn = hi > 90 ? "🔥 Too hot" : lo < 40 ? "❄ Too cold" : hi > 85 ? "⚠ Warm, use a cold pack" : lo < 50 ? "⚠ Cool, use a heat pack" : "✓ OK";
        if (/Too/.test(warn)) bad = true;
        return "<tr><td>" + esc(p.name) + "</td><td>" + esc(niceDate(t)) + "</td><td>" + lo + "° / " + hi + "°F</td><td>" + warn + "</td></tr>";
      }).join("");
    }).join("");
    shipWx.out = '<p class="v57Card"><b>' + (bad ? "🚫 Not a good day to ship." : "✓ Looks OK to ship.") + '</b></p><table class="v57Table"><tr><th>Place</th><th>Day</th><th>Low / high</th><th></th></tr>' + rows + "</table>";
  } catch (e) { shipWx.out = '<p class="helperLine">' + esc(e.message || "Couldn’t get the forecast.") + "</p>"; }
  if (current === "Ship Weather") render();
}

/* ---------- Premium: waitlist ---------- */
BIZ_PANELS.Waitlist = () => {
  if (!stIsPremium()) return '<p class="resourceIntro">The waitlist comes with Premium Breeder.</p>' + bizBack();
  const list = (accountPrefs?.waitlist || []).slice().sort((x, y) => (x.done ? 1 : 0) - (y.done ? 1 : 0) || String(x.date).localeCompare(String(y.date)));
  return '<p class="resourceIntro">Buyers waiting on babies, in the order they asked. Tap Offered when you reach out and Done when they’ve bought or passed.</p>' +
    (list.length ? list.map((w, i) => '<div class="deviceCard' + (w.done ? " v57Done" : "") + '"><div class="deviceHeading"><b>' + (w.done ? "" : "#" + (list.filter((x) => !x.done).indexOf(w) + 1) + " ") + esc(w.name) + "</b><span>" + esc(w.status || "Waiting") + "</span></div>" +
      '<p class="lcSmall">' + esc([w.wants, w.contact, w.deposit ? "deposit " + bizMoney(w.deposit) : "", "since " + niceDate(w.date)].filter(Boolean).join(" · ")) + '</p><div class="recordActions">' +
      (w.done ? "" : '<button onclick="waitSet(\'' + w.id + '\',\'Offered\')">Offered</button><button onclick="waitSet(\'' + w.id + '\',\'Done\')">Done</button>') + '<button onclick="waitDel(\'' + w.id + '\')">Remove</button></div></div>').join("")
      : '<p class="helperLine">No one waiting yet.</p>') +
    '<h3 class="sectionTitle">Add someone</h3><div class="saleGrid">' + bizField("wlName", "Name") + bizField("wlContact", "Email or phone") + bizField("wlWants", "What they want", "", "text", "Clown female from Roux × Kane") + bizField("wlDep", "Deposit ($)", "", "number") + "</div>" +
    '<button class="action" onclick="waitAdd()">＋ Add to waitlist</button><p id="bizMsg" class="helperLine" role="status"></p>' + bizBack();
};
function waitAdd() {
  if (!bizV("wlName")) return v57Msg("Add their name.");
  const w = { id: bizUid("wl"), name: bizV("wlName").slice(0, 80), contact: bizV("wlContact").slice(0, 120), wants: bizV("wlWants").slice(0, 160), deposit: bizV("wlDep").replace(/[^\d.]/g, "").slice(0, 10), date: today(), status: "Waiting" };
  accountPrefsSet("waitlist", [...(accountPrefs?.waitlist || []), w].slice(-300)); save(); render();
}
function waitSet(id, st) { accountPrefsSet("waitlist", (accountPrefs?.waitlist || []).map((w) => (w.id === id ? { ...w, status: st, done: st === "Done" } : w))); save(); render(); }
function waitDel(id) { if (!confirm("Remove from the waitlist?")) return; accountPrefsSet("waitlist", (accountPrefs?.waitlist || []).filter((w) => w.id !== id)); save(); render(); }

/* ---------- Premium: sales summary ---------- */
BIZ_PANELS["Sales Summary"] = () => {
  if (!stIsPremium()) return '<p class="resourceIntro">The sales summary comes with Premium Breeder.</p>' + bizBack();
  const sold = animals.map((a) => ({ a, s: saleOf(a) })).filter((x) => ["Sold", "Shipped", "Received"].includes(saleStage(x.s)) && Number(x.s.price) > 0);
  const total = sold.reduce((n, x) => n + Number(x.s.price), 0);
  const by = (f) => { const m = new Map(); sold.forEach((x) => { const k = f(x); const v = m.get(k) || { n: 0, t: 0 }; v.n++; v.t += Number(x.s.price); m.set(k, v); }); return [...m.entries()]; };
  const months = by((x) => String(x.s.soldDate || x.s.updated || "").slice(0, 7) || "No date").sort((x, y) => y[0].localeCompare(x[0])).slice(0, 12);
  const sp = by((x) => species[x.a] || "Other").sort((x, y) => y[1].t - x[1].t);
  const buyers = by((x) => String(x.s.buyer || "").trim().toLowerCase()).filter(([k]) => k);
  const repeat = buyers.filter(([, v]) => v.n > 1).length;
  const listed = animals.filter((a) => ["Listed", "Pending"].includes(saleStage(saleOf(a))));
  const max = Math.max(1, ...months.map(([, v]) => v.t));
  const ml = (k) => (/^\d{4}-\d{2}$/.test(k) ? new Date(k + "-15").toLocaleDateString("en-US", { month: "short", year: "numeric" }) : k);
  return '<div class="v57Stats"><div><b>' + bizMoney(total) + "</b><small>total sales</small></div><div><b>" + sold.length + "</b><small>animals sold</small></div><div><b>" + (sold.length ? bizMoney(total / sold.length) : "—") + "</b><small>average price</small></div><div><b>" + repeat + "</b><small>repeat buyers</small></div><div><b>" + listed.length + "</b><small>listed now</small></div></div>" +
    '<h3 class="sectionTitle">By month</h3>' + (months.length ? months.map(([k, v]) => '<div class="v57Bar"><span>' + esc(ml(k)) + '</span><i style="width:' + Math.max(4, (v.t / max) * 100) + '%"></i><b>' + bizMoney(v.t) + " · " + v.n + "</b></div>").join("") : '<p class="helperLine">No sales yet.</p>') +
    '<h3 class="sectionTitle">By species</h3><table class="v57Table"><tr><th>Species</th><th>Sold</th><th>Total</th></tr>' + sp.map(([k, v]) => "<tr><td>" + esc(k) + "</td><td>" + v.n + "</td><td>" + bizMoney(v.t) + "</td></tr>").join("") + "</table>" + bizBack();
};

/* ---------- Rescue: fosters ---------- */
BIZ_PANELS.Fosters = () => {
  if (!stIsRescue()) return bizBack();
  const ra = animals.filter((a) => rescueOf(a) && rescueOf(a).status !== "Adopted");
  const groups = new Map();
  ra.forEach((a) => { const r = rescueOf(a), k = (r.foster || "").trim() || "At the rescue"; groups.set(k, [...(groups.get(k) || []), a]); });
  const mine = String(cloudSession?.user?.email || "").toLowerCase();
  return '<p class="resourceIntro">Foster homes and the animals with them. Fosters get their own foster page where they see <b>only the animals assigned to them</b> and can log feedings, sheds, weights and notes. Everything they log lands in your journal.</p>' +
    [...groups.entries()].sort((x, y) => (x[0] === "At the rescue") - (y[0] === "At the rescue")).map(([k, list]) => {
      const email = (rescueOf(list[0])?.fosterEmail || "");
      return '<div class="deviceCard"><div class="deviceHeading"><b>' + (k === "At the rescue" ? "🏠 " : "⌂ ") + esc(k) + "</b><span>" + list.length + " animal" + (list.length > 1 ? "s" : "") + "</span></div>" +
        '<p class="lcSmall">' + list.map(esc).join(", ") + (email ? " · " + esc(email) : "") + "</p></div>";
    }).join("") +
    '<h3 class="sectionTitle">Assign a foster</h3><div class="saleGrid"><label>Animal' + v57AnimalSelect("fsAnimal", "", (a) => rescueOf(a) && rescueOf(a).status !== "Adopted") + "</label>" +
    bizField("fsName", "Foster’s name") + bizField("fsEmail", "Foster’s email", "", "email") + bizField("fsPhone", "Phone (optional)") + "</div>" +
    '<label class="emailPref"><input type="checkbox" id="fsInvite" checked> Send them the foster page link</label>' +
    '<div class="inlineActions"><button class="action" onclick="fosterAssign()">Save foster</button><button class="action secondary" onclick="fosterReturn()">Back at the rescue</button></div>' +
    '<p class="lcSmall">Fosters sign in at the foster page with the email you enter here. They can’t see your other animals or your account, and they don’t use any of your team logins. Foster page: <a href="foster.html" target="_blank" rel="noopener">scaleandtell.app/foster.html</a></p><p id="bizMsg" class="helperLine" role="status"></p>' + bizBack();
};
async function fosterAssign() {
  const a = bizV("fsAnimal"), name = bizV("fsName"), email = bizV("fsEmail").toLowerCase();
  if (!animals.includes(a) || !name) return v57Msg("Choose an animal and add the foster’s name.");
  const r = rescueOf(a) || {};
  profiles[a] = { ...(profiles[a] || {}), rescue: { ...r, foster: name.slice(0, 80), fosterEmail: email.slice(0, 254), fosterContact: [email, bizV("fsPhone")].filter(Boolean).join(" · ").slice(0, 120), fosterSince: today() } };
  entries.push({ section: "Observations", animal: a, detail: "Went to foster: " + name, date: today(), notes: "" });
  bizSaveProfiles(); save();
  if (document.getElementById("fsInvite")?.checked && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    const u = location.origin + location.pathname.replace(/[^/]*$/, "") + "foster.html", org = bizRescue?.org_name || bizBrand?.business_name || "our rescue";
    const text = "Hi " + name + "! Thank you for fostering " + a + " ♡ Log feedings, sheds and weights here: " + u + " (sign in or create an account with " + email + ").";
    try {
      if (navigator.share) await navigator.share({ title: "Foster " + a, text, url: u });
      else location.href = "mailto:" + encodeURIComponent(email) + "?subject=" + encodeURIComponent("Fostering " + a + " for " + org) + "&body=" + encodeURIComponent(text);
    } catch (e) {}
    stToast("⌂ " + a + " is with " + name + " ♡");
  } else stToast("⌂ " + a + " is with " + name);
  render();
}
function fosterReturn() {
  const a = bizV("fsAnimal"), r = rescueOf(a);
  if (!r || !r.foster) return v57Msg("That animal isn’t with a foster.");
  entries.push({ section: "Observations", animal: a, detail: "Back from foster: " + r.foster, date: today(), notes: "" });
  profiles[a] = { ...(profiles[a] || {}), rescue: { ...r, foster: "", fosterEmail: "", fosterContact: "" } };
  bizSaveProfiles(); save(); render();
}
function fosterMine() {
  const me = String(cloudSession?.user?.email || "").toLowerCase();
  return me && stTeam?.role === "member" ? animals.filter((a) => String(rescueOf(a)?.fosterEmail || "").toLowerCase() === me) : [];
}
BIZ_PANELS["My Foster Animals"] = () => {
  const list = fosterMine();
  return '<p class="resourceIntro">Thank you for fostering ♡ These animals are with you.</p>' +
    (list.length ? list.map((a) => '<div class="deviceCard"><div class="deviceHeading"><b>' + esc(a) + "</b><span>" + esc(species[a] || "") + '</span></div><div class="recordActions"><button onclick="openQuickLog(\'' + esc(a).replace(/'/g, "\\'") + '\')">＋ Quick Log</button><button onclick="openPanel(\'' + esc(a).replace(/'/g, "\\'") + '\')">Open</button></div></div>').join("") : '<p class="helperLine">No animals are assigned to you right now.</p>');
};
setInterval(() => {
  try {
    if (window.__fosterShown || !stTeam || stTeam.role !== "member" || document.body.classList.contains("stBooting") || document.body.classList.contains("authLocked")) return;
    window.__fosterShown = true;
    if (fosterMine().length && !document.getElementById("sheet")?.classList.contains("on")) openPanel("My Foster Animals");
  } catch (e) {}
}, 2500);

/* ---------- Rescue: adoption contracts (e-signature) ---------- */
const CONTRACT_DEFAULT = "ADOPTION AGREEMENT\n\n{rescue} (\"the Rescue\") agrees to place {animal} ({species}) with {adopter} (\"the Adopter\") on {date} for an adoption fee of {fee}.\n\nThe Adopter agrees to:\n1. Provide appropriate housing, heat, lighting, humidity and diet for this species.\n2. Provide veterinary care when needed.\n3. Not sell, trade, breed or give away this animal without first contacting the Rescue.\n4. Return the animal to the Rescue if they can no longer care for it.\n5. Allow the Rescue to check in on the animal's wellbeing.\n\nThe Rescue has shared all known health and history information. The adoption fee is non-refundable.\n\nBy signing below, the Adopter agrees to these terms.";
let contractAnimal = "", contractList = null;
BIZ_PANELS["Adoption Contract"] = () => {
  if (!stIsRescue()) return bizBack();
  if (contractList === null) { contractList = []; contractLoad(); }
  const list = animals.filter((a) => rescueOf(a));
  const a = list.includes(contractAnimal) ? contractAnimal : list[0] || "";
  const r = rescueOf(a) || {};
  return '<p class="resourceIntro">Fill in the adopter, then send them a link to read and sign on their phone, or hand them your phone to sign right now. Signed copies are saved here.</p>' +
    (a ? '<label>Animal<select onchange="contractAnimal=this.value;render()">' + list.map((x) => "<option" + (x === a ? " selected" : "") + ">" + esc(x) + "</option>").join("") + "</select></label>" +
      '<div class="saleGrid">' + bizField("ctName", "Adopter’s name", r.adopter) + bizField("ctEmail", "Adopter’s email", (String(r.adopterContact || "").match(/[^@\s]+@[^@\s]+\.[^@\s]+/) || [""])[0], "email") + bizField("ctFee", "Adoption fee ($)", r.fee, "number") + "</div>" +
      '<details class="compactDisclosure"><summary>Edit your contract wording</summary><textarea id="ctBody" rows="14" maxlength="15000">' + esc(accountPrefs?.contractTpl || CONTRACT_DEFAULT) + '</textarea><p class="lcSmall">Use {animal}, {species}, {adopter}, {fee}, {rescue} and {date}; they fill in automatically. Your wording is saved for next time.</p></details>' +
      '<div class="inlineActions"><button class="action" onclick="contractSend(false)">✉ Send for signature</button><button class="action secondary" onclick="contractSend(true)">✍ Sign on this phone</button></div>'
      : '<p class="helperLine">Add a rescue animal first.</p>') +
    '<p id="bizMsg" class="helperLine" role="status"></p><h3 class="sectionTitle">Contracts</h3><div id="ctList">' + contractListMarkup() + "</div>" +
    '<p class="lcSmall">Not legal advice. Have a lawyer review your contract wording if you can.</p>' + bizBack();
};
function contractListMarkup() {
  if (!contractList?.length) return '<p class="helperLine">No contracts yet.</p>';
  return contractList.map((c) => '<div class="deviceCard"><div class="deviceHeading"><b>' + esc(c.animal) + " · " + esc(c.adopter_name || "") + "</b><span>" + (c.signed_at ? "✓ Signed " + esc(niceDate(String(c.signed_at).slice(0, 10))) : "Waiting for signature") + '</span></div><div class="recordActions">' +
    '<button onclick="contractCopy(\'' + c.id + "','" + c.token + '\')">Copy link</button><button onclick="window.open(\'sign.html?c=' + c.id + "&t=" + c.token + '\',\'_blank\')">' + (c.signed_at ? "View signed copy" : "Open") + "</button></div></div>").join("");
}
async function contractLoad() {
  try {
    const { data } = await cloudClient.from("adoption_contracts").select("id,token,animal,adopter_name,signed_at,created_at").eq("owner_id", cloudJournalUid()).order("created_at", { ascending: false }).limit(50);
    contractList = data || [];
    const el = document.getElementById("ctList"); if (el) el.innerHTML = contractListMarkup();
  } catch (e) {}
}
function contractCopy(id, t) {
  const u = location.origin + location.pathname.replace(/[^/]*$/, "") + "sign.html?c=" + id + "&t=" + t;
  navigator.clipboard?.writeText(u).then(() => stToast("Link copied ♡")).catch(() => prompt("Copy this link", u));
}
async function contractSend(here) {
  const a = contractAnimal && animals.includes(contractAnimal) ? contractAnimal : animals.find((x) => rescueOf(x));
  const name = bizV("ctName"), email = bizV("ctEmail"), fee = bizV("ctFee");
  if (!a || !name) return v57Msg("Add the adopter’s name.");
  const tpl = (document.getElementById("ctBody")?.value || accountPrefs?.contractTpl || CONTRACT_DEFAULT).slice(0, 15000);
  accountPrefsSet("contractTpl", tpl);
  const org = bizRescue?.org_name || bizBrand?.business_name || "The Rescue";
  const body = tpl.replace(/\{animal\}/g, a).replace(/\{species\}/g, species[a] || "reptile").replace(/\{adopter\}/g, name).replace(/\{fee\}/g, fee ? bizMoney(fee) : "$0").replace(/\{rescue\}/g, org).replace(/\{date\}/g, niceDate(today()));
  const r = rescueOf(a) || {};
  profiles[a] = { ...(profiles[a] || {}), rescue: { ...r, adopter: name.slice(0, 80), adopterContact: email || r.adopterContact || "", fee: fee || r.fee || "" } };
  bizSaveProfiles(); save();
  v57Msg("Creating the contract…");
  try {
    const { data, error } = await cloudClient.rpc("contract_create", { p_owner: cloudJournalUid(), p_animal: a, p_org: org, p_adopter: name, p_email: email, p_body: body });
    if (error) throw error;
    const u = location.origin + location.pathname.replace(/[^/]*$/, "") + "sign.html?c=" + data.id + "&t=" + data.token;
    contractList = null;
    if (here) { location.href = u + "&back=1"; return; }
    if (navigator.share) { try { await navigator.share({ title: "Adoption contract for " + a, text: "Please read and sign the adoption contract for " + a + " ♡", url: u }); } catch (e) {} }
    else if (email) location.href = "mailto:" + encodeURIComponent(email) + "?subject=" + encodeURIComponent("Adoption contract for " + a) + "&body=" + encodeURIComponent("Hi " + name + ",\n\nPlease read and sign the adoption contract for " + a + " here:\n" + u + "\n\nThank you ♡\n" + org);
    else await navigator.clipboard?.writeText(u);
    stToast("✍ Contract ready. Link shared ♡");
    render();
  } catch (e) { v57Msg(e.message || "Couldn’t create the contract."); }
}

/* ---------- Rescue: vet costs per animal ---------- */
function vetCostOf(a, year) {
  return entries.filter((e) => e.section === "Ledger" && e.type === "expense" && e.animal === a && /vet|medic|health/i.test(e.category || "") && (!year || String(e.date).startsWith(year))).reduce((n, e) => n + (Number(e.amount) || 0), 0);
}
function vetCostAdd(a) {
  const amt = Number(prompt("Vet cost for " + a + " ($)") || 0);
  if (!(amt > 0)) return;
  const what = (prompt("What was it for? (optional)") || "").slice(0, 100);
  entries.push({ section: "Ledger", animal: a, type: "expense", amount: Math.round(amt * 100) / 100, category: "Vet care", detail: "Vet: " + (what || a), date: today() });
  save();
  stToast("🩺 " + bizMoney(amt) + " added to " + a + "’s vet costs");
  render();
}

/* ---------- Rescue: year-end impact report ---------- */
let impactYear = String(new Date().getFullYear());
BIZ_PANELS["Impact Report"] = () => {
  if (!stIsRescue()) return bizBack();
  const y = impactYear, ra = animals.filter((a) => rescueOf(a));
  const intakes = ra.filter((a) => String(rescueOf(a).intakeDate || "").startsWith(y)), adopted = ra.filter((a) => String(rescueOf(a).adoptedDate || "").startsWith(y));
  const inCare = ra.filter((a) => rescueOf(a).status !== "Adopted");
  const days = adopted.map((a) => { const r = rescueOf(a); return r.intakeDate && r.adoptedDate ? bizDays(r.intakeDate, r.adoptedDate) : null; }).filter((x) => x !== null && x >= 0);
  const vet = ra.reduce((n, a) => n + vetCostOf(a, y), 0);
  const fees = ledgerRows().filter((r) => r.type === "income" && String(r.date).startsWith(y) && /adoption/i.test(r.category || r.detail || "")).reduce((n, r) => n + (Number(r.amount) || 0), 0);
  const spc = new Map(); intakes.forEach((a) => spc.set(species[a] || "Other", (spc.get(species[a] || "Other") || 0) + 1));
  impactData = { y, intakes, adopted, inCare, days, vet, fees, spc };
  const years = [...new Set([String(new Date().getFullYear()), ...ra.map((a) => String(rescueOf(a).intakeDate || "").slice(0, 4)).filter((x) => /^\d{4}$/.test(x))])].sort().reverse();
  return '<label>Year<select onchange="impactYear=this.value;render()">' + years.map((x) => "<option" + (x === y ? " selected" : "") + ">" + x + "</option>").join("") + "</select></label>" +
    '<div class="v57Stats"><div><b>' + intakes.length + "</b><small>intakes</small></div><div><b>" + adopted.length + "</b><small>adoptions</small></div><div><b>" + inCare.length + "</b><small>in care now</small></div><div><b>" + (days.length ? Math.round(days.reduce((n, x) => n + x, 0) / days.length) : "—") + "</b><small>avg days to adoption</small></div><div><b>" + bizMoney(vet) + "</b><small>vet care</small></div><div><b>" + bizMoney(fees) + "</b><small>adoption fees</small></div></div>" +
    (spc.size ? '<h3 class="sectionTitle">Species taken in</h3><p class="lcSmall">' + [...spc.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => esc(k) + " " + v).join(" · ") + "</p>" : "") +
    '<button class="action" onclick="impactPrint()">🖨 Printable report</button><p class="lcSmall">Intakes and adoptions come from each animal’s rescue record. Vet costs come from “Add vet cost” and Income &amp; expenses entries in a vet category.</p>' + bizBack();
};
let impactData = null;
function impactPrint() {
  const d = impactData;
  if (!d) return;
  const org = bizRescue?.org_name || bizBrand?.business_name || "Our rescue";
  const stat = (n, l) => '<div style="flex:1 1 30%;border:2px solid #e3d4ea;border-radius:14px;padding:14px;text-align:center"><b style="font:700 34px Georgia,serif;color:#45205b">' + n + "</b><br><small>" + l + "</small></div>";
  const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + esc(org) + " impact " + d.y + '</title><style>body{font:15px/1.5 Arial,sans-serif;color:#34263b;max-width:760px;margin:0 auto;padding:28px}h1{font:italic 36px Georgia,serif;color:#45205b;margin:0}.g{display:flex;flex-wrap:wrap;gap:12px;margin:18px 0}li{margin:2px 0}</style></head><body>' +
    "<h1>" + esc(org) + "</h1><p><b>" + d.y + " impact report</b></p>" +
    '<div class="g">' + stat(d.intakes.length, "animals taken in") + stat(d.adopted.length, "adopted into new homes") + stat(d.inCare.length, "in our care now") +
    stat(d.days.length ? Math.round(d.days.reduce((n, x) => n + x, 0) / d.days.length) : "—", "average days to adoption") + stat(bizMoney(d.vet), "spent on vet care") + stat(bizMoney(d.fees), "adoption fees") + "</div>" +
    (d.spc.size ? "<h3>Species we helped</h3><ul>" + [...d.spc.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => "<li>" + esc(k) + ": " + v + "</li>").join("") + "</ul>" : "") +
    (d.adopted.length ? "<h3>Adopted this year</h3><p>" + d.adopted.map(esc).join(", ") + "</p>" : "") +
    "<p><small>Made with Scale &amp; Tell ♡</small></p></body></html>";
  reportShow(org + " · " + d.y + " impact report", bizBrandPrint(html));
}

/* ---------- Rescue: donate button ---------- */
BIZ_PANELS["Donate Button"] = () => {
  if (!stIsRescue()) return bizBack();
  return '<p class="resourceIntro">Add your donation link (PayPal, Venmo, Givebutter, your website…) and a <b>♡ Donate</b> button shows on your public page.</p>' +
    bizField("dnUrl", "Donation link", accountPrefs?.donateUrl || "", "url", "https://www.paypal.com/donate/?hosted_button_id=…") +
    '<button class="action" onclick="donateSave()">Save</button><p id="bizMsg" class="helperLine" role="status"></p><p class="lcSmall">Fill in your Rescue profile first so your public page exists.</p>' + bizBack();
};
async function donateSave() {
  const u = bizV("dnUrl");
  try {
    const { data, error } = await cloudClient.rpc("set_donate_url", { p_url: u });
    if (error) throw error;
    if (data === "invalid") return v57Msg("Use a full link starting with https://");
    if (data === "profile") return v57Msg("Save your Rescue profile first (Business Tools → Rescue profile).");
    accountPrefsSet("donateUrl", u); save();
    v57Msg(u ? "✓ Donate button is on your public page." : "✓ Donate button removed.");
  } catch (e) { v57Msg(e.message || "Couldn’t save."); }
}

/* ---------- V3.58 · Herpstat (Spyder Robotics): the thermostat posts readings to our server ---------- */
let herpState = { key: "", devices: null, msg: "" };
const HERPSTAT_URL = "https://fitlubsbesadknkjimqd.supabase.co/functions/v1/herpstat";
BIZ_PANELS.Herpstat = () => {
  if (herpState.devices === null) { herpState.devices = []; setTimeout(herpLoad, 0); }
  const list = herpState.devices.filter((d) => !d.hidden);
  const ago = (t) => { const m = Math.round((Date.now() - new Date(t)) / 60000); return m < 2 ? "just now" : m < 60 ? m + " min ago" : m < 1440 ? Math.round(m / 60) + " h ago" : Math.round(m / 1440) + " days ago"; };
  return '<p class="lcSmall">Scale &amp; Tell is an independent app. It is not affiliated with, endorsed by or sponsored by Spyder Robotics. Herpstat is a product of Spyder Robotics.</p><p class="resourceIntro">Your Herpstat sends its readings to Scale &amp; Tell every few minutes. You’ll get a phone alert when an output goes past the high or low alarm you set on the Herpstat.</p>' +
    (list.length ? list.map((d) => '<div class="deviceCard"><div class="deviceHeading"><b>🌡 ' + esc(d.nickname || d.mac) + "</b><span>" + esc(ago(d.updated_at)) + "</span></div>" +
      (d.outputs || []).map((o) => '<p class="lcSmall"><b>' + esc(o.name) + ":</b> " + (o.temp ?? "—") + "°" + (o.set != null ? " (set " + o.set + "°)" : "") + (o.rh != null ? " · " + o.rh + "% RH" : "") + (o.power != null ? " · power " + o.power + "%" : "") +
        (o.alarm && (o.hi != null || o.lo != null) ? " · alarm " + (o.lo ?? "–") + "–" + (o.hi ?? "–") + "°" : "") + "</p>").join("") +
      '<div class="recordActions"><button onclick="herpHide(\'' + esc(d.mac) + '\')">Remove</button></div></div>').join("") : '<p class="helperLine">No Herpstat connected yet.</p>') +
    '<h3 class="sectionTitle">Connect your Herpstat</h3><ol class="goveeSteps"><li>Tap <b>Show my Herpstat key</b> below.</li><li>On your Herpstat’s settings page, turn on <b>database upload</b> (Spyderweb).</li><li>Enter this <b>upload URL</b>:<br><code class="v57Code">' + HERPSTAT_URL + '</code></li><li>Enter your <b>API key</b> from below, then save. Readings show up here within about 10 minutes.</li></ol>' +
    (herpState.key ? '<p class="lcSmall">Your key:</p><code class="v57Code">' + esc(herpState.key) + '</code><div class="inlineActions"><button class="action secondary" onclick="navigator.clipboard.writeText(\'' + esc(herpState.key) + '\').then(()=>stToast(\'Key copied ♡\'))">Copy key</button><button class="action secondary" onclick="navigator.clipboard.writeText(HERPSTAT_URL).then(()=>stToast(\'URL copied ♡\'))">Copy URL</button></div>'
      : '<button class="action" onclick="herpKey()">Show my Herpstat key</button>') +
    '<p class="lcSmall">Keep your key private: anyone with it could send readings to your account. Not sure where these settings are on your model? Check your Herpstat manual for the database upload settings. For help with the Herpstat itself, contact Spyder Robotics; for help with Scale &amp; Tell, contact us.</p><p id="bizMsg" class="helperLine" role="status">' + esc(herpState.msg) + "</p>" +
    '<button class="action secondary" onclick="openPanel(\'Devices\')">← Devices</button>';
};
async function herpKey() {
  try { const { data, error } = await cloudClient.rpc("herpstat_key"); if (error) throw error; herpState.key = data; } catch (e) { herpState.msg = e.message || "Couldn’t get your key."; }
  if (current === "Herpstat") render();
}
async function herpLoad() {
  try {
    const { data } = await cloudClient.from("herpstat_devices").select("mac,nickname,outputs,updated_at,hidden").eq("user_id", cloudJournalUid()).order("updated_at", { ascending: false });
    herpState.devices = data || [];
  } catch (e) {}
  if (current === "Herpstat") render();
}
async function herpHide(mac) {
  if (!confirm("Remove this Herpstat from Scale & Tell? (Turn off database upload on the Herpstat too.)")) return;
  try { await cloudClient.rpc("herpstat_hide", { p_mac: mac }); } catch (e) {}
  herpState.devices = null; render();
}

/* V3.60 · The Create Account checkbox for update emails is applied after the first sign-in. */
async function stApplySignupEmailChoice() {
  let v = null;
  try { v = localStorage.getItem("scaleTellPendingUpdates"); } catch (e) {}
  if (v === null || !cloudClient || !cloudSession) return;
  try {
    const { error } = await cloudClient.from("email_prefs").update({ updates: v === "1", updated_at: new Date().toISOString() }).eq("user_id", cloudSession.user.id);
    if (!error) { localStorage.removeItem("scaleTellPendingUpdates"); stEmailPref = v === "1"; }
  } catch (e) {}
}

/* ---------- V3.62 · Sensor alert ranges (Govee). The server checks every 30 minutes and alerts the phone. ---------- */
let sensorAlertIdx = -1;
const SENSOR_DEFAULTS = { "Warm side": [85, 95], "Cool side": [72, 82], Ambient: [72, 88] };
function sensorAlertText(d) {
  const t = d.alertMin != null || d.alertMax != null ? "Alerts " + (d.alertMin ?? "–") + "–" + (d.alertMax ?? "–") + "°F" : "No temperature alerts";
  const h = d.humMin != null || d.humMax != null ? " · " + (d.humMin ?? "–") + "–" + (d.humMax ?? "–") + "% RH" : "";
  return t + h;
}
BIZ_PANELS["Sensor Alerts"] = () => {
  const d = devices[sensorAlertIdx];
  if (!d) return '<p class="helperLine">Pick a sensor first.</p><button class="action secondary" onclick="openPanel(\'Govee Sensors\')">← Govee sensors</button>';
  const def = SENSOR_DEFAULTS[d.placement] || [75, 90];
  const v = (x, dflt) => (x == null ? dflt : x);
  return '<p class="resourceIntro">Set the safe range for <b>' + esc(d.nickname) + "</b> (" + esc(d.animal) + " · " + esc(d.placement) + "). We check it about every 30 minutes and send your phone an alert if it goes outside the range.</p>" +
    '<h3 class="sectionTitle">Temperature (°F)</h3><div class="saleGrid">' + bizField("saTmin", "Too cold below", v(d.alertMin, def[0]), "number", "", 'step="0.5"') + bizField("saTmax", "Too hot above", v(d.alertMax, def[1]), "number", "", 'step="0.5"') + "</div>" +
    '<h3 class="sectionTitle">Humidity (%) <small>optional</small></h3><div class="saleGrid">' + bizField("saHmin", "Too dry below", d.humMin ?? "", "number", "e.g. 50") + bizField("saHmax", "Too humid above", d.humMax ?? "", "number", "e.g. 80") + "</div>" +
    '<p class="lcSmall">Starting numbers are general guides for the ' + esc(String(d.placement || "").toLowerCase()) + '. Check the right range for your species in the care guides or with your vet.</p>' +
    '<div class="inlineActions"><button class="action" onclick="sensorAlertSave(true)">Save alerts</button><button class="action secondary" onclick="sensorAlertSave(false)">Turn alerts off</button></div>' +
    '<p class="lcSmall">Alerts need phone notifications turned on (My Account → reminders).</p><p id="bizMsg" class="helperLine" role="status"></p><button class="action secondary" onclick="openPanel(\'Govee Sensors\')">← Govee sensors</button>';
};
function sensorAlertSave(on) {
  const d = devices[sensorAlertIdx];
  if (!d) return;
  const n = (id) => { const x = bizV(id); if (x === "") return null; const v = Number(x); return Number.isFinite(v) ? Math.round(v * 10) / 10 : null; };
  const next = { ...d };
  if (on) {
    const a = n("saTmin"), b = n("saTmax"), c = n("saHmin"), e = n("saHmax");
    if (a != null && b != null && a >= b) return v57Msg("The too-cold number must be lower than the too-hot number.");
    if (c != null && e != null && c >= e) return v57Msg("The too-dry number must be lower than the too-humid number.");
    if ([a, b].some((x) => x != null && (x < 32 || x > 140)) || [c, e].some((x) => x != null && (x < 0 || x > 100))) return v57Msg("Check the numbers.");
    Object.assign(next, { alertMin: a, alertMax: b, humMin: c, humMax: e });
  } else ["alertMin", "alertMax", "humMin", "humMax"].forEach((k) => delete next[k]);
  saveDevices(devices.map((x, i) => (i === sensorAlertIdx ? next : x)));
  try { save(); } catch (e) {}
  stToast(on ? "🔔 " + sensorAlertText(next) : "Alerts off for " + d.nickname);
  openPanel("Govee Sensors");
}

/* ---------- V3.62 · In-app banners: admins post a short message that shows at the top of Home ---------- */
let stBanners = [], stBannerAdmin = null;
async function stBannerLoad() {
  if (!cloudClient || !cloudSession) return;
  try { const { data } = await cloudClient.rpc("banners_for_me"); stBanners = data || []; } catch (e) { stBanners = []; }
  stBannerShow();
}
function stBannerShow() {
  document.getElementById("stBanner")?.remove();
  let seen = {};
  try { seen = JSON.parse(localStorage.getItem("scaleTellBannersSeen") || "{}"); } catch (e) {}
  const b = stBanners.find((x) => !seen[x.id]);
  const anchor = document.querySelector(".homeHello") || document.getElementById("bizBanner");
  if (!b || !anchor) return;
  const el = document.createElement("div");
  el.id = "stBanner";
  el.className = "stBanner";
  el.innerHTML = '<button aria-label="Dismiss" onclick="stBannerHide(\'' + b.id + '\')">×</button><b>' + esc(b.title) + "</b>" + (b.body ? "<p>" + esc(b.body) + "</p>" : "");
  (document.getElementById("bizBanner") && document.getElementById("bizBanner").style.display !== "none" ? document.getElementById("bizBanner") : anchor).after(el);
}
function stBannerHide(id) {
  try { const s = JSON.parse(localStorage.getItem("scaleTellBannersSeen") || "{}"); s[id] = 1; localStorage.setItem("scaleTellBannersSeen", JSON.stringify(s)); } catch (e) {}
  document.getElementById("stBanner")?.remove();
}
(function () {
  const base = renderHomeCards;
  renderHomeCards = function () { const r = base.apply(this, arguments); try { if (stBanners.length) setTimeout(stBannerShow, 0); } catch (e) {} return r; };
})();
setInterval(() => { try { if (cloudSession && stAccessChecked && !window.__stBannerLoaded) { window.__stBannerLoaded = true; stBannerLoad(); } } catch (e) {} }, 2000);
async function stBannerAdminLoad() {
  try { const { data } = await cloudClient.rpc("banners_admin"); stBannerAdmin = data || []; } catch (e) { stBannerAdmin = []; }
  const el = document.getElementById("bnList"); if (el) el.innerHTML = stBannerListMarkup();
}
function stBannerListMarkup() {
  const act = (stBannerAdmin || []).filter((b) => b.active && (!b.expires_at || new Date(b.expires_at) > new Date()));
  return act.length ? act.map((b) => '<div class="deviceCard"><div class="deviceHeading"><b>' + esc(b.title) + "</b><span>" + esc(b.audience) + '</span></div><p class="lcSmall">Showing until ' + esc(niceDate(String(b.expires_at).slice(0, 10))) + '</p><div class="recordActions"><button onclick="stBannerEnd(\'' + b.id + '\')">Take down</button></div></div>').join("") : '<p class="helperLine">No banners showing.</p>';
}
async function stBannerPost() {
  const title = bizV("bnTitle"), body = bizV("bnBody"), aud = document.getElementById("bnAud")?.value || "all", days = Number(bizV("bnDays")) || 14;
  if (!title) return v57Msg("Add a headline.");
  if (!confirm("Show this banner to " + (aud === "all" ? "everyone" : aud) + " for " + days + " days?")) return;
  try { const { error } = await cloudClient.rpc("banner_save", { p_title: title, p_body: body, p_audience: aud, p_days: days }); if (error) throw error; stToast("📣 Banner is live"); stBannerAdmin = null; window.__stBannerLoaded = false; render(); }
  catch (e) { v57Msg(e.message || "Couldn’t post the banner."); }
}
async function stBannerEnd(id) {
  try { await cloudClient.rpc("banner_end", { p_id: id }); } catch (e) {}
  stBannerAdmin = null; render();
}
(function () {
  const base = BIZ_PANELS["Send Update Email"];
  BIZ_PANELS["Send Update Email"] = function () {
    if (!window.__stIsAdmin) return base();
    if (stBannerAdmin === null) { stBannerAdmin = []; setTimeout(stBannerAdminLoad, 0); }
    return '<h3 class="sectionTitle">📣 In-app banner</h3><p class="lcSmall">Shows at the top of Home until it expires or they close it. Instant, no email needed.</p>' +
      bizField("bnTitle", "Headline", "", "text", "New: Keeper Tools are here ♡") + '<label>Message (optional)<textarea id="bnBody" rows="3" maxlength="400" placeholder="Vet reminders, shed predictions and more. Menu → Keeper Tools."></textarea></label>' +
      '<div class="saleGrid"><label>Show to<select id="bnAud"><option value="all">Everyone</option><option value="keepers">Keepers</option><option value="breeders">Breeders</option><option value="rescues">Rescues</option></select></label>' + bizField("bnDays", "Days to show", 14, "number", "", 'min="1" max="90"') + "</div>" +
      '<button class="action" onclick="stBannerPost()">Post banner</button><div id="bnList">' + stBannerListMarkup() + '</div><h3 class="sectionTitle">✉ Email</h3>' + base();
  };
})();


/* ===================== V3.63 · Help, What's new, getting started, admin dashboard ===================== */
const HELP = [
  ["Add an animal", "Home → ＋ Add animal (or My Reptiles → ＋). Pick the species group, then the species. You can add a photo later in Photo Journal."],
  ["Log a feeding, shed or weight", "Tap ＋ Quick Log on Home or on the animal’s page, pick the animal, then tap Fed, Refused, Shed or Weighed. For more detail (prey, time, notes) use Care Logs → Feeding Tracker."],
  ["Turn on phone reminders", "Menu → My Account → reminders, then tap Turn on reminders and allow notifications. On iPhone, add Scale & Tell to your Home Screen first (Menu → More → Get the App)."],
  ["Set feeding reminders", "Open the animal → More profile options → Personal care targets and set “feed every … days”. Logging a feeding schedules the next reminder."],
  ["Pause reminders for brumation", "Open the animal → More profile options → Pause for brumation. Tap End brumation when they wake up."],
  ["Use the app on more than one device", "Sign in with the same email on each device. Your journal syncs automatically."],
  ["Share my journal with family", "Founding Keeper and paid plans: Menu → Family Sharing (or Business Tools → Team logins) and invite their email. They sign in with their own password."],
  ["Import my old records", "Menu → Import Existing Records. Upload a screenshot, paste notes, or upload a spreadsheet. Check each row before saving."],
  ["Make a Care Binder or pet-sitter sheet", "Founding Keeper: Menu → Founding Keeper → Care Binder. Everyone: Menu → Pet-Sitter Sheet. You can print, save a PDF or email a link."],
  ["Connect a Govee sensor", "Menu → Devices → Connect Govee. Request your API key in the Govee Home app (Profile → Settings → Apply for API Key), paste it, link the sensor and set your alert range."],
  ["Connect a Herpstat thermostat", "Menu → Devices → Connect Herpstat. Copy your key and the upload address into your Herpstat’s database upload settings."],
  ["Change the app design or colors", "Founding Keeper: Menu → Founding Keeper → designs. Premium Breeder and Rescue: Business Tools → Your logo & colors."],
  ["Upgrade or see plans", "Menu → Plans & animal spaces."],
  ["Cancel a yearly plan", "In PayPal → Automatic payments. You keep your plan until the end of the year you paid for."],
  ["Use a member or promo code", "Enter it when you create your account, or on the plans screen under “Member or promo code”."],
  ["Racks, pairings and litters", "Breeder plans: Menu → Racks & Breeding. Add racks and tubs, feed a whole rack at once, log pairings and clutches or litters."],
  ["Sell an animal or send its records", "Open the animal → More profile options → Listing & sale. Use Buyer packet to send its history, or Send records to move it to the new owner’s account."],
  ["Set up my rescue", "Business Tools → Rescue profile & intake, then ＋ Intake on Home for each new animal. Turn on your listing and intake open/full switch."],
  ["Fosters", "Business Tools → Foster homes. Add the foster’s email and send them the foster page link. They only see the animals assigned to them."],
  ["Adoption contracts", "Business Tools → Adoption contracts. Fill in the adopter and send the link, or tap Sign on this phone."],
  ["Download a backup", "Menu → More → Data & Backup → Download a copy."],
  ["Something isn’t updating", "Close the app all the way and open it again. Still stuck? Send us a note below."],
  ["Delete my account", "Menu → More → Privacy & Account."],
];
let helpQuery = "";
function helpMarkup() {
  const q = helpQuery.trim().toLowerCase();
  const rows = HELP.filter(([t, a]) => !q || (t + " " + a).toLowerCase().includes(q));
  return '<h3 class="sectionTitle">How do I…?</h3><input id="helpQ" type="search" placeholder="Search help (e.g. reminders, foster, backup)" value="' + esc(helpQuery) + '" oninput="helpQuery=this.value;const c=this.selectionStart;render();const h=document.getElementById(\'helpQ\');if(h){h.focus();h.setSelectionRange(c,c)}">' +
    '<div class="helpList">' + (rows.length ? rows.map(([t, a]) => "<details><summary>" + esc(t) + "</summary><p>" + esc(a) + "</p></details>").join("") : '<p class="helperLine">No match. Send us your question below ♡</p>') + "</div>" +
    '<h3 class="sectionTitle">Still need help?</h3>';
}

/* What's new: one screen the first time someone opens a new version. */
const WHATS_NEW_VER = "3.69";
const WHATS_NEW = [
  ["🍽", "Feed Day", "Check off everyone who ate and save once. Find it on Home under Today’s Care."],
  ["💌", "Cuter care sheets", "For a pet-sitter or a new home. Print, save a PDF, email it or copy it as text."],
  ["🏡", "Enclosure setup", "Substrate, heat and UVB on each animal’s Habitat tab, with UVB bulb and cleanout reminders."],
  ["🧊", "Feeder freezer", "What’s on hand, cost per meal and when to reorder. Menu → Feeder Freezer."],
  ["🏷", "Enclosure labels", "Print a QR label for any animal from its profile."],
  ["⏳", "Smoother start", "One loading screen, then your own layout and colors. No more flashing."],
  ["🩺", "Keeper Tools", "Vet and medication reminders, shed predictions, then-and-now photos and an emergency card (Founding Keeper)."],
  ["♡", "Family sharing", "Founding Keeper includes 3 logins; $29.99 plans include 5."],
  ["💤", "Brumation mode", "Pause feeding reminders while an animal brumates."],
  ["🌡", "Works with Herpstat & Govee", "Live readings, plus your own too-hot and too-cold alerts."],
  ["🐀", "More animals", "Rodents, small mammals, amphibians, fish and more."],
  ["❓", "Help", "Search “How do I…?” answers in Menu → More → Help & Feedback."],
];
BIZ_PANELS["What's New"] = () =>
  '<p class="resourceIntro">Here’s what’s new in Scale &amp; Tell ♡</p>' +
  WHATS_NEW.map(([i, t, d]) => '<div class="v57Card"><b>' + i + " " + esc(t) + "</b><p>" + esc(d) + "</p></div>").join("") +
  (stIsRescue() ? '<div class="v57Card"><b>⌂ Rescue tools</b><p>Foster page, e-sign adoption contracts, impact report and a donate button in Business Tools.</p></div>' : "") +
  (stIsPremium() && bizIsBreeder() ? '<div class="v57Card"><b>🧬 Premium tools</b><p>Genetics calculator, invoices, bulk import, shipping weather, waitlist and sales summary in Business Tools.</p></div>' : "") +
  '<button class="action" onclick="closePanel()">Got it ♡</button>';
setInterval(() => {
  try {
    if (window.__wnChecked || !cloudSession || !stAccessChecked || !stCanUseApp() || document.body.classList.contains("stBooting") || document.getElementById("sheet")?.classList.contains("on")) return;
    window.__wnChecked = true;
    const seen = localStorage.getItem("scaleTellWhatsNew");
    localStorage.setItem("scaleTellWhatsNew", WHATS_NEW_VER);
    if (seen !== WHATS_NEW_VER && (seen || animals.length)) setTimeout(() => { if (!document.getElementById("sheet")?.classList.contains("on")) openPanel("What's New"); }, 1500);
  } catch (e) {}
}, 2000);

/* Getting started: three steps for new keepers, shown on Home until done or hidden. */
function startSteps() {
  return [
    ["Add your first animal", animals.length > 0, "addAnimal()"],
    ["Log a feeding", entries.some((e) => e.section === "Feeding Tracker"), "openQuickLog(animals[0])"],
    ["Turn on phone reminders", typeof pushDeviceEnabled !== "undefined" && !!pushDeviceEnabled, "openPanel('Cloud Account')"],
  ];
}
function startCardShow() {
  document.getElementById("startCard")?.remove();
  try { if (localStorage.getItem("scaleTellStartHidden")) return; } catch (e) {}
  if (!cloudSession || stTeam?.role === "member") return;
  const steps = startSteps(), done = steps.filter((x) => x[1]).length;
  if (done === steps.length) return;
  const anchor = document.getElementById("homeToday");
  if (!anchor) return;
  const el = document.createElement("div");
  el.id = "startCard";
  el.className = "startCard";
  el.innerHTML = '<button class="startX" aria-label="Hide" onclick="try{localStorage.setItem(\'scaleTellStartHidden\',\'1\')}catch(e){};document.getElementById(\'startCard\').remove()">×</button><b>Get set up ♡ ' + done + " of " + steps.length + "</b>" +
    steps.map(([t, ok, fn], i) => '<button class="startStep' + (ok ? " done" : "") + '"' + (ok || (i === 1 && !animals.length) ? " disabled" : ' onclick="' + fn + '"') + "><span>" + (ok ? "✓" : i + 1) + "</span>" + esc(t) + "</button>").join("");
  anchor.before(el);
}
(function () {
  const base = renderHomeCards;
  renderHomeCards = function () { const r = base.apply(this, arguments); setTimeout(() => { try { startCardShow(); } catch (e) {} }, 0); return r; };
})();

/* Admin dashboard */
let adminStats = null;
BIZ_PANELS["Admin Dashboard"] = () => {
  if (!window.__stIsAdmin) return "<p>Admins only.</p>";
  if (adminStats === null) { adminStats = {}; setTimeout(adminLoad, 0); }
  const a = adminStats || {}, n = (v) => (v == null ? "…" : v), P = a.plans || {};
  const stat = (v, l) => "<div><b>" + n(v) + "</b><small>" + l + "</small></div>";
  const sg = a.signups || [], mx = Math.max(1, ...sg.map((x) => x.n));
  return '<p class="resourceIntro">Live numbers from your database.</p>' +
    '<h3 class="sectionTitle">Accounts</h3><div class="v57Stats">' + stat(a.users, "accounts") + stat(a.new7, "new this week") + stat(a.new30, "new in 30 days") + stat(a.active7, "active this week") + stat(a.noJournal, "signed up, no journal yet") + stat(a.inactive30, "quiet 30+ days") + "</div>" +
    '<h3 class="sectionTitle">Plans</h3><div class="v57Stats">' + stat(a.paidAccounts, "paying accounts") + stat(a.promoAccounts, "promo code") + stat(P.member, "member") + stat(P.founding_keeper, "Founding Keeper") + stat(P.founding_breeder, "Founding Breeder") + stat(P.premium_breeder, "Premium Breeder") + stat(P.rescue, "Rescue") + "</div>" +
    '<h3 class="sectionTitle">Signups, last 14 days</h3>' + (sg.length ? sg.map((x) => '<div class="v57Bar"><span>' + esc(x.d.slice(5)) + '</span><i style="width:' + Math.max(2, (x.n / mx) * 100) + '%"></i><b>' + x.n + "</b></div>").join("") : "") +
    '<h3 class="sectionTitle">Usage</h3><div class="v57Stats">' + stat(a.animals, "animals") + stat(a.logs, "care logs") + stat(a.pushOn, "reminders on") + stat(a.emailOn, "update emails on") + stat(a.teams, "shared logins") + stat(a.govee, "Govee") + stat(a.herpstat, "Herpstat") + stat(a.contractsSigned != null ? a.contractsSigned + "/" + a.contracts : null, "contracts signed") + stat(a.inquiries30, "inquiries (30 days)") + "</div>" +
    (a.quiet?.length ? '<h3 class="sectionTitle">Paid accounts quiet 30+ days</h3><p class="lcSmall">' + a.quiet.map((x) => esc(x.email)).join(" · ") + "</p>" : "") +
    '<button class="action secondary" onclick="adminStats=null;render()">Refresh</button>';
};
async function adminLoad() {
  try { const { data, error } = await cloudClient.rpc("admin_stats"); if (error) throw error; adminStats = data || {}; } catch (e) { adminStats = { error: e.message }; }
  if (current === "Admin Dashboard") render();
}

/* V3.64 · Ready-made update emails: tap one to fill in the subject and message. */
const UPDATE_TEMPLATES = [
  { label: "Help, getting started & privacy", aud: "all", subject: "New in Scale & Tell: help, a smoother start and more ♡",
    body: "Hi keepers ♡\n\nHere’s what’s new in Scale & Tell:\n\n• A smoother start: one loading screen, then your own layout and colors. No more flashing.\n• Help is built in: search “How do I…?” answers in Menu → More → Help & Feedback.\n• New keepers get a simple 3-step getting-started card on Home.\n• “What’s new” shows you each update the first time you open the app.\n• Rescues: fosters now get their own foster page that shows only the animals assigned to them.\n• Updated Privacy Policy and new Terms of Use, linked in Menu → More → Privacy & Account.\n\nClose the app all the way and open it again to get the update.\n\nThank you for being here ♡\nScale & Tell",
    banner: "New: Help, a smoother start and more ♡" },
  { label: "Herpstat, Govee alerts & banners", aud: "all", subject: "Your sensors just got smarter ♡",
    body: "Hi keepers ♡\n\nNew this week in Scale & Tell:\n\n• Works with Herpstat thermostats: your Herpstat can send its temperatures, humidity and alarms straight into the app (Menu → Devices → Connect Herpstat).\n• Govee alert ranges: choose your own too-hot, too-cold and humidity limits for each sensor, and get a phone alert when it drifts.\n• More animals: rodents, small mammals, amphibians, fish and more, with litter and pup wording for rodent breeders.\n• Brumation mode pauses feeding reminders while an animal brumates.\n\nScale & Tell is independent and not affiliated with Spyder Robotics or Govee.\n\nClose the app all the way and open it again to get the update ♡\nScale & Tell",
    banner: "New: Herpstat & Govee alerts ♡" },
  { label: "Keeper Tools, family sharing & business tools", aud: "all", subject: "Keeper Tools, family sharing and more are here ♡",
    body: "Hi keepers ♡\n\nBig update today:\n\n• Keeper Tools (Founding Keeper): vet and medication reminders, shed predictions from your own logs, then-and-now growth photos and an emergency card.\n• Family sharing: Founding Keeper includes 3 logins, and $29.99 plans include 5.\n• Watch & Learn: hand-picked videos by topic.\n• Feeding times: every feeding can now save the time.\n• Premium Breeder: genetics calculator, invoices and receipts, bulk import, shipping weather check, waitlist and sales summary.\n• Rescues: foster tracking, e-sign adoption contracts, a year-end impact report, a donate button and vet costs per animal.\n\nFounding Keeper is $14.99 once, and 10% of paid-plan profits go to a nonprofit reptile rescue.\n\nClose the app all the way and open it again to get the update ♡\nScale & Tell",
    banner: "New: Keeper Tools & family sharing ♡" },
];
function stUseTemplate(i) {
  const t = UPDATE_TEMPLATES[i];
  if (!t) return;
  stMailState.subject = t.subject;
  stMailState.body = t.body;
  stMailState.aud = t.aud;
  stMailState.msg = "Filled in “" + t.label + "”. Check it, send yourself a test, then Send to everyone.";
  render();
  setTimeout(() => {
    const bt = document.getElementById("bnTitle"); if (bt) bt.value = t.banner;
    document.getElementById("mailSubj")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 50);
}
(function () {
  const base = BIZ_PANELS["Send Update Email"];
  BIZ_PANELS["Send Update Email"] = function () {
    if (!window.__stIsAdmin) return base();
    return '<h3 class="sectionTitle">⚡ Ready-made updates</h3><p class="lcSmall">Tap one to fill in the email (and the banner headline). You can edit it before sending.</p>' +
      UPDATE_TEMPLATES.map((t, i) => '<button class="resourceTile" onclick="stUseTemplate(' + i + ')"><strong>' + esc(t.label) + "</strong><small>" + esc(t.subject) + "</small></button>").join("") + base();
  };
})();

/* V3.65 · My Reptiles: sort, filter by species, and feeding status on every row. */
let rosterSort = "", rosterSp = "";
try { rosterSort = localStorage.getItem("scaleTellRosterSort") || ""; } catch (e) {}
function rosterStatus(a) {
  if (brumationOf(a)) return { text: "💤 Brumating", cls: "" };
  const f = lastFeed(a), n = Number(carePlans[a]?.feedDays) || 0;
  if (!f) return { text: "No feedings logged yet", cls: "" };
  const d = daysSince(f.date), left = n ? n - d : null;
  const fed = (f.detail === "Refused" ? "Refused " : "Fed ") + (d === 0 ? "today" : d === 1 ? "yesterday" : d + " days ago");
  if (left === null) return { text: fed, cls: "" };
  return { text: fed + " · " + (left > 0 ? "due in " + left + (left === 1 ? " day" : " days") : left === 0 ? "due today" : "overdue " + -left + (left === -1 ? " day" : " days")), cls: left < 0 ? "late" : left === 0 ? "due" : "" };
}
function rosterOrder() {
  const idx = animals.map((a, i) => i).filter((i) => !rosterSp || (species[animals[i]] || "Other") === rosterSp);
  const fedAt = (a) => lastFeed(a)?.date || "";
  const dueIn = (a) => { const f = lastFeed(a), n = Number(carePlans[a]?.feedDays) || 0; return f && n ? n - daysSince(f.date) : 9999; };
  const by = {
    name: (x, y) => animals[x].localeCompare(animals[y]),
    species: (x, y) => (species[animals[x]] || "").localeCompare(species[animals[y]] || "") || animals[x].localeCompare(animals[y]),
    due: (x, y) => dueIn(animals[x]) - dueIn(animals[y]),
    fed: (x, y) => fedAt(animals[x]).localeCompare(fedAt(animals[y])),
  }[rosterSort];
  return by ? idx.sort(by) : idx;
}
function rosterToolbar() {
  const sps = [...new Set(animals.map((a) => species[a] || "Other"))].sort();
  return '<div class="rosterTools"><label>Sort<select onchange="rosterSort=this.value;try{localStorage.setItem(\'scaleTellRosterSort\',this.value)}catch(e){};render()">' +
    [["", "My order"], ["name", "Name A–Z"], ["species", "Species"], ["due", "Feeding due first"], ["fed", "Longest since fed"]].map(([v, l]) => '<option value="' + v + '"' + (rosterSort === v ? " selected" : "") + ">" + l + "</option>").join("") + "</select></label></div>" +
    (sps.length > 1 ? '<div class="chipRow">' + ['<button class="chip' + (!rosterSp ? " on" : "") + '" onclick="rosterSp=\'\';render()">All ' + animals.length + "</button>"].concat(sps.map((x) => '<button class="chip' + (rosterSp === x ? " on" : "") + '" onclick="rosterSp=\'' + esc(x).replace(/'/g, "\\'") + '\';render()">' + esc(x) + " " + animals.filter((a) => (species[a] || "Other") === x).length + "</button>")).join("") + "</div>" : "");
}

/* V3.65 · Clear every due reminder at once (repeating ones schedule their next date as usual). */
function completeAllDue() {
  const t = today(), idx = entries.map((e, i) => [e, i]).filter(([e]) => e.section === "Calendar" && !e.done && e.date <= t).map(([, i]) => i);
  if (!idx.length || !confirm("Mark all " + idx.length + " due reminders done? Repeating reminders move to their next date.")) return;
  const r = render;
  render = () => {};
  try { idx.forEach((i) => completeReminder(i, true)); } finally { render = r; }
  stToast("✓ " + idx.length + " reminders done");
  render();
}

/* ===================== V3.65 · Front page for first-time visitors (signed out, never signed in here) ===================== */
function landingFirstVisit() {
  try { return !localStorage.getItem("scaleTellSyncOwner33") && !localStorage.getItem("scaleTellLandingSeen"); } catch (e) { return true; }
}
function landingTop() {
  return '<div class="landTop"><p class="landKick">The care journal for reptiles &amp; exotic pets</p><h1 class="landH">Every feeding, shed &amp; milestone, in one place ♡</h1>' +
    '<p class="landSub">Reminders on your phone, care history you can share with your vet, and tools for breeders and rescues. Made by keepers, for keepers.</p>' +
    '<div class="landCtas"><button class="authButton" onclick="authChooseMode(\'signup\')">Get started</button><button class="authButton light" onclick="document.getElementById(\'cloudEmail\').scrollIntoView({behavior:\'smooth\',block:\'center\'});document.getElementById(\'cloudEmail\').focus()">I have an account</button></div>' +
    '<a class="landMore" href="#landFeatures" onclick="event.preventDefault();document.getElementById(\'landFeatures\').scrollIntoView({behavior:\'smooth\'})">See what it does ↓</a></div><h2 class="landSignin">Sign in</h2>';
}
function landingBottom() {
  const f = (i, t, d) => '<div class="landF"><span>' + i + "</span><b>" + t + "</b><small>" + d + "</small></div>";
  const plan = (n, p, d) => '<div class="landP"><b>' + n + "</b><span>" + p + "</span><small>" + d + "</small></div>";
  return '<section class="landSec" id="landFeatures"><h2>For keepers</h2><div class="landGrid">' +
    f("🍽", "One-tap logs", "Feedings with the time, sheds, weights, cleanings and notes.") +
    f("🔔", "Phone reminders", "Never wonder who ate when, even with a big collection.") +
    f("📈", "Trends", "Weight charts, refusal streaks and shed predictions.") +
    f("🩺", "Vet-ready history", "Send your vet a full care history before the visit.") +
    f("🏖", "Pet-sitter sheet", "Clear care instructions in one tap.") +
    f("▷", "Learn", "Illustrated care guides and hand-picked videos.") + "</div>" +
    '<h2>For breeders</h2><div class="landGrid">' +
    f("▤", "Racks", "Feed a whole rack at once.") + f("💞", "Pairings & clutches", "Locks, ovulation, clutches, litters and babies.") +
    f("🧬", "Genetics calculator", "See possible babies from any pairing.") + f("📦", "Sales", "Listings, deposits, invoices, buyer packets and Expo Mode.") + "</div>" +
    '<h2>For rescues</h2><div class="landGrid">' +
    f("♧", "Intake to adoption", "Quarantine, medical, available and adopted.") + f("⌂", "Fosters", "Each foster sees only their animals.") +
    f("✍", "E-sign contracts", "Adopters sign on their phone.") + f("★", "Impact report", "Year-end numbers for grants and donors.") + "</div>" +
    '<h2>Plans</h2><div class="landPlans">' +
    plan("Founding Keeper", "$14.99 once", "40 animals · 3 logins · reminders, designs, Care Binder &amp; Keeper Tools") +
    plan("Founding Breeder", "$19.99 / year", "150 animals · racks, pairings, clutches · 3 logins") +
    plan("Premium Breeder", "$29.99 / year", "400 animals · genetics, invoices, your logo · 5 logins") +
    plan("Rescue", "$29.99 / year", "400 animals · fosters, contracts · $14.99 for verified 501(c)(3)s") +
    '</div><p class="landNote">No subscription for Founding Keeper. 10% of paid-plan profits are donated to a nonprofit reptile rescue ♡</p>' +
    '<p class="landNote">Works on iPhone, Android and computer. Works with Govee sensors and Herpstat thermostats (Scale &amp; Tell is independent and not affiliated with either company).</p>' +
    '<button class="authButton" onclick="authChooseMode(\'signup\');window.scrollTo({top:0,behavior:\'smooth\'})">Create my account</button>' +
    '<p class="landFoot"><a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a> · <a href="mailto:support@scaleandtell.app">Contact</a></p></section>';
}

/* =====================================================================
   V3.69 · Care Sheet (pet-sitter or new home) with print / PDF / email,
   Feed Day checklist, feeder freezer stock with cost & reorder date,
   enclosure setup (substrate, heat, lighting, UVB) with bulb & cleanout
   reminders, profile "at a glance" and a QR enclosure label.
   ===================================================================== */

/* ---------- Shared little helpers ---------- */
const v69Num = (v) => { const n = parseFloat(String(v ?? "").replace(/[^0-9.]/g, "")); return Number.isFinite(n) ? n : null; };
const v69Q = (s) => String(s ?? "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
function v69Latest(a, section, test) {
  return entries.filter((e) => e.animal === a && e.section === section && (!test || test(e)))
    .sort((x, y) => y.date.localeCompare(x.date) || entries.indexOf(y) - entries.indexOf(x))[0] || null;
}
function v69Ago(date) {
  if (!date) return "";
  const d = daysSince(date);
  return d === 0 ? "today" : d === 1 ? "yesterday" : d < 60 ? d + " days ago" : Math.round(d / 30.4) + " months ago";
}
function v69Age(date) {
  if (!validDate(date)) return "";
  const m = Math.floor(bizDays(date, today()) / 30.44);
  if (m < 1) return bizDays(date, today()) + " days old";
  if (m < 24) return m + " month" + (m === 1 ? "" : "s") + " old";
  return Math.floor(m / 12) + " years old";
}
const CLEAN_DETAILS = ["Full cleanout", "Substrate change", "Enclosure refresh"];
function v69LastWeight(a) {
  const w = entries.filter((e) => e.animal === a && e.section === "Weight Tracker" && v69Num(e.detail) !== null)
    .sort((x, y) => y.date.localeCompare(x.date) || entries.indexOf(y) - entries.indexOf(x));
  if (!w.length) return null;
  const g = v69Num(w[0].detail), prev = w[1] ? v69Num(w[1].detail) : null;
  return { g, date: w[0].date, change: prev !== null ? Math.round((g - prev) * 10) / 10 : null };
}
function v69Grams(g) {
  if (g === null || g === undefined) return "";
  return g >= 1000 ? (Math.round(g / 10) / 100) + " kg (" + Math.round(g) + " g)" : Math.round(g * 10) / 10 + " g";
}

/* ---------- Enclosure setup (stored on the animal's profile) ---------- */
const SUBSTRATES = ["Aspen shavings", "Cypress mulch", "Coconut husk / chips", "Coco fiber (eco earth)", "Bioactive soil mix", "Topsoil / sand mix", "Excavator clay", "Orchid bark", "Sphagnum moss", "Paper towel / newspaper", "Reptile carpet", "Tile / slate", "Paper bedding", "Hemp bedding", "Water (aquatic)", "Other"];
const HEAT_SOURCES = ["Heat mat / heat tape", "Deep heat projector", "Halogen flood bulb", "Ceramic heat emitter", "Radiant heat panel", "Basking bulb", "Room heat only", "None needed", "Other"];
const UVB_TYPES = [["", "Not set"], ["none", "No UVB"], ["t5", "T5 HO linear"], ["t8", "T8 linear"], ["compact", "Compact / coil"], ["mvb", "Mercury vapor (MVB)"], ["led", "LED only (no UVB)"], ["other", "Other UVB"]];
const UVB_STRENGTHS = ["", "2.4% / shade dweller", "5–7% / forest", "10–12% / desert", "14%"];
const UVB_MONTHS = { t5: 12, mvb: 12, t8: 6, compact: 6, other: 12 };
const v69HasUvb = (s) => !!s && ["t5", "t8", "compact", "mvb", "other"].includes(s.uvbType);
function setupOf(a) { return (profiles[a] && profiles[a].setup) || {}; }
function v69UvbLabel(s) {
  const t = (UVB_TYPES.find((x) => x[0] === s.uvbType) || ["", ""])[1];
  return [t, s.uvbPct, s.uvbBrand].filter(Boolean).join(" · ");
}
/* Last time something happened: a logged care entry, or a matching reminder the keeper ticked off. */
function v69LastEvent(a, kind) {
  let dates = [];
  const s = setupOf(a);
  if (kind === "uvb") {
    const e = v69Latest(a, "UVB & Lighting", (x) => x.detail === "UVB bulb change");
    if (e) dates.push(e.date);
    if (validDate(s.uvbInstalled)) dates.push(s.uvbInstalled);
  } else if (kind === "clean") {
    const e = v69Latest(a, "Enclosure Care", (x) => CLEAN_DETAILS.includes(x.detail));
    if (e) dates.push(e.date);
    if (validDate(s.cleanSince)) dates.push(s.cleanSince);
  } else if (kind === "spot") {
    const e = v69Latest(a, "Enclosure Care", (x) => x.detail === "Spot clean" || CLEAN_DETAILS.includes(x.detail));
    if (e) dates.push(e.date);
    if (validDate(s.cleanSince)) dates.push(s.cleanSince);
  } else if (kind === "water") {
    const e = v69Latest(a, "Enclosure Care", (x) => x.detail === "Water change");
    if (e) dates.push(e.date);
  }
  entries.filter((e) => e.section === "Calendar" && e.done && e.animal === a && String(e.habKey || "").startsWith(kind + ":") && e.completedAt)
    .forEach((e) => dates.push(String(e.completedAt).slice(0, 10)));
  dates = dates.filter(validDate).sort();
  return dates.pop() || "";
}
function v69Due(a, kind) {
  const s = setupOf(a), last = v69LastEvent(a, kind);
  if (kind === "uvb") {
    if (!v69HasUvb(s) || !last) return null;
    const months = Number(s.uvbMonths) || UVB_MONTHS[s.uvbType] || 12;
    return { last, due: advanceMonths(last, months), every: months + " months" };
  }
  const days = Number(kind === "clean" ? s.cleanDays : s.spotDays) || 0;
  if (!days || !last) return null;
  return { last, due: advanceDate(last, days), every: days === 1 ? "day" : days + " days" };
}
function v69DueText(d) {
  if (!d) return "";
  const left = bizDays(today(), d.due);
  return left > 1 ? "due " + niceDate(d.due) + " (in " + left + " days)" : left === 1 ? "due tomorrow" : left === 0 ? "due today" : "overdue " + -left + (left === -1 ? " day" : " days");
}
const HAB_REM = {
  uvb: ["☀ Replace UVB bulb", "UVB & Lighting", "UVB bulb change", "remUvb"],
  clean: ["🧽 Full cleanout / substrate change", "Enclosure Care", "Full cleanout", "remClean"],
  spot: ["🧽 Spot clean", "Enclosure Care", "Spot clean", "remSpot"],
};
Object.values(HAB_REM).forEach(([d, sec, det]) => (REMINDER_LOG[d] = [sec, det]));

/* Bulb and cleanout reminders live in the Calendar like any reminder (so they reach phones). Tagged habKey. */
let habSyncT = null;
function habSync() {
  try {
    const want = new Map();
    animals.forEach((a) => {
      const s = setupOf(a);
      Object.entries(HAB_REM).forEach(([kind, [detail, , , flag]]) => {
        if (s[flag] === false) return;
        const d = v69Due(a, kind);
        if (!d) return;
        const k = kind + ":" + a + ":" + d.due;
        want.set(k, { section: "Calendar", animal: a, detail, date: d.due, notes: "", repeatDays: 0, done: false, habKey: k });
      });
    });
    let paidAuto = false;
    try { paidAuto = !!(homeBusinessMode() || stIsRescue() || bizIsBreeder() || stCanUsePack()); } catch (e) {}
    if (!paidAuto) feederList().forEach((f) => { if (Number(f.count) <= Number(f.low)) { const k = "feeder:" + f.name + ":" + today().slice(0, 7); want.set(k, { section: "Calendar", animal: "Feeders", detail: "🐁 " + f.name + ": " + Number(f.count) + " left, time to reorder", date: today(), notes: "", repeatDays: 0, done: false, habKey: k }); } });
    const before = entries.length, have = new Set(entries.filter((e) => e.habKey).map((e) => e.habKey));
    entries = entries.filter((e) => !e.habKey || e.done || want.has(e.habKey));
    let changed = entries.length !== before;
    want.forEach((e, k) => { if (!have.has(k)) { entries.push(e); changed = true; } });
    if (changed) { syncStampEntries(); scaleStoreSet("scaleTellApprovedPreview", JSON.stringify(entries)); try { updateStats(); } catch (e) {} }
  } catch (e) {}
}
(function () {
  const base = bizQueueAuto;
  bizQueueAuto = function () { base.apply(this, arguments); clearTimeout(habSyncT); habSyncT = setTimeout(habSync, 900); };
  setTimeout(habSync, 4000);
})();

let habEditOpen = "";
function habRefresh() { if (animals.includes(current)) profileTab("Habitat"); else render(); }
function habSetupCard(a) {
  const s = setupOf(a), p = profiles[a] || {};
  if (habEditOpen === a) return habSetupForm(a);
  const uvb = v69Due(a, "uvb"), clean = v69Due(a, "clean"), spot = v69Due(a, "spot");
  const row = (icon, label, val) => '<div class="v69Row"><span>' + icon + "</span><b>" + label + "</b><em>" + (val ? esc(val) : '<i class="v69None">not set</i>') + "</em></div>";
  const dueRow = (icon, label, d, kind, btn) => d ? '<div class="v69Due' + (bizDays(today(), d.due) < 0 ? " late" : bizDays(today(), d.due) <= 3 ? " soon" : "") + '"><span>' + icon + "</span><div><b>" + label + "</b><small>Every " + esc(d.every) + " · last " + esc(niceDate(d.last)) + " · " + esc(v69DueText(d)) + '</small></div><button onclick="habDone(\'' + kind + "')\">" + btn + "</button></div>" : "";
  const any = p.enclosure || s.substrate || s.heat || s.uvbType || s.lightHours;
  return '<div class="v69Setup"><div class="v69SetupHead"><h3>🏡 Enclosure setup</h3><button class="authLink" onclick="habEditOpen=selectedAnimal;habRefresh()">' + (any ? "Edit" : "Set up") + "</button></div>" +
    (any ? row("📐", "Enclosure", p.enclosure) + row("🪵", "Substrate", s.substrate === "Other" ? s.substrateOther || "Other" : s.substrate) + row("🔥", "Heat", s.heat) +
      row("☀", "Lighting / UVB", s.uvbType ? v69UvbLabel(s) : "") + (s.lightHours ? row("🕗", "Lights on", s.lightHours + " hours a day") : "") +
      (s.decor ? row("🌿", "Hides & décor", s.decor) : "")
      : '<p class="lcSmall">Add the enclosure size, substrate, heat and UVB so it shows on care sheets, and get reminders when the UVB bulb or a full cleanout is due.</p>') +
    dueRow("☀", "UVB bulb", uvb, "uvb", "Changed today") + dueRow("🧽", "Full cleanout", clean, "clean", "Done today") + dueRow("✨", "Spot clean", spot, "spot", "Done today") +
    (v69HasUvb(s) && !uvb ? '<p class="lcSmall">Add the date this UVB bulb went in (Edit) to get a replacement reminder.</p>' : "") + "</div>";
}
function habSetupForm(a) {
  const s = setupOf(a), p = profiles[a] || {};
  const sel = (id, opts, val) => '<select id="' + id + '">' + opts.map((o) => { const [v, t] = Array.isArray(o) ? o : [o, o || "Not set"]; return '<option value="' + esc(v) + '"' + (v === (val || "") ? " selected" : "") + ">" + esc(t) + "</option>"; }).join("") + "</select>";
  const chk = (id, on, label) => '<label class="checkLine"><input type="checkbox" id="' + id + '"' + (on !== false ? " checked" : "") + "> " + label + "</label>";
  return '<div class="v69Setup"><div class="v69SetupHead"><h3>🏡 Enclosure setup</h3></div>' +
    '<label>Enclosure size / type<input id="hsEnc" maxlength="70" value="' + esc(p.enclosure || "") + '" placeholder="e.g. 4×2×2 PVC, 41 qt tub"></label>' +
    '<div class="saleGrid"><label>Substrate' + sel("hsSub", [""].concat(SUBSTRATES), s.substrate) + '</label><label>If other<input id="hsSubO" maxlength="60" value="' + esc(s.substrateOther || "") + '"></label></div>' +
    '<label>Main heat source' + sel("hsHeat", [""].concat(HEAT_SOURCES), s.heat) + "</label>" +
    '<div class="saleGrid"><label>UVB / lighting' + sel("hsUvb", UVB_TYPES, s.uvbType) + '</label><label>UVB strength' + sel("hsPct", UVB_STRENGTHS, s.uvbPct) + "</label></div>" +
    '<div class="saleGrid"><label>Bulb brand / model<input id="hsBrand" maxlength="60" value="' + esc(s.uvbBrand || "") + '" placeholder="e.g. Arcadia T5 12%"></label><label>Bulb put in on<input id="hsInst" type="date" max="' + today() + '" value="' + esc(s.uvbInstalled || "") + '"></label></div>' +
    '<div class="saleGrid"><label>Replace UVB every (months)<input id="hsMonths" type="number" min="1" max="24" value="' + esc(s.uvbMonths || "") + '" placeholder="T5/MVB 12 · T8/coil 6"></label><label>Lights on (hours a day)<input id="hsHours" type="number" min="0" max="24" value="' + esc(s.lightHours || "") + '" placeholder="e.g. 12"></label></div>' +
    '<label>Hides &amp; décor (optional)<input id="hsDecor" maxlength="120" value="' + esc(s.decor || "") + '" placeholder="2 hides, water bowl, climbing branch"></label>' +
    '<h3 class="sectionTitle">Cleaning schedule</h3><div class="saleGrid"><label>Spot clean every (days)<input id="hsSpot" type="number" min="0" max="60" value="' + esc(s.spotDays || "") + '" placeholder="Leave blank for no reminder"></label><label>Full cleanout every (days)<input id="hsClean" type="number" min="0" max="365" value="' + esc(s.cleanDays || "") + '" placeholder="e.g. 90"></label></div>' +
    '<label>Last full cleanout<input id="hsSince" type="date" max="' + today() + '" value="' + esc(v69LastEvent(a, "clean") || "") + '"></label>' +
    chk("hsRemUvb", s.remUvb, "Remind me when the UVB bulb is due") + chk("hsRemClean", s.remClean, "Remind me when a full cleanout is due") + chk("hsRemSpot", s.remSpot, "Remind me to spot clean") +
    '<p class="lcSmall">Reminders show in your Calendar and on your phone if phone reminders are on. Bulb timing is a general guide: follow your bulb maker’s replacement advice.</p>' +
    '<div class="inlineActions"><button class="action" onclick="habSaveSetup()">Save setup</button><button class="action secondary" onclick="habEditOpen=\'\';habRefresh()">Cancel</button></div></div>';
}
function habSaveSetup() {
  const a = selectedAnimal;
  if (!animals.includes(a)) return;
  const n = (id, lo, hi) => { const v = Number(bizV(id)); return bizV(id) !== "" && Number.isFinite(v) && v >= lo && v <= hi ? Math.round(v) : ""; };
  const ck = (id) => !!document.getElementById(id)?.checked;
  const s = {
    substrate: bizV("hsSub"), substrateOther: bizV("hsSubO").slice(0, 60), heat: bizV("hsHeat"), uvbType: bizV("hsUvb"), uvbPct: bizV("hsPct"),
    uvbBrand: bizV("hsBrand").slice(0, 60), uvbInstalled: bizD("hsInst"), uvbMonths: n("hsMonths", 1, 24), lightHours: n("hsHours", 0, 24),
    decor: bizV("hsDecor").slice(0, 120), spotDays: n("hsSpot", 1, 60), cleanDays: n("hsClean", 1, 365), cleanSince: bizD("hsSince"),
    remUvb: ck("hsRemUvb"), remClean: ck("hsRemClean"), remSpot: ck("hsRemSpot"),
  };
  profiles[a] = { ...(profiles[a] || {}), enclosure: bizV("hsEnc").slice(0, 70), setup: s };
  bizSaveProfiles();
  habEditOpen = "";
  habSync();
  save();
  stToast("Setup saved ♡");
  habRefresh();
}
function habDone(kind) {
  const a = selectedAnimal;
  if (!animals.includes(a)) return;
  const s = setupOf(a), t = today();
  const [, section, detail] = HAB_REM[kind];
  entries.push({ section, animal: a, detail, date: t, notes: "", ...(kind === "uvb" ? { bulb: [s.uvbBrand, s.uvbPct].filter(Boolean).join(" ").slice(0, 80) } : {}) });
  if (kind === "uvb") profiles[a] = { ...(profiles[a] || {}), setup: { ...s, uvbInstalled: t } };
  // Tick off any open reminder for this.
  entries.forEach((e) => { if (e.section === "Calendar" && !e.done && e.animal === a && String(e.habKey || "").startsWith(kind + ":") && e.date <= advanceDate(t, 7)) { e.done = true; e.completedAt = new Date().toISOString(); } });
  bizSaveProfiles();
  save();
  habSync();
  stToast("Logged ♡ " + a + " · " + detail);
  habRefresh();
}
(function () {
  const base = habitatMarkup;
  habitatMarkup = function (a) { if (habEditOpen && habEditOpen !== a) habEditOpen = ""; return habSetupCard(a) + base(a); };
})();

/* ---------- Profile: at a glance + enclosure label ---------- */
function glanceMarkup(a) {
  const tile = (icon, label, val, sub) => '<div class="v69Tile"><span>' + icon + "</span><b>" + (val ? esc(val) : '<i class="v69None">—</i>') + "</b><small>" + label + (sub ? " · " + esc(sub) : "") + "</small></div>";
  const f = lastFeed(a), w = v69LastWeight(a), s = setupOf(a);
  const sh = stNoShed(a) ? null : v69Latest(a, "Shed History");
  const poop = v69Latest(a, "Observations", (e) => /poop|urate/i.test(e.detail || ""));
  const water = v69LastEvent(a, "water"), clean = v69LastEvent(a, "clean"), uvb = v69HasUvb(s) || v69Latest(a, "UVB & Lighting", (e) => e.detail === "UVB bulb change") ? v69LastEvent(a, "uvb") : null;
  const sub = s.substrate === "Other" ? s.substrateOther : s.substrate;
  const n = Number(carePlans[a]?.feedDays) || 0;
  // Last feeding and weight are already in the profile header, so they aren't repeated here.
  let tiles = (stNoShed(a) ? "" : tile("✨", "Last shed", sh ? v69Ago(sh.date) : "", sh?.detail && sh.detail !== "Complete shed" ? sh.detail : "")) +
    tile("💧", "Water changed", water ? v69Ago(water) : "") + tile("🧽", "Full cleanout", clean ? v69Ago(clean) : "") +
    (uvb !== null ? tile("☀", "UVB bulb", uvb ? v69Ago(uvb).replace(" ago", " old") : "", "") : "") +
    tile("💩", "Last poop", poop ? v69Ago(poop.date) : "") + (sub ? tile("🪵", "Substrate", sub) : "");
  return '<div class="v69Glance">' + tiles + '</div><div class="v69GlanceBtns"><button onclick="encLabelOpen(selectedAnimal)">🏷 Enclosure label (QR)</button><button onclick="sitterMode=\'rehome\';openPanel(\'Pet-Sitter Sheet\',selectedAnimal)">💌 Care sheet</button></div>';
}
(function () {
  const base = profileOverviewMarkup;
  profileOverviewMarkup = function (a) { let g = ""; try { g = glanceMarkup(a); } catch (e) {} return g + base(a); };
})();
function encLabelOpen(a) {
  if (!animals.includes(a)) return;
  const p = profiles[a] || {}, tab = window.open("", "_blank");
  if (!tab) return alert("Allow pop-ups to open the label.");
  const url = location.origin + location.pathname + "?animal=" + encodeURIComponent(a);
  const sex = /^m/i.test(p.sex || "") ? "♂" : /^f/i.test(p.sex || "") ? "♀" : "";
  const lines = [species[a], p.genes || p.morph, p.hatchDate ? "Hatched " + niceDate(p.hatchDate) : p.acquiredDate ? "Since " + niceDate(p.acquiredDate) : ""].filter(Boolean);
  tab.document.open();
  tab.document.write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(a) + ' · label</title><script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script><style>body{font:14px Arial,sans-serif;margin:16px;color:#34213f;background:#fff}.bar{display:flex;gap:10px;align-items:center;margin-bottom:14px}.bar button{background:#45205b;color:#fff;border:0;border-radius:10px;padding:10px 16px;font-weight:bold}.lb{display:flex;gap:14px;align-items:center;border:2.5px solid #79538e;border-radius:16px;padding:14px 16px;max-width:430px;background:linear-gradient(120deg,#fbf6fd,#fff)}.lb h1{font:italic 700 28px Georgia,serif;margin:0 0 4px;color:#45205b;overflow-wrap:anywhere}.lb p{margin:2px 0;font-size:14px}.q{width:110px;height:110px;flex:none}.q img,.q canvas{width:110px!important;height:110px!important}.k{font:bold 10px Arial;letter-spacing:2px;color:#586c38}.sx{color:#79538e}small{color:#776a80}@media print{.bar{display:none}body{margin:0}}</style></head><body><div class="bar"><button onclick="window.print()">Print</button><small>Tape it to the enclosure. Scanning it with your phone camera opens ' + esc(a) + ' in Scale &amp; Tell.</small></div>' +
    '<div class="lb"><div class="q" id="q"></div><div><div class="k">SCALE &amp; TELL ♡</div><h1>' + esc(a) + ' <span class="sx">' + sex + "</span></h1>" + lines.map((x) => "<p>" + esc(x) + "</p>").join("") + (p.code ? "<p><b>" + esc(p.code) + "</b></p>" : "") + "</div></div>" +
    "<script>window.onload=function(){new QRCode(document.getElementById('q'),{text:" + JSON.stringify(url) + ",width:220,height:220,correctLevel:QRCode.CorrectLevel.M})}<\/script></body></html>");
  tab.document.close();
}

/* ---------- Feeder freezer: stock, cost, how long it lasts, when to order ---------- */
function feederMatch(f, prey) {
  const a = String(f?.name || "").toLowerCase().trim(), b = String(prey || "").toLowerCase().trim();
  return !!a && !!b && (a === b || b.includes(a) || a.includes(b));
}
function feederUsage(f, days = 60) {
  const since = advanceDate(today(), -days);
  return entries.filter((e) => e.section === "Feeding Tracker" && e.detail === "Ate" && e.date >= since && feederMatch(f, e.preyType)).length;
}
function feederForecast(f) {
  const used = feederUsage(f, 60), perDay = used / 60, count = Number(f.count) || 0;
  if (!used) return { used, text: "Not fed out in the last 2 months" };
  const left = Math.floor(count / perDay);
  const orderDays = Math.max(0, Math.floor((count - (Number(f.low) || 0)) / perDay));
  return { used, left, order: advanceDate(today(), orderDays), text: count ? "Lasts about " + (left >= 14 ? Math.round(left / 7) + " weeks" : left + " days") + " · order by " + niceDate(advanceDate(today(), orderDays)) : "Out of stock" };
}
let feederEditIdx = -1;
BIZ_PANELS.Feeders = () => {
  const list = feederList(), money = (n) => bizMoney(Math.round((Number(n) || 0) * 100) / 100);
  const value = list.reduce((s, f) => s + (Number(f.count) || 0) * (Number(f.cost) || 0), 0);
  const month = list.reduce((s, f) => s + feederUsage(f, 30) * (Number(f.cost) || 0), 0);
  const back = bizIsBreeder() || stIsRescue() ? v57Back("Business Tools") : stCanUsePack() ? v57Back("Keeper Tools") : v57Back("Menu");
  return '<p class="resourceIntro">Your feeder freezer 🧊 Counts go down by themselves when you log a feeding with that prey (Feed Day, Quick Log, rack feeding or a care log).</p>' +
    (list.length ? '<div class="v69Sum"><div><b>' + list.reduce((s, f) => s + (Number(f.count) || 0), 0) + "</b><small>feeders on hand</small></div><div><b>" + money(value) + "</b><small>worth in the freezer</small></div><div><b>" + money(month) + "</b><small>fed out in 30 days</small></div></div>" : "") +
    (list.length ? list.map((f, i) => {
      const fc = feederForecast(f), low = Number(f.count) <= Number(f.low);
      if (feederEditIdx === i) return '<div class="deviceCard"><div class="saleGrid">' + bizField("feN", "Prey", f.name, "text") + bizField("feC", "On hand", f.count, "number", "", 'min="0"') + bizField("feP", "Cost each ($)", f.cost || "", "number", "1.25", 'min="0" step="0.01"') + bizField("feL", "Remind me at", f.low, "number", "", 'min="0"') + '</div><div class="inlineActions"><button class="action" onclick="feederSaveEdit(' + i + ')">Save</button><button class="action secondary" onclick="feederEditIdx=-1;render()">Cancel</button></div></div>';
      return '<div class="deviceCard v69Feeder' + (low ? " low" : "") + '"><div class="deviceHeading"><b>' + esc(f.name) + "</b><span>" + (low ? '<span class="salePill saleSold">Low</span> ' : "") + (Number(f.count) || 0) + " left</span></div>" +
        '<p class="lcSmall">' + esc(fc.text) + (f.cost ? " · " + money(f.cost) + " each" : " · add a cost to see spending") + (fc.used ? " · " + fc.used + " fed in 60 days" : "") + "</p>" +
        '<div class="recordActions"><button onclick="feederAdj(' + i + ',-1)">−1</button><button onclick="feederAdj(' + i + ',1)">+1</button><button onclick="feederBoxOpen(' + i + ')">+ Box</button><button onclick="feederEditIdx=' + i + ';render()" aria-label="Edit">✎</button><button onclick="if(confirm(\'Remove ' + esc(v69Q(f.name)) + '?\'))feederAdj(' + i + ',\'x\')" aria-label="Remove">✕</button></div>' +
        '<div id="feBox' + i + '" class="v69Box" hidden><div class="saleGrid">' + bizField("fbQ" + i, "How many in the box", "", "number", "25", 'min="1"') + bizField("fbP" + i, "Box price ($, optional)", "", "number", "30.00", 'min="0" step="0.01"') + "</div>" +
        (bizIsBreeder() || stIsRescue() ? '<label class="checkLine"><input type="checkbox" id="fbL' + i + '" checked> Add the cost to Income &amp; expenses</label>' : "") +
        '<button class="action" onclick="feederBoxAdd(' + i + ')">Add to freezer</button></div></div>';
    }).join("") : '<p class="helperLine">No feeders yet. Add what’s in your freezer below.</p>') +
    '<h3 class="sectionTitle">Add a feeder</h3><div class="saleGrid">' + bizField("fdName", "Prey (as you log it)", "", "text", "Small rat") + bizField("fdCount", "How many you have", "", "number", "", 'min="0"') + bizField("fdCost", "Cost each ($)", "", "number", "1.25", 'min="0" step="0.01"') + bizField("fdLow", "Remind me at", 10, "number", "", 'min="0"') + "</div>" +
    '<button class="action" onclick="feederAddNew()">Add feeder</button><p class="lcSmall">Tip: name it the way you log it (e.g. “Small rat”). A feeding logged as “small rat f/t” still counts.</p>' + back;
};
feederAddNew = function () {
  const name = bizV("fdName").slice(0, 60);
  if (!name) return stToast("Type the prey name first.");
  const cost = Number(bizV("fdCost"));
  accountPrefsSet("feeders", [...feederList(), { name, count: Math.max(0, Number(bizV("fdCount")) || 0), low: Math.max(0, Number(bizV("fdLow")) || 0), cost: cost > 0 ? Math.round(cost * 100) / 100 : "" }]);
  try { save(); } catch (e) {}
  render();
};
function feederSaveEdit(i) {
  const list = feederList().map((f) => ({ ...f }));
  if (!list[i]) return;
  const cost = Number(bizV("feP"));
  list[i] = { ...list[i], name: bizV("feN").slice(0, 60) || list[i].name, count: Math.max(0, Number(bizV("feC")) || 0), low: Math.max(0, Number(bizV("feL")) || 0), cost: cost > 0 ? Math.round(cost * 100) / 100 : "" };
  accountPrefsSet("feeders", list);
  feederEditIdx = -1;
  try { save(); } catch (e) {}
  render();
}
function feederBoxOpen(i) { const b = document.getElementById("feBox" + i); if (b) b.hidden = !b.hidden; }
function feederBoxAdd(i) {
  const list = feederList().map((f) => ({ ...f })), f = list[i];
  const q = Math.round(Number(bizV("fbQ" + i))), price = Number(bizV("fbP" + i));
  if (!f || !(q > 0 && q <= 5000)) return stToast("Enter how many are in the box.");
  f.count = (Number(f.count) || 0) + q;
  if (price > 0) f.cost = Math.round((price / q) * 100) / 100;
  accountPrefsSet("feeders", list);
  if (price > 0 && document.getElementById("fbL" + i)?.checked) entries.push({ section: "Ledger", animal: "", type: "expense", amount: Math.round(price * 100) / 100, category: "Feeders", detail: q + " × " + f.name, date: today(), clutchId: "" });
  try { save(); } catch (e) {}
  stToast("+" + q + " " + f.name + (price > 0 ? " · " + bizMoney(f.cost) + " each" : ""));
  render();
}

/* ---------- Feed Day: mark everyone who ate, save once ---------- */
let feedDayFilter = "", feedDayRows = [];
function feedDayDue(a) {
  if (brumationOf(a)) return false;
  const f = lastFeed(a), n = Number(carePlans[a]?.feedDays) || 0;
  if (entries.some((e) => e.section === "Calendar" && !e.done && e.animal === a && /feed/i.test(e.detail || "") && e.date <= today())) return true;
  return !!n && (!f || daysSince(f.date) >= n);
}
BIZ_PANELS["Feed Day"] = () => {
  if (!animals.length) return '<p class="helperLine">Add an animal first.</p>';
  const due = animals.filter(feedDayDue), sps = [...new Set(animals.map((a) => species[a] || "Other"))].sort();
  if (!feedDayFilter) feedDayFilter = due.length ? "due" : "all";
  const shown = animals.filter((a) => feedDayFilter === "all" || (feedDayFilter === "due" ? due.includes(a) : (species[a] || "Other") === feedDayFilter));
  feedDayRows = shown.slice(0, 200);
  const chip = (k, label) => '<button class="chip' + (feedDayFilter === k ? " on" : "") + '" onclick="feedDayFilter=\'' + v69Q(k) + '\';render()">' + esc(label) + "</button>";
  const feeders = feederList();
  return '<p class="resourceIntro">Mark everyone who ate, then save once. Animals you leave blank aren’t logged.</p>' +
    '<div class="chipRow">' + chip("due", "Due now " + due.length) + chip("all", "All " + animals.length) + (sps.length > 1 ? sps.map((x) => chip(x, x + " " + animals.filter((a) => (species[a] || "Other") === x).length)).join("") : "") + "</div>" +
    '<div class="saleGrid"><label>Date<input type="date" id="fdDate" value="' + today() + '" max="' + today() + '"></label><label>Time (optional)<input type="time" id="fdTime"></label></div>' +
    (feedDayRows.length ? '<div class="rfAll"><span>Mark all:</span><button type="button" onclick="rackFeedAll(&quot;Ate&quot;)">Ate</button><button type="button" onclick="rackFeedAll(&quot;&quot;)">Clear</button></div>' +
      (feeders.length ? '<datalist id="fdPreyList">' + feeders.map((f) => '<option value="' + esc(f.name) + '">').join("") + "</datalist>" : "") +
      feedDayRows.map((a, n) => {
        const f = lastFeed(a), st = rosterStatus(a);
        return '<div class="rfRow"><div class="rfName"><b>' + esc(a) + "</b><small" + (st.cls ? ' class="' + st.cls + '"' : "") + ">" + esc(st.text) + '</small></div><div class="rfChoice" role="radiogroup" aria-label="' + esc(a) + '">' +
          ["Ate", "Refused", "Skipped feeding"].map((o) => '<label><input type="radio" name="rf' + n + '" value="' + o + '"><span>' + (o === "Skipped feeding" ? "Skip" : o) + "</span></label>").join("") +
          '</div><input class="rfPrey" id="fdPrey' + n + '" maxlength="60" list="fdPreyList" placeholder="Prey (optional)" value="' + esc(f?.preyType || "") + '"></div>';
      }).join("") +
      '<button class="action" onclick="feedDaySave()">Save feedings</button>'
      : '<p class="helperLine">' + (feedDayFilter === "due" ? "Nobody is due right now ♡ Tap All to log anyway." : "No animals here.") + "</p>") +
    '<p class="lcSmall">Each animal’s next feeding reminder moves forward automatically when you’ve set a feeding interval.' + ' <button class="authLink" onclick="openPanel(\'Feeders\')">🧊 Feeder freezer</button>' + "</p>";
};
function feedDaySave() {
  const date = document.getElementById("fdDate")?.value, time = (document.getElementById("fdTime")?.value || "").trim();
  if (!validDate(date) || date > today()) return alert("Choose a valid date.");
  if (time && !stValidFeedingTime(time)) return alert("Enter a valid time or leave it blank.");
  const add = [];
  feedDayRows.forEach((a, n) => {
    const choice = document.querySelector('input[name="rf' + n + '"]:checked')?.value;
    if (!choice || !animals.includes(a)) return;
    const prey = (document.getElementById("fdPrey" + n)?.value || "").trim().slice(0, 60);
    add.push({ section: "Feeding Tracker", animal: a, detail: choice, date, notes: "", preyType: choice === "Skipped feeding" ? "" : prey, preyWeight: "", response: choice === "Refused" ? "Refused" : "", ...(time ? { feedingTime: time } : {}) });
  });
  if (!add.length) return alert("Mark at least one animal first.");
  const before = entries;
  entries = [...entries, ...add];
  try { save(); } catch (e) { entries = before; return alert("Couldn’t save these feedings. Nothing was added."); }
  const used = {};
  add.filter((e) => e.detail === "Ate" && e.preyType).forEach((e) => (used[e.preyType] = (used[e.preyType] || 0) + 1));
  Object.entries(used).forEach(([p, k]) => feederUse(p, k));
  add.filter((e) => e.detail !== "Skipped feeding").forEach((e) => { try { autoNextFeeding(e.animal, date); } catch (x) {} });
  const ate = add.filter((e) => e.detail === "Ate").length;
  const lowNow = feederList().filter((f) => Object.keys(used).some((p) => feederMatch(f, p)) && Number(f.count) <= Number(f.low));
  stToast("✓ Logged " + add.length + " feeding" + (add.length === 1 ? "" : "s") + (ate !== add.length ? " (" + ate + " ate)" : "") + (lowNow.length ? " · " + lowNow.map((f) => f.name + ": " + f.count + " left").join(", ") : ""));
  feedDayFilter = "";
  try { closePanel(); } catch (e) {}
  render();
}
/* Home "Today's Care" card gets a Feed Day button. */
(function () {
  const base = renderHomeToday;
  renderHomeToday = function () {
    const r = base.apply(this, arguments);
    try {
      const acts = document.querySelector("#homeToday .homeTodayActions");
      if (acts && animals.length > 1 && !acts.querySelector(".v69Feed")) {
        const b = document.createElement("button");
        b.className = "v69Feed";
        b.textContent = "🍽 Feed Day";
        b.onclick = () => openPanel("Feed Day");
        acts.insertBefore(b, acts.children[1] || null);
      }
    } catch (e) {}
    return r;
  };
})();
/* Keeper Tools: feeder freezer tile. */
(function () {
  const base = BIZ_PANELS["Keeper Tools"];
  BIZ_PANELS["Keeper Tools"] = function () {
    const h = base.apply(this, arguments);
    if (!stCanUsePack()) return h;
    const n = feederList().length, low = feederList().filter((f) => Number(f.count) <= Number(f.low)).length;
    const tile = '<button class="resourceTile" onclick="openPanel(\'Feeders\')"><strong>🧊 Feeder freezer</strong><small>' + (n ? n + " feeder" + (n === 1 ? "" : "s") + " tracked" + (low ? " · " + low + " low" : "") : "Counts go down as you feed, shows what each meal costs and when to reorder.") + "</small></button>" +
      '<button class="resourceTile" onclick="openPanel(\'Feed Day\')"><strong>🍽 Feed Day</strong><small>Check off everyone who ate and save once.</small></button>';
    return h.replace('<h3 class="sectionTitle">Shed predictions</h3>', tile + '<h3 class="sectionTitle">Shed predictions</h3>');
  };
})();

/* ---------- Care sheet: for a pet-sitter or a new home. Pretty page + plain text ---------- */
let sitterMode = "sitter";
sitterMarkup = function () {
  const re = sitterMode === "rehome";
  const pick = (a) => (re ? a === selectedAnimal || (!animals.includes(selectedAnimal) && a === animals[0]) : true);
  return '<p class="resourceIntro">A cute, easy-to-read care sheet from your records. Print it, save a PDF, email it, or copy it as text.</p>' +
    '<div class="v69Mode"><button class="' + (re ? "" : "on") + '" onclick="sitterMode=\'sitter\';render()">🏖 Pet-sitter</button><button class="' + (re ? "on" : "") + '" onclick="sitterMode=\'rehome\';render()">🏡 New home</button></div>' +
    '<p class="lcSmall">' + (re ? "For rehoming or a sale: care, setup and history so the new keeper starts off right." : "For someone looking after your animals while you’re away: who to call, feeding and a daily checklist.") + "</p>" +
    '<div class="sitterForm"><label>Your name (optional)<input id="sitKeeper" maxlength="160" value="' + esc(sitterSettings.keeper) + '"></label><label>Your phone (optional)<input id="sitPhone" maxlength="160" value="' + esc(sitterSettings.phone) + '"></label>' +
    (re ? "" : '<label>Backup contact (optional)<input id="sitAlternate" maxlength="160" value="' + esc(sitterSettings.alternate) + '" placeholder="Name and phone"></label>') +
    "<label>" + (re ? "A note for the new keeper" : "House notes for the sitter") + '<textarea id="sitGeneral" maxlength="1200" placeholder="' + (re ? "She loves her warm hide and eats best at night ♡" : "Feeders are in the garage freezer. Thermostats are set, please don’t change them.") + '">' + esc(sitterSettings.general) + "</textarea></label>" +
    '<h3 class="sectionTitle">Animals</h3>' + (animals.length > 3 ? '<div class="rfAll"><button type="button" onclick="document.querySelectorAll(\'.sitterAnimal\').forEach(x=>x.checked=true)">All</button><button type="button" onclick="document.querySelectorAll(\'.sitterAnimal\').forEach(x=>x.checked=false)">None</button></div>' : "") +
    animals.map((a, i) => '<label class="sitterCheck"><input type="checkbox" class="sitterAnimal" value="' + i + '"' + (pick(a) ? " checked" : "") + "> " + esc(a) + " · " + esc(species[a] || "Other") + "</label>").join("") +
    (re ? '<label class="sitterCheck"><input type="checkbox" id="sitHistory" checked> Include care history (weights, feedings, sheds)</label>' : "") +
    '<label class="sitterCheck"><input type="checkbox" id="sitIncludeHealth"> Include recent health / vet records (private, optional)</label>' +
    '<button class="action" onclick="sitterMakePretty()">💌 Make my care sheet</button><p class="lcSmall">Next you can view &amp; print it, download a PDF, or email it.</p>' +
    '<details class="compactDisclosure"><summary>Plain text version (to copy into a text message)</summary><textarea id="sitterPreview" class="handoffText" readonly placeholder="Tap Make text"></textarea><div class="inlineActions"><button class="action secondary" onclick="generateSitterSheet()">Make text</button><button class="action secondary" onclick="copySitterSheet()">Copy text</button><button class="action secondary" onclick="downloadSitterSheet()">Download .txt</button></div></details>' +
    '<p id="sitterStatus" class="helperLine" role="status"></p><p class="lcSmall">Care instructions and handling notes come from each animal’s Edit details. Setup comes from the Habitat tab. Your vet comes from Find a Vet.</p></div>';
};
function sitterReadForm() {
  const ids = { keeper: "sitKeeper", phone: "sitPhone", alternate: "sitAlternate", general: "sitGeneral" };
  for (const k of Object.keys(SITTER_DEFAULT)) { const el = document.getElementById(ids[k]); if (el) sitterSettings[k] = (el.value || "").trim().slice(0, k === "general" ? 1200 : 160); }
  try { scaleStoreSet("scaleTellSitter18", JSON.stringify(sitterSettings)); } catch (e) {}
  return {
    names: [...document.querySelectorAll(".sitterAnimal:checked")].map((e) => animals[Number(e.value)]).filter(Boolean),
    health: !!document.getElementById("sitIncludeHealth")?.checked,
    history: sitterMode === "rehome" && !!document.getElementById("sitHistory")?.checked,
  };
}
function sitterFacts(a) {
  const p = profiles[a] || {}, plan = carePlans[a] || {}, s = setupOf(a), f = v69Latest(a, "Feeding Tracker", (e) => e.detail === "Ate"), w = v69LastWeight(a);
  const range = (lo, hi, u) => (lo !== undefined && lo !== "") || (hi !== undefined && hi !== "") ? (lo !== undefined && lo !== "" ? lo : "…") + "–" + (hi !== undefined && hi !== "" ? hi : "…") + u : "";
  const prey = entries.filter((e) => e.animal === a && e.section === "Feeding Tracker" && e.preyType).sort((x, y) => y.date.localeCompare(x.date))[0]?.preyType || "";
  return {
    p, s, w, prey, sex: p.sex && !/unknown/i.test(p.sex) ? p.sex : "", morph: p.genes || p.morph || "", age: v69Age(p.hatchDate),
    feedEvery: Number(plan.feedDays) ? "Every " + plan.feedDays + " days" : "", lastFed: f ? niceDate(f.date) + " (" + v69Ago(f.date) + ")" : "",
    warm: range(plan.warmMin, plan.warmMax, "°F"), cool: range(plan.coolMin, plan.coolMax, "°F"), hum: range(plan.humidityMin, plan.humidityMax, "%"),
    substrate: s.substrate === "Other" ? s.substrateOther : s.substrate || "", uvb: v69HasUvb(s) || s.uvbType ? v69UvbLabel(s) : "",
    shed: stNoShed(a) ? "" : (v69Latest(a, "Shed History") ? niceDate(v69Latest(a, "Shed History").date) : ""),
  };
}
/* Plain text (for texting) */
sitterDocument = function (names, includeHealth, withHistory) {
  const re = sitterMode === "rehome", L = [];
  L.push(re ? "♡ CARE SHEET FOR " + (names.length === 1 ? names[0].toUpperCase() + "’S" : "YOUR") + " NEW HOME ♡" : "♡ PET-SITTER CARE SHEET ♡", "");
  if (sitterSettings.keeper || sitterSettings.phone) L.push((re ? "From: " : "Owner: ") + [sitterSettings.keeper, sitterSettings.phone].filter(Boolean).join(" · "));
  if (!re && sitterSettings.alternate) L.push("Backup: " + sitterSettings.alternate);
  if (!re && (savedVet.name || savedVet.phone)) L.push("Vet: " + [savedVet.name, savedVet.phone].filter(Boolean).join(" · ") + (savedVet.emergencyPhone ? " · Emergency: " + [savedVet.emergencyName, savedVet.emergencyPhone].filter(Boolean).join(" ") : ""));
  if (sitterSettings.general) L.push("", sitterSettings.general);
  for (const a of names) {
    const x = sitterFacts(a);
    L.push("", "— " + a + " —", [species[a], x.sex, x.morph, x.age].filter(Boolean).join(" · "));
    [["Feeds", [x.feedEvery, x.prey].filter(Boolean).join(" · ")], ["Last fed", x.lastFed], ["Weight", x.w ? v69Grams(x.w.g) : ""], ["Warm side", x.warm], ["Cool side", x.cool], ["Humidity", x.hum],
      ["Enclosure", x.p.enclosure], ["Substrate", x.substrate], ["Heat", x.s.heat], ["UVB", x.uvb], ["Lights", x.s.lightHours ? x.s.lightHours + " hrs/day" : ""], ["Care", x.p.sitterInstructions || x.p.notes], ["Handling", x.p.handlingNotes]]
      .filter((r) => r[1]).forEach((r) => L.push(r[0] + ": " + r[1]));
    if (!re) {
      const up = entries.filter((e) => e.animal === a && e.section === "Calendar" && !e.done).sort((p, q) => p.date.localeCompare(q.date)).slice(0, 4);
      if (up.length) L.push("Coming up: " + up.map((e) => niceDate(e.date) + " " + e.detail).join(" · "));
    }
    if (withHistory) {
      const w = sortedAnimalEntries(a, "Weight Tracker").slice(-6).reverse();
      if (w.length) L.push("Weights: " + w.map((e) => niceDate(e.date) + " " + e.detail + " g").join(" · "));
      const fd = sortedAnimalEntries(a, "Feeding Tracker").slice(-6).reverse();
      if (fd.length) L.push("Feedings: " + fd.map((e) => niceDate(e.date) + " " + e.detail + (e.preyType ? " " + e.preyType : "")).join(" · "));
    }
    if (includeHealth) {
      const h = sortedAnimalEntries(a, "Health & Vet").slice(-3).reverse();
      if (h.length) L.push("Health: " + h.map((e) => niceDate(e.date) + " " + e.detail + (e.medication ? " · " + e.medication : "") + (e.notes ? " · " + e.notes : "")).join(" | "));
    }
  }
  L.push("", "Made with Scale & Tell ♡ Records are keeper-entered. When in doubt, call a reptile vet.");
  return L.join("\n");
};
generateSitterSheet = function () {
  const o = sitterReadForm(), status = document.getElementById("sitterStatus"), box = document.getElementById("sitterPreview");
  if (!o.names.length) { if (status) status.textContent = "Choose at least one animal."; return; }
  if (box) { box.value = sitterDocument(o.names, o.health, o.history); box.closest("details")?.setAttribute("open", ""); }
  if (status) status.textContent = "✓ Text ready for " + o.names.length + " animal" + (o.names.length === 1 ? "" : "s") + ". Review before sharing.";
};
/* Small square photo for the sheet: a downsized copy so the page (and its email link) stays light. */
function v69Thumb(a) {
  const src = portraitForAnimal(a).src;
  return new Promise((ok) => {
    const im = new Image();
    if (/^https?:/.test(src) && !src.startsWith(location.origin)) im.crossOrigin = "anonymous";
    const fallback = () => ok(/^[a-z0-9-]+\.webp$/.test(src) ? new URL(src, location.href).href : "");
    im.onload = () => {
      try {
        const c = document.createElement("canvas"), S = 220, r = Math.max(S / im.width, S / im.height), w = S / r, h = S / r;
        c.width = c.height = S;
        c.getContext("2d").drawImage(im, (im.width - w) / 2, (im.height - h) / 2, w, h, 0, 0, S, S);
        ok(c.toDataURL("image/jpeg", 0.82));
      } catch (e) { fallback(); }
    };
    im.onerror = fallback;
    im.src = src;
    setTimeout(fallback, 4000);
  });
}
async function sitterMakePretty() {
  const o = sitterReadForm(), status = document.getElementById("sitterStatus");
  if (!o.names.length) { if (status) status.textContent = "Choose at least one animal."; return; }
  if (status) status.textContent = "Making your care sheet…";
  const re = sitterMode === "rehome", thumbs = {};
  for (const a of o.names.slice(0, 60)) thumbs[a] = await v69Thumb(a);
  const T = (v) => esc(String(v ?? ""));
  const fact = (icon, label, val) => val ? '<div class="f"><span>' + icon + "</span><div><small>" + label + "</small><b>" + T(val) + "</b></div></div>" : "";
  const cards = o.names.map((a) => {
    const x = sitterFacts(a);
    const up = re ? [] : entries.filter((e) => e.animal === a && e.section === "Calendar" && !e.done).sort((p, q) => p.date.localeCompare(q.date)).slice(0, 5);
    const facts = fact("🍽", "Feeding", [x.feedEvery, x.prey].filter(Boolean).join(" · ")) + fact("🗓", "Last meal", x.lastFed) + fact("⚖", "Weight", x.w ? v69Grams(x.w.g) + " · " + niceDate(x.w.date) : "") +
      fact("🔥", "Warm side", x.warm) + fact("❄", "Cool side", x.cool) + fact("💧", "Humidity", x.hum) + fact("✨", "Last shed", x.shed);
    const setup = fact("📐", "Enclosure", x.p.enclosure) + fact("🪵", "Substrate", x.substrate) + fact("🔥", "Heat", x.s.heat) + fact("☀", "UVB / lighting", x.uvb) + fact("🕗", "Lights on", x.s.lightHours ? x.s.lightHours + " hours a day" : "") + fact("🌿", "Hides & décor", x.s.decor);
    const hist = (list, f) => list.length ? "<table>" + list.map(f).join("") + "</table>" : "";
    let history = "";
    if (o.history) {
      const w = sortedAnimalEntries(a, "Weight Tracker").slice(-8).reverse(), fd = sortedAnimalEntries(a, "Feeding Tracker").slice(-10).reverse(), sh = stNoShed(a) ? [] : sortedAnimalEntries(a, "Shed History").slice(-5).reverse();
      history = (w.length || fd.length || sh.length) ? '<h3>📖 History</h3><div class="hist">' +
        (fd.length ? "<div><h4>Feedings</h4>" + hist(fd, (e) => "<tr><td>" + T(niceDate(e.date)) + "</td><td>" + T(e.detail + (e.preyType ? " · " + e.preyType : "")) + "</td></tr>") + "</div>" : "") +
        (w.length ? "<div><h4>Weights</h4>" + hist(w, (e) => "<tr><td>" + T(niceDate(e.date)) + "</td><td>" + T(e.detail) + " g</td></tr>") + "</div>" : "") +
        (sh.length ? "<div><h4>Sheds</h4>" + hist(sh, (e) => "<tr><td>" + T(niceDate(e.date)) + "</td><td>" + T(e.detail) + "</td></tr>") + "</div>" : "") + "</div>" : "";
    }
    const health = o.health ? sortedAnimalEntries(a, "Health & Vet").slice(-3).reverse() : [];
    return '<section class="pet"><div class="petHead">' + (thumbs[a] ? '<img src="' + T(thumbs[a]) + '" alt="">' : '<div class="ph">♡</div>') + "<div><h2>" + T(a) + "</h2><p>" +
      [species[a], x.sex, x.morph, x.age].filter(Boolean).map((v) => '<span class="chip">' + T(v) + "</span>").join(" ") + "</p></div></div>" +
      (facts ? '<div class="facts">' + facts + "</div>" : "") +
      (x.p.sitterInstructions || x.p.notes ? '<div class="note"><b>💜 How to care for ' + T(a) + "</b><p>" + T(x.p.sitterInstructions || x.p.notes) + "</p></div>" : "") +
      (x.p.handlingNotes ? '<div class="note warn"><b>✋ Handling</b><p>' + T(x.p.handlingNotes) + "</p></div>" : "") +
      (setup ? "<h3>🏡 Setup</h3><div class=\"facts\">" + setup + "</div>" : "") +
      (up.length ? "<h3>📅 Coming up</h3><ul class=\"up\">" + up.map((e) => "<li><b>" + T(niceDate(e.date)) + "</b> " + T(e.detail) + "</li>").join("") + "</ul>" : "") +
      history + (health.length ? "<h3>🩺 Health notes</h3><ul class=\"up\">" + health.map((e) => "<li><b>" + T(niceDate(e.date)) + "</b> " + T([e.detail, e.medication, e.dose, e.notes].filter(Boolean).join(" · ")) + "</li>").join("") + "</ul>" : "") + "</section>";
  }).join("");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const checklist = re ? "" : '<section class="pet"><h3 style="margin-top:0">✅ Daily checklist</h3><table class="ck"><tr><th></th>' + days.map((d) => "<th>" + d + "</th>").join("") + "</tr>" +
    ["Fresh water", "Check temps", "Spot clean", "Fed (if due)", "Lights on/off", "Peek & say hi ♡"].map((t) => "<tr><td>" + t + "</td>" + days.map(() => "<td>☐</td>").join("") + "</tr>").join("") + "</table></section>";
  const who = sitterSettings.keeper || "", title = re ? (o.names.length === 1 ? o.names[0] + "’s care sheet" : "Care sheet") : "Pet-sitter care sheet";
  const css = "*{box-sizing:border-box}body{margin:0;background:#fbf6f1;color:#34213f;font:14px/1.5 Arial,sans-serif}.wrap{max-width:780px;margin:0 auto;padding:22px 18px 30px}" +
    ".hero{background:linear-gradient(125deg,#efe0f6,#fff3e7 70%,#eef4e3);border:1px solid #e6d3ee;border-radius:22px;padding:22px 22px 18px;text-align:center;position:relative;overflow:hidden}" +
    ".hero:before,.hero:after{content:'♡';position:absolute;font-size:70px;color:#79538e18;top:-10px;left:14px}.hero:after{content:'✿';left:auto;right:18px;top:auto;bottom:-14px;color:#586c3826}" +
    ".kick{font:bold 11px Arial;letter-spacing:3px;color:#586c38;text-transform:uppercase}h1{font:italic 700 38px Georgia,serif;color:#45205b;margin:4px 0 6px}.hero p{margin:4px 0;color:#5c4b66}" +
    ".hello{background:#fff;border-radius:16px;padding:12px 16px;margin:12px auto 0;max-width:560px;border:1px dashed #cdb3da;white-space:pre-wrap}" +
    ".contacts{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin:16px 0}.ct{background:#fff;border:1px solid #eadcf0;border-radius:16px;padding:12px 14px}.ct small{display:block;color:#7b6a86;font-weight:bold;font-size:11px;letter-spacing:1px;text-transform:uppercase}.ct b{font-size:16px}" +
    ".pet{background:#fff;border:1px solid #eadcf0;border-radius:22px;padding:18px;margin:16px 0;box-shadow:0 4px 18px #45205b10;break-inside:avoid;page-break-inside:avoid}" +
    ".petHead{display:flex;gap:16px;align-items:center}.petHead img,.ph{width:96px;height:96px;border-radius:50%;object-fit:cover;border:4px solid #eadcf0;flex:none;background:#f5edf9}.ph{display:flex;align-items:center;justify-content:center;font-size:36px;color:#79538e}" +
    "h2{font:italic 700 30px Georgia,serif;color:#45205b;margin:0 0 6px}.chip{display:inline-block;background:#f1e6f6;color:#45205b;border-radius:999px;padding:3px 11px;font-size:12px;font-weight:bold;margin:2px 2px 0 0}" +
    ".facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin-top:12px}.f{display:flex;gap:9px;align-items:center;background:#fbf7fd;border-radius:14px;padding:9px 11px}.f span{font-size:20px}.f small{display:block;color:#7b6a86;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:.5px}.f b{font-size:14px}" +
    ".note{background:#f4f9ee;border-left:5px solid #8aa65f;border-radius:12px;padding:10px 14px;margin-top:12px}.note.warn{background:#fff4ec;border-color:#e2a15c}.note p{margin:4px 0 0;white-space:pre-wrap}" +
    "h3{font:italic 700 20px Georgia,serif;color:#45205b;margin:18px 0 6px}h4{margin:0 0 4px;color:#6a4a7c;font-size:13px}.up{list-style:none;padding:0;margin:0;display:grid;gap:5px}.up li{background:#f7f0fa;border-radius:10px;padding:7px 11px;border-left:4px solid #79538e}" +
    ".hist{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}table{width:100%;border-collapse:collapse;font-size:12.5px}td,th{padding:5px 6px;border-bottom:1px solid #f0e6f4;text-align:left}td:first-child{color:#7b6a86;white-space:nowrap}" +
    ".ck th{font-size:11px;color:#6a4a7c;text-align:center}.ck td{text-align:center;font-size:18px;color:#79538e}.ck td:first-child{text-align:left;font-size:13px;color:#34213f}" +
    ".foot{text-align:center;color:#8a7b93;font-size:12px;margin-top:22px}.foot b{font:italic 16px Georgia,serif;color:#79538e}" +
    ".printBar{position:sticky;top:0;z-index:5;background:#45205b;color:#fff;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;gap:10px}.printBar button{background:#fff;color:#45205b;border:0;border-radius:9px;padding:8px 14px;font-weight:bold}" +
    "@media(max-width:520px){h1{font-size:30px}.petHead img,.ph{width:74px;height:74px}h2{font-size:25px}}@media print{*{-webkit-print-color-adjust:exact;print-color-adjust:exact}body{background:#fff}.printBar{display:none}.pet{box-shadow:none}}";
  const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + T(title) + "</title><style>" + css + "</style></head><body>" +
    '<div class="printBar"><span>Care sheet preview</span><button onclick="window.print()">Print / Save as PDF</button></div><div class="wrap">' +
    '<div class="hero"><div class="kick">' + (re ? "Welcome home" : "Thank you for helping") + "</div><h1>" + (re ? (o.names.length === 1 ? T(o.names[0]) + "’s care sheet ♡" : "Care sheet ♡") : "Pet-sitter care sheet ♡") + "</h1>" +
    "<p>" + (re ? "Everything " + (who ? T(who) + " knows" : "we know") + " about " + (o.names.length === 1 ? T(o.names[0]) : "these babies") + ", so the move is easy." : (who ? T(who) + "’s " : "") + o.names.length + " little one" + (o.names.length === 1 ? "" : "s") + " and how to care for them.") + "</p>" +
    (sitterSettings.general ? '<div class="hello">' + T(sitterSettings.general) + "</div>" : "") + "</div>" +
    '<div class="contacts">' + (who || sitterSettings.phone ? '<div class="ct"><small>📞 ' + (re ? "Previous keeper" : "Owner") + "</small><b>" + T(who) + "</b><br>" + T(sitterSettings.phone) + "</div>" : "") +
    (!re && sitterSettings.alternate ? '<div class="ct"><small>🤝 Backup contact</small><b>' + T(sitterSettings.alternate) + "</b></div>" : "") +
    (!re && (savedVet.name || savedVet.phone) ? '<div class="ct"><small>🩺 Vet</small><b>' + T(savedVet.name || "") + "</b><br>" + T(savedVet.phone || "") + (savedVet.emergencyPhone ? "<br><small style=\"display:inline;text-transform:none;letter-spacing:0\">Emergency: " + T([savedVet.emergencyName, savedVet.emergencyPhone].filter(Boolean).join(" ")) + "</small>" : "") + "</div>" : "") + "</div>" +
    cards + checklist +
    '<p class="foot"><b>Made with Scale &amp; Tell ♡</b><br>Made ' + T(niceDate(today())) + " from the keeper’s records. When in doubt, call a reptile vet.</p></div></body></html>";
  if (status) status.textContent = "";
  reportCur = { title, html, to: "", url: "", back: "Pet-Sitter Sheet" };
  openPanel("Report");
}
(function () {
  const base = panelHeading;
  panelHeading = function (n) { return n === "Pet-Sitter Sheet" ? "Care Sheet ♡" : n === "Feed Day" ? "Feed Day 🍽" : n === "Feeders" ? "Feeder Freezer 🧊" : base(n); };
})();
/* V3.70 · Password reset: friendly message for used/expired links, change password from My Account,
   and a reset link opened in a tab that's already showing the app still opens the new-password screen. */
const v70LinkErr = (() => {
  try {
    const h = new URLSearchParams((location.hash || "").replace(/^#/, "")), q = new URLSearchParams(location.search);
    const code = h.get("error_code") || q.get("error_code") || "", desc = h.get("error_description") || q.get("error_description") || "";
    return code || desc || h.get("error") ? { code, desc } : null;
  } catch (e) { return null; }
})();
if (v70LinkErr) {
  let tries = 0;
  const t = setInterval(() => {
    if (!cloudAuthReady && ++tries < 40) return;
    clearInterval(t);
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
    const used = /expired|invalid|otp/i.test(v70LinkErr.code + " " + v70LinkErr.desc);
    if (cloudSession) { stToast(used ? "That email link was already used. You’re signed in: change your password in My Account." : "That email link didn’t work."); return; }
    authMode = "reset";
    updateAuthGate();
    setTimeout(() => cloudMsg(used ? "That link was already used or has expired. Each link works once, so enter your email for a fresh one." : "That email link didn’t work. Enter your email to get a new one."), 50);
  }, 250);
}
window.addEventListener("hashchange", () => { if (/access_token=|type=recovery|error_code=/.test(location.hash)) location.reload(); });
function stPwOpen() {
  if (!cloudSession) return;
  cloudRecovery = true;
  authMode = "recovery";
  try { closePanel(); } catch (e) {}
  updateAuthGate();
  setTimeout(() => document.getElementById("cloudNewPassword")?.focus(), 50);
}

/* V3.74 · Welcome tour in 4 slides: getting started → home screen (per device) → reminders → optional upgrade. */
if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "") && !(navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform || ""))) tourDevice = "computer";
function tourHomeScreenMarkup() {
  const tab = (id, label) => '<button type="button" class="tourTab' + (tourDevice === id ? " on" : "") + '" aria-pressed="' + (tourDevice === id) + '" onclick="tourSetDevice(\'' + id + "')\">" + label + "</button>";
  const inApp = installStandalone();
  let body;
  if (inApp) body = '<p class="tourOk">✓ You’re already using the app from your home screen. Nice!</p>';
  else if (tourDevice === "iphone")
    body = '<ol class="lcSteps"><li>Open scaleandtell.app in <b>Safari</b> (not Chrome or the Facebook browser).</li><li>Tap the <b>Share</b> button <span aria-hidden="true">⬆︎</span> at the bottom.</li><li>Scroll down and tap <b>Add to Home Screen</b>, then <b>Add</b>.</li><li>Open Scale &amp; Tell from the new icon.</li></ol>' +
      '<button class="action" type="button" onclick="installShare()">Open the Share menu</button><button class="action secondary" type="button" onclick="installCopyLink()">Copy app link</button><p class="lcSmall" id="installCopyNoteTour">In the Facebook or Instagram app? Copy the link and paste it into Safari first.</p>';
  else if (tourDevice === "android")
    body = (installPromptEvent ? '<button class="action" type="button" onclick="installNow()">Install Scale &amp; Tell</button>' : "") +
      '<ol class="lcSteps"><li>Open scaleandtell.app in <b>Chrome</b>.</li><li>Tap the <b>⋮</b> menu (top right).</li><li>Tap <b>Install app</b> or <b>Add to Home screen</b>.</li><li>Open Scale &amp; Tell from the new icon.</li></ol>' +
      '<p class="lcSmall">Samsung Internet: <b>☰</b> → <b>Add page to</b> → <b>Home screen</b>.</p><button class="action secondary" type="button" onclick="installCopyLink()">Copy app link</button><p class="lcSmall" id="installCopyNote"></p>';
  else
    body = (installPromptEvent ? '<button class="action" type="button" onclick="installNow()">Install Scale &amp; Tell</button>' : "") +
      '<ol class="lcSteps"><li><b>Chrome or Edge:</b> click the install icon <span aria-hidden="true">⊕</span> at the right end of the address bar, then <b>Install</b>.</li><li><b>Safari on Mac:</b> <b>File</b> → <b>Add to Dock</b>.</li><li>Or just bookmark scaleandtell.app. It works great in any browser.</li></ol>';
  return '<div class="tourSlide"><h3>Put it on your home screen 📱</h3><p>Scale &amp; Tell opens like a real app, with no app store needed.</p><div class="tourTabs" role="group" aria-label="Choose your device">' +
    tab("iphone", "🍎 iPhone") + tab("android", "🤖 Android") + tab("computer", "💻 Computer") + "</div>" + body + "</div>";
}
function tourRemindersMarkup() {
  let body;
  if (pushDeviceEnabled) body = tourReminderBlock(true).replace(/^<h4>.*?<\/h4>/, "");
  else if (tourDevice === "iphone" && !installStandalone())
    body = '<p>iPhone only sends notifications to apps on your <b>Home Screen</b>.</p><ol class="lcSteps"><li>Add Scale &amp; Tell to your Home Screen (previous slide).</li><li>Open it from the new icon.</li><li>Tap <b>Menu</b> → <b>Welcome Tour</b> (or <b>Calendar</b> → <b>Reminders</b>) and tap <b>Turn on reminders</b>, then <b>Allow</b>.</li></ol><p class="lcSmall">Needs iOS 16.4 or newer.</p>';
  else body = tourReminderBlock(true).replace(/^<h4>.*?<\/h4>/, "");
  return '<div class="tourSlide"><h3>Turn on reminders 🔔</h3><p>Get a heads-up on your phone when feedings, cleanings, UVB bulbs and vet visits are due.</p>' + body +
    '<p class="lcSmall">Change what you get anytime in <b>Calendar</b> → <b>Reminders</b>.</p></div>';
}
function tourStartMarkup() {
  return '<div class="tourSlide"><h3>Let’s get you started 🦎</h3><p>One private place for your animals’ feedings, sheds, weights, photos and reminders. Getting started takes about a minute:</p>' +
    '<ol class="lcSteps"><li><b>Add your first animal</b>: name, species and how often they eat.</li><li><b>Log care in one tap</b>: Quick Log for one animal, <b>Feed Day</b> for everyone at once.</li><li><b>Check Today’s Care</b> on Home: what’s due, with a ✓ to finish it.</li></ol>' +
    '<p class="lcSmall">Have old records? You can import them later from the Menu. Stuck? Menu → <b>Help &amp; Feedback</b>.</p></div>';
}
function tourUpgradeMarkup() {
  if (stPlanChecking()) return '<div class="tourSlide"><p class="planChecking">Checking your plan…</p></div>';
  if (stCanUsePack())
    return '<div class="tourSlide"><h3>You’re all set ♡</h3><div class="tourPack"><h4>' + esc(ST_PLANS[stPlan()]?.name || "Your plan") + ' is active</h4><p>Thank you for supporting Scale &amp; Tell! Room for ' + stAnimalLimit() + ' animals, family logins, Keeper Tools, four app designs and your Care Binder are unlocked.</p><button class="action secondary" onclick="tourDone(\'founder\')">See my extras</button></div></div>';
  return '<div class="tourSlide"><h3>Optional: want more? ⭐</h3><p>Everything you need is already included. If you’d like extras, <b>Founding Keeper</b> is <b>$14.99 one time</b>, with no subscription:</p><ul class="tourList"><li>Room for <b>40 animals</b> and <b>3 logins</b> for family</li><li>Vet &amp; medication reminders, shed predictions, then &amp; now photos, emergency card</li><li>Four app designs and your Care Binder</li></ul>' +
    '<button class="action secondary" onclick="tourDone(\'founder\')">See Founding Keeper</button><p class="lcSmall">Breeder or rescue? Menu → <b>Plans</b>. 10% of paid-plan profits go to a nonprofit reptile rescue 💚</p></div>';
}
tourMarkup = function () {
  const N = 4;
  const nav = '<div class="tourNav"><button type="button" class="action secondary" onclick="tourDone()">Skip</button>' +
    (tourStep ? '<button type="button" class="action secondary" onclick="tourGo(' + (tourStep - 1) + ')">← Back</button>' : "") +
    '<span class="tourProgress" aria-label="Step ' + (tourStep + 1) + " of " + N + '">' + (tourStep + 1) + " / " + N + "</span>" +
    (tourStep < N - 1 ? '<button type="button" class="action" onclick="tourGo(' + (tourStep + 1) + ')">Next →</button>'
      : '<button type="button" class="action" onclick="tourDone(\'start\')">Start my journal ♡</button>') + "</div>";
  const page = [tourStartMarkup, tourHomeScreenMarkup, tourRemindersMarkup, tourUpgradeMarkup][tourStep]();
  return '<div class="tourShell" aria-live="polite">' + page + nav + "</div>";
};
tourGo = function (step) {
  tourStep = Math.max(0, Math.min(3, Number(step) || 0));
  if (current === "Welcome Tour") {
    render();
    const m = document.querySelector(".modal");
    if (m) m.scrollTop = 0;
  }
};
/* V3.76 · Closing the welcome tour any way (×, Skip, Start) counts as seen. Only an automatic refresh brings it back. */
(function () {
  const base = closePanel;
  closePanel = function () {
    try {
      if (current === "Welcome Tour" && !window.__stReloading) {
        const uid = cloudSession?.user?.id;
        if (uid) localStorage.setItem("scaleTellTourSeen35:" + uid, "1");
      }
    } catch (e) {}
    return base.apply(this, arguments);
  };
})();


/* V3.81: no more silent logouts. Phones (especially iPhone) pause the app in the background, and when it wakes the
   sign-in token may be out of date or the network not back yet. Every request now makes sure the sign-in is fresh
   first, and repairs + retries once if the server says "not signed in". People are only asked to sign in again if
   the account's sign-in was truly ended (signed out elsewhere, password changed). */
var stEnsureP = null;
function stEnsureSession(force) {
  if (!cloudClient) return Promise.resolve(null);
  return stEnsureP || (stEnsureP = stEnsureRun(force).finally(() => { stEnsureP = null; }));
}
function stAuthDead(e) {
  if (!e) return false;
  const t = (e.name || "") + " " + (e.message || "") + " " + (e.code || "");
  if (/fetch|network|timeout|retryable|load failed|offline/i.test(t)) return false;
  return /refresh_token|refresh token|session_not_found|session not found|already used|invalid_grant/i.test(t) || e.status === 400;
}
async function stEnsureRun(force) {
  for (let i = 0; i < 5; i++) {
    try {
      const { data } = await cloudClient.auth.getSession();
      const s = data?.session;
      if (s && !(force && i === 0) && (s.expires_at || 0) * 1000 - Date.now() > 90000) { cloudSession = s; return s; }
      const rt = s?.refresh_token || cloudSession?.refresh_token;
      if (!rt) return null;
      const { data: d2, error } = await cloudClient.auth.refreshSession({ refresh_token: rt });
      if (d2?.session) { cloudSession = d2.session; return d2.session; }
      if (stAuthDead(error)) return null;
    } catch (e) {
      if (stAuthDead(e)) return null;
    }
    await new Promise((r) => setTimeout(r, 700 * (i + 1)));
  }
  return null;
}
async function stAuthFetch(url, opts) {
  const f = window.fetch.bind(window);
  const u = typeof url === "string" ? url : url?.url || String(url);
  const ours = /\/(rest|functions|storage)\/v1\//.test(u) && typeof url === "string";
  if (!ours || !cloudSession || !cloudClient) return f(url, opts);
  const withToken = (tok) => { const h = new Headers(opts?.headers || {}); h.set("Authorization", "Bearer " + tok); return { ...(opts || {}), headers: h }; };
  const auth = new Headers(opts?.headers || {}).get("Authorization") || "";
  // The app thinks you're signed in but this request would go out anonymous: fix the sign-in first.
  if (!/^Bearer ey/.test(auth)) {
    const s = await stEnsureSession();
    if (s?.access_token) opts = withToken(s.access_token);
  }
  const res = await f(url, opts);
  const reusable = !(opts?.body && typeof opts.body === "object" && typeof opts.body.getReader === "function");
  if (res.status !== 401 || !reusable) return res;
  const s = await stEnsureSession(true);
  if (!s?.access_token) return res;
  return f(url, withToken(s.access_token));
}
/* Only a truly ended sign-in sends someone to Sign In. */
stSessionRecover = async function () {
  const s = await stEnsureSession(true);
  if (s) return true;
  try {
    const { data } = await cloudClient.auth.getSession();
    if (data?.session) return true;
  } catch (e) {}
  if (!navigator.onLine) return false;
  try { await cloudClient.auth.signOut({ scope: "local" }); } catch (e) {}
  cloudSession = null;
  try { authMode = "signin"; updateAuthGate(); setTimeout(() => cloudMsg("Your sign-in ended on this device. Please sign in again. Nothing was charged and nothing was lost."), 50); } catch (e) {}
  return false;
};
/* Freshen the sign-in quietly whenever the app comes back to the screen. */
(function () {
  const wake = () => { if (cloudSession && document.visibilityState !== "hidden") stEnsureSession(); };
  document.addEventListener("visibilitychange", wake);
  window.addEventListener("pageshow", wake);
  window.addEventListener("online", wake);
})();
/* A PayPal payment that was approved but not confirmed (app closed, phone slept, connection dropped) is finished
   automatically next time the app opens, so nobody is left with a hold and no upgrade. */
(function () {
  const KEY = "scaleTellPendingCapture";
  const baseInvoke = founderInvoke;
  founderInvoke = async function (body) {
    if (body?.action === "capture" && body.orderId) try { localStorage.setItem(KEY, JSON.stringify({ id: body.orderId, g: body.groupName || "", t: Date.now(), u: cloudSession?.user?.id })); } catch (e) {}
    const data = await baseInvoke(body);
    if (body?.action === "capture" && data?.active) try { localStorage.removeItem(KEY); } catch (e) {}
    return data;
  };
  let tried = false;
  async function resume() {
    if (tried || !cloudSession || !cloudClient) return;
    let p = null;
    try { p = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
    if (!p?.id) return;
    tried = true;
    if (Date.now() - (p.t || 0) > 3 * 864e5 || (p.u && p.u !== cloudSession.user?.id)) { try { localStorage.removeItem(KEY); } catch (e) {} return; }
    try {
      const d = await baseInvoke({ action: "capture", orderId: p.id, groupName: p.g });
      try { localStorage.removeItem(KEY); } catch (e) {}
      if (d?.active) { await founderRefreshEntitlement(); try { cloudSetStatus(cloudAutoStatus); } catch (e) {} try { if (typeof showToast === "function") showToast("✓ Your Founding Keeper payment is confirmed ♡"); } catch (e) {} }
    } catch (e) {
      if (!/unavailable|network|fetch/i.test(e?.message || "")) try { localStorage.removeItem(KEY); } catch (x) {}
    }
  }
  let n = 0; const iv = setInterval(() => { if (++n > 40) clearInterval(iv); if (cloudSession) { clearInterval(iv); setTimeout(resume, 2500); } }, 750);
})();

/* V3.82 · Feeder Freezer auto-deduct. Logging a feeding ("Ate") with a prey type that's in the Feeder Freezer takes that
   many out automatically, shows what's left, and puts them back if the log is undone or deleted. */
function stPreyNorm(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\bmice\b/g, "mouse").replace(/\bpinkies\b/g, "pinky").replace(/\bfuzzies\b/g, "fuzzy")
    .split(/\s+/).filter(Boolean).map((w) => w.length > 3 ? w.replace(/(es|s)$/, (m) => (m === "es" && /(ch|sh|x)es$/.test(w) ? "" : m === "es" ? "e" : "")) : w).join(" ").trim();
}
function stFreezerFind(prey) {
  const p = stPreyNorm(prey);
  if (!p) return -1;
  const list = feederList();
  let i = list.findIndex((f) => stPreyNorm(f.name) === p);
  if (i < 0) i = list.findIndex((f) => { const n = stPreyNorm(f.name); return n && (p.includes(n) || n.includes(p)); });
  return i;
}
var stLastFz = null;
feederUse = function (prey, n) {
  stLastFz = null;
  n = Math.round(Number(n) || 0);
  if (!prey || n <= 0) return null;
  const i = stFreezerFind(prey);
  if (i < 0) return null;
  const list = feederList().map((f) => ({ ...f }));
  const take = Math.min(n, Math.max(0, Number(list[i].count) || 0));
  list[i].count = Math.max(0, (Number(list[i].count) || 0) - n);
  accountPrefsSet("feeders", list);
  return (stLastFz = { name: list[i].name, n: take, left: list[i].count, low: Number(list[i].low) || 0 });
};
function stFreezerGive(fz) {
  if (!fz?.name || !fz.n) return;
  const list = feederList().map((f) => ({ ...f }));
  const f = list.find((x) => x.name === fz.name);
  if (!f) return;
  f.count = (Number(f.count) || 0) + fz.n;
  accountPrefsSet("feeders", list);
}
function stFzText(fz) {
  if (!fz) return "";
  return "🧊 " + fz.n + " " + fz.name + " taken from the freezer · " + fz.left + " left" + (fz.left <= fz.low ? ". Time to reorder!" : "");
}
/* Main feeding form: a "How many" box and the freezer's feeders as suggestions. */
(function () {
  const baseRender = render;
  render = function () {
    const r = baseRender.apply(this, arguments);
    try {
      const inp = document.getElementById("preyType");
      if (inp && !document.getElementById("preyQty") && feederList().length) {
        const dl = document.createElement("datalist");
        dl.id = "stFzList";
        dl.innerHTML = feederList().map((f) => '<option value="' + esc(f.name) + '">').join("");
        inp.setAttribute("list", "stFzList");
        inp.after(dl);
        const lab = document.createElement("label");
        lab.innerHTML = 'How many (taken from your Feeder Freezer)<input id="preyQty" type="number" min="1" max="50" step="1" value="1" inputmode="numeric">';
        inp.closest("label")?.after(lab);
      }
    } catch (e) {}
    return r;
  };
  const baseSave = saveEntry;
  saveEntry = function () {
    const before = new Set(entries), qty = Math.max(1, Math.min(50, Math.round(Number(document.getElementById("preyQty")?.value) || 1)));
    stLastFz = null;
    const r = baseSave.apply(this, arguments);
    try {
      const e = entries.find((x) => !before.has(x)) || null;
      if (e && e.section === "Feeding Tracker" && stLastFz) {
        const fz = { ...stLastFz };
        if (qty > 1) { const more = feederUse(e.preyType, qty - 1); if (more) { fz.n += more.n; fz.left = more.left; } }
        e.fz = { name: fz.name, n: fz.n };
        if (qty > 1) e.preyCount = qty;
        save();
        stToast(stFzText(fz), "Undo", () => { stFreezerGive(e.fz); delete e.fz; save(); render(); });
      }
    } catch (x) {}
    stLastFz = null;
    return r;
  };
  /* Quick "Fed" button: uses that animal's usual prey when it's in the freezer. */
  const baseQuick = quickLogEntry;
  quickLogEntry = function (q, extra) {
    const before = new Set(entries);
    const r = baseQuick.apply(this, arguments);
    try {
      const e = entries.find((x) => !before.has(x)) || null;
      if (e && q?.section === "Feeding Tracker" && e.detail === "Ate" && !e.preyType) {
        const usual = entries.filter((x) => x !== e && x.animal === e.animal && x.section === "Feeding Tracker" && x.preyType).sort((a, b) => b.date.localeCompare(a.date))[0]?.preyType || "";
        const fz = usual && stFreezerFind(usual) >= 0 ? feederUse(usual, 1) : null;
        if (fz) {
          e.preyType = usual;
          e.fz = { name: fz.name, n: fz.n };
          save();
          render();
          stToast("Logged ♡ " + e.animal + " fed · " + stFzText(fz), "Undo", () => {
            const k = entries.indexOf(e);
            if (k >= 0) entries.splice(k, 1);
            stFreezerGive(e.fz);
            save();
            render();
          });
        }
      }
    } catch (x) {}
    return r;
  };
  /* Deleting a feeding puts its feeders back in the freezer. */
  const baseDel = deleteWithRecovery;
  deleteWithRecovery = function (i) {
    const e = entries[i];
    const r = baseDel.apply(this, arguments);
    try { if (e?.fz && !entries.includes(e)) { stFreezerGive(e.fz); stToast("🧊 " + e.fz.n + " " + e.fz.name + " put back in the freezer"); } } catch (x) {}
    return r;
  };
})();
