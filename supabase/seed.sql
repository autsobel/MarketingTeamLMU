-- =============================================================
-- LMU BEACH BONFIRES — SEED DATA
-- Run after 001_schema.sql. Then run seed_beach_access.sql.
-- =============================================================

-- =============================================================
-- SOCIAL FIRE LOCATIONS (3 records)
-- TODO: Update address, lat, lon when real venue details confirmed.
-- =============================================================
INSERT INTO social_fire_locations (name, day_of_week, address, latitude, longitude, start_time, is_public, active) VALUES
  -- Monday hotel social fire location
  ('Location 1 — Monday',
   'monday',
   'TODO: Insert Monday social fire beach address here',
   30.1650,    -- TODO: update with real coordinates
   -85.8000,   -- TODO: update with real coordinates
   '7:00 PM',
   false,
   true),

  -- Tuesday hotel social fire location
  ('Location 2 — Tuesday',
   'tuesday',
   'TODO: Insert Tuesday social fire beach address here',
   30.1650,    -- TODO: update with real coordinates
   -85.8000,   -- TODO: update with real coordinates
   '7:00 PM',
   false,
   true),

  -- Señor Frog's — Thursday, open to all guests (not hotel-specific)
  ('Señor Frog''s — Thursday',
   'thursday',
   '15005 Front Beach Rd, Panama City Beach, FL 32413',
   30.1648,
   -85.8036,
   '7:00 PM',
   true,  -- is_public: visible on general social fires page
   true);

-- =============================================================
-- PARTNER HOTELS (12 placeholder records)
-- All active = false until real hotel data is confirmed.
-- Update each field when you have the real hotel details:
--   name           → Full hotel name as guests know it
--   address        → Full street address
--   latitude/longitude → From Google Maps or geocoding
--   slug           → URL-safe identifier (no spaces, lowercase, hyphens)
--                    Used in QR codes: /social-fires/[slug]?source=qr_code
--   ticket_price   → Price per guest for this hotel's social fire
--   revenue_share_pct → Hotel's cut as decimal (0.20 = 20%, 0 = none)
--   zone           → 'PCB' or '30A'
--   offers_social_fire → true when hotel has confirmed social fire program
--   social_fire_location_id → link to the Monday or Tuesday location above
-- =============================================================
WITH sf_locations AS (
  SELECT id, day_of_week FROM social_fire_locations
)
INSERT INTO partner_hotels (
  name, address, latitude, longitude,
  offers_social_fire, social_fire_location_id,
  revenue_share_pct, ticket_price, slug, zone, active
)
SELECT
  name, address, latitude, longitude,
  offers_social_fire,
  (SELECT id FROM sf_locations WHERE day_of_week = sf_day LIMIT 1),
  revenue_share_pct, ticket_price, slug, zone, false
FROM (VALUES
  -- Hotel 1
  ('Placeholder Hotel 1',
   'TODO: 123 Beach Rd, Panama City Beach, FL 32413',
   30.1650, -85.8000,
   true, 'monday',
   0.20, 35.00,
   'placeholder-hotel-1', 'PCB'),

  -- Hotel 2
  ('Placeholder Hotel 2',
   'TODO: 456 Gulf Blvd, Panama City Beach, FL 32413',
   30.1650, -85.8100,
   true, 'monday',
   0.20, 35.00,
   'placeholder-hotel-2', 'PCB'),

  -- Hotel 3
  ('Placeholder Hotel 3',
   'TODO: 789 Front Beach Rd, Panama City Beach, FL 32413',
   30.1650, -85.8200,
   true, 'tuesday',
   0.15, 40.00,
   'placeholder-hotel-3', 'PCB'),

  -- Hotel 4
  ('Placeholder Hotel 4',
   'TODO: 321 Scenic Hwy, Panama City Beach, FL 32413',
   30.1660, -85.7900,
   true, 'tuesday',
   0.00, 45.00,
   'placeholder-hotel-4', 'PCB'),

  -- Hotel 5
  ('Placeholder Hotel 5',
   'TODO: 654 Gulf Dr, Panama City Beach, FL 32413',
   30.1670, -85.8300,
   true, 'monday',
   0.20, 35.00,
   'placeholder-hotel-5', 'PCB'),

  -- Hotel 6
  ('Placeholder Hotel 6',
   'TODO: 987 Beachside Dr, Santa Rosa Beach, FL 32459',
   30.2900, -86.1800,
   true, 'monday',
   0.20, 50.00,
   'placeholder-hotel-6', '30A'),

  -- Hotel 7
  ('Placeholder Hotel 7',
   'TODO: 147 30A Hwy, Seaside, FL 32459',
   30.3230, -86.1400,
   true, 'tuesday',
   0.15, 50.00,
   'placeholder-hotel-7', '30A'),

  -- Hotel 8
  ('Placeholder Hotel 8',
   'TODO: 258 Rosemary Way, Rosemary Beach, FL 32461',
   30.2750, -86.0100,
   true, 'tuesday',
   0.00, 55.00,
   'placeholder-hotel-8', '30A'),

  -- Hotel 9
  ('Placeholder Hotel 9',
   'TODO: 369 WaterColor Blvd, Santa Rosa Beach, FL 32459',
   30.3300, -86.1700,
   true, 'monday',
   0.20, 50.00,
   'placeholder-hotel-9', '30A'),

  -- Hotel 10
  ('Placeholder Hotel 10',
   'TODO: 741 Gulf Shore Dr, Panama City Beach, FL 32413',
   30.1680, -85.7800,
   true, 'tuesday',
   0.10, 40.00,
   'placeholder-hotel-10', 'PCB'),

  -- Hotel 11
  ('Placeholder Hotel 11',
   'TODO: 852 Emerald Coast Pkwy, Destin, FL 32541',
   30.3932, -86.4958,
   false, 'monday',
   0.00, 45.00,
   'placeholder-hotel-11', '30A'),

  -- Hotel 12
  ('Placeholder Hotel 12',
   'TODO: 963 Beach Access Rd, Mexico Beach, FL 32410',
   29.9494, -85.4116,
   false, 'monday',
   0.00, 35.00,
   'placeholder-hotel-12', 'PCB')
) AS h(name, address, latitude, longitude, offers_social_fire, sf_day, revenue_share_pct, ticket_price, slug, zone);
