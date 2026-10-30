import {textFor,localeFor} from './i18n.js';
const $=id=>document.getElementById(id),bridge=window.whaleDesktop,frame=$('model'),panel=$('companion'),menu=$('menu'),whale=$('whale');
const voiceHistory=[];
const clamp=(value,min,max)=>Math.max(min,Math.min(Math.max(min,max),value)),root=new URL('../../',import.meta.url);
const get=async url=>{const response=await fetch(url);if(!response.ok)throw Error('资源未就绪');return response.json();};
const storage=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
let environment=bridge?await bridge.environment():null,saved=storage('dsh-whale-desktop-layout-v1',{}),size=Number.isFinite(saved.size)?clamp(saved.size,170,340):240,position=null,hidden=false,menuOpen=false,drag=null,mouse={x:0,y:0},hitId=0,interactive=false,state={status:'idle',label:'陪你写代码'},lastMetrics={};
const preferences={autoVoice:true,followPointer:true,bodyShowcase:true,bodyShowcaseGain:.8,idleMotion:'showcase',voiceLanguage:'zh',...storage('dsh-whale-desktop-preferences-v1',{})};
preferences.bodyShowcaseGain=Number.isFinite(preferences.bodyShowcaseGain)?clamp(preferences.bodyShowcaseGain,.2,1.2):.8;
const command=(type,extra={})=>frame.contentWindow?.postMessage({type,...extra},location.origin);
let viewMode=saved.viewMode==='upper'?'upper':'full';
const viewWidth=()=>size*(viewMode==='upper'?1.3:1);
function desktopAreas(){return environment?.displays.map(display=>({x:display.workArea.x-environment.bounds.x,y:display.workArea.y-environment.bounds.y,width:display.workArea.width,height:display.workArea.height}))??[{x:0,y:0,width:innerWidth,height:innerHeight}];}
function nearestArea(){const center={x:position.x+viewWidth()/2,y:position.y+size*.89};return desktopAreas().sort((a,b)=>distance(a,center)-distance(b,center))[0];}
function distance(area,point){return Math.hypot(point.x-clamp(point.x,area.x,area.x+area.width),point.y-clamp(point.y,area.y,area.y+area.height));}
function save(){localStorage.setItem('dsh-whale-desktop-layout-v1',JSON.stringify({...position,size,viewMode}));}
function constrain(){const area=nearestArea();position.x=clamp(position.x,area.x+12,area.x+area.width-viewWidth()-12);position.y=clamp(position.y,area.y+12,area.y+area.height-size*1.78-12);}
function defaultPosition(){const bounds=environment?.bounds??{x:0,y:0},area=environment?.primary??{x:0,y:0,width:innerWidth,height:innerHeight};return{x:area.x-bounds.x+area.width-size-30,y:area.y-bounds.y+area.height-size*1.78-14};}
position=Number.isFinite(saved.x)&&Number.isFinite(saved.y)?{x:saved.x,y:saved.y}:defaultPosition();constrain();
function layout(){
  panel.style.cssText=`left:${position.x}px;top:${position.y}px;width:${viewWidth()}px;height:${Math.round(size*1.78)}px;pointer-events:none`;
  frame.style.display=hidden?'none':'block';const area=nearestArea(),left=position.x-area.x>=94;
  whale.style.left=(left?position.x-78:position.x+viewWidth()+2)+'px';whale.style.top=clamp(position.y+size*1.78*.32-14,area.y+16,area.y+area.height-92)+'px';
  const wx=parseFloat(whale.style.left),wy=parseFloat(whale.style.top),mw=Math.min(300,area.width-24),mh=Math.min(650,area.height-24);
  menu.style.width=mw+'px';menu.style.maxHeight=mh+'px';menu.style.left=clamp(wx-area.x>=mw+22?wx-mw-12:wx+88,area.x+12,area.x+area.width-mw-12)+'px';menu.style.top=clamp(wy-28,area.y+12,area.y+area.height-mh-12)+'px';
  panel.dataset.position=JSON.stringify(position);panel.dataset.size=String(size);panel.dataset.menuOpen=String(menuOpen);
  panel.dataset.viewMode=viewMode;
  $('size').value=size;$('size-label').textContent=size+' px';
}
function setInteractive(value){if(value!==interactive){interactive=value;bridge?.interactive(value);}}
function contains(element,point){if(element.hidden||getComputedStyle(element).display==='none')return false;const r=element.getBoundingClientRect();return point.x>=r.left&&point.x<=r.right&&point.y>=r.top&&point.y<=r.bottom;}
function hitTest(){
  const id=++hitId;if(drag||contains(whale,mouse)||contains(menu,mouse)){setInteractive(true);return;}
  if(!hidden&&contains(frame,mouse)){const r=frame.getBoundingClientRect();command('dsh-whale-hit-test',{id,x:mouse.x-r.left,y:mouse.y-r.top});}else setInteractive(false);
}
function localize(){
  preferences.voiceLanguage=localeFor(preferences.voiceLanguage);const t=textFor(preferences.voiceLanguage);
  document.documentElement.lang={zh:'zh-CN',en:'en',ja:'ja'}[preferences.voiceLanguage];document.title=t.title;
  for(const element of document.querySelectorAll('[data-i18n]'))element.textContent=t[element.dataset.i18n];
  for(const [id,key,attribute] of [['companion','companion','aria-label'],['model','model','title'],['menu','menu','aria-label'],['close-menu','closeMenu','aria-label'],['quit','quit','aria-label'],['quit','quit','title'],['language','language','aria-label'],['expression','expression','aria-label'],['idle-motion','idleMotion','aria-label'],['idle-gain','gain','aria-label'],['size','size','aria-label'],['voice','voice','aria-label']])$(id).setAttribute(attribute,t[key]);
  for(const [move,key] of [['-24,0','left'],['24,0','right'],['0,-24','up'],['0,24','down']])document.querySelector(`[data-move="${move}"]`).setAttribute('aria-label',t[key]);
  for(const option of $('expression').options)option.textContent=t.expressions[option.value];
  for(const option of $('idle-motion').options)option.textContent=t.motions[option.value];
  for(const option of $('voice').options)option.textContent=t.voices[option.value]??option.value;
  whale.setAttribute('aria-label',menuOpen?t.collapseMenu:t.openMenu);whale.title=t.hint;$('hide').textContent=hidden?t.show:t.hide;
  $('status').textContent=t.statuses[state.status]??t.offline;
}
function toggleMenu(open,focus=false){menuOpen=open;menu.hidden=!open;whale.setAttribute('aria-expanded',String(open));whale.setAttribute('aria-label',open?textFor(preferences.voiceLanguage).collapseMenu:textFor(preferences.voiceLanguage).openMenu);layout();hitTest();if(open)$('close-menu').focus();else if(focus)whale.focus();}
function configure(){localize();for(const id of ['autoVoice','followPointer','bodyShowcase'])$(id).checked=Boolean(preferences[id]);$('language').value=preferences.voiceLanguage;$('idle-motion').value=preferences.idleMotion;$('idle-gain').value=preferences.bodyShowcaseGain;$('idle-gain-label').textContent=Math.round(preferences.bodyShowcaseGain*100)+'%';command('dsh-whale-settings',{settings:{...preferences,cameraMode:viewMode,surface:bridge?'desktop':'preview'}});localStorage.setItem('dsh-whale-desktop-preferences-v1',JSON.stringify(preferences));}
frame.addEventListener('load',()=>{configure();command('dsh-whale-state',{state});command('dsh-whale-expression',{expression:$('expression').value});});
addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==frame.contentWindow)return;const value=event.data??{};
  if(value.type==='dsh-whale-view'&&['full','upper'].includes(value.mode)&&!drag){const previous=viewWidth();viewMode=value.mode;position.x+=(previous-viewWidth())/2;constrain();layout();save();configure();hitTest();}
  if(value.type==='dsh-whale-hit-result'&&value.id===hitId&&!drag)setInteractive(Boolean(value.solid));
  if(value.type==='dsh-whale-drag'){
    if(value.phase==='start'){drag={...position};toggleMenu(false);setInteractive(true);}
    if(value.phase==='move'&&drag&&Number.isFinite(value.dx)&&Number.isFinite(value.dy)){position={x:clamp(drag.x+value.dx,12,innerWidth-viewWidth()-12),y:clamp(drag.y+value.dy,12,innerHeight-size*1.78-12)};layout();}
    if(value.phase==='end'){drag=null;constrain();layout();save();hitTest();}
  }
  if(value.type==='dsh-whale-nudge'&&Number.isFinite(value.dx)&&Number.isFinite(value.dy)){position.x+=clamp(value.dx,-40,40);position.y+=clamp(value.dy,-40,40);constrain();layout();save();}
  if(value.type==='dsh-whale-interaction')toggleMenu(false);
  if(value.type==='dsh-whale-voice'){
    $('transcript').textContent=value.error||(value.playing?value.transcript:'');
    if(['play','ended','error','stopped'].includes(value.event)){
      voiceHistory.push({at:Date.now(),event:value.event,clipId:value.clipId,source:value.source,language:value.language,frames:value.frames,maxOpen:value.maxOpen,shapes:value.shapes,time:value.time,duration:value.duration,error:Boolean(value.error)});
      if(voiceHistory.length>100)voiceHistory.shift();panel.dataset.voiceHistory=JSON.stringify(voiceHistory);
    }
  }
  if(value.type==='dsh-whale-model-error')$('status').textContent=value.error;
});
bridge?.onPointer(point=>{mouse=point;hitTest();if(preferences.followPointer)command('dsh-whale-gaze',{x:clamp((point.x-position.x-size*.5)/Math.max(250,nearestArea().width*.35),-1,1),y:clamp((point.y-position.y-size*.22)/Math.max(200,nearestArea().height*.4),-1,1)});});
bridge?.onEnvironment(value=>{environment=value;constrain();layout();save();});
bridge?.onBlur(()=>{if(menuOpen)toggleMenu(false);});
document.addEventListener('pointermove',event=>{mouse={x:event.clientX,y:event.clientY};hitTest();});
whale.addEventListener('click',()=>toggleMenu(!menuOpen));$('close-menu').addEventListener('click',()=>toggleMenu(false,true));
addEventListener('keydown',event=>{if(event.key==='Escape'&&menuOpen){event.preventDefault();toggleMenu(false,true);}});
document.addEventListener('pointerdown',event=>{if(menuOpen&&!menu.contains(event.target)&&!whale.contains(event.target))toggleMenu(false);},true);
for(const id of ['autoVoice','followPointer','bodyShowcase'])$(id).addEventListener('change',()=>{preferences[id]=$(id).checked;configure();});
$('idle-motion').addEventListener('change',()=>{preferences.idleMotion=$('idle-motion').value;configure();});
$('idle-gain').addEventListener('input',()=>{preferences.bodyShowcaseGain=Number($('idle-gain').value);configure();});
$('expression').addEventListener('change',()=>command('dsh-whale-expression',{expression:$('expression').value}));
$('language').addEventListener('change',()=>{preferences.voiceLanguage=$('language').value;configure();loadVoices();});
$('intro').addEventListener('click',()=>command('dsh-whale-intro',{language:$('language').value}));$('stop').addEventListener('click',()=>command('dsh-whale-stop'));
$('rice').addEventListener('click',()=>command('dsh-whale-default',{clipId:'rice'}));$('audition').addEventListener('click',()=>command('dsh-whale-default',{clipId:$('voice').value}));
$('size').addEventListener('input',()=>{size=Number($('size').value);constrain();layout();save();});
for(const button of document.querySelectorAll('[data-move]'))button.addEventListener('click',()=>{const [x,y]=button.dataset.move.split(',').map(Number);position.x+=x;position.y+=y;constrain();layout();save();});
$('reset').addEventListener('click',()=>{size=240;position=defaultPosition();constrain();layout();save();});
$('hide').addEventListener('click',()=>{hidden=!hidden;$('hide').textContent=hidden?textFor(preferences.voiceLanguage).show:textFor(preferences.voiceLanguage).hide;layout();hitTest();});
$('quit').addEventListener('click',()=>bridge?.close());$('open-host').addEventListener('click',()=>bridge?.openHost());
async function poll(){try{state=await get('/whale-companion/state');$('status').textContent=textFor(preferences.voiceLanguage).statuses[state.status]??textFor(preferences.voiceLanguage).offline;command('dsh-whale-state',{state});}catch{$('status').textContent=textFor(preferences.voiceLanguage).offline;}}
async function loadVoices(){try{const language=preferences.voiceLanguage,index=await get(new URL('audio/multilingual-defaults-20261030/manifest.json',root));if(language!==preferences.voiceLanguage)return;const previous=$('voice').value,fragment=document.createDocumentFragment();for(const clip of index.languages[language].clips){const option=document.createElement('option');option.value=clip.id;option.textContent=textFor(language).voices[clip.id]??clip.label;fragment.append(option);}$('voice').replaceChildren(fragment);if(index.languages[language].clips.some(clip=>clip.id===previous))$('voice').value=previous;}catch{}}
layout();configure();poll();loadVoices();setInterval(poll,400);
setInterval(()=>{try{const raw=frame.contentDocument?.body?.dataset.companionState;if(raw)lastMetrics=JSON.parse(raw);}catch{}bridge?.report({...lastMetrics,position,menuOpen,uiLanguage:preferences.voiceLanguage,voiceHistory,bodyShowcaseGain:preferences.bodyShowcaseGain,weightsClosed:lastMetrics.weights?.closed});},500);
if(!bridge){$('status').textContent='请通过 DSH 启动桌面伙伴';}

