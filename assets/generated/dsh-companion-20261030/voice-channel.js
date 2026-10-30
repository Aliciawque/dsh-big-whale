export function createVoiceChannel({role,onLost,fetcher=fetch}){
 const ownerId=crypto.randomUUID();let active=null,generation=0,timer=null;
 const stats={granted:0,blocked:0,duplicate:0,passive:0,lost:0};
 const post=async(operation,value)=>{const response=await fetcher('/whale-companion/voice/'+operation,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ownerId,...value}),keepalive:operation==='release',signal:AbortSignal.timeout(3000)});if(!response.ok)throw Error('VOICE_CHANNEL_UNAVAILABLE');return response.json();};
 const releaseLease=lease=>post('release',{leaseId:lease.leaseId}).catch(()=>{});
 function detach(){clearInterval(timer);timer=null;const previous=active;active=null;return previous;}
 return{
  async claim(request){
   const mine=++generation,previous=detach();if(previous)await releaseLease(previous);if(mine!==generation)return{granted:false,reason:'superseded'};
   const wait=request.source==='manual'?8000:request.source==='event'?(request.priority>=80?12000:1500):request.source==='click'?700:0;
   const until=Math.min(Date.now()+wait,request.expiresAt??Infinity);let result;
   try{do{result=await post('claim',{...request,role:role()});if(mine!==generation){if(result.granted)await releaseLease(result);return{granted:false,reason:'superseded'};}if(result.granted||result.reason!=='voice-busy'||Date.now()>=until)break;await new Promise(resolve=>setTimeout(resolve,250));}while(mine===generation);}catch{return{granted:false,reason:'voice-channel-unavailable'};}
   if(!result?.granted){stats.blocked++;if(result?.reason==='event-already-played')stats.duplicate++;if(result?.reason==='desktop-handles-events')stats.passive++;return result;}
   active=result;stats.granted++;timer=setInterval(async()=>{const lease=active;if(!lease)return;try{const checked=await post('heartbeat',{leaseId:lease.leaseId});if(active===lease&&!checked.granted){detach();stats.lost++;onLost();}}catch{if(active===lease){detach();stats.lost++;onLost();}}},1000);return result;
  },
  async release(){generation++;const previous=detach();if(previous)await releaseLease(previous);},
  snapshot(){return{held:Boolean(active),stats:{...stats}};}
 };
}
