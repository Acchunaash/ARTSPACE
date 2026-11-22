# ARTSPACE — Reference-to-Project Tracker

This is the living acceptance checklist for the current ARTSPACE direction. The user has changed the concept from an art gallery to a designer dress boutique. The latest implementation target is a luxury contemporary fashion showroom with 3D models wearing dresses, garment rails, fitting rooms, mirrors and apparel shopping controls.

## Current brief

- Replace the art-gallery retail concept with a designer dress shop.
- Preserve the existing curved pavilion exterior and cinematic entrance unless a later request changes them.
- Make the interior read as a real fashion boutique: full-height dressed models/mannequins, distinct dress silhouettes, clothing rails, fitting suites, mirrors, warm retail lighting and display platforms.
- Replace print product data with a six-dress catalogue, apparel sizes, colour choices, descriptions, prices, saved wardrobe and shopping bag.
- Checkout remains disabled until a real order/payment backend exists.
- The old user reference video (1000392523.mp4) depicted an art gallery. It is no longer the interior design target after this explicit concept change.

## Current implementation audit

| Area | Current state | Status / evidence |
|---|---|---|
| Full-screen opening | Immersive full-screen 3D pavilion entrance retained; navigation now positions the store as a fashion boutique. | Source updated; visual pending. |
| Curved showroom shell | Existing curved wall, vaulted ceiling, textured plaster, cove lighting, stone floor and portal retained as the boutique shell. | Source retained; visual pending. |
| 3D fashion models | Six display looks now load a CC0, MakeHuman-derived adult female base mesh (163-bone rig, approximately 109k triangles) and layer ARTSPACE dress geometry over it. The original procedural body remains as a network/CORS fallback; desktop shows all six, mobile renders the detailed human only for the active look. | Source committed; external asset loading, anatomical fit and rendered realism still require browser inspection. |
| Boutique fixtures | Two fitting-suite portals/curtains, full-height mirrors, brass garment rails and individually hung garments added. | Source implemented; visual pending. |
| Fashion catalogue | Six dress styles with local model-wearing-dress SVG previews, descriptions, Indian rupee prices, sizes XS–XL and Ivory/Black/Sage colour options. | Source updated; visual pending. |
| Product detail | Existing responsive full-screen detail layout now displays dress details, size and colour choices. | Source updated; visual pending. |
| Saved wardrobe / bag | Existing local wishlist and shopping-bag interactions retained and relabelled for dresses. Old stored print selections may be discarded by the new size/colour validation. | Source updated; functional browser acceptance pending. |
| Checkout/payment | Checkout remains explicitly disabled; no live order/payment backend is connected. | Not complete. |
| Exterior pavilion and entrance | Existing curved roof, facade, glazing, entrance and camera path preserved. | Source/build retained; visual pending. |

## Ordered remaining work

1. **Fashion model visual acceptance** — verify the external CC0 human GLB loads from its host (including CORS), check scale/pose, dress coverage and model-to-garment fit in an actual browser capture.
2. **Exact garment realism** — the current dress shells are catalogue-specific ARTSPACE geometry with subtle procedural drape, not scanned or simulation-fitted garments. Build exact dress meshes from approved garment references or source assets; verify sleeves, seams, hems, folds and fabric behaviour against each real dress.
3. **Fashion product imagery** — replace the vector fallback illustrations with suitable high-quality fashion photography or approved model imagery if the user supplies/chooses references.
4. **Product detail and fit** — verify size/colour controls, garment information and mobile layout.
5. **Shopping bag and checkout** — verify saved wardrobe, cart persistence and line-item totals; keep checkout disabled until a real backend/payment integration exists.
6. **Exterior and camera acceptance** — confirm the pavilion approach, roof clearance and continuous entrance transition with rendered evidence.
7. **Cross-device and performance acceptance** — verify mobile layout, WebGL fallback, loading, reduced-motion behaviour and stable deployment.

## Stage log

### Camera look-direction repair — 2026-11-22
- Inspected the latest GitHub source before editing.
- Replaced the separate look spline—which had a near-door control point at the entrance plane—with a stable forward look target six metres ahead of the camera. The target height eases from 2.15 m to 1.55 m as the camera descends.
- Kept the existing high exterior start, curved approach, eye-level entrance waypoints and 9.2-second camera sequence.
- Updated the source validator to require the forward look-ahead behaviour and reject reliance on the old look spline.
- Automated validation: passed (run 44939821665). GitHub Pages deployment: passed (runs 44939821312 and 44939821720). Visual verification: still pending; no rendered browser capture was available, so camera clearance is not yet accepted as visually solved.

