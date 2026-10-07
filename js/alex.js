/* Axolote procedural — canvas de fundo. Cores em AXO_COLORS. */
(function(){
var HEADC='#9BD8FF';var AXO_COLORS={body1:'#2E9BFF',body2:'#0058B8',belly:'#8FD3FF',gill:'rgba(0,168,255,.6)',gillCore:'rgba(0,168,255,.95)',eye:'#000814',fin:'rgba(0,140,255,.28)'};
var cv=document.createElement('canvas');cv.id='axoBg';
cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:.55;filter:drop-shadow(0 0 10px rgba(0,140,255,.55))';
document.body.prepend(cv);
var x=cv.getContext('2d'),W,H,DPR,S=0,SB;
function size(){DPR=Math.min(devicePixelRatio||1,innerWidth<700?1.5:2);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;x.setTransform(DPR,0,0,DPR,0,0);SB=Math.max(.55,Math.min(1.1,W/1400));if(!S)S=SB}
size();addEventListener('resize',size);
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
// ---- ruído 1D suave (value noise) ----
var P=[];for(var i=0;i<512;i++)P.push(Math.random());
function noise(t){var i=Math.floor(t),f=t-i,a=P[i&511],b=P[(i+1)&511];f=f*f*(3-2*f);return a+(b-a)*f}
// ---- esqueleto ----
var N=26,SEG=9.5;
var widths=[];for(i=0;i<N;i++){var u=i/(N-1);widths.push(u<.08?14:u<.38?14+Math.sin((u-.08)/.3*Math.PI)*3.5:1+15*Math.pow(1-(u-.38)/.62,1.25))}
var pts=[],hx=W*.3,hy=H*.6,ang=0,speed=1.2,t0=Math.random()*100;
for(i=0;i<N;i++)pts.push({x:hx-i*SEG,y:hy});
var mouse={x:-9999,y:-9999};addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY},{passive:true});
var phase=0,last=performance.now();

// ---------- ENCAIXE FINAL ----------
// linha central do corpo na foto (imagem 950x702): cabeça -> corpo curvando à esquerda -> cauda descendo e voltando por baixo
var POSE=[[690,420],[580,462],[470,484],[370,484],[285,462],[210,425],[150,455],[138,520],[190,575],[280,605],[380,622],[470,640]];
var box=document.getElementById('finalAxo');
var anchor=null,ampC=0,mode=0,trS=0,HM=1,leaveT=0,revealTO=null;// 0 livre, 1 indo até a cauda da pose, 2 percorrendo a pose, 3 encaixado, 4 saindo
function poseLine(){var r=box.getBoundingClientRect(),sc=r.width/950,pl=POSE.map(function(p){return [r.left+p[0]*sc,r.top+p[1]*sc]}),len=[0];
  for(var i=1;i<pl.length;i++)len.push(len[i-1]+Math.hypot(pl[i][0]-pl[i-1][0],pl[i][1]-pl[i-1][1]));
  var tot=len[len.length-1];return {pl:pl,len:len,tot:tot,S:tot/((N-1)*SEG),HM:(146*sc/30)/(tot/((N-1)*SEG))}}
function at(P,d){d=Math.max(0,Math.min(P.tot,d));var k=1;while(k<P.len.length-1&&P.len[k]<d)k++;var f=(d-P.len[k-1])/((P.len[k]-P.len[k-1])||1),a=P.pl[k-1],b=P.pl[k];return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f]}
function follow(){pts[0].x=hx;pts[0].y=hy;var lim=mode===2?0:(mode===1?.45:.2),soft=(softC+=((mode===4?.03:.18)-softC)*.01);
  for(var i=1;i<N;i++){var a=pts[i-1],b=pts[i],L=SEG*S,cur=Math.atan2(a.y-b.y,a.x-b.x);
    if(lim){var pr=i===1?ang:Math.atan2(pts[i-2].y-a.y,pts[i-2].x-a.x),d=Math.atan2(Math.sin(cur-pr),Math.cos(cur-pr));
      var cl=d>lim?pr+lim:d<-lim?pr-lim:cur;cur+=(cl-cur)*soft;}
    b.x=a.x-Math.cos(cur)*L;b.y=a.y-Math.sin(cur)*L}}
