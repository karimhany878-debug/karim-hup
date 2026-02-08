(() => {
  // --- config ---
  const EVERY_MIN = 15;
  const KEY_LAST = "break_last_ts_v1";

  // --- modal (works even لو مش موجود) ---
  function ensureModal() {
    let modal = document.getElementById("modal");
    if (modal) return modal;

    // fallback: create modal dynamically
    modal = document.createElement("div");
    modal.id = "modal";
    modal.className = "overlay hidden";
    modal.innerHTML = `
      <div class="card">
        <div id="modalTitle" class="winner">Break</div>
        <div id="modalText" class="sub">...</div>
        <div class="row">
          <button id="btnModalA">OK</button>
          <button id="btnModalB">Close</button>
        </div>
      </div>`;
    document.querySelector(".stage")?.appendChild(modal);
    return modal;
  }

  function qs(id){ return document.getElementById(id); }

  function showModal(title, html) {
    const modal = ensureModal();
    const t = qs("modalTitle");
    const x = qs("modalText");
    const a = qs("btnModalA");
    const b = qs("btnModalB");

    if (t) t.textContent = title;
    if (x) x.innerHTML = html;

    if (a) {
      a.textContent = "OK";
      a.onclick = () => hideModal();
    }
    if (b) {
      b.style.display = "none"; // المطلوب OK فقط
    }

    modal.classList.remove("hidden");
  }

  function hideModal(){
    const modal = ensureModal();
    modal.classList.add("hidden");
  }

  function modalOpen(){
    const modal = ensureModal();
    return !modal.classList.contains("hidden");
  }

  // --- time buckets ---
  function bucketByHour(h){
    // تقدر تغيّر الحدود براحتك
    if (h >= 4 && h < 11) return "morning";      // أذكار الصباح
    if (h >= 15 && h < 19) return "evening";     // أذكار المساء
    if (h >= 19 && h < 23) return "night";       // آخر اليوم
    return "sleep";                               // منتصف الليل/قبل النوم
  }

  // --- content (خفيف + قصير لتقليل أخطاء التشكيل) ---
  const QURAN = [
    { t: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", ref: "الرعد: 28" },
    { t: "فَاذْكُرُونِي أَذْكُرْكُمْ", ref: "البقرة: 152" },
    { t: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", ref: "الشرح: 6" },
    { t: "وَقُلْ رَبِّ زِدْنِي عِلْمًا", ref: "طه: 114" },
    { t: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", ref: "الحديد: 4" },
  ];

  const SALAWAT = [
    "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ.",
    "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّم.",
    "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ."
  ];

  const HADITH = [
    "حديث: إنما الأعمال بالنيات.",
    "حديث: أحبُّ الأعمالِ إلى اللهِ أدومُها وإن قلّ.",
    "حديث: من دلَّ على خيرٍ فله مثلُ أجرِ فاعله."
  ];

  const ADHKAR = {
    morning: [
      "أذكار الصباح: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ 100 مرة.",
      "أذكار الصباح: اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا (اختصرها لو تحب).",
      "أذكار الصباح: استغفار 100 مرة."
    ],
    evening: [
      "أذكار المساء: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ 100 مرة.",
      "أذكار المساء: أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ (اختصرها لو تحب).",
      "أذكار المساء: أعوذ بكلمات الله التامات من شر ما خلق."
    ],
    night: [
      "ذكر: لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ.",
      "ذكر: سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَاللَّهُ أَكْبَرُ.",
      "ذكر: صلاة على النبي 10 مرات."
    ],
    sleep: [
      "قبل النوم: بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.",
      "قبل النوم: تسبيح 33 + تحميد 33 + تكبير 34.",
      "قبل النوم: استغفار + نية قيام."
    ]
  };

  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  function buildBreakHtml(){
    const h = new Date().getHours();
    const b = bucketByHour(h);

    const q = pick(QURAN);
    const s = pick(SALAWAT);
    const hd = pick(HADITH);
    const dz = pick(ADHKAR[b] || ADHKAR.night);

    return `
      <div style="display:grid; gap:10px">
        <div><b>آية</b><div style="margin-top:4px">${q.t}<div style="opacity:.75;font-size:12px">${q.ref}</div></div></div>
        <div><b>الصلاة على النبي ﷺ</b><div style="margin-top:4px">${s}</div></div>
        <div><b>حديث</b><div style="margin-top:4px">${hd}</div></div>
        <div><b>ذكر (${b})</b><div style="margin-top:4px">${dz}</div></div>
      </div>`;
  }

  function shouldShow(){
    const last = parseInt(localStorage.getItem(KEY_LAST) || "0", 10);
    const now = Date.now();
    return (now - last) >= (EVERY_MIN*60*1000 - 2000);
  }

  function markShown(){
    localStorage.setItem(KEY_LAST, String(Date.now()));
  }

  let pending = false;

  function showBreak(){
    if (!shouldShow()) return;

    // لو مودال مفتوح (Win/Help/غيره) -> أجّل
    if (modalOpen()){
      pending = true;
      return;
    }

    pending = false;
    showModal("Break Time", buildBreakHtml());
    markShown();
  }

  // align to quarter-hour boundary
  function scheduleAligned(){
    const now = new Date();
    const ms = now.getMilliseconds();
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const mod = min % EVERY_MIN;
    const minsToNext = (mod === 0) ? EVERY_MIN : (EVERY_MIN - mod);
    const delay = ((minsToNext*60) - sec) * 1000 - ms;

    setTimeout(() => {
      showBreak();
      setInterval(showBreak, EVERY_MIN*60*1000);
    }, Math.max(1000, delay));
  }

  // لو اتأجل بسبب Win Modal: أول ما يتقفل اعرضه
  const obs = new MutationObserver(() => {
    if(pending && !modalOpen()){
      showBreak();
    }
  });
  obs.observe(ensureModal(), { attributes:true, attributeFilter:["class"] });

  // start
  scheduleAligned();
})();
