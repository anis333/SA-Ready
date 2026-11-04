/* SA-Ready · Aufgaben
   Erzeugt die Übungsaufgaben für alle Themen und Level (Normal und Schwer).
   Jede Aufgabe kommt mit Lösung, Toleranz, Lösungsweg und Tipp. */
'use strict';
/* Sprache: de oder en (Einstellung auf der Startseite, Seite wird danach neu geladen) */
let LANG='de';try{if(localStorage.getItem('sar-lang')==='en')LANG='en';}catch(e){}
const EN=LANG==='en';
const Lg=(de,en)=>EN?en:de;
const M='−',ST=Lg('Seiten tauschen.','Swap the sides.'),N_Q=8;
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
  if(i.length>4)i=i.replace(/\B(?=(\d{3})+(?!\d))/g,EN?',':' ');
  return (v<0?M:'')+i+(f?(EN?'.':',')+f:'');
}
const par=n=>n<0?`(${fmt(n)})`:fmt(n);
const coef=c=>c===1?'':c===-1?M:fmt(c);
const term=d=>d<0?`${M} ${fmt(-d)}`:`+ ${fmt(d)}`;
function parseNum(raw){
  let s=String(raw).trim().replace(/[\s  ']/g,'').replace(/[−–‒]/g,'-');
  if(EN){
    if(s.includes(',')&&s.includes('.'))s=s.replace(/,/g,'');
    else if(s.includes(','))s=/^-?\d{1,3}(,\d{3})+$/.test(s)?s.replace(/,/g,''):s.replace(',','.');
  }
  else if(s.includes(','))s=s.replace(/\./g,'').replace(',','.');
  else if(/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(s))s=s.replace(/\./g,'');
  const m=/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(s);
  if(m){const b=Number(m[2]);return b?Number(m[1])/b:NaN;}
  if(!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s))return NaN;
  return Number(s);
}

function Q(o){return Object.assign({kind:'num',mode:'plain',label:'',pre:'? =',unit:'',tol:1e-9,steps:[],tip:'',fine:''},o);}
function rows(r){return r.map(a=>({eq:a[0],op:a[1]||'',note:a[2]||''}));}
const relTol=v=>Math.max(1e-9,Math.abs(v)*1e-6);
function probe(eq,x){return Lg('Probe: ','Check: ')+eq.replace(/(\d)x/g,'$1 · x').replace(/x/g,par(x))+' ✓';}
function mkNum(eq,x,r,tip){return Q({mode:'x',eq,label:Lg('Löse nach x','Solve for x'),pre:'x =',answer:x,tol:1e-4,answerText:'x = '+fmt(x),steps:rows(r),probe:probe(eq,x),tip,check:'tail'});}
function uniq(g){const out=[],seen=new Set();let guard=0;while(out.length<N_Q&&guard++<500){const q=g();const k=q.eq+'|'+q.label+'|'+(q.given?JSON.stringify(q.given):'');if(!seen.has(k)){seen.add(k);out.push(q);}}return out;}
function typesMix(g,n){const t=shuffle([...Array(n).keys()]);while(t.length<N_Q)t.push(rnd(0,n-1));return shuffle(t.slice(0,N_Q)).map(g);}

/* =================== 1  GLEICHUNGEN =================== */
function gen1(){
  const t=rnd(0,3);
  if(t===0){const a=rnd(2,20),x=rnd(2,20),b=x+a,eq=`x + ${a} = ${b}`;
    return mkNum(eq,x,[[eq,`${M} ${a}`,Lg(`Gegenoperation von + ist ${M}. Rechne auf beiden Seiten ${a} ab.`,`The inverse of + is ${M}. Subtract ${a} from both sides.`)],[`x = ${b} ${M} ${a} = ${x}`]],Lg('Bei x steht ein Plus. Mit Minus hebst du es auf, auf beiden Seiten.','x has a plus next to it. Undo it with a minus, on both sides.'));}
  if(t===1){const a=rnd(2,15),x=rnd(a+1,a+15),b=x-a,eq=`x ${M} ${a} = ${b}`;
    return mkNum(eq,x,[[eq,`+ ${a}`,Lg(`Gegenoperation von ${M} ist +. Rechne auf beiden Seiten ${a} dazu.`,`The inverse of ${M} is +. Add ${a} to both sides.`)],[`x = ${b} + ${a} = ${x}`]],Lg('Bei x steht ein Minus. Mit Plus hebst du es auf, auf beiden Seiten.','x has a minus next to it. Undo it with a plus, on both sides.'));}
  if(t===2){const a=rnd(2,12),x=rnd(2,12),b=a*x,eq=`${a}x = ${b}`;
    return mkNum(eq,x,[[eq,`: ${a}`,Lg(`${a}x heißt ${a} mal x. Gegenoperation von Mal ist Geteilt.`,`${a}x means ${a} times x. The inverse of times is divided by.`)],[`x = ${b} : ${a} = ${x}`]],Lg('Vor dem x steht eine Zahl, die mit x malgenommen wird. Teile beide Seiten durch sie.','x is multiplied by a number. Divide both sides by it.'));}
  const a=rnd(2,9),b=rnd(2,12),x=a*b,eq=`x : ${a} = ${b}`;
  return mkNum(eq,x,[[eq,`· ${a}`,Lg(`Gegenoperation von Geteilt ist Mal. Nimm beide Seiten mal ${a}.`,`The inverse of divided by is times. Multiply both sides by ${a}.`)],[`x = ${b} · ${a} = ${x}`]],Lg('x wird durch eine Zahl geteilt. Mit Mal hebst du das auf, auf beiden Seiten.','x is divided by a number. Undo that with times, on both sides.'));
}
function gen1h(){
  const t=rnd(0,3);
  if(t===0){const a=pick([0.5,1.2,1.5,2.5,3.5,4.5,7.5]),x=pick([-9,-7,-5,-3,-2,2,3,4,6,8]),b=r12(x-a),eq=`x ${M} ${fmt(a)} = ${fmt(b)}`;
    return mkNum(eq,x,[[eq,`+ ${fmt(a)}`,Lg(`Gegenoperation von ${M} ist +. Mit Kommazahlen und negativen Zahlen gilt dieselbe Waage-Regel.`,`The inverse of ${M} is +. The same balance rule applies to decimals and negative numbers.`)],[`x = ${fmt(b)} + ${fmt(a)} = ${fmt(x)}`]],Lg('Rechne auf beiden Seiten die Gegenoperation. Achte auf das Vorzeichen.','Do the inverse operation on both sides. Watch the sign.'));}
  if(t===1){const a=rnd(2,9),x=pick([-12,-8,-6,-4.5,-2.5,1.5,3,4.5,5,7]),b=r12(-a*x),eq=`${M}${a}x = ${fmt(b)}`;
    return mkNum(eq,x,[[eq,`: (${M}${a})`,Lg(`Das Minus gehört zur Zahl vor dem x. Teile durch ${M}${a}.`,`The minus belongs to the number in front of x. Divide by ${M}${a}.`)],[`x = ${fmt(b)} : (${M}${a}) = ${fmt(x)}`,'',Lg('Minus durch Minus ergibt Plus, Plus durch Minus ergibt Minus.','Minus divided by minus gives plus. Plus divided by minus gives minus.')]],Lg('Teile durch die ganze Zahl vor dem x, mit ihrem Vorzeichen.','Divide by the whole number in front of x, including its sign.'));}
  if(t===2){const a=rnd(2,8),b=pick([-9,-7,-5,-3,-2,2,3,4,6,9]),x=-a*b,eq=`x : (${M}${a}) = ${fmt(b)}`;
    return mkNum(eq,x,[[eq,`· (${M}${a})`,Lg(`Gegenoperation von Geteilt ist Mal. Nimm beide Seiten mal ${M}${a}.`,`The inverse of divided by is times. Multiply both sides by ${M}${a}.`)],[`x = ${fmt(b)} · (${M}${a}) = ${fmt(x)}`]],Lg('Mit Mal hebst du das Geteilt auf. Das Minus kommt mit.','Use times to undo the divided by. The minus comes along.'));}
  const a=pick([0.2,0.25,0.4,0.5,0.75,1.5,2.5]),x=rnd(2,24),b=r12(a*x),eq=`${fmt(a)}x = ${fmt(b)}`;
  return mkNum(eq,x,[[eq,`: ${fmt(a)}`,Lg('Auch durch eine Kommazahl darfst du teilen.','You can divide by a decimal number too.')],[`x = ${fmt(b)} : ${fmt(a)} = ${x}`]],Lg('Teile beide Seiten durch die Kommazahl vor dem x.','Divide both sides by the decimal number in front of x.'));
}
function gen2(){
  const t=rnd(0,3),a=rnd(2,9);
  if(t===0){const x=rnd(2,12),b=rnd(2,20),c=a*x+b,eq=`${a}x + ${b} = ${c}`;
    return mkNum(eq,x,[[eq,`${M} ${b}`,Lg('Erst das Plus wegräumen.','First get rid of the plus.')],[`${a}x = ${c-b}`,`: ${a}`,Lg('Dann durch die Zahl vor dem x teilen.','Then divide by the number in front of x.')],[`x = ${c-b} : ${a} = ${x}`]],Lg('Erst die Zahl ohne x loswerden, danach die Zahl vor dem x.','First get rid of the number without x, then deal with the number in front of x.'));}
  if(t===1){const x=rnd(3,12),b=rnd(1,Math.min(20,a*x-1)),c=a*x-b,eq=`${a}x ${M} ${b} = ${c}`;
    return mkNum(eq,x,[[eq,`+ ${b}`,Lg('Erst das Minus wegräumen.','First get rid of the minus.')],[`${a}x = ${c+b}`,`: ${a}`,Lg('Dann durch die Zahl vor dem x teilen.','Then divide by the number in front of x.')],[`x = ${c+b} : ${a} = ${x}`]],Lg('Erst die Zahl ohne x loswerden, danach die Zahl vor dem x.','First get rid of the number without x, then deal with the number in front of x.'));}
  if(t===2){const k=rnd(2,9),x=a*k,b=rnd(2,15),c=k+b,eq=`x : ${a} + ${b} = ${c}`;
    return mkNum(eq,x,[[eq,`${M} ${b}`,Lg('Erst das Plus wegräumen.','First get rid of the plus.')],[`x : ${a} = ${c-b}`,`· ${a}`,Lg('Dann das Geteilt mit Mal aufheben.','Then undo the divided by with times.')],[`x = ${c-b} · ${a} = ${x}`]],Lg('Erst plus oder minus wegräumen, dann das Geteilt.','First get rid of plus or minus, then the divided by.'));}
  const x=rnd(2,12),b=rnd(2,20),c=a*x+b,eq=`${c} = ${a}x + ${b}`;
  return mkNum(eq,x,[[eq,`${M} ${b}`,Lg('Das x steht rechts. Die Regeln bleiben gleich.','x is on the right. The rules stay the same.')],[`${c-b} = ${a}x`,`: ${a}`],[`${x} = x`,'',ST],[`x = ${x}`]],Lg('Das x darf auch rechts stehen. Rechne wie gewohnt, tausche am Ende die Seiten.','x can be on the right too. Solve as usual and swap the sides at the end.'));
}
function gen2h(){
  const t=rnd(0,3);
  if(t===0){const a=rnd(2,8),x=pick([-8,-6,-5,-3,-2,2,3,4,5,7]),b=rnd(2,20),c=-a*x+b,eq=`${M}${a}x + ${b} = ${fmt(c)}`;
    return mkNum(eq,x,[[eq,`${M} ${b}`,Lg('Erst die Zahl ohne x wegräumen.','First get rid of the number without x.')],[`${M}${a}x = ${fmt(c-b)}`,`: (${M}${a})`,Lg('Durch die Zahl vor dem x teilen, mit ihrem Minus.','Divide by the number in front of x, including its minus.')],[`x = ${fmt(c-b)} : (${M}${a}) = ${fmt(x)}`]],Lg('Erst die Zahl ohne x wegräumen. Dann durch die Zahl vor dem x teilen, mit Vorzeichen.','First get rid of the number without x. Then divide by the number in front of x, with its sign.'));}
  if(t===1){const a=pick([0.5,1.5,2.5]),x=pick([2,4,6,8,10,12,14,16]),b=rnd(2,15),c=r12(a*x-b),eq=`${fmt(a)}x ${M} ${b} = ${fmt(c)}`;
    return mkNum(eq,x,[[eq,`+ ${b}`,Lg('Erst das Minus wegräumen.','First get rid of the minus.')],[`${fmt(a)}x = ${fmt(c+b)}`,`: ${fmt(a)}`,Lg('Dann durch die Kommazahl teilen.','Then divide by the decimal number.')],[`x = ${fmt(c+b)} : ${fmt(a)} = ${x}`]],Lg('Gleicher Ablauf wie immer, nur mit Kommazahl vor dem x.','Same procedure as always, just with a decimal number in front of x.'));}
  if(t===2){let a,c,b,x;do{a=rnd(2,6);c=pick([-5,-4,-3,-2,2,3,4,6,8]);b=rnd(1,9);x=a*c-b;}while(x===0);
    const eq=`(x + ${b}) : ${a} = ${fmt(c)}`;
    return mkNum(eq,x,[[eq,`· ${a}`,Lg('Die ganze Klammer wird geteilt. Erst mit Mal aufheben.','The whole bracket is divided. Undo that with times first.')],[`x + ${b} = ${fmt(a*c)}`,`${M} ${b}`],[`x = ${fmt(a*c)} ${M} ${b} = ${fmt(x)}`]],Lg('Zuerst das Geteilt hinter der Klammer aufheben, dann die Klammer ist weg.','First undo the division after the bracket. Then the bracket is gone.'));}
  const a=rnd(2,7),x=pick([-6,-4,-3,-2,2,3,4,5,7,9]),b=rnd(5,30),c=b-a*x,eq=`${fmt(c)} = ${b} ${M} ${a}x`;
  return mkNum(eq,x,[[eq,`${M} ${b}`,Lg('Das x steht rechts, mit Minus davor.','x is on the right, with a minus in front of it.')],[`${fmt(c-b)} = ${M}${a}x`,`: (${M}${a})`],[`${fmt(x)} = x`,'',ST],[`x = ${fmt(x)}`]],Lg(`Das Minus gehört zum ${a}x. Am Ende durch ${M}${a} teilen.`,`The minus belongs to the ${a}x. At the end, divide by ${M}${a}.`));
}
function gen3(){
  const t=rnd(0,3);
  if(t===0){const c=rnd(2,5),a=c+rnd(2,5),x=rnd(2,10),b=rnd(1,15),k=a-c,d=k*x+b,eq=`${a}x + ${b} = ${c}x + ${d}`;
    return mkNum(eq,x,[[eq,`${M} ${c}x`,Lg('x steht auf beiden Seiten. Zieh das kleinere x-Glied auf beiden Seiten ab.','x is on both sides. Subtract the smaller x term from both sides.')],[`${k}x + ${b} = ${d}`,`${M} ${b}`,Lg('Jetzt die Zahl ohne x wegräumen.','Now get rid of the number without x.')],[`${k}x = ${d-b}`,`: ${k}`],[`x = ${d-b} : ${k} = ${x}`]],Lg('Sammle alle x auf einer Seite: zieh das kleinere x-Glied auf beiden Seiten ab.','Collect all x on one side: subtract the smaller x term from both sides.'));}
  if(t===1){const a=rnd(2,6),x=rnd(2,10),b=rnd(1,9),c=a*(x+b),eq=`${a}(x + ${b}) = ${c}`;
    return mkNum(eq,x,[[eq,`: ${a}`,Lg(`Die Klammer wird mit ${a} malgenommen. Teile beide Seiten durch ${a}.`,`The bracket is multiplied by ${a}. Divide both sides by ${a}.`)],[`x + ${b} = ${x+b}`,`${M} ${b}`],[`x = ${x+b} ${M} ${b} = ${x}`]],Lg('Teile zuerst beide Seiten durch die Zahl vor der Klammer.','First divide both sides by the number in front of the bracket.'));}
  if(t===2){const b=rnd(1,6),x=b+rnd(2,8),a=rnd(2,6),c=a*(x-b),eq=`${a}(x ${M} ${b}) = ${c}`;
    return mkNum(eq,x,[[eq,`: ${a}`,Lg(`Die Klammer wird mit ${a} malgenommen. Teile beide Seiten durch ${a}.`,`The bracket is multiplied by ${a}. Divide both sides by ${a}.`)],[`x ${M} ${b} = ${x-b}`,`+ ${b}`],[`x = ${x-b} + ${b} = ${x}`]],Lg('Teile zuerst beide Seiten durch die Zahl vor der Klammer.','First divide both sides by the number in front of the bracket.'));}
  const a=rnd(2,6),x=rnd(2,9),c=rnd(1,15),b=c+a*x,eq=`${b} ${M} ${a}x = ${c}`;
  return mkNum(eq,x,[[eq,`${M} ${b}`,Lg('Erst die Zahl ohne x auf die andere Seite.','First move the number without x to the other side.')],[`${M}${a}x = ${fmt(c-b)}`,`: (${M}${a})`,Lg('Das Minus gehört zum x. Minus durch Minus ergibt Plus.','The minus belongs to x. Minus divided by minus gives plus.')],[`x = ${fmt(c-b)} : (${M}${a}) = ${x}`]],Lg(`Das Minus vor ${a}x gehört zum x. Du teilst am Ende durch ${M}${a}.`,`The minus in front of ${a}x belongs to x. At the end you divide by ${M}${a}.`));
}
function gen3h(){
  const t=rnd(0,3);
  if(t===0){let a,c,x,b,d;do{a=rnd(3,7);c=rnd(1,a-1);x=pick([-5,-4,-3,-2,2,3,4,5,6,8]);b=rnd(1,6);d=(a-c)*x+a*b;}while(d===0);
    const k=a-c,ab=a*b,eq=`${a}(x + ${b}) = ${coef(c)}x ${term(d)}`;
    const r=[[eq,'',Lg(`Zuerst die Klammer ausmultiplizieren: ${a} · x und ${a} · ${b}.`,`First multiply out the bracket: ${a} · x and ${a} · ${b}.`)],[`${a}x + ${ab} = ${coef(c)}x ${term(d)}`,`${M} ${coef(c)}x`,Lg('Alle x auf die linke Seite.','All x to the left side.')],[`${coef(k)}x + ${ab} = ${fmt(d)}`,`${M} ${ab}`],[`${coef(k)}x = ${fmt(d-ab)}`,k===1?'':`: ${k}`]];
    if(k!==1)r.push([`x = ${fmt(d-ab)} : ${k} = ${fmt(x)}`]);
    return mkNum(eq,x,r,Lg('Klammer ausmultiplizieren, dann alle x auf eine Seite bringen.','Multiply out the bracket, then bring all x to one side.'));}
  if(t===1){const p=rnd(4,8),q=rnd(2,p-1),rr=rnd(1,5),x=rnd(1,10),s=(p-q)*x+q*rr,k=p-q,eq=`${p}x ${M} ${q}(x ${M} ${rr}) = ${s}`;
    const r=[[eq,'',Lg('Minus vor der Klammer: Beim Auflösen drehen sich die Vorzeichen in der Klammer um.','Minus in front of a bracket: when you remove the bracket, the signs inside flip.')],[`${p}x ${M} ${q}x + ${q*rr} = ${s}`,'',Lg(`Zusammenfassen: ${p}x ${M} ${q}x = ${coef(k)||'1'}x.`,`Combine: ${p}x ${M} ${q}x = ${coef(k)||'1'}x.`)],[`${coef(k)}x + ${q*rr} = ${s}`,`${M} ${q*rr}`],[`${coef(k)}x = ${s-q*rr}`,k===1?'':`: ${k}`]];
    if(k!==1)r.push([`x = ${s-q*rr} : ${k} = ${x}`]);
    return mkNum(eq,x,r,Lg(`Achtung beim Minus vor der Klammer: ${M}${q} · (${M}${rr}) ergibt +${q*rr}.`,`Careful with the minus in front of the bracket: ${M}${q} · (${M}${rr}) gives +${q*rr}.`));}
  if(t===2){const [a,b]=pick([[2,3],[2,4],[3,6],[4,6],[2,6],[3,4],[5,10],[4,12]]);const gcd=(m,n)=>n?gcd(n,m%n):m,L=a*b/gcd(a,b);
    const x=L*rnd(1,4),c=x/a+x/b,A=L/a,B=L/b,eq=`x/${a} + x/${b} = ${c}`;
    return mkNum(eq,x,[[eq,`· ${L}`,Lg(`Mit dem Hauptnenner ${L} malnehmen, dann verschwinden die Brüche.`,`Multiply by the common denominator ${L}. Then the fractions disappear.`)],[`${coef(A)}x + ${coef(B)}x = ${L*c}`,'',Lg('Zusammenfassen.','Combine like terms.')],[`${A+B}x = ${L*c}`,`: ${A+B}`],[`x = ${L*c} : ${A+B} = ${x}`]],Lg(`Nimm beide Seiten mal ${L}. Das ist die kleinste Zahl, die durch ${a} und ${b} teilbar ist.`,`Multiply both sides by ${L}. It is the smallest number that both ${a} and ${b} divide into.`));}
  const a=pick([1.5,2.5,3.5,4.5]),k=pick([1,2]),c=a-k,x=rnd(2,12),b=rnd(1,10),d=k*x+b,eq=`${fmt(a)}x + ${b} = ${coef(c)}x + ${d}`;
  const r=[[eq,`${M} ${coef(c)}x`,Lg('Alle x auf die linke Seite.','All x to the left side.')],[`${coef(k)}x + ${b} = ${d}`,`${M} ${b}`],[`${coef(k)}x = ${d-b}`,k===1?'':`: ${k}`]];
  if(k!==1)r.push([`x = ${d-b} : ${k} = ${x}`]);
  return mkNum(eq,x,r,Lg('Kommazahlen vor dem x darfst du genauso abziehen wie ganze Zahlen.','You can subtract decimal numbers in front of x just like whole numbers.'));
}
const BANK=[
 {ctx:Lg('Ohmsches Gesetz','Ohm\'s law'),f:'U = R · I',t:'I',ok:'I = U / R',bad:['I = U · R','I = R / U',`I = U ${M} R`],steps:[['U = R · I',': R',Lg('Gesucht ist I. Durch R teilen, damit R rechts verschwindet.','The unknown is I. Divide by R so that R disappears on the right.')],['U / R = I','',ST],['I = U / R']]},
 {ctx:Lg('Vorschubgeschwindigkeit','Feed rate'),f:'vf = f · n',t:'n',ok:'n = vf / f',bad:['n = vf · f','n = f / vf',`n = vf ${M} f`],steps:[['vf = f · n',': f',Lg('Gesucht ist n. Durch f teilen.','The unknown is n. Divide by f.')],['vf / f = n','',ST],['n = vf / f']]},
 {ctx:Lg('Vorschubgeschwindigkeit','Feed rate'),f:'vf = f · n',t:'f',ok:'f = vf / n',bad:['f = vf · n','f = n / vf',`f = vf ${M} n`],steps:[['vf = f · n',': n',Lg('Gesucht ist f. Durch n teilen.','The unknown is f. Divide by n.')],['vf / n = f','',ST],['f = vf / n']]},
 {ctx:Lg('Schnittgeschwindigkeit','Cutting speed'),f:'vc = π · d · n / 1000',t:'n',ok:'n = 1000 · vc / (π · d)',bad:['n = 1000 · vc / π · d','n = vc · π · d / 1000','n = π · d / (1000 · vc)'],steps:[['vc = π · d · n / 1000','· 1000',Lg('Zuerst den Bruch loswerden.','First get rid of the fraction.')],['1000 · vc = π · d · n',': (π · d)',Lg('Durch das ganze Produkt teilen. Darum die Klammer.','Divide by the whole product. That is why the bracket is needed.')],['1000 · vc / (π · d) = n','',ST],['n = 1000 · vc / (π · d)']]},
 {ctx:Lg('Schnittgeschwindigkeit','Cutting speed'),f:'vc = π · d · n / 1000',t:'d',ok:'d = 1000 · vc / (π · n)',bad:['d = 1000 · vc / π · n','d = vc / (1000 · π · n)','d = π · n / (1000 · vc)'],steps:[['vc = π · d · n / 1000','· 1000',Lg('Zuerst den Bruch loswerden.','First get rid of the fraction.')],['1000 · vc = π · d · n',': (π · n)',Lg('Durch das ganze Produkt teilen. Darum die Klammer.','Divide by the whole product. That is why the bracket is needed.')],['1000 · vc / (π · n) = d','',ST],['d = 1000 · vc / (π · n)']]},
 {ctx:Lg('Druck','Pressure'),f:'p = F / A',t:'F',ok:'F = p · A',bad:['F = p / A','F = A / p',`F = p ${M} A`],steps:[['p = F / A','· A',Lg('Mal A, damit der Bruch verschwindet.','Multiply by A so that the fraction disappears.')],['p · A = F','',ST],['F = p · A']]},
 {ctx:Lg('Druck','Pressure'),f:'p = F / A',t:'A',ok:'A = F / p',bad:['A = F · p','A = p / F',`A = p ${M} F`],steps:[['p = F / A','· A',Lg('Mal A, damit der Bruch verschwindet.','Multiply by A so that the fraction disappears.')],['p · A = F',': p',Lg('Jetzt durch p teilen.','Now divide by p.')],['A = F / p']]},
 {ctx:Lg('Gleichförmige Bewegung','Uniform motion'),f:'s = v · t',t:'t',ok:'t = s / v',bad:['t = s · v','t = v / s',`t = s ${M} v`],steps:[['s = v · t',': v',Lg('Gesucht ist t. Durch v teilen.','The unknown is t. Divide by v.')],['s / v = t','',ST],['t = s / v']]},
 {ctx:Lg('Kreisumfang','Circumference of a circle'),f:'U = 2 · π · r',t:'r',ok:'r = U / (2 · π)',bad:['r = U / 2 · π','r = U · 2 · π','r = 2 · π / U'],steps:[['U = 2 · π · r',': (2 · π)',Lg('Durch das ganze Produkt teilen. Darum die Klammer.','Divide by the whole product. That is why the bracket is needed.')],['U / (2 · π) = r','',ST],['r = U / (2 · π)']]},
 {ctx:Lg('Kraft','Force'),f:'F = m · a',t:'m',ok:'m = F / a',bad:['m = F · a','m = a / F',`m = F ${M} a`],steps:[['F = m · a',': a',Lg('Gesucht ist m. Durch a teilen.','The unknown is m. Divide by a.')],['F / a = m','',ST],['m = F / a']]},
 {ctx:Lg('Gesamtlänge','Total length'),f:'L = l1 + l2 + l3',t:'l2',ok:`l2 = L ${M} l1 ${M} l3`,bad:['l2 = L + l1 + l3',`l2 = L ${M} l1 + l3`,`l2 = l1 + l3 ${M} L`],steps:[['L = l1 + l2 + l3',`${M} l1`,Lg('Erst l1 auf beiden Seiten abziehen.','First subtract l1 from both sides.')],[`L ${M} l1 = l2 + l3`,`${M} l3`,Lg('Dann l3 abziehen.','Then subtract l3.')],[`L ${M} l1 ${M} l3 = l2`,'',ST],[`l2 = L ${M} l1 ${M} l3`]]},
 {ctx:Lg('Hauptzeit','Machining time'),f:'th = L / vf',t:'vf',ok:'vf = L / th',bad:['vf = L · th','vf = th / L',`vf = L ${M} th`],steps:[['th = L / vf','· vf',Lg('Mal vf, damit der Bruch verschwindet.','Multiply by vf so that the fraction disappears.')],['th · vf = L',': th',Lg('Jetzt durch th teilen.','Now divide by th.')],['vf = L / th']]},
 {ctx:Lg('Hauptzeit','Machining time'),f:'th = L / vf',t:'L',ok:'L = th · vf',bad:['L = th / vf','L = vf / th',`L = th ${M} vf`],steps:[['th = L / vf','· vf',Lg('Mal vf, damit der Bruch verschwindet.','Multiply by vf so that the fraction disappears.')],['th · vf = L','',ST],['L = th · vf']]}
];
const BANKH=[
 {ctx:Lg('Wärmeausdehnung','Thermal expansion'),f:'Δl = l0 · α · Δt',t:'Δt',ok:'Δt = Δl / (l0 · α)',bad:['Δt = Δl · l0 · α','Δt = Δl / l0 · α','Δt = l0 · α / Δl'],steps:[['Δl = l0 · α · Δt',': (l0 · α)',Lg('Durch das ganze Produkt teilen. Ohne Klammer wäre nur durch l0 geteilt.','Divide by the whole product. Without the bracket you would only divide by l0.')],['Δl / (l0 · α) = Δt','',ST],['Δt = Δl / (l0 · α)']]},
 {ctx:Lg('Kreisfläche','Area of a circle'),f:'A = π · d^{2} / 4',t:'d',ok:'d = √(4 · A / π)',bad:['d = √(A · π / 4)','d = 4 · A / π','d = √(4 · A) / π'],steps:[['A = π · d^{2} / 4','· 4',Lg('Zuerst den Bruch loswerden.','First get rid of the fraction.')],['4 · A = π · d^{2}',': π'],['4 · A / π = d^{2}','√',Lg('Die Wurzel hebt das Quadrat auf.','The square root cancels the square.')],['d = √(4 · A / π)']]},
 {ctx:Lg('Elektrische Leistung','Electrical power'),f:'P = R · I^{2}',t:'I',ok:'I = √(P / R)',bad:['I = P / R^{2}','I = √P / R','I = P / R'],steps:[['P = R · I^{2}',': R'],['P / R = I^{2}','√',Lg('Die Wurzel hebt das Quadrat auf.','The square root cancels the square.')],['I = √(P / R)']]},
 {ctx:Lg('Hebelgesetz','Law of the lever'),f:'F1 · l1 = F2 · l2',t:'l2',ok:'l2 = F1 · l1 / F2',bad:['l2 = F2 · l1 / F1','l2 = F1 · F2 / l1','l2 = F1 · l1 · F2'],steps:[['F1 · l1 = F2 · l2',': F2',Lg('Bei l2 steht F2 mal. Durch F2 teilen.','F2 is multiplied by l2. Divide by F2.')],['F1 · l1 / F2 = l2','',ST],['l2 = F1 · l1 / F2']]},
 {ctx:Lg('Kegelverjüngung','Taper ratio'),f:`C = (D ${M} d) / L`,t:'d',ok:`d = D ${M} C · L`,bad:[`d = C · L ${M} D`,'d = D + C · L',`d = (D ${M} C) · L`],steps:[[`C = (D ${M} d) / L`,'· L',Lg('Zuerst den Bruch loswerden.','First get rid of the fraction.')],[`C · L = D ${M} d`,'+ d',Lg('d hat ein Minus. Mit + d auf die andere Seite holen.','d has a minus. Bring it to the other side with + d.')],['C · L + d = D',`${M} C · L`],[`d = D ${M} C · L`]]},
 {ctx:Lg('Satz des Pythagoras','Pythagorean theorem'),f:'c^{2} = a^{2} + b^{2}',t:'a',ok:`a = √(c^{2} ${M} b^{2})`,bad:[`a = c ${M} b`,'a = √(c^{2} + b^{2})',`a = (c ${M} b)^{2}`],steps:[['c^{2} = a^{2} + b^{2}',`${M} b^{2}`],[`c^{2} ${M} b^{2} = a^{2}`,'√',Lg('Die Wurzel gilt für die ganze Seite. Du darfst nicht einzeln wurzeln.','The square root applies to the whole side. You must not take the root of each term separately.')],[`a = √(c^{2} ${M} b^{2})`]]},
 {ctx:Lg('Hauptzeit beim Drehen','Machining time when turning'),f:'th = L · i / (n · f)',t:'n',ok:'n = L · i / (th · f)',bad:['n = th · f / (L · i)','n = L · i · th / f','n = L · i / th · f'],steps:[['th = L · i / (n · f)','· (n · f)',Lg('Zuerst den Bruch loswerden.','First get rid of the fraction.')],['th · n · f = L · i',': (th · f)'],['n = L · i / (th · f)']]},
 {ctx:Lg('Masse eines Zylinders','Mass of a cylinder'),f:'m = ρ · π · d^{2} · h / 4',t:'h',ok:'h = 4 · m / (ρ · π · d^{2})',bad:['h = 4 · m · ρ · π · d^{2}','h = 4 · m / ρ · π · d^{2}','h = ρ · π · d^{2} / (4 · m)'],steps:[['m = ρ · π · d^{2} · h / 4','· 4'],['4 · m = ρ · π · d^{2} · h',': (ρ · π · d^{2})',Lg('Durch das ganze Produkt teilen.','Divide by the whole product.')],['h = 4 · m / (ρ · π · d^{2})']]},
 {ctx:Lg('Parallelschaltung','Parallel circuit'),f:'1 / R = 1 / R1 + 1 / R2',t:'R',ok:'R = R1 · R2 / (R1 + R2)',bad:['R = R1 + R2','R = (R1 + R2) / (R1 · R2)','R = R1 · R2 · (R1 + R2)'],steps:[['1 / R = 1 / R1 + 1 / R2','',Lg('Rechts auf den Hauptnenner R1 · R2 bringen.','Bring the right side to the common denominator R1 · R2.')],['1 / R = (R2 + R1) / (R1 · R2)',Lg('Kehrwert','Reciprocal'),Lg('Von beiden Seiten den Kehrwert nehmen.','Take the reciprocal of both sides.')],['R = R1 · R2 / (R1 + R2)']]},
 {ctx:Lg('Beschleunigte Bewegung','Accelerated motion'),f:'s = a · t^{2} / 2',t:'t',ok:'t = √(2 · s / a)',bad:['t = √(s / (2 · a))','t = 2 · s / a','t = √(2 · s · a)'],steps:[['s = a · t^{2} / 2','· 2'],['2 · s = a · t^{2}',': a'],['2 · s / a = t^{2}','√'],['t = √(2 · s / a)']]}
];
function mkMC(it){
  const opts=shuffle([it.ok,...it.bad]);
  return Q({kind:'mc',mode:'formula',ctx:it.ctx,label:Lg(`Stelle nach ${it.t} um`,`Rearrange for ${it.t}`),eq:it.f,target:it.t,options:opts,correctIdx:opts.indexOf(it.ok),answerText:it.ok,steps:rows(it.steps),tip:Lg(`Was steht bei ${it.t} dabei? Nimm die Gegenoperation, auf beiden Seiten.`,`What is next to ${it.t}? Use the inverse operation, on both sides.`)});
}
function mkApp(ctx,formula,ask,given,unit,answer,tol,r,tip,fine,shown){
  return Q({mode:'formula',ctx,eq:formula,target:ask,label:Lg(`Berechne ${ask}`,`Calculate ${ask}`),given,pre:ask+' =',unit,answer,tol,fine:fine||'',
    answerText:`${ask} ${shown||('= '+fmt(answer))} ${unit}`,steps:rows(r),tip});
}
const TIP5=Lg('Erst die Formel nach der gesuchten Größe umstellen, dann die Zahlen einsetzen. Achte auf die Einheiten.','First rearrange the formula for the unknown, then insert the numbers. Watch the units.');
function gen5(t){
  if(t===0){const fv=pick([0.1,0.2,0.25,0.3,0.4]),n=rnd(3,15)*100,vf=r12(fv*n);
    return mkApp(Lg('Vorschubgeschwindigkeit','Feed rate'),'vf = f · n','n',[['vf',`${fmt(vf)} mm/min`],['f',`${fmt(fv)} mm`]],'1/min',n,0.001,
      [['vf = f · n',': f',Lg('Gesucht ist n, also durch f teilen.','The unknown is n, so divide by f.')],['n = vf / f','',Lg('Jetzt die Zahlen einsetzen.','Now insert the numbers.')],[`n = ${fmt(vf)} / ${fmt(fv)} = ${fmt(n)} 1/min`]],TIP5);}
  if(t===1){const p=pick([2,4,5,8,10]),A=pick([50,80,100,120,150,200]),F=p*A;
    return mkApp(Lg('Druck','Pressure'),'p = F / A','A',[['p',`${p} N/mm²`],['F',`${F} N`]],'mm²',A,0.001,
      [['p = F / A','· A',Lg('Mal A, damit der Bruch verschwindet.','Multiply by A so that the fraction disappears.')],['p · A = F',': p',Lg('Jetzt durch p teilen.','Now divide by p.')],['A = F / p'],[`A = ${F} / ${p} = ${A} mm²`]],TIP5);}
  const th=pick([0.5,1,1.5,2,2.5,3,4]),vf=pick([40,60,80,100,120,200]),L=r12(th*vf);
  if(t===2)return mkApp(Lg('Hauptzeit','Machining time'),'th = L / vf','th',[['L',`${fmt(L)} mm`],['vf',`${vf} mm/min`]],'min',th,0.001,
      [['th = L / vf','',Lg('Die Formel ist schon nach th umgestellt.','The formula is already rearranged for th.')],[`th = ${fmt(L)} / ${vf} = ${fmt(th)} min`]],TIP5);
  if(t===3)return mkApp(Lg('Hauptzeit','Machining time'),'th = L / vf','L',[['th',`${fmt(th)} min`],['vf',`${vf} mm/min`]],'mm',L,0.001,
      [['th = L / vf','· vf',Lg('Mal vf, damit der Bruch verschwindet.','Multiply by vf so that the fraction disappears.')],['th · vf = L','',ST],['L = th · vf'],[`L = ${fmt(th)} · ${vf} = ${fmt(L)} mm`]],TIP5);
  if(t===4)return mkApp(Lg('Hauptzeit','Machining time'),'th = L / vf','vf',[['L',`${fmt(L)} mm`],['th',`${fmt(th)} min`]],'mm/min',vf,0.001,
      [['th = L / vf','· vf',Lg('Mal vf, damit der Bruch verschwindet.','Multiply by vf so that the fraction disappears.')],['th · vf = L',': th',Lg('Jetzt durch th teilen.','Now divide by th.')],['vf = L / th'],[`vf = ${fmt(L)} / ${fmt(th)} = ${vf} mm/min`]],TIP5);
  if(t===5){const vc=pick([60,80,100,120,150,180,200]),d=pick([16,20,25,32,40,50,63]),n=1000*vc/(Math.PI*d),nr=Math.round(n);
    return mkApp(Lg('Schnittgeschwindigkeit','Cutting speed'),'vc = π · d · n / 1000','n',[['vc',`${vc} m/min`],['d',`${d} mm`]],'1/min',nr,n*0.02,
      [['vc = π · d · n / 1000','· 1000',Lg('Zuerst den Bruch loswerden.','First get rid of the fraction.')],['1000 · vc = π · d · n',': (π · d)',Lg('Durch das ganze Produkt teilen.','Divide by the whole product.')],['n = 1000 · vc / (π · d)','',Lg('Jetzt die Zahlen einsetzen.','Now insert the numbers.')],[`n = 1000 · ${vc} / (π · ${d}) ≈ ${fmt(nr)} 1/min`]],TIP5,Lg('Auf ganze Zahl runden. Bis 2 % Abweichung zählt als richtig.','Round to a whole number. Up to 2 % deviation counts as correct.'));}
  const R=pick([10,22,47,100,220]),I=pick([0.1,0.2,0.5,1,2]),U=r12(R*I);
  return mkApp(Lg('Ohmsches Gesetz','Ohm\'s law'),'U = R · I','R',[['U',`${fmt(U)} V`],['I',`${fmt(I)} A`]],'Ω',R,0.001,
    [['U = R · I',': I',Lg('Gesucht ist R, also durch I teilen.','The unknown is R, so divide by I.')],['R = U / I','',Lg('Jetzt die Zahlen einsetzen.','Now insert the numbers.')],[`R = ${fmt(U)} / ${fmt(I)} = ${R} Ω`]],TIP5);
}
function gen5h(t){
  if(t===0){let L,i,n,f,th;do{L=pick([40,60,80,90,120,150]);i=pick([1,2,3]);n=pick([400,500,600,750,800,1000,1200]);f=pick([0.1,0.15,0.2,0.25,0.3]);th=L*i/(n*f);}while(!(Math.abs(th-Number(th.toFixed(3)))<1e-9&&th>=0.1));
    return mkApp(Lg('Hauptzeit beim Drehen','Machining time when turning'),'th = L · i / (n · f)','n',[['th',`${fmt(th)} min`],['L',`${L} mm`],['i',Lg(`${i} Schnitt${i>1?'e':''}`,`${i} pass${i>1?'es':''}`)],['f',`${fmt(f)} mm`]],'1/min',n,0.5,
      [['th = L · i / (n · f)','· (n · f)',Lg('Zuerst den Bruch loswerden.','First get rid of the fraction.')],['th · n · f = L · i',': (th · f)'],['n = L · i / (th · f)','',Lg('Jetzt einsetzen.','Now insert.')],[`n = ${L} · ${i} / (${fmt(th)} · ${fmt(f)}) = ${n} 1/min`]],TIP5);}
  if(t===1){let vc,n,d;do{vc=pick([80,100,120,150,180,200,250]);n=pick([500,800,1000,1200,1500,2000]);d=1000*vc/(Math.PI*n);}while(d<8||d>150);
    return mkApp(Lg('Schnittgeschwindigkeit','Cutting speed'),'vc = π · d · n / 1000','d',[['vc',`${vc} m/min`],['n',`${n} 1/min`]],'mm',d,d*0.01,
      [['vc = π · d · n / 1000','· 1000'],['1000 · vc = π · d · n',': (π · n)',Lg('Durch das ganze Produkt teilen.','Divide by the whole product.')],['d = 1000 · vc / (π · n)','',Lg('Jetzt einsetzen.','Now insert.')],[`d = 1000 · ${vc} / (π · ${n}) ≈ ${fmt(d,1)} mm`]],TIP5,Lg('Auf eine Kommastelle runden. Bis 1 % Abweichung zählt als richtig.','Round to one decimal place. Up to 1 % deviation counts as correct.'),'≈ '+fmt(d,1));}
  if(t===2){let D,L,cd,d;do{D=pick([30,40,50,60,80]);L=pick([20,25,40,50,60,80,100]);cd=pick([5,10,20,50]);d=r12(D-L/cd);}while(d<=0||!nice(d));
    return mkApp(Lg('Kegelverjüngung','Taper ratio'),`C = (D ${M} d) / L`,'d',[['D',`${D} mm`],['L',`${L} mm`],['C',`1 : ${cd}`]],'mm',d,0.005,
      [[`C = (D ${M} d) / L`,'· L'],[`C · L = D ${M} d`,'+ d'],['C · L + d = D',`${M} C · L`],[`d = D ${M} C · L`,'',`C = 1 : ${cd} = ${fmt(1/cd)}`],[`d = ${D} ${M} ${fmt(1/cd)} · ${L} = ${fmt(d)} mm`]],TIP5);}
  if(t===3){const dt=pick([20,25,40,50,60,80,100]),l0=pick([200,250,400,500,800,1000]),dl=r12(l0*0.000012*dt);
    return mkApp(Lg('Wärmeausdehnung (Stahl)','Thermal expansion (steel)'),'Δl = l0 · α · Δt','Δt',[['Δl',`${fmt(dl)} mm`],['l0',`${l0} mm`],['α',Lg('0,000012 1/K','0.000012 1/K')]],'K',dt,0.05,
      [['Δl = l0 · α · Δt',': (l0 · α)',Lg('Durch das ganze Produkt teilen.','Divide by the whole product.')],['Δt = Δl / (l0 · α)','',Lg('Jetzt einsetzen.','Now insert.')],[Lg(`Δt = ${fmt(dl)} / (${l0} · 0,000012) = ${dt} K`,`Δt = ${fmt(dl)} / (${l0} · 0.000012) = ${dt} K`)]],TIP5);}
  if(t===4){const d=pick([8,10,12,16,20,25,30,40,50]),A=Math.round(Math.PI*d*d/4*100)/100;
    return mkApp(Lg('Kreisfläche','Area of a circle'),'A = π · d^{2} / 4','d',[['A',`${fmt(A)} mm²`]],'mm',d,d*0.005,
      [['A = π · d^{2} / 4','· 4'],['4 · A = π · d^{2}',': π'],['4 · A / π = d^{2}','√',Lg('Die Wurzel hebt das Quadrat auf.','The square root cancels the square.')],['d = √(4 · A / π)'],[`d = √(4 · ${fmt(A)} / π) ≈ ${d} mm`]],TIP5);}
  if(t===5){const I=pick([0.5,1,1.5,2,2.5,3,4,5]),R=pick([2,4,5,8,10,20]),P=r12(R*I*I);
    return mkApp(Lg('Elektrische Leistung','Electrical power'),'P = R · I^{2}','I',[['P',`${fmt(P)} W`],['R',`${R} Ω`]],'A',I,0.005,
      [['P = R · I^{2}',': R'],['P / R = I^{2}','√'],['I = √(P / R)'],[`I = √(${fmt(P)} / ${R}) = ${fmt(I)} A`]],TIP5);}
  const [p,q,s]=pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15]]),k=rnd(1,4),swap=Math.random()<.5,a=(swap?q:p)*k,b=(swap?p:q)*k,c=s*k;
  return mkApp(Lg('Satz des Pythagoras','Pythagorean theorem'),'c^{2} = a^{2} + b^{2}','a',[['c',`${c} mm`],['b',`${b} mm`]],'mm',a,0.005,
    [['c^{2} = a^{2} + b^{2}',`${M} b^{2}`],[`c^{2} ${M} b^{2} = a^{2}`,'√'],[`a = √(c^{2} ${M} b^{2})`],[`a = √(${c}^{2} ${M} ${b}^{2}) = √${c*c-b*b} = ${a} mm`]],TIP5);
}