var tv=0,softC=.18;
function turnTo(want,rate,k){var d=Math.atan2(Math.sin(want-ang),Math.cos(want-ang));ang+=Math.max(-.07,Math.min(.07,d*rate))*k;return Math.abs(d)}
function setDock(on){
  if(on){if(mode===1||mode===2||mode===3)return;mode=1;clearTimeout(revealTO);cv.style.zIndex=45;cv.style.opacity=.9}
  else{if(mode===0||mode===4)return;
    var wasDocked=mode===3;mode=4;softC=.01;leaveT=performance.now();clearTimeout(revealTO);
    box.classList.remove('revealed');cv.style.opacity=1;speed=wasDocked?.3:speed;
    ang=Math.atan2(pts[0].y-pts[1].y,pts[0].x-pts[1].x)}
}
if(box)new IntersectionObserver(function(e){setDock(e[0].isIntersecting)},{threshold:.55}).observe(document.getElementById('cta'));
function step(dt,t){
  var k=dt/16.7,T=t*.00012+t0;
  if(mode===1||mode===2||mode===3){var P=poseLine();var dS=(P.S-S)*.04;S+=Math.max(-.006,Math.min(.006,dS))*k;
    if(mode===1){// nada até a ponta da cauda da pose, chegando no sentido do percurso
      var tip=P.pl[P.pl.length-1],pre=P.pl[P.pl.length-2],ex=tip[0]+(tip[0]-pre[0])*.6,ey=tip[1]+(tip[1]-pre[1])*.6;
      var dE=Math.hypot(ex-hx,ey-hy),tgt=dE>60*S?[ex,ey]:tip;
      turnTo(Math.atan2(tgt[1]-hy,tgt[0]-hx),.12,k);speed+=(Math.min(3.2,1.4+dE*.01)-speed)*.05*k;
      hx+=Math.cos(ang)*speed*SB*1.3*k;hy+=Math.sin(ang)*speed*SB*1.3*k;
      if(Math.hypot(tip[0]-hx,tip[1]-hy)<14*S){mode=2;trS=P.tot}
    }else if(mode===2){// anda pela pose: o corpo vai ficando exatamente no caminho
      var v=Math.max(.9,Math.min(2.6,trS/(40*S)))*S*1.15;trS-=v*k;speed+=(Math.max(.5,v/S)-speed)*.1*k;
      var hp=at(P,trS),nx=at(P,trS-4);ang=Math.atan2(nx[1]-hp[1],nx[0]-hp[0]);hx=hp[0];hy=hp[1];
      HM+=(1+(P.HM-1)*(1-trS/P.tot)-HM)*.08*k;
      if(trS<=0){mode=3;anchor=null;speed=.15;cv.style.opacity=1;revealTO=setTimeout(function(){if(mode===3){box.classList.add('revealed');cv.style.opacity=0}},600)}
    }
    if(mode===3){// encaixado: acompanha a rolagem
      HM+=(P.HM-HM)*.1*k;speed+=(0-speed)*.1*k;
      var hp0=P.pl[0];if(!anchor)anchor=[hp0[0],hp0[1]];var ddx=hp0[0]-anchor[0],ddy=hp0[1]-anchor[1];anchor=[hp0[0],hp0[1]];for(var i=0;i<N;i++){pts[i].x+=ddx;pts[i].y+=ddy}
      hx=pts[0].x;hy=pts[0].y;phase+=.02*k;return}
    phase+=(.06+speed*.05)*k;follow();return}
  // livre ou saindo
  S+=Math.max(-.005,Math.min(.005,(SB-S)*.03))*k;HM+=(1-HM)*.03*k;
  if(mode===4){var el=performance.now()-leaveT;speed+=(1.5-speed)*.015*k;tv*=.9;
    if(el>1600&&cv.style.opacity!=='0.55'){cv.style.opacity=.55;setTimeout(function(){if(mode===0)cv.style.zIndex=1},900);mode=0}
    hx+=Math.cos(ang)*speed*S*k;hy+=Math.sin(ang)*speed*S*k;phase+=(.035+speed*.03)*k;follow();return}
  // nado calmo: velocidade e direção mudam devagar, com inércia
  var target=.45+noise(T*2+50)*1.05;speed+=(target-speed)*.006*k;
  var steer=(noise(T*4)-.5)*.0016+curious(k);
  var m=220*S,cx=W/2,cy=H/2,edge=Math.max(0,1-Math.min(hx,W-hx,hy,H-hy)/m);
  if(edge>0){var want=Math.atan2(cy-hy,cx-hx),d=Math.atan2(Math.sin(want-ang),Math.cos(want-ang));steer+=d*.0018*edge}
  var dx=hx-mouse.x,dy=hy-mouse.y,dm=Math.hypot(dx,dy),R=200*S;
  if(dm<R&&!cur&&performance.now()-poked>2500){var away=Math.atan2(dy,dx),d2=Math.atan2(Math.sin(away-ang),Math.cos(away-ang));steer+=d2*.0012*(1-dm/R);speed+=(.9-speed)*.01*k}
  tv=(tv+steer*k)*Math.pow(.94,k);tv=Math.max(-.018,Math.min(.018,tv));ang+=tv*k;
  hx+=Math.cos(ang)*speed*S*k;hy+=Math.sin(ang)*speed*S*k;
  phase+=(.035+speed*.03)*k;follow();
}
function segAng(i){var a=pts[Math.max(0,i-1)],b=pts[Math.min(N-1,i+1)];return Math.atan2(a.y-b.y,a.x-b.x)}
function sidePts(){var L=[],R=[];for(var i=0;i<N;i++){var a=segAng(i),w=widths[i]*S,
  wob=0;L.push([pts[i].x+Math.cos(a-Math.PI/2)*w+Math.cos(a)*0,pts[i].y+Math.sin(a-Math.PI/2)*w+wob*Math.cos(a)]);R.push([pts[i].x+Math.cos(a+Math.PI/2)*w,pts[i].y+Math.sin(a+Math.PI/2)*w+wob*Math.cos(a)])}return [L,R]}
