-- Supabase Seed Data & Role Promotion Guide
-- ==============================================================================
-- 1. HOW TO PROMOTE YOUR FIRST PLATFORM ADMIN
-- ==============================================================================
-- Once you have signed up an initial user via the auth UI (/signup) or Supabase Studio,
-- run the following query in the Supabase SQL Editor to promote them to 'platform_admin':
--
-- UPDATE public.user_roles
-- SET role = 'platform_admin'
-- WHERE user_id = (
--   SELECT id FROM auth.users WHERE email = 'admin@goa.app' LIMIT 1
-- );
--
-- Or if you want to ensure the row exists with ON CONFLICT:
--
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES (
--   (SELECT id FROM auth.users WHERE email = 'admin@goa.app' LIMIT 1),
--   'platform_admin'
-- )
-- ON CONFLICT (user_id, role) DO UPDATE SET role = 'platform_admin';
--
-- ==============================================================================
-- 2. HOW TO PROMOTE A PLACE INCHARGE (BUSINESS OWNER)
-- ==============================================================================
-- UPDATE public.user_roles
-- SET role = 'place_incharge'
-- WHERE user_id = (
--   SELECT id FROM auth.users WHERE email = 'vendor@goa.app' LIMIT 1
-- );
--
-- ==============================================================================
-- 3. INITIAL SEED DATA: POPULAR GOA PLACES (SAMPLE / DEMO)
-- ==============================================================================

INSERT INTO public.places (
  id,
  name,
  description,
  category,
  address,
  latitude,
  longitude,
  photos,
  contact_phone,
  contact_email,
  opening_hours,
  status
)
VALUES
  (
    'a1b2c3d4-0001-4000-8000-000000000001',
    'Palolem Beach',
    'A scenic crescent-shaped beach in South Goa renowned for its calm waters, dolphin sightings, and laid-back sunset shacks.',
    'beach',
    'Canacona, South Goa, Goa 403702',
    15.0100,
    74.0232,
    ARRAY['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800'],
    '+91 832 264 3220',
    'info@palolemgoa.org',
    '{"monday": "Open 24 Hours", "tuesday": "Open 24 Hours", "wednesday": "Open 24 Hours", "thursday": "Open 24 Hours", "friday": "Open 24 Hours", "saturday": "Open 24 Hours", "sunday": "Open 24 Hours"}'::jsonb,
    'approved'
  ),
  (
    'a1b2c3d4-0002-4000-8000-000000000002',
    'Aguada Fort & Lighthouse',
    'A 17th-century Portuguese fortress overlooking the Sinquerim beach and Arabian Sea, featuring a grand four-story lighthouse.',
    'heritage',
    'Sinquerim, Candolim, Goa 403515',
    15.4925,
    73.7737,
    ARRAY['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800'],
    '+91 832 249 4200',
    'contact@goaheritage.gov.in',
    '{"monday": "09:30 - 17:30", "tuesday": "09:30 - 17:30", "wednesday": "09:30 - 17:30", "thursday": "09:30 - 17:30", "friday": "09:30 - 17:30", "saturday": "09:30 - 17:30", "sunday": "09:30 - 17:30"}'::jsonb,
    'approved'
  ),
  (
    'a1b2c3d4-0003-4000-8000-000000000003',
    'Curlies Beach Shack',
    'Legendary seaside venue on Anjuna Beach famous for fresh seafood, sunset cocktails, and vibrant electronic music gatherings.',
    'restaurant',
    'St. Michael Vaddo, South Anjuna, Anjuna, Goa 403509',
    15.5732,
    73.7408,
    ARRAY['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800'],
    '+91 98221 23456',
    'bookings@curliesgoa.com',
    '{"monday": "08:30 - 02:00", "tuesday": "08:30 - 02:00", "wednesday": "08:30 - 02:00", "thursday": "08:30 - 02:00", "friday": "08:30 - 03:00", "saturday": "08:30 - 03:00", "sunday": "08:30 - 03:00"}'::jsonb,
    'approved'
  ),
  (
    'a1b2c3d4-0004-4000-8000-000000000004',
    'Fontainhas Latin Quarter',
    'The historic heritage quarter of Panaji featuring narrow cobblestone lanes, pastel-colored Portuguese colonial bungalows, and art cafes.',
    'culture',
    'Altinho, Panaji, Goa 403001',
    15.4989,
    73.8278,
    ARRAY['https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800'],
    '+91 832 242 3456',
    'heritage@panajicorp.in',
    '{"monday": "Open 24 Hours", "tuesday": "Open 24 Hours", "wednesday": "Open 24 Hours", "thursday": "Open 24 Hours", "friday": "Open 24 Hours", "saturday": "Open 24 Hours", "sunday": "Open 24 Hours"}'::jsonb,
    'approved'
  )
ON CONFLICT (id) DO NOTHING;
