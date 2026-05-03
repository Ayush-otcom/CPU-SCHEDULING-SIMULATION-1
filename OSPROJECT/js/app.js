// ═══════════════════════════════════════
//  APP — UI Logic, Rendering, Simulation
// ═══════════════════════════════════════

const COLORS = [
  '#00d4ff','#00ffa3','#f59e0b','#ff4d6d','#a855f7',
  '#ec4899','#3b82f6','#84cc16','#f97316','#06b6d4',
  '#a855f7','#14b8a6','#e11d48','#65a30d','#0ea5e9',
  '#d946ef','#fb923c','#22d3ee','#4ade80','#facc15'
];
function getColor(i){return COLORS[i%COLORS.length];}

// ── ALGO SELECTOR ──
document.getElementById('algo-grid').addEventListener('click',e=>{
  const btn = e.target.closest('.algo-btn');
  if(!btn) return;
  document.querySelectorAll('.algo-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('quantum-row').style.display = btn.dataset.algo==='rr'?'flex':'none';
  const algoNames = {fcfs:'FCFS',sjf:'SJF',srtf:'SRTF',rr:'RR',priority:'PRIOR',priorityp:'P·PRIOR'};
  document.getElementById('sb-algo').textContent = algoNames[btn.dataset.algo]||btn.dataset.algo.toUpperCase();
});

// ── BUILD TABLE ──
function buildProcessTable(){
  const raw = parseInt(document.getElementById('proc-count-input').value);
  const errEl = document.getElementById('count-err');
  if(isNaN(raw)||raw<1||raw>20){
    errEl.textContent='Please enter a number between 1 and 20.';
    errEl.style.display='block'; return;
  }
  errEl.style.display='none';
  const tbody = document.getElementById('proc-input-body');
  tbody.innerHTML='';
  for(let i=0;i<raw;i++){
    const c = getColor(i);
    const tr = document.createElement('tr');
    tr.innerHTML=`
      <td><span class="pid-label" style="background:${c}20;color:${c};border:1px solid ${c}44">P${i+1}</span></td>
      <td><input class="proc-input" type="number" id="at-${i}" placeholder="0" min="0"></td>
      <td><input class="proc-input" type="number" id="bt-${i}" placeholder="1" min="1"></td>
      <td><input class="proc-input" type="number" id="pr-${i}" placeholder="1" min="1"></td>`;
    tbody.appendChild(tr);
    tr.querySelectorAll('input').forEach(inp=>{
      inp.addEventListener('focus',()=>tr.style.background='rgba(0,212,255,0.025)');
      inp.addEventListener('blur',()=>tr.style.background='');
      inp.addEventListener('input',()=>inp.classList.remove('invalid'));
      inp.addEventListener('keydown',e=>{
        if(e.key==='Enter'){
          const all=Array.from(document.querySelectorAll('.proc-input'));
          const idx=all.indexOf(inp);
          if(idx<all.length-1) all[idx+1].focus();
        }
      });
    });
  }
  document.getElementById('proc-input-card').style.display='block';
  document.getElementById('run-section').style.display='block';
  document.getElementById('results').style.display='none';
  setTimeout(()=>document.getElementById('proc-input-card').scrollIntoView({behavior:'smooth',block:'start'}),60);
}

// ── DEMO FILL ──
function fillDemo(){
  const n = parseInt(document.getElementById('proc-count-input').value)||0;
  const demo=[
    {at:0,bt:6,pr:3},{at:1,bt:4,pr:1},{at:2,bt:2,pr:4},
    {at:3,bt:5,pr:2},{at:4,bt:3,pr:1},{at:0,bt:7,pr:2},
    {at:1,bt:3,pr:3},{at:5,bt:2,pr:1},{at:6,bt:4,pr:4},
    {at:2,bt:5,pr:2},{at:0,bt:1,pr:5},{at:3,bt:8,pr:1},
    {at:4,bt:3,pr:2},{at:6,bt:2,pr:3},{at:7,bt:4,pr:1},
    {at:1,bt:6,pr:2},{at:2,bt:2,pr:4},{at:5,bt:3,pr:1},
    {at:0,bt:9,pr:3},{at:8,bt:2,pr:2}
  ];
  for(let i=0;i<n;i++){
    const d=demo[i%demo.length];
    const atEl=document.getElementById(`at-${i}`);
    const btEl=document.getElementById(`bt-${i}`);
    const prEl=document.getElementById(`pr-${i}`);
    if(atEl){atEl.value=d.at;atEl.classList.remove('invalid');}
    if(btEl){btEl.value=d.bt;btEl.classList.remove('invalid');}
    if(prEl){prEl.value=d.pr;prEl.classList.remove('invalid');}
  }
}

function clearInputs(){
  const n=parseInt(document.getElementById('proc-count-input').value)||0;
  for(let i=0;i<n;i++){
    ['at','bt','pr'].forEach(f=>{
      const el=document.getElementById(`${f}-${i}`);
      if(el){el.value='';el.classList.remove('invalid');}
    });
  }
}

function collectProcesses(){
  const n=parseInt(document.getElementById('proc-count-input').value)||0;
  const processes=[];let valid=true;
  document.querySelectorAll('.proc-input').forEach(el=>el.classList.remove('invalid'));
  for(let i=0;i<n;i++){
    const atEl=document.getElementById(`at-${i}`);
    const btEl=document.getElementById(`bt-${i}`);
    const prEl=document.getElementById(`pr-${i}`);
    const at=parseInt(atEl?.value??'');
    const bt=parseInt(btEl?.value??'');
    const pr=parseInt(prEl?.value??'');
    let rowOk=true;
    if(isNaN(at)||at<0){atEl?.classList.add('invalid');rowOk=false;}
    if(isNaN(bt)||bt<1){btEl?.classList.add('invalid');rowOk=false;}
    if(isNaN(pr)||pr<1){prEl?.classList.add('invalid');rowOk=false;}
    if(!rowOk){valid=false;continue;}
    processes.push({pid:'P'+(i+1),at,bt,pr,color:getColor(i)});
  }
  return valid?processes:null;
}

// ── GANTT RENDERING ──
function renderGantt(tl,procs){
  if(!tl.length) return;
  const endT=Math.max(...tl.map(s=>s.end));
  const pidMap={};procs.forEach((p,i)=>pidMap[p.pid]=i);
  const rowH=44,rowGap=7,labelW=52,tickH=26,topPad=12;
  const nRows=procs.length;
  const minPPT=34;
  const totalW=Math.max(760,endT*minPPT+labelW+44);
  const colW=(totalW-labelW-44)/endT;
  const svgH=topPad+nRows*(rowH+rowGap)+tickH+18;

  const svg=document.getElementById('gantt-svg');
  svg.setAttribute('viewBox',`0 0 ${totalW} ${svgH}`);
  svg.setAttribute('width',totalW);
  svg.setAttribute('height',svgH);

  let html='';

  // Row backgrounds
  procs.forEach((p,i)=>{
    const y=topPad+i*(rowH+rowGap);
    html+=`<rect x="0" y="${y}" width="${totalW}" height="${rowH}" rx="7" fill="${i%2===0?'rgba(0,212,255,0.016)':'rgba(0,0,0,0.08)'}"/>`;
  });

  // Grid lines + ticks
  for(let t2=0;t2<=endT;t2++){
    const x=labelW+t2*colW;
    html+=`<line x1="${x}" y1="${topPad}" x2="${x}" y2="${topPad+nRows*(rowH+rowGap)-rowGap}" stroke="rgba(0,212,255,0.07)" stroke-width="0.6"/>`;
    const show=t2===0||t2===endT||endT<=30||(t2%Math.ceil(endT/25)===0);
    if(show){
      html+=`<text x="${x}" y="${svgH-5}" text-anchor="middle" font-size="9" fill="#2e4a6a" font-family="JetBrains Mono,monospace">${t2}</text>`;
      html+=`<line x1="${x}" y1="${topPad+nRows*(rowH+rowGap)-rowGap}" x2="${x}" y2="${svgH-19}" stroke="rgba(0,212,255,0.18)" stroke-width="0.6"/>`;
    }
  }

  // Bars
  tl.forEach(seg=>{
    const row=pidMap[seg.pid]??0;
    const x=labelW+seg.start*colW;
    const w=(seg.end-seg.start)*colW;
    const y=topPad+row*(rowH+rowGap);
    const dur=seg.end-seg.start;
    const c=seg.color;
    // Glow
    html+=`<rect x="${x+1}" y="${y+5}" width="${w-2}" height="${rowH-10}" rx="7" fill="${c}" opacity="0.16"/>`;
    // Bar
    html+=`<rect x="${x+2}" y="${y+6}" width="${w-4}" height="${rowH-12}" rx="6" fill="${c}" opacity="0.78"/>`;
    // Top shine
    html+=`<rect x="${x+2}" y="${y+6}" width="${w-4}" height="6" rx="4" fill="rgba(255,255,255,0.22)"/>`;
    // Bottom highlight
    html+=`<rect x="${x+2}" y="${y+rowH-10}" width="${w-4}" height="3" rx="2" fill="rgba(0,0,0,0.18)"/>`;
    if(w>20){
      const fs=w>60?11:9;
      const lbl=w>45&&dur>1?`${seg.pid}(${dur})`:seg.pid;
      html+=`<text x="${x+w/2}" y="${y+rowH/2+5}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="rgba(0,0,0,0.88)" font-family="Orbitron,monospace">${lbl}</text>`;
    }
  });

  // Row labels
  procs.forEach((p,i)=>{
    const y=topPad+i*(rowH+rowGap)+rowH/2+5;
    html+=`<text x="${labelW-10}" y="${y}" text-anchor="end" font-size="11" font-weight="700" fill="${p.color}" font-family="Orbitron,monospace">${p.pid}</text>`;
  });

  svg.innerHTML=html;

  document.getElementById('gantt-legend').innerHTML=procs.map(p=>
    `<div class="legend-item">
      <div class="legend-dot" style="background:${p.color}"></div>
      ${p.pid}: AT=${p.at} BT=${p.bt} P=${p.pr}
    </div>`
  ).join('');
}

// ── METRICS RENDERING ──
function renderMetrics(metrics){
  const n=metrics.length;
  const avgTat=(metrics.reduce((s,m)=>s+m.tat,0)/n).toFixed(2);
  const avgWt=(metrics.reduce((s,m)=>s+m.wt,0)/n).toFixed(2);
  const avgRt=(metrics.reduce((s,m)=>s+m.rt,0)/n).toFixed(2);
  const maxCt=Math.max(...metrics.map(m=>m.completion));
  const busy=metrics.reduce((s,m)=>s+m.bt,0);
  const util=((busy/maxCt)*100).toFixed(1);
  const thru=(n/maxCt).toFixed(3);

  document.getElementById('metrics-grid').innerHTML=`
    <div class="mcard"><div class="ml">Avg Waiting</div><div class="mv">${avgWt}</div><div class="mu">time units</div></div>
    <div class="mcard"><div class="ml">Avg Turnaround</div><div class="mv">${avgTat}</div><div class="mu">time units</div></div>
    <div class="mcard"><div class="ml">Avg Response</div><div class="mv">${avgRt}</div><div class="mu">time units</div></div>
    <div class="mcard" style="border-color:rgba(0,255,163,0.22)"><div class="ml">CPU Utilization</div><div class="mv" style="color:#00ffa3">${util}%</div><div class="mu">efficiency</div></div>
    <div class="mcard"><div class="ml">Total Duration</div><div class="mv">${maxCt}</div><div class="mu">time units</div></div>
    <div class="mcard"><div class="ml">Throughput</div><div class="mv">${thru}</div><div class="mu">proc / unit</div></div>`;
}

// ── RESULT TABLE RENDERING ──
function renderResultTable(metrics){
  const minWt=Math.min(...metrics.map(m=>m.wt));
  const maxWt=Math.max(...metrics.map(m=>m.wt));
  document.getElementById('result-body').innerHTML=metrics.map(m=>`
    <tr>
      <td><span class="pid-label" style="background:${m.color}20;color:${m.color};border:1px solid ${m.color}44">${m.pid}</span></td>
      <td>${m.at}</td><td>${m.bt}</td><td>${m.pr}</td>
      <td>${m.completion}</td><td>${m.tat}</td>
      <td class="${m.wt===minWt?'best':m.wt===maxWt&&minWt!==maxWt?'worst':''}">${m.wt}</td>
      <td>${m.rt}</td>
    </tr>`).join('');
}

// ── SIMULATE (main entry point) ──
function simulate(){
  const errEl=document.getElementById('proc-input-err');
  errEl.style.display='none';
  const processes=collectProcesses();
  if(!processes){
    // errEl.textContent='Fix highlighted fields before running.';
    errEl.textContent='Invalid input detected. Please correct highlighted fields (Arrival ≥ 0, Burst ≥ 1, Priority ≥ 1).';
    errEl.style.display='block';
    document.getElementById('proc-input-card').scrollIntoView({behavior:'smooth'});
    return;
  }
  if(!processes.length){
    errEl.textContent='No valid processes found.';
    errEl.style.display='block';
    return;
  }

  const algo=document.querySelector('.algo-btn.active').dataset.algo;
  const q=Math.max(1,parseInt(document.getElementById('quantum').value)||2);
  const names={
    fcfs:'FCFS — First Come First Served',
    sjf:'SJF — Shortest Job First (Non-Preemptive)',
    srtf:'SRTF — Shortest Remaining Time First (Preemptive)',
    rr:`Round Robin  (Quantum = ${q})`,
    priority:'Priority Scheduling (Non-Preemptive)',
    priorityp:'Priority Scheduling (Preemptive)'
  };

  let tl;
  if     (algo==='fcfs')     tl=schedFCFS(processes);
  else if(algo==='sjf')      tl=schedSJF(processes);
  else if(algo==='srtf')     tl=schedSRTF(processes);
  else if(algo==='rr')       tl=schedRR(processes,q);
  else if(algo==='priority') tl=schedPriority(processes);
  else                       tl=schedPriorityP(processes);

  const metrics=computeMetrics(processes,tl);

  document.getElementById('result-algo-label').innerHTML=
    `◆ Gantt Chart <div class="ct-line"></div> <span style="color:var(--text2);font-size:9px;font-family:var(--mono);letter-spacing:1px">${names[algo]}</span>`;

  renderGantt(tl,processes);
  renderMetrics(metrics);
  renderResultTable(metrics);

  const res=document.getElementById('results');
  res.style.display='block';
  setTimeout(()=>res.scrollIntoView({behavior:'smooth',block:'start'}),60);
}
