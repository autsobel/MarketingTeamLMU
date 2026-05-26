-- Migration 002: separate REGION records from ACCESS_POINT records
--
-- type:   'access_point' — numbered/named beach accesses used in Flow 1
--                          (address-based distance recommendations)
--         'region'       — named beach areas used in Flow 2 (dropdown browsing only)
--
-- region: name of the parent region an access_point belongs to (nullable)
--
-- Run ONCE after deploying the updated lmu-backend.js.
-- Service role key required (bypasses RLS).

ALTER TABLE beach_access_locations
  ADD COLUMN IF NOT EXISTS type   TEXT NOT NULL DEFAULT 'access_point'
    CHECK (type IN ('access_point', 'region')),
  ADD COLUMN IF NOT EXISTS region TEXT;

-- 30A named beach areas are REGION records.
-- They appear in the Flow 2 dropdown and as their own single access point
-- (Option A: each 30A named area is both the region and its own bookable spot).
UPDATE beach_access_locations
SET type = 'region', region = name
WHERE name IN (
  'Inlet Beach',
  'Walton Dunes',
  'Santa Clara',
  'Grayton Dunes',
  'Blue Mountain',
  'Gulfview Heights',
  'Ed Walline',
  'Fort Panic',
  'Dune Allen'
);

-- All other records default to 'access_point' via the column default.
-- Bay County Public Access 1-96, Public Beach Access 24-76B, etc.
