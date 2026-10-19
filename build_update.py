#!/usr/bin/env python3
"""Surgical update of Scale & Tell production v3.51, with fail-closed anchor checks.

Usage: python build_update.py --source /path/to/scale-and-tell
Reads app.js, index.html, sw.js. Does NOT change source. Produces READY_TO_UPLOAD.
"""
import argparse
from pathlib import Path
import shutil
import sys

HERE = Path(__file__).resolve().parent


def one(source, old, new, label):
    count = source.count(old)
    if count != 1:
        raise ValueError(f"{label}: expected one exact production anchor; found {count}. STOP. Do not upload partial files. The app may have changed since this kit was prepared.")
    return source.replace(old, new, 1)


def build(root, target):
    files = {n: (root / n).read_text(encoding='utf-8') for n in ('app.js', 'index.html', 'sw.js')}
    js = files['app.js']

    # Navigation: one new section inside the existing Scale Hub, nothing species-specific in its navigation.
    js = one(js,
       '<button class="resourceTile" onclick="openPanel(\\\'Recommended Products\\\')">',
       '<button class="resourceTile" onclick="openPanel(\\\'Watch & Learn\\\')"><strong>▷ Watch &amp; Learn ♡</strong><small>Choose a topic to explore our 48 hand-selected video links. Medical disclaimer included.</small></button><button class="resourceTile" onclick="openPanel(\\\'Recommended Products\\\')">',
       'Watch & Learn navigation')
    js = one(js,
       '  if (current === "Bioactive & DIY") {\n    el.innerHTML = diyMarkup();',
       '  if (current === "Watch & Learn") {\n    el.innerHTML = watchLearnMarkup();\n    return;\n  }\n  if (current === "Bioactive & DIY") {\n    el.innerHTML = diyMarkup();',
       'Watch & Learn rendering')

    # Reopening Watch & Learn always starts with topic choices, never a leftover video list.
    js = one(js,
       '  logPrefillAnimal = name === "Care Logs" && animal ? animal : "";',
       '  if (name === "Watch & Learn" && current !== name) { wlTopic = ""; wlQuery = ""; }\n  logPrefillAnimal = name === "Care Logs" && animal ? animal : "";'.replace('\\n', '\n'),
       'reset Watch & Learn landing on open')

    # Feeding-time helpers. HH:MM stored as local wall clock. No fake times for historical/legacy entries.
    helper = '''/* V3.52 · Feeding event time: local wall-clock HH:MM, independent of record creation timestamp. */
function stFeedNowTime() {
  const d = new Date();
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}
function stValidFeedingTime(v) {
  return typeof v === "string" && /^([01]\\d|2[0-3]):[0-5]\\d$/.test(v);
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
'''
    js = one(js, 'function quickLogMarkup() {', helper + 'function quickLogMarkup() {', 'time helpers')
    js = one(js, 'let quickLogDate = "";', 'let quickLogDate = "";\nlet quickLogTime = "";', 'Quick Log time state')
    js = one(js, '  quickLogDate = today();\n  openPanel("Quick Log", selectedAnimal);',
       '  quickLogDate = today();\n  quickLogTime = stFeedNowTime();\n  openPanel("Quick Log", selectedAnimal);',
       'Quick Log default time')
    js = one(js,
       "    '\" onchange=\"quickLogDate=this.value\"></label>' +",
       "    '\" onchange=\"quickLogSetDate(this.value)\"></label><label class=\"qlDate\">Feeding time (optional)<input type=\"time\" id=\"qlTime\" value=\"' + esc(quickLogTime) + '\" onchange=\"quickLogTime=this.value\"></label>' +",
       'Quick Log date/time inputs')
    js = one(js,
       'if (q.section === "Feeding Tracker") Object.assign(e, { preyType: "", preyWeight: "", response: detail === "Refused" ? "Refused" : "" });',
       'if (q.section === "Feeding Tracker") Object.assign(e, { preyType: "", preyWeight: "", response: detail === "Refused" ? "Refused" : "", ...(stValidFeedingTime(quickLogTime) ? { feedingTime: quickLogTime } : {}) });',
       'Quick Log saved time')

    # Ordinary feeding entry: separate optional time input, default local now, clears when historical date chosen.
    js = one(js,
       "      '</select></label><label>Date<input type=\"date\" id=\"date\"></label><label>Entry<select id=\"detail\">' +",
       "      '</select></label><label>Date<input type=\"date\" id=\"date\"></label>' +\n      (current === \"Feeding Tracker\" ? '<label>Feeding time (optional)<input type=\"time\" id=\"feedTime\"></label>' : '') +\n      '<label>Entry<select id=\"detail\">' +",
       'regular Feeding Tracker time input')
    js = one(js,
       '    document.getElementById("date").value = today();\n    if (pendingLogDetail) {',
       '''    document.getElementById("date").value = today();
    if (current === "Feeding Tracker") {
      document.getElementById("feedTime").value = stFeedNowTime();
      document.getElementById("date").addEventListener("change", function () {
        if (this.value !== today()) document.getElementById("feedTime").value = "";
      });
    }
    if (pendingLogDetail) {''',
       'regular Feeding Tracker default time')
    js = one(js,
       '  let preyType = document.getElementById("preyType")?.value.trim() || "",',
       '  const feedingTime = current === "Feeding Tracker" ? (document.getElementById("feedTime")?.value || "").trim() : "";\n  if (feedingTime && !stValidFeedingTime(feedingTime)) return alert("Enter a valid feeding time or leave it blank.");\n  let preyType = document.getElementById("preyType")?.value.trim() || "",',
       'regular feeding time validation')
    js = one(js,
       '...(current === "Feeding Tracker" ? { preyType, preyWeight, response } : {}),',
       '...(current === "Feeding Tracker" ? { preyType, preyWeight, response, ...(feedingTime ? { feedingTime } : {}) } : {}),',
       'regular feeding time persistence')

    # Edits: old records with no time remain blank, and can be backfilled intentionally.
    js = one(js,
       "      ? '<label>Food / prey type<input id=\"careEditPrey\" maxlength=\"60\" value=\"' +",
       "      ? '<label>Feeding time (optional)<input type=\"time\" id=\"careEditFeedingTime\" value=\"' + esc(e.feedingTime || '') + '\"></label><label>Food / prey type<input id=\"careEditPrey\" maxlength=\"60\" value=\"' +",
       'Edit Care Record time input')
    js = one(js,
       '    next.preyType = document.getElementById("careEditPrey").value.trim().slice(0, 60);',
       '''    const feedingTime = (document.getElementById("careEditFeedingTime")?.value || "").trim();
    if (feedingTime && !stValidFeedingTime(feedingTime)) return alert("Enter a valid feeding time or leave it blank.");
    next.feedingTime = feedingTime;
    next.preyType = document.getElementById("careEditPrey").value.trim().slice(0, 60);''',
       'edited feeding time persistence')

    # Show time in every history view that uses recordMeta, without guessing missing older data.
    js = one(js,
       'function recordMeta(e) {\n  return [\n',
       'function recordMeta(e) {\n  return [\n    e.section === "Feeding Tracker" && stValidFeedingTime(e.feedingTime) ? "Time " + stFeedingTimeLabel(e.feedingTime) : "",\n',
       'feeding history display')

    # Breeder bulk rack feeding time: optional single time for all tubs logged in the batch.
    js = one(js,
       "    '\"></label><div class=\"rfAll\"><span>Mark all:</span><button type=\"button\" onclick=\"rackFeedAll(&quot;Ate&quot;)\">Ate</button><button type=\"button\" onclick=\"rackFeedAll(&quot;&quot;)\">Clear</button></div>' +",
       "    '\"></label><label>Feeding time (optional, applies to selected tubs)<input type=\"time\" id=\"rfTime\"></label><div class=\"rfAll\"><span>Mark all:</span><button type=\"button\" onclick=\"rackFeedAll(&quot;Ate&quot;)\">Ate</button><button type=\"button\" onclick=\"rackFeedAll(&quot;&quot;)\">Clear</button></div>' +",
       'breeder rack time input')
    js = one(js,
       '  if (!r || !validDate(date)) return alert("Choose a valid date.");\n  const add = [];',
       '''  if (!r || !validDate(date)) return alert("Choose a valid date.");
  const feedingTime = (document.getElementById("rfTime")?.value || "").trim();
  if (feedingTime && !stValidFeedingTime(feedingTime)) return alert("Enter a valid feeding time or leave it blank.");
  const add = [];''',
       'breeder rack time validation')
    js = one(js,
       '      notes: "Rack feeding · " + r.name + " " + prey.dataset.tub,',
       '      notes: "Rack feeding · " + r.name + " " + prey.dataset.tub,\n      ...(feedingTime ? { feedingTime } : {}),',
       'breeder rack time persistence')

    idx = files['index.html']
    idx = one(idx, '<link rel="stylesheet" href="styles.css?v=3.51">',
       '<link rel="stylesheet" href="styles.css?v=3.51"><link rel="stylesheet" href="watch-learn.css?v=1">',
       'style load')
    idx = one(idx, '<script src="app.js?v=3.51"></script>',
       '<script src="watch-learn.js?v=1"></script><script src="app.js?v=3.52"></script>',
       'library load and app version')
    sw = files['sw.js']
    sw = one(sw, "const CACHE = 'scale-tell-static-v3.51';", "const CACHE = 'scale-tell-static-v3.52';", 'service worker cache version')
    sw = one(sw, "'./styles.css?v=3.51', './app.js?v=3.51'",
       "'./styles.css?v=3.51', './watch-learn.css?v=1', './watch-learn.js?v=1', './app.js?v=3.52'",
       'service worker precache')

    if target.exists():
        raise FileExistsError(f"{target} already exists; refusing to overwrite. Move or remove it yourself if appropriate.")
    target.mkdir(parents=True)
    for name, content in [('app.js', js), ('index.html', idx), ('sw.js', sw)]:
        (target/name).write_text(content,encoding='utf-8')
    for name in ('watch-learn.js','watch-learn.css'):
        shutil.copy2(HERE/name, target/name)
    print('SUCCESS: built 5 files in', target)
    print('Source files untouched. Upload all five together ONLY after syntax review and browser QA.')


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--source', type=Path, required=True, help='Current production repository folder containing app.js index.html sw.js')
    p.add_argument('--output', type=Path, default=HERE/'READY_TO_UPLOAD')
    opts=p.parse_args()
    try:
        build(opts.source.resolve(),opts.output.resolve())
    except Exception as error:
        print('STOP:',error, file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
