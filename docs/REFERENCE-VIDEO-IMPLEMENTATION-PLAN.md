# ARTSPACE — Reference Video Analysis & Rebuild Plan

Status: analysis and architecture decision; implementation has not yet been accepted as matching the reference.

## 1. Reference behaviour to reproduce

The supplied reference is an approximately 11.65-second portrait recording (720 × 1280, 30 FPS). The observed experience is a full-screen white exhibition gallery, not a conventional landing page with a hero section above a carousel.

### Sequence observed

| Approx. time | Observed behaviour | Implementation implication |
|---|---|---|
| 0–3 s | Full-screen bright gallery environment. A curved exhibition wall holds framed works. The gallery fills the browser view. | The gallery is the page's primary viewport. Remove the headline-led hero and separate boxed-carousel composition. |
| 3–7 s | The collection/viewpoint moves horizontally around the curved wall. The selected work becomes prominent while neighbouring works recede in perspective; a small title/index is visible near the lower centre. | Use a curved artwork path and a single camera/collection movement model, with touch/drag and arrow navigation. |
| 7–10 s | Selected work transitions to a product layout: large artwork on the left, product information and purchase choices on the right. | Reuse the existing product data and controls, but implement a deliberate gallery-to-product transition. |
| 10–11.65 s | Shopping bag opens as a side panel over the product experience. | Reuse the existing bag state and implement a drawer transition. |

The reference does not establish a first-person walk from outside the building. Do not invent an exterior-to-interior fly-through. The important motion is the full-viewport gallery presentation, curved-wall browsing/focus, and transitions into product and bag views.

## 2. Audit of the current ARTSPACE implementation

Current source: `index.html` (single-file static application; Three.js 0.128.0 loaded from CDN).

Observed implementation facts:
- The DOM still contains an intro section, a separate gallery shell, a selected-product section, an all-artworks section and an about section.
- CSS hides the intro and stretches the gallery shell to the viewport, but this is a styling override layered over the original landing-page structure.
- The WebGL scene currently creates a room from box/plane architectural pieces and a group of six rectangular framed artwork meshes.
- The six artworks are arranged on an arc using per-item target X/Z positions and Y rotations. This is a curved card arrangement, not yet a continuous curved exhibition wall.
- The camera currently runs a hard-coded 11.2-second two-segment movement. This was added without a full authored sequence for the gallery-to-product-to-bag experience.
- Existing product detail, variant selection, wishlist and local-storage bag functionality should be preserved where practical.
- Online payment, deployed backend, customer accounts and order management are not currently connected.

The previous camera-path-only change did not implement the reference. Do not continue extending arbitrary camera coordinates as a substitute for rebuilding the scene and transitions.

## 3. Research and asset decisions

### Primary renderer: Three.js
Use the existing Three.js renderer initially to avoid a full framework migration. Its official examples provide tested references for WebGL interaction, raycasting, cameras, geometry and animation:
- https://threejs.org/examples/
- https://threejs.org/docs/pages/GLTFLoader.html

### Architectural asset source: 3DAssets.dev — Art Gallery and Exhibition Rooms
- Pack: https://3dassets.dev/packs/art-gallery-and-exhibition-rooms
- Manifest: https://3dassets.dev/api/v1/packs/art-gallery-and-exhibition-rooms
- Starter GLB: https://cdn.3dassets.dev/assets/35871/v1/model.glb
- The pack advertises 58 GLB models, 2.2 MB total, CC0 1.0 Universal, metre units and +Y up. It includes modular white wall panels, floors, lighting tracks, spotlights, framed/unframed canvases, plinths and gallery props.
- The assembled two-room scene is 14.44 × 4.26 × 12.18 m, about 43.7k triangles and has no animation.
- Suitability decision: use this pack selectively for real-world-scale architectural details and lighting fixtures if they visually fit. Do not use its assembled straight-wall room as the final gallery: the reference needs a continuous curved composition, so the distinctive curved wall must be custom geometry. Replace placeholder canvases with ARTSPACE product textures.

### Camera and motion sequencing
- Three.js curve utilities / curve-based paths: https://threejs.org/manual/pages/load-gltf.html
- GSAP timeline documentation: https://gsap.com/docs/v3/GSAP/Timeline/
- Decision: author a named, deterministic timeline with explicit phases and camera/look-target interpolation. GSAP is optional; native Three.js animation is acceptable if it avoids unnecessary bundle weight and works consistently on Android. The movement must be tied to the reference sequence, not arbitrary long-duration camera drift.

