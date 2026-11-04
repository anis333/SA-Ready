/* SA-Ready · Oberfläche
   Navigation (Tabs, Seiten, Zurück-Taste), Runden, Ergebnis, Notizen, Fortschritt und Ton.
   Fortschritt und Notizen liegen im Browser-Speicher dieses Geräts (localStorage). */
'use strict';

/* =================== Speicher & Zustand =================== */
const TOPIC_UI={gl:{ico:'x=',col:'#E8603C'},pot:{ico:'10ⁿ',col:'#2F6FEB'},ein:{ico:'mm',col:'#7A55E0'},win:{ico:'∠',col:'#D08A00'}};
const LS={prog:'sar-prog',notes:'sar-notes',ui:'sar-ui',sound:'sar-sound',lang:'sar-lang'};
const store={
  get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
};
const ROOT={ueben:'home',grund:'list',notiz:'list',fort:'list'};
const S={tab:'ueben',page:'home',topic:'gl',mode:'n',view:'tabs',lastTopic:'gl',
  lv:0,qs:[],i:0,score:0,correct:0,streak:0,maxStreak:0,tip:false,done:false,last:null,results:[],wrong:[],ex:1,
  quitArm:null,popArm:null,ignorePop:false};
(()=>{const u=store.get(LS.ui,{})||{};
  if(TOPICS.some(t=>t.id===u.topic)){S.topic=u.topic;S.lastTopic=u.topic;}
  if(u.mode==='n'||u.mode==='h')S.mode=u.mode;})();
function saveUI(){store.set(LS.ui,{topic:S.lastTopic,mode:S.mode});}
let prog=store.get(LS.prog,{})||{};
function saveProg(){store.set(LS.prog,prog);}
const pkey=(t,l,m)=>`${t}:${l}:${m}`;
const lvStars=(t,l,m)=>(prog[pkey(t,l,m)]||{}).stars||0;
const lvBest=(t,l,m)=>(prog[pkey(t,l,m)]||{}).best||0;
function starsFor(tid,m){return TOPIC(tid).levels.reduce((s,_,i)=>s+lvStars(tid,i+1,m),0);}
const totalStars=()=>TOPICS.reduce((s,t)=>s+starsFor(t.id,'n')+starsFor(t.id,'h'),0);
const maxStars=()=>TOPICS.reduce((s,t)=>s+t.levels.length*6,0);

/* =================== Ton =================== */
let soundOn=store.get(LS.sound,true)!==false,actx=null;
function tone(ok){
  if(!soundOn)return;
  try{
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
    if(!actx)actx=new AC();
    if(actx.state==='suspended')actx.resume();
    const t0=actx.currentTime+0.02,out=actx.createGain();
    out.gain.value=ok?0.22:0.16;
    if(ok){
      out.connect(actx.destination);
      [[880,0,0.14],[1318.5,0.1,0.22]].forEach(([f,d,len])=>{
        const o=actx.createOscillator(),g=actx.createGain();
        o.type='sine';o.frequency.value=f;
        g.gain.setValueAtTime(0.0001,t0+d);
        g.gain.exponentialRampToValueAtTime(1,t0+d+0.008);
        g.gain.exponentialRampToValueAtTime(0.0001,t0+d+len);
        o.connect(g).connect(out);o.start(t0+d);o.stop(t0+d+len+0.02);
      });
    }else{
      const lp=actx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=700;
      out.connect(lp).connect(actx.destination);
      [150,156].forEach(f=>{
        const o=actx.createOscillator(),g=actx.createGain();
        o.type='sawtooth';o.frequency.setValueAtTime(f,t0);o.frequency.linearRampToValueAtTime(f*0.85,t0+0.3);
        g.gain.setValueAtTime(0.0001,t0);
        g.gain.exponentialRampToValueAtTime(1,t0+0.012);
        g.gain.setValueAtTime(1,t0+0.2);
        g.gain.exponentialRampToValueAtTime(0.0001,t0+0.32);
        o.connect(g).connect(out);o.start(t0);o.stop(t0+0.35);
      });
    }
  }catch(e){}
}

