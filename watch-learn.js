/* Scale & Tell | Watch & Learn ♡ | First curated-submissions collection.
   Links supplied by Herps & Hers, pending content review. No external embedding or tracking SDK. */
'use strict';
const WL_VIDEOS = [
  ['k7_ybK-6_N0','How Do I Treat Snake Mites?','Mite Treatment','Health & Safety','Veterinary caution: products and dosing require species-specific veterinary guidance.'],
  ['BF9B7p7aUrM','How Can I Tell if My Snake Is Male or Female?','Sexing Snakes','Sexing & Identification','Probing and popping should only be performed by a qualified professional.'],
  ['V47UZbV2H_o','Should I Feed My Snake Inside Its Enclosure?','Feeding Snakes in Enclosures','Feeding & Nutrition',''],
  ['0ceX7UzCvCc','What Should I Know About Reptile Rescue?','10 Tips for Rescues','Getting Started',''],
  ['GarmW8Tc9QY','What Mistakes Should New Keepers Avoid?','5 Mistakes New Keepers Make','Getting Started',''],
  ['io18ogrezBw','Should I Brush My Bearded Dragon’s Teeth?','Should I Brush My BD Teeth?','Health & Safety','Seek reptile veterinary guidance before attempting at-home dental care.'],
  ['4r5FRLsQHMk','How Are Injections Given to Lizards?','How to Give Injections to Lizards','Health & Safety','Only administer prescribed injections after hands-on instruction from your veterinarian.'],
  ['FbjepSXEJV8','How Can I Prevent Tail Rot?','Tail Rot Prevention','Health & Safety','Tail discoloration or damaged tissue warrants prompt reptile veterinary assessment.'],
  ['6v0UFnAth6o','What Is MBD in Bearded Dragons?','MBD in BDs','Health & Safety','Suspected metabolic bone disease needs veterinary evaluation.'],
  ['lERbs9JNVtw','How Should Rot in Lizards Be Addressed?','How to Treat Rot in Lizards','Health & Safety','Do not attempt to cut tissue or self-prescribe medication.'],
  ['ExifE1gi4Lw','How Can I Tell if My Lizard Is Male or Female?','Sexing Lizards','Sexing & Identification','Methods vary by species, maturity and individual.'],
  ['E8JG_9FsNQI','How Do I Safely Trim a Bearded Dragon’s Nails?','Trimming BD Nails','Health & Safety','Ask a reptile vet to demonstrate if you are unfamiliar with the nail quick.'],
  ['GlxPztmZawA','How Do I Care for Isopods?','Isopod Care','Bioactive & Invertebrates','Species differ in moisture and ventilation needs.'],
  ['sbLofkL4lXE','What Should I Know About Tarantula Care?','Tarantula Care','Bioactive & Invertebrates','Care varies for terrestrial, fossorial and arboreal species.'],
  ['GjKg2gbbVpw','How Do I Care for a Jumping Spider?','Jumping Spider Care','Bioactive & Invertebrates',''],
  ['q918x4LLh80','What Should I Know About Toad Care?','Toad Care','Care Essentials','Identify the species before applying care parameters.'],
  ['sspqmKjeJlE','Is My Snake a Healthy Weight?','Is Your Snake Proper Weight?','Feeding & Nutrition','Assess body condition along with weight trends, age and species.'],
  ['n2k09c15SaE','How Do I Help My Snake With Stuck Shed?','How To Remove Snake’s Stuck Shed','Health & Safety','Never forcibly pull retained shed, especially from eyes or tail tips.'],
  ['4SVTpUlEZCA','How Can I Help a Picky Hognose Eat?','How To Get Picky Hognoses To Eat','Feeding & Nutrition','Persistent food refusal or weight loss warrants veterinary advice.'],
  ['a9tTGSGwpBQ','How Can I Build Trust With a Defensive Snake?','How To Tame an “Aggressive” Snake','Behavior & Handling','Respect stress signals and avoid forcing interaction.'],
  ['00o2dd47-SY','How Can I Recognize Respiratory Warning Signs?','Identifying URIs in Snakes','Health & Safety','Labored or open-mouth breathing needs urgent veterinary attention.'],
  ['5gTR_WPTxpg','What Should I Know Before Keeping a Sulcata?','Sulcata Tortoise Care','Care Essentials','Plan for exceptionally large adult size and long-term care.'],
  ['MZZ9pYYeB_4','How Do I Properly Care for an Axolotl?','Axolotl Care','Care Essentials','Cool, cycled water and water-quality testing are essential.'],
  ['2_Yl6RVYBgg','What Is My Snake Trying to Tell Me?','Mastering Snake Body Language','Behavior & Handling','Interpret body language in context.'],
  ['iCPJ7UmjGFg','Which Plants Work in Bioactive Enclosures?','Best Plants for Bioactive','Bioactive & Invertebrates','Check plant safety and avoid pesticide-treated nursery stock.'],
  ['J9SiZG8Rz8U','How Do I Set Up a Bioactive Enclosure?','How to Set Up a Successful Bioactive Enclosure','Bioactive & Invertebrates','Bioactive still requires routine monitoring and spot-cleaning.'],
  ['KRWlUcTFt-k','Do Snakes Have Individual Personalities?','Do Snakes Have Personalities?','Behavior & Handling',''],
  ['8TZaRe_71gQ','What Should I Know About Carpet Python Care?','Carpet Python Care','Care Essentials',''],
  ['XqxbLvizZnA','I Just Brought Home a Snake. Now What?','New Snake Orientation','Getting Started','Quarantine new arrivals away from established collections.'],
  ['9luyBtK2BJ0','How Do I Safely Feed My Snake?','Snake Feeding - How To','Feeding & Nutrition','Never leave live prey unattended.'],
  ['u2DDVm7MztE','What Should I Know About Ball Python Care?','Ball Python Care','Care Essentials','Review advice against current husbandry standards.'],
  ['7oN91XiLu0k','How Do I Prepare Snakes for an Evacuation?','What to Do With Snakes in an Emergency / Evacuation','Health & Safety','Follow local emergency guidance and prioritize safe, secure transport.'],
  ['sMEXL8B5r18','How Can I Build Trust With an Adult Snake?','How To Tame an Adult Snake','Behavior & Handling','Progress should happen at the animal’s pace.'],
  ['PtI6CyeajEI','How Do I Perform a Routine Snake Health Check?','How to Do a Health Check on Snakes','Health & Safety','A home observation is not a veterinary examination.'],
  ['-BzeaGHO_pg','What Should I Know About Black-Headed Python Care?','Black-Headed Python Care','Care Essentials',''],
  ['T2LT_jDlYCU','What Should I Know Before Keeping a Boa?','Boa Care','Care Essentials',''],
  ['tSm8QMEOarA','Can I Target Train My Ball Python?','Target Training for BPs','Behavior & Handling','Use voluntary, low-stress training.'],
  ['fsbOxA9iaNA','How Do I Set Up for a Super Dwarf Python?','Super Dwarf Setup','Enclosures & Enrichment','Super dwarf lineage does not guarantee a small adult size.'],
  ['KGjxJZYWBzI','How Can I Enrich My Reptile’s Environment?','Enrichment (video 1)','Enclosures & Enrichment',''],
  ['cBcYwdHk0Qo','How Do I Properly Feed My Lizard?','Lizard Feeding','Feeding & Nutrition','Diet varies greatly by species and age.'],
  ['DWrh6wYCD88','How Do I Set Up a Bearded Dragon Enclosure?','Bearded Dragon Setup','Enclosures & Enrichment','Check current lighting and UVB recommendations.'],
  ['eraphJhNwd0','How Do I Set Up a Leopard Gecko Enclosure?','Leopard Gecko Setup','Enclosures & Enrichment',''],
  ['w1jTJ78tLHU','How Do I Set Up for a Blue-Tongued Skink?','Blue Tongue Skink Setup','Enclosures & Enrichment','Humidity requirements vary by species and locality.'],
  ['mmhBtMPZKQA','How Do I Care for a Green Tree Frog?','Green Tree Frog Care','Care Essentials','Verify the species, as common names can overlap.'],
  ['fpgGhlr9pDc','What Should I Know About Dumeril’s Boa Care?','Dumerils Boa Care','Care Essentials',''],
  ['fHnWRkn6plQ','What Else Can I Do for Enrichment?','Enrichment (video 2)','Enclosures & Enrichment',''],
  ['LGOm-AeOvBw','What Should I Know Before Keeping a Burmese Python?','Burmese Python Care','Care Essentials','Research adult size, local regulations and large-constrictor safety.'],
  ['krcMrNv5eZc','What Should I Know About Corn Snake Care?','Corn Snake Care','Care Essentials','Escape prevention is especially important.']
];
/* Watch & Learn uses topic-first navigation. There is no All Topics list and
   no videos load until a category is actively selected. */
