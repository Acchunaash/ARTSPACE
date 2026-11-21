-- ARTSPACE designer dress boutique initial catalogue metadata.
-- Upload approved garment imagery to Supabase Storage and fill image_url before connecting the live catalog API.
insert into public.products (slug, title, subtitle, description, price_inr, category, active)
values
  ('the-solstice-dress', 'THE SOLSTICE DRESS', 'FLUID SATIN · WARM IVORY', 'A softly sculpted A-line silhouette in fluid satin, with a clean neckline and an elegant swing hem.', 6490, 'DAY', true),
  ('the-atelier-slip', 'THE ATELIER SLIP', 'SILK BLEND · DEEP PLUM', 'A refined bias-cut slip dress with delicate straps and a fluid, elongated drape.', 5890, 'EVENING', true),
  ('the-sunday-shirt', 'THE SUNDAY SHIRT', 'COTTON POPLIN · SOFT SAGE', 'An easy shirt dress with a defined waist, relaxed sleeves and a softly pleated skirt.', 5290, 'DAY', true),
  ('the-sculpted-midi', 'THE SCULPTED MIDI', 'TEXTURED CREPE · TERRACOTTA', 'A structured midi dress with a shaped bodice and a confident architectural skirt.', 7290, 'STATEMENT', true),
  ('the-evening-column', 'THE EVENING COLUMN', 'MATTE CREPE · MIDNIGHT', 'A sleek column silhouette with an elegant neckline and a long, uninterrupted line.', 8490, 'EVENING', true),
  ('the-garden-wrap', 'THE GARDEN WRAP', 'PRINTED COTTON · BOTANICAL', 'A wrap dress with a softly gathered waist, gentle movement and a relaxed day-to-evening feel.', 6190, 'DAY', true)
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  description = excluded.description,
  price_inr = excluded.price_inr,
  category = excluded.category,
  active = excluded.active,
  updated_at = now();
