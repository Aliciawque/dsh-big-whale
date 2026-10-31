import{witchRiceFrame}from'./rice-pose.js';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
const polygonDistance=(x,y,poly)=>{let best=Infinity;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],dx=b[0]-a[0],dy=b[1]-a[1],u=clamp(((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy));best=Math.min(best,Math.hypot(x-a[0]-dx*u,y-a[1]-dy*u));}return best;};
export function costumeWeight(item,x,y){
 const [rx,ry,w,h]=item.rect;
 if(item.riceRigid||item.skinUnderlay||item.key==='bodice'||item.key.startsWith('upperArm')||item.attachment)return 0;
 if(item.key==='hatCrown')return smooth((110-y)/118)*.35;
 if(item.key==='hatAhoge')return smooth(Math.hypot(x-item.pivot[0],y-item.pivot[1])/60);
 if(item.key==='hatBack'||item.key.startsWith('hatUpperRim'))return smooth(Math.abs(x-item.pivot[0])/(w*.50))*.40;
 if(item.segmentY){const t=(y-item.segmentY[0])/(item.segmentY[1]-item.segmentY[0]);return t<0||t>1?0:Math.sin(Math.PI*t)**2*.43;}
 if(item.key==='sleeveL'||item.key==='sleeveR')return Math.sin(Math.PI*clamp((y-item.pivot[1])/((item.connector?.endY??693)-item.pivot[1])))**2;
 if(item.key.startsWith('cape'))return smooth((y-item.pivot[1])/Math.max(1,ry+h-item.pivot[1]))*.65;
 if(item.key.startsWith('cuff')){const distance=Math.hypot(x-item.wrist[0],y-item.wrist[1]),pin=item.innerCuffPin,pinWeight=pin?smooth((Math.hypot((x-pin.center[0])/pin.radii[0],(y-pin.center[1])/pin.radii[1])-1)/.45):1;if(item.cavityWorld)return smooth(Math.hypot(x-item.pivot[0],y-item.pivot[1])/70)*.20*smooth((distance-12)/32)*smooth((polygonDistance(x,y,item.cavityWorld)-8)/32)*pinWeight;const v=[item.wrist[0]-item.pivot[0],item.wrist[1]-item.pivot[1]],n=Math.hypot(...v),t=((x-item.wrist[0])*v[0]+(y-item.wrist[1])*v[1])/n,s=((x-item.wrist[0])*-v[1]+(y-item.wrist[1])*v[0])/n,lip=30+15*(1-smooth(Math.abs(s)/40)),edge=Math.min(Math.abs(t-lip),Math.abs(t+18),Math.abs(Math.abs(s)-38));return smooth(Math.hypot(x-item.pivot[0],y-item.pivot[1])/85)*.20*smooth((distance-10)/34)*smooth(edge/32)*pinWeight;}
 if(item.key.startsWith('waistBow'))return smooth(Math.abs(x-475)/60)*smooth(Math.hypot(x-item.pivot[0],y-item.pivot[1])/Math.max(w,h))*.65;
 if(item.key.startsWith('collar'))return 0;
 if(item.key==='bowUpper'||item.key==='hatBow'||item.key==='waistBow')return smooth(Math.hypot(x-item.pivot[0],y-item.pivot[1])/Math.max(w,h))*.65;
 return smooth((y-item.pivot[1])/Math.max(12,ry+h-item.pivot[1]));
}
export function localCostume(item,x,y,P){
 const weight=costumeWeight(item,x,y),dx=P['hw_'+item.key+'_x']??0,dy=P['hw_'+item.key+'_y']??0;
 if(item.key==='hatAhoge'){const angle=dx/150+dy/450,c=Math.cos(angle),s=Math.sin(angle),ax=x-item.pivot[0],ay=y-item.pivot[1];return[item.pivot[0]+ax*c-ay*s,item.pivot[1]+ax*s+ay*c];}
 if(item.key==='hatCrown'){const tip=smooth((x-550)/158)*smooth((175-y)/100),angle=dx/450*tip,c=Math.cos(angle),s=Math.sin(angle),ax=x-570,ay=y-90;return[570+ax*c-ay*s+dx*weight,90+ax*s+ay*c+dy*(weight+tip*.4)];}
 if(item.key.startsWith('cape')){const px=item.key==='capeL'?420:530,py=373,angle=dx/180*weight,c=Math.cos(angle),s=Math.sin(angle),ax=x-px,ay=y-py;return[px+ax*c-ay*s,py+ax*s+ay*c+dy*weight*.45];}
 if(item.key==='skirtDrapeRuffle'){
  const common=costumeWeight({...item,key:'skirtDrape'},x,y),baseX=P.hw_skirtDrape_x??0,baseY=P.hw_skirtDrape_y??0;
  const seam=760+(x-336)/353*300,edge=smooth((y-seam)/90)*.35;
  return[x+baseX*common+dx*edge,y+baseY*common+dy*edge];
 }
 return[x+dx*weight,y+dy*weight];
}
export function projectHat(item,x,y,P){
 P=hatPose(P);
 if(item.brimRoof){const top=interpolate(item.brimRoof,x),depthScale=1-.18*Math.exp(-(((x-260)/90)**2));y=top+(y-top)*depthScale;}
 if(item.hatPlaneSlope){if(item.key==='hatCrown'&&!item.hatBand)y-=18*smooth((150-y)/150);y+=item.hatPlaneSlope*(x-185);}
 const cx=475,cy=165,focal=1500;
 const z=(item.key==='hatBack'||item.key.startsWith('hatUpperRim'))?45+(item.key.startsWith('hatUpperRim')?10:0)+(y-cy)*.9:45*(1-clamp((cy-y)/300));
 const inverse=1-z/focal,X=(x-cx)*inverse,Y=(y-cy)*inverse,Z=z-45;
 const yaw=(P.angleX??0)/30*.48,pitch=(P.angleY??0)/30*.30;
 const tx=X*Math.cos(yaw)+Z*Math.sin(yaw),tz=-X*Math.sin(yaw)+Z*Math.cos(yaw);
 const ty=Y*Math.cos(pitch)-tz*Math.sin(pitch),depth=Y*Math.sin(pitch)+tz*Math.cos(pitch)+45,scale=focal/(focal-depth);
 return[cx+tx*scale,cy+ty*scale];
}
let previousHatInput,previousHatPose;
export function hatPose(P){
 if(P===previousHatPose)return P;
 if(P.hwHatYaw===undefined)return P;
 if(previousHatInput!==P){previousHatInput=P;previousHatPose={...P,angleX:P.hwHatYaw,angleY:P.hwHatPitch,angleZ:P.hwHatRoll};}
 return previousHatPose;
}
const interpolate=(knots,value)=>{let i=0;while(i<knots.length-2&&value>knots[i+1][0])i++;const a=knots[i],b=knots[i+1],t=clamp((value-a[0])/(b[0]-a[0]));return a[1]+(b[1]-a[1])*t;};
export function fitCostume(item,x,y){
 if(item.capeDepth)return[x,item.pivot[1]+(y-item.pivot[1])*item.capeDepth];
 if(item.connector){const a=item.connector,w=smooth((y-a.fromY)/(a.endY-a.fromY));return[x+(a.target[0]-a.source[0])*w,y+(a.target[1]-a.source[1])*w];}
 if(item.rimFit){const source=interpolate(item.rimFit.source,x),target=interpolate(item.rimFit.target,x);return[x,target-3+(y-source)*item.rimFit.thickness];}
 if(item.key.startsWith('cuff'))return[x,y];
 if(item.referenceWarp){const [bx,by,bx1,by1]=item.bounds,[rx,ry,w,h]=item.rect,sx=bx+(x-rx)/w*(bx1-bx+1),sy=by+(y-ry)/h*(by1-by+1),warp=item.referenceWarp,scale=interpolate(warp.scale,sy),delta=(sx-warp.center)*scale,t=smooth((sy-660)/150),f=.80+.15*smooth((Math.abs(delta)-55)/25),cy=interpolate(warp.y,sy);let q=delta*(1+(f-1)*t);
  if(warp.rawHalf&&sy>=660){const outer=interpolate(warp.rawHalf,sy)*scale,of=.80+.15*smooth((outer-55)/25),mappedOuter=outer*(1+(of-1)*t),target=interpolate([[550,84],[570,79],[600,72],[625,71],[643,73]],cy);if(mappedOuter>60&&target<mappedOuter&&Math.abs(q)>50)q=Math.sign(q)*(50+(Math.abs(q)-50)*(target-50)/(mappedOuter-50));}
  return[warp.targetCenter+4*t+q,cy];}
 if(item.rootFit){const r=item.rootFit;if(y>=r.end)return[x,y];const weight=1-smooth((y-r.start)/(r.end-r.start)),left=interpolate(r.rows.map(v=>[v[0],v[1]]),y),right=interpolate(r.rows.map(v=>[v[0],v[2]]),y),width=Math.max(64,right-left),sourceCenter=(left+right)/2,sourceLeft=sourceCenter-width/2,sourceRight=sourceCenter+width/2,u=(x-sourceLeft)/width,lo=sourceLeft+(r.target[0]-sourceLeft)*weight,hi=sourceRight+(r.target[1]-sourceRight)*weight;return[lo+u*(hi-lo),y+r.shiftY*weight];}
 if(item.waistExpansion)x=475+(x-475)*(1+(item.waistExpansion-1)*(1-smooth((y-665)/140)));
 return[x,y];
}
export function lanternVertex(engine,item,x,y,P,physics,out){
 const source=item.handFit?.source??[229,755],anchor=item.handFit?.target??source,size=item.handScale??1,oldGrip=[198,785],grip=oldGrip.map((v,i)=>anchor[i]+(v-source[i])*size),part={kind:'body',bone:'elbow_l'},w=engine.baseWeights(...anchor,0),a=engine.deformPart(...anchor,w,P,physics,part,[0,0]),b=engine.deformPart(anchor[0]+1,anchor[1],w,P,physics,part,[0,0]),angle=Math.atan2(b[1]-a[1],b[0]-a[0]);
 if(item.attachment==='hand'){x=anchor[0]+(x-source[0])*size;y=anchor[1]+(y-source[1])*size;}else{x+=grip[0]-oldGrip[0];y+=grip[1]-oldGrip[1];}
 if(item.attachment!=='hand'){const swing=P.hwLanternSwing===undefined?(P.hw_lanternFrame_x??0)/160:P.hwLanternSwing-angle,c=Math.cos(swing),s=Math.sin(swing),dx=x-grip[0],dy=y-grip[1];x=grip[0]+dx*c-dy*s;y=grip[1]+dx*s+dy*c;if(item.attachment==='ghost')y+=Math.sin((P.hwLanternTime??0)*2.6)*1.8;}
 const dx=x-anchor[0],dy=y-anchor[1],c=Math.cos(angle),s=Math.sin(angle);out[0]=a[0]+dx*c-dy*s;out[1]=a[1]+dx*s+dy*c;return out;
}
export function sampleLanternMount(engine,item,P,physics={gain:0}){
 const clean={...P,hwLanternSwing:undefined,hw_lanternFrame_x:0},a=lanternVertex(engine,item,198,785,clean,physics,[0,0]),b=lanternVertex(engine,item,199,785,clean,physics,[0,0]);return{x:a[0],y:a[1],handAngle:Math.atan2(b[1]-a[1],b[0]-a[0])};
}
export function deformHalloween(engine,x,y,weights,P,physics,part,out){
 if(part.halloweenHand){const f=part.halloweenHand,dx=(x-f.source[0])*f.scale,dy=(y-f.source[1])*f.scale,c=Math.cos(f.rotation??0),s=Math.sin(f.rotation??0),q=[f.target[0]+dx*c-dy*s,f.target[1]+dx*s+dy*c];return engine.deformPart(...q,engine.baseWeights(...q,0),P,physics,part,out);}
 if(!part.halloween){
  const yaw=clamp((P.angleX??0)/30,-1,1),left=part.name==='part_bang_l'&&yaw>0,right=part.name==='part_bang_r'&&yaw<0;
  if(left||right){const shift=16*Math.abs(yaw)*smooth((y-135)/35)*(1-smooth((y-190)/70))*(left?-1:1);if(shift){const w=engine.baseWeights(x+shift,y,1);if(weights.motion!==undefined)w.motion=weights.motion;return engine.deformPart(x+shift,y,w,P,physics,part,out);}}
  return engine.deformPart(x,y,weights,P,physics,part,out);
 }
 const item=part.halloween;if(item.riceRigid){const m=witchRiceFrame(engine,P).matrix;out[0]=m[0]*x+m[2]*y+m[4];out[1]=m[1]*x+m[3]*y+m[5];return out;}if(item.attachment)return lanternVertex(engine,item,x,y,P,physics,out);
 if(item.key.startsWith('hat'))P=hatPose(P);
 const angle=item.restRotation??0,c=Math.cos(angle),s=Math.sin(angle),dx=x-item.pivot[0],dy=y-item.pivot[1];
 const isShoulder=item.key.startsWith('upperArm')&&!item.skinUnderlay,shoulderWidth=isShoulder?1+.85*(1-smooth((y-438)/84)):1;
 const inner=isShoulder?smooth((x-item.rect[0])/item.rect[2]):0,innerSide=item.key.endsWith('L')?inner:1-inner;
 const fill=isShoulder?(item.innerShoulderExtension??0)*innerSide*(1-smooth((y-492)/38))*(item.key.endsWith('L')?1:-1):0;
 const overlap=isShoulder?(item.sleeveSkinOverlap??0)*smooth((y-492)/45):0;
 const sx=dx*shoulderWidth+fill,sy=dy+overlap;
 const rest=angle||shoulderWidth!==1?[item.pivot[0]+sx*c-sy*s,item.pivot[1]+sx*s+sy*c]:[x,y];
 const local=localCostume(item,...rest,P);if(['hatBow','hatTail','hatStar','hatMoon'].includes(item.key)){const parent=localCostume({key:'hatCrown',rect:[350,-8,358,208],pivot:[475,180]},...item.pivot,P);local[0]+=parent[0]-item.pivot[0];local[1]+=parent[1]-item.pivot[1];}
 const fitted=fitCostume(item,...local);if(item.hatBand)fitted[1]=200+(fitted[1]-200)*1.2-25;const [px,py]=item.key.startsWith('hat')?projectHat(item,...fitted,P):fitted;
 if(item.referenceWarp||item.waistExpansion||item.connector||item.rootFit||item.key.startsWith('cuff'))weights=engine.baseWeights(px,py,0);
 if(item.key==='sleeveL'||item.key==='sleeveR'){
  const side=item.key.endsWith('L')?'l':'r',a=[0,0],b=[0,0],blend=smooth((y-550)/80);
  engine.deformPart(px,py,weights,P,physics,{...part,bone:'arm_'+side},a);
  engine.deformPart(px,py,weights,P,physics,{...part,bone:'elbow_'+side},b);
  out[0]=a[0]+(b[0]-a[0])*blend;out[1]=a[1]+(b[1]-a[1])*blend;return out;
 }
 return engine.deformPart(px,py,weights,P,physics,part,out);
}
