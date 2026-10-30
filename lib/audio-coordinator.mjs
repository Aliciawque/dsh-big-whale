import {randomUUID} from 'node:crypto';
export function createAudioCoordinator(clock=Date.now){
 let active=null;const seenEvents=new Map(),stats={granted:0,busy:0,duplicates:0,passivePreviews:0};
 function expire(){const now=clock();if(active&&active.expiresAt<=now)active=null;for(const [id,until]of seenEvents)if(until<=now)seenEvents.delete(id);}
 const matches=request=>active&&active.ownerId===request.ownerId&&active.leaseId===request.leaseId;
 return{
  claim(request,desktopRunning=false){
   expire();if(!request||typeof request.ownerId!=='string'||request.ownerId.length>80||!['desktop','preview'].includes(request.role)||!['event','manual','click','drag'].includes(request.source)||typeof request.clipId!=='string'||request.clipId.length>80||!Number.isFinite(request.duration)||request.duration<=0||request.duration>60)return{granted:false,reason:'invalid-request'};
   if(request.source==='event'&&desktopRunning&&request.role!=='desktop'){stats.passivePreviews++;return{granted:false,reason:'desktop-handles-events'};}
   const signalId=request.source==='event'&&typeof request.signalId==='string'?request.signalId.slice(0,160):null;
   if(signalId&&seenEvents.has(signalId)){stats.duplicates++;return{granted:false,reason:'event-already-played'};}
   if(active&&active.ownerId!==request.ownerId){stats.busy++;return{granted:false,reason:'voice-busy'};}
   const now=clock();active={ownerId:request.ownerId,leaseId:randomUUID(),role:request.role,source:request.source,clipId:request.clipId,signalId,startedAt:now,expectedEnd:now+request.duration*1000+1500,expiresAt:now+Math.max(5000,request.duration*1000+1500)};
   if(signalId){seenEvents.set(signalId,now+120000);if(seenEvents.size>400)seenEvents.delete(seenEvents.keys().next().value);}
   stats.granted++;return{granted:true,leaseId:active.leaseId,expiresAt:active.expiresAt};
  },
  heartbeat(request){expire();if(!matches(request))return{granted:false,reason:'lease-lost'};active.expiresAt=Math.max(active.expectedEnd,clock()+5000);return{granted:true,expiresAt:active.expiresAt};},
  release(request){expire();if(matches(request))active=null;return{released:true};},
  snapshot(){expire();return{busy:Boolean(active),active:active?{role:active.role,source:active.source,clipId:active.clipId,expiresAt:active.expiresAt}:null,stats:{...stats}};}
 };
}
