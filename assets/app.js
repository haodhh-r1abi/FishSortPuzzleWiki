
(function(){
  const root = window.SITE_ROOT || "";
  const q = document.getElementById("q"), res = document.getElementById("results");
  const strip = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D").toLowerCase();
  let idx = null, sel = -1;
  async function load(){ if(idx) return idx; try{ const r = await fetch(root+"assets/search.json"); idx = await r.json(); }catch(e){ idx = []; } return idx; }
  function render(items){ if(!items.length){ res.hidden = true; return; } res.innerHTML = items.map((it,i)=>`<a href="${root}${it.u}" class="${i===0?'sel':''}"><div>${it.t} <span class="r-c">· ${it.c}</span></div><div class="r-c">${it.g||''}</div></a>`).join(""); res.hidden = false; sel = 0; }
  if(q){
    q.addEventListener("input", async ()=>{ const v = strip(q.value.trim()); if(v.length<2){ res.hidden=true; return; } const ix = await load();
      const scored = ix.map(it=>{ let s=0; const t=strip(it.t), k=strip(it.k||""), g=strip(it.g||""); if(t.startsWith(v)) s+=10; if(t.includes(v)) s+=6; if(g.includes(v)) s+=3; if(k.includes(v)) s+=2; return [s,it]; }).filter(x=>x[0]>0).sort((a,b)=>b[0]-a[0]).slice(0,14).map(x=>x[1]);
      render(scored); });
    q.addEventListener("keydown", e=>{ const links = res.querySelectorAll("a"); if(e.key==="Escape"){ res.hidden=true; } if(!links.length||res.hidden) return; if(e.key==="ArrowDown"){ sel=Math.min(sel+1,links.length-1); } else if(e.key==="ArrowUp"){ sel=Math.max(sel-1,0); } else if(e.key==="Enter"){ e.preventDefault(); links[Math.max(sel,0)].click(); return; } else return; links.forEach((l,i)=>l.classList.toggle("sel",i===sel)); e.preventDefault(); });
    document.addEventListener("click", e=>{ if(!e.target.closest(".search")) res.hidden=true; });
    document.addEventListener("keydown", e=>{ if(e.key==="/" && document.activeElement!==q && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)){ e.preventDefault(); q.focus(); } });
  }
  const mb = document.getElementById("menuBtn"), sb = document.getElementById("sidebar");
  if(mb&&sb){ mb.addEventListener("click", ()=>sb.classList.toggle("open")); }
  // table filters
  document.querySelectorAll("input.filter[data-target]").forEach(inp=>{ const tb = document.querySelector("table."+inp.dataset.target+" tbody"); if(!tb) return;
    inp.addEventListener("input", ()=>{ const v = strip(inp.value); tb.querySelectorAll("tr").forEach(tr=>{ tr.style.display = !v || strip(tr.textContent).includes(v) ? "" : "none"; }); }); });
  // toggle all use cases
  document.querySelectorAll(".toggle-all").forEach(a=>a.addEventListener("click", e=>{ e.preventDefault(); const ds = document.querySelectorAll("details.uc"); const open = [...ds].some(d=>!d.open); ds.forEach(d=>d.open=open); }));
  // open use case from hash
  if(location.hash){ const el = document.getElementById(decodeURIComponent(location.hash.slice(1))); if(el && el.tagName==="DETAILS") el.open = true; }
  // levels table
  if(window.LOAD_LEVELS){ const box = document.getElementById("levels"), f = document.getElementById("lvfilter"); fetch(root+"data/levels.tsv").then(r=>r.text()).then(t=>{ const lines = t.split("\n").filter(Boolean); const h = lines[0].split("\t"); const rows = lines.slice(1).map(l=>l.split("\t"));
      let cur = rows; const draw = ()=>{ const lim = cur.slice(0,600); box.innerHTML = `<p class="muted">${cur.length} level (hiển thị tối đa 600)</p><table class="wt"><thead><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${lim.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`; };
      draw(); f.addEventListener("input", ()=>{ const v = f.value.trim().toLowerCase(); cur = !v ? rows : rows.filter(r=> r[1]===v || r.join("\t").toLowerCase().includes(v)); draw(); }); }).catch(()=>{ box.innerHTML = '<p class="muted">Không tải được levels.tsv (mở qua http:// hoặc GitHub Pages).</p>'; }); }
})();
