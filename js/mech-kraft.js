/* SA-Ready · Mechanik · Aufgaben Teil 1
   Thema „Kraft & Gewicht“ und Thema „Zerlegen & Resultierende“.
   Jede Aufgabe: Zahlen zufällig, Lösung, Toleranz, Lösungsweg, Tipp, Skizze. Deutsch und Englisch. */
'use strict';
const GN=9.81;
const DEC=(x,d)=>{const f=10**d;return Math.round(x*f+(x>=0?1e-9:-1e-9))/f;};
const tolR=(a,d)=>Math.max(0.51*10**-d,Math.abs(a)*0.003);
const RTXT=d=>d===0?Lg('Auf ganze Zahlen runden.','Round to whole numbers.'):d===1?Lg('Auf eine Kommastelle runden.','Round to one decimal place.'):d===2?Lg('Auf zwei Kommastellen runden.','Round to two decimal places.'):Lg('Auf drei Kommastellen runden.','Round to three decimal places.');
const FIGN=Lg('Skizze, nicht maßstäblich.','Sketch, not to scale.');
const ARR=(v)=>v>=0?'→':'←';
/* Zahlenaufgabe der Mechanik. sym: Formelzeichen der Lösung, ans: Lösung, dec: Nachkommastellen, tol: eigene Toleranz */
function MQ(o){
  const dec=o.dec==null?2:o.dec,ans=Math.abs(o.ans)<1e-9?0:o.ans,ex=Math.abs(ans-DEC(ans,dec))<1e-9;
  return Q({mode:'plain',ctx:o.ctx||'',eq:o.sym+' = ?',label:o.label,given:o.given,pre:o.sym+' =',unit:o.unit,answer:ans,
    tol:o.tol!=null?o.tol:(ex?Math.max(1e-6,Math.abs(ans)*2e-4):tolR(ans,dec)),
    answerText:`${o.sym} ${ex?'=':'≈'} ${fmt(DEC(ans,dec))} ${o.unit}`,steps:rows(o.steps),fig:o.fig||'',figNote:o.fig?FIGN:'',
    fine:o.fine!=null?o.fine:(ex?'':RTXT(dec)),tip:o.tip||'',meta:o.meta||{}});
}
/* Auswahlfrage der Mechanik. it: {ctx,q,ok,bad[],why,tip,fig} */
function MC(it){
  const opts=shuffle([it.ok,...it.bad]);
  return Q({kind:'mc',mode:'plain',long:true,ctx:it.ctx||'',eq:it.q,label:it.label||'',options:opts,correctIdx:opts.indexOf(it.ok),answerText:it.ok,
    steps:rows([[it.ok,'',it.why]]),fig:it.fig||'',figNote:it.fig?FIGN:'',tip:it.tip||Lg('Überlege, welche Regel der Statik hier gilt.','Think about which rule of statics applies here.')});
}
const mcBank=(bank,n)=>shuffle(bank).slice(0,n||N_Q).map(MC);
const sgn=v=>v<0?`${M} ${fmt(-v)}`:fmt(v);
const sgnT=v=>v<0?`${M} ${fmt(-v)}`:`+ ${fmt(v)}`;
const D2=Math.PI/180;
const dg=a=>fmt(a)+'°';
const C=(a,d)=>Math.cos(a*D2),Sn=(a,d)=>Math.sin(a*D2);

/* =================== 1  KRAFT & GEWICHT =================== */
const FG_='F_{G}',G_=Lg('g = 9,81 m/s²','g = 9.81 m/s²');
const GFINE=Lg('Fallbeschleunigung g = 9,81 m/s².','Acceleration due to gravity g = 9.81 m/s².');
const MAT=[[Lg('Stahl','steel'),7.85],[Lg('Aluminium','aluminium'),2.7],[Lg('Gusseisen','cast iron'),7.2],[Lg('Messing','brass'),8.5],[Lg('Kupfer','copper'),8.9]];
function kg1(h){
  const t=rnd(0,h?3:2),ctx=Lg('Gewichtskraft','Weight force');
  if(t===0){
    const m=h?pick([12.4,23.6,37.2,48.8,62,84.6,125,240.4,480]):pick([2,5,8,10,12,15,20,25,40,50,60,75,80,90,100]);
    const a=m*GN;
    return MQ({ctx,sym:FG_,ans:a,unit:'N',dec:2,label:Lg('Berechne die Gewichtskraft','Calculate the weight force'),given:[['m',`${fmt(m)} kg`],['g','9,81 m/s²'.replace(',',EN?'.':',')]],fig:mf.hang('m'),
      steps:[[`${FG_} = m · g`,'',Lg('Gewichtskraft = Masse mal Fallbeschleunigung.','Weight force = mass times acceleration due to gravity.')],[`${FG_} = ${fmt(m)} kg · ${fmt(GN)} m/s²`],[`${FG_} ${DEC(a,2)===a?'=':'≈'} ${fmt(DEC(a,2))} N`,'',Lg('1 kg · m/s² = 1 N','1 kg · m/s² = 1 N')]],
      tip:Lg('Gewichtskraft = Masse mal 9,81. Das Ergebnis hat die Einheit Newton.','Weight force = mass times 9.81. The result is in newtons.'),meta:{w:'kg1',t,m}});
  }
  if(t===1){
    const m=h?pick([30,45,120,250,300,640,1200,1800]):pick([5,10,20,25,40,50,60,80,100,150]),F=DEC(m*GN,2);
    return MQ({ctx,sym:'m',ans:F/GN,unit:'kg',dec:h?1:0,label:Lg('Berechne die Masse','Calculate the mass'),given:[[FG_,`${fmt(F)} N`]],fig:mf.hang('m'),
      steps:[[`${FG_} = m · g`,`: g`,Lg('Gesucht ist m. Beide Seiten durch g teilen.','The unknown is m. Divide both sides by g.')],[`m = ${FG_} / g`],[`m = ${fmt(F)} N / ${fmt(GN)} m/s² = ${fmt(F/GN,h?1:0)} kg`]],
      tip:Lg('Umgekehrt: Masse = Gewichtskraft geteilt durch 9,81.','Reverse: mass = weight force divided by 9.81.'),meta:{w:'kg1',t,m}});
  }
  if(t===2){
    const m=h?pick([1.35,2.8,4.6,0.75,12.4]):pick([1,2,2.5,3,4,5,6,8,10,12.5,15,20]),a=m*GN;
    return MQ({ctx:Lg('Masse in Tonnen','Mass in tonnes'),sym:FG_,ans:a,unit:'kN',dec:h?2:3,label:Lg('Berechne die Gewichtskraft in kN','Calculate the weight force in kN'),given:[['m',`${fmt(m)} t`]],fig:mf.hang('m'),
      steps:[[`m = ${fmt(m)} t = ${fmt(m*1000)} kg`,'',Lg('1 t = 1000 kg','1 t = 1000 kg')],[`${FG_} = m · g = ${fmt(m*1000)} kg · ${fmt(GN)} m/s²`],[`${FG_} = ${fmt(DEC(m*1000*GN,2))} N`],[`${FG_} ${DEC(a,h?2:3)===a?'=':'≈'} ${fmt(DEC(a,h?2:3))} kN`,'',Lg('1 kN = 1000 N','1 kN = 1000 N')]],
      tip:Lg('Tonnen zuerst in kg umrechnen. Am Ende N in kN: durch 1000.','Convert tonnes to kg first. At the end N to kN: divide by 1000.'),meta:{w:'kg1',t,m}});
  }
  const F=pick([4.5,8,12.5,18,24,36,50]),a=F*1000/GN;
  return MQ({ctx:Lg('Kraft in kN','Force in kN'),sym:'m',ans:a,unit:'kg',dec:0,label:Lg('Berechne die Masse in kg','Calculate the mass in kg'),given:[[FG_,`${fmt(F)} kN`]],fig:mf.hang('m'),
    steps:[[`${FG_} = ${fmt(F)} kN = ${fmt(F*1000)} N`,'',Lg('1 kN = 1000 N','1 kN = 1000 N')],[`m = ${FG_} / g`],[`m = ${fmt(F*1000)} N / ${fmt(GN)} m/s² ≈ ${fmt(DEC(a,0))} kg`]],
    tip:Lg('kN zuerst in N umrechnen, dann durch 9,81 teilen.','Convert kN to N first, then divide by 9.81.'),meta:{w:'kg1',t,F}});
}

/* Kräfte auf einer Wirkungslinie */
function kg2(h){
  const t=rnd(0,h?3:2),ctx=Lg('Eine Wirkungslinie','One line of action');
  const unit=h?'kN':'N',R=h?()=>rnd(2,40)/2:()=>rnd(2,20)*5;
  const lst=n=>{let L;do{L=Array.from({length:n},()=>(Math.random()<.5?-1:1)*R());}while(L.every(v=>v>0)||L.every(v=>v<0));return L;};
  const labs=['F_{1}','F_{2}','F_{3}','F_{4}','F_{5}'];
  const chips=L=>L.map((v,i)=>[labs[i],`${fmt(Math.abs(v))} ${unit} ${ARR(v)}`]);
  const sumTxt=L=>L.map((v,i)=>i===0?(v<0?`${M} ${fmt(-v)}`:fmt(v)):(v<0?`${M} ${fmt(-v)}`:`+ ${fmt(v)}`)).join(' ');
  const tipR=Lg('Rechts positiv, links negativ. Alle Kräfte mit Vorzeichen addieren.','Right is positive, left is negative. Add all forces with their signs.');
  if(t===0||t===1||(h&&t===3)){
    const n=t===0?2:t===1?3:4,L=lst(n),R_=L.reduce((a,b)=>a+b,0);
    const fig=mf.line(L.map((v,i)=>({v,lab:labs[i]})));
    return MQ({ctx,sym:'F_{R}',ans:R_,unit,dec:h?1:0,label:Lg('Berechne die Resultierende. Rechts ist positiv.','Calculate the resultant. Right is positive.'),given:chips(L),fig,
      steps:[[Lg('Rechts +, links −','Right +, left −'),'',Lg('Kräfte auf einer Wirkungslinie addierst du mit Vorzeichen.','Forces on one line of action are added with their signs.')],[`F_{R} = ${sumTxt(L)}`],[`F_{R} = ${fmt(R_)} ${unit}`,'',R_>0?Lg('Positiv: Die Resultierende zeigt nach rechts.','Positive: the resultant points to the right.'):R_<0?Lg('Negativ: Die Resultierende zeigt nach links.','Negative: the resultant points to the left.'):Lg('Null: Der Körper ist im Gleichgewicht.','Zero: the body is in equilibrium.')]],
      tip:tipR,meta:{w:'kg2',L}});
  }
  if(t===2){
    const L=lst(2),X=-(L[0]+L[1]);
    const fig=mf.line([...L.map((v,i)=>({v,lab:labs[i]})),{v:X||1,lab:'F_{3}'}]);
    return MQ({ctx:Lg('Gleichgewicht','Equilibrium'),sym:'F_{3}',ans:X,unit,dec:h?1:0,label:Lg('Welche Kraft F3 hält den Körper im Gleichgewicht? Rechts ist positiv.','Which force F3 keeps the body in equilibrium? Right is positive.'),given:chips(L),fig:null,
      steps:[[Lg('Gleichgewicht: Σ F = 0','Equilibrium: Σ F = 0'),'',Lg('Die Summe aller Kräfte muss null sein.','The sum of all forces must be zero.')],[`F_{1} + F_{2} + F_{3} = 0`],[`F_{3} = ${M}(F_{1} + F_{2}) = ${M}(${sumTxt(L)})`],[`F_{3} = ${fmt(X)} ${unit}`,'',X>0?Lg('Positiv: F3 muss nach rechts zeigen.','Positive: F3 must point to the right.'):Lg('Negativ: F3 muss nach links zeigen.','Negative: F3 must point to the left.')]],
      tip:Lg('Im Gleichgewicht ist die Summe null. Die gesuchte Kraft ist das Gegenteil der Summe der anderen.','In equilibrium the sum is zero. The unknown force is the opposite of the sum of the others.'),meta:{w:'kg2',L,X}});
  }
  /* Schwer: Resultierende bekannt, eine Kraft gesucht */
  const L=lst(3),Rv=L.reduce((a,b)=>a+b,0),X=L[2],K=[L[0],L[1]];
  return MQ({ctx,sym:'F_{3}',ans:X,unit,dec:1,label:Lg('Die Resultierende ist bekannt. Berechne F3. Rechts ist positiv.','The resultant is known. Calculate F3. Right is positive.'),given:[...chips(K),['F_{R}',`${fmt(Rv)} ${unit}`]],
    fig:mf.line(L.map((v,i)=>({v,lab:labs[i]}))),
    steps:[[`F_{R} = F_{1} + F_{2} + F_{3}`,`${M} F_{1} ${M} F_{2}`,Lg('Nach F3 umstellen.','Rearrange for F3.')],[`F_{3} = F_{R} ${M} F_{1} ${M} F_{2}`],[`F_{3} = ${par(Rv)} ${M} ${par(K[0])} ${M} ${par(K[1])} = ${fmt(X)} ${unit}`]],
    tip:Lg('Setze die Vorzeichen mit: rechts +, links −. Dann nach F3 umstellen.','Insert the signs: right +, left −. Then rearrange for F3.'),meta:{w:'kg2',L,Rv}});
}

