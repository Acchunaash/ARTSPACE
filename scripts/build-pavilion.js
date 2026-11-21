/* Build a compact, reusable glTF 2.0 architectural pavilion asset for ARTSPACE.
   The model is authored from shared mesh primitives and PBR materials; no runtime box-building. */
const fs=require("fs");
const path=require("path");
const out=path.join(process.cwd(),"assets","artspace-pavilion.glb");
fs.mkdirSync(path.dirname(out),{recursive:true});
const materials=[
 ["limestone",[.91,.885,.82,1],.015,.76],
 ["shadow-stone",[.49,.485,.45,1],.015,.94],
 ["champagne-bronze",[.52,.39,.255,1],.84,.24],
 ["dark-anodized-metal",[.105,.145,.15,1],.88,.22],
 ["low-iron-glass",[.78,.88,.89,.22],.06,.045],
 ["deep-glass",[.24,.36,.39,.38],.12,.085],
 ["architectural-concrete",[.69,.70,.68,1],.015,.94],
 ["smoked-oak",[.31,.205,.125,1],.015,.55],
 ["warm-emissive-light",[1,.88,.7,1],0,.25],
 ["landscape-green",[.356,.435,.356,1],0,.95]
];
const groups=materials.map(()=>[]);
const add=(m,s,p)=>groups[m].push({s,p});
const box=(m,w,h,d,x,y,z)=>add(m,[w,h,d],[x,y,z]);
const cylinder=(m,r,h,x,y,z)=>groups[m].push({c:[r,h],p:[x,y,z]});
// Site plane and floating plinth, long roof slab and continuous soffit.\nbox(6,70,.08,70,0,-1.83,2);
box(6,19,.48,24.2,0,-1.48,-.25);box(0,19.45,.22,24.65,0,-1.18,-.25);
box(0,19.7,.46,24.8,0,3.72,-.25);box(1,19.78,.075,24.84,0,3.43,-.25);
box(7,17.8,.10,22.6,0,3.46,-.25);
// Deep cantilevered entrance canopy and bronze shadow line.
box(0,19.8,.22,2.5,0,3.35,11.2);box(2,19.85,.08,.16,0,3.20,12.35);box(3,19.9,.09,.14,0,3.12,12.42);
// Limestone wings and back wall; side elevations have alternating solid and glazed bays.
box(0,6.1,4.55,.48,-6.55,1.05,11.62);box(0,6.1,4.55,.48,6.55,1.05,11.62);
box(0,18.5,4.55,.45,0,1.05,-12.25);
box(0,.42,5,23.5,-9.25,1,-.25);box(0,.42,5,23.5,9.25,1,-.25);
// Curtain wall lobby, door leaves, transoms and bronze handles.
box(3,6.1,4.65,.18,0,1,11.86);box(4,5.75,4.25,.035,0,1,11.74);
for(const x of [-2.8,-1.9,-.95,0,.95,1.9,2.8])box(3,.045,4.28,.09,x,1,11.68);
for(const y of [-1,.45,1.9,3.05])box(2,5.8,.035,.08,0,y,11.67);
for(const x of [-.12,.12])box(2,.035,.95,.1,x,0,11.58);
// Bronze brise-soleil and panelised stone elevations.
for(const side of [-1,1]){
 for(let i=0;i<11;i++)box(2,.075,4.75,.19,side*(3.62+i*.49),1.05,11.9);
 box(3,.11,1.55,8.8,side*9.02,1.8,-2.2);box(4,.045,1.35,8.55,side*8.94,1.8,-2.2);
 for(let j=0;j<6;j++)box(2,.12,1.48,.045,side*8.88,1.8,-6.25+j*1.62);
 for(const z of [-9.5,-6.8,-4.1,-1.4,1.3,4,6.7,9.4]){
  box(3,.07,2.45,1.15,side*9,.75,z);box(4,.035,2.25,1,side*8.955,.75,z);
 }
 for(let i=0;i<9;i++)box(1,.018,4.25,.025,side*(3.55+i*.68),1,12.02);
}
// Oversized portal surround and slender structural columns.
for(const x of [-3.2,3.2]){box(0,.22,4.8,.52,x,1,12.05);box(2,.07,4.65,.12,x,1,12.34);}
box(0,6.8,.34,.65,0,3.38,12);box(3,6.35,.11,.14,0,3.17,12.38);
// Roof monitors and bronze curb profiles; glass skylights are individual panes.
for(const x of [-6.3,-3.2,0,3.2,6.3]){
 box(2,.12,.13,16.8,x,3.98,-.4);box(4,2.45,.035,16.55,x,4.02,-.4);
}
for(const x of [-9.45,9.45])box(2,.11,.12,24.7,x,3.99,-.25);
for(const z of [-12.4,12])box(2,19,.12,.11,0,3.99,z);
// Gallery core and internal oak lining glimpsed through the lobby glazing.
box(7,5.4,3.6,7.4,0,.35,1.8);box(0,5.7,.18,7.7,0,2.22,1.8);
// Forecourt terrace, broad shallow steps and warm recessed soffit lights.
box(6,12,.2,5.5,0,-1.12,15);
for(let i=0;i<4;i++)box(0,12,.16,1,0,-1.48+i*.14,16.5+i*.92);
for(let i=0;i<9;i++)box(8,.48,.025,.12,-8+i*2,3.29,11);
// Minimal integrated planters and faceted landscape clusters.
for(const x of [-7.4,7.4]){
 box(3,2.4,.55,1.1,x,-.88,13.8);
 for(let j=0;j<5;j++)cylinder(9,.34,.7,x-.8+j*.4,-.35,13.8);
}
// Facade horizontal reveals, bronze end blades and stone corner piers.
for(const side of [-1,1]){
 for(let i=0;i<5;i++)box(1,.025,.025,22,side*(9.05),-.75+i*1.0,-.25);
 for(let i=0;i<4;i++)box(2,.08,5.2,.22,side*(7.3+i*.5),1.0,12.02);
 box(0,.18,5.3,.22,side*9.18,1,11.9);
}
// Sculpted entrance portal reveals and a secondary bronze lintel.
box(1,6.45,.09,.18,0,2.96,12.48);box(2,6.45,.07,.2,0,3.1,12.52);
const curvedPanel=(m,w,h,d,x,y,z,bow)=>groups[m].push({s:[w,h,d],p:[x,y,z],curved:true,bow});
// Continuous, smoothly bowed architectural skins sit behind the fine segmented joints.
for(const side of [-1,1]){
 curvedPanel(0,6.05,4.42,.16,side*6.55,1.05,12.13,.42);
}
curvedPanel(0,19.65,.28,2.45,0,3.48,12.05,.58);
// Curved architectural pass: segmented stone rainscreen, bowed portal brow and a sweeping canopy edge.
// Every segment follows a shallow continuous curve, with tangent rotation to avoid a box-like facade.
const curvedBox=(m,w,h,d,x,y,z,angle)=>{
 const item={s:[w,h,d],p:[x,y,z],r:[0,Math.sin(angle/2),0,Math.cos(angle/2)]};groups[m].push(item);
};
const facadeCurve=(x)=>.82*(1-Math.pow(x/9.7,2));
const facadeSlope=(x)=>-.164*x/9.7;
for(const side of [-1,1]){
 for(let row=0;row<6;row++){
  const y=-.72+row*.69;
  for(let i=0;i<12;i++){
   const x=side*(3.48+i*.49),z=12.04+facadeCurve(x),angle=-Math.atan(facadeSlope(x));
   curvedBox((row+i)%5===0?1:0,.455,.61,.16,x,y,z,angle);
  }
 }
 // Deep horizontal joints read as continuous shadow lines across the bowed stone skin.
 for(let row=0;row<5;row++){
  const y=-.39+row*.69;
  for(let i=0;i<12;i++){
   const x=side*(3.48+i*.49),z=12.135+facadeCurve(x),angle=-Math.atan(facadeSlope(x));
   curvedBox(1,.47,.035,.035,x,y,z,angle);
  }
 }
}
// A segmented, softly bowed canopy fascia gives the entrance a sculptural roof line.
for(let i=0;i<22;i++){
 const x=-10+i*(20/21),z=12.28+.98*(1-Math.pow(x/10,2)),angle=-Math.atan(-.196*x/10);
 curvedBox(0,.98,.32,2.5,x,3.46,z,angle);
 curvedBox(2,.98,.055,.12,x,3.275,z+1.18,angle);
}
// Curved bronze portal brow and layered stone reveal around the glazed lobby.
for(let i=0;i<16;i++){
 const x=-3.9+i*.52,z=12.62+.22*(1-Math.pow(x/4.2,2)),angle=-Math.atan(-.105*x/4.2);
 curvedBox(1,.49,.12,.22,x,3.18,z,angle);
 curvedBox(2,.49,.075,.24,x,3.31,z+.015,angle);
}
// Fine vertical joints and bronze blades follow the same curved facade datum.
for(const side of [-1,1])for(let i=0;i<13;i++){
 const x=side*(3.38+i*.49),z=12.17+facadeCurve(x),angle=-Math.atan(facadeSlope(x));
 curvedBox(2,.035,4.12,.075,x,1.02,z+.035,angle);
}


