/* vh_fix.js - stable viewport height for mobile browsers */
(function(){
  function setVh(){
    var vh = (window.innerHeight || document.documentElement.clientHeight || 0) * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }
  setVh();
  window.addEventListener('resize', setVh, {passive:true});
  window.addEventListener('orientationchange', setVh, {passive:true});
})();