-- =============================================================
-- LMU BEACH BONFIRES — DATABASE SCHEMA
-- Run this in Supabase SQL Editor to initialize the database.
-- After running, execute seed.sql and seed_beach_access.sql.
-- Then run scripts/geocode-locations.js to populate lat/lng.
-- =============================================================

-- Enable UUID extension (already on by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- SOCIAL FIRE LOCATIONS (seed: 3 records — Mon, Tue, Thu)
-- =============================================================
CREATE TABLE IF NOT EXISTS social_fire_locations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  day_of_week     text NOT NULL,       -- 'monday' | 'tuesday' | 'thursday'
  address         text,
  latitude        numeric(9,6),
  longitude       numeric(9,6),
  start_time      text NOT NULL,       -- e.g. '7:00 PM'
  is_public       boolean DEFAULT false, -- true = Señor Frog's (open to all guests)
  active          boolean DEFAULT true
);

-- =============================================================
-- PARTNER HOTELS
-- =============================================================
CREATE TABLE IF NOT EXISTS partner_hotels (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                     text NOT NULL,
  address                  text NOT NULL,
  latitude                 numeric(9,6),
  longitude                numeric(9,6),
  offers_social_fire       boolean DEFAULT false,
  social_fire_location_id  uuid REFERENCES social_fire_locations(id) ON DELETE SET NULL,
  revenue_share_pct        numeric(5,4) DEFAULT 0,  -- e.g. 0.2000 = 20%
  ticket_price             numeric(8,2) DEFAULT 0,  -- per-ticket price for this hotel
  slug                     text UNIQUE NOT NULL,     -- URL-safe, used in QR codes
  zone                     text DEFAULT 'PCB',       -- 'PCB' | '30A'
  active                   boolean DEFAULT false     -- false until real hotel data confirmed
);

-- =============================================================
-- BEACH ACCESS LOCATIONS
-- =============================================================
CREATE TABLE IF NOT EXISTS beach_access_locations (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  address          text NOT NULL,
  zone             text NOT NULL,      -- 'PCB' | '30A'
  county           text NOT NULL,      -- 'Bay' | 'PCB' | 'Walton'
  latitude         numeric(9,6),       -- populated by scripts/geocode-locations.js
  longitude        numeric(9,6),       -- populated by scripts/geocode-locations.js
  services_offered text[] NOT NULL DEFAULT '{}', -- ['bonfire','picnic','social_fire','chair_rental']
  active           boolean DEFAULT true
);

-- GIN index for fast service filtering: WHERE services_offered @> ARRAY['bonfire']
CREATE INDEX IF NOT EXISTS idx_beach_access_services
  ON beach_access_locations USING GIN (services_offered);

-- =============================================================
-- BOOKINGS (universal form — bonfires, picnics, combos)
-- =============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                timestamptz DEFAULT now(),
  name                      text NOT NULL,
  email                     text NOT NULL,
  phone                     text NOT NULL,
  rental_address            text,
  beach_area_selected       text,                    -- 'Panama City Beach (PCB)' | '30A / South Walton' | 'Walton County' | null (address mode)
  beach_access_preference_1 text,                    -- user's 1st ranked beach access choice (location name)
  beach_access_preference_2 text,                    -- user's 2nd ranked beach access choice (location name)
  beach_access_preference_3 text,                    -- user's 3rd ranked beach access choice (location name)
  location_zone             text,                    -- 'PCB' | '30A' — drives pricing on Page 3
  -- DATE_AVAILABILITY_PHASE_2: preferred_date_1 / preferred_date_2 columns to be added here
  guest_count               integer,
  package_type              text,                    -- 'bonfire' | 'picnic' | 'combo'
  selected_package          text,                    -- e.g. 'one-love', 'high-tide'
  add_ons                   jsonb DEFAULT '[]'::jsonb,  -- [{name, price}]
  sms_consent               boolean DEFAULT false,
  status                    text DEFAULT 'pending_contact',
  notes                     text,
  hubspot_contact_id        text,                    -- filled after HubSpot sync
  hubspot_deal_id           text                     -- filled after HubSpot sync
);

CREATE INDEX IF NOT EXISTS idx_bookings_email     ON bookings (email);
CREATE INDEX IF NOT EXISTS idx_bookings_status    ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_created   ON bookings (created_at DESC);

-- DATE_AVAILABILITY_PHASE_2: availability_blocks table (booked dates per beach access location) to be added here

-- =============================================================
-- SOCIAL FIRE BOOKINGS
-- =============================================================
CREATE TABLE IF NOT EXISTS social_fire_bookings (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at               timestamptz DEFAULT now(),
  primary_guest_name       text NOT NULL,
  primary_guest_email      text NOT NULL,
  primary_guest_phone      text NOT NULL,
  hotel_id                 uuid REFERENCES partner_hotels(id) ON DELETE SET NULL,
  hotel_name               text,         -- denormalized
  source                   text NOT NULL, -- 'qr_code' | 'hotel_website' | 'general_landing_page'
  social_fire_location_id  uuid NOT NULL REFERENCES social_fire_locations(id),
  event_date               date NOT NULL,
  ticket_price             numeric(8,2),
  total_charged            numeric(8,2) DEFAULT 0,
  payment_status           text DEFAULT 'pending',
  -- PAYMENT_PHASE_2: Stripe payment_intent_id and charge fields go here
  additional_guests        jsonb DEFAULT '[]'::jsonb,  -- [{name, email}]
  total_guests             integer DEFAULT 1,
  sms_consent              boolean DEFAULT false,
  hubspot_contact_id       text
);

CREATE INDEX IF NOT EXISTS idx_sf_bookings_email  ON social_fire_bookings (primary_guest_email);
CREATE INDEX IF NOT EXISTS idx_sf_bookings_date   ON social_fire_bookings (event_date);
CREATE INDEX IF NOT EXISTS idx_sf_bookings_hotel  ON social_fire_bookings (hotel_id);

-- =============================================================
-- ROW LEVEL SECURITY
-- Public anon key can INSERT bookings and SELECT reference data.
-- Service role key (edge function only) has full access.
-- =============================================================

ALTER TABLE bookings               ENABLE ROW LEVEL SECURITY;
ALTER TABLE beach_access_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_hotels         ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_fire_locations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_fire_bookings   ENABLE ROW LEVEL SECURITY;

-- Anyone can read active beach access locations (needed for dropdown)
CREATE POLICY "public_read_beach_access"
  ON beach_access_locations FOR SELECT USING (active = true);

-- Anyone can read active partner hotels (needed for social fires page)
CREATE POLICY "public_read_hotels"
  ON partner_hotels FOR SELECT USING (active = true);

-- Anyone can read social fire locations (needed for booking forms)
CREATE POLICY "public_read_sf_locations"
  ON social_fire_locations FOR SELECT USING (active = true);

-- DATE_AVAILABILITY_PHASE_2: public_read_availability policy on availability_blocks goes here

-- Anyone can INSERT a booking (form submission)
CREATE POLICY "public_insert_booking"
  ON bookings FOR INSERT WITH CHECK (true);

-- Anyone can INSERT a social fire booking
CREATE POLICY "public_insert_sf_booking"
  ON social_fire_bookings FOR INSERT WITH CHECK (true);

-- Only service role can SELECT bookings (admin only)
-- (The anon key gets no SELECT on bookings — data stays private)
