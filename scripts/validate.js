const fs = require("node:fs");
const html = fs.readFileSync("index.html", "utf8");
const fail = message => { console.error("ARTSPACE validation failed:", message); process.exitCode = 1; };

if (!/^<!doctype html>/i.test(html.trim())) fail("Missing HTML5 doctype.");

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const seen = new Set();
for (const id of ids) {
  if (seen.has(id)) fail("Duplicate HTML id: " + id);
  seen.add(id);
}

const referencedIds = [...html.matchAll(/document\.getElementById\(["']([^"']+)["']\)/g)].map(match => match[1]);
for (const id of new Set(referencedIds)) {
  if (!seen.has(id)) fail("JavaScript references missing element id: " + id);
}

const inlineScripts = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
if (!inlineScripts.length) fail("No inline application scripts found.");
inlineScripts.forEach((match, index) => {
  try { new Function(match[1]); }
  catch (error) { fail("Inline script " + (index + 1) + " has a syntax error: " + error.message); }
});

const style = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/i) || [,""])[1];
const cssWithoutComments = style.replace(/\/\*[\s\S]*?\*\//g, "");
let depth = 0;
for (const char of cssWithoutComments) {
  if (char === "{") depth++;
  if (char === "}") depth--;
  if (depth < 0) { fail("CSS has an unexpected closing brace."); break; }
}
if (depth !== 0) fail("CSS braces are unbalanced.");

try { JSON.parse(fs.readFileSync("manifest.webmanifest", "utf8")); }
catch (error) { fail("Web app manifest is invalid JSON: " + error.message); }

try { new Function(fs.readFileSync("sw.js", "utf8")); }
catch (error) { fail("Service worker has a syntax error: " + error.message); }

try {
  const schema = fs.readFileSync("supabase/migrations/0001_artspace_schema.sql", "utf8");
  const seed = fs.readFileSync("supabase/seed.sql", "utf8");
  if (!schema.includes("enable row level security")) fail("Database schema is missing Row Level Security.");
  const seededProducts = [...seed.matchAll(/^  \('/gm)].length;
  if (seededProducts !== 6) fail("Expected six initial catalog seed records, found " + seededProducts + ".");
} catch (error) { fail("Database foundation files are missing or unreadable: " + error.message); }

if (!html.includes('id="cartCheckout"') || !html.includes("Online payment is not enabled yet")) {
  fail("Checkout boundary messaging is missing.");
}

/* Product-detail transition must reuse the real product controls in a full-screen overlay. */
if (!html.includes('id="selectedProduct" aria-hidden="true" inert') ||
    !html.includes('id="productDetailClose"') ||
    !html.includes("body.product-detail-open #selectedProduct") ||
    !html.includes("function openProductDetail()") ||
    !html.includes("function closeProductDetail()") ||
    !html.includes('document.getElementById("exploreBtn").addEventListener("click",openProductDetail)') ||
    !html.includes('current=node.userData.index;openProductDetail()')) {
  fail("Full-screen product detail transition and gallery selection wiring are missing.");
}
if (!html.includes("grid-template-columns:minmax(0,1.08fr) minmax(340px,.82fr)") ||
    !html.includes("@keyframes detail-art-arrive") ||
    !html.includes("@keyframes detail-copy-arrive") ||
    !html.includes("@media(max-width:760px)")) {
  fail("Responsive full-screen product detail layout and entrance motion are missing.");
}

/* Reference recreation: first viewport must be the gallery and the WebGL room must have a concave exhibition wall. */
if (!html.includes(".gallery-shell{position:relative;width:100%;height:100svh") ||
    !html.includes(".intro{display:none!important}")) {
  fail("The opening gallery must occupy the full viewport without the old hero section.");
}
if (!html.includes("new THREE.CylinderGeometry(wallRadius,wallRadius,7.1,96,1,true,wallStart,wallSweep)") ||
    !html.includes("new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arcPoints(y,r))")) {
  fail("The 3D exhibition wall and its curved architectural trim are missing.");
}

if (!html.includes("gallery.position.set(0,0,wallCenterZ)") ||
    !html.includes("const wallAngle=Math.PI+d*.255") ||
    !html.includes("const mountRadius=wallRadius-.072") ||
    !html.includes("group.userData.targetRY=wallAngle+Math.PI") ||
    html.includes("gallery.rotation.y+=(idleAngle-gallery.rotation.y)*.012")) {
  fail("3D artwork frames must be mounted to and face inward from the curved exhibition wall.");
}


/* Cinematic opening must show the whole exterior, then approach and pass through the entrance. */
if (!html.includes("const exterior=new THREE.Group();scene.add(exterior)") ||
    !html.includes("new THREE.PlaneGeometry(70,70)") ||
    !html.includes("addBox(exterior,19.5,.52,24.6,facadeMat,0,4,-1.15)") ||
    !html.includes("addBox(exterior,6.15,5.55,.42,facadeMat,-6.3,1.05,9.15)") ||
    !html.includes("addBox(exterior,6.15,5.55,.42,facadeMat,6.3,1.05,9.15)") ||
    !html.includes("new THREE.Vector3(0,9.2,31),introCameraApproach=new THREE.Vector3(0,5.8,18),introCameraThreshold=new THREE.Vector3(0,2.7,9.7),introCameraEnd=new THREE.Vector3(0,.12,4.7)") ||
    !html.includes("if(introRaw<.18)") ||
    !html.includes("introCameraApproach,introCameraThreshold") ||
    !html.includes("introCameraThreshold,introCameraEnd") ||
    !html.includes("introCameraStart.z=Math.max(31,9.8/(Math.tan(THREE.MathUtils.degToRad(18))*Math.max(.35,aspect)))")) {
  fail("Full exterior building, glazed entrance, and staged outside-to-inside camera path are missing.");
}
if (!html.includes("new THREE.PlaneGeometry(17,19),floorMaterial") ||
    !html.includes("leftWall.position.set(-8.5,.15,-1.15)") ||
    !html.includes("rightWall.position.set(8.5,.15,-1.15)") ||
    !html.includes("new THREE.PlaneGeometry(17,19),ceilingMaterial")) {
  fail("Gallery interior room geometry is missing or misaligned.");
}
if (!html.includes("if(!stage.classList.contains(\"webgl-ready\"))") ||
    !html.includes("new THREE.CanvasTexture(fallbackCanvas)")) {
  fail("WebGL reveal must not wait for every texture, and failed artwork textures need a fallback.");
}

/* Exterior architecture must include layered facade details, real glazing frames, forecourt and lighting. */
if (!html.includes("glassFrameMat=new THREE.MeshStandardMaterial") ||
    !html.includes("for(let k=0;k<6;k++)") ||
    !html.includes("const ribbon=new THREE.Mesh(new THREE.BoxGeometry(.055,1.32,7.8),glassMat)") ||
    !html.includes("for(let x=-8;x<=8;x+=4)") ||
    !html.includes("new THREE.IcosahedronGeometry(.43,1)") ||
    !html.includes("const exteriorFill=new THREE.DirectionalLight(0xfff4e4,.48)") ||
    !html.includes("keyLight.shadow.mapSize.set(1024,1024)")) {
  fail("Museum exterior must retain its facade fins, side glazing, canopy lights, planting and tuned daylight/shadows.");
}

// Guard the Three.js loader against a race with the application initializer.
if (!html.includes("window.__artspaceThreeReady=new Promise") ||
    !html.includes("window.__artspaceThreeReady.then(loaded=>")) {
  fail("Three.js must load sequentially before WebGL initialization.");
}
if (!html.includes("https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js") ||
    !html.includes("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js")) {
  fail("Both primary and fallback Three.js sources must be configured.");
}

/* The deployed exterior is a real glTF scene asset generated during build, not runtime box construction. */
const modelBuilder = fs.readFileSync("scripts/build-pavilion.js", "utf8");
if (!modelBuilder.includes("function curvedPanelGeometry(segments=64,bow=.12)") ||
    !modelBuilder.includes("const curvedPanel=(m,w,h,d,x,y,z,bow)") ||
    !modelBuilder.includes("const cube=cubeGeometry(),cyl=cylinderGeometry(),curve42=curvedPanelGeometry(64,.42/.16),curve58=curvedPanelGeometry(64,.58/2.45)") ||
    !modelBuilder.includes("mesh:shape*materials.length+m") ||
    !modelBuilder.includes("for(let shape=0;shape<4;shape++)") ||
    !modelBuilder.includes("item.bow===.42?2:3") ||
    !modelBuilder.includes("function curvedPanelGeometry(segments=64,bow=.12)") ||
    !modelBuilder.includes("Continuous, smoothly bowed architectural skins")) {
  fail("Pavilion requires continuous smooth curved panel geometry, not only individually angled box segments.");
}
if (!modelBuilder.includes("const curvedBox=") ||
    !modelBuilder.includes("const facadeCurve=(x)=>") ||
    !modelBuilder.includes("Curved architectural pass") ||
    !modelBuilder.includes("rotation:item.r") ||
    !modelBuilder.includes("[.91,.885,.82,1]") ||
    !modelBuilder.includes("[.69,.81,.82,.32]")) {
  fail("The pavilion must include rotated curved rainscreen panels, a bowed canopy/portal and upgraded PBR material values.");
}

/* Architectural glazing must stay transparent and receive a lightweight studio reflection environment. */
if (!html.includes("new THREE.PMREMGenerator(renderer)") ||
    !html.includes("scene.environment=architecturalEnvironment.texture") ||
    !html.includes("material.envMapIntensity=1.35") ||
    !html.includes("new THREE.PointLight(0xffe5c9,intensity,15,2)") ||
    !html.includes("material.depthWrite=false")) {
  fail("The exterior glazing requires environment reflections, depth-safe transparency and warm interior illumination.");
}
if (!modelBuilder.includes('["low-iron-glass",[.78,.88,.89,.22],.06,.045]') ||
    !modelBuilder.includes('["deep-glass",[.24,.36,.39,.38],.12,.085]')) {
  fail("The GLB low-iron and deep-glass PBR materials are not tuned for clear architectural glazing.");
}

if (!modelBuilder.includes("ARTSPACE architectural pavilion builder") ||
    !modelBuilder.includes("low-iron-glass") ||
    !modelBuilder.includes("champagne-bronze") ||
    !modelBuilder.includes("idx.push(a,b,c,a,c,d)") ||
    !modelBuilder.includes("idx.push(base,base+2,base+1,base,base+3,base+2)") ||
    !modelBuilder.includes("Roof monitors") ||
    !html.includes("window.__artspaceGLTFReady") ||
    !html.includes('pavilionLoader.load("./assets/artspace-pavilion.glb"') ||
    !html.includes("exterior.visible=false") ||
    !html.includes("using procedural exterior fallback")) {
  fail("The GLB pavilion builder, loader, or safe fallback integration is missing.");
}
if (!fs.existsSync("assets/artspace-pavilion.glb")) {
  fail("The generated architectural pavilion GLB is missing from the build output.");
} else {
  const glb = fs.readFileSync("assets/artspace-pavilion.glb");
  if (glb.length < 10000 || glb.toString("ascii", 0, 4) !== "glTF" || glb.readUInt32LE(4) !== 2 || glb.readUInt32LE(8) !== glb.length) {
    fail("The generated pavilion is not a valid, complete glTF 2.0 binary.");
  } else {
    const jsonLength = glb.readUInt32LE(12);
    try {
      const model = JSON.parse(glb.toString("utf8", 20, 20 + jsonLength).trim());
      if (model.asset?.version !== "2.0" || !model.nodes?.length || model.meshes?.length < 10 || model.materials?.length < 8) {
        fail("The pavilion GLB is missing expected architectural geometry or PBR materials.");
      }
    } catch (error) {
      fail("The pavilion GLB JSON chunk is invalid: " + error.message);
    }
  }
}

if (process.exitCode) process.exit(process.exitCode);
/* Premium exterior pass: layered rainscreen, recessed portal, bronze blades, roof edge and forecourt joints. */
if (!html.includes("const limestonePanel=new THREE.MeshStandardMaterial") ||
    !html.includes("for(let row=0;row<3;row++)") ||
    !html.includes("const bronze=new THREE.MeshStandardMaterial") ||
    !html.includes("Oversized recessed entry portal") ||
    !html.includes("new THREE.SpotLight(0xffe6c8,1.15,24") ||
    !html.includes("Larger-format forecourt stone slabs")) {
  fail("Premium exterior cladding, deep entry portal, bronze detailing, facade wash and stone forecourt are missing.");
}

console.log("ARTSPACE checks passed: HTML ids, DOM references, inline JavaScript, CSS braces, manifest, and service worker.");
