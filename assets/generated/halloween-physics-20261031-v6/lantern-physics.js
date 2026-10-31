const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function createLanternPhysics(config={}){
 const frequency=config.frequency??.66,damping=config.damping??.25,limit=config.maxAngle??.88,inertiaGain=config.inertiaGain??12,omega=2*Math.PI*frequency;
 let angle=0,velocity=0,previous=null,previousVX=0,filteredAcceleration=0;
 return{reset(){angle=velocity=previousVX=filteredAcceleration=0;previous=null;},update(mount,dt,enabled=true,gain=1){
  const step=clamp(dt,0,.05);if(!enabled){angle=velocity=0;previous=mount;previousVX=0;return{angle:0,velocity:0,frequency,damping};}
  if(step<=0)return{angle,velocity,frequency,damping};
  const vx=previous?(mount.x-previous.x)/step:0,angularVelocity=previous?(mount.handAngle-previous.handAngle)/step:0,acceleration=previous?(vx-previousVX)/step:0;
  filteredAcceleration+=(clamp(acceleration,-1800,1800)-filteredAcceleration)*(1-Math.exp(-step*9));
  const target=clamp((-filteredAcceleration*.00072-angularVelocity*.32)*inertiaGain,-limit,limit)*clamp(gain,.2,2);
  const count=Math.max(1,Math.ceil(step*240)),h=step/count;
  for(let n=0;n<count;n++){velocity+=(-omega*omega*(angle-target)-2*damping*omega*velocity)*h;angle+=velocity*h;}
  const bound=limit*1.15;if(Math.abs(angle)>bound){angle=clamp(angle,-bound,bound);if(Math.sign(velocity)===Math.sign(angle))velocity*=.25;}
  previous={...mount};previousVX=vx;return{angle,velocity,frequency,damping};
 }};
}
