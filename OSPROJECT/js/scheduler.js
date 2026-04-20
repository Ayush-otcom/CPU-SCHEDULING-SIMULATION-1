// ═══════════════════════════════════════
//  CPU SCHEDULING ALGORITHMS
// ═══════════════════════════════════════

// ── FCFS ──
function schedFCFS(procs){
  const ps=[...procs].sort((a,b)=>a.at-b.at);
  const tl=[];let t=0;
  for(const p of ps){
    if(t<p.at) t=p.at;
    tl.push({pid:p.pid,start:t,end:t+p.bt,color:p.color});
    t+=p.bt;
  }
  return tl;
}

// ── SJF (Non-Preemptive) ──
function schedSJF(procs){
  const ps=procs.map(p=>({...p})).sort((a,b)=>a.at-b.at);
  const tl=[];let t=0;const done=new Set();
  while(done.size<ps.length){
    const av=ps.filter(p=>!done.has(p.pid)&&p.at<=t);
    if(!av.length){t=Math.min(...ps.filter(p=>!done.has(p.pid)).map(p=>p.at));continue;}
    av.sort((a,b)=>a.bt-b.bt||a.at-b.at);
    const p=av[0];
    tl.push({pid:p.pid,start:t,end:t+p.bt,color:p.color});
    t+=p.bt;done.add(p.pid);
  }
  return tl;
}

// ── SRTF (Preemptive SJF) ──
function schedSRTF(procs){
  const ps=procs.map(p=>({...p,rem:p.bt}));
  const tl=[];let t=0;let last=null;let ls=0;
  const maxT=Math.max(...procs.map(p=>p.at))+procs.reduce((s,p)=>s+p.bt,0)+2;
  while(t<=maxT){
    const av=ps.filter(p=>p.at<=t&&p.rem>0);
    if(!av.length){
      if(ps.every(p=>p.rem===0)) break;
      if(last){tl.push({pid:last.pid,start:ls,end:t,color:last.color});last=null;}
      t++;continue;
    }
    av.sort((a,b)=>a.rem-b.rem||a.at-b.at);
    const cur=av[0];
    if(!last){last=cur;ls=t;}
    else if(last.pid!==cur.pid){tl.push({pid:last.pid,start:ls,end:t,color:last.color});last=cur;ls=t;}
    cur.rem--;t++;
    if(cur.rem===0){tl.push({pid:last.pid,start:ls,end:t,color:last.color});last=null;}
  }
  if(last) tl.push({pid:last.pid,start:ls,end:t,color:last.color});
  return mergeTL(tl);
}

// ── Round Robin ──
function schedRR(procs,q){
  const ps=procs.map(p=>({...p,rem:p.bt})).sort((a,b)=>a.at-b.at);
  const tl=[];let t=0;const queue=[];let idx=0;const seen=new Set();
  if(ps.length&&ps[0].at===0){queue.push(ps[0]);seen.add(ps[0].pid);idx=1;}
  const limit=procs.reduce((s,p)=>s+p.bt,0)*4+500;let iter=0;
  while((queue.length>0||idx<ps.length)&&iter++<limit){
    if(!queue.length){
      t=ps[idx].at;
      while(idx<ps.length&&ps[idx].at<=t){
        if(!seen.has(ps[idx].pid)){queue.push(ps[idx]);seen.add(ps[idx].pid);}
        idx++;
      }
      if(!queue.length){t++;continue;}
    }
    const p=queue.shift();
    const run=Math.min(q,p.rem);
    tl.push({pid:p.pid,start:t,end:t+run,color:p.color});
    t+=run;p.rem-=run;
    while(idx<ps.length&&ps[idx].at<=t){
      if(!seen.has(ps[idx].pid)){queue.push(ps[idx]);seen.add(ps[idx].pid);}
      idx++;
    }
    if(p.rem>0) queue.push(p);
  }
  return mergeTL(tl);
}

// ── Priority (Non-Preemptive) ──
function schedPriority(procs){
  const ps=procs.map(p=>({...p})).sort((a,b)=>a.at-b.at);
  const tl=[];let t=0;const done=new Set();
  while(done.size<ps.length){
    const av=ps.filter(p=>!done.has(p.pid)&&p.at<=t);
    if(!av.length){t=Math.min(...ps.filter(p=>!done.has(p.pid)).map(p=>p.at));continue;}
    av.sort((a,b)=>a.pr-b.pr||a.at-b.at);
    const p=av[0];
    tl.push({pid:p.pid,start:t,end:t+p.bt,color:p.color});
    t+=p.bt;done.add(p.pid);
  }
  return tl;
}

// ── Priority (Preemptive) ──
function schedPriorityP(procs){
  const ps=procs.map(p=>({...p,rem:p.bt}));
  const tl=[];let t=0;let last=null;let ls=0;
  const maxT=Math.max(...procs.map(p=>p.at))+procs.reduce((s,p)=>s+p.bt,0)+2;
  while(t<=maxT){
    const av=ps.filter(p=>p.at<=t&&p.rem>0);
    if(!av.length){
      if(ps.every(p=>p.rem===0)) break;
      if(last){tl.push({pid:last.pid,start:ls,end:t,color:last.color});last=null;}
      t++;continue;
    }
    av.sort((a,b)=>a.pr-b.pr||a.at-b.at);
    const cur=av[0];
    if(!last){last=cur;ls=t;}
    else if(last.pid!==cur.pid){tl.push({pid:last.pid,start:ls,end:t,color:last.color});last=cur;ls=t;}
    cur.rem--;t++;
    if(cur.rem===0){tl.push({pid:last.pid,start:ls,end:t,color:last.color});last=null;}
  }
  if(last) tl.push({pid:last.pid,start:ls,end:t,color:last.color});
  return mergeTL(tl);
}

// ── Merge adjacent same-PID timeline segments ──
function mergeTL(tl){
  if(!tl.length) return tl;
  const res=[{...tl[0]}];
  for(let i=1;i<tl.length;i++){
    const last=res[res.length-1];
    if(last.pid===tl[i].pid&&last.end===tl[i].start) last.end=tl[i].end;
    else res.push({...tl[i]});
  }
  return res;
}

// ── Compute per-process metrics from timeline ──
function computeMetrics(procs,tl){
  return procs.map(p=>{
    const segs=tl.filter(s=>s.pid===p.pid);
    if(!segs.length) return null;
    const completion=Math.max(...segs.map(s=>s.end));
    const firstStart=Math.min(...segs.map(s=>s.start));
    const tat=completion-p.at;
    const wt=tat-p.bt;
    const rt=firstStart-p.at;
    return{...p,completion,tat,wt,rt};
  }).filter(Boolean);
}
