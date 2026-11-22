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
  try { new (require("node:vm").Script)(match[1], {filename:"inline-script-" + (index + 1)}); }
  catch (error) { fail("Inline script " + (index + 1) + " has a syntax error: " + error.stack); }
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
    !html.includes("wallAngle=Math.PI+d*.235") ||
    !html.includes("group.userData.targetScale=1") ||
    !html.includes("group.userData.targetRY=wallAngle+Math.PI") ||
    !html.includes("mountRadius=wallRadius-.62") ||
    !html.includes("group.userData.targetY=-1.72")) {
  fail("Dressed mannequins must remain evenly mounted around the curved boutique perimeter and face into the room.");
}

/* The six model cards remain available as the non-WebGL fallback, while 3D mannequins are the primary display. */
if (!html.includes('alt="Model wearing The Solstice Dress"') ||
    !html.includes('alt="Model wearing The Garden Wrap"') ||
    !html.includes('card.style.opacity="1"') ||
    !html.includes("DRAG TO EXPLORE THE BOUTIQUE")) {
  fail("Fashion model previews and accessible boutique browsing controls are missing.");
}
/* Cinematic opening must show the whole exterior, then approach and pass through the entrance. */
if (!html.includes("const exterior=new THREE.Group();scene.add(exterior)") ||
    !html.includes("new THREE.PlaneGeometry(70,70)") ||
    !html.includes("addBox(exterior,19.5,.52,24.6,facadeMat,0,4,-1.15)") ||
    !html.includes("addBox(exterior,6.15,5.55,.42,facadeMat,-6.3,1.05,9.15)") ||
    !html.includes("addBox(exterior,6.15,5.55,.42,facadeMat,6.3,1.05,9.15)") ||
    !html.includes("new THREE.CatmullRomCurve3([introCameraStart,new THREE.Vector3(15.2,8.5,26.5),new THREE.Vector3(13.5,6.5,22.5),new THREE.Vector3(9.5,4.4,19),new THREE.Vector3(5.2,2.65,16.8),new THREE.Vector3(1.8,1.75,15.1),new THREE.Vector3(0,1.65,13.65),new THREE.Vector3(0,1.65,12.45),new THREE.Vector3(0,1.65,10.2),new THREE.Vector3(0,1.65,7.2),introCameraEnd],false,\"centripetal\")") ||
    !html.includes("introCameraPath.getPointAt(pathT)") ||
    !html.includes("const introDuration=reducedMotion?0:9200;") ||
    !html.includes("if(introRaw<.02){camera.position.copy(introCameraStart);camera.lookAt(introLookTarget.set(0,2.15,introCameraStart.z-6.5));}") ||
    !html.includes("const introCameraProgress=t=>t<.70?.74*easeCamera(t/.70):t<.86?.74+.12*easeCamera((t-.70)/.16):.86+.14*easeCamera((t-.86)/.14);") ||
    !html.includes("const pathT=introCameraProgress((introRaw-.02)/.98);") ||
    !html.includes("introLookTarget.set(0,THREE.MathUtils.lerp(2.15,1.55,pathT),camera.position.z-6.5)") ||
    !html.includes("camera.lookAt(introLookTarget.set(0,THREE.MathUtils.lerp(2.15,1.55,pathT),camera.position.z-6.5));") ||
    !html.includes("camera.lookAt(introLookTarget.set(0,1.55,introCameraEnd.z-6.5));") ||
    !html.includes("camera.lookAt(introLookTarget.set(0,2.15,introCameraStart.z-6.5));") ||
    html.includes("introLookStart") || html.includes("introLookEnd") ||
    html.includes("introLookEnd") ||
    !html.includes("introCameraPath.points[0].copy(introCameraStart)") ||
    !html.includes("introCameraStart.x=13.5;") ||
    !html.includes("camera.fov=THREE.MathUtils.lerp(40,44,pathT)") ||
    !html.includes("camera.fov=44;camera.updateProjectionMatrix();") ||
    !html.includes("introCameraStart.y=9.2;") ||
    html.includes("camera.position.x=0;") ||
    html.includes("camera.position.y=Math.min(camera.position.y,1.72);") ||
    !html.includes("introCameraStart.z=Math.max(31,9.8/(Math.tan(THREE.MathUtils.degToRad(18))*Math.max(.35,aspect)))")) {
  fail("Curved exterior sweep, portal alignment, and continuous curved-gallery camera transition are missing.");
}
if (!html.includes("new THREE.PlaneGeometry(17,19),floorMaterial") ||
    !html.includes("floorMaterial.roughness=.48;floorMaterial.metalness=.035;") ||
    !html.includes("camera.fov=44;camera.updateProjectionMatrix();") ||
    !html.includes("leftWall.position.set(-8.5,.15,-1.15)") ||
    !html.includes("rightWall.position.set(8.5,.15,-1.15)") ||
    !html.includes("const vaultY=x=>3.65+.52*(1-Math.pow(x/8.5,2))") ||
    !html.includes("new THREE.Float32BufferAttribute(vaultPositions,3)") ||
    !html.includes("const vaultedCeiling=new THREE.Mesh(vaultGeometry,ceilingMaterial)") ||
    !html.includes("new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),96,.022,8,false)") ||
    !html.includes("new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),48,.032,8,false)") ||
    !html.includes("Curved plaster panel joints and end piers give the exhibition wall architectural scale.")) {
  fail("Gallery interior must have a vaulted ceiling, curved ceiling ribs, linear light channels and detailed curved-wall panel joints.");
}
if (!html.includes("const floorJointMaterial=new THREE.MeshStandardMaterial({color:0xbab7ae,roughness:.96,metalness:0})") ||
    !html.includes("const floorJointY=-1.7175") ||
    !html.includes("new THREE.BoxGeometry(.012,.003,19),floorJointMaterial") ||
    !html.includes("new THREE.BoxGeometry(17,.003,.012),floorJointMaterial")) {
  fail("The gallery floor must include restrained, large-format stone slab joints for architectural scale.");
}
/* Photoreal material pipeline: real Poly Haven CC0 PBR maps must augment the embedded fallback. */
if (!html.includes("white_stucco_02_diff_2k.jpg") ||
    !html.includes("white_stucco_02_nor_gl_2k.jpg") ||
    !html.includes("white_stucco_02_rough_2k.jpg") ||
    !html.includes("registerArchitecturalPbr(wallMaterial,2.2)") ||
    !html.includes("material.roughnessMap=architecturalPbr.roughness") ||
    !html.includes("CC0 scanned architectural") ||
    !html.includes("const makeMicroSurface=(seed,base=128,amplitude=22)=>") ||
    !html.includes("floorMaterial.bumpMap=stoneRelief;floorMaterial.bumpScale=.052;") ||
    !html.includes("floorMaterial.roughnessMap=stoneRoughness;floorMaterial.roughness=.48;floorMaterial.metalness=.035;") ||
    !html.includes("wallMaterial.bumpMap=plasterRelief;wallMaterial.bumpScale=.028;") ||
    !html.includes("const furnitureOak=new THREE.MeshStandardMaterial({color:0x987451,roughness:.58,metalness:0})")) {
  fail("The real CC0 scanned PBR material pipeline is missing.");
}
if (!html.includes("const visitorBench=new THREE.Group()") ||
    !html.includes("const furnitureStone=new THREE.MeshStandardMaterial") ||
    !html.includes("const plinth=new THREE.Group()") ||
    !html.includes("Shadow-gap reveal below the bench seat")) {
  fail("Dimensional gallery plinths and visitor seating are missing.");
}

