var AXO='assets/axolote.png';document.querySelectorAll("img[data-axo]").forEach(function(i){i.src=AXO});

(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Intro
  var intro=document.getElementById('intro');
  var introDone=false;function endIntro(){if(introDone)return;introDone=true;intro.classList.add('done')}
  setTimeout(endIntro, reduce?50:6800);
  setTimeout(function(){var fi=document.querySelector('.st-fiap');if(fi)fi.classList.add('glitch')},2150);
  document.getElementById('skipIntro').onclick=endIntro;
  (function(){var c=document.getElementById('introCv'),x=c.getContext('2d'),d=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;c.width=w*d;c.height=h*d;x.setTransform(d,0,0,d,0,0);
    var t0=performance.now();
    function col2(m){var a=[255,120,190],b=[120,210,255];return 'rgb('+Math.round(a[0]+(b[0]-a[0])*m)+','+Math.round(a[1]+(b[1]-a[1])*m)+','+Math.round(a[2]+(b[2]-a[2])*m)+')'}
    function col(m){var a=[214,40,150],b=[0,140,255];return 'rgb('+Math.round(a[0]+(b[0]-a[0])*m)+','+Math.round(a[1]+(b[1]-a[1])*m)+','+Math.round(a[2]+(b[2]-a[2])*m)+')'}
    // circuito: trilhas com cantos arredondados, anéis, barras listradas e marcadores
    function rnd(a,b){return a+Math.random()*(b-a)}
    function rounded(c,r){var o=[c[0]];for(var k=1;k<c.length-1;k++){var a=c[k-1],b=c[k],d=c[k+1],
      l1=Math.hypot(b[0]-a[0],b[1]-a[1]),l2=Math.hypot(d[0]-b[0],d[1]-b[1]),rr=Math.min(r,l1/2,l2/2),
      p1=[b[0]+(a[0]-b[0])/l1*rr,b[1]+(a[1]-b[1])/l1*rr],p2=[b[0]+(d[0]-b[0])/l2*rr,b[1]+(d[1]-b[1])/l2*rr];
      o.push(p1);for(var q=1;q<8;q++){var u=q/8,m1=[p1[0]+(b[0]-p1[0])*u,p1[1]+(b[1]-p1[1])*u],m2=[b[0]+(p2[0]-b[0])*u,b[1]+(p2[1]-b[1])*u];o.push([m1[0]+(m2[0]-m1[0])*u,m1[1]+(m2[1]-m1[1])*u])}o.push(p2)}
      o.push(c[c.length-1]);return o}
    var traces=[],deco=[],nT=w<700?7:13,band=h*.25;
    for(var q=0;q<nT;q++){var alt=q%3===1,x0=(q+.5)/nT*w+rnd(-.3,.3)*w/nT,y1=h-rnd(.2,.9)*band,dir=Math.random()<.5?-1:1,
        len=rnd(.08,.28)*w,c=[[x0,h+6],[x0,y1],[x0+dir*len,y1]];
      if(Math.random()<.55){var y2=Math.max(h-band*1.05,y1-rnd(25,80));c.push([x0+dir*len,y2]);if(Math.random()<.5)c.push([x0+dir*(len+rnd(40,140)),y2])}
      var pl=rounded(c,22),L=[0];for(var z2=1;z2<pl.length;z2++)L.push(L[z2-1]+Math.hypot(pl[z2][0]-pl[z2-1][0],pl[z2][1]-pl[z2-1][1]));
      traces.push({pl:pl,L:L,tot:L[L.length-1],delay:rnd(0,.8),sp:rnd(380,620),pulse:Math.random(),lw:alt?2.4:1.8,alt:alt,ring:rnd(5,11),dot:Math.random()<.5})}
    // anéis soltos, barras listradas e marcadores (aparecem depois)
    for(var q2=0;q2<(w<700?3:6);q2++)deco.push({k:'ring',x:rnd(.08,.92)*w,y:h-rnd(.25,1)*band,r:rnd(6,12),alt:Math.random()<.5,d:rnd(.6,1.4)});
    for(var q3=0;q3<(w<700?2:4);q3++)deco.push({k:'stripe',x:rnd(.05,.85)*w,y:h-rnd(.1,.9)*band,n:4+Math.floor(rnd(0,4)),alt:Math.random()<.5,d:rnd(.8,1.5)});
    for(var q4=0;q4<(w<700?1:3);q4++)deco.push({k:'sq',x:rnd(.1,.9)*w,y:h-rnd(.3,1)*band,d:rnd(.9,1.6)});
    function tracePt(tr,d){var k=1;while(k<tr.L.length-1&&tr.L[k]<d)k++;var f=(d-tr.L[k-1])/((tr.L[k]-tr.L[k-1])||1),a=tr.pl[k-1],b=tr.pl[k];return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,k]}
    function ring(px,py,r,c,dot){x.strokeStyle=c;x.lineWidth=2.2;x.beginPath();x.arc(px,py,r,0,7);x.stroke();if(dot){x.fillStyle=c;x.beginPath();x.arc(px,py,r*.4,0,7);x.fill()}}
    function wiresDraw(t,c,c2){x.lineCap='round';x.lineJoin='round';
      traces.forEach(function(tr){var cc=tr.alt?c2:c,g=Math.max(0,Math.min(tr.tot,(t-tr.delay)*tr.sp));if(g<=0)return;
        var e=tracePt(tr,g);x.globalAlpha=.85;x.strokeStyle=cc;x.lineWidth=tr.lw;x.beginPath();x.moveTo(tr.pl[0][0],tr.pl[0][1]);for(var k=1;k<e[2];k++)x.lineTo(tr.pl[k][0],tr.pl[k][1]);x.lineTo(e[0],e[1]);x.stroke();
        if(g>=tr.tot){var en=tr.pl[tr.pl.length-1];x.globalAlpha=1;ring(en[0],en[1],tr.ring,cc,tr.dot);
          var pp=((t*.35+tr.pulse)%1)*tr.tot,pq=tracePt(tr,pp);x.shadowColor=cc;x.shadowBlur=12;x.fillStyle=cc;x.beginPath();x.arc(pq[0],pq[1],2.6,0,7);x.fill();x.shadowBlur=0}});
      deco.forEach(function(o){var a=Math.max(0,Math.min(1,(t-o.d)/.4));if(!a)return;x.globalAlpha=a;var cc=o.alt?c2:c;
        if(o.k==='ring')ring(o.x,o.y,o.r,cc,false);
        else if(o.k==='stripe'){x.fillStyle=cc;for(var n=0;n<o.n;n++){var sx=o.x+n*13;x.beginPath();x.moveTo(sx+6,o.y);x.lineTo(sx+14,o.y);x.lineTo(sx+8,o.y+9);x.lineTo(sx,o.y+9);x.closePath();x.fill()}}
        else{x.strokeStyle=c;x.lineWidth=1.4;x.strokeRect(o.x,o.y,7,7);x.fillStyle=c2;x.fillRect(o.x+13,o.y,7,7);x.fillRect(o.x+26,o.y,7,7)}});
      x.globalAlpha=1}
    function f(n){if(introDone)return;var t=(n-t0)/1000,m=Math.min(1,Math.max(0,(t-2.4)/1.1));m=m*m*(3-2*m);
      x.clearRect(0,0,w,h);x.fillStyle=col(m);
      var sp=w<700?9:11;
      // ondas de pontos entrando pelos cantos, como num túnel
      for(var r=0;r<26;r++){for(var k=0;k<Math.ceil(w/sp);k++){
        var px=k*sp,base=h*.5+(r-13)*h*.028,bend=Math.cos((px/w-.5)*Math.PI)*h*.22*(r<13?-1:1),
        py=base-bend+Math.sin(k*.09+t*.9+r*.4)*12;
        var edge=Math.abs(px/w-.5)*2,fade=Math.min(1,Math.pow(edge,1.2)*(1-Math.abs(r-13)/16)*1.6);
        if(fade<.04)continue;x.globalAlpha=fade;x.fillRect(px,py,2,2)}}
      x.globalAlpha=1;wiresDraw(t,col(m),col2(m));requestAnimationFrame(f)}
    if(!reduce)requestAnimationFrame(f)})();

  // Nav
  var nav=document.getElementById('nav');
  addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>30)},{passive:true});
  var mb=document.getElementById('menuBtn'),links=document.getElementById('links');
  mb.addEventListener('click',function(){var o=links.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
  links.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){links.classList.remove('open');mb.setAttribute('aria-expanded',false)})});

  // Reveal + counters + bars
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;
    e.target.classList.add('in');
    e.target.querySelectorAll('.bar i,.ev-bar i').forEach(function(b){b.style.width=b.dataset.w});e.target.querySelectorAll('[data-to]').forEach(function(el){var to=+el.dataset.to,st=performance.now();(function f(n){var q=Math.min((n-st)/1600,1);el.textContent=Math.round(to*(1-Math.pow(1-q,3)));if(q<1)requestAnimationFrame(f)})(st)});
    io.unobserve(e.target);
  })},{threshold:.18});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

  setTimeout(function(){
    document.querySelectorAll('[data-count]').forEach(function(el){
      var t=+el.dataset.count,s=performance.now();
      (function f(n){var p=Math.min((n-s)/1400,1);el.textContent=Math.round(t*(1-Math.pow(1-p,3)))+'%';if(p<1)requestAnimationFrame(f)})(s);
    });
  }, reduce?0:2600);

  // Score ticker
  

  // Background: dot waves + drifting particles
  var c=document.getElementById('bgcanvas'),x=c.getContext('2d'),W,H,dpr,parts=[];
  function size(){dpr=Math.min(devicePixelRatio||1,innerWidth<700?1.5:2);W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
    var n=W<700?28:60;parts=[];for(var i=0;i<n;i++)parts.push({x:Math.random()*W,y:Math.random()*H,v:.08+Math.random()*.18,r:Math.random()*1.3+.4,a:Math.random()*.5+.15});}
  size();addEventListener('resize',size);
  var t0=0;
  function wave(t,ox,oy,rows,cols,sx,sy,amp,phase,alpha,flip){
    for(var r=0;r<rows;r++){
      for(var k=0;k<cols;k++){
        var px=ox+k*sx*flip, base=oy+r*sy;
        var py=base+Math.sin(k*.11+t*.00025+r*.35+phase)*amp*(1+r*.08)+Math.cos(k*.05-t*.00015)*amp*.6;
        var fade=(1-r/rows)*(0.35+0.65*Math.sin(Math.PI*k/cols));
        x.globalAlpha=alpha*fade;
        x.fillRect(px,py,1.6,1.6);
      }
    }
  }
  function draw(t){
    x.clearRect(0,0,W,H);
    x.fillStyle='#008CFF';
    var sp=W<700?10:12;
    // onda inferior direita
    wave(t,W*.25,H*.72,14,Math.ceil(W*.9/sp),sp,9,26,0,.55,1);
    // onda superior esquerda
    wave(t,W*.55,-H*.02,10,Math.ceil(W*.6/sp),sp,8,18,2,.4,-1);
    x.globalAlpha=1;
    parts.forEach(function(p){p.y-=p.v;if(p.y<-5){p.y=H+5;p.x=Math.random()*W}
      x.globalAlpha=p.a;x.fillStyle='#00A8FF';x.fillRect(p.x,p.y,p.r*1.6,p.r*1.6)});
    x.globalAlpha=1;
    if(!reduce)requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  // Parallax leve no hero
  var art=document.querySelector('.hero-art');
  if(!reduce&&matchMedia('(pointer:fine)').matches){
    addEventListener('mousemove',function(e){var dx=(e.clientX/W-.5)*14,dy=(e.clientY/H-.5)*14;art.style.transform='translate('+dx+'px,'+dy+'px)'});
  }
})();
