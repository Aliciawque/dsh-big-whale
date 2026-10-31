export function reviewHasFace(group='all'){return ['all','noHair','neck','face'].includes(group);}
export function reviewLayerVisible(group='all',name,part){
 if(!group||group==='all')return true;
 const key=part?.halloween?.key??name;
 if(group==='handR')return /^part_hand_r/.test(name);
 if(group==='handL')return /^part_hand_l/.test(name)||key==='lanternGrip';
 if(group==='noHair')return part?.kind!=='hair'&&key!=='hatAhoge';
 if(group==='armL')return /^(sleeveL|cuffL|upperArmL|part_hand_l)/.test(key)||['lanternGrip','lanternPalm'].includes(key);
 if(group==='armR')return /^(sleeveR|cuffR|upperArmR|part_hand_r)/.test(key);
 if(group==='waist')return /^(bodice|skirt|waistJewel)/.test(key);
 if(group==='neck')return /^(part_face|part_nose|part_neck|eye[01]_|mouth_)/.test(name)||/^(collar|cape|bodice|bow|chestJewel|upperArm|shoulderSkinBase)/.test(key);
 if(group==='face')return /^(part_face|part_nose|eye[01]_|mouth_)/.test(name);
 return true;
}
