/* SA-Ready · Basics (English)
   English version of the explanation pages. The German pages are in grundlagen.js. */
'use strict';
const EX_EN=[
 {eq:'3x + 4 = 19',op:`${M} 4`,note:'The +4 is in the way. The inverse of plus is minus: subtract 4 from both sides.'},
 {eq:'3x = 15',op:': 3',note:'Now you have 3 times x. The inverse of times is divided by: divide both sides by 3.'},
 {eq:'x = 5',op:'',note:'Check: 3 · 5 + 4 = 19 ✓'}
];
const TRAIN_BTN_EN='<button class="btn" data-act="tab" data-tab="train">Go to training</button>';
function learnGlEn(){
  const fin=S.ex>=EX_EN.length;
  return `
    <section class="sec">
      <h2>The balance rule</h2>
      <p>An equation is a balance. Whatever you do on one side, you do on the other side too. Then it stays balanced. Behind the line you see what you do to both sides.</p>
      ${stepsHTML(EX_EN.slice(0,S.ex),eqX,fin)}
      <div class="actions">
        <button class="btn grow" data-act="ex-next" ${fin?'disabled':''}>Next step</button>
        <button class="btn ghost" data-act="ex-reset">Start over</button>
      </div>
    </section>
    <section class="sec">
      <h2>Inverse operations</h2>
      <p>To get rid of something, you do the opposite. Always on both sides.</p>
      ${KV([['+ a','→',`${M} a`],[`${M} a`,'→','+ a'],['· a','→',': a'],[': a','→','· a'],['x^{2}','→','√'],['√x','→','^{2}']])}
    </section>
    <section class="sec">
      <h2>The order</h2>
      <p>Clear things away from the outside in. That is the order of operations (multiplication before addition) in reverse.</p>
      <ol class="order">
        <li>Bracket? Multiply it out or divide by the number in front of the bracket.</li>
        <li>x on both sides? Subtract the smaller x term from both sides.</li>
        <li>Get rid of numbers without x with plus or minus.</li>
        <li>Finally divide by the number in front of x.</li>
      </ol>
      ${SR([['5x + 3 = 2x + 9',`${M} 2x`,'x is on both sides. Subtract the smaller x term from both sides.'],['3x + 3 = 9',`${M} 3`,'Now get rid of the number without x.'],['3x = 6',': 3'],['x = 2','','Check: 5 · 2 + 3 = 2 · 2 + 9, so 13 = 13 ✓']],eqX)}
    </section>
    <section class="sec">
      <h2>Rearranging formulas</h2>
      <p>Same rules, just with letters. You clear away everything that is next to the letter you want.</p>
      <h3 class="sub">Feed rate for n</h3>
      ${SR([['vf = f · n',': f','The unknown is n. On the right you have f times n, so divide both sides by f.'],['vf / f = n','','Swap the sides so that n is on the left.'],['n = vf / f']],s=>eqF(s,'n'))}
      <h3 class="sub">Area of a circle for d (hard)</h3>
      ${SR([['A = π · d^{2} / 4','· 4','First get rid of the fraction.'],['4 · A = π · d^{2}',': π'],['4 · A / π = d^{2}','√','The square root cancels the square. It applies to the whole side.'],['d = √(4 · A / π)']],s=>eqF(s,'d'))}
    </section>
    <section class="sec">
      <h2>Common mistakes</h2>
      <div class="mist">
        <p><b>Changed only one side</b><span>Every operation applies to both sides. Otherwise the balance tips.</span></p>
        <p><b>Lost a sign</b><span>With ${M}3x = ${M}12 you divide by ${M}3. Minus divided by minus gives plus.</span></p>
        <p><b>Minus in front of a bracket</b><span>${M}2(x ${M} 3) = ${M}2x + 6. Both signs inside the bracket flip.</span></p>
        <p><b>Forgot the bracket</b><span>If you divide by π · d, you need the bracket. Without it you only divide by π and multiply by d.</span></p>
        <p><b>Forgot the check</b><span>Put your result into the first equation. If both sides match, it is correct.</span></p>
      </div>
      ${TRAIN_BTN_EN}
    </section>`;
}
function learnPotEn(){
  return `
    <section class="sec">
      <h2>What is a power?</h2>
      <p>A power is a short way to write multiplying the same number several times. The big number is called the base, the small number at the top is the exponent.</p>
      ${SR([['2^{4} = 2 · 2 · 2 · 2','','Base 2, exponent 4: the 2 appears four times as a factor.'],['= 16']])}
    </section>
    <section class="sec">
      <h2>Special cases</h2>
      ${KV([['a^{1}','= a'],['a^{0}','= 1'],[`a^{${M}n}`,'= 1 / a^{n}'],[`10^{${M}3}`,'= 0.001'],[`(${M}2)^{2}`,'= 4'],[`${M}2^{2}`,`= ${M}4`]])}
      <p class="fine">With a bracket the minus is raised to the power too. Without a bracket the exponent belongs only to the number.</p>
    </section>
    <section class="sec">
      <h2>Power laws</h2>
      <p>These rules only apply to the same base.</p>
      ${KV([['a^{m} · a^{n}',`= a^{m + n}`],['a^{m} : a^{n}',`= a^{m ${M} n}`],['(a^{m})^{n}','= a^{m · n}'],['a^{n} · b^{n}','= (a · b)^{n}']],'wide')}
      ${SR([['a^{3} · a^{4} = a^{3 + 4}','','Multiply: add the exponents.'],['= a^{7}']])}
      ${SR([[`a^{2} : a^{5} = a^{2 ${M} 5}`,'','Divide: subtract the exponents. Negative is allowed.'],[`= a^{${M}3}`]])}
    </section>
    <section class="sec">
      <h2>Powers of ten</h2>
      <p>With powers of 10 the exponent counts the places the decimal point moves. In standard form there is exactly one digit from 1 to 9 in front of the decimal point.</p>
      ${KV([['10^{3}','= 1000'],['10^{1}','= 10'],['10^{0}','= 1'],[`10^{${M}1}`,'= 0.1'],[`10^{${M}3}`,'= 0.001'],[`10^{${M}6}`,'= 0.000001']])}
      ${SR([['45,000 = 4.5 · 10^{4}','','Decimal point 4 places to the left: exponent +4.'],[`0.0032 = 3.2 · 10^{${M}3}`,'','Decimal point 3 places to the right: exponent '+M+'3.']],mkQ,false)}
    </section>
    <section class="sec">
      <h2>Calculating with powers of ten</h2>
      ${SR([['(3 · 10^{4}) · (2 · 10^{3}) = (3 · 2) · 10^{4 + 3}','','Multiply the numbers, add the exponents.'],['= 6 · 10^{7}']])}
      ${SR([[`(8 · 10^{6}) : (2 · 10^{2}) = (8 : 2) · 10^{6 ${M} 2}`,'','Divide the numbers, subtract the exponents.'],['= 4 · 10^{4}']])}
      ${SR([[`(5 · 10^{3}) · (4 · 10^{${M}5}) = 20 · 10^{${M}2}`,'','20 is not in standard form.'],[`= 2 · 10^{${M}1}`,'','Decimal point one place to the left, exponent one higher.']])}
    </section>
    <section class="sec">
      <h2>Prefixes for units</h2>
      ${KV([['G Giga','10^{9}'],['M Mega','10^{6}'],['k Kilo','10^{3}'],['h Hecto','10^{2}'],['d Deci',`10^{${M}1}`],['c Centi',`10^{${M}2}`],['m Milli',`10^{${M}3}`],['µ Micro',`10^{${M}6}`],['n Nano',`10^{${M}9}`]])}
      ${SR([['4.7 kΩ = 4.7 · 10^{3} Ω','','k means 10^{3}.'],['= 4700 Ω']])}
    </section>
    <section class="sec">
      <h2>Common mistakes</h2>
      <div class="mist">
        <p><b>${mk(`Mixed up ${M}2^{2} and (${M}2)^{2}`)}</b><span>${mk(`${M}2^{2} = ${M}4, but (${M}2)^{2} = 4.`)}</span></p>
        <p><b>Multiplied the exponents instead of adding</b><span>${mk('a^{3} · a^{4} is a^{7}, not a^{12}.')}</span></p>
        <p><b>Forgot standard form</b><span>${mk('20 · 10^{3} is correct, but not in standard form. Better: 2 · 10^{4}.')}</span></p>
        <p><b>Calculator</b><span>Enter powers of ten with the EXP or ×10ˣ key: 4.5 EXP 4 for 4.5 · 10⁴.</span></p>
      </div>
      ${TRAIN_BTN_EN}
    </section>`;
}
function learnEinEn(){
  return `
    <section class="sec">
      <h2>The basic principle</h2>
      <p>Large unit to small unit: times. Small unit to large unit: divided by. Check at the end: if the unit gets smaller, the number must get bigger.</p>
      ${SR([['1 m = 1000 mm','','First the conversion factor.'],['2.5 m = 2.5 · 1000 mm','','A metre is bigger than a millimetre: times.'],['= 2500 mm']])}
    </section>
    <section class="sec">
      <h2>Lengths</h2>
      ${KV([['1 km','= 1000 m'],['1 m','= 10 dm'],['1 dm','= 10 cm'],['1 cm','= 10 mm'],['1 m','= 1000 mm'],['1 mm','= 1000 µm']])}
      <p class="fine">In manufacturing you almost always calculate in mm. Tolerances are often given in µm: 0.01 mm = 10 µm.</p>
    </section>
    <section class="sec">
      <h2>Areas and volumes</h2>
      <p>For areas the factor per step is 100 (10 · 10), for volumes 1000 (10 · 10 · 10).</p>
      ${KV([['1 cm²','= 100 mm²'],['1 dm²','= 100 cm²'],['1 m²','= 1,000,000 mm²'],['1 cm³','= 1000 mm³'],['1 dm³','= 1 l'],['1 cm³','= 1 ml'],['1 m³','= 1000 l'],['1 l','= 1000 ml']])}
      ${SR([['1 cm² = 100 mm²','','Area: factor 100.'],['3.5 cm² = 3.5 · 100 mm²'],['= 350 mm²']])}
    </section>
    <section class="sec">
      <h2>Time and speed</h2>
      ${KV([['1 h','= 60 min'],['1 min','= 60 s'],['1 h','= 3600 s'],['1 m/s','= 60 m/min'],['1 m/s','= 3.6 km/h'],['1 m/s','= 60,000 mm/min']])}
      ${SR([['15 min = 15 : 60 h = 0.25 h','','Minutes to hours: divide by 60.'],['2 h 15 min = 2.25 h','','Not 2.15 h. Time has a factor of 60, not 100.']])}
    </section>
    <section class="sec">
      <h2>Force, mass and pressure</h2>
      ${KV([['1 kN','= 1000 N'],['1 t','= 1000 kg'],['1 kg','= 1000 g'],['1 bar','= 100,000 Pa'],['1 bar','= 10 N/cm²'],['1 N/mm²','= 1 MPa'],['1 N/mm²','= 10 bar'],['1 bar','= 0.1 N/mm²']])}
    </section>
    <section class="sec">
      <h2>Inches</h2>
      ${KV([['1 inch','= 25.4 mm'],['1/2 inch','= 12.7 mm'],['1/4 inch','= 6.35 mm'],['3/8 inch','= 9.525 mm']])}
      ${SR([['3/8 inch = 3/8 · 25.4 mm','','Fraction as a decimal: 3 : 8 = 0.375.'],['= 0.375 · 25.4 mm = 9.525 mm']])}
    </section>
    <section class="sec">
      <h2>Common mistakes</h2>
      <div class="mist">
        <p><b>Factor 10 for areas</b><span>1 cm² is 100 mm², not 10 mm².</span></p>
        <p><b>Calculated time with 100</b><span>1.5 h is 90 min, not 150 min.</span></p>
        <p><b>Mixed up m/s and km/h</b><span>From km/h to m/s you divide by 3.6.</span></p>
        <p><b>Did not check the result</b><span>Ask yourself: should the number get bigger or smaller?</span></p>
      </div>
      ${TRAIN_BTN_EN}
    </section>`;
}
function learnWinEn(){
  const t={lay:0,nm:{P:'A',Q:'B',R:'C'}};
  return `
    <section class="sec">
      <h2>The right triangle</h2>
      <div class="fig">${triSVG(t,{'α':'target'})}</div>
      <p>The hypotenuse is opposite the right angle and is the longest side. The two other sides are called legs. Whether a leg is the opposite or the adjacent side depends on the angle you look from.</p>
      ${KV([['Hypotenuse','c'],['Opposite of α','a'],['Adjacent of α','b'],['Opposite of β','b'],['Adjacent of β','a'],['α + β','= 90°']])}
    </section>
    <section class="sec">
      <h2>Sine, cosine, tangent</h2>
      ${KV([['sin α','= opposite / hypotenuse'],['cos α','= adjacent / hypotenuse'],['tan α','= opposite / adjacent']],'wide')}
      <div class="memo"><b>Mnemonic: SOH-CAH-TOA</b><span class="mono">S = O / H<br>C = A / H<br>T = O / A</span><span class="fine">Sine is opposite over hypotenuse, cosine is adjacent over hypotenuse, tangent is opposite over adjacent.</span></div>
    </section>
    <section class="sec">
      <h2>Calculating a side</h2>
      <p>Given: c = 80 mm and α = 35°. Unknown: a.</p>
      ${SR([['sin α = a / c','· c','a is the opposite side, c the hypotenuse: sine.'],['a = c · sin α'],['a = 80 · sin 35° ≈ 45.89 mm']])}
      <p>If the unknown side is at the bottom of the fraction, you need one more step. Given: a = 30 mm and α = 40°. Unknown: c.</p>
      ${SR([['sin α = a / c','· c'],['c · sin α = a',': sin α'],['c = a / sin α'],['c = 30 / sin 40° ≈ 46.67 mm']])}
    </section>
    <section class="sec">
      <h2>Calculating an angle</h2>
      <p>Given: a = 30 mm and c = 50 mm. Unknown: α.</p>
      ${SR([['sin α = 30 / 50 = 0.6'],[`α = sin^{${M}1}(0.6)`,'','On the calculator: SHIFT, then sin.'],['α ≈ 36.87°'],[`β = 90° ${M} 36.87° = 53.13°`,'','The two acute angles add up to 90°.']])}
    </section>
    <section class="sec">
      <h2>In the workshop</h2>
      <h3 class="sub">Sine bar</h3>
      ${SR([['h = L · sin α','','L is the roller spacing (hypotenuse), h the height of the gauge blocks.'],['h = 100 · sin 15° ≈ 25.882 mm']])}
      <h3 class="sub">Turning a taper</h3>
      ${SR([[`tan(α/2) = (D ${M} d) / (2 · L)`,'','The top slide is set to half the taper angle.'],[`tan(α/2) = (40 ${M} 30) / (2 · 50) = 0.1`],[`α/2 = tan^{${M}1}(0.1) ≈ 5.71°`]])}
      <h3 class="sub">Pitch circle</h3>
      ${KV([['X','= r · cos φ'],['Y','= r · sin φ']])}
    </section>
    <section class="sec">
      <h2>Common mistakes</h2>
      <div class="mist">
        <p><b>Calculator not in DEG mode</b><span>The display must show D or DEG. With RAD or GRAD you get nonsense.</span></p>
        <p><b>Looked from the wrong angle</b><span>The opposite side of α is the adjacent side of β.</span></p>
        <p><b>Took the hypotenuse as a leg</b><span>The hypotenuse is never the opposite or the adjacent side.</span></p>
        <p><b>Forgot the half taper angle</b><span>The formula gives α/2, not the whole taper angle.</span></p>
      </div>
      ${TRAIN_BTN_EN}
    </section>`;
}