function smooth(path){x.moveTo(path[0][0],path[0][1]);for(var i=1;i<path.length-1;i++){var mx=(path[i][0]+path[i+1][0])/2,my=(path[i][1]+path[i+1][1])/2;x.quadraticCurveTo(path[i][0],path[i][1],mx,my)}var l=path[path.length-1];x.lineTo(l[0],l[1])}
function leg(i,side,ph){var p=pts[i],a=segAng(i),w=widths[i]*S*.9;
  var bx=p.x+Math.cos(a+side*Math.PI/2)*w,by=p.y+Math.sin(a+side*Math.PI/2)*w;
  var row=Math.sin(ph)*Math.min(.8,speed*.5)*.75,ua=a+side*(Math.PI/2+.5)+row*side*-1;
  var l1=17*S,l2=13*S,kx=bx+Math.cos(ua)*l1,ky=by+Math.sin(ua)*l1,fa=ua-side*.9+row*.3,fx=kx+Math.cos(fa)*l2,fy=ky+Math.sin(fa)*l2;
  x.lineCap='round';x.strokeStyle=AXO_COLORS.body2;x.lineWidth=6.5*S;x.beginPath();x.moveTo(bx,by);x.lineTo(kx,ky);x.lineTo(fx,fy);x.stroke();
  x.lineWidth=2*S;for(var f=-1;f<=1;f++){var ta=fa+f*.45;x.beginPath();x.moveTo(fx,fy);x.lineTo(fx+Math.cos(ta)*6*S,fy+Math.sin(ta)*6*S);x.stroke()}}