if (!html.includes("if(!stage.classList.contains(\"webgl-ready\"))") ||
    !html.includes("new THREE.LatheGeometry(points,64)")) {
  fail("WebGL reveal must not wait for external fashion images; procedural 3D dress mannequins must remain available.");
}

/* Exterior architecture must include layered facade details, real glazing frames, forecourt and lighting. */
if (!html.includes("glassFrameMat=new THREE.MeshStandardMaterial") ||
    !html.includes("for(let k=0;k<6;k++)") ||
    !html.includes("const ribbon=new THREE.Mesh(new THREE.BoxGeometry(.055,1.32,7.8),glassMat)") ||
    !html.includes("for(let x=-8;x<=8;x+=4)") ||
    !html.includes("new THREE.IcosahedronGeometry(.43,1)") ||
    !html.includes("const exteriorFill=new THREE.DirectionalLight(0xfff4e4,.48)") ||
    !html.includes("keyLight.shadow.mapSize.set(window.innerWidth<700?512:1536,window.innerWidth<700?512:1536)")) {
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

/* The cinematic camera must wait for the detailed pavilion or a bounded fallback decision. */
if (!html.includes("introReady=false") ||
    !html.includes("settleIntro=reason=>") ||
    !html.includes("12-second model timeout; procedural exterior retained") ||
    !html.includes("detailed pavilion loaded") ||
    !html.includes("GLB request failed; procedural exterior retained") ||
    !html.includes("GLTFLoader unavailable; procedural exterior retained") ||
    !html.includes("const introRaw=introReady?") ||
    !html.includes("if(!introReady){camera.position.copy(introCameraStart);camera.lookAt(introLookTarget.set(0,2.15,introCameraStart.z-6.5));}") ||
    !html.includes("pendingArchitecturalPavilion=null") ||
    !html.includes("late pavilion queued until the entrance camera finishes") ||
    !html.includes("if(pendingArchitecturalPavilion){mountArchitecturalPavilion(pendingArchitecturalPavilion);pendingArchitecturalPavilion=null;}") ||
    !html.includes("introStartedAt+=performance.now()-introPausedAt") ||
    !html.includes("if(introReady&&!introFinished&&!introPausedAt)introPausedAt=performance.now()") ||
    html.includes("if(introReady){console.warn(\"ARTSPACE: pavilion arrived after the intro fallback timeout; keeping the stable fallback.\");return;}") ||
    html.includes("if(!introStartedAt)introStartedAt=performance.now();")) {
  fail("The entrance must handle late pavilion loads without mid-animation swaps and pause its clock while the page is hidden.");
}

/* The deployed exterior is a real glTF scene asset generated during build, not runtime box construction. */
const modelBuilder = fs.readFileSync("scripts/build-pavilion.js", "utf8");
if (modelBuilder.includes("box(7,5.4,3.6,7.4,0,.35,1.8)")) {
  fail("The dark oak core must not block the entrance sightline into the white gallery.");
}
if (!modelBuilder.includes("function curvedPanelGeometry(segments=64,bow=.12)") ||
    !modelBuilder.includes("const curvedPanel=(m,w,h,d,x,y,z,bow)") ||
    !modelBuilder.includes("const flute=flutedPanelGeometry(),roof=barrelRoofGeometry(),all=[cube,cyl,curve42,curve58,flute,roof]") ||
    !modelBuilder.includes("mesh:shape*materials.length+m") ||
    !modelBuilder.includes("for(let shape=0;shape<6;shape++)") ||
    !modelBuilder.includes("item.roof?5:item.fluted?4:item.curved?(item.bow===.42?2:3):item.c?1:0") ||
    !modelBuilder.includes("function flutedPanelGeometry(segments=48)") ||
    !modelBuilder.includes("flutedPanel(0,.22,4.48,.34") ||
    !modelBuilder.includes("Embed deterministic, tileable procedural material maps") ||
    !modelBuilder.includes("function curvedPanelGeometry(segments=64,bow=.12)") ||
    !modelBuilder.includes("Continuous, smoothly bowed architectural skins")) {
  fail("Pavilion requires continuous smooth curved panel geometry, not only individually angled box segments.");
}
/* Gallery atmosphere requires controlled soft shadows, warm cove lighting and directional wall washes. */
if (!html.includes("new THREE.HemisphereLight(0xffffff,0x77776d,.19)") ||
    !html.includes("keyLight.shadow.mapSize.set(window.innerWidth<700?512:1536") ||
    !html.includes("keyLight.shadow.normalBias=.025") ||
    !html.includes("new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arcPoints(3.43,wallRadius-.2))") ||
    !html.includes("new THREE.SpotLight(0xffe6c9,.48,13,.52,.86,1.8)") ||
    !html.includes("new THREE.PointLight(0xffdfbd,.08,8,2)") ||
    !html.includes("roughness:.76,metalness:.015")) {
  fail("Gallery lighting hierarchy, recessed cove, soft shadow tuning and floor bounce are missing.");
}
/* First screen must open directly into the immersive gallery, with navigation overlaid rather than a separate hero section. */
if (!html.includes('<section class="intro" id="gallery-intro">') ||
    !html.includes('<section class="gallery-shell" id="gallery" aria-label="Immersive three-dimensional fashion boutique">') ||
    !html.includes(".intro{display:none!important}") ||
    !html.includes("height:100dvh;min-height:560px") ||
    !html.includes("position:absolute;z-index:15;top:0;left:0;right:0;height:66px") ||
    !html.includes("position:absolute;inset:0;width:100%;height:100%;min-height:0") ||
    !html.includes("top:88px;left:0;right:0") ||
    !html.includes("bottom:22px") ||
    !html.includes('<a href="#gallery">COLLECTION</a>')) {
  fail("The ARTSPACE opening screen must be the full-viewport immersive gallery with overlay navigation and controls.");
}

/* Rebuilt gallery architecture: layered curved cornice, ceiling raft, tactile finishes, portal and wall-wash lighting. */
if (!html.includes("const makeMineralTexture=(base,contrast,seed)=>") ||
    !html.includes("wallMaterial.map=plasterTexture") ||
    !html.includes("floorMaterial.map=stoneFloorTexture") ||
    !html.includes("const makeArcDetail=(radius,y,material,tube=.025)=>") ||
    !html.includes("makeArcDetail(wallRadius-.18,3.34,warmLimestone,.105)") ||
    !html.includes("new THREE.RingGeometry(7.15,7.72,128,1,wallStart,wallSweep)") ||
    !html.includes("for(let x=-6;x<=6;x+=2)") ||
    !html.includes("const pier=new THREE.Mesh(new THREE.BoxGeometry(.16,5.9,.34),warmLimestone)") ||
    !html.includes("const jamb=new THREE.Mesh(new THREE.BoxGeometry(.22,4.65,.42),warmLimestone)") ||
    !html.includes("const portalHead=new THREE.Mesh(new THREE.BoxGeometry(6.05,.24,.5),warmLimestone)") ||
    !html.includes("makeArcDetail(7.82,-1.685,champagneMetal,.012)") ||
    !html.includes("const wash=new THREE.SpotLight(0xfff0dc,.34,5.8,.82,.9,1.6)") ||
    !html.includes("const tileMat=new THREE.MeshStandardMaterial({color:0xaaa69c,roughness:.88,metalness:.015})")) {
  fail("The gallery interior must retain its curved architectural cornice, layered ceiling, textured finishes, portal, wall details and warm wall-wash lighting.");
}

/* Fashion boutique interior: mannequins, garment silhouettes, fitting suites and rails replace gallery frames. */
if (!html.includes("new THREE.LatheGeometry(points,64)") ||
    !html.includes("const dressPalette=[0xd8c7b1,0x654358,0x8c9b7d,0xb85f49,0x26344a,0x687c60]") ||
    !html.includes("const fittingFabric=new THREE.MeshStandardMaterial") ||
    !html.includes("addBoutiqueBox(room,2.35,3.5,.16,boutiqueWood") ||
    !html.includes("const rail=new THREE.Group();rail.position.set(side*6.15,-1.72,-1.1)") ||
    !html.includes("new THREE.MeshPhysicalMaterial({color:0xe5e9e8,metalness:.92,roughness:.12") ||
    !html.includes("group.userData.index=index") ||
    !html.includes("group.userData.targetY=-1.72") ||
    !html.includes("const cylinderBetween=")) {
  fail("The 3D boutique must include dressed fashion mannequins, custom garment silhouettes, fitting suites, full-height mirrors and garment rails.");
}
if (!html.includes("THE SOLSTICE DRESS") ||
    !html.includes("THE ATELIER SLIP") ||
    !html.includes("THE SUNDAY SHIRT") ||
    !html.includes("THE SCULPTED MIDI") ||
    !html.includes("THE EVENING COLUMN") ||
    !html.includes("THE GARDEN WRAP") ||
    !html.includes('id="productDescription"') ||
    !html.includes('data-size="XS"') ||
    !html.includes('data-size="XL"') ||
    !html.includes('data-finish="Ivory"') ||
    !html.includes('data-finish="Sage"')) {
  fail("The fashion catalogue must contain six dress styles, garment descriptions, apparel sizes and colour choices.");
}

/* Walk-through threshold must be physically open: no full-width glass leaf may span the camera path. */
if (!modelBuilder.includes("Open central portal: glazed sidelights and a high transom frame a clear, walk-through entrance.") ||
    !modelBuilder.includes("box(3,1.55,5,.18,side*2.35,.85,11.86)") ||
    !modelBuilder.includes("box(4,1.36,4.62,.035,side*2.35,.85,11.74)") ||
    !modelBuilder.includes("box(3,6.1,.48,.18,0,3.35,11.86)") ||
    modelBuilder.includes("box(4,5.75,4.25,.035,0,1,11.74)")) {
  fail("The camera entrance must have a clear central opening with only side glazing and a high transom.");
}

/* Sculptural entrance and roof require layered continuous curves, deep soffit and portal ribs. */
if (!modelBuilder.includes("Sculptural roof and entrance refinement") ||
    !modelBuilder.includes("curvedPanel(0,19.9,.24,3.35,0,3.56,11.05,.88)") ||
    !modelBuilder.includes("curvedPanel(3,19.45,.12,3.12,0,3.385,11.08,.82)") ||
    !modelBuilder.includes("Deep portal cheeks with layered reveals") ||
    !modelBuilder.includes("Fine roof ribs are set back beneath the canopy")) {
  fail("The pavilion sculptural roof canopy, recessed soffit and layered entrance portal are missing.");
}

/* Stage 2: the exterior roof is a real double-skin barrel-vault mesh, not a flat slab. */
if (!modelBuilder.includes("function barrelRoofGeometry(nx=64,nz=24)") ||
    !modelBuilder.includes("const flute=flutedPanelGeometry(),roof=barrelRoofGeometry()") ||
    !modelBuilder.includes("item.roof?5") ||
    !modelBuilder.includes('"barrel-vault-roof"') ||
    !modelBuilder.includes("add(0,[19.7,.55,24.8],[0,3.68,-.25],{roof:true})") ||
    modelBuilder.includes("box(0,19.7,.46,24.8,0,3.72,-.25)")) {
  fail("Stage 2 requires the double-skin curved barrel-vault roof geometry in the pavilion GLB.");
}
if (!modelBuilder.includes("const curvedBox=") ||
    !modelBuilder.includes("const facadeCurve=(x)=>") ||
    !modelBuilder.includes("rotation:item.r") ||
    !modelBuilder.includes("[.91,.885,.82,1]") ||
    !modelBuilder.includes("[.78,.88,.89,.22]")) {
  fail("The pavilion must include rotated curved architectural geometry and upgraded PBR material values.");
}
if (!modelBuilder.includes("Open, recessed facade bays: structural piers carry the cladding while glazing remains visibly exposed.") ||
    !modelBuilder.includes("curvedBox(5,.79,3.12,.035") ||
    !modelBuilder.includes("curvedBox(3,.91,3.42,.10") ||
    !modelBuilder.includes("Fluted limestone pilasters align with the structural piers") ||
    !modelBuilder.includes("metalRoughPixels") ||
    !modelBuilder.includes("metallicRoughnessTexture={index:mrTextures[textureIndex]}") ||
    modelBuilder.includes("[[0,0],[1,0],[2,0],[3,1],[6,1],[7,2]]")) {
  fail("The pavilion must have visible recessed glazing bays, aligned fluted piers, and correctly assigned roughness/normal material maps.");
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

if (!modelBuilder.includes("ARTSPACE detailed architectural pavilion builder") ||
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
      if (model.asset?.version !== "2.0" || !model.nodes?.length || model.meshes?.length < 50 || model.materials?.length < 8 || model.textures?.length < 9 || model.images?.length < 9) {
        fail("The pavilion GLB is missing expected architectural geometry, embedded texture maps, or PBR materials.");
      }
      const invalidMeshNodes=(model.nodes||[]).filter(node=>!Number.isInteger(node.mesh)||node.mesh<0||node.mesh>=model.meshes.length);
      if(invalidMeshNodes.length)fail("Pavilion contains "+invalidMeshNodes.length+" nodes with invalid mesh references.");
      const texturedMaterials=(model.materials||[]).filter(material=>material.pbrMetallicRoughness?.baseColorTexture&&material.normalTexture&&material.pbrMetallicRoughness?.metallicRoughnessTexture);
      if(texturedMaterials.length<4)fail("Limestone, shadow stone, concrete and oak must each carry embedded albedo, normal and roughness maps.");
      if(!model.materials[2]||model.materials[2].pbrMetallicRoughness?.baseColorTexture)fail("Bronze must not inherit a limestone albedo texture.");
      if(!(model.nodes||[]).some(node=>node.name==="deep-glass-element")||!(model.nodes||[]).some(node=>node.name==="limestone-element"))fail("The model is missing separate glass and stone facade elements.");
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


/* Fashion collection: six local model-wearing-dress illustrations are wired into the boutique fallback and product catalogue. */
const fashionFiles = [
 "solstice-dress.svg","atelier-slip.svg","sunday-shirt.svg",
 "sculpted-midi.svg","evening-column.svg","garden-wrap.svg"
];
for (const file of fashionFiles) {
 const asset = fs.readFileSync("assets/fashion/" + file, "utf8");
 if (!asset.startsWith("<svg") || !asset.includes("</svg>") || !asset.includes("viewBox=") || !asset.includes("<path")) fail("Fashion illustration is invalid: " + file);
 if (!html.includes("./assets/fashion/" + file)) fail("Fashion illustration is not wired into the boutique: " + file);
}
if (!html.includes("Model wearing The Solstice Dress") || !html.includes("Model wearing The Garden Wrap")) {
 fail("The boutique fallback must provide accessible descriptions of the fashion models.");
}
if (html.includes("THE PRINT COLLECTION") || html.includes("art prints, wall art")) {
 fail("The storefront still contains visible art-gallery product positioning.");
}
/* Real-human fashion pipeline and mobile render budget. */
if (!html.includes("female-base-mesh-base_female.glb") ||
    !html.includes("THREE.SkeletonUtils.clone") ||
    !html.includes("ARTSPACE_CC0_RealisticHuman_") ||
    !html.includes("group.userData.proceduralBody=fallbackBody") ||
    !html.includes("group.userData.proceduralBody.visible=false") ||
    !html.includes("startFashionHumanLoad()") ||
    !html.includes("loader.setCrossOrigin(\"anonymous\")")) {
 fail("The CC0 human-model loader, safe procedural fallback, or per-look model cloning is missing.");
}
if (!html.includes("antialias:window.innerWidth>=700") ||
    !html.includes("window.innerWidth<700?1.0:1.5") ||
    !html.includes("renderer.shadowMap.enabled=window.innerWidth>=700") ||
    !html.includes("keyLight.castShadow=window.innerWidth>=700") ||
    !html.includes("const mobileFrameInterval=window.innerWidth<700?1000/40:0")) {
 fail("Mobile WebGL must use a lower pixel ratio, disable expensive shadows/antialiasing, and pace frames.");
}
console.log("ARTSPACE boutique checks passed: six fashion styles, dressed 3D mannequins, fitting rooms, rails, product sizes/colours, DOM and build structure.");

/* Natural boutique exposure: subdued ambient/fill, controlled key and dress spots, ACES filmic roll-off. */
if (!html.includes("renderer.toneMapping=THREE.ACESFilmicToneMapping") ||
    !html.includes("renderer.toneMappingExposure=.68") ||
    !html.includes("new THREE.HemisphereLight(0xffffff,0x77776d,.19)") ||
    !html.includes("new THREE.DirectionalLight(0xffffff,.46)") ||
    !html.includes("new THREE.DirectionalLight(0xe5e9ff,.07)") ||
    !html.includes("new THREE.PointLight(0xffd1a0,.28,10,2)") ||
    !html.includes("new THREE.SpotLight(0xffebd4,.42,9")) {
 fail("The boutique must use restrained filmic exposure and balanced, non-blown-out model/dress lighting.");
}
/* Imported human figures must use relaxed MakeHuman arm poses and must not retain the fallback hair mesh. */
if (!html.includes('group.userData.proceduralHair=fallbackHair') ||
    !html.includes('group.userData.proceduralHair.visible=false') ||
    !html.includes('poseBone("upperarm01.L",0,0,.5236)') ||
    !html.includes('poseBone("upperarm01.R",0,0,-.5236)') ||
    !html.includes('poseBone("lowerarm01.L",-.6458,0,0)') ||
    !html.includes('poseBone("lowerarm01.R",-.6458,0,0)') ||
    !html.includes('human.updateMatrixWorld(true)')) {
 fail("The rigged human models must use relaxed showroom arm poses and suppress the duplicate procedural hair fallback.");
}


/* Scroll experience: progressive reveals and accessible reading progress, with reduced-motion support. */
if (!html.includes('progress.id="scrollProgress"') ||
    !html.includes('Page reading progress') ||
    !html.includes('.scroll-reveal.is-visible') ||
    !html.includes('IntersectionObserver') ||
    !html.includes('prefers-reduced-motion:reduce') ||
    !html.includes('MutationObserver') ||
    !html.includes('requestAnimationFrame(updateProgress)')) {
 fail("Scroll reveals, dynamic collection-card observation, accessible page progress, or reduced-motion support are missing.");
}
