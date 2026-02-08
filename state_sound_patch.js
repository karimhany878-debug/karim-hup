/* state_sound_patch.js - soften STATE 2P sounds (no harsh square) */
(function(){
  if(typeof window.tone!=="function") return;
  if(!window.SFX) return;

  // Replace tone() with SFX tone (keeps existing calls but nicer envelope)
  const oldTone = window.tone;
  window.tone = function(freq, dur, type="sine", gain=1.0){
    // map harsh waveforms to nicer ones
    const t = (type==="square"||type==="sawtooth") ? "triangle" : type;
    // use SFX internal tone via play() fallbacks
    // We'll directly call SFX by frequency using a hidden "tone" behavior:
    try{
      // temporary: use SFX default tone variant by name buckets
      if(freq<=250) return SFX.play("capture");
      if(freq>=700) return SFX.play("select");
      return SFX.play("move");
    }catch{
      return oldTone(freq, dur, t, gain);
    }
  };

  // If game.js exposes sfx object, tune the events
  try{
    if(window.sfx){
      sfx.select = ()=>SFX.play("select");
      sfx.multi  = ()=>SFX.play("select");
      sfx.send   = ()=>SFX.play("move");
      sfx.transfer = ()=>{ SFX.play("move"); setTimeout(()=>SFX.play("click"), 60); };
      sfx.hit    = ()=>SFX.play("capture");
      sfx.cap    = ()=>SFX.play("capture");
      sfx.win    = ()=>SFX.play("win");
      sfx.lose   = ()=>SFX.play("lose");
    }
  }catch(e){}
})();
