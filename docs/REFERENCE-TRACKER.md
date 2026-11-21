# ARTSPACE — Reference-to-Project Tracker

This is the living acceptance checklist for every ARTSPACE stage. Each stage must compare the actual reference video and the current deployed project, fix one highest-priority gap, run validation/deployment, and record what is and is not visually verified.

## Reference baseline

Source: user-provided 11.65-second screen-recorded reference video (1000392523.mp4).

| Reference moment | Required experience |
|---|---|
| Opening gallery | Bright, minimal, continuous curved white gallery wall; artworks are mounted along the curve, not presented as a flat web carousel. |
| Browsing | Smooth horizontal camera/gallery movement; artwork spacing and perspective create depth. |
| Artwork selection | Selected artwork becomes the focus without losing the gallery context. |
| Product detail | Large artwork on the left; title, artist, description, price, size/finish options and add-to-bag action on the right. |
| Shopping bag | Side drawer overlays the product page and shows the selected item and total. |

The reference clip does not show the exterior pavilion. The exterior building, roof and cinematic entrance are additional ARTSPACE requirements from the user's brief and must be assessed as a separate acceptance track.

## Current implementation audit

Status labels:
- **Source complete** — implementation exists and automated source/build checks cover it.
- **Visual pending** — no trustworthy rendered-browser screenshot has yet been captured and compared.
- **Not complete** — known missing functionality or a material gap remains.

| Area | Current state | Status / evidence |
|---|---|---|
| Full-screen opening gallery | Full-viewport gallery shell with overlay navigation and controls; old hero is hidden. | Source complete; visual pending. |
| Curved gallery architecture | Three.js curved exhibition wall, vaulted ceiling, ribs, cove lighting, wall joints and textured materials. | Source complete; visual pending. |
| Artwork mounting | Six local SVG artwork assets, 3D frames, plaques and individual picture lights. | Source complete; visual pending. Artwork assets are vector illustrations, not verified high-resolution photographic/print assets. |
| Browsing interaction | 3D artwork groups and selection wiring are implemented. | Source complete; visual pending. |
| Product detail | Full-screen responsive detail transition with artwork, product information and size/frame options. | Source complete; visual pending. |
| Shopping bag | Side drawer and local cart interactions are implemented. | Source complete; visual pending. |
| Checkout/payment | Checkout is explicitly disabled; there is no live payment/order backend. | Not complete. |
| Exterior pavilion | Custom generated GLB with curved roof, facade elements, glazing, entrance portal and PBR materials; procedural fallback exists. | Source/build complete; visual pending. |
| Exterior-to-interior camera | High exterior start, curved approach, eye-level doorway path and interior continuation exist. The look target has now been changed to a stable forward target through the doorway. | First repair committed; automated validation pending; visual pending. |

## Ordered remaining work

1. **Camera/entrance acceptance** — verify the camera remains below the entrance canopy, centred in the clear doorway, and points into the gallery; fix any remaining roof/wall clipping. Do not mark visually complete without a real rendered capture.
2. **Reference gallery fidelity** — compare the deployed curved wall, artwork scale, spacing, perspective and browsing motion against the video; correct the largest visible difference.
3. **Artwork quality** — replace or upgrade the six vector placeholders with suitable zero-budget, properly licensed artwork assets while preserving product/cart wiring.
4. **Product-detail fidelity** — compare image size, information hierarchy, options and add-to-bag placement against the reference.
5. **Shopping-bag fidelity and functionality** — verify overlay position, line items, quantity, totals and persistence; keep payment clearly unavailable until a real backend/payment integration exists.
6. **Exterior architecture quality** — compare the pavilion silhouette, roof, facade, glazing, entrance and materials against the intended building design; improve only after rendered inspection.
7. **Cross-device and performance acceptance** — verify mobile layout, WebGL fallback, loading, reduced-motion behaviour and stable deployment.

## Stage log

### Camera look-direction repair — 2026-11-22
- Inspected the latest GitHub source before editing.
- Replaced the separate look spline—which had a near-door control point at the entrance plane—with a stable forward look target six metres ahead of the camera. The target height eases from 2.15 m to 1.55 m as the camera descends.
- Kept the existing high exterior start, curved approach, eye-level entrance waypoints and 9.2-second camera sequence.
- Updated the source validator to require the forward look-ahead behaviour and reject reliance on the old look spline.
- Automated validation: passed (run 44939821665). GitHub Pages deployment: passed (runs 44939821312 and 44939821720). Visual verification: still pending; no rendered browser capture was available, so camera clearance is not yet accepted as visually solved.

## Verification rule

Automated validation proves source/build constraints only. A successful GitHub Pages deployment proves the deployment workflow completed. Neither proves visual similarity, photorealism, camera clearance, or correct appearance on the user's device. Those claims require an actual rendered capture inspected against the reference video.
