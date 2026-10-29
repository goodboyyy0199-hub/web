/* ===== props.js : สวิตช์เปิด/ปิดธีมและสร้างพร็อบ =====
   แก้ค่าด้านล่างได้เลย ไม่ต้องแตะ index.html */
(function(){
  var THEME = 'auto';            // 'auto' = เปิดตามวันที่ | 'halloween' = เปิดตลอด | 'off' = ปิด
  var HALLOWEEN_FROM = [10,25];  // [เดือน,วัน] เริ่ม
  var HALLOWEEN_TO   = [11,1];   // [เดือน,วัน] สิ้นสุด (ไม่รวมวันนี้)

  function inRange(){
    var d=new Date(), m=d.getMonth()+1, day=d.getDate(), v=m*100+day;
    return v>=HALLOWEEN_FROM[0]*100+HALLOWEEN_FROM[1] && v<HALLOWEEN_TO[0]*100+HALLOWEEN_TO[1];
  }
  var qs=(location.search.match(/[?&]theme=(\w+)/)||[])[1]; // ทดสอบ: เติม ?theme=halloween ท้าย URL
  var t=qs||THEME;
  var on = t==='halloween' || (t==='auto' && inRange());
  if(/[?&]halloween=off/.test(location.search)) on=false;   // ใช้ร่วมกับสวิตช์ของ index
  if(!on) return;
  document.documentElement.classList.add('halloween');

  /* ---------- พร็อบ: ใช้ position:fixed + pointer-events:none จะไม่บังปุ่ม ---------- */
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var rnd=function(a,b){return a+Math.random()*(b-a);};
  function mk(cls,html,style){var d=document.createElement('div');d.className='pr-layer '+cls;d.setAttribute('aria-hidden','true');
    if(html)d.innerHTML=html;if(style)d.style.cssText=style;document.body.appendChild(d);return d;}

  /* 1) เงามืดขอบจอ */
  mk('pr-vignette');

  /* 2) ไฟประดับห้อยใต้เฮดเดอร์ (วาดใหม่ตามความกว้างจอ) */
  var garland=mk('pr-garland');
  function hdrBottom(){var h=document.querySelector('header');return h?Math.round(h.getBoundingClientRect().bottom):64;}
  function drawGarland(){
    var w=Math.max(320,innerWidth),n=Math.max(3,Math.round(w/150)),step=w/n,sag=9,ts=[.2,.5,.8],wire='',bulbs='',k=0;
    for(var i=0;i<n;i++){
      var x0=i*step,x2=x0+step,xc=x0+step/2;
      wire+='M'+x0.toFixed(1)+' 1Q'+xc.toFixed(1)+' '+(1+2*sag)+' '+x2.toFixed(1)+' 1';
      ts.forEach(function(tt){
        var x=(1-tt)*(1-tt)*x0+2*(1-tt)*tt*xc+tt*tt*x2, y=1+2*(1-tt)*tt*(2*sag);
        bulbs+='<rect class="cap" x="'+(x-1.4).toFixed(1)+'" y="'+(y-.5).toFixed(1)+'" width="2.8" height="3" rx=".6"/>'
          +'<circle class="bulb c'+(k%3)+'" cx="'+x.toFixed(1)+'" cy="'+(y+4.6).toFixed(1)+'" r="3" style="animation-delay:'+(-(k*0.37)%2.4).toFixed(2)+'s"/>';
        k++;});
    }
    garland.style.top=hdrBottom()+'px';
    garland.innerHTML='<svg viewBox="0 0 '+w+' 26" preserveAspectRatio="none"><path class="wire" d="'+wire+'"/>'+bulbs+'</svg>';
  }
  drawGarland();
  var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(drawGarland,150);},{passive:true});
  addEventListener('load',drawGarland);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(drawGarland);
  var hd=document.querySelector('header');if(hd&&window.ResizeObserver)new ResizeObserver(function(){garland.style.top=hdrBottom()+'px';}).observe(hd);   // เฮดเดอร์เปลี่ยนความสูง (เช่น Tailwind โหลดเสร็จ) ไฟตามลงมาเอง

  if(RM)return;   // ผู้ใช้ปิดแอนิเมชัน: ข้ามพร็อบที่เคลื่อนไหวทั้งหมดด้านล่าง

  /* 3) ผีลอยข้ามจอ */
  var GHOST='<svg viewBox="0 0 60 70"><path fill="rgba(244,238,255,.92)" d="M30 2C14 2 6 15 6 30v36l7-6 7 6 7-6 7 6 7-6 7 6 7-6V30C54 15 46 2 30 2z"/>'
    +'<ellipse cx="22" cy="30" rx="4" ry="6" fill="#1a0a2e"/><ellipse cx="38" cy="30" rx="4" ry="6" fill="#1a0a2e"/>'
    +'<ellipse cx="30" cy="46" rx="5" ry="6.5" fill="#1a0a2e"/></svg>';
  [[18,58,46,-6],[52,42,62,-30]].forEach(function(g){
    mk('pr-ghost',GHOST,'top:'+g[0]+'%;width:'+g[1]+'px;animation-duration:'+g[2]+'s;animation-delay:'+g[3]+'s');});

  /* 4) ดวงตาเรืองแสงโผล่ในความมืดตามขอบจอ */
  var EC=['#ff8a1f','#b56bff','#7dffb0','#ff3d3d'];
  function eyes(){
    if(!document.hidden){
      var left=Math.random()<.5,e=mk('pr-eyes','<i></i><i></i>',
        (left?'left:'+rnd(1.5,7).toFixed(1)+'%':'right:'+rnd(1.5,7).toFixed(1)+'%')+';top:'+rnd(30,80).toFixed(0)+'%');
      e.style.setProperty('--ec',EC[Math.random()*EC.length|0]);
      setTimeout(function(){e.remove();},3800);
    }
    setTimeout(eyes,rnd(8000,17000));
  }
  setTimeout(eyes,rnd(3500,6500));

  /* 5) อีโมจิพุ่งตอนคลิก/แตะ */
  var EM=['🎃','🦇','👻','💀','🕸️','🍬','🕯️'];
  var lastBurst=0;
  document.addEventListener('pointerdown',function(e){
    var now=Date.now();if(now-lastBurst<120)return;lastBurst=now;
    for(var i=0;i<5;i++){
      var s=document.createElement('span');s.className='pr-burst';s.textContent=EM[Math.random()*EM.length|0];
      s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';
      s.style.setProperty('--dx',rnd(-70,70).toFixed(0)+'px');
      s.style.setProperty('--dy',rnd(-110,-30).toFixed(0)+'px');
      s.style.setProperty('--rot',rnd(-40,40).toFixed(0)+'deg');
      s.style.fontSize=rnd(15,26).toFixed(0)+'px';
      s.addEventListener('animationend',function(){this.remove();});
      document.body.appendChild(s);
    }
  },{passive:true});
})();