/* =================== 2  POTENZEN =================== */
const times=(b,n)=>Array(n).fill(b).join(' · ');
function pot1(h){
  if(!h){
    const t=rnd(0,3);
    if(t<=1){let a,n,v;do{a=rnd(2,6);n=rnd(2,4);v=a**n;}while(v>1300);
      return Q({eq:`${a}^{${n}} = ?`,label:Lg('Berechne die Potenz','Calculate the power'),answer:v,answerText:`${a}^{${n}} = ${fmt(v)}`,check:'tail',
        steps:rows([[`${a}^{${n}} = ${times(a,n)}`,'',Lg(`Der Exponent ${n} sagt: ${a} wird ${n}-mal mit sich selbst malgenommen.`,`The exponent ${n} says: ${a} appears ${n} times as a factor.`)],[`= ${fmt(v)}`]]),tip:Lg('Der Exponent (die kleine Zahl oben) sagt, wie oft die Basis mit sich selbst malgenommen wird.','The exponent (the small number at the top) says how many times the base is used as a factor.')});}
    if(t===2){const n=rnd(2,6),v=10**n;
      return Q({eq:`10^{${n}} = ?`,label:Lg('Berechne die Potenz','Calculate the power'),answer:v,answerText:`10^{${n}} = ${fmt(v)}`,check:'tail',
        steps:rows([[`10^{${n}} = ${fmt(v)}`,'',Lg(`Bei 10er-Potenzen gibt der Exponent die Anzahl der Nullen an: ${n} Nullen.`,`With powers of 10 the exponent gives the number of zeros: ${n} zeros.`)]]),tip:Lg('Zähle die Nullen: 10 hoch 3 hat drei Nullen.','Count the zeros: 10 to the power of 3 has three zeros.')});}
    const a=rnd(2,99),z=Math.random()<.5,v=z?1:a;
    return Q({eq:`${a}^{${z?0:1}} = ?`,label:Lg('Berechne die Potenz','Calculate the power'),answer:v,answerText:`${a}^{${z?0:1}} = ${v}`,check:'tail',
      steps:rows([[`${a}^{${z?0:1}} = ${v}`,'',z?Lg('Jede Zahl (außer 0) hoch 0 ergibt 1.','Any number (except 0) to the power of 0 is 1.'):Lg('Hoch 1 ändert nichts.','To the power of 1 changes nothing.')]]),tip:Lg('Sonderfälle: hoch 1 und hoch 0.','Special cases: power of 1 and power of 0.')});
  }
  const t=rnd(0,3);
  if(t===0){let a,n,v;do{a=rnd(2,5);n=rnd(2,5);v=(-a)**n;}while(Math.abs(v)>1100);
    return Q({eq:`(${M}${a})^{${n}} = ?`,label:Lg('Berechne die Potenz','Calculate the power'),answer:v,answerText:`(${M}${a})^{${n}} = ${fmt(v)}`,check:'tail',
      steps:rows([[`(${M}${a})^{${n}} = ${times(`(${M}${a})`,n)}`,'',n%2?Lg('Ungerader Exponent: Das Ergebnis bleibt negativ.','Odd exponent: the result stays negative.'):Lg('Gerader Exponent: Minus mal Minus ergibt Plus.','Even exponent: minus times minus gives plus.')],[`= ${fmt(v)}`]]),tip:Lg('Mit Klammer wird das Minus mitpotenziert. Zähle, wie viele Minus zusammenkommen.','With a bracket the minus is raised to the power too. Count how many minus signs you get.')});}
  if(t===1){const a=rnd(2,5),n=rnd(2,4),v=-(a**n);
    return Q({eq:`${M}${a}^{${n}} = ?`,label:Lg('Berechne die Potenz','Calculate the power'),answer:v,answerText:`${M}${a}^{${n}} = ${fmt(v)}`,check:'tail',
      steps:rows([[`${M}${a}^{${n}} = ${M}(${times(a,n)})`,'',Lg(`Ohne Klammer gehört der Exponent nur zur ${a}. Das Minus kommt erst danach.`,`Without a bracket the exponent belongs only to the ${a}. The minus comes afterwards.`)],[`= ${fmt(v)}`]]),tip:Lg('Ohne Klammer: erst potenzieren, dann das Minus davor.','Without a bracket: first the power, then the minus in front.')});}
  if(t===2){const [a,n]=pick([[2,1],[2,2],[2,3],[4,1],[4,2],[5,1],[5,2],[10,2],[10,3],[8,1],[2,4],[20,1],[25,1]]),v=r12(1/a**n);
    return Q({eq:`${a}^{${M}${n}} = ?`,label:Lg('Berechne die Potenz','Calculate the power'),answer:v,tol:relTol(v),answerText:`${a}^{${M}${n}} = ${fmt(v)}`,check:'tail',
      steps:rows([[`${a}^{${M}${n}} = 1 / ${a}^{${n}}`,'',Lg('Negativer Exponent heißt: Kehrwert bilden.','Negative exponent means: take the reciprocal.')],[`= 1 / ${fmt(a**n)} = ${fmt(v)}`]]),tip:Lg('Negativer Exponent: 1 durch die Potenz mit positivem Exponenten.','Negative exponent: 1 divided by the power with a positive exponent.'),fine:Lg('Als Kommazahl eingeben, z. B. 0,25.','Enter it as a decimal number, e.g. 0.25.')});}
  const [b,n]=pick([[0.5,2],[0.5,3],[1.5,2],[0.2,2],[0.2,3],[0.1,3],[1.2,2],[2.5,2],[0.3,2],[0.4,2]]),v=r12(b**n);
  return Q({eq:`${fmt(b)}^{${n}} = ?`,label:Lg('Berechne die Potenz','Calculate the power'),answer:v,tol:relTol(v),answerText:`${fmt(b)}^{${n}} = ${fmt(v)}`,check:'tail',
    steps:rows([[`${fmt(b)}^{${n}} = ${times(fmt(b),n)}`,'',Lg('Kommazahlen kleiner als 1 werden beim Potenzieren kleiner.','Decimal numbers smaller than 1 get smaller when you raise them to a power.')],[`= ${fmt(v)}`]]),tip:Lg('Rechne Schritt für Schritt. Zähle die Kommastellen.','Work step by step. Count the decimal places.')});
}
function expQ(eq,ans,r,tip,base){
  return Q({eq,label:Lg('Fasse zusammen: Welcher Exponent fehlt?','Simplify: which exponent is missing?'),pre:'? =',answer:ans,answerText:`${base}^{${fmt(ans)}}`,steps:rows(r),tip,check:'exp'});
}
function pot2(h){
  const v=pick(['a','b','x','y','z']);
  const P=(e)=>`${v}^{${fmt(e)}}`;
  if(!h){
    const t=rnd(0,3);
    if(t===0){const m=rnd(2,9),n=rnd(2,9);return expQ(`${P(m)} · ${P(n)} = ${v}^{?}`,m+n,[[`${P(m)} · ${P(n)} = ${v}^{${m} + ${n}}`,'',Lg('Gleiche Basis malnehmen: Exponenten addieren.','Same base, multiply: add the exponents.')],[`= ${P(m+n)}`]],Lg('Beim Malnehmen mit gleicher Basis werden die Exponenten addiert.','When you multiply powers with the same base, you add the exponents.'),v);}
    if(t===1){const m=rnd(5,12),n=rnd(2,m-1);return expQ(`${P(m)} : ${P(n)} = ${v}^{?}`,m-n,[[`${P(m)} : ${P(n)} = ${v}^{${m} ${M} ${n}}`,'',Lg('Gleiche Basis teilen: Exponenten abziehen.','Same base, divide: subtract the exponents.')],[`= ${P(m-n)}`]],Lg('Beim Teilen mit gleicher Basis werden die Exponenten abgezogen.','When you divide powers with the same base, you subtract the exponents.'),v);}
    if(t===2){const m=rnd(2,5),n=rnd(2,4);return expQ(`(${P(m)})^{${n}} = ${v}^{?}`,m*n,[[`(${P(m)})^{${n}} = ${v}^{${m} · ${n}}`,'',Lg('Potenz einer Potenz: Exponenten malnehmen.','Power of a power: multiply the exponents.')],[`= ${P(m*n)}`]],Lg('Eine Potenz wird potenziert: Exponenten malnehmen.','A power is raised to a power: multiply the exponents.'),v);}
    const m=rnd(2,8),n=rnd(2,m);
    if(Math.random()<.5)return expQ(`10^{${m}} · 10^{${n}} = 10^{?}`,m+n,[[`10^{${m}} · 10^{${n}} = 10^{${m} + ${n}}`,'',Lg('Gleiche Basis 10: Exponenten addieren.','Same base 10: add the exponents.')],[`= 10^{${m+n}}`]],Lg('Gleiche Basis malnehmen: Exponenten addieren.','Same base, multiply: add the exponents.'),'10');
    return expQ(`10^{${m}} : 10^{${n}} = 10^{?}`,m-n,[[`10^{${m}} : 10^{${n}} = 10^{${m} ${M} ${n}}`,'',m===n?Lg('Gleicher Exponent: Das Ergebnis ist 10^{0} = 1.','Same exponent: the result is 10^{0} = 1.'):Lg('Gleiche Basis teilen: Exponenten abziehen.','Same base, divide: subtract the exponents.')],[`= 10^{${m-n}}`]],Lg('Gleiche Basis teilen: Exponenten abziehen.','Same base, divide: subtract the exponents.'),'10');
  }
  const t=rnd(0,5);
  if(t===0){const m=rnd(2,9),n=-rnd(2,9);return expQ(`${P(m)} · ${P(n)} = ${v}^{?}`,m+n,[[`${P(m)} · ${P(n)} = ${v}^{${m} + ${par(n)}}`,'',Lg('Exponenten addieren, auch wenn einer negativ ist.','Add the exponents, even if one is negative.')],[`= ${P(m+n)}`]],Lg('Exponenten addieren. Plus mal Minus: einfach abziehen.','Add the exponents. Plus and minus: just subtract.'),v);}
  if(t===1){const m=rnd(2,6),n=rnd(m+1,12);return expQ(`${P(m)} : ${P(n)} = ${v}^{?}`,m-n,[[`${P(m)} : ${P(n)} = ${v}^{${m} ${M} ${n}}`,'',Lg(`Ein negativer Exponent ist erlaubt: ${v}^{${M}2} = 1 / ${v}^{2}.`,`A negative exponent is allowed: ${v}^{${M}2} = 1 / ${v}^{2}.`)],[`= ${P(m-n)}`]],Lg('Exponenten abziehen. Das Ergebnis darf negativ sein.','Subtract the exponents. The result may be negative.'),v);}
  if(t===2){const m=rnd(2,5),n=rnd(2,4);return expQ(`(${P(-m)})^{${n}} = ${v}^{?}`,-m*n,[[`(${P(-m)})^{${n}} = ${v}^{${M}${m} · ${n}}`,'',Lg('Exponenten malnehmen. Minus mal Plus ergibt Minus.','Multiply the exponents. Minus times plus gives minus.')],[`= ${P(-m*n)}`]],Lg('Potenz einer Potenz: Exponenten malnehmen, auf das Vorzeichen achten.','Power of a power: multiply the exponents and watch the sign.'),v);}
  if(t===3){const m=rnd(2,6),n=rnd(2,6),k=rnd(2,14),e=m+n-k;return expQ(`${P(m)} · ${P(n)} : ${P(k)} = ${v}^{?}`,e,[[`${P(m)} · ${P(n)} : ${P(k)} = ${v}^{${m} + ${n} ${M} ${k}}`,'',Lg('Malnehmen: addieren. Teilen: abziehen.','Multiply: add. Divide: subtract.')],[`= ${P(e)}`]],Lg('Von links nach rechts: erst addieren, dann abziehen.','From left to right: first add, then subtract.'),v);}
  if(t===4){const n=rnd(2,6);return expQ(`1 / ${P(n)} = ${v}^{?}`,-n,[[`1 / ${P(n)} = ${P(-n)}`,'',Lg('Kehrwert: Der Exponent bekommt ein Minus.','Reciprocal: the exponent gets a minus.')]],Lg('1 durch eine Potenz ist dasselbe wie ein negativer Exponent.','1 divided by a power is the same as a negative exponent.'),v);}
  const m=rnd(2,4),n=rnd(2,3),k=rnd(2,9),e=m*n-k;return expQ(`(${P(m)})^{${n}} · ${P(-k)} = ${v}^{?}`,e,[[`(${P(m)})^{${n}} · ${P(-k)} = ${P(m*n)} · ${P(-k)}`,'',Lg('Zuerst die Klammer: Exponenten malnehmen.','First the bracket: multiply the exponents.')],[`= ${v}^{${m*n} + (${M}${k})}`,'',Lg('Dann malnehmen: Exponenten addieren.','Then multiply: add the exponents.')],[`= ${P(e)}`]],Lg('Erst die Klammer, dann malnehmen.','First the bracket, then multiply.'),v);
}
function shiftNote(e){return e>0?Lg(`Das Komma wandert ${e} Stelle${e>1?'n':''} nach links. Darum ist der Exponent +${e}.`,`The decimal point moves ${e} place${e>1?'s':''} to the left. So the exponent is +${e}.`):Lg(`Das Komma wandert ${-e} Stelle${e<-1?'n':''} nach rechts. Darum ist der Exponent ${M}${-e}.`,`The decimal point moves ${-e} place${e<-1?'s':''} to the right. So the exponent is ${M}${-e}.`);}
function pot3(h){
  const MANT=[1.2,1.5,2.5,3.2,4.5,5,6,7.8,8.4,9.1];
  const typeA=(range)=>{const m=pick(MANT),e=pick(range),N=r12(m*10**e);
    return Q({eq:`${fmt(N)} = ${fmt(m)} · 10^{?}`,label:Lg('Schreibe als Zehnerpotenz: Welcher Exponent fehlt?','Write as a power of ten: which exponent is missing?'),answer:e,answerText:`${fmt(N)} = ${fmt(m)} · 10^{${fmt(e)}}`,check:'exp',
      steps:rows([[`${fmt(N)} = ${fmt(m)} · ${fmt(r12(10**e))}`,'',shiftNote(e)],[`= ${fmt(m)} · 10^{${fmt(e)}}`]]),tip:Lg('Zähle, um wie viele Stellen das Komma wandert. Nach links: plus, nach rechts: minus.','Count how many places the decimal point moves. Left: plus, right: minus.')});};
  if(!h){
    if(Math.random()<.68)return typeA([-5,-4,-3,-2,-1,2,3,4,5,6]);
    const n=pick([-4,-3,-2,-1,2,3,4,5,6]),v=r12(10**n);
    return Q({eq:`10^{${fmt(n)}} = ?`,label:Lg('Schreibe als Zahl','Write as a number'),answer:v,tol:relTol(v),answerText:`10^{${fmt(n)}} = ${fmt(v)}`,check:'tail',
      steps:rows([n>0?[`10^{${n}} = ${fmt(v)}`,'',Lg(`Positiver Exponent: eine 1 mit ${n} Nullen.`,`Positive exponent: a 1 followed by ${n} zeros.`)]:[`10^{${fmt(n)}} = 1 / 10^{${-n}} = ${fmt(v)}`,'',Lg(`Negativer Exponent: Die 1 steht an der ${-n}. Stelle nach dem Komma.`,`Negative exponent: the 1 is in decimal place ${-n} after the decimal point.`)]]),tip:Lg('Positiver Exponent: Nullen anhängen. Negativer Exponent: Stellen nach dem Komma.','Positive exponent: add zeros. Negative exponent: places after the decimal point.')});
  }
  const t=rnd(0,2);
  if(t===0){const m=pick(MANT),e=pick([-6,-5,-4,-3,-2,2,3,4,5,6,7]),N=r12(m*10**e);
    return Q({eq:`${fmt(m)} · 10^{${fmt(e)}} = ?`,label:Lg('Schreibe als normale Zahl','Write as an ordinary number'),answer:N,tol:relTol(N),answerText:`${fmt(m)} · 10^{${fmt(e)}} = ${fmt(N)}`,check:'tail',
      steps:rows([[`${fmt(m)} · 10^{${fmt(e)}} = ${fmt(m)} · ${fmt(r12(10**e))}`,'',e>0?Lg(`Komma um ${e} Stellen nach rechts schieben.`,`Move the decimal point ${e} place${e>1?'s':''} to the right.`):Lg(`Komma um ${-e} Stellen nach links schieben.`,`Move the decimal point ${-e} place${e<-1?'s':''} to the left.`)],[`= ${fmt(N)}`]]),tip:Lg('Positiver Exponent: Zahl wird größer, Komma nach rechts. Negativer: Komma nach links.','Positive exponent: the number gets bigger, decimal point to the right. Negative: decimal point to the left.')});}
  if(t===1){let mant,e,N;do{mant=pick([12,34,72,250,0.5,0.25,45,0.8]);e=rnd(-7,7);N=r12(mant*10**e);}while(e===0||N<1e-6||N>1e9||!nice(N));
    return Q({eq:`${fmt(N)} = ${fmt(mant)} · 10^{?}`,label:Lg('Welcher Exponent fehlt?','Which exponent is missing?'),answer:e,answerText:`${fmt(N)} = ${fmt(mant)} · 10^{${fmt(e)}}`,check:'exp',
      steps:rows([[`${fmt(N)} = ${fmt(mant)} · ${fmt(r12(10**e))}`,'',Lg(`Vergleiche ${fmt(mant)} mit ${fmt(N)}: Um wie viele Stellen wandert das Komma?`,`Compare ${fmt(mant)} with ${fmt(N)}: how many places does the decimal point move?`)],[`= ${fmt(mant)} · 10^{${fmt(e)}}`]]),tip:Lg('Hier steht keine Normform. Zähle trotzdem nur die Stellen, um die das Komma wandert.','This is not in standard form. Still just count the places the decimal point moves.')});}
  return typeA([-7,-6,-5,-4,-3,4,5,6,7,8,9]);
}
function pot4(h){
  if(!h){
    if(Math.random()<.5){const [m1,m2]=pick([[2,3],[2,4],[3,3],[1.5,2],[2,2],[4,2],[3,2],[1.2,3],[2.5,3],[1.5,4]]),e1=rnd(1,8),e2=rnd(1,8),p=r12(m1*m2);
      return Q({eq:`(${fmt(m1)} · 10^{${e1}}) · (${fmt(m2)} · 10^{${e2}}) = ${fmt(p)} · 10^{?}`,label:Lg('Rechne: Welcher Exponent fehlt?','Calculate: which exponent is missing?'),answer:e1+e2,answerText:`${fmt(p)} · 10^{${e1+e2}}`,check:'exp',
        steps:rows([[`(${fmt(m1)} · ${fmt(m2)}) · 10^{${e1} + ${e2}}`,'',Lg('Zahlen malnehmen, Exponenten addieren.','Multiply the numbers, add the exponents.')],[`= ${fmt(p)} · 10^{${e1+e2}}`]]),tip:Lg('Zahlen malnehmen, Exponenten addieren.','Multiply the numbers, add the exponents.')});}
    const [m1,m2]=pick([[8,2],[6,3],[9,3],[8,4],[6,2],[4,2],[9,1.5],[7.5,2.5],[5,2],[8,1.6]]),e1=rnd(3,9),e2=rnd(1,e1-1),q=r12(m1/m2);
    return Q({eq:`(${fmt(m1)} · 10^{${e1}}) : (${fmt(m2)} · 10^{${e2}}) = ${fmt(q)} · 10^{?}`,label:Lg('Rechne: Welcher Exponent fehlt?','Calculate: which exponent is missing?'),answer:e1-e2,answerText:`${fmt(q)} · 10^{${e1-e2}}`,check:'exp',
      steps:rows([[`(${fmt(m1)} : ${fmt(m2)}) · 10^{${e1} ${M} ${e2}}`,'',Lg('Zahlen teilen, Exponenten abziehen.','Divide the numbers, subtract the exponents.')],[`= ${fmt(q)} · 10^{${e1-e2}}`]]),tip:Lg('Zahlen teilen, Exponenten abziehen.','Divide the numbers, subtract the exponents.')});
  }
  const E=()=>pick([-6,-5,-4,-3,-2,-1,1,2,3,4,5,6]);
  if(Math.random()<.5){const MS=[1.5,2,2.5,3,4,5,6,8],m1=pick(MS),m2=pick(MS),e1=E(),e2=E(),p=r12(m1*m2);let pn=p,e=e1+e2;const norm=p>=10;if(norm){pn=r12(p/10);e+=1;}
    const r=[[`(${fmt(m1)} · ${fmt(m2)}) · 10^{${fmt(e1)} + ${par(e2)}}`,'',Lg('Zahlen malnehmen, Exponenten addieren.','Multiply the numbers, add the exponents.')],[`= ${fmt(p)} · 10^{${fmt(e1+e2)}}`]];
    if(norm)r.push([`= ${fmt(pn)} · 10^{${fmt(e)}}`,'',Lg(`${fmt(p)} = ${fmt(pn)} · 10^{1}. Vor dem Komma darf nur eine Ziffer stehen, darum wird der Exponent um 1 größer.`,`${fmt(p)} = ${fmt(pn)} · 10^{1}. Only one digit may be in front of the decimal point, so the exponent goes up by 1.`)]);
    return Q({eq:`(${fmt(m1)} · 10^{${fmt(e1)}}) · (${fmt(m2)} · 10^{${fmt(e2)}}) = ${fmt(pn)} · 10^{?}`,label:Lg('Rechne in Normform: Welcher Exponent fehlt?','Calculate in standard form: which exponent is missing?'),answer:e,answerText:`${fmt(pn)} · 10^{${fmt(e)}}`,check:'exp',steps:rows(r),tip:Lg('Malnehmen, Exponenten addieren. Ist die Zahl vorne 10 oder größer, Komma verschieben und Exponent anpassen.','Multiply, add the exponents. If the number in front is 10 or more, move the decimal point and adjust the exponent.')});}
  const [m1,m2]=pick([[2,5],[3,6],[1.5,3],[4,8],[6,4],[8,5],[3,4],[2,8],[5,2],[6,8],[9,6]]),e1=E(),e2=E(),q=r12(m1/m2);let qn=q,e=e1-e2;const norm=q<1;if(norm){qn=r12(q*10);e-=1;}
  const r=[[`(${fmt(m1)} : ${fmt(m2)}) · 10^{${fmt(e1)} ${M} ${par(e2)}}`,'',Lg('Zahlen teilen, Exponenten abziehen.','Divide the numbers, subtract the exponents.')],[`= ${fmt(q)} · 10^{${fmt(e1-e2)}}`]];
  if(norm)r.push([`= ${fmt(qn)} · 10^{${fmt(e)}}`,'',Lg(`${fmt(q)} = ${fmt(qn)} · 10^{${M}1}. Darum wird der Exponent um 1 kleiner.`,`${fmt(q)} = ${fmt(qn)} · 10^{${M}1}. So the exponent goes down by 1.`)]);
  return Q({eq:`(${fmt(m1)} · 10^{${fmt(e1)}}) : (${fmt(m2)} · 10^{${fmt(e2)}}) = ${fmt(qn)} · 10^{?}`,label:Lg('Rechne in Normform: Welcher Exponent fehlt?','Calculate in standard form: which exponent is missing?'),answer:e,answerText:`${fmt(qn)} · 10^{${fmt(e)}}`,check:'exp',steps:rows(r),tip:Lg('Teilen, Exponenten abziehen. Minus minus wird plus. Ist die Zahl vorne kleiner als 1, Komma verschieben.','Divide, subtract the exponents. Minus minus becomes plus. If the number in front is smaller than 1, move the decimal point.')});
}
const PRE={G:9,M:6,k:3,h:2,'':0,d:-1,c:-2,m:-3,'µ':-6,n:-9};
const PNAME={G:Lg('Giga','Giga'),M:Lg('Mega','Mega'),k:Lg('Kilo','Kilo'),h:Lg('Hekto','Hecto'),d:Lg('Dezi','Deci'),c:Lg('Zenti','Centi'),m:Lg('Milli','Milli'),'µ':Lg('Mikro','Micro'),n:Lg('Nano','Nano')};
function pot5(h){
  if(!h){
    const [p,u]=pick([['k','m'],['m','m'],['µ','m'],['n','m'],['k','Pa'],['M','Pa'],['h','Pa'],['k','W'],['M','W'],['G','W'],['k','Hz'],['M','Hz'],['k','g'],['m','g'],['k','Ω'],['M','Ω'],['m','A'],['µ','A'],['k','N'],['m','s'],['µ','s'],['k','V'],['m','V'],['c','m']]),e=PRE[p];
    if(Math.random()<.7)return Q({eq:`1 ${p}${u} = 10^{?} ${u}`,label:Lg('Welcher Exponent gehört zur Vorsilbe?','Which exponent belongs to the prefix?'),answer:e,answerText:`1 ${p}${u} = 10^{${fmt(e)}} ${u}`,check:'exp',
      steps:rows([[`1 ${p}${u} = 10^{${fmt(e)}} ${u}`,'',Lg(`${p} heißt ${PNAME[p]} und bedeutet 10^{${fmt(e)}} = ${fmt(r12(10**e))}.`,`${p} is called ${PNAME[p]} and means 10^{${fmt(e)}} = ${fmt(r12(10**e))}.`)]]),tip:Lg('Kilo, Mega, Giga: 3, 6, 9. Milli, Mikro, Nano: −3, −6, −9.','Kilo, Mega, Giga: 3, 6, 9. Milli, Micro, Nano: −3, −6, −9.')});
    return Q({eq:`1 ${u} = 10^{?} ${p}${u}`,label:Lg('Umgekehrt: Welcher Exponent fehlt?','The other way round: which exponent is missing?'),answer:-e,answerText:`1 ${u} = 10^{${fmt(-e)}} ${p}${u}`,check:'exp',
      steps:rows([[`1 ${p}${u} = 10^{${fmt(e)}} ${u}`,'',Lg(`${p} (${PNAME[p]}) bedeutet 10^{${fmt(e)}}.`,`${p} (${PNAME[p]}) means 10^{${fmt(e)}}.`)],[`1 ${u} = 10^{${fmt(-e)}} ${p}${u}`,'',Lg('Umgekehrt dreht der Exponent sein Vorzeichen.','The other way round, the exponent changes its sign.')]]),tip:Lg('Erst die Vorsilbe übersetzen, dann das Vorzeichen umdrehen.','First translate the prefix, then flip the sign.')});
  }
  if(Math.random()<.3){const [p,u]=pick([['G','W'],['M','Pa'],['k','N'],['µ','m'],['n','m'],['m','A'],['M','Hz']]),v=pick([1.5,2.5,3.5,4.7,6.8,8.2]),e=PRE[p];
    return Q({eq:`${fmt(v)} ${p}${u} = ${fmt(v)} · 10^{?} ${u}`,label:Lg('Welcher Exponent fehlt?','Which exponent is missing?'),answer:e,answerText:`${fmt(v)} ${p}${u} = ${fmt(v)} · 10^{${fmt(e)}} ${u}`,check:'exp',
      steps:rows([[`${fmt(v)} ${p}${u} = ${fmt(v)} · 10^{${fmt(e)}} ${u}`,'',Lg(`${p} heißt ${PNAME[p]} = 10^{${fmt(e)}}. Die Vorsilbe wird durch die Zehnerpotenz ersetzt.`,`${p} is called ${PNAME[p]} = 10^{${fmt(e)}}. The prefix is replaced by the power of ten.`)]]),tip:Lg('Ersetze die Vorsilbe durch ihre Zehnerpotenz.','Replace the prefix with its power of ten.')});}
  let p1,p2,u,v,d,ans;
  do{[p1,p2,u]=pick([['k','','Ω'],['m','µ','m'],['n','µ','m'],['M','k','Pa'],['µ','m','m'],['G','M','W'],['k','M','W'],['m','','A'],['','k','N'],['M','','Pa'],['m','','s'],['k','m','m'],['','m','V'],['M','k','Hz']]);
    v=pick([0.06,0.25,0.5,1.2,2.5,3.5,4.7,15,60,250,400,2500]);d=PRE[p1]-PRE[p2];ans=r12(v*10**d);}while(ans<1e-4||ans>1e7||!nice(ans));
  const U1=p1+u,U2=p2+u;
  return Q({eq:`${fmt(v)} ${U1} = ? ${U2}`,label:Lg('Rechne um','Convert'),unit:U2,answer:ans,tol:relTol(ans),answerText:`${fmt(v)} ${U1} = ${fmt(ans)} ${U2}`,check:'tail',
    steps:rows([[`1 ${U1} = 10^{${fmt(d)}} ${U2}`,'',Lg(`${p1?p1+' = 10^{'+fmt(PRE[p1])+'}':'Grundeinheit = 10^{0}'}, ${p2?p2+' = 10^{'+fmt(PRE[p2])+'}':'Grundeinheit = 10^{0}'}. Exponent: ${fmt(PRE[p1])} ${M} ${par(PRE[p2])} = ${fmt(d)}.`,`${p1?p1+' = 10^{'+fmt(PRE[p1])+'}':'Base unit = 10^{0}'}, ${p2?p2+' = 10^{'+fmt(PRE[p2])+'}':'Base unit = 10^{0}'}. Exponent: ${fmt(PRE[p1])} ${M} ${par(PRE[p2])} = ${fmt(d)}.`)],[`${fmt(v)} ${U1} = ${fmt(v)} · 10^{${fmt(d)}} ${U2}`],[`= ${fmt(ans)} ${U2}`]]),tip:Lg('Exponent der ersten Vorsilbe minus Exponent der zweiten. Dann das Komma um so viele Stellen verschieben.','Exponent of the first prefix minus exponent of the second. Then move the decimal point that many places.')});
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
const IN_=Lg('Zoll','inch');const U_INCH={[IN_]:25.4,mm:1};
const NOTE={
  len:Lg('Bei Längen: Faktor 10 pro Stufe (mm, cm, dm, m), 1000 von m zu km und von mm zu µm.','For lengths: factor 10 per step (mm, cm, dm, m), 1000 from m to km and from mm to µm.'),
  area:Lg('Bei Flächen: Faktor 100 pro Stufe, weil 10 · 10.','For areas: factor 100 per step, because 10 · 10.'),
  vol:Lg('Bei Volumen: Faktor 1000 pro Stufe, weil 10 · 10 · 10. 1 dm³ = 1 l und 1 cm³ = 1 ml.','For volumes: factor 1000 per step, because 10 · 10 · 10. 1 dm³ = 1 l and 1 cm³ = 1 ml.'),
  time:Lg('Bei der Zeit ist der Faktor 60, nicht 100.','For time the factor is 60, not 100.'),
  speed:Lg('1 m/s = 60 m/min, weil 1 min = 60 s. Und 1 m/s = 3,6 km/h.','1 m/s = 60 m/min, because 1 min = 60 s. And 1 m/s = 3.6 km/h.'),
  force:'1 kN = 1000 N.',mass:'1 t = 1000 kg, 1 kg = 1000 g, 1 g = 1000 mg.',
  press:Lg('1 bar = 100 000 Pa = 10 N/cm² = 0,1 N/mm². 1 N/mm² = 1 MPa.','1 bar = 100,000 Pa = 10 N/cm² = 0.1 N/mm². 1 N/mm² = 1 MPa.'),inch:Lg('1 Zoll = 25,4 mm.','1 inch = 25.4 mm.')
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
  if(Math.abs(k-1)<1e-12)r=[[`1 ${from} = 1 ${to}`,'',Lg('Beide Einheiten sind gleich groß.','Both units are the same size.')],[`${fmt(val)} ${from} = ${fmt(ans)} ${to}`]];
  else if(k>1)r=[[`1 ${from} = ${fmt(k)} ${to}`,'',NOTE[nk]],[`${fmt(val)} ${from} = ${fmt(val)} · ${fmt(k)} ${to}`,'',Lg('Große Einheit in kleine: mal. Die Zahl wird größer.','Large unit to small: times. The number gets bigger.')],[`= ${fmt(ans)} ${to}`]];
  else r=[[`1 ${to} = ${fmt(1/k)} ${from}`,'',NOTE[nk]],[`${fmt(val)} ${from} = ${fmt(val)} : ${fmt(1/k)} ${to}`,'',Lg('Kleine Einheit in große: geteilt. Die Zahl wird kleiner.','Small unit to large: divided by. The number gets smaller.')],[`= ${fmt(ans)} ${to}`]];
  return Q({eq:`${fmt(val)} ${from} = ? ${to}`,label:Lg('Rechne um','Convert'),unit:to,answer:ans,tol:relTol(ans),answerText:`${fmt(val)} ${from} = ${fmt(ans)} ${to}`,steps:rows(r),
    tip:tipX||Lg('Große Einheit in kleine: mal. Kleine Einheit in große: geteilt. Welche Umrechnungszahl gilt?','Large unit to small: times. Small unit to large: divided by. Which conversion factor applies?'),check:'tail'});
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
    return Q({eq:`${hh} h ${mm} min = ? h`,label:Lg('Rechne in Stunden mit Komma um','Convert to hours as a decimal'),unit:'h',answer:ans,tol:relTol(ans),answerText:`${hh} h ${mm} min = ${fmt(ans)} h`,check:'tail',
      steps:rows([[`${mm} min = ${mm} : 60 h = ${fmt(mm/60)} h`,'',Lg('Minuten in Stunden: durch 60.','Minutes to hours: divide by 60.')],[`${hh} h + ${fmt(mm/60)} h = ${fmt(ans)} h`,'',Lg(`Achtung: ${hh} h ${mm} min ist nicht ${hh},${mm} h.`,`Careful: ${hh} h ${mm} min is not ${hh}.${mm} h.`)]]),tip:Lg('Nur die Minuten umrechnen: durch 60. Dann zu den Stunden dazuzählen.','Only convert the minutes: divide by 60. Then add them to the hours.')});}
  if(t===1)return conv(U_TIME,'time',[['h','min'],['min','h'],['min','s'],['s','h'],['h','s']],[0.05,0.4,1.35,1.75,2.2,3.25,45,81,105,5400,9000]);
  return conv(U_SPEED,'speed',[['mm/min','m/s'],['m/s','mm/min'],['m/min','m/s'],['km/h','m/s'],['m/s','km/h']],[0.2,0.5,0.9,1.25,4.5,7.5,13.5,45,75,135,210,300,600,1200,1800,3000,4500]);
}
function ein5(h){
  if(!h){const t=rnd(0,3);
    if(t===0)return conv(U_FORCE,'force',[['kN','N'],['N','kN']],VN);
    if(t===1)return conv(U_MASS,'mass',[['kg','t'],['t','kg'],['g','kg'],['kg','g']],VN);
    if(t===2)return conv(U_PRESS,'press',[['bar','Pa'],['Pa','bar'],['MPa','N/mm²'],['N/mm²','MPa'],['bar','N/cm²'],['N/cm²','bar']],[0.5,1.5,2,4,6,8,10,12,20,25,60,80,120,250000,600000]);
    return conv(U_INCH,'inch',[[IN_,'mm']],[0.25,0.5,1,1.5,2,3,4]);}
  const t=rnd(0,3);
  if(t===0)return conv(U_PRESS,'press',[['bar','N/mm²'],['N/mm²','bar'],['N/cm²','N/mm²'],['N/mm²','N/cm²'],['MPa','bar'],['bar','kPa'],['kPa','bar']],[0.5,1.5,2.5,6,8,12,35,60,150,250,400,800]);
  if(t===1)return conv(U_MASS,'mass',[['mg','kg'],['kg','mg'],['t','g'],['g','t'],['mg','g']],VH);
  if(t===2){const [n,d]=pick([[1,4],[3,8],[1,2],[5,8],[3,4],[1,8],[3,16],[5,16]]),ans=r12(n/d*25.4);
    return Q({eq:Lg(`${n}/${d} Zoll = ? mm`,`${n}/${d} inch = ? mm`),label:Lg('Rechne Zoll in mm um','Convert inches to mm'),unit:'mm',answer:ans,tol:0.002,answerText:Lg(`${n}/${d} Zoll = ${fmt(ans)} mm`,`${n}/${d} inch = ${fmt(ans)} mm`),check:'tail',
      steps:rows([[Lg(`${n}/${d} Zoll = ${n}/${d} · 25,4 mm`,`${n}/${d} inch = ${n}/${d} · 25.4 mm`),'',Lg(`1 Zoll = 25,4 mm. ${n}/${d} = ${fmt(n/d)}.`,`1 inch = 25.4 mm. ${n}/${d} = ${fmt(n/d)}.`)],[Lg(`= ${fmt(n/d)} · 25,4 mm = ${fmt(ans)} mm`,`= ${fmt(n/d)} · 25.4 mm = ${fmt(ans)} mm`)]]),tip:Lg('Bruch in Kommazahl umwandeln, dann mal 25,4.','Convert the fraction to a decimal, then multiply by 25.4.')});}
  return conv(U_INCH,'inch',[['mm',IN_]],[6.35,12.7,19.05,25.4,38.1,50.8,63.5,76.2,101.6]);
}

