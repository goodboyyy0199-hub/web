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

  /* ใส่พร็อบเพิ่มที่นี่ — ใช้ position:fixed + pointer-events:none จะไม่บังปุ่ม */
  // var el=document.createElement('div'); el.className='prop-bat'; el.textContent='🦇';
  // el.style.cssText='top:12px;right:16px;font-size:32px'; document.body.appendChild(el);
})();
