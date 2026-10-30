import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCompanionState } from './state.mjs';
import { createDesktopController } from './desktop.mjs';
import { createAudioCoordinator } from './audio-coordinator.mjs';
export const name = 'whale-companion';
export const inject = ['webServer'];
const folder = path.dirname(fileURLToPath(import.meta.url));
const avatarRoot = path.resolve(folder,'../assets');
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.mavatar':'application/octet-stream', '.wav':'audio/wav', '.mp3':'audio/mpeg', '.ogg':'audio/ogg', '.css':'text/css; charset=utf-8' };
export async function apply(ctx) {
  const state = createCompanionState();
  const voices=createAudioCoordinator();
  const desktop=createDesktopController(path.resolve(folder,'..'),()=>ctx.webServer.getOrigin());
  const root = await realpath(avatarRoot);
  console.log('[big-whale] Companion ready.');
  ctx.effect(()=>{const timer=setTimeout(()=>desktop.start(),750);return()=>{clearTimeout(timer);desktop.stop();};},'whale-companion.desktop');
  ctx.on('session/event', (session, event) => state.dispatch(String(session.header?.id ?? session.id), event, session.header));
  ctx.on('agent/error', event => {
    const session = event.agent?.session;
    if (session) state.dispatch(String(session.header?.id ?? session.id), { type:'agent/error' }, session.header);
  });
  ctx.effect(() => ctx.webServer.register({ kind:'prefix', path:'/whale-companion', async handler(req,res) {
    const origin=ctx.webServer.getOrigin();
    if(req.headers.host!==new URL(origin).host||(req.headers.origin&&req.headers.origin!==origin)||req.headers['sec-fetch-site']==='cross-site'){res.writeHead(403).end();return;}
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
    const pathname=new URL(req.url,origin).pathname;
    if(req.method==='POST'&&/^\/whale-companion\/voice\/(claim|heartbeat|release)$/.test(pathname)){
      if(req.headers.origin!==origin){res.writeHead(403).end();return;}
      try{let body='';for await(const chunk of req){body+=chunk;if(body.length>4096)throw Error('Request too large');}const request=JSON.parse(body);const operation=pathname.split('/').at(-1),result=operation==='claim'?voices.claim(request,desktop.snapshot().running):voices[operation](request);res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(result));}catch{res.writeHead(400).end();}return;
    }
    if(req.method==='POST'&&pathname==='/whale-companion/desktop/start'){
      if(req.headers.origin!==origin){res.writeHead(403).end();return;}
      req.resume();desktop.start();res.setHeader('Content-Type','application/json; charset=utf-8');res.writeHead(202).end(JSON.stringify(desktop.snapshot()));return;
    }
    if(req.method!=='GET'){res.writeHead(405).end();return;}
    if(pathname==='/whale-companion/state') {
      res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify({...state.snapshot(),plugin:'dsh-big-whale',version:'0.6.0-rc.4',desktop:desktop.snapshot(),voice:voices.snapshot(),workspaceReady:false}));return;
    }
    if(!pathname.startsWith('/whale-companion/assets/')){res.writeHead(404).end();return;}
    let relative;
    try{relative=decodeURIComponent(pathname.slice('/whale-companion/assets/'.length));}catch{res.writeHead(400).end();return;}
    const candidate=path.resolve(root,relative),ext=path.extname(candidate).toLowerCase();
    if(!candidate.startsWith(root+path.sep)||!mime[ext]||relative.split(/[\\/]/).some(part=>part.startsWith('.')||['work','review'].includes(part))){res.writeHead(403).end();return;}
    try {
      const resolved=await realpath(candidate);
      if(!resolved.startsWith(root+path.sep)||(await stat(resolved)).isDirectory()){res.writeHead(403).end();return;}
      res.setHeader('Content-Type',mime[ext]);res.end(await readFile(resolved));
    }catch{res.writeHead(404).end();}
  }}), 'whale-companion.routes');
}