/* Sculptural roof and entrance refinement: layered curved canopy, deep soffit and a shaped portal. */
// Broad continuous roof lip floats beyond the glazed lobby; the underside is darker for real depth.
curvedPanel(0,19.9,.24,3.35,0,3.56,11.05,.88);
curvedPanel(3,19.45,.12,3.12,0,3.385,11.08,.82);
curvedPanel(2,19.82,.075,.18,0,3.28,12.76,.42);
// Secondary curved roof eyebrow and bronze drip edge create a finer silhouette.
curvedPanel(1,18.8,.16,.22,0,3.79,12.62,.38);
curvedPanel(2,19.25,.055,.16,0,3.68,12.79,.38);
// Deep portal cheeks with layered reveals and bronze vertical blades.
for(const side of [-1,1]){
 box(1,.42,4.85,.72,side*3.38,.98,12.13);
 box(0,.24,4.72,.58,side*3.12,1.02,12.28);
 box(2,.075,4.55,.16,side*2.96,1.02,12.58);
 for(let rib=0;rib<5;rib++){
  const x=side*(3.5+rib*.105);
  curvedBox(2,.045,4.25,.10,x,1.03,12.73,.025*side);
 }
}
// Sculpted lintel is built from closely spaced rotated stones, with a recessed shadow reveal below.
for(let i=0;i<28;i++){
 const x=-3.75+i*(7.5/27),z=12.78+.34*(1-Math.pow(x/3.9,2)),angle=-Math.atan(-.174*x/3.9);
 curvedBox(0,.29,.34,.78,x,3.47,z,angle);
 curvedBox(1,.29,.075,.82,x,3.265,z-.02,angle);
 curvedBox(2,.29,.055,.86,x,3.19,z-.035,angle);
}
// Fine roof ribs are set back beneath the canopy to reveal its thickness and rhythm.
for(let i=0;i<25;i++){
 const x=-9.3+i*.775;
 curvedBox(3,.035,.11,2.7,x,3.34,11.15+.72*(1-Math.pow(x/10,2)),-Math.atan(-.144*x/10));
}


