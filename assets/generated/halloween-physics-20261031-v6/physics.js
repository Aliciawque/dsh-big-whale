const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function createCostumePhysics(parts){
 const states=new Map(parts.map(p=>[p.key,{x:0,y:0,vx:0,vy:0}]));
 const follow=parts.find(p=>p.hatFollow)?.hatFollow??{yawAmplitude:1,pitchAmplitude:1,rollAmplitude:1,frequency:2,damping:1};
 const hat=[0,0,0],hatVelocity=[0,0,0];let hatInitialized=false;
 let previous=null,elapsed=0;
 return{
  reset(){for(const state of states.values())Object.assign(state,{x:0,y:0,vx:0,vy:0});previous=null;hatInitialized=false;hatVelocity.fill(0);},
  update(pose,dt,enabled=true,gain=1){
   const step=clamp(dt,0,.05),head=[pose.angleX??0,pose.angleY??0,pose.angleZ??0],body=[pose.bodyAngleX??0,pose.bodyAngleZ??0];
   const current=[...head,...body],velocity=previous&&step>0?current.map((v,i)=>(v-previous[i])/step):current.map(()=>0);
   previous=current;elapsed+=step;
   const hatBefore=[...hat],ratios=[follow.yawAmplitude,follow.pitchAmplitude,follow.rollAmplitude],substeps=Math.max(1,Math.ceil(step*240)),hs=step/substeps,hw=2*Math.PI*follow.frequency;
   for(let axis=0;axis<3;axis++){
    const target=head[axis]*ratios[axis];
    if(!hatInitialized||!enabled){hat[axis]=target;hatVelocity[axis]=0;}
    else for(let n=0;n<substeps;n++){hatVelocity[axis]+=(-hw*hw*(hat[axis]-target)-2*follow.damping*hw*hatVelocity[axis])*hs;hat[axis]+=hatVelocity[axis]*hs;}
   }
   const delayedVelocity=hatInitialized&&step>0?hat.map((v,i)=>(v-hatBefore[i])/step):[0,0,0];hatInitialized=true;
   const result={hwHatYaw:hat[0],hwHatPitch:hat[1],hwHatRoll:hat[2]},samples=[];
   for(let index=0;index<parts.length;index++){
    const part=parts[index],state=states.get(part.key),isHead=part.key.startsWith('hat'),omega=2*Math.PI*part.frequency,amplitude=part.amplitude??1;
    const vx=isHead?delayedVelocity[0]*.50+delayedVelocity[2]*.45:velocity[3]*.7+velocity[4]*1.3+velocity[0]*.05;
    const vy=isHead?delayedVelocity[1]*.45:velocity[4]*.35;
    const drive=part.drive??.08;
    const targetX=enabled?clamp(-vx*drive+Math.sin(elapsed*(1.52+index*.013)+index*.73)*part.maxX*.025,-part.maxX,part.maxX)*gain*amplitude:0;
    const targetY=enabled?clamp(vy*drive*.87,-part.maxY,part.maxY)*gain*amplitude:0;
    const count=Math.max(1,Math.ceil(step*240)),h=step/count;
    for(let n=0;n<count;n++){
     for(const [value,velocityKey,target]of[['x','vx',targetX],['y','vy',targetY]]){
      state[velocityKey]+=(-omega*omega*(state[value]-target)-2*part.damping*omega*state[velocityKey])*h;
      state[value]+=state[velocityKey]*h;
     }
    }
    const limitX=part.maxX*amplitude,limitY=part.maxY*amplitude;
    const x=limitX?limitX*Math.tanh(state.x/limitX):0,y=limitY?limitY*Math.tanh(state.y/limitY):0;
    result['hw_'+part.key+'_x']=x;result['hw_'+part.key+'_y']=y;
    samples.push({key:part.key,x,y,frequency:part.frequency,damping:part.damping});
   }
   for(const part of parts)if(part.physicsSource&&part.physicsSource!==part.key){for(const axis of['x','y'])result['hw_'+part.key+'_'+axis]=result['hw_'+part.physicsSource+'_'+axis];}
   return{parameters:result,samples};
  }
 };
}