/* =================== Hilfsfunktionen =================== */
const scr=$('#screen');
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
const dv=s=>EN?String(s).replace(/(^|\s):(?=\s|$)/g,'$1÷'):String(s);
function mk(s){return esc(dv(s)).replace(/\^\{([^}]*)\}/g,'<sup>$1</sup>');}
function mkQ(s){return mk(s).replace(/\?/g,'<span class="var">?</span>');}
function eqX(s){return mk(s).replace(/x/g,'<span class="var">x</span>');}
function eqF(s,t){return mk(s).replace(/[A-Za-zΔ][A-Za-z0-9]*|[α-ω]/g,m=>m===t?`<span class="var">${m}</span>`:m);}
function fxFor(q){return q.mode==='x'?eqX:q.mode==='formula'?(s=>eqF(s,q.target)):mkQ;}
function starsTxt(n){return `<span class="st" role="img" aria-label="${n} ${Lg('von','of')} 3 ${Lg('Sternen','stars')}">${'★'.repeat(n)}<i>${'★'.repeat(3-n)}</i></span>`;}
function stepsHTML(rs,fx,fin=true){
  return `<div class="steps">`+rs.map((r,i)=>`<div class="step${fin&&i===rs.length-1?' final':''}"><span class="eq">${fx(r.eq)}</span>${r.op?`<span class="op">${esc(dv(r.op))}</span>`:''}${r.note?`<span class="note">${mk(r.note)}</span>`:''}</div>`).join('')+`</div>`;
}
const SR=(r,fx=mkQ,fin=true)=>stepsHTML(rows(r),fx,fin);
const KV=(list,cls='')=>`<div class="kv ${cls}">`+list.map(it=>`<div>${it.map(s=>`<span>${mk(s)}</span>`).join('')}</div>`).join('')+`</div>`;
function ring(frac,size=24){
  const w=size>40?6:3,r=(size-w)/2,c=2*Math.PI*r,h=size/2;
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle class="ring-t" cx="${h}" cy="${h}" r="${r}"/>${frac>0?`<circle class="ring-f" cx="${h}" cy="${h}" r="${r}" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${(c*(1-Math.min(1,frac))).toFixed(2)}" transform="rotate(-90 ${h} ${h})"/>`:''}</svg>`;
}
function sndSVG(on){
  const sp='<path d="M4 9.5v5h3.5l4.5 4v-13l-4.5 4z"/>';
  return `<svg viewBox="0 0 24 24">${sp}${on?'<path d="M15.5 9.2a4 4 0 0 1 0 5.6"/><path d="M18 6.6a7.5 7.5 0 0 1 0 10.8"/>':'<path d="M16 9.5l5 5M21 9.5l-5 5"/>'}</svg>`;
}
function icoHTML(tid,big){const u=TOPIC_UI[tid];return `<span class="ico${big?' big':''}" style="background:${u.col}" aria-hidden="true">${u.ico}</span>`;}
function navbar(backLabel,act,title='',right=''){
  return `<nav class="navbar"><button class="back" data-act="${act}"><span aria-hidden="true">‹</span>${esc(backLabel)}</button><b class="ntitle">${esc(title)}</b><span class="nright">${right}</span></nav>`;
}
function segHTML(){
  const h=S.mode==='h';
  return `<div class="segc" role="radiogroup" aria-label="${Lg('Schwierigkeit','Difficulty')}"><button role="radio" aria-checked="${!h}" data-act="mode" data-mode="n">Normal</button><button role="radio" aria-checked="${h}" data-act="mode" data-mode="h">${Lg('Schwer','Hard')}</button></div>
  <p class="foot">${h?Lg('Schwer: negative Zahlen, Kommazahlen, mehr Schritte. Mehr Punkte pro Aufgabe.','Hard: negative numbers, decimals, more steps. More points per question.'):Lg('Normal: klare Zahlen, Schritt für Schritt.','Normal: clear numbers, step by step.')}</p>`;
}
function toTop(){try{window.scrollTo({top:0});}catch(e){}}
let toastT=null;
function toast(msg){const t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true;},2600);}
function suggested(tid){
  const ss=TOPIC(tid).levels.map((_,i)=>lvStars(tid,i+1,S.mode));
  let k=ss.findIndex(s=>s===0);if(k<0)k=ss.findIndex(s=>s<3);return k;
}

/* =================== Seiten =================== */
function langRow(){
  const g='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.5 2.4 3.8 5.2 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.2-3.8-8.5S9.5 5.9 12 3.5z"/></svg>';
  return `<div class="row"><span class="ico snd" aria-hidden="true">${g}</span><div class="segc lang" role="radiogroup" aria-label="Sprache / Language"><button role="radio" aria-checked="${!EN}" data-act="lang" data-lang="de">Deutsch</button><button role="radio" aria-checked="${EN}" data-act="lang" data-lang="en">English</button></div></div>`;
}
function renderHome(){
  const tot=totalStars(),max=maxStars();
  const order=[S.lastTopic,...TOPICS.map(t=>t.id).filter(id=>id!==S.lastTopic)];
  let c=null;for(const id of order){const k=suggested(id);if(k>=0){c={tid:id,lv:k+1};break;}}
  const cont=c?(()=>{const T=TOPIC(c.tid),L=T.levels[c.lv-1];
      return `<button class="cont" data-act="start-at" data-topic="${c.tid}" data-lv="${c.lv}"><span class="t"><small>${Lg('Weitermachen','Continue')}${S.mode==='h'?' · '+Lg('Schwer','Hard'):''}</small><b>${esc(L.name)}</b><span>${esc(T.tab)} · Level ${c.lv}</span></span><span class="play" aria-hidden="true"></span></button>`;})()
    :`<div class="cont done"><span class="t"><small>${Lg('Alles geschafft','All done')}</small><b>${Lg('Jedes Level hat 3 Sterne','Every level has 3 stars')}</b><span>${S.mode==='n'?Lg('Probier den Modus Schwer.','Try Hard mode.'):Lg('Stark gerechnet!','Great job!')}</span></span></div>`;
  scr.innerHTML=`<header class="lt-head"><h1 class="lt">SA-Ready</h1><p class="lt-sub">★ ${tot} ${Lg('von','of')} ${max} ${Lg('Sternen','stars')}</p></header>
  ${segHTML()}
  ${cont}
  <h2 class="sh">${Lg('Themen','Topics')}</h2>
  <div class="group ind">${TOPICS.map(t=>{
    const n=t.levels.length,ss=t.levels.map((_,i)=>lvStars(t.id,i+1,S.mode)),done=ss.filter(s=>s>0).length,sum=ss.reduce((a,b)=>a+b,0);
    return `<button class="row" data-act="open-topic" data-topic="${t.id}">${icoHTML(t.id)}<span class="t"><b>${esc(t.name)}</b><span>${done?Lg(`${done} von ${n} Level · ★ ${sum} von ${n*3}`,`${done} of ${n} levels · ★ ${sum} of ${n*3}`):Lg('noch nicht begonnen','not started yet')}</span></span><span class="r">${ring(sum/(n*3))}<span class="chev" aria-hidden="true">›</span></span></button>`;}).join('')}</div>
  <h2 class="sh">${Lg('Einstellungen','Settings')}</h2>
  <div class="group"><button class="row" role="switch" aria-checked="${soundOn}" data-act="sound" aria-label="${Lg('Ton bei Richtig und Falsch','Sound for right and wrong')}"><span class="ico snd${soundOn?'':' off'}" id="snd-ico" aria-hidden="true">${sndSVG(soundOn)}</span><span class="switch" aria-checked="${soundOn}" aria-hidden="true"><i></i></span></button>${langRow()}</div>`;
}
function renderTopic(){
  const T=TOPIC(S.topic),h=S.mode==='h',cur=suggested(T.id);
  scr.innerHTML=`${navbar(Lg('Üben','Practice'),'back')}
  <header class="lt-head with-ico">${icoHTML(T.id,true)}<div><h1 class="lt">${esc(T.name)}</h1><p class="lt-sub">${esc(T.sub)}</p></div></header>
  ${segHTML()}
  <h2 class="sh">${Lg('Level · je 8 Aufgaben','Levels · 8 questions each')}</h2>
  <div class="group ind2">${T.levels.map((l,i)=>{
    const id=i+1,s=lvStars(T.id,id,S.mode),best=lvBest(T.id,id,S.mode),nt=noteOf(T.id,id).trim();
    const meta=[best?Lg(`Bestwert ${best}`,`Best ${best}`):'',nt?Lg('mit Notizen','with notes'):''].filter(Boolean).join(' · ');
    return `<button class="row" data-act="start" data-lv="${id}"><span class="num${s===3?' full':''}${i===cur?' cur':''}">${id}</span><span class="t"><b>${esc(l.name)}</b><span>${esc(h?l.descH:l.desc)}</span><code>${mk(h?l.exH:l.ex)}</code>${meta?`<span class="meta">${meta}</span>`:''}</span><span class="r">${starsTxt(s)}<span class="chev" aria-hidden="true">›</span></span></button>`;}).join('')}</div>
  <div class="group" style="margin-top:6px"><button class="row" data-act="open-learn" data-topic="${T.id}"><span class="t"><b>${Lg('Grundlagen zu diesem Thema','Basics for this topic')}</b><span>${Lg('Erklärungen, Beispiele, typische Fehler','Explanations, examples, common mistakes')}</span></span><span class="r"><span class="chev" aria-hidden="true">›</span></span></button></div>`;
}
function renderLearnList(){
  scr.innerHTML=`<header class="lt-head"><h1 class="lt">${Lg('Grundlagen','Basics')}</h1><p class="lt-sub">${Lg('Erklärungen mit Beispielen und typischen Fehlern.','Explanations with examples and common mistakes.')}</p></header>
  <div class="group ind">${TOPICS.map(t=>`<button class="row" data-act="open-learn" data-topic="${t.id}">${icoHTML(t.id)}<span class="t"><b>${esc(t.name)}</b><span>${esc(t.sub)}</span></span><span class="r"><span class="chev" aria-hidden="true">›</span></span></button>`).join('')}</div>`;
}
function renderLearnPage(){
  const T=TOPIC(S.topic),f=(EN?{gl:learnGlEn,pot:learnPotEn,ein:learnEinEn,win:learnWinEn}:{gl:learnGl,pot:learnPot,ein:learnEin,win:learnWin})[S.topic];
  scr.innerHTML=`${navbar(S.tab==='ueben'?T.tab:Lg('Grundlagen','Basics'),'back')}
  <header class="lt-head with-ico">${icoHTML(T.id,true)}<div><h1 class="lt">${esc(T.name)}</h1><p class="lt-sub">${Lg('Grundlagen','Basics')}</p></div></header>
  <div class="learn">${f()}</div>`;
}
function renderNotesList(){
  scr.innerHTML=`<header class="lt-head"><h1 class="lt">${Lg('Notizen','Notes')}</h1><p class="lt-sub">${Lg('Ein Notizblatt pro Level. Tippe auf ein Level, um zu schreiben.','One notepad per level. Tap a level to write.')}</p></header>`+
  TOPICS.map(t=>`<h2 class="sh">${esc(t.name)}</h2><div class="group ind2">${t.levels.map((l,i)=>{
    const id=i+1,tx=noteOf(t.id,id).trim();
    return `<button class="row" data-act="notes-open" data-topic="${t.id}" data-lv="${id}"><span class="num sm">${id}</span><span class="t"><b>${esc(l.name)}</b>${tx?`<span class="prev">${esc(tx.split('\n').filter(Boolean).slice(0,2).join(' · ').slice(0,120))}</span>`:`<span>${Lg('Noch leer','Still empty')}</span>`}</span><span class="r"><span class="chev" aria-hidden="true">›</span></span></button>`;}).join('')}</div>`).join('');
}
function renderProgress(){
  const tot=totalStars(),max=maxStars();
  scr.innerHTML=`<header class="lt-head"><h1 class="lt">${Lg('Fortschritt','Progress')}</h1><p class="lt-sub">${Lg('Sterne pro Level: 3 Sterne ab 7 von 8 richtig.','Stars per level: 3 stars from 7 of 8 correct.')}</p></header>
  <div class="group"><div class="row big">${ring(tot/max,56)}<span class="t"><b>★ ${tot} ${Lg('von','of')} ${max}</b><span>${Lg('Alle Themen, Normal und Schwer zusammen','All topics, Normal and Hard combined')}</span></span></div></div>`+
  TOPICS.map(t=>{const m=t.levels.length*3,n=starsFor(t.id,'n'),h=starsFor(t.id,'h');
    return `<h2 class="sh">${esc(t.name)}</h2><div class="group">
      <div class="row">${ring(n/m)}<span class="t"><b>Normal</b></span><span class="r">★ ${n} ${Lg('von','of')} ${m}</span></div>
      <div class="row">${ring(h/m)}<span class="t"><b>${Lg('Schwer','Hard')}</b></span><span class="r">★ ${h} ${Lg('von','of')} ${m}</span></div>
      ${t.levels.map((l,i)=>`<div class="row"><span class="t"><b>${i+1} · ${esc(l.name)}</b></span><span class="r"><span class="mini">N</span>${starsTxt(lvStars(t.id,i+1,'n'))}<span class="mini">${Lg('S','H')}</span>${starsTxt(lvStars(t.id,i+1,'h'))}</span></div>`).join('')}
    </div>`;}).join('')+
  `<p class="fine" style="margin:12px 6px 0">${Lg('Fortschritt und Notizen werden nur auf diesem Gerät gespeichert.','Progress and notes are only saved on this device.')}</p>`;
}

/* =================== Runde =================== */
const progW=()=>Math.round((S.i+(S.done?1:0))/S.qs.length*100);
function renderQ(){
  const q=S.qs[S.i],T=TOPIC(S.topic),fx=fxFor(q);
  const tag=(q.ctx||S.mode==='h')?`<p class="qtag">${q.ctx?`<span>${esc(q.ctx)}</span>`:''}${S.mode==='h'?'<span class="hchip">'+Lg('Schwer','Hard')+'</span>':''}</p>`:'';
  const given=q.given?`<div class="given">${q.given.map(g=>`<span>${esc(g[0])} = ${esc(g[1])}</span>`).join('')}</div>`:'';
  const num=q.kind!=='mc';
  const input=num?`<label class="ans" id="ansbox" for="ans"><span class="pre">${fx(q.pre)}</span><input id="ans" type="text" inputmode="decimal" enterkeyhint="done" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${Lg('Deine Lösung','Your answer')}">${q.unit?`<span class="unit">${esc(q.unit)}</span>`:''}<span class="mark" aria-hidden="true"></span></label>${q.fine?`<p class="fine">${mk(q.fine)}</p>`:''}<p class="msg" id="msg"></p>`:'';
  const opts=num?'':`<h2 class="sh">${Lg('Wähle die richtige Antwort','Choose the correct answer')}</h2><div class="group">${q.options.map((o,k)=>`<button class="row opt" data-act="opt" data-i="${k}"><span class="t"><b>${mk(o)}</b></span><span class="mark" aria-hidden="true"></span></button>`).join('')}</div>`;
  scr.innerHTML=`${navbar(T.tab,'quit',`Level ${S.lv}`,`<button class="nlink" data-act="notes-open" data-topic="${S.topic}" data-lv="${S.lv}">${Lg('Notizen','Notes')}</button>`)}
  <div class="qprog"><div class="track"><span id="qbar" style="width:${progW()}%"></span></div><span>${S.i+1} / ${S.qs.length}</span></div>
  <section class="qcard">
    ${tag}
    <p class="qlabel">${esc(q.label)}</p>
    ${q.fig?`<div class="fig">${q.fig}<p class="fine">${esc(q.figNote||'')}</p></div>`:''}
    <h2 class="qeq">${fx(q.eq)}</h2>
    ${given}
    ${input}
    <div class="fbrow" id="fbrow" hidden></div>
  </section>
  ${opts}
  <div id="hint">${S.tip?`<p class="hint">${mk(q.tip)}</p>`:''}</div>
  <div id="after" hidden></div>
  <div class="qfoot" id="qfoot">${num?'<button class="btn" data-act="check">'+Lg('Prüfen','Check')+'</button>':''}<button class="tlink" data-act="hint">${Lg('Tipp anzeigen','Show hint')}</button></div>`;
  if(S.done&&S.last)reveal(S.last,false);
}
function reveal(info,anim=true){
  const q=S.qs[S.i],last=S.i+1>=S.qs.length,fx=fxFor(q);
  const inp=$('#ans');
  if(inp){inp.value=info.raw;inp.disabled=true;const box=$('#ansbox');box.classList.add(info.ok?'ok':'bad');box.querySelector('.mark').textContent=info.ok?'✓':'✕';}
  if(q.kind==='mc')document.querySelectorAll('.opt').forEach((o,k)=>{
    o.disabled=true;
    if(k===q.correctIdx){o.classList.add('ok');o.querySelector('.mark').textContent='✓';}
    else if(k===info.sel){o.classList.add('bad');o.querySelector('.mark').textContent='✕';}
    else o.classList.add('dim');
  });
  const fb=$('#fbrow');fb.hidden=false;fb.className='fbrow '+(info.ok?'ok':'bad');
  fb.innerHTML=info.ok?`<b role="status">${Lg('Richtig','Correct')}</b><span>+${info.pts} ${Lg('Punkte','points')} · ${Lg('Serie','Streak')} ${S.streak}</span>`
    :`<b role="status">${Lg('Falsch','Wrong')}</b><span>${Lg('Serie vorbei','Streak over')}</span><p class="right">${Lg('Richtig wäre:','Correct answer:')} <b>${fx(q.answerText)}</b></p>`;
  const a=$('#after');a.hidden=false;
  a.innerHTML=`<h2 class="sh">${Lg('Lösungsweg','Solution')}</h2>${stepsHTML(q.steps,fx)}${q.probe?`<p class="probe" style="margin-top:8px">${esc(dv(q.probe))}</p>`:''}`;
  $('#qfoot').innerHTML=`<button class="btn" id="next" data-act="next">${last?Lg('Ergebnis ansehen','See result'):Lg('Weiter','Next')}</button>`;
  if(anim){
    try{$('#next').focus({preventScroll:true});}catch(e){}
    try{fb.scrollIntoView({block:'nearest',behavior:'smooth'});}catch(e){}
  }
}
function check(sel){
  if(S.done)return;
  const q=S.qs[S.i];let ok,raw='';
  if(q.kind==='mc')ok=sel===q.correctIdx;
  else{
    raw=$('#ans').value.trim();
    const v=parseNum(raw);
    if(raw===''||Number.isNaN(v)){$('#msg').textContent=Lg('Gib eine Zahl ein, zum Beispiel 12, '+M+'3 oder 2,5.','Enter a number, for example 12, '+M+'3 or 2.5.');return;}
    ok=Math.abs(v-q.answer)<=q.tol;
  }
  S.done=true;
  let pts=0;const base=S.mode==='h'?15:10;
  if(ok){S.streak++;S.maxStreak=Math.max(S.maxStreak,S.streak);pts=(S.tip?Math.round(base/2):base)+Math.min(S.streak-1,5)*2;S.score+=pts;S.correct++;}
  else{S.streak=0;S.wrong.push(q);}
  S.results[S.i]=ok;
  S.last={ok,pts,sel,raw};
  tone(ok);
  $('#qbar').style.width=progW()+'%';
  if(document.activeElement&&document.activeElement.id==='ans')document.activeElement.blur();
  reveal(S.last,true);
}
function startRound(lv){
  S.lastTopic=S.topic;saveUI();
  Object.assign(S,{view:'round',lv,qs:buildQs(S.topic,lv,S.mode==='h'),i:0,score:0,correct:0,streak:0,maxStreak:0,tip:false,done:false,last:null,results:[],wrong:[]});
  push();render();toTop();
}
function next(){
  if(S.i+1>=S.qs.length){finish();return;}
  S.i++;S.tip=false;S.done=false;S.last=null;
  renderQ();toTop();
}
function finish(){
  const c=S.correct,st=c>=7?3:c>=5?2:c>=3?1:0,k=pkey(S.topic,S.lv,S.mode);
  const p=prog[k]||{stars:0,best:0};
  S.newBest=S.score>(p.best||0)&&S.score>0;
  prog[k]={stars:Math.max(p.stars||0,st),best:Math.max(p.best||0,S.score)};
  saveProg();S.starsNow=st;S.view='result';
  try{history.replaceState(snap(),'');}catch(e){}
  render();toTop();
}
function renderResult(){
  const T=TOPIC(S.topic),lv=T.levels[S.lv-1],st=S.starsNow,nextLv=T.levels[S.lv];
  const head=st===3?Lg('Stark gerechnet!','Great job!'):st===2?Lg('Gut gemacht!','Well done!'):st===1?Lg('Geschafft!','Made it!'):Lg('Weiter üben!','Keep practising!');
  const msg=st===3?Lg('Fast alles richtig. Weiter so!','Almost everything correct. Keep it up!'):st===2?Lg('Ein paar Fehler lohnen sich zum Nachschauen.','A few mistakes are worth a look.'):st===1?Lg('Schau dir die Fehler unten an und versuch es nochmal.','Look at the mistakes below and try again.'):Lg('Lies in den Grundlagen nach und versuch es dann erneut.','Read the basics and then try again.');
  const fxs=S.wrong.map(q=>({q,fx:fxFor(q)}));
  scr.innerHTML=`${navbar(T.tab,'back',`Level ${S.lv}`)}
  <header class="lt-head"><h1 class="lt">${head}</h1><p class="lt-sub">${esc(lv.name)}${S.mode==='h'?' · '+Lg('Schwer','Hard'):''}</p></header>
  <div class="bigstars" role="img" aria-label="${st} von 3 Sternen">${'★'.repeat(st)}<span class="off">${'★'.repeat(3-st)}</span></div>
  <p class="rmsg">${msg}</p>
  <div class="group" style="margin-top:6px">
    <div class="row"><span class="t"><b>${Lg('Richtig','Correct')}</b></span><span class="r">${S.correct} ${Lg('von','of')} ${S.qs.length}</span></div>
    <div class="row"><span class="t"><b>${Lg('Punkte','Points')}</b></span><span class="r">${S.score}${S.newBest?' · '+Lg('neuer Bestwert','new best'):''}</span></div>
    <div class="row"><span class="t"><b>${Lg('Beste Serie','Best streak')}</b></span><span class="r">${S.maxStreak}</span></div>
  </div>
  ${fxs.length?`<h2 class="sh">${Lg('Zum Nachschauen','To review')}</h2><div class="group">${fxs.map(({q,fx})=>`<div class="row"><span class="t"><b>${fx(q.eq)}</b><span>${Lg('Lösung','Answer')}: ${fx(q.answerText)}</span></span></div>`).join('')}</div>`:''}
  <div class="rbtns">
    ${nextLv&&st>=2?`<button class="btn" data-act="start" data-lv="${S.lv+1}">${Lg('Weiter zu Level','Continue to level')} ${S.lv+1}</button>`:''}
    <button class="btn ${nextLv&&st>=2?'tint':''}" data-act="again">${Lg('Nochmal','Again')}</button>
    ${S.mode==='n'&&st===3?'<button class="btn tint" data-act="try-hard">'+Lg('Auf Schwer probieren','Try Hard mode')+'</button>':''}
  </div>`;
}

