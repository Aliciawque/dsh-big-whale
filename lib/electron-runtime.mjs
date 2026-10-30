import {createRequire} from 'node:module';import {readFileSync,existsSync} from 'node:fs';import path from 'node:path';
const require=createRequire(import.meta.url);
// Resolving the npm package entry would run Electron's automatic installer.
// Inspect only its completed installation markers, without importing that entry.
export function findElectronBinary(packageFile){
 try{
  const file=packageFile??require.resolve('electron/package.json'),folder=path.dirname(file),metadata=JSON.parse(readFileSync(file,'utf8'));
  const relative=readFileSync(path.join(folder,'path.txt'),'utf8').trim(),dist=path.resolve(folder,'dist'),binary=path.resolve(dist,relative);
  if(!relative||!binary.startsWith(dist+path.sep)||!existsSync(binary))return null;
  if(readFileSync(path.join(dist,'version'),'utf8').trim().replace(/^v/,'')!==metadata.version)return null;
  return binary;
 }catch{return null;}
}