/* Detailed architectural pass: fluted stone profiles, deep window pockets and layered metalwork. */
const flutedPanel=(m,w,h,d,x,y,z)=>groups[m].push({s:[w,h,d],p:[x,y,z],fluted:true});
for(const side of [-1,1]){
  // Deeply recessed glazing bays sit behind stone jambs and projecting sill/head courses.
  for(let bay=0;bay<5;bay++){
    const x=side*(4.15+bay*1.02);
    box(3,.075,3.72,.34,x,.82,11.68);
    box(5,.78,3.05,.045,x,.86,11.48);
    box(2,.92,.085,.42,x,-.82,11.52);
    box(1,.92,.075,.42,x,2.56,11.52);
    for(const dx of [-.43,.43])box(3,.055,3.15,.24,x+dx,.86,11.43);
    for(const yy of [-.68,.05,.78,1.51,2.24])box(2,.82,.025,.06,x,yy,11.40);
  }
  // Fluted pilaster blades add a real profile rather than another flat rectangular strip.
  for(let i=0;i<8;i++)flutedPanel(0,.19,4.6,.28,side*(3.55+i*.78),1.02,12.38);
  // Fine shadow reveals and bronze capillary joints separate each rainscreen course.
  for(let row=0;row<5;row++){
    const y=-.92+row*.92;
    box(1,5.7,.035,.22,side*6.45,y,12.31);
    box(2,5.7,.022,.25,side*6.45,y+.045,12.36);
  }
}
// Roof soffit is layered with recessed coffers, narrow bronze separators and luminous slots.
for(let x=-8.4;x<=8.4;x+=1.4){
  box(3,.045,.12,2.65,x,3.31,10.95);
  box(8,.62,.018,1.75,x,3.285,10.9);
}
for(let z=-10;z<=8;z+=3){
  box(1,18.8,.045,.09,0,3.52,z);
  box(2,18.8,.025,.12,0,3.56,z+.06);
}
// Entrance threshold has nested stone nosings, dark expansion joints and a bronze sill.
for(let i=0;i<3;i++){
  box(0,6.25,.10,.18,0,-1.04+i*.075,12.72+i*.18);
  box(1,6.28,.025,.22,0,-1.105+i*.075,12.74+i*.18);
}
box(2,5.95,.035,.32,0,-.89,12.96);