/* =================== Navigation =================== */
function snap(depth){return {tab:S.tab,page:S.page,topic:S.topic,view:S.view,depth:depth==null?((history.state&&history.state.depth)||0):depth};}
function push(){try{history.pushState(snap(((history.state&&history.state.depth)||0)+1),'');}catch(e){}}
function go(changes){Object.assign(S,changes);push();render();toTop();}
function parentOf(){
  if(S.view!=='tabs')return {view:'tabs',tab:'ueben',page:'topic'};
  if(S.tab==='ueben'&&S.page==='learn')return {page:'topic'};
  return {page:ROOT[S.tab]};
}
function back(){
  if(history.state&&history.state.depth>0){history.back();return;}
  Object.assign(S,parentOf());
  try{history.replaceState(snap(0),'');}catch(e){}
  render();toTop();
}
window.addEventListener('popstate',e=>{
  if(S.ignorePop){S.ignorePop=false;return;}
  if(!$('#notes').hidden){closeNotes(true);return;}
  if(S.view==='round'&&S.results.length&&!S.popArm){
    try{history.pushState(snap(((e.state&&e.state.depth)||0)+1),'');}catch(err){}
    toast(Lg('Nochmal zurück, um die Runde zu beenden.','Go back once more to end the round.'));
    S.popArm=setTimeout(()=>{S.popArm=null;},3000);
    return;
  }
  clearTimeout(S.popArm);S.popArm=null;
  const st=e.state||{tab:'ueben',page:'home',topic:S.topic,view:'tabs'};
  Object.assign(S,{tab:st.tab||'ueben',page:st.page||ROOT[st.tab||'ueben'],topic:st.topic||S.topic,view:'tabs'});
  if(st.view==='round'||st.view==='result')S.page=S.tab==='ueben'?'topic':S.page;
  render();toTop();
});

