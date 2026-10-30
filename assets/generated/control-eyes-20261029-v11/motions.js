export const BODY_MOTIONS={
 twist:{label:'扭身展示',duration:7.2},
 lean:{label:'左右倾身',duration:6.4},
 shy:{label:'害羞摇摆',duration:6},
 showcase:{label:'综合展示',duration:12}
};
const smooth=value=>{value=Math.max(0,Math.min(1,value));return value*value*(3-2*value);};
export function sampleBodyMotion(kind,time,loop=true,gain=1){
 const definition=BODY_MOTIONS[kind];if(!definition||time<0)return{pose:{},done:false};
 const duration=definition.duration,done=!loop&&time>=duration,t=loop?time%duration:Math.min(time,duration);
 const envelope=smooth(time/.65)*(loop?1:smooth((duration-t)/.7))*gain,phase=2*Math.PI*t/duration,s=Math.sin(phase),c=Math.sin(phase+.35);
 let pose;
 if(kind==='twist')pose={bodyAngleX:6.8*s,bodyAngleZ:2*Math.sin(phase*2),angleX:-8.5*s,angleZ:-1.2*s,poseArmL:1.8*s,poseArmR:-1.5*s,poseSkirt:1.1*s,poseApron:-.65*s,poseTail:2.4*s,poseTailMid:3*Math.sin(phase+.6)};
 else if(kind==='lean')pose={bodyAngleZ:5.2*s,bodyAngleX:2.4*s,angleZ:-3.2*s,angleY:1.5*Math.sin(phase*2),poseArmL:1.6*s,poseArmR:1.6*s,poseTail:-2*s,poseSkirt:1.4*s};
 else if(kind==='wave')pose={bodyAngleZ:-1.2*s,angleZ:1.6*s,angleX:2.5*Math.sin(phase*2),poseTail:1.5*Math.sin(phase)};
 else if(kind==='shy')pose={bodyAngleX:3.3*s,bodyAngleZ:1.9*s,angleX:-5.3*s,angleY:-2.5,angleZ:1.6*s,poseArmL:1.4*s,poseArmR:-1.4*s,poseTail:2.8*c,poseTailMid:3.2*Math.sin(phase+.8),poseSkirt:.6*s};
 else pose={bodyAngleX:6*Math.sin(phase*2),bodyAngleZ:3*s,angleX:17*Math.sin(phase*2),angleY:5*Math.sin(phase*3),angleZ:-2.4*s,poseArmL:2.2*c,poseArmR:-2.5*c,poseElbowL:2*s,poseElbowR:-2*s,poseTail:4*c,poseTailMid:4.5*Math.sin(phase+.7),poseSkirt:1.3*s,poseApron:-.8*s};
 return{pose:Object.fromEntries(Object.entries(pose).map(([key,value])=>[key,value*envelope])),done,time:t,duration,label:definition.label};
}
