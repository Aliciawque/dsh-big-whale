import {projectFin} from './fin-volume.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=(a,b,v)=>{v=clamp((v-a)/(b-a),0,1);return v*v*(3-2*v);};
const valueAt=(points,x)=>{let i=0;while(i<points.length-2&&points[i+1][0]<x)i++;const a=points[i],b=points[i+1],t=clamp((x-a[0])/Math.max(.01,b[0]-a[0]),0,1);return a[1]+(b[1]-a[1])*t;};

/** Project one curved scalp, with the band rooted to the same contact surface. */
export function createFrontHairHull(rig,face){
 const cfg=rig.layered?.frontHairVolume;if(!cfg||!face)return null;
 const [cx,cy]=cfg.center,[rx,ry]=cfg.radii,depth=cfg.depth,focal=cfg.focal??1100;
 const surface=(x,y)=>depth*Math.exp(-.82*((x-cx)/rx)**2-.85*((y-cy)/ry)**2);
 const pivotZ=surface(...(cfg.reference??[cx,cy-90]));
 let last=null,frame=null;
 function project(p,f,part){
  const x=p[0]-cx,y=p[1]-cy,z=surface(p[0],part?.headbandContact?valueAt(part.headbandContact,p[0]):p[1]);
  const inverse=1-z/focal,X=x*inverse,Y=y*inverse,Z=z-pivotZ;
  const turnX=X*f.cx+Z*f.sx,turnZ=-X*f.sx+Z*f.cx;
  const turnY=Y*f.cy-turnZ*f.sy,finalZ=Y*f.sy+turnZ*f.cy+pivotZ,scale=focal/Math.max(focal*.55,focal-finalZ);
  return[cx+turnX*scale+f.dx,cy+turnY*scale+f.dy];
 }
 function legacy(p,f){const x=p[0]-465,y=p[1]-205,z=64*Math.exp(-.85*((x/180)**2+.28*(y/165)**2));return[465+x*f.cx+(z-64)*f.sx+f.dx,205+y*f.cy-(z-64)*f.sy+f.dy];}
 return(p,P,gain=1,part=null,rest=p,physics=null)=>{
  if(!gain)return p;
  if(part?.headbandFit){const fit=part.headbandFit;p[1]+=valueAt(fit.target,rest[0])-valueAt(fit.original,rest[0]);}
  if(part?.name?.startsWith('part_bang_')){const pin=smooth(150,205,rest[1]);p[0]=rest[0]+(p[0]-rest[0])*pin;p[1]=rest[1]+(p[1]-rest[1])*pin;}
  if(!P.angleX&&!P.angleY&&!part?.finVolume)return p;
  if(last!==P){const yaw=clamp(P.angleX,-30,30)*Math.PI/180,pitch=clamp(P.angleY,-30,30)*Math.PI/180,at=face.project([...cfg.faceAnchor],P);frame={sx:Math.sin(yaw),cx:Math.cos(yaw),sy:Math.sin(pitch),cy:Math.cos(pitch),dx:at[0]-cfg.faceAnchor[0],dy:at[1]-cfg.faceAnchor[1]};last=P;}
  const f=frame;
  if(part?.finVolume){const q=projectFin([...p],P,part,project(part.pivot,f),physics);p[0]+=(q[0]-p[0])*gain;p[1]+=(q[1]-p[1])*gain;return p;}
  if(part&&['part_ahoge','part_ear_l','part_ear_r','part_bow'].includes(part.name)){
   const root=part.pivot,a=project(root,f),b=legacy(root,f),q=legacy(p,f);p[0]+=(q[0]+a[0]-b[0]-p[0])*gain;p[1]+=(q[1]+a[1]-b[1]-p[1])*gain;return p;
  }
  const q=project(p,f,part);p[0]+=(q[0]-p[0])*gain;p[1]+=(q[1]-p[1])*gain;return p;
 };
}