### Real-human fashion engine and mobile rendering optimization — 2026-11-22
- Inspected the current boutique model-construction code and renderer before changing the display pipeline. The prior six figures were assembled from primitive heads, limbs and lathed dress shells, so they read as stylised mannequins rather than people.
- Added a CC0 adult female base mesh from Innerscene/MakeHuman (163-bone rig, approximately 109k triangles, 4.3 MB GLB) as the new human anatomy source. The GLB is requested once after the cinematic entrance, then cloned for the six dress displays. The procedural body remains available if the remote asset fails or its host blocks cross-origin loading.
- Retained ARTSPACE's six catalogue-specific garment silhouettes and added subtle radial fabric-fold deformation plus a more cloth-like physical material response. These are still authored geometry, not cloth simulation or exact scanned garments.
- Mobile performance pass: disabled antialiasing and shadow maps on narrow screens, capped device pixel ratio at 1.0 on mobile / 1.5 on desktop, paced mobile rendering at up to 40 fps, and limited the detailed human model to the active look on mobile. Desktop keeps all six models visible.
- Added an asset licence note documenting the CC0 source and runtime fallback.
- Automated source/build validation passed on commit `23290d6e312d19aa80fff7cfb55cbd77fa0d217a` (run 44952633346). GitHub Pages build and deployment passed for the same commit (run 44952633210). The additional ARTSPACE deploy workflow is still finishing its post-deploy step. Visual acceptance is pending: the external model's CORS/load behaviour, fit, pose, cloth coverage and actual mobile frame rate have not been inspected in a browser capture.
- Important limitation: the current dress meshes are improved ARTSPACE geometry, not custom-fitted photoreal garment scans. Exact real-world garment matching still needs approved garment reference images or source 3D clothing assets.

## Verification rule

Automated validation proves source/build constraints only. A successful GitHub Pages deployment proves the deployment workflow completed. Neither proves visual similarity, photorealism, camera clearance, or correct appearance on the user's device. Those claims require an actual rendered capture inspected against the reference video.


### Camera path / roof / entrance geometry re-audit — 2026-11-22
- Re-read the live GitHub camera spline, animation progress, pavilion builder and interior portal geometry before editing.
- Compared against the original clip: the clip's key movement is smooth lateral browsing along the curved white wall; it does not show an exterior. Kept the exterior approach as a separate project requirement and retained the high, sweeping exterior descent.
- Source geometry audit: the pavilion entrance has a centred clear portal approximately 6 m wide; the inner gallery portal is approximately 5.6 m wide. The camera path is centred at x=0 and 1.65 m eye height while crossing both portal planes. The entrance canopy soffit is at about 3.24 m, giving about 1.59 m vertical clearance above the camera eye point at the centreline. The path does not intentionally pass through the roof mesh; the spline descends to eye level before crossing the doorway.
- Defect found: when the 9.2-second intro completed, the camera's look target jumped from the moving 6.5 m forward target to a separate fixed target. Replaced that final target with the same forward look-ahead vector so the settled view has no target discontinuity.
- Updated the automated validator to require the final look-ahead target and reject the obsolete endpoint target.
- Visual acceptance remains pending: this is a source/geometry audit, not a rendered camera capture. The original video remains the gallery-fidelity reference, not evidence for the exterior.


### Follow-up camera acceptance audit — 2026-11-22
- Rechecked the committed path against the builder's portal and canopy placements. The approach reaches the centreline before crossing the entrance plane, stays at eye height through the portal, and the canopy soffit is above the camera line. The path's last outside waypoint is z=12.45; the entrance frame is centred near z=12.0; the next waypoints continue inside.
- Found a regression in the prior cleanup: the two initial/loading camera branches still referenced the removed `introLookStart` symbol. Replaced both with the same explicit forward look-ahead target and strengthened the validator to reject obsolete look-target references.
- This is now a source-level defect fixed; rendered visual acceptance is still not available from the current GitHub workflow. No claim is made that the user-visible camera clipping has been visually disproved.


