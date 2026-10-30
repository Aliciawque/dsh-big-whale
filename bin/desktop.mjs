#!/usr/bin/env node
import {createRequire} from 'node:module';import path from 'node:path';import {spawnSync} from 'node:child_process';
import {findElectronBinary} from '../lib/electron-runtime.mjs';
const require=createRequire(import.meta.url),command=process.argv[2]??'status';
if(command==='setup'){
 const install=path.join(path.dirname(require.resolve('electron/package.json')),'install.js');
 console.log('Installing the official Electron runtime for Big Whale. This downloads the runtime once.');
 const environment={...process.env};
 if(environment.HTTP_PROXY||environment.HTTPS_PROXY||environment.http_proxy||environment.https_proxy)environment.ELECTRON_GET_USE_PROXY='true';
 const flags=process.allowedNodeEnvironmentFlags.has('--use-env-proxy')?['--use-env-proxy']:[];
 const result=spawnSync(process.execPath,[...flags,install],{stdio:'inherit',windowsHide:true,env:environment});process.exit(result.status??1);
}
if(command!=='status')throw Error('Usage: big-whale-desktop [status|setup]');
console.log(JSON.stringify({available:Boolean(findElectronBinary()),platform:process.platform,nextStep:findElectronBinary()?undefined:'Run big-whale-desktop setup after installing the optional electron dependency.'}));
