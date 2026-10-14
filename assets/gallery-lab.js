
(async()=>{
const base='../data/gallery-20261014/';const get=async n=>{const r=await fetch(base+n);if(!r.ok)throw Error(n+': '+r.status);return r.json()};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
try{
const [catalog,summary,assets,pl,cl,pc,cc]=await Promise.all(['catalog.json','catalog-summary.json','art-manifest.json','prefab-layout.json','cell-layout.json','prefab-components.json','cell-components.json'].map(get));
const names=['','Common','Cool','Rare','Epic','Legendary'];const $=id=>document.getElementById(id);
const matches=(r,query)=>{const m=query.match(/^(fish|level|row):(\d+)$/);if(m){const field={fish:'CollectFish',level:'LevelID',row:'RowId'}[m[1]];return r[field]===Number(m[2]);}return [r.RowId,r.LevelID,r.CollectFish,r.English,r.CollectFishName_Localization].join(' ').toLowerCase().includes(query);};
function render(){const L=Math.max(1,Number($('lab-level').value)||1),q=Number($('lab-quality').value),state=$('lab-state').value,query=$('lab-query').value.trim().toLowerCase();const open=catalog.filter(r=>r.LevelID<L);const unique=new Set(open.map(r=>r.CollectFish)).size;const next=catalog.find(r=>r.LevelID>=L);const rows=catalog.filter(r=>(!q||r.Quality===q)&&(state==='all'||state==='open'&&r.LevelID<L||state==='locked'&&r.LevelID>=L||state==='duplicate'&&r.duplicate_count>1)&&(!query||matches(r,query)));
$('lab-stats').innerHTML=`<span><b>Mô hình L${L}</b></span><span>${open.length}/418 ô mở</span><span>${unique}/386 mã riêng</span><span>Mốc tiếp: ${next?next.LevelID:'hết bảng'}</span><span>Đang lọc: ${rows.length} dòng</span>`;
$('lab-rows').innerHTML=rows.map(r=>{const asset=assets.find(a=>a.kind==='fish'&&a.source.endsWith(`/fish_${r.CollectFish}.png`));const url=asset?base+asset.file:'';return `<tr><td>#${r.RowId}<br>LevelID ${r.LevelID}</td><td>${url?`<a href="${esc(url)}"><img src="${esc(url)}" loading="lazy" alt="Sprite export fish ${r.CollectFish}"></a>`:'Thiếu asset'}</td><td>${esc(r.English)}<br><small>${esc(r.CollectFishName_Localization)}</small></td><td>${names[r.Quality]} (${r.Quality})</td><td>${r.CollectFish}<br>${r.duplicate_count>1?`${r.duplicate_count} dòng; mốc đầu ${r.earliest_level}`:'1 dòng'}</td><td class="${r.LevelID<L?'lab-open':'lab-locked'}">${r.LevelID<L?'MỞ':'KHÓA'} · mô hình</td></tr>`}).join('');}
['lab-level','lab-quality','lab-state','lab-query'].forEach(id=>$(id).addEventListener('input',render));render();
function art(){const kind=$('lab-art-kind').value,query=$('lab-art-query').value.toLowerCase();const rows=assets.filter(a=>(kind==='all'||a.kind===kind)&&a.source.toLowerCase().includes(query));$('lab-art').innerHTML=rows.map(a=>`<article><a href="${esc(base+a.file)}"><img src="${esc(base+a.file)}" loading="lazy" alt="${esc(a.source)}"></a><p><b>${esc(a.source.split('/').pop())}</b><br>${a.width}×${a.height} · ${a.mode}</p><small>${esc(a.usage)}</small><p><a href="${esc(base+a.file)}" download>Tải PNG gốc</a></p></article>`).join('');}
['lab-art-kind','lab-art-query'].forEach(id=>$(id).addEventListener('input',art));art();
const xy=o=>o?`${o.x}, ${o.y}`:'';
function layout(){const isCell=$('lab-prefab').value==='cell',ls=isCell?cl:pl,cs=isCell?cc:pc;$('lab-layout').innerHTML=ls.map(r=>`<tr><td>${esc(r.path)}</td><td>${xy(r.m_AnchoredPosition)}</td><td>${xy(r.m_SizeDelta)}</td><td>${xy(r.m_AnchorMin)} → ${xy(r.m_AnchorMax)}</td><td>${xy(r.m_Pivot)}</td></tr>`).join('');$('lab-components').innerHTML=cs.map(r=>`<details><summary>${esc(r.node)} · ${esc(r.script?.split('/').pop()||'Component')}</summary><pre>${esc(JSON.stringify(r.properties,null,2))}</pre></details>`).join('');}
$('lab-prefab').addEventListener('change',layout);layout();
$('lab-shot-tab').addEventListener('change',()=>{const tab=$('lab-shot-tab').value;document.querySelectorAll('#lab-shots figure').forEach(f=>f.hidden=tab!=='all'&&f.dataset.tab!==tab)});
window.galleryLabReady=true;
}catch(e){document.getElementById('lab-stats').textContent='Không tải được dữ liệu: '+e.message;window.galleryLabError=e.message;}
})();
