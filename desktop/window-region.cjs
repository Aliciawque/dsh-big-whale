function normalizeRegion(rects,bounds){
  if(!Array.isArray(rects)||rects.length>8)return null;
  const result=[];
  for(const rect of rects){
    if(!rect||!['x','y','width','height'].every(key=>Number.isFinite(rect[key]))||rect.width<=0||rect.height<=0)continue;
    const x=Math.max(0,Math.floor(rect.x)),y=Math.max(0,Math.floor(rect.y));
    const right=Math.min(bounds.width,Math.ceil(rect.x+rect.width)),bottom=Math.min(bounds.height,Math.ceil(rect.y+rect.height));
    if(right>x&&bottom>y)result.push({x,y,width:right-x,height:bottom-y});
  }
  return result.length?result:[{x:0,y:0,width:1,height:1}];
}
function applyWindowRegion(window,rects){
  const region=normalizeRegion(rects,window.getBounds());if(!region)return;
  if(process.platform==='win32'||process.platform==='linux')window.setShape(region);
  window.__gardenRegion=region;
}
module.exports={normalizeRegion,applyWindowRegion};