function gills(t){var p=pts[0],a=segAng(0),HS=S*HM;
  for(var side=-1;side<=1;side+=2)for(var g=0;g<3;g++){
    var base=a+side*(1.7+g*.36),r=22*HS,bx=p.x+Math.cos(a)*(-6*HS)+Math.cos(base)*r,by=p.y+Math.sin(a)*(-6*HS)+Math.sin(base)*r;
    var sway=Math.sin(t*.0016+g*1.1+side)*.16+Math.sin(phase*.5)*.04,ga=base+side*(-.25)-sway*side,len=(26-g*2)*HS;
    var ex=bx+Math.cos(ga)*len,ey=by+Math.sin(ga)*len,cx=bx+Math.cos(ga+side*.4)*len*.55,cy=by+Math.sin(ga+side*.4)*len*.55;
    x.strokeStyle=AXO_COLORS.gillCore;x.lineWidth=3.2*HS;x.lineCap='round';x.beginPath();x.moveTo(bx,by);x.quadraticCurveTo(cx,cy,ex,ey);x.stroke();
    x.strokeStyle=AXO_COLORS.gill;x.lineWidth=1.4*HS;
    for(var f=1;f<=7;f++){var q=f/8,qx=(1-q)*(1-q)*bx+2*(1-q)*q*cx+q*q*ex,qy=(1-q)*(1-q)*by+2*(1-q)*q*cy+q*q*ey,
      fl=(7-f*.5)*HS,fw=Math.sin(t*.003+f*.6+g)*.18;
      for(var s2=-1;s2<=1;s2+=2){var fa=ga+s2*(1.1+fw);x.beginPath();x.moveTo(qx,qy);x.lineTo(qx+Math.cos(fa)*fl,qy+Math.sin(fa)*fl);x.stroke()}}}}
