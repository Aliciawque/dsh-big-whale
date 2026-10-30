import {createContourMouth} from '../control-motion-20261029-v4/mouth-contour.js?v=2';
import {openAvatar,loadMeshAvatar,PARAMS} from '../control-body-20261029-v15/runtime/runtime-authored-wave.js?v=5';
import {createRig} from '../control-body-20261029-v15/runtime/engine/rig.js';
import {createPoseArtwork} from './controller.js';
export {PARAMS};
const root=new URL('../../',import.meta.url);
const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
const smooth=value=>{value=clamp(value);return value*value*(3-2*value);};
const json=async url=>{const response=await fetch(url);if(!response.ok)throw Error('Missing '+url);return response.json();};
const image=async url=>{const result=new Image();result.src=url;await result.decode();return result;};
const empty=()=>Object.fromEntries(['closed','A_soft','A_normal','I_soft','I_normal','U_soft','U_normal','E_soft','E_normal','O_soft','O_normal'].map(key=>[key,0]));
export async function createCurrentAvatar(engine){
 const [pkg,registration,confirmed]=await Promise.all([
  openAvatar(new URL('../head-intro-20261029-v1/DeepSeek-Head-Refined-20261029.mavatar',import.meta.url)),
  json(new URL('generated/mouth-visemes-20261029-v1/face-fit/registration.json',root)),
  json(new URL('generated/mouth-visemes-20261029-v1/face-fit/confirmed-fit.json',root))
 ]);
 const rig=pkg.rig;
 rig.layered.controlRoomEyes={smileSpacing:.9,extraSmileDrop:.1,lidTint:[.70,.64,.66]};
 rig.layered.continuousBlink=true;rig.layered.normalClosedEyes=true;rig.layered.eyeDetails=true;
 rig.layered.frontHairVolume={center:[465,220],radii:[190,185],depth:145,reference:[450,124],focal:1100,faceAnchor:[465,240]};

 const layerMetadata=await json(pkg.assets['layers.json']);
 const authoredAssets={};
 rig.layered.eyeDetails=await json(new URL('../control-body-20261029-v15/eye-detail-anchors.json',import.meta.url));
 const lashThickness=[1.6796682830838434,1.6548078294070094];
 const closed=await json(new URL('../control-eyes-20261029-v10/closed-lashes-down-v1/registration.json',import.meta.url));
 for(let i=0;i<2;i++){const e=rig.eyes[i],mid=Math.floor(e.top.length/2),H=e.bot[mid]-e.top[mid],part=closed.parts[i],scale=(e.x1-e.x0)/part.width,name='eye'+i+'_closed_normal';
  layerMetadata.layers[name]=[e.x0,e.top[mid]+H*.78-part.bandCenterY*scale*lashThickness[i],e.x1-e.x0,part.height*scale*lashThickness[i]];
  authoredAssets[name+'.png']=new URL('../control-eyes-20261029-v10/closed-lashes-down-v1/'+part.file,import.meta.url).href;
 }
 const headband=rig.layered.parts.find(p=>p.name==='part_headband');const fit=await json(new URL('../control-body-20261029-v15/headband-fit.json',import.meta.url));headband.headbandFit=fit;headband.headbandContact=fit.target;rig.layered.headBandFit=fit;rig.layered.rearHeadTint=(await json(new URL('../control-body-20261029-v15/hair-palette.json',import.meta.url))).tint;
 rig.layered.parts.find(p=>p.name==='part_headband').followBand=[350,382];
 for(const part of rig.layered.parts)if(['part_crown','part_bang_l','part_bang_c','part_bang_r','part_headband','part_ahoge','part_side_l','part_side_r','part_bow','part_ear_l','part_ear_r'].includes(part.name))part.frontHairHull=true;
 const crown=rig.layered.parts.find(p=>p.name==='part_crown'),seal={...crown,name:'part_band_contact_seal',frontHairHull:true,solidGrid:true,meshCell:6};rig.layered.parts.splice(rig.layered.parts.indexOf(crown),0,seal);
 rig.layered.frontSealColor=(await json(new URL('../control-body-20261029-v15/hair-palette.json',import.meta.url))).frontMedian.map(v=>v/255);
 for(const suffix of ['', '_hd']){const key='part_crown'+suffix;if(layerMetadata.layers[key]){layerMetadata.layers[seal.name+suffix]=layerMetadata.layers[key];authoredAssets[seal.name+suffix+'.png']=pkg.assets[key+'.png'];}}
 for(const name of ['part_ear_l','part_ear_r']){const index=rig.layered.parts.findIndex(p=>p.name===name),part=rig.layered.parts[index];part.finVolume={root:part.pivot,tip:part.secondary.tip,side:name.endsWith("_l")?-1:1,width:35,depth:24,thickness:4};delete part.secondary;const rim={...part,name:name+'_rim',secondary:undefined,secondarySource:name,finRim:true};rig.layered.parts.splice(index,0,rim);for(const suffix of ['', '_hd']){const key=name+suffix;if(layerMetadata.layers[key]){layerMetadata.layers[rim.name+suffix]=layerMetadata.layers[key];authoredAssets[rim.name+suffix+'.png']=pkg.assets[key+'.png'];}}}
 const elasticNames=['bang-left','bang-center','bang-right','side-left-front','side-right-front','side-left-shoulder','side-right-shoulder'];
 for(const strand of rig.strands)if(elasticNames.includes(strand.name))strand.outputGain=(strand.outputGain??1)*2;
for(const part of rig.layered.parts)if(/^part_side_[lr]_drop$/.test(part.name))part.hangingLock={bottom:part.name.includes('_l_')?435:432};
 rig.layered.frontHairPhysicsGain=2;rig.layered.articulatedFins=true;
 const rear=await json(new URL('../control-motion-20261029-v6/rear-clumps.json',import.meta.url));
 rig.layered.parts.find(p=>p.name==='part_rear_head').opacityParameter='controlRearHeadVisible';
 const firstRear=rig.layered.parts.findIndex(p=>/^part_rear_[lr]_/.test(p.name));
 rig.layered.parts=rig.layered.parts.filter(p=>!/^part_rear_[lr]_/.test(p.name));
 rig.layered.parts.splice(firstRear,0,...rear.parts.map(({rect,...part})=>part));
 rig.strands=rig.strands.filter(s=>!s.anchorPart?.match(/^part_rear_[lr]_/));rig.strands.push(...rear.strands);
 for(const part of rear.parts){layerMetadata.layers[part.name]=part.rect;authoredAssets[part.name+'.png']=new URL('../control-motion-20261029-v6/'+rear.assets[part.name],import.meta.url).href;}
 for(const part of rig.layered.parts){if(part.name==='part_upperarm_l')part.nativeWaveSegment=0;else if(part.name==='part_hand_l')part.nativeWaveSegment=2;else if(['part_forearm_l','part_cuff_l','part_wrist_frill_l','part_sleeve_support_l'].includes(part.name))part.nativeWaveSegment=1;}
 for(const part of rig.layered.parts)if(part.finVolume)part.frontHairHull=true;
 rig.layered.tailOutline=await json(new URL('../control-body-20261029-v15/tail-outline.json',import.meta.url));
 rig.layered.bodyAttachmentPhysics=true;
 for(const part of rig.layered.parts){
  if(/^part_(thigh|shin|shoe)_[lr]$/.test(part.name)){part.legSide=part.name.at(-1);part.bodySpring='foot_'+part.legSide;part.meshCell=8;}
  if(part.name.startsWith('part_tail_')){part.tailSafe=true;part.meshCell=10;}
  if(/^part_chest_bow_(tail|wing)_[lr]$/.test(part.name)){const side=part.name.at(-1),tail=part.name.includes('_tail_');delete part.secondary;part.bodySpring='bow_'+(tail?'tail_':'wing_')+side;part.bodySpringRoot=[475,403];part.bodySpringAxis=[side==='l'?-40:40,tail?55:0];part.bowCut=(side==='l'?1:-1)*(tail?2:1);part.meshCell=4;}
  if(/^part_sash_tail_[lr]$/.test(part.name)){const side=part.name.at(-1);part.bodySpring='sash_'+side;part.bodySpringRoot=side==='l'?[388,630]:[548,630];part.bodySpringAxis=side==='l'?[-111,110]:[105,119];part.sashSurface=side==='l'?-1:1;part.solidGrid=true;part.meshCell=5;layerMetadata.layers[part.name]=side==='l'?[240,620,160,150]:[535,620,150,160];if(layerMetadata.layers[part.name+'_hd'])layerMetadata.layers[part.name+'_hd']=layerMetadata.layers[part.name];}
 }
 for(const side of ['l','r']){const source=rig.layered.parts.find(p=>p.name==='part_shin_'+side),bridge={...source,name:'part_stocking_bridge_'+side,legRepair:side==='l'?-1:1,solidGrid:true};rig.layered.parts.splice(rig.layered.parts.indexOf(source),0,bridge);source.shinClear=true;
  for(const suffix of ['', '_hd']){const key=source.name+suffix;if(layerMetadata.layers[key]){layerMetadata.layers[bridge.name+suffix]=layerMetadata.layers[key];authoredAssets[bridge.name+suffix+'.png']=pkg.assets[key+'.png'];}}
 }
 const layerMetadataURL=URL.createObjectURL(new Blob([JSON.stringify(layerMetadata)],{type:'application/json'}));
 const geometry=createRig(rig),sheet=await json(pkg.assets['sprites/sprites.json']),oldRect=sheet.layers.mouth_closed;
 for(const part of rig.layered.parts)if(part.opacityParameter==='visArms'){if(part.name.endsWith('_r'))part.opacityParameter='controlArmRVisible';else if(part.name.endsWith('_l'))part.opacityParameter='controlArmLVisible';}
 rig.layered.parts.find(part=>part.name==='part_hand_l').opacityParameter='controlRestHandLVisible';
 rig.layered.parts.find(part=>part.name==='part_hand_r').opacityParameter='controlRightHandVisible';
 const poseArtwork=await createPoseArtwork(rig,geometry);
 const oldImage=await image(pkg.assets['sprites/mouth_closed_hd.png']),oldBounds=[50,72,131,25],assets=new Map();
 // Retain the original expression drawings in the native mesh. New vowels are composited separately.
 sheet.layers=Object.fromEntries(Object.entries(sheet.layers).filter(([name])=>!name.startsWith('mouth_')||name.startsWith('mouth_morph_atlas')));
 sheet.mouthMorph.frames=Object.fromEntries(Object.entries(sheet.mouthMorph.frames).filter(([name])=>['triangle','cat','wave','fang'].includes(name)));
 sheet.mouthMorph.duration=.001;sheet.mouthMorph.steps=0;
 const metadata=URL.createObjectURL(new Blob([JSON.stringify(sheet)],{type:'application/json'}));
 const dpr=Math.min(window.devicePixelRatio||1,2);
 engine.style.width=rig.image.width*2/dpr+'px';engine.style.height=rig.image.height*2/dpr+'px';
 const avatar=await loadMeshAvatar(engine,{...pkg,assets:{...pkg.assets,...authoredAssets,'layers.json':layerMetadataURL,'sprites/sprites.json':metadata},release(){}},{manual:true,padTop:0,padSide:0,preserveMouthForm:true});
 await Promise.all(['A','I','U','E','O'].map(async vowel=>assets.set(vowel,await image(new URL('generated/mouth-visemes-20261029-v1/'+vowel+'-draft.png',root)))));
 const surface=document.createElement('canvas'),context=surface.getContext('2d'),patch=document.createElement('canvas');
 patch.width=512;patch.height=256;const pg=patch.getContext('2d');
 const contourMouth=createContourMouth();
 let weights=empty();weights.closed=1;
 const point=(x,y,P)=>geometry.deformBase(x,y,geometry.baseWeights(x,y,0),P,{gain:0},[0,0]);
 function component(key,view,weight){
  if(key==='closed')return{closed:true,image:oldImage,crop:[0,0,oldImage.width,oldImage.height],bounds:oldBounds,world:[oldRect[0]-registration.sourceAnchor[0]+oldBounds[0]/oldImage.width*oldRect[2],oldRect[1]-registration.sourceAnchor[1]+oldBounds[1]/oldImage.height*oldRect[3],oldBounds[2]/oldImage.width*oldRect[2],oldBounds[3]/oldImage.height*oldRect[3]],offsetX:0,rotation:0,weight};
  const[vowel,opening]=key.split('_'),sheet=registration.sheets.find(s=>s.vowel===vowel),cell=sheet.cells.find(c=>c.view===view&&c.opening===opening),scale=registration.scale*confirmed.mouthScale/100,[x0,y0,x1,y1]=cell.alpha128Bounds;
  return{image:assets.get(vowel),crop:cell.crop,bounds:[x0,y0,x1-x0,y1-y0],world:[(x0-cell.anchor[0])*scale,(y0-cell.anchor[1])*scale,(x1-x0)*scale,(y1-y0)*scale],offsetX:(x1-x0)*scale*confirmed.mouths[vowel].shift/100,rotation:confirmed.mouths[vowel].rotation,weight};
 }
 function targetWeights(P,mode){
  const target=empty(),open=smooth(P.mouthOpen/.18);
  target.closed=1-open;
  const references={a:.88,i:.55,u:.75,e:.65,o:.75};
  let vowels=[[mode.toUpperCase(),1]];
  if(!references[mode]){
   const axis=[['I',-.9],['E',-.4],['A',0],['O',.55],['U',.95]],form=clamp(P.mouthForm,-.9,.95);
   const index=Math.min(axis.length-2,Math.max(0,axis.findIndex(([,value],i)=>i<axis.length-1&&form>=value&&form<=axis[i+1][1])));
   const amount=clamp((form-axis[index][1])/(axis[index+1][1]-axis[index][1]));vowels=[[axis[index][0],1-amount],[axis[index+1][0],amount]];
  }
  const normal=clamp((P.mouthOpen/(references[mode]??.8)-.35)/.65);
  for(const[vowel,weight]of vowels){target[vowel+'_soft']+=open*weight*(1-normal);target[vowel+'_normal']+=open*weight*normal;}
  return target;
 }
 function draw(P,mode,dt,speech=null,action=null){
  const drawStart=performance.now();
  const artworkState=poseArtwork.prepare(action?.rice?action:null,dt,P);
  const speaking=Boolean(speech?.active),native={...P,...artworkState.pose,controlRearHeadVisible:(P.visHair??1)*(P.reviewHideRearHead?0:1),eyeFlowVisible:rig.layered.eyeDetails.flowEnabled===false?0:1,eyeScale:confirmed.eyeSize/100,eyeSpacing:confirmed.eyeDistance/100,mouthOpen:0,mouthExpression:speaking?0:P.mouthExpression,controlArmLVisible:artworkState.rice?0:1,controlArmRVisible:artworkState.hideRight?0:1,controlRightHandVisible:artworkState.rice?0:1,controlNativeCuffVisible:artworkState.rice||artworkState.palmAuthored?0:1,controlWaveCuffVisible:!artworkState.rice&&artworkState.palmAuthored?1:0,authoredArmVisible:0,authoredPalmVisible:!artworkState.rice&&artworkState.palmAuthored?1:0,controlRestHandLVisible:artworkState.rice||artworkState.palmAuthored?0:1};
  avatar.setParameters(native);avatar.advance(dt,dt?1/dt:30);
  const engineMs=performance.now()-drawStart;
  if(surface.width!==engine.width||surface.height!==engine.height){surface.width=engine.width;surface.height=engine.height;}
  context.clearRect(0,0,surface.width,surface.height);context.drawImage(engine,0,0);
  context.save();context.scale(surface.width/rig.image.width,surface.height/rig.image.height);const artwork=poseArtwork.draw(context,native,artworkState);context.restore();
  const face=point((rig.face.eyeA.cx+rig.face.eyeB.cx)/2,267,native),focus=[face[0]*1080/rig.image.width,face[1]*1920/rig.image.height];
  if(!speaking&&P.mouthExpression>0){weights=empty();weights.closed=1;return{bodyMotion:avatar.getBodyMotion?.()??null,finMotion:avatar.getFinMotion?.()??null,eyeDetails:avatar.getEyeDetails?.()??null,expression:P.mouthExpression,weights:null,focus,source:'expression',artwork};}
  if(speaking){const gain=dt>0?1-Math.exp(-dt/.018):1;for(const key of Object.keys(weights))weights[key]+=(speech.weights[key]-weights[key])*gain;}
  else{const target=targetWeights(P,mode),gain=dt>0?1-Math.exp(-dt/.055):1;for(const key of Object.keys(weights))weights[key]+=(target[key]-weights[key])*gain;}
  const yaw=clamp(P.angleX/30,-1,1),amount=Math.abs(yaw),side=yaw<0?'left':'right',items=[];
  for(const[key,weight]of Object.entries(weights))if(weight>.00001){if(key==='closed')items.push(component(key,'front',weight));else{if(amount<.9999)items.push(component(key,'front',weight*(1-amount)));if(amount>.0001)items.push(component(key,side,weight*amount));}}
  const box=[0,0,0,0];let offset=0,rotation=0;
  for(const c of items){for(let i=0;i<4;i++)box[i]+=c.world[i]*c.weight;offset+=c.offsetX*c.weight*yaw;rotation+=c.rotation*c.weight*yaw;}
  const blend=contourMouth.draw(pg,items,box);
  const a=point(...registration.sourceAnchor,native),left=point(registration.sourceAnchor[0]-1,registration.sourceAnchor[1],native),right=point(registration.sourceAnchor[0]+1,registration.sourceAnchor[1],native),angle=Math.atan2(right[1]-left[1],right[0]-left[0]);
  context.save();context.scale(surface.width/rig.image.width,surface.height/rig.image.height);context.translate(a[0]+offset,a[1]);context.rotate(angle+rotation*Math.PI/180);context.drawImage(patch,-32,-6,64,32);context.restore();
  return{bodyMotion:avatar.getBodyMotion?.()??null,finMotion:avatar.getFinMotion?.()??null,eyeDetails:avatar.getEyeDetails?.()??null,profile:{engineMs,...avatar.getFrameProfile(),totalMs:performance.now()-drawStart},blend,weights:{...weights},dominant:Object.entries(weights).sort((a,b)=>b[1]-a[1])[0][0],offset,rotation,anchor:a,focus,source:speaking?'speech':'manual',artwork};
 }
 return{avatar,rig,confirmed,surface,draw,destroy(){avatar.destroy();pkg.release();URL.revokeObjectURL(metadata);URL.revokeObjectURL(layerMetadataURL);}};
}


