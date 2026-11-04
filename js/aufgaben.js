/* SA-Ready · Aufgaben
   Erzeugt die Übungsaufgaben für alle Themen und Level (Normal und Schwer).
   Jede Aufgabe kommt mit Lösung, Toleranz, Lösungsweg und Tipp. */
'use strict';
const M='−',ST='Seiten tauschen.',N_Q=8;
const $=(s,r=document)=>r.querySelector(s);
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const r12=n=>Number(n.toPrecision(12));
const nice=x=>isFinite(x)&&Math.abs(x-Number(x.toPrecision(5)))<=1e-9*Math.max(1,Math.abs(x));

/* Zahl im österreichischen Format: Komma, echtes Minus, ab 5 Stellen mit Abstand gruppiert */
function fmt(n,dec){
  if(!isFinite(n))return String(n);
  let v=dec===undefined?r12(n):Math.round(n*10**dec)/10**dec;
  if(Math.abs(v)<1e-12)v=0;
  const a=Math.abs(v);
  let s=dec===undefined?a.toFixed(a===0?0:Math.max(0,Math.min(12,11-Math.floor(Math.log10(a))))):a.toFixed(dec);
  if(s.includes('.'))s=s.replace(/0+$/,'').replace(/\.$/,'');
  let [i,f]=s.split('.');
  if(i.length>4)i=i.replace(/\B(?=(\d{3})+(?!\d))/g,' ');
  return (v<0?M:'')+i+(f?','+f:'');
}
const par=n=>n<0?`(${fmt(n)})`:fmt(n);
const coef=c=>c===1?'':c===-1?M:fmt(c);
const term=d=>d<0?`${M} ${fmt(-d)}`:`+ ${fmt(d)}`;
function parseNum(raw){
  let s=String(raw).trim().replace(/[\s  ']/g,'').replace(/[−–‒]/g,'-');
  if(s.includes(','))s=s.replace(/\./g,'').replace(',','.');
  else if(/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(s))s=s.replace(/\./g,'');
  const m=/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(s);
  if(m){const b=Number(m[2]);return b?Number(m[1])/b:NaN;}
  if(!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s))return NaN;
  return Number(s);
}

function Q(o){return Object.assign({kind:'num',mode:'plain',label:'',pre:'? =',unit:'',tol:1e-9,steps:[],tip:'',fine:''},o);}
function rows(r){return r.map(a=>({eq:a[0],op:a[1]||'',note:a[2]||''}));}
const relTol=v=>Math.max(1e-9,Math.abs(v)*1e-6);
function probe(eq,x){return 'Probe: '+eq.replace(/(\d)x/g,'$1 · x').replace(/x/g,par(x))+' ✓';}
function mkNum(eq,x,r,tip){return Q({mode:'x',eq,label:'Löse nach x',pre:'x =',answer:x,tol:1e-4,answerText:'x = '+fmt(x),steps:rows(r),probe:probe(eq,x),tip,check:'tail'});}
function uniq(g){const out=[],seen=new Set();let guard=0;while(out.length<N_Q&&guard++<500){const q=g();const k=q.eq+'|'+q.label+'|'+(q.given?JSON.stringify(q.given):'');if(!seen.has(k)){seen.add(k);out.push(q);}}return out;}
function typesMix(g,n){const t=shuffle([...Array(n).keys()]);while(t.length<N_Q)t.push(rnd(0,n-1));return shuffle(t.slice(0,N_Q)).map(g);}

/* =================== 1  GLEICHUNGEN =================== */
function gen1(){
  const t=rnd(0,3);
  if(t===0){const a=rnd(2,20),x=rnd(2,20),b=x+a,eq=`x + ${a} = ${b}`;
    return mkNum(eq,x,[[eq,`${M} ${a}`,`Gegenoperation von + ist ${M}. Rechne auf beiden Seiten ${a} ab.`],[`x = ${b} ${M} ${a} = ${x}`]],'Bei x steht ein Plus. Mit Minus hebst du es auf, auf beiden Seiten.');}
  if(t===1){const a=rnd(2,15),x=rnd(a+1,a+15),b=x-a,eq=`x ${M} ${a} = ${b}`;
    return mkNum(eq,x,[[eq,`+ ${a}`,`Gegenoperation von ${M} ist +. Rechne auf beiden Seiten ${a} dazu.`],[`x = ${b} + ${a} = ${x}`]],'Bei x steht ein Minus. Mit Plus hebst du es auf, auf beiden Seiten.');}
  if(t===2){const a=rnd(2,12),x=rnd(2,12),b=a*x,eq=`${a}x = ${b}`;
    return mkNum(eq,x,[[eq,`: ${a}`,`${a}x heißt ${a} mal x. Gegenoperation von Mal ist Geteilt.`],[`x = ${b} : ${a} = ${x}`]],'Vor dem x steht eine Zahl, die mit x malgenommen wird. Teile beide Seiten durch sie.');}
  const a=rnd(2,9),b=rnd(2,12),x=a*b,eq=`x : ${a} = ${b}`;
  return mkNum(eq,x,[[eq,`· ${a}`,'Gegenoperation von Geteilt ist Mal. Nimm beide Seiten mal '+a+'.'],[`x = ${b} · ${a} = ${x}`]],'x wird durch eine Zahl geteilt. Mit Mal hebst du das auf, auf beiden Seiten.');
}
function gen1h(){
  const t=rnd(0,3);
  if(t===0){const a=pick([0.5,1.2,1.5,2.5,3.5,4.5,7.5]),x=pick([-9,-7,-5,-3,-2,2,3,4,6,8]),b=r12(x-a),eq=`x ${M} ${fmt(a)} = ${fmt(b)}`;
    return mkNum(eq,x,[[eq,`+ ${fmt(a)}`,`Gegenoperation von ${M} ist +. Mit Kommazahlen und negativen Zahlen gilt dieselbe Waage-Regel.`],[`x = ${fmt(b)} + ${fmt(a)} = ${fmt(x)}`]],'Rechne auf beiden Seiten die Gegenoperation. Achte auf das Vorzeichen.');}
  if(t===1){const a=rnd(2,9),x=pick([-12,-8,-6,-4.5,-2.5,1.5,3,4.5,5,7]),b=r12(-a*x),eq=`${M}${a}x = ${fmt(b)}`;
    return mkNum(eq,x,[[eq,`: (${M}${a})`,`Das Minus gehört zur Zahl vor dem x. Teile durch ${M}${a}.`],[`x = ${fmt(b)} : (${M}${a}) = ${fmt(x)}`,'','Minus durch Minus ergibt Plus, Plus durch Minus ergibt Minus.']],'Teile durch die ganze Zahl vor dem x, mit ihrem Vorzeichen.');}
  if(t===2){const a=rnd(2,8),b=pick([-9,-7,-5,-3,-2,2,3,4,6,9]),x=-a*b,eq=`x : (${M}${a}) = ${fmt(b)}`;
    return mkNum(eq,x,[[eq,`· (${M}${a})`,`Gegenoperation von Geteilt ist Mal. Nimm beide Seiten mal ${M}${a}.`],[`x = ${fmt(b)} · (${M}${a}) = ${fmt(x)}`]],'Mit Mal hebst du das Geteilt auf. Das Minus kommt mit.');}
  const a=pick([0.2,0.25,0.4,0.5,0.75,1.5,2.5]),x=rnd(2,24),b=r12(a*x),eq=`${fmt(a)}x = ${fmt(b)}`;
  return mkNum(eq,x,[[eq,`: ${fmt(a)}`,'Auch durch eine Kommazahl darfst du teilen.'],[`x = ${fmt(b)} : ${fmt(a)} = ${x}`]],'Teile beide Seiten durch die Kommazahl vor dem x.');
}
function gen2(){
  const t=rnd(0,3),a=rnd(2,9);
  if(t===0){const x=rnd(2,12),b=rnd(2,20),c=a*x+b,eq=`${a}x + ${b} = ${c}`;
    return mkNum(eq,x,[[eq,`${M} ${b}`,'Erst das Plus wegräumen.'],[`${a}x = ${c-b}`,`: ${a}`,'Dann durch die Zahl vor dem x teilen.'],[`x = ${c-b} : ${a} = ${x}`]],'Erst die Zahl ohne x loswerden, danach die Zahl vor dem x.');}
  if(t===1){const x=rnd(3,12),b=rnd(1,Math.min(20,a*x-1)),c=a*x-b,eq=`${a}x ${M} ${b} = ${c}`;
    return mkNum(eq,x,[[eq,`+ ${b}`,'Erst das Minus wegräumen.'],[`${a}x = ${c+b}`,`: ${a}`,'Dann durch die Zahl vor dem x teilen.'],[`x = ${c+b} : ${a} = ${x}`]],'Erst die Zahl ohne x loswerden, danach die Zahl vor dem x.');}
  if(t===2){const k=rnd(2,9),x=a*k,b=rnd(2,15),c=k+b,eq=`x : ${a} + ${b} = ${c}`;
    return mkNum(eq,x,[[eq,`${M} ${b}`,'Erst das Plus wegräumen.'],[`x : ${a} = ${c-b}`,`· ${a}`,'Dann das Geteilt mit Mal aufheben.'],[`x = ${c-b} · ${a} = ${x}`]],'Erst plus oder minus wegräumen, dann das Geteilt.');}
  const x=rnd(2,12),b=rnd(2,20),c=a*x+b,eq=`${c} = ${a}x + ${b}`;
  return mkNum(eq,x,[[eq,`${M} ${b}`,'Das x steht rechts. Die Regeln bleiben gleich.'],[`${c-b} = ${a}x`,`: ${a}`],[`${x} = x`,'',ST],[`x = ${x}`]],'Das x darf auch rechts stehen. Rechne wie gewohnt, tausche am Ende die Seiten.');
}
function gen2h(){
  const t=rnd(0,3);
  if(t===0){const a=rnd(2,8),x=pick([-8,-6,-5,-3,-2,2,3,4,5,7]),b=rnd(2,20),c=-a*x+b,eq=`${M}${a}x + ${b} = ${fmt(c)}`;
    return mkNum(eq,x,[[eq,`${M} ${b}`,'Erst die Zahl ohne x wegräumen.'],[`${M}${a}x = ${fmt(c-b)}`,`: (${M}${a})`,'Durch die Zahl vor dem x teilen, mit ihrem Minus.'],[`x = ${fmt(c-b)} : (${M}${a}) = ${fmt(x)}`]],'Erst die Zahl ohne x wegräumen. Dann durch die Zahl vor dem x teilen, mit Vorzeichen.');}
  if(t===1){const a=pick([0.5,1.5,2.5]),x=pick([2,4,6,8,10,12,14,16]),b=rnd(2,15),c=r12(a*x-b),eq=`${fmt(a)}x ${M} ${b} = ${fmt(c)}`;
    return mkNum(eq,x,[[eq,`+ ${b}`,'Erst das Minus wegräumen.'],[`${fmt(a)}x = ${fmt(c+b)}`,`: ${fmt(a)}`,'Dann durch die Kommazahl teilen.'],[`x = ${fmt(c+b)} : ${fmt(a)} = ${x}`]],'Gleicher Ablauf wie immer, nur mit Kommazahl vor dem x.');}
  if(t===2){let a,c,b,x;do{a=rnd(2,6);c=pick([-5,-4,-3,-2,2,3,4,6,8]);b=rnd(1,9);x=a*c-b;}while(x===0);
    const eq=`(x + ${b}) : ${a} = ${fmt(c)}`;
    return mkNum(eq,x,[[eq,`· ${a}`,'Die ganze Klammer wird geteilt. Erst mit Mal aufheben.'],[`x + ${b} = ${fmt(a*c)}`,`${M} ${b}`],[`x = ${fmt(a*c)} ${M} ${b} = ${fmt(x)}`]],'Zuerst das Geteilt hinter der Klammer aufheben, dann die Klammer ist weg.');}
  const a=rnd(2,7),x=pick([-6,-4,-3,-2,2,3,4,5,7,9]),b=rnd(5,30),c=b-a*x,eq=`${fmt(c)} = ${b} ${M} ${a}x`;
  return mkNum(eq,x,[[eq,`${M} ${b}`,'Das x steht rechts, mit Minus davor.'],[`${fmt(c-b)} = ${M}${a}x`,`: (${M}${a})`],[`${fmt(x)} = x`,'',ST],[`x = ${fmt(x)}`]],`Das Minus gehört zum ${a}x. Am Ende durch ${M}${a} teilen.`);
}
function gen3(){
  const t=rnd(0,3);
  if(t===0){const c=rnd(2,5),a=c+rnd(2,5),x=rnd(2,10),b=rnd(1,15),k=a-c,d=k*x+b,eq=`${a}x + ${b} = ${c}x + ${d}`;
    return mkNum(eq,x,[[eq,`${M} ${c}x`,'x steht auf beiden Seiten. Zieh das kleinere x-Glied auf beiden Seiten ab.'],[`${k}x + ${b} = ${d}`,`${M} ${b}`,'Jetzt die Zahl ohne x wegräumen.'],[`${k}x = ${d-b}`,`: ${k}`],[`x = ${d-b} : ${k} = ${x}`]],'Sammle alle x auf einer Seite: zieh das kleinere x-Glied auf beiden Seiten ab.');}
  if(t===1){const a=rnd(2,6),x=rnd(2,10),b=rnd(1,9),c=a*(x+b),eq=`${a}(x + ${b}) = ${c}`;
    return mkNum(eq,x,[[eq,`: ${a}`,'Die Klammer wird mit '+a+' malgenommen. Teile beide Seiten durch '+a+'.'],[`x + ${b} = ${x+b}`,`${M} ${b}`],[`x = ${x+b} ${M} ${b} = ${x}`]],'Teile zuerst beide Seiten durch die Zahl vor der Klammer.');}
  if(t===2){const b=rnd(1,6),x=b+rnd(2,8),a=rnd(2,6),c=a*(x-b),eq=`${a}(x ${M} ${b}) = ${c}`;
    return mkNum(eq,x,[[eq,`: ${a}`,'Die Klammer wird mit '+a+' malgenommen. Teile beide Seiten durch '+a+'.'],[`x ${M} ${b} = ${x-b}`,`+ ${b}`],[`x = ${x-b} + ${b} = ${x}`]],'Teile zuerst beide Seiten durch die Zahl vor der Klammer.');}
  const a=rnd(2,6),x=rnd(2,9),c=rnd(1,15),b=c+a*x,eq=`${b} ${M} ${a}x = ${c}`;
  return mkNum(eq,x,[[eq,`${M} ${b}`,'Erst die Zahl ohne x auf die andere Seite.'],[`${M}${a}x = ${fmt(c-b)}`,`: (${M}${a})`,'Das Minus gehört zum x. Minus durch Minus ergibt Plus.'],[`x = ${fmt(c-b)} : (${M}${a}) = ${x}`]],`Das Minus vor ${a}x gehört zum x. Du teilst am Ende durch ${M}${a}.`);
}
function gen3h(){
  const t=rnd(0,3);
  if(t===0){let a,c,x,b,d;do{a=rnd(3,7);c=rnd(1,a-1);x=pick([-5,-4,-3,-2,2,3,4,5,6,8]);b=rnd(1,6);d=(a-c)*x+a*b;}while(d===0);
    const k=a-c,ab=a*b,eq=`${a}(x + ${b}) = ${coef(c)}x ${term(d)}`;
    const r=[[eq,'',`Zuerst die Klammer ausmultiplizieren: ${a} · x und ${a} · ${b}.`],[`${a}x + ${ab} = ${coef(c)}x ${term(d)}`,`${M} ${coef(c)}x`,'Alle x auf die linke Seite.'],[`${coef(k)}x + ${ab} = ${fmt(d)}`,`${M} ${ab}`],[`${coef(k)}x = ${fmt(d-ab)}`,k===1?'':`: ${k}`]];
    if(k!==1)r.push([`x = ${fmt(d-ab)} : ${k} = ${fmt(x)}`]);
    return mkNum(eq,x,r,'Klammer ausmultiplizieren, dann alle x auf eine Seite bringen.');}
  if(t===1){const p=rnd(4,8),q=rnd(2,p-1),rr=rnd(1,5),x=rnd(1,10),s=(p-q)*x+q*rr,k=p-q,eq=`${p}x ${M} ${q}(x ${M} ${rr}) = ${s}`;
    const r=[[eq,'','Minus vor der Klammer: Beim Auflösen drehen sich die Vorzeichen in der Klammer um.'],[`${p}x ${M} ${q}x + ${q*rr} = ${s}`,'',`Zusammenfassen: ${p}x ${M} ${q}x = ${coef(k)||'1'}x.`],[`${coef(k)}x + ${q*rr} = ${s}`,`${M} ${q*rr}`],[`${coef(k)}x = ${s-q*rr}`,k===1?'':`: ${k}`]];
    if(k!==1)r.push([`x = ${s-q*rr} : ${k} = ${x}`]);
    return mkNum(eq,x,r,`Achtung beim Minus vor der Klammer: ${M}${q} · (${M}${rr}) ergibt +${q*rr}.`);}
  if(t===2){const [a,b]=pick([[2,3],[2,4],[3,6],[4,6],[2,6],[3,4],[5,10],[4,12]]);const gcd=(m,n)=>n?gcd(n,m%n):m,L=a*b/gcd(a,b);
    const x=L*rnd(1,4),c=x/a+x/b,A=L/a,B=L/b,eq=`x/${a} + x/${b} = ${c}`;
    return mkNum(eq,x,[[eq,`· ${L}`,`Mit dem Hauptnenner ${L} malnehmen, dann verschwinden die Brüche.`],[`${coef(A)}x + ${coef(B)}x = ${L*c}`,'','Zusammenfassen.'],[`${A+B}x = ${L*c}`,`: ${A+B}`],[`x = ${L*c} : ${A+B} = ${x}`]],`Nimm beide Seiten mal ${L}. Das ist die kleinste Zahl, die durch ${a} und ${b} teilbar ist.`);}
  const a=pick([1.5,2.5,3.5,4.5]),k=pick([1,2]),c=a-k,x=rnd(2,12),b=rnd(1,10),d=k*x+b,eq=`${fmt(a)}x + ${b} = ${coef(c)}x + ${d}`;
  const r=[[eq,`${M} ${coef(c)}x`,'Alle x auf die linke Seite.'],[`${coef(k)}x + ${b} = ${d}`,`${M} ${b}`],[`${coef(k)}x = ${d-b}`,k===1?'':`: ${k}`]];
  if(k!==1)r.push([`x = ${d-b} : ${k} = ${x}`]);
  return mkNum(eq,x,r,'Kommazahlen vor dem x darfst du genauso abziehen wie ganze Zahlen.');
}
const BANK=[
 {ctx:'Ohmsches Gesetz',f:'U = R · I',t:'I',ok:'I = U / R',bad:['I = U · R','I = R / U',`I = U ${M} R`],steps:[['U = R · I',': R','Gesucht ist I. Durch R teilen, damit R rechts verschwindet.'],['U / R = I','',ST],['I = U / R']]},
 {ctx:'Vorschubgeschwindigkeit',f:'vf = f · n',t:'n',ok:'n = vf / f',bad:['n = vf · f','n = f / vf',`n = vf ${M} f`],steps:[['vf = f · n',': f','Gesucht ist n. Durch f teilen.'],['vf / f = n','',ST],['n = vf / f']]},
 {ctx:'Vorschubgeschwindigkeit',f:'vf = f · n',t:'f',ok:'f = vf / n',bad:['f = vf · n','f = n / vf',`f = vf ${M} n`],steps:[['vf = f · n',': n','Gesucht ist f. Durch n teilen.'],['vf / n = f','',ST],['f = vf / n']]},
 {ctx:'Schnittgeschwindigkeit',f:'vc = π · d · n / 1000',t:'n',ok:'n = 1000 · vc / (π · d)',bad:['n = 1000 · vc / π · d','n = vc · π · d / 1000','n = π · d / (1000 · vc)'],steps:[['vc = π · d · n / 1000','· 1000','Zuerst den Bruch loswerden.'],['1000 · vc = π · d · n',': (π · d)','Durch das ganze Produkt teilen. Darum die Klammer.'],['1000 · vc / (π · d) = n','',ST],['n = 1000 · vc / (π · d)']]},
 {ctx:'Schnittgeschwindigkeit',f:'vc = π · d · n / 1000',t:'d',ok:'d = 1000 · vc / (π · n)',bad:['d = 1000 · vc / π · n','d = vc / (1000 · π · n)','d = π · n / (1000 · vc)'],steps:[['vc = π · d · n / 1000','· 1000','Zuerst den Bruch loswerden.'],['1000 · vc = π · d · n',': (π · n)','Durch das ganze Produkt teilen. Darum die Klammer.'],['1000 · vc / (π · n) = d','',ST],['d = 1000 · vc / (π · n)']]},
 {ctx:'Druck',f:'p = F / A',t:'F',ok:'F = p · A',bad:['F = p / A','F = A / p',`F = p ${M} A`],steps:[['p = F / A','· A','Mal A, damit der Bruch verschwindet.'],['p · A = F','',ST],['F = p · A']]},
 {ctx:'Druck',f:'p = F / A',t:'A',ok:'A = F / p',bad:['A = F · p','A = p / F',`A = p ${M} F`],steps:[['p = F / A','· A','Mal A, damit der Bruch verschwindet.'],['p · A = F',': p','Jetzt durch p teilen.'],['A = F / p']]},
 {ctx:'Gleichförmige Bewegung',f:'s = v · t',t:'t',ok:'t = s / v',bad:['t = s · v','t = v / s',`t = s ${M} v`],steps:[['s = v · t',': v','Gesucht ist t. Durch v teilen.'],['s / v = t','',ST],['t = s / v']]},
 {ctx:'Kreisumfang',f:'U = 2 · π · r',t:'r',ok:'r = U / (2 · π)',bad:['r = U / 2 · π','r = U · 2 · π','r = 2 · π / U'],steps:[['U = 2 · π · r',': (2 · π)','Durch das ganze Produkt teilen. Darum die Klammer.'],['U / (2 · π) = r','',ST],['r = U / (2 · π)']]},
 {ctx:'Kraft',f:'F = m · a',t:'m',ok:'m = F / a',bad:['m = F · a','m = a / F',`m = F ${M} a`],steps:[['F = m · a',': a','Gesucht ist m. Durch a teilen.'],['F / a = m','',ST],['m = F / a']]},
 {ctx:'Gesamtlänge',f:'L = l1 + l2 + l3',t:'l2',ok:`l2 = L ${M} l1 ${M} l3`,bad:['l2 = L + l1 + l3',`l2 = L ${M} l1 + l3`,`l2 = l1 + l3 ${M} L`],steps:[['L = l1 + l2 + l3',`${M} l1`,'Erst l1 auf beiden Seiten abziehen.'],[`L ${M} l1 = l2 + l3`,`${M} l3`,'Dann l3 abziehen.'],[`L ${M} l1 ${M} l3 = l2`,'',ST],[`l2 = L ${M} l1 ${M} l3`]]},
 {ctx:'Hauptzeit',f:'th = L / vf',t:'vf',ok:'vf = L / th',bad:['vf = L · th','vf = th / L',`vf = L ${M} th`],steps:[['th = L / vf','· vf','Mal vf, damit der Bruch verschwindet.'],['th · vf = L',': th','Jetzt durch th teilen.'],['vf = L / th']]},
 {ctx:'Hauptzeit',f:'th = L / vf',t:'L',ok:'L = th · vf',bad:['L = th / vf','L = vf / th',`L = th ${M} vf`],steps:[['th = L / vf','· vf','Mal vf, damit der Bruch verschwindet.'],['th · vf = L','',ST],['L = th · vf']]}
];
const BANKH=[
 {ctx:'Wärmeausdehnung',f:'Δl = l0 · α · Δt',t:'Δt',ok:'Δt = Δl / (l0 · α)',bad:['Δt = Δl · l0 · α','Δt = Δl / l0 · α','Δt = l0 · α / Δl'],steps:[['Δl = l0 · α · Δt',': (l0 · α)','Durch das ganze Produkt teilen. Ohne Klammer wäre nur durch l0 geteilt.'],['Δl / (l0 · α) = Δt','',ST],['Δt = Δl / (l0 · α)']]},
 {ctx:'Kreisfläche',f:'A = π · d^{2} / 4',t:'d',ok:'d = √(4 · A / π)',bad:['d = √(A · π / 4)','d = 4 · A / π','d = √(4 · A) / π'],steps:[['A = π · d^{2} / 4','· 4','Zuerst den Bruch loswerden.'],['4 · A = π · d^{2}',': π'],['4 · A / π = d^{2}','√','Die Wurzel hebt das Quadrat auf.'],['d = √(4 · A / π)']]},
 {ctx:'Elektrische Leistung',f:'P = R · I^{2}',t:'I',ok:'I = √(P / R)',bad:['I = P / R^{2}','I = √P / R','I = P / R'],steps:[['P = R · I^{2}',': R'],['P / R = I^{2}','√','Die Wurzel hebt das Quadrat auf.'],['I = √(P / R)']]},
 {ctx:'Hebelgesetz',f:'F1 · l1 = F2 · l2',t:'l2',ok:'l2 = F1 · l1 / F2',bad:['l2 = F2 · l1 / F1','l2 = F1 · F2 / l1','l2 = F1 · l1 · F2'],steps:[['F1 · l1 = F2 · l2',': F2','Bei l2 steht F2 mal. Durch F2 teilen.'],['F1 · l1 / F2 = l2','',ST],['l2 = F1 · l1 / F2']]},
 {ctx:'Kegelverjüngung',f:`C = (D ${M} d) / L`,t:'d',ok:`d = D ${M} C · L`,bad:[`d = C · L ${M} D`,'d = D + C · L',`d = (D ${M} C) · L`],steps:[[`C = (D ${M} d) / L`,'· L','Zuerst den Bruch loswerden.'],[`C · L = D ${M} d`,'+ d','d hat ein Minus. Mit + d auf die andere Seite holen.'],['C · L + d = D',`${M} C · L`],[`d = D ${M} C · L`]]},
 {ctx:'Satz des Pythagoras',f:'c^{2} = a^{2} + b^{2}',t:'a',ok:`a = √(c^{2} ${M} b^{2})`,bad:[`a = c ${M} b`,'a = √(c^{2} + b^{2})',`a = (c ${M} b)^{2}`],steps:[['c^{2} = a^{2} + b^{2}',`${M} b^{2}`],[`c^{2} ${M} b^{2} = a^{2}`,'√','Die Wurzel gilt für die ganze Seite. Du darfst nicht einzeln wurzeln.'],[`a = √(c^{2} ${M} b^{2})`]]},
 {ctx:'Hauptzeit beim Drehen',f:'th = L · i / (n · f)',t:'n',ok:'n = L · i / (th · f)',bad:['n = th · f / (L · i)','n = L · i · th / f','n = L · i / th · f'],steps:[['th = L · i / (n · f)','· (n · f)','Zuerst den Bruch loswerden.'],['th · n · f = L · i',': (th · f)'],['n = L · i / (th · f)']]},
 {ctx:'Masse eines Zylinders',f:'m = ρ · π · d^{2} · h / 4',t:'h',ok:'h = 4 · m / (ρ · π · d^{2})',bad:['h = 4 · m · ρ · π · d^{2}','h = 4 · m / ρ · π · d^{2}','h = ρ · π · d^{2} / (4 · m)'],steps:[['m = ρ · π · d^{2} · h / 4','· 4'],['4 · m = ρ · π · d^{2} · h',': (ρ · π · d^{2})','Durch das ganze Produkt teilen.'],['h = 4 · m / (ρ · π · d^{2})']]},
 {ctx:'Parallelschaltung',f:'1 / R = 1 / R1 + 1 / R2',t:'R',ok:'R = R1 · R2 / (R1 + R2)',bad:['R = R1 + R2','R = (R1 + R2) / (R1 · R2)','R = R1 · R2 · (R1 + R2)'],steps:[['1 / R = 1 / R1 + 1 / R2','','Rechts auf den Hauptnenner R1 · R2 bringen.'],['1 / R = (R2 + R1) / (R1 · R2)','Kehrwert','Von beiden Seiten den Kehrwert nehmen.'],['R = R1 · R2 / (R1 + R2)']]},
 {ctx:'Beschleunigte Bewegung',f:'s = a · t^{2} / 2',t:'t',ok:'t = √(2 · s / a)',bad:['t = √(s / (2 · a))','t = 2 · s / a','t = √(2 · s · a)'],steps:[['s = a · t^{2} / 2','· 2'],['2 · s = a · t^{2}',': a'],['2 · s / a = t^{2}','√'],['t = √(2 · s / a)']]}
];
function mkMC(it){
  const opts=shuffle([it.ok,...it.bad]);
  return Q({kind:'mc',mode:'formula',ctx:it.ctx,label:'Stelle nach '+it.t+' um',eq:it.f,target:it.t,options:opts,correctIdx:opts.indexOf(it.ok),answerText:it.ok,steps:rows(it.steps),tip:`Was steht bei ${it.t} dabei? Nimm die Gegenoperation, auf beiden Seiten.`});
}
function mkApp(ctx,formula,ask,given,unit,answer,tol,r,tip,fine,shown){
  return Q({mode:'formula',ctx,eq:formula,target:ask,label:'Berechne '+ask,given,pre:ask+' =',unit,answer,tol,fine:fine||'',
    answerText:`${ask} ${shown||('= '+fmt(answer))} ${unit}`,steps:rows(r),tip});
}
const TIP5='Erst die Formel nach der gesuchten Größe umstellen, dann die Zahlen einsetzen. Achte auf die Einheiten.';
function gen5(t){
  if(t===0){const fv=pick([0.1,0.2,0.25,0.3,0.4]),n=rnd(3,15)*100,vf=r12(fv*n);
    return mkApp('Vorschubgeschwindigkeit','vf = f · n','n',[['vf',`${fmt(vf)} mm/min`],['f',`${fmt(fv)} mm`]],'1/min',n,0.001,
      [['vf = f · n',': f','Gesucht ist n, also durch f teilen.'],['n = vf / f','','Jetzt die Zahlen einsetzen.'],[`n = ${fmt(vf)} / ${fmt(fv)} = ${fmt(n)} 1/min`]],TIP5);}
  if(t===1){const p=pick([2,4,5,8,10]),A=pick([50,80,100,120,150,200]),F=p*A;
    return mkApp('Druck','p = F / A','A',[['p',`${p} N/mm²`],['F',`${F} N`]],'mm²',A,0.001,
      [['p = F / A','· A','Mal A, damit der Bruch verschwindet.'],['p · A = F',': p','Jetzt durch p teilen.'],['A = F / p'],[`A = ${F} / ${p} = ${A} mm²`]],TIP5);}
  const th=pick([0.5,1,1.5,2,2.5,3,4]),vf=pick([40,60,80,100,120,200]),L=r12(th*vf);
  if(t===2)return mkApp('Hauptzeit','th = L / vf','th',[['L',`${fmt(L)} mm`],['vf',`${vf} mm/min`]],'min',th,0.001,
      [['th = L / vf','','Die Formel ist schon nach th umgestellt.'],[`th = ${fmt(L)} / ${vf} = ${fmt(th)} min`]],TIP5);
  if(t===3)return mkApp('Hauptzeit','th = L / vf','L',[['th',`${fmt(th)} min`],['vf',`${vf} mm/min`]],'mm',L,0.001,
      [['th = L / vf','· vf','Mal vf, damit der Bruch verschwindet.'],['th · vf = L','',ST],['L = th · vf'],[`L = ${fmt(th)} · ${vf} = ${fmt(L)} mm`]],TIP5);
  if(t===4)return mkApp('Hauptzeit','th = L / vf','vf',[['L',`${fmt(L)} mm`],['th',`${fmt(th)} min`]],'mm/min',vf,0.001,
      [['th = L / vf','· vf','Mal vf, damit der Bruch verschwindet.'],['th · vf = L',': th','Jetzt durch th teilen.'],['vf = L / th'],[`vf = ${fmt(L)} / ${fmt(th)} = ${vf} mm/min`]],TIP5);
  if(t===5){const vc=pick([60,80,100,120,150,180,200]),d=pick([16,20,25,32,40,50,63]),n=1000*vc/(Math.PI*d),nr=Math.round(n);
    return mkApp('Schnittgeschwindigkeit','vc = π · d · n / 1000','n',[['vc',`${vc} m/min`],['d',`${d} mm`]],'1/min',nr,n*0.02,
      [['vc = π · d · n / 1000','· 1000','Zuerst den Bruch loswerden.'],['1000 · vc = π · d · n',': (π · d)','Durch das ganze Produkt teilen.'],['n = 1000 · vc / (π · d)','','Jetzt die Zahlen einsetzen.'],[`n = 1000 · ${vc} / (π · ${d}) ≈ ${fmt(nr)} 1/min`]],TIP5,'Auf ganze Zahl runden. Bis 2 % Abweichung zählt als richtig.');}
  const R=pick([10,22,47,100,220]),I=pick([0.1,0.2,0.5,1,2]),U=r12(R*I);
  return mkApp('Ohmsches Gesetz','U = R · I','R',[['U',`${fmt(U)} V`],['I',`${fmt(I)} A`]],'Ω',R,0.001,
    [['U = R · I',': I','Gesucht ist R, also durch I teilen.'],['R = U / I','','Jetzt die Zahlen einsetzen.'],[`R = ${fmt(U)} / ${fmt(I)} = ${R} Ω`]],TIP5);
}
function gen5h(t){
  if(t===0){let L,i,n,f,th;do{L=pick([40,60,80,90,120,150]);i=pick([1,2,3]);n=pick([400,500,600,750,800,1000,1200]);f=pick([0.1,0.15,0.2,0.25,0.3]);th=L*i/(n*f);}while(!(Math.abs(th-Number(th.toFixed(3)))<1e-9&&th>=0.1));
    return mkApp('Hauptzeit beim Drehen','th = L · i / (n · f)','n',[['th',`${fmt(th)} min`],['L',`${L} mm`],['i',`${i} Schnitt${i>1?'e':''}`],['f',`${fmt(f)} mm`]],'1/min',n,0.5,
      [['th = L · i / (n · f)','· (n · f)','Zuerst den Bruch loswerden.'],['th · n · f = L · i',': (th · f)'],['n = L · i / (th · f)','','Jetzt einsetzen.'],[`n = ${L} · ${i} / (${fmt(th)} · ${fmt(f)}) = ${n} 1/min`]],TIP5);}
  if(t===1){let vc,n,d;do{vc=pick([80,100,120,150,180,200,250]);n=pick([500,800,1000,1200,1500,2000]);d=1000*vc/(Math.PI*n);}while(d<8||d>150);
    return mkApp('Schnittgeschwindigkeit','vc = π · d · n / 1000','d',[['vc',`${vc} m/min`],['n',`${n} 1/min`]],'mm',d,d*0.01,
      [['vc = π · d · n / 1000','· 1000'],['1000 · vc = π · d · n',': (π · n)','Durch das ganze Produkt teilen.'],['d = 1000 · vc / (π · n)','','Jetzt einsetzen.'],[`d = 1000 · ${vc} / (π · ${n}) ≈ ${fmt(d,1)} mm`]],TIP5,'Auf eine Kommastelle runden. Bis 1 % Abweichung zählt als richtig.','≈ '+fmt(d,1));}
  if(t===2){let D,L,cd,d;do{D=pick([30,40,50,60,80]);L=pick([20,25,40,50,60,80,100]);cd=pick([5,10,20,50]);d=r12(D-L/cd);}while(d<=0||!nice(d));
    return mkApp('Kegelverjüngung',`C = (D ${M} d) / L`,'d',[['D',`${D} mm`],['L',`${L} mm`],['C',`1 : ${cd}`]],'mm',d,0.005,
      [[`C = (D ${M} d) / L`,'· L'],[`C · L = D ${M} d`,'+ d'],['C · L + d = D',`${M} C · L`],[`d = D ${M} C · L`,'',`C = 1 : ${cd} = ${fmt(1/cd)}`],[`d = ${D} ${M} ${fmt(1/cd)} · ${L} = ${fmt(d)} mm`]],TIP5);}
  if(t===3){const dt=pick([20,25,40,50,60,80,100]),l0=pick([200,250,400,500,800,1000]),dl=r12(l0*0.000012*dt);
    return mkApp('Wärmeausdehnung (Stahl)','Δl = l0 · α · Δt','Δt',[['Δl',`${fmt(dl)} mm`],['l0',`${l0} mm`],['α','0,000012 1/K']],'K',dt,0.05,
      [['Δl = l0 · α · Δt',': (l0 · α)','Durch das ganze Produkt teilen.'],['Δt = Δl / (l0 · α)','','Jetzt einsetzen.'],[`Δt = ${fmt(dl)} / (${l0} · 0,000012) = ${dt} K`]],TIP5);}
  if(t===4){const d=pick([8,10,12,16,20,25,30,40,50]),A=Math.round(Math.PI*d*d/4*100)/100;
    return mkApp('Kreisfläche','A = π · d^{2} / 4','d',[['A',`${fmt(A)} mm²`]],'mm',d,d*0.005,
      [['A = π · d^{2} / 4','· 4'],['4 · A = π · d^{2}',': π'],['4 · A / π = d^{2}','√','Die Wurzel hebt das Quadrat auf.'],['d = √(4 · A / π)'],[`d = √(4 · ${fmt(A)} / π) ≈ ${d} mm`]],TIP5);}
  if(t===5){const I=pick([0.5,1,1.5,2,2.5,3,4,5]),R=pick([2,4,5,8,10,20]),P=r12(R*I*I);
    return mkApp('Elektrische Leistung','P = R · I^{2}','I',[['P',`${fmt(P)} W`],['R',`${R} Ω`]],'A',I,0.005,
      [['P = R · I^{2}',': R'],['P / R = I^{2}','√'],['I = √(P / R)'],[`I = √(${fmt(P)} / ${R}) = ${fmt(I)} A`]],TIP5);}
  const [p,q,s]=pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15]]),k=rnd(1,4),swap=Math.random()<.5,a=(swap?q:p)*k,b=(swap?p:q)*k,c=s*k;
  return mkApp('Satz des Pythagoras','c^{2} = a^{2} + b^{2}','a',[['c',`${c} mm`],['b',`${b} mm`]],'mm',a,0.005,
    [['c^{2} = a^{2} + b^{2}',`${M} b^{2}`],[`c^{2} ${M} b^{2} = a^{2}`,'√'],[`a = √(c^{2} ${M} b^{2})`],[`a = √(${c}^{2} ${M} ${b}^{2}) = √${c*c-b*b} = ${a} mm`]],TIP5);
}

