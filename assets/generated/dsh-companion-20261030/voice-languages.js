export const VOICE_LANGUAGES=['zh','en','ja'];
export const normalizeVoiceLanguage=value=>VOICE_LANGUAGES.includes(value)?value:'zh';
export function selectVoiceClip(index,id,language){
  const selected=normalizeVoiceLanguage(language),clip=index.languages?.[selected]?.clips?.find(item=>item.id===id);
  if(!clip)throw Error('未找到所选语言的语音：'+selected+'/'+id);
  if(clip.language!==selected)throw Error('语音清单语言不一致');
  return clip;
}
export const voiceTrackKey=(language,id)=>normalizeVoiceLanguage(language)+':'+id;
