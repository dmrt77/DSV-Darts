const fs=require('fs');
const EVENT=6637,PHASE=10217,TEAM='1.DSV Reutlingen Dartarossa';
const ROUNDS=Array.from({length:18},(_,i)=>95709+i);
const BASE='https://backend6.3k-darts.com/2k-backend6/api/v1/frontend';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function getJson(url){for(let n=0;n<3;n++){const r=await fetch(url,{headers:{accept:'application/json','user-agent':'Dartarossa-V20.1-GitHubSync/1.0'}});if(r.ok)return r.json();if(n===2)throw Error(`${r.status} ${url}`);await wait(1000*(n+1))}}
function matchAvg(p){const darts=Number(p?.darts||0),score=Number(p?.score||0);return darts>0?score*3/darts:null}
function mean(a){a=a.filter(Number.isFinite);return a.length?a.reduce((s,v)=>s+v,0)/a.length:null}
async function main(){let old={matches:[]};try{old=JSON.parse(fs.readFileSync('data/3k-sync.json','utf8'))}catch{}
 const out=[];
 for(let day=1;day<=18;day++){
  const roundId=ROUNDS[day-1];
  try{
   const rd=await getJson(`${BASE}/event/${EVENT}/phase/${PHASE}/round/${roundId}`);
   const m=(rd.matches||[]).find(x=>x.participantHome?.displayName===TEAM||x.participantGuest?.displayName===TEAM);
   if(!m){out.push({day,roundId,status:'SPIELFREI'});continue}
   const home=m.participantHome?.displayName,away=m.participantGuest?.displayName,ownHome=home===TEAM;
   const x={day,roundId,matchId:m.id,home,away,opponent:ownHome?away:home,status:m.statusCd,lastUpdate:m.lastUpdate||null};
   if(m.statusCd==='FINISH'&&m.hasPerformances){
    const rep=await getJson(`${BASE}/event/${EVENT}/match/${m.id}/report`);
    const games=Array.isArray(rep)?rep:(rep.matches||[]);
    const ha=games.map(g=>matchAvg(g.participantHome));
    const aa=games.map(g=>matchAvg(g.participantGuest));
    x.games=games.length;x.homeAvg=mean(ha);x.awayAvg=mean(aa);x.ownAvg=ownHome?x.homeAvg:x.awayAvg;x.oppAvg=ownHome?x.awayAvg:x.homeAvg;x.diff=x.ownAvg-x.oppAvg;x.result=ownHome?`${m.setsHome}:${m.setsAway}`:`${m.setsAway}:${m.setsHome}`;x.legs=ownHome?`${m.legsHome}:${m.legsAway}`:`${m.legsAway}:${m.legsHome}`;x.calculation='Mittelwert der Match-AVGs (score*3/darts)';
   }
   out.push(x);
  }catch(e){const keep=(old.matches||[]).find(x=>x.day===day);out.push(keep?{...keep,syncWarning:e.message}:{day,roundId,status:'FEHLER',syncWarning:e.message})}
 }
 const finished=out.filter(x=>Number.isFinite(x.ownAvg));
 const payload={schema:1,eventId:EVENT,phaseId:PHASE,teamName:TEAM,updatedAt:new Date().toISOString(),seasonAvg:mean(finished.map(x=>x.ownAvg)),matches:out};
 fs.mkdirSync('data',{recursive:true});fs.writeFileSync('data/3k-sync.json',JSON.stringify(payload,null,2)+'\n');console.log(`updated ${finished.length} finished matches`);
}
main().catch(e=>{console.error(e);process.exit(1)});