/* Grundbegriffe (Auswahl) */
const KG3N=[
 {q:Lg('In welcher Einheit wird die Kraft gemessen?','In which unit is force measured?'),ok:'Newton (N)',bad:Lg(['Kilogramm (kg)','Pascal (Pa)','Meter pro Sekunde (m/s)'],['Kilogram (kg)','Pascal (Pa)','Metres per second (m/s)']),why:Lg('Die Einheit der Kraft ist das Newton. 1 N = 1 kg · m/s². Das Kilogramm ist die Einheit der Masse.','The unit of force is the newton. 1 N = 1 kg · m/s². The kilogram is the unit of mass.')},
 {q:Lg('Wodurch ist eine Kraft vollständig bestimmt?','What fully defines a force?'),ok:Lg('Betrag, Richtung und Angriffspunkt','Magnitude, direction and point of application'),bad:Lg(['Nur durch den Betrag','Betrag und Masse','Richtung und Zeit'],['Magnitude only','Magnitude and mass','Direction and time']),why:Lg('Eine Kraft ist ein Vektor. Du brauchst Betrag (Größe), Richtung und Angriffspunkt, sonst kannst du sie nicht zeichnen.','A force is a vector. You need magnitude, direction and point of application, otherwise you cannot draw it.')},
 {q:Lg('Wie viele Newton sind 2,5 kN?','How many newtons are 2.5 kN?'),ok:Lg('2500 N','2500 N'),bad:Lg(['25 N','250 N','25 000 N'],['25 N','250 N','25,000 N']),why:Lg('1 kN = 1000 N. Also 2,5 · 1000 N = 2500 N.','1 kN = 1000 N. So 2.5 · 1000 N = 2500 N.')},
 {q:Lg('Wohin zeigt die Gewichtskraft?','Where does the weight force point?'),ok:Lg('Senkrecht nach unten, zum Erdmittelpunkt','Vertically downwards, towards the centre of the Earth'),bad:Lg(['Waagerecht in Bewegungsrichtung','Senkrecht nach oben','Immer schräg zur Unterlage'],['Horizontally in the direction of motion','Vertically upwards','Always at an angle to the surface']),why:Lg('Die Gewichtskraft greift im Schwerpunkt an und zeigt immer lotrecht nach unten.','The weight force acts at the centre of gravity and always points straight down.')},
 {q:Lg('Ein Körper hat auf der Erde 10 kg. Welche Masse hat er auf dem Mond?','A body has 10 kg on Earth. What mass does it have on the Moon?'),ok:Lg('10 kg, die Masse ändert sich nicht','10 kg, the mass does not change'),bad:Lg(['Etwa 1,6 kg','Etwa 60 kg','0 kg, auf dem Mond ist alles schwerelos'],['About 1.6 kg','About 60 kg','0 kg, everything is weightless on the Moon']),why:Lg('Die Masse ist überall gleich. Nur die Gewichtskraft F = m · g ändert sich, weil g auf dem Mond kleiner ist.','Mass is the same everywhere. Only the weight force F = m · g changes, because g is smaller on the Moon.')},
 {q:Lg('Ein Körper drückt mit 80 N auf den Tisch. Wie groß ist die Kraft des Tisches auf den Körper?','A body presses on a table with 80 N. How large is the force of the table on the body?'),ok:Lg('80 N, nach oben','80 N, upwards'),bad:Lg(['80 N, nach unten','0 N','40 N, nach oben'],['80 N, downwards','0 N','40 N, upwards']),why:Lg('Wechselwirkungsgesetz: Zu jeder Kraft gibt es eine gleich große Gegenkraft in die entgegengesetzte Richtung.','Law of interaction: every force has an equally large opposing force in the opposite direction.')},
 {q:Lg('Darf man eine Kraft entlang ihrer Wirkungslinie verschieben, ohne die Wirkung auf einen starren Körper zu ändern?','May a force be moved along its line of action without changing its effect on a rigid body?'),ok:Lg('Ja, die Wirkung bleibt gleich','Yes, the effect stays the same'),bad:Lg(['Nein, dann ändert sich die Wirkung','Nur wenn die Kraft kleiner als 10 N ist','Nur senkrecht zur Wirkungslinie'],['No, the effect changes','Only if the force is smaller than 10 N','Only perpendicular to the line of action']),why:Lg('Das ist der Verschiebungssatz (Linienflüchtigkeit). Entlang der Wirkungslinie darf eine Kraft frei wandern.','This is the principle of transmissibility. A force may slide freely along its line of action.')},
 {q:Lg('Welche Bedingung gilt für Kräfte auf einer Wirkungslinie im Gleichgewicht?','Which condition applies to forces on one line of action in equilibrium?'),ok:Lg('Die Summe aller Kräfte ist null','The sum of all forces is zero'),bad:Lg(['Alle Kräfte sind gleich groß','Es wirkt nur eine Kraft','Alle Kräfte zeigen nach rechts'],['All forces are equally large','Only one force acts','All forces point to the right']),why:Lg('Gleichgewicht heißt: Σ F = 0. Die Kräfte nach rechts und nach links heben sich genau auf.','Equilibrium means Σ F = 0. The forces to the right and to the left cancel exactly.')},
 {q:Lg('30 N nach rechts und 30 N nach links auf einer Wirkungslinie. Wie groß ist die Resultierende?','30 N to the right and 30 N to the left on one line of action. What is the resultant?'),ok:Lg('0 N, der Körper ist im Gleichgewicht','0 N, the body is in equilibrium'),bad:Lg(['60 N nach rechts','30 N nach links','60 N nach links'],['60 N to the right','30 N to the left','60 N to the left']),why:Lg('Entgegengesetzte Kräfte werden subtrahiert: +30 N − 30 N = 0 N.','Opposite forces are subtracted: +30 N − 30 N = 0 N.')},
 {q:Lg('Was bedeutet ΣF_{x} = 0?','What does ΣF_{x} = 0 mean?'),ok:Lg('Die Summe aller waagerechten Kräfte ist null','The sum of all horizontal forces is zero'),bad:Lg(['Alle Kräfte sind null','Die Summe aller Momente ist null','Die Kräfte wirken nur in x-Richtung'],['All forces are zero','The sum of all moments is zero','The forces only act in the x direction']),why:Lg('Σ steht für „Summe“. F_{x} sind die Kraftanteile in x-Richtung, also waagerecht.','Σ stands for “sum”. F_{x} are the force components in x direction, that is horizontal.')},
 {q:Lg('Mit welcher Formel rechnest du die Gewichtskraft aus?','Which formula do you use for the weight force?'),ok:'F_{G} = m · g',bad:['F_{G} = m / g','F_{G} = g / m','F_{G} = m + g'],why:Lg('Gewichtskraft = Masse mal Fallbeschleunigung.','Weight force = mass times acceleration due to gravity.')},
 {q:Lg('Welchen Wert hat die Fallbeschleunigung g auf der Erde?','What is the value of the acceleration due to gravity g on Earth?'),ok:Lg('9,81 m/s²','9.81 m/s²'),bad:Lg(['1,62 m/s²','98,1 m/s²','0,981 m/s²'],['1.62 m/s²','98.1 m/s²','0.981 m/s²']),why:Lg('Auf der Erde gilt g ≈ 9,81 m/s². Der Wert 1,62 m/s² gehört zum Mond.','On Earth g ≈ 9.81 m/s². The value 1.62 m/s² belongs to the Moon.')}
];
const KG3H=[
 {q:Lg('Was kennzeichnet ein zentrales Kräftesystem?','What characterises a concurrent (central) force system?'),ok:Lg('Alle Wirkungslinien schneiden sich in einem Punkt','All lines of action meet at one point'),bad:Lg(['Alle Kräfte sind gleich groß','Alle Kräfte wirken senkrecht','Es wirkt nur ein Moment'],['All forces are equally large','All forces act at right angles','Only a moment acts']),why:Lg('Beim zentralen Kräftesystem greifen alle Kräfte (gedanklich) in einem Punkt an. Dann entsteht kein Moment um diesen Punkt.','In a concurrent system all forces (in effect) act at one point. Then there is no moment about that point.')},
 {q:Lg('Wann spricht man von einem allgemeinen Kräftesystem?','When do we speak of a general force system?'),ok:Lg('Wenn sich die Wirkungslinien nicht in einem Punkt schneiden','When the lines of action do not meet at one point'),bad:Lg(['Wenn alle Kräfte gleich groß sind','Wenn nur zwei Kräfte wirken','Wenn alle Kräfte waagerecht sind'],['When all forces are equally large','When only two forces act','When all forces are horizontal']),why:Lg('Beim allgemeinen Kräftesystem entstehen Momente. Darum braucht man zusätzlich Σ M = 0.','In a general system moments occur. That is why you also need Σ M = 0.')},
 {q:Lg('Wie viele Gleichgewichtsbedingungen gibt es für ein allgemeines Kräftesystem in der Ebene?','How many equilibrium conditions are there for a general planar force system?'),ok:Lg('3: ΣF_{x} = 0, ΣF_{y} = 0 und ΣM = 0','3: ΣF_{x} = 0, ΣF_{y} = 0 and ΣM = 0'),bad:Lg(['2: ΣF_{x} = 0 und ΣF_{y} = 0','1: ΣF = 0','4: ΣF_{x}, ΣF_{y}, ΣM und ΣW'],['2: ΣF_{x} = 0 and ΣF_{y} = 0','1: ΣF = 0','4: ΣF_{x}, ΣF_{y}, ΣM and ΣW']),why:Lg('In der Ebene gibt es drei Gleichungen: waagerecht, senkrecht und Momente. Damit lassen sich drei Unbekannte berechnen.','In the plane there are three equations: horizontal, vertical and moments. They let you find three unknowns.')},
 {q:Lg('Wie viele Gleichgewichtsbedingungen braucht ein zentrales Kräftesystem in der Ebene?','How many equilibrium conditions does a concurrent planar force system need?'),ok:Lg('2: ΣF_{x} = 0 und ΣF_{y} = 0','2: ΣF_{x} = 0 and ΣF_{y} = 0'),bad:Lg(['3: ΣF_{x}, ΣF_{y} und ΣM','1: nur ΣF_{x} = 0','4'],['3: ΣF_{x}, ΣF_{y} and ΣM','1: only ΣF_{x} = 0','4']),why:Lg('Alle Kräfte gehen durch einen Punkt, also entsteht um diesen Punkt kein Moment. Es bleiben zwei Gleichungen.','All forces pass through one point, so there is no moment about it. Two equations remain.')},
 {q:Lg('Was ist die Resultierende eines Kräftepaars?','What is the resultant of a force couple?'),ok:Lg('Null, es entsteht nur ein Moment','Zero, only a moment results'),bad:Lg(['Die doppelte Kraft','Die halbe Kraft','Sie lässt sich nicht angeben'],['Twice the force','Half the force','It cannot be stated']),why:Lg('Zwei gleich große, entgegengesetzte, parallele Kräfte heben sich als Kraft auf. Übrig bleibt das Moment M = F · d.','Two equal, opposite, parallel forces cancel as a force. What remains is the moment M = F · d.')},
 {q:Lg('Zwei Kräfte halten einen Körper im Gleichgewicht. Was gilt?','Two forces hold a body in equilibrium. What applies?'),ok:Lg('Gleich groß, entgegengesetzt, auf derselben Wirkungslinie','Equal, opposite, on the same line of action'),bad:Lg(['Gleich groß und gleichgerichtet','Gleich groß, entgegengesetzt, aber seitlich versetzt','Sie dürfen beliebig groß sein'],['Equal and in the same direction','Equal, opposite, but offset sideways','They may be of any size']),why:Lg('Sind die Kräfte seitlich versetzt, bilden sie ein Kräftepaar und der Körper dreht sich. Darum müssen sie auf einer Linie liegen.','If the forces are offset sideways they form a couple and the body rotates. So they must lie on one line.')},
 {q:Lg('Drei Kräfte halten einen Körper im Gleichgewicht. Zwei Wirkungslinien schneiden sich in einem Punkt. Wo liegt die dritte?','Three forces hold a body in equilibrium. Two lines of action meet at one point. Where is the third?'),ok:Lg('Sie geht durch denselben Schnittpunkt','It passes through the same point'),bad:Lg(['Sie ist parallel zu einer der beiden','Sie ist immer waagerecht','Sie liegt beliebig'],['It is parallel to one of the two','It is always horizontal','It can be anywhere']),why:Lg('Dreikräfteregel: Sonst würde die dritte Kraft ein Moment um den Schnittpunkt erzeugen, und das Gleichgewicht wäre gestört.','Three-force rule: otherwise the third force would create a moment about the intersection point and equilibrium would be broken.')},
 {q:Lg('Eine Kraft wird seitlich parallel verschoben. Was muss ergänzt werden, damit die Wirkung gleich bleibt?','A force is moved sideways, parallel to itself. What must be added to keep the effect the same?'),ok:Lg('Ein Moment M = F · Abstand','A moment M = F · distance'),bad:Lg(['Eine zweite gleich große Kraft','Nichts, die Wirkung bleibt gleich','Die Masse des Körpers'],['A second, equally large force','Nothing, the effect stays the same','The mass of the body']),why:Lg('Parallelverschiebung ändert die Drehwirkung. Das Versatzmoment M = F · Abstand gleicht das aus.','Moving a force parallel changes its turning effect. The offset moment M = F · distance compensates for it.')},
 {q:Lg('Ein Seil wird mit 500 N gespannt. Mit welcher Kraft zieht es an jedem seiner Enden?','A rope is tensioned with 500 N. With what force does it pull at each end?'),ok:'500 N',bad:['250 N','1000 N','0 N'],why:Lg('Im ruhenden, masselos gedachten Seil ist die Seilkraft überall gleich groß. Die Kräfte an den Enden sind Gegenkräfte.','In a rope at rest (mass neglected) the rope force is equal everywhere. The forces at the ends are opposing forces.')},
 {q:Lg('Die Gewichtskraft einer Last beträgt 4 kN. Welche Masse hat sie?','The weight force of a load is 4 kN. What is its mass?'),ok:Lg('etwa 408 kg','about 408 kg'),bad:Lg(['etwa 39 240 kg','etwa 4 kg','etwa 41 kg'],['about 39,240 kg','about 4 kg','about 41 kg']),why:Lg('m = F / g = 4000 N / 9,81 m/s² ≈ 408 kg.','m = F / g = 4000 N / 9.81 m/s² ≈ 408 kg.')},
 {q:Lg('Welche Einheit hat das Moment einer Kraft?','Which unit does the moment of a force have?'),ok:'N · m',bad:['N / m','N · s','kg · m'],why:Lg('Moment = Kraft mal Hebelarm, also Newton mal Meter. 1 N · m = 1000 N · mm.','Moment = force times lever arm, so newton times metre. 1 N · m = 1000 N · mm.')},
 {q:Lg('Was passiert mit Masse und Gewichtskraft eines Körpers auf dem Mond (g = 1,62 m/s²)?','What happens to the mass and weight force of a body on the Moon (g = 1.62 m/s²)?'),ok:Lg('Die Masse bleibt gleich, die Gewichtskraft wird kleiner','The mass stays the same, the weight force gets smaller'),bad:Lg(['Beide bleiben gleich','Beide werden kleiner','Die Masse wird kleiner, die Gewichtskraft bleibt gleich'],['Both stay the same','Both get smaller','The mass gets smaller, the weight force stays the same']),why:Lg('F_{G} = m · g. Die Masse m ist ortsunabhängig. Nur g ändert sich, darum ändert sich die Gewichtskraft.','F_{G} = m · g. The mass m does not depend on place. Only g changes, so the weight force changes.')}
];
function kg3(h){return mcBank(h?KG3H:KG3N);}

