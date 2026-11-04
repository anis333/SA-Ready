/* SA-Ready · Mechanik · Grundlagen
   Je Thema eine Lernseite: Erklärung, Formeln, Skizzen, durchgerechnete Beispiele, typische Fehler.
   Deutsch und Englisch über Lg(). Rechenbeispiele werden im Code gerechnet, damit alle Zahlen stimmen. */
'use strict';
const MF=(svg,cap)=>`<div class="fig">${svg}<p class="fine">${cap}</p></div>`;
const MTRAIN=()=>`<button class="btn" data-act="tab" data-tab="train">${Lg('Zum Training','Go to training')}</button>`;
const MIST=list=>`<div class="mist">${list.map(([b,s])=>`<p><b>${mk(b)}</b><span>${mk(s)}</span></p>`).join('')}</div>`;
const FORM=s=>`<div class="formula">${s.split(/\s{3,}/).map(mk).join('<br>')}</div>`;
const MS=(rs,fin=true)=>SR(rs,mk,fin);
const n2=x=>fmt(DEC(x,2)),n1=x=>fmt(DEC(x,1)),n0=x=>fmt(DEC(x,0));

/* =============== 1  KRAFT & GEWICHT =============== */
function learnKg(){
  const m1=250,F1=m1*GN,F2=12500,m2=F2/GN;
  const a=8,b=5,c=10,R=a+b-c;
  const mS=2000,FS=mS*GN,nS=4;
  const V=2,rho=7.85,mB=rho*V,FB=mB*GN;
  return `
    <section class="sec">
      <h2>${Lg('Was ist eine Kraft?','What is a force?')}</h2>
      <p>${Lg('Eine Kraft schiebt, zieht oder drückt. Man sieht sie nicht, man sieht nur ihre Wirkung. Gemessen wird sie in Newton (N). Eine Kraft ist erst dann vollständig beschrieben, wenn du drei Dinge kennst:','A force pushes, pulls or presses. You cannot see it, only its effect. It is measured in newtons (N). A force is only fully described when you know three things:')}</p>
      ${KV([[Lg('Betrag','Magnitude'),Lg('wie groß','how large')],[Lg('Richtung','Direction'),Lg('wohin','which way')],[Lg('Angriffspunkt','Point of application'),Lg('wo','where')]],'wide')}
      <p>${Lg('Gezeichnet wird eine Kraft als Pfeil: Die Länge zeigt den Betrag, die Spitze die Richtung.','A force is drawn as an arrow: the length shows the magnitude, the tip the direction.')}</p>
      ${KV([['1 kN',`= ${fmt(1000)} N`],['1 N','= 1 kg · m/s²'],[`${fmt(2.5)} kN`,`= ${fmt(2500)} N`],[`${fmt(0.4)} kN`,'= 400 N']])}
    </section>
    <section class="sec">
      <h2>${Lg('Gewichtskraft','Weight force')}</h2>
      <p>${Lg('Die Erde zieht jeden Körper nach unten. Diese Kraft heißt Gewichtskraft. Sie greift im Schwerpunkt an und zeigt senkrecht nach unten.','The Earth pulls every body downwards. This force is called weight force. It acts at the centre of gravity and points vertically downwards.')}</p>
      ${FORM('F_{G} = m · g')}
      ${KV([['m',Lg('Masse in kg','mass in kg')],['g',`${fmt(GN)} m/s²`],['F_{G}',Lg('Kraft in N','force in N')]])}
      ${MF(mf.hang('m','F_{G}'),Lg('Die Last hängt ruhig am Seil: Seilkraft und Gewichtskraft sind gleich groß.','The load hangs at rest on the rope: rope force and weight force are equal.'))}
      <h3 class="sub">${Lg('Beispiel: Masse in Kraft','Example: mass to force')}</h3>
      ${MS([[`F_{G} = m · g = ${fmt(m1)} kg · ${fmt(GN)} m/s²`,'',Lg('Masse mal Fallbeschleunigung.','Mass times acceleration due to gravity.')],[`F_{G} = ${n1(F1)} N ≈ ${n2(F1/1000)} kN`]])}
      <h3 class="sub">${Lg('Beispiel: Kraft in Masse','Example: force to mass')}</h3>
      ${MS([[`F_{G} = ${fmt(12.5)} kN = ${fmt(F2)} N`,'',Lg('Erst kN in N umrechnen.','First convert kN to N.')],[`m = F_{G} / g = ${fmt(F2)} N / ${fmt(GN)} m/s²`,'',Lg('Nach m umstellen.','Rearrange for m.')],[`m ≈ ${n1(m2)} kg`]])}
      <p class="fine">${Lg('Die Masse bleibt überall gleich. Nur die Gewichtskraft ändert sich: Auf dem Mond (g = 1,62 m/s²) wiegt dieselbe Masse nur etwa ein Sechstel.','The mass is the same everywhere. Only the weight force changes: on the Moon (g = 1.62 m/s²) the same mass weighs only about a sixth.')}</p>
    </section>
    <section class="sec">
      <h2>${Lg('Kräfte auf einer Wirkungslinie','Forces on one line of action')}</h2>
      <p>${Lg('Liegen alle Kräfte auf einer Geraden, rechnest du mit Vorzeichen: nach rechts positiv, nach links negativ. Die Summe heißt Resultierende F_{R}.','If all forces lie on one straight line, you calculate with signs: to the right positive, to the left negative. The sum is called the resultant F_{R}.')}</p>
      ${FORM('F_{R} = Σ F = F_{1} + F_{2} + …')}
      ${MF(mf.line([{v:a,lab:'F_{1}'},{v:b,lab:'F_{2}'},{v:-c,lab:'F_{3}'}]),Lg(`F1 = ${a} kN und F2 = ${b} kN nach rechts, F3 = ${c} kN nach links.`,`F1 = ${a} kN and F2 = ${b} kN to the right, F3 = ${c} kN to the left.`))}
      ${MS([[`F_{R} = F_{1} + F_{2} ${M} F_{3}`,'',Lg('Links herum zählt negativ.','Leftwards counts negative.')],[`F_{R} = ${a} + ${b} ${M} ${c} = ${R} kN`,'',Lg('Positiv: Die Resultierende zeigt nach rechts.','Positive: the resultant points to the right.')]])}
      <p>${Lg('Im Gleichgewicht ist die Summe null: ΣF = 0. Dann hebt sich alles auf, der Körper bleibt in Ruhe.','In equilibrium the sum is zero: ΣF = 0. Everything cancels and the body stays at rest.')}</p>
      ${MS([[`ΣF = 0:  F_{1} + F_{2} ${M} F_{3} + F_{4} = 0`,'',Lg(`Gesucht ist eine vierte Kraft, die das Gleichgewicht herstellt.`,`We look for a fourth force that creates equilibrium.`)],[`F_{4} = ${M}${R} kN`,'',Lg(`Negativ: ${R} kN nach links.`,`Negative: ${R} kN to the left.`)]])}
    </section>
    <section class="sec">
      <h2>${Lg('Grundbegriffe der Statik','Basic terms of statics')}</h2>
      <div class="mist">
        <p><b>${Lg('Wechselwirkung','Interaction')}</b><span>${Lg('Wirkt Körper A mit 80 N auf Körper B, wirkt B mit 80 N zurück auf A, entgegengesetzt. Die beiden Kräfte greifen an verschiedenen Körpern an.','If body A acts on body B with 80 N, B acts back on A with 80 N, in the opposite direction. The two forces act on different bodies.')}</span></p>
        <p><b>${Lg('Verschiebungssatz','Transmissibility')}</b><span>${Lg('Eine Kraft darf an einem starren Körper entlang ihrer Wirkungslinie verschoben werden, ohne dass sich die Wirkung ändert. Seitlich verschieben darfst du sie nur, wenn du ein Moment ergänzt.','A force may be moved along its line of action on a rigid body without changing its effect. You may only move it sideways if you add a moment.')}</span></p>
        <p><b>${Lg('Zwei Kräfte im Gleichgewicht','Two forces in equilibrium')}</b><span>${Lg('Gleich groß, entgegengesetzt, auf derselben Wirkungslinie.','Equal in size, opposite, on the same line of action.')}</span></p>
        <p><b>${Lg('Drei Kräfte im Gleichgewicht','Three forces in equilibrium')}</b><span>${Lg('Ihre Wirkungslinien schneiden sich in einem Punkt.','Their lines of action meet at one point.')}</span></p>
      </div>
      <h3 class="sub">${Lg('Gleichgewicht in der Ebene','Equilibrium in the plane')}</h3>
      ${KV([['ΣF_{x} = 0',Lg('waagerecht','horizontal')],['ΣF_{y} = 0',Lg('senkrecht','vertical')],['ΣM = 0',Lg('Momente','moments')]],'wide')}
      <p class="fine">${Lg('Zentrales Kräftesystem (alle Linien in einem Punkt): 2 Gleichungen. Allgemeines Kräftesystem: 3 Gleichungen.','Concurrent force system (all lines through one point): 2 equations. General force system: 3 equations.')}</p>
    </section>
    <section class="sec">
      <h2>${Lg('Aus der Werkstatt','From the workshop')}</h2>
      <p>${Lg('Gewicht eines Bauteils: erst die Masse aus Volumen und Dichte, dann die Gewichtskraft.','Weight of a part: first the mass from volume and density, then the weight force.')}</p>
      ${FORM('m = ρ · V')}
      ${KV([[Lg('Stahl','Steel'),'7,85 kg/dm³'.replace(',',EN?'.':',')],[Lg('Aluminium','Aluminium'),'2,7 kg/dm³'.replace(',',EN?'.':',')],[Lg('Kupfer','Copper'),'8,9 kg/dm³'.replace(',',EN?'.':',')],['1 dm³',`= ${fmt(1000)} cm³`]])}
      ${MS([[`V = 10 · 10 · 20 cm³ = ${fmt(2000)} cm³ = ${V} dm³`,'',Lg('1 dm³ = 1000 cm³.','1 dm³ = 1000 cm³.')],[`m = ρ · V = ${fmt(rho)} kg/dm³ · ${V} dm³ = ${fmt(mB)} kg`],[`F_{G} = m · g = ${fmt(mB)} kg · ${fmt(GN)} m/s² ≈ ${n2(FB)} N`]])}
      <h3 class="sub">${Lg('Seilstränge','Rope strands')}</h3>
      <p>${Lg('Hängt eine Last an mehreren gleich belasteten Strängen, teilt sich die Gewichtskraft auf.','If a load hangs on several equally loaded strands, the weight force is shared.')}</p>
      ${MS([[`F_{G} = ${fmt(mS)} kg · ${fmt(GN)} m/s² = ${fmt(DEC(FS,1))} N`],[`F_{S} = F_{G} / ${nS} = ${fmt(DEC(FS/nS,2))} N`,'',Lg(`Jeder der ${nS} Stränge trägt ein Viertel.`,`Each of the ${nS} strands carries a quarter.`)]])}
    </section>
    <section class="sec">
      <h2>${Lg('Typische Fehler','Common mistakes')}</h2>
      ${MIST([
        [Lg('Masse und Kraft verwechselt','Mass and force mixed up'),Lg('kg ist eine Masse, N ist eine Kraft. Zum Umrechnen brauchst du g = 9,81 m/s².','kg is a mass, N is a force. To convert you need g = 9.81 m/s².')],
        [Lg('kN nicht in N umgerechnet','kN not converted to N'),Lg('Bei Gewichtskraft durch g immer N einsetzen: 12,5 kN = 12 500 N.','Always use N when dividing by g: 12.5 kN = 12,500 N.')],
        [Lg('Vorzeichen vergessen','Signs forgotten'),Lg('Kräfte nach links müssen negativ in die Summe.','Forces to the left must go into the sum as negative.')],
        [Lg('Seilstränge nicht geteilt','Strands not divided'),Lg('Bei n gleichen Strängen trägt jeder F_{G} / n.','With n equal strands each one carries F_{G} / n.')]
      ])}
      ${MTRAIN()}
    </section>`;
}

