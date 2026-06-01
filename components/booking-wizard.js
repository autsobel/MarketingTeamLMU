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
    // ── Bay County (zone=PCB, county=Bay) — type: access_point ─
    // Coordinates verified from Bay County GIS (Facilities/MapServer layer 1)
    // and Nominatim geocoding. Accesses are numbered east→west along Front Beach Rd.
    { id: 'bay_sunnyside', name: 'Sunnyside Beach & Tennis Resort',
      zone: 'PCB', county: 'Bay', latitude: 30.257960, longitude: -85.963566,
      type: 'access_point',
      services_offered: ['bonfire','picnic','chair_rental','social_fire'] },
    { id: 'bay_1',   name: 'Bay County Public Access 1',
      zone: 'PCB', county: 'Bay', latitude: 30.137340, longitude: -85.750140,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_2',   name: 'Bay County Public Access 2',
      zone: 'PCB', county: 'Bay', latitude: 30.138423, longitude: -85.751426,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_3',   name: 'Bay County Public Access 3',
      zone: 'PCB', county: 'Bay', latitude: 30.139314, longitude: -85.752598,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_4',   name: 'Bay County Public Access 4',
      zone: 'PCB', county: 'Bay', latitude: 30.141328, longitude: -85.754492,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_5',   name: 'Bay County Public Access 5',
      zone: 'PCB', county: 'Bay', latitude: 30.141698, longitude: -85.754970,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_6',   name: 'Bay County Public Access 6',
      zone: 'PCB', county: 'Bay', latitude: 30.142362, longitude: -85.755810,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_7',   name: 'Bay County Public Access 7',
      zone: 'PCB', county: 'Bay', latitude: 30.142854, longitude: -85.756608,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_8',   name: 'Bay County Public Access 8',
      zone: 'PCB', county: 'Bay', latitude: 30.143516, longitude: -85.757239,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_9',   name: 'Bay County Public Access 9',
      zone: 'PCB', county: 'Bay', latitude: 30.144181, longitude: -85.758071,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_10',  name: 'Bay County Public Access 10',
      zone: 'PCB', county: 'Bay', latitude: 30.144767, longitude: -85.758799,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_11',  name: 'Bay County Public Access 11',
      zone: 'PCB', county: 'Bay', latitude: 30.145494, longitude: -85.759631,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_12',  name: 'Bay County Public Access 12',
      zone: 'PCB', county: 'Bay', latitude: 30.148753, longitude: -85.764271,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_12a', name: 'Bay County Public Access 12A',
      zone: 'PCB', county: 'Bay', latitude: 30.153341, longitude: -85.770361,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_13',  name: 'Bay County Public Access 13',
      zone: 'PCB', county: 'Bay', latitude: 30.154063, longitude: -85.771346,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_14',  name: 'Bay County Public Access 14',
      zone: 'PCB', county: 'Bay', latitude: 30.154889, longitude: -85.772456,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_15',  name: 'Bay County Public Access 15',
      zone: 'PCB', county: 'Bay', latitude: 30.155040, longitude: -85.772538,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_16',  name: 'Bay County Public Access 16',
      zone: 'PCB', county: 'Bay', latitude: 30.159989, longitude: -85.779834,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_17',  name: 'Bay County Public Access 17',
      zone: 'PCB', county: 'Bay', latitude: 30.161075, longitude: -85.781511,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_18',  name: 'Bay County Public Access 18',
      zone: 'PCB', county: 'Bay', latitude: 30.162911, longitude: -85.784184,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_19',  name: 'Bay County Public Access 19',
      zone: 'PCB', county: 'Bay', latitude: 30.163377, longitude: -85.784892,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_20',  name: 'Bay County Public Access 20',
      zone: 'PCB', county: 'Bay', latitude: 30.164325, longitude: -85.786318,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_21',  name: 'Bay County Public Access 21',
      zone: 'PCB', county: 'Bay', latitude: 30.164771, longitude: -85.786987,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_hickey', name: 'Edward F. Hickey, Jr. Park',
      zone: 'PCB', county: 'Bay', latitude: 30.166378, longitude: -85.789222,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_23',  name: 'Bay County Public Access 23',
      zone: 'PCB', county: 'Bay', latitude: 30.166356, longitude: -85.789542,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_77',  name: 'Bay County Public Access 77',
      zone: 'PCB', county: 'Bay', latitude: 30.243156, longitude: -85.932669,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_78',  name: 'Bay County Public Access 78',
      zone: 'PCB', county: 'Bay', latitude: 30.243845, longitude: -85.934045,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_79',  name: 'Bay County Public Access 79',
      zone: 'PCB', county: 'Bay', latitude: 30.244252, longitude: -85.935069,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_80',  name: 'Bay County Public Access 80',
      zone: 'PCB', county: 'Bay', latitude: 30.244676, longitude: -85.936020,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_81',  name: 'Bay County Public Access 81',
      zone: 'PCB', county: 'Bay', latitude: 30.245106, longitude: -85.937013,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_82',  name: 'Bay County Public Access 82',
      zone: 'PCB', county: 'Bay', latitude: 30.245570, longitude: -85.938031,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_83',  name: 'Bay County Public Access 83',
      zone: 'PCB', county: 'Bay', latitude: 30.245797, longitude: -85.938530,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_84',  name: 'Bay County Public Access 84',
      zone: 'PCB', county: 'Bay', latitude: 30.246635, longitude: -85.940406,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_85',  name: 'Bay County Public Access 85',
      zone: 'PCB', county: 'Bay', latitude: 30.247109, longitude: -85.941393,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_86',  name: 'Bay County Public Access 86',
      zone: 'PCB', county: 'Bay', latitude: 30.252750, longitude: -85.953970,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_87',  name: 'Bay County Public Access 87',
      zone: 'PCB', county: 'Bay', latitude: 30.253897, longitude: -85.956574,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_88',  name: 'Bay County Public Access 88',
      zone: 'PCB', county: 'Bay', latitude: 30.255111, longitude: -85.959220,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_89',  name: 'Bay County Public Access 89',
      zone: 'PCB', county: 'Bay', latitude: 30.255297, longitude: -85.959684,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_90',  name: 'Bay County Public Access 90',
      zone: 'PCB', county: 'Bay', latitude: 30.255526, longitude: -85.960293,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_91',  name: 'Bay County Public Access 91',
      zone: 'PCB', county: 'Bay', latitude: 30.255784, longitude: -85.960885,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_92',  name: 'Bay County Public Access 92',
      zone: 'PCB', county: 'Bay', latitude: 30.255973, longitude: -85.961522,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_93',  name: 'Bay County Public Access 93',
      zone: 'PCB', county: 'Bay', latitude: 30.257608, longitude: -85.965645,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_94',  name: 'Bay County Public Access 94',
      zone: 'PCB', county: 'Bay', latitude: 30.258230, longitude: -85.967353,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_95',  name: 'Bay County Public Access 95',
      zone: 'PCB', county: 'Bay', latitude: 30.259550, longitude: -85.970712,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_96',  name: 'Bay County Public Access 96',
      zone: 'PCB', county: 'Bay', latitude: 30.261899, longitude: -85.974887,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'bay_natural', name: 'Natural Beach Access',
      zone: 'PCB', county: 'Bay', latitude: 30.256165149689807, longitude: -85.96273172889843,
      type: 'access_point', services_offered: ['bonfire','picnic'] },

    // ── PCB City (zone=PCB, county=PCB) — type: access_point ───
    // Coordinates verified from Bay County GIS (Facilities/MapServer layer 1).
    { id: 'pcb_frogs', name: 'Señor Frogs',
      zone: 'PCB', county: 'PCB', latitude: 30.207574, longitude: -85.861592,
      type: 'access_point',
      services_offered: ['bonfire','picnic','social_fire','chair_rental'] },
    { id: 'pcb_24',  name: 'Public Beach Access 24',
      zone: 'PCB', county: 'PCB', latitude: 30.166715, longitude: -85.789969,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_25',  name: 'Public Beach Access 25',
      zone: 'PCB', county: 'PCB', latitude: 30.173046, longitude: -85.800720,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_26',  name: 'Public Beach Access 26',
      zone: 'PCB', county: 'PCB', latitude: 30.173197, longitude: -85.800964,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_27',  name: 'Public Beach Access 27',
      zone: 'PCB', county: 'PCB', latitude: 30.173343, longitude: -85.801237,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_28',  name: 'Public Beach Access 28',
      zone: 'PCB', county: 'PCB', latitude: 30.173486, longitude: -85.801505,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_29',  name: 'Public Beach Access 29',
      zone: 'PCB', county: 'PCB', latitude: 30.173625, longitude: -85.801762,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_30',  name: 'Public Beach Access 30',
      zone: 'PCB', county: 'PCB', latitude: 30.173782, longitude: -85.802016,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_31',  name: 'Public Beach Access 31',
      zone: 'PCB', county: 'PCB', latitude: 30.173945, longitude: -85.802305,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_32',  name: 'Public Beach Access 32',
      zone: 'PCB', county: 'PCB', latitude: 30.174029, longitude: -85.802451,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_33',  name: 'Public Beach Access 33',
      zone: 'PCB', county: 'PCB', latitude: 30.174241, longitude: -85.802827,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_34',  name: 'Public Beach Access 34',
      zone: 'PCB', county: 'PCB', latitude: 30.174377, longitude: -85.803078,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_35a', name: 'Public Beach Access 35A',
      zone: 'PCB', county: 'PCB', latitude: 30.179028, longitude: -85.810833,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_36',  name: 'Public Beach Access 36',
      zone: 'PCB', county: 'PCB', latitude: 30.179340, longitude: -85.811448,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_37',  name: 'Public Beach Access 37',
      zone: 'PCB', county: 'PCB', latitude: 30.179944, longitude: -85.812570,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_38',  name: 'Public Beach Access 38',
      zone: 'PCB', county: 'PCB', latitude: 30.180513, longitude: -85.813735,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_39',  name: 'Public Beach Access 39',
      zone: 'PCB', county: 'PCB', latitude: 30.181257, longitude: -85.814736,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_40',  name: 'Public Beach Access 40',
      zone: 'PCB', county: 'PCB', latitude: 30.183167, longitude: -85.818086,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_41',  name: 'Public Beach Access 41',
      zone: 'PCB', county: 'PCB', latitude: 30.183981, longitude: -85.819423,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_42',  name: 'Public Beach Access 42',
      zone: 'PCB', county: 'PCB', latitude: 30.186913, longitude: -85.824525,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_43',  name: 'Public Beach Access 43',
      zone: 'PCB', county: 'PCB', latitude: 30.193830, longitude: -85.836653,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_44',  name: 'Public Beach Access 44',
      zone: 'PCB', county: 'PCB', latitude: 30.195404, longitude: -85.839677,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_45',  name: 'Public Beach Access 45',
      zone: 'PCB', county: 'PCB', latitude: 30.195510, longitude: -85.839881,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_46',  name: 'Public Beach Access 46',
      zone: 'PCB', county: 'PCB', latitude: 30.196151, longitude: -85.841056,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_47',  name: 'Public Beach Access 47',
      zone: 'PCB', county: 'PCB', latitude: 30.196790, longitude: -85.842220,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_48',  name: 'Public Beach Access 48',
      zone: 'PCB', county: 'PCB', latitude: 30.197445, longitude: -85.843421,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_49',  name: 'Public Beach Access 49',
      zone: 'PCB', county: 'PCB', latitude: 30.198087, longitude: -85.844591,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_50',  name: 'Public Beach Access 50',
      zone: 'PCB', county: 'PCB', latitude: 30.198556, longitude: -85.845451,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_51',  name: 'Public Beach Access 51',
      zone: 'PCB', county: 'PCB', latitude: 30.205119, longitude: -85.857206,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_52',  name: 'Public Beach Access 52',
      zone: 'PCB', county: 'PCB', latitude: 30.209735, longitude: -85.866350,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_53',  name: 'Public Beach Access 53',
      zone: 'PCB', county: 'PCB', latitude: 30.214725, longitude: -85.875235,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_54',  name: 'Public Beach Access 54',
      zone: 'PCB', county: 'PCB', latitude: 30.215248, longitude: -85.876213,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_55',  name: 'Public Beach Access 55',
      zone: 'PCB', county: 'PCB', latitude: 30.215420, longitude: -85.876912,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_56',  name: 'Public Beach Access 56',
      zone: 'PCB', county: 'PCB', latitude: 30.215712, longitude: -85.877479,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_57',  name: 'Public Beach Access 57',
      zone: 'PCB', county: 'PCB', latitude: 30.216102, longitude: -85.877821,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_58',  name: 'Public Beach Access 58',
      zone: 'PCB', county: 'PCB', latitude: 30.216540, longitude: -85.878645,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_59',  name: 'Public Beach Access 59',
      zone: 'PCB', county: 'PCB', latitude: 30.216909, longitude: -85.879240,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_60',  name: 'Public Beach Access 60',
      zone: 'PCB', county: 'PCB', latitude: 30.217176, longitude: -85.879813,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_61',  name: 'Public Beach Access 61',
      zone: 'PCB', county: 'PCB', latitude: 30.217787, longitude: -85.880900,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_62',  name: 'Public Beach Access 62',
      zone: 'PCB', county: 'PCB', latitude: 30.218093, longitude: -85.881454,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_63',  name: 'Public Beach Access 63',
      zone: 'PCB', county: 'PCB', latitude: 30.219332, longitude: -85.883872,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_64',  name: 'Public Beach Access 64',
      zone: 'PCB', county: 'PCB', latitude: 30.221616, longitude: -85.888201,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_65',  name: 'Public Beach Access 65',
      zone: 'PCB', county: 'PCB', latitude: 30.222297, longitude: -85.889519,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_66',  name: 'Public Beach Access 66',
      zone: 'PCB', county: 'PCB', latitude: 30.225671, longitude: -85.896671,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_67',  name: 'Public Beach Access 67',
      zone: 'PCB', county: 'PCB', latitude: 30.228439, longitude: -85.902031,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_68',  name: 'Public Beach Access 68',
      zone: 'PCB', county: 'PCB', latitude: 30.228773, longitude: -85.902916,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_69',  name: 'Public Beach Access 69',
      zone: 'PCB', county: 'PCB', latitude: 30.229337, longitude: -85.903924,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_70',  name: 'Public Beach Access 70',
      zone: 'PCB', county: 'PCB', latitude: 30.230255, longitude: -85.905597,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_71',  name: 'Public Beach Access 71',
      zone: 'PCB', county: 'PCB', latitude: 30.230664, longitude: -85.906547,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_72',  name: 'Public Beach Access 72',
      zone: 'PCB', county: 'PCB', latitude: 30.231621, longitude: -85.908485,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_73',  name: 'Public Beach Access 73',
      zone: 'PCB', county: 'PCB', latitude: 30.232276, longitude: -85.909801,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_74',  name: 'Public Beach Access 74',
      zone: 'PCB', county: 'PCB', latitude: 30.232919, longitude: -85.911119,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_76',  name: 'Public Beach Access 76',
      zone: 'PCB', county: 'PCB', latitude: 30.233636, longitude: -85.912543,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_76a', name: 'Public Beach Access 76A',
      zone: 'PCB', county: 'PCB', latitude: 30.234074, longitude: -85.913407,
      type: 'access_point', services_offered: ['bonfire','picnic'] },
    { id: 'pcb_76b', name: 'Public Beach Access 76B',
      zone: 'PCB', county: 'PCB', latitude: 30.235527, longitude: -85.916415,
      type: 'access_point', services_offered: ['bonfire','picnic'] },

    // ── Walton County / 30A beach accesses ─────────────────────────────────────
    // type: access_point so these appear in both address mode (Flow 1, distance-sorted)
    // and area mode (Flow 2, zone-filtered). Street addresses from Bay County/Walton GIS.
    { id: '30a_inlet',   name: 'Inlet Beach',
      address: '438 W Park Place Ave, Inlet Beach, FL 32461',
      zone: '30A', county: 'Walton', latitude: 30.27409775384565, longitude: -86.00391597125422,
      type: 'access_point', region: 'Inlet Beach',
      services_offered: ['bonfire','picnic','social_fire'] },
    { id: '30a_walton',  name: 'Walton Dunes',
      address: '320 Beachfront Trail, Santa Rosa Beach, FL 32459',
      zone: '30A', county: 'Walton', latitude: 30.303752520564466, longitude: -86.08680838659403,
      type: 'access_point', region: 'Walton Dunes',
      services_offered: ['bonfire','picnic'] },
    { id: '30a_clara',   name: 'Santa Clara',
      address: '3468 E County Highway 30A, Santa Rosa Beach, FL 32459',
      zone: '30A', county: 'Walton', latitude: 30.3142561378197, longitude: -86.11911140009583,
      type: 'access_point', region: 'Santa Clara',
      services_offered: ['bonfire','picnic'] },
    { id: '30a_grayton', name: 'Grayton Dunes',
      address: '288 Garfield Street, Santa Rosa Beach, FL 32459',
      zone: '30A', county: 'Walton', latitude: 30.32889864199775, longitude: -86.16470087733391,
      type: 'access_point', region: 'Grayton Dunes',
      services_offered: ['bonfire','picnic'] },
    { id: '30a_blue',    name: 'Blue Mountain',
      address: '475 Blue Mountain Rd, Santa Rosa Beach, FL 32459',
      zone: '30A', county: 'Walton', latitude: 30.33757180491334, longitude: -86.19863182469412,
      type: 'access_point', region: 'Blue Mountain',
      services_offered: ['bonfire','picnic'] },
    { id: '30a_gulf',    name: 'Gulfview Heights',
      address: '186 Gulfview Heights St, Santa Rosa Beach, FL 32459',
      zone: '30A', county: 'Walton', latitude: 30.344032563326802, longitude: -86.22110375774244,
      type: 'access_point', region: 'Gulfview Heights',
      services_offered: ['bonfire','picnic'] },
    { id: '30a_walline', name: 'Ed Walline',
      address: '4447 W County Highway 30A, Santa Rosa Beach, FL 32459',
      zone: '30A', county: 'Walton', latitude: 30.34651684140995, longitude: -86.23009937127232,
      type: 'access_point', region: 'Ed Walline',
      services_offered: ['bonfire','picnic'] },
    { id: '30a_fort',    name: 'Fort Panic',
      address: '5753 W County Highway 30A, Santa Rosa Beach, FL 32459',
      zone: '30A', county: 'Walton', latitude: 30.35223853275155, longitude: -86.25127755779789,
      type: 'access_point', region: 'Fort Panic',
      services_offered: ['bonfire','picnic'] },
    { id: '30a_dune',    name: 'Dune Allen',
      address: '5999 W County Highway 30A, Santa Rosa Beach, FL 32459',
      zone: '30A', county: 'Walton', latitude: 30.352960676712467, longitude: -86.25144921916687,
      type: 'access_point', region: 'Dune Allen',
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
  // BEACHFRONT_THRESHOLD — nearest access ≤ this → treat rental as beachfront (Rule 1)
  var BEACHFRONT_THRESHOLD_MILES  = 0.25;   // BEACHFRONT_THRESHOLD
  // PCB_REROUTE_THRESHOLD — nearest PCB city access > this → route to Bay County first (Rule 2)
  var PCB_REROUTE_THRESHOLD_MILES = 3.0;    // PCB_REROUTE_THRESHOLD

  var PCB_CITY_BOUNDS = {                   // BOUNDARY_PLACEHOLDER
    north: 30.215, south: 30.150,
    east: -85.730, west: -85.970
  };

  var BAY_COUNTY_BOUNDS = {                 // BOUNDARY_PLACEHOLDER
    north: 30.350, south: 30.100,
    east: -85.290, west: -85.970
  };

  function isInPCBCity(lat, lng) {
    return lat >= PCB_CITY_BOUNDS.south && lat <= PCB_CITY_BOUNDS.north &&
           lng >= PCB_CITY_BOUNDS.west  && lng <= PCB_CITY_BOUNDS.east;
  }

  function isInBayCounty(lat, lng) {
    return lat >= BAY_COUNTY_BOUNDS.south && lat <= BAY_COUNTY_BOUNDS.north &&
           lng >= BAY_COUNTY_BOUNDS.west  && lng <= BAY_COUNTY_BOUNDS.east &&
           !isInPCBCity(lat, lng);
  }

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

    // Flow 1 (address mode): exclude region records — they belong to Flow 2 only
    if (!areaZone) {
      locations = locations.filter(function (l) {
        return (l.type || 'access_point') !== 'region';
      });
    }

    // Area mode → alphabetical
    if (areaZone) {
      var zoneKey = (areaZone === 'PCB') ? 'PCB' : '30A';
      return locations
        .filter(function (l) { return l.zone === zoneKey; })
        .sort(function (a, b) { return a.name.localeCompare(b.name); });
    }

    // Address mode → 4-rule recommendation logic (first matching rule wins)
    if (rentalLat && rentalLon) {
      // Attach distance to every location up front
      var withDist = locations
        .filter(function (l) { return l.latitude && l.longitude; })
        .map(function (l) {
          return Object.assign({}, l, {
            distanceMiles: haversine(rentalLat, rentalLon, l.latitude, l.longitude)
          });
        });

      var minDistance = Math.min.apply(null, withDist.map(function (l) { return l.distanceMiles; }));

      // RULE 1 — Beachfront (any county): nearest access ≤ threshold → pure distance sort
      if (minDistance <= BEACHFRONT_THRESHOLD_MILES) {
        return withDist.sort(function (a, b) { return a.distanceMiles - b.distanceMiles; });
      }

      // RULE 2 — Non-beachfront PCB city rental, far from PCB city accesses:
      //   show Bay County first, then everything else by distance
      if (isInPCBCity(rentalLat, rentalLon)) {
        var pcbCityAccesses = withDist.filter(function (l) { return l.county === 'PCB'; });
        var nearestPCB = Math.min.apply(null, pcbCityAccesses.map(function (l) { return l.distanceMiles; }));
        if (nearestPCB > PCB_REROUTE_THRESHOLD_MILES) {
          var bayAccesses = withDist
            .filter(function (l) { return l.county === 'Bay'; })
            .sort(function (a, b) { return a.distanceMiles - b.distanceMiles; });
          var otherAccesses = withDist
            .filter(function (l) { return l.county !== 'Bay'; })
            .sort(function (a, b) { return a.distanceMiles - b.distanceMiles; });
          return bayAccesses.concat(otherAccesses);
        }
      }

      // RULE 3 — Bay County non-beachfront: pure distance sort
      // RULE 4 — Walton County / 30A / catch-all: pure distance sort
      return withDist.sort(function (a, b) { return a.distanceMiles - b.distanceMiles; });
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
      }
      // If LMU geocode returned nothing, try direct Nominatim with viewbox bias toward
      // the Emerald Coast (no bounded=1, so inland addresses still resolve).
      if (!geo) {
        var encoded = encodeURIComponent(address.trim() + ', FL, USA');
        var url     = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encoded +
                      '&limit=1&countrycodes=us&viewbox=-86.6000,30.1400,-85.6500,30.3400';
        var res     = await fetch(url);
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
      try {
        await self._loadAndRender(null);
        if (status && self._allAccessList.length > 0) {
          status.textContent += ' — ' + self._allAccessList.length + ' accesses nearby. Scroll down to select.';
        } else if (status && self._allAccessList.length === 0) {
          status.textContent += ' — no accesses found for this area.';
          status.className    = 'geocoding-status error';
        }
      } catch (e) {
        console.error('[LMU] _loadAndRender failed:', e);
        if (status) {
          status.textContent = 'Error loading locations (' + e.message + ') — please refresh and try again.';
          status.className   = 'geocoding-status error';
        }
      }
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

    console.log('[LMU] Rendering', locations.length, 'locations');

    var section = document.getElementById('beach-access-section');
    if (section) {
      section.classList.add('visible');
      section.style.display = 'block';
      setTimeout(function () { section.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 80);
    }

    self._renderList(locations.slice(0, self._shownCount));

    var showMore = document.getElementById('beach-access-show-more');
    if (showMore) showMore.style.display = locations.length > self._shownCount ? 'block' : 'none';

    // Defer Leaflet init to next event tick so the browser finishes layout
    // on the newly-visible container before Leaflet reads its dimensions.
    var _lat = lat, _lon = lon, _locs = locations;
    setTimeout(function () {
      try { self._initMap(_lat, _lon, _locs); }
      catch (e) { console.error('[LMU] Map init failed:', e); }
    }, 0);
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

    // Leaflet can silently initialize at 0×0 when its container just became visible.
    // invalidateSize() recalculates dimensions once the browser has done layout.
    setTimeout(function () { if (self._map) self._map.invalidateSize(); }, 100);
  };

  /* ============================================================
     Export
     ============================================================ */
  window.BookingWizard = { LocationStep: LocationStep };

})(window);