/* Aus der Werkstatt */
function kg4(h){
  const t=rnd(0,h?4:3);
  if(t===0){
    const [mn,rho]=pick(MAT),dims=h?null:[pick([5,10,20]),pick([5,10,20]),pick([5,10,20,40])];
    if(!h){
      const [a,b,c]=dims,V=a*b*c/1000,m=rho*V,F=m*GN;
      return MQ({ctx:Lg('Masse aus Volumen','Mass from volume'),sym:FG_,ans:F,unit:'N',dec:2,label:Lg(`Ein Block aus ${mn} wiegt wie viel? Berechne die Gewichtskraft.`,`How heavy is a block of ${mn}? Calculate the weight force.`),
        given:[[Lg('Maße','Size'),`${a} × ${b} × ${c} cm`],[Lg('Dichte ρ','Density ρ'),`${fmt(rho)} kg/dm³`]],
        steps:[[`V = ${a} · ${b} · ${c} cm³ = ${fmt(a*b*c)} cm³ = ${fmt(V)} dm³`,'',Lg('1 dm³ = 1000 cm³','1 dm³ = 1000 cm³')],[`m = ρ · V = ${fmt(rho)} kg/dm³ · ${fmt(V)} dm³ = ${fmt(DEC(m,3))} kg`],[`${FG_} = m · g = ${fmt(DEC(m,3))} kg · ${fmt(GN)} m/s²`],[`${FG_} ${DEC(F,2)===F?'=':'≈'} ${fmt(DEC(F,2))} N`]],
        tip:Lg('Erst das Volumen in dm³, dann Masse = Dichte mal Volumen, dann mal 9,81.','First the volume in dm³, then mass = density times volume, then times 9.81.'),meta:{w:'kg4',t}});
    }
    const d=pick([20,30,40,50,60,80]),L=pick([200,300,500,800,1000]),V=Math.PI*(d/100)**2/4*(L/100),m=rho*V,F=m*GN;
    return MQ({ctx:Lg('Welle','Shaft'),sym:FG_,ans:F,unit:'N',dec:2,label:Lg(`Berechne die Gewichtskraft einer Welle aus ${mn}`,`Calculate the weight force of a shaft made of ${mn}`),given:[['d',`${d} mm`],['L',`${L} mm`],[Lg('Dichte ρ','Density ρ'),`${fmt(rho)} kg/dm³`]],
      steps:[[`d = ${fmt(d/100)} dm,  L = ${fmt(L/100)} dm`,'',Lg('Millimeter in Dezimeter: durch 100.','Millimetres to decimetres: divide by 100.')],[`V = π · d² / 4 · L = π · ${fmt(d/100)}² / 4 · ${fmt(L/100)} dm³ ≈ ${fmt(DEC(V,4))} dm³`],[`m = ρ · V ≈ ${fmt(DEC(m,3))} kg`],[`${FG_} = m · g ≈ ${fmt(DEC(F,2))} N`]],
      tip:Lg('Zylindervolumen: Kreisfläche mal Länge. Alles in dm einsetzen, dann passt ρ in kg/dm³.','Cylinder volume: circle area times length. Insert everything in dm, then ρ in kg/dm³ fits.'),meta:{w:'kg4',t}});
  }
  if(t===1){
    const m=h?pick([350,640,1250,1800,2400]):pick([100,150,200,250,300,400,500,800,1000]),F=m*GN;
    return MQ({ctx:Lg('Kran','Crane'),sym:'F_{S}',ans:F,unit:'N',dec:h?1:2,label:Lg('Eine Last hängt ruhig am Kranseil. Wie groß ist die Seilkraft?','A load hangs at rest on the crane rope. How large is the rope force?'),given:[['m',`${fmt(m)} kg`]],fig:mf.hang('m','F_{S}'),
      steps:[[Lg('Gleichgewicht: Σ F_{y} = 0','Equilibrium: Σ F_{y} = 0'),'',Lg('Die Last hängt ruhig. Seilkraft nach oben und Gewichtskraft nach unten sind gleich groß.','The load hangs at rest. Rope force upwards and weight force downwards are equal.')],[`F_{S} = ${FG_} = m · g`],[`F_{S} = ${fmt(m)} kg · ${fmt(GN)} m/s² ${DEC(F,h?1:2)===F?'=':'≈'} ${fmt(DEC(F,h?1:2))} N`]],
      tip:Lg('Ruhende Last: Seilkraft = Gewichtskraft.','Load at rest: rope force = weight force.'),meta:{w:'kg4',t}});
  }
  if(t===2){
    const n=h?4:2,m=h?pick([800,1200,2000,2500,3200]):pick([100,200,300,400,600,800]),FGv=m*GN,F=FGv/n;
    return MQ({ctx:Lg('Anschlagmittel','Lifting slings'),sym:'F_{S}',ans:F/(h?1000:1),unit:h?'kN':'N',dec:h?3:2,label:n===2?Lg('Die Last hängt an zwei senkrechten Seilsträngen. Wie groß ist die Kraft in einem Strang?','The load hangs on two vertical rope strands. How large is the force in one strand?'):Lg('Die Last hängt an vier senkrechten Strängen. Wie groß ist die Kraft in einem Strang?','The load hangs on four vertical strands. How large is the force in one strand?'),given:[['m',`${fmt(m)} kg`]],
      steps:[[`${FG_} = m · g = ${fmt(m)} kg · ${fmt(GN)} m/s² = ${fmt(DEC(FGv,2))} N`],[`F_{S} = ${FG_} / ${n}`,'',Lg(`Die ${n} Stränge tragen gleich viel.`,`The ${n} strands carry equal loads.`)],[`F_{S} ${DEC(F,2)===F||h?'≈':'='} ${fmt(DEC(h?F/1000:F,h?3:2))} ${h?'kN':'N'}`]],
      tip:Lg('Erst die Gewichtskraft, dann durch die Zahl der Stränge teilen.','First the weight force, then divide by the number of strands.'),meta:{w:'kg4',t}});
  }
  if(t===3){
    const m=h?pick([1.2,1.8,2.4,3.6]):pick([4,6,8,10,12,16]),n=4,F=m*GN/n;
    return MQ({ctx:Lg('Fahrzeug','Vehicle'),sym:'F_{Rad}'.replace('Rad',EN?'wheel':'Rad'),ans:F,unit:'kN',dec:3,label:Lg('Ein Fahrzeug steht auf vier Rädern, die Last verteilt sich gleichmäßig. Wie groß ist die Radlast?','A vehicle stands on four wheels and the load is spread evenly. How large is the load on one wheel?'),given:[['m',`${fmt(m)} t`]],
      steps:[[`${FG_} = m · g = ${fmt(m*1000)} kg · ${fmt(GN)} m/s² = ${fmt(DEC(m*GN,3))} kN`,'',Lg('1 t = 1000 kg, 1 kN = 1000 N','1 t = 1000 kg, 1 kN = 1000 N')],[`${EN?'F_{wheel}':'F_{Rad}'} = ${FG_} / 4 = ${fmt(DEC(F,3))} kN`]],
      tip:Lg('Gewichtskraft in kN, dann durch vier Räder teilen.','Weight force in kN, then divide by four wheels.'),meta:{w:'kg4',t}});
  }
  const m1=pick([1.2,1.8,2.4,3.5]),m2=pick([60,80,120,150]),F=(m1*1000+m2)*GN/1000;
  return MQ({ctx:Lg('Kran mit Lasthaken','Crane with load hook'),sym:'F_{S}',ans:F,unit:'kN',dec:2,label:Lg('Last und Lasthaken hängen ruhig am Seil. Wie groß ist die Seilkraft?','Load and hook hang at rest on the rope. How large is the rope force?'),given:[[Lg('Last','Load'),`${fmt(m1)} t`],[Lg('Lasthaken','Hook'),`${fmt(m2)} kg`]],fig:mf.hang('m','F_{S}'),
    steps:[[`m = ${fmt(m1*1000)} kg + ${fmt(m2)} kg = ${fmt(m1*1000+m2)} kg`,'',Lg('Beide Massen hängen am Seil.','Both masses hang on the rope.')],[`F_{S} = m · g = ${fmt(m1*1000+m2)} kg · ${fmt(GN)} m/s² ≈ ${fmt(DEC((m1*1000+m2)*GN,1))} N`],[`F_{S} ≈ ${fmt(DEC(F,2))} kN`]],
    tip:Lg('Erst die Massen addieren, dann mal 9,81, dann N in kN.','First add the masses, then times 9.81, then N to kN.'),meta:{w:'kg4',t}});
}