/* =============== 2  KRÄFTE ZERLEGEN & ZUSAMMENSETZEN =============== */
function learnZr(){
  const F=120,al=30,Fx=F*C(al),Fy=F*Sn(al);
  const Fx2=60,Fy2=80,Fb=Math.hypot(Fx2,Fy2),ab=Math.atan(Fy2/Fx2)/D2;
  const q=100,Rx=q*C(30)+q*C(150),Ry=q*Sn(30)+q*Sn(150);
  const G=1000,a1=30,S1=G/(2*Sn(a1)),a2=45,S2=G/(2*Sn(a2));
  const G3=500,a3=30,SB=G3/Sn(a3),HB=G3/Math.tan(a3*D2);
  const G4=600,al4=30,be4=60,s4=Sn(al4+be4),F14=G4*C(be4)/s4,F24=G4*C(al4)/s4;
  return `
    <section class="sec">
      <h2>${Lg('Kraft in Komponenten zerlegen','Resolving a force into components')}</h2>
      <p>${Lg('Eine schräge Kraft F lässt sich durch zwei Kräfte ersetzen: eine waagerechte F_{x} und eine senkrechte F_{y}. Zusammen haben sie dieselbe Wirkung wie F.','An inclined force F can be replaced by two forces: a horizontal F_{x} and a vertical F_{y}. Together they have the same effect as F.')}</p>
      ${MF(mf.vec({a:35,lx:'F_{x}',ly:'F_{y}'}),Lg('Der Winkel α liegt an der x-Achse.','The angle α is measured from the x axis.'))}
      ${FORM('F_{x} = F · cos α      F_{y} = F · sin α')}
      <p>${Lg('Merke: Die Komponente, die dem Winkel anliegt, bekommt den Kosinus. Die gegenüberliegende bekommt den Sinus.','Remember: the component next to the angle gets the cosine. The opposite one gets the sine.')}</p>
      ${MS([[`F_{x} = F · cos α = ${F} N · cos ${al}°`,'',Lg('Taschenrechner auf DEG stellen.','Set the calculator to DEG.')],[`F_{x} ≈ ${n2(Fx)} N`],[`F_{y} = F · sin α = ${F} N · sin ${al}° = ${n2(Fy)} N`]])}
      <h3 class="sub">${Lg('Winkel an der y-Achse','Angle at the y axis')}</h3>
      <p>${Lg('Liegt der Winkel an der senkrechten Achse, tauschen Sinus und Kosinus.','If the angle lies at the vertical axis, sine and cosine swap.')}</p>
      ${MF(mf.vec({a:60,axis:'y',lx:'F_{x}',ly:'F_{y}',la:'β'}),Lg('Winkel β an der y-Achse: F_{x} = F · sin β und F_{y} = F · cos β.','Angle β at the y axis: F_{x} = F · sin β and F_{y} = F · cos β.'))}
      <h3 class="sub">${Lg('Umgekehrt','The other way round')}</h3>
      ${KV([['F','= F_{x} / cos α'],['F','= F_{y} / sin α']])}
    </section>
    <section class="sec">
      <h2>${Lg('Betrag und Richtung','Magnitude and direction')}</h2>
      <p>${Lg('Sind F_{x} und F_{y} gegeben, findest du die ganze Kraft mit Pythagoras. Den Winkel gibt der Arkustangens.','If F_{x} and F_{y} are given, you find the whole force with Pythagoras. The angle comes from the arctangent.')}</p>
      ${FORM('F = √(F_{x}² + F_{y}²)      tan α = F_{y} / F_{x}')}
      ${MS([[`F = √(${Fx2}² + ${Fy2}²) N = √${fmt(Fx2*Fx2+Fy2*Fy2)} N`],[`F = ${fmt(Fb)} N`],[`α = arctan(${Fy2} / ${Fx2}) ≈ ${n2(ab)}°`,'',Lg('Taschenrechner: tan⁻¹ (DEG).','Calculator: tan⁻¹ (DEG).')]])}
      <p>${Lg('Der Arkustangens liefert nur Winkel zwischen −90° und 90°. Schau auf die Vorzeichen von F_{x} und F_{y}, um den richtigen Quadranten zu finden (θ ist der Winkel ab der +x-Achse):','The arctangent only gives angles between −90° and 90°. Look at the signs of F_{x} and F_{y} to find the right quadrant (θ is the angle from the +x axis):')}</p>
      ${KV([['F_{x} > 0, F_{y} > 0','θ = α'],['F_{x} < 0, F_{y} > 0',`θ = 180° ${M} α`],['F_{x} < 0, F_{y} < 0','θ = 180° + α'],['F_{x} > 0, F_{y} < 0',`θ = 360° ${M} α`]],'wide')}
      <p class="fine">${Lg('Hier ist α der positive Winkel aus arctan(|F_{y}| / |F_{x}|).','Here α is the positive angle from arctan(|F_{y}| / |F_{x}|).')}</p>
    </section>
    <section class="sec">
      <h2>${Lg('Resultierende aus mehreren Kräften','Resultant of several forces')}</h2>
      <p>${Lg('Das Komponentenverfahren: jede Kraft zerlegen, die Komponenten getrennt addieren, am Ende mit Pythagoras zusammensetzen.','The component method: resolve every force, add the components separately, and combine them with Pythagoras at the end.')}</p>
      ${MF(mf.multi([{a:30,lab:'F_{1}'},{a:150,lab:'F_{2}'}]),Lg('Zwei Kräfte greifen im selben Punkt an.','Two forces act at the same point.'))}
      ${FORM('F_{Rx} = Σ F_{x}      F_{Ry} = Σ F_{y}')}
      ${MS([[`F_{Rx} = ${q} · cos 30° + ${q} · cos 150° = ${n2(q*C(30))} ${M} ${n2(q*C(30))} = ${n2(Rx)} N`,'',Lg('Die 150°-Kraft zeigt nach links: cos 150° ist negativ.','The 150° force points to the left: cos 150° is negative.')],[`F_{Ry} = ${q} · sin 30° + ${q} · sin 150° = ${n2(q*Sn(30))} + ${n2(q*Sn(150))} = ${n2(Ry)} N`],[`F_{R} = √(F_{Rx}² + F_{Ry}²) = ${n2(Math.hypot(Rx,Ry))} N`,'',Lg('Die Resultierende zeigt senkrecht nach oben.','The resultant points straight up.')]])}
      <p class="fine">${Lg('Bei drei Kräften gilt dasselbe Vorgehen: jeweils eine Zeile mehr in der Summe.','With three forces the procedure is the same: one more term in each sum.')}</p>
    </section>
    <section class="sec">
      <h2>${Lg('Seilkräfte','Rope forces')}</h2>
      <p>${Lg('Am Knoten, an dem die Last hängt, ist alles im Gleichgewicht: ΣF_{x} = 0 und ΣF_{y} = 0. Daraus folgen die Seilkräfte.','At the joint where the load hangs everything is in equilibrium: ΣF_{x} = 0 and ΣF_{y} = 0. The rope forces follow from this.')}</p>
      <h3 class="sub">${Lg('Zwei gleiche Seile','Two equal ropes')}</h3>
      ${MF(mf.ropes(30,30,{f1:'F_{S}',f2:'F_{S}',lb:'α',fl:'F_{G}'}),Lg('Gleiche Winkel α: beide Seile ziehen gleich stark.','Equal angles α: both ropes pull equally.'))}
      ${FORM('F_{S} = F_{G} / (2 · sin α)')}
      ${MS([[`α = ${a1}°:  F_{S} = ${fmt(G)} N / (2 · sin ${a1}°) = ${n2(S1)} N`],[`α = ${a2}°:  F_{S} = ${fmt(G)} N / (2 · sin ${a2}°) = ${n2(S2)} N`,'',Lg('Je flacher die Seile, desto größer die Seilkraft.','The flatter the ropes, the larger the rope force.')]],false)}
      <h3 class="sub">${Lg('Wandausleger','Wall bracket')}</h3>
      ${MF(mf.boom({a:30,fl:'F_{G}',fs:'F_{S}'}),Lg('Seil und Ausleger, der Winkel α liegt zwischen Seil und Ausleger.','Rope and boom, the angle α lies between rope and boom.'))}
      ${KV([['F_{S}','= F_{G} / sin α'],['F_{H}','= F_{G} / tan α']])}
      ${MS([[`F_{S} = ${G3} N / sin ${a3}° = ${n2(SB)} N`,'',Lg('Senkrecht trägt nur das Seil die Last.','Vertically only the rope carries the load.')],[`F_{H} = ${G3} N / tan ${a3}° = ${n2(HB)} N`,'',Lg('Der Ausleger wird auf Druck belastet.','The boom is loaded in compression.')]],false)}
      <h3 class="sub">${Lg('Zwei verschiedene Winkel','Two different angles')}</h3>
      ${MF(mf.ropes(al4,be4,{f1:'F_{1}',f2:'F_{2}',fl:'F_{G}'}),Lg('Links α, rechts β gegen die Waagerechte.','Left α, right β against the horizontal.'))}
      ${KV([['F_{1}','= F_{G} · cos β / sin(α + β)'],['F_{2}','= F_{G} · cos α / sin(α + β)']],'wide')}
      ${MS([[`sin(α + β) = sin ${al4+be4}° = ${fmt(s4)}`],[`F_{1} = ${G4} N · cos ${be4}° / ${fmt(s4)} = ${n2(F14)} N`],[`F_{2} = ${G4} N · cos ${al4}° / ${fmt(s4)} = ${n2(F24)} N`]],false)}
    </section>
    <section class="sec">
      <h2>${Lg('Typische Fehler','Common mistakes')}</h2>
      ${MIST([
        [Lg('Sinus und Kosinus vertauscht','Sine and cosine swapped'),Lg('Erst prüfen, an welcher Achse der Winkel liegt. An der x-Achse: F_{x} = F · cos α.','First check at which axis the angle lies. At the x axis: F_{x} = F · cos α.')],
        [Lg('Taschenrechner im Bogenmaß','Calculator in radians'),Lg('Winkel in Grad: DEG einstellen. cos 60° ist 0,5.','Angles in degrees: use DEG. cos 60° is 0.5.')],
        [Lg('Vorzeichen der Komponenten','Signs of the components'),Lg('Zeigt die Kraft nach links oder nach unten, ist die Komponente negativ.','If the force points left or down, the component is negative.')],
        [Lg('Winkel am Seil falsch','Wrong rope angle'),Lg('Beim Seil zählt der Winkel zur Waagerechten. Wird der Winkel zur Senkrechten gegeben, tauschen sin und cos.','For ropes the angle to the horizontal counts. If the angle to the vertical is given, sin and cos swap.')]
      ])}
      ${MTRAIN()}
    </section>`;
}