function draw(t){
  x.clearRect(0,0,W,H);
  var real=pts,ampT=(mode===3?0:mode===2?1.2:4)*S*Math.min(1,.4+speed*.5);ampC+=(ampT-ampC)*.05;var amp=ampC;
  if(amp>.05){var dp=[];for(var q=0;q<N;q++){var aa=segAng(q),o=Math.sin(phase-q*.33)*amp*Math.pow(q/(N-1),1.3);dp.push({x:real[q].x+Math.cos(aa+Math.PI/2)*o,y:real[q].y+Math.sin(aa+Math.PI/2)*o})}pts=dp}
  drawBody(t);pts=real;
}
function drawBody(t){
  var lp=phase;
  leg(3,-1,lp);leg(3,1,lp+Math.PI);leg(10,-1,lp+Math.PI);leg(10,1,lp);
  var sp=sidePts(),L=sp[0],R=sp[1],i,a,f;
  x.fillStyle=AXO_COLORS.fin;x.beginPath();var st=9;
  for(i=st;i<N;i++){a=segAng(i);f=Math.sin((i-st)/(N-st)*Math.PI)*8*S+widths[i]*S;var px=pts[i].x+Math.cos(a-Math.PI/2)*f,py=pts[i].y+Math.sin(a-Math.PI/2)*f;i==st?x.moveTo(px,py):x.lineTo(px,py)}
  for(i=N-1;i>=st;i--){a=segAng(i);f=Math.sin((i-st)/(N-st)*Math.PI)*8*S+widths[i]*S;x.lineTo(pts[i].x+Math.cos(a+Math.PI/2)*f,pts[i].y+Math.sin(a+Math.PI/2)*f)}
  x.closePath();x.fill();
  var g=x.createLinearGradient(pts[0].x,pts[0].y,pts[N-1].x,pts[N-1].y);g.addColorStop(0,AXO_COLORS.body1);g.addColorStop(1,AXO_COLORS.body2);
  x.fillStyle=g;x.beginPath();smooth(L);var rr=R.slice().reverse();for(i=0;i<rr.length;i++)x.lineTo(rr[i][0],rr[i][1]);x.closePath();x.fill();
  x.strokeStyle=AXO_COLORS.belly;x.globalAlpha=.5;x.lineWidth=3*S;x.beginPath();smooth(pts.slice(2,16).map(function(p){return [p.x,p.y]}));x.stroke();x.globalAlpha=1;
  gills(t);
  var h=pts[0],HS=S*HM;a=segAng(0);x.save();x.translate(h.x,h.y);x.rotate(a+Math.sin(phase)*.025);
  var hg=x.createRadialGradient(4*HS,-3*HS,2,0,0,32*HS);hg.addColorStop(0,HEADC);hg.addColorStop(1,AXO_COLORS.body1);
  x.fillStyle=hg;x.beginPath();x.ellipse(2*HS,0,30*HS,26*HS,0,0,Math.PI*2);x.fill();
  for(var e=-1;e<=1;e+=2){x.fillStyle=AXO_COLORS.eye;x.beginPath();x.arc(14*HS,e*13*HS,3.2*HS,0,7);x.fill();x.fillStyle='rgba(255,255,255,.8)';x.beginPath();x.arc(15*HS,e*13*HS-HS,HS,0,7);x.fill()}
  x.strokeStyle='rgba(0,20,60,.7)';x.lineWidth=1.6*HS;x.beginPath();x.arc(14*HS,0,15*HS,-.9,.9);x.stroke();
  x.restore();
}
// ---------- ALEX: interações ----------
var bub=document.createElement('div');bub.id='alexBub';document.body.appendChild(bub);
var POOLS={"facts": ["eu regenero partes do corpo. você tem a fisio, que também ajuda bastante 👀", "sou anfíbio, mas passo a vida toda na água. canoagem é quase meu habitat", "meu nome científico é <i>Ambystoma mexicanum</i>. pode me chamar de axolote mesmo", "vim dos canais de Xochimilco, no México. lá eu remava... digo, nadava", "fico com brânquias de filhote a vida toda. isso se chama neotenia", "minhas brânquias parecem cabelo, mas servem pra respirar. não penteia", "não confunde minhas brânquias com antenas kkkkk", "também respiro pela pele. no FBF você respira entre um soco e outro", "meu genoma tem uns 32 bilhões de pares de bases. e mesmo assim não sei jogar FBF", "meu nome vem de Xolotl, uma divindade asteca. sem pressão", "axolote rosa não é o único: nossas cores variam bastante", "sou salamandra, não peixe. nado igual, mas tenho patinhas", "pareço estar sorrindo, mas é só meu rosto mesmo", "fico com cara de filhote a vida toda. evoluir, pra mim, é na fisio 😄", "meu corpo tem praticamente um botão de CTRL+Z", "perdi uma parte? calma, tenho backup biológico", "se fosse videogame, regeneração seria minha habilidade passiva", "faço hidroterapia todos os dias. vida difícil", "meu treino de perna foi cancelado por falta de terra", "não estou lento, estou em modo economia de energia", "meu superpoder é regenerar. meu segundo superpoder é ficar parado", "minha vida é uma novela mexicana. literalmente", "sou pequeno no tamanho e grande no... genoma", "meu currículo: nadar, regenerar e falar besteira", "meu maior inimigo? água seca", "eu fui contratado como mascote e acabei virando palestrante"], "fisio": ["já fez sua fisio hoje? eu já nadei a minha", "sou pequeno, mas entendo de movimento", "nos jogos, a câmera transforma seu movimento em comando", "aqui no site eu só nado. a câmera só liga dentro dos jogos", "me explica o FisioSense? eu sou só um axolote", "exercício repetitivo cansa. exercício que vira jogo, nem tanto", "cada movimento conta. até o meu, que é só nadar", "mova. jogue. evolua. eu tô na parte do mova", "você veio pelo projeto ou pelo FBF?", "eu ouvi FBF?",  "calma, eu tô processando... processamento concluído: joga FBF", "minha recuperação é regeneração. a sua pode ser fisioterapia", "movimento detectado. diagnóstico: você clicou no axolote", "FisioSense: recuperação. eu: regeneração. equipe completa", "meu treino é nadar. meu cardio é nadar mais rápido", "seu treino tem repetição. minha vida também: nadar, comer, dormir", "FBF + CanoeingSense = movimento em dobro", "do jab para a remada, o movimento é o protagonista", "dois jogos, um axolote e nenhuma responsabilidade", "tecnologia analisa. atleta executa. axolote comenta", "FBF no chão, CanoeingSense na água. eu nos dois"], "fbf": ["no FBF, a câmera reconhece seus socos e a sua defesa alta", "defesa alta! mãos no rosto, igual no FBF", "luva esquerda vermelha, direita azul. não confunde", "o FBF mede seu tempo de reação. o meu é... lento", "o treinador do FBF não perdoa reflexo lento", "jab, direto, defesa alta. repete", "com essas patinhas meu jab é fraco. joga FBF por mim", "meu jab é tão curto que precisa de GPS", "meu direto virou indireto", "fui dar um uppercut e acertei meu próprio nariz", "eu tento fazer esquiva, mas só consigo nadar para o lado", "reflexo rápido? só quando aparece comida", "se eu tivesse luvas, seriam tamanho P de aquário", "o FBF mede seu reflexo. eu meço a distância até a comida", "FBF.exe carregando... patinhas insuficientes", "defesa alta ativada. cobertura: 1 olho", "você soca, eu nado. cada um com seu esporte", "já jogou FBF hoje? não vale responder clicando em mim"], "canoa": ["no CanoeingSense, a câmera acompanha sua remada 👀", "canoa e caiaque não são iguais: na canoa o remo tem uma pá, no caiaque tem duas", "com essas patinhas eu não alcanço o remo", "a canoagem é esporte olímpico. eu sou só esporte de aquário", "na canoagem, equilíbrio é tudo. eu tenho a vantagem de já estar na água", "o tronco também trabalha na remada, não só os braços", "o lado da remada muda o caminho da canoa. por isso o jogo pede esquerda e direita", "no CanoeingSense, ritmo de remada também conta ponto", "equilíbrio + coordenação + técnica = boa remada", "já remou hoje? as portas do percurso estão esperando", "não adianta remar só de um lado. a canoa vai rodar", "canoagem é meu esporte. só falta alguém me dar um remo", "remo? pensei que era comida", "se eu entrar na canoa, ela vira um aquário", "remada de um lado: ok. remada do outro: giro de 360°", "se a canoa virar, pelo menos eu estou preparado", "minha velocidade máxima é “calma aí”", "eu não consigo remar, mas posso dar apoio moral", "CanoeingSense: análise de técnica. axolote: análise de lanche", "o Felipe fez o jogo da canoa. eu só fico olhando a água", "o Felipe colocou a canoa na água. eu já estava aqui"], "humor":["prazer, Alex. o axolote, não o seu primo","Alex, o axolote, à disposição. menos às segundas","trabalho em home office. home aquário, no caso", "não clica com força, eu sou sensível", "café? não. só água mesmo", "eu sorrio assim desde que nasci. não tô tramando nada", "o site é bonito, mas o mascote é melhor", "se o site travar, eu finjo que foi de propósito", "pausa pra hidratação. ah, eu já tô na água", "você rola a página, eu faço o trabalho pesado", "eu deveria estar num aquário, mas preferi a internet", "meu cardio é atravessar essa página inteira", "fui contratado sem entrevista. só pelo sorriso", "não aceito críticas. só cliques", "se eu sumir, é só rolar a página. eu volto", "não estou perdido. estou explorando o site"],"equipe":["o Lucas me programou numa madrugada de domingo, às 02:10", "se eu travar, a culpa é do Lucas. se eu funcionar, sou só eu mesmo", "o Lucas escreveu meu código. as piadas ruins também foram ele", "o Lucas disse que eu ia ser simples. olha eu aqui falando", "o Felipe desenhou meu visual. por isso eu sou bonito assim", "minhas brânquias? design do Felipe", "o Felipe cuidou do meu design e do jogo da canoa. o cara é anfíbio também", "certo dia fui pescado por um dos devs, um tal de Kauan", "o Kauan deu umas ideias. algumas eram até boas",  "Lucas, Felipe e Kauan. e nenhum chega às minhas patas"]},SEQ={"10": "você ainda está clicando em mim?", "12": "de novo?", "15": "você realmente gosta desse axolote", "18": "eu sabia que você ia clicar", "20": "pare de clicar em mim", "21": "...", "22": "ok, pode clicar mais uma vez", "30": "isso já está ficando estranho", "33": "quantas vezes você pretende clicar?", "37": "clique número 37 detectado", "40": "sistema: usuário obcecado pelo axolote", "47": "continua... tem uma surpresa no clique 100", "50": "metade do caminho. de quê? você vai ver", "61": "você deveria estar olhando o projeto", "62": "mas obrigado pelo clique", "70": "você realmente não tem mais nada pra fazer?", "75": "estou começando a conhecer você pelo clique", "80": "isso já virou treino de dedo", "85": "seu dedo está fazendo mais exercício que eu", "90": "quase lá... eu acho", "95": "5 cliques restantes. boa sorte", "99": "UM. ÚLTIMO. CLIQUE.", "100": "🎉 100 cliques! você ganhou um axolote dourado ✨"},clicks=0,bags={};
function pick(name){var b=bags[name];if(!b||!b.length){b=bags[name]=POOLS[name].slice();for(var i=b.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),tt=b[i];b[i]=b[j];b[j]=tt}}return b.pop()}
function context(){var g=document.getElementById('game'),r=g.getBoundingClientRect();
  if(r.top<innerHeight*.6&&r.bottom>innerHeight*.4)return document.getElementById('g-canoa').classList.contains('on')?'canoa':'fbf';return null}
