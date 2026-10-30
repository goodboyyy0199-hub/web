/* ===== home.js : ตั้งค่าพื้นหลังหน้าแรก (คู่กับ home.css) =====
   - แก้รูป/ตำแหน่ง/จุดตัดขนาดจอที่ CONFIG ด้านล่างได้เลย ไม่ต้องแตะ index.html
   - สคริปต์นี้แค่ตั้งค่า CSS variable (--home-bg-image, --home-bg-pos) ที่ <html>
     ไม่แตะ DOM/เหตุการณ์ของระบบเดิม ถ้า JS ไม่ทำงาน home.css ยังมีค่าเริ่มต้นใช้ได้
   - ลบไฟล์นี้ (หรือบรรทัด <script src="home.js"> ใน index.html) = ใช้ค่าเริ่มต้นใน home.css */
(function(){
  var CONFIG={
    /* เลือกรูปตามจอ: ไล่จากบนลงล่าง ข้อแรกที่ตรงเงื่อนไขจะถูกใช้ (media = media query) */
    images:[
      {media:'(max-width:700px) and (min-aspect-ratio:16/9)',  src:'assets/home-bg-900.webp'},
      {media:'(max-width:1000px) and (min-aspect-ratio:16/9)', src:'assets/home-bg-1280.webp'}
    ],
    defaultImage:'assets/home-bg-1832.webp',
    /* จุดโฟกัสของรูป (x% y%) */
    position:'62% 55%',
    portraitPosition:'74% 50%'   /* จอแนวตั้ง (มือถือ) */
  };

  var root=document.documentElement,last='';
  function apply(){
    var src=CONFIG.defaultImage;
    for(var i=0;i<CONFIG.images.length;i++){
      if(window.matchMedia(CONFIG.images[i].media).matches){src=CONFIG.images[i].src;break;}
    }
    var pos=window.matchMedia('(max-aspect-ratio:1/1)').matches?CONFIG.portraitPosition:CONFIG.position;
    root.style.setProperty('--home-bg-position',pos);
    if(src===last)return;            /* ไม่เปลี่ยนรูปถ้าไฟล์เดิม */
    last=src;
    var img=new Image();             /* โหลดล่วงหน้า แล้วค่อยสลับ ไม่กระพริบ */
    img.onload=function(){if(last===src)root.style.setProperty('--home-bg-image','url("'+src+'")');};
    img.src=src;
  }
  var t;
  window.addEventListener('resize',function(){clearTimeout(t);t=setTimeout(apply,150);});
  apply();
})();
