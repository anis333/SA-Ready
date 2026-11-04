/* SA-Ready · Mechanik · Skizzen
   Kleine SVG-Bausteine (Kraftpfeile, Lager, Balken, Maßlinien) und die Skizzen für die Aufgaben.
   Farben kommen aus mech.css (Klassen .mfig …), damit die Skizzen zum Blaupausen-Layout passen. */
'use strict';
const mf=(()=>{
  const r=n=>Math.round(n*10)/10,RAD=Math.PI/180;
  const subs=s=>String(s).replace(/_\{([^}]*)\}/g,'<tspan class="sbt" dy="3.5" font-size="9.5">$1</tspan>');
  const T=(x,y,s,c='t',a='middle')=>`<text class="${c}" x="${r(x)}" y="${r(y)}" text-anchor="${a}" dominant-baseline="central">${subs(s)}</text>`;
  const L=(x1,y1,x2,y2,c='b')=>`<line class="${c}" x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}"/>`;
  const head=(x,y,a,c='fh',len=10,w=3.9)=>{
    const bx=x-len*Math.cos(a),by=y-len*Math.sin(a),nx=-Math.sin(a),ny=Math.cos(a);
    return `<polygon class="${c}" points="${r(x)},${r(y)} ${r(bx+nx*w)},${r(by+ny*w)} ${r(bx-nx*w)},${r(by-ny*w)}"/>`;
  };
  /* Kraftpfeil von (x1,y1) nach (x2,y2), Spitze in (x2,y2) */
  const arrow=(x1,y1,x2,y2,c='fa',h='fh')=>{
    const a=Math.atan2(y2-y1,x2-x1);
    return L(x1,y1,x2-9*Math.cos(a),y2-9*Math.sin(a),c)+head(x2,y2,a,h);
  };
  const box=(x,y,w,h,c='bf')=>`<rect class="${c}" x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}"/>`;
  const dot=(x,y,rr=2.6,c='sd')=>`<circle class="${c}" cx="${r(x)}" cy="${r(y)}" r="${rr}"/>`;
  /* Kreisbogen (Winkel mathematisch in Grad, gegen den Uhrzeigersinn positiv), optional mit Pfeilspitze am Ende */
  const arc=(cx,cy,rad,a0,a1,c='ar',tip=false)=>{
    const p=a=>[cx+rad*Math.cos(a*RAD),cy-rad*Math.sin(a*RAD)],s=p(a0),e=p(a1),ccw=a1>a0;
    let d=`<path class="${c}" d="M${r(s[0])} ${r(s[1])} A${rad} ${rad} 0 ${Math.abs(a1-a0)>180?1:0} ${ccw?0:1} ${r(e[0])} ${r(e[1])}"/>`;
    if(tip){const dir=ccw?1:-1,ang=Math.atan2(-Math.cos(a1*RAD)*dir,-Math.sin(a1*RAD)*dir);d+=head(e[0],e[1],ang,'ah',8,3.2);}
    return d;
  };
  /* Maßlinie waagerecht: Pfeile an beiden Enden, Hilfslinien nach oben und unten */
  const dimH=(x1,x2,y,lab,c='dm')=>{
    const h='dh';
    return L(x1,y-5,x1,y+5,c)+L(x2,y-5,x2,y+5,c)+L(x1+6,y,x2-6,y,c)+head(x1,y,Math.PI,h,7,2.6)+head(x2,y,0,h,7,2.6)+(lab?T((x1+x2)/2,y-9,lab,'td'):'');
  };
  const dimV=(x,y1,y2,lab,left=true,c='dm')=>{
    const h='dh';
    return L(x-5,y1,x+5,y1,c)+L(x-5,y2,x+5,y2,c)+L(x,y1+6,x,y2-6,c)+head(x,y1,-Math.PI/2,h,7,2.6)+head(x,y2,Math.PI/2,h,7,2.6)+(lab?T(left?x-9:x+9,(y1+y2)/2,lab,'td',left?'end':'start'):'');
  };
  const ground=(x1,x2,y)=>{let s=L(x1,y,x2,y,'g');for(let x=x1+6;x<=x2+6;x+=8)s+=L(x,y,x-6,y+7,'gh');return s;};
  const pin=(x,y)=>`<polygon class="bf" points="${r(x)},${r(y)} ${r(x-9)},${r(y+16)} ${r(x+9)},${r(y+16)}"/>`+dot(x,y,2.8,'pn')+ground(x-17,x+17,y+16);
  const roller=(x,y)=>`<polygon class="bf" points="${r(x)},${r(y)} ${r(x-9)},${r(y+13)} ${r(x+9)},${r(y+13)}"/>`+dot(x,y,2.8,'pn')+`<circle class="bf" cx="${r(x-5)}" cy="${r(y+16.5)}" r="3.4"/><circle class="bf" cx="${r(x+5)}" cy="${r(y+16.5)}" r="3.4"/>`+ground(x-17,x+17,y+20);
  const wall=(x,y1,y2,side=-1)=>{let s=L(x,y1,x,y2,'g');for(let y=y1+6;y<=y2+6;y+=8)s+=L(x,y,x+side*7,y-6,'gh');return s;};
  const ceil=(x1,x2,y)=>{let s=L(x1,y,x2,y,'g');for(let x=x1+6;x<=x2+6;x+=8)s+=L(x,y,x-6,y-7,'gh');return s;};
  const beam=(x1,x2,y,t=8)=>`<rect class="bm" x="${r(x1)}" y="${r(y-t/2)}" width="${r(x2-x1)}" height="${t}"/>`;
  const svg=(w,h,body,label)=>`<svg class="mfig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${String(label).replace(/_\{([^}]*)\}/g,'$1').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}">${body}</svg>`;
  const rad=a=>a*RAD;

  /* ---------- Skizzen ---------- */
  /* Körper hängt am Seil, Gewichtskraft nach unten */
  function hang(lab,fl){
    const b=ceil(110,210,12)+L(160,12,160,52,'rp')+box(130,52,60,40)+dot(160,72)+arrow(160,72,160,128,'fa')+T(172,118,fl||'F_{G}','tf','start')+T(160,63,lab||'m','t');
    return svg(320,140,b,Lg('Körper hängt am Seil, die Gewichtskraft FG zeigt nach unten.','A body hangs on a rope, the weight force FG points downwards.'));
  }
  /* Kräfte auf einer Wirkungslinie. forces: [{v,lab}] v>0 nach rechts */
  function line(forces){
    const mx=Math.max(...forces.map(f=>Math.abs(f.v))),ys={r:[70,50,90,30,110],l:[70,50,90,30,110]},cnt={r:0,l:0};
    let b=box(120,22,80,96)+dot(160,70),desc=[];
    forces.forEach(f=>{
      const k=f.v>=0?'r':'l',y=ys[k][cnt[k]++],len=28+32*Math.abs(f.v)/mx;
      if(f.v>=0){b+=arrow(200,y,200+len,y)+T(200+len/2,y-9,f.lab,'tf');}
      else{b+=arrow(120,y,120-len,y)+T(120-len/2,y-9,f.lab,'tf');}
      desc.push(f.lab+' '+(f.v>=0?Lg('nach rechts','to the right'):Lg('nach links','to the left')));
    });
    b+=L(10,140,310,140,'ax')+T(300,128,'x','t','end')+arrow(250,140,300,140,'axa','axh');
    return svg(320,150,b,Lg('Kräfte auf einer Wirkungslinie: ','Forces on one line of action: ')+desc.join(', '));
  }
  /* Kraft F unter Winkel a (Grad, gegen den Uhrzeigersinn ab der +x-Achse) mit Komponenten.
     axis: 'x' = der Winkel liegt an der x-Achse, 'y' = an der y-Achse. hl: hervorgehobene Größe (Fx, Fy oder F). */
  function vec(o){
    const a=o.a,c=Math.cos(rad(a)),s=Math.sin(rad(a)),Lv=112,sx=c>=0?1:-1,sy=s>=0?1:-1;
    const ox=sx>0?64:256,oy=sy>0?154:56,tx=ox+Lv*c,ty=oy-Lv*s,hl=o.hl||'';
    let b=L(10,oy,310,oy,'ax')+head(310,oy,0,'axh',8,3)+T(302,oy+(sy>0?13:-13),'x','t','end')
      +L(ox,204,ox,8,'ax')+head(ox,8,-Math.PI/2,'axh',8,3)+T(ox+(sx>0?12:-12),14,'y','t');
    if(o.comps!==false){
      b+=L(tx,ty,tx,oy,'cd')+L(ox,ty,tx,ty,'cd');
      b+=arrow(ox,oy,tx,oy,'fc'+(hl==='Fx'?' hl':''),'fch'+(hl==='Fx'?' hl':''))+arrow(ox,oy,ox,ty,'fc'+(hl==='Fy'?' hl':''),'fch'+(hl==='Fy'?' hl':''));
      b+=T((ox+tx)/2,oy+(sy>0?15:-15),o.lx||'F_{x}','tc'+(hl==='Fx'?' hl':''))+T(ox+(sx>0?-18:18),(oy+ty)/2,o.ly||'F_{y}','tc'+(hl==='Fy'?' hl':''));
    }
    b+=arrow(ox,oy,tx,ty,'fa'+(hl==='F'?' hl':''),'fh'+(hl==='F'?' hl':''))+dot(ox,oy,2.4);
    b+=T(tx+(sx>0?7:-7),ty+(sy>0?-10:10),o.lf||'F','tf'+(hl==='F'?' hl':''),sx>0?'start':'end');
    const ref=o.axis==='y'?(sy>0?90:270):(sx>0?0:180),aN=(o.axis!=='y'&&sx>0&&a>180)?a-360:a;
    b+=arc(ox,oy,34,ref,aN,'ar');
    const mid=(ref+aN)/2*RAD;
    b+=T(ox+52*Math.cos(mid),oy-52*Math.sin(mid),o.la||'α','tc');
    return svg(320,208,b,o.alt||Lg('Kraft mit Winkel und Komponenten','Force with angle and components'));
  }
  /* Mehrere Kräfte an einem Punkt. list: [{a,lab}] a in Grad gegen die x-Achse (gegen den Uhrzeigersinn) */
  function multi(list,res){
    const ox=160,oy=100,Lv=82;
    let b=L(ox-130,oy,ox+130,oy,'ax')+head(ox+130,oy,0,'axh',8,3)+L(ox,oy+84,ox,oy-90,'ax')+head(ox,oy-90,-Math.PI/2,'axh',8,3)+T(ox+124,oy+11,'x','t','end')+T(ox+10,oy-86,'y','t','start');
    list.forEach(f=>{
      const c=Math.cos(rad(f.a)),s=Math.sin(rad(f.a)),tx=ox+Lv*c,ty=oy-Lv*s;
      b+=arrow(ox,oy,tx,ty)+T(tx+(Math.abs(c)<.2?14:(c>0?10:-10)),ty+(Math.abs(c)<.2?(s>0?-4:4):(s>0?-9:9)),f.lab,'tf',Math.abs(c)<.2?'middle':(c>0?'start':'end'));
    });
    b+=dot(ox,oy,2.6);
    return svg(320,200,b,Lg('Mehrere Kräfte greifen in einem Punkt an: ','Several forces act at one point: ')+list.map(f=>f.lab+' ('+f.a+'°)').join(', '));
  }
  /* Zwei Seile mit Last. a, b: Winkel der Seile gegen die Waagerechte (links, rechts) */
  function ropes(a,b2,o){
    o=o||{};
    const kx=160,ky=112,len=100,ax=kx-len*Math.cos(rad(a)),ay=ky-len*Math.sin(rad(a)),bx=kx+len*Math.cos(rad(b2)),by=ky-len*Math.sin(rad(b2));
    const pt=(rr,ang)=>[kx+rr*Math.cos(ang*RAD),ky-rr*Math.sin(ang*RAD)];
    let b=wall(ax,ay-8,ay+10,-1)+wall(bx,by-8,by+10,1);
    b+=L(ax,ay,kx,ky,'rp')+L(bx,by,kx,ky,'rp')+L(kx,ky,kx,144,'rp');
    b+=L(kx-50,ky,kx+50,ky,'cd');
    b+=box(kx-28,144,56,34)+T(kx,161,o.lab||'m','t');
    b+=arrow(kx,178,kx,216,'fa')+T(kx+10,206,o.fl||'F_{G}','tf','start')+dot(kx,ky,3,'pn');
    const off=(px,py,qx,qy,k)=>{const dx=qx-px,dy=qy-py,l=Math.hypot(dx,dy),nx=dy/l,ny=-dx/l,sg=ny<0?1:-1;return [px+dx*k+sg*nx*15,py+dy*k+sg*ny*15];};
    const m1=off(ax,ay,kx,ky,.42),m2=off(bx,by,kx,ky,.42);
    b+=T(m1[0],m1[1],o.f1||'F_{1}','tf')+T(m2[0],m2[1],o.f2||'F_{2}','tf');
    b+=arc(kx,ky,36,180,180-a,'ar')+arc(kx,ky,36,0,b2,'ar');
    const p1=pt(54,180-a/2),p2=pt(54,b2/2);
    b+=T(p1[0],p1[1],o.la||'α','tc')+T(p2[0],p2[1],o.lb||'β','tc');
    return svg(320,226,b,Lg(`Last an zwei Seilen, Seilwinkel ${a}° und ${b2}° gegen die Waagerechte`,`Load on two ropes, rope angles ${a}° and ${b2}° to the horizontal`));
  }
  /* Wandausleger: waagerechter Balken an der Wand, Seil oder Zugstab schräg nach oben zur Wand.
     a: Winkel zwischen Seil und Balken. loadAt (0..1): Lage der Last am Balken (Standard: Balkenende). */
  function boom(o){
    o=o||{};
    const a=o.a||35,wx=40,y0=118,tipx=250,ty=Math.max(22,y0-(tipx-wx)*Math.tan(rad(a)));
    const lx=o.loadAt!=null?wx+(tipx-wx)*o.loadAt:tipx;
    let b=wall(wx,ty-16,y0+30,-1)+beam(wx,tipx,y0,8)+L(wx,ty,tipx,y0,'rp')+dot(wx,ty,3,'pn')+dot(wx,y0,3.4,'pn')+dot(tipx,y0,3,'pn');
    b+=arrow(lx,y0+4,lx,y0+54,'fa')+T(lx+10,y0+46,o.fl||'F_{G}','tf','start');
    b+=dimH(wx,tipx,y0+72,o.dl||'l');
    if(o.loadAt!=null)b+=dimH(wx,lx,y0+90,o.da||'a');
    if(o.dh)b+=dimV(wx+16,ty,y0,o.dh,false);
    b+=arc(tipx,y0,46,180,180-a,'ar')+T(tipx-66*Math.cos((a/2)*RAD),y0-66*Math.sin((a/2)*RAD)*0.9,'α','tc');
    b+=T(wx+(tipx-wx)*.5+10,ty+(y0-ty)*.5-12,o.fs||'F_{S}','tf');
    return svg(320,o.loadAt!=null?232:214,b,o.alt||Lg('Wandausleger mit Seil und Last','Wall boom with rope and load'));
  }
  /* Hebel mit Drehpunkt links und einer Kraft am Ende. a: Winkel zwischen Hebel und Kraft (90 = senkrecht). kind: 'nut' | 'hub' */
  function lever(o){
    o=o||{};
    const ox=62,oy=92,ex=252,a=o.a||90;
    let b=beam(ox,ex,oy,10);
    if(o.kind==='hub')b+=`<circle class="bf" cx="${ox}" cy="${oy}" r="21"/>`;
    else b+=`<polygon class="bf" points="${[0,1,2,3,4,5].map(i=>r(ox+21*Math.cos(i*Math.PI/3))+','+r(oy+21*Math.sin(i*Math.PI/3))).join(' ')}"/>`;
    b+=dot(ox,oy,3,'pn');
    const fy=oy+5;
    if(a===90){
      b+=arrow(ex,fy+58,ex,fy,'fa')+T(ex+10,fy+44,o.lf||'F','tf','start');
    }else{
      const th=(180+a)*RAD,dx=Math.cos(th),dy=-Math.sin(th),len=66,x1=ex-len*dx,y1=fy-len*dy;
      b+=arrow(x1,y1,ex,fy,'fa')+T(x1+8,y1,o.lf||'F','tf','start');
      b+=arc(ex,fy,30,180,180+a,'ar')+T(ex-48*Math.cos((a/2)*RAD),fy+48*Math.sin((a/2)*RAD)*0.9,o.la||'α','tc');
    }
    b+=dimH(ox,ex,oy-40,o.ll||'l');
    b+=arc(ox,oy,36,200,340,'ar',true)+T(ox,oy+50,'M','tc');
    return svg(320,a===90?164:170,b,o.alt||Lg('Hebel mit Kraft am Ende','Lever with a force at its end'));
  }
  /* Waagerechter Stab mit Drehpunkt A und mehreren senkrechten Kräften.
     items: [{x,F,lab,d}] x = Abstand vom Drehpunkt (+ rechts), F>0 nach unten, d = Beschriftung des Abstands */
  function barForces(items,o){
    o=o||{};
    const ax=160,sc=o.sc||22;
    let b=beam(16,304,100,8)+`<polygon class="bf" points="${ax},104 ${ax-9},120 ${ax+9},120"/>`+dot(ax,100,3,'pn')+ground(ax-17,ax+17,120)+T(ax,138,o.pl||'A','t');
    items.forEach((it,k)=>{
      const px=ax+it.x*sc,down=it.F>0;
      b+=down?arrow(px,48,px,96,'fa')+T(px+9,58,it.lab,'tf','start'):arrow(px,152,px,104,'fa')+T(px+9,146,it.lab,'tf','start');
    });
    const rowL=[0,0],ds=items.filter(i=>i.d);
    ds.forEach(it=>{const k=it.x<0?0:1,y=168+rowL[k]*16;rowL[k]++;b+=dimH(Math.min(ax,ax+it.x*sc),Math.max(ax,ax+it.x*sc),y,it.d);});
    return svg(320,168+Math.max(rowL[0],rowL[1])*16+6,b,o.alt||Lg('Stab mit Drehpunkt A und senkrechten Kräften','Bar with pivot A and vertical forces'));
  }
  /* Kräftepaar: zwei gegengleiche Kräfte im Abstand d an einem Stab mit Drehpunkt in der Mitte */
  function couple(o){
    o=o||{};
    const lx=60,rx=260,y=90;
    let b=beam(lx-20,rx+20,y,8)+dot(160,y,4,'pn')+`<circle class="bf" cx="160" cy="${y}" r="11"/>`+dot(160,y,3,'pn');
    b+=arrow(lx,y+54,lx,y+4,'fa')+T(lx+9,y+48,o.lf||'F','tf','start')+arrow(rx,y-54,rx,y-4,'fa')+T(rx+9,y-48,o.lf||'F','tf','start');
    b+=dimH(lx,rx,y+66,o.ld||'d');
    b+=arc(160,y,30,160,20,'ar',true)+T(160,y-40,'M','tc');
    return svg(320,170,b,Lg('Kräftepaar: zwei gleich große, entgegengesetzte Kräfte im Abstand d','Force couple: two equal, opposite forces at distance d'));
  }
  /* Zahnradpaar: Ritzel (r1) und Rad (r2), Umfangskraft am Berührpunkt */
  function gears(o){
    o=o||{};
    const r1=o.r1||34,r2=o.r2||62,c1=[74,100],c2=[74+r1+r2,100];
    const teeth=(cx,cy,rr,n)=>{let s='';for(let i=0;i<n;i++){const a=i*2*Math.PI/n;s+=L(cx+rr*Math.cos(a),cy+rr*Math.sin(a),cx+(rr+5)*Math.cos(a),cy+(rr+5)*Math.sin(a),'gt');}return s;};
    let b=`<circle class="bf" cx="${c1[0]}" cy="${c1[1]}" r="${r1}"/>`+teeth(c1[0],c1[1],r1,14)+`<circle class="bf" cx="${c2[0]}" cy="${c2[1]}" r="${r2}"/>`+teeth(c2[0],c2[1],r2,24);
    b+=dot(c1[0],c1[1],3,'pn')+dot(c2[0],c2[1],3,'pn');
    const px=c1[0]+r1;
    b+=arrow(px,100,px,36,'fa')+T(px-9,44,o.lf||'F_{u}','tf','end');
    b+=dimH(c1[0]-r1,c1[0]+r1,100+r1+22,o.lr||'d');
    b+=arc(c1[0],100,15,40,150,'ar',true)+T(c1[0]-r1-12,100,o.lm||'M','tc');
    return svg(320,100+r1+34,b,Lg('Zahnradpaar mit Umfangskraft Fu am Berührpunkt','Gear pair with circumferential force Fu at the contact point'));
  }
  /* Seiltrommel mit Last */
  function drum(o){
    o=o||{};
    const cx=110,cy=70,R=44;
    let b=`<circle class="bf" cx="${cx}" cy="${cy}" r="${R}"/>`+dot(cx,cy,3,'pn')+L(cx+R,cy,cx+R,150,'rp')+box(cx+R-22,150,44,34)+T(cx+R,167,o.lab||'m','t');
    b+=arrow(cx+R,184,cx+R,222,'fa')+T(cx+R+10,212,o.lf||'F_{G}','tf','start');
    b+=L(cx,cy,cx+R*Math.cos(rad(40)),cy-R*Math.sin(rad(40)),'dm')+T(cx+R*0.42,cy-R*0.62-6,o.lr||'r','td','end');
    b+=arc(cx,cy,R*0.55,200,330,'ar',true)+T(cx,cy+R*0.55+13,o.lm||'M','tc');
    return svg(320,232,b,Lg('Seiltrommel mit Last: Moment M an der Trommel','Rope drum with load: moment M on the drum'));
  }
  /* Träger auf zwei Lagern. o:{l,posA,posB,A,B,loads:[{x,lab,ang,up}],dims:[[x1,x2,lab,row]],names:{A,B}} */
  function beamSup(o){
    const x0=44,x1=276,by=96,sc=(x1-x0)/o.l,P=x=>x0+x*sc;
    const posB=o.posB!=null?o.posB:o.l,posA=o.posA||0;
    let b=beam(x0,x1,by,9);
    if(o.A==='wall')b+=wall(x0,by-30,by+30,-1);
    else if(o.A)b+=(o.A==='roller'?roller:pin)(P(posA),by+5);
    if(o.B)b+=(o.B==='pin'?pin:roller)(P(posB),by+5);
    (o.sups||[]).forEach(sp=>{b+=sp.kind==='wall'?wall(P(sp.x),by-30,by+30,-1):(sp.kind==='pin'?pin:roller)(P(sp.x),by+5);if(sp.name&&sp.kind!=='wall')b+=T(P(sp.x),by+46,sp.name,'t');});
    (o.loads||[]).forEach(ld=>{
      const px=P(ld.x);
      if(ld.ang){const dx=Math.cos(rad(ld.ang)),dy=Math.sin(rad(ld.ang));b+=arrow(px-56*dx,by-5-56*dy,px,by-5,'fa')+T(px-56*dx-5,by-5-56*dy-8,ld.lab,'tf','end');}
      else if(ld.up)b+=arrow(px,by+56,px,by+5,'fa')+T(px+9,by+44,ld.lab,'tf','start');
      else b+=arrow(px,by-58,px,by-5,'fa')+T(px+9,by-46,ld.lab,'tf','start');
    });
    const nm=o.names||{};
    if(nm.A&&o.A!=='wall')b+=T(P(posA),by+46,nm.A,'t');
    if(nm.B)b+=T(P(posB),by+46,nm.B,'t');
    let rows=0;
    (o.dims||[]).forEach(d=>{const row=d[3]||0;rows=Math.max(rows,row+1);b+=dimH(P(d[0]),P(d[1]),by+66+row*20,d[2]);});
    return svg(320,by+66+Math.max(1,rows)*20,b,o.alt||Lg('Träger auf zwei Lagern mit Last','Beam on two supports with a load'));
  }
  /* Wippe / Hebel mit Drehpunkt A. items: [{x (Abstand vom Drehpunkt, + rechts), lab}], Kräfte nach unten. dims: [[x1,x2,lab]] */
  function seesaw(items,o){
    o=o||{};
    const ax=160,sc=o.sc||22;
    let b=beam(24,296,96,8)+`<polygon class="bf" points="${ax},102 ${ax-12},124 ${ax+12},124"/>`+dot(ax,96,3,'pn')+ground(ax-26,ax+26,124)+T(ax,138,o.pl||'A','t');
    items.forEach(it=>{const px=ax+it.x*sc;b+=arrow(px,40,px,92,'fa')+T(px+9,54,it.lab,'tf','start');});
    (o.dims||[]).forEach(d=>{b+=dimH(ax+d[0]*sc,ax+d[1]*sc,158,d[2]);});
    return svg(320,176,b,o.alt||Lg('Zweiseitiger Hebel','Two-armed lever'));
  }
  /* Auflager-Symbole einzeln */
  function support(kind){
    let b='';
    if(kind==='los')b=beam(60,260,70,9)+roller(160,75)+T(160,128,'','');
    else if(kind==='fest')b=beam(60,260,70,9)+pin(160,75);
    else if(kind==='ein')b=beam(120,270,70,9)+wall(120,34,106,-1);
    else if(kind==='seil')b=ceil(110,210,14)+L(160,14,160,66,'rp')+box(130,66,60,36);
    else if(kind==='stab')b=wall(60,30,110,-1)+L(60,70,190,70,'sb')+dot(60,70,3.4,'pn')+dot(190,70,3.4,'pn')+box(190,52,60,36);
    return svg(320,kind==='ein'?124:130,b,{los:Lg('Auflager-Symbol','Support symbol'),fest:Lg('Auflager-Symbol','Support symbol'),ein:Lg('Auflager-Symbol','Support symbol'),seil:Lg('Seil','Rope'),stab:Lg('Zweigelenkstab','Two-force rod')}[kind]);
  }
  /* Kugel auf Fläche: Gleichgewichtslagen. kind: 'stabil'|'labil'|'indiff' */
  function ball(kind){
    let b='';
    if(kind==='stabil')b=`<path class="g" d="M30 40 Q160 150 290 40" fill="none"/>`+`<circle class="bf" cx="160" cy="98" r="13"/>`+dot(160,98,2.2);
    else if(kind==='labil')b=`<path class="g" d="M30 120 Q160 10 290 120" fill="none"/>`+`<circle class="bf" cx="160" cy="46" r="13"/>`+dot(160,46,2.2);
    else b=ground(30,290,100)+`<circle class="bf" cx="160" cy="86" r="13"/>`+dot(160,86,2.2);
    return svg(320,150,b,{stabil:Lg('Kugel in einer Mulde','Ball in a bowl'),labil:Lg('Kugel auf einem Hügel','Ball on top of a hill'),indiff:Lg('Kugel auf ebener Fläche','Ball on a flat surface')}[kind]);
  }
  /* Körper, aufgehängt oder aufgestützt, Schwerpunkt S. kind: 'pendel' (Aufhängung über S) | 'stab' (Stab auf Spitze, S über Stützpunkt) | 'rad' (Drehpunkt = S) */
  function body(kind){
    let b='';
    if(kind==='pendel')b=ceil(120,200,12)+dot(160,12,3.4,'pn')+L(160,12,160,104,'rp')+box(136,104,48,40)+dot(160,124,3,'sd')+T(172,124,'S','t','start')+T(172,30,'D','td','start');
    else if(kind==='stab')b=box(146,16,28,100)+dot(160,66,3,'sd')+T(186,66,'S','t','start')+`<polygon class="bf" points="160,116 150,134 170,134"/>`+ground(120,200,134)+T(186,120,'D','td','start');
    else if(kind==='rad')b=`<circle class="bf" cx="160" cy="72" r="46"/>`+dot(160,72,3.4,'pn')+T(160,94,'S = D','t')+ground(118,202,126)+L(160,72,160,126,'g');
    else if(kind==='stabunter')b=box(146,70,28,90)+dot(160,115,3,'sd')+T(186,115,'S','t','start');
    return svg(320,150,b,'');
  }
  return {T,L,arrow,head,box,dot,arc,dimH,dimV,ground,pin,roller,wall,ceil,beam,svg,hang,line,vec,multi,ropes,boom,lever,barForces,couple,gears,drum,beamSup,seesaw,support,ball,body};
})();