### White gallery entrance and fixed artwork wall — 2026-11-22
- Removed the dark smoked-oak core that occupied the view immediately beyond the pavilion entrance; the entry sightline now opens into the white gallery instead of a brown block.
- Re-toned the interior bench timber and the 3D frame backing to pale neutral stone so brown surfaces no longer dominate the first interior view.
- Reworked the 3D wall layout so all six artworks occupy permanent, evenly spaced positions on the curved exhibition wall. Changing the selected artwork no longer rotates/rearranges the other frames or scales one into a carousel hero.
- Updated the non-WebGL artwork presentation to keep every card visible and fixed in its wall arrangement, and strengthened automated checks against the old selection-relative layout and oak core.
- Source changes are prepared for validation and deployment. Visual acceptance remains pending until a real rendered browser capture can be inspected; source changes alone cannot prove the entrance now looks correct on-device.


### Wide interior room framing and material refinement — 2026-11-22
- Inspected the current room shell, curved exhibition wall, vaulted ceiling, floor finish, wall-wash lighting and entrance camera before editing.
- Widened the settled interior view by easing the camera field of view from 40° to 44° during the cinematic approach, so the visitor sees more of the room after crossing the entrance without changing the exterior camera path or the gallery geometry.
- Refined the stone floor to a restrained satin finish and softened the bronze/gold architectural trim toward a quieter pale champagne-metal tone to reduce brown visual weight while keeping the white gallery palette.
- Automated checks now require the wider interior camera framing and updated floor finish. Visual acceptance remains pending until an actual rendered capture can be inspected; these source changes do not prove the room looks realistic on-device.

### Large-format gallery floor detailing — 2026-11-22
- Re-inspected the current interior source before changing it. The gallery floor was a single 17 m × 19 m textured plane with no visible slab module or joints, which weakened architectural scale.
- Added restrained, evenly spaced large-format stone joints in a low-contrast warm-grey finish. The 2.125 m × 2.375 m module is aligned to the floor footprint; the floor material, room shell, artwork wall, camera path, exterior and shopping interactions are unchanged.
- Added source-validator checks for the joint material and both joint directions.
- Previous version's validation and both GitHub Pages deployment workflows were confirmed successful before this change. The new commit still requires its own validation and deployment.
- Visual acceptance remains pending: no rendered browser capture is available, so the joint appearance and overall realism are not claimed as visually verified.

### Wall-mounted artwork frame and label refinement — 2026-11-22
- Inspected the six local SVG artwork assets and the live 3D frame-construction code before editing. The artworks are original stylized vector illustrations, not photographic paintings; this pass improves their physical presentation rather than claiming to turn them into photorealistic artwork.
- Reduced the brown/gold appearance of frame inlays and highlight rails, shifting them to quiet neutral satin-metal finishes. Lightened the visible inner mount to a neutral gallery mat.
- Refined the small artwork plaques with a restrained ARTSPACE collection header, clearer title/subtitle hierarchy and a soft neutral background.
- Increased artwork texture anisotropy up to the device-supported maximum of 8 and explicitly retained mipmapped linear filtering to improve oblique viewing sharpness.
- Added validator requirements for the neutral frame finishes, label hierarchy and texture filtering. Wall positions, camera path, exterior, floor, and shopping interactions remain unchanged.
- Visual acceptance is pending: source checks do not establish the rendered frame appearance, texture sharpness on the user's device, or whether the artwork style matches a yet-to-be-supplied reference.

### Curated artwork collection rebuild — 2026-11-22
- Inspected all six live SVGs before editing. The previous prints relied on simple flat shapes and repeated scenic compositions, so the collection read more like basic placeholders than a considered gallery selection.
- Reworked all six individual local SVG assets with more layered compositions, differentiated subject matter and palettes, atmospheric gradients, fine grain/pattern details, and clearer print typography. The six pieces remain distinct: figurative/sport landscape, rainy waterscape, sunset scene, blue-hour mountain landscape, abstract form study, and geometric color composition.
- Preserved the existing asset filenames and viewBox, so product records, gallery wall mounting, artwork selection, and shopping/cart wiring remain unchanged.
- Extended the source validator to check the individual compositions' expected SVG structures and finish details.
- These are original vector illustrations, not photographic or hand-painted scans. The design source is upgraded; rendered visual acceptance and comparison against the missing exact Pinterest reference remain pending until a real browser capture/reference image is available.

- CI caught a syntax error in the newly added SVG-root counting expression (the artwork files themselves were not the cause). Replaced the fragile regular-expression count with literal root-tag counts; the corrected validator commit now triggers a fresh validation run. The earlier failed run is retained in the audit trail and is not represented as a pass.

- The next CI attempt exposed a pre-existing stale plaque assertion (it expected the old title baseline at y=61, while the already-refined plaque correctly places the title at y=78). Updated that assertion to match the actual live plaque layout; this was a validator mismatch, not an application regression. A fresh CI run is required.

