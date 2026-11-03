import test from 'node:test';import assert from 'node:assert/strict';
import {createAudioCoordinator} from '../lib/audio-coordinator.mjs';
const clock=()=>{let now=0;const f=()=>now;f.advance=ms=>{now+=ms;};return f;};
const request=(ownerId,extra={})=>({ownerId,role:'desktop',source:'manual',clipId:'greeting',duration:2,...extra});
test('one voice at a time; the lease is released or expires',()=>{
 const time=clock(),c=createAudioCoordinator(time),first=c.claim(request('a'));
 assert.equal(first.granted,true);assert.equal(c.claim(request('b')).reason,'voice-busy');
 c.release({ownerId:'a',leaseId:first.leaseId});assert.equal(c.claim(request('b')).granted,true);
 time.advance(5001);assert.equal(c.claim(request('a')).granted,true);
});
test('a heartbeat keeps the lease only for its owner',()=>{
 const time=clock(),c=createAudioCoordinator(time),lease=c.claim(request('a',{duration:10}));
 assert.equal(c.heartbeat({ownerId:'b',leaseId:lease.leaseId}).granted,false);
 time.advance(11000);assert.equal(c.heartbeat({ownerId:'a',leaseId:lease.leaseId}).granted,true);
 time.advance(6000);assert.equal(c.heartbeat({ownerId:'a',leaseId:lease.leaseId}).reason,'lease-lost');
});
test('an event plays once, and only on the desktop while it runs',()=>{
 const time=clock(),c=createAudioCoordinator(time),event=role=>request(role,{role,source:'event',signalId:'boot:7'});
 assert.equal(c.claim(event('preview'),true).reason,'desktop-handles-events');
 const lease=c.claim(event('desktop'),true);assert.equal(lease.granted,true);c.release({ownerId:'desktop',leaseId:lease.leaseId});
 assert.equal(c.claim(event('desktop'),true).reason,'event-already-played');
 time.advance(120001);assert.equal(c.claim(event('desktop'),true).granted,true);
});
test('malformed requests are refused',()=>{
 const c=createAudioCoordinator(clock());
 for(const bad of [null,request('a',{role:'other'}),request('a',{source:'x'}),request('a',{duration:0}),request('a',{duration:61}),request('x'.repeat(81))])assert.equal(c.claim(bad).reason,'invalid-request');
});
