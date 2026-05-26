#!/usr/bin/env node
/**
 * scripts/snap-coordinates.js
 * Geocodes each beach access location via Nominatim, snaps the rough coordinate
 * to the Gulf coastline (data/map.geojson), and stores the corrected lat/lng
 * in Supabase.
 *
 * Run once after initial setup, and any time locations are added or changed:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
 *   node scripts/snap-coordinates.js
 *
 * Requirements:
 *   npm install @supabase/supabase-js   (Node 18+ for native fetch)
 *
 * After this script runs successfully, remove the overrideCoords() call from
 * lmu-backend.js so the snapped DB coordinates are used directly on the live site.
 */

'use strict';

const { createClient }     = require('@supabase/supabase-js');
const { snapToCoastline }  = require('../lib/snapToCoast.js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
  console.error('Error: SUPABASE_URL environment variable is not set.');
  process.exit(1);
}
if (!SUPABASE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function geocode(query) {
  const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=' +
    encodeURIComponent(query + ', FL, USA');
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LMU-Beach-Bonfires/1.0 (hello@lightmeupbonfires.com)' }
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || data.length === 0) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const { data: locations, error } = await supabase
    .from('beach_access_locations')
    .select('id, name, address')
    .eq('active', true);

  if (error || !locations) {
    console.error('Failed to load locations from Supabase:', error);
    process.exit(1);
  }

  console.log(`Snapping ${locations.length} locations to coastline...\n`);

  let succeeded = 0;
  let noGeocode = 0;
  let failed    = 0;

  for (const loc of locations) {
    // Prefer address field; fall back to name if address is blank
    const query = (loc.address && loc.address.trim()) ? loc.address : loc.name;
    const rough = await geocode(query);

    if (!rough) {
      console.warn(`  — No geocode result for: "${loc.name}" (skipped)`);
      noGeocode++;
      await sleep(1100);
      continue;
    }

    // Snap the rough Nominatim coordinate to the nearest point on the coastline.
    // rough.lng / rough.lat: Nominatim returns lon as 'lon', we stored as lng above.
    const snapped = snapToCoastline(rough.lng, rough.lat);

    const { error: updateErr } = await supabase
      .from('beach_access_locations')
      .update({ latitude: snapped.lat, longitude: snapped.lng })
      .eq('id', loc.id);

    if (updateErr) {
      console.error(`  ✗ "${loc.name}":`, updateErr.message);
      failed++;
    } else {
      console.log(`  ✓ ${loc.name}`);
      console.log(`      rough   → ${rough.lat.toFixed(6)}, ${rough.lng.toFixed(6)}`);
      console.log(`      snapped → ${snapped.lat.toFixed(6)}, ${snapped.lng.toFixed(6)}`);
    }
    succeeded++;

    // Nominatim rate limit: 1 request/second maximum
    await sleep(1100);
  }

  console.log(`\nDone. ${succeeded} snapped, ${noGeocode} no geocode result, ${failed} DB errors.`);

  if (noGeocode > 0) {
    console.log('\nTip: skipped locations may have non-standard addresses.');
    console.log('Check their "address" field in Supabase and re-run.');
  }

  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
