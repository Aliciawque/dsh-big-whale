const root=new URL('../halloween-outfit-20261031-v1/layers-v1/',import.meta.url);
export async function configureHalloween(rig,metadata,assets,sourceAssets={}){
 const data=await fetch(new URL('./registration.json',import.meta.url)).then(r=>r.json());
 const old=rig.layered.parts;
 const keep=p=>p.kind==='hair'||p.kind==='ear'||/^part_(tail_|thigh_|shin_|shoe_|stocking_bridge_|hand_[lr]$|neck$|face$|nose$|ear_support_)/.test(p.name);
 const native=old.filter(keep).filter(p=>!['part_band_contact_seal','part_ahoge'].includes(p.name));
 const custom=data.parts.map(item=>{
  const [bx,by,bx1,by1]=item.bounds,[x,y,w,h]=item.rect,bw=bx1-bx+1,bh=by1-by+1;
  const name='hw_'+item.key,head=item.key.startsWith('hat');
  metadata.layers[name]=item.uvCropped?[x,y,w,h]:[x-bx*w/bw,y-by*h/bh,item.width*w/bw,item.height*h/bh];
  const matteName=item.sourceMatteAsset?name+'_source_matte':null;if(matteName)assets[matteName+'.png']=new URL(item.sourceMatteAsset,import.meta.url).href;
  assets[name+'.png']=item.asset?new URL(item.asset,import.meta.url).href:new URL(item.file,root).href;
  return{name,kind:head?'decoration':'body',stage:head&&!item.behindHair&&!['hatBack'].includes(item.key)?'front':'back',
   depth:head?1:0,followBand:[350,382],pivot:item.pivot,sway:0,meshCell:item.key.startsWith('skirt')?16:head?8:7,
   frontHairHull:false,...item.uvCropped?{solidGrid:true,sourceUvRect:[bx/item.width,by/item.height,bw/item.width,bh/item.height]}:{},...matteName?{sourceMatte:matteName}:{},opacityParameter:item.riceLayer?(item.riceLayer==='front'?'hwRiceFrontVisible':'hwRiceBackVisible'):item.attachment?'hwLanternVisible':'hwVisible_'+item.key,halloween:item,
   ...item.bone?{bone:item.bone}:{}
  };
 });
 const backHat=custom.filter(p=>p.kind==='decoration'&&p.stage==='back');
 const collarBack=custom.filter(p=>p.halloween.behindNeck);
 const clothes=custom.filter(p=>p.kind==='body'&&!p.halloween.attachment&&!p.halloween.behindNeck).sort((a,b)=>a.halloween.order-b.halloween.order);
 const props=custom.filter(p=>p.halloween.attachment);
 const scalp=native.filter(p=>['part_crown','part_rear_head','part_hood_hair_underfill'].includes(p.name));for(const p of scalp)p.stage='back';
 const rear=native.filter(p=>p.stage==='back'&&p.kind==='hair'&&!scalp.includes(p));
 const body=native.filter(p=>p.stage==='back'&&p.kind==='body'&&!/^part_hand_/.test(p.name)&&p.name!=='part_neck');
 const neckPart=native.filter(p=>p.name==='part_neck');
 const hands=native.filter(p=>/^part_hand_[lr]$/.test(p.name));
 for(const hand of hands){delete hand.handSection;hand.halloweenHand=data.handFits[hand.name.endsWith('_l')?'L':'R'];const bone=rig.layered.bones.find(b=>b.name===hand.bone);if(bone)bone.pivot=[...hand.halloweenHand.target];}
 const head=native.filter(p=>p.stage==='back'&&p.kind!=='body'&&p.kind!=='hair');
 const front=native.filter(p=>p.stage==='front'&&!scalp.includes(p));
 const cap=custom.filter(p=>p.stage==='front');
 const crownPart=cap.find(p=>p.halloween.key==='hatCrown'),ahoge=cap.find(p=>p.halloween.key==='hatAhoge');
 const band={...crownPart,name:'hw_hatBand',halloween:{...crownPart.halloween,hatBand:true}};metadata.layers[band.name]=metadata.layers[crownPart.name];assets[band.name+'.png']=assets[crownPart.name+'.png'];
 const capOrder=[crownPart,ahoge,band,...cap.filter(p=>p!==crownPart&&p!==ahoge)];
 const crown=front.findIndex(p=>p.name==='part_crown');
 front.push(...capOrder);
 const cuffs=clothes.filter(p=>p.halloween.key.startsWith('cuff')&&p.halloween.key.endsWith('Front'));
 rig.layered.parts=[...backHat,...scalp,...body,...rear,...collarBack,...neckPart,...clothes.filter(p=>!cuffs.includes(p)),...hands,...props,...cuffs,...head,...front];
 rig.strands=rig.strands.filter(strand=>strand.anchorPart!=='part_ahoge');
 const neckArt=data.supportAssets.find(p=>p.key==='neck');
 const [bx,by,bx1,by1]=neckArt.bounds,[nx,ny,nw,nh]=neckArt.rect,bw=bx1-bx+1,bh=by1-by+1;
 for(const suffix of['','_hd']){const key='part_neck'+suffix;metadata.layers[key]=[nx-bx*nw/bw,ny-by*nh/bh,neckArt.width*nw/bw,neckArt.height*nh/bh];assets[key+'.png']=new URL(neckArt.asset,import.meta.url).href;}
 const crownArt=data.supportAssets.find(p=>p.key==='crown');
 if(crownArt){const [bx,by,bx1,by1]=crownArt.bounds,[x,y,w,h]=crownArt.rect,bw=bx1-bx+1,bh=by1-by+1;for(const suffix of['','_hd']){const key='part_crown'+suffix;metadata.layers[key]=[x-bx*w/bw,y-by*h/bh,crownArt.width*w/bw,crownArt.height*h/bh];assets[key+'.png']=new URL(crownArt.asset,import.meta.url).href;}}
 if(rig.layered.headBandFit?.target){const points=rig.layered.headBandFit.target;rig.layered.headBandFit={...rig.layered.headBandFit,target:[[280,300],[310,240],[325,220],...points,[574,205],[585,227],[600,260],[651,300]]};}
 rig.layered.halloween={version:data.version,parts:data.parts.map(x=>x.key)};
}
