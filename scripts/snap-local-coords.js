#!/usr/bin/env node
/**
 * scripts/snap-local-coords.js
 * Snaps existing coordinates in lib/beachAccessLocations.js to the Gulf
 * coastline defined in data/map.geojson, then rewrites the file in place.
 *
 * No Supabase or network access required — runs entirely offline.
 *
 * Usage: node scripts/snap-local-coords.js
 */

'use strict';

const fs                      = require('fs');
const path                    = require('path');
const { snapToCoastline }     = require('../lib/snapToCoast.js');
const BEACH_ACCESS_COORDINATES = require('../lib/beachAccessLocations.js');

const entries = Object.entries(BEACH_ACCESS_COORDINATES);
console.log(`Snapping ${entries.length} coordinates to coastline...\n`);

const snapped = {};
for (const [name, coords] of entries) {
  const result  = snapToCoastline(coords.lng, coords.lat);
  snapped[name] = { lat: result.lat, lng: result.lng };
  const dLat = (result.lat - coords.lat).toFixed(5);
  const dLng = (result.lng - coords.lng).toFixed(5);
  console.log(`  ✓ ${name}`);
  console.log(`      was     → ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
  console.log(`      snapped → ${result.lat.toFixed(6)}, ${result.lng.toFixed(6)}  (Δlat ${dLat}, Δlng ${dLng})`);
}

// ── Rebuild lib/beachAccessLocations.js with snapped values ──────────────────

function fmt(name, c) {
  const lat = c.lat.toFixed(4);
  const lng = c.lng.toFixed(4);
  // Pad so values align
  const q = `'${name}':`;
  return `    ${q.padEnd(42)}{ lat: ${lat}, lng: ${lng} }`;
}

const lines = [
  '/**',
  ' * lib/beachAccessLocations.js',
  ' * Hardcoded Gulf-side beach access coordinates.',
  ' *',
  ' * WHY: Nominatim geocodes street addresses to road centerlines, placing pins',
  ' * in the water rather than on the beach. These coordinates are snapped to the',
  ' * Gulf-side coastline defined in data/map.geojson via scripts/snap-local-coords.js.',
  ' *',
  ' * To update a coordinate: edit data/map.geojson and re-run',
  ' * scripts/snap-local-coords.js to regenerate this file.',
  ' *',
  ' * Works as a browser <script> tag (sets window.BEACH_ACCESS_COORDINATES)',
  ' * and as a Node.js require() (exports the object).',
  ' */',
  '',
  '(function (root, factory) {',
  "  if (typeof module !== 'undefined' && module.exports) {",
  '    module.exports = factory();',
  '  } else {',
  '    root.BEACH_ACCESS_COORDINATES = factory();',
  '  }',
  "}(typeof globalThis !== 'undefined' ? globalThis : this, function () {",
  "  'use strict';",
  '',
  '  return {',
  '',
  '    // ── WALTON COUNTY / 30A ─────────────────────────────────────────────────',
];

const walton30a = [
  'Inlet Beach','Walton Dunes','Santa Clara','Grayton Dunes',
  'Blue Mountain','Gulfview Heights','Ed Walline','Fort Panic','Dune Allen'
];
for (const name of walton30a) {
  if (snapped[name]) lines.push(fmt(name, snapped[name]) + ',');
}

lines.push('');
lines.push('    // ── BAY COUNTY (Spyglass / Gulf Dr / Surf Dr area) ──────────────────────');

const bayCounty = [
  'Sunnyside Beach & Tennis Resort',
  'Bay County Public Access 1','Bay County Public Access 2','Bay County Public Access 3',
  'Bay County Public Access 4','Bay County Public Access 5','Bay County Public Access 6',
  'Bay County Public Access 7','Bay County Public Access 8','Bay County Public Access 9',
  'Bay County Public Access 10','Bay County Public Access 11','Bay County Public Access 12',
  'Bay County Public Access 12A','Bay County Public Access 13','Bay County Public Access 14',
  'Bay County Public Access 15','Bay County Public Access 16','Bay County Public Access 17',
  'Bay County Public Access 18','Bay County Public Access 19','Bay County Public Access 20',
  'Bay County Public Access 21','Edward F. Hickey, Jr. Park','Bay County Public Access 23',
  'Bay County Public Access 77','Bay County Public Access 78','Bay County Public Access 79',
  'Bay County Public Access 80','Bay County Public Access 81','Bay County Public Access 82',
  'Bay County Public Access 83','Bay County Public Access 84','Bay County Public Access 85',
  'Bay County Public Access 86','Bay County Public Access 87','Bay County Public Access 88',
  'Bay County Public Access 89','Bay County Public Access 90','Bay County Public Access 91',
  'Bay County Public Access 92','Bay County Public Access 93','Bay County Public Access 94',
  'Bay County Public Access 95','Bay County Public Access 96','Natural Beach Access'
];
for (const name of bayCounty) {
  if (snapped[name]) lines.push(fmt(name, snapped[name]) + ',');
}

lines.push('');
lines.push('    // ── PCB CITY ─────────────────────────────────────────────────────────────');

const pcbCity = [
  'Señor Frogs',
  'Public Beach Access 24','Public Beach Access 25','Public Beach Access 26',
  'Public Beach Access 27','Public Beach Access 28','Public Beach Access 29',
  'Public Beach Access 30','Public Beach Access 31','Public Beach Access 32',
  'Public Beach Access 33','Public Beach Access 34','Public Beach Access 35A',
  'Public Beach Access 36','Public Beach Access 37','Public Beach Access 38',
  'Public Beach Access 39','Public Beach Access 40','Public Beach Access 41',
  'Public Beach Access 42','Public Beach Access 43','Public Beach Access 44',
  'Public Beach Access 45','Public Beach Access 46','Public Beach Access 47',
  'Public Beach Access 48','Public Beach Access 49','Public Beach Access 50',
  'Public Beach Access 51','Public Beach Access 52','Public Beach Access 53',
  'Public Beach Access 54','Public Beach Access 55','Public Beach Access 56',
  'Public Beach Access 57','Public Beach Access 58','Public Beach Access 59',
  'Public Beach Access 60','Public Beach Access 61','Public Beach Access 62',
  'Public Beach Access 63','Public Beach Access 64','Public Beach Access 65',
  'Public Beach Access 66','Public Beach Access 67','Public Beach Access 68',
  'Public Beach Access 69','Public Beach Access 70','Public Beach Access 71',
  'Public Beach Access 72','Public Beach Access 73','Public Beach Access 74',
  'Public Beach Access 76','Public Beach Access 76A','Public Beach Access 76B'
];

// Last PCB entry has no trailing comma
for (let i = 0; i < pcbCity.length; i++) {
  const name = pcbCity[i];
  if (!snapped[name]) continue;
  const isLast = (i === pcbCity.length - 1);
  lines.push(fmt(name, snapped[name]) + (isLast ? '' : ','));
}

lines.push('');
lines.push('  };');
lines.push('}));');
lines.push('');

const outPath = path.join(__dirname, '../lib/beachAccessLocations.js');
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log(`\nWrote updated coordinates to lib/beachAccessLocations.js`);
console.log('Done.');
