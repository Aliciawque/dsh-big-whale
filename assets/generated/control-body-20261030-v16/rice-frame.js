const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const RICE_SHOULDERS=[[350,424],[596,424]];

// Bake the runtime's instant body follow once, so mesh and artwork use one pose.
export function ricePose(p,follow){
 const yaw=clamp((p.angleX??0)/30,-1,1)*clamp(p.headBodyFollow??1,0,1);
 return {headBodyFollow:0,
  bodyAngleX:clamp((p.bodyAngleX??0)+yaw*(follow?.shift??0),-10,10),
  bodyAngleZ:clamp((p.bodyAngleZ??0)+yaw*(follow?.lean??0),-10,10)};
}

// A rigid least-squares shoulder frame: translation and rotation only.
// Never inherit scale/shear from breathing, body turns or spring deformation.
export function rigidRiceFrame(project){
 const [a,b]=RICE_SHOULDERS,[u,v]=RICE_SHOULDERS.map(p=>project(...p));
 const angle=Math.atan2(v[1]-u[1],v[0]-u[0])-Math.atan2(b[1]-a[1],b[0]-a[0]);
 const c=Math.cos(angle),s=Math.sin(angle),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
 const x=(u[0]+v[0])/2-c*mx+s*my,y=(u[1]+v[1])/2-s*mx-c*my;
 const matrix=[c,s,-s,c,x,y];
 const error=Math.max(...RICE_SHOULDERS.map(([px,py],i)=>Math.hypot(c*px-s*py+x-[u,v][i][0],s*px+c*py+y-[u,v][i][1])));
 return {matrix,angle,scale:[1,1],shear:0,shoulderError:error};
}