### Gallery-to-fashion-boutique conversion — 2026-11-22
- Inspected the current storefront, Three.js interior, product-detail flow, cart/wishlist logic, validator and catalogue seed before changing the concept.
- Repositioned the storefront as a contemporary designer dress boutique. Replaced the six art-print products and visible gallery copy with six dress styles, garment descriptions, INR prices, apparel sizes XS–XL and Ivory/Black/Sage colour selections.
- Added six local model-wearing-dress illustration previews for the HTML fallback/product cards.
- Replaced the 3D artwork frames with six custom Three.js dressed mannequin models. Each figure uses a lathed garment silhouette, skin-tone head/arms/legs, hair, shoes, garment trim, a display plinth and an individual spotlight. Added brass garment rails with hanging pieces, two fitting-suite portals/curtains and full-height mirrors.
- Preserved the existing curved pavilion shell, exterior GLB, entrance camera path, product-detail overlay, cart mechanics and disabled checkout boundary. Moved local cart/wishlist storage to dress-specific keys so old art-print selections do not appear as dresses.
- Updated the Supabase seed catalogue, app manifest, service-worker cache version and automated validator for the new fashion direction.
- Automated source/build validation passed on commit `94756bbdb7348100d4b4ffda7628bf928e1ccf8e` (run 44951587023). GitHub Pages build/deployment passed for the same commit (run 44951586520).
- Visual acceptance remains pending: no actual browser screenshot of the deployed boutique has been captured. The six 3D figures are procedural stylised mannequins, not photoreal human models; the local SVG product previews are fashion illustrations, not product photography. Garment fabric realism, model proportions and final camera framing still need a real rendered inspection.

 
### Realistic human model and mobile rendering engine — 2026-11-22
- Inspected the existing fashion-rendering implementation, loader readiness sequence, mannequin fallback, imported rig, mobile visibility policy and validation checks before refining the engine.
- The boutique now uses a CC0 MakeHuman-derived rigged female base mesh (109k triangles, approximately 4.3 MB) loaded once and cloned with independent skeletons for the six dress displays. The imported body is paired with the existing catalogue garment meshes; the original procedural body remains a fallback if the remote GLB or Three.js loader is unavailable.
- Refined the imported A-pose into a more natural showroom arm position using the documented MPFB default-rig clavicle, upper-arm and lower-arm joints. Added subtle per-look spine/head variation and disabled the procedural hair fallback when the imported human is active to prevent duplicate hair geometry.
- Retained the mobile performance budget: 1.0 device-pixel-ratio cap, antialiasing and shadow maps disabled on narrow screens, a 40 fps render ceiling, and only the currently selected full human model visible on mobile. Desktop keeps the six full model views.
- Source validator now checks the human rig pose and fallback-hair visibility in addition to the CC0 model loader, clone path and mobile rendering constraints.
- Important limitation: this is a realistic anatomical human base mesh with separate procedural dress shells, not six individually tailored garment scans or cloth-simulation assets. The current dresses still need custom fitted garment meshes, accurate fabric textures and drape/fit refinement before they can be described as exact real-world product replicas. Visual acceptance is still pending because no deployed-browser capture has been obtained.


### Natural boutique lighting and visibility correction — 2026-11-22
- Inspected the live Three.js lighting setup after the report that the models and dresses looked washed out and were difficult to see.
- Added ACES filmic tone mapping with a restrained exposure value, reduced the broad hemisphere and directional fill, lowered the warm ceiling pools and cove emissive intensity, and softened the per-look spotlights. This is intended to restore garment colour, body shape and material contrast without making the room dark.
- Kept the pavilion geometry, camera path, dress meshes, model asset loader, product interactions and mobile performance limits unchanged.
- Added validator checks for the new exposure and lighting levels. Automated validation and Pages deployment are required before considering this source change complete.
- Honest visual status: this is a source-level lighting correction. No browser screenshot is available in this workflow, so the final rendered brightness and visibility on the user's phone are not claimed as visually verified.


