import test from 'node:test';import assert from 'node:assert/strict';
import {execFileSync,spawn} from 'node:child_process';import {mkdtempSync,readFileSync,existsSync,rmSync,statSync} from 'node:fs';import {tmpdir} from 'node:os';import path from 'node:path';
import {createCompanionState} from '../lib/state.mjs';
import * as map from '../lib/claude-code-events.mjs';

const kinds=s=>s.snapshot().signals.map(item=>item.kind);
const play=(s,lists)=>{for(const events of lists)for(const event of events)s.dispatch('cc',event,{});};

test('a Claude Code turn with an approval and a compaction drives the companion like a DSH session',()=>{
 const s=createCompanionState();
 play(s,[map.turnStarted(),map.toolStarted('Bash','t1')]);assert.equal(s.snapshot().status,'working');
 assert.equal(map.isPersonAsked({tool_use_id:'t1',approver:'person'},{decision:'ask'}),true);
 play(s,[map.approvalAsked('t1')]);assert.equal(s.snapshot().status,'waiting');
 play(s,[map.toolFinished('t1',{result:{}},true)]);assert.equal(s.snapshot().status,'thinking');
 play(s,[map.compactionStarted('cc:1')]);assert.equal(s.snapshot().status,'compacting');assert.equal(s.snapshot().compactionActive,true);
 play(s,[map.compactionFinished('cc:1'),map.turnFinished('answer')]);assert.equal(s.snapshot().status,'success');
 assert.deepEqual(kinds(s),['task-start','tool-start','waiting','compaction','success']);
});

test('only an errored result is a failure; refusals, interrupts and precomputes are not',()=>{
 assert.equal(map.toolFinished('a',{deny:'no'}).at(-1).data.message.isError,false);
 assert.equal(map.toolFinished('a',{result:{},isError:true}).at(-1).data.message.isError,true);
 assert.deepEqual(map.turnFinished('aborted')[0].data.reason,{kind:'interrupted'});
 assert.deepEqual(map.turnFinished('error')[0].data.reason,{kind:'error'});
 assert.equal(map.isRealCompaction({trigger:'precompute'}),false);
 assert.equal(map.isRealCompaction({trigger:'auto',agentId:'sub'}),false);
 assert.equal(map.isRealCompaction({trigger:'auto'}),true);
 assert.equal(map.isPersonAsked({tool_use_id:'x'},{decision:'ask'}),false);
});

function startCompanion(home,env={}){
 const child=spawn(process.execPath,[path.resolve('bin/claude-code-companion.mjs')],{env:{...process.env,DSH_HOME:home,BIG_WHALE_NO_DESKTOP:'1',...env},stdio:['ignore','pipe','pipe']});
 const ready=new Promise((resolve,reject)=>{let out='';child.stdout.on('data',d=>{out+=d;const line=out.split('\n').find(l=>l.includes('"ready"'));if(line)resolve(JSON.parse(line));});child.once('exit',code=>reject(Error('exited '+code)));});
 return {child,ready};
}
const exited=child=>new Promise(resolve=>child.exitCode!==null?resolve(child.exitCode):child.once('exit',resolve));

test('the standalone companion takes token-signed events, refuses others, and stays single',async()=>{
 const home=mkdtempSync(path.join(tmpdir(),'big-whale-'));
 const {child,ready}=startCompanion(home,{BIG_WHALE_IDLE_EXIT_MS:'1000'});
 try{
  const {origin,page}=await ready;
  const runtime=JSON.parse(readFileSync(path.join(home,'plugin-data/big-whale/claude-code.json'),'utf8'));
  assert.equal(runtime.origin,origin);
  if(process.platform!=='win32')assert.equal(statSync(path.join(home,'plugin-data/big-whale/claude-code.json')).mode&0o077,0,'the runtime file holds the token: owner only');
  else assert.doesNotMatch(execFileSync('icacls.exe',[path.join(home,'plugin-data/big-whale/claude-code.json')],{encoding:'utf8'}),/\(I\)/,'the Windows runtime file must not inherit broader ACLs');
  const post=(body,headers={})=>fetch(origin+'/whale-companion/event',{method:'POST',headers:{'content-type':'application/json','x-whale-token':runtime.token,...headers},body:JSON.stringify(body)});
  assert.equal((await post({session:'s',events:map.compactionStarted('s:1')},{'x-whale-token':'wrong'})).status,403);
  assert.equal((await post({session:'s',events:map.compactionStarted('s:1')},{'x-whale-token':'é'.repeat(runtime.token.length)})).status,403);
  assert.equal((await post({session:'s',events:[]},{origin:'https://evil.example'})).status,403);
  assert.equal((await post({session:'s',events:[{type:'x'.repeat(41)}]})).status,400);
  assert.equal((await post({session:'s',events:[...map.turnStarted(),...map.compactionStarted('s:1')]})).status,204);
  const state=await (await fetch(origin+'/whale-companion/state')).json();
  assert.equal(state.status,'compacting');assert.equal(state.compactionActive,true);assert.ok(state.signals.some(item=>item.kind==='compaction'));
  assert.equal((await fetch(page)).status,200);
  const second=startCompanion(home);second.ready.catch(()=>{});
  assert.equal(await exited(second.child),3);
  assert.equal(await Promise.race([exited(child),new Promise(resolve=>setTimeout(()=>resolve('timeout'),5000))]),0);
 }finally{if(child.exitCode===null)child.kill('SIGTERM');await exited(child);}
 assert.equal(existsSync(path.join(home,'plugin-data/big-whale/claude-code.json')),false);
 rmSync(home,{recursive:true,force:true});
});

test('the companion leaves on its own once no session has spoken for a while',async()=>{
 const home=mkdtempSync(path.join(tmpdir(),'big-whale-'));
 const {child,ready}=startCompanion(home,{BIG_WHALE_IDLE_EXIT_MS:'400'});
 await ready;
 assert.equal(await exited(child),0);
 assert.equal(existsSync(path.join(home,'plugin-data/big-whale/claude-code.lock')),false);
 rmSync(home,{recursive:true,force:true});
});
