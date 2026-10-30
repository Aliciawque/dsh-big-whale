import {sampleBodyMotion} from '../control-eyes-20261029-v11/motions.js';
export const IDLE_MOTIONS=['natural','twist','lean','shy','showcase'];
export const normalizeIdleMotion=kind=>IDLE_MOTIONS.includes(kind)?kind:'showcase';
export function sampleIdleMotion(kind,time,gain=1){
 const selected=normalizeIdleMotion(kind);
 return selected==='natural'?{}:sampleBodyMotion(selected,time,true,gain).pose;
}