### Second lighting correction — lower exposure and control bright reflections — 2026-11-22
- User reported the previous lighting correction still looked too bright / unclear.
- Reduced global filmic exposure again, cut ambient and directional fill substantially, dimmed the simulated environment's bright white reflection panels, and lowered the gallery wall washes, ceiling pools, cove emission and individual dress spotlights.
- Replaced the pure-white basic-material ceiling panels and entrance light strip with muted, non-self-luminous standard materials so they no longer appear as blown-out white patches.
- Updated regression checks to enforce the new lower lighting values. Geometry, camera and commerce interactions remain untouched.
- Visual verification is still pending: source validation and deployment workflows must complete, and a real browser capture is needed to judge the result on-screen.
### Lighting validator alignment and deployment safety gate — 2026-11-22
- Re-inspected the latest index.html, scripts/validate.js, reference tracker and the failed GitHub Actions job before changing anything.
- The failed validation log identified one stale regression expectation: the validator expected the primary hemisphere fill at .34, while the current natural-lighting implementation correctly uses .19. The source lighting was not increased; the validator was aligned to the already-committed .19 value. Exposure remains .68, with the existing reduced directional fill and dress spotlights unchanged.
- Added a validation job to the GitHub Pages deploy workflow and made deployment depend on both successful validation and successful site build. This prevents future pushes from deploying an unvalidated source revision.
- Validation workflow passed on the final tracker revision (run 44973637590). The gated deploy workflow passed on commit 9ad1fe4c5ff4da20cb50dc739dbc605c4d85cb17 (run 44973637607), and the GitHub Pages build/deployment workflow also passed (run 44973637580).
- The previous revision's Pages deployment succeeded despite its separate validation failure; that historical deployment is not treated as an acceptance pass.
- Visual acceptance remains pending. No actual browser screenshot/render capture has been obtained, so the models, skin tones, dress colours and architectural details under the new lighting have not been visually verified.

### Editorial scroll animations — 2026-11-22
- Added restrained scroll-triggered reveal motion to the collection heading, filters, dynamically rendered dress cards, about-strip statements and footer. Elements fade and rise into view with a subtle stagger; the full-screen opening gallery and its cinematic WebGL camera path are not animated by this layer.
- Added a slim top reading-progress indicator with accessible progress semantics. It updates using requestAnimationFrame and passive scroll listeners.
- Added IntersectionObserver-based reveals and MutationObserver support for dress cards inserted by filtering/search, with immediate visibility fallback where observers are unavailable.
- Respects `prefers-reduced-motion`: reveal transitions are disabled and the progress line is hidden for users who request reduced motion.
- Updated `scripts/validate.js` to guard the scroll animation, dynamic-card, progress and reduced-motion hooks.
- Corrected the progress-indicator regression check to match its intentional runtime-created DOM element; the indicator is created after the page body is available rather than hard-coded into the HTML.
- Corrected the dynamic-card observer to target the actual `.collection-grid` class, so cards inserted after filtering/search are picked up.
- Automated validation and Pages deployment are pending for the final grid-observer correction. Visual acceptance remains pending until a real deployed-browser screenshot is inspected; source checks do not prove the rendered timing or appearance.


### Architectural material realism pass — 2026-11-22
- Added a physically based micro-surface pass to the live Three.js scene: deterministic mineral height maps for fine plaster/stone relief and a variable roughness map for the honed limestone floor.
- Applied subtle bump response to the curved plaster gallery walls, exterior fallback cladding and pavilion limestone/concrete materials, while preserving the scanned Poly Haven plaster albedo/normal/roughness pipeline.
- Tuned the floor to a more natural honed-stone response with restrained reflections and micro-relief; corrected the visitor bench timber material so it reads as warm oak rather than matching the stone plinth.
- Preserved the existing exterior pavilion GLB, entrance camera path, interior geometry, fashion models, product interactions and responsive performance settings.
- Updated the source validator to check the new material maps and timber finish, and aligned its expected floor material values.
- Blender Bridge scene editing was unavailable because the connected account requires an active trial/subscription. This pass was therefore made in the website's Three.js source.
- Visual acceptance is still pending: no live browser screenshot was available, so the rendered change must be inspected on the deployed site before claiming photorealistic acceptance.


### Direct Three.js boutique realism pass — 2026-11-22
- Continued without Blender by editing the live website's Three.js scene directly.
- Added procedural quarter-sawn oak grain and subtle relief maps to the fitting-room joinery and visitor bench, plus a woven linen texture and fine bump response for fitting-room fabric panels.
- Added slim brass-toned joinery reveals, a recessed fitting-room base and a small metal pull to give the fitting suites more convincing construction detail.
- Textures are generated in-browser with CanvasTexture; no external assets or additional network requests are required.
- Kept the exterior entrance animation, camera path, pavilion GLB, boutique positions, fashion models, product selection, cart and checkout interactions unchanged.
- Added regression checks for the oak/linen maps and fitting-room details.
- Automated deployment and visual acceptance still require checking on the live site; source syntax and structure are not a substitute for a real rendered browser screenshot.