let wlTopic = '', wlQuery = '';
const WL_TOPICS = ['Getting Started','Feeding & Nutrition','Health & Safety','Behavior & Handling','Sexing & Identification','Enclosures & Enrichment','Bioactive & Invertebrates','Care Essentials'];
const WL_TOPIC_SUMMARY = {
  'Getting Started': 'New arrivals, rescues and common mistakes',
  'Feeding & Nutrition': 'Feeding methods, refusals and body condition',
  'Health & Safety': 'Prevention, warning signs and emergency planning',
  'Behavior & Handling': 'Trust, body language and training',
  'Sexing & Identification': 'Understanding sexing methods and their limits',
  'Enclosures & Enrichment': 'Safer setups and meaningful enrichment',
  'Bioactive & Invertebrates': 'Living enclosures, plants and cleanup crews',
  'Care Essentials': 'Common husbandry and long-term care questions'
};
function wlEsc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function wlSetTopic(topic) {
  wlTopic = WL_TOPICS.includes(topic) ? topic : '';
  wlQuery = '';
  wlRefresh();
  const shell = document.querySelector('.wlShell');
  if (shell && typeof shell.scrollIntoView === 'function') shell.scrollIntoView({ block: 'start' });
}
function wlRefresh() {
  const home = document.getElementById('wlHome');
  const detail = document.getElementById('wlDetail');
  const result = document.getElementById('wlResults');
  if (!home || !detail || !result) return;
  home.hidden = !!wlTopic;
  detail.hidden = !wlTopic;
  // Never show all videos when no topic has been selected.
  if (!wlTopic) {
    result.replaceChildren();
    return;
  }
  const input = document.getElementById('wlSearch');
  if (input && input.value !== wlQuery) input.value = wlQuery;
  const heading = document.getElementById('wlSelectedTopic');
  if (heading) heading.textContent = wlTopic;
  const q = wlQuery.trim().toLowerCase();
  const topicVideos = WL_VIDEOS.filter(v => v[3] === wlTopic);
  const items = topicVideos.filter(v => !q || (v[1]+' '+v[2]).toLowerCase().includes(q));
  const count = document.getElementById('wlCount');
  if (count) count.textContent = items.length + ' of ' + topicVideos.length + ' videos in this topic';
  result.innerHTML = items.length ? items.map(v => {
    const [id,question,original,topic,note] = v;
    const url = 'https://www.youtube.com/watch?v='+encodeURIComponent(id);
    const thumb = 'https://i.ytimg.com/vi/'+encodeURIComponent(id)+'/hqdefault.jpg';
    return '<article class="wlCard"><a class="wlThumb" href="'+url+'" target="_blank" rel="noopener noreferrer" aria-label="Watch '+wlEsc(original)+' on YouTube"><img src="'+thumb+'" loading="lazy" alt="Video thumbnail for '+wlEsc(original)+'" referrerpolicy="no-referrer"><span aria-hidden="true">▶</span></a><div class="wlContent"><span class="wlTag">'+wlEsc(topic)+'</span><h3>'+wlEsc(question)+'</h3><p class="wlOriginal">Original video: '+wlEsc(original)+'</p>'+(note?'<p class="wlNote">'+wlEsc(note)+'</p>':'')+'<a class="wlLink" href="'+url+'" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></div></article>';
  }).join('') : '<p class="resourceMuted">No videos in this topic matched your search. Try another keyword or browse topics.</p>';
}
function watchLearnMarkup() {
  // Video links are submitted by Herps & Hers. Each video awaits independent content review.
  const topicCards = WL_TOPICS.map(t => {
    const n = WL_VIDEOS.filter(v => v[3] === t).length;
    return '<button type="button" class="wlTopicCard" data-wl-topic="'+wlEsc(t)+'" onclick="wlSetTopic(this.dataset.wlTopic)" aria-label="Browse '+wlEsc(t)+', '+n+' videos"><strong>'+wlEsc(t)+'</strong><span>'+wlEsc(WL_TOPIC_SUMMARY[t])+'</span><small>'+n+' videos · View topic →</small></button>';
  }).join('');
  const out = '<section class="wlShell"><p class="resourceIntro">Watch &amp; Learn ♡ · Questions keepers actually ask. Choose a topic to see its videos. Submitted links from Herps &amp; Hers; individual video content review is pending.</p><aside class="wlWarning" role="note"><strong>THIS IS NOT MEDICAL ADVICE.</strong> These videos are for general education and do not replace professional veterinary advice, diagnosis or treatment. Never give medication, injections or other treatment without direction from a qualified reptile veterinarian. Care recommendations vary by species and can change over time.</aside><div id="wlHome"><h3 class="wlPageTitle">What would you like to learn about?</h3><div class="wlTopicGrid" role="group" aria-label="Choose a learning topic">'+topicCards+'</div></div><div id="wlDetail" hidden><button type="button" class="wlBack" onclick="wlSetTopic(\'\')">← Browse topics</button><h3 class="wlPageTitle" id="wlSelectedTopic"></h3><label class="wlSearch">Search within this topic<input type="search" id="wlSearch" maxlength="100" placeholder="Search this topic…" oninput="wlQuery=this.value;wlRefresh()" value="'+wlEsc(wlQuery)+'"></label><p class="resourceMuted" id="wlCount" aria-live="polite"></p><div class="wlGrid" id="wlResults"></div></div><p class="resourceMuted">Videos belong to their respective creators and open directly on YouTube. Inclusion does not mean every statement has been independently verified. If advice conflicts, consult current species-specific guidance and your reptile veterinarian.</p><button class="action secondary" onclick="openPanel(\'Scale Hub\')">Back to Scale Hub</button></section>';
  setTimeout(wlRefresh,0);
  return out;
}