/* =================== 2  ZERLEGEN & RESULTIERENDE =================== */
const comp=(F,a)=>({x:F*C(a),y:F*Sn(a)});
function zr1(h){
  const t=rnd(0,h?3:1),F=h?pick([35,60,85,120,150,240,375]):pick([20,40,50,80,100,120,150,200]),ctx=Lg('Kraftkomponenten','Force components');
  if(t<=1&&!h||t===0&&h){
    const a=h?rnd(12,78):pick([30,45,60]),x=rnd(0,1)===0,hl=x?'Fx':'Fy',r=x?F*C(a):F*Sn(a);
    return MQ({ctx,sym:x?'F_{x}':'F_{y}',ans:r,unit:'N',dec:2,label:x?Lg('Berechne die waagerechte Komponente','Calculate the horizontal component'):Lg('Berechne die senkrechte Komponente','Calculate the vertical component'),given:[['F',`${fmt(F)} N`],['α',dg(a)]],
      fig:mf.vec({a,hl,lx:'F_{x}',ly:'F_{y}'}),fine:RTXT(2)+' '+Lg('Taschenrechner auf DEG.','Calculator in DEG mode.'),
      steps:[[x?`F_{x} = F · cos α`:`F_{y} = F · sin α`,'',x?Lg('Die Komponente am Winkel (anliegend) gehört zum Kosinus.','The component next to the angle (adjacent) goes with the cosine.'):Lg('Die Komponente gegenüber vom Winkel gehört zum Sinus.','The component opposite the angle goes with the sine.')],[x?`F_{x} = ${fmt(F)} N · cos ${fmt(a)}°`:`F_{y} = ${fmt(F)} N · sin ${fmt(a)}°`],[`${x?'F_{x}':'F_{y}'} ≈ ${fmt(DEC(r,2))} N`]],
      tip:x?Lg('Waagerecht: F mal Kosinus des Winkels zur x-Achse.','Horizontal: F times the cosine of the angle to the x axis.'):Lg('Senkrecht: F mal Sinus des Winkels zur x-Achse.','Vertical: F times the sine of the angle to the x axis.'),meta:{w:'zr1',F,a,x}});
  }
  if(!h){
    const a=pick([30,45,60]),x=rnd(0,1)===0,r=x?F*C(a):F*Sn(a);
    return MQ({ctx,sym:x?'F_{x}':'F_{y}',ans:r,unit:'N',dec:2,label:x?Lg('Berechne die waagerechte Komponente','Calculate the horizontal component'):Lg('Berechne die senkrechte Komponente','Calculate the vertical component'),given:[['F',`${fmt(F)} N`],['α',dg(a)]],fig:mf.vec({a,hl:x?'Fx':'Fy',lx:'F_{x}',ly:'F_{y}'}),
      fine:RTXT(2),steps:[[x?`F_{x} = F · cos α`:`F_{y} = F · sin α`],[x?`F_{x} = ${fmt(F)} N · cos ${fmt(a)}°`:`F_{y} = ${fmt(F)} N · sin ${fmt(a)}°`],[`${x?'F_{x}':'F_{y}'} ≈ ${fmt(DEC(r,2))} N`]],tip:Lg('Waagerecht: Kosinus. Senkrecht: Sinus. Der Winkel liegt an der x-Achse.','Horizontal: cosine. Vertical: sine. The angle lies at the x axis.'),meta:{w:'zr1',F,a,x}});
  }
  if(t===1){ /* Winkel an der y-Achse */
    const a=rnd(15,75),x=rnd(0,1)===0,r=x?F*Sn(a):F*C(a);
    return MQ({ctx:Lg('Winkel zur Senkrechten','Angle to the vertical'),sym:x?'F_{x}':'F_{y}',ans:r,unit:'N',dec:2,label:x?Lg('Der Winkel liegt an der y-Achse. Berechne die waagerechte Komponente.','The angle lies at the y axis. Calculate the horizontal component.'):Lg('Der Winkel liegt an der y-Achse. Berechne die senkrechte Komponente.','The angle lies at the y axis. Calculate the vertical component.'),given:[['F',`${fmt(F)} N`],['α',dg(a)+Lg(' (zur y-Achse)',' (to the y axis)')]],
      fig:mf.vec({a:90-a,axis:'y',hl:x?'Fx':'Fy',lx:'F_{x}',ly:'F_{y}'}),
      steps:[[x?`F_{x} = F · sin α`:`F_{y} = F · cos α`,'',Lg('Der Winkel liegt an der y-Achse: Jetzt ist F_{y} die anliegende Komponente (Kosinus) und F_{x} die gegenüberliegende (Sinus).','The angle lies at the y axis: now F_{y} is the adjacent component (cosine) and F_{x} the opposite one (sine).')],[x?`F_{x} = ${fmt(F)} N · sin ${fmt(a)}°`:`F_{y} = ${fmt(F)} N · cos ${fmt(a)}°`],[`${x?'F_{x}':'F_{y}'} ≈ ${fmt(DEC(r,2))} N`]],
      tip:Lg('Winkel an der y-Achse: Sinus und Kosinus tauschen die Rollen.','Angle at the y axis: sine and cosine swap roles.'),meta:{w:'zr1',F,a,x}});
  }
  if(t===2){ /* Quadrant mit Vorzeichen */
    const a=rnd(15,75),q=pick([[1,1,Lg('rechts oben','upper right')],[-1,1,Lg('links oben','upper left')],[-1,-1,Lg('links unten','lower left')],[1,-1,Lg('rechts unten','lower right')]]),
      th=(q[0]>0?(q[1]>0?a:360-a):(q[1]>0?180-a:180+a)),x=rnd(0,1)===0,r=x?q[0]*F*C(a):q[1]*F*Sn(a);
    return MQ({ctx:Lg('Vorzeichen','Signs'),sym:x?'F_{x}':'F_{y}',ans:r,unit:'N',dec:2,label:x?Lg(`Die Kraft zeigt nach ${q[2]}. Berechne F_{x} mit Vorzeichen (rechts +).`,`The force points ${q[2]}. Calculate F_{x} with its sign (right +).`):Lg(`Die Kraft zeigt nach ${q[2]}. Berechne F_{y} mit Vorzeichen (oben +).`,`The force points ${q[2]}. Calculate F_{y} with its sign (up +).`),given:[['F',`${fmt(F)} N`],[Lg('Winkel zur x-Achse','Angle to x axis'),dg(a)]],
      fig:mf.vec({a:th,hl:x?'Fx':'Fy',lx:'F_{x}',ly:'F_{y}'}),
      steps:[[x?`F_{x} = ${q[0]<0?M+' ':''}F · cos α`:`F_{y} = ${q[1]<0?M+' ':''}F · sin α`,'',x?(q[0]<0?Lg('Die Kraft zeigt nach links, darum ist F_{x} negativ.','The force points to the left, so F_{x} is negative.'):Lg('Die Kraft zeigt nach rechts, darum ist F_{x} positiv.','The force points to the right, so F_{x} is positive.')):(q[1]<0?Lg('Die Kraft zeigt nach unten, darum ist F_{y} negativ.','The force points down, so F_{y} is negative.'):Lg('Die Kraft zeigt nach oben, darum ist F_{y} positiv.','The force points up, so F_{y} is positive.'))],[x?`F_{x} = ${q[0]<0?M+' ':''}${fmt(F)} N · cos ${fmt(a)}°`:`F_{y} = ${q[1]<0?M+' ':''}${fmt(F)} N · sin ${fmt(a)}°`],[`${x?'F_{x}':'F_{y}'} ≈ ${fmt(DEC(r,2))} N`]],
      tip:Lg('Betrag wie gewohnt rechnen. Das Vorzeichen kommt aus der Richtung: rechts und oben +, links und unten −.','Calculate the magnitude as usual. The sign comes from the direction: right and up +, left and down −.'),meta:{w:'zr1',F,a,x,q}});
  }
  /* Umgekehrt: Komponente gegeben, F gesucht */
  const a=rnd(20,70),x=rnd(0,1)===0,Fv=F,r0=x?Fv*C(a):Fv*Sn(a),r=DEC(r0,2);
  return MQ({ctx:Lg('Umgekehrt','The other way round'),sym:'F',ans:r/(x?C(a):Sn(a)),unit:'N',dec:1,tol:Math.max(0.5,Fv*0.004),label:x?Lg('Die waagerechte Komponente ist bekannt. Berechne die Kraft F.','The horizontal component is known. Calculate the force F.'):Lg('Die senkrechte Komponente ist bekannt. Berechne die Kraft F.','The vertical component is known. Calculate the force F.'),given:[[x?'F_{x}':'F_{y}',`${fmt(r)} N`],['α',dg(a)]],fig:mf.vec({a,hl:'F',lx:'F_{x}',ly:'F_{y}'}),
    steps:[[x?`F_{x} = F · cos α`:`F_{y} = F · sin α`,x?': cos α':': sin α',Lg('Nach F umstellen.','Rearrange for F.')],[x?`F = F_{x} / cos α`:`F = F_{y} / sin α`],[`F = ${fmt(r)} N / ${x?'cos':'sin'} ${fmt(a)}° ≈ ${fmt(DEC(r/(x?C(a):Sn(a)),1))} N`]],
    fine:Lg('Auf eine Kommastelle runden, 0,5 N Abweichung zählt als richtig.','Round to one decimal place; a deviation of 0.5 N counts as correct.'),tip:Lg('Die Komponente ist F mal Kosinus (oder Sinus). Teile durch Kosinus (oder Sinus).','The component is F times cosine (or sine). Divide by cosine (or sine).'),meta:{w:'zr1',F:Fv,a,x}});
}
const TRIPLES=[[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29]];
function zr2(h){
  const t=rnd(0,h?3:2),ctx=Lg('Betrag und Richtung','Magnitude and direction');
  if(!h){
    const [p,q,r]=pick(TRIPLES.slice(0,2)),k=pick([1,2,3,4,5,10,20]);
    let x=p*k,y=q*k,R=r*k;if(Math.random()<.5)[x,y]=[y,x];
    if(t===0)return MQ({ctx,sym:'F_{R}',ans:R,unit:'N',dec:0,label:Lg('Berechne den Betrag der Kraft aus ihren Komponenten','Calculate the magnitude of the force from its components'),given:[['F_{x}',`${fmt(x)} N`],['F_{y}',`${fmt(y)} N`]],fig:mf.vec({a:Math.atan2(y,x)/D2,hl:'F',lf:'F_{R}',lx:'F_{x}',ly:'F_{y}',la:'α'}),
      steps:[[`F_{R} = √(F_{x}² + F_{y}²)`,'',Lg('Pythagoras: Die Komponenten stehen senkrecht aufeinander.','Pythagoras: the components are at right angles to each other.')],[`F_{R} = √(${fmt(x)}² + ${fmt(y)}²) = √${fmt(x*x+y*y)}`],[`F_{R} = ${fmt(R)} N`]],tip:Lg('Quadrate addieren, dann die Wurzel ziehen.','Add the squares, then take the root.'),meta:{w:'zr2',x,y}});
    if(t===1){const a=Math.atan2(y,x)/D2;
      return MQ({ctx,sym:'α',ans:a,unit:'°',dec:2,tol:0.1,label:Lg('Berechne den Winkel zur x-Achse','Calculate the angle to the x axis'),given:[['F_{x}',`${fmt(x)} N`],['F_{y}',`${fmt(y)} N`]],fig:mf.vec({a,hl:'F',lf:'F_{R}',lx:'F_{x}',ly:'F_{y}',la:'α'}),
        fine:RTXT(2)+' '+Lg('Taschenrechner auf DEG, 0,1° Abweichung zählt als richtig.','Calculator in DEG mode; 0.1° deviation counts as correct.'),
        steps:[[`tan α = F_{y} / F_{x}`,'',Lg('Gegenkathete durch Ankathete.','Opposite over adjacent.')],[`tan α = ${fmt(y)} / ${fmt(x)} = ${fmt(DEC(y/x,4))}`],[`α = tan^{${M}1}(${fmt(DEC(y/x,4))}) ≈ ${fmt(DEC(a,2))}°`,'',Lg('Umkehrfunktion: SHIFT tan.','Inverse function: SHIFT tan.')]],tip:Lg('tan α = Fy / Fx. Mit der Umkehrfunktion tan⁻¹ bekommst du α.','tan α = Fy / Fx. The inverse function tan⁻¹ gives α.'),meta:{w:'zr2',x,y}});}
    return MQ({ctx,sym:'F_{x}',ans:x,unit:'N',dec:0,label:Lg('Berechne die Komponente F_{x} aus F_{R} und F_{y}','Calculate the component F_{x} from F_{R} and F_{y}'),given:[['F_{R}',`${fmt(R)} N`],['F_{y}',`${fmt(y)} N`]],fig:mf.vec({a:Math.atan2(y,x)/D2,hl:'Fx',lf:'F_{R}',lx:'F_{x}',ly:'F_{y}',la:'α'}),
      steps:[[`F_{R}² = F_{x}² + F_{y}²`,'',Lg('Pythagoras, nach F_{x} umgestellt.','Pythagoras, rearranged for F_{x}.')],[`F_{x} = √(F_{R}² ${M} F_{y}²) = √(${fmt(R)}² ${M} ${fmt(y)}²)`],[`F_{x} = √${fmt(R*R-y*y)} = ${fmt(x)} N`]],tip:Lg('Quadrat von F_R minus Quadrat von F_y, dann die Wurzel.','Square of F_R minus square of F_y, then the root.'),meta:{w:'zr2',x,y}});
  }
  const x=(Math.random()<.5?-1:1)*(rnd(20,180)+pick([0,0.5])),y=(Math.random()<.5?-1:1)*(rnd(20,180)+pick([0,0.5])),R=Math.hypot(x,y),a0=Math.atan(Math.abs(y/x))/D2;
  let phi=Math.atan2(y,x)/D2;if(phi<0)phi+=360;
  if(t<=1)return MQ({ctx,sym:'F_{R}',ans:R,unit:'N',dec:2,label:Lg('Berechne den Betrag der Kraft aus ihren Komponenten','Calculate the magnitude of the force from its components'),given:[['F_{x}',`${fmt(x)} N`],['F_{y}',`${fmt(y)} N`]],fig:mf.vec({a:phi,hl:'F',lf:'F_{R}',lx:'F_{x}',ly:'F_{y}',la:'α'}),
    steps:[[`F_{R} = √(F_{x}² + F_{y}²)`,'',Lg('Das Vorzeichen verschwindet beim Quadrieren.','The sign disappears when squaring.')],[`F_{R} = √(${par(x)}² + ${par(y)}²) = √${fmt(DEC(x*x+y*y,2))}`],[`F_{R} ≈ ${fmt(DEC(R,2))} N`]],tip:Lg('Quadrate addieren und Wurzel ziehen. Negative Zahlen werden beim Quadrieren positiv.','Add the squares and take the root. Negative numbers become positive when squared.'),meta:{w:'zr2',x,y}});
  return MQ({ctx:Lg('Richtungswinkel','Direction angle'),sym:'φ',ans:phi,unit:'°',dec:2,tol:0.1,label:Lg('Berechne den Richtungswinkel φ gegen den Uhrzeigersinn ab der +x-Achse','Calculate the direction angle φ counter-clockwise from the +x axis'),given:[['F_{x}',`${fmt(x)} N`],['F_{y}',`${fmt(y)} N`]],fig:mf.vec({a:phi,hl:'F',lf:'F_{R}',lx:'F_{x}',ly:'F_{y}',la:'α'}),
    fine:Lg('Taschenrechner auf DEG. 0,1° Abweichung zählt als richtig.','Calculator in DEG mode. 0.1° deviation counts as correct.'),
    steps:[[`α = tan^{${M}1}(|F_{y}| / |F_{x}|) = tan^{${M}1}(${fmt(DEC(Math.abs(y/x),4))}) ≈ ${fmt(DEC(a0,2))}°`,'',Lg('Erst den spitzen Winkel zur x-Achse, ohne Vorzeichen.','First the acute angle to the x axis, without signs.')],[Lg(`F_{x} ${x<0?'< 0':'> 0'}, F_{y} ${y<0?'< 0':'> 0'}: ${x>0&&y>0?'1. Quadrant':x<0&&y>0?'2. Quadrant':x<0?'3. Quadrant':'4. Quadrant'}`,`F_{x} ${x<0?'< 0':'> 0'}, F_{y} ${y<0?'< 0':'> 0'}: ${x>0&&y>0?'1st quadrant':x<0&&y>0?'2nd quadrant':x<0?'3rd quadrant':'4th quadrant'}`)],[`φ = ${x>0&&y>0?'α':x<0&&y>0?'180° '+M+' α':x<0?'180° + α':'360° '+M+' α'} ≈ ${fmt(DEC(phi,2))}°`]],tip:Lg('Spitzen Winkel mit |Fy| / |Fx| berechnen, dann den Quadranten aus den Vorzeichen bestimmen.','Calculate the acute angle with |Fy| / |Fx|, then find the quadrant from the signs.'),meta:{w:'zr2',x,y}});
}