/* =================== 2  POTENZEN =================== */
const times=(b,n)=>Array(n).fill(b).join(' · ');
function pot1(h){
  if(!h){
    const t=rnd(0,3);
    if(t<=1){let a,n,v;do{a=rnd(2,6);n=rnd(2,4);v=a**n;}while(v>1300);
      return Q({eq:`${a}^{${n}} = ?`,label:'Berechne die Potenz',answer:v,answerText:`${a}^{${n}} = ${fmt(v)}`,check:'tail',
        steps:rows([[`${a}^{${n}} = ${times(a,n)}`,'',`Der Exponent ${n} sagt: ${a} wird ${n}-mal mit sich selbst malgenommen.`],[`= ${fmt(v)}`]]),tip:'Der Exponent (die kleine Zahl oben) sagt, wie oft die Basis mit sich selbst malgenommen wird.'});}
    if(t===2){const n=rnd(2,6),v=10**n;
      return Q({eq:`10^{${n}} = ?`,label:'Berechne die Potenz',answer:v,answerText:`10^{${n}} = ${fmt(v)}`,check:'tail',
        steps:rows([[`10^{${n}} = ${fmt(v)}`,'',`Bei 10er-Potenzen gibt der Exponent die Anzahl der Nullen an: ${n} Nullen.`]]),tip:'Zähle die Nullen: 10 hoch 3 hat drei Nullen.'});}
    const a=rnd(2,99),z=Math.random()<.5,v=z?1:a;
    return Q({eq:`${a}^{${z?0:1}} = ?`,label:'Berechne die Potenz',answer:v,answerText:`${a}^{${z?0:1}} = ${v}`,check:'tail',
      steps:rows([[`${a}^{${z?0:1}} = ${v}`,'',z?'Jede Zahl (außer 0) hoch 0 ergibt 1.':'Hoch 1 ändert nichts.']]),tip:'Sonderfälle: hoch 1 und hoch 0.'});
  }
  const t=rnd(0,3);
  if(t===0){let a,n,v;do{a=rnd(2,5);n=rnd(2,5);v=(-a)**n;}while(Math.abs(v)>1100);
    return Q({eq:`(${M}${a})^{${n}} = ?`,label:'Berechne die Potenz',answer:v,answerText:`(${M}${a})^{${n}} = ${fmt(v)}`,check:'tail',
      steps:rows([[`(${M}${a})^{${n}} = ${times(`(${M}${a})`,n)}`,'',n%2?'Ungerader Exponent: Das Ergebnis bleibt negativ.':'Gerader Exponent: Minus mal Minus ergibt Plus.'],[`= ${fmt(v)}`]]),tip:'Mit Klammer wird das Minus mitpotenziert. Zähle, wie viele Minus zusammenkommen.'});}
  if(t===1){const a=rnd(2,5),n=rnd(2,4),v=-(a**n);
    return Q({eq:`${M}${a}^{${n}} = ?`,label:'Berechne die Potenz',answer:v,answerText:`${M}${a}^{${n}} = ${fmt(v)}`,check:'tail',
      steps:rows([[`${M}${a}^{${n}} = ${M}(${times(a,n)})`,'',`Ohne Klammer gehört der Exponent nur zur ${a}. Das Minus kommt erst danach.`],[`= ${fmt(v)}`]]),tip:'Ohne Klammer: erst potenzieren, dann das Minus davor.'});}
  if(t===2){const [a,n]=pick([[2,1],[2,2],[2,3],[4,1],[4,2],[5,1],[5,2],[10,2],[10,3],[8,1],[2,4],[20,1],[25,1]]),v=r12(1/a**n);
    return Q({eq:`${a}^{${M}${n}} = ?`,label:'Berechne die Potenz',answer:v,tol:relTol(v),answerText:`${a}^{${M}${n}} = ${fmt(v)}`,check:'tail',
      steps:rows([[`${a}^{${M}${n}} = 1 / ${a}^{${n}}`,'','Negativer Exponent heißt: Kehrwert bilden.'],[`= 1 / ${fmt(a**n)} = ${fmt(v)}`]]),tip:'Negativer Exponent: 1 durch die Potenz mit positivem Exponenten.',fine:'Als Kommazahl eingeben, z. B. 0,25.'});}
  const [b,n]=pick([[0.5,2],[0.5,3],[1.5,2],[0.2,2],[0.2,3],[0.1,3],[1.2,2],[2.5,2],[0.3,2],[0.4,2]]),v=r12(b**n);
  return Q({eq:`${fmt(b)}^{${n}} = ?`,label:'Berechne die Potenz',answer:v,tol:relTol(v),answerText:`${fmt(b)}^{${n}} = ${fmt(v)}`,check:'tail',
    steps:rows([[`${fmt(b)}^{${n}} = ${times(fmt(b),n)}`,'','Kommazahlen kleiner als 1 werden beim Potenzieren kleiner.'],[`= ${fmt(v)}`]]),tip:'Rechne Schritt für Schritt. Zähle die Kommastellen.'});
}
function expQ(eq,ans,r,tip,base){
  return Q({eq,label:'Fasse zusammen: Welcher Exponent fehlt?',pre:'? =',answer:ans,answerText:`${base}^{${fmt(ans)}}`,steps:rows(r),tip,check:'exp'});
}
function pot2(h){
  const v=pick(['a','b','x','y','z']);
  const P=(e)=>`${v}^{${fmt(e)}}`;
  if(!h){
    const t=rnd(0,3);
    if(t===0){const m=rnd(2,9),n=rnd(2,9);return expQ(`${P(m)} · ${P(n)} = ${v}^{?}`,m+n,[[`${P(m)} · ${P(n)} = ${v}^{${m} + ${n}}`,'','Gleiche Basis malnehmen: Exponenten addieren.'],[`= ${P(m+n)}`]],'Beim Malnehmen mit gleicher Basis werden die Exponenten addiert.',v);}
    if(t===1){const m=rnd(5,12),n=rnd(2,m-1);return expQ(`${P(m)} : ${P(n)} = ${v}^{?}`,m-n,[[`${P(m)} : ${P(n)} = ${v}^{${m} ${M} ${n}}`,'','Gleiche Basis teilen: Exponenten abziehen.'],[`= ${P(m-n)}`]],'Beim Teilen mit gleicher Basis werden die Exponenten abgezogen.',v);}
    if(t===2){const m=rnd(2,5),n=rnd(2,4);return expQ(`(${P(m)})^{${n}} = ${v}^{?}`,m*n,[[`(${P(m)})^{${n}} = ${v}^{${m} · ${n}}`,'','Potenz einer Potenz: Exponenten malnehmen.'],[`= ${P(m*n)}`]],'Eine Potenz wird potenziert: Exponenten malnehmen.',v);}
    const m=rnd(2,8),n=rnd(2,m);
    if(Math.random()<.5)return expQ(`10^{${m}} · 10^{${n}} = 10^{?}`,m+n,[[`10^{${m}} · 10^{${n}} = 10^{${m} + ${n}}`,'','Gleiche Basis 10: Exponenten addieren.'],[`= 10^{${m+n}}`]],'Gleiche Basis malnehmen: Exponenten addieren.','10');
    return expQ(`10^{${m}} : 10^{${n}} = 10^{?}`,m-n,[[`10^{${m}} : 10^{${n}} = 10^{${m} ${M} ${n}}`,'',m===n?'Gleicher Exponent: Das Ergebnis ist 10^{0} = 1.':'Gleiche Basis teilen: Exponenten abziehen.'],[`= 10^{${m-n}}`]],'Gleiche Basis teilen: Exponenten abziehen.','10');
  }
  const t=rnd(0,5);
  if(t===0){const m=rnd(2,9),n=-rnd(2,9);return expQ(`${P(m)} · ${P(n)} = ${v}^{?}`,m+n,[[`${P(m)} · ${P(n)} = ${v}^{${m} + ${par(n)}}`,'','Exponenten addieren, auch wenn einer negativ ist.'],[`= ${P(m+n)}`]],'Exponenten addieren. Plus mal Minus: einfach abziehen.',v);}
  if(t===1){const m=rnd(2,6),n=rnd(m+1,12);return expQ(`${P(m)} : ${P(n)} = ${v}^{?}`,m-n,[[`${P(m)} : ${P(n)} = ${v}^{${m} ${M} ${n}}`,'',`Ein negativer Exponent ist erlaubt: ${v}^{${M}2} = 1 / ${v}^{2}.`],[`= ${P(m-n)}`]],'Exponenten abziehen. Das Ergebnis darf negativ sein.',v);}
  if(t===2){const m=rnd(2,5),n=rnd(2,4);return expQ(`(${P(-m)})^{${n}} = ${v}^{?}`,-m*n,[[`(${P(-m)})^{${n}} = ${v}^{${M}${m} · ${n}}`,'','Exponenten malnehmen. Minus mal Plus ergibt Minus.'],[`= ${P(-m*n)}`]],'Potenz einer Potenz: Exponenten malnehmen, auf das Vorzeichen achten.',v);}
  if(t===3){const m=rnd(2,6),n=rnd(2,6),k=rnd(2,14),e=m+n-k;return expQ(`${P(m)} · ${P(n)} : ${P(k)} = ${v}^{?}`,e,[[`${P(m)} · ${P(n)} : ${P(k)} = ${v}^{${m} + ${n} ${M} ${k}}`,'','Malnehmen: addieren. Teilen: abziehen.'],[`= ${P(e)}`]],'Von links nach rechts: erst addieren, dann abziehen.',v);}
  if(t===4){const n=rnd(2,6);return expQ(`1 / ${P(n)} = ${v}^{?}`,-n,[[`1 / ${P(n)} = ${P(-n)}`,'','Kehrwert: Der Exponent bekommt ein Minus.']],'1 durch eine Potenz ist dasselbe wie ein negativer Exponent.',v);}
  const m=rnd(2,4),n=rnd(2,3),k=rnd(2,9),e=m*n-k;return expQ(`(${P(m)})^{${n}} · ${P(-k)} = ${v}^{?}`,e,[[`(${P(m)})^{${n}} · ${P(-k)} = ${P(m*n)} · ${P(-k)}`,'','Zuerst die Klammer: Exponenten malnehmen.'],[`= ${v}^{${m*n} + (${M}${k})}`,'','Dann malnehmen: Exponenten addieren.'],[`= ${P(e)}`]],'Erst die Klammer, dann malnehmen.',v);
}
function shiftNote(e){return e>0?`Das Komma wandert ${e} Stelle${e>1?'n':''} nach links. Darum ist der Exponent +${e}.`:`Das Komma wandert ${-e} Stelle${e<-1?'n':''} nach rechts. Darum ist der Exponent ${M}${-e}.`;}
function pot3(h){
  const MANT=[1.2,1.5,2.5,3.2,4.5,5,6,7.8,8.4,9.1];
  const typeA=(range)=>{const m=pick(MANT),e=pick(range),N=r12(m*10**e);
    return Q({eq:`${fmt(N)} = ${fmt(m)} · 10^{?}`,label:'Schreibe als Zehnerpotenz: Welcher Exponent fehlt?',answer:e,answerText:`${fmt(N)} = ${fmt(m)} · 10^{${fmt(e)}}`,check:'exp',
      steps:rows([[`${fmt(N)} = ${fmt(m)} · ${fmt(r12(10**e))}`,'',shiftNote(e)],[`= ${fmt(m)} · 10^{${fmt(e)}}`]]),tip:'Zähle, um wie viele Stellen das Komma wandert. Nach links: plus, nach rechts: minus.'});};
  if(!h){
    if(Math.random()<.68)return typeA([-5,-4,-3,-2,-1,2,3,4,5,6]);
    const n=pick([-4,-3,-2,-1,2,3,4,5,6]),v=r12(10**n);
    return Q({eq:`10^{${fmt(n)}} = ?`,label:'Schreibe als Zahl',answer:v,tol:relTol(v),answerText:`10^{${fmt(n)}} = ${fmt(v)}`,check:'tail',
      steps:rows([n>0?[`10^{${n}} = ${fmt(v)}`,'',`Positiver Exponent: eine 1 mit ${n} Nullen.`]:[`10^{${fmt(n)}} = 1 / 10^{${-n}} = ${fmt(v)}`,'',`Negativer Exponent: Die 1 steht an der ${-n}. Stelle nach dem Komma.`]]),tip:'Positiver Exponent: Nullen anhängen. Negativer Exponent: Stellen nach dem Komma.'});
  }
  const t=rnd(0,2);
  if(t===0){const m=pick(MANT),e=pick([-6,-5,-4,-3,-2,2,3,4,5,6,7]),N=r12(m*10**e);
    return Q({eq:`${fmt(m)} · 10^{${fmt(e)}} = ?`,label:'Schreibe als normale Zahl',answer:N,tol:relTol(N),answerText:`${fmt(m)} · 10^{${fmt(e)}} = ${fmt(N)}`,check:'tail',
      steps:rows([[`${fmt(m)} · 10^{${fmt(e)}} = ${fmt(m)} · ${fmt(r12(10**e))}`,'',e>0?`Komma um ${e} Stellen nach rechts schieben.`:`Komma um ${-e} Stellen nach links schieben.`],[`= ${fmt(N)}`]]),tip:'Positiver Exponent: Zahl wird größer, Komma nach rechts. Negativer: Komma nach links.'});}
  if(t===1){let mant,e,N;do{mant=pick([12,34,72,250,0.5,0.25,45,0.8]);e=rnd(-7,7);N=r12(mant*10**e);}while(e===0||N<1e-6||N>1e9||!nice(N));
    return Q({eq:`${fmt(N)} = ${fmt(mant)} · 10^{?}`,label:'Welcher Exponent fehlt?',answer:e,answerText:`${fmt(N)} = ${fmt(mant)} · 10^{${fmt(e)}}`,check:'exp',
      steps:rows([[`${fmt(N)} = ${fmt(mant)} · ${fmt(r12(10**e))}`,'',`Vergleiche ${fmt(mant)} mit ${fmt(N)}: Um wie viele Stellen wandert das Komma?`],[`= ${fmt(mant)} · 10^{${fmt(e)}}`]]),tip:'Hier steht keine Normform. Zähle trotzdem nur die Stellen, um die das Komma wandert.'});}
  return typeA([-7,-6,-5,-4,-3,4,5,6,7,8,9]);
}
function pot4(h){
  if(!h){
    if(Math.random()<.5){const [m1,m2]=pick([[2,3],[2,4],[3,3],[1.5,2],[2,2],[4,2],[3,2],[1.2,3],[2.5,3],[1.5,4]]),e1=rnd(1,8),e2=rnd(1,8),p=r12(m1*m2);
      return Q({eq:`(${fmt(m1)} · 10^{${e1}}) · (${fmt(m2)} · 10^{${e2}}) = ${fmt(p)} · 10^{?}`,label:'Rechne: Welcher Exponent fehlt?',answer:e1+e2,answerText:`${fmt(p)} · 10^{${e1+e2}}`,check:'exp',
        steps:rows([[`(${fmt(m1)} · ${fmt(m2)}) · 10^{${e1} + ${e2}}`,'','Zahlen malnehmen, Exponenten addieren.'],[`= ${fmt(p)} · 10^{${e1+e2}}`]]),tip:'Zahlen malnehmen, Exponenten addieren.'});}
    const [m1,m2]=pick([[8,2],[6,3],[9,3],[8,4],[6,2],[4,2],[9,1.5],[7.5,2.5],[5,2],[8,1.6]]),e1=rnd(3,9),e2=rnd(1,e1-1),q=r12(m1/m2);
    return Q({eq:`(${fmt(m1)} · 10^{${e1}}) : (${fmt(m2)} · 10^{${e2}}) = ${fmt(q)} · 10^{?}`,label:'Rechne: Welcher Exponent fehlt?',answer:e1-e2,answerText:`${fmt(q)} · 10^{${e1-e2}}`,check:'exp',
      steps:rows([[`(${fmt(m1)} : ${fmt(m2)}) · 10^{${e1} ${M} ${e2}}`,'','Zahlen teilen, Exponenten abziehen.'],[`= ${fmt(q)} · 10^{${e1-e2}}`]]),tip:'Zahlen teilen, Exponenten abziehen.'});
  }
  const E=()=>pick([-6,-5,-4,-3,-2,-1,1,2,3,4,5,6]);
  if(Math.random()<.5){const MS=[1.5,2,2.5,3,4,5,6,8],m1=pick(MS),m2=pick(MS),e1=E(),e2=E(),p=r12(m1*m2);let pn=p,e=e1+e2;const norm=p>=10;if(norm){pn=r12(p/10);e+=1;}
    const r=[[`(${fmt(m1)} · ${fmt(m2)}) · 10^{${fmt(e1)} + ${par(e2)}}`,'','Zahlen malnehmen, Exponenten addieren.'],[`= ${fmt(p)} · 10^{${fmt(e1+e2)}}`]];
    if(norm)r.push([`= ${fmt(pn)} · 10^{${fmt(e)}}`,'',`${fmt(p)} = ${fmt(pn)} · 10^{1}. Vor dem Komma darf nur eine Ziffer stehen, darum wird der Exponent um 1 größer.`]);
    return Q({eq:`(${fmt(m1)} · 10^{${fmt(e1)}}) · (${fmt(m2)} · 10^{${fmt(e2)}}) = ${fmt(pn)} · 10^{?}`,label:'Rechne in Normform: Welcher Exponent fehlt?',answer:e,answerText:`${fmt(pn)} · 10^{${fmt(e)}}`,check:'exp',steps:rows(r),tip:'Malnehmen, Exponenten addieren. Ist die Zahl vorne 10 oder größer, Komma verschieben und Exponent anpassen.'});}
  const [m1,m2]=pick([[2,5],[3,6],[1.5,3],[4,8],[6,4],[8,5],[3,4],[2,8],[5,2],[6,8],[9,6]]),e1=E(),e2=E(),q=r12(m1/m2);let qn=q,e=e1-e2;const norm=q<1;if(norm){qn=r12(q*10);e-=1;}
  const r=[[`(${fmt(m1)} : ${fmt(m2)}) · 10^{${fmt(e1)} ${M} ${par(e2)}}`,'','Zahlen teilen, Exponenten abziehen.'],[`= ${fmt(q)} · 10^{${fmt(e1-e2)}}`]];
  if(norm)r.push([`= ${fmt(qn)} · 10^{${fmt(e)}}`,'',`${fmt(q)} = ${fmt(qn)} · 10^{${M}1}. Darum wird der Exponent um 1 kleiner.`]);
  return Q({eq:`(${fmt(m1)} · 10^{${fmt(e1)}}) : (${fmt(m2)} · 10^{${fmt(e2)}}) = ${fmt(qn)} · 10^{?}`,label:'Rechne in Normform: Welcher Exponent fehlt?',answer:e,answerText:`${fmt(qn)} · 10^{${fmt(e)}}`,check:'exp',steps:rows(r),tip:'Teilen, Exponenten abziehen. Minus minus wird plus. Ist die Zahl vorne kleiner als 1, Komma verschieben.'});
}
const PRE={G:9,M:6,k:3,h:2,'':0,d:-1,c:-2,m:-3,'µ':-6,n:-9};
const PNAME={G:'Giga',M:'Mega',k:'Kilo',h:'Hekto',d:'Dezi',c:'Zenti',m:'Milli','µ':'Mikro',n:'Nano'};
function pot5(h){
  if(!h){
    const [p,u]=pick([['k','m'],['m','m'],['µ','m'],['n','m'],['k','Pa'],['M','Pa'],['h','Pa'],['k','W'],['M','W'],['G','W'],['k','Hz'],['M','Hz'],['k','g'],['m','g'],['k','Ω'],['M','Ω'],['m','A'],['µ','A'],['k','N'],['m','s'],['µ','s'],['k','V'],['m','V'],['c','m']]),e=PRE[p];
    if(Math.random()<.7)return Q({eq:`1 ${p}${u} = 10^{?} ${u}`,label:'Welcher Exponent gehört zur Vorsilbe?',answer:e,answerText:`1 ${p}${u} = 10^{${fmt(e)}} ${u}`,check:'exp',
      steps:rows([[`1 ${p}${u} = 10^{${fmt(e)}} ${u}`,'',`${p} heißt ${PNAME[p]} und bedeutet 10^{${fmt(e)}} = ${fmt(r12(10**e))}.`]]),tip:'Kilo, Mega, Giga: 3, 6, 9. Milli, Mikro, Nano: −3, −6, −9.'});
    return Q({eq:`1 ${u} = 10^{?} ${p}${u}`,label:'Umgekehrt: Welcher Exponent fehlt?',answer:-e,answerText:`1 ${u} = 10^{${fmt(-e)}} ${p}${u}`,check:'exp',
      steps:rows([[`1 ${p}${u} = 10^{${fmt(e)}} ${u}`,'',`${p} (${PNAME[p]}) bedeutet 10^{${fmt(e)}}.`],[`1 ${u} = 10^{${fmt(-e)}} ${p}${u}`,'','Umgekehrt dreht der Exponent sein Vorzeichen.']]),tip:'Erst die Vorsilbe übersetzen, dann das Vorzeichen umdrehen.'});
  }
  if(Math.random()<.3){const [p,u]=pick([['G','W'],['M','Pa'],['k','N'],['µ','m'],['n','m'],['m','A'],['M','Hz']]),v=pick([1.5,2.5,3.5,4.7,6.8,8.2]),e=PRE[p];
    return Q({eq:`${fmt(v)} ${p}${u} = ${fmt(v)} · 10^{?} ${u}`,label:'Welcher Exponent fehlt?',answer:e,answerText:`${fmt(v)} ${p}${u} = ${fmt(v)} · 10^{${fmt(e)}} ${u}`,check:'exp',
      steps:rows([[`${fmt(v)} ${p}${u} = ${fmt(v)} · 10^{${fmt(e)}} ${u}`,'',`${p} heißt ${PNAME[p]} = 10^{${fmt(e)}}. Die Vorsilbe wird durch die Zehnerpotenz ersetzt.`]]),tip:'Ersetze die Vorsilbe durch ihre Zehnerpotenz.'});}
  let p1,p2,u,v,d,ans;
  do{[p1,p2,u]=pick([['k','','Ω'],['m','µ','m'],['n','µ','m'],['M','k','Pa'],['µ','m','m'],['G','M','W'],['k','M','W'],['m','','A'],['','k','N'],['M','','Pa'],['m','','s'],['k','m','m'],['','m','V'],['M','k','Hz']]);
    v=pick([0.06,0.25,0.5,1.2,2.5,3.5,4.7,15,60,250,400,2500]);d=PRE[p1]-PRE[p2];ans=r12(v*10**d);}while(ans<1e-4||ans>1e7||!nice(ans));
  const U1=p1+u,U2=p2+u;
  return Q({eq:`${fmt(v)} ${U1} = ? ${U2}`,label:'Rechne um',unit:U2,answer:ans,tol:relTol(ans),answerText:`${fmt(v)} ${U1} = ${fmt(ans)} ${U2}`,check:'tail',
    steps:rows([[`1 ${U1} = 10^{${fmt(d)}} ${U2}`,'',`${p1?p1+' = 10^{'+fmt(PRE[p1])+'}':'Grundeinheit = 10^{0}'}, ${p2?p2+' = 10^{'+fmt(PRE[p2])+'}':'Grundeinheit = 10^{0}'}. Exponent: ${fmt(PRE[p1])} ${M} ${par(PRE[p2])} = ${fmt(d)}.`],[`${fmt(v)} ${U1} = ${fmt(v)} · 10^{${fmt(d)}} ${U2}`],[`= ${fmt(ans)} ${U2}`]]),tip:'Exponent der ersten Vorsilbe minus Exponent der zweiten. Dann das Komma um so viele Stellen verschieben.'});
}

