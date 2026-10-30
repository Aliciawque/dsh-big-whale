window.__ModuleLoader__.load({id:'dsh-big-whale',factory(require){
 const React=require('react'),{useEffect,useState}=React,h=React.createElement;
 function Companion(){
  const [desktop,setDesktop]=useState(null),[clip,setClip]=useState('inset(100%)'),[starting,setStarting]=useState(false);
  useEffect(()=>{let alive=true;const poll=async()=>{try{const response=await fetch('/whale-companion/state');if(response.ok&&alive)setDesktop((await response.json()).desktop??{available:false});}catch{}};poll();const timer=setInterval(poll,1000);return()=>{alive=false;clearInterval(timer);};},[]);
  useEffect(()=>{
   if(!desktop||desktop.available)return;
   const frame=()=>document.getElementById('big-whale-web-surface');
   const receive=event=>{
    if(event.origin!==location.origin||event.source!==frame()?.contentWindow||event.data?.type!=='dsh-whale-regions')return;
    const rects=event.data.rects;if(!Array.isArray(rects)||rects.length>4)return;
    const paths=[];for(const r of rects){if(!['x','y','width','height'].every(k=>Number.isFinite(r[k]))||r.width<=0||r.height<=0)continue;
     const x=Math.max(0,r.x),y=Math.max(0,r.y),right=Math.min(innerWidth,r.x+r.width),bottom=Math.min(innerHeight,r.y+r.height);if(right>x&&bottom>y)paths.push(`M${x},${y}H${right}V${bottom}H${x}Z`);
    }setClip(paths.length?`path("${paths.join(' ')}")`:'inset(100%)');
   };
   const pointer=event=>frame()?.contentWindow?.postMessage({type:'dsh-whale-external-gaze',x:event.clientX,y:event.clientY},location.origin);
   addEventListener('message',receive);addEventListener('pointermove',pointer);return()=>{removeEventListener('message',receive);removeEventListener('pointermove',pointer);};
  },[desktop?.available]);
  if(!desktop)return null;
  if(!desktop.available)return h('iframe',{id:'big-whale-web-surface',title:'Big Whale companion',src:'/whale-companion/assets/generated/desktop-companion-20261030/shell.html',allow:'autoplay',style:{position:'fixed',inset:0,width:'100%',height:'100%',border:0,background:'transparent',clipPath:clip,pointerEvents:'auto'}});
  if(desktop.running||desktop.starting)return null;
  const start=async()=>{setStarting(true);try{const response=await fetch('/whale-companion/desktop/start',{method:'POST'});if(response.ok)setDesktop(await response.json());}finally{setStarting(false);}};
  return h('button',{'aria-label':'Start Big Whale',title:'大鲸鱼 / Big Whale / 大クジラ',onClick:start,disabled:starting,style:{position:'fixed',right:24,bottom:28,width:76,height:76,border:0,padding:0,background:'transparent',cursor:'pointer',pointerEvents:'auto'}},h('img',{src:'/whale-companion/assets/generated/whale-menu-20261030/whale-button-v2.png',alt:'',draggable:false,style:{width:'100%',height:'100%'}}));
 }
 return{name:'big-whale-client',inject:['slots'],apply(ctx){ctx.slots.inject('shell.overlay',function*(){yield ctx.slots.register({name:'shell.overlay',id:'big-whale',order:1100},Companion);});}};
}});
