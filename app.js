const fallback = {
  date:new Date().toISOString().slice(0,10),
  question:"Which Eagles player recorded the franchise's first 10-sack season?",
  options:["Reggie White","Clyde Simmons","Jerome Brown","Brandon Graham"],
  correct:0,
  explanation:"Reggie White was the Eagles' dominant pass rusher and reached double-digit sacks during his Philadelphia career."
};
let daily = null, selected = null, answered = false;

const $ = id => document.getElementById(id);
const today = () => new Date().toLocaleDateString("en-CA");

function loadStats(){
  const s=JSON.parse(localStorage.getItem("eaglesStats")||'{"streak":0,"best":0,"played":0,"correct":0,"last":""}');
  $("streak").textContent=s.streak; $("best").textContent=s.best; $("played").textContent=s.played;
  $("accuracy").textContent=s.played?Math.round(s.correct/s.played*100)+"%":"—";
  return s;
}
function saveResult(ok){
  const s=loadStats(), d=today();
  if(s.last===d)return;
  const yesterday=new Date(); yesterday.setDate(yesterday.getDate()-1);
  const y=yesterday.toLocaleDateString("en-CA");
  s.streak=s.last===y?s.streak+1:1; s.best=Math.max(s.best,s.streak);
  s.played++; if(ok)s.correct++; s.last=d;
  localStorage.setItem("eaglesStats",JSON.stringify(s)); loadStats();
}
async function getDaily(){
  try{
    const r=await fetch("data/today.json?"+Date.now()); if(!r.ok)throw 0;
    return await r.json();
  }catch(e){return fallback}
}
function render(){
  $("dateLabel").textContent=daily.date===today()?"TODAY":daily.date;
  $("question").textContent=daily.question;
  $("choices").innerHTML="";
  daily.options.forEach((x,i)=>{
    const b=document.createElement("button"); b.className="choice"; b.textContent=String.fromCharCode(65+i)+". "+x;
    b.onclick=()=>{if(answered)return;selected=i;document.querySelectorAll(".choice").forEach(c=>c.classList.remove("selected"));b.classList.add("selected");$("submit").disabled=false};
    $("choices").appendChild(b);
  });
}
$("submit").onclick=()=>{
  if(selected===null||answered)return; answered=true;
  const ok=selected===daily.correct; saveResult(ok);
  document.querySelectorAll(".choice").forEach((b,i)=>{if(i===daily.correct)b.classList.add("correct");if(i===selected&&!ok)b.classList.add("wrong")});
  $("result").className="result "+(ok?"good":"bad");
  $("result").innerHTML=ok?`<strong>🦅 Nailed it!</strong><br>${daily.explanation}`:`<strong>Not this time.</strong><br>${daily.explanation}`;
  $("submit").textContent="ANSWER LOCKED"; $("submit").disabled=true;
};
async function share(){
  const text=`🦅 Eagles Daily Challenge\n\n${daily.question}\n\n${daily.options.map((x,i)=>String.fromCharCode(65+i)+". "+x).join("\n")}\n\nCan you get today's Eagles question right?`;
  if(navigator.share) await navigator.share({title:"Eagles Daily Challenge",text});
  else await navigator.clipboard.writeText(text), alert("Question copied — answer not included!");
}
$("shareBtn").onclick=share; $("shareTop").onclick=share;
(async()=>{loadStats();daily=await getDaily();render()})();