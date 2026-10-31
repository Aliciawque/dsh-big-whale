import test from 'node:test';import assert from 'node:assert/strict';
import {companionLayout} from '../assets/generated/desktop-companion-20261030/layout.js';
import {bodyFramePlacement} from '../assets/generated/dsh-companion-20261030/body-frame.js';
const overlap=(a,b)=>Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>1e-7&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>1e-7;
test('menus avoid the character in 1260 viewport, monitor, size and position combinations',()=>{
 let count=0;
 for(const [width,height]of [[1920,1080],[1280,720],[750,812],[735,795],[390,844],[360,640],[640,360]])for(const offset of [0,1920])for(const size of [170,240,340])for(const mode of [1,1.3])for(const x of [0,.25,.5,.75,1])for(const y of [0,.5,1]){
  const area={x:offset,y:24,width,height},position={x:offset+x*width,y:24+y*height},saved={...position},w=size*mode,h=Math.round(size*1.78),closed=companionLayout(area,position,w,h),open=companionLayout(area,position,w,h,true);
  assert.deepEqual(position,saved);assert.deepEqual(companionLayout(area,position,w,h),closed);assert.ok(!overlap(open.body,open.menu));
  for(const r of [open.body,open.menu,...(open.icon?[open.icon]:[])]){assert.ok(r.x>=area.x&&r.y>=area.y);assert.ok(r.x+r.width<=area.x+width+1e-7&&r.y+r.height<=area.y+height+1e-7);}
  if(open.icon){assert.ok(!overlap(open.body,open.icon));assert.ok(!overlap(open.menu,open.icon));}count++;
 }assert.equal(count,1260);
});
test('both outfits preserve 400 body reference points throughout camera transitions',()=>{
 const image={width:941,height:1672};let count=0;
 for(const w of [170,240,340,442,1024])for(const h of [303,427,605,1080])for(const mix of [0,.1,.5,.9,1]){
  const a=bodyFramePlacement(w,h,image,undefined,mix),b=bodyFramePlacement(w,h,image,{x:0,y:-100,width:941,height:1772},mix);
  assert.equal(a.worldScale,b.worldScale);assert.equal(a.footBaseline,b.footBaseline);assert.deepEqual(a.bodyOrigin,b.bodyOrigin);
  for(const [x,y]of [[470,225],[470,340],[470,810],[470,1630]]){assert.ok(Math.hypot(a.x+x*a.width/941-b.x-x*b.width/941,a.y+y*a.height/1672-b.y-(y+100)*b.height/1772)<1e-8);count++;}
 }assert.equal(count,400);
});