/* Fluted unit geometry: shallow concave channels catch highlights across each stone pilaster. */
function flutedPanelGeometry(segments=48){
 const p=[],n=[],idx=[];
 for(let layer=0;layer<2;layer++){
  for(let j=0;j<=1;j++)for(let i=0;i<=segments;i++){
   const u=i/segments,x=u-.5,y=j-.5;
   const wave=Math.pow(Math.sin(u*Math.PI*8),2)*.075;
   const z=(layer===0?.5:-.5)+(layer===0?wave:0);
   const dz=layer===0?.075*4*Math.PI*Math.sin(u*Math.PI*8)*Math.cos(u*Math.PI*8):0;
   const l=Math.hypot(dz,1);
   p.push(x,y,z);n.push(layer===0?-dz/l:0,0,layer===0?1/l:-1);
  }
 }
 const rows=segments+1,base=rows*2;
 for(let i=0;i<segments;i++){
  const a=i,b=a+1,c=rows+b,d=rows+a;
  idx.push(a,b,c,a,c,d);
  const e=base+a,f=base+b,g=base+rows+b,h=base+rows+a;
  idx.push(e,g,f,e,h,g);
 }
 for(let i=0;i<segments;i++){
  const a=i,b=i+1,c=base+i,d=base+i+1;
  idx.push(a,c,d,a,d,b);
  const a2=rows+i,b2=rows+i+1,c2=base+rows+i,d2=base+rows+i+1;
  idx.push(a2,b2,d2,a2,d2,c2);
 }
 idx.push(0,rows,base+rows,0,base+rows,base);
 const end=segments;
 idx.push(end,base+end,base+rows+end,end,base+rows+end,rows+end);
 return {p,n,idx};
}