/* =============== 3  KRAFTMOMENT =============== */
function learnKm(){
  const F=120,l=0.25,Mv=F*l;
  const F2=80,l2=0.4,a2=30,M2=F2*l2*Sn(a2);
  const f1=100,x1=2,f2=150,x2=1.5,m1=-f1*x1,m2=f2*x2,sm=m1+m2;
  const Fc=50,dc=0.3,Mc=Fc*dc;
  const mod=2,z1=20,z2=60,Mi=30,d1=mod*z1,Fu=Mi/(d1/2000),Mo=Mi*z2/z1;
  return `
    <section class="sec">
      <h2>${Lg('Das Moment einer Kraft','The moment of a force')}</h2>
      <p>${Lg('Eine Kraft kann auch drehen. Wie stark sie dreht, sagt das Moment M. Es wächst mit der Kraft und mit dem Hebelarm l. Das ist der senkrechte Abstand zwischen Drehpunkt und Wirkungslinie der Kraft.','A force can also turn. The moment M tells you how strongly. It grows with the force and with the lever arm l, the perpendicular distance between pivot and line of action of the force.')}</p>
      ${FORM('M = F · l')}
      ${MF(mf.lever({}),Lg('Schraubenschlüssel: Die Kraft steht senkrecht zum Hebel.','Spanner: the force is perpendicular to the lever.'))}
      ${KV([['N · m',Lg('Einheit des Moments','unit of moment')],['1 N · m',`= ${fmt(1000)} N · mm`],['1 cm',`= ${fmt(0.01)} m`],['1 mm',`= ${fmt(0.001)} m`]],'wide')}
      ${MS([[`l = 25 cm = ${fmt(l)} m`,'',Lg('Hebelarm in Meter, wenn das Moment in N · m verlangt ist.','Lever arm in metres if the moment is wanted in N · m.')],[`M = F · l = ${F} N · ${fmt(l)} m = ${fmt(Mv)} N · m`]])}
      <h3 class="sub">${Lg('Umstellen','Rearranging')}</h3>
      ${KV([['F','= M / l'],['l','= M / F']])}
      <h3 class="sub">${Lg('Schräge Kraft','Inclined force')}</h3>
      ${MF(mf.lever({a:60,la:'α'}),Lg('Nur der senkrechte Anteil der Kraft dreht: l_{wirk} = l · sin α.','Only the perpendicular part of the force turns: l_{eff} = l · sin α.'))}
      ${MS([[`M = F · l · sin α = ${F2} N · ${fmt(l2)} m · sin ${a2}°`,'',Lg('α ist der Winkel zwischen Hebel und Kraft.','α is the angle between lever and force.')],[`M = ${fmt(M2)} N · m`]])}
    </section>
    <section class="sec">
      <h2>${Lg('Drehsinn und Momentensumme','Sense of rotation and sum of moments')}</h2>
      <p>${Lg('Links herum (gegen den Uhrzeigersinn) zählt positiv, rechts herum negativ. Für das Gleichgewicht muss die Summe der Momente um jeden Punkt null sein: ΣM = 0.','Anticlockwise counts positive, clockwise negative. For equilibrium the sum of the moments about every point must be zero: ΣM = 0.')}</p>
      ${MF(mf.barForces([{x:x1,F:f1,lab:'F_{1}',d:`${fmt(x1)} m`},{x:-x2,F:f2,lab:'F_{2}',d:`${fmt(x2)} m`}]),Lg('Stab mit Drehpunkt A. Beide Kräfte zeigen nach unten.','Bar with pivot A. Both forces point downwards.'))}
      ${MS([[`M_{1} = ${M}F_{1} · ${fmt(x1)} m = ${M}${fmt(f1*x1)} N · m`,'',Lg('F1 rechts vom Drehpunkt dreht rechts herum: negativ.','F1 to the right of the pivot turns clockwise: negative.')],[`M_{2} = +F_{2} · ${fmt(x2)} m = +${fmt(m2)} N · m`,'',Lg('F2 links vom Drehpunkt dreht links herum: positiv.','F2 to the left of the pivot turns anticlockwise: positive.')],[`ΣM_{A} = M_{1} + M_{2} = +${fmt(sm)} N · m`,'',Lg('Positiv: Der Stab dreht links herum.','Positive: the bar turns anticlockwise.')]])}
      <p class="fine">${Lg('Eine Kraft, deren Wirkungslinie durch den Drehpunkt geht, hat dort kein Moment (Hebelarm null).','A force whose line of action passes through the pivot has no moment there (lever arm zero).')}</p>
    </section>
    <section class="sec">
      <h2>${Lg('Kräftepaar','Force couple')}</h2>
      <p>${Lg('Zwei gleich große, entgegengesetzte Kräfte auf parallelen Wirkungslinien im Abstand d bilden ein Kräftepaar. Die Resultierende ist null, es bleibt ein reines Moment.','Two equal, opposite forces on parallel lines of action at distance d form a force couple. The resultant is zero, only a pure moment remains.')}</p>
      ${MF(mf.couple({}),Lg('Das Moment des Paares ist überall gleich groß, egal um welchen Punkt du rechnest.','The moment of the couple is the same everywhere, whichever point you take moments about.'))}
      ${FORM('M = F · d')}
      ${MS([[`M = F · d = ${Fc} N · ${fmt(dc)} m`],[`M = ${fmt(Mc)} N · m`]])}
    </section>
    <section class="sec">
      <h2>${Lg('Getriebe und Antriebe','Gears and drives')}</h2>
      <p>${Lg('Am Zahnrad greift die Umfangskraft F_{u} am Teilkreis an. Der Teilkreisdurchmesser folgt aus Modul m und Zähnezahl z.','On a gear the circumferential force F_{u} acts on the pitch circle. The pitch circle diameter follows from module m and number of teeth z.')}</p>
      ${MF(mf.gears({}),Lg('Zahnradpaar, die Umfangskraft F_{u} am Berührpunkt.','Gear pair, the circumferential force F_{u} at the contact point.'))}
      ${KV([['d','= m · z'],['M','= F_{u} · d / 2'],['F_{u}','= 2 · M / d'],['M_{2}','= M_{1} · z_{2} / z_{1}']])}
      ${MS([[`d_{1} = m · z_{1} = ${mod} mm · ${z1} = ${d1} mm`],[`F_{u} = M_{1} / (d_{1} / 2) = ${Mi} N · m / ${fmt(d1/2000)} m = ${fmt(Fu)} N`,'',Lg('d in Meter: 40 mm = 0,04 m.','d in metres: 40 mm = 0.04 m.')],[`M_{2} = M_{1} · z_{2} / z_{1} = ${Mi} N · m · ${z2} / ${z1} = ${fmt(Mo)} N · m`,'',Lg('Das große Rad bekommt mehr Moment, dreht aber langsamer.','The large gear gets more moment but turns more slowly.')]],false)}
      <h3 class="sub">${Lg('Seilwinde','Winch')}</h3>
      ${MF(mf.drum({}),Lg('Die Trommel muss die Last halten: M = F_{G} · r.','The drum has to hold the load: M = F_{G} · r.'))}
    </section>
    <section class="sec">
      <h2>${Lg('Typische Fehler','Common mistakes')}</h2>
      ${MIST([
        [Lg('Einheiten gemischt','Units mixed'),Lg('Newton mal Zentimeter ist N · cm. Für N · m erst den Hebelarm in Meter umrechnen.','Newtons times centimetres is N · cm. For N · m convert the lever arm to metres first.')],
        [Lg('Abstand nicht senkrecht','Distance not perpendicular'),Lg('Der Hebelarm steht senkrecht zur Wirkungslinie, nicht längs des schrägen Hebels.','The lever arm is perpendicular to the line of action, not along the inclined lever.')],
        [Lg('Drehsinn vergessen','Sense of rotation forgotten'),Lg('Links herum plus, rechts herum minus. Immer zuerst festlegen.','Anticlockwise plus, clockwise minus. Always decide first.')],
        [Lg('Durchmesser statt Radius','Diameter instead of radius'),Lg('Am Zahnrad gilt M = F_{u} · d / 2. Der Hebelarm ist der Radius.','On a gear M = F_{u} · d / 2. The lever arm is the radius.')]
      ])}
      ${MTRAIN()}
    </section>`;
}