/* =================== 4  WINKELFUNKTIONEN =================== */
const LAYOUTS=[
  {P:[20,150],Q:[220,40],R:[220,150]},
  {P:[250,150],Q:[30,40],R:[30,150]},
  {P:[20,150],Q:[240,150],R:[75,54.7]},
  {P:[30,150],Q:[250,40],R:[30,40]}
];
const GREEK={A:'α',B:'β',C:'γ'};
const RN={GK:Lg('Gegenkathete','opposite'),AK:Lg('Ankathete','adjacent'),H:Lg('Hypotenuse','hypotenuse')};
const FN={sin:['GK','H'],cos:['AK','H'],tan:['GK','AK']};
const FNAME={sin:Lg('Sinus','sine'),cos:Lg('Kosinus','cosine'),tan:Lg('Tangens','tangent')};
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
  return Lg(`<svg class="tri" viewBox="${f(x0)} ${f(y0)} ${f(x1-x0)} ${f(y1-y0)}" role="img" aria-label="Rechtwinkliges Dreieck, rechter Winkel bei ${t.nm.R}, Hypotenuse ${hyp}">${out.join('')}</svg>`,`<svg class="tri" viewBox="${f(x0)} ${f(y0)} ${f(x1-x0)} ${f(y1-y0)}" role="img" aria-label="Right triangle, right angle at ${t.nm.R}, hypotenuse ${hyp}">${out.join('')}</svg>`);
}
const TRI_FINE=Lg('Skizze, nicht maßstäblich.','Sketch, not to scale.');
function win1(h){
  const t=triSetup(h),Tk=pick(['P','Q']),r=roles(t,Tk),A=r.A;
  const base=[['H',Lg(`Hypotenuse = ${r.H}`,`Hypotenuse = ${r.H}`),Lg('Sie liegt gegenüber vom rechten Winkel und ist die längste Seite.','It lies opposite the right angle and is the longest side.')],['GK',Lg(`Gegenkathete von ${A} = ${r.GK}`,`Opposite of ${A} = ${r.GK}`),Lg(`Sie liegt gegenüber von ${A}.`,`It lies opposite ${A}.`)],['AK',Lg(`Ankathete von ${A} = ${r.AK}`,`Adjacent of ${A} = ${r.AK}`),Lg(`Sie liegt am Winkel ${A} an und ist nicht die Hypotenuse.`,`It touches angle ${A} and is not the hypotenuse.`)]];
  if(Math.random()<.45){
    const ask=pick(['GK','AK','H']),opts=shuffle([r.GK,r.AK,r.H]);
    const st=base.filter(b=>b[0]!==ask).concat(base.filter(b=>b[0]===ask)).map(b=>[b[1],'',b[2]]);
    return Q({kind:'mc',eq:ask==='H'?'Hypotenuse = ?':Lg(`${RN[ask]} von ${A} = ?`,`${RN[ask]} of ${A} = ?`),label:ask==='H'?Lg('Welche Seite ist die Hypotenuse?','Which side is the hypotenuse?'):Lg(`Welche Seite ist die ${RN[ask]} vom Winkel ${A}?`,`Which side is the ${RN[ask]} side of angle ${A}?`),
      options:opts,correctIdx:opts.indexOf(r[ask]),answerText:ask==='H'?Lg(`Hypotenuse = ${r.H}`,`Hypotenuse = ${r.H}`):Lg(`${RN[ask]} von ${A} = ${r[ask]}`,`${RN[ask]} of ${A} = ${r[ask]}`),steps:rows(st),
      fig:triSVG(t,{[A]:'target'}),figNote:TRI_FINE,tip:Lg('Hypotenuse: gegenüber vom rechten Winkel. Gegenkathete: gegenüber vom Winkel. Ankathete: liegt am Winkel an.','Hypotenuse: opposite the right angle. Opposite side: opposite the angle. Adjacent side: touches the angle.')});
  }
  const fn=pick(['sin','cos','tan']),[num,den]=FN[fn],ok=`${r[num]} / ${r[den]}`;
  const cand=[`${r.GK} / ${r.H}`,`${r.AK} / ${r.H}`,`${r.GK} / ${r.AK}`,`${r.AK} / ${r.GK}`,`${r.H} / ${r.GK}`,`${r.H} / ${r.AK}`].filter(c=>c!==ok);
  const opts=shuffle([ok,...shuffle(cand).slice(0,3)]);
  return Q({kind:'mc',eq:`${fn} ${A} = ?`,label:Lg(`Was ist ${fn} ${A}?`,`What is ${fn} ${A}?`),options:opts,correctIdx:opts.indexOf(ok),answerText:`${fn} ${A} = ${ok}`,
    steps:rows([[Lg(`Gegenkathete ${r.GK}, Ankathete ${r.AK}, Hypotenuse ${r.H}`,`Opposite ${r.GK}, adjacent ${r.AK}, hypotenuse ${r.H}`),'',Lg(`Alle Seiten vom Winkel ${A} aus gesehen.`,`All sides seen from angle ${A}.`)],[`${fn} = ${RN[num]} / ${RN[den]}`,'',Lg('Merksatz GAGA HHAG: G/H, A/H, G/A.','Mnemonic SOH-CAH-TOA: sin = O/H, cos = A/H, tan = O/A.')],[`${fn} ${A} = ${ok}`]]),
    fig:triSVG(t,{[A]:'target'}),figNote:TRI_FINE,tip:Lg('sin = Gegenkathete / Hypotenuse, cos = Ankathete / Hypotenuse, tan = Gegenkathete / Ankathete.','sin = opposite / hypotenuse, cos = adjacent / hypotenuse, tan = opposite / adjacent.')});
}
function win2(h){
  const t=triSetup(h),Tk=pick(['P','Q']),r=roles(t,Tk),A=r.A;
  const [K,U]=pick(h?[['H','GK'],['H','AK'],['AK','GK'],['GK','H'],['AK','H'],['GK','AK']]:[['H','GK'],['H','AK'],['AK','GK']]);
  const th=h?(Math.random()<.5?rnd(15,75):rnd(15,74)+0.5):rnd(20,70);
  const kv=h?(Math.random()<.5?rnd(20,160):rnd(41,299)/2):rnd(25,150);
  const fn=fnFor(K,U),[num,den]=FN[fn],val=TRIG[fn](th*D2R),uNum=U===num,ans=uNum?kv*val:kv/val;
  const Kl=r[K],Ul=r[U];
  const st=[[`${fn} ${A} = ${r[num]} / ${r[den]}`,uNum?`· ${Kl}`:`· ${Ul}`,Lg(`Gegeben: ${Kl} (${RN[K]}) und ${A}. Gesucht: ${Ul} (${RN[U]}). ${RN[num]} und ${RN[den]} gehören zum ${FNAME[fn]}.`,`Given: ${Kl} (${RN[K]}) and ${A}. Unknown: ${Ul} (${RN[U]}). ${RN[num]} and ${RN[den]} go with ${FNAME[fn]}.`)]];
  if(uNum)st.push([`${Ul} = ${Kl} · ${fn} ${A}`,'',Lg(`Umgestellt nach ${Ul}.`,`Rearranged for ${Ul}.`)]);
  else{st.push([`${Ul} · ${fn} ${A} = ${Kl}`,`: ${fn} ${A}`]);st.push([`${Ul} = ${Kl} / ${fn} ${A}`]);}
  st.push([`${Ul} = ${fmt(kv)} ${uNum?'·':'/'} ${fn} ${fmt(th)}° ≈ ${fmt(ans,2)} mm`]);
  return Q({eq:`${Ul} = ?`,label:Lg(`Berechne die Seite ${Ul}`,`Calculate side ${Ul}`),given:[[A,`${fmt(th)}°`],[Kl,`${fmt(kv)} mm`]],pre:`${Ul} =`,unit:'mm',answer:ans,tol:Math.max(0.05,ans*0.005),
    answerText:`${Ul} ≈ ${fmt(ans,2)} mm`,steps:rows(st),fig:triSVG(t,{[A]:'given',[Kl]:'given',[Ul]:'target'}),figNote:TRI_FINE,
    fine:Lg('Taschenrechner auf DEG. Auf zwei Kommastellen runden.','Calculator in DEG mode. Round to two decimal places.'),tip:Lg(`Sieh vom Winkel ${A} aus: Ist ${Kl} Gegenkathete, Ankathete oder Hypotenuse? Und ${Ul}? Daraus folgt sin, cos oder tan.`,`Look from angle ${A}: is ${Kl} the opposite side, the adjacent side or the hypotenuse? And ${Ul}? That tells you sin, cos or tan.`),
    meta:{w:2,th,K,U,kv}});
}
function win3(h){
  const t=triSetup(h),Tk=pick(['P','Q']),r=roles(t,Tk),A=r.A,fn=pick(['sin','cos','tan']),[num,den]=FN[fn];
  let vn,vd;
  if(fn==='tan'){vn=rnd(10,150);vd=rnd(10,150);if(h){vn+=pick([0,0.5]);vd+=pick([0,0.5]);}}
  else{vd=rnd(40,200);vn=rnd(Math.ceil(vd*0.12),Math.floor(vd*0.95));if(h)vd+=0.5;}
  const ratio=vn/vd,th=ATRIG[fn](ratio)/D2R,other=h&&Math.random()<.4,tgt=other?r.Ao:A,ans=other?90-th:th;
  const st=[[`${fn} ${A} = ${r[num]} / ${r[den]}`,'',Lg(`Vom Winkel ${A} aus: ${r[num]} ist die ${RN[num]}, ${r[den]} die ${RN[den]}. Das passt zum ${FNAME[fn]}.`,`Seen from angle ${A}: ${r[num]} is the ${RN[num]}, ${r[den]} is the ${RN[den]}. That matches ${FNAME[fn]}.`)],
    [`${fn} ${A} = ${fmt(vn)} / ${fmt(vd)} ≈ ${fmt(ratio,4)}`],[`${A} = ${fn}^{${M}1}(${fmt(ratio,4)})`,'',Lg(`Umkehrfunktion: am Taschenrechner SHIFT und ${fn}.`,`Inverse function: on the calculator press SHIFT and ${fn}.`)],[`${A} ≈ ${fmt(th,2)}°`]];
  if(other)st.push([`${r.Ao} = 90° ${M} ${A} ≈ ${fmt(90-th,2)}°`,'',Lg(`Im rechtwinkligen Dreieck ergeben die zwei spitzen Winkel zusammen 90°.`,`In a right triangle the two acute angles add up to 90°.`)]);
  return Q({eq:`${tgt} = ?`,label:Lg(`Berechne den Winkel ${tgt}`,`Calculate angle ${tgt}`),given:[[r[num],`${fmt(vn)} mm`],[r[den],`${fmt(vd)} mm`]],pre:`${tgt} =`,unit:'°',answer:ans,tol:0.1,
    answerText:`${tgt} ≈ ${fmt(ans,2)}°`,steps:rows(st),fig:triSVG(t,{[tgt]:'target',[r[num]]:'given',[r[den]]:'given'}),figNote:TRI_FINE,
    fine:Lg('Taschenrechner auf DEG. Auf zwei Kommastellen runden, bis 0,1° Abweichung zählt als richtig.','Calculator in DEG mode. Round to two decimal places; up to 0.1° deviation counts as correct.'),
    tip:Lg(`Welche zwei Seiten sind gegeben, vom Winkel aus gesehen? Dann die passende Umkehrfunktion: sin^{${M}1}, cos^{${M}1} oder tan^{${M}1}.`,`Which two sides are given, seen from the angle? Then use the matching inverse function: sin^{${M}1}, cos^{${M}1} or tan^{${M}1}.`),meta:{w:3,fn,vn,vd,other}});
}
function wq(o){return Q(Object.assign({fine:Lg('Taschenrechner auf DEG. Auf zwei Kommastellen runden.','Calculator in DEG mode. Round to two decimal places.')},o));}
function win4(h){
  if(!h){
    const t=rnd(0,3);
    if(t===0){const L=pick([100,200]),a=pick([5,8,10,12,15,18,20,25,30,35]),hh=L*Math.sin(a*D2R);
      return wq({ctx:Lg('Sinuslineal','Sine bar'),eq:'h = ?',label:Lg('Wie hoch muss der Endmaß-Stapel sein?','How high must the gauge block stack be?'),given:[[Lg('L (Rollenabstand)','L (roller spacing)'),`${L} mm`],['α',`${a}°`]],pre:'h =',unit:'mm',answer:hh,tol:0.01,
        answerText:`h ≈ ${fmt(hh,3)} mm`,fine:Lg('Taschenrechner auf DEG. Auf drei Kommastellen runden.','Calculator in DEG mode. Round to three decimal places.'),
        steps:rows([['sin α = h / L','· L',Lg('h ist die Gegenkathete von α, der Rollenabstand L die Hypotenuse.','h is the opposite side of α, the roller spacing L is the hypotenuse.')],['h = L · sin α'],[`h = ${L} · sin ${a}° ≈ ${fmt(hh,3)} mm`]]),tip:Lg('Beim Sinuslineal ist L die Hypotenuse und h die Gegenkathete.','On a sine bar L is the hypotenuse and h is the opposite side.')});}
    if(t===1){const D=pick([30,40,50,60,80]),d=D-pick([4,6,8,10,12,16,20]),L=pick([30,40,50,60,80,100]),q=(D-d)/(2*L),a=Math.atan(q)/D2R;
      return wq({ctx:Lg('Kegeldrehen','Turning a taper'),eq:'α/2 = ?',label:Lg('Berechne den Einstellwinkel α/2','Calculate the setting angle α/2'),given:[['D',`${D} mm`],['d',`${d} mm`],['L',`${L} mm`]],pre:'α/2 =',unit:'°',answer:a,tol:0.1,
        answerText:`α/2 ≈ ${fmt(a,2)}°`,steps:rows([[`tan(α/2) = (D ${M} d) / (2 · L)`,'',Lg('Der halbe Durchmesserunterschied ist die Gegenkathete, die Kegellänge L die Ankathete.','Half the difference in diameter is the opposite side, the taper length L is the adjacent side.')],[`tan(α/2) = (${D} ${M} ${d}) / (2 · ${L}) = ${fmt(q,4)}`],[`α/2 = tan^{${M}1}(${fmt(q,4)}) ≈ ${fmt(a,2)}°`]]),
        tip:Lg('Den Oberschlitten stellst du auf den halben Kegelwinkel. Gegenkathete: (D − d) / 2.','You set the top slide to half the taper angle. Opposite side: (D − d) / 2.')});}
    if(t===2){const D=pick([60,80,100,120,150]),ph=pick([30,36,45,60,72,20,40]),xy=pick(['X','Y']),r=D/2,v=r*(xy==='X'?Math.cos(ph*D2R):Math.sin(ph*D2R)),fn=xy==='X'?'cos':'sin';
      return wq({ctx:Lg('Lochkreis (CNC-Koordinaten)','Pitch circle (CNC coordinates)'),eq:`${xy} = ?`,label:Lg(`Berechne die ${xy}-Koordinate der Bohrung`,`Calculate the ${xy} coordinate of the hole`),given:[[Lg('Lochkreis-Ø','Pitch circle Ø'),`${D} mm`],['φ',`${ph}°`]],pre:`${xy} =`,unit:'mm',answer:v,tol:0.02,
        answerText:`${xy} ≈ ${fmt(v,2)} mm`,steps:rows([[`r = ${D} / 2 = ${fmt(r)} mm`,'',Lg('Der Radius ist die Hypotenuse.','The radius is the hypotenuse.')],[`${xy} = r · ${fn} φ`,'',xy==='X'?Lg('X liegt am Winkel φ an: Ankathete, also Kosinus.','X touches angle φ: adjacent side, so cosine.'):Lg('Y liegt gegenüber von φ: Gegenkathete, also Sinus.','Y is opposite φ: opposite side, so sine.')],[`${xy} = ${fmt(r)} · ${fn} ${ph}° ≈ ${fmt(v,2)} mm`]]),
        tip:Lg('Mittelpunkt im Nullpunkt: X = r · cos φ, Y = r · sin φ.','Centre at the origin: X = r · cos φ, Y = r · sin φ.')});}
    const hh=pick([5,8,10,12,15,20,25,30]),l=pick([40,50,60,80,100,120]),q=hh/l,a=Math.atan(q)/D2R;
    return wq({ctx:Lg('Schräge','Slope'),eq:'α = ?',label:Lg('Berechne den Neigungswinkel α','Calculate the angle of inclination α'),given:[[Lg('Höhe h','Height h'),`${hh} mm`],[Lg('Länge l (waagrecht)','Length l (horizontal)'),`${l} mm`]],pre:'α =',unit:'°',answer:a,tol:0.1,
      answerText:`α ≈ ${fmt(a,2)}°`,steps:rows([['tan α = h / l','',Lg('Die Höhe ist die Gegenkathete, die waagrechte Länge die Ankathete.','The height is the opposite side, the horizontal length is the adjacent side.')],[`tan α = ${hh} / ${l} = ${fmt(q,4)}`],[`α = tan^{${M}1}(${fmt(q,4)}) ≈ ${fmt(a,2)}°`]]),
      tip:Lg('Höhe und waagrechte Länge sind beide Katheten. Das passt zum Tangens.','Height and horizontal length are both legs. That matches the tangent.')});
  }
  const t=rnd(0,4);
  if(t===0){const L=pick([100,200]),hh=pick([10,15,20,25,30,35,40,45,50,12.5,17.5]),q=hh/L,a=Math.asin(q)/D2R;
    return wq({ctx:Lg('Sinuslineal','Sine bar'),eq:'α = ?',label:Lg('Welcher Winkel ist eingestellt?','Which angle is set?'),given:[[Lg('L (Rollenabstand)','L (roller spacing)'),`${L} mm`],[Lg('h (Endmaße)','h (gauge blocks)'),`${fmt(hh)} mm`]],pre:'α =',unit:'°',answer:a,tol:0.05,
      answerText:`α ≈ ${fmt(a,2)}°`,steps:rows([['sin α = h / L','',Lg('h ist die Gegenkathete, L die Hypotenuse.','h is the opposite side, L is the hypotenuse.')],[`sin α = ${fmt(hh)} / ${L} = ${fmt(q,4)}`],[`α = sin^{${M}1}(${fmt(q,4)}) ≈ ${fmt(a,2)}°`]]),tip:Lg('Gegenkathete durch Hypotenuse, dann sin⁻¹.','Opposite divided by hypotenuse, then sin⁻¹.')});}
  if(t===1){let D,L,a2,d;do{D=pick([30,40,50,60,80]);L=pick([20,30,40,50,60]);a2=pick([2,3,4,5,7.5,10]);d=D-2*L*Math.tan(a2*D2R);}while(d<5);
    return wq({ctx:Lg('Kegeldrehen','Turning a taper'),eq:'d = ?',label:Lg('Berechne den kleinen Kegeldurchmesser d','Calculate the small taper diameter d'),given:[['D',`${D} mm`],['L',`${L} mm`],['α/2',`${fmt(a2)}°`]],pre:'d =',unit:'mm',answer:d,tol:0.02,
      answerText:`d ≈ ${fmt(d,2)} mm`,steps:rows([[`tan(α/2) = (D ${M} d) / (2 · L)`,'· (2 · L)'],[`2 · L · tan(α/2) = D ${M} d`,'+ d',Lg(`Dann ${M} 2 · L · tan(α/2).`,`Then ${M} 2 · L · tan(α/2).`)],[`d = D ${M} 2 · L · tan(α/2)`],[`d = ${D} ${M} 2 · ${L} · tan ${fmt(a2)}° ≈ ${fmt(d,2)} mm`]]),
      tip:Lg('Formel tan(α/2) = (D − d) / (2 · L) nach d umstellen.','Rearrange the formula tan(α/2) = (D − d) / (2 · L) for d.')});}
  if(t===2){let n,k,ph;do{n=pick([5,6,8,9,10,12]);k=rnd(1,n-1);ph=k*360/n;}while(ph%90===0);
    const D=pick([60,80,100,120,150]),r=D/2,xy=pick(['X','Y']),fn=xy==='X'?'cos':'sin',v=r*TRIG[fn](ph*D2R);
    return wq({ctx:Lg('Lochkreis (CNC-Koordinaten)','Pitch circle (CNC coordinates)'),eq:`${xy} = ?`,label:Lg(`Berechne die ${xy}-Koordinate von Bohrung ${k}`,`Calculate the ${xy} coordinate of hole ${k}`),given:[[Lg('Lochkreis-Ø','Pitch circle Ø'),`${D} mm`],[Lg('Bohrungen','Holes'),Lg(`${n}, gleichmäßig verteilt`,`${n}, evenly spaced`)],[Lg('Bohrung','Hole'),`Nr. ${k}`]],pre:`${xy} =`,unit:'mm',answer:v,tol:0.02,
      answerText:`${xy} ≈ ${fmt(v,2)} mm`,fine:Lg('Bohrung 0 liegt bei 0° auf der X-Achse, gezählt gegen den Uhrzeigersinn. Vorzeichen beachten.','Hole 0 is at 0° on the X axis, counted counter-clockwise. Watch the sign.'),
      steps:rows([[`φ = ${k} · 360° / ${n} = ${fmt(ph)}°`,'',Lg('Winkel der Bohrung berechnen.','Calculate the angle of the hole.')],[`r = ${D} / 2 = ${fmt(r)} mm`],[`${xy} = r · ${fn} φ`,'',Lg('Der Taschenrechner liefert das Vorzeichen automatisch mit.','The calculator gives the sign automatically.')],[`${xy} = ${fmt(r)} · ${fn} ${fmt(ph)}° ≈ ${fmt(v,2)} mm`]]),
      tip:Lg('Erst den Winkel der Bohrung: Nummer · 360° / Anzahl. Dann X = r · cos φ, Y = r · sin φ.','First the angle of the hole: number · 360° / count. Then X = r · cos φ, Y = r · sin φ.')});}
  if(t===3){const [nm,P,d2]=pick([['M6',1,5.35],['M8',1.25,7.188],['M10',1.5,9.026],['M12',1.75,10.863],['M16',2,14.701],['M20',2.5,18.376]]),q=P/(Math.PI*d2),a=Math.atan(q)/D2R;
    return wq({ctx:Lg(`Gewinde ${nm}`,`Thread ${nm}`),eq:'φ = ?',label:Lg('Berechne den Steigungswinkel φ','Calculate the lead angle φ'),given:[[Lg('Steigung P','Pitch P'),`${fmt(P)} mm`],[Lg('Flankendurchmesser d2','Pitch diameter d2'),`${fmt(d2)} mm`]],pre:'φ =',unit:'°',answer:a,tol:0.05,
      answerText:`φ ≈ ${fmt(a,2)}°`,steps:rows([['tan φ = P / (π · d2)','',Lg('Abgewickelt ist eine Gewindewindung ein Dreieck: Steigung P gegenüber, Umfang π · d2 anliegend.','Unrolled, one thread turn is a triangle: pitch P opposite, circumference π · d2 adjacent.')],[`tan φ = ${fmt(P)} / (π · ${fmt(d2)}) ≈ ${fmt(q,4)}`],[`φ = tan^{${M}1}(${fmt(q,4)}) ≈ ${fmt(a,2)}°`]]),
      tip:Lg('Wickle eine Windung ab: Gegenkathete P, Ankathete π · d2.','Unroll one turn: opposite side P, adjacent side π · d2.')});}
  const [X,Y]=pick([[30,40],[25,60],[48,20],[35,35],[60,25],[20,45],[50,30],[42,18]]),q=Y/X,a=Math.atan(q)/D2R;
  return wq({ctx:Lg('Polarkoordinaten (CNC)','Polar coordinates (CNC)'),eq:'φ = ?',label:Lg('Unter welchem Winkel liegt der Punkt?','At which angle does the point lie?'),given:[['X',`${X} mm`],['Y',`${Y} mm`]],pre:'φ =',unit:'°',answer:a,tol:0.1,
    answerText:`φ ≈ ${fmt(a,2)}°`,steps:rows([['tan φ = Y / X','',Lg('Y liegt gegenüber vom Winkel, X liegt am Winkel an.','Y is opposite the angle, X touches the angle.')],[`tan φ = ${Y} / ${X} ≈ ${fmt(q,4)}`],[`φ = tan^{${M}1}(${fmt(q,4)}) ≈ ${fmt(a,2)}°`]]),
    tip:Lg('Vom Nullpunkt aus: X ist die Ankathete, Y die Gegenkathete.','Seen from the origin: X is the adjacent side, Y is the opposite side.')});
}

