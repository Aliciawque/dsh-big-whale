export function renderQuality(width,height,dpr=1,camera='full',imageAspect=941/1672){
 const density=Math.max(1,Math.min(3,dpr||1));
 const output=[Math.max(1,Math.round(width*density)),Math.max(1,Math.round(height*density))];
 const rendererDpr=Math.min(2,dpr||1);
 const visible=camera==='face'?.56:camera==='upper'?.7:1;
 const required=camera==='full'?Math.min(output[0],output[1]*imageAspect):output[0]/visible;
 const sourceWidth=Math.min(2048,Math.max(1024,Math.ceil(required*1.35/64)*64));
 return {output,source:[sourceWidth,Math.round(sourceWidth/imageAspect)],
  css:[sourceWidth/rendererDpr,Math.round(sourceWidth/imageAspect)/rendererDpr],density,oversample:1.35};
}
