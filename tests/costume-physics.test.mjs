import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {createCostumePhysics} from '../assets/generated/halloween-physics-20261031-v6/physics.js';
import {createLanternPhysics} from '../assets/generated/halloween-physics-20261031-v6/lantern-physics.js';
const data=JSON.parse(fs.readFileSync(new URL('../assets/generated/halloween-physics-20261031-v6/registration.json',import.meta.url)));
test('costume physics remains finite under fast direction changes and settles',()=>{
 const physics=createCostumePhysics(data.parts);let state;
 for(let i=0;i<3600;i++){const t=i/120,m=i<1200?1:0;state=physics.update({angleX:30*Math.sin(t*4)*m,angleY:25*Math.cos(t*3)*m,angleZ:12*Math.sin(t*5)*m,bodyAngleX:10*Math.sin(t*4)*m,bodyAngleZ:10*Math.cos(t*3)*m},1/120,true,2);assert.ok(Object.values(state.parameters).every(Number.isFinite));}
 assert.ok(Math.abs(state.parameters.hwHatYaw)<.001);assert.ok(Math.abs(state.parameters.hwHatPitch)<.001);
});
test('lantern lags the hand, remains bounded and settles after motion stops',()=>{
 const lantern=createLanternPhysics();let max=0,last;
 for(let i=0;i<3600;i++){const t=i/120,m=i<1200?1:0;last=lantern.update({x:200+30*Math.sin(t*4)*m,handAngle:.2*Math.sin(t*3)*m},1/120,true,1.1);assert.ok(Number.isFinite(last.angle));assert.ok(Math.abs(last.angle)<=.88*1.15+1e-7);max=Math.max(max,Math.abs(last.angle));}
 assert.ok(max>.1);assert.ok(Math.abs(last.angle)<.001);
});