function render(){
  const inRound=S.view!=='tabs';
  $('#tabbar').hidden=inRound;
  document.body.classList.toggle('in-round',inRound);
  document.querySelectorAll('#tabbar button').forEach(b=>{if(b.dataset.tab===S.tab&&!inRound)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  if(S.view==='round')renderQ();
  else if(S.view==='result')renderResult();
  else if(S.tab==='ueben')(S.page==='topic'?renderTopic:S.page==='learn'?renderLearnPage:renderHome)();
  else if(S.tab==='grund')(S.page==='learn'?renderLearnPage:renderLearnList)();
  else if(S.tab==='notiz')renderNotesList();
  else renderProgress();
}

/* =================== Bedienung =================== */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b||b.disabled)return;
  const a=b.dataset.act;
  if(a==='tabbar'){
    const t=b.dataset.tab;
    if(t===S.tab&&S.page===ROOT[t]){toTop();return;}
    Object.assign(S,{tab:t,page:ROOT[t],view:'tabs'});
    try{history.replaceState(snap(0),'');}catch(err){}
    render();toTop();
  }
  else if(a==='mode'){S.mode=b.dataset.mode;saveUI();render();}
  else if(a==='open-topic')go({topic:b.dataset.topic,page:'topic'});
  else if(a==='open-learn')go({topic:b.dataset.topic,page:'learn',ex:1});
  else if(a==='tab')go({tab:'ueben',page:'topic',view:'tabs'});
  else if(a==='back')back();
  else if(a==='start')startRound(Number(b.dataset.lv));
  else if(a==='start-at'){S.topic=b.dataset.topic;startRound(Number(b.dataset.lv));}
  else if(a==='again')startRound(S.lv);
  else if(a==='try-hard'){S.mode='h';saveUI();startRound(S.lv);}
  else if(a==='quit'){
    if(S.results.length&&!S.quitArm){
      b.innerHTML=Lg('Runde beenden?','End round?');b.classList.add('arm');
      S.quitArm=setTimeout(()=>{S.quitArm=null;if(b.isConnected){b.innerHTML=`<span aria-hidden="true">‹</span>${esc(TOPIC(S.topic).tab)}`;b.classList.remove('arm');}},3000);
      return;
    }
    clearTimeout(S.quitArm);S.quitArm=null;
    if(history.state&&history.state.depth>0)S.popArm=setTimeout(()=>{S.popArm=null;},3000);
    back();
  }
  else if(a==='check')check();
  else if(a==='opt')check(Number(b.dataset.i));
  else if(a==='next')next();
  else if(a==='hint'){const q=S.qs[S.i];if(!q)return;S.tip=true;$('#hint').innerHTML=`<p class="hint">${mk(q.tip)}</p>`;}
  else if(a==='ex-next'){S.ex=Math.min(S.ex+1,EX.length);renderLearnPage();}
  else if(a==='ex-reset'){S.ex=1;renderLearnPage();}
  else if(a==='lang'){
    const l=b.dataset.lang;if(l===LANG)return;
    try{localStorage.setItem(LS.lang,l);}catch(err){}
    location.reload();
  }
  else if(a==='sound'){
    soundOn=!soundOn;store.set(LS.sound,soundOn);
    b.setAttribute('aria-checked',String(soundOn));
    const sw=b.querySelector('.switch'),ic=b.querySelector('#snd-ico');
    if(sw)sw.setAttribute('aria-checked',String(soundOn));
    if(ic){ic.innerHTML=sndSVG(soundOn);ic.classList.toggle('off',!soundOn);}
    if(soundOn)tone(true);
  }
  else if(a==='notes-open')openNotes(b.dataset.topic||S.topic,Number(b.dataset.lv));
  else if(a==='notes-close')closeNotes(false);
  else if(a==='sym')insertNote(b.dataset.s);
  else if(a==='note-task'){
    const q=S.qs[S.i];if(!q)return;
    let s=Lg('Aufgabe: ','Task: ')+dv(q.eq).replace(/\^\{([^}]*)\}/g,'^$1');
    if(q.given)s+='  ('+q.given.map(g=>g[0]+' = '+g[1]).join(', ')+')';
    const at=ta.selectionStart??ta.value.length;
    if(at>0&&ta.value[at-1]!=='\n')s='\n'+s;
    insertNote(s+'\n');
  }
  else if(a==='note-clear'){
    if(!NT.clearArm){
      b.textContent=Lg('Wirklich leeren?','Really clear?');
      NT.clearArm=setTimeout(()=>{NT.clearArm=null;b.textContent=Lg('Leeren','Clear');},4000);
    }else{
      clearTimeout(NT.clearArm);NT.clearArm=null;b.textContent=Lg('Leeren','Clear');
      ta.value='';ta.dispatchEvent(new Event('input'));
    }
  }
});
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.target&&e.target.id==='ans'){e.preventDefault();check();}
  if(e.key==='Escape'&&!$('#notes').hidden)closeNotes(false);
});
$('#notes').addEventListener('click',e=>{if(e.target.id==='notes')closeNotes(false);});

