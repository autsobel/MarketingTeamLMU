/**
 * lib/coastline.js
 * Gulf-side coastline reference used to snap beach access pins.
 *
 * Source of truth: data/map.geojson
 * To update the coastline: redraw on geojson.io, export as GeoJSON,
 * replace data/map.geojson, then re-run scripts/snap-coordinates.js.
 *
 * Works as a Node.js require() (for snap script) and as a browser
 * <script> tag stub (snap only runs server-side).
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    var fs   = require('fs');
    var path = require('path');
    var raw  = fs.readFileSync(path.join(__dirname, '../data/map.geojson'), 'utf8');
    module.exports = factory(JSON.parse(raw));
  } else {
    // Browser: snap runs server-side only; expose null stub so snap utils
    // load without errors if ever included on a page.
    root.COASTLINE = factory(null);
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function (geojson) {
  'use strict';
  return { COASTLINE_GEOJSON: geojson || null };
}));
