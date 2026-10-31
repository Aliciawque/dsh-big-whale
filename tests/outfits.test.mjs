import test from 'node:test';import assert from 'node:assert/strict';
import {createOutfitSwitcher} from '../assets/generated/dsh-companion-20261030/outfits.js';
const entry=()=>({model:{destroy(){}},engine:{remove(){}}});
test('outfit changes are cached and only an explicit witch transition speaks',async()=>{
 let loads=0;const events=[],s=createOutfitSwitcher({...entry(),load:async()=>{loads++;return entry();},onChange:e=>events.push(e)});
 assert.equal((await s.select('witch',false)).announce,false);assert.equal((await s.select('witch',true)).changed,false);
 await s.select('maid',true);assert.equal((await s.select('witch',true)).announce,true);assert.equal(loads,1);assert.equal(events.filter(e=>e.announce).length,1);
});
test('a superseded slow load cannot apply an outfit or play its greeting',async()=>{
 let finish;const events=[],s=createOutfitSwitcher({...entry(),load:()=>new Promise(resolve=>{finish=resolve;}),onChange:e=>events.push(e)});
 const pending=s.select('witch',true);await Promise.resolve();await s.select('maid',true);finish(entry());assert.equal((await pending).stale,true);assert.equal(s.selected,'maid');assert.ok(events.every(e=>!e.announce));
});
test('a failed load can be retried',async()=>{
 let failed=true;const s=createOutfitSwitcher({...entry(),load:async()=>{if(failed){failed=false;throw Error('Missing asset');}return entry();}});
 await assert.rejects(s.select('witch',true));assert.equal(s.selected,'maid');assert.equal((await s.select('witch',true)).announce,true);
});
