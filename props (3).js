/* ===== props.js : สวิตช์เปิด/ปิดธีมฮาโลวีน และสร้างพร็อบตกแต่ง =====
   แก้ค่าด้านล่างได้เลย ไม่ต้องแตะ index.html
   - พร็อบทั้งหมดเป็น position:fixed + pointer-events:none  => ไม่บังปุ่ม/ไม่กินคลิก
   - วางเฉพาะขอบจอ/มุมจอ (ที่ว่าง) และอยู่ "หลัง" เมนูย่อย/การ์ดข่าว => ไม่ทับตัวหนังสือ
   - ลบไฟล์นี้ + props.css ทิ้ง เว็บกลับเป็นปกติ */
(function(){
  var THEME = 'auto';            // 'auto' = เปิดตามวันที่ | 'halloween' = เปิดตลอด | 'off' = ปิด
  var HALLOWEEN_FROM = [10,25];  // [เดือน,วัน] เริ่ม
  var HALLOWEEN_TO   = [11,1];   // [เดือน,วัน] สิ้นสุด (ไม่รวมวันนี้)

  /* เปิด/ปิดพร็อบแต่ละชุด (true/false) */
  var OPT = {
    webs:   true,   // ใยแมงมุมมุมบนซ้าย/ขวา + แมงมุมห้อยโหน
    props:  true,   // ฟักทอง/ผี/หลุมศพ/หมวกแม่มด/หม้อ/กะโหลก มุมล่างซ้าย-ขวา (เปลี่ยนตามเมนู)
    bats:   true,   // ค้างคาวบินผ่านนานๆ ครั้ง
    embers: true,   // ประกายไฟลอยขึ้นตามขอบซ้าย-ขวา
    fog:    true    // หมอกจางๆ ด้านล่าง + ขอบมืดจางๆ
  };

  function inRange(){
    var d=new Date(), m=d.getMonth()+1, day=d.getDate(), v=m*100+day;
    return v>=HALLOWEEN_FROM[0]*100+HALLOWEEN_FROM[1] && v<HALLOWEEN_TO[0]*100+HALLOWEEN_TO[1];
  }
  var qs=(location.search.match(/[?&]theme=(\w+)/)||[])[1]; // ทดสอบ: เติม ?theme=halloween ท้าย URL
  var t=qs||THEME;
  var on = t==='halloween' || (t==='auto' && inRange());
  if(!on) return;
  var root=document.documentElement;
  root.classList.add('halloween');

  /* ---------- ภาพ SVG ---------- */
  function uri(svg){ return 'url("data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)+'")'; }

  /* ใยแมงมุมมุมจอ (สร้างด้วยโค้ด) */
  function web(flip){
    var A=[0,22.5,45,67.5,90], R=[24,46,68,92], d='', i, k;
    function P(r,a){a=a*Math.PI/180;return [r*Math.cos(a),r*Math.sin(a)];}
    for(i=0;i<A.length;i++){var e=P(100,A[i]);d+='M0 0L'+e[0].toFixed(1)+' '+e[1].toFixed(1);}
    for(k=0;k<R.length;k++){
      for(i=0;i<A.length-1;i++){
        var p1=P(R[k],A[i]),p2=P(R[k],A[i+1]),c=P(R[k]*.84,(A[i]+A[i+1])/2);
        if(i===0)d+='M'+p1[0].toFixed(1)+' '+p1[1].toFixed(1);
        d+='Q'+c[0].toFixed(1)+' '+c[1].toFixed(1)+' '+p2[0].toFixed(1)+' '+p2[1].toFixed(1);
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g'+(flip?' transform="translate(100 0) scale(-1 1)"':'')+
      ' fill="none" stroke="#e9e1f5" stroke-width="1" stroke-linecap="round"><path d="'+d+'"/></g></svg>';
  }

  var PUMPKIN_DEFS=
    '<defs><radialGradient id="hwg" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="#ffb347"/><stop offset=".6" stop-color="#ff7a12"/><stop offset="1" stop-color="#b93a08"/></radialGradient>'+
    '<symbol id="hwp" viewBox="0 0 100 90">'+
      '<path d="M50 20C48 11 53 6 61 4" stroke="#5f9b30" stroke-width="6" fill="none" stroke-linecap="round"/>'+
      '<ellipse cx="50" cy="54" rx="45" ry="35" fill="url(#hwg)"/>'+
      '<path d="M50 19C30 28 30 80 50 89M50 19C70 28 70 80 50 89" stroke="#a83507" stroke-width="2.5" fill="none" opacity=".55"/>'+
      '<path d="M22 42L40 34L42 50ZM78 42L60 34L58 50ZM50 54L44 66H56ZM22 66Q50 94 78 66Q68 74 62 69L56 77L50 70L44 77L38 69Q32 74 22 66Z" fill="#ffd54a"/>'+
    '</symbol></defs>';

  var S={};
  S.pumpkins='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 100">'+PUMPKIN_DEFS+
    '<use href="#hwp" x="104" y="52" width="58" height="52"/>'+
    '<use href="#hwp" x="0" y="8" width="104" height="94"/>'+
    '<use href="#hwp" x="84" y="30" width="46" height="41" opacity=".0"/></svg>';

  S.ghost='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 100"><defs><linearGradient id="hwgh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9b6ee"/></linearGradient></defs>'+
    '<path d="M8 92V40A32 32 0 0 1 72 40V92L60 83L50 92L40 83L30 92L20 83Z" fill="url(#hwgh)" opacity=".92"/>'+
    '<ellipse cx="30" cy="42" rx="5" ry="8" fill="#241334"/><ellipse cx="50" cy="42" rx="5" ry="8" fill="#241334"/>'+
    '<ellipse cx="40" cy="62" rx="6" ry="8" fill="#241334"/></svg>';

  S.tomb='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 100">'+
    '<ellipse cx="40" cy="96" rx="38" ry="5" fill="#16301a"/>'+
    '<path d="M10 95V38A30 30 0 0 1 70 38V95Z" fill="#6f6c80" stroke="#3b3948" stroke-width="3"/>'+
    '<path d="M22 24Q30 14 40 12" stroke="#8a879b" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>'+
    '<text x="40" y="52" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="17" fill="#2b2935">RIP</text>'+
    '<path d="M40 60V82M32 68H48" stroke="#2b2935" stroke-width="3" stroke-linecap="round"/>'+
    '<path d="M44 40L50 52L45 58" stroke="#3b3948" stroke-width="1.6" fill="none"/></svg>';

  S.hat='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90">'+
    '<ellipse cx="50" cy="77" rx="47" ry="10" fill="#1d1130" stroke="#6b3aa0" stroke-width="1.5"/>'+
    '<path d="M31 76L47 16Q51 4 63 12Q54 20 69 76Z" fill="#2c1850" stroke="#6b3aa0" stroke-width="1.5"/>'+
    '<path d="M33 64Q50 72 67 64L69 73Q50 81 31 73Z" fill="#ff7a12"/>'+
    '<rect x="44" y="65" width="12" height="11" rx="2" fill="none" stroke="#ffd54a" stroke-width="2.5"/></svg>';

  S.cauldron='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90">'+
    '<circle class="hw-bub" cx="40" cy="30" r="5" fill="#8cff3a" opacity=".8"/>'+
    '<circle class="hw-bub b2" cx="58" cy="26" r="4" fill="#8cff3a" opacity=".8"/>'+
    '<circle class="hw-bub b3" cx="50" cy="20" r="3" fill="#8cff3a" opacity=".8"/>'+
    '<rect x="26" y="78" width="9" height="11" rx="2" fill="#2a2a34"/><rect x="65" y="78" width="9" height="11" rx="2" fill="#2a2a34"/>'+
    '<path d="M13 44Q9 82 40 86H60Q91 82 87 44Z" fill="#1c1c25" stroke="#4a4a5c" stroke-width="2"/>'+
    '<ellipse cx="50" cy="44" rx="39" ry="9" fill="#2c2c38" stroke="#4a4a5c" stroke-width="2"/>'+
    '<ellipse cx="50" cy="44" rx="33" ry="6" fill="#8cff3a"/></svg>';

  S.skull='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 90">'+
    '<rect x="22" y="66" width="36" height="18" rx="5" fill="#efe6d0"/>'+
    '<path d="M40 4C16 4 8 22 12 40C14 48 20 50 22 56V70H58V56C60 50 66 48 68 40C72 22 64 4 40 4Z" fill="#efe6d0"/>'+
    '<ellipse cx="28" cy="38" rx="9" ry="10" fill="#1a0a02"/><ellipse cx="52" cy="38" rx="9" ry="10" fill="#1a0a02"/>'+
    '<circle cx="28" cy="39" r="3.2" fill="#ff7a12"/><circle cx="52" cy="39" r="3.2" fill="#ff7a12"/>'+
    '<path d="M40 48L35 59H45Z" fill="#1a0a02"/>'+
    '<path d="M31 70V82M40 70V82M49 70V82" stroke="#8a7a5a" stroke-width="2"/></svg>';

  S.bat='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 32"><path d="M32 10L29 4L27 13Q20 6 2 8Q10 13 8 22Q14 17 18 22Q22 17 26 23L32 29L38 23Q42 17 46 22Q50 17 56 22Q54 13 62 8Q44 6 37 13L35 4Z" fill="#2b1240" stroke="#9a5ce0" stroke-width="1"/></svg>';

  S.spider='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 100"><line x1="20" y1="0" x2="20" y2="72" stroke="#e1d8f0" stroke-width="1.2"/>'+
    '<g fill="none" stroke="#8a4bd0" stroke-width="1.6" stroke-linecap="round">'+
    '<path d="M13 80Q2 72 3 62M12 85Q0 83 2 74M12 90Q2 94 4 100M13 94Q8 98 9 100"/>'+
    '<path d="M27 80Q38 72 37 62M28 85Q40 83 38 74M28 90Q38 94 36 100M27 94Q32 98 31 100"/></g>'+
    '<ellipse cx="20" cy="88" rx="9" ry="10" fill="#2a1442" stroke="#8a4bd0" stroke-width="1.2"/>'+
    '<circle cx="20" cy="76" r="6" fill="#2a1442" stroke="#8a4bd0" stroke-width="1.2"/>'+
    '<path d="M17 85H23L20 89L23 93H17L20 89Z" fill="#ff7a12"/>'+
    '<circle cx="17.5" cy="75" r="1.4" fill="#ff3b30"/><circle cx="22.5" cy="75" r="1.4" fill="#ff3b30"/></svg>';

  root.style.setProperty('--hw-web',uri(web(false)));
  root.style.setProperty('--hw-web-r',uri(web(true)));
  root.style.setProperty('--hw-pumpkin',uri(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90">'+PUMPKIN_DEFS+'<use href="#hwp" width="100" height="90"/></svg>'));

  /* ---------- สร้างชั้นตกแต่ง ---------- */
  var slots=[];
  function build(){
    if(document.getElementById('hw-decor')) return;
    var box=document.createElement('div'); box.id='hw-decor'; box.setAttribute('aria-hidden','true');
    var h='';
    if(OPT.fog) h+='<div class="hw-vig"></div><div class="hw-fog"></div>';
    if(OPT.webs) h+='<div class="hw-web hw-web-l"></div><div class="hw-web hw-web-r"></div><div class="hw-spider">'+S.spider+'</div>';
    if(OPT.props){
      h+='<div class="hw-slot hw-bl hw-pump">'+S.pumpkins+'</div>';
      h+='<div class="hw-slot hw-br" data-r="home"><div style="width:56%">'+S.tomb+'</div><div class="hw-float" style="width:44%">'+S.ghost+'</div></div>';
      h+='<div class="hw-slot hw-br" data-r="news"><div class="hw-float" style="width:70%;margin-left:auto">'+S.ghost+'</div></div>';
      h+='<div class="hw-slot hw-br" data-r="skin"><div style="width:100%">'+S.hat+'</div></div>';
      h+='<div class="hw-slot hw-br" data-r="items"><div style="width:100%">'+S.cauldron+'</div></div>';
      h+='<div class="hw-slot hw-br" data-r="shop"><div style="width:66%;margin-left:auto">'+S.skull+'</div></div>';
    }
    if(OPT.bats){
      [[22,46,29,4],[56,36,37,13],[12,30,43,24]].forEach(function(b){
        h+='<div class="hw-bat" style="--y:'+b[0]+'vh;--w:'+b[1]+'px;--d:'+b[2]+'s;--dl:'+b[3]+'s">'+S.bat+'</div>';
      });
    }
    if(OPT.embers){
      var X=[2,4.5,7,10,90,93,95.5,98], i;
      for(i=0;i<X.length;i++){
        h+='<i class="hw-ember" style="left:'+X[i]+'%;--s:'+(3+(i%3))+'px;--d:'+(10+(i*1.7)%7)+'s;--dl:-'+(i*2.3)+'s;--x:'+((i%2?1:-1)*(14+i*3))+'px"></i>';
      }
    }
    box.innerHTML=h;
    document.body.appendChild(box);
    slots=[].slice.call(box.querySelectorAll('.hw-slot'));
    sync();
  }

  /* ---------- ตรวจว่าอยู่เมนูไหน แล้วเปลี่ยนพร็อบตามเมนู ---------- */
  var MAP={'ข่าวสาร':'news','สกิน':'skin','ไอเทม':'items','สินค้า':'shop'};
  function route(){
    var m=document.querySelector('main'),ti=document.getElementById('route-title');
    var txt=ti?ti.textContent.trim():'';
    return (m&&m.classList.contains('is-sub')&&MAP[txt])||'home';
  }
  function sync(){
    var r=route();
    root.setAttribute('data-hw-route',r);
    slots.forEach(function(s){
      var want=s.getAttribute('data-r');
      s.classList.toggle('hw-on',!want||want.split(' ').indexOf(r)>-1);
    });
  }
  function ready(){
    build();
    var m=document.querySelector('main'),ti=document.getElementById('route-title');
    if(window.MutationObserver){
      var mo=new MutationObserver(sync);
      if(m) mo.observe(m,{attributes:true,attributeFilter:['class']});
      if(ti) mo.observe(ti,{childList:true,characterData:true,subtree:true});
    }
  }
  if(document.body) ready(); else document.addEventListener('DOMContentLoaded',ready);

  /* เพิ่มพร็อบเองที่นี่ — ใช้ position:fixed + pointer-events:none จะไม่บังปุ่ม */
  // var el=document.createElement('div'); el.className='prop-bat'; el.textContent='🦇';
  // el.style.cssText='top:12px;right:16px;font-size:32px'; document.body.appendChild(el);
})();
