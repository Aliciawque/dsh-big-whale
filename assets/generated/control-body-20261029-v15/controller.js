import {authoredJoints,ARM_REGISTRATION} from './arm-geometry.js';
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*x*(10+x*(-15+6*x));};
export const WAVE_DURATION=7.2;
export function createAuthoredWaveController(){
 let progress=0,phase=0;
 return{update(action,dt){
  const reference=Boolean(action?.reference),wanted=action?.kind==='wave'&&!action?.rice;
  if(wanted)phase=action.time??0;
  const t=phase%WAVE_DURATION,target=reference?1:wanted?ease(t/2.0)*ease((WAVE_DURATION-t)/2.2):0;
  progress=reference?1:progress+(target-progress)*(dt>0?1-Math.exp(-dt/(wanted?.10:.45)):1);
  if(progress<.0001)progress=0;
  const motion=reference?0:progress*ease((t-1)/.7)*ease((WAVE_DURATION-t)/1.4);
  const pose={authoredWaveProgress:progress,authoredWaveWrist:7*Math.sin(phase*Math.PI*1.6)*motion,authoredWaveElbow:1.2*Math.sin(phase*Math.PI*.8)*motion,authoredWaveShoulder:.6*Math.sin(phase*Math.PI*.8)*motion};
  const waveOpacity=ease((progress-.12)/.58),handoff=clamp((progress-.20)/.45),palmAuthored=handoff>=.5;
  pose.restPalmWidth=palmAuthored?0:1-ease(handoff*2);pose.wavePalmWidth=palmAuthored?ease(handoff*2-1):0;

  return{waveOpacity,palmAuthored,kind:action?.rice?'rice':wanted||progress>0||reference?'wave':null,rice:Boolean(action?.rice),pose,handAlpha:0,hideLeft:Boolean(action?.rice)||waveOpacity>.999,hideRight:Boolean(action?.rice),framing:progress*.35,reference,phase};
 }};
}
export async function createPoseArtwork(rig,geometry){
 const rice=new Image();rice.src=new URL('../control-room-performance-20261029/pose-art/rice-hold-v1.png',import.meta.url);await rice.decode();
 const controller=createAuthoredWaveController(),torsoWeight=geometry.baseWeights(470,500,0);
 const project=(x,y,P)=>geometry.deformBase(x,y,torsoWeight,{...P,handAngle:0,armAngle:0},{gain:0},[0,0]);
 return{
  prepare:(action,dt)=>controller.update(action,dt),
  draw(context,P,state){
   if(state.rice){
    const anchor=project(470,500,P),right=project(471,500,P),down=project(470,501,P),ex=[right[0]-anchor[0],right[1]-anchor[1]],ey=[down[0]-anchor[0],down[1]-anchor[1]];
    context.save();context.transform(ex[0],ex[1],ey[0],ey[1],anchor[0]-ex[0]*470-ey[0]*500,anchor[1]-ex[1]*470-ey[1]*500);
    const crop=[36,510,870,680],scale=.4,offset=[282,196];context.drawImage(rice,...crop,crop[0]*scale+offset[0],crop[1]*scale+offset[1],crop[2]*scale,crop[3]*scale);context.restore();
    return{kind:'rice',bowlWidth:252,source:'rice-hold-v1.png'};
   }
   return{kind:state.kind,opacity:state.palmAuthored?1:0,palmWidth:state.palmAuthored?state.pose.wavePalmWidth:state.pose.restPalmWidth,sharedSkeleton:true,continuousNativeSleeve:true,source:'native-sleeve-original-approved-palm',handChoice:'large',side:'viewer-left',joints:authoredJoints(P),progress:state.pose.authoredWaveProgress,wristSwing:state.pose.authoredWaveWrist,framing:state.framing,reference:state.reference,registration:ARM_REGISTRATION.target,scaleWithPose:false};
  }
 };
}

