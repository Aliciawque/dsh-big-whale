const {app,BrowserWindow,screen,ipcMain,shell}=require('electron');
const fs=require('node:fs/promises'),path=require('node:path');
const {applyWindowRegion}=require('./window-region.cjs');
const argument=(name,fallback)=>process.argv.find(value=>value.startsWith('--'+name+'='))?.slice(name.length+3)??fallback;
const origin=argument('dsh-origin','http://127.0.0.1:3080'),hostPid=Number(argument('host-pid','0'));
if(!/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)||!Number.isSafeInteger(hostPid)||hostPid<=0)process.exit(2);
const install=path.resolve(__dirname,'..'),dataPath=argument('data-path',path.join(require('node:os').homedir(),'.dsh/plugin-data/big-whale')),runtimeFile=path.join(dataPath,'desktop-runtime.json');
const shellPath='/whale-companion/assets/generated/desktop-companion-20261030/shell.html';
app.setName('Big Whale Companion');app.setPath('userData',path.join(dataPath,'desktop-profile'));
if(!app.requestSingleInstanceLock()){app.exit(23);}else{
  let window,ignore=true,renderer={},closing=false,closeReason='',loadError='',cursorTimer,statusTimer,ownerTimer,startedAt=new Date().toISOString(),writeQueue=Promise.resolve();
  const allowed=event=>event.sender===window?.webContents&&event.senderFrame?.url===origin+shellPath;
  function displays(){return screen.getAllDisplays().map(value=>({id:value.id,bounds:value.bounds,workArea:value.workArea,scaleFactor:value.scaleFactor}));}
  function virtualBounds(){const values=displays(),x=Math.min(...values.map(v=>v.bounds.x)),y=Math.min(...values.map(v=>v.bounds.y));return{x,y,width:Math.max(...values.map(v=>v.bounds.x+v.bounds.width))-x,height:Math.max(...values.map(v=>v.bounds.y+v.bounds.height))-y};}
  function environment(){return{bounds:window.getBounds(),displays:displays(),primary:screen.getPrimaryDisplay().workArea};}
  async function record(reason=''){
    const value={version:'0.6.0-rc.3',pid:process.pid,hostPid,running:!closing,reason:closeReason||reason,loadError,startedAt,window:window&&!window.isDestroyed()?{bounds:window.getBounds(),visible:window.isVisible(),minimized:window.isMinimized(),alwaysOnTop:window.isAlwaysOnTop(),ignoresMouse:ignore,region:window.__gardenRegion??null,regionError:window.__gardenRegionError??null}:null,renderer};
    writeQueue=writeQueue.then(async()=>{try{await fs.writeFile(runtimeFile+'.tmp',JSON.stringify(value,null,2));await fs.rename(runtimeFile+'.tmp',runtimeFile);}catch{}});return writeQueue;
  }
  app.on('before-quit',event=>{if(closing)return;event.preventDefault();closing=true;clearInterval(cursorTimer);clearInterval(statusTimer);clearInterval(ownerTimer);record('closed').finally(()=>app.exit(0));});
  app.on('window-all-closed',()=>app.quit());
  app.whenReady().then(async()=>{
    app.setAccessibilitySupportEnabled(true);
    window=new BrowserWindow({...virtualBounds(),title:'大鲸鱼 · 桌面伙伴',frame:false,transparent:true,backgroundColor:'#00000000',show:false,alwaysOnTop:true,skipTaskbar:true,hasShadow:false,resizable:false,movable:false,minimizable:false,maximizable:false,fullscreenable:false,thickFrame:false,webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true,backgroundThrottling:false,autoplayPolicy:'no-user-gesture-required'}});
    window.setAlwaysOnTop(true,'pop-up-menu');window.setIgnoreMouseEvents(true,{forward:true});window.setMenu(null);
    window.webContents.setWindowOpenHandler(()=>({action:'deny'}));
    window.webContents.session.setPermissionRequestHandler((_contents,_permission,callback)=>callback(false));
    window.webContents.on('will-navigate',(event,url)=>{if(url!==origin+shellPath)event.preventDefault();});
    window.webContents.on('will-attach-webview',event=>event.preventDefault());
    window.webContents.on('render-process-gone',(_event,details)=>{closeReason='renderer-'+details.reason;app.quit();});
    window.on('blur',()=>window.webContents.send('whale:blur',null));
    window.on('focus',()=>window.webContents.focus());
    ipcMain.handle('whale:environment',event=>allowed(event)?environment():null);
    ipcMain.on('whale:region',(event,rects)=>{if(allowed(event))try{applyWindowRegion(window,rects);}catch(error){window.__gardenRegionError=String(error.message).slice(0,160);}});
    ipcMain.on('whale:interactive',(event,value)=>{if(!allowed(event)||typeof value!=='boolean')return;const next=!value;if(next!==ignore){ignore=next;window.setIgnoreMouseEvents(ignore,{forward:true});}});
    ipcMain.on('whale:close',event=>{if(allowed(event)){closeReason='user-close';app.quit();}});
    ipcMain.on('whale:open-host',event=>{if(allowed(event))shell.openExternal(origin+'/');});
    ipcMain.on('whale:state',(event,value)=>{
      if(!allowed(event)||!value||typeof value!=='object')return;
      const next={};for(const key of ['ready','speaking','holdingRice','menuOpen','autoVoice','followPointer','bodyShowcase','dragging'])if(typeof value[key]==='boolean')next[key]=value[key];
      for(const key of ['frameCount','audioTime','clipFrames','clipMaxOpen','weightsClosed','bodyShowcaseGain','eyeSize','eyeDistance','mouthScale','cameraMix','doubleTapCount'])if(Number.isFinite(value[key]))next[key]=value[key];
      for(const key of ['clipId','voiceSource','expression','status','language','preferredLanguage','uiLanguage','cameraMode','surface'])if(typeof value[key]==='string')next[key]=value[key].slice(0,80);
      if(value.dragPhysics){const drag=value.dragPhysics;next.dragPhysics={dragging:Boolean(drag.dragging),energy:Number(drag.energy)||0,response:Array.isArray(drag.response)?drag.response.filter(Number.isFinite).slice(0,6):[],stats:{starts:Number(drag.stats?.starts)||0,releases:Number(drag.stats?.releases)||0,peakEnergy:Number(drag.stats?.peakEnergy)||0,left:Boolean(drag.stats?.left),right:Boolean(drag.stats?.right),up:Boolean(drag.stats?.up),down:Boolean(drag.stats?.down)}};}
      if(Array.isArray(value.angles))next.angles=value.angles.filter(Number.isFinite).slice(0,4);
      if(value.position&&Number.isFinite(value.position.x)&&Number.isFinite(value.position.y))next.position={x:value.position.x,y:value.position.y};
      if(Array.isArray(value.voiceHistory))next.voiceHistory=value.voiceHistory.slice(-100).map(item=>({at:Number(item.at)||0,event:String(item.event??'').slice(0,20),clipId:String(item.clipId??'').slice(0,80),source:String(item.source??'').slice(0,20),language:String(item.language??'').slice(0,8),frames:Number(item.frames)||0,maxOpen:Number(item.maxOpen)||0,time:Number(item.time)||0,duration:Number(item.duration)||0,shapes:Array.isArray(item.shapes)?item.shapes.filter(v=>typeof v==='string').map(v=>v.slice(0,12)).slice(0,8):[],error:Boolean(item.error)}));
      if(value.voiceChannel)next.voiceChannel={held:Boolean(value.voiceChannel.held),stats:Object.fromEntries(['granted','blocked','duplicate','passive','lost'].map(key=>[key,Number(value.voiceChannel.stats?.[key])||0]))};
      if(typeof value.revision==='string')next.revision=value.revision.slice(0,80);
      if(typeof value.riceRigid==='boolean')next.riceRigid=value.riceRigid;
      for(const key of ['renderMs','renderDensity','riceShoulderError'])if(Number.isFinite(value[key]))next[key]=value[key];
      for(const key of ['engineSize','outputSize'])if(Array.isArray(value[key])&&value[key].length===2&&value[key].every(v=>Number.isFinite(v)&&v>0&&v<=16384))next[key]=value[key];
      renderer=next;
    });
    const changed=()=>{window.setBounds(virtualBounds());window.webContents.send('whale:environment-changed',environment());};
    for(const name of ['display-added','display-removed','display-metrics-changed'])screen.on(name,changed);
    cursorTimer=setInterval(()=>{if(!window.isDestroyed()){const cursor=screen.getCursorScreenPoint(),bounds=window.getBounds();window.webContents.send('whale:pointer',{x:cursor.x-bounds.x,y:cursor.y-bounds.y});}},40);
    statusTimer=setInterval(()=>{if(!window.isDestroyed()&&!window.isAlwaysOnTop())window.setAlwaysOnTop(true,'pop-up-menu');record();},1000);
    ownerTimer=setInterval(()=>{try{process.kill(hostPid,0);}catch{closeReason='host-ended';app.quit();}},1500);
    process.stdin.setEncoding('utf8');process.stdin.on('data',value=>{if(value.trim()==='quit'){closeReason='host-stop';app.quit();}});process.stdin.resume();
    let loaded=false;for(let attempt=0;attempt<6&&!loaded;attempt++){try{await window.loadURL(origin+shellPath);loaded=true;}catch(error){loadError=String(error.message).slice(0,400);await new Promise(resolve=>setTimeout(resolve,700));}}
    if(!loaded){closeReason='load-failed';app.quit();return;}
    window.showInactive();await record();
  }).catch(()=>{app.exit(3);});
}
