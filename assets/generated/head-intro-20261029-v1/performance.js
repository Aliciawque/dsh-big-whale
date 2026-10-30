const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
const erf=x=>{const sign=x<0?-1:1,a=Math.abs(x),t=1/(1+.3275911*a);return sign*(1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-a*a));};
const cdf=x=>.5*(1+erf(x/Math.SQRT2));
export function sampleMouthWeights(data,time){
 const weights={closed:0,A_soft:0,A_normal:0,I_soft:0,I_normal:0,U_soft:0,U_normal:0,E_soft:0,E_normal:0,O_soft:0,O_normal:0};
 const at=time+.012,sigma=.034;
 const energyAt=t=>{const i=clamp(t/data.envelopeHop,0,data.envelope.length-1),j=Math.floor(i);return(data.envelope[j]??0)*(1-i+j)+(data.envelope[Math.min(j+1,data.envelope.length-1)]??0)*(i-j);};
 let energy=0,norm=0;for(let i=-5;i<=5;i++){const w=Math.exp(-.5*(i/2.2)**2);energy+=energyAt(time+i*.01)*w;norm+=w;}energy/=norm;
 const normal=clamp(.12+.82*Math.sqrt(energy/Math.max(.001,data.envelopeP95)));let covered=0,closure=0;
 // Integrate continuously over each phone interval rather than switching temporal taps.
 for(const cue of data.cues){
  if(cue.end<at-6*sigma||cue.start>at+6*sigma)continue;
  const w=Math.max(0,cdf((cue.end-at)/sigma)-cdf((cue.start-at)/sigma));covered+=w;
  if(cue.shape==='closed'){weights.closed+=w;closure=Math.max(closure,smooth((at-cue.start+.015)/.03)*smooth((cue.end-at+.015)/.03));continue;}
  if(cue.shape==='f'){weights.closed+=w*.78;weights.I_soft+=w*.22;continue;}
  const vowel=cue.shape.toUpperCase(),isVowel=/^(AA|AE|AH|AO|AW|AY|EH|ER|EY|IH|IY|OW|OY|UH|UW)$/.test(cue.phone);
  const openness=isVowel?1:.74,loud=isVowel?normal:normal*.25;
  weights.closed+=w*(1-openness);weights[vowel+'_soft']+=w*openness*(1-loud);weights[vowel+'_normal']+=w*openness*loud;
 }
 weights.closed+=Math.max(0,1-covered);
 const edge=smooth(time/.055)*smooth((data.duration-time)/.075),openGain=edge*(1-closure);
 let sum=0;for(const k of Object.keys(weights))if(k!=='closed'){weights[k]*=openGain;sum+=weights[k];}weights.closed=Math.max(0,1-sum);
 return{weights,energy,normal,dominant:Object.entries(weights).sort((a,b)=>b[1]-a[1])[0][0]};
}
