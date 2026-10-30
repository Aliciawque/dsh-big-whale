const eventClips={'task-start':'thinking','tool-start':'working',waiting:'approval',success:'success',error:'error','tool-error':'error',retry:'retry',compaction:'rice'};
const eventPriority={'task-start':20,'tool-start':25,waiting:80,success:75,error:85,'tool-error':85,retry:60,compaction:100};
export function createInteractionPolicy(clock=Date.now){
  let queue=[],seen=new Set(),boot=null,session=null,latest=null,enabled=true,lastOrdinary=-Infinity,lastProblem=-Infinity,clicks=[],rotation=0,focusRotation=0,focusUntil=0,quietUntil=0,dragging=false,lastDrag=-Infinity,dragRotation=0;
  function add(request){queue=queue.filter(item=>item.key!==request.key);queue.push(request);if(queue.length>8)queue.sort((a,b)=>b.priority-a.priority).splice(8);}
  const relevant=(request,state)=>{
    if(request.source==='drag')return dragging;
    if(request.source!=='event')return true;
    if(request.kind==='compaction')return true;
    if(['tool-error','retry'].includes(request.kind))return ['thinking','working','waiting','error'].includes(state?.status);
    return ({'task-start':'thinking','tool-start':'working',waiting:'waiting',success:'success',error:'error'})[request.kind]===state?.status;
  };
  return{
    configure(value){enabled=Boolean(value);if(!enabled)queue=queue.filter(item=>item.source!=='event');},
    ingest(state){
      const initial=boot!==state.bootId||session!==state.sessionKey;
      latest=state;
      if(boot!==state.bootId){boot=state.bootId;seen=new Set();queue=queue.filter(item=>item.source!=='event');}
      if(session!==state.sessionKey){session=state.sessionKey;queue=queue.filter(item=>item.source!=='event');}
      queue=queue.filter(item=>relevant(item,state));
      for(const signal of state.signals??[]){
        const id=String(state.bootId)+':'+signal.id;if(seen.has(id))continue;seen.add(id);
        if(!enabled||!eventClips[signal.kind]||signal.expiresAt<=clock())continue;
        if(initial&&signal.kind==='compaction'&&!state.compactionActive&&clock()-signal.at>4000)continue;
        const request={clipId:eventClips[signal.kind],kind:signal.kind,source:'event',priority:eventPriority[signal.kind],expiresAt:signal.expiresAt,key:'event-'+eventClips[signal.kind],signalId:id,notBefore:signal.kind==='task-start'?signal.at+600:signal.at};
        if(relevant(request,state))add(request);
      }
      if(seen.size>400)seen=new Set([...seen].slice(-200));
    },
    click(){
      const now=clock();clicks=clicks.filter(at=>now-at<12000);clicks.push(now);
      quietUntil=0;
      if(clicks.length>=5){
        if(now<focusUntil)return{count:clicks.length,kind:'nudge-silent'};
        focusUntil=now+22000;queue=queue.filter(item=>item.source!=='click');
        const clipId=['click-extra-5','click-focus','click-focus-2','click-focus-3','click-focus-4'][focusRotation++%5];
        add({clipId,source:'click',priority:95,expiresAt:now+8000,key:'click',notBefore:now});
        return{count:clicks.length,kind:'focus'};
      }
      const clipId=['click-hello','click-company','click-tickle','click-extra-1','click-extra-2','click-extra-3','click-extra-4','click-extra-5'][rotation++%8];
      add({clipId,source:'click',priority:65,expiresAt:now+5000,key:'click',notBefore:now});
      return{count:clicks.length,kind:'playful'};
    },
    drag(){
      const now=clock();dragging=true;
      if(now<quietUntil||now-lastDrag<6000)return{kind:'drag-silent'};
      lastDrag=now;const clipId=['drag-ho','drag-easy','drag-whee'][dragRotation++%3];
      add({clipId,source:'drag',priority:40,expiresAt:now+1200,key:'drag',notBefore:now});return{kind:'drag',clipId};
    },
    dragEnd(){dragging=false;queue=queue.filter(item=>item.source!=='drag');},
    manual(){quietUntil=0;queue=queue.filter(item=>item.source==='event'&&item.priority>=80);},
    next(active=null){
      const now=clock();queue=queue.filter(item=>item.expiresAt>now&&relevant(item,latest)&&!(item.source==='event'&&item.clipId==='error'&&now-lastProblem<7000));
      if(now<quietUntil)return null;
      const candidates=queue.filter(item=>(item.notBefore??0)<=now).sort((a,b)=>b.priority-a.priority);
      const request=candidates.find(item=>{
        if(active&&!(active.source==='click'&&item.priority>=95))return false;
        return item.source!=='event'||item.priority>=60||now-lastOrdinary>=14000;
      });
      if(!request)return null;
      queue.splice(queue.indexOf(request),1);
      if(request.source==='event'&&request.priority<60)lastOrdinary=now;
      if(request.source==='event'&&request.clipId==='error')lastProblem=now;
      return request;
    },
    clear(){queue=[];},
    isCurrent(request){return request.expiresAt>clock()&&relevant(request,latest);},
    suspend(ms=10000){queue=[];quietUntil=clock()+ms;},
    snapshot(){return{enabled,queued:queue.map(({clipId,source,priority})=>({clipId,source,priority})),clickCount:clicks.filter(at=>clock()-at<12000).length,focusCooldown:Math.max(0,focusUntil-clock())};}
  };
}