/* =================== THEMEN =================== */
const TOPICS=[
 {id:'gl',tab:Lg('Formeln','Formulas'),name:Lg('Gleichungen & Formeln','Equations & formulas'),sub:Lg('Gleichungen lösen, Formeln umstellen und mit Werten rechnen.','Solve equations, rearrange formulas and calculate with values.'),levels:[
  {name:Lg('Ein Schritt','One step'),desc:Lg('Plus, minus, mal, geteilt: eine Gegenoperation reicht.','Plus, minus, times, divided by: one inverse operation is enough.'),ex:'x + 5 = 12',descH:Lg('Ein Schritt mit negativen Zahlen und Kommazahlen.','One step with negative numbers and decimals.'),exH:`${M}4x = 18`,make:h=>uniq(h?gen1h:gen1)},
  {name:Lg('Zwei Schritte','Two steps'),desc:Lg('Erst Plus und Minus wegräumen, dann Mal und Geteilt.','First get rid of plus and minus, then times and divided by.'),ex:'3x + 4 = 19',descH:Lg('Minus vor dem x, Kommazahlen, Klammer mit Geteilt.','Minus in front of x, decimals, bracket with division.'),exH:`(x + 3) : 4 = ${M}2`,make:h=>uniq(h?gen2h:gen2)},
  {name:Lg('x auf beiden Seiten','x on both sides'),desc:Lg('Klammern, x links und rechts, Minus vor dem x.','Brackets, x on the left and right, minus in front of x.'),ex:'5x + 3 = 2x + 9',descH:Lg('Klammern auflösen, Minus vor der Klammer, Brüche.','Remove brackets, minus in front of a bracket, fractions.'),exH:'x/2 + x/3 = 10',make:h=>uniq(h?gen3h:gen3)},
  {name:Lg('Formeln umstellen','Rearranging formulas'),desc:Lg('Buchstaben statt Zahlen. Wähle die richtige Umstellung.','Letters instead of numbers. Choose the correct rearrangement.'),ex:'n = 1000 · vc / (π · d)',descH:Lg('Formeln mit Quadrat, Wurzel und Klammern.','Formulas with squares, roots and brackets.'),exH:'d = √(4 · A / π)',make:h=>shuffle(h?BANKH:BANK).slice(0,N_Q).map(mkMC)},
  {name:Lg('Aus der Werkstatt','From the workshop'),desc:Lg('Drehzahl, Vorschub, Druck, Hauptzeit: umstellen und ausrechnen.','Spindle speed, feed, pressure, machining time: rearrange and calculate.'),ex:'vf = f · n,  n = ?',descH:Lg('Hauptzeit, Kegel, Wärmeausdehnung, Pythagoras.','Machining time, taper, thermal expansion, Pythagoras.'),exH:'th = L · i / (n · f),  n = ?',make:h=>typesMix(h?gen5h:gen5,7)}
 ]},
 {id:'pot',tab:Lg('Potenzen','Powers'),name:Lg('Potenzen & Zehnerpotenzen','Powers & powers of ten'),sub:Lg('Potenzen berechnen, Potenzgesetze, Zehnerpotenzen und Vorsilben.','Calculate powers, power laws, powers of ten and prefixes.'),levels:[
  {name:Lg('Potenzen berechnen','Calculating powers'),desc:Lg('Basis hoch Exponent, 10er-Potenzen, hoch 0 und hoch 1.','Base to the power of exponent, powers of 10, power of 0 and power of 1.'),ex:'3^{4} = 81',descH:Lg('Negative Basis, Minus vor der Potenz, negative Exponenten, Kommazahlen.','Negative base, minus in front of the power, negative exponents, decimals.'),exH:Lg(`2^{${M}3} = 0,125`,`2^{${M}3} = 0.125`),make:h=>uniq(()=>pot1(h))},
  {name:Lg('Potenzgesetze','Power laws'),desc:Lg('Malnehmen, teilen und potenzieren mit gleicher Basis.','Multiply, divide and raise to a power with the same base.'),ex:'a^{3} · a^{4} = a^{7}',descH:Lg('Mit negativen Exponenten und mehreren Schritten.','With negative exponents and several steps.'),exH:`a^{5} · a^{${M}8} = a^{${M}3}`,make:h=>uniq(()=>pot2(h))},
  {name:Lg('Zehnerpotenzen schreiben','Writing powers of ten'),desc:Lg('Große und kleine Zahlen in Normform bringen.','Write large and small numbers in standard form.'),ex:Lg('45 000 = 4,5 · 10^{4}','45,000 = 4.5 · 10^{4}'),descH:Lg('Zurück in normale Zahlen, auch ohne Normform.','Back to ordinary numbers, also without standard form.'),exH:Lg(`0,00072 = 72 · 10^{${M}5}`,`0.00072 = 72 · 10^{${M}5}`),make:h=>uniq(()=>pot3(h))},
  {name:Lg('Rechnen mit Zehnerpotenzen','Calculating with powers of ten'),desc:Lg('Malnehmen und teilen in Zehnerpotenz-Schreibweise.','Multiply and divide in powers-of-ten notation.'),ex:'(3 · 10^{4}) · (2 · 10^{3})',descH:Lg('Negative Exponenten und Normform herstellen.','Negative exponents and writing in standard form.'),exH:`(5 · 10^{3}) · (4 · 10^{${M}5})`,make:h=>uniq(()=>pot4(h))},
  {name:Lg('Vorsilben','Prefixes'),desc:Lg('Kilo, Mega, Milli, Mikro und Co. als Zehnerpotenz.','Kilo, Mega, Milli, Micro and so on as powers of ten.'),ex:`1 µm = 10^{${M}6} m`,descH:Lg('Zwischen Vorsilben umrechnen.','Converting between prefixes.'),exH:Lg('0,25 mm = 250 µm','0.25 mm = 250 µm'),make:h=>uniq(()=>pot5(h))}
 ]},
 {id:'ein',tab:Lg('Einheiten','Units'),name:Lg('Einheiten umrechnen','Converting units'),sub:Lg('Längen, Flächen, Volumen, Zeit, Kraft, Druck und Zoll.','Lengths, areas, volumes, time, force, pressure and inches.'),levels:[
  {name:Lg('Längen','Lengths'),desc:Lg('mm, cm, dm, m, km und µm.','mm, cm, dm, m, km and µm.'),ex:Lg('2,5 m = 2500 mm','2.5 m = 2500 mm'),descH:Lg('Über mehrere Stufen, mit Kommazahlen.','Over several steps, with decimals.'),exH:Lg('0,035 mm = 35 µm','0.035 mm = 35 µm'),make:h=>uniq(()=>ein1(h))},
  {name:Lg('Flächen','Areas'),desc:Lg('mm², cm², dm², m²: Faktor 100 pro Stufe.','mm², cm², dm², m²: factor 100 per step.'),ex:Lg('3,5 cm² = 350 mm²','3.5 cm² = 350 mm²'),descH:Lg('Große Sprünge, z. B. m² in mm².','Big jumps, e.g. m² to mm².'),exH:Lg('0,04 m² = 40 000 mm²','0.04 m² = 40,000 mm²'),make:h=>uniq(()=>ein2(h))},
  {name:Lg('Volumen','Volumes'),desc:Lg('mm³, cm³, dm³, m³, Liter und Milliliter.','mm³, cm³, dm³, m³, litres and millilitres.'),ex:Lg('2,5 l = 2500 cm³','2.5 l = 2500 cm³'),descH:Lg('Große Sprünge zwischen m³, l und mm³.','Big jumps between m³, l and mm³.'),exH:Lg('12 500 mm³ = 0,0125 l','12,500 mm³ = 0.0125 l'),make:h=>uniq(()=>ein3(h))},
  {name:Lg('Zeit & Geschwindigkeit','Time & speed'),desc:Lg('h, min, s sowie m/min, m/s und km/h.','h, min, s as well as m/min, m/s and km/h.'),ex:Lg('90 m/min = 1,5 m/s','90 m/min = 1.5 m/s'),descH:Lg('Stunden mit Komma, mm/min in m/s.','Hours as decimals, mm/min to m/s.'),exH:Lg('2 h 15 min = 2,25 h','2 h 15 min = 2.25 h'),make:h=>uniq(()=>ein4(h))},
  {name:Lg('Kraft, Masse, Druck, Zoll','Force, mass, pressure, inches'),desc:Lg('kN, t, bar, MPa und Zoll in mm.','kN, t, bar, MPa and inches to mm.'),ex:Lg('1 Zoll = 25,4 mm','1 inch = 25.4 mm'),descH:Lg('bar in N/mm², mg in kg, Zoll-Brüche.','bar to N/mm², mg to kg, inch fractions.'),exH:Lg('3/8 Zoll = 9,525 mm','3/8 inch = 9.525 mm'),make:h=>uniq(()=>ein5(h))}
 ]},
 {id:'win',tab:Lg('Winkel','Angles'),name:Lg('Winkelfunktionen','Trigonometry'),sub:Lg('Sinus, Kosinus und Tangens im rechtwinkligen Dreieck.','Sine, cosine and tangent in the right triangle.'),levels:[
  {name:Lg('Seiten erkennen','Identifying sides'),desc:Lg('Gegenkathete, Ankathete, Hypotenuse und welche Funktion passt.','Opposite, adjacent, hypotenuse and which function fits.'),ex:'sin α = a / c',descH:Lg('Gedrehte Dreiecke und andere Buchstaben.','Rotated triangles and other letters.'),exH:'cos γ = ?',make:h=>uniq(()=>win1(h))},
  {name:Lg('Seite berechnen','Calculating a side'),desc:Lg('Winkel und eine Seite gegeben: die zweite Seite berechnen.','Angle and one side given: calculate the second side.'),ex:'a = c · sin α',descH:Lg('Auch wenn die gesuchte Seite im Nenner steht.','Also when the unknown side is in the denominator.'),exH:'c = a / sin α',make:h=>uniq(()=>win2(h))},
  {name:Lg('Winkel berechnen','Calculating an angle'),desc:Lg('Zwei Seiten gegeben: Winkel mit sin⁻¹, cos⁻¹, tan⁻¹.','Two sides given: find the angle with sin⁻¹, cos⁻¹, tan⁻¹.'),ex:`α = sin^{${M}1}(a / c)`,descH:Lg('Gedrehte Dreiecke, auch den anderen Winkel.','Rotated triangles, also the other angle.'),exH:`β = 90° ${M} α`,make:h=>uniq(()=>win3(h))},
  {name:Lg('Aus der Werkstatt','From the workshop'),desc:Lg('Sinuslineal, Kegel, Lochkreis, Schräge.','Sine bar, taper, pitch circle, slope.'),ex:'h = L · sin α',descH:Lg('Kegel nach d, Lochkreis mit Vorzeichen, Gewinde.','Taper for d, pitch circle with signs, threads.'),exH:'tan φ = P / (π · d2)',make:h=>uniq(()=>win4(h))}
 ]}
];
const TOPIC=id=>TOPICS.find(t=>t.id===id)||TOPICS[0];
function buildQs(tid,lv,h){return TOPIC(tid).levels[lv-1].make(h);}
