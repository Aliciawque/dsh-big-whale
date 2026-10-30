const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
function spring(stiffness,damping){return{x:0,y:0,vx:0,vy:0,stiffness,damping};}
function advance(state,x,y,dt){
  const steps=Math.max(1,Math.ceil(dt*120)),step=dt/steps;
  for(let i=0;i<steps;i++){
    state.vx+=(state.stiffness*(x-state.x)-state.damping*state.vx)*step;
    state.vy+=(state.stiffness*(y-state.y)-state.damping*state.vy)*step;
    state.x=clamp(state.x+state.vx*step,-2,2);state.y=clamp(state.y+state.vy*step,-2,2);
  }
}
export function createDragPhysics(){
  const body=spring(95,11.8),tail=spring(48,7.2),tip=spring(31,6.1);
  let dragging=false,point=null,lastMove=0,lastSample=null,velocity={x:0,y:0},width=240,height=427;
  return{
    begin(x,y,now,w=240,h=427){dragging=true;point={x,y};lastMove=now;lastSample??=now;width=Math.max(120,w);height=Math.max(200,h);velocity={x:0,y:0};},
    move(x,y,now){
      if(!dragging||!point||![x,y,now].every(Number.isFinite))return;
      const dt=Math.max(.008,now-lastMove),alpha=1-Math.exp(-dt*22);
      velocity.x+=(clamp((x-point.x)/dt,-3500,3500)-velocity.x)*alpha;
      velocity.y+=(clamp((y-point.y)/dt,-3500,3500)-velocity.y)*alpha;
      point={x,y};lastMove=now;
    },
    end(){dragging=false;velocity={x:0,y:0};point=null;},
    sample(now){
      const dt=lastSample===null?0:clamp(now-lastSample,0,.2);lastSample=now;
      const fresh=dragging&&now-lastMove<.11;
      const x=fresh?clamp(velocity.x/(width*2.2),-1.35,1.35):0,y=fresh?clamp(velocity.y/(height*1.4),-1.25,1.25):0;
      advance(body,x,y,dt);advance(tail,body.x,body.y,dt);advance(tip,tail.x,tail.y,dt);
      const energy=Math.max(Math.abs(body.x),Math.abs(body.y),Math.abs(tail.x),Math.abs(tail.y),Math.abs(tip.x),Math.abs(tip.y));
      return{dragging,energy,velocity:[velocity.x,velocity.y],response:[body.x,body.y,tail.x,tail.y,tip.x,tip.y],pose:{angleX:-body.x*6.4,angleY:-body.y*6.2,angleZ:-body.x*4.2,bodyAngleX:-body.x*2.2,bodyAngleZ:-body.x*2.8,poseArmL:-body.x*.7+body.y*.9,poseArmR:-body.x*.6-body.y*.8,poseSkirt:tail.x*.65+tail.y*.55,poseApron:-tail.x*.45+tail.y*.45,poseTail:tail.x*2.8+tail.y*1.1,poseTailMid:tip.x*3.7+tip.y*1.7}};
    }
  };
}