function nextLine(){clicks++;if(SEQ[clicks]){if(clicks===100)goGold();return SEQ[clicks]}
  var c=context(),W0={facts:3,fisio:1.5,fbf:2,canoa:2,equipe:2.2,humor:2};if(c)W0[c]*=2;var tot=0,k;for(k in W0)tot+=W0[k];var r=Math.random()*tot;for(k in W0){r-=W0[k];if(r<=0)return pick(k)}return pick('facts')}
function goGold(){AXO_COLORS.body1='#FFD54A';AXO_COLORS.body2='#B8860B';AXO_COLORS.belly='#FFF1B0';AXO_COLORS.gill='rgba(255,200,60,.6)';AXO_COLORS.gillCore='rgba(255,190,40,.95)';AXO_COLORS.fin='rgba(255,200,80,.3)';HEADC='#FFF4C2'}
var bubT=0,cur=null,curT=0,poked=0;
function say(txt,ms){if(!ms){var n=txt.replace(/<[^>]+>/g,'').length;ms=Math.max(2200,Math.min(7000,1500+n*60))}bub.innerHTML='<small>'+(Math.random()<.3?'ALEX · O AXOLOTE':'ALEX')+'</small>'+txt;bub.classList.add('on');bubT=performance.now()+(ms||2600)}
function placeBub(){if(!bub.classList.contains('on'))return;if(performance.now()>bubT||mode===3){bub.classList.remove('on');return}
  var h=pts[0],bw=bub.offsetWidth,bx=Math.max(10,Math.min(W-bw-10,h.x-bw/2)),by=h.y-46*S*HM-bub.offsetHeight;if(by<80)by=h.y+40*S*HM;bub.style.transform='translate('+bx+'px,'+by+'px)'}
