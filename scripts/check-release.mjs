import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url))),assets=path.join(root,'assets');
const json=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const pkg=await json(path.join(root,'package.json')),index=await json(path.join(root,'market-index.json'));
assert.equal(index.format,1);assert.equal(index.plugins[0].versions[0].version,pkg.version);assert.equal((await json(path.join(root,'desktop/package.json'))).version,pkg.version);
let files=0,syntax=0;async function scan(directory){for(const item of await fs.readdir(directory,{withFileTypes:true})){const file=path.join(directory,item.name);if(item.isDirectory())await scan(file);else{files++;assert.ok(!/(?:\.local\.|\.npmrc$|\.env$)/.test(item.name),'Private file: '+file);if(/\.(?:js|mjs|cjs)$/.test(file)){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);syntax++;}else if(file.endsWith('.json'))await json(file);}}}
for(const dir of ['assets','lib','desktop','bin'])await scan(path.join(root,dir));
const registered=await json(path.join(assets,'generated/halloween-physics-20261031-v6/registration.json'));
const registrationDir=path.join(assets,'generated/halloween-physics-20261031-v6');let costumeTextures=0;
for(const part of [...registered.parts,...registered.supportAssets]){
 const file=part.asset?path.resolve(registrationDir,part.asset):path.join(assets,'generated/halloween-outfit-20261031-v1/layers-v1',part.file);
 assert.ok(file.startsWith(assets+path.sep));await fs.access(file);costumeTextures++;
 if(part.sourceMatteAsset){await fs.access(path.resolve(registrationDir,part.sourceMatteAsset));costumeTextures++;}
}
const speech=await json(path.join(assets,'audio/halloween-voices-20261031/manifest.json'));
for(const lang of ['zh','en','ja']){const clip=speech.languages[lang],track=await json(path.join(assets,clip.performanceData)),bytes=await fs.readFile(path.join(assets,clip.audio));assert.equal(createHash('sha256').update(bytes).digest('hex'),clip.sha256);assert.equal(track.sourceSHA256,clip.sha256);assert.equal(track.audio,clip.audio);assert.equal(track.duration,clip.duration);}
const galleryImages=[['maid-halfbody-hd.png',2048,2560],['maid-fullbody-hd.png',2048,3640],['witch-halfbody-hd.png',2048,2560],['witch-fullbody-hd.png',2048,3640]];
for(const [name,width,height]of galleryImages){const bytes=await fs.readFile(path.join(root,'docs/screenshots',name));assert.equal(bytes.toString('hex',0,8),'89504e470d0a1a0a');assert.equal(bytes.readUInt32BE(16),width);assert.equal(bytes.readUInt32BE(20),height);}
for(const name of ['README.md','README.zh.md','README.ja.md']){const text=await fs.readFile(path.join(root,name),'utf8');assert.ok(text.includes('dsh-big-whale@'+pkg.version));for(const [image]of galleryImages)assert.ok(text.includes('https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/docs/screenshots/'+image),name+' is missing '+image);}
console.log(JSON.stringify({version:pkg.version,files,syntax,costumeTextures,voiceLanguages:3,passed:true}));
