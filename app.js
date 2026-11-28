const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const fmtDate=s=>{try{return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(`${s}T12:00:00Z`))}catch{return s}};
async function loadData(){
  const preview=localStorage.getItem('sa-preview-data');
  if(new URLSearchParams(location.search).has('preview')&&preview){try{return JSON.parse(preview)}catch{}}
  try{const r=await fetch('data/site-data.json',{cache:'no-store'});if(r.ok)return r.json();}catch{}
  if(window.SA_DEFAULT_DATA)return structuredClone(window.SA_DEFAULT_DATA);
  throw new Error('Newsletter data could not be loaded.');
}
function render(d){
  document.documentElement.style.setProperty('--navy',d.theme?.navy||'#10224b');
  document.documentElement.style.setProperty('--gold',d.theme?.gold||'#f1b719');
  $('#hero-eyebrow').textContent=d.hero.eyebrow; $('#hero-title').innerHTML=esc(d.hero.headline).replace(/Big hustle\.?/i,'<span class="accent">$&</span>');
  $('#hero-summary').textContent=d.hero.summary; $('#hero-image').src=d.hero.image;
  $('#feature-welcome').textContent=d.newsletter.welcome; $('#feature-thanks').textContent=d.newsletter.thanks;
  $('#footer-headline').textContent=d.footer.headline; $('#footer-tagline').textContent=d.footer.tagline; $('#footer-credit').textContent=d.footer.credit;
  const scoreCards=d.games.slice(0,2).map(g=>`<article class="score-card"><div class="score-meta"><span>${esc(fmtDate(g.date))}</span><span>${esc(g.status)}</span></div><div class="score-line"><span class="score-team">Eagles vs. ${esc(g.opponent)}</span><span class="score-value">${esc(g.teamScore)}–${esc(g.opponentScore)}</span></div></article>`);
  const next=d.schedule.find(x=>String(x.result).toLowerCase()==='upcoming')||d.schedule.at(-1);
  scoreCards.push(`<article class="score-card"><div class="score-meta"><span>Next game</span><span>${esc(next.location)}</span></div><div class="score-line"><span class="score-team">vs. ${esc(next.opponent)}</span><span class="score-value">${esc(next.time)}</span></div></article>`); $('#score-grid').innerHTML=scoreCards.join('');
  const stats=[['Season record',d.dashboard.record,'gold'],['Games played',d.dashboard.gamesPlayed,''],['Photo highlights',d.photos.length,''],['Next tip',d.dashboard.nextTip,'gold']];
  $('#dashboard').innerHTML=stats.map(([l,v,c])=>`<div class="stat-card ${c}"><span class="label">${esc(l)}</span><strong>${esc(v)}</strong></div>`).join('');
  $('#games-grid').innerHTML=d.games.map(g=>`<article class="game-card"><img src="${esc(g.featuredPhoto)}" alt=""><div class="game-body"><span class="chip">${esc(fmtDate(g.date))} • ${esc(g.status)}</span><div class="game-score">Eagles ${esc(g.teamScore)} — ${esc(g.opponentScore)} ${esc(g.opponent)}</div><h3>${esc(g.headline)}</h3><p>${esc(g.recap)}</p><ul class="highlights">${g.highlights.map(h=>`<li>${esc(h)}</li>`).join('')}</ul></div></article>`).join('');
  $('#schedule-body').innerHTML=d.schedule.map(g=>`<tr class="${String(g.result).toLowerCase()==='upcoming'?'upcoming':''}"><td>${esc(fmtDate(g.date))}</td><td><strong>${esc(g.opponent)}</strong></td><td>${esc(g.location)}</td><td>${esc(g.time)}</td><td><span class="chip ${String(g.result).toLowerCase()==='upcoming'?'gold':''}">${esc(g.result)}</span></td></tr>`).join('');
  const games=['All',...new Set(d.photos.map(p=>p.game))]; $('#gallery-controls').innerHTML=games.map((g,i)=>`<button class="filter-btn ${i===0?'active':''}" data-filter="${esc(g)}">${esc(g)}</button>`).join('');
  drawPhotos(d.photos); $$('.filter-btn').forEach(b=>b.onclick=()=>{$$('.filter-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');drawPhotos(b.dataset.filter==='All'?d.photos:d.photos.filter(p=>p.game===b.dataset.filter))});
  const s=d.spotlight; $('#spotlight-card').innerHTML=`<div class="spotlight-copy"><p class="eyebrow">${esc(s.kicker)}</p><h3>${esc(s.name)}</h3><p>${esc(s.body)}</p><div class="roster-pills">${s.names.map(n=>`<span>${esc(n)}</span>`).join('')}</div></div><img src="${esc(s.image)}" alt="St. Augustine third grade girls team">`;
  $('#announcement-grid').innerHTML=d.announcements.map(a=>`<article class="announcement-card"><span class="chip ${a.tag==='Next Game'?'gold':''}">${esc(a.tag)} • ${esc(fmtDate(a.date))}</span><h3>${esc(a.title)}</h3><p>${esc(a.body)}</p></article>`).join('');
}
function drawPhotos(photos){const grid=$('#gallery-grid');grid.innerHTML=photos.length?photos.map((p,i)=>`<button class="photo-card" data-i="${i}" data-src="${esc(p.src)}" data-alt="${esc(p.alt)}" data-caption="${esc(p.caption)}"><img src="${esc(p.src)}" alt="${esc(p.alt)}" loading="eager"><span class="photo-caption">${esc(p.caption)}</span></button>`).join(''):'<div class="empty">No approved photos in this gallery yet.</div>'; $$('.photo-card',grid).forEach(b=>b.onclick=()=>openLightbox(b.dataset.src,b.dataset.alt,b.dataset.caption));}
function openLightbox(src,alt,caption){const box=$('#lightbox');$('img',box).src=src;$('img',box).alt=alt;$('figcaption',box).textContent=caption;box.classList.add('open');document.body.style.overflow='hidden';}
function closeLightbox(){const box=$('#lightbox');box.classList.remove('open');document.body.style.overflow='';}
$('.lightbox-close').onclick=closeLightbox; $('#lightbox').onclick=e=>{if(e.target===e.currentTarget)closeLightbox()}; document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});
$('.nav-toggle').onclick=e=>{const n=$('.main-nav');n.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',n.classList.contains('open'))}; $$('.main-nav a').forEach(a=>a.onclick=()=>$('.main-nav').classList.remove('open'));
loadData().then(render).catch(e=>{console.error(e);document.body.insertAdjacentHTML('afterbegin',`<div style="padding:12px;background:#fee;color:#700;text-align:center">${esc(e.message)}</div>`)});