/* =================== 3  EINHEITEN =================== */
const U_LEN={km:1e6,m:1000,dm:100,cm:10,mm:1,'µm':0.001};
const U_AREA={'m²':1e6,'dm²':1e4,'cm²':100,'mm²':1};
const U_VOL={'m³':1e9,'dm³':1e6,'l':1e6,'cm³':1e3,'ml':1e3,'mm³':1};
const U_TIME={h:3600,min:60,s:1};
const U_SPEED={'m/s':1,'m/min':1/60,'km/h':1/3.6,'mm/min':1/60000};
const U_FORCE={N:1,kN:1000,MN:1e6};
const U_MASS={mg:0.001,g:1,kg:1000,t:1e6};
const U_PRESS={Pa:1,hPa:100,kPa:1000,bar:1e5,MPa:1e6,'N/mm²':1e6,'N/cm²':1e4};
const U_INCH={Zoll:25.4,mm:1};
const NOTE={
  len:'Bei Längen: Faktor 10 pro Stufe (mm, cm, dm, m), 1000 von m zu km und von mm zu µm.',
  area:'Bei Flächen: Faktor 100 pro Stufe, weil 10 · 10.',
  vol:'Bei Volumen: Faktor 1000 pro Stufe, weil 10 · 10 · 10. 1 dm³ = 1 l und 1 cm³ = 1 ml.',
  time:'Bei der Zeit ist der Faktor 60, nicht 100.',
  speed:'1 m/s = 60 m/min, weil 1 min = 60 s. Und 1 m/s = 3,6 km/h.',
  force:'1 kN = 1000 N.',mass:'1 t = 1000 kg, 1 kg = 1000 g, 1 g = 1000 mg.',
  press:'1 bar = 100 000 Pa = 10 N/cm² = 0,1 N/mm². 1 N/mm² = 1 MPa.',inch:'1 Zoll = 25,4 mm.'
};
const VN=[0.5,1.2,2.5,3,4.8,7.5,12,25,40,85,125,250,600,1500,2400];
const VH=[0.002,0.035,0.04,0.25,0.8,1.25,1.75,3.75,12.5,48,78.5,250,314,1250,3500,12500,45000];
function conv(tab,nk,pairs,vals,tipX){
  let from,to,val,ans,k;
  for(let g=0;g<400;g++){
    [from,to]=pick(pairs);val=pick(vals);k=tab[from]/tab[to];ans=r12(val*k);
    if(nice(ans)&&Math.abs(ans)>=1e-6&&Math.abs(ans)<=1e9&&(k===1||ans!==val))break;
  }
  let r;
  if(Math.abs(k-1)<1e-12)r=[[`1 ${from} = 1 ${to}`,'','Beide Einheiten sind gleich groß.'],[`${fmt(val)} ${from} = ${fmt(ans)} ${to}`]];
  else if(k>1)r=[[`1 ${from} = ${fmt(k)} ${to}`,'',NOTE[nk]],[`${fmt(val)} ${from} = ${fmt(val)} · ${fmt(k)} ${to}`,'','Große Einheit in kleine: mal. Die Zahl wird größer.'],[`= ${fmt(ans)} ${to}`]];
  else r=[[`1 ${to} = ${fmt(1/k)} ${from}`,'',NOTE[nk]],[`${fmt(val)} ${from} = ${fmt(val)} : ${fmt(1/k)} ${to}`,'','Kleine Einheit in große: geteilt. Die Zahl wird kleiner.'],[`= ${fmt(ans)} ${to}`]];
  return Q({eq:`${fmt(val)} ${from} = ? ${to}`,label:'Rechne um',unit:to,answer:ans,tol:relTol(ans),answerText:`${fmt(val)} ${from} = ${fmt(ans)} ${to}`,steps:rows(r),
    tip:tipX||'Große Einheit in kleine: mal. Kleine Einheit in große: geteilt. Welche Umrechnungszahl gilt?',check:'tail'});
}
const ein1=h=>h?conv(U_LEN,'len',[['km','mm'],['mm','km'],['µm','m'],['m','µm'],['µm','cm'],['cm','µm'],['dm','mm'],['mm','dm'],['dm','µm'],['km','cm']],VH)
  :conv(U_LEN,'len',[['m','mm'],['mm','m'],['cm','mm'],['mm','cm'],['m','cm'],['cm','m'],['km','m'],['m','km'],['dm','cm'],['mm','µm'],['µm','mm']],VN);
