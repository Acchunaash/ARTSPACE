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
    !html.includes("new THREE.CatmullRomCurve3([introCameraStart,new THREE.Vector3(15.2,8.5,26.5),new THREE.Vector3(13.5,6.5,22.5),new THREE.Vector3(9.5,4.4,19),new THREE.Vector3(5.2,2.65,16.8),new THREE.Vector3(1.8,1.75,15.1),new THREE.Vector3(0,1.65,13.65),new THREE.Vector3(0,1.65,12.45),new THREE.Vector3(0,1.65,10.2),new THREE.Vector3(0,1.65,7.2),introCameraEnd],false,\"centripetal\")") ||
    !html.includes("introCameraPath.getPointAt(pathT)") ||
    !html.includes("const introDuration=reducedMotion?0:9200;") ||
    !html.includes("if(introRaw<.02){camera.position.copy(introCameraStart);camera.lookAt(introLookStart);}") ||
    !html.includes("const introCameraProgress=t=>t<.70?.74*easeCamera(t/.70):t<.86?.74+.12*easeCamera((t-.70)/.16):.86+.14*easeCamera((t-.86)/.14);") ||
    !html.includes("const pathT=introCameraProgress((introRaw-.02)/.98);") ||
    !html.includes("introLookTarget.set(0,THREE.MathUtils.lerp(2.15,1.55,pathT),camera.position.z-6.5)") ||
    !html.includes("camera.lookAt(introLookTarget.set(0,THREE.MathUtils.lerp(2.15,1.55,pathT),camera.position.z-6.5));") ||
    !html.includes("camera.lookAt(introLookTarget.set(0,1.55,introCameraEnd.z-6.5));") ||
    html.includes("introLookEnd") ||
    !html.includes("introCameraPath.points[0].copy(introCameraStart)") ||
    !html.includes("introCameraStart.x=13.5;") ||
    !html.includes("camera.fov=THREE.MathUtils.lerp(40,36,pathT)") ||
    !html.includes("introCameraStart.y=9.2;") ||
    html.includes("camera.position.x=0;") ||
    html.includes("camera.position.y=Math.min(camera.position.y,1.72);") ||
    !html.includes("introCameraStart.z=Math.max(31,9.8/(Math.tan(THREE.MathUtils.degToRad(18))*Math.max(.35,aspect)))")) {
  fail("Curved exterior sweep, portal alignment, and continuous curved-gallery camera transition are missing.");
}
if (!html.includes("new THREE.PlaneGeometry(17,19),floorMaterial") ||
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
/* Photoreal material pipeline: real Poly Haven CC0 PBR maps must augment the embedded fallback. */
if (!html.includes("white_stucco_02_diff_2k.jpg") ||
    !html.includes("white_stucco_02_nor_gl_2k.jpg") ||
    !html.includes("white_stucco_02_rough_2k.jpg") ||
    !html.includes("registerArchitecturalPbr(wallMaterial,2.2)") ||
    !html.includes("material.roughnessMap=architecturalPbr.roughness") ||
    !html.includes("CC0 scanned architectural")) {
  fail("The real CC0 scanned PBR material pipeline is missing.");
}
if (!html.includes("const visitorBench=new THREE.Group()") ||
    !html.includes("const furnitureStone=new THREE.MeshStandardMaterial") ||
    !html.includes("const plinth=new THREE.Group()") ||
    !html.includes("Shadow-gap reveal below the bench seat")) {
  fail("Dimensional gallery plinths and visitor seating are missing.");
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
    !html.includes("keyLight.shadow.mapSize.set(window.innerWidth<700?1024:1536,window.innerWidth<700?1024:1536)")) {
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
    !html.includes("if(!introReady){camera.position.copy(introCameraStart);camera.lookAt(introLookStart);}") ||
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
if (!html.includes("new THREE.HemisphereLight(0xffffff,0x77776d,.48)") ||
    !html.includes("keyLight.shadow.mapSize.set(window.innerWidth<700?1024:1536") ||
    !html.includes("keyLight.shadow.normalBias=.025") ||
    !html.includes("new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arcPoints(3.43,wallRadius-.2))") ||
    !html.includes("new THREE.SpotLight(0xffe6c9,2.05,13,.52,.86,1.8)") ||
    !html.includes("new THREE.PointLight(0xffdfbd,.32,8,2)") ||
    !html.includes("roughness:.76,metalness:.015")) {
  fail("Gallery lighting hierarchy, recessed cove, soft shadow tuning and floor bounce are missing.");
}
/* First screen must open directly into the immersive gallery, with navigation overlaid rather than a separate hero section. */
if (!html.includes('<section class="intro" id="gallery-intro">') ||
    !html.includes('<section class="gallery-shell" id="gallery" aria-label="Immersive three-dimensional art gallery">') ||
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
    !html.includes("const wash=new THREE.SpotLight(0xfff0dc,.72,5.8,.82,.9,1.6)") ||
    !html.includes("const tileMat=new THREE.MeshStandardMaterial({color:0xaaa69c,roughness:.88,metalness:.015})")) {
  fail("The gallery interior must retain its curved architectural cornice, layered ceiling, textured finishes, portal, wall details and warm wall-wash lighting.");
}

/* Interior artwork presentation requires individual wall lights, a gallery mat, title plaque and refined collection styling. */
if (!html.includes("new THREE.SpotLight(0xffedda,2.05,10.5") ||
    !html.includes("group.userData.artworkTarget.position.set") ||
    !html.includes("new THREE.BoxGeometry(2.29,3.09,.035)") ||
    !html.includes("new THREE.PlaneGeometry(2.12,.4)") ||
    !html.includes("plaqueContext.fillText(product.title,24,61)") ||
    !html.includes(".collection-card em{display:flex;justify-content:space-between")) {
  fail("Interior artwork mounting, per-piece lighting, title plaques and refined collection presentation are missing.");
}

/* Artwork frames require layered mounts, a fine perimeter inlay, safe low-opacity glazing and tuned per-print lighting. */
if (!html.includes("const inlayMaterial=new THREE.MeshStandardMaterial") ||
    !html.includes("const glazingMaterial=new THREE.MeshPhysicalMaterial") ||
    !html.includes("opacity:.055,clearcoat:.28") ||
    !html.includes("const frameHighlightMaterial=new THREE.MeshStandardMaterial") ||
    !html.includes("new THREE.SpotLight(0xffedda,2.05,10.5") ||
    !html.includes("targetZ+1.48") ||
    html.includes("new THREE.BoxGeometry(2.34,3.16,.018)")) {
  fail("3D artwork presentation requires open frame detailing, subtle protective glazing and correctly aimed individual picture lights.");
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


/* Original artwork collection: six individually maintained local SVG assets. */
const artworkFiles = ["beautiful-game.svg","after-rain.svg","sunset-club.svg","blue-hour.svg","form-and-feel.svg","sunday-in-color.svg"];
for (const file of artworkFiles) {
  const asset = fs.readFileSync("assets/artworks/" + file, "utf8");
  if (!asset.startsWith("<svg") || !asset.includes("</svg>") || !asset.includes("viewBox=")) fail("Artwork asset is invalid: " + file);
  if (!html.includes("./assets/artworks/" + file)) fail("Artwork asset is not wired into the gallery: " + file);
}
if (html.includes("data:image/svg+xml;base64")) fail("Inline placeholder artwork remains embedded in index.html.");
