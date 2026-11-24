/* Moteur commun des mindmaps du module capacitaire (pages /capacitaire/<écrit>/, gabarit layouts/_default/mindmap-capa.html).
   Script d’origine conservé (dossier mindmaps-mf1/, supprimé depuis), les données (objet PAGE) sont dans assets/js/mindmaps/<écrit>.js.
   Seule adaptation : CSP du site (style-src 'self'), les styles calculés sont posés par le CSSOM (data-s → style.cssText),
   et non par des attributs style dans le HTML généré. */
{
const P=PAGE,C=P.cats;
const PAL=['#0e7490','#6d28d9','#c0392b','#1d4ed8','#d9480f','#0f766e','#a21caf','#475569','#b45309'];
C.forEach((c,i)=>{if(!c.col)c.col=PAL[i%PAL.length]});
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const $=id=>document.getElementById(id);
const poser=r=>r.querySelectorAll('[data-s]').forEach(e=>{e.style.cssText=e.dataset.s});
$('h1').textContent=P.title;$('sub').textContent=P.sub;
$('meta').innerHTML=(P.meta||[]).map(m=>`<span>${esc(m)}</span>`).join('');
$('q').placeholder=P.search||'Rechercher une notion…';
if(P.foot){$('footTitle').textContent=P.foot.title;$('footCards').innerHTML=P.foot.cards.map((c,i)=>`<div class="law" data-s="--c:${c.col||PAL[i%PAL.length]}"><h3>${esc(c.t)}</h3><p>${esc(c.p)}</p></div>`).join('');poser($('footCards'))}else{$('footTitle').remove();$('footCards').remove()}
$('note').textContent=P.note||'';
const all=[];C.forEach(c=>c.items.forEach(it=>{it.c=c;all.push(it)}));
const open=new Set(C.map(c=>c.id));
let cur=P.start||all[0].id,q='',quiz=false;
const map=$('map'),nodes=$('nodes'),svg=$('links'),panel=$('panel');
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const hit=it=>!q||norm(it.name+' '+(it.alt||'')+' '+(it.tags||[]).join(' ')+' '+JSON.stringify(it.s)+' '+(it.tip||'')).includes(q);
function tree(W){
  map.classList.remove('isList');
  const pad=4,rootW=Math.min(150,W*.19),catW=Math.min(210,W*.29),leafW=Math.min(290,W-rootW-catW-2*pad-60),gap=(W-2*pad-rootW-catW-leafW)/2;
  const rh=36,lh=30,ch=70,gb=18,xc=pad+rootW+gap,xl=xc+catW+gap;
  let y=0,h='',p='';const cats=[];
  C.forEach(c=>{const vis=open.has(c.id)?c.items:[];const bh=Math.max(vis.length*rh,ch);const cy=y+bh/2;cats.push(cy);
    h+=`<button class="node cat${c.items.some(hit)?'':' dim'}" data-cat="${c.id}" aria-expanded="${open.has(c.id)}" title="${esc(c.name+'\u00a0: '+c.law)}" data-s="left:${xc}px;top:${cy-ch/2}px;width:${catW}px;height:${ch}px;background:${c.col}"><b>${esc(c.name)}</b><small>${esc(c.law)}</small><span class="n">${open.has(c.id)?'−':'+'+c.items.length}</span></button>`;
    vis.forEach((it,i)=>{const ly=y+(bh-vis.length*rh)/2+i*rh+rh/2;
      h+=`<button class="node leaf${it.id===cur?' on':''}${hit(it)?'':' dim'}" data-leaf="${it.id}" title="${esc(it.name+(it.alt?'\u00a0: '+it.alt:''))}" data-s="--c:${c.col};left:${xl}px;top:${ly-lh/2}px;width:${leafW}px;height:${lh}px"><i></i><span>${esc(it.name)}</span></button>`;
      p+=`<path d="M${xc+catW} ${cy}C${xc+catW+gap/2} ${cy} ${xl-gap/2} ${ly} ${xl} ${ly}" stroke="${c.col}" stroke-width="2" fill="none" opacity="${hit(it)?.85:.2}"/>`;});
    y+=bh+gb;});
  const H=y-gb,ry=H/2,rH=72;
  h=`<div class="node root" data-s="left:${pad}px;top:${ry-rH/2}px;width:${rootW}px;height:${rH}px">${esc(P.root)}</div>`+h;
  C.forEach((c,i)=>{p=`<path d="M${pad+rootW} ${ry}C${pad+rootW+gap/2} ${ry} ${xc-gap/2} ${cats[i]} ${xc} ${cats[i]}" stroke="${c.col}" stroke-width="3" fill="none"/>`+p});
  map.style.height=H+'px';nodes.innerHTML=h;svg.innerHTML=p;poser(nodes);
}
function list(){
  map.classList.add('isList');svg.innerHTML='';
  nodes.innerHTML=C.map(c=>`<div class="grp" data-s="--c:${c.col}"><button data-cat="${c.id}" aria-expanded="${open.has(c.id)}"><span><b>${esc(c.name)}</b><small>${esc(c.law)}</small></span><span>${open.has(c.id)?'−':'+'+c.items.length}</span></button>${open.has(c.id)?`<div class="chips">${c.items.map(it=>`<button class="chip${it.id===cur?' on':''}${hit(it)?'':' dim'}" data-leaf="${it.id}">${esc(it.name)}</button>`).join('')}</div>`:''}</div>`).join('');
  poser(nodes);
}
function draw(){const W=map.clientWidth;W>=600?tree(W):list()}
function renderPanel(){
  const it=all.find(i=>i.id===cur),c=it.c,i=all.indexOf(it),pv=all[(i-1+all.length)%all.length],nx=all[(i+1)%all.length];
  const secs=Object.entries(it.s).map(([k,v])=>{const ul=`<ul>${v.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;return quiz?`<details class="sec"><summary>${esc(k)}</summary>${ul}</details>`:`<div class="sec"><h3>${esc(k)}</h3>${ul}</div>`}).join('');
  const tl=esc(P.tipLabel||'À l’examen');
  const tip=it.tip?(quiz?`<details class="tip"><summary><b>${tl}</b></summary><p>${esc(it.tip)}</p></details>`:`<div class="tip"><b>${tl}</b>${esc(it.tip)}</div>`):'';
  panel.style.setProperty('--c',c.col);panel.style.setProperty('--c2',c.col);
  panel.innerHTML=`<div class="ph"><div class="fam">${esc(c.name)}, ${esc(c.law)}</div><h2>${esc(it.name)}</h2><div class="tags">${it.alt?`<span>${esc(it.alt)}</span>`:''}${(it.tags||[]).map(t=>`<span>${esc(t)}</span>`).join('')}</div></div><div class="pb">${secs}${tip}</div><div class="nav"><button data-leaf="${pv.id}">← ${esc(pv.name)}</button><button data-leaf="${nx.id}">${esc(nx.name)} →</button></div>`;
}
function go(id,scroll){if(!all.some(i=>i.id===id))return;cur=id;open.add(all.find(i=>i.id===id).c.id);renderPanel();draw();if(scroll&&window.innerWidth<1000)panel.scrollIntoView({behavior:'smooth',block:'start'});try{history.replaceState(null,'','#'+id)}catch(e){}}
const onClick=e=>{const l=e.target.closest('[data-leaf]');if(l){go(l.dataset.leaf,e.currentTarget===nodes);return}const k=e.target.closest('[data-cat]');if(k){const id=k.dataset.cat;open.has(id)?open.delete(id):open.add(id);draw()}};
nodes.addEventListener('click',onClick);panel.addEventListener('click',onClick);
$('q').addEventListener('input',e=>{q=norm(e.target.value.trim());if(q)C.forEach(c=>{if(c.items.some(hit))open.add(c.id)});draw()});
$('openAll').addEventListener('click',()=>{C.forEach(c=>open.add(c.id));draw()});
$('closeAll').addEventListener('click',()=>{open.clear();draw()});
$('quiz').addEventListener('change',e=>{quiz=e.target.checked;renderPanel()});
window.addEventListener('hashchange',()=>go(location.hash.slice(1),false));
const h0=location.hash.slice(1);if(all.some(i=>i.id===h0))cur=h0;
renderPanel();draw();
const ro=new ResizeObserver(()=>draw());ro.observe(map);
}