const ein2=h=>h?conv(U_AREA,'area',[['m²','mm²'],['mm²','m²'],['dm²','mm²'],['mm²','dm²'],['mm²','cm²'],['cm²','m²']],VH)
  :conv(U_AREA,'area',[['cm²','mm²'],['mm²','cm²'],['m²','cm²'],['cm²','m²'],['dm²','cm²'],['cm²','dm²'],['m²','dm²']],VN);
const ein3=h=>h?conv(U_VOL,'vol',[['m³','cm³'],['cm³','m³'],['mm³','l'],['l','mm³'],['ml','m³'],['m³','ml'],['mm³','ml'],['dm³','mm³']],VH)
  :conv(U_VOL,'vol',[['dm³','cm³'],['cm³','dm³'],['l','ml'],['ml','l'],['dm³','l'],['cm³','ml'],['m³','dm³'],['m³','l'],['l','m³'],['cm³','mm³']],VN);
function ein4(h){
  if(!h){
    if(Math.random()<.5)return conv(U_TIME,'time',[['h','min'],['min','h'],['min','s'],['s','min'],['h','s']],[0.25,0.5,0.75,1.5,2,2.5,3,90,120,150,180,240,300,450,7200]);
    return conv(U_SPEED,'speed',[['m/min','m/s'],['m/s','m/min'],['km/h','m/s'],['m/s','km/h']],[1.5,2,2.5,5,10,15,18,30,36,54,72,90,120,150,180,240,300]);
  }
  const t=rnd(0,2);
  if(t===0){const hh=rnd(1,4),mm=pick([6,12,15,18,24,30,36,42,45,48,54]),ans=r12(hh+mm/60);
    return Q({eq:`${hh} h ${mm} min = ? h`,label:'Rechne in Stunden mit Komma um',unit:'h',answer:ans,tol:relTol(ans),answerText:`${hh} h ${mm} min = ${fmt(ans)} h`,check:'tail',
      steps:rows([[`${mm} min = ${mm} : 60 h = ${fmt(mm/60)} h`,'','Minuten in Stunden: durch 60.'],[`${hh} h + ${fmt(mm/60)} h = ${fmt(ans)} h`,'',`Achtung: ${hh} h ${mm} min ist nicht ${hh},${mm} h.`]]),tip:'Nur die Minuten umrechnen: durch 60. Dann zu den Stunden dazuzählen.'});}
  if(t===1)return conv(U_TIME,'time',[['h','min'],['min','h'],['min','s'],['s','h'],['h','s']],[0.05,0.4,1.35,1.75,2.2,3.25,45,81,105,5400,9000]);
  return conv(U_SPEED,'speed',[['mm/min','m/s'],['m/s','mm/min'],['m/min','m/s'],['km/h','m/s'],['m/s','km/h']],[0.2,0.5,0.9,1.25,4.5,7.5,13.5,45,75,135,210,300,600,1200,1800,3000,4500]);
}
function ein5(h){
  if(!h){const t=rnd(0,3);
    if(t===0)return conv(U_FORCE,'force',[['kN','N'],['N','kN']],VN);
    if(t===1)return conv(U_MASS,'mass',[['kg','t'],['t','kg'],['g','kg'],['kg','g']],VN);
    if(t===2)return conv(U_PRESS,'press',[['bar','Pa'],['Pa','bar'],['MPa','N/mm²'],['N/mm²','MPa'],['bar','N/cm²'],['N/cm²','bar']],[0.5,1.5,2,4,6,8,10,12,20,25,60,80,120,250000,600000]);
    return conv(U_INCH,'inch',[['Zoll','mm']],[0.25,0.5,1,1.5,2,3,4]);}
  const t=rnd(0,3);
  if(t===0)return conv(U_PRESS,'press',[['bar','N/mm²'],['N/mm²','bar'],['N/cm²','N/mm²'],['N/mm²','N/cm²'],['MPa','bar'],['bar','kPa'],['kPa','bar']],[0.5,1.5,2.5,6,8,12,35,60,150,250,400,800]);
  if(t===1)return conv(U_MASS,'mass',[['mg','kg'],['kg','mg'],['t','g'],['g','t'],['mg','g']],VH);
  if(t===2){const [n,d]=pick([[1,4],[3,8],[1,2],[5,8],[3,4],[1,8],[3,16],[5,16]]),ans=r12(n/d*25.4);
    return Q({eq:`${n}/${d} Zoll = ? mm`,label:'Rechne Zoll in mm um',unit:'mm',answer:ans,tol:0.002,answerText:`${n}/${d} Zoll = ${fmt(ans)} mm`,check:'tail',
      steps:rows([[`${n}/${d} Zoll = ${n}/${d} · 25,4 mm`,'',`1 Zoll = 25,4 mm. ${n}/${d} = ${fmt(n/d)}.`],[`= ${fmt(n/d)} · 25,4 mm = ${fmt(ans)} mm`]]),tip:'Bruch in Kommazahl umwandeln, dann mal 25,4.'});}
  return conv(U_INCH,'inch',[['mm','Zoll']],[6.35,12.7,19.05,25.4,38.1,50.8,63.5,76.2,101.6]);
}

