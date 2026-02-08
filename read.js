const SETTINGS_KEY="karim_settings_v2";
const FAV_KEY="karim_read_favs_v1";

function loadSettings(){
  try{
    const s=JSON.parse(localStorage.getItem(SETTINGS_KEY)||"{}");
    return { sound:(s.sound ?? true), volume:(typeof s.volume==="number"?s.volume:0.35) };
  }catch{ return {sound:true, volume:0.35}; }
}
function toast(msg, ok=true){
  const t=document.getElementById("toast");
  t.textContent=msg;
  t.classList.remove("hidden","bad","hidden");
  t.classList.add(ok?"good":"bad");
  clearTimeout(toast._tm);
  toast._tm=setTimeout(()=>t.classList.add("hidden"), 1600);
}
function sfx(name){ try{ if(window.SFX) SFX.play(name); }catch{} }

function loadFavs(){
  try{ return JSON.parse(localStorage.getItem(FAV_KEY)||"{}"); }catch{ return {}; }
}
function saveFavs(x){ localStorage.setItem(FAV_KEY, JSON.stringify(x)); }

function icon(name){
  const I={
    sun:`<svg viewBox="0 0 24 24" fill="none"><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" stroke="currentColor" stroke-width="2"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    moon:`<svg viewBox="0 0 24 24" fill="none"><path d="M21 14.5A7.5 7.5 0 0 1 9.5 3 6.5 6.5 0 1 0 21 14.5Z" stroke="currentColor" stroke-width="2"/></svg>`,
    bed:`<svg viewBox="0 0 24 24" fill="none"><path d="M3 11h18v8H3v-8Z" stroke="currentColor" stroke-width="2"/><path d="M7 11V9a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/><path d="M3 19v2M21 19v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    wake:`<svg viewBox="0 0 24 24" fill="none"><path d="M7 3h10v6a5 5 0 0 1-10 0V3Z" stroke="currentColor" stroke-width="2"/><path d="M5 21h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 14v3M15 14v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    pray:`<svg viewBox="0 0 24 24" fill="none"><path d="M12 2c2 0 3 1 3 3s-1 3-3 3-3-1-3-3 1-3 3-3Z" stroke="currentColor" stroke-width="2"/><path d="M6 22v-4a6 6 0 0 1 12 0v4" stroke="currentColor" stroke-width="2"/><path d="M8 14l4 2 4-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    food:`<svg viewBox="0 0 24 24" fill="none"><path d="M7 2v9M10 2v9M7 6h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 2v7a3 3 0 0 0 6 0V2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6 22h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    quran:`<svg viewBox="0 0 24 24" fill="none"><path d="M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 0-4 4V4Z" stroke="currentColor" stroke-width="2"/><path d="M9 20h10V8a4 4 0 0 0-4-4H5" stroke="currentColor" stroke-width="2"/></svg>`,
    dua:`<svg viewBox="0 0 24 24" fill="none"><path d="M12 21c4.4 0 8-3.6 8-8V6l-8-4-8 4v7c0 4.4 3.6 8 8 8Z" stroke="currentColor" stroke-width="2"/></svg>`,
    star:`<svg viewBox="0 0 24 24" fill="none"><path d="M12 17.3l-5.1 3 1.4-5.8-4.5-3.9 6-.5L12 5l2.2 5.1 6 .5-4.5 3.9 1.4 5.8-5.1-3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  };
  return I[name]||I.dua;
}

const DB = [
  { id:"morning", title:"أذكار الصباح", icon:"sun", hint:"بعد الفجر حتى الضحى",
    items:[
      {t:"آية الكرسي", text:"اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ...", ref:"البقرة 255", rep:"مرة"},
      {t:"الإخلاص/الفلق/الناس", text:"قُلْ هُوَ اللَّهُ أَحَدٌ ...", ref:"سورة الإخلاص/الفلق/الناس", rep:"3 مرات"},
      {t:"رضيت بالله ربًا", text:"رَضِيتُ باللهِ رَبًّا وبالإسلامِ دِينًا وبمحمدٍ ﷺ نبيًّا", ref:"ذكر", rep:"3 مرات"},
      {t:"اللهم بك أصبحنا", text:"اللَّهُمَّ بِكَ أَصْبَحْنَا وبِكَ أَمْسَيْنَا وبِكَ نَحْيَا وبِكَ نَمُوتُ وإِلَيْكَ النُّشُورُ", ref:"ذكر", rep:"مرة"},
      {t:"حسبي الله", text:"حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", ref:"التوبة 129", rep:"مرة/7"},
      {t:"استغفار", text:"أستغفر الله العظيم وأتوب إليه", ref:"", rep:"100"},
    ]},

  { id:"evening", title:"أذكار المساء", icon:"moon", hint:"بعد العصر حتى النوم",
    items:[
      {t:"آية الكرسي", text:"اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ...", ref:"البقرة 255", rep:"مرة"},
      {t:"الإخلاص/الفلق/الناس", text:"قُلْ هُوَ اللَّهُ أَحَدٌ ...", ref:"سورة الإخلاص/الفلق/الناس", rep:"3 مرات"},
      {t:"اللهم بك أمسينا", text:"اللَّهُمَّ بِكَ أَمْسَيْنَا وبِكَ أَصْبَحْنَا وبِكَ نَحْيَا وبِكَ نَمُوتُ وإِلَيْكَ الْمَصِيرُ", ref:"ذكر", rep:"مرة"},
      {t:"اللهم إني أمسيت", text:"اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وأُشْهِدُ حَمَلَةَ عَرْشِكَ... أنك أنت الله لا إله إلا أنت", ref:"ذكر", rep:"4"},
      {t:"الصلاة على النبي ﷺ", text:"اللهم صل وسلم على نبينا محمد", ref:"", rep:"كثير"},
    ]},

  { id:"sleep", title:"أذكار النوم", icon:"bed", hint:"قبل النوم مباشرة",
    items:[
      {t:"باسمك ربي", text:"بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وبِكَ أَرْفَعُهُ...", ref:"ذكر", rep:"مرة"},
      {t:"آية الكرسي", text:"اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ...", ref:"البقرة 255", rep:"مرة"},
      {t:"آخر آيتين من البقرة", text:"آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ ...", ref:"البقرة 285-286", rep:"مرة"},
      {t:"تسبيح فاطمة", text:"سبحان الله 33 • الحمد لله 33 • الله أكبر 34", ref:"ذكر", rep:""},
      {t:"اللهم قِني عذابك", text:"اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", ref:"ذكر", rep:"مرة"},
    ]},

  { id:"wake", title:"أذكار الاستيقاظ", icon:"wake", hint:"عند الاستيقاظ",
    items:[
      {t:"الحمد لله", text:"الحمد لله الذي أحيانا بعدما أماتنا وإليه النشور", ref:"ذكر", rep:"مرة"},
      {t:"دعاء القيام", text:"لا إله إلا أنت سبحانك إني كنت من الظالمين", ref:"الأنبياء 87", rep:""},
      {t:"سنة الوضوء", text:"ابدأ بالوضوء ثم صل ركعتين إن تيسر", ref:"سنة", rep:""},
    ]},

  { id:"after_prayer", title:"أذكار بعد الصلاة", icon:"pray", hint:"بعد الفريضة",
    items:[
      {t:"استغفار", text:"أستغفر الله • أستغفر الله • أستغفر الله", ref:"ذكر", rep:"3"},
      {t:"اللهم أنت السلام", text:"اللَّهُمَّ أَنتَ السَّلَامُ ومِنكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ والإِكْرَامِ", ref:"ذكر", rep:"مرة"},
      {t:"تسبيح/تحميد/تكبير", text:"سبحان الله 33 • الحمد لله 33 • الله أكبر 34", ref:"ذكر", rep:""},
      {t:"آية الكرسي", text:"اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ...", ref:"البقرة 255", rep:"مرة"},
    ]},

  { id:"food", title:"أذكار الطعام", icon:"food", hint:"قبل/بعد الأكل",
    items:[
      {t:"قبل الطعام", text:"بِسْمِ الله", ref:"ذكر", rep:""},
      {t:"بعد الطعام", text:"الحمد لله الذي أطعمنا وسقانا وجعلنا مسلمين", ref:"ذكر", rep:""},
      {t:"إذا نسي التسمية", text:"بِسْمِ الله أَوَّلَهُ وآخِرَهُ", ref:"ذكر", rep:""},
    ]},

  { id:"quran_dua", title:"أدعية من القرآن", icon:"quran", hint:"مختارات",
    items:[
      {t:"ربنا آتنا", text:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وفي الآخِرَةِ حَسَنَةً وقِنَا عَذَابَ النَّارِ", ref:"البقرة 201", rep:""},
      {t:"رب اشرح لي", text:"رَبِّ اشْرَحْ لِي صَدْرِي • وَيَسِّرْ لِي أَمْرِي", ref:"طه 25-26", rep:""},
      {t:"رب زدني علما", text:"وَقُلْ رَبِّ زِدْنِي عِلْمًا", ref:"طه 114", rep:""},
      {t:"حسبنا الله", text:"حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", ref:"آل عمران 173", rep:""},
    ]},

  { id:"prophetic_dua", title:"أدعية نبوية", icon:"dua", hint:"مختارات",
    items:[
      {t:"اللهم إنك عفو", text:"اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ العَفْوَ فَاعْفُ عَنِّي", ref:"", rep:""},
      {t:"اللهم إني أسألك الهدى", text:"اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى", ref:"", rep:""},
      {t:"يا مقلب القلوب", text:"يَا مُقَلِّبَ القُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ", ref:"", rep:""},
    ]},

  { id:"jawami", title:"جوامع الدعاء", icon:"star", hint:"قصير جامع",
    items:[
      {t:"خير الدنيا والآخرة", text:"اللهم أصلح لي ديني الذي هو عصمة أمري، وأصلح لي دنياي التي فيها معاشي، وأصلح لي آخرتي التي فيها معادي", ref:"", rep:""},
      {t:"اللهم إني أعوذ بك", text:"اللهم إني أعوذ بك من الهم والحزن، وأعوذ بك من العجز والكسل، وأعوذ بك من الجبن والبخل", ref:"", rep:""},
    ]},
];

const UI = {
  chips: document.getElementById("chips"),
  search: document.getElementById("search"),
  btnClear: document.getElementById("btnClear"),
  cats: document.getElementById("cats"),
  reader: document.getElementById("reader"),
  mTitle: document.getElementById("mTitle"),
  mText: document.getElementById("mText"),
  mRef: document.getElementById("mRef"),
  mRepeat: document.getElementById("mRepeat"),
  mProg: document.getElementById("mProg"),
  mTag: document.getElementById("mTag"),
  btnClose: document.getElementById("btnClose"),
  btnPrev: document.getElementById("btnPrev"),
  btnNext: document.getElementById("btnNext"),
  btnShuffle: document.getElementById("btnShuffle"),
  btnFav: document.getElementById("btnFav"),
  btnCopy: document.getElementById("btnCopy"),
  btnIndex: document.getElementById("btnIndex"),
  idxModal: document.getElementById("indexModal"),
  idxList: document.getElementById("idxList"),
  idxSearch: document.getElementById("idxSearch"),
  btnIdxClear: document.getElementById("btnIdxClear"),
  btnIndexClose: document.getElementById("btnIndexClose"),
};

let favs = loadFavs();
let currentCat = null;
let currentIndex = 0;
let currentList = [];

function timeHint(){
  const h = new Date().getHours();
  if(h>=4 && h<11) return {id:"morning", name:"الآن: صباح"};
  if(h>=15 && h<22) return {id:"evening", name:"الآن: مساء"};
  if(h>=22 || h<4) return {id:"sleep", name:"الآن: قبل النوم"};
  return {id:"after_prayer", name:"الآن: أذكار مختارة"};
}

function renderChips(){
  UI.chips.innerHTML="";
  const th=timeHint();
  const a=document.createElement("div");
  a.className="chip good";
  a.textContent=th.name;
  UI.chips.appendChild(a);

  const b=document.createElement("div");
  b.className="chip";
  b.textContent="★ المفضلة محفوظة";
  UI.chips.appendChild(b);
}

function renderCats(filterText=""){
  const q=(filterText||"").trim().toLowerCase();
  UI.cats.innerHTML="";

  const th=timeHint().id;

  const cats = DB.filter(c=>{
    if(!q) return true;
    if(c.title.toLowerCase().includes(q)) return true;
    if(c.hint.toLowerCase().includes(q)) return true;
    return c.items.some(it => (it.t||"").toLowerCase().includes(q) || (it.text||"").toLowerCase().includes(q));
  });

  for(const c of cats){
    const el=document.createElement("a");
    el.href="#";
    el.className="card" + (c.id===th ? " primary" : "");
    el.innerHTML = `
      <div class="cat">
        <div class="ico">${icon(c.icon)}</div>
        <div class="txt">
          <div class="h">${c.title}</div>
          <div class="p">${c.hint} • ${c.items.length} عنصر</div>
        </div>
      </div>
    `;
    el.addEventListener("click",(e)=>{
      e.preventDefault();
      sfx("click");
      openCategory(c.id);
    });
    UI.cats.appendChild(el);
  }
}

function openCategory(id){
  const c=DB.find(x=>x.id===id);
  if(!c){ toast("القسم غير موجود", false); sfx("error"); return; }
  currentCat=c;
  currentList=c.items.slice();
  currentIndex=0;
  openReader();
}

function openReader(){
  UI.reader.classList.remove("hidden");
  renderItem();
}
function closeReader(){
  UI.reader.classList.add("hidden");
}

function keyFor(it){
  return (currentCat?currentCat.id:"x")+"::"+(it.t||"")+"::"+(it.text||"").slice(0,40);
}

function renderItem(){
  if(!currentCat) return;
  if(currentList.length===0){ toast("لا يوجد عناصر", false); return; }
  currentIndex = (currentIndex + currentList.length) % currentList.length;
  const it=currentList[currentIndex];

  UI.mTitle.textContent = currentCat.title;
  UI.mText.textContent = (it.t? (it.t+"\n\n") : "") + (it.text||"");
  UI.mRef.textContent = it.ref ? ("المصدر: " + it.ref) : "";
  UI.mRepeat.textContent = it.rep ? ("التكرار: " + it.rep) : "";
  UI.mProg.textContent = `${currentIndex+1}/${currentList.length}`;
  UI.mTag.textContent = currentCat.hint;

  const k=keyFor(it);
  UI.btnFav.textContent = favs[k] ? "★ Saved" : "☆ Fav";
}

function next(){ currentIndex++; sfx("move"); renderItem(); }
function prev(){ currentIndex--; sfx("move"); renderItem(); }
function shuffle(){
  if(!currentCat) return;
  for(let i=currentList.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [currentList[i],currentList[j]]=[currentList[j],currentList[i]];
  }
  currentIndex=0;
  sfx("ok");
  renderItem();
}

async function copy(){
  const it=currentList[currentIndex];
  const txt = (it.t?it.t+"\n":"") + (it.text||"") + (it.ref?("\n\n— "+it.ref):"");
  try{
    await navigator.clipboard.writeText(txt);
    toast("تم النسخ");
    sfx("ok");
  }catch{
    // fallback
    const ta=document.createElement("textarea");
    ta.value=txt; document.body.appendChild(ta);
    ta.select(); document.execCommand("copy");
    ta.remove();
    toast("تم النسخ");
    sfx("ok");
  }
}

function toggleFav(){
  const it=currentList[currentIndex];
  const k=keyFor(it);
  if(favs[k]){ delete favs[k]; toast("تم إزالة من المفضلة"); sfx("click"); }
  else{ favs[k]=true; toast("تمت الإضافة للمفضلة"); sfx("ok"); }
  saveFavs(favs);
  renderItem();
}

function openIndex(){
  if(!currentCat) return;
  UI.idxModal.classList.remove("hidden");
  UI.idxSearch.value="";
  renderIndex("");
}
function closeIndex(){ UI.idxModal.classList.add("hidden"); }

function renderIndex(q){
  const s=(q||"").trim().toLowerCase();
  UI.idxList.innerHTML="";
  currentCat.items.forEach((it, i)=>{
    const text=(it.text||"");
    const ok = !s || (it.t||"").toLowerCase().includes(s) || text.toLowerCase().includes(s);
    if(!ok) return;
    const row=document.createElement("div");
    row.className="idxItem";
    row.innerHTML = `<div class="t">${i+1}. ${(it.t||"عنصر")}</div><div class="s">${text.slice(0,90)}${text.length>90?"…":""}</div>`;
    row.addEventListener("click",()=>{
      sfx("click");
      currentIndex=i;
      closeIndex();
      renderItem();
    });
    UI.idxList.appendChild(row);
  });
}

UI.btnClear.addEventListener("click",()=>{ UI.search.value=""; renderCats(""); sfx("click"); });
UI.search.addEventListener("input",()=>renderCats(UI.search.value));

UI.btnClose.addEventListener("click",()=>{ sfx("click"); closeReader(); });
UI.reader.addEventListener("click",(e)=>{ if(e.target===UI.reader){ sfx("click"); closeReader(); } });

UI.btnNext.addEventListener("click", next);
UI.btnPrev.addEventListener("click", prev);
UI.btnShuffle.addEventListener("click", shuffle);
UI.btnCopy.addEventListener("click", copy);
UI.btnFav.addEventListener("click", toggleFav);
UI.btnIndex.addEventListener("click", ()=>{ sfx("click"); openIndex(); });

UI.btnIndexClose.addEventListener("click", ()=>{ sfx("click"); closeIndex(); });
UI.idxModal.addEventListener("click",(e)=>{ if(e.target===UI.idxModal){ sfx("click"); closeIndex(); } });
UI.idxSearch.addEventListener("input", ()=>renderIndex(UI.idxSearch.value));
UI.btnIdxClear.addEventListener("click", ()=>{ UI.idxSearch.value=""; renderIndex(""); sfx("click"); });

document.addEventListener("keydown",(e)=>{
  if(UI.reader.classList.contains("hidden")) return;
  if(e.key==="Escape"){ closeReader(); }
  if(e.key==="ArrowLeft"){ next(); }
  if(e.key==="ArrowRight"){ prev(); }
});

renderChips();
renderCats("");
