SCALE & TELL ♡ | TOPIC-FIRST WATCH & LEARN + FEEDING TIME | REVISED UPDATE

This kit targets the REAL production source at rebeccacreates/scale-and-tell, main commit:
1078c952516478a2ab05c7586f59459cf302a279 (v3.51, checked Oct 18, 2026)
It is NOT the old Scaleandtellpreview repository.

WHAT IS IN THE KIT
- PREVIEW-Watch-and-Learn.html: browse the new 48-video library locally.
- watch-learn.js: 48 distinct user-submitted YouTube video IDs, topic-first browsing, per-topic search,
  category tags, direct external links, and prominent THIS IS NOT MEDICAL ADVICE banner.
- watch-learn.css: scoped responsive styles, including mobile layout and keyboard focus.
- build_update.py: production-targeted, fail-closed patcher to create FIVE ready-to-upload files.
- TEST-CHECKLIST.txt: staging and real-device tests.

The planned feeding-time addition covers:
  1. Standard Feeding Tracker date + optional time (today defaults to device-local current time).
  2. Quick Log feed/refusal date + optional time (today defaults to device-local current time).
  3. Edit Care Record: adjust or add a time to a feeding entry.
  4. Breeder rack batch feeding: one optional time for all marked tubs.
  5. History views: display a human-readable time when a record actually has one.
Older entries are unchanged and do NOT receive an invented time.
Past dates clear the prefilled time; time can be left blank.
New data is recorded as `feedingTime` (HH:MM, 24-hour local wall time) inside each existing
feeding record. The existing JSON journal sync and backup systems preserve extra fields.

HOW TO PREPARE THE UPDATED PRODUCTION FILES
1. Save a secure database backup in Supabase and keep the PRE-UPDATE application snapshot:
   https://github.com/rebeccacreates/scale-and-tell/archive/1078c952516478a2ab05c7586f59459cf302a279.zip
2. Download and extract that GitHub source ZIP to your computer.
3. Extract this kit ZIP to its own folder.
4. In a terminal/PowerShell, run:
   python build_update.py --source "FULL/PATH/TO/EXTRACTED/scale-and-tell-1078c952516478a2ab05c7586f59459cf302a279"
   (Replace with the actual extracted folder path. `py` can replace `python` on Windows.)
5. It will create READY_TO_UPLOAD/ with app.js, index.html, sw.js, watch-learn.js,
   watch-learn.css. It will STOP if the app source differs and any exact anchor is missing.
6. Test the output first on a staging copy or preview branch. Upload all 5 files to the
   MAIN PRODUCTION REPO ONLY after review. All files must go in the repository ROOT.
7. Verify the browser received app.js?v=3.52 and the service worker cache v3.52.

IMPORTANT
- The GitHub connector for this chat has READ access but returned 403 on write, so nothing
  was changed on scaleandtell.app. The kit is an implementation package, NOT a live deployment.
- The YouTube entries are the user's submissions. Independent content review is PENDING.
  No video should carry a clinical endorsement or promise the advice is up to date.
- Neither this kit nor a ZIP of your public site contains the private Supabase database,
  Auth records, storage photos, Edge Functions or secrets. Back them up separately through
  their services. NEVER put payment or Resend secrets in a public GitHub repository.
- This update is separate from the not-yet-deployed marketing-email opt-in package.
- If GitHub main changes after the pinned commit, fetch the CURRENT app files and re-review
  the patch instead of overwriting later work with older code.

REVISED WATCH & LEARN BEHAVIOR
- Only topic cards show initially. No All Topics filter and no global 48-video list.
- Select a topic to view only its videos, then optionally search within that topic.
- Browse topics returns to the category cards and hides video cards again.
- Feeding time integration remains unchanged from the earlier package.
- USE THIS REVISED ZIP INSTEAD OF THE FIRST WATCH & LEARN KIT.
