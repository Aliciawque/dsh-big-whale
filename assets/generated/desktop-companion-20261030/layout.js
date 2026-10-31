const clamp=(value,min,max)=>Math.max(min,Math.min(Math.max(min,max),value));
const rect=(x,y,width,height)=>({x,y,width,height});

// The saved position belongs to the character, never to a temporary menu layout.
export function companionLayout(area,preferred,width,height,open=false){
  const margin=Math.min(12,area.width/12,area.height/12),gap=20;
  const inner=rect(area.x+margin,area.y+margin,area.width-margin*2,area.height-margin*2);
  const fit=Math.min(1,inner.width/width,inner.height/height);
  let body=rect(clamp(preferred.x,inner.x,inner.x+inner.width-width*fit),clamp(preferred.y,inner.y,inner.y+inner.height-height*fit),width*fit,height*fit);
  let menu=null,placement='closed';
  if(open){
    const left=body.x-inner.x-gap,right=inner.x+inner.width-body.x-body.width-gap;
    let side=left>=right?'left':'right';
    if(Math.max(left,right)>=240){
      const mw=Math.min(300,Math.max(left,right));
      menu=rect(side==='left'?body.x-gap-mw:body.x+body.width+gap,0,mw,0);
    }else if(inner.width-body.width-gap>=240){
      const mw=Math.min(300,inner.width-body.width-gap);
      if(side==='left')body.x=clamp(body.x,inner.x+mw+gap,inner.x+inner.width-body.width);
      else body.x=clamp(body.x,inner.x,inner.x+inner.width-body.width-mw-gap);
      menu=rect(side==='left'?body.x-gap-mw:body.x+body.width+gap,0,mw,0);
    }else{
      // Narrow windows use two separate rows; closing restores the original scale.
      const mh=Math.min(400,inner.height*.44),availableHeight=Math.max(1,inner.height-mh-gap);
      const scale=Math.min(1,inner.width/width,availableHeight/height);
      body=rect(inner.x+(inner.width-width*scale)/2,inner.y,width*scale,height*scale);
      menu=rect(inner.x+(inner.width-Math.min(300,inner.width))/2,inner.y+inner.height-mh,Math.min(300,inner.width),mh);
      placement='stacked';
    }
    if(placement!=='stacked'){
      menu.height=Math.min(650,Math.max(1,inner.height-84));
      menu.y=clamp(body.y+body.height*.32-42,inner.y+84,inner.y+inner.height-menu.height);
      placement=side;
    }
  }
  const iconSize=76;
  let icon;
  if(menu&&placement!=='stacked')icon=rect(menu.x+menu.width-iconSize,menu.y-80,iconSize,iconSize);
  else if(!menu){
    const x=body.x-inner.x>=iconSize+2?body.x-iconSize-2:body.x+body.width+2;
    icon=rect(clamp(x,inner.x,inner.x+inner.width-iconSize),clamp(body.y+body.height*.32-14,inner.y+4,inner.y+inner.height-iconSize-4),iconSize,iconSize);
  }
  return {body,menu,icon,placement,temporaryScale:body.width/width};
}