/* =================== Notizen =================== */
const ta=$('#notes-text');
const NT={key:'',topic:'',lv:0,map:store.get(LS.notes,{})||{},clearArm:null,saveT:null};
function noteOf(tid,lv){const n=NT.map[tid+'-'+lv];return n&&typeof n.text==='string'?n.text:'';}
function openNotes(tid,lv){
  const T=TOPIC(tid);
  NT.key=tid+'-'+lv;NT.topic=tid;NT.lv=lv;ta.value=noteOf(tid,lv);
  $('#notes-lv').textContent=`${T.tab} · Level ${lv} · ${T.levels[lv-1].name}`;
  $('#note-task-btn').hidden=!(S.view==='round'&&tid===S.topic&&lv===S.lv);
  $('#notes-stat').textContent=Lg('Auf diesem Gerät gespeichert','Saved on this device');
  $('#notes').hidden=false;document.body.style.overflow='hidden';
  try{history.pushState({...snap(((history.state&&history.state.depth)||0)+1),sheet:1},'');}catch(e){}
  try{ta.focus({preventScroll:true});}catch(e){}
}
function closeNotes(fromPop){
  if($('#notes').hidden)return;
  $('#notes').hidden=true;document.body.style.overflow='';NT.key='';
  if(!fromPop&&history.state&&history.state.sheet){S.ignorePop=true;history.back();}
  if(S.view==='tabs')render();
}
function insertNote(s){
  const a=ta.selectionStart??ta.value.length,b=ta.selectionEnd??a;
  ta.value=ta.value.slice(0,a)+s+ta.value.slice(b);
  const p=a+s.length;
  try{ta.focus({preventScroll:true});}catch(e){}
  try{ta.setSelectionRange(p,p);}catch(e){}
  ta.dispatchEvent(new Event('input'));
}
ta.addEventListener('input',()=>{
  if(!NT.key)return;
  const v=ta.value.slice(0,20000);
  if(v)NT.map[NT.key]={text:v,t:Date.now()};else delete NT.map[NT.key];
  store.set(LS.notes,NT.map);
  $('#notes-stat').textContent=Lg('Gespeichert','Saved');
  clearTimeout(NT.saveT);NT.saveT=setTimeout(()=>{$('#notes-stat').textContent=Lg('Auf diesem Gerät gespeichert','Saved on this device');},1500);
});
document.querySelectorAll('.sym button').forEach(b=>b.addEventListener('mousedown',e=>e.preventDefault()));