/* =================== 4  WINKELFUNKTIONEN =================== */
const LAYOUTS=[
  {P:[20,150],Q:[220,40],R:[220,150]},
  {P:[250,150],Q:[30,40],R:[30,150]},
  {P:[20,150],Q:[240,150],R:[75,54.7]},
  {P:[30,150],Q:[250,40],R:[30,40]}
];
const GREEK={A:'α',B:'β',C:'γ'};
const RN={GK:'Gegenkathete',AK:'Ankathete',H:'Hypotenuse'};
const FN={sin:['GK','H'],cos:['AK','H'],tan:['GK','AK']};
const FNAME={sin:'Sinus',cos:'Kosinus',tan:'Tangens'};
const D2R=Math.PI/180,TRIG={sin:Math.sin,cos:Math.cos,tan:Math.tan},ATRIG={sin:Math.asin,cos:Math.acos,tan:Math.atan};
function triSetup(h){
  const lay=h?rnd(0,3):rnd(0,1);
  let nm={P:'A',Q:'B',R:'C'};
  if(h){const l=shuffle(['A','B','C']);nm={P:l[0],Q:l[1],R:l[2]};}
  return {lay,nm};
}
function roles(t,Tk){
  const O=Tk==='P'?'Q':'P',low=k=>t.nm[k].toLowerCase();
  return {A:GREEK[t.nm[Tk]],Ao:GREEK[t.nm[O]],GK:low(Tk),AK:low(O),H:low('R')};
}
function fnFor(a,b){const s=[a,b].sort().join();return s==='GK,H'?'sin':s==='AK,H'?'cos':'tan';}
function triSVG(t,hl){
  hl=hl||{};
  const L=LAYOUTS[t.lay],V={P:L.P,Q:L.Q,R:L.R};
  const cen=[(L.P[0]+L.Q[0]+L.R[0])/3,(L.P[1]+L.Q[1]+L.R[1])/3];
  const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],add=(a,b)=>[a[0]+b[0],a[1]+b[1]],mul=(a,k)=>[a[0]*k,a[1]*k];
  const nrm=a=>{const l=Math.hypot(a[0],a[1])||1;return [a[0]/l,a[1]/l];};
  const f=n=>Math.round(n*10)/10,P=p=>f(p[0])+' '+f(p[1]);
  const out=[],box=[],keep=(p,hw,hh)=>box.push([p[0]-hw,p[1]-hh,p[0]+hw,p[1]+hh]);
  const txt=(p,cls,s)=>`<text class="${cls}" x="${f(p[0])}" y="${f(p[1])}" text-anchor="middle" dominant-baseline="central">${s}</text>`;
  ['P','Q','R'].forEach(k=>keep(V[k],2,2));
  out.push(`<polygon class="t-area" points="${P(V.P)} ${P(V.Q)} ${P(V.R)}"/>`);
  const u=nrm(sub(V.P,V.R)),w=nrm(sub(V.Q,V.R)),s=13;
  const a1=add(V.R,mul(u,s)),a2=add(a1,mul(w,s)),a3=add(V.R,mul(w,s));
  out.push(`<path class="t-mark" d="M${P(a1)} L${P(a2)} L${P(a3)}"/>`);
  const dot=add(V.R,mul(add(u,w),s/2));out.push(`<circle class="t-dot" cx="${f(dot[0])}" cy="${f(dot[1])}" r="1.7"/>`);
  ['P','Q'].forEach(k=>{
    const o=k==='P'?'Q':'P',du=nrm(sub(V[o],V[k])),dw=nrm(sub(V.R,V[k]));
    const th=Math.acos(Math.max(-1,Math.min(1,du[0]*dw[0]+du[1]*dw[1])));
    const g=GREEK[t.nm[k]],st=hl[g]||'',r=24,s1=add(V[k],mul(du,r)),s2=add(V[k],mul(dw,r));
    const cross=du[0]*dw[1]-du[1]*dw[0];
    out.push(`<path class="t-arc ${st}" d="M${P(s1)} A${r} ${r} 0 0 ${cross>0?1:0} ${P(s2)}"/>`);
    const bis=nrm(add(du,dw)),dist=Math.min(62,Math.max(38,11/Math.sin(th/2)+6)),pos=add(V[k],mul(bis,dist));
    out.push(txt(pos,'t-ang '+st,g));keep(pos,7,9);
  });
  [['P','Q','R'],['Q','R','P'],['R','P','Q']].forEach(([a,b,o])=>{
    const letter=t.nm[o].toLowerCase(),st=hl[letter]||'';
    out.push(`<line class="t-side ${st}" x1="${f(V[a][0])}" y1="${f(V[a][1])}" x2="${f(V[b][0])}" y2="${f(V[b][1])}"/>`);
    const mid=mul(add(V[a],V[b]),.5),d=nrm(sub(V[b],V[a]));let n=[-d[1],d[0]];
    const tc=sub(mid,cen);if(n[0]*tc[0]+n[1]*tc[1]<0)n=mul(n,-1);
    const hw=6,hh=9,pos=add(mid,mul(n,7+hw*Math.abs(n[0])+hh*Math.abs(n[1])));
    out.push(txt(pos,'t-lab '+st,letter));keep(pos,hw,hh);
  });
  ['P','Q','R'].forEach(k=>{const d=nrm(sub(V[k],cen)),pos=add(V[k],mul(d,14));out.push(txt(pos,'t-vtx',t.nm[k]));keep(pos,5,7);});
  const x0=Math.min(...box.map(b=>b[0]))-4,y0=Math.min(...box.map(b=>b[1]))-4,x1=Math.max(...box.map(b=>b[2]))+4,y1=Math.max(...box.map(b=>b[3]))+4;
  const hyp=t.nm.R.toLowerCase();
  return `<svg class="tri" viewBox="${f(x0)} ${f(y0)} ${f(x1-x0)} ${f(y1-y0)}" role="img" aria-label="Rechtwinkliges Dreieck, rechter Winkel bei ${t.nm.R}, Hypotenuse ${hyp}">${out.join('')}</svg>`;
}
const TRI_FINE='Skizze, nicht maßstäblich.';
function win1(h){
  const t=triSetup(h),Tk=pick(['P','Q']),r=roles(t,Tk),A=r.A;
  const base=[['H',`Hypotenuse = ${r.H}`,'Sie liegt gegenüber vom rechten Winkel und ist die längste Seite.'],['GK',`Gegenkathete von ${A} = ${r.GK}`,`Sie liegt gegenüber von ${A}.`],['AK',`Ankathete von ${A} = ${r.AK}`,`Sie liegt am Winkel ${A} an und ist nicht die Hypotenuse.`]];
  if(Math.random()<.45){
    const ask=pick(['GK','AK','H']),opts=shuffle([r.GK,r.AK,r.H]);
    const st=base.filter(b=>b[0]!==ask).concat(base.filter(b=>b[0]===ask)).map(b=>[b[1],'',b[2]]);
    return Q({kind:'mc',eq:ask==='H'?'Hypotenuse = ?':`${RN[ask]} von ${A} = ?`,label:ask==='H'?'Welche Seite ist die Hypotenuse?':`Welche Seite ist die ${RN[ask]} vom Winkel ${A}?`,
      options:opts,correctIdx:opts.indexOf(r[ask]),answerText:ask==='H'?`Hypotenuse = ${r.H}`:`${RN[ask]} von ${A} = ${r[ask]}`,steps:rows(st),
      fig:triSVG(t,{[A]:'target'}),figNote:TRI_FINE,tip:'Hypotenuse: gegenüber vom rechten Winkel. Gegenkathete: gegenüber vom Winkel. Ankathete: liegt am Winkel an.'});
  }
  const fn=pick(['sin','cos','tan']),[num,den]=FN[fn],ok=`${r[num]} / ${r[den]}`;
  const cand=[`${r.GK} / ${r.H}`,`${r.AK} / ${r.H}`,`${r.GK} / ${r.AK}`,`${r.AK} / ${r.GK}`,`${r.H} / ${r.GK}`,`${r.H} / ${r.AK}`].filter(c=>c!==ok);
  const opts=shuffle([ok,...shuffle(cand).slice(0,3)]);
  return Q({kind:'mc',eq:`${fn} ${A} = ?`,label:`Was ist ${fn} ${A}?`,options:opts,correctIdx:opts.indexOf(ok),answerText:`${fn} ${A} = ${ok}`,
    steps:rows([[`Gegenkathete ${r.GK}, Ankathete ${r.AK}, Hypotenuse ${r.H}`,'',`Alle Seiten vom Winkel ${A} aus gesehen.`],[`${fn} = ${RN[num]} / ${RN[den]}`,'','Merksatz GAGA HHAG: G/H, A/H, G/A.'],[`${fn} ${A} = ${ok}`]]),
    fig:triSVG(t,{[A]:'target'}),figNote:TRI_FINE,tip:'sin = Gegenkathete / Hypotenuse, cos = Ankathete / Hypotenuse, tan = Gegenkathete / Ankathete.'});
}
function win2(h){
  const t=triSetup(h),Tk=pick(['P','Q']),r=roles(t,Tk),A=r.A;
  const [K,U]=pick(h?[['H','GK'],['H','AK'],['AK','GK'],['GK','H'],['AK','H'],['GK','AK']]:[['H','GK'],['H','AK'],['AK','GK']]);
  const th=h?(Math.random()<.5?rnd(15,75):rnd(15,74)+0.5):rnd(20,70);
  const kv=h?(Math.random()<.5?rnd(20,160):rnd(41,299)/2):rnd(25,150);
  const fn=fnFor(K,U),[num,den]=FN[fn],val=TRIG[fn](th*D2R),uNum=U===num,ans=uNum?kv*val:kv/val;
  const Kl=r[K],Ul=r[U];
  const st=[[`${fn} ${A} = ${r[num]} / ${r[den]}`,uNum?`· ${Kl}`:`· ${Ul}`,`Gegeben: ${Kl} (${RN[K]}) und ${A}. Gesucht: ${Ul} (${RN[U]}). ${RN[num]} und ${RN[den]} gehören zum ${FNAME[fn]}.`]];
  if(uNum)st.push([`${Ul} = ${Kl} · ${fn} ${A}`,'',`Umgestellt nach ${Ul}.`]);
  else{st.push([`${Ul} · ${fn} ${A} = ${Kl}`,`: ${fn} ${A}`]);st.push([`${Ul} = ${Kl} / ${fn} ${A}`]);}
  st.push([`${Ul} = ${fmt(kv)} ${uNum?'·':'/'} ${fn} ${fmt(th)}° ≈ ${fmt(ans,2)} mm`]);
  return Q({eq:`${Ul} = ?`,label:`Berechne die Seite ${Ul}`,given:[[A,`${fmt(th)}°`],[Kl,`${fmt(kv)} mm`]],pre:`${Ul} =`,unit:'mm',answer:ans,tol:Math.max(0.05,ans*0.005),
    answerText:`${Ul} ≈ ${fmt(ans,2)} mm`,steps:rows(st),fig:triSVG(t,{[A]:'given',[Kl]:'given',[Ul]:'target'}),figNote:TRI_FINE,
    fine:'Taschenrechner auf DEG. Auf zwei Kommastellen runden.',tip:`Sieh vom Winkel ${A} aus: Ist ${Kl} Gegenkathete, Ankathete oder Hypotenuse? Und ${Ul}? Daraus folgt sin, cos oder tan.`,
    meta:{w:2,th,K,U,kv}});
}
function win3(h){
  const t=triSetup(h),Tk=pick(['P','Q']),r=roles(t,Tk),A=r.A,fn=pick(['sin','cos','tan']),[num,den]=FN[fn];
  let vn,vd;
  if(fn==='tan'){vn=rnd(10,150);vd=rnd(10,150);if(h){vn+=pick([0,0.5]);vd+=pick([0,0.5]);}}
  else{vd=rnd(40,200);vn=rnd(Math.ceil(vd*0.12),Math.floor(vd*0.95));if(h)vd+=0.5;}
  const ratio=vn/vd,th=ATRIG[fn](ratio)/D2R,other=h&&Math.random()<.4,tgt=other?r.Ao:A,ans=other?90-th:th;
  const st=[[`${fn} ${A} = ${r[num]} / ${r[den]}`,'',`Vom Winkel ${A} aus: ${r[num]} ist die ${RN[num]}, ${r[den]} die ${RN[den]}. Das passt zum ${FNAME[fn]}.`],
    [`${fn} ${A} = ${fmt(vn)} / ${fmt(vd)} ≈ ${fmt(ratio,4)}`],[`${A} = ${fn}^{${M}1}(${fmt(ratio,4)})`,'',`Umkehrfunktion: am Taschenrechner SHIFT und ${fn}.`],[`${A} ≈ ${fmt(th,2)}°`]];
  if(other)st.push([`${r.Ao} = 90° ${M} ${A} ≈ ${fmt(90-th,2)}°`,'',`Im rechtwinkligen Dreieck ergeben die zwei spitzen Winkel zusammen 90°.`]);
  return Q({eq:`${tgt} = ?`,label:`Berechne den Winkel ${tgt}`,given:[[r[num],`${fmt(vn)} mm`],[r[den],`${fmt(vd)} mm`]],pre:`${tgt} =`,unit:'°',answer:ans,tol:0.1,
    answerText:`${tgt} ≈ ${fmt(ans,2)}°`,steps:rows(st),fig:triSVG(t,{[tgt]:'target',[r[num]]:'given',[r[den]]:'given'}),figNote:TRI_FINE,
    fine:'Taschenrechner auf DEG. Auf zwei Kommastellen runden, bis 0,1° Abweichung zählt als richtig.',
    tip:`Welche zwei Seiten sind gegeben, vom Winkel aus gesehen? Dann die passende Umkehrfunktion: sin^{${M}1}, cos^{${M}1} oder tan^{${M}1}.`,meta:{w:3,fn,vn,vd,other}});
}
function wq(o){return Q(Object.assign({fine:'Taschenrechner auf DEG. Auf zwei Kommastellen runden.'},o));}
function win4(h){
  if(!h){
    const t=rnd(0,3);
    if(t===0){const L=pick([100,200]),a=pick([5,8,10,12,15,18,20,25,30,35]),hh=L*Math.sin(a*D2R);
      return wq({ctx:'Sinuslineal',eq:'h = ?',label:'Wie hoch muss der Endmaß-Stapel sein?',given:[['L (Rollenabstand)',`${L} mm`],['α',`${a}°`]],pre:'h =',unit:'mm',answer:hh,tol:0.01,
        answerText:`h ≈ ${fmt(hh,3)} mm`,fine:'Taschenrechner auf DEG. Auf drei Kommastellen runden.',
        steps:rows([['sin α = h / L','· L','h ist die Gegenkathete von α, der Rollenabstand L die Hypotenuse.'],['h = L · sin α'],[`h = ${L} · sin ${a}° ≈ ${fmt(hh,3)} mm`]]),tip:'Beim Sinuslineal ist L die Hypotenuse und h die Gegenkathete.'});}
    if(t===1){const D=pick([30,40,50,60,80]),d=D-pick([4,6,8,10,12,16,20]),L=pick([30,40,50,60,80,100]),q=(D-d)/(2*L),a=Math.atan(q)/D2R;
      return wq({ctx:'Kegeldrehen',eq:'α/2 = ?',label:'Berechne den Einstellwinkel α/2',given:[['D',`${D} mm`],['d',`${d} mm`],['L',`${L} mm`]],pre:'α/2 =',unit:'°',answer:a,tol:0.1,
        answerText:`α/2 ≈ ${fmt(a,2)}°`,steps:rows([[`tan(α/2) = (D ${M} d) / (2 · L)`,'','Der halbe Durchmesserunterschied ist die Gegenkathete, die Kegellänge L die Ankathete.'],[`tan(α/2) = (${D} ${M} ${d}) / (2 · ${L}) = ${fmt(q,4)}`],[`α/2 = tan^{${M}1}(${fmt(q,4)}) ≈ ${fmt(a,2)}°`]]),
        tip:'Den Oberschlitten stellst du auf den halben Kegelwinkel. Gegenkathete: (D − d) / 2.'});}
    if(t===2){const D=pick([60,80,100,120,150]),ph=pick([30,36,45,60,72,20,40]),xy=pick(['X','Y']),r=D/2,v=r*(xy==='X'?Math.cos(ph*D2R):Math.sin(ph*D2R)),fn=xy==='X'?'cos':'sin';
      return wq({ctx:'Lochkreis (CNC-Koordinaten)',eq:`${xy} = ?`,label:`Berechne die ${xy}-Koordinate der Bohrung`,given:[['Lochkreis-Ø',`${D} mm`],['φ',`${ph}°`]],pre:`${xy} =`,unit:'mm',answer:v,tol:0.02,
        answerText:`${xy} ≈ ${fmt(v,2)} mm`,steps:rows([[`r = ${D} / 2 = ${fmt(r)} mm`,'','Der Radius ist die Hypotenuse.'],[`${xy} = r · ${fn} φ`,'',xy==='X'?'X liegt am Winkel φ an: Ankathete, also Kosinus.':'Y liegt gegenüber von φ: Gegenkathete, also Sinus.'],[`${xy} = ${fmt(r)} · ${fn} ${ph}° ≈ ${fmt(v,2)} mm`]]),
        tip:'Mittelpunkt im Nullpunkt: X = r · cos φ, Y = r · sin φ.'});}
    const hh=pick([5,8,10,12,15,20,25,30]),l=pick([40,50,60,80,100,120]),q=hh/l,a=Math.atan(q)/D2R;
    return wq({ctx:'Schräge',eq:'α = ?',label:'Berechne den Neigungswinkel α',given:[['Höhe h',`${hh} mm`],['Länge l (waagrecht)',`${l} mm`]],pre:'α =',unit:'°',answer:a,tol:0.1,
      answerText:`α ≈ ${fmt(a,2)}°`,steps:rows([['tan α = h / l','','Die Höhe ist die Gegenkathete, die waagrechte Länge die Ankathete.'],[`tan α = ${hh} / ${l} = ${fmt(q,4)}`],[`α = tan^{${M}1}(${fmt(q,4)}) ≈ ${fmt(a,2)}°`]]),
      tip:'Höhe und waagrechte Länge sind beide Katheten. Das passt zum Tangens.'});
  }
  const t=rnd(0,4);
  if(t===0){const L=pick([100,200]),hh=pick([10,15,20,25,30,35,40,45,50,12.5,17.5]),q=hh/L,a=Math.asin(q)/D2R;
    return wq({ctx:'Sinuslineal',eq:'α = ?',label:'Welcher Winkel ist eingestellt?',given:[['L (Rollenabstand)',`${L} mm`],['h (Endmaße)',`${fmt(hh)} mm`]],pre:'α =',unit:'°',answer:a,tol:0.05,
      answerText:`α ≈ ${fmt(a,2)}°`,steps:rows([['sin α = h / L','','h ist die Gegenkathete, L die Hypotenuse.'],[`sin α = ${fmt(hh)} / ${L} = ${fmt(q,4)}`],[`α = sin^{${M}1}(${fmt(q,4)}) ≈ ${fmt(a,2)}°`]]),tip:'Gegenkathete durch Hypotenuse, dann sin⁻¹.'});}
  if(t===1){let D,L,a2,d;do{D=pick([30,40,50,60,80]);L=pick([20,30,40,50,60]);a2=pick([2,3,4,5,7.5,10]);d=D-2*L*Math.tan(a2*D2R);}while(d<5);
    return wq({ctx:'Kegeldrehen',eq:'d = ?',label:'Berechne den kleinen Kegeldurchmesser d',given:[['D',`${D} mm`],['L',`${L} mm`],['α/2',`${fmt(a2)}°`]],pre:'d =',unit:'mm',answer:d,tol:0.02,
      answerText:`d ≈ ${fmt(d,2)} mm`,steps:rows([[`tan(α/2) = (D ${M} d) / (2 · L)`,'· (2 · L)'],[`2 · L · tan(α/2) = D ${M} d`,'+ d',`Dann ${M} 2 · L · tan(α/2).`],[`d = D ${M} 2 · L · tan(α/2)`],[`d = ${D} ${M} 2 · ${L} · tan ${fmt(a2)}° ≈ ${fmt(d,2)} mm`]]),
      tip:'Formel tan(α/2) = (D − d) / (2 · L) nach d umstellen.'});}
  if(t===2){let n,k,ph;do{n=pick([5,6,8,9,10,12]);k=rnd(1,n-1);ph=k*360/n;}while(ph%90===0);
    const D=pick([60,80,100,120,150]),r=D/2,xy=pick(['X','Y']),fn=xy==='X'?'cos':'sin',v=r*TRIG[fn](ph*D2R);
    return wq({ctx:'Lochkreis (CNC-Koordinaten)',eq:`${xy} = ?`,label:`Berechne die ${xy}-Koordinate von Bohrung ${k}`,given:[['Lochkreis-Ø',`${D} mm`],['Bohrungen',`${n}, gleichmäßig verteilt`],['Bohrung',`Nr. ${k}`]],pre:`${xy} =`,unit:'mm',answer:v,tol:0.02,
      answerText:`${xy} ≈ ${fmt(v,2)} mm`,fine:'Bohrung 0 liegt bei 0° auf der X-Achse, gezählt gegen den Uhrzeigersinn. Vorzeichen beachten.',
      steps:rows([[`φ = ${k} · 360° / ${n} = ${fmt(ph)}°`,'','Winkel der Bohrung berechnen.'],[`r = ${D} / 2 = ${fmt(r)} mm`],[`${xy} = r · ${fn} φ`,'','Der Taschenrechner liefert das Vorzeichen automatisch mit.'],[`${xy} = ${fmt(r)} · ${fn} ${fmt(ph)}° ≈ ${fmt(v,2)} mm`]]),
      tip:'Erst den Winkel der Bohrung: Nummer · 360° / Anzahl. Dann X = r · cos φ, Y = r · sin φ.'});}
  if(t===3){const [nm,P,d2]=pick([['M6',1,5.35],['M8',1.25,7.188],['M10',1.5,9.026],['M12',1.75,10.863],['M16',2,14.701],['M20',2.5,18.376]]),q=P/(Math.PI*d2),a=Math.atan(q)/D2R;
    return wq({ctx:`Gewinde ${nm}`,eq:'φ = ?',label:'Berechne den Steigungswinkel φ',given:[['Steigung P',`${fmt(P)} mm`],['Flankendurchmesser d2',`${fmt(d2)} mm`]],pre:'φ =',unit:'°',answer:a,tol:0.05,
      answerText:`φ ≈ ${fmt(a,2)}°`,steps:rows([['tan φ = P / (π · d2)','','Abgewickelt ist eine Gewindewindung ein Dreieck: Steigung P gegenüber, Umfang π · d2 anliegend.'],[`tan φ = ${fmt(P)} / (π · ${fmt(d2)}) ≈ ${fmt(q,4)}`],[`φ = tan^{${M}1}(${fmt(q,4)}) ≈ ${fmt(a,2)}°`]]),
      tip:'Wickle eine Windung ab: Gegenkathete P, Ankathete π · d2.'});}
  const [X,Y]=pick([[30,40],[25,60],[48,20],[35,35],[60,25],[20,45],[50,30],[42,18]]),q=Y/X,a=Math.atan(q)/D2R;
  return wq({ctx:'Polarkoordinaten (CNC)',eq:'φ = ?',label:'Unter welchem Winkel liegt der Punkt?',given:[['X',`${X} mm`],['Y',`${Y} mm`]],pre:'φ =',unit:'°',answer:a,tol:0.1,
    answerText:`φ ≈ ${fmt(a,2)}°`,steps:rows([['tan φ = Y / X','','Y liegt gegenüber vom Winkel, X liegt am Winkel an.'],[`tan φ = ${Y} / ${X} ≈ ${fmt(q,4)}`],[`φ = tan^{${M}1}(${fmt(q,4)}) ≈ ${fmt(a,2)}°`]]),
    tip:'Vom Nullpunkt aus: X ist die Ankathete, Y die Gegenkathete.'});
}

