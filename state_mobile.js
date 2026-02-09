(() => {
  // ===== Fix mobile 100vh bugs =====
  function setVH(){
    document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
  }
  setVH();
  window.addEventListener("resize", setVH);

  // ===== Play Mode toggle =====
  const playBtn = document.getElementById("btnPlay");
  const hudBtn  = document.getElementById("btnHUD");

  function setPlaying(on){
    document.body.classList.toggle("playing", !!on);
    try { window.scrollTo(0,0); } catch {}
  }

  if (playBtn) playBtn.addEventListener("click", () => setPlaying(true));
  if (hudBtn)  hudBtn.addEventListener("click",  () => setPlaying(false));

  // default: NOT playing (show UI first)
  function forceLayoutFix(){
  // update vh again
  document.documentElement.style.setProperty("--vh", (window.innerHeight * 0.01) + "px");
  // force canvas resize handlers (game.js غالبًا مربوط على resize)
  window.dispatchEvent(new Event("resize"));

  // IMPORTANT: regenerate map once if it was created too small (2 nodes bug)
  if (!window.__kg_new_once) {
    // لو زر New عندك id مختلف عدّله هنا
    const newBtn = document.getElementById("btnNew") || document.querySelector("[data-action='new'], .btnNew, #newBtn");
    if (newBtn) newBtn.click();
    window.__kg_new_once = true;
  }
}

function setPlaying(on){
  document.body.classList.toggle("playing", !!on);
  try { window.scrollTo(0,0); } catch {}
  setTimeout(forceLayoutFix, 60);
}

  // ===== Two-finger quick multi-select =====
  // Idea: while you are dragging from a node (finger1), tap another OWN node (finger2)
  // -> toggle that node into selection instantly (no long-press wait)
  const canvas = document.getElementById("game") || document.querySelector("canvas");
  if (!canvas) return;

  // double-tap also toggles selection fast (optional)
  let lastTapT = 0, lastTapNode = -1, lastTapOwner = -1;

  canvas.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse") return;

    // if game.js symbols exist
    if (typeof drags === "undefined" || typeof ownerFromPointer !== "function") return;
    if (typeof toCanvasXY !== "function" || typeof pickNodeAt !== "function") return;
    if (typeof toggleSel !== "function" || typeof setSingle !== "function") return;
    if (typeof nodes === "undefined") return;

    const owner = ownerFromPointer(e);
    const {x,y} = toCanvasXY(e);
    const hit = pickNodeAt(x,y);
    if (hit === -1) return;

    const n = nodes[hit];
    if (!n || n.owner !== owner) return;

    // 1) If there is already an active drag for this owner => treat this tap as "multi toggle"
    let hasDrag = false;
    for (const d of drags.values()){
      if (d && d.owner === owner){ hasDrag = true; break; }
    }
    if (hasDrag){
      toggleSel(owner, hit);
      try { sfx && sfx.multi && sfx.multi(); } catch {}
      try { showToast && showToast(`Multi: ${selSet?.[owner]?.size ?? ""}`); } catch {}
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }

    // 2) Double-tap to toggle (fast multi without long-press)
    const now = performance.now();
    if (now - lastTapT < 320 && lastTapNode === hit && lastTapOwner === owner){
      toggleSel(owner, hit);
      try { sfx && sfx.multi && sfx.multi(); } catch {}
      try { showToast && showToast(`Multi: ${selSet?.[owner]?.size ?? ""}`); } catch {}
      lastTapT = 0; lastTapNode = -1; lastTapOwner = -1;
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    lastTapT = now; lastTapNode = hit; lastTapOwner = owner;

  }, true); // capture=true so we intercept BEFORE original handler
})();