/* =================== Start =================== */
function applyLang(){
  if(!EN)return;
  document.documentElement.lang='en';
  const m=document.querySelector('meta[name="description"]');
  if(m)m.content='Practise technical maths: equations and formulas, powers, unit conversion and trigonometry. Every question comes with a worked solution.';
  const set=(sel,txt)=>{const e=document.querySelector(sel);if(!e)return;const n=[...e.childNodes].reverse().find(x=>x.nodeType===3&&x.nodeValue.trim());if(n)n.nodeValue=txt;else e.textContent=txt;};
  const attr=(sel,a,v)=>{const e=document.querySelector(sel);if(e)e.setAttribute(a,v);};
  attr('#tabbar','aria-label','Sections');
  set('#tabbar [data-tab="ueben"]','Practice');set('#tabbar [data-tab="grund"]','Basics');
  set('#tabbar [data-tab="notiz"]','Notes');set('#tabbar [data-tab="fort"]','Progress');
  set('#notes-h','Notes');set('#notes .done','Done');
  attr('#notes .sym','aria-label','Insert symbol');
  const sy=(s,txt,aria)=>{const e=document.querySelector('#notes .sym [data-s="'+s+'"]');if(!e)return;if(txt){e.textContent=txt;e.setAttribute('data-s',txt);}e.setAttribute('aria-label',aria);};
  sy('·',null,'Times');sy(':','÷','Divided by');sy('−',null,'Minus');sy(' | ',null,'Calculation line');
  sy('²',null,'Squared');sy('π',null,'Pi');sy('≈',null,'Approximately');sy(' → ',null,'Arrow');
  attr('#notes-text','placeholder','Side calculations, rules of thumb, questions for the teacher …');
  set('#notes-stat','Saved on this device');set('#note-task-btn','Insert question');set('#notes [data-act="note-clear"]','Clear');
}
applyLang();
try{history.replaceState(snap(0),'');}catch(e){}
render();
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){
  window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{});});
}