// Build a single shared unit cube and cylinder mesh, then place many transformed instances.
function cubeGeometry(){
 const p=[],n=[],idx=[],bevel=.04,core=.5-bevel,segments=4;
 const faces=[
  [[.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5],[.5,-.5,.5]],
  [[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5],[-.5,-.5,-.5]],
  [[-.5,.5,-.5],[-.5,.5,.5],[.5,.5,.5],[.5,.5,-.5]],
  [[-.5,-.5,.5],[-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5]],
  [[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]],
  [[.5,-.5,-.5],[-.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5]]
 ];
 for(const corners of faces){
  const base=p.length/3;
  for(let j=0;j<=segments;j++)for(let i=0;i<=segments;i++){
   const u=i/segments,v=j/segments;
   const a=corners[0].map((x,k)=>x*(1-u)+corners[1][k]*u);
   const b=corners[3].map((x,k)=>x*(1-u)+corners[2][k]*u);
   const raw=a.map((x,k)=>x*(1-v)+b[k]*v);
   const clamped=raw.map(x=>Math.max(-core,Math.min(core,x)));
   const delta=raw.map((x,k)=>x-clamped[k]);
   const len=Math.hypot(...delta)||1;
   const normal=delta.map(x=>x/len);
   const surface=clamped.map((x,k)=>x+normal[k]*bevel);
   p.push(...surface);n.push(...normal);
  }
  for(let j=0;j<segments;j++)for(let i=0;i<segments;i++){
   const a=base+j*(segments+1)+i,b=a+1,c=b+segments+1,d=a+segments+1;
   idx.push(a,b,c,a,c,d);
  }
 }
 return {p,n,idx};
}
function curvedPanelGeometry(segments=64,bow=.12){
 const p=[],n=[],idx=[],rows=segments+1;
 const profile=u=>bow*(1-Math.pow(2*u-1,2));
 // Front and rear surfaces share a continuous curved profile with smooth analytic normals.
 for(let layer=0;layer<2;layer++){
  for(let j=0;j<=1;j++)for(let i=0;i<=segments;i++){
   const u=i/segments,x=u-.5,y=j-.5,bend=bow*(1-Math.pow(2*u-1,2)),dzdu=4*bow*(1-2*u);
   const z=(layer===0?.5:-.5)+bend;
   const sign=layer===0?1:-1;
   const length=Math.hypot(dzdu,1);
   p.push(x,y,z);n.push(sign*(-dzdu/length),0,sign*(1/length));
  }
  const base=layer*rows*2;
  for(let i=0;i<segments;i++){
   const a=base+i,b=a+1,c=a+rows+1,d=a+rows;
   if(layer===0)idx.push(a,b,c,a,c,d);else idx.push(a,c,b,a,d,c);
  }
 }
 // Close the top, bottom and end edges so the curved cladding has real thickness.
 const front=0,back=rows*2;
 for(let i=0;i<segments;i++){
  const f0=front+i,f1=f0+1,b0=back+i,b1=b0+1;
  const t0=front+rows+i,t1=t0+1,bt0=back+rows+i,bt1=bt0+1;
  idx.push(f0,b0,b1,f0,b1,f1,t0,t1,bt1,t0,bt1,bt0);
 }
 idx.push(front,front+rows,back+rows,front,back+rows,back);
 const fe=front+segments,te=front+rows+segments,be=back+segments,bte=back+rows+segments;
 idx.push(fe,be,bte,fe,bte,te);
 // Recalculate normals from the closed indexed surface for clean edge shading.
 const smooth=Array.from({length:p.length/3},()=>[0,0,0]);
 for(let i=0;i<idx.length;i+=3){
  const a=idx[i],b=idx[i+1],c=idx[i+2];
  const A=p.slice(a*3,a*3+3),B=p.slice(b*3,b*3+3),C=p.slice(c*3,c*3+3);
  const ab=B.map((v,k)=>v-A[k]),ac=C.map((v,k)=>v-A[k]);
  const cr=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]];
  for(const id of [a,b,c])for(let k=0;k<3;k++)smooth[id][k]+=cr[k];
 }
 for(let i=0;i<smooth.length;i++){const l=Math.hypot(...smooth[i])||1;n.splice(i*3,3,...smooth[i].map(v=>v/l));}
 return {p,n,idx};
}
function cylinderGeometry(seg=16){
 const p=[],n=[],idx=[];
 for(let i=0;i<seg;i++){
  const a=i/seg*Math.PI*2,b=(i+1)/seg*Math.PI*2,base=p.length/3;
  for(const [ang,y] of [[a,-.5],[b,-.5],[b,.5],[a,.5]]){p.push(Math.cos(ang)*.5,y,Math.sin(ang)*.5);n.push(Math.cos(ang),0,Math.sin(ang));}
  idx.push(base,base+2,base+1,base,base+3,base+2);
 }
 const bottomCenter=p.length/3;p.push(0,-.5,0);n.push(0,-1,0);
 const topCenter=p.length/3;p.push(0,.5,0);n.push(0,1,0);
 for(let i=0;i<seg;i++){
  const a=i/seg*Math.PI*2,b=(i+1)/seg*Math.PI*2;
  const bi=p.length/3;p.push(Math.cos(a)*.5,-.5,Math.sin(a)*.5,Math.cos(b)*.5,-.5,Math.sin(b)*.5);n.push(0,-1,0,0,-1,0);
  idx.push(bottomCenter,bi,bi+1);
  const ti=p.length/3;p.push(Math.cos(a)*.5,.5,Math.sin(a)*.5,Math.cos(b)*.5,.5,Math.sin(b)*.5);n.push(0,1,0,0,1,0);
  idx.push(topCenter,ti+1,ti);
 }
 return {p,n,idx};
}
const cube=cubeGeometry(),cyl=cylinderGeometry(),curve42=curvedPanelGeometry(64,.42/.16),curve58=curvedPanelGeometry(64,.58/2.45);
const flute=flutedPanelGeometry(),all=[cube,cyl,curve42,curve58,flute],bufferParts=[],views=[],accessors=[];
let offset=0;
function addBuffer(data,componentType,type,count,min,max){
 while(offset%4){bufferParts.push(0);offset++;}
 const start=offset;const bytes=Buffer.from(data.buffer,data.byteOffset,data.byteLength);bufferParts.push(bytes);offset+=bytes.length;
 const view=views.length;views.push({buffer:0,byteOffset:start,byteLength:bytes.length});
 const acc={bufferView:view,componentType,type,count};if(min)acc.min=min;if(max)acc.max=max;accessors.push(acc);return accessors.length-1;
}
const meshDefs=[];
for(let shape=0;shape<5;shape++){
 const g=all[shape];
 const uv=[];
 for(let i=0;i<g.p.length;i+=3){uv.push(g.p[i]+.5,g.p[i+1]+.5);}
 const texcoord=addBuffer(new Float32Array(uv),5126,"VEC2",uv.length/2);
 const pos=addBuffer(new Float32Array(g.p),5126,"VEC3",g.p.length/3,
  [Math.min(...g.p.filter((_,i)=>i%3===0)),Math.min(...g.p.filter((_,i)=>i%3===1)),Math.min(...g.p.filter((_,i)=>i%3===2))],
  [Math.max(...g.p.filter((_,i)=>i%3===0)),Math.max(...g.p.filter((_,i)=>i%3===1)),Math.max(...g.p.filter((_,i)=>i%3===2))]);
 const norm=addBuffer(new Float32Array(g.n),5126,"VEC3",g.n.length/3);
 const ind=addBuffer(new Uint16Array(g.idx),5123,"SCALAR",g.idx.length);
 for(let m=0;m<materials.length;m++)meshDefs.push({name:materials[m][0]+"-"+(["box","cylinder","curved-panel-42cm","curved-canopy-58cm"][shape]),primitives:[{attributes:{POSITION:pos,NORMAL:n,TEXCOORD_0:texcoord},indices:ind,material:m}]});
}
const nodes=[];
for(let m=0;m<groups.length;m++)for(const item of groups[m]){
 const shape=item.fluted?4:item.curved?(item.bow===.42?2:3):item.c?1:0;
 const scale=item.c?[item.c[0]*2,item.c[1],item.c[0]*2]:item.s;
 nodes.push({name:materials[m][0]+(item.curved?"-continuous-curve":"-element"),mesh:shape*materials.length+m,translation:item.p,scale,...(item.r?{rotation:item.r}:{})});
}
const gltfMaterials=materials.map(([name,color,metallic,roughness],i)=>({
 name,pbrMetallicRoughness:{baseColorFactor:color,metallicFactor:metallic,roughnessFactor:roughness},
 alphaMode:color[3]<1?"BLEND":"OPAQUE",doubleSided:i===4||i===5,
 ...(i===8?{emissiveFactor:[.65,.42,.18]}:{})
}));

