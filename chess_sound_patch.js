/* chess_sound_patch.js - override chess beep() to use SFX (pleasant) */
(function(){
  if(!window.SFX) return;
  // Map legacy beep freqs to semantic events
  window.beep = function(f=420, ms=55, v=0.05){
    if(f<=200) return SFX.play("win");        // 160 checkmate
    if(f>=240 && f<=280 && ms>=100) return SFX.play("draw"); // 260 draw
    if(f<=260) return SFX.play("capture");   // 220 capture
    return SFX.play("move");                 // 420 normal
  };
})();