/* =================== THEMEN =================== */
const TOPICS=[
 {id:'gl',tab:'Formeln',name:'Gleichungen & Formeln',sub:'Gleichungen lösen, Formeln umstellen und mit Werten rechnen.',levels:[
  {name:'Ein Schritt',desc:'Plus, minus, mal, geteilt: eine Gegenoperation reicht.',ex:'x + 5 = 12',descH:'Ein Schritt mit negativen Zahlen und Kommazahlen.',exH:`${M}4x = 18`,make:h=>uniq(h?gen1h:gen1)},
  {name:'Zwei Schritte',desc:'Erst Plus und Minus wegräumen, dann Mal und Geteilt.',ex:'3x + 4 = 19',descH:'Minus vor dem x, Kommazahlen, Klammer mit Geteilt.',exH:`(x + 3) : 4 = ${M}2`,make:h=>uniq(h?gen2h:gen2)},
  {name:'x auf beiden Seiten',desc:'Klammern, x links und rechts, Minus vor dem x.',ex:'5x + 3 = 2x + 9',descH:'Klammern auflösen, Minus vor der Klammer, Brüche.',exH:'x/2 + x/3 = 10',make:h=>uniq(h?gen3h:gen3)},
  {name:'Formeln umstellen',desc:'Buchstaben statt Zahlen. Wähle die richtige Umstellung.',ex:'n = 1000 · vc / (π · d)',descH:'Formeln mit Quadrat, Wurzel und Klammern.',exH:'d = √(4 · A / π)',make:h=>shuffle(h?BANKH:BANK).slice(0,N_Q).map(mkMC)},
  {name:'Aus der Werkstatt',desc:'Drehzahl, Vorschub, Druck, Hauptzeit: umstellen und ausrechnen.',ex:'vf = f · n,  n = ?',descH:'Hauptzeit, Kegel, Wärmeausdehnung, Pythagoras.',exH:'th = L · i / (n · f),  n = ?',make:h=>typesMix(h?gen5h:gen5,7)}
 ]},
 {id:'pot',tab:'Potenzen',name:'Potenzen & Zehnerpotenzen',sub:'Potenzen berechnen, Potenzgesetze, Zehnerpotenzen und Vorsilben.',levels:[
  {name:'Potenzen berechnen',desc:'Basis hoch Exponent, 10er-Potenzen, hoch 0 und hoch 1.',ex:'3^{4} = 81',descH:'Negative Basis, Minus vor der Potenz, negative Exponenten, Kommazahlen.',exH:`2^{${M}3} = 0,125`,make:h=>uniq(()=>pot1(h))},
  {name:'Potenzgesetze',desc:'Malnehmen, teilen und potenzieren mit gleicher Basis.',ex:'a^{3} · a^{4} = a^{7}',descH:'Mit negativen Exponenten und mehreren Schritten.',exH:`a^{5} · a^{${M}8} = a^{${M}3}`,make:h=>uniq(()=>pot2(h))},
  {name:'Zehnerpotenzen schreiben',desc:'Große und kleine Zahlen in Normform bringen.',ex:'45 000 = 4,5 · 10^{4}',descH:'Zurück in normale Zahlen, auch ohne Normform.',exH:`0,00072 = 72 · 10^{${M}5}`,make:h=>uniq(()=>pot3(h))},
  {name:'Rechnen mit Zehnerpotenzen',desc:'Malnehmen und teilen in Zehnerpotenz-Schreibweise.',ex:'(3 · 10^{4}) · (2 · 10^{3})',descH:'Negative Exponenten und Normform herstellen.',exH:`(5 · 10^{3}) · (4 · 10^{${M}5})`,make:h=>uniq(()=>pot4(h))},
  {name:'Vorsilben',desc:'Kilo, Mega, Milli, Mikro und Co. als Zehnerpotenz.',ex:`1 µm = 10^{${M}6} m`,descH:'Zwischen Vorsilben umrechnen.',exH:'0,25 mm = 250 µm',make:h=>uniq(()=>pot5(h))}
 ]},
 {id:'ein',tab:'Einheiten',name:'Einheiten umrechnen',sub:'Längen, Flächen, Volumen, Zeit, Kraft, Druck und Zoll.',levels:[
  {name:'Längen',desc:'mm, cm, dm, m, km und µm.',ex:'2,5 m = 2500 mm',descH:'Über mehrere Stufen, mit Kommazahlen.',exH:'0,035 mm = 35 µm',make:h=>uniq(()=>ein1(h))},
  {name:'Flächen',desc:'mm², cm², dm², m²: Faktor 100 pro Stufe.',ex:'3,5 cm² = 350 mm²',descH:'Große Sprünge, z. B. m² in mm².',exH:'0,04 m² = 40 000 mm²',make:h=>uniq(()=>ein2(h))},
  {name:'Volumen',desc:'mm³, cm³, dm³, m³, Liter und Milliliter.',ex:'2,5 l = 2500 cm³',descH:'Große Sprünge zwischen m³, l und mm³.',exH:'12 500 mm³ = 0,0125 l',make:h=>uniq(()=>ein3(h))},
  {name:'Zeit & Geschwindigkeit',desc:'h, min, s sowie m/min, m/s und km/h.',ex:'90 m/min = 1,5 m/s',descH:'Stunden mit Komma, mm/min in m/s.',exH:'2 h 15 min = 2,25 h',make:h=>uniq(()=>ein4(h))},
  {name:'Kraft, Masse, Druck, Zoll',desc:'kN, t, bar, MPa und Zoll in mm.',ex:'1 Zoll = 25,4 mm',descH:'bar in N/mm², mg in kg, Zoll-Brüche.',exH:'3/8 Zoll = 9,525 mm',make:h=>uniq(()=>ein5(h))}
 ]},
 {id:'win',tab:'Winkel',name:'Winkelfunktionen',sub:'Sinus, Kosinus und Tangens im rechtwinkligen Dreieck.',levels:[
  {name:'Seiten erkennen',desc:'Gegenkathete, Ankathete, Hypotenuse und welche Funktion passt.',ex:'sin α = a / c',descH:'Gedrehte Dreiecke und andere Buchstaben.',exH:'cos γ = ?',make:h=>uniq(()=>win1(h))},
  {name:'Seite berechnen',desc:'Winkel und eine Seite gegeben: die zweite Seite berechnen.',ex:'a = c · sin α',descH:'Auch wenn die gesuchte Seite im Nenner steht.',exH:'c = a / sin α',make:h=>uniq(()=>win2(h))},
  {name:'Winkel berechnen',desc:'Zwei Seiten gegeben: Winkel mit sin⁻¹, cos⁻¹, tan⁻¹.',ex:`α = sin^{${M}1}(a / c)`,descH:'Gedrehte Dreiecke, auch den anderen Winkel.',exH:`β = 90° ${M} α`,make:h=>uniq(()=>win3(h))},
  {name:'Aus der Werkstatt',desc:'Sinuslineal, Kegel, Lochkreis, Schräge.',ex:'h = L · sin α',descH:'Kegel nach d, Lochkreis mit Vorzeichen, Gewinde.',exH:'tan φ = P / (π · d2)',make:h=>uniq(()=>win4(h))}
 ]}
];
const TOPIC=id=>TOPICS.find(t=>t.id===id)||TOPICS[0];
function buildQs(tid,lv,h){return TOPIC(tid).levels[lv-1].make(h);}
