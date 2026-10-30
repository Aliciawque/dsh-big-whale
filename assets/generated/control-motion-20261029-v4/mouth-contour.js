// Register the lip contours before blending colors, so phonemes share one edge.
export function createContourMouth(){
 const cache=new Map(),N=64,layer=document.createElement('canvas');layer.width=512;layer.height=256;
 const gl=layer.getContext('webgl2',{alpha:true,premultipliedAlpha:true,preserveDrawingBuffer:true}),scan=document.createElement('canvas'),sg=scan.getContext('2d',{willReadFrequently:true}),textures=new Map();
 const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
 const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,`#version 300 es
 in vec2 a;out vec2 uv;void main(){uv=a*.5+.5;gl_Position=vec4(a,0.,1.);}`));
 gl.attachShader(program,shader(gl.FRAGMENT_SHADER,`#version 300 es
 precision highp float;in vec2 uv;out vec4 color;uniform sampler2D tex;uniform vec4 bounds;uniform vec2 imageSize;uniform vec4 box;uniform vec2 world;uniform float weight;
 uniform float sourceTop[64];uniform float sourceBot[64];uniform float targetTop[64];uniform float targetBot[64];
 void main(){vec2 p=vec2((uv.x*512.-256.)/8.,((1.-uv.y)*256.-48.)/8.);float u=(p.x-box.x)/box.z;
 if(u<0.||u>1.)discard;float f=clamp(u*64.-.5,0.,63.);int i=min(62,int(f));float t=f-float(i);
 float a=mix(sourceTop[i],sourceTop[i+1],t),b=mix(sourceBot[i],sourceBot[i+1],t),c=mix(targetTop[i],targetTop[i+1],t),d=mix(targetBot[i],targetBot[i+1],t);
 float v=a+(p.y-c)/max(.05,d-c)*(b-a);vec2 q=(bounds.xy+vec2(u,v)*bounds.zw)/imageSize;
 vec4 s=texture(tex,q);if(v<-.02||v>1.02)discard;color=vec4(s.rgb*s.a,s.a)*weight;}`));
 gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
 const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);
 const uni=name=>gl.getUniformLocation(program,name);
 function profile(c){
  const key=[c.image.src,...c.bounds].join(':');if(cache.has(key))return cache.get(key);
  const [bx,by,bw,bh]=c.bounds,[cx,cy]=c.crop;
  scan.width=N;scan.height=Math.ceil(bh);
  sg.drawImage(c.image,c.closed?bx:bx,c.closed?by:by,bw,bh,0,0,N,scan.height);
  const data=sg.getImageData(0,0,N,scan.height).data,p=[];
  for(let x=0;x<N;x++){
   let a=scan.height,b=-1;
   for(let y=0;y<scan.height;y++)if(data[(y*N+x)*4+3]>150){a=Math.min(a,y);b=y;}
   p.push(b<0?null:[a/scan.height,(b+1)/scan.height]);
  }
  for(let x=0;x<N;x++)if(!p[x]){let near=0;while(near<N&&!p[Math.max(0,x-near)]&&!p[Math.min(N-1,x+near)])near++;p[x]=p[Math.max(0,x-near)]??p[Math.min(N-1,x+near)]??[.4,.6];}
  cache.set(key,p);return p;
 }
 return{draw(pg,items,box){
  const active=items.filter(c=>c.weight>.0001),profiles=active.map(profile),top=[],bottom=[];
  for(let x=0;x<N;x++){
   top[x]=active.reduce((sum,c,i)=>sum+(c.world[1]+profiles[i][x][0]*c.world[3])*c.weight,0);
   bottom[x]=active.reduce((sum,c,i)=>sum+(c.world[1]+profiles[i][x][1]*c.world[3])*c.weight,0);
  }
  gl.viewport(0,0,512,256);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);
  gl.uniform4fv(uni('box'),box);gl.uniform1fv(uni('targetTop'),top);gl.uniform1fv(uni('targetBot'),bottom);
  const opening=active.reduce((sum,c)=>sum+(c.closed?0:c.weight),0),k=Math.min(1,opening/.08),openColor=k*k*(3-2*k);
  active.forEach((c,i)=>{
   let texture=textures.get(c.image);if(!texture){texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c.image);textures.set(c.image,texture);}else gl.bindTexture(gl.TEXTURE_2D,texture);
   // The closed smile controls closure geometry, never a dark patch over the oral cavity.
   const colorWeight=c.closed?1-openColor:opening>0?c.weight/opening*openColor:0;
   gl.uniform4fv(uni('bounds'),c.bounds);gl.uniform2f(uni('imageSize'),c.image.width,c.image.height);gl.uniform1f(uni('weight'),colorWeight);
   gl.uniform1fv(uni('sourceTop'),profiles[i].map(p=>p[0]));gl.uniform1fv(uni('sourceBot'),profiles[i].map(p=>p[1]));gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  });
  pg.setTransform(1,0,0,1,0,0);pg.clearRect(0,0,512,256);pg.globalAlpha=1;pg.globalCompositeOperation='source-over';pg.drawImage(layer,0,0);
  return{contourColumns:N,registered:true};
 }};
}
