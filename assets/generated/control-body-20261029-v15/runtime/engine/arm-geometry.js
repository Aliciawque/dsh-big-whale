const rad=x=>x*Math.PI/180,clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*x*(10+x*(-15+6*x));};
export const ARM_REGISTRATION={source:{shoulder:[435,220],elbow:[489,705],wrist:[510,1250]},target:{shoulder:[350,424],wrist:[220,420]},native:{shoulder:[350,424],elbow:[336,576],wrist:[229,755],tip:[120,806]},handChoice:'approved-large-original-palm'};
const N=ARM_REGISTRATION.native,sourcePalm={wrist:[288,492],tip:[233,145]},palmLength=133;
const L1=Math.hypot(N.elbow[0]-N.shoulder[0],N.elbow[1]-N.shoulder[1]),L2=Math.hypot(N.wrist[0]-N.elbow[0],N.wrist[1]-N.elbow[1]);
const restUpper=Math.atan2(152,-14),restFore=Math.atan2(179,-107),restHand=Math.atan2(51,-109);
const lerp=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const turn=(point,at,angle)=>{const x=point[0]-at[0],y=point[1]-at[1],c=Math.cos(angle),s=Math.sin(angle);return[at[0]+c*x-s*y,at[1]+s*x+c*y];};
const upperSlope=(N.elbow[0]-N.shoulder[0])/(N.elbow[1]-N.shoulder[1]),foreSlope=(N.wrist[0]-N.elbow[0])/(N.wrist[1]-N.elbow[1]);
const hermite=(x0,x1,m0,m1,t,L)=>{const a=t*t,b=a*t;return(2*b-3*a+1)*x0+(b-2*a+t)*L*m0+(-2*b+3*a)*x1+(b-a)*L*m1;};
function sleeveCenter(y){const E=N.elbow,L=65,m=(upperSlope+foreSlope)/2;if(y<E[1]-L)return E[0]+(y-E[1])*upperSlope;if(y>E[1]+L)return E[0]+(y-E[1])*foreSlope;if(y<E[1])return hermite(E[0]-L*upperSlope,E[0],upperSlope,m,(y-E[1]+L)/L,L);return hermite(E[0],E[0]+L*foreSlope,m,foreSlope,(y-E[1])/L,L);}
let sleeveKey=null,sleeveFrame=null,sleeveRows=new Map();
export function authoredJoints(P){
 const p=clamp(P.authoredWaveProgress??0),s=[...N.shoulder],w=lerp(N.wrist,ARM_REGISTRATION.target.wrist,p);
 w[0]-=64*Math.sin(Math.PI*p);
 const dx=w[0]-s[0],dy=w[1]-s[1],d=Math.min(L1+L2-.001,Math.max(Math.abs(L1-L2)+.001,Math.hypot(dx,dy))),a=(L1*L1-L2*L2+d*d)/(2*d),h=Math.sqrt(Math.max(0,L1*L1-a*a)),angle=Math.atan2(dy,dx),ux=Math.cos(angle),uy=Math.sin(angle),e=[s[0]+ux*a+uy*h,s[1]+uy*a-ux*h];
 const foreAngle=Math.atan2(w[1]-e[1],w[0]-e[0]),handAngle=foreAngle+(restHand-restFore)*(1-ease(p/.65))+rad(4+(P.authoredWaveWrist??0))*ease(p/.65);
 const drift=rad((P.poseArmL??0)*(1-ease(p/.15)));for(const q of [e,w]){const v=turn(q,s,drift);q[0]=v[0];q[1]=v[1];}
 return{shoulder:s,elbow:e,wrist:w,fingers:[w[0]+Math.cos(handAngle+drift)*palmLength,w[1]+Math.sin(handAngle+drift)*palmLength],handAngle:handAngle+drift};
}
export function nativeArmVertex(x,y,index,P){
 const j=authoredJoints(P);
 if(index===2){const base=restHand,dx=x-N.wrist[0],dy=y-N.wrist[1],u=dx*Math.cos(base)+dy*Math.sin(base),v=(-dx*Math.sin(base)+dy*Math.cos(base))*(P.restPalmWidth??1),c=Math.cos(j.handAngle),s=Math.sin(j.handAngle);return[j.wrist[0]+u*c-v*s,j.wrist[1]+u*s+v*c];}
 if(sleeveKey!==P){const upper=Math.atan2(j.elbow[1]-j.shoulder[1],j.elbow[0]-j.shoulder[0])-restUpper;let fore=Math.atan2(j.wrist[1]-j.elbow[1],j.wrist[0]-j.elbow[0])-restFore;while(fore-upper>Math.PI)fore-=2*Math.PI;while(fore-upper< -Math.PI)fore+=2*Math.PI;sleeveFrame={upper,fore,elbow:j.elbow};sleeveKey=P;sleeveRows=new Map();}
 let row=sleeveRows.get(y);
 if(!row){const f=sleeveFrame,at=v=>{const angle=f.upper+(f.fore-f.upper)*ease((v-460)/260),q=turn([sleeveCenter(v),v],N.elbow,angle);return[q[0]+f.elbow[0]-N.elbow[0],q[1]+f.elbow[1]-N.elbow[1]];},a=at(y-.25),b=at(y+.25),tx=b[0]-a[0],ty=b[1]-a[1],length=Math.hypot(tx,ty),m=(sleeveCenter(y+.25)-sleeveCenter(y-.25))/.5;
  row={center:at(y),x:sleeveCenter(y),m,L:Math.hypot(m,1),tx:tx/length,ty:ty/length,gain:1+.12*(P.authoredWaveProgress??0)*Math.exp(-(((y-576)/64)**2))};sleeveRows.set(y,row);}
 // A shared moving frame preserves transverse sleeve thickness through the bend.
 const dx=x-row.x,u=dx*row.m/row.L,v=dx/row.L*row.gain;
 return[row.center[0]+row.tx*u+row.ty*v,row.center[1]+row.ty*u-row.tx*v];
}
export function authoredArmVertex(x,y,index,P){
 const pose=authoredJoints(P);
 if(index===2){const a=sourcePalm.wrist,base=Math.atan2(sourcePalm.tip[1]-a[1],sourcePalm.tip[0]-a[0]),scale=palmLength/Math.hypot(sourcePalm.tip[0]-a[0],sourcePalm.tip[1]-a[1]),dx=x-a[0],dy=y-a[1],rawU=(dx*Math.cos(base)+dy*Math.sin(base))*scale;
  const root=1-ease((rawU+4)/34),u=rawU<0?rawU*2.6:rawU,v=(-dx*Math.sin(base)+dy*Math.cos(base))*scale*(1+.35*root)*((P.wavePalmWidth??1)+(1-(P.wavePalmWidth??1))*root),c=Math.cos(pose.handAngle),s=Math.sin(pose.handAngle);return[pose.wrist[0]+u*c-v*s,pose.wrist[1]+u*s+v*c];}
 const src=ARM_REGISTRATION.source,a=index===0?src.shoulder:src.elbow,b=index===0?src.elbow:src.wrist,c=index===0?pose.shoulder:pose.elbow,d=index===0?pose.elbow:pose.wrist;
 const sx=b[0]-a[0],sy=b[1]-a[1],sl=Math.hypot(sx,sy),u=((x-a[0])*sx+(y-a[1])*sy)/sl,v=(-(x-a[0])*sy+(y-a[1])*sx)/sl,tx=d[0]-c[0],ty=d[1]-c[1],tl=Math.hypot(tx,ty);
 return[c[0]+tx*u/sl-ty/tl*v*.30,c[1]+ty*u/sl+tx/tl*v*.30];
}
export const ARM_SOURCE_MASK_GLSL=`
 float authoredArmMask(vec2 p,float part){
   if(part>1.5)return smoothstep(-38.,-30.,492.-p.y)*(1.-smoothstep(410.,414.,p.x));
   float cap=1.-smoothstep(90.,92.,length((p-vec2(489.,705.))*vec2(1.,.9)));
   if(part<.5)return max(1.-smoothstep(700.,708.,p.y),cap);
   return max(smoothstep(700.,708.,p.y),cap)*(1.-smoothstep(1294.,1302.,p.y));
 }
`;
