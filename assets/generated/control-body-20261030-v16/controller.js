import {createPoseArtwork as createOriginalArtwork} from '../control-body-20261029-v15/controller.js';
import {ricePose,rigidRiceFrame} from './rice-frame.js';

export async function createPoseArtwork(rig,geometry){
 const original=await createOriginalArtwork(rig,geometry);
 const rice=new Image();rice.src=new URL('../control-room-performance-20261029/pose-art/rice-hold-v1.png',import.meta.url);await rice.decode();
 return {
  prepare(action,dt,p){
   const state=original.prepare(action,dt,p);
   if(state.rice)Object.assign(state.pose,ricePose(p,rig.layered.bodyFollow));
   return state;
  },
  draw(context,p,state){
   if(!state.rice)return original.draw(context,p,state);
   const frame=rigidRiceFrame((x,y)=>geometry.deformPart(x,y,geometry.baseWeights(x,y,0),p,{gain:0},{kind:'body'},[0,0]));
   context.save();context.transform(...frame.matrix);context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';
   const crop=[36,510,870,680],scale=.4,offset=[282,196];
   context.drawImage(rice,...crop,crop[0]*scale+offset[0],crop[1]*scale+offset[1],crop[2]*scale,crop[3]*scale);context.restore();
   return {kind:'rice',bowlWidth:252,source:'rice-hold-v1.png',rigid:true,...frame};
  }
 };
}
