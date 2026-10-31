export const normalizeOutfit=value=>value==='witch'?'witch':'maid';
export function createOutfitSwitcher({initial='maid',model,engine,load,onChange}){
 let active=normalizeOutfit(initial),desired=active,generation=0,pending=null,announce=false;
 const cache=new Map([[active,Promise.resolve({model,engine})]]);
 return{get selected(){return active;},get requested(){return desired;},async select(value,userInitiated=false){
  const key=normalizeOutfit(value);
  if(key===desired&&pending){announce||=userInitiated;return pending;}
  if(key===active&&!pending)return{changed:false,outfit:active,model,engine};
  desired=key;announce=userInitiated;const token=++generation;
  if(!cache.has(key))cache.set(key,Promise.resolve().then(()=>load(key)).catch(error=>{cache.delete(key);throw error;}));
  pending=(async()=>{const next=await cache.get(key);if(token!==generation)return{stale:true};const changed=active!==key,shouldSpeak=changed&&key==='witch'&&announce;active=key;model=next.model;engine=next.engine;pending=null;announce=false;await onChange?.({...next,outfit:key,changed,announce:shouldSpeak});return{...next,outfit:key,changed,announce:shouldSpeak};})();
  try{return await pending;}catch(error){if(token===generation){desired=active;pending=null;announce=false;}throw error;}
 },destroy(){for(const value of cache.values())value.then(x=>{x.model.destroy();if(x.engine!==engine)x.engine.remove();}).catch(()=>{});cache.clear();}};
}
