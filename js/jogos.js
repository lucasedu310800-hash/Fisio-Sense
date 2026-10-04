(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.gtab').forEach(function(b){b.onclick=function(){
  document.querySelectorAll('.gtab').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b)});
  document.querySelectorAll('.gview').forEach(function(v){v.classList.toggle('on',v.id==='g-'+b.dataset.g)});
  fit();
}});
function setup(c){var r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);c.width=r.width*d;c.height=r.height*d;var x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);return {x:x,w:r.width,h:r.height}}
var F,C,K;function fit(){F=setup(document.getElementById('cFbf'));C=setup(document.getElementById('cCanoa'));K=setup(document.getElementById('cCam'))}
addEventListener('resize',fit);fit();
var B='#008CFF',B3='#00A8FF',BD='#003B7A';
function hex(x,cx,cy,r){x.beginPath();for(var i=0;i<6;i++){var a=Math.PI/3*i-Math.PI/2;x.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a))}x.closePath()}
function glove(x,cx,cy,s,col,punch){x.save();x.translate(cx,cy);x.scale(s*(1+punch*.25),s*(1+punch*.25));
  x.shadowColor=col;x.shadowBlur=18;x.fillStyle='#05070A';x.strokeStyle=col;x.lineWidth=4;
  x.beginPath();x.ellipse(0,0,46,54,0,0,7);x.fill();x.stroke();
  x.beginPath();x.ellipse(-30,8,16,24,-.4,0,7);x.fill();x.stroke();
  x.fillStyle=col;x.globalAlpha=.25;x.fillRect(-40,46,80,26);x.globalAlpha=1;x.strokeRect(-40,46,80,26);x.restore()}
