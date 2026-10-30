const {contextBridge,ipcRenderer}=require('electron');
const subscribe=(name,callback)=>{const listener=(_event,value)=>callback(value);ipcRenderer.on(name,listener);return()=>ipcRenderer.removeListener(name,listener);};
contextBridge.exposeInMainWorld('whaleDesktop',{
  environment:()=>ipcRenderer.invoke('whale:environment'),
  interactive:value=>ipcRenderer.send('whale:interactive',Boolean(value)),
  close:()=>ipcRenderer.send('whale:close'),
  openHost:()=>ipcRenderer.send('whale:open-host'),
  report:value=>ipcRenderer.send('whale:state',value),
  onPointer:callback=>subscribe('whale:pointer',callback),
  onBlur:callback=>subscribe('whale:blur',callback),
  onEnvironment:callback=>subscribe('whale:environment-changed',callback)
});

// Restrict the native overlay to visible controls so transparent desktop space cannot occlude Chrome.
window.addEventListener('DOMContentLoaded',()=>{
  let scheduled=false,last='';
  const publish=()=>{
    scheduled=false;const rects=[];
    for(const [id,padding] of [['companion',48],['whale',16],['menu',16]]){
      const element=document.getElementById(id),model=document.getElementById('model');
      if(!element||element.hidden||(id==='companion'&&model&&getComputedStyle(model).display==='none'))continue;
      const style=getComputedStyle(element);if(style.display==='none'||style.visibility==='hidden')continue;
      const r=element.getBoundingClientRect();if(r.width&&r.height)rects.push({x:r.x-padding,y:r.y-padding,width:r.width+padding*2,height:r.height+padding*2});
    }
    const serialized=JSON.stringify(rects);if(serialized!==last){last=serialized;ipcRenderer.send('whale:region',rects);}
  };
  const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(publish);}};
  new MutationObserver(schedule).observe(document.body,{subtree:true,attributes:true,attributeFilter:['style','hidden','class']});
  window.addEventListener('resize',schedule);schedule();
});
