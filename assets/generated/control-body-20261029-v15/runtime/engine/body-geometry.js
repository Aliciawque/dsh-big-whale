const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=(a,b,v)=>{v=clamp((v-a)/(b-a),0,1);return v*v*(3-2*v);};
export function createBodyGeometry(rig,projectTail){
 let previous=null,tailShift=0;
 return{
  before(p,rest,part,phys){
   const field=phys.bodyMotion?.[part.bodySpring];if(!field||!phys.gain)return;
   let weight=1,root;
   if(part.legSide){root=part.legSide==='l'?[437,1000]:[524,1000];weight=smooth(1050,1540,rest[1]);}
   else{root=part.bodySpringRoot;const dx=rest[0]-root[0],dy=rest[1]-root[1],axis=part.bodySpringAxis,length=Math.hypot(...axis);weight=smooth(0,1,(dx*axis[0]+dy*axis[1])/(length*length));if(Math.abs(part.bowCut??0)>1.5)weight=smooth(428,462,rest[1]);}
   const angle=field[2]*weight,c=Math.cos(angle),s=Math.sin(angle),x=p[0]-root[0],y=p[1]-root[1];
   p[0]=root[0]+x*c-y*s+field[0]*weight;p[1]=root[1]+x*s+y*c+field[1]*weight;
  },
  after(p,part,P){
   if(!part.tailSafe)return;
   if(previous!==P){let maxX=-Infinity;for(const item of rig.layered.tailOutline??[])for(const point of item.points){const q=projectTail(point,item,P);maxX=Math.max(maxX,q[0]);}
    const excess=maxX-(rig.image.width-14),round=4;tailShift=excess<=-round?0:excess>=round?-excess:-((excess+round)**2)/(4*round);previous=P;
   }
   p[0]+=tailShift;
  },
 };
}
export const BODY_REPAIR_GLSL=`
bool bowInside(vec2 p){
 vec2 poly[4]=vec2[4](vec2(463.,396.),vec2(481.,401.),vec2(445.,464.),vec2(400.,443.));
 bool inside=false;for(int i=0,j=3;i<4;j=i++){vec2 a=poly[i],b=poly[j];if(((a.y>p.y)!=(b.y>p.y))&&(p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x))inside=!inside;}return inside;
}
vec4 repairBody(vec4 c,vec2 p){
 if(abs(uBowPart)>1.5)c*=smoothstep(418.,420.,p.y);
 if(uLegRepair!=0.){
  bool left=uLegRepair<0.;float t=clamp((p.y-1402.)/112.,0.,1.),blend=t*t*(3.-2.*t);
  float center=mix(left?449.:532.,left?436.:531.,blend),width=mix(36.,left?40.:49.,blend);
  float sy=mix(1370.,1410.,t),sourceCenter=left?448.5:mix(534.,532.,t),sourceWidth=mix(left?42.:44.,left?35.:37.,t);
  vec2 q=vec2(sourceCenter+(p.x-center)*sourceWidth/width,sy);
  float cover=smoothstep(1402.,1414.,p.y)*(1.-smoothstep(1502.,1514.,p.y));
  c=texAt(q)*cover;
 }
 if(uShinClear>0.)c*=1.-smoothstep(1412.,1422.,p.y)*(1.-smoothstep(1498.,1510.,p.y));
 if(uSashSide!=0.){
  vec2 root=uSashSide<0.?vec2(388.,630.):vec2(548.,630.),tip=uSashSide<0.?vec2(277.,740.):vec2(653.,749.),axis=tip-root;
  float L=length(axis),t=dot(p-root,axis)/(L*L),n=dot(p-root,vec2(-axis.y,axis.x))/L;
  float width=mix(uSashSide<0.?2.5:4.,uSashSide<0.?5.8:7.5,clamp(t,0.,1.))+sin(clamp(t,0.,1.)*3.14159)*1.2;
  float coverage=(1.-smoothstep(width-.6,width+.2,abs(n)))*smoothstep(-.02,.01,t)*(1.-smoothstep(.98,1.015,t));
  float edge=smoothstep(width-1.3,width-.5,abs(n));vec3 cloth=mix(vec3(.73,.71,.79),vec3(.98,.98,1.),clamp(n/width*.5+.55,0.,1.));cloth=mix(cloth,vec3(.14,.15,.22),edge*.92);c=vec4(cloth*coverage,coverage);
 }
 return c;
}`;
