# ARTSPACE — 30-step delivery roadmap

This roadmap tracks the build from the original 3D gallery through a production-ready art marketplace.

## Implemented in the repository

**Honest status rule:** a checked item means its code or project artifact exists in GitHub. It does not mean that every interaction has been tested on real Android devices, desktop browsers, or in production. Source validation is automated; visual and end-to-end testing are tracked separately below.

**Latest verified repository state (2026-11-21):** commit `0d6d01ef16f569c4089e47c4483d70c168c26dc9` adds a Three.js room shell (floor, rear/side walls, ceiling trim and track lights). The source validation workflow and GitHub Pages deployment both completed successfully for that commit. The live page has not been independently inspected in a real browser in this work session.


- [x] 01 — Establish the gallery visual foundation and responsive page structure.
- [x] 02 — Build framed artwork cards with depth and perspective.
- [x] 03 — Create the curved carousel layout and animated selection.
- [x] 04 — Add gallery lighting, shadows, and surface treatment.
- [x] 05 — Support pointer/touch navigation.
- [x] 06 — Animate artwork selection and featured-image changes.
- [x] 07 — Add perspective/camera transitions.
- [x] 08 — Add the full-screen artwork viewer.
- [x] 09 — Tune the gallery for mobile layouts.
- [x] 10 — Validate and persist shopping-bag variants.
- [x] 11 — Upgrade the gallery to a real Three.js WebGL scene, with CSS fallback.
- [x] 12 — Add direct 3D drag rotation and eased settling.
- [x] 13 — Add keyboard controls and accessible canvas labeling.
- [x] 14 — Respect reduced-motion preferences and pause rendering in hidden tabs.
- [x] 15 — Add WebGL initialization and context-loss fallback handling.
- [x] 16 — Add a persistent artwork wishlist.
- [x] 17 — Add a saved-artworks drawer with view/remove actions.
- [x] 18 — Add a six-artwork collection grid.
- [x] 19 — Add collection search and category filters.
- [x] 20 — Add live size and frame-finish previews.
- [x] 21 — Add a complimentary-shipping progress indicator.
- [x] 22 — Add cart quantity limits and local cart validation.
- [x] 23 — Add artwork deep links, dynamic page titles, and share actions.
- [x] 24 — Add a web-app manifest, app icon, and offline app-shell service worker.
- [x] 25 — Add canonical, Open Graph, and search metadata.

## Remaining production work

- [x] 26 — Add static HTML/JavaScript/CSS/app-file validation and a GitHub Actions validation workflow; source checks currently pass (duplicate IDs: 0, missing DOM references: 0, script syntax errors: 0).
- [x] 27 — Add the initial Supabase/PostgreSQL schema and Row Level Security policies for products, profiles, orders, order items, and admin roles. The migration is committed but not yet deployed to a Supabase project.
- [ ] 28 — Deploy the backend and integrate a real payment provider through a server-side checkout endpoint (requires provider account, secret keys, and shipping/tax rules).
- [ ] 29 — Build authenticated administration for catalog, inventory, and order management.
- [ ] 30 — Complete end-to-end payment/order tests, security review, performance checks, and production launch.

## Current limitations

ARTSPACE is currently a static GitHub Pages storefront. The gallery, collection, wishlist, and shopping bag work in the browser and use local storage. Checkout is deliberately not represented as working: no payment provider, server-side order API, database, or admin authentication has been connected yet. Those production steps require a backend deployment and private credentials; secret keys must never be placed in this repository or browser JavaScript.

## Deployment

- Repository: https://github.com/Acchunaash/ARTSPACE
- Live site: https://acchunaash.github.io/ARTSPACE/
- Branch: `main`
- GitHub Actions deploys the repository to GitHub Pages on pushes to `main`.