### Interaction reference
- Three.js official examples: https://threejs.org/examples/
- Open-source radial gallery reference: https://github.com/brucira/3D-radial-gallery
- The radial-gallery repository is a technique reference for curved image distribution, drag/scroll/touch momentum and GSAP sequencing; inspect its licence before reusing any source code. Do not copy code blindly.

## 4. Chosen ARTSPACE architecture

Build a custom, reference-specific scene while retaining the current static application shell only where it is useful.

1. **Full-viewport gallery stage**
   - Header is a light, restrained overlay.
   - Gallery owns the initial viewport; no large marketing hero above it.
   - Stage includes the room, floor, ceiling/upper lighting, curved display wall and artwork wall.
2. **Continuous curved architecture**
   - Generate a smooth concave wall from a Three.js curve/parametric geometry.
   - Build floor and ceiling boundaries that visually follow the room.
   - Add restrained baseboards, wall reveals and spotlights.
   - Avoid the current disconnected straight rear wall and decorative box geometry.
3. **Artwork mounting system**
   - Place each real product image on a framed plane tangent to the curved wall.
   - Give frames correct orientation, spacing, scale and depth.
   - Use raycasting for selecting the work; avoid duplicate invisible hit targets.
4. **Gallery motion controller**
   - Define a stable selected-artwork index and a curve-based camera/target.
   - Horizontal browsing follows the curved wall; selected work comes forward and neighbouring works recede.
   - Support touch drag, mouse drag, arrows and reduced-motion preferences.
   - On first load, play a short, authored reveal of the complete gallery; do not fake an exterior walk-through.
5. **Product transition**
   - Selecting a work transitions from the gallery scene to the existing product information layout.
   - Product page matches the reference hierarchy: large image left, details/options/right, responsive stacking on mobile.
6. **Bag transition**
   - Existing bag state opens as a right-side drawer over the product page.
7. **Mobile performance**
   - Cap device pixel ratio, avoid expensive realtime shadows on low-end devices, dispose textures/geometries when no longer needed, pause rendering when the page is hidden, and preserve a useful non-WebGL fallback.

## 5. Implementation stages and acceptance criteria

| Stage | Work | Acceptance criteria |
|---|---|---|
| A | Remove conflicting old landing/hero/carousel layout rules and establish a clean full-viewport scene host. | First viewport contains the gallery, not the headline section or a separate card carousel. |
| B | Build curved room shell: wall, floor, ceiling edge, baseboards and light fixtures. | A continuous concave gallery wall is visible in the browser at desktop and Android widths. |
| C | Mount six actual product textures along the curve. | No blank dark rectangles; each image is legible, correctly oriented and perspective-scaled. |
| D | Implement curved browsing and focus. | Drag/arrow/touch moves through the wall; selected artwork centres and neighbouring works recede smoothly. |
| E | Implement first-load gallery reveal. | A complete scene-level reveal runs on page open and settles into interactive browsing; no marketing hero animation or arbitrary camera sweep. |
| F | Implement gallery-to-product transition. | Selecting a work opens the reference-style product layout with matching title/image/price/options. |
| G | Implement bag drawer transition. | Bag opens over product view and existing cart data remains intact. |
| H | Mobile and accessibility/performance pass. | Touch gestures work without trapping page scroll; keyboard controls and reduced-motion work; no severe console/WebGL errors on supported Android browser. |
| I | Regression and reference comparison. | Compare matching viewport screenshots and sequence timings to reference frames; document any remaining differences. |

## 6. Verification rules

Report four separate states:
- **Committed:** source change exists on GitHub.
- **Validated:** automated checks pass.
- **Deployed:** GitHub Pages deployment completed successfully.
- **Visually verified:** the running page was actually inspected at the target viewport and compared to the reference.

A commit or passing validator does not prove a visual match. Do not report a stage complete until its acceptance criteria are checked. Do not invent step counts or call an unverified result an exact recreation.

## 7. Immediate next implementation task

Start with Stage A and Stage B: clean up the conflicting CSS/DOM layout and replace the current box-room foundation with a continuous curved architectural wall. Do not make another camera-only tweak. Keep the existing product data and shopping logic intact.
