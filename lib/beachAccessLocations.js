/**
 * lib/beachAccessLocations.js
 * Verified Gulf-side beach access coordinates for PCB and 30A.
 *
 * WHY: Nominatim geocodes street addresses to road centerlines, placing pins
 * in the water rather than on the beach. These coordinates place each pin at
 * the actual Gulf-side access point.
 *
 * SOURCE: Bay County GIS Facilities/MapServer layer 1 (WGS84 / outSR=4326),
 * queried 2026-05-18. Accesses are numbered east→west along Front Beach Rd
 * (access 1 is easternmost at Spyglass Dr; access 96 is westernmost near
 * the Walton County line). Special locations geocoded via Nominatim.
 *
 * To update a coordinate: right-click the correct beach access point in
 * Google Maps → copy lat/lng → update the value here AND in the matching
 * FALLBACK_LOCATIONS entry in components/booking-wizard.js.
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

    // ── SPECIAL LOCATIONS ────────────────────────────────────────────────────
    // Geocoded via Nominatim from street address.
    'Sunnyside Beach & Tennis Resort': { lat: 30.257960, lng: -85.963566 },
    'Edward F. Hickey, Jr. Park':      { lat: 30.166378, lng: -85.789222 },
    'Señor Frogs':                     { lat: 30.207574, lng: -85.861592 },
    'Natural Beach Access':            { lat: 30.256165149689807, lng: -85.96273172889843 },  // MANUALLY_VERIFIED

    // ── BAY COUNTY — ACCESSES 1–23 (Spyglass Dr / Surf Dr, eastern PCB) ────
    'Bay County Public Access 1':   { lat: 30.137340, lng: -85.750140 },
    'Bay County Public Access 2':   { lat: 30.138423, lng: -85.751426 },
    'Bay County Public Access 3':   { lat: 30.139314, lng: -85.752598 },
    'Bay County Public Access 4':   { lat: 30.141328, lng: -85.754492 },
    'Bay County Public Access 5':   { lat: 30.141698, lng: -85.754970 },
    'Bay County Public Access 6':   { lat: 30.142362, lng: -85.755810 },
    'Bay County Public Access 7':   { lat: 30.142854, lng: -85.756608 },
    'Bay County Public Access 8':   { lat: 30.143516, lng: -85.757239 },
    'Bay County Public Access 9':   { lat: 30.144181, lng: -85.758071 },
    'Bay County Public Access 10':  { lat: 30.144767, lng: -85.758799 },
    'Bay County Public Access 11':  { lat: 30.145494, lng: -85.759631 },
    'Bay County Public Access 12':  { lat: 30.148753, lng: -85.764271 },
    'Bay County Public Access 12A': { lat: 30.153341, lng: -85.770361 },
    'Bay County Public Access 13':  { lat: 30.154063, lng: -85.771346 },
    'Bay County Public Access 14':  { lat: 30.154889, lng: -85.772456 },
    'Bay County Public Access 15':  { lat: 30.155040, lng: -85.772538 },
    'Bay County Public Access 16':  { lat: 30.159989, lng: -85.779834 },
    'Bay County Public Access 17':  { lat: 30.161075, lng: -85.781511 },
    'Bay County Public Access 18':  { lat: 30.162911, lng: -85.784184 },
    'Bay County Public Access 19':  { lat: 30.163377, lng: -85.784892 },
    'Bay County Public Access 20':  { lat: 30.164325, lng: -85.786318 },
    'Bay County Public Access 21':  { lat: 30.164771, lng: -85.786987 },
    'Bay County Public Access 23':  { lat: 30.166356, lng: -85.789542 },

    // ── PCB CITY — ACCESSES 24–76B (Front Beach Rd / Surf Dr) ───────────────
    'Public Beach Access 24':  { lat: 30.166715, lng: -85.789969 },
    'Public Beach Access 25':  { lat: 30.173046, lng: -85.800720 },
    'Public Beach Access 26':  { lat: 30.173197, lng: -85.800964 },
    'Public Beach Access 27':  { lat: 30.173343, lng: -85.801237 },
    'Public Beach Access 28':  { lat: 30.173486, lng: -85.801505 },
    'Public Beach Access 29':  { lat: 30.173625, lng: -85.801762 },
    'Public Beach Access 30':  { lat: 30.173782, lng: -85.802016 },
    'Public Beach Access 31':  { lat: 30.173945, lng: -85.802305 },
    'Public Beach Access 32':  { lat: 30.174029, lng: -85.802451 },
    'Public Beach Access 33':  { lat: 30.174241, lng: -85.802827 },
    'Public Beach Access 34':  { lat: 30.174377, lng: -85.803078 },
    'Public Beach Access 35A': { lat: 30.179028, lng: -85.810833 },
    'Public Beach Access 36':  { lat: 30.179340, lng: -85.811448 },
    'Public Beach Access 37':  { lat: 30.179944, lng: -85.812570 },
    'Public Beach Access 38':  { lat: 30.180513, lng: -85.813735 },
    'Public Beach Access 39':  { lat: 30.181257, lng: -85.814736 },
    'Public Beach Access 40':  { lat: 30.183167, lng: -85.818086 },
    'Public Beach Access 41':  { lat: 30.183981, lng: -85.819423 },
    'Public Beach Access 42':  { lat: 30.186913, lng: -85.824525 },
    'Public Beach Access 43':  { lat: 30.193830, lng: -85.836653 },
    'Public Beach Access 44':  { lat: 30.195404, lng: -85.839677 },
    'Public Beach Access 45':  { lat: 30.195510, lng: -85.839881 },
    'Public Beach Access 46':  { lat: 30.196151, lng: -85.841056 },
    'Public Beach Access 47':  { lat: 30.196790, lng: -85.842220 },
    'Public Beach Access 48':  { lat: 30.197445, lng: -85.843421 },
    'Public Beach Access 49':  { lat: 30.198087, lng: -85.844591 },
    'Public Beach Access 50':  { lat: 30.198556, lng: -85.845451 },
    'Public Beach Access 51':  { lat: 30.205119, lng: -85.857206 },
    'Public Beach Access 52':  { lat: 30.209735, lng: -85.866350 },
    'Public Beach Access 53':  { lat: 30.214725, lng: -85.875235 },
    'Public Beach Access 54':  { lat: 30.215248, lng: -85.876213 },
    'Public Beach Access 55':  { lat: 30.215420, lng: -85.876912 },
    'Public Beach Access 56':  { lat: 30.215712, lng: -85.877479 },
    'Public Beach Access 57':  { lat: 30.216102, lng: -85.877821 },
    'Public Beach Access 58':  { lat: 30.216540, lng: -85.878645 },
    'Public Beach Access 59':  { lat: 30.216909, lng: -85.879240 },
    'Public Beach Access 60':  { lat: 30.217176, lng: -85.879813 },
    'Public Beach Access 61':  { lat: 30.217787, lng: -85.880900 },
    'Public Beach Access 62':  { lat: 30.218093, lng: -85.881454 },
    'Public Beach Access 63':  { lat: 30.219332, lng: -85.883872 },
    'Public Beach Access 64':  { lat: 30.221616, lng: -85.888201 },
    'Public Beach Access 65':  { lat: 30.222297, lng: -85.889519 },
    'Public Beach Access 66':  { lat: 30.225671, lng: -85.896671 },
    'Public Beach Access 67':  { lat: 30.228439, lng: -85.902031 },
    'Public Beach Access 68':  { lat: 30.228773, lng: -85.902916 },
    'Public Beach Access 69':  { lat: 30.229337, lng: -85.903924 },
    'Public Beach Access 70':  { lat: 30.230255, lng: -85.905597 },
    'Public Beach Access 71':  { lat: 30.230664, lng: -85.906547 },
    'Public Beach Access 72':  { lat: 30.231621, lng: -85.908485 },
    'Public Beach Access 73':  { lat: 30.232276, lng: -85.909801 },
    'Public Beach Access 74':  { lat: 30.232919, lng: -85.911119 },
    'Public Beach Access 76':  { lat: 30.233636, lng: -85.912543 },
    'Public Beach Access 76A': { lat: 30.234074, lng: -85.913407 },
    'Public Beach Access 76B': { lat: 30.235527, lng: -85.916415 },

    // ── BAY COUNTY — ACCESSES 77–96 (western PCB / Sunnyside area) ──────────
    'Bay County Public Access 77':  { lat: 30.243156, lng: -85.932669 },
    'Bay County Public Access 78':  { lat: 30.243845, lng: -85.934045 },
    'Bay County Public Access 79':  { lat: 30.244252, lng: -85.935069 },
    'Bay County Public Access 80':  { lat: 30.244676, lng: -85.936020 },
    'Bay County Public Access 81':  { lat: 30.245106, lng: -85.937013 },
    'Bay County Public Access 82':  { lat: 30.245570, lng: -85.938031 },
    'Bay County Public Access 83':  { lat: 30.245797, lng: -85.938530 },
    'Bay County Public Access 84':  { lat: 30.246635, lng: -85.940406 },
    'Bay County Public Access 85':  { lat: 30.247109, lng: -85.941393 },
    'Bay County Public Access 86':  { lat: 30.252750, lng: -85.953970 },
    'Bay County Public Access 87':  { lat: 30.253897, lng: -85.956574 },
    'Bay County Public Access 88':  { lat: 30.255111, lng: -85.959220 },
    'Bay County Public Access 89':  { lat: 30.255297, lng: -85.959684 },
    'Bay County Public Access 90':  { lat: 30.255526, lng: -85.960293 },
    'Bay County Public Access 91':  { lat: 30.255784, lng: -85.960885 },
    'Bay County Public Access 92':  { lat: 30.255973, lng: -85.961522 },
    'Bay County Public Access 93':  { lat: 30.257608, lng: -85.965645 },
    'Bay County Public Access 94':  { lat: 30.258230, lng: -85.967353 },
    'Bay County Public Access 95':  { lat: 30.259550, lng: -85.970712 },
    'Bay County Public Access 96':  { lat: 30.261899, lng: -85.974887 },

    // ── WALTON COUNTY / 30A ─────────────────────────────────────────────────
    // MANUALLY_VERIFIED — confirmed via Google Maps right-click
    'Inlet Beach':      { lat: 30.27409775384565,  lng: -86.00391597125422 },
    'Walton Dunes':     { lat: 30.303752520564466, lng: -86.08680838659403 },
    'Santa Clara':      { lat: 30.3142561378197,   lng: -86.11911140009583 },
    'Grayton Dunes':    { lat: 30.32889864199775,  lng: -86.16470087733391 },
    'Blue Mountain':    { lat: 30.33757180491334,  lng: -86.19863182469412 },
    'Gulfview Heights': { lat: 30.344032563326802, lng: -86.22110375774244 },
    'Ed Walline':       { lat: 30.34651684140995,  lng: -86.23009937127232 },
    'Fort Panic':       { lat: 30.35223853275155,  lng: -86.25127755779789 },
    'Dune Allen':       { lat: 30.352960676712467, lng: -86.25144921916687 }

  };
}));
