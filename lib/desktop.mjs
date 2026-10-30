import {spawn} from 'node:child_process';import {existsSync,mkdirSync} from 'node:fs';import {homedir} from 'node:os';import path from 'node:path';
import {findElectronBinary} from './electron-runtime.mjs';
export function createDesktopController(root,getOrigin){
 const dataPath=path.join(process.env.DSH_HOME?.trim()||path.join(homedir(),'.dsh'),'plugin-data','big-whale');
 let child=null,starting=false,closed=false,retries=0,lastError='',launchedAt=null;
 function executable(){
  if(process.env.DSH_BIG_WHALE_DISABLE_DESKTOP==='1'||process.platform!=='win32')return null;
  const override=process.env.DSH_BIG_WHALE_ELECTRON;if(override&&existsSync(override))return override;
  return findElectronBinary();
 }
 const environment=()=>Object.fromEntries(Object.entries(process.env).filter(([name])=>['SYSTEMROOT','WINDIR','COMSPEC','PATHEXT','PATH','TEMP','TMP','USERPROFILE','APPDATA','LOCALAPPDATA','ALLUSERSPROFILE','HOMEDRIVE','HOMEPATH','LANG'].includes(name.toUpperCase())));
 function start(){
  if(child||starting)return;closed=false;const binary=executable();if(!binary){lastError='DESKTOP_RUNTIME_MISSING';return;}
  mkdirSync(dataPath,{recursive:true});starting=true;lastError='';
  child=spawn(binary,[path.join(root,'desktop'),'--dsh-origin='+getOrigin(),'--host-pid='+process.pid,'--data-path='+dataPath],{cwd:path.join(root,'desktop'),env:environment(),windowsHide:true,stdio:['pipe','ignore','ignore']});
  const current=child;launchedAt=new Date().toISOString();starting=false;
  current.on('error',()=>{lastError='DESKTOP_START_FAILED';if(child===current)child=null;});
  current.on('exit',code=>{if(child===current)child=null;if(code===23&&!closed&&retries++<4)setTimeout(start,900);else if(code&&code!==23)lastError='DESKTOP_EXIT_'+code;});current.stdin.on('error',()=>{});
 }
 function stop(){closed=true;const current=child;if(current){current.stdin.write('quit\n');const timer=setTimeout(()=>{if(current.exitCode===null)current.kill();},2500);timer.unref();}}
 return{start,stop,snapshot(){return{available:Boolean(executable()),running:Boolean(child),starting,pid:child?.pid??null,lastError,launchedAt};}};
}
