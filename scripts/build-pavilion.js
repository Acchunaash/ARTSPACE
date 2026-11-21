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
 ["low-iron-glass",[.69,.81,.82,.32],.18,.075],
 ["deep-glass",[.19,.29,.32,.72],.62,.12],
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
const cube=cubeGeometry(),cyl=cylinderGeometry();
const all=[cube,cyl],bufferParts=[],views=[],accessors=[];
let offset=0;
function addBuffer(data,componentType,type,count,min,max){
 while(offset%4){bufferParts.push(0);offset++;}
 const start=offset;const bytes=Buffer.from(data.buffer,data.byteOffset,data.byteLength);bufferParts.push(bytes);offset+=bytes.length;
 const view=views.length;views.push({buffer:0,byteOffset:start,byteLength:bytes.length});
 const acc={bufferView:view,componentType,type,count};if(min)acc.min=min;if(max)acc.max=max;accessors.push(acc);return accessors.length-1;
}
const meshDefs=[];
for(let shape=0;shape<2;shape++){
 const g=all[shape];
 const pos=addBuffer(new Float32Array(g.p),5126,"VEC3",g.p.length/3,
  [Math.min(...g.p.filter((_,i)=>i%3===0)),Math.min(...g.p.filter((_,i)=>i%3===1)),Math.min(...g.p.filter((_,i)=>i%3===2))],
  [Math.max(...g.p.filter((_,i)=>i%3===0)),Math.max(...g.p.filter((_,i)=>i%3===1)),Math.max(...g.p.filter((_,i)=>i%3===2))]);
 const norm=addBuffer(new Float32Array(g.n),5126,"VEC3",g.n.length/3);
 const ind=addBuffer(new Uint16Array(g.idx),5123,"SCALAR",g.idx.length);
 for(let m=0;m<materials.length;m++)meshDefs.push({name:materials[m][0]+"-"+(shape?"cylinder":"box"),primitives:[{attributes:{POSITION:pos,NORMAL:norm},indices:ind,material:m}]});
}
const nodes=[];
for(let m=0;m<groups.length;m++)for(const item of groups[m]){
 const shape=item.c?1:0;
 const scale=item.c?[item.c[0]*2,item.c[1],item.c[0]*2]:item.s;
 nodes.push({name:materials[m][0]+"-element",mesh:m*2+shape,translation:item.p,scale,...(item.r?{rotation:item.r}:{})});
}
const gltfMaterials=materials.map(([name,color,metallic,roughness],i)=>({
 name,pbrMetallicRoughness:{baseColorFactor:color,metallicFactor:metallic,roughnessFactor:roughness},
 alphaMode:color[3]<1?"BLEND":"OPAQUE",doubleSided:i===4||i===5,
 ...(i===8?{emissiveFactor:[.65,.42,.18]}:{})
}));
const json={asset:{version:"2.0",generator:"ARTSPACE architectural pavilion builder"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes:meshDefs,materials:gltfMaterials,accessors,bufferViews:views,buffers:[{byteLength:offset}]};
let jsonBytes=Buffer.from(JSON.stringify(json));while(jsonBytes.length%4)jsonBytes=Buffer.concat([jsonBytes,Buffer.from(" ")]);
let bin=Buffer.concat(bufferParts);while(bin.length%4)bin=Buffer.concat([bin,Buffer.from([0])]);
const total=12+8+jsonBytes.length+8+bin.length;
const header=Buffer.alloc(12);header.write("glTF",0);header.writeUInt32LE(2,4);header.writeUInt32LE(total,8);
const jh=Buffer.alloc(8);jh.writeUInt32LE(jsonBytes.length,0);jh.writeUInt32LE(0x4e4f534a,4);
const bh=Buffer.alloc(8);bh.writeUInt32LE(bin.length,0);bh.writeUInt32LE(0x004e4942,4);
fs.writeFileSync(out,Buffer.concat([header,jh,jsonBytes,bh,bin]));
console.log("Generated ARTSPACE pavilion GLB",fs.statSync(out).size,"bytes;",nodes.length,"placed architectural elements;",meshDefs.length,"material/shape meshes.");