/* Resultierende aus mehreren Kräften nach dem Komponentenverfahren */
const FL=['F_{1}','F_{2}','F_{3}'];
function resolve(list){
  let X=0,Y=0;list.forEach(f=>{X+=f.F*C(f.a);Y+=f.F*Sn(f.a);});
  let phi=Math.atan2(Y,X)/D2;if(phi<0)phi+=360;
  return {X,Y,R:Math.hypot(X,Y),phi};
}
/* Tabelle der Komponenten als Lösungsschritte */
function compSteps(list,unit){
  const st=[];
  list.forEach((f,i)=>{
    const cx=f.F*C(f.a),cy=f.F*Sn(f.a);
    st.push([`F_{${i+1}x} = ${fmt(f.F)} · cos ${fmt(f.a)}° ≈ ${fmt(DEC(cx,2))} ${unit}`,'',i===0?Lg('Jede Kraft in Komponenten zerlegen. Winkel ab der +x-Achse, gegen den Uhrzeigersinn: Vorzeichen stecken im Winkel.','Resolve every force into components. Angles from the +x axis, counter-clockwise: the signs are in the angle.'):'']);
    st.push([`F_{${i+1}y} = ${fmt(f.F)} · sin ${fmt(f.a)}° ≈ ${fmt(DEC(cy,2))} ${unit}`]);
  });
  return st;
}
function zr3(h){
  const ctx=Lg('Resultierende','Resultant');
  if(!h){
    const t=rnd(0,2);
    if(t===0){
      const [p,q,r]=pick(TRIPLES.slice(0,2)),k=pick([1,2,3,4,5,10]),A=p*k,B=q*k,Rv=r*k,sw=Math.random()<.5;
      return MQ({ctx,sym:'F_{R}',ans:Rv,unit:'N',dec:0,label:Lg('Zwei Kräfte stehen senkrecht aufeinander. Berechne die Resultierende.','Two forces are at right angles to each other. Calculate the resultant.'),given:[['F_{1}',`${fmt(sw?B:A)} N`],['F_{2}',`${fmt(sw?A:B)} N`]],fig:mf.multi([{a:0,lab:'F_{1}'},{a:90,lab:'F_{2}'}]),
        steps:[[`F_{Rx} = F_{1} = ${fmt(sw?B:A)} N,  F_{Ry} = F_{2} = ${fmt(sw?A:B)} N`,'',Lg('Eine Kraft liegt auf der x-Achse, die andere auf der y-Achse.','One force lies on the x axis, the other on the y axis.')],[`F_{R} = √(F_{Rx}² + F_{Ry}²) = √(${fmt(A)}² + ${fmt(B)}²)`],[`F_{R} = ${fmt(Rv)} N`]],tip:Lg('Senkrechte Kräfte: Pythagoras.','Perpendicular forces: Pythagoras.'),meta:{w:'zr3',A,B}});
    }
    const F1=rnd(2,20)*5,F2=rnd(1,12)*10;
    if(t===1){
      const a2=pick([60,120,240,300]),lst=[{F:F1,a:0},{F:F2,a:a2}],res=F1+F2*C(a2);
      return MQ({ctx,sym:'F_{Rx}',ans:res,unit:'N',dec:0,label:Lg('Berechne die Summe der waagerechten Komponenten F_{Rx}','Calculate the sum of the horizontal components F_{Rx}'),given:[['F_{1}',`${fmt(F1)} N, 0°`],['F_{2}',`${fmt(F2)} N, ${fmt(a2)}°`]],fig:mf.multi([{a:0,lab:'F_{1}'},{a:a2,lab:'F_{2}'}]),
        steps:[[`F_{1x} = ${fmt(F1)} N`,'',Lg('F1 liegt auf der x-Achse: Die ganze Kraft ist waagerecht.','F1 lies on the x axis: the whole force is horizontal.')],[`F_{2x} = ${fmt(F2)} N · cos ${fmt(a2)}° = ${fmt(F2*C(a2))} N`,'',Lg('cos 60° = 0,5, cos 120° = −0,5.','cos 60° = 0.5, cos 120° = −0.5.')],[`F_{Rx} = ${fmt(F1)} ${sgnT(F2*C(a2))} = ${fmt(res)} N`]],tip:Lg('Nur die x-Anteile addieren: F1 plus F2 mal Kosinus des Winkels.','Add only the x parts: F1 plus F2 times the cosine of the angle.'),meta:{w:'zr3',lst}});
    }
    const a2=pick([30,150,210,330]),lst=[{F:F1,a:90},{F:F2,a:a2}],res=F1+F2*Sn(a2);
    return MQ({ctx,sym:'F_{Ry}',ans:res,unit:'N',dec:0,label:Lg('Berechne die Summe der senkrechten Komponenten F_{Ry}','Calculate the sum of the vertical components F_{Ry}'),given:[['F_{1}',`${fmt(F1)} N, 90°`],['F_{2}',`${fmt(F2)} N, ${fmt(a2)}°`]],fig:mf.multi([{a:90,lab:'F_{1}'},{a:a2,lab:'F_{2}'}]),
      steps:[[`F_{1y} = ${fmt(F1)} N`,'',Lg('F1 zeigt senkrecht nach oben.','F1 points straight up.')],[`F_{2y} = ${fmt(F2)} N · sin ${fmt(a2)}° = ${fmt(F2*Sn(a2))} N`,'',Lg('sin 30° = 0,5, sin 210° = −0,5.','sin 30° = 0.5, sin 210° = −0.5.')],[`F_{Ry} = ${fmt(F1)} ${sgnT(F2*Sn(a2))} = ${fmt(res)} N`]],tip:Lg('Nur die y-Anteile addieren: F1 plus F2 mal Sinus des Winkels.','Add only the y parts: F1 plus F2 times the sine of the angle.'),meta:{w:'zr3',lst}});
  }
  const lst=[{F:rnd(4,30)*5,a:rnd(5,80)},{F:rnd(4,30)*5,a:rnd(100,350)}],r=resolve(lst),askAng=Math.random()<.35;
  const given=lst.map((f,i)=>[FL[i],`${fmt(f.F)} N, ${fmt(f.a)}°`]);
  const st=[...compSteps(lst,'N'),[`F_{Rx} = ${fmt(DEC(lst[0].F*C(lst[0].a),2))} ${sgnT(lst[1].F*C(lst[1].a))} ≈ ${fmt(DEC(r.X,2))} N`,'',Lg('Alle x-Anteile addieren.','Add all x parts.')],[`F_{Ry} ≈ ${fmt(DEC(r.Y,2))} N`,'',Lg('Alle y-Anteile addieren.','Add all y parts.')]];
  const fig=mf.multi(lst.map((f,i)=>({a:f.a,lab:FL[i]})));
  if(!askAng){
    st.push([`F_{R} = √(F_{Rx}² + F_{Ry}²) ≈ ${fmt(DEC(r.R,2))} N`]);
    return MQ({ctx,sym:'F_{R}',ans:r.R,unit:'N',dec:2,label:Lg('Berechne den Betrag der Resultierenden','Calculate the magnitude of the resultant'),given,fig,steps:st,fine:RTXT(2)+' '+Lg('Taschenrechner auf DEG.','Calculator in DEG mode.'),tip:Lg('Komponenten bilden, summieren, dann Pythagoras.','Form the components, add them, then Pythagoras.'),meta:{w:'zr3',lst}});
  }
  st.push([`α = tan^{${M}1}(|F_{Ry}| / |F_{Rx}|) ≈ ${fmt(DEC(Math.atan(Math.abs(r.Y/r.X))/D2,2))}°`,'',Lg('Spitzer Winkel zur x-Achse.','Acute angle to the x axis.')]);
  st.push([`φ ≈ ${fmt(DEC(r.phi,2))}°`,'',Lg(`Quadrant nach den Vorzeichen von F_{Rx} und F_{Ry} bestimmen.`,`Find the quadrant from the signs of F_{Rx} and F_{Ry}.`)]);
  return MQ({ctx,sym:'φ',ans:r.phi,unit:'°',dec:2,tol:0.1,label:Lg('Berechne die Richtung der Resultierenden, Winkel φ ab der +x-Achse gegen den Uhrzeigersinn','Calculate the direction of the resultant, angle φ from the +x axis counter-clockwise'),given,fig,steps:st,fine:Lg('Taschenrechner auf DEG. 0,1° Abweichung zählt als richtig.','Calculator in DEG mode. 0.1° deviation counts as correct.'),tip:Lg('Erst F_Rx und F_Ry. Dann tan⁻¹ und den Quadranten beachten.','First F_Rx and F_Ry. Then tan⁻¹ and watch the quadrant.'),meta:{w:'zr3',lst}});
}
function zr4(h){
  const ctx=Lg('Drei Kräfte','Three forces');
  if(!h){
    const F1=rnd(2,16)*5,F2=rnd(2,16)*5,F3=rnd(1,10)*10,a1=pick([0,180]),a2=pick([90,270]);
    const useX=Math.random()<.5,a3=useX?pick([60,120,240,300]):pick([30,150,210,330]);
    const lst=[{F:F1,a:a1},{F:F2,a:a2},{F:F3,a:a3}],r=resolve(lst);
    const val=useX?r.X:r.Y,parts=lst.map((f,i)=>useX?f.F*C(f.a):f.F*Sn(f.a));
    return MQ({ctx,sym:useX?'F_{Rx}':'F_{Ry}',ans:val,unit:'N',dec:0,label:useX?Lg('Berechne die Summe der waagerechten Komponenten','Calculate the sum of the horizontal components'):Lg('Berechne die Summe der senkrechten Komponenten','Calculate the sum of the vertical components'),given:lst.map((f,i)=>[FL[i],`${fmt(f.F)} N, ${fmt(f.a)}°`]),fig:mf.multi(lst.map((f,i)=>({a:f.a,lab:FL[i]}))),
      steps:[...parts.map((v,i)=>[`F_{${i+1}${useX?'x':'y'}} = ${fmt(lst[i].F)} N · ${useX?'cos':'sin'} ${fmt(lst[i].a)}° = ${fmt(v)} N`,'',i===0?Lg('Jede Kraft einzeln in ihre Komponente zerlegen. Der Winkel gibt das Vorzeichen.','Resolve each force into its component. The angle gives the sign.'):'']),[`${useX?'F_{Rx}':'F_{Ry}'} = ${parts.map((v,i)=>i===0?fmt(v):sgnT(v)).join(' ')} = ${fmt(val)} N`]],
      tip:Lg('Jede Kraft: F mal Kosinus (waagerecht) oder Sinus (senkrecht). Dann alles mit Vorzeichen addieren.','Each force: F times cosine (horizontal) or sine (vertical). Then add everything with signs.'),meta:{w:'zr4',lst}});
  }
  const lst=[{F:rnd(4,30)*5,a:rnd(0,359)},{F:rnd(4,30)*5,a:rnd(0,359)},{F:rnd(4,30)*5,a:rnd(0,359)}],r=resolve(lst),ang=Math.random()<.3;
  const given=lst.map((f,i)=>[FL[i],`${fmt(f.F)} N, ${fmt(f.a)}°`]),fig=mf.multi(lst.map((f,i)=>({a:f.a,lab:FL[i]})));
  const st=[...compSteps(lst,'N'),[`F_{Rx} ≈ ${fmt(DEC(r.X,2))} N,  F_{Ry} ≈ ${fmt(DEC(r.Y,2))} N`,'',Lg('Summe der x-Anteile und Summe der y-Anteile.','Sum of the x parts and sum of the y parts.')]];
  if(!ang){st.push([`F_{R} = √(F_{Rx}² + F_{Ry}²) ≈ ${fmt(DEC(r.R,2))} N`]);
    return MQ({ctx,sym:'F_{R}',ans:r.R,unit:'N',dec:2,label:Lg('Berechne den Betrag der Resultierenden','Calculate the magnitude of the resultant'),given,fig,steps:st,fine:RTXT(2)+' '+Lg('Taschenrechner auf DEG.','Calculator in DEG mode.'),tip:Lg('Sechs Komponenten, dann zwei Summen, dann Pythagoras. Winkel ab der +x-Achse.','Six components, then two sums, then Pythagoras. Angles from the +x axis.'),meta:{w:'zr4',lst}});}
  st.push([`φ = ${fmt(DEC(r.phi,2))}°`,'',Lg('tan⁻¹(|F_{Ry}| / |F_{Rx}|) und Quadrant nach den Vorzeichen.','tan⁻¹(|F_{Ry}| / |F_{Rx}|) and the quadrant from the signs.')]);
  return MQ({ctx,sym:'φ',ans:r.phi,unit:'°',dec:2,tol:0.1,label:Lg('Berechne den Richtungswinkel φ der Resultierenden (ab +x, gegen den Uhrzeigersinn)','Calculate the direction angle φ of the resultant (from +x, counter-clockwise)'),given,fig,steps:st,fine:Lg('Taschenrechner auf DEG. 0,1° Abweichung zählt als richtig.','Calculator in DEG mode. 0.1° deviation counts as correct.'),tip:Lg('Erst F_Rx und F_Ry, dann der Winkel mit tan⁻¹ und der Quadrant.','First F_Rx and F_Ry, then the angle with tan⁻¹ and the quadrant.'),meta:{w:'zr4',lst}});
}
function zr5(h){
  const ctx=Lg('Seilkräfte','Rope forces');
  if(!h){
    const t=rnd(0,2);
    if(t===0){
      const a=pick([30,45,60]),FGv=pick([200,400,600,800,1000,1200,2000]),F=FGv/(2*Sn(a));
      return MQ({ctx,sym:'F_{S}',ans:F,unit:'N',dec:2,label:Lg('Die Last hängt an zwei gleich langen Seilen. Berechne die Kraft in einem Seil.','The load hangs on two ropes of equal length. Calculate the force in one rope.'),given:[[FG_,`${fmt(FGv)} N`],['α',dg(a)]],fig:mf.ropes(a,a,{f1:'F_{S}',f2:'F_{S}',lab:'m'}),
        steps:[[`Σ F_{y} = 0:  2 · F_{S} · sin α ${M} ${FG_} = 0`,'',Lg('Beide Seile ziehen mit gleicher Kraft. Waagerecht heben sie sich auf, senkrecht tragen sie die Last.','Both ropes pull equally. Horizontally they cancel, vertically they carry the load.')],[`F_{S} = ${FG_} / (2 · sin α)`],[`F_{S} = ${fmt(FGv)} N / (2 · sin ${fmt(a)}°) ${DEC(F,2)===F?'=':'≈'} ${fmt(DEC(F,2))} N`]],
        tip:Lg('Senkrecht: zwei mal F mal Sinus des Winkels trägt die Gewichtskraft.','Vertical: two times F times the sine of the angle carries the weight force.'),meta:{w:'zr5',t,a,FGv}});
    }
    const a=pick([30,45,60]),FGv=pick([100,200,300,500,800,1000]),ask=pick(['S','H']),S_=FGv/Sn(a),H_=FGv/Math.tan(a*D2);
    const sw=a===30?'S':a===45?'H':ask,val=sw==='S'?S_:H_;
    return MQ({ctx:Lg('Wandausleger','Wall bracket'),sym:sw==='S'?'F_{S}':'F_{H}',ans:val,unit:'N',dec:2,label:sw==='S'?Lg('Die Last hängt am Ende des Auslegers. Berechne die Seilkraft F_{S}.','The load hangs at the end of the boom. Calculate the rope force F_{S}.'):Lg('Die Last hängt am Ende des Auslegers. Berechne die Druckkraft F_{H} im waagerechten Stab.','The load hangs at the end of the boom. Calculate the compressive force F_{H} in the horizontal rod.'),given:[[FG_,`${fmt(FGv)} N`],['α',dg(a)]],fig:mf.boom({a,fl:FG_,fs:'F_{S}'}),
      steps:[[`Σ F_{y} = 0:  F_{S} · sin α ${M} ${FG_} = 0`,'',Lg('Am Knoten am Ende: senkrecht trägt nur das Seil die Last.','At the joint at the end: vertically only the rope carries the load.')],[`F_{S} = ${FG_} / sin α = ${fmt(FGv)} N / sin ${fmt(a)}° ${DEC(S_,2)===S_?'=':'≈'} ${fmt(DEC(S_,2))} N`],...(sw==='H'?[[`Σ F_{x} = 0:  F_{H} ${M} F_{S} · cos α = 0`,'',Lg('Waagerecht muss der Stab die Seilkraft ausgleichen.','Horizontally the rod must balance the rope force.')],[`F_{H} = F_{S} · cos α = ${FG_} / tan α ≈ ${fmt(DEC(H_,2))} N`]]:[])],
      tip:Lg('Knoten freimachen: Seilkraft schräg, Stabkraft waagerecht, Last senkrecht. Dann Σ F_y = 0 und Σ F_x = 0.','Free the joint: rope force inclined, rod force horizontal, load vertical. Then Σ F_y = 0 and Σ F_x = 0.'),meta:{w:'zr5',t:1,a,FGv,sw}});
  }
  const al=rnd(20,70),be=rnd(20,70),FGv=pick([150,250,400,600,900,1200]),ask=rnd(0,1),den=Math.sin((al+be)*D2),F1=FGv*C(be)/den,F2=FGv*C(al)/den;
  return MQ({ctx:Lg('Asymmetrisch','Asymmetric'),sym:ask?'F_{2}':'F_{1}',ans:ask?F2:F1,unit:'N',dec:2,label:ask?Lg('Berechne die Kraft F2 im rechten Seil','Calculate the force F2 in the right rope'):Lg('Berechne die Kraft F1 im linken Seil','Calculate the force F1 in the left rope'),given:[[FG_,`${fmt(FGv)} N`],['α',dg(al)],['β',dg(be)]],fig:mf.ropes(al,be,{}),
    steps:[[`Σ F_{x} = 0:  F_{2} · cos β ${M} F_{1} · cos α = 0`,'',Lg('Am Knoten: waagerechte Anteile gleichen sich aus.','At the joint: the horizontal parts balance.')],[`Σ F_{y} = 0:  F_{1} · sin α + F_{2} · sin β ${M} ${FG_} = 0`,'',Lg('Senkrechte Anteile tragen die Last.','The vertical parts carry the load.')],...(ask?[[`F_{1} = ${FG_} · cos β / sin(α + β) ≈ ${fmt(DEC(F1,2))} N`,'',Lg('Die erste Gleichung nach F2 auflösen und in die zweite einsetzen ergibt diese Formeln.','Solving the first equation for F2 and inserting into the second gives these formulas.')],[`F_{2} = ${FG_} · cos α / sin(α + β) = ${fmt(FGv)} N · cos ${fmt(al)}° / sin ${fmt(al+be)}° ≈ ${fmt(DEC(F2,2))} N`]]:[[`F_{2} = ${FG_} · cos α / sin(α + β) ≈ ${fmt(DEC(F2,2))} N`,'',Lg('Die erste Gleichung nach F2 auflösen und in die zweite einsetzen ergibt diese Formeln.','Solving the first equation for F2 and inserting into the second gives these formulas.')],[`F_{1} = ${FG_} · cos β / sin(α + β) = ${fmt(FGv)} N · cos ${fmt(be)}° / sin ${fmt(al+be)}° ≈ ${fmt(DEC(F1,2))} N`]]),],
    fine:RTXT(2)+' '+Lg('Taschenrechner auf DEG.','Calculator in DEG mode.'),tip:Lg('Zwei Gleichungen (Σ F_x = 0 und Σ F_y = 0) für zwei unbekannte Seilkräfte.','Two equations (Σ F_x = 0 and Σ F_y = 0) for two unknown rope forces.'),meta:{w:'zr5',t:2,al,be,FGv}});
}

