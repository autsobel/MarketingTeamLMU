/**
 * lib/snapToCoast.js
 * Snaps a lat/lng to the nearest point on the Gulf coastline.
 *
 * Handles FeatureCollections with multiple LineString features — each feature's
 * segments are evaluated independently so there are no artificial cross-feature
 * segments skipping across the map.
 *
 * Usage (Node.js):
 *   const { snapToCoastline } = require('./snapToCoast.js');
 *   const snapped = snapToCoastline(roughLng, roughLat);
 *   // returns { lat, lng } on the coastline
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('./coastline.js'));
  } else {
    root.SNAP_TO_COAST = factory(root.COASTLINE || { COASTLINE_GEOJSON: null });
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function (coastline) {
  'use strict';

  // Build a flat list of segments [{x1,y1,x2,y2}] from all LineString features.
  // Segments stay within their feature — never bridge across features.
  function buildSegments(geojson) {
    var segs = [];
    if (!geojson || !geojson.features) return segs;
    geojson.features.forEach(function (feature) {
      if (!feature.geometry || feature.geometry.type !== 'LineString') return;
      var coords = feature.geometry.coordinates;
      for (var i = 0; i < coords.length - 1; i++) {
        segs.push({
          x1: coords[i][0],     // lng
          y1: coords[i][1],     // lat
          x2: coords[i + 1][0],
          y2: coords[i + 1][1]
        });
      }
    });
    return segs;
  }

  var SEGMENTS = buildSegments(coastline ? coastline.COASTLINE_GEOJSON : null);

  /**
   * Find the nearest point on the coastline to (lng, lat).
   * GeoJSON coordinates are [lng, lat]; Leaflet/Haversine use (lat, lng).
   *
   * @param {number} lng - Longitude of the rough coordinate
   * @param {number} lat - Latitude of the rough coordinate
   * @returns {{ lat: number, lng: number }} - Snapped point on the coastline
   */
  function snapToCoastline(lng, lat) {
    if (SEGMENTS.length === 0) {
      // No coastline data — return input unchanged
      return { lat: lat, lng: lng };
    }

    var nearestPoint = null;
    var minDist = Infinity;

    for (var i = 0; i < SEGMENTS.length; i++) {
      var seg     = SEGMENTS[i];
      var snapped = nearestPointOnSegment(lng, lat, seg.x1, seg.y1, seg.x2, seg.y2);
      var dist    = haversineDistance(lat, lng, snapped.lat, snapped.lng);

      if (dist < minDist) {
        minDist      = dist;
        nearestPoint = snapped;
      }
    }

    return nearestPoint;
  }

  /**
   * Nearest point on segment [x1,y1]–[x2,y2] to point (px,py).
   * Coordinates treated as flat (lng/lat degrees); accurate enough for
   * the sub-mile distances involved in pin snapping.
   */
  function nearestPointOnSegment(px, py, x1, y1, x2, y2) {
    var dx    = x2 - x1;
    var dy    = y2 - y1;
    var lenSq = dx * dx + dy * dy;

    if (lenSq === 0) return { lat: y1, lng: x1 };

    var t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));

    return {
      lat: y1 + t * dy,
      lng: x1 + t * dx
    };
  }

  /**
   * Haversine distance in miles between two (lat, lng) points.
   * DISTANCE_METHOD: straight-line great-circle.
   */
  function haversineDistance(lat1, lng1, lat2, lng2) {
    var R    = 3958.8;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a    = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
               Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  return { snapToCoastline: snapToCoastline };
}));
