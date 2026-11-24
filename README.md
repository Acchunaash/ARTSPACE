# ARTSPACE

ARTSPACE is being rebuilt as a premium, mobile-first fashion destination with an editorial storefront and a future photorealistic 3D garment studio.

## Project

- Live site: https://acchunaash.github.io/ARTSPACE/
- Repository: https://github.com/Acchunaash/ARTSPACE
- Main frontend: `index.html`

## Current storefront

- Editorial landing page and responsive navigation.
- Curated product collection with category filters.
- Full-screen product detail view.
- Browser-side shopping bag preview.
- Responsive layouts, reduced-motion support, and accessible controls.
- Product imagery is editorial photography; it is not represented as 3D.
- The 3D garment studio is a planned next stage. Only realistic garment models with verified fit, materials, and interaction should be introduced.
- Online checkout and payments are not connected.

## Development and validation

The site is a static frontend deployed through GitHub Pages. Source validation is run by GitHub Actions:

```sh
node scripts/validate.js
```

The Supabase schema and seed data remain a backend foundation and are not deployed to a live Supabase project. Never commit private credentials or payment secrets.

## Product quality rule

Do not present flat illustrations, low-quality meshes, or a rotating image plane as realistic 3D clothing. A garment viewer must use a real, inspectable 3D garment asset and must be checked on mobile before being described as complete.
