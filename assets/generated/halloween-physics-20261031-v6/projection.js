export function worldProjection(width,height,imageWidth=941,imageHeight=1672,padTop=360){
 const scale=Math.min(width/imageWidth,height/(imageHeight+padTop));return{scale,x:(width-imageWidth*scale)/2,y:height-imageHeight*scale};
}
