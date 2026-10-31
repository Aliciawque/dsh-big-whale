import { createCurrentAvatar, PARAMS } from '../control-body-20261030-v16/avatar.js';
import {renderQuality} from './render-quality.js';
import {bodyFramePlacement} from './body-frame.js';
import { sampleMouthWeights } from '../head-intro-20261029-v1/performance.js?v=2';
import {sampleIdleMotion,normalizeIdleMotion} from './idle-motions.js';
import {createInteractionPolicy} from './behavior.js';
import {createDragPhysics} from './drag-physics.js';
import {normalizeVoiceLanguage,selectVoiceClip,voiceTrackKey} from './voice-languages.js';
import {textFor} from '../desktop-companion-20261030/i18n.js';
import {createVoiceChannel} from './voice-channel.js';
import {createOutfitSwitcher,normalizeOutfit} from './outfits.js';
let engine=document.getElementById('engine');const canvas=document.getElementById('pet'),context=canvas.getContext('2d'),message=document.getElementById('status');
const root=new URL('../../',import.meta.url),origin=location.origin,defaults=Object.fromEntries(PARAMS.map(p=>[p.id,p.def]));
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
const expressions={normal:{},happy:{browExpression:4,mouthExpression:4},smile:{eyeLOpen:0,eyeROpen:0,eyeSmile:1,eyeSmileL:1,browExpression:4},cold:{eyeLOpen:.5,eyeROpen:.5,browExpression:3,faceShade:1},surprised:{eyeLOpen:1.08,eyeROpen:1.08,browExpression:5,mouthOpen:.32,mouthForm:.55},tears:{eyeExpression:1,browExpression:2,mouthExpression:3},cat:{browExpression:4,mouthExpression:2}};
expressions.angry={browExpression:1};
const autoExpression={idle:'normal',thinking:'normal',working:'normal',waiting:'surprised',success:'happy',error:'cold',compacting:'happy'};
let current,outfits,outfitManifest,state={status:'idle'},override='auto',pointer={x:0,y:0},time=0,last=performance.now(),previousPaint=0,frameCount=0,renderMs=0,raf;
let data=null,language='zh',preferredLanguage='zh',audio=new Audio(),speechToken=0,selection,voiceIndex;
const interactiveMode=new URLSearchParams(location.search).get('interactive')==='1',policy=createInteractionPolicy();
let settings={autoVoice:true,followPointer:true,bodyShowcase:true,bodyShowcaseGain:.8},loading=false,riceUntil=0,gestureAt=-100,clickKind='none',pointerDown=null;
const motionBlend={},dragPhysics=createDragPhysics(),dragStats={starts:0,releases:0,peakEnergy:0,left:false,right:false,up:false,down:false};let dragMix=0;
let playback=null,metrics={frames:0,maxOpen:0,shapes:new Set()},cameraMode='full',cameraMix=0,tapTimer=null,lastTap=null,doubleTapCount=0;
const faceView=new URLSearchParams(location.search).get('camera')==='face';
const tracks=new Map(),pose={...defaults};audio.preload='auto';
const voiceChannel=createVoiceChannel({role:()=>settings.surface==='desktop'?'desktop':'preview',onLost:()=>stopSpeech()});
const json=async url=>{const r=await fetch(url);if(!r.ok)throw Error('缺少模型或语音资源');return r.json();};
function announceVoice(event,error=''){
  parent.postMessage({type:'dsh-whale-voice',event,playing:!audio.paused&&!audio.ended,ended:audio.ended,time:audio.currentTime,duration:data?.duration??0,language,clipId:playback?.id??null,kind:playback?.kind??null,source:playback?.source??'manual',label:playback?.label??'',transcript:data?.transcript??'',error,frames:metrics.frames,maxOpen:metrics.maxOpen,shapes:[...metrics.shapes]},origin);
}
async function activate(track,expectedHash,next,info,token){
  if(token!==speechToken)return;
  if(track.sourceSHA256!==expectedHash)throw Error('音频和口型时间轴不匹配');
  const grant=await voiceChannel.claim({source:info.source==='outfit'?'manual':info.source,clipId:info.id,signalId:info.signalId,duration:track.duration,priority:info.priority,expiresAt:info.expiresAt});
  if(token!==speechToken)return;
  if(!grant.granted){message.textContent=info.source==='manual'?(textFor(preferredLanguage).voiceBusy??'伙伴正在讲话，请稍等'):'';return;}
  if(info.source==='outfit'&&outfits?.selected!=='witch'){await voiceChannel.release();return;}
  if((info.source==='event'&&!policy.isCurrent(info))||(info.source==='drag'&&!pointerDown?.dragged)){await voiceChannel.release();return;}
  data=track;language=next;playback=info;metrics={frames:0,maxOpen:0,shapes:new Set()};
  audio.volume=clamp(info.playbackGain??1,0,1);
  if(info.rice)riceUntil=Math.max(riceUntil,time+8);
  audio.src=new URL(track.audio,root).href;await audio.play();
  if(token!==speechToken)return;
  message.textContent='';announceVoice('play');
}
async function pauseForSwitch(token){
  const volume=audio.volume;
  if(!audio.paused&&!audio.ended)for(let step=1;step<=3;step++){if(token!==speechToken)return false;audio.volume=volume*(1-step/3);await new Promise(resolve=>setTimeout(resolve,20));}
  if(token!==speechToken)return false;audio.pause();await voiceChannel.release();return token===speechToken;
}
async function playIntro(next){
  policy.manual();const token=++speechToken;loading=true;if(!await pauseForSwitch(token))return;message.textContent='正在准备语音…';
  try{
    selection??=await json(new URL('audio/big-whale-intro-20261030/selected-voices.json',root));
    const selected=selection.languages[next];if(!selected)throw Error('不支持的语言');
    if(!tracks.has(next))tracks.set(next,await json(new URL(selected.performanceData,root)));
    const track=tracks.get(next);if(token!==speechToken)return;
    if(track.audio!==selected.audio||track.sourceSHA256!==selected.sha256)throw Error('音频和口型时间轴不匹配');
    await activate(track,selected.sha256,next,{kind:'intro',id:'intro-'+next,label:'自我介绍',source:'manual',priority:90},token);
  }catch(error){if(token!==speechToken)return;await voiceChannel.release();message.textContent=error.name==='NotAllowedError'?'再次点击播放按钮允许声音':error.message;announceVoice('error',message.textContent);}
  finally{if(token===speechToken)loading=false;}
}
async function playDefault(id,request={source:'manual',priority:90}){
  if(id==='halloween-transform')return playOutfitLine(request.language??preferredLanguage,request);
  if(request.source==='manual')policy.manual();
  const token=++speechToken;loading=true;if(!await pauseForSwitch(token))return;message.textContent='正在准备默认语音…';
  try{
    const next=normalizeVoiceLanguage(request.language??preferredLanguage);
    voiceIndex??=await json(new URL('audio/multilingual-defaults-20261030/manifest.json',root));
    const clip=selectVoiceClip(voiceIndex,id,next),cacheKey=voiceTrackKey(next,id);
    if(!tracks.has(cacheKey))tracks.set(cacheKey,await json(new URL(clip.performanceData,root)));
    const track=tracks.get(cacheKey);
    if(track.audio!==clip.audio)throw Error('语音资源登记不一致');
    await activate(track,clip.sha256,clip.language,{kind:'default',id,label:clip.label,expression:clip.expression,rice:Boolean(clip.rice),playbackGain:clip.playbackGain??1,...request},token);
  }catch(error){if(token!==speechToken)return;await voiceChannel.release();message.textContent=error.name==='NotAllowedError'?'再次点击播放按钮允许声音':error.message;announceVoice('error',message.textContent);}
  finally{if(token===speechToken)loading=false;}
}
async function playOutfitLine(next=preferredLanguage,request={source:'outfit',priority:95}){
  policy.manual();const token=++speechToken;loading=true;if(!await pauseForSwitch(token))return;
  try{outfitManifest??=await json(new URL('audio/halloween-voices-20261031/manifest.json',root));const language=normalizeVoiceLanguage(next),clip=outfitManifest.languages[language],cacheKey='halloween-'+language;if(!tracks.has(cacheKey))tracks.set(cacheKey,await json(new URL(clip.performanceData,root)));const track=tracks.get(cacheKey);if(track.audio!==clip.audio)throw Error('Costume voice registration mismatch');await activate(track,clip.sha256,language,{kind:'halloween',id:'halloween-transform',label:clip.text,expression:'happy',source:request.source??'outfit',priority:request.priority??95},token);}
  catch(error){if(token!==speechToken)return;await voiceChannel.release();message.textContent=error.message;announceVoice('error',message.textContent);}finally{if(token===speechToken)loading=false;}
}
async function switchOutfit(value,announce=false){
  if(!outfits)return;
  if(normalizeOutfit(value)!=='witch'&&playback?.source==='outfit')stopSpeech();
  try{await outfits.select(value,announce);}catch(error){message.textContent=error.message;parent.postMessage({type:'dsh-whale-model-error',error:error.message},origin);}
}
function stopSpeech(quiet=false){speechToken++;loading=false;audio.pause();audio.currentTime=0;voiceChannel.release();message.textContent='';if(quiet)policy.suspend();announceVoice('stopped');}
function configure(value,options={}){
  settings={...settings,...value};
  preferredLanguage=normalizeVoiceLanguage(settings.voiceLanguage??preferredLanguage);settings.idleMotion=normalizeIdleMotion(settings.idleMotion);
  if(['full','upper'].includes(settings.cameraMode))cameraMode=settings.cameraMode;
  if(interactiveMode){canvas.setAttribute('aria-label',textFor(preferredLanguage).interact);canvas.setAttribute('aria-description',textFor(preferredLanguage).interactHint);}
  settings.bodyShowcaseGain=Number.isFinite(settings.bodyShowcaseGain)?clamp(settings.bodyShowcaseGain,.2,1.2):.8;
  policy.configure(interactiveMode&&settings.autoVoice&&document.visibilityState!=='hidden');
  if(!settings.autoVoice&&playback?.source==='event')stopSpeech();
  if(Object.hasOwn(value,'outfit'))switchOutfit(value.outfit,Boolean(options.outfitChanged));
}
function schedule(){
  if(!interactiveMode||document.visibilityState==='hidden'||loading)return;
  const busy=!audio.paused&&!audio.ended;
  const request=policy.next(busy?playback:null);
  if(request)playDefault(request.clipId,request);
}
function receive(event){
  if(event.origin!==origin||event.source!==parent)return;
  const value=event.data??{};
  if(value.type==='dsh-whale-state'&&autoExpression[value.state?.status]){state=value.state;configure({});policy.ingest(state);schedule();}
  if(value.type==='dsh-whale-settings')configure(value.settings??{},{outfitChanged:value.outfitChanged});
  if(value.type==='dsh-whale-expression'&&(value.expression==='auto'||expressions[value.expression]))override=value.expression;
  if(value.type==='dsh-whale-gaze')pointer={x:clamp(value.x,-1,1),y:clamp(value.y,-1,1)};
  if(value.type==='dsh-whale-intro')playIntro(value.language??'zh');
  if(value.type==='dsh-whale-default')playDefault(value.clipId);
  if(value.type==='dsh-whale-stop')stopSpeech(true);
  if(value.type==='dsh-whale-hit-test'&&interactiveMode){
    let solid=false;const rect=canvas.getBoundingClientRect(),x=Math.floor(Number(value.x)*canvas.width/rect.width),y=Math.floor(Number(value.y)*canvas.height/rect.height);
    if(x>=0&&y>=0&&x<canvas.width&&y<canvas.height)try{solid=context.getImageData(x,y,1,1).data[3]>32;}catch{}
    parent.postMessage({type:'dsh-whale-hit-result',id:value.id,solid},origin);
  }
}
addEventListener('message',receive);
document.addEventListener('visibilitychange',()=>{configure({});if(document.visibilityState==='hidden'&&playback?.source!=='manual')stopSpeech();});
if(interactiveMode){
  message.hidden=true;canvas.style.cursor='grab';canvas.style.touchAction='none';canvas.style.outline='none';canvas.setAttribute('role','button');canvas.setAttribute('tabindex','0');canvas.setAttribute('aria-label','和鲸鱼娘互动');canvas.setAttribute('aria-description','拖动调整位置，点击互动，方向键微调');
  const interact=()=>{const response=policy.click();clickKind=response.kind;gestureAt=time;parent.postMessage({type:'dsh-whale-interaction',...response},origin);schedule();};
  const cancelTap=()=>{clearTimeout(tapTimer);tapTimer=null;lastTap=null;};
  const tap=event=>{
    if(tapTimer&&lastTap&&Math.hypot(event.screenX-lastTap.x,event.screenY-lastTap.y)<24){
      cancelTap();doubleTapCount++;cameraMode=cameraMode==='full'?'upper':'full';
      parent.postMessage({type:'dsh-whale-view',mode:cameraMode},origin);return;
    }
    if(tapTimer){cancelTap();interact();}
    lastTap={x:event.screenX,y:event.screenY};tapTimer=setTimeout(()=>{tapTimer=null;lastTap=null;interact();},380);
  };
  addEventListener('pagehide',cancelTap);
  const dragMessage=(phase,event)=>parent.postMessage({type:'dsh-whale-drag',phase,dx:event.screenX-pointerDown.x,dy:event.screenY-pointerDown.y},origin);
  canvas.addEventListener('pointerdown',event=>{
    if(event.button!==0||pointerDown)return;
    const rect=canvas.getBoundingClientRect(),x=Math.floor((event.clientX-rect.left)*canvas.width/rect.width),y=Math.floor((event.clientY-rect.top)*canvas.height/rect.height);
    try{if(context.getImageData(x,y,1,1).data[3]<=32)return;}catch{return;}
    pointerDown={id:event.pointerId,x:event.screenX,y:event.screenY,at:performance.now()/1000,dragged:false};canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove',event=>{
    if(pointerDown?.id===event.pointerId){
      if(!pointerDown.dragged&&Math.hypot(event.screenX-pointerDown.x,event.screenY-pointerDown.y)>=6){cancelTap();pointerDown.dragged=true;dragStats.starts++;const rect=canvas.getBoundingClientRect();dragPhysics.begin(pointerDown.x,pointerDown.y,pointerDown.at,rect.width,rect.height);policy.drag();schedule();canvas.style.cursor='grabbing';dragMessage('start',event);}
      if(pointerDown.dragged){event.preventDefault();const dx=event.screenX-pointerDown.x,dy=event.screenY-pointerDown.y;if(dx< -12)dragStats.left=true;if(dx>12)dragStats.right=true;if(dy< -12)dragStats.up=true;if(dy>12)dragStats.down=true;dragPhysics.move(event.screenX,event.screenY,performance.now()/1000);dragMessage('move',event);return;}
    }
    if(settings.followPointer){const rect=canvas.getBoundingClientRect();pointer={x:clamp((event.clientX-rect.left)/rect.width*2-1,-1,1),y:clamp((event.clientY-rect.top)/rect.height*2-1,-1,1)};}
  });
  const finish=(event,cancelled=false)=>{
    if(pointerDown?.id!==event.pointerId)return;
    const moved=pointerDown.dragged||Math.hypot(event.screenX-pointerDown.x,event.screenY-pointerDown.y)>=6;
    if(pointerDown.dragged){if(!cancelled)dragMessage('move',event);dragMessage('end',event);dragPhysics.end();dragStats.releases++;policy.dragEnd();}
    pointerDown=null;canvas.style.cursor='grab';if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);
    if(!cancelled&&!moved)tap(event);
  };
  canvas.addEventListener('pointerup',event=>finish(event));canvas.addEventListener('pointercancel',event=>finish(event,true));canvas.addEventListener('lostpointercapture',event=>finish(event,true));
  canvas.addEventListener('keydown',event=>{
    if(event.code==='Enter'||event.code==='Space'){event.preventDefault();interact();}
    const direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.code];
    if(direction){event.preventDefault();parent.postMessage({type:'dsh-whale-nudge',dx:direction[0]*(event.shiftKey?32:12),dy:direction[1]*(event.shiftKey?32:12)},origin);}
  });
}
audio.addEventListener('error',()=>{voiceChannel.release();message.textContent='语音载入失败';announceVoice('error',message.textContent);});
audio.addEventListener('ended',()=>{if(audio.ended){announceVoice('ended');voiceChannel.release();}});
audio.addEventListener('pause',()=>announceVoice('pause'));
audio.addEventListener('timeupdate',()=>announceVoice('timeupdate'));
function paint(now){
  raf=requestAnimationFrame(paint);
  const fps=audio.paused&&state.status==='idle'?15:20;
  if(now-previousPaint<1000/fps-1)return;
  const dt=clamp((now-last)/1000,.001,.06);last=now;previousPaint=now;time+=dt;
  schedule();
  const speaking=Boolean(data&&!audio.paused&&!audio.ended);
  const key=override==='auto'?(speaking&&playback?.expression?playback.expression:autoExpression[state.status]??'normal'):override;
  const target={...defaults,eyeScale:.96,eyeSpacing:.96,eyeLOpen:1,eyeROpen:1,eyeSmile:0,eyeSmileL:0,eyeExpression:0,mouthExpression:0,browExpression:0,faceShade:0,headBodyFollow:1,...expressions[key]};
  const thought=state.status==='thinking';
  const gx=settings.followPointer?pointer.x:0,gy=settings.followPointer?pointer.y:0;
  target.angleX=Math.sin(time*.7)*4.3+gx*5;
  target.angleY=Math.sin(time*.51)*1.2+gy*2;
  target.angleZ=Math.sin(time*.6)*1+(thought?2.2:0);
  target.bodyAngleX=Math.sin(time*.7-.2)*1.8;target.bodyAngleZ=Math.sin(time*.6-.2)*.7;
  target.poseArmL=Math.sin(time*.66)*.5;target.poseArmR=-Math.sin(time*.69+.4)*.45;
  target.poseTail=Math.sin(time*.75)*1.2;target.poseTailMid=Math.sin(time*.75+.5)*1.6;
  target.poseSkirt=Math.sin(time*.6)*.3;target.breath=(Math.sin(time*1.5)+1)*.22;
  target.gazeX=gx*.65;target.gazeY=gy*.5;
  const dragResponse=dragPhysics.sample(now/1000);dragStats.peakEnergy=Math.max(dragStats.peakEnergy,dragResponse.energy);dragMix+=((dragResponse.dragging?1:0)-dragMix)*(1-Math.exp(-dt*8));
  const bodyMotion=interactiveMode&&settings.bodyShowcase?sampleIdleMotion(settings.idleMotion,time*.7,settings.bodyShowcaseGain*(1-dragMix*.72)):{};
  for(const name of new Set([...Object.keys(motionBlend),...Object.keys(bodyMotion)])){motionBlend[name]=(motionBlend[name]??0)+((bodyMotion[name]??0)-(motionBlend[name]??0))*(1-Math.exp(-dt*7));target[name]=(target[name]??0)+motionBlend[name];}
  const age=time-gestureAt;
  if(age>=0&&age<2){const kick=Math.sin(age*9)*Math.exp(-age*2.7);target.angleZ+=kick*(clickKind==='focus'?3:2);target.angleY+=kick*2;target.eyeFlowPulse=age<.12?1:0;}
  target.angleX=clamp(target.angleX,-30,30);target.angleY=clamp(target.angleY,-30,30);target.bodyAngleX=clamp(target.bodyAngleX,-10,10);target.bodyAngleZ=clamp(target.bodyAngleZ,-10,10);
  for(const key of Object.keys(target)){
    if(/Expression$/.test(key))pose[key]=target[key];
    else pose[key]=(pose[key]??target[key])+(target[key]-(pose[key]??target[key]))*(1-Math.exp(-dt*9));
  }
  let blink=1;const q=time%4.7-4.35;
  if(q>=0)blink=q<.1?1-smooth(q/.1):q<.14?0:smooth((q-.14)/.21);
  if(speaking)for(const at of data.blinks??[]){const b=audio.currentTime-at;if(b>=0&&b<.28)blink*=b<.08?1-smooth(b/.08):b<.12?0:smooth((b-.12)/.16);}
  const p={...pose,eyeLOpen:pose.eyeLOpen*blink,eyeROpen:pose.eyeROpen*blink,voiceActive:speaking?1:0};
  for(const [name,value] of Object.entries(dragResponse.pose))p[name]=(p[name]??0)+value;
  p.angleX=clamp(p.angleX,-30,30);p.angleY=clamp(p.angleY,-30,30);p.angleZ=clamp(p.angleZ,-12,12);p.bodyAngleX=clamp(p.bodyAngleX,-10,10);p.bodyAngleZ=clamp(p.bodyAngleZ,-10,10);
  const holdingRice=Boolean(interactiveMode&&(state.compactionActive||time<riceUntil));
  if(holdingRice){p.bodyAngleX=clamp(p.bodyAngleX,-2.5,2.5);p.bodyAngleZ=clamp(p.bodyAngleZ,-2.5,2.5);}
  const speech=speaking?{active:true,weights:sampleMouthWeights(data,audio.currentTime).weights}:null;
  const quality=renderQuality(innerWidth,innerHeight,devicePixelRatio,faceView?'face':cameraMode,current.rig.image.width/current.rig.image.height);
  const [w,h]=quality.output;
  engine.style.width=quality.css[0]+'px';engine.style.height=quality.css[1]*(1+(current.renderPadding??0))+'px';
  const started=performance.now();const result=current.draw(p,'normal',dt,speech,{rice:holdingRice});renderMs=performance.now()-started;
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  context.clearRect(0,0,w,h);context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';
  const surface=current.surface;
  let bodyFrame=null;
  if(faceView){
    const sw=surface.width*.56,sh=Math.min(surface.height,sw*h/w),cx=result.focus[0]/1080*surface.width,cy=result.focus[1]/1920*surface.height;
    context.drawImage(surface,clamp(cx-sw/2,0,surface.width-sw),clamp(cy-sh*.38,0,surface.height-sh),sw,sh,0,0,w,h);
  }else{
    cameraMix+=((cameraMode==='upper'?1:0)-cameraMix)*(1-Math.exp(-dt*10));
    bodyFrame=bodyFramePlacement(w,h,current.rig.image,current.viewFrame,cameraMix);
    context.drawImage(surface,bodyFrame.x,bodyFrame.y,bodyFrame.width,bodyFrame.height);
  }
  if(speaking){
    metrics.frames++;metrics.maxOpen=Math.max(metrics.maxOpen,1-(result.weights?.closed??1));
    const dominant=Object.entries(result.weights??{}).sort((a,b)=>b[1]-a[1])[0]?.[0];
    if(dominant&&dominant!=='closed')metrics.shapes.add(dominant.split('_')[0]);
  }
  frameCount++;
  document.body.dataset.companionState=JSON.stringify({ready:true,revision:'halloween-events-20261031',outfit:outfits?.selected??'maid',costumePhysics:current.costumePhysics??null,interactiveMode,voiceChannel:voiceChannel.snapshot(),surface:settings.surface??'preview',cameraMode,cameraMix,doubleTapCount,autoVoice:settings.autoVoice,followPointer:settings.followPointer,bodyShowcase:settings.bodyShowcase,bodyShowcaseGain:settings.bodyShowcaseGain,idleMotion:normalizeIdleMotion(settings.idleMotion),dragPhysics:{dragging:dragResponse.dragging,energy:dragResponse.energy,response:dragResponse.response,stats:dragStats},holdingRice,riceArtwork:result.artwork,status:state.status,expression:key,speaking,language,preferredLanguage,clipId:playback?.id??null,clipKind:playback?.kind??null,voiceSource:playback?.source??null,interaction:policy.snapshot(),gaze:[p.gazeX,p.gazeY],angles:[p.angleX,p.angleY,p.bodyAngleX,p.bodyAngleZ],audioTime:audio.currentTime,audioEnded:audio.ended,clipFrames:metrics.frames,clipMaxOpen:metrics.maxOpen,frameCount,renderMs:Math.round(renderMs*10)/10,engineSize:[engine.width,engine.height],outputSize:[w,h],bodyFrame,renderDensity:quality.density,riceRigid:result.artwork?.rigid??false,riceShoulderError:result.artwork?.shoulderError??0,eyeSize:current.confirmed.eyeSize,eyeDistance:current.confirmed.eyeDistance,mouthScale:current.confirmed.mouthScale,weights:result.weights});
}
try{
  current=await createCurrentAvatar(engine);
  outfits=createOutfitSwitcher({model:current,engine,load:async key=>{const canvas=document.createElement('canvas');canvas.style.cssText='position:fixed;left:-10000px;top:0';document.body.append(canvas);try{const factory=key==='witch'?(await import('../halloween-physics-20261031-v6/companion-avatar.js')).createWitchCompanion:createCurrentAvatar;return{model:await factory(canvas),engine:canvas};}catch(error){canvas.remove();throw error;}},onChange:({model,engine:next,outfit,announce})=>{current=model;engine=next;current.avatar.setSwayGain(1);parent.postMessage({type:'dsh-whale-outfit-ready',outfit},origin);if(announce)playOutfitLine();}});
  await switchOutfit(settings.outfit??'maid',false);
  current.avatar.setSwayGain(1);message.textContent='';
  parent.postMessage({type:'dsh-whale-ready',revision:'body-20261030-v16'},origin);
  last=performance.now();raf=requestAnimationFrame(paint);
}catch(error){message.textContent='模型载入失败：'+error.message;document.body.dataset.companionState=JSON.stringify({ready:false,error:error.message});parent.postMessage({type:'dsh-whale-model-error',error:message.textContent},origin);console.error(error);}
addEventListener('pagehide',()=>{cancelAnimationFrame(raf);stopSpeech();outfits?.destroy();removeEventListener('message',receive);});