/* =============== 4  FREIMACHEN & LAGER =============== */
function learnFm(){
  const m=50,mu=0.2,FN=m*GN,FR=mu*FN;
  return `
    <section class="sec">
      <h2>${Lg('Freimachen','Free-body diagram')}</h2>
      <p>${Lg('Bevor du rechnest, löst du den Körper gedanklich aus seiner Umgebung und zeichnest alle Kräfte ein, die von außen auf ihn wirken. Das nennt man Freimachen.','Before calculating, you mentally separate the body from its surroundings and draw all forces acting on it from outside. This is called making a free-body diagram.')}</p>
      <ol class="order">
        <li>${Lg('Körper herauszeichnen, alles andere weglassen.','Draw the body on its own, leave everything else out.')}</li>
        <li>${Lg('Gewichtskraft im Schwerpunkt, senkrecht nach unten.','Weight force at the centre of gravity, vertically downwards.')}</li>
        <li>${Lg('Äußere Lasten mit Richtung und Abstand.','External loads with direction and distance.')}</li>
        <li>${Lg('An jeder Stelle, wo der Körper gehalten wird: die Reaktionskräfte des Lagers, Seils oder Stabs.','At every place where the body is held: the reaction forces of the support, rope or rod.')}</li>
      </ol>
      <p class="fine">${Lg('Wo ein Lager eine Bewegung verhindert, wirkt eine Kraft. Wo es eine Drehung verhindert, wirkt ein Moment.','Where a support prevents a movement, there is a force. Where it prevents a rotation, there is a moment.')}</p>
    </section>
    <section class="sec">
      <h2>${Lg('Lagerarten','Types of support')}</h2>
      ${MF(mf.support('los'),Lg('Loslager: nimmt nur eine Kraft senkrecht zur Auflagefläche auf. Die Rollen lassen die Verschiebung frei.','Roller support: takes only one force perpendicular to the surface. The rollers leave sliding free.'))}
      ${MF(mf.support('fest'),Lg('Festlager: nimmt waagerechte und senkrechte Kraft auf, lässt aber die Drehung zu.','Pin support: takes horizontal and vertical force but allows rotation.'))}
      ${MF(mf.support('ein'),Lg('Feste Einspannung: nimmt beide Kräfte und ein Moment auf. Nichts bewegt sich, nichts dreht sich.','Fixed support: takes both forces and a moment. Nothing moves, nothing turns.'))}
      ${KV([[Lg('Loslager','Roller support'),Lg('1 Reaktion','1 reaction')],[Lg('Festlager','Pin support'),Lg('2 Reaktionen','2 reactions')],[Lg('Einspannung','Fixed support'),Lg('3 Reaktionen','3 reactions')]],'wide')}
      <p class="fine">${Lg('Festlager: Die Richtung der Kraft ist unbekannt, deshalb zeichnest du zwei Komponenten F_{x} und F_{y}. Einspannung: zusätzlich das Einspannmoment M.','Pin support: the direction of the force is unknown, so you draw two components F_{x} and F_{y}. Fixed support: the fixing moment M as well.')}</p>
    </section>
    <section class="sec">
      <h2>${Lg('Seile, Stäbe, Normalkraft, Reibung','Ropes, rods, normal force, friction')}</h2>
      <div class="mist">
        <p><b>${Lg('Seil','Rope')}</b><span>${Lg('Nur Zug, entlang des Seils, vom Körper weg. Druck kann ein Seil nicht übertragen. Über eine reibungsfreie Rolle ist die Seilkraft auf beiden Seiten gleich.','Tension only, along the rope, away from the body. A rope cannot transmit compression. Over a frictionless pulley the rope force is equal on both sides.')}</span></p>
        <p><b>${Lg('Zweigelenkstab','Two-force rod')}</b><span>${Lg('Ein Stab, der nur an seinen Enden Kräfte bekommt, wird in Richtung der Stabachse belastet. Er kann Zug und Druck aufnehmen.','A rod that only gets forces at its ends is loaded along its axis. It can take tension and compression.')}</span></p>
        <p><b>${Lg('Normalkraft F_{N}','Normal force F_{N}')}</b><span>${Lg('Senkrecht zur Berührfläche, auf den Körper zu.','Perpendicular to the contact surface, towards the body.')}</span></p>
        <p><b>${Lg('Reibkraft F_{R}','Friction force F_{R}')}</b><span>${Lg('Parallel zur Berührfläche, gegen die (mögliche) Bewegung. Höchstens F_{R} = μ · F_{N}.','Parallel to the contact surface, against the (possible) motion. At most F_{R} = μ · F_{N}.')}</span></p>
      </div>
      ${MF(mf.support('seil'),Lg('Seil: eine Zugkraft in Seilrichtung.','Rope: one tensile force along the rope.'))}
      ${MF(mf.support('stab'),Lg('Zweigelenkstab: eine Kraft in Stabrichtung.','Two-force rod: one force along the rod.'))}
      ${MS([[`F_{N} = m · g = ${m} kg · ${fmt(GN)} m/s² = ${fmt(FN)} N`,'',Lg('Auf waagerechtem Boden trägt die Normalkraft das ganze Gewicht.','On level ground the normal force carries the whole weight.')],[`F_{R,max} = μ · F_{N} = ${fmt(mu)} · ${fmt(FN)} N = ${fmt(DEC(FR,2))} N`,'',Lg(`Ein Körper (${m} kg) mit μ = ${fmt(mu)}.`,`A body (${m} kg) with μ = ${fmt(mu)}.`)]],false)}
      <p class="fine">${Lg('Kommt für eine Stabkraft ein negatives Ergebnis heraus, wirkt sie entgegen der angenommenen Richtung. Wurde Zug angenommen, ist der Stab auf Druck belastet.','If a rod force comes out negative, it acts opposite to the assumed direction. If tension was assumed, the rod is in compression.')}</p>
    </section>
    <section class="sec">
      <h2>${Lg('Gleichgewichtslagen','Types of equilibrium')}</h2>
      <p>${Lg('Wird ein Körper im Gleichgewicht ein kleines Stück bewegt, passiert eines von dreien:','If a body in equilibrium is moved a little, one of three things happens:')}</p>
      ${MF(mf.ball('stabil'),Lg('Stabil: Der Körper kehrt zurück. Der Schwerpunkt liegt tiefer als der Aufhängepunkt.','Stable: the body returns. The centre of gravity is below the pivot.'))}
      ${MF(mf.ball('labil'),Lg('Labil: Der Körper kippt weg. Der Schwerpunkt liegt über dem Stützpunkt.','Unstable: the body tips away. The centre of gravity is above the support point.'))}
      ${MF(mf.ball('indiff'),Lg('Indifferent: Der Körper bleibt, wo er ist. Der Schwerpunkt liegt auf dem Drehpunkt oder die Höhe bleibt gleich.','Neutral: the body stays where it is. The centre of gravity is at the pivot or the height stays the same.'))}
      ${KV([[Lg('Mulde','Bowl'),Lg('stabil','stable')],[Lg('Hügel','Hill'),Lg('labil','unstable')],[Lg('Ebene','Flat'),Lg('indifferent','neutral')]],'wide')}
    </section>
    <section class="sec">
      <h2>${Lg('Statisch bestimmt?','Statically determinate?')}</h2>
      <p>${Lg('In der Ebene hast du drei Gleichgewichtsgleichungen: ΣF_{x} = 0, ΣF_{y} = 0, ΣM = 0. Zähle die Reaktionen n der Lager und vergleiche:','In the plane you have three equilibrium equations: ΣF_{x} = 0, ΣF_{y} = 0, ΣM = 0. Count the reactions n of the supports and compare:')}</p>
      ${KV([['n = 3',Lg('statisch bestimmt','statically determinate')],['n > 3',Lg('statisch unbestimmt','statically indeterminate')],['n < 3',Lg('beweglich, kein Gleichgewicht','movable, no equilibrium')]],'wide')}
      ${MS([[Lg('Festlager + Loslager','Pin + roller support'),'',`2 + 1 = 3 → ${Lg('bestimmt','determinate')}`],[Lg('Einspannung','Fixed support'),'',`3 → ${Lg('bestimmt','determinate')}`],[Lg('zwei Festlager','two pin supports'),'',`2 + 2 = 4 → ${Lg('unbestimmt','indeterminate')}`],[Lg('zwei Loslager','two roller supports'),'',`1 + 1 = 2 → ${Lg('beweglich','movable')}`]],false)}
      <p class="fine">${Lg('Nur bei n = 3 reichen die drei Gleichungen, um alle Lagerkräfte zu berechnen.','Only for n = 3 do the three equations suffice to calculate all support forces.')}</p>
    </section>
    <section class="sec">
      <h2>${Lg('Typische Fehler','Common mistakes')}</h2>
      ${MIST([
        [Lg('Gewichtskraft vergessen','Weight force forgotten'),Lg('Sie wirkt immer, im Schwerpunkt, senkrecht nach unten.','It always acts, at the centre of gravity, vertically downwards.')],
        [Lg('Seil drückt','Rope pushes'),Lg('Ein Seil zieht nur. Die Seilkraft zeigt immer vom Körper weg.','A rope only pulls. The rope force always points away from the body.')],
        [Lg('Loslager mit zwei Kräften','Roller support with two forces'),Lg('Ein Loslager hat genau eine Reaktion, senkrecht zur Fläche.','A roller support has exactly one reaction, perpendicular to the surface.')],
        [Lg('Reibkraft als feste Größe','Friction as a fixed value'),Lg('μ · F_{N} ist nur der Höchstwert. Im Ruhezustand ist die Reibkraft oft kleiner.','μ · F_{N} is only the maximum. At rest the friction force is often smaller.')]
      ])}
      ${MTRAIN()}
    </section>`;
}

