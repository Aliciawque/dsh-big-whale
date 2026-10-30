const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=(a,b,v)=>{v=clamp((v-a)/(b-a),0,1);return v*v*(3-2*v);};
const cache=new WeakMap();
/** Bend a curved, cupped fin around an articulated spine; keep the painted root fixed. */
export function projectFin(p,P,part,rootTarget,physics){
 const cfg=part.finVolume,root=cfg.root,tip=cfg.tip,dx=tip[0]-root[0],dy=tip[1]-root[1],length=Math.hypot(dx,dy),ax=dx/length,ay=dy/length;
 const x=p[0]-root[0],y=p[1]-root[1],along=(x*ax+y*ay)/length,t=clamp(along,0,1),across=-x*ay+y*ax;
 const motion=physics?.finMotion?.[part.secondarySource??part.name],angles=motion?.angles??[0,0,0];
 let f=cache.get(cfg);
 if(!f||f.P!==P||f.motion!==motion){
  const knots=[[0,0]];
  for(let i=0;i<3;i++)knots.push([knots[i][0]+length/3*Math.cos(angles[i]),knots[i][1]+length/3*Math.sin(angles[i])]);
  const yaw=clamp(P.angleX??0,-30,30)*Math.PI/180,pitch=clamp(P.angleY??0,-30,30)*Math.PI/180*.85;
  f={P,motion,knots,sx:Math.sin(yaw),cx:Math.cos(yaw),sy:Math.sin(pitch),cy:Math.cos(pitch),cup:.36+(motion?.fold??0)};cache.set(cfg,f);
 }
 const q=f.knots,u=1-t;
 let s=3*u*u*t*q[1][0]+3*u*t*t*q[2][0]+t*t*t*q[3][0];
 let n=3*u*u*t*q[1][1]+3*u*t*t*q[2][1]+t*t*t*q[3][1];
 const ds=3*(u*u*(q[1][0]-q[0][0])+2*u*t*(q[2][0]-q[1][0])+t*t*(q[3][0]-q[2][0]));
 const dn=3*(u*u*(q[1][1]-q[0][1])+2*u*t*(q[2][1]-q[1][1])+t*t*(q[3][1]-q[2][1]));
 const inv=1/Math.max(.01,Math.hypot(ds,dn)),cs=ds*inv,sn=dn*inv,hinge=smooth(0,.18,Math.max(0,along));
 const extension=(along-t)*length;s+=extension*cs;n+=extension*sn;
 const cup=f.cup*hinge*Math.sin(Math.PI*t*.85),cross=across*Math.cos(cup);s-=cross*sn;n+=cross*cs;
 const ridge=cfg.depth*Math.sin(Math.PI*t)*Math.exp(-.65*(across/cfg.width)**2);
 let z=ridge+across*Math.sin(cup);const taper=hinge*(1-smooth(.8,1,t));if(part.finRim)z-=cfg.thickness*taper;
 const X=s*ax-n*ay,Y=s*ay+n*ax;
 const xx=X*f.cx+z*f.sx,zz=-X*f.sx+z*f.cx,yy=Y*f.cy-zz*f.sy,depth=Y*f.sy+zz*f.cy,scale=1000/(1000-depth);
 p[0]=rootTarget[0]+xx*scale;p[1]=rootTarget[1]+yy*scale+(part.finRim?2.8*taper:0);return p;
}
