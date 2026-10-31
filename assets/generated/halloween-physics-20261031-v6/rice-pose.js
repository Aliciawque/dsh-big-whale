import{ricePose,rigidRiceFrame}from'../control-body-20261030-v16/rice-frame.js';
const clamp=x=>Math.max(0,Math.min(1,x));
let lastPose,lastGeometry,lastFrame;
export function witchRiceFrame(geometry,p){
 if(lastPose!==p||lastGeometry!==geometry){lastPose=p;lastGeometry=geometry;lastFrame=rigidRiceFrame((x,y)=>geometry.deformPart(x,y,geometry.baseWeights(x,y,0),p,{gain:0},{kind:'body'},[0,0]));}
 return lastFrame;
}
export function createWitchRiceState(){
 let mix=0;
 return{update(wanted,dt){const target=wanted?1:0;mix=dt>0?mix+(target-mix)*(1-Math.exp(-Math.min(dt,.1)/(wanted?.12:.17))):target;if(Math.abs(mix-target)<.001)mix=target;return clamp(mix);}};
}
export function createWitchRiceArtwork(rig,geometry){
 const transition=createWitchRiceState();
 return{prepare(action,dt,p){const mix=transition.update(Boolean(action?.rice),dt),pose={hwRiceBackVisible:mix,hwRiceFrontVisible:mix,hwLanternVisible:(p.hwLanternVisible??1)*(1-mix)};for(const key of['upperArmL','upperArmR','sleeveL','sleeveR','cuffLBack','cuffLFront','cuffRBack','cuffRFront'])pose['hwVisible_'+key]=1-mix;if(mix>0)Object.assign(pose,ricePose(p,rig.layered.bodyFollow));return{witchRice:true,rice:mix>0,requested:Boolean(action?.rice),mix,pose};},draw(context,p,state){const frame=witchRiceFrame(geometry,p);return{kind:state.mix>0?'rice':null,riceMix:state.mix,requested:state.requested,source:'witch-rice-pose.png',rigid:state.mix>0,bowlWidth:252,depthLayers:['rear-arms-under-cape','bowl-and-wrists-in-front'],...frame};}};
}
