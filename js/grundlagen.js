/* SA-Ready · Grundlagen
   Erklärseiten pro Thema. Braucht die Hilfsfunktionen aus app.js (mk, SR, KV, stepsHTML …). */
'use strict';
const EX=[
 {eq:'3x + 4 = 19',op:`${M} 4`,note:'Die +4 stört. Gegenoperation von Plus ist Minus: Rechne auf beiden Seiten 4 ab.'},
 {eq:'3x = 15',op:': 3',note:'Jetzt steht 3 mal x da. Gegenoperation von Mal ist Geteilt: Teile beide Seiten durch 3.'},
 {eq:'x = 5',op:'',note:'Probe: 3 · 5 + 4 = 19 ✓'}
];
const TRAIN_BTN='<button class="btn" data-act="tab" data-tab="train">Zum Training</button>';
function learnGl(){
  const fin=S.ex>=EX.length;
  return `
    <section class="sec">
      <h2>Die Waage-Regel</h2>
      <p>Eine Gleichung ist eine Waage. Was du auf der einen Seite machst, machst du auf der anderen Seite auch. Dann bleibt sie im Gleichgewicht. Hinter dem Strich steht, was du auf beiden Seiten rechnest.</p>
      ${stepsHTML(EX.slice(0,S.ex),eqX,fin)}
      <div class="actions">
        <button class="btn grow" data-act="ex-next" ${fin?'disabled':''}>Nächster Schritt</button>
        <button class="btn ghost" data-act="ex-reset">Von vorn</button>
      </div>
    </section>
    <section class="sec">
      <h2>Gegenoperationen</h2>
      <p>Um etwas wegzuräumen, rechnest du das Gegenteil. Immer auf beiden Seiten.</p>
      ${KV([['+ a','→',`${M} a`],[`${M} a`,'→','+ a'],['· a','→',': a'],[': a','→','· a'],['x^{2}','→','√'],['√x','→','^{2}']])}
    </section>
    <section class="sec">
      <h2>Die Reihenfolge</h2>
      <p>Räume von außen nach innen auf. Das ist Punkt-vor-Strich rückwärts.</p>
      <ol class="order">
        <li>Klammer? Ausmultiplizieren oder durch die Zahl vor der Klammer teilen.</li>
        <li>x auf beiden Seiten? Zieh das kleinere x-Glied auf beiden Seiten ab.</li>
        <li>Zahlen ohne x per Plus oder Minus wegräumen.</li>
        <li>Zuletzt durch die Zahl vor dem x teilen.</li>
      </ol>
      ${SR([['5x + 3 = 2x + 9',`${M} 2x`,'x steht auf beiden Seiten. Zieh das kleinere x-Glied auf beiden Seiten ab.'],['3x + 3 = 9',`${M} 3`,'Jetzt die Zahl ohne x wegräumen.'],['3x = 6',': 3'],['x = 2','','Probe: 5 · 2 + 3 = 2 · 2 + 9, also 13 = 13 ✓']],eqX)}
    </section>
    <section class="sec">
      <h2>Formeln umstellen</h2>
      <p>Gleiche Regeln, nur mit Buchstaben. Du räumst alles weg, was neben dem gesuchten Buchstaben steht.</p>
      <h3 class="sub">Vorschubgeschwindigkeit nach n</h3>
      ${SR([['vf = f · n',': f','Gesucht ist n. Rechts steht f mal n, also beide Seiten durch f teilen.'],['vf / f = n','','Seiten tauschen, damit n links steht.'],['n = vf / f']],s=>eqF(s,'n'))}
      <h3 class="sub">Kreisfläche nach d (schwer)</h3>
      ${SR([['A = π · d^{2} / 4','· 4','Zuerst den Bruch loswerden.'],['4 · A = π · d^{2}',': π'],['4 · A / π = d^{2}','√','Die Wurzel hebt das Quadrat auf. Sie gilt für die ganze Seite.'],['d = √(4 · A / π)']],s=>eqF(s,'d'))}
    </section>
    <section class="sec">
      <h2>Typische Fehler</h2>
      <div class="mist">
        <p><b>Nur eine Seite verändert</b><span>Jede Rechnung gilt für beide Seiten. Sonst kippt die Waage.</span></p>
        <p><b>Vorzeichen verloren</b><span>Bei ${M}3x = ${M}12 teilst du durch ${M}3. Minus durch Minus ergibt Plus.</span></p>
        <p><b>Minus vor der Klammer</b><span>${M}2(x ${M} 3) = ${M}2x + 6. Beide Zeichen in der Klammer drehen sich um.</span></p>
        <p><b>Klammer vergessen</b><span>Wer durch π · d teilt, braucht die Klammer. Ohne sie wird nur durch π geteilt und d malgenommen.</span></p>
        <p><b>Probe vergessen</b><span>Setze dein Ergebnis in die erste Gleichung ein. Stimmen beide Seiten, ist es richtig.</span></p>
      </div>
      ${TRAIN_BTN}
    </section>`;
}
function learnPot(){
  return `
    <section class="sec">
      <h2>Was ist eine Potenz?</h2>
      <p>Eine Potenz ist eine Kurzschreibweise für Malnehmen mit derselben Zahl. Die große Zahl heißt Basis, die kleine Zahl oben heißt Exponent.</p>
      ${SR([['2^{4} = 2 · 2 · 2 · 2','','Basis 2, Exponent 4: Die 2 wird viermal malgenommen.'],['= 16']])}
    </section>
    <section class="sec">
      <h2>Sonderfälle</h2>
      ${KV([['a^{1}','= a'],['a^{0}','= 1'],[`a^{${M}n}`,'= 1 / a^{n}'],[`10^{${M}3}`,'= 0,001'],[`(${M}2)^{2}`,'= 4'],[`${M}2^{2}`,`= ${M}4`]])}
      <p class="fine">Mit Klammer wird das Minus mitpotenziert. Ohne Klammer gehört der Exponent nur zur Zahl.</p>
    </section>
    <section class="sec">
      <h2>Potenzgesetze</h2>
      <p>Diese Regeln gelten nur bei gleicher Basis.</p>
      ${KV([['a^{m} · a^{n}',`= a^{m + n}`],['a^{m} : a^{n}',`= a^{m ${M} n}`],['(a^{m})^{n}','= a^{m · n}'],['a^{n} · b^{n}','= (a · b)^{n}']],'wide')}
      ${SR([['a^{3} · a^{4} = a^{3 + 4}','','Malnehmen: Exponenten addieren.'],['= a^{7}']])}
      ${SR([[`a^{2} : a^{5} = a^{2 ${M} 5}`,'','Teilen: Exponenten abziehen. Negativ ist erlaubt.'],[`= a^{${M}3}`]])}
    </section>
    <section class="sec">
      <h2>Zehnerpotenzen</h2>
      <p>Bei 10er-Potenzen zählt der Exponent die Stellen, um die das Komma wandert. In der Normform steht vor dem Komma genau eine Ziffer von 1 bis 9.</p>
      ${KV([['10^{3}','= 1000'],['10^{1}','= 10'],['10^{0}','= 1'],[`10^{${M}1}`,'= 0,1'],[`10^{${M}3}`,'= 0,001'],[`10^{${M}6}`,'= 0,000001']])}
      ${SR([['45 000 = 4,5 · 10^{4}','','Komma 4 Stellen nach links: Exponent +4.'],[`0,0032 = 3,2 · 10^{${M}3}`,'','Komma 3 Stellen nach rechts: Exponent '+M+'3.']],mkQ,false)}
    </section>
    <section class="sec">
      <h2>Rechnen mit Zehnerpotenzen</h2>
      ${SR([['(3 · 10^{4}) · (2 · 10^{3}) = (3 · 2) · 10^{4 + 3}','','Zahlen malnehmen, Exponenten addieren.'],['= 6 · 10^{7}']])}
      ${SR([[`(8 · 10^{6}) : (2 · 10^{2}) = (8 : 2) · 10^{6 ${M} 2}`,'','Zahlen teilen, Exponenten abziehen.'],['= 4 · 10^{4}']])}
      ${SR([[`(5 · 10^{3}) · (4 · 10^{${M}5}) = 20 · 10^{${M}2}`,'','20 ist keine Normform.'],[`= 2 · 10^{${M}1}`,'','Komma eine Stelle nach links, Exponent um 1 größer.']])}
    </section>
    <section class="sec">
      <h2>Vorsilben bei Einheiten</h2>
      ${KV([['G Giga','10^{9}'],['M Mega','10^{6}'],['k Kilo','10^{3}'],['h Hekto','10^{2}'],['d Dezi',`10^{${M}1}`],['c Zenti',`10^{${M}2}`],['m Milli',`10^{${M}3}`],['µ Mikro',`10^{${M}6}`],['n Nano',`10^{${M}9}`]])}
      ${SR([['4,7 kΩ = 4,7 · 10^{3} Ω','','k bedeutet 10^{3}.'],['= 4700 Ω']])}
    </section>
    <section class="sec">
      <h2>Typische Fehler</h2>
      <div class="mist">
        <p><b>${mk(`${M}2^{2} und (${M}2)^{2} verwechselt`)}</b><span>${mk(`${M}2^{2} = ${M}4, aber (${M}2)^{2} = 4.`)}</span></p>
        <p><b>Exponenten malgenommen statt addiert</b><span>${mk('a^{3} · a^{4} ist a^{7}, nicht a^{12}.')}</span></p>
        <p><b>Normform vergessen</b><span>${mk('20 · 10^{3} stimmt, ist aber keine Normform. Richtig: 2 · 10^{4}.')}</span></p>
        <p><b>Taschenrechner</b><span>Zehnerpotenzen mit der Taste EXP oder ×10ˣ eingeben: 4,5 EXP 4 für 4,5 · 10⁴.</span></p>
      </div>
      ${TRAIN_BTN}
    </section>`;
}
function learnEin(){
  return `
    <section class="sec">
      <h2>Das Grundprinzip</h2>
      <p>Große Einheit in kleine: mal. Kleine Einheit in große: geteilt. Prüfe am Ende: Wird die Einheit kleiner, muss die Zahl größer werden.</p>
      ${SR([['1 m = 1000 mm','','Zuerst die Umrechnungszahl.'],['2,5 m = 2,5 · 1000 mm','','Meter ist größer als Millimeter: mal.'],['= 2500 mm']])}
    </section>
    <section class="sec">
      <h2>Längen</h2>
      ${KV([['1 km','= 1000 m'],['1 m','= 10 dm'],['1 dm','= 10 cm'],['1 cm','= 10 mm'],['1 m','= 1000 mm'],['1 mm','= 1000 µm']])}
      <p class="fine">In der Fertigung rechnest du fast immer in mm. Toleranzen stehen oft in µm: 0,01 mm = 10 µm.</p>
    </section>
    <section class="sec">
      <h2>Flächen und Volumen</h2>
      <p>Bei Flächen ist der Faktor pro Stufe 100 (10 · 10), bei Volumen 1000 (10 · 10 · 10).</p>
      ${KV([['1 cm²','= 100 mm²'],['1 dm²','= 100 cm²'],['1 m²','= 1 000 000 mm²'],['1 cm³','= 1000 mm³'],['1 dm³','= 1 l'],['1 cm³','= 1 ml'],['1 m³','= 1000 l'],['1 l','= 1000 ml']])}
      ${SR([['1 cm² = 100 mm²','','Fläche: Faktor 100.'],['3,5 cm² = 3,5 · 100 mm²'],['= 350 mm²']])}
    </section>
    <section class="sec">
      <h2>Zeit und Geschwindigkeit</h2>
      ${KV([['1 h','= 60 min'],['1 min','= 60 s'],['1 h','= 3600 s'],['1 m/s','= 60 m/min'],['1 m/s','= 3,6 km/h'],['1 m/s','= 60 000 mm/min']])}
      ${SR([['15 min = 15 : 60 h = 0,25 h','','Minuten in Stunden: durch 60.'],['2 h 15 min = 2,25 h','','Nicht 2,15 h. Die Zeit hat Faktor 60, nicht 100.']])}
    </section>
    <section class="sec">
      <h2>Kraft, Masse und Druck</h2>
      ${KV([['1 kN','= 1000 N'],['1 t','= 1000 kg'],['1 kg','= 1000 g'],['1 bar','= 100 000 Pa'],['1 bar','= 10 N/cm²'],['1 N/mm²','= 1 MPa'],['1 N/mm²','= 10 bar'],['1 bar','= 0,1 N/mm²']])}
    </section>
    <section class="sec">
      <h2>Zoll</h2>
      ${KV([['1 Zoll','= 25,4 mm'],['1/2 Zoll','= 12,7 mm'],['1/4 Zoll','= 6,35 mm'],['3/8 Zoll','= 9,525 mm']])}
      ${SR([['3/8 Zoll = 3/8 · 25,4 mm','','Bruch als Kommazahl: 3 : 8 = 0,375.'],['= 0,375 · 25,4 mm = 9,525 mm']])}
    </section>
    <section class="sec">
      <h2>Typische Fehler</h2>
      <div class="mist">
        <p><b>Faktor 10 bei Flächen</b><span>1 cm² sind 100 mm², nicht 10 mm².</span></p>
        <p><b>Zeit mit 100 gerechnet</b><span>1,5 h sind 90 min, nicht 150 min.</span></p>
        <p><b>m/s und km/h verwechselt</b><span>Von km/h zu m/s teilst du durch 3,6.</span></p>
        <p><b>Ergebnis nicht geprüft</b><span>Frag dich: Muss die Zahl größer oder kleiner werden?</span></p>
      </div>
      ${TRAIN_BTN}
    </section>`;
}
function learnWin(){
  const t={lay:0,nm:{P:'A',Q:'B',R:'C'}};
  return `
    <section class="sec">
      <h2>Das rechtwinklige Dreieck</h2>
      <div class="fig">${triSVG(t,{'α':'target'})}</div>
      <p>Die Hypotenuse liegt gegenüber vom rechten Winkel und ist die längste Seite. Die zwei anderen Seiten heißen Katheten. Ob eine Kathete Gegen- oder Ankathete ist, hängt vom Winkel ab, von dem aus du schaust.</p>
      ${KV([['Hypotenuse','c'],['Gegenkathete von α','a'],['Ankathete von α','b'],['Gegenkathete von β','b'],['Ankathete von β','a'],['α + β','= 90°']])}
    </section>
    <section class="sec">
      <h2>Sinus, Kosinus, Tangens</h2>
      ${KV([['sin α','= Gegenkathete / Hypotenuse'],['cos α','= Ankathete / Hypotenuse'],['tan α','= Gegenkathete / Ankathete']],'wide')}
      <div class="memo"><b>Merksatz: GAGA HHAG</b><span class="mono">G A G A<br>H H A G</span><span class="fine">Spaltenweise lesen: G/H ist Sinus, A/H ist Kosinus, G/A ist Tangens.</span></div>
    </section>
    <section class="sec">
      <h2>Seite berechnen</h2>
      <p>Gegeben: c = 80 mm und α = 35°. Gesucht: a.</p>
      ${SR([['sin α = a / c','· c','a ist die Gegenkathete, c die Hypotenuse: Sinus.'],['a = c · sin α'],['a = 80 · sin 35° ≈ 45,89 mm']])}
      <p>Steht die gesuchte Seite unten im Bruch, brauchst du einen Schritt mehr. Gegeben: a = 30 mm und α = 40°. Gesucht: c.</p>
      ${SR([['sin α = a / c','· c'],['c · sin α = a',': sin α'],['c = a / sin α'],['c = 30 / sin 40° ≈ 46,67 mm']])}
    </section>
    <section class="sec">
      <h2>Winkel berechnen</h2>
      <p>Gegeben: a = 30 mm und c = 50 mm. Gesucht: α.</p>
      ${SR([['sin α = 30 / 50 = 0,6'],[`α = sin^{${M}1}(0,6)`,'','Am Taschenrechner: SHIFT, dann sin.'],['α ≈ 36,87°'],[`β = 90° ${M} 36,87° = 53,13°`,'','Die zwei spitzen Winkel ergeben zusammen 90°.']])}
    </section>
    <section class="sec">
      <h2>In der Werkstatt</h2>
      <h3 class="sub">Sinuslineal</h3>
      ${SR([['h = L · sin α','','L ist der Rollenabstand (Hypotenuse), h die Höhe der Endmaße.'],['h = 100 · sin 15° ≈ 25,882 mm']])}
      <h3 class="sub">Kegeldrehen</h3>
      ${SR([[`tan(α/2) = (D ${M} d) / (2 · L)`,'','Der Oberschlitten wird auf den halben Kegelwinkel gestellt.'],[`tan(α/2) = (40 ${M} 30) / (2 · 50) = 0,1`],[`α/2 = tan^{${M}1}(0,1) ≈ 5,71°`]])}
      <h3 class="sub">Lochkreis</h3>
      ${KV([['X','= r · cos φ'],['Y','= r · sin φ']])}
    </section>
    <section class="sec">
      <h2>Typische Fehler</h2>
      <div class="mist">
        <p><b>Taschenrechner nicht auf DEG</b><span>In der Anzeige muss D oder DEG stehen. Bei RAD oder GRAD kommt Unsinn heraus.</span></p>
        <p><b>Vom falschen Winkel aus geschaut</b><span>Gegenkathete von α ist Ankathete von β.</span></p>
        <p><b>Hypotenuse als Kathete genommen</b><span>Die Hypotenuse ist nie Gegen- oder Ankathete.</span></p>
        <p><b>Halben Kegelwinkel vergessen</b><span>Die Formel liefert α/2, nicht den ganzen Kegelwinkel.</span></p>
      </div>
      ${TRAIN_BTN}
    </section>`;
}