/* =================== 3  KRAFTMOMENT =================== */
const KMtxt=Lg('Moment = Kraft mal Hebelarm.','Moment = force times lever arm.');
function km1(h){
  const t=rnd(0,h?3:2);
  const ctxs=[[Lg('Schraubenschlüssel','Spanner'),'nut'],[Lg('Handkurbel','Hand crank'),'hub'],[Lg('Tretkurbel','Pedal crank'),'hub'],[Lg('Ratsche','Ratchet'),'nut']];
  const [ctx,kind]=pick(ctxs);
  if(!h){
    const F=pick([20,40,50,80,100,120,150,200,250]),use=rnd(0,1),l=use?pick([0.1,0.15,0.2,0.25,0.3,0.4,0.5]):pick([10,15,20,25,30,40,50]),lm=use?l:l/100,M_=F*lm;
    return MQ({ctx,sym:'M',ans:M_,unit:'N · m',dec:2,label:Lg('Berechne das Moment','Calculate the moment'),given:[['F',`${fmt(F)} N`],[Lg('Hebelarm l','Lever arm l'),use?`${fmt(l)} m`:`${fmt(l)} cm`]],fig:mf.lever({kind,lf:'F',ll:'l'}),
      steps:[...(use?[]:[[`l = ${fmt(l)} cm = ${fmt(lm)} m`,'',Lg('1 cm = 0,01 m. Das Moment soll in N · m herauskommen.','1 cm = 0.01 m. The moment should come out in N · m.')]]),[`M = F · l`,'',KMtxt],[`M = ${fmt(F)} N · ${fmt(lm)} m = ${fmt(DEC(M_,2))} N · m`]],
      tip:Lg('Moment = Kraft mal Abstand. Der Abstand muss senkrecht zur Kraft gemessen werden.','Moment = force times distance. The distance is measured perpendicular to the force.'),meta:{w:'km1',F,lm}});
  }
  if(t===0){
    const F=pick([0.5,1.2,2.5,4,8,12]),l=pick([120,250,400,650,800,1200]),M_=F*1000*l/1000;
    return MQ({ctx:Lg('Kraft in kN, Hebelarm in mm','Force in kN, lever arm in mm'),sym:'M',ans:M_,unit:'N · m',dec:2,label:Lg('Berechne das Moment in N · m','Calculate the moment in N · m'),given:[['F',`${fmt(F)} kN`],[Lg('Hebelarm l','Lever arm l'),`${fmt(l)} mm`]],fig:mf.lever({kind,lf:'F',ll:'l'}),
      steps:[[`F = ${fmt(F)} kN = ${fmt(F*1000)} N,  l = ${fmt(l)} mm = ${fmt(l/1000)} m`,'',Lg('Erst beide Größen auf N und m bringen.','First convert both quantities to N and m.')],[`M = F · l = ${fmt(F*1000)} N · ${fmt(l/1000)} m`],[`M = ${fmt(DEC(M_,2))} N · m`]],tip:Lg('kN mal 1000 gibt N. mm durch 1000 gibt m.','kN times 1000 gives N. mm divided by 1000 gives m.'),meta:{w:'km1',F,l}});
  }
  if(t===1){
    const F=pick([35,60,85,120,175,240]),l=pick([85,120,150,225,340]),M_=F*l;
    return MQ({ctx:Lg('Moment in N · mm','Moment in N · mm'),sym:'M',ans:M_,unit:'N · mm',dec:0,label:Lg('Berechne das Moment in N · mm','Calculate the moment in N · mm'),given:[['F',`${fmt(F)} N`],[Lg('Hebelarm l','Lever arm l'),`${fmt(l)} mm`]],fig:mf.lever({kind,lf:'F',ll:'l'}),
      steps:[[`M = F · l = ${fmt(F)} N · ${fmt(l)} mm`,'',Lg('Newton mal Millimeter ergibt N · mm. Es ist keine Umrechnung nötig.','Newton times millimetre gives N · mm. No conversion is needed.')],[`M = ${fmt(M_)} N · mm`,'',Lg(`Zum Vergleich: ${fmt(M_/1000)} N · m.`,`For comparison: ${fmt(M_/1000)} N · m.`)]],tip:Lg('Wenn beide Größen schon in N und mm stehen, bleibt das Ergebnis in N · mm.','If both quantities are already in N and mm, the result stays in N · mm.'),meta:{w:'km1',F,l}});
  }
  const a=rnd(20,70),F=pick([40,80,120,200]),l=pick([0.2,0.3,0.4,0.5]),M_=F*l*Sn(a);
  return MQ({ctx:Lg('Schräge Kraft','Inclined force'),sym:'M',ans:M_,unit:'N · m',dec:2,label:Lg('Die Kraft steht schräg zum Hebel. Berechne das Moment.','The force acts at an angle to the lever. Calculate the moment.'),given:[['F',`${fmt(F)} N`],[Lg('Hebellänge l','Lever length l'),`${fmt(l)} m`],[Lg('α (Hebel – Kraft)','α (lever – force)'),dg(a)]],fig:mf.lever({kind,a,lf:'F',ll:'l',la:'α'}),
    steps:[[`l_{eff} = l · sin α`.replace('eff',EN?'eff':'wirk'),'',Lg('Der Hebelarm ist der senkrechte Abstand zur Wirkungslinie der Kraft.','The lever arm is the perpendicular distance to the line of action of the force.')],[`M = F · l · sin α = ${fmt(F)} N · ${fmt(l)} m · sin ${fmt(a)}°`],[`M ≈ ${fmt(DEC(M_,2))} N · m`]],
    fine:RTXT(2)+' '+Lg('Taschenrechner auf DEG.','Calculator in DEG mode.'),tip:Lg('Nur der Teil der Kraft senkrecht zum Hebel dreht: F mal Sinus von α.','Only the part of the force perpendicular to the lever turns it: F times sine of α.'),meta:{w:'km1',F,l,a}});
}
function km2(h){
  const t=rnd(0,2),[ctx,kind]=pick([[Lg('Anzugsmoment','Tightening torque'),'nut'],[Lg('Handkurbel','Hand crank'),'hub'],[Lg('Hebel','Lever'),'hub']]);
  if(!h){
    const F=pick([20,40,50,80,100,150,200,250]),l=pick([0.1,0.2,0.25,0.4,0.5,0.8,1,1.5,2]),M_=F*l;
    if(t===0||t===2&&false){
      return MQ({ctx,sym:'F',ans:F,unit:'N',dec:0,label:Lg('Welche Kraft ist nötig?','Which force is needed?'),given:[['M',`${fmt(DEC(M_,2))} N · m`],[Lg('Hebelarm l','Lever arm l'),`${fmt(l)} m`]],fig:mf.lever({kind,lf:'F',ll:'l'}),
        steps:[[`M = F · l`,': l',Lg('Gesucht ist F. Beide Seiten durch l teilen.','The unknown is F. Divide both sides by l.')],[`F = M / l = ${fmt(DEC(M_,2))} N · m / ${fmt(l)} m`],[`F = ${fmt(F)} N`]],tip:Lg('Kraft = Moment geteilt durch Hebelarm.','Force = moment divided by lever arm.'),meta:{w:'km2',F,l}});
    }
    return MQ({ctx,sym:'l',ans:l,unit:'m',dec:2,label:Lg('Wie lang muss der Hebelarm sein?','How long must the lever arm be?'),given:[['M',`${fmt(DEC(M_,2))} N · m`],['F',`${fmt(F)} N`]],fig:mf.lever({kind,lf:'F',ll:'l'}),
      steps:[[`M = F · l`,': F',Lg('Gesucht ist l. Beide Seiten durch F teilen.','The unknown is l. Divide both sides by F.')],[`l = M / F = ${fmt(DEC(M_,2))} N · m / ${fmt(F)} N`],[`l = ${fmt(l)} m`]],tip:Lg('Hebelarm = Moment geteilt durch Kraft.','Lever arm = moment divided by force.'),meta:{w:'km2',F,l}});
  }
  const F=pick([60,120,250,400,750]),l=pick([150,220,300,450,600]),M_=F*l/1000;
  if(t===0)return MQ({ctx,sym:'F',ans:F,unit:'N',dec:0,label:Lg('Welche Kraft ist nötig?','Which force is needed?'),given:[['M',`${fmt(DEC(M_,2))} N · m`],[Lg('Hebelarm l','Lever arm l'),`${fmt(l)} mm`]],fig:mf.lever({kind,lf:'F',ll:'l'}),
    steps:[[`l = ${fmt(l)} mm = ${fmt(l/1000)} m`,'',Lg('Zuerst mm in m, passend zu N · m.','First mm to m, to match N · m.')],[`F = M / l = ${fmt(DEC(M_,2))} N · m / ${fmt(l/1000)} m`],[`F = ${fmt(F)} N`]],tip:Lg('Hebelarm in m umrechnen, dann Moment durch Hebelarm.','Convert the lever arm to m, then moment divided by lever arm.'),meta:{w:'km2',F,l}});
  if(t===1)return MQ({ctx,sym:'l',ans:l,unit:'mm',dec:0,label:Lg('Wie lang muss der Hebelarm in mm sein?','How long must the lever arm be, in mm?'),given:[['M',`${fmt(DEC(M_,2))} N · m`],['F',`${fmt(F)} N`]],fig:mf.lever({kind,lf:'F',ll:'l'}),
    steps:[[`l = M / F = ${fmt(DEC(M_,2))} N · m / ${fmt(F)} N = ${fmt(l/1000)} m`],[`l = ${fmt(l/1000)} m = ${fmt(l)} mm`,'',Lg('1 m = 1000 mm','1 m = 1000 mm')]],tip:Lg('Das Ergebnis kommt in m heraus. Mal 1000 gibt mm.','The result comes out in m. Times 1000 gives mm.'),meta:{w:'km2',F,l}});
  const Mk=pick([0.8,1.5,2.4,3.6]),lk=pick([0.4,0.6,0.8,1.2]),Fk=Mk/lk;
  return MQ({ctx:Lg('Moment in kN · m','Moment in kN · m'),sym:'F',ans:Fk,unit:'kN',dec:2,label:Lg('Welche Kraft in kN ist nötig?','Which force in kN is needed?'),given:[['M',`${fmt(Mk)} kN · m`],[Lg('Hebelarm l','Lever arm l'),`${fmt(lk)} m`]],fig:mf.lever({kind,lf:'F',ll:'l'}),
    steps:[[`F = M / l`,'',Lg('kN · m geteilt durch m ergibt kN.','kN · m divided by m gives kN.')],[`F = ${fmt(Mk)} kN · m / ${fmt(lk)} m ${DEC(Fk,2)===Fk?'=':'≈'} ${fmt(DEC(Fk,2))} kN`]],tip:Lg('Einheiten kürzen sich: kN · m durch m ist kN.','Units cancel: kN · m divided by m is kN.'),meta:{w:'km2',Fk,lk}});
}
/* Drehsinn und Summe der Momente. Konvention: links herum (gegen den Uhrzeigersinn) = positiv */
function dsText(x,Fd){const m=-x*Fd;return m>0?Lg('links herum, +','counter-clockwise, +'):m<0?Lg('rechts herum, −','clockwise, −'):Lg('kein Moment','no moment');}
function km3(h){
  const unit=h?'N · m':'N · m',t=rnd(0,h?2:2);
  if(t===0){
    const x=pick([-4,-3,-2,2,3,4]),Fd=pick([1,-1]),F=pick([20,40,60,80]);
    const dir=dsText(x,Fd),M_=-x*Fd*F;
    const opts=Lg(['links herum (gegen den Uhrzeigersinn)','rechts herum (im Uhrzeigersinn)'],['counter-clockwise','clockwise']);
    return Q({kind:'mc',mode:'plain',ctx:Lg('Drehsinn','Sense of rotation'),eq:Lg('Wie dreht die Kraft F um A?','How does the force F turn about A?'),long:true,label:'',options:opts,correctIdx:M_>0?0:1,
      answerText:M_>0?opts[0]:opts[1],fig:mf.barForces([{x,F:Fd>0?F:-F,lab:'F',d:'l'}],{sc:28}),figNote:FIGN,
      steps:rows([[Lg(`Die Kraft F zeigt ${Fd>0?'nach unten':'nach oben'} und liegt ${x<0?'links':'rechts'} von A.`,`The force F points ${Fd>0?'down':'up'} and lies ${x<0?'to the left':'to the right'} of A.`),'',Lg('Stell dir den Stab vor: Die Kraft schiebt das Ende in ihre Richtung.','Imagine the bar: the force pushes the end in its direction.')],[M_>0?opts[0]:opts[1],'',Lg('Links herum zählt positiv, rechts herum negativ.','Counter-clockwise counts positive, clockwise negative.')]]),
      tip:Lg('Kraft nach unten rechts vom Drehpunkt: dreht rechts herum. Kraft nach unten links davon: dreht links herum.','Downward force right of the pivot: turns clockwise. Downward force left of it: turns counter-clockwise.'),meta:{w:'km3',x,Fd}});
  }
  const mkItems=n=>{
    const xs=shuffle([-5,-4,-3,-2,-1,1,2,3,4,5].filter(()=>true)).slice(0,n);
    return xs.map((x,i)=>({x,F:(h&&Math.random()<.4?-1:1)*rnd(1,10)*10,lab:FL[i],d:'l_{'+(i+1)+'}'}));
  };
  if(t===1||!h){
    let it;do{it=mkItems(h?3:2);}while(!h&&it[0].x*it[1].x>0);
    const parts=it.map(f=>-f.x*f.F),sum=parts.reduce((a,b)=>a+b,0);
    return MQ({ctx:Lg('Summe der Momente','Sum of moments'),sym:'ΣM_{A}',ans:sum,unit:'N · m',dec:0,label:Lg('Berechne die Summe der Momente um A. Links herum ist positiv.','Calculate the sum of the moments about A. Counter-clockwise is positive.'),
      given:it.map((f,i)=>[FL[i],`${fmt(Math.abs(f.F))} N ${f.F>0?'↓':'↑'}`]).concat(it.map((f,i)=>['l_{'+(i+1)+'}',`${fmt(Math.abs(f.x))} m ${f.x<0?Lg('links','left'):Lg('rechts','right')}`])),fig:mf.barForces(it,{sc:28}),
      steps:[...it.map((f,i)=>[`M_{${i+1}} = ${parts[i]<0?M+' ':''}${fmt(Math.abs(f.F))} N · ${fmt(Math.abs(f.x))} m = ${fmt(parts[i])} N · m`,'',i===0?Lg('Kraft mal Hebelarm. Vorzeichen: dreht die Kraft links herum, ist es +, rechts herum −.','Force times lever arm. Sign: + if the force turns counter-clockwise, − if clockwise.'):`${dsText(f.x,f.F>0?1:-1)}`]),[`ΣM_{A} = ${parts.map((v,i)=>i===0?fmt(v):sgnT(v)).join(' ')} = ${fmt(sum)} N · m`]],
      tip:Lg('Jede Kraft einzeln: Betrag mal Abstand, Vorzeichen aus dem Drehsinn. Dann alles addieren.','Each force on its own: magnitude times distance, sign from the sense of rotation. Then add everything.'),meta:{w:'km3',it}});
  }
  let it;do{it=mkItems(3);}while(it[2].x===0);
  const known=it.slice(0,2),X=it[2],sumK=known.reduce((a,f)=>a-f.x*f.F,0),Fx=sumK/X.x; /* ΣM = sumK − x·F3 = 0 → F3 = sumK/x (F3 nach unten positiv) */
  return MQ({ctx:Lg('Gleichgewicht','Equilibrium'),sym:'F_{3}',ans:Fx,unit:'N',dec:2,label:Lg('Der Stab ist im Gleichgewicht (ΣM_{A} = 0). Berechne F3. Positiv heißt nach unten.','The bar is in equilibrium (ΣM_{A} = 0). Calculate F3. Positive means downwards.'),
    given:known.map((f,i)=>[FL[i],`${fmt(Math.abs(f.F))} N ${f.F>0?'↓':'↑'}`]).concat(it.map((f,i)=>['l_{'+(i+1)+'}',`${fmt(Math.abs(f.x))} m ${f.x<0?Lg('links','left'):Lg('rechts','right')}`])),
    fig:mf.barForces([...known,{x:X.x,F:Fx||1,lab:'F_{3}',d:'l_{3}'}].map((f,i)=>({...f,lab:FL[i]})),{sc:28}),
    steps:[[`ΣM_{A} = M_{1} + M_{2} + M_{3} = 0`,'',Lg('Gleichgewicht: Die Momente heben sich auf.','Equilibrium: the moments cancel.')],[`M_{1} + M_{2} = ${fmt(sumK)} N · m`],[`M_{3} = ${M}x · F_{3} = ${M}(${fmt(X.x)} m) · F_{3}`.replace(`${M}(${fmt(X.x)} m)`,X.x<0?`${fmt(-X.x)} m`:`${M} ${fmt(X.x)} m`),'',Lg('F3 nach unten angenommen: links von A dreht es links herum.','F3 assumed downwards: left of A it turns counter-clockwise.')],[`${fmt(sumK)} N · m ${X.x<0?'+':M} ${fmt(Math.abs(X.x))} m · F_{3} = 0`],[`F_{3} = ${fmt(DEC(Fx,2))} N`,'',Fx>=0?Lg('Positiv: F3 zeigt nach unten.','Positive: F3 points downwards.'):Lg('Negativ: F3 zeigt nach oben.','Negative: F3 points upwards.')]],
    tip:Lg('ΣM = 0 aufschreiben, die bekannten Momente zusammenzählen und nach F3 umstellen.','Write ΣM = 0, add up the known moments and rearrange for F3.'),meta:{w:'km3',it,Fx}});
}
function km4(h){
  const t=rnd(0,h?3:3),ctx=Lg('Kräftepaar','Force couple');
  const [cn]=pick([[Lg('Windeisen','Tap wrench')],[Lg('Lenkrad','Steering wheel')],[Lg('Kreuzschlüssel','Cross wrench')]]);
  if(t===3){
    const bank=[{q:Lg('Ein Kräftepaar hat F = 50 N und d = 0,4 m. Hängt sein Moment davon ab, um welchen Punkt man es berechnet?','A force couple has F = 50 N and d = 0.4 m. Does its moment depend on the point about which you calculate it?'),ok:Lg('Nein, das Moment ist überall gleich: M = F · d','No, the moment is the same everywhere: M = F · d'),bad:Lg(['Ja, es wird kleiner, je weiter der Punkt entfernt ist','Ja, es ist nur um die Mitte gleich groß','Ja, es wird dann zur Kraft'],['Yes, it gets smaller the further away the point is','Yes, it is only the same about the centre','Yes, then it turns into a force']),why:Lg('Ein Kräftepaar ist ein freier Vektor: Sein Moment M = F · d ist unabhängig vom Bezugspunkt.','A force couple is a free vector: its moment M = F · d does not depend on the reference point.')},
      {q:Lg('Welche Wirkung hat ein Kräftepaar auf einen freien Körper?','What effect does a force couple have on a free body?'),ok:Lg('Es dreht ihn, verschiebt ihn aber nicht','It rotates it but does not move it'),bad:Lg(['Es verschiebt ihn, dreht ihn aber nicht','Es dreht und verschiebt ihn','Gar keine'],['It moves it but does not rotate it','It rotates and moves it','None']),why:Lg('Die Kräfte heben sich als Kraft auf, es bleibt nur das Drehmoment.','The forces cancel as a force, only the turning moment remains.')},
      {q:Lg('Welche Bedingungen müssen zwei Kräfte erfüllen, damit sie ein Kräftepaar bilden?','What must two forces satisfy to form a force couple?'),ok:Lg('Gleich groß, entgegengesetzt und parallel mit Abstand d','Equal, opposite and parallel at a distance d'),bad:Lg(['Gleich groß und auf einer Wirkungslinie','Gleich groß und gleichgerichtet','Beliebig groß, aber parallel'],['Equal and on one line of action','Equal and in the same direction','Any size, but parallel']),why:Lg('Auf einer Wirkungslinie wären sie im Gleichgewicht. Mit Abstand d erzeugen sie ein Moment.','On one line of action they would be in equilibrium. With a distance d they create a moment.')}];
    return MC(Object.assign({ctx},pick(bank),{fig:mf.couple({})}));
  }
  const F=h?pick([35,60,85,120,150]):pick([20,40,50,60,80,100,150]),d=h?pick([120,180,240,320,450]):pick([0.1,0.2,0.25,0.3,0.4,0.5]),dm=h?d/1000:d,M_=F*dm;
  const dgv=h?[`${fmt(d)} mm`]:[`${fmt(d)} m`];
  if(t===0)return MQ({ctx:cn,sym:'M',ans:M_,unit:'N · m',dec:2,label:Lg('Zwei Hände drücken mit gleicher Kraft in entgegengesetzte Richtung. Berechne das Moment.','Two hands push with equal force in opposite directions. Calculate the moment.'),given:[['F',`${fmt(F)} N`],[Lg('Abstand d','Distance d'),dgv[0]]],fig:mf.couple({}),
    steps:[...(h?[[`d = ${fmt(d)} mm = ${fmt(dm)} m`,'',Lg('Millimeter in Meter: durch 1000.','Millimetres to metres: divide by 1000.')]]:[]),[`M = F · d`,'',Lg('Moment eines Kräftepaars: eine Kraft mal der Abstand der beiden Wirkungslinien.','Moment of a couple: one force times the distance between the two lines of action.')],[`M = ${fmt(F)} N · ${fmt(dm)} m = ${fmt(DEC(M_,2))} N · m`]],tip:Lg('Nicht beide Kräfte addieren: Es zählt eine Kraft mal der Abstand.','Do not add both forces: one force times the distance counts.'),meta:{w:'km4',F,dm}});
  if(t===1)return MQ({ctx:cn,sym:'F',ans:F,unit:'N',dec:0,label:Lg('Wie groß ist jede der beiden Kräfte?','How large is each of the two forces?'),given:[['M',`${fmt(DEC(M_,2))} N · m`],[Lg('Abstand d','Distance d'),dgv[0]]],fig:mf.couple({}),
    steps:[...(h?[[`d = ${fmt(d)} mm = ${fmt(dm)} m`]]:[]),[`M = F · d`,': d'],[`F = M / d = ${fmt(DEC(M_,2))} N · m / ${fmt(dm)} m = ${fmt(F)} N`]],tip:Lg('Kraft = Moment durch Abstand.','Force = moment divided by distance.'),meta:{w:'km4',F,dm}});
  return MQ({ctx:cn,sym:'d',ans:h?d:dm,unit:h?'mm':'m',dec:h?0:2,label:Lg('Wie groß ist der Abstand der beiden Kräfte?','How large is the distance between the two forces?'),given:[['M',`${fmt(DEC(M_,2))} N · m`],['F',`${fmt(F)} N`]],fig:mf.couple({}),
    steps:[[`M = F · d`,': F'],[`d = M / F = ${fmt(DEC(M_,2))} N · m / ${fmt(F)} N = ${fmt(dm)} m`],...(h?[[`d = ${fmt(d)} mm`,'',Lg('Mal 1000 gibt Millimeter.','Times 1000 gives millimetres.')]]:[])],tip:Lg('Abstand = Moment durch Kraft.','Distance = moment divided by force.'),meta:{w:'km4',F,dm}});
}
function km5(h){
  const t=rnd(0,h?4:3);
  const mod=pick([1.5,2,2.5,3,4,5]),z1=pick([16,18,20,24,25,30]),z2=pick([40,45,50,60,75,80]);
  if(!h){
    if(t===0){const z=pick([20,24,30,40,50,60]);return MQ({ctx:Lg('Zahnrad','Gear'),sym:'d',ans:mod*z,unit:'mm',dec:1,label:Lg('Berechne den Teilkreisdurchmesser des Zahnrads','Calculate the pitch circle diameter of the gear'),given:[[Lg('Modul m','Module m'),`${fmt(mod)} mm`],[Lg('Zähnezahl z','Number of teeth z'),`${z}`]],fig:mf.gears({}),
      steps:[[`d = m · z`,'',Lg('Teilkreisdurchmesser = Modul mal Zähnezahl.','Pitch circle diameter = module times number of teeth.')],[`d = ${fmt(mod)} mm · ${z} = ${fmt(mod*z)} mm`]],tip:Lg('Durchmesser = Modul mal Zähnezahl.','Diameter = module times number of teeth.'),meta:{w:'km5',t}});}
    const Fu=pick([400,500,800,1000,1200,1500,2000,2500]),d=pick([40,60,80,100,120,150,200]),Mv=Fu*d/2/1000;
    if(t===1)return MQ({ctx:Lg('Zahnradgetriebe','Gear drive'),sym:'F_{u}',ans:Fu,unit:'N',dec:0,label:Lg('Berechne die Umfangskraft am Zahnrad','Calculate the circumferential force on the gear'),given:[['M',`${fmt(DEC(Mv,3))} N · m`],['d',`${fmt(d)} mm`]],fig:mf.gears({}),
      steps:[[`r = d / 2 = ${fmt(d/2)} mm = ${fmt(d/2000)} m`,'',Lg('Die Umfangskraft greift am Teilkreisradius an.','The circumferential force acts at the pitch circle radius.')],[`M = F_{u} · r`,': r'],[`F_{u} = M / r = ${fmt(DEC(Mv,3))} N · m / ${fmt(d/2000)} m = ${fmt(Fu)} N`]],tip:Lg('Radius = d durch 2, in m. Dann Fu = M durch r.','Radius = d divided by 2, in m. Then Fu = M divided by r.'),meta:{w:'km5',t}});
    if(t===2)return MQ({ctx:Lg('Zahnradgetriebe','Gear drive'),sym:'M',ans:Mv,unit:'N · m',dec:2,label:Lg('Berechne das Drehmoment am Zahnrad','Calculate the torque on the gear'),given:[['F_{u}',`${fmt(Fu)} N`],['d',`${fmt(d)} mm`]],fig:mf.gears({}),
      steps:[[`r = d / 2 = ${fmt(d/2)} mm = ${fmt(d/2000)} m`],[`M = F_{u} · r = ${fmt(Fu)} N · ${fmt(d/2000)} m`],[`M = ${fmt(DEC(Mv,3))} N · m`]],tip:Lg('Moment = Umfangskraft mal Radius (nicht Durchmesser).','Moment = circumferential force times radius (not diameter).'),meta:{w:'km5',t}});
    const m=pick([60,80,100,150,200]),r=pick([0.1,0.15,0.2,0.25]),Mw=m*GN*r;
    return MQ({ctx:Lg('Seilwinde','Winch'),sym:'M',ans:Mw,unit:'N · m',dec:2,label:Lg('Welches Moment braucht die Seiltrommel, um die Last zu halten?','Which moment does the rope drum need to hold the load?'),given:[['m',`${fmt(m)} kg`],[Lg('Trommelradius r','Drum radius r'),`${fmt(r)} m`]],fig:mf.drum({}),
      steps:[[`${FG_} = m · g = ${fmt(m)} kg · ${fmt(GN)} m/s² = ${fmt(DEC(m*GN,2))} N`],[`M = ${FG_} · r = ${fmt(DEC(m*GN,2))} N · ${fmt(r)} m`],[`M ≈ ${fmt(DEC(Mw,2))} N · m`]],tip:Lg('Erst die Gewichtskraft, dann mal Trommelradius.','First the weight force, then times the drum radius.'),meta:{w:'km5',t}});
  }
  if(t===0){const M1=pick([20,35,50,80,120]),Fu=M1/(mod*z1/2000),M2=M1*z2/z1;
    return MQ({ctx:Lg('Stirnradgetriebe','Spur gear drive'),sym:'M_{2}',ans:M2,unit:'N · m',dec:2,label:Lg('Berechne das Moment am großen Rad','Calculate the moment on the large gear'),given:[['M_{1}',`${fmt(M1)} N · m`],[Lg('Modul m','Module m'),`${fmt(mod)} mm`],['z_{1}',`${z1}`],['z_{2}',`${z2}`]],fig:mf.gears({}),
      steps:[[`d_{1} = m · z_{1} = ${fmt(mod)} · ${z1} = ${fmt(mod*z1)} mm,  d_{2} = ${fmt(mod*z2)} mm`],[`F_{u} = M_{1} / (d_{1}/2) = ${fmt(M1)} N · m / ${fmt(mod*z1/2000)} m ≈ ${fmt(DEC(Fu,2))} N`,'',Lg('Die Umfangskraft ist an beiden Rädern gleich groß.','The circumferential force is equally large on both gears.')],[`M_{2} = F_{u} · d_{2}/2 = ${fmt(DEC(Fu,2))} N · ${fmt(mod*z2/2000)} m ≈ ${fmt(DEC(M2,2))} N · m`,'',Lg('Kurz: M2 = M1 · z2 / z1','Short: M2 = M1 · z2 / z1')]],tip:Lg('Die Umfangskraft Fu ist an beiden Rädern gleich. Rechne erst Fu aus M1 und d1, dann M2 aus Fu und d2.','The circumferential force Fu is the same on both gears. First Fu from M1 and d1, then M2 from Fu and d2.'),meta:{w:'km5',t}});}
  if(t===1){const M1=pick([20,35,50,80,120]),Fu=M1/(mod*z1/2000);
    return MQ({ctx:Lg('Stirnradgetriebe','Spur gear drive'),sym:'F_{u}',ans:Fu,unit:'N',dec:2,label:Lg('Berechne die Umfangskraft im Eingriff','Calculate the circumferential force at the mesh'),given:[['M_{1}',`${fmt(M1)} N · m`],[Lg('Modul m','Module m'),`${fmt(mod)} mm`],['z_{1}',`${z1}`]],fig:mf.gears({}),
      steps:[[`d_{1} = m · z_{1} = ${fmt(mod)} mm · ${z1} = ${fmt(mod*z1)} mm`,'',Lg('Teilkreisdurchmesser des treibenden Rades.','Pitch circle diameter of the driving gear.')],[`r_{1} = ${fmt(mod*z1/2)} mm = ${fmt(mod*z1/2000)} m`],[`F_{u} = M_{1} / r_{1} = ${fmt(M1)} N · m / ${fmt(mod*z1/2000)} m ≈ ${fmt(DEC(Fu,2))} N`]],tip:Lg('d = m · z, dann r = d durch 2 in m, dann Fu = M durch r.','d = m · z, then r = d divided by 2 in m, then Fu = M divided by r.'),meta:{w:'km5',t}});}
  if(t===2){const F=pick([250,300,350,400]),l=pick([165,170,175,180]),r1=pick([80,90,100]),FK=F*l/r1;
    return MQ({ctx:Lg('Fahrrad','Bicycle'),sym:'F_{K}',ans:FK,unit:'N',dec:2,label:Lg('Berechne die Kettenkraft am Kettenblatt','Calculate the chain force on the chainring'),given:[[Lg('Pedalkraft F','Pedal force F'),`${fmt(F)} N`],[Lg('Kurbellänge l','Crank length l'),`${fmt(l)} mm`],[Lg('Kettenblattradius r','Chainring radius r'),`${fmt(r1)} mm`]],fig:mf.lever({kind:'hub',lf:'F',ll:'l'}),
      steps:[[`M = F · l = ${fmt(F)} N · ${fmt(l)} mm = ${fmt(F*l)} N · mm`,'',Lg('Das Pedal erzeugt das Moment an der Kurbel.','The pedal creates the moment at the crank.')],[`M = F_{K} · r`,'',Lg('Die Kette überträgt dasselbe Moment am Kettenblatt.','The chain transmits the same moment at the chainring.')],[`F_{K} = M / r = ${fmt(F*l)} N · mm / ${fmt(r1)} mm ≈ ${fmt(DEC(FK,2))} N`]],tip:Lg('Moment an der Kurbel gleich Moment am Kettenblatt. Beide in N · mm lassen, dann geht es ohne Umrechnung.','Moment at the crank equals moment at the chainring. Keep both in N · mm and no conversion is needed.'),meta:{w:'km5',t}});}
  if(t===3){const Fr=pick([800,1200,1800,2500]),r=pick([120,150,180,220]),Mb=Fr*r/1000;
    return MQ({ctx:Lg('Bremsscheibe','Brake disc'),sym:'M',ans:Mb,unit:'N · m',dec:2,label:Lg('Berechne das Bremsmoment. Die Reibkraft greift am mittleren Reibradius an.','Calculate the braking moment. The friction force acts at the mean friction radius.'),given:[[Lg('Reibkraft F_{R}','Friction force F_{R}'),`${fmt(Fr)} N`],[Lg('Reibradius r','Friction radius r'),`${fmt(r)} mm`]],fig:mf.drum({lab:'',lr:'r',lf:'F_{R}'}),
      steps:[[`r = ${fmt(r)} mm = ${fmt(r/1000)} m`],[`M = F_{R} · r = ${fmt(Fr)} N · ${fmt(r/1000)} m`],[`M = ${fmt(DEC(Mb,2))} N · m`]],tip:Lg('Reibkraft mal Reibradius. Radius in m.','Friction force times friction radius. Radius in m.'),meta:{w:'km5',t}});}
  const FGv=pick([800,1500,2400]),r=pick([0.15,0.25,0.3]),i=pick([4,5,8]),Mm=FGv*r/i;
  return MQ({ctx:Lg('Winde mit Getriebe','Winch with gearbox'),sym:'M_{M}',ans:Mm,unit:'N · m',dec:2,label:Lg('Welches Motormoment ist mindestens nötig? Das Getriebe hat die Übersetzung i und keine Verluste.','Which motor torque is needed at least? The gearbox has ratio i and no losses.'),given:[[FG_,`${fmt(FGv)} N`],[Lg('Trommelradius r','Drum radius r'),`${fmt(r)} m`],['i',`${i}`]],fig:mf.drum({lm:'M'}),
    steps:[[`M_{Trommel} = ${FG_} · r = ${fmt(FGv)} N · ${fmt(r)} m = ${fmt(FGv*r)} N · m`.replace('Trommel',EN?'drum':'Trommel'),'',Lg('Moment an der Trommel.','Moment at the drum.')],[`M_{M} = M_{${EN?'drum':'Trommel'}} / i = ${fmt(FGv*r)} N · m / ${i}`,'',Lg('Das Getriebe vervielfacht das Moment mit i, der Motor muss nur den i-ten Teil aufbringen.','The gearbox multiplies the moment by i, so the motor only has to provide the i-th part.')],[`M_{M} ≈ ${fmt(DEC(Mm,2))} N · m`]],tip:Lg('Erst das Moment an der Trommel, dann durch die Übersetzung teilen.','First the moment at the drum, then divide by the ratio.'),meta:{w:'km5',t}});
}
