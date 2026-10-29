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
  if(!on) return;
  document.documentElement.classList.add('halloween');

  /* ===== พร็อบฮาโลวีน (สร้างด้วย JS ทุกหน้า — เป็นชั้นลอย ไม่บังปุ่ม) ===== */
  function build(){
    if(document.getElementById('hw-root'))return;
    var web='<svg viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round"><path d="M0 0L100 0M0 0L0 100M0 0L90 55M0 0L55 90M0 0L100 28M0 0L28 100"/><path d="M18 0Q14 14 0 18M38 0Q30 30 0 38M60 0Q48 48 0 60M84 0Q66 66 0 84"/></svg>';
    var root=document.createElement('div');root.id='hw-root';
    root.innerHTML=
      '<div class="hw-tint"></div><div class="hw-vignette"></div>'+
      '<div class="hw-layer">'+
        '<div class="hw-fog"></div>'+
        '<div class="hw-web l">'+web+'</div><div class="hw-web r">'+web+'</div>'+
        '<div class="hw-spider"></div>'+
        '<div class="hw-bat b1" style="top:8%;--y:20px;--d:19s;--delay:0s">🦇</div>'+
        '<div class="hw-bat b2" style="top:18%;--y:-10px;--d:24s;--delay:-9s;--s:.8">🦇</div>'+
        '<div class="hw-bat b3" style="top:30%;--y:30px;--d:21s;--delay:-14s;--s:1.2">🦇</div>'+
        '<div class="hw-ghost">👻</div>'+
        '<div class="hw-pumpkin l">🎃</div><div class="hw-pumpkin r">🎃</div>'+
      '</div>';
    while(root.firstChild)document.body.appendChild(root.firstChild);
    root.remove();
  }
  if(document.body)build();else document.addEventListener('DOMContentLoaded',build);
})();
