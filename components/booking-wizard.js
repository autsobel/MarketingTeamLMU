/**
 * booking-wizard.js
 * Universal Location Step for all LMU booking forms.
 *
 * Exports window.BookingWizard.LocationStep
 *
 * Usage (in each booking page's <script> block, after Leaflet + lmu-backend.js):
 *
 *   var locationStep = new BookingWizard.LocationStep({
 *     nextBtnId : 'step2-next-btn',   // id of the Continue button on this page
 *     services  : ['bonfire']          // services to filter locations by
 *   });
 *
 * Reads public state in page-level code (nextStep, submitForm) via:
 *   locationStep.locationMode     → 'address' | 'area'
 *   locationStep.geo              → { lat, lon, display_name } | null
 *   locationStep.areaZone         → 'PCB' | '30A' | null
 *   locationStep.selectedAreaName → string | null
 *   locationStep.preferences      → [{ id, name, zone }|null, …] (length 3)
 */

(function (window) {
  'use strict';

  /* ============================================================
     FALLBACK LOCATION DATA
     Used when Supabase is not yet configured or returns no rows.
     Sourced from supabase/seed_beach_access.sql
     ============================================================ */
  var FALLBACK_LOCATIONS = [
    // ── Bay County (zone=PCB, county=Bay) ──────────────────────
    { id: 'bay_sunnyside', name: 'Sunnyside Beach & Tennis Resort',
      zone: 'PCB', county: 'Bay', latitude: 30.1655, longitude: -85.8871,
      services_offered: ['bonfire','picnic','chair_rental','social_fire'] },
    { id: 'bay_1',  name: 'Bay County Public Access 1',
      zone: 'PCB', county: 'Bay', latitude: 30.1648, longitude: -85.9512,
      services_offered: ['bonfire','picnic'] },
    { id: 'bay_4',  name: 'Bay County Public Access 4',
      zone: 'PCB', county: 'Bay', latitude: 30.1641, longitude: -85.9447,
      services_offered: ['bonfire','picnic'] },
    { id: 'bay_8',  name: 'Bay County Public Access 8',
      zone: 'PCB', county: 'Bay', latitude: 30.1632, longitude: -85.9392,
      services_offered: ['bonfire','picnic'] },
    { id: 'bay_12', name: 'Bay County Public Access 12',
      zone: 'PCB', county: 'Bay', latitude: 30.1622, longitude: -85.9298,
      services_offered: ['bonfire','picnic'] },
    { id: 'bay_16', name: 'Bay County Public Access 16',
      zone: 'PCB', county: 'Bay', latitude: 30.1608, longitude: -85.9119,
      services_offered: ['bonfire','picnic'] },
    { id: 'bay_18', name: 'Bay County Public Access 18',
      zone: 'PCB', county: 'Bay', latitude: 30.1600, longitude: -85.9062,
      services_offered: ['bonfire','picnic'] },
    { id: 'bay_20', name: 'Bay County Public Access 20',
      zone: 'PCB', county: 'Bay', latitude: 30.1597, longitude: -85.9038,
      services_offered: ['bonfire','picnic'] },
    { id: 'bay_hickey', name: 'Edward F. Hickey, Jr. Park',
      zone: 'PCB', county: 'Bay', latitude: 30.1594, longitude: -85.9022,
      services_offered: ['bonfire','picnic'] },
    { id: 'bay_77', name: 'Bay County Public Access 77',
      zone: 'PCB', county: 'Bay', latitude: 30.1668, longitude: -85.8928,
      services_offered: ['bonfire','picnic'] },
    { id: 'bay_80', name: 'Bay County Public Access 80',
      zone: 'PCB', county: 'Bay', latitude: 30.1662, longitude: -85.8892,
      services_offered: ['bonfire','picnic'] },
    { id: 'bay_85', name: 'Bay County Public Access 85',
      zone: 'PCB', county: 'Bay', latitude: 30.1655, longitude: -85.8851,
      services_offered: ['bonfire','picnic'] },
    { id: 'bay_90', name: 'Bay County Public Access 90',
      zone: 'PCB', county: 'Bay', latitude: 30.1640, longitude: -85.8719,
      services_offered: ['bonfire','picnic'] },
    { id: 'bay_93', name: 'Bay County Public Access 93',
      zone: 'PCB', county: 'Bay', latitude: 30.1634, longitude: -85.8688,
      services_offered: ['bonfire','picnic'] },
    { id: 'bay_natural', name: 'Natural Beach Access',
      zone: 'PCB', county: 'Bay', latitude: 30.1637, longitude: -85.8701,
      services_offered: ['bonfire','picnic'] },

    // ── PCB City (zone=PCB, county=PCB) ────────────────────────
    { id: 'pcb_frogs', name: 'Señor Frogs',
      zone: 'PCB', county: 'PCB', latitude: 30.1671, longitude: -85.8011,
      services_offered: ['bonfire','picnic','social_fire','chair_rental'] },
    { id: 'pcb_24', name: 'Public Beach Access 24',
      zone: 'PCB', county: 'PCB', latitude: 30.1589, longitude: -85.8998,
      services_offered: ['bonfire','picnic'] },
    { id: 'pcb_28', name: 'Public Beach Access 28',
      zone: 'PCB', county: 'PCB', latitude: 30.1582, longitude: -85.8868,
      services_offered: ['bonfire','picnic'] },
    { id: 'pcb_35a', name: 'Public Beach Access 35A',
      zone: 'PCB', county: 'PCB', latitude: 30.1621, longitude: -85.8481,
      services_offered: ['bonfire','picnic'] },
    { id: 'pcb_40', name: 'Public Beach Access 40',
      zone: 'PCB', county: 'PCB', latitude: 30.1631, longitude: -85.8381,
      services_offered: ['bonfire','picnic'] },
    { id: 'pcb_43', name: 'Public Beach Access 43',
      zone: 'PCB', county: 'PCB', latitude: 30.1648, longitude: -85.8181,
      services_offered: ['bonfire','picnic'] },
    { id: 'pcb_51', name: 'Public Beach Access 51',
      zone: 'PCB', county: 'PCB', latitude: 30.1665, longitude: -85.8041,
      services_offered: ['bonfire','picnic'] },
    { id: 'pcb_52', name: 'Public Beach Access 52',
      zone: 'PCB', county: 'PCB', latitude: 30.1672, longitude: -85.7981,
      services_offered: ['bonfire','picnic'] },
    { id: 'pcb_53', name: 'Public Beach Access 53',
      zone: 'PCB', county: 'PCB', latitude: 30.1679, longitude: -85.7921,
      services_offered: ['bonfire','picnic'] },
    { id: 'pcb_58', name: 'Public Beach Access 58',
      zone: 'PCB', county: 'PCB', latitude: 30.1681, longitude: -85.7901,
      services_offered: ['bonfire','picnic'] },
    { id: 'pcb_64', name: 'Public Beach Access 64',
      zone: 'PCB', county: 'PCB', latitude: 30.1691, longitude: -85.7841,
      services_offered: ['bonfire','picnic'] },
    { id: 'pcb_68', name: 'Public Beach Access 68',
      zone: 'PCB', county: 'PCB', latitude: 30.1698, longitude: -85.7791,
      services_offered: ['bonfire','picnic'] },
    { id: 'pcb_73', name: 'Public Beach Access 73',
      zone: 'PCB', county: 'PCB', latitude: 30.1702, longitude: -85.7771,
      services_offered: ['bonfire','picnic'] },

    // ── Walton County / 30A (zone=30A, county=Walton) ──────────
    { id: '30a_inlet',   name: 'Inlet Beach',
      zone: '30A', county: 'Walton', latitude: 30.2741, longitude: -86.0102,
      services_offered: ['bonfire','picnic','social_fire'] },
    { id: '30a_walton',  name: 'Walton Dunes',
      zone: '30A', county: 'Walton', latitude: 30.2756, longitude: -86.1354,
      services_offered: ['bonfire','picnic'] },
    { id: '30a_clara',   name: 'Santa Clara',
      zone: '30A', county: 'Walton', latitude: 30.2919, longitude: -86.1750,
      services_offered: ['bonfire','picnic'] },
    { id: '30a_grayton', name: 'Grayton Dunes',
      zone: '30A', county: 'Walton', latitude: 30.2963, longitude: -86.1522,
      services_offered: ['bonfire','picnic'] },
    { id: '30a_blue',    name: 'Blue Mountain',
      zone: '30A', county: 'Walton', latitude: 30.2981, longitude: -86.1671,
      services_offered: ['bonfire','picnic'] },
    { id: '30a_gulf',    name: 'Gulfview Heights',
      zone: '30A', county: 'Walton', latitude: 30.2999, longitude: -86.1812,
      services_offered: ['bonfire','picnic'] },
    { id: '30a_walline', name: 'Ed Walline',
      zone: '30A', county: 'Walton', latitude: 30.3012, longitude: -86.2198,
      services_offered: ['bonfire','picnic'] },
    { id: '30a_fort',    name: 'Fort Panic',
      zone: '30A', county: 'Walton', latitude: 30.3028, longitude: -86.2512,
      services_offered: ['bonfire','picnic'] },
    { id: '30a_dune',    name: 'Dune Allen',
      zone: '30A', county: 'Walton', latitude: 30.3041, longitude: -86.2701,
      services_offered: ['bonfire','picnic'] }
  ];

  /* ============================================================
     HARDCODED COORDINATE OVERRIDE
     Replaces stored lat/lng with the verified Gulf-side value from
     window.BEACH_ACCESS_COORDINATES (lib/beachAccessLocations.js).
     Applied before any distance calculation or map pin placement.
     ============================================================ */
  function overrideCoords(loc) {
    var table = (typeof window !== 'undefined') ? window.BEACH_ACCESS_COORDINATES : null;
    if (!table || !loc) return loc;
    var c = table[loc.name];
    if (!c) return loc;
    return Object.assign({}, loc, { latitude: c.lat, longitude: c.lng });
  }

  /* ============================================================
     PRIVATE HELPERS
     ============================================================ */
  var BEACHFRONT_THRESHOLD = 0.25; // miles

  function haversine(lat1, lon1, lat2, lon2) {
    var R    = 3958.8;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a    = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
               Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function detectZone(lat, lon) {
    if (!lat || !lon) return 'PCB';
    // Walton County / 30A is generally west of ~-85.95 lon
    if (lon < -85.95 || lat > 30.22) return '30A';
    return 'PCB';
  }

  function escAttr(str) {
    return (str || '')
      .replace(/&/g,  '&amp;')
      .replace(/'/g,  '&#39;')
      .replace(/"/g,  '&quot;')
      .replace(/</g,  '&lt;');
  }

  /* Load locations — tries Supabase first, falls back to FALLBACK_LOCATIONS */
  async function fetchLocations(rentalLat, rentalLon, areaZone, services) {
    var locations = [];

    // Try LMU / Supabase
    try {
      if (typeof LMU !== 'undefined' && LMU.db && LMU.db.loadBeachAccessLocations) {
        var result = await LMU.db.loadBeachAccessLocations(rentalLat, rentalLon, areaZone, services);
        // lmu-backend.js already applies overrideCoords before sorting, so results are correct
        if (result && result.length > 0) return result;
      }
    } catch (e) { /* fall through */ }

    // Fallback: built-in seed data — apply coordinate override before any distance sorting
    locations = FALLBACK_LOCATIONS.slice().map(overrideCoords);

    if (services && services.length > 0) {
      locations = locations.filter(function (l) {
        return services.some(function (s) {
          return l.services_offered && l.services_offered.indexOf(s) !== -1;
        });
      });
    }

    // Area mode → alphabetical
    if (areaZone) {
      var zoneKey = (areaZone === 'PCB') ? 'PCB' : '30A';
      return locations
        .filter(function (l) { return l.zone === zoneKey; })
        .sort(function (a, b) { return a.name.localeCompare(b.name); });
    }

    // Address mode → distance sorted
    if (rentalLat && rentalLon) {
      var zone = detectZone(rentalLat, rentalLon);

      if (zone === '30A') {
        return locations
          .filter(function (l) { return l.zone === '30A'; })
          .map(function (l) {
            return Object.assign({}, l, {
              distanceMiles: haversine(rentalLat, rentalLon, l.latitude, l.longitude)
            });
          })
          .sort(function (a, b) { return a.distanceMiles - b.distanceMiles; });
      }

      // PCB: beachfront vs. inland split
      var pcbLocs = locations
        .filter(function (l) { return l.zone === 'PCB'; })
        .map(function (l) {
          return Object.assign({}, l, {
            distanceMiles: haversine(rentalLat, rentalLon, l.latitude, l.longitude)
          });
        });

      if (pcbLocs.length === 0) return [];

      var minDist = Math.min.apply(null, pcbLocs.map(function (l) { return l.distanceMiles; }));

      if (minDist <= BEACHFRONT_THRESHOLD) {
        return pcbLocs.sort(function (a, b) { return a.distanceMiles - b.distanceMiles; });
      }

      var bayCounty = pcbLocs
        .filter(function (l) { return l.county === 'Bay'; })
        .sort(function (a, b) { return a.distanceMiles - b.distanceMiles; });
      var pcbCity = pcbLocs
        .filter(function (l) { return l.county === 'PCB'; })
        .sort(function (a, b) { return a.distanceMiles - b.distanceMiles; });
      return bayCounty.concat(pcbCity);
    }

    return locations;
  }

  /* ============================================================
     LocationStep constructor
     ============================================================ */
  function LocationStep(config) {
    config = config || {};
    this.nextBtnId = config.nextBtnId || 'step2-next-btn';
    this.services  = config.services  || ['bonfire'];

    // Public state — read directly by page-level nextStep / submitForm
    this.locationMode     = 'address';
    this.geo              = null;   // { lat, lon, display_name }
    this.areaZone         = null;   // 'PCB' | '30A'
    this.selectedAreaName = null;
    this.preferences      = [null, null, null]; // [{ id, name, zone }, …]

    // Private
    this._allAccessList = [];
    this._shownCount    = 10;
    this._addressTimer  = null;
    this._map           = null;
    this._mapMarkers    = {};

    // Bind global onclick handlers so HTML attributes keep working
    var self = this;
    window.switchLocationMode  = function (m)        { self.switchLocationMode(m); };
    window.onAreaSelectChange  = function (v)        { self.onAreaSelectChange(v); };
    window.handleAddressInput  = function (t)        { self.handleAddressInput(t); };
    window.addPreference       = function (id, n, z) { self.addPreference(id, n, z); };
    window.removePreference    = function (i)        { self.removePreference(i); };
    window.showMoreBeachAccess = function ()         { self.showMoreBeachAccess(); };
  }

  /* ── Mode switching ───────────────────────────────────────── */
  LocationStep.prototype.switchLocationMode = function (mode) {
    var self = this;
    self.locationMode     = mode;
    self.geo              = null;
    self.areaZone         = null;
    self.selectedAreaName = null;
    self._allAccessList   = [];
    self._shownCount      = 10;
    self.preferences      = [null, null, null];

    var $ = function (id) { return document.getElementById(id); };
    var tabAddr  = $('tab-address');
    var tabArea  = $('tab-area');
    var modeAddr = $('mode-address');
    var modeArea = $('mode-area');
    if (tabAddr)  tabAddr.classList.toggle('active', mode === 'address');
    if (tabArea)  tabArea.classList.toggle('active', mode === 'area');
    if (modeAddr) modeAddr.style.display = mode === 'address' ? 'block' : 'none';
    if (modeArea) modeArea.style.display = mode === 'area'    ? 'block' : 'none';

    var section = $('beach-access-section');
    if (section) section.classList.remove('visible');

    var sel = $('f-area-select');
    if (sel) sel.value = '';

    self._updatePrefSlots();
    self._updateNextBtn();
  };

  /* ── Area dropdown ────────────────────────────────────────── */
  LocationStep.prototype.onAreaSelectChange = function (value) {
    var self = this;
    if (!value) {
      self.areaZone         = null;
      self.selectedAreaName = null;
      self._updateNextBtn();
      return;
    }
    var parts = value.split('|');
    self.selectedAreaName = parts[1] || '';
    self._onAreaChange(parts[0]);
  };

  LocationStep.prototype._onAreaChange = function (zone) {
    var self = this;
    self.areaZone = zone;
    // Apply pricing immediately if page provides the function
    if (typeof window.applyLocationPricing === 'function') {
      window.applyLocationPricing(zone === 'PCB' ? 'pcb' : '30a');
    }
    self._loadAndRender(zone);
  };

  /* ── Address input ────────────────────────────────────────── */
  LocationStep.prototype.handleAddressInput = function (text) {
    var self = this;
    clearTimeout(self._addressTimer);
    var status = document.getElementById('geocoding-status');
    self._updateNextBtn();
    if (!text || text.trim().length < 8) {
      if (status) { status.textContent = ''; status.className = 'geocoding-status'; }
      return;
    }
    if (status) { status.textContent = 'Finding your location…'; status.className = 'geocoding-status searching'; }
    self._addressTimer = setTimeout(function () { self._geocodeAndLoad(text); }, 700);
  };

  LocationStep.prototype._geocodeAndLoad = async function (address) {
    var self = this;
    var status = document.getElementById('geocoding-status');
    var geo    = null;

    try {
      if (typeof LMU !== 'undefined' && LMU.geocode) {
        geo = await LMU.geocode(address);
      } else {
        // Direct Nominatim call when LMU is not available.
        // BEACHFRONT_GEOCODING — viewbox biases toward the Emerald Coast without
        // hard-restricting results (no bounded=1), so inland rental addresses still resolve.
        var encoded = encodeURIComponent(address.trim() + ', FL, USA');
        var url     = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encoded +
                      '&limit=1&countrycodes=us&viewbox=-86.6000,30.1400,-85.6500,30.3400';
        var res     = await fetch(url, { headers: { 'User-Agent': 'LMU-Beach-Bonfires/1.0' } });
        if (res.ok) {
          var data = await res.json();
          if (data && data.length > 0) {
            geo = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display_name: data[0].display_name };
          }
        }
      }
    } catch (e) { /* geocoding unavailable — will show error below */ }

    if (geo) {
      self.geo = geo;
      if (status) {
        status.textContent = 'Location found: ' + geo.display_name.split(',').slice(0, 3).join(',');
        status.className   = 'geocoding-status found';
      }
      await self._loadAndRender(null);
    } else {
      self.geo = null;
      if (status) {
        status.textContent = 'Address not found — try the "Choose my beach area" tab.';
        status.className   = 'geocoding-status error';
      }
    }
    self._updateNextBtn();
  };

  /* ── Load + render location list ─────────────────────────── */
  LocationStep.prototype._loadAndRender = async function (areaZone) {
    var self = this;
    var lat  = self.geo ? self.geo.lat : null;
    var lon  = self.geo ? self.geo.lon : null;

    var locations = await fetchLocations(lat, lon, areaZone, self.services);
    self._allAccessList = locations;
    self._shownCount    = 10;

    if (locations.length === 0) return;

    var section = document.getElementById('beach-access-section');
    if (section) section.classList.add('visible');

    self._renderList(locations.slice(0, self._shownCount));

    var showMore = document.getElementById('beach-access-show-more');
    if (showMore) showMore.style.display = locations.length > self._shownCount ? 'block' : 'none';

    self._initMap(lat, lon, locations);
  };

  LocationStep.prototype._renderList = function (locations) {
    var self = this;
    var list = document.getElementById('beach-access-list');
    if (!list) return;
    list.innerHTML = locations.map(function (loc) {
      var inPrefs  = self.preferences.some(function (p) { return p && p.id === loc.id; });
      var dist     = (loc.distanceMiles !== undefined)
        ? '<div class="beach-access-dist">' + loc.distanceMiles.toFixed(1) + ' mi away</div>'
        : '';
      var badge    = (loc.services_offered && loc.services_offered.indexOf('social_fire') !== -1)
        ? '<span class="beach-access-badge">Social Fire</span>'
        : '';
      var btnLabel = inPrefs ? '&#10003; Added' : '+ Add';
      var btnClass = inPrefs ? 'beach-access-add-btn added' : 'beach-access-add-btn';
      return '<div class="beach-access-option' + (inPrefs ? ' in-prefs' : '') + '" id="loc-row-' + escAttr(loc.id) + '">' +
        '<div style="flex:1"><span class="beach-access-name">' + escAttr(loc.name) + badge + '</span>' + dist + '</div>' +
        '<button type="button" class="' + btnClass + '" id="add-btn-' + escAttr(loc.id) + '"' +
        (inPrefs
          ? ' disabled'
          : ' onclick="addPreference(\'' + escAttr(loc.id) + '\',\'' + escAttr(loc.name) + '\',\'' + escAttr(loc.zone) + '\')"') +
        '>' + btnLabel + '</button>' +
        '</div>';
    }).join('');
  };

  LocationStep.prototype.showMoreBeachAccess = function () {
    var self = this;
    self._shownCount = self._allAccessList.length;
    self._renderList(self._allAccessList);
    var btn = document.getElementById('beach-access-show-more');
    if (btn) btn.style.display = 'none';
  };

  /* ── Preference ranked picker ─────────────────────────────── */
  LocationStep.prototype.addPreference = function (id, name, zone) {
    var self       = this;
    var firstEmpty = self.preferences.indexOf(null);
    if (firstEmpty === -1) return; // all 3 already filled
    self.preferences[firstEmpty] = { id: id, name: name, zone: zone };
    self._updatePrefSlots();
    self._renderList(self._allAccessList.slice(0, self._shownCount));
    self._updateMapPinStates();
    if (firstEmpty === 0 && typeof window.applyLocationPricing === 'function') {
      window.applyLocationPricing(zone === '30A' ? '30a' : 'pcb');
    }
    self._updateNextBtn();
  };

  LocationStep.prototype.removePreference = function (idx) {
    var self    = this;
    self.preferences[idx] = null;
    var compact = self.preferences.filter(Boolean);
    self.preferences = [compact[0] || null, compact[1] || null, compact[2] || null];
    self._updatePrefSlots();
    self._renderList(self._allAccessList.slice(0, self._shownCount));
    self._updateMapPinStates();
    self._updateNextBtn();
  };

  LocationStep.prototype._updatePrefSlots = function () {
    var self = this;
    for (var i = 0; i < 3; i++) {
      var slot = document.getElementById('pref-slot-' + i);
      if (!slot) continue;
      var pref = self.preferences[i];
      if (pref) {
        slot.classList.add('filled');
        slot.innerHTML =
          '<div class="pref-rank">' + (i + 1) + '</div>' +
          '<span class="pref-name">' + escAttr(pref.name) + '</span>' +
          '<button type="button" class="pref-remove" onclick="removePreference(' + i + ')" title="Remove">&#10005;</button>';
      } else {
        slot.classList.remove('filled');
        slot.innerHTML =
          '<div class="pref-rank">' + (i + 1) + '</div>' +
          '<span class="pref-empty">Tap a location above to add</span>';
      }
    }
  };

  /* ── Map pin rank helpers ─────────────────────────────────── */

  /* Returns 0/1/2 if location is the 1st/2nd/3rd preference, -1 if unselected */
  LocationStep.prototype._getRank = function (id) {
    for (var i = 0; i < this.preferences.length; i++) {
      if (this.preferences[i] && this.preferences[i].id === id) return i;
    }
    return -1;
  };

  /* Syncs all map pin colors and rank labels to current preferences state */
  LocationStep.prototype._updateMapPinStates = function () {
    var self   = this;
    var COLORS = ['#F59E0B', '#94A3B8', '#B45309']; // gold, silver, bronze
    var LABELS = ['1', '2', '3'];

    Object.keys(self._mapMarkers).forEach(function (id) {
      var marker = self._mapMarkers[id];
      var rank   = self._getRank(id);
      if (rank === -1) {
        marker.setStyle({ fillColor: '#0E7490', color: '#ffffff' });
        marker.unbindTooltip();
      } else {
        marker.setStyle({ fillColor: COLORS[rank], color: '#ffffff' });
        marker.unbindTooltip();
        marker.bindTooltip(LABELS[rank], {
          permanent:  true,
          direction:  'center',
          className:  'marker-rank-label'
        });
      }
    });
  };

  /* Continue button requires all 3 preferences selected */
  LocationStep.prototype._updateNextBtn = function () {
    var self        = this;
    var allSelected = self.preferences.every(function (p) { return p !== null; });
    var btn         = document.getElementById(self.nextBtnId);
    if (!btn) return;
    btn.disabled       = !allSelected;
    btn.style.opacity  = allSelected ? '1' : '0.5';
    btn.style.cursor   = allSelected ? 'pointer' : 'not-allowed';
  };

  /* ── Leaflet map ──────────────────────────────────────────── */
  LocationStep.prototype._initMap = function (centerLat, centerLon, locations) {
    var self = this;
    if (typeof L === 'undefined') return;
    var mapEl = document.getElementById('beach-access-map');
    if (!mapEl) return;

    // Inject rank-label CSS once
    if (!document.getElementById('lmu-marker-rank-css')) {
      var style = document.createElement('style');
      style.id = 'lmu-marker-rank-css';
      style.textContent =
        '.marker-rank-label{background:transparent!important;border:none!important;' +
        'box-shadow:none!important;font-weight:700;font-size:11px;color:#1e293b;padding:0;}' +
        '.marker-rank-label::before{display:none!important;}';
      document.head.appendChild(style);
    }

    if (self._map) { self._map.remove(); self._map = null; self._mapMarkers = {}; }

    var defaultLat = centerLat || 30.176;
    var defaultLon = centerLon || -86.136;
    self._map = L.map('beach-access-map', { zoomControl: true }).setView([defaultLat, defaultLon], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(self._map);

    if (centerLat && centerLon) {
      L.circleMarker([centerLat, centerLon], {
        radius: 7, color: '#C8562A', fillColor: '#C8562A', fillOpacity: 0.9, weight: 2
      }).addTo(self._map).bindPopup('Your address').openPopup();
    }

    locations.forEach(function (loc) {
      if (!loc.latitude || !loc.longitude) return;

      var marker = L.circleMarker([loc.latitude, loc.longitude], {
        radius:      10,
        fillColor:   '#0E7490',
        color:       '#ffffff',
        weight:      2,
        opacity:     1,
        fillOpacity: 0.85
      }).addTo(self._map);

      // Click: add / remove preference, scroll corresponding list card into view
      marker.on('click', function () {
        var rank = self._getRank(loc.id);
        if (rank !== -1) {
          // Already selected — remove it
          self.removePreference(rank);
        } else if (self.preferences.indexOf(null) !== -1) {
          // Slot available — add it and scroll card into view
          self.addPreference(loc.id, loc.name, loc.zone);
          var row = document.getElementById('loc-row-' + loc.id);
          if (row) row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          // All 3 slots full — brief popup hint
          L.popup({ closeButton: false, autoClose: true, closeOnClick: true })
            .setLatLng([loc.latitude, loc.longitude])
            .setContent('<span style="font-size:0.82rem">Deselect a location first</span>')
            .openOn(self._map);
        }
      });

      // Hover: lighten teal when unselected
      marker.on('mouseover', function () {
        if (self._getRank(loc.id) === -1) marker.setStyle({ fillColor: '#0DA5C0' });
      });
      marker.on('mouseout', function () {
        if (self._getRank(loc.id) === -1) marker.setStyle({ fillColor: '#0E7490' });
      });

      self._mapMarkers[loc.id] = marker;
    });

    var allPoints = locations
      .filter(function (l) { return l.latitude && l.longitude; })
      .map(function (l)    { return [l.latitude, l.longitude]; });
    if (centerLat && centerLon) allPoints.push([centerLat, centerLon]);
    if (allPoints.length > 1) self._map.fitBounds(allPoints, { padding: [24, 24] });

    // Apply current preference state to freshly-created markers
    self._updateMapPinStates();
  };

  /* ============================================================
     Export
     ============================================================ */
  window.BookingWizard = { LocationStep: LocationStep };

})(window);
