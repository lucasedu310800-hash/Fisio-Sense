(function(){
var demo=[["FBF · ROUND 02","DEFESA ALTA ✓","boa! mãos no rosto, defesa alta perfeita"],["FBF · ROUND 02","JAB ✓","reação de 0.38s. tá mais rápido que ontem"],["FBF · ROUND 03","QUASE","levanta um pouco mais o braço esquerdo"],["CANOEINGSENSE · PORTA 07","REMADA ✓","agora rema pela direita pra passar na porta"],["CANOEINGSENSE · PORTA 08","RITMO ✓","esse ritmo tá ótimo. mantém assim"],["FIM DA SESSÃO","+12% REAÇÃO","sessão concluída! sua reação melhorou 12% essa semana"]],k=0;
var g=document.getElementById('psGame'),c=document.getElementById('psCheck'),m=document.getElementById('psMsg'),b=m&&m.parentNode;
if(!m||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
setInterval(function(){k=(k+1)%demo.length;b.style.opacity=0;c.style.opacity=0;setTimeout(function(){g.textContent=demo[k][0];c.textContent=demo[k][1];m.textContent=demo[k][2];b.style.opacity=1;c.style.opacity=1},300)},3600);
})();