/* =============== 5  STATIK: LAGERKRÄFTE =============== */
function learnSt(){
  const F1=300,l1=2,l2=1.5,F2=F1*l1/l2;
  const l=4,F=8,a=1,FBb=F*a/l,FAa=F-FBb;
  const L3=5,Fa=6,a1=1,Fb=4,a2=3,FB3=(Fa*a1+Fb*a2)/L3,FA3=Fa+Fb-FB3;
  const L4=5,Fs=10,al=30,a4=2,Fx=Fs*C(al),Fy=Fs*Sn(al),FB4=Fy*a4/L4,FAy=Fy-FB4,FAx=Fx,FA4=Math.hypot(FAx,FAy);
  const GG=400,aa=0.5,ll=1.25,FH=GG*aa/ll;
  return `
    <section class="sec">
      <h2>${Lg('Hebelgesetz','Law of levers')}</h2>
      <p>${Lg('Ein Hebel ist im Gleichgewicht, wenn die Momente um den Drehpunkt gleich groß sind: Kraft mal Hebelarm links gleich Kraft mal Hebelarm rechts.','A lever is in equilibrium if the moments about the pivot are equal: force times lever arm on the left equals force times lever arm on the right.')}</p>
      ${FORM('F_{1} · l_{1} = F_{2} · l_{2}')}
      ${MF(mf.seesaw([{x:-l1,lab:'F_{1}'},{x:l2,lab:'F_{2}'}],{sc:36,dims:[[-l1,0,'l_{1}'],[0,l2,'l_{2}']]}),Lg('Wippe um den Drehpunkt A.','Seesaw about pivot A.'))}
      ${MS([[`ΣM_{A} = 0:  F_{1} · l_{1} ${M} F_{2} · l_{2} = 0`,'',Lg('F1 dreht links herum, F2 rechts herum.','F1 turns anticlockwise, F2 clockwise.')],[`F_{2} = F_{1} · l_{1} / l_{2} = ${F1} N · ${fmt(l1)} m / ${fmt(l2)} m`],[`F_{2} = ${fmt(F2)} N`,'',Lg('Der kürzere Hebelarm braucht die größere Kraft.','The shorter lever arm needs the larger force.')]])}
    </section>
    <section class="sec">
      <h2>${Lg('Träger mit einer Last','Beam with one load')}</h2>
      <p>${Lg('Ein Träger liegt auf einem Festlager A und einem Loslager B. Zwei Gleichungen reichen für die zwei Lagerkräfte: Momente um A, dann Kräfte senkrecht.','A beam rests on a pin support A and a roller support B. Two equations are enough for the two support forces: moments about A, then forces vertically.')}</p>
      ${MF(mf.beamSup({l,A:'pin',B:'roller',loads:[{x:a,lab:'F'}],dims:[[0,a,'a',0],[0,l,'l',1]],names:{A:'A',B:'B'}}),Lg('Last F im Abstand a von A, Länge l.','Load F at distance a from A, length l.'))}
      ${KV([['ΣM_{A} = 0','F_{B} · l ' + M + ' F · a = 0'],['F_{B}','= F · a / l'],['ΣF_{y} = 0','F_{A} + F_{B} ' + M + ' F = 0'],['F_{A}','= F ' + M + ' F_{B}']],'wide')}
      ${MS([[`F_{B} = F · a / l = ${F} kN · ${a} m / ${l} m = ${fmt(FBb)} kN`,'',Lg('Die Lagerkraft B ist klein, weil die Last nahe bei A liegt.','Support force B is small because the load is close to A.')],[`F_{A} = F ${M} F_{B} = ${F} ${M} ${fmt(FBb)} = ${fmt(FAa)} kN`]])}
      <p class="fine">${Lg('Kontrolle: F_{A} + F_{B} muss die Last ergeben.','Check: F_{A} + F_{B} must add up to the load.')}</p>
    </section>
    <section class="sec">
      <h2>${Lg('Mehrere Lasten','Several loads')}</h2>
      ${MF(mf.beamSup({l:L3,A:'pin',B:'roller',loads:[{x:a1,lab:'F_{1}'},{x:a2,lab:'F_{2}'}],dims:[[0,a1,'a_{1}',0],[0,a2,'a_{2}',1],[0,L3,'l',2]],names:{A:'A',B:'B'}}),Lg('Zwei Lasten, alle Abstände von A gemessen.','Two loads, all distances measured from A.'))}
      ${FORM('F_{B} = (F_{1} · a_{1} + F_{2} · a_{2}) / l')}
      ${MS([[`F_{B} = (${Fa} · ${a1} + ${Fb} · ${a2}) kN · m / ${L3} m = ${fmt(Fa*a1+Fb*a2)} / ${L3} kN`],[`F_{B} = ${fmt(FB3)} kN`],[`F_{A} = F_{1} + F_{2} ${M} F_{B} = ${Fa + Fb} ${M} ${fmt(FB3)} = ${fmt(FA3)} kN`]])}
      <p class="fine">${Lg('Hat der Träger ein Eigengewicht, wirkt es als zusätzliche Last in der Balkenmitte (Abstand l / 2 von A).','If the beam has its own weight, it acts as an extra load at the middle of the beam (distance l / 2 from A).')}</p>
    </section>
    <section class="sec">
      <h2>${Lg('Schräge Kraft','Inclined force')}</h2>
      <p>${Lg('Eine schräge Kraft zerlegst du zuerst. Der senkrechte Anteil F_{y} belastet den Träger wie eine normale Last. Der waagerechte Anteil F_{x} muss vom Festlager aufgenommen werden. Das Loslager nimmt keine waagerechte Kraft auf.','First resolve an inclined force. The vertical part F_{y} loads the beam like a normal load. The horizontal part F_{x} has to be taken by the pin support. The roller support takes no horizontal force.')}</p>
      ${MF(mf.beamSup({l:L4,A:'pin',B:'roller',loads:[{x:a4,lab:'F',ang:al}],dims:[[0,a4,'a',0],[0,L4,'l',1]],names:{A:'A',B:'B'}}),Lg('Die Kraft F wirkt unter α gegen den Träger.','The force F acts at α to the beam.'))}
      ${MS([[`F_{x} = F · cos α = ${Fs} kN · cos ${al}° = ${n2(Fx)} kN`,'',Lg('Waagerechter Anteil: geht ins Festlager A.','Horizontal part: goes into pin support A.')],[`F_{y} = F · sin α = ${Fs} kN · sin ${al}° = ${fmt(Fy)} kN`],[`F_{B} = F_{y} · a / l = ${fmt(Fy)} · ${a4} / ${L4} = ${fmt(FB4)} kN`],[`F_{Ay} = F_{y} ${M} F_{B} = ${fmt(FAy)} kN,  F_{Ax} = F_{x} = ${n2(FAx)} kN`],[`F_{A} = √(F_{Ax}² + F_{Ay}²) = ${n2(FA4)} kN`,'',Lg('Die Gesamtkraft im Festlager.','The total force in the pin support.')]],false)}
    </section>
    <section class="sec">
      <h2>${Lg('Aus der Werkstatt','From the workshop')}</h2>
      <div class="mist">
        <p><b>${Lg('Schubkarre','Wheelbarrow')}</b><span>${Lg('Drehpunkt ist die Radachse. Die Last mit dem Abstand a gegen die Handkraft F mit dem Abstand l: F · l = F_{G} · a.','The pivot is the wheel axle. The load at distance a against the hand force F at distance l: F · l = F_{G} · a.')}</span></p>
      </div>
      ${MS([[`F = F_{G} · a / l = ${GG} N · ${fmt(aa)} m / ${fmt(ll)} m = ${fmt(FH)} N`,'',Lg(`Die Hand trägt nur einen Teil von ${GG} N. Das Rad trägt den Rest.`,`The hand only carries part of ${GG} N. The wheel carries the rest.`)],[`F_{A} = F_{G} ${M} F = ${fmt(GG-FH)} N`]],false)}
      <div class="mist">
        <p><b>${Lg('Wandausleger','Wall bracket')}</b><span>${Lg('Last im Abstand a von der Wand, Seil unter dem Winkel α. Momente um das Wandlager A: F_{S} · sin α · l = F_{G} · a.','Load at distance a from the wall, rope at angle α. Moments about wall support A: F_{S} · sin α · l = F_{G} · a.')}</span></p>
        <p><b>${Lg('Welle auf zwei Lagern','Shaft on two bearings')}</b><span>${Lg('Wie der Träger mit einer Last: F_{B} = F · a / l und F_{A} = F ' + M + ' F_{B}.','Like the beam with one load: F_{B} = F · a / l and F_{A} = F ' + M + ' F_{B}.')}</span></p>
        <p><b>${Lg('Gabelstapler','Forklift')}</b><span>${Lg('Kippgrenze: Das Moment der Last um die Vorderachse gleicht das Moment des Gegengewichts aus: F_{G} · a = F_{GG} · b.','Tipping limit: the moment of the load about the front axle balances the moment of the counterweight: F_{G} · a = F_{GG} · b.')}</span></p>
      </div>
    </section>
    <section class="sec">
      <h2>${Lg('Typische Fehler','Common mistakes')}</h2>
      ${MIST([
        [Lg('Falscher Drehpunkt','Wrong pivot'),Lg('Wähle den Punkt, an dem die meisten unbekannten Kräfte angreifen, z. B. das Festlager A. Dort fallen sie aus der Momentengleichung heraus.','Choose the point where most unknown forces act, e.g. pin support A. They drop out of the moment equation there.')],
        [Lg('Abstand vom falschen Punkt','Distance from the wrong point'),Lg('Alle Abstände a werden vom gewählten Drehpunkt aus gemessen.','All distances a are measured from the chosen pivot.')],
        [Lg('Schräge Kraft nicht zerlegt','Inclined force not resolved'),Lg('Für das Moment zählt nur der senkrechte Anteil F_{y}.','Only the vertical part F_{y} counts for the moment.')],
        [Lg('Keine Kontrolle','No check'),Lg('Prüfe am Schluss: F_{A} + F_{B} = Summe der Lasten.','Check at the end: F_{A} + F_{B} = sum of the loads.')]
      ])}
      ${MTRAIN()}
    </section>`;
}

/* Beschriftungen mit tiefgestelltem Index (_{x}) in freiem Text umwandeln */
const mlearn=f=>()=>f().replace(/_\{([^}]*)\}/g,'<sub>$1</sub>');
const MLEARN={kg:mlearn(learnKg),zr:mlearn(learnZr),km:mlearn(learnKm),fm:mlearn(learnFm),st:mlearn(learnSt)};
