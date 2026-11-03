import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCompanionState } from './state.mjs';
import { createDesktopController } from './desktop.mjs';
import { createAudioCoordinator } from './audio-coordinator.mjs';
import { createCompanionRoutes } from './routes.mjs';
export const name = 'whale-companion';
export const inject = ['webServer'];
const folder = path.dirname(fileURLToPath(import.meta.url));
export async function apply(ctx) {
  const {version} = JSON.parse(await readFile(path.resolve(folder,'../package.json'),'utf8'));
  const state = createCompanionState();
  const voices=createAudioCoordinator();
  const getOrigin=()=>ctx.webServer.getOrigin();
  const desktop=createDesktopController(path.resolve(folder,'..'),getOrigin);
  const handler=await createCompanionRoutes({assetsRoot:path.resolve(folder,'../assets'),getOrigin,state,voices,desktop,version});
  console.log('[big-whale] Companion ready.');
  ctx.effect(()=>{const timer=setTimeout(()=>desktop.start(),750);return()=>{clearTimeout(timer);desktop.stop();};},'whale-companion.desktop');
  ctx.on('session/event', (session, event) => state.dispatch(String(session.header?.id ?? session.id), event, session.header));
  ctx.on('agent/error', event => {
    const session = event.agent?.session;
    if (session) state.dispatch(String(session.header?.id ?? session.id), { type:'agent/error' }, session.header);
  });
  ctx.effect(() => ctx.webServer.register({ kind:'prefix', path:'/whale-companion', handler }), 'whale-companion.routes');
}
