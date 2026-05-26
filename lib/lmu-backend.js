/**
 * lmu-backend.js
 * Client-side backend helpers for LMU Beach Bonfires.
 * Include via <script src="lib/lmu-backend.js"> before your page scripts.
 * Depends on: Supabase JS CDN (supabase-js v2)
 *
 * Sets up window.LMU with:
 *   LMU.supabase      — initialized Supabase client
 *   LMU.haversine()   — distance calculation
 *   LMU.geocode()     — Nominatim address → {lat, lon}
 *   LMU.db.*          — database query helpers
 */

(function () {
  'use strict';

  // ============================================================
  // CONFIG
  // TODO: Replace these with your actual Supabase URL and anon key.
  // Get them from: https://app.supabase.com → your project → Settings → API
  // The anon key is safe to use in client-side code (RLS controls access).
  // ============================================================
  var SUPABASE_URL      = 'YOUR_SUPABASE_URL';      // TODO: fill in
  var SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // TODO: fill in

  // Edge function URL for server-side operations (email + HubSpot)
  // Format: https://<project-ref>.supabase.co/functions/v1/booking-webhook
  var EDGE_FUNCTION_URL = SUPABASE_URL + '/functions/v1/booking-webhook'; // TODO: verify path

  // Nominatim (OpenStreetMap) geocoding endpoint — free, no API key required
  var NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
  var USER_AGENT    = 'LMU-Beach-Bonfires/1.0 (hello@lightmeupbonfires.com)';

  // BEACHFRONT_THRESHOLD: rentals within this many miles of the beach are
  // considered beachfront and get all PCB locations sorted by distance.
  // Rentals beyond this threshold get Bay County locations listed first.
  var BEACHFRONT_THRESHOLD = 0.095; // miles (≈ 500 feet) — adjust here if needed

  // ============================================================
  // SUPABASE CLIENT
  // ============================================================
  var _supabase = null;
  function getSupabase() {
    if (!_supabase) {
      if (!SUPABASE_URL || SUPABASE_URL === 'YOUR_SUPABASE_URL') return null;
      if (typeof supabase === 'undefined' || !supabase.createClient) {
        console.error('LMU: Supabase JS client not loaded. Add the CDN script before lmu-backend.js.');
        return null;
      }
      _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return _supabase;
  }

  // ============================================================
  // HAVERSINE DISTANCE
  // Returns distance in miles between two lat/lon points.
  // Uses the Haversine formula (great-circle distance).
  // NOTE: This gives straight-line distance, not driving distance.
  // If driving distance is needed in a future phase, swap this function
  // for a call to OSRM (free) or Google Maps Distance Matrix API.
  // ============================================================
  function haversine(lat1, lon1, lat2, lon2) {
    var R    = 3958.8; // Earth radius in miles
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a    = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
               Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // ============================================================
  // HARDCODED COORDINATE LOOKUP
  // Overrides stored Supabase lat/lng with values from the lookup table.
  // Called on every location record before distance calculations or map usage.
  // Source of truth: lib/beachAccessLocations.js
  // ============================================================
  function overrideCoords(loc) {
    var table = (typeof window !== 'undefined') ? window.BEACH_ACCESS_COORDINATES : null;
    if (!table || !loc) return loc;
    var c = table[loc.name];
    if (!c) return loc;
    return Object.assign({}, loc, { latitude: c.lat, longitude: c.lng });
  }

  // ============================================================
  // GEOCODING via Nominatim (OpenStreetMap)
  // Returns { lat, lon, display_name } or null if not found.
  // NOTE: Only used for geocoding the USER'S rental address.
  //       Beach access locations use the hardcoded lookup table above.
  // ============================================================
  async function geocodeAddress(address) {
    if (!address || address.trim().length < 5) return null;
    var encoded = encodeURIComponent(address.trim() + ', FL, USA');
    var url     = NOMINATIM_URL + '?format=json&q=' + encoded +
                  '&limit=1&countrycodes=us&viewbox=-86.6000,30.1400,-85.6500,30.3400';
    try {
      var res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT }
      });
      if (!res.ok) return null;
      var data = await res.json();
      if (!data || data.length === 0) return null;
      return {
        lat:          parseFloat(data[0].lat),
        lon:          parseFloat(data[0].lon),
        display_name: data[0].display_name
      };
    } catch (e) {
      console.warn('LMU: Geocoding failed for "' + address + '":', e.message);
      return null;
    }
  }

  // ============================================================
  // DB HELPERS
  // ============================================================

  /**
   * Load active beach access locations, sorted per mode:
   *
   * Address mode (rentalLat/rentalLon provided, areaZone null):
   *   - PCB: beachfront rentals → all PCB sorted by distance closest-first.
   *          inland rentals → Bay County first (by distance), then PCB City (by distance).
   *   - 30A: Walton County locations sorted by distance closest-first.
   *   // DISTANCE_METHOD: Haversine straight-line
   *
   * Area mode (areaZone is 'PCB' | '30A' | 'Walton'):
   *   - Returns matching locations sorted alphabetically by name (no distance).
   *
   * @param {number|null} rentalLat  - Geocoded rental latitude (null in area mode)
   * @param {number|null} rentalLon  - Geocoded rental longitude (null in area mode)
   * @param {string|null} areaZone   - 'PCB' | '30A' | 'Walton' (area-dropdown mode) | null (address mode)
   * @param {string[]}    services   - Services to filter by, e.g. ['bonfire']
   * @returns {Promise<Array>}       - Sorted, optionally distance-annotated location records
   */
  async function loadBeachAccessLocations(rentalLat, rentalLon, areaZone, services) {
    var sb = getSupabase();
    if (!sb) return [];

    var query = sb.from('beach_access_locations')
      .select('id,name,address,zone,county,latitude,longitude,services_offered,type,region')
      .eq('active', true);

    if (services && services.length > 0) {
      query = query.overlaps('services_offered', services);
    }

    var { data, error } = await query;
    if (error || !data) {
      console.warn('LMU: Failed to load beach access locations:', error);
      return [];
    }

    // Apply hardcoded coordinates before any distance calculation or return
    data = data.map(overrideCoords);

    // Flow 1 (address mode): exclude region records — region entries are for Flow 2 only.
    // Uses client-side filter so the query still works before migration 002 is run.
    if (!areaZone) {
      data = data.filter(function (loc) {
        return (loc.type || 'access_point') !== 'region';
      });
    }

    // Area mode: alphabetical, no distance calculation needed
    if (areaZone) {
      var zoneFilter = areaZone === 'PCB'    ? 'PCB'
                     : areaZone === '30A'    ? '30A'
                     : areaZone === 'Walton' ? '30A'  // Walton uses the 30A zone in DB
                     : null;
      var filtered = zoneFilter
        ? data.filter(function (l) { return l.zone === zoneFilter; })
        : data;
      return filtered.slice().sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }

    // Address mode: requires coordinates
    if (!rentalLat || !rentalLon) return data;

    var withCoords = data.filter(function (loc) {
      return loc.latitude && loc.longitude;
    });

    var detectedZone = detectZone(rentalLat, rentalLon);

    if (detectedZone === '30A') {
      return withCoords
        .filter(function (l) { return l.zone === '30A'; })
        .map(function (l) {
          return Object.assign({}, l, {
            distanceMiles: haversine(rentalLat, rentalLon, l.latitude, l.longitude)
          });
        })
        .sort(function (a, b) { return a.distanceMiles - b.distanceMiles; });
    }

    // PCB address mode: beachfront vs. inland
    var pcbLocations = withCoords.filter(function (l) { return l.zone === 'PCB'; });
    var distances    = pcbLocations.map(function (l) {
      return Object.assign({}, l, {
        distanceMiles: haversine(rentalLat, rentalLon, l.latitude, l.longitude)
      });
    });

    var minDist      = Math.min.apply(null, distances.map(function (l) { return l.distanceMiles; }));
    var isBeachfront = minDist <= BEACHFRONT_THRESHOLD;

    if (isBeachfront) {
      return distances.sort(function (a, b) { return a.distanceMiles - b.distanceMiles; });
    } else {
      var bayCounty = distances
        .filter(function (l) { return l.county === 'Bay'; })
        .sort(function (a, b) { return a.distanceMiles - b.distanceMiles; });
      var pcbCity = distances
        .filter(function (l) { return l.county === 'PCB'; })
        .sort(function (a, b) { return a.distanceMiles - b.distanceMiles; });
      return bayCounty.concat(pcbCity);
    }
  }

  /**
   * Detect zone from lat/lon.
   * 30A/Walton County is roughly west of -85.92 and north of 30.23.
   * This is a rough heuristic — the geocoded zone check is more reliable.
   */
  function detectZone(lat, lon) {
    if (!lat || !lon) return 'PCB';
    // Walton County is west of roughly -86.0 lon or the address itself says so
    if (lon < -85.95 || lat > 30.22) return '30A';
    return 'PCB';
  }

  // DATE_AVAILABILITY_PHASE_2: getBookedDates(beachAccessId) — query availability_blocks table here

  /**
   * Load region records for the "Choose My Beach Area" dropdown (Flow 2).
   * Returns type='region' records sorted alphabetically.
   * Requires migration 002 to have been run; returns [] otherwise.
   *
   * @param {string|null} zone - 'PCB' | '30A' | null (all zones)
   * @returns {Promise<Array>}
   */
  async function loadRegions(zone) {
    var sb = getSupabase();
    if (!sb) return [];

    var query = sb.from('beach_access_locations')
      .select('id,name,county,zone,latitude,longitude')
      .eq('active', true)
      .eq('type', 'region');

    if (zone) query = query.eq('zone', zone);

    var { data, error } = await query.order('name');
    if (error || !data) return [];
    return data.map(overrideCoords);
  }

  /**
   * Load access points for a selected region (Flow 2).
   * Tries to find type='access_point' records linked to regionName.
   * Falls back to the region record itself when no sub-access-points exist
   * (Option A: 30A named areas are both the region and the single bookable spot).
   *
   * @param {string} regionName - Exact region name as stored in the DB
   * @returns {Promise<Array>}
   */
  async function loadAccessPointsByRegion(regionName) {
    var sb = getSupabase();
    if (!sb) return [];

    var { data: points, error: err1 } = await sb
      .from('beach_access_locations')
      .select('id,name,address,zone,county,latitude,longitude,services_offered,type,region')
      .eq('active', true)
      .eq('type', 'access_point')
      .eq('region', regionName);

    if (!err1 && points && points.length > 0) {
      return points.map(overrideCoords);
    }

    // Option A: no sub-access-points — return the region record itself as the bookable spot
    var { data: region, error: err2 } = await sb
      .from('beach_access_locations')
      .select('id,name,address,zone,county,latitude,longitude,services_offered,type,region')
      .eq('active', true)
      .eq('type', 'region')
      .eq('name', regionName)
      .single();

    if (err2 || !region) return [];
    return [overrideCoords(region)];
  }

  /**
   * Check if a partner hotel address matches the rental address.
   * Compares geocoded coordinates within 100 meters (0.062 miles).
   * @returns {Promise<Object|null>} - Hotel record if matched, null otherwise
   */
  async function checkHotelMatch(rentalLat, rentalLon) {
    var sb = getSupabase();
    if (!sb) return null;

    // Load all active hotels with social fire offerings
    var { data, error } = await sb
      .from('partner_hotels')
      .select('id,name,slug,latitude,longitude,offers_social_fire')
      .eq('active', true)
      .eq('offers_social_fire', true);

    if (error || !data || data.length === 0) return null;

    var MATCH_THRESHOLD = 0.062; // miles ≈ 100 meters
    for (var i = 0; i < data.length; i++) {
      var hotel = data[i];
      if (!hotel.latitude || !hotel.longitude) continue;
      var dist = haversine(rentalLat, rentalLon, hotel.latitude, hotel.longitude);
      if (dist <= MATCH_THRESHOLD) {
        return hotel;
      }
    }
    return null;
  }

  /**
   * Submit a universal booking (bonfire / picnic / combo) to Supabase.
   * Returns { data, error }.
   */
  async function submitBooking(bookingData) {
    var sb = getSupabase();
    if (!sb) return { data: null, error: new Error('Supabase not initialized') };

    var { data, error } = await sb
      .from('bookings')
      .insert([bookingData])
      .select('id')
      .single();

    return { data, error };
  }

  /**
   * Submit a social fire booking to Supabase.
   * Returns { data, error }.
   */
  async function submitSocialFireBooking(bookingData) {
    var sb = getSupabase();
    if (!sb) return { data: null, error: new Error('Supabase not initialized') };

    var { data, error } = await sb
      .from('social_fire_bookings')
      .insert([bookingData])
      .select('id')
      .single();

    return { data, error };
  }

  /**
   * Trigger the server-side edge function for email + HubSpot.
   * Call this AFTER a successful Supabase insert.
   * The edge function handles: confirmation email, internal notification, HubSpot sync.
   * Errors are non-fatal — the booking is already saved.
   */
  async function triggerWebhook(bookingId, bookingType) {
    try {
      var sb = getSupabase();
      if (!sb) return;

      var res = await fetch(EDGE_FUNCTION_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ booking_id: bookingId, booking_type: bookingType })
      });

      if (!res.ok) {
        console.warn('LMU: Webhook returned', res.status, '— email/HubSpot may not have fired.');
      }
    } catch (e) {
      // Non-fatal — booking is saved, webhook failure doesn't block the user
      console.warn('LMU: Webhook call failed:', e.message);
    }
  }

  /**
   * Load active social fire locations from Supabase.
   */
  async function getSocialFireLocations() {
    var sb = getSupabase();
    if (!sb) return [];
    var { data, error } = await sb
      .from('social_fire_locations')
      .select('*')
      .eq('active', true)
      .order('day_of_week');
    return error ? [] : (data || []);
  }

  /**
   * Load a partner hotel by slug.
   */
  async function getHotelBySlug(slug) {
    var sb = getSupabase();
    if (!sb) return null;
    var { data, error } = await sb
      .from('partner_hotels')
      .select('*')
      .eq('slug', slug)
      .single();
    return error ? null : data;
  }

  /**
   * Load all active hotels that offer social fires (for the hotels grid).
   */
  async function getSocialFireHotels() {
    var sb = getSupabase();
    if (!sb) return [];
    var { data, error } = await sb
      .from('partner_hotels')
      .select('*')
      .eq('active', true)
      .eq('offers_social_fire', true)
      .order('name');
    return error ? [] : (data || []);
  }

  // ============================================================
  // EXPORT to window.LMU
  // ============================================================
  window.LMU = {
    supabase:               getSupabase,
    haversine:              haversine,
    geocode:                geocodeAddress,
    BEACHFRONT_THRESHOLD:   BEACHFRONT_THRESHOLD,
    EDGE_FUNCTION_URL:      EDGE_FUNCTION_URL,
    db: {
      loadBeachAccessLocations:  loadBeachAccessLocations,
      loadRegions:               loadRegions,
      loadAccessPointsByRegion:  loadAccessPointsByRegion,
      // DATE_AVAILABILITY_PHASE_2: getBookedDates goes here
      checkHotelMatch:           checkHotelMatch,
      submitBooking:            submitBooking,
      submitSocialFireBooking:  submitSocialFireBooking,
      triggerWebhook:           triggerWebhook,
      getSocialFireLocations:   getSocialFireLocations,
      getHotelBySlug:           getHotelBySlug,
      getSocialFireHotels:      getSocialFireHotels
    }
  };

})();