## 2026-11-22 — Architectural lighting refinement
- Added a soft warm facade daylight direction and cool skylight hemisphere fill to complement the existing studio reflection environment.
- Added four warm ceiling light pools over the main boutique and fitting alcoves to improve oak, limestone and mannequin readability.
- Preserved the existing ACES filmic exposure, shadow setup, camera entrance animation and mobile performance limits.
- Meshy pavilion geometry and PBR texturing are complete, but GLB export is currently blocked by the connected Meshy plan; the existing pavilion asset remains in use.


### Free CC0 showroom model integration — 2026-11-22
- User explicitly rejected paid 3D generation and asked for a free solution. Selected the Innerscene compact showroom GLB, published under CC0 (public domain dedication), with a glazed facade, cutaway roof/wall, polished floor, ceiling lighting tracks, lounge and sales desks. Source asset is approximately 10.7 MB and remains hosted by Innerscene; ARTSPACE loads it directly at runtime, so no paid generator or local asset upload is required.
- Updated the pavilion loader to request the hosted GLB with anonymous CORS and scale it to fit the ARTSPACE scene. Added a best-effort name-based visibility filter for vehicle-related nodes so the showroom can read as a fashion space; the existing ARTSPACE fashion displays and procedural exterior fallback remain.
- Updated automated validation to verify the external CC0 asset URL and CORS configuration rather than requiring the unavailable local Meshy GLB.
- Important limitation: this is a free, reusable showroom asset adapted for ARTSPACE, not a custom AI-generated fashion boutique. The source model's vehicle meshes are hidden only when their node names match the filter. Browser CORS, object naming, orientation, scale and the final rendered fit still require visual acceptance; no claim is made that these have been verified.


### Interior close-up framing and product display lighting — 2026-11-22
- Tightened the final interior camera position and field of view after the preserved exterior-to-interior entrance animation: desktop FOV 36°, mobile FOV 39°, with a closer final look target. Exterior establishing shot and camera travel remain unchanged.
- Added slim champagne-brass display frames around all six dress/mannequin plinths, recessed warm LED strips on both sides and top/bottom, subtle halo backing, and an aimed soft top spotlight.
- Added small adjustable-looking cylindrical track-light housings and emissive lenses along both ceiling rails for more layered showroom detail.
- Extended validator checks for the close interior camera and new frame/track lighting elements. Rendering and visual fit still require browser acceptance testing.


## 2026-11-22 — Selected-dress focus and interior dressing
- Updated the 3D gallery layout so the currently selected dress is enlarged while surrounding displays recede, and the curved gallery eases around to place that specific dress in the centre sightline.
- Added interior staging: a bordered rug, travertine consultation table, brass foot and tray, stacked lookbook, suspended linear brass pendant with warm diffuser, ceiling wall-wash fittings, and ceramic vessels.
- Verification: all five inline JavaScript blocks in `index.html` parse successfully. GitHub Pages deployment was pending at the time of this check; live visual rendering has not been independently verified.


## 2026-11-22 — 3D startup reliability fix
- Removed the optional GLTFLoader CDN from the critical rendering path. ARTSPACE now waits for Three.js, but only gives the optional model loader 1.2 seconds; if it is slow or blocked, the procedural 3D boutique starts instead of leaving the preview stuck.
- Kept the detailed pavilion and imported fashion-human assets as progressive enhancements when the loader is available within the bounded startup window.
- Added a validator guard so future changes cannot make the optional GLTFLoader a blocking dependency again.
- The diagnostic overlay continues to expose startup errors. GitHub Actions and browser rendering must still be checked after deployment; this source change alone does not prove the user's device can create a WebGL context.


## 2026-11-22 — Remove visitor-side 3D CDN dependency
- The prior startup adjustment did not resolve the user's issue. The 3D runtime still depended on loading Three.js from external CDNs on each visitor device, so CDN filtering, network instability or cache interference could still prevent the scene from initializing.
- Replaced the browser-side CDN fallback loader with locally served, pinned Three.js r128, GLTFLoader and SkeletonUtils files. Added a build script to fetch these assets during GitHub Actions and include the MIT license in the Pages artifact.
- Updated both deployment and validation workflows to build the local runtime, strengthened validation to require the local assets, and bumped the service-worker shell cache to v6.
- This removes the external CDN from the critical browser startup path. Deployment and on-device WebGL rendering still need to be confirmed after the workflow completes.
