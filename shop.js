/* ===== shop.js : เมนูย่อยหน้า "สินค้า" =====
   แก้ชื่อปุ่ม/เพิ่ม-ลดหมวด: แก้ที่ตัวแปร CATS ด้านล่าง (k = รหัสภายใน อย่าซ้ำกัน, t = ชื่อที่แสดง)
   เมื่อกดปุ่ม เว็บจะส่งเหตุการณ์ 'shop-category' (detail = k) ไว้ผูกเนื้อหาภายหลัง
   หน้านี้เปิดเมื่อหัวข้อหน้าตรงกับข้อความ 'สินค้า' ใน index.html (ตัวแปร R) — ถ้าเปลี่ยนชื่อที่นั่น ต้องแก้ TITLE ที่นี่ด้วย
   ลบ 2 ไฟล์ (shop.css, shop.js) และ 2 บรรทัดที่โหลดใน index.html เว็บจะกลับเป็นเหมือนเดิม */
(function(){
  'use strict';
  var TITLE='สินค้า';
  var CATS=[
    {k:'all',t:'สินค้าทั้งหมด'},
    {k:'package',t:'แพ็กเกจ'},
    {k:'item',t:'ไอเทม'},
    {k:'vip',t:'VIP'}
  ];
  var main=document.querySelector('main'),title=document.getElementById('route-title');
  if(!main||!title)return;
  var nav=document.createElement('nav');
  nav.id='shop-submenu';nav.className='xsm';nav.setAttribute('aria-label','หมวดสินค้า');nav.hidden=true;
  var panel=document.createElement('div');panel.className='xsm-panel';nav.appendChild(panel);
  var btns=CATS.map(function(it,i){
    var b=document.createElement('button');b.type='button';b.className='xsm-btn';b.dataset.cat=it.k;b.textContent=it.t;
    b.setAttribute('aria-pressed',i===0?'true':'false');
    b.addEventListener('click',function(){select(it.k);});
    panel.appendChild(b);return b;
  });
  function select(k){
    btns.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.cat===k?'true':'false');});
    document.dispatchEvent(new CustomEvent('shop-category',{detail:k}));
  }
  main.appendChild(nav);
  var hdr=document.querySelector('header');
  function place(){
    var gap=Math.max(12,Math.min(30,window.innerHeight*.032)),off=0;
    if(hdr){var op=nav.offsetParent||main;off=hdr.getBoundingClientRect().bottom-op.getBoundingClientRect().top;if(!(off>0))off=0;}
    nav.style.top=(off+gap)+'px';
  }
  window.addEventListener('resize',place);
  function sync(){
    place();
    var on=main.classList.contains('is-sub')&&title.textContent.trim()===TITLE;
    if(nav.hidden===!on)return;
    nav.hidden=!on;
    if(on){nav.style.animation='none';void nav.offsetWidth;nav.style.animation='';}
  }
  new MutationObserver(sync).observe(main,{attributes:true,attributeFilter:['class']});
  new MutationObserver(sync).observe(title,{childList:true,characterData:true,subtree:true});
  sync();
})();