// ---- FBF ----
var calls=['JAB ESQUERDO','DIRETO DIREITO','DEFESA ALTA','GANCHO DIREITO','JAB ESQUERDO'],ci=0,score=1240,combo=8,phase=0,tLast=0;
function fbf(t){var x=F.x,w=F.w,h=F.h;x.clearRect(0,0,w,h);
  var g=x.createRadialGradient(w/2,h*.45,10,w/2,h*.45,w*.7);g.addColorStop(0,'rgba(0,123,255,.22)');g.addColorStop(1,'#000');x.fillStyle=g;x.fillRect(0,0,w,h);
  // ring floor
  var hz=h*.58;x.strokeStyle='rgba(0,140,255,.35)';x.lineWidth=1;
  for(var i=-10;i<=10;i++){x.beginPath();x.moveTo(w/2+i*w*.03,hz);x.lineTo(w/2+i*w*.22,h);x.stroke()}
  for(var j=0;j<8;j++){var yy=hz+(h-hz)*Math.pow(j/8,1.8);x.beginPath();x.moveTo(0,yy);x.lineTo(w,yy);x.stroke()}
  // ropes
  x.strokeStyle=B;x.lineWidth=2;for(var r=0;r<3;r++){var ry=hz-h*.06-r*h*.07;x.beginPath();x.moveTo(w*.08,ry+r*4);x.quadraticCurveTo(w/2,ry+10,w*.92,ry+r*4);x.stroke()}
  x.fillStyle=B;x.fillRect(w*.08-4,hz-h*.3,8,h*.3);x.fillRect(w*.92-4,hz-h*.3,8,h*.3);
  // trainer
  var bob=Math.sin(t/400)*6,cx=w/2,cy=h*.5+bob,s=h/520;
  x.save();x.translate(cx,cy);x.scale(s,s);x.strokeStyle=B3;x.fillStyle='#000';x.lineWidth=4;x.shadowColor=B;x.shadowBlur=14;
  x.beginPath();x.moveTo(-60,-40);x.lineTo(60,-40);x.lineTo(45,90);x.lineTo(-45,90);x.closePath();x.fill();x.stroke();
  x.beginPath();x.arc(0,-82,30,0,7);x.fill();x.stroke();
  x.beginPath();x.moveTo(-40,90);x.lineTo(-50,190);x.moveTo(40,90);x.lineTo(50,190);x.stroke();
  // pads alternate
  var cyc=(t/900)%2,left=cyc<1,ext=Math.sin((cyc%1)*Math.PI);
  var lp=[-70-(left?ext*30:0),-60-(left?ext*20:0)],rp=[70+(!left?ext*30:0),-60-(!left?ext*20:0)];
  x.beginPath();x.moveTo(-55,-30);x.lineTo(lp[0],lp[1]+30);x.moveTo(55,-30);x.lineTo(rp[0],rp[1]+30);x.stroke();
  [lp,rp].forEach(function(p,k){var on=(k===0)===left&&ext>.5;x.save();x.translate(p[0],p[1]);x.fillStyle=on?'rgba(0,168,255,.35)':'#000';hex(x,0,0,24);x.fill();x.stroke();x.restore()});
  x.restore();
  // target ring
  var tx=cx+(left?-1:1)*90*s,ty=cy-60*s,pr=(t/900%1);x.strokeStyle=B3;x.globalAlpha=1-pr;x.lineWidth=2;hex(x,tx,ty,20*s+pr*40*s);x.stroke();x.globalAlpha=1;
  // gloves first person (esq vermelha, dir azul)
  var pL=left?ext:0,pR=!left?ext:0;
  glove(x,w*.27+pL*w*.06,h*.95-pL*h*.12,h/600,'#FF3B3B',pL);
  glove(x,w*.73-pR*w*.06,h*.95-pR*h*.12,h/600,B,pR);
  if(t-tLast>900){tLast=t;ci=(ci+1)%calls.length;score+=Math.floor(Math.random()*40)+20;combo=combo%12+1;
    document.getElementById('fCall').textContent=calls[ci];document.getElementById('fScore').textContent=score;
    document.getElementById('fCombo').textContent='x'+String(combo).padStart(2,'0');document.getElementById('fRea').textContent=(0.3+Math.random()*.25).toFixed(2)+'s'}
  cam(t,left,ext);
}
function cam(t,left,ext){var x=K.x,w=K.w,h=K.h;x.clearRect(0,0,w,h);var cx=w/2,s=h/120;
  var pts={hd:[0,-40],ls:[-14,-22],rs:[14,-22],le:[-24,-6],re:[24,-6],lh:[-10,-30],rh:[10,-30],hp:[0,18],lk:[-10,40],rk:[10,40]};
  if(left){pts.le=[-16-ext*4,-20];pts.lh=[-4,-28-ext*14]}else{pts.re=[16+ext*4,-20];pts.rh=[4,-28-ext*14]}
  function P(k){return [cx+pts[k][0]*s,h*.55+pts[k][1]*s]}
  x.lineWidth=1.5;[['ls','rs'],['ls','le'],['le','lh'],['rs','re'],['re','rh'],['hd','hp'],['hp','lk'],['hp','rk']].forEach(function(b){var a=P(b[0]),c=P(b[1]);x.strokeStyle=B;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(c[0],c[1]);x.stroke()});
  Object.keys(pts).forEach(function(k){var p=P(k);x.fillStyle=k==='lh'?'#FF3B3B':k==='rh'?B3:'#fff';x.beginPath();x.arc(p[0],p[1],k==='hd'?5*s/1.6:2.2,0,7);x.fill()});
}
// ---- CANOA ----
var dist=420,gate=7,cTl=0,side=1,buoys=[];for(var i=0;i<6;i++)buoys.push({z:i/6,side:i%2?1:-1});
function canoa(t,dt){var x=C.x,w=C.w,h=C.h;x.clearRect(0,0,w,h);var hz=h*.38;
  x.fillStyle='#000';x.fillRect(0,0,w,h);
  // margens
  x.fillStyle='#02060c';x.beginPath();x.moveTo(0,hz);x.lineTo(w*.44,hz);x.lineTo(0,h*.8);x.fill();x.beginPath();x.moveTo(w,hz);x.lineTo(w*.56,hz);x.lineTo(w,h*.8);x.fill();
  x.strokeStyle=BD;x.lineWidth=2;x.beginPath();x.moveTo(w*.44,hz);x.lineTo(0,h*.8);x.moveTo(w*.56,hz);x.lineTo(w,h*.8);x.stroke();
  // árvores
  for(var k=0;k<7;k++){var z=((k/7)+t*0.00012)%1,sc=Math.pow(z,2.2),yy=hz+(h*.42)*sc,off=w*.06+w*.5*sc;
    [-1,1].forEach(function(sd){var tx=w/2+sd*(off+w*.04);x.strokeStyle='rgba(0,140,255,'+(0.2+sc*.6)+')';x.lineWidth=1+sc*2;x.beginPath();x.moveTo(tx-12-sc*30,yy);x.lineTo(tx,yy-20-sc*120);x.lineTo(tx+12+sc*30,yy);x.closePath();x.stroke()})}
  // água: linhas de pontos
  x.fillStyle=B;for(var r=0;r<26;r++){var z2=((r/26)+t*0.0003)%1,p=Math.pow(z2,2),y=hz+(h-hz)*p,half=w*.06+w*.5*p;
    for(var q=-14;q<=14;q++){var px=w/2+q/14*half+Math.sin(q*.8+t*.002+r)*3*p;x.globalAlpha=.15+p*.6;x.fillRect(px,y+Math.sin(q+t*.003)*2*p,1.2+p*1.8,1.2+p*1.8)}}
  x.globalAlpha=1;
  // boias / portas
  buoys.forEach(function(b){b.z+=dt*0.00018;if(b.z>1){b.z-=1;b.side*=-1}
    var p=Math.pow(b.z,2),y=hz+(h-hz)*p,half=w*.06+w*.5*p,px=w/2+b.side*half*.55,r=3+p*22;
    x.shadowColor=B3;x.shadowBlur=12;x.strokeStyle=B3;x.lineWidth=1+p*2;hex(x,px,y-r,r);x.stroke();
    x.beginPath();x.moveTo(px,y-r*2);x.lineTo(px,y-r*2-p*60);x.stroke();x.shadowBlur=0});
  // canoa (proa em primeira pessoa)
  var sway=Math.sin(t/700)*w*.01;x.save();x.translate(w/2+sway,h);
  x.fillStyle='#05070A';x.strokeStyle=B;x.lineWidth=3;x.shadowColor=B;x.shadowBlur=16;
  x.beginPath();x.moveTo(-w*.2,0);x.quadraticCurveTo(-w*.07,-h*.18,0,-h*.3);x.quadraticCurveTo(w*.07,-h*.18,w*.2,0);x.closePath();x.fill();x.stroke();
  x.beginPath();x.moveTo(0,-h*.3);x.lineTo(0,0);x.strokeStyle=BD;x.stroke();x.restore();
  // remo
  var pc=(t/1100)%2;side=pc<1?1:-1;var st=Math.sin((pc%1)*Math.PI);
  x.save();x.translate(w/2+sway,h*.88);x.rotate(side*(0.9-st*.5));x.strokeStyle=B3;x.lineWidth=5;x.shadowColor=B3;x.shadowBlur=14;
  x.beginPath();x.moveTo(-w*.22,0);x.lineTo(w*.22,0);x.stroke();
  x.fillStyle='#000';[1,-1].forEach(function(e){x.beginPath();x.ellipse(e*w*.25,0,w*.04,h*.03,0,0,7);x.fill();x.stroke()});x.restore();
  // respingo
  if(st>.6){var sx=w/2+side*w*.24;x.fillStyle=B3;for(var n=0;n<14;n++){x.globalAlpha=Math.random()*.8;x.fillRect(sx+(Math.random()-.5)*60,h*.84+(Math.random()-.5)*30,2,2)}x.globalAlpha=1}
  if(t-cTl>1100){cTl=t;dist+=Math.floor(8+Math.random()*6);if(Math.random()<.35)gate=gate%12+1;
    document.getElementById('cCall').textContent=side>0?'REME À ESQUERDA':'REME À DIREITA';
    document.getElementById('cDist').textContent=String(dist).padStart(4,'0')+'m';
    document.getElementById('cVel').textContent=(11+Math.floor(Math.random()*4))+' km/h';
    document.getElementById('cGate').textContent=String(gate).padStart(2,'0')+'/12'}
}
var vis=true,prev=0;new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(document.getElementById('game'));
function loop(t){var dt=Math.min(t-prev,50);prev=t;if(vis){if(document.getElementById('g-fbf').classList.contains('on'))fbf(t);else canoa(t,dt)}if(!reduce)requestAnimationFrame(loop)}
requestAnimationFrame(loop);if(reduce){fbf(400);canoa(400,16)}
})();
