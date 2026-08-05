/* ============================================================
   Dashboard Portofolio — JavaScript bersama
   Sidebar, reveal, skill bars, monitor widget, typing, canvas
   ============================================================ */

/* ---------- sidebar mobile toggle ---------- */
function initSidebar(){
  const menuBtn = document.querySelector('.menu-btn');
  const sidebar = document.querySelector('.sidebar');
  if(menuBtn && sidebar){
    menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
}

/* ---------- reveal on scroll ---------- */
function initReveal(){
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  },{threshold:0.15});
  els.forEach(el=>obs.observe(el));
}

/* ---------- skill bars ---------- */
function initBars(){
  const bars = document.querySelectorAll('.bar-fill');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.style.width=e.target.dataset.w+'%'; obs.unobserve(e.target); }
    });
  },{threshold:0.4});
  bars.forEach(b=>obs.observe(b));
}

/* ---------- monitor widget live simulation ---------- */
function initMonitor(){
  const bars = document.querySelectorAll('.monitor-body .m-bar i');
  const vals = document.querySelectorAll('.monitor-body .m-val');
  const uptime = document.querySelector('.uptime-line .u-val');
  if(!bars.length) return;
  const targets = [18, 46, 62, 12]; // cpu, ram, disk, net
  const start = [8, 25, 55, 5];
  let seconds = 0;
  setInterval(()=>{
    for(let i=0;i<bars.length;i++){
      const v = Math.max(2, Math.min(98, start[i] + (Math.random()*targets[i])));
      bars[i].style.width = v+'%';
      if(vals[i]) vals[i].textContent = Math.round(v)+'%';
    }
    seconds++;
    if(uptime){
      const d = Math.floor(seconds/86400), h=Math.floor(seconds/3600)%24, m=Math.floor(seconds/60)%60, s=seconds%60;
      uptime.textContent = `${d}d ${h}h ${m}m ${s}s`;
    }
  }, 1800);
}

/* ---------- typing effect ---------- */
function initTyping(){
  const t = document.getElementById('typeTarget');
  if(!t) return;
  const phrases = ['ping google.com','systemctl status network','menjaga uptime 99.9%','mengamankan jaringan sekolah'];
  let p=0,c=0,del=false;
  (function loop(){
    const cur=phrases[p];
    if(!del){ c++; t.textContent=cur.slice(0,c); if(c===cur.length){del=true;return setTimeout(loop,1400);} }
    else{ c--; t.textContent=cur.slice(0,c); if(c===0){del=false;p=(p+1)%phrases.length;} }
    setTimeout(loop, del?35:65);
  })();
}

/* ---------- gallery filter + lightbox ---------- */
function initGallery(){
  const btns=document.querySelectorAll('.filter-btn');
  const items=document.querySelectorAll('.gal-item');
  const lb=document.getElementById('lightbox');
  if(!btns.length || !items.length) return;
  btns.forEach(b=>{
    b.addEventListener('click',()=>{
      btns.forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      const f=b.dataset.filter;
      items.forEach(it=>{ it.style.display=(f==='all'||it.dataset.cat===f)?'flex':'none'; });
    });
  });
  const lbImg=document.getElementById('lbImage'), lbT=document.getElementById('lbTitle'), lbD=document.getElementById('lbDesc');
  items.forEach(item=>{
    item.addEventListener('click',()=>{
      lbT.textContent=item.dataset.title;
      lbD.textContent=item.dataset.desc;
      const src=item.dataset.img;
      if(src){ lbImg.src=src; lbImg.style.display='block'; } else lbImg.style.display='none';
      lb.classList.add('open');
    });
  });
  const close=document.getElementById('lightboxClose');
  if(close) close.addEventListener('click',()=>lb.classList.remove('open'));
  lb.addEventListener('click',e=>{ if(e.target===lb) lb.classList.remove('open'); });
}

/* ---------- network canvas animation ---------- */
function initCanvas(){
  const canvas=document.getElementById('netCanvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  let w,h,nodes=[];
  function resize(){ w=canvas.width=canvas.offsetWidth; h=canvas.height=canvas.offsetHeight; }
  function build(){ const n=Math.max(20,Math.floor(w/70)); nodes=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.6+1})); }
  (function anim(){
    ctx.clearRect(0,0,w,h);
    nodes.forEach(n=>{ n.x+=n.vx; n.y+=n.vy; if(n.x<0||n.x>w)n.vx*=-1; if(n.y<0||n.y>h)n.vy*=-1; });
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
      const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<140){ ctx.strokeStyle=`rgba(73,227,209,${(1-d/140)*.35})`; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke(); }
    }
    nodes.forEach(n=>{ ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fillStyle='rgba(73,227,209,0.8)'; ctx.fill(); });
    requestAnimationFrame(anim);
  })();
  window.addEventListener('resize',()=>{resize();build();});
  resize(); build();
}

/* ---------- back to top ---------- */
function initBackTop(){
  const b=document.getElementById('backTop');
  if(b) b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

/* ---------- boot/init ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  initSidebar(); initReveal(); initBars(); initMonitor(); initTyping();
  initGallery(); initCanvas(); initBackTop();
});
