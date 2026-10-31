// Outfit padding must not change the body's scale or its foot baseline.
export function bodyFramePlacement(width,height,image,frame={x:0,y:0,width:image.width,height:image.height},mix=0){
  const full=Math.min(width/image.width,height/image.height)*.98;
  const zoom=full+(width/(image.width*.7)-full)*mix;
  const origin={x:(width-image.width*zoom)/2,y:(height-image.height*full)*(1-mix)-image.height*.012*zoom*mix};
  return {x:origin.x+frame.x*zoom,y:origin.y+frame.y*zoom,width:frame.width*zoom,height:frame.height*zoom,worldScale:zoom,bodyOrigin:origin,footBaseline:origin.y+image.height*zoom};
}
