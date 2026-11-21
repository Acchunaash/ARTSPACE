-- ARTSPACE initial catalog metadata.
-- Upload final artwork files to Supabase Storage and fill image_url before connecting the live catalog API.
insert into public.products (slug, title, subtitle, description, price_inr, category, active)
values
  ('the-beautiful-game', 'THE BEAUTIFUL GAME', 'BURKINA FASO — 2026', 'A celebration of movement, culture and the beautiful moments that bring us together.', 5800, 'SPORT', true),
  ('after-the-rain', 'AFTER THE RAIN', 'A STUDY IN COLOR — 2026', 'A colorful landscape study with a calm, optimistic mood.', 4600, 'NATURE', true),
  ('sunset-club', 'SUNSET CLUB', 'NO. 03 — SUMMER', 'A warm summer composition inspired by the last light of the day.', 4900, 'LANDSCAPE', true),
  ('blue-hour', 'BLUE HOUR', 'AN EVENING IN MOTION', 'An atmospheric evening composition in layered blue and warm tones.', 5200, 'LANDSCAPE', true),
  ('form-and-feel', 'FORM & FEEL', 'ABSTRACT COMPOSITION', 'A bold abstract study of shape, balance and color.', 4300, 'ABSTRACT', true),
  ('sunday-in-color', 'SUNDAY IN COLOR', 'LIMITED ART PRINT', 'A bright, expressive print designed to bring color into everyday spaces.', 4800, 'COLOR', true)
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  description = excluded.description,
  price_inr = excluded.price_inr,
  category = excluded.category,
  active = excluded.active,
  updated_at = now();
