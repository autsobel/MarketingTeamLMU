/**
 * lib/beachAccessLocations.js
 * Hardcoded Gulf-side beach access coordinates.
 *
 * WHY: Nominatim geocodes street addresses to road centerlines, placing pins
 * in the water rather than on the beach. These coordinates are manually set
 * to the Gulf-side access point for each location.
 *
 * To update a coordinate: right-click the correct beach access point in
 * Google Maps → copy lat/lng → update the value here AND re-run
 * scripts/update-coordinates.js to sync Supabase.
 *
 * Works as a browser <script> tag (sets window.BEACH_ACCESS_COORDINATES)
 * and as a Node.js require() (exports the object).
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.BEACH_ACCESS_COORDINATES = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  return {

    // ── WALTON COUNTY / 30A ─────────────────────────────────────────────────
    'Inlet Beach':        { lat: 30.2741, lng: -86.0102 },
    'Walton Dunes':       { lat: 30.2756, lng: -86.1354 },
    'Santa Clara':        { lat: 30.2919, lng: -86.1750 },
    'Grayton Dunes':      { lat: 30.2963, lng: -86.1522 },
    'Blue Mountain':      { lat: 30.2981, lng: -86.1671 },
    'Gulfview Heights':   { lat: 30.2999, lng: -86.1812 },
    'Ed Walline':         { lat: 30.3012, lng: -86.2198 },
    'Fort Panic':         { lat: 30.3028, lng: -86.2512 },
    'Dune Allen':         { lat: 30.3041, lng: -86.2701 },

    // ── BAY COUNTY (Spyglass / Gulf Dr / Surf Dr area) ──────────────────────
    'Sunnyside Beach & Tennis Resort': { lat: 30.1655, lng: -85.8871 },
    'Bay County Public Access 1':      { lat: 30.1648, lng: -85.9512 },
    'Bay County Public Access 2':      { lat: 30.1646, lng: -85.9489 },
    'Bay County Public Access 3':      { lat: 30.1644, lng: -85.9468 },
    'Bay County Public Access 4':      { lat: 30.1641, lng: -85.9447 },
    'Bay County Public Access 5':      { lat: 30.1639, lng: -85.9428 },
    'Bay County Public Access 6':      { lat: 30.1637, lng: -85.9412 },
    'Bay County Public Access 7':      { lat: 30.1635, lng: -85.9408 },
    'Bay County Public Access 8':      { lat: 30.1632, lng: -85.9392 },
    'Bay County Public Access 9':      { lat: 30.1630, lng: -85.9371 },
    'Bay County Public Access 10':     { lat: 30.1628, lng: -85.9358 },
    'Bay County Public Access 11':     { lat: 30.1627, lng: -85.9354 },
    'Bay County Public Access 12':     { lat: 30.1622, lng: -85.9298 },
    'Bay County Public Access 12A':    { lat: 30.1618, lng: -85.9241 },
    'Bay County Public Access 13':     { lat: 30.1616, lng: -85.9228 },
    'Bay County Public Access 14':     { lat: 30.1614, lng: -85.9215 },
    'Bay County Public Access 15':     { lat: 30.1614, lng: -85.9215 },
    'Bay County Public Access 16':     { lat: 30.1608, lng: -85.9119 },
    'Bay County Public Access 17':     { lat: 30.1604, lng: -85.9092 },
    'Bay County Public Access 18':     { lat: 30.1600, lng: -85.9062 },
    'Bay County Public Access 19':     { lat: 30.1600, lng: -85.9060 },
    'Bay County Public Access 20':     { lat: 30.1597, lng: -85.9038 },
    'Bay County Public Access 21':     { lat: 30.1595, lng: -85.9026 },
    'Edward F. Hickey, Jr. Park':      { lat: 30.1594, lng: -85.9022 },
    'Bay County Public Access 23':     { lat: 30.1591, lng: -85.9008 },
    'Bay County Public Access 77':     { lat: 30.1668, lng: -85.8928 },
    'Bay County Public Access 78':     { lat: 30.1667, lng: -85.8922 },
    'Bay County Public Access 79':     { lat: 30.1665, lng: -85.8912 },
    'Bay County Public Access 80':     { lat: 30.1662, lng: -85.8892 },
    'Bay County Public Access 81':     { lat: 30.1660, lng: -85.8881 },
    'Bay County Public Access 82':     { lat: 30.1658, lng: -85.8871 },
    'Bay County Public Access 83':     { lat: 30.1657, lng: -85.8862 },
    'Bay County Public Access 84':     { lat: 30.1656, lng: -85.8857 },
    'Bay County Public Access 85':     { lat: 30.1655, lng: -85.8851 },
    'Bay County Public Access 86':     { lat: 30.1648, lng: -85.8761 },
    'Bay County Public Access 87':     { lat: 30.1644, lng: -85.8741 },
    'Bay County Public Access 88':     { lat: 30.1641, lng: -85.8728 },
    'Bay County Public Access 89':     { lat: 30.1640, lng: -85.8721 },
    'Bay County Public Access 90':     { lat: 30.1640, lng: -85.8719 },
    'Bay County Public Access 91':     { lat: 30.1639, lng: -85.8718 },
    'Bay County Public Access 92':     { lat: 30.1638, lng: -85.8711 },
    'Bay County Public Access 93':     { lat: 30.1634, lng: -85.8688 },
    'Bay County Public Access 94':     { lat: 30.1632, lng: -85.8678 },
    'Bay County Public Access 95':     { lat: 30.1628, lng: -85.8651 },
    'Bay County Public Access 96':     { lat: 30.1624, lng: -85.8628 },
    'Natural Beach Access':            { lat: 30.1637, lng: -85.8701 },

    // ── PCB CITY ─────────────────────────────────────────────────────────────
    'Señor Frogs':               { lat: 30.1671, lng: -85.8011 },
    'Public Beach Access 24':    { lat: 30.1589, lng: -85.8998 },
    'Public Beach Access 25':    { lat: 30.1584, lng: -85.8881 },
    'Public Beach Access 26':    { lat: 30.1584, lng: -85.8878 },
    'Public Beach Access 27':    { lat: 30.1583, lng: -85.8876 },
    'Public Beach Access 28':    { lat: 30.1582, lng: -85.8868 },
    'Public Beach Access 29':    { lat: 30.1582, lng: -85.8866 },
    'Public Beach Access 30':    { lat: 30.1581, lng: -85.8862 },
    'Public Beach Access 31':    { lat: 30.1580, lng: -85.8858 },
    'Public Beach Access 32':    { lat: 30.1579, lng: -85.8851 },
    'Public Beach Access 33':    { lat: 30.1579, lng: -85.8849 },
    'Public Beach Access 34':    { lat: 30.1578, lng: -85.8847 },
    'Public Beach Access 35A':   { lat: 30.1621, lng: -85.8481 },
    'Public Beach Access 36':    { lat: 30.1622, lng: -85.8468 },
    'Public Beach Access 37':    { lat: 30.1623, lng: -85.8458 },
    'Public Beach Access 38':    { lat: 30.1625, lng: -85.8441 },
    'Public Beach Access 39':    { lat: 30.1624, lng: -85.8452 },
    'Public Beach Access 40':    { lat: 30.1631, lng: -85.8381 },
    'Public Beach Access 41':    { lat: 30.1631, lng: -85.8381 },
    'Public Beach Access 42':    { lat: 30.1638, lng: -85.8298 },
    'Public Beach Access 43':    { lat: 30.1648, lng: -85.8181 },
    'Public Beach Access 44':    { lat: 30.1652, lng: -85.8148 },
    'Public Beach Access 45':    { lat: 30.1652, lng: -85.8147 },
    'Public Beach Access 46':    { lat: 30.1653, lng: -85.8146 },
    'Public Beach Access 47':    { lat: 30.1655, lng: -85.8128 },
    'Public Beach Access 48':    { lat: 30.1655, lng: -85.8129 },
    'Public Beach Access 49':    { lat: 30.1657, lng: -85.8111 },
    'Public Beach Access 50':    { lat: 30.1657, lng: -85.8110 },
    'Public Beach Access 51':    { lat: 30.1665, lng: -85.8041 },
    'Public Beach Access 52':    { lat: 30.1672, lng: -85.7981 },
    'Public Beach Access 53':    { lat: 30.1679, lng: -85.7921 },
    'Public Beach Access 54':    { lat: 30.1679, lng: -85.7921 },
    'Public Beach Access 55':    { lat: 30.1679, lng: -85.7921 },
    'Public Beach Access 56':    { lat: 30.1679, lng: -85.7921 },
    'Public Beach Access 57':    { lat: 30.1679, lng: -85.7921 },
    'Public Beach Access 58':    { lat: 30.1681, lng: -85.7901 },
    'Public Beach Access 59':    { lat: 30.1682, lng: -85.7898 },
    'Public Beach Access 60':    { lat: 30.1682, lng: -85.7897 },
    'Public Beach Access 61':    { lat: 30.1683, lng: -85.7888 },
    'Public Beach Access 62':    { lat: 30.1684, lng: -85.7887 },
    'Public Beach Access 63':    { lat: 30.1687, lng: -85.7868 },
    'Public Beach Access 64':    { lat: 30.1691, lng: -85.7841 },
    'Public Beach Access 65':    { lat: 30.1692, lng: -85.7831 },
    'Public Beach Access 66':    { lat: 30.1695, lng: -85.7811 },
    'Public Beach Access 67':    { lat: 30.1698, lng: -85.7793 },
    'Public Beach Access 68':    { lat: 30.1698, lng: -85.7791 },
    'Public Beach Access 69':    { lat: 30.1699, lng: -85.7787 },
    'Public Beach Access 70':    { lat: 30.1699, lng: -85.7785 },
    'Public Beach Access 71':    { lat: 30.1700, lng: -85.7781 },
    'Public Beach Access 72':    { lat: 30.1701, lng: -85.7778 },
    'Public Beach Access 73':    { lat: 30.1702, lng: -85.7771 },
    'Public Beach Access 74':    { lat: 30.1701, lng: -85.7774 },
    'Public Beach Access 76':    { lat: 30.1703, lng: -85.7768 },
    'Public Beach Access 76A':   { lat: 30.1704, lng: -85.7766 },
    'Public Beach Access 76B':   { lat: 30.1705, lng: -85.7762 }

  };
}));