document.addEventListener('click',function(e){if(e.target.closest('a,button,input,textarea,select,.gtab,#intro'))return;if(mode!==0)return;
  var cx=e.clientX,cy=e.clientY,hit=false,TM=matchMedia('(pointer:coarse)').matches?1.7:1;for(var i=0;i<14;i++){if(Math.hypot(pts[i].x-cx,pts[i].y-cy)<(i===0?38*S*HM:22*S)*TM){hit=true;break}}
  if(hit){poked=performance.now();speed=Math.max(speed,2.4);tv+=(Math.random()<.5?-1:1)*.03;say(nextLine());cur=null}
  else{cur=[cx,cy];curT=performance.now()+3500;var r=document.createElement('div');r.className='alex-rip';r.style.left=cx+'px';r.style.top=cy+'px';document.body.appendChild(r);setTimeout(function(){r.remove()},1100)}});
// cursor vira "mãozinha" quando passa por cima dele
addEventListener('mousemove',function(e){if(mode!==0)return;var on=false;for(var i=0;i<14;i++){if(Math.hypot(pts[i].x-e.clientX,pts[i].y-e.clientY)<(i===0?38*S*HM:22*S)){on=true;break}}document.documentElement.style.cursor=on?'pointer':''},{passive:true});
function curious(k){if(!cur||mode!==0)return 0;if(performance.now()>curT||Math.hypot(cur[0]-hx,cur[1]-hy)<30*S){cur=null;return 0}
  var want=Math.atan2(cur[1]-hy,cur[0]-hx),d=Math.atan2(Math.sin(want-ang),Math.cos(want-ang));speed+=(1.3-speed)*.01*k;return d*.0035}
function loop(t){var dt=Math.min(t-last,48);last=t;step(dt,t);draw(t);placeBub();if(!reduce)requestAnimationFrame(loop)}
document.addEventListener('visibilitychange',function(){last=performance.now()});
if(reduce){draw(0)}else requestAnimationFrame(loop);
})();
