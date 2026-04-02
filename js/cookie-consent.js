'use strict';
/* ConvertlyPro — Cookie Consent v1.0
   GDPR + India DPDP Act + Google AdSense Consent Mode v2 */
(function(){
  const KEY='clp-cookie-v1';

  function getStored(){
    try{return JSON.parse(localStorage.getItem(KEY));}catch(e){return null;}
  }

  function saveAndApply(analytics, ads){
    const d={ts:Date.now(),analytics,ads,necessary:true};
    try{localStorage.setItem(KEY,JSON.stringify(d));}catch(e){}
    // Google Consent Mode v2
    if(typeof gtag==='function'){
      gtag('consent','update',{
        analytics_storage: analytics?'granted':'denied',
        ad_storage: ads?'granted':'denied',
        ad_user_data: ads?'granted':'denied',
        ad_personalization: ads?'granted':'denied'
      });
    }
    hideBanner();
  }

  function hideBanner(){
    const b=document.getElementById('clpCookieBanner');
    if(!b)return;
    b.style.transform='translateY(110%)';
    b.style.opacity='0';
    setTimeout(()=>b.remove(),450);
  }

  function createBanner(){
    // Inject styles
    const s=document.createElement('style');
    s.textContent=`
#clpCookieBanner{
  position:fixed;bottom:0;left:0;right:0;z-index:999999;
  background:linear-gradient(135deg,#1e1b4b 0%,#0f172a 100%);
  border-top:2px solid #4f46e5;
  padding:16px 20px;color:#fff;font-family:system-ui,sans-serif;
  box-shadow:0 -6px 40px rgba(0,0,0,.45);
  transform:translateY(100%);opacity:0;
  transition:transform .4s cubic-bezier(.34,1.2,.64,1),opacity .3s ease;
}
#clpCookieBanner.show{transform:translateY(0)!important;opacity:1!important}
.clp-cb-row{display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap}
.clp-cb-text{flex:1;min-width:220px}
.clp-cb-title{font-weight:800;font-size:.93rem;margin-bottom:5px}
.clp-cb-desc{font-size:.78rem;color:rgba(255,255,255,.72);line-height:1.6;margin:0}
.clp-cb-desc a{color:#a5b4fc}
.clp-cb-btns{display:flex;gap:8px;align-items:center;flex-wrap:wrap;flex-shrink:0}
.clp-btn-accept{background:#4f46e5;border:none;color:#fff;padding:10px 20px;border-radius:9px;font-size:.82rem;font-weight:700;cursor:pointer;transition:background .2s}
.clp-btn-accept:hover{background:#4338ca}
.clp-btn-reject{background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.25);color:#fff;padding:9px 16px;border-radius:9px;font-size:.8rem;font-weight:600;cursor:pointer}
.clp-btn-custom{background:transparent;border:none;color:rgba(255,255,255,.5);font-size:.76rem;cursor:pointer;text-decoration:underline;padding:4px}
.clp-custom-panel{display:none;margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,.12)}
.clp-checks{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:12px}
.clp-check-item{display:flex;align-items:flex-start;gap:8px;font-size:.79rem;min-width:160px}
.clp-check-item input{width:15px;height:15px;margin-top:2px;accent-color:#4f46e5;flex-shrink:0}
.clp-check-name{font-weight:700}
.clp-check-sub{color:rgba(255,255,255,.55);font-size:.73rem}
.clp-btn-save{background:#4f46e5;border:none;color:#fff;padding:8px 18px;border-radius:8px;font-size:.8rem;font-weight:700;cursor:pointer}
@media(max-width:540px){
  .clp-cb-btns{width:100%}
  .clp-btn-accept,.clp-btn-reject{flex:1;text-align:center}
}`;
    document.head.appendChild(s);

    const b=document.createElement('div');
    b.id='clpCookieBanner';
    b.setAttribute('role','dialog');
    b.setAttribute('aria-modal','true');
    b.setAttribute('aria-label','Cookie preferences');
    b.innerHTML=`
<div class="clp-cb-row">
  <div class="clp-cb-text">
    <div class="clp-cb-title">🍪 We use cookies</div>
    <p class="clp-cb-desc">We use necessary cookies to run our tools. With your permission, we also use Google Analytics (usage stats) and Google AdSense (ads that keep this site free). <a href="/privacy-policy.html">Privacy Policy</a></p>
  </div>
  <div class="clp-cb-btns">
    <button class="clp-btn-custom" id="clpBtnCustom">Customize</button>
    <button class="clp-btn-reject" id="clpBtnReject">Necessary Only</button>
    <button class="clp-btn-accept" id="clpBtnAccept">✓ Accept All</button>
  </div>
</div>
<div class="clp-custom-panel" id="clpCustomPanel">
  <div class="clp-checks">
    <label class="clp-check-item">
      <input type="checkbox" checked disabled/>
      <span><div class="clp-check-name">Necessary</div><div class="clp-check-sub">Required for tools to work</div></span>
    </label>
    <label class="clp-check-item">
      <input type="checkbox" id="clpChkAnalytics" checked/>
      <span><div class="clp-check-name">Analytics</div><div class="clp-check-sub">Google Analytics — usage stats</div></span>
    </label>
    <label class="clp-check-item">
      <input type="checkbox" id="clpChkAds" checked/>
      <span><div class="clp-check-name">Advertising</div><div class="clp-check-sub">Google AdSense — keeps site free</div></span>
    </label>
  </div>
  <button class="clp-btn-save" id="clpBtnSave">Save My Preferences</button>
</div>`;
    document.body.appendChild(b);

    // Animate in
    requestAnimationFrame(()=>requestAnimationFrame(()=>b.classList.add('show')));

    document.getElementById('clpBtnAccept').onclick=()=>saveAndApply(true,true);
    document.getElementById('clpBtnReject').onclick=()=>saveAndApply(false,false);
    document.getElementById('clpBtnCustom').onclick=()=>{
      const p=document.getElementById('clpCustomPanel');
      p.style.display=p.style.display==='block'?'none':'block';
    };
    document.getElementById('clpBtnSave').onclick=()=>{
      saveAndApply(
        document.getElementById('clpChkAnalytics').checked,
        document.getElementById('clpChkAds').checked
      );
    };
  }

  // Expose so privacy page can trigger it
  window.clpShowCookiePrefs=function(){
    const stored=getStored();
    createBanner();
    setTimeout(()=>{
      const p=document.getElementById('clpCustomPanel');
      if(p)p.style.display='block';
      if(stored){
        const ca=document.getElementById('clpChkAnalytics');
        const cb=document.getElementById('clpChkAds');
        if(ca)ca.checked=stored.analytics;
        if(cb)cb.checked=stored.ads;
      }
    },500);
  };

  // Init
  function init(){
    const stored=getStored();
    if(stored){
      // Already consented — apply silently
      if(typeof gtag==='function'){
        gtag('consent','update',{
          analytics_storage:stored.analytics?'granted':'denied',
          ad_storage:stored.ads?'granted':'denied',
          ad_user_data:stored.ads?'granted':'denied',
          ad_personalization:stored.ads?'granted':'denied'
        });
      }
      return;
    }
    // First visit — show after 900ms (don't block first paint)
    setTimeout(createBanner,900);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init);
  }else{
    init();
  }
})();
