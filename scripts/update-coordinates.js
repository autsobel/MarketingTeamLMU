#!/usr/bin/env node
/**
 * scripts/update-coordinates.js
 * Updates beach_access_locations coordinates in Supabase to match the
 * hardcoded lookup table in lib/beachAccessLocations.js.
 *
 * Run this ONCE after deploying lib/beachAccessLocations.js, or any time
 * a coordinate is corrected in the lookup table.
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
 *   node scripts/update-coordinates.js
 *
 * Requirements:
 *   npm install @supabase/supabase-js
 *
 * The service role key bypasses RLS — do NOT use the anon key here.
 * Do NOT commit the service role key to git.
 */

'use strict';

const { createClient } = require('@supabase/supabase-js');
const BEACH_ACCESS_COORDINATES = require('../lib/beachAccessLocations.js');

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

async function main() {
  const entries = Object.entries(BEACH_ACCESS_COORDINATES);
  console.log(`Updating ${entries.length} locations...\n`);

  let succeeded = 0;
  let failed    = 0;
  let notFound  = 0;

  for (const [name, coords] of entries) {
    // Check the record exists before updating so we can distinguish
    // "no match" from a real update error.
    const { data: existing, error: selectErr } = await supabase
      .from('beach_access_locations')
      .select('id')
      .eq('name', name)
      .maybeSingle();

    if (selectErr) {
      console.error(`  ✗ SELECT error for "${name}":`, selectErr.message);
      failed++;
      continue;
    }

    if (!existing) {
      console.warn(`  — Not found in DB: "${name}" (skipped)`);
      notFound++;
      continue;
    }

    const { error: updateErr } = await supabase
      .from('beach_access_locations')
      .update({ latitude: coords.lat, longitude: coords.lng })
      .eq('name', name);

    if (updateErr) {
      console.error(`  ✗ UPDATE failed for "${name}":`, updateErr.message);
      failed++;
    } else {
      console.log(`  ✓ ${name}: ${coords.lat}, ${coords.lng}`);
      succeeded++;
    }
  }

  console.log(`\nDone. ${succeeded} updated, ${notFound} not found in DB, ${failed} errors.`);

  if (notFound > 0) {
    console.log('\nNot-found entries may have slightly different names in the database.');
    console.log('Check spelling/accents (e.g. "Señor Frogs") or run:');
    console.log('  supabase db ... SELECT name FROM beach_access_locations ORDER BY name;');
  }

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(function (err) {
  console.error('Fatal error:', err);
  process.exit(1);
});
