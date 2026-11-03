import test from 'node:test';import assert from 'node:assert/strict';
import {createCompanionState} from '../lib/state.mjs';
const clock=()=>{let now=1000;const f=()=>now;f.advance=ms=>{now+=ms;};return f;};
const kinds=snapshot=>snapshot.signals.map(item=>item.kind);
test('a turn moves through thinking, working, waiting and success',()=>{
 const time=clock(),s=createCompanionState(time);
 s.dispatch('a',{type:'turn/start'});assert.equal(s.snapshot().status,'thinking');
 s.dispatch('a',{type:'tool/call',data:{callId:'1',name:'read'}});assert.equal(s.snapshot().status,'working');
 s.dispatch('a',{type:'approval/asked',data:{id:'p'}});assert.equal(s.snapshot().status,'waiting');
 s.dispatch('a',{type:'approval/decided',data:{id:'p'}});assert.equal(s.snapshot().status,'working');
 s.dispatch('a',{type:'tool/result',data:{message:{toolCallId:'1'}}});assert.equal(s.snapshot().status,'thinking');
 s.dispatch('a',{type:'turn/end',data:{reason:{kind:'completed'}}});assert.equal(s.snapshot().status,'success');
 assert.deepEqual(kinds(s.snapshot()),['task-start','tool-start','waiting','success']);
 time.advance(8001);assert.equal(s.snapshot().status,'idle');
});
test('compaction holds rice once per compaction id and survives other events',()=>{
 const s=createCompanionState(clock());
 s.dispatch('a',{type:'turn/start'});
 s.dispatch('a',{type:'compaction/start',data:{compactionId:'c1'}});
 s.dispatch('a',{type:'compaction/start',data:{compactionId:'c1'}});
 s.dispatch('a',{type:'tool/call',data:{callId:'1'}});
 assert.equal(s.snapshot().status,'compacting');assert.equal(s.snapshot().compactionActive,true);
 s.dispatch('a',{type:'compaction/end',data:{compactionId:'c1'}});
 assert.equal(s.snapshot().status,'working');
 assert.equal(kinds(s.snapshot()).filter(kind=>kind==='compaction').length,1);
});
test('a failed tool announces an error once and a retry on the next call',()=>{
 const s=createCompanionState(clock());
 s.dispatch('a',{type:'turn/start'});s.dispatch('a',{type:'tool/call',data:{callId:'1'}});
 s.dispatch('a',{type:'tool/result',data:{message:{toolCallId:'1',isError:true}}});
 s.dispatch('a',{type:'tool/result',data:{message:{toolCallId:'1',isError:true}}});
 s.dispatch('a',{type:'tool/call',data:{callId:'2'}});
 assert.deepEqual(kinds(s.snapshot()),['task-start','tool-start','tool-error','retry']);
});
test('subagent sessions and unknown events are ignored',()=>{
 const s=createCompanionState(clock());
 s.dispatch('sub',{type:'turn/start'},{origin:'subagent'});s.dispatch('deep',{type:'turn/start'},{delegationDepth:1});s.dispatch('a',{type:'something/else'});
 assert.equal(s.snapshot().sessionKey,null);assert.equal(s.snapshot().revision,0);
});
