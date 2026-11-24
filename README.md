# ARTSPACE

An immersive fashion boutique and storefront, built as a lightweight static website.

## Project links

- **Live site:** https://acchunaash.github.io/ARTSPACE/
- **Repository:** https://github.com/Acchunaash/ARTSPACE
- **Delivery roadmap:** [docs/ROADMAP.md](docs/ROADMAP.md)

## Features

- Three.js WebGL gallery with a curved six-artwork arrangement.
- Pointer/touch drag rotation, arrow navigation, and keyboard controls.
- CSS gallery fallback when WebGL is unavailable.
- Full-screen artwork viewer.
- Responsive collection grid with search and category filters.
- Artwork size and frame-finish price previews.
- Persistent wishlist and shopping bag using browser local storage.
- Quantity validation and complimentary-shipping progress.
- Shareable artwork links.
- Web-app manifest, icon, and offline app-shell caching.

## Development

The current frontend is a static site. Open `index.html` in a local static server or use GitHub Pages. Three.js is loaded from a CDN; if it is unavailable, the CSS gallery remains available.

GitHub Pages deployment is configured in `.github/workflows/deploy.yml` and runs on pushes to `main`. The repository includes `.nojekyll` for straightforward static publishing.

Automated source checks are defined in `.github/workflows/validate.yml` and can be run locally with:

```sh
node scripts/validate.js
```

The initial Supabase schema, Row Level Security policies, six-product seed data, and setup instructions are in `supabase/`. They are committed as a backend foundation but have not been deployed to a Supabase project.

## Current production boundary

The shopping bag is a browser-side preview. **Online checkout, payment processing, customer accounts, order storage, and the admin dashboard are not connected yet.** These require a secure backend, database, provider credentials, and server-side payment verification. Do not put private payment keys or database secrets in this public repository.

See [the 30-step roadmap](docs/ROADMAP.md) for the complete delivery plan.