/* Embed deterministic, tileable procedural material maps in the GLB (no external texture requests). */
const zlib=require("zlib");
function crc32(buf){let crc=0xffffffff;for(const byte of buf){crc^=byte;for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
function pngChunk(type,data){const name=Buffer.from(type),len=Buffer.alloc(4);len.writeUInt32BE(data.length);const body=Buffer.concat([name,data]),crc=Buffer.alloc(4);crc.writeUInt32BE(crc32(body));return Buffer.concat([len,body,crc]);}
function makePng(width,height,pixels){
 const rows=Buffer.alloc((width*3+1)*height);
 for(let y=0;y<height;y++){const start=y*(width*3+1);rows[start]=0;pixels.copy(rows,start+1,y*width*3,(y+1)*width*3);}
 const head=Buffer.alloc(13);head.writeUInt32BE(width,0);head.writeUInt32BE(height,4);head[8]=8;head[9]=2;
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),pngChunk("IHDR",head),pngChunk("IDAT",zlib.deflateSync(rows,{level:9})),pngChunk("IEND",Buffer.alloc(0))]);
}
function texturePixels(kind){
 const size=256,pix=Buffer.alloc(size*size*3),height=new Float32Array(size*size);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const i=y*size+x;
  const n1=Math.sin(x*.19+Math.sin(y*.07)*2.4),n2=Math.sin(y*.31+x*.025),n3=Math.sin(x*.73+Math.cos(y*.43)*1.7);
  const grain=(n1*.38+n2*.28+n3*.12+Math.sin((x+y)*1.71)*.08);
  const vein=kind==="oak"?Math.sin(y*.22+Math.sin(x*.025)*4)*.22:Math.sin((x*.11+y*.08)+Math.sin(y*.04)*2)*.11;
  height[i]=.5+grain*.12+vein*.14;
  const base=kind==="oak"?[111,76,49]:kind==="concrete"?[151,153,148]:[202,197,183];
  const amp=kind==="oak"?31:kind==="concrete"?22:24;
  for(let k=0;k<3;k++)pix[i*3+k]=Math.max(0,Math.min(255,base[k]+(grain+vein)*amp+(Math.sin(x*.047)*3)));
 }
 return {pix,height,size};
}
function normalPixels(height,size,strength=5){
 const out=Buffer.alloc(size*size*3);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const at=(xx,yy)=>height[((yy+size)%size)*size+((xx+size)%size)];
  const dx=(at(x+1,y)-at(x-1,y))*strength,dy=(at(x,y+1)-at(x,y-1))*strength;
  const nx=-dx,ny=-dy,nz=1,l=Math.hypot(nx,ny,nz),i=(y*size+x)*3;
  out[i]=Math.round((nx/l*.5+.5)*255);out[i+1]=Math.round((ny/l*.5+.5)*255);out[i+2]=Math.round((nz/l*.5+.5)*255);
 }
 return out;
}
const imageDefs=[],textureDefs=[];
function embedTexture(png,name){
 while(offset%4){bufferParts.push(0);offset++;}
 const start=offset;bufferParts.push(png);offset+=png.length;
 const view=views.length;views.push({buffer:0,byteOffset:start,byteLength:png.length});
 imageDefs.push({name,mimeType:"image/png",bufferView:view});
 textureDefs.push({sampler:0,source:imageDefs.length-1});
 return textureDefs.length-1;
}
const textureSets=["stone","concrete","oak"].map(kind=>texturePixels(kind));
const albedoTextures=textureSets.map((set,i)=>embedTexture(makePng(set.size,set.size,set.pix),["limestone-albedo","concrete-albedo","oak-albedo"][i]));
const normalTextures=textureSets.map((set,i)=>embedTexture(makePng(set.size,set.size,normalPixels(set.height,set.size,i===2?8:5)),["limestone-normal","concrete-normal","oak-normal"][i]));
for(const [materialIndex,textureIndex] of [[0,0],[1,0],[2,0],[3,1],[6,1],[7,2]]){
 gltfMaterials[materialIndex].pbrMetallicRoughness.baseColorTexture={index:albedoTextures[textureIndex]};
 gltfMaterials[materialIndex].normalTexture={index:normalTextures[textureIndex],scale:.32};
}
const json={asset:{version:"2.0",generator:"ARTSPACE detailed architectural pavilion builder"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes:meshDefs,materials:gltfMaterials,images:imageDefs,textures:textureDefs,samplers:[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}],accessors,bufferViews:views,buffers:[{byteLength:offset}]};

let jsonBytes=Buffer.from(JSON.stringify(json));while(jsonBytes.length%4)jsonBytes=Buffer.concat([jsonBytes,Buffer.from(" ")]);
let bin=Buffer.concat(bufferParts);while(bin.length%4)bin=Buffer.concat([bin,Buffer.from([0])]);
const total=12+8+jsonBytes.length+8+bin.length;
const header=Buffer.alloc(12);header.write("glTF",0);header.writeUInt32LE(2,4);header.writeUInt32LE(total,8);
const jh=Buffer.alloc(8);jh.writeUInt32LE(jsonBytes.length,0);jh.writeUInt32LE(0x4e4f534a,4);
const bh=Buffer.alloc(8);bh.writeUInt32LE(bin.length,0);bh.writeUInt32LE(0x004e4942,4);
fs.writeFileSync(out,Buffer.concat([header,jh,jsonBytes,bh,bin]));
console.log("Generated ARTSPACE pavilion GLB",fs.statSync(out).size,"bytes;",nodes.length,"placed architectural elements;",meshDefs.length,"material/shape meshes.");