// In-page fallback exposes only visible companion rectangles to its parent.
if(!bridge&&parent!==window){
 const publishRegions=()=>{const elements=[frame,whale,...(!menu.hidden?[menu]:[])];const rects=elements.filter(el=>!el.hidden).map(el=>{const r=el.getBoundingClientRect(),pad=el===whale?16:2;return{x:r.x-pad,y:r.y-pad,width:r.width+pad*2,height:r.height+pad*2};});parent.postMessage({type:'dsh-whale-regions',rects},location.origin);};
 const gaze=(x,y)=>{if(!preferences.followPointer||!position)return;command('dsh-whale-gaze',{x:clamp((x-position.x-size*.5)/Math.max(250,innerWidth*.35),-1,1),y:clamp((y-position.y-size*.22)/Math.max(200,innerHeight*.4),-1,1)});};
 document.addEventListener('pointermove',event=>gaze(event.clientX,event.clientY));
 addEventListener('message',event=>{if(event.origin===location.origin&&event.source===parent&&event.data?.type==='dsh-whale-external-gaze'&&Number.isFinite(event.data.x)&&Number.isFinite(event.data.y))gaze(event.data.x,event.data.y);});
 const regionsTimer=setInterval(publishRegions,200);publishRegions();addEventListener('pagehide',()=>clearInterval(regionsTimer));
}
