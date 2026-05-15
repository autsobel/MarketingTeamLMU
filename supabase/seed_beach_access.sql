-- =============================================================
-- LMU — BEACH ACCESS LOCATIONS SEED
-- Run after 001_schema.sql and seed.sql.
--
-- IMPORTANT: Coordinates below are approximate (within ~0.5 miles).
-- Run scripts/geocode-locations.js to get precise lat/lng values,
-- then paste the generated UPDATE statements back here.
--
-- Columns: name, address, zone, county, latitude, longitude,
--          services_offered, active
-- =============================================================

INSERT INTO beach_access_locations
  (name, address, zone, county, latitude, longitude, services_offered, active)
VALUES

-- ============================================================
-- BAY COUNTY LOCATIONS (zone='PCB', county='Bay')
-- ============================================================

('Sunnyside Beach & Tennis Resort',
 '22400 Front Beach Rd, Panama City Beach, FL 32413',
 'PCB', 'Bay', 30.1648, -85.8796,
 ARRAY['bonfire','picnic','chair_rental','social_fire'], true),

('Bay County Public Access 1',
 '4723 Spyglass Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1775, -85.6934,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 2',
 '4823 Spyglass Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1775, -85.6945,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 3',
 '4931 Spyglass Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1774, -85.6957,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 4',
 '5121 Gulf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1773, -85.6978,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 5',
 '5201 Gulf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1773, -85.6986,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 6',
 '5301 Gulf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1772, -85.6997,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 7',
 '5317 Gulf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1772, -85.6998,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 8',
 '5415 Gulf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1772, -85.7008,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 9',
 '5527 Gulf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1771, -85.7019,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 10',
 '5605 Gulf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1771, -85.7027,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 11',
 '5625 Gulf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1771, -85.7029,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 12',
 '6105 Gulf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1769, -85.7076,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 12A',
 '6617 Gulf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1768, -85.7126,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 13',
 '6707 Gulf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1768, -85.7135,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 14',
 '6805 Gulf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1768, -85.7144,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 15',
 '6805 Gulf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1768, -85.7144,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 16',
 '7817 Surf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1762, -85.7258,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 17',
 '8001 Surf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1761, -85.7277,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 18',
 '8215 Surf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1760, -85.7299,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 19',
 '8225 Surf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1760, -85.7300,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 20',
 '8401 Surf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1759, -85.7318,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 21',
 '8501 Surf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1758, -85.7328,
 ARRAY['bonfire','picnic'], true),

('Edward F. Hickey, Jr. Park',
 '8523 Surf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1758, -85.7330,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 23',
 '8629 Surf Dr, Panama City Beach, FL',
 'PCB', 'Bay', 30.1757, -85.7341,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 77',
 '19987 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8572,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 78',
 '20019 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8575,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 79',
 '20115 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8585,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 80',
 '20305 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8604,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 81',
 '20413 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8615,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 82',
 '20509 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8624,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 83',
 '20601 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8633,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 84',
 '20647 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8638,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 85',
 '20711 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8644,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 86',
 '21603 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8735,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 87',
 '21803 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8755,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 88',
 '21929 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8768,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 89',
 '22003 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8775,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 90',
 '22019 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8777,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 91',
 '22025 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8778,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 92',
 '22107 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8786,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 93',
 '22401 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8816,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 94',
 '22515 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8828,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 95',
 '22801 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8857,
 ARRAY['bonfire','picnic'], true),

('Bay County Public Access 96',
 '23011 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8878,
 ARRAY['bonfire','picnic'], true),

('Natural Beach Access',
 '22209 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'Bay', 30.1648, -85.8789,
 ARRAY['bonfire','picnic'], true),

-- ============================================================
-- PCB CITY LOCATIONS (zone='PCB', county='PCB')
-- ============================================================

('Señor Frogs',
 '15005 Front Beach Rd, Panama City Beach, FL 32413',
 'PCB', 'PCB', 30.1648, -85.8036,
 ARRAY['bonfire','picnic','social_fire','chair_rental'], true),

('Public Beach Access 24',
 '8711 Surf Dr, Panama City Beach, FL',
 'PCB', 'PCB', 30.1757, -85.7353,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 25',
 '9610 Beach Blvd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7466,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 26',
 '9618 Beach Blvd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7467,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 27',
 '9622 Beach Blvd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7468,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 28',
 '9704 Beach Blvd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7476,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 29',
 '9708 Beach Blvd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7476,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 30',
 '9718 Beach Blvd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7477,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 31',
 '9740 Beach Blvd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7480,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 32',
 '9800 Beach Blvd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7486,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 33',
 '9806 Beach Blvd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7487,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 34',
 '9812 Beach Blvd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7488,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 35A',
 '10611 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7572,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 36',
 'Front Beach Road, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7600,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 37',
 '10713 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7582,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 38',
 '10811 Beach Blvd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7593,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 39',
 '10719 Beach Blvd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7582,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 40',
 '11211 Beach Blvd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7634,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 41',
 '11211 Beach Blvd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7635,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 42',
 '11751 Beach Blvd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7689,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 43',
 '12709 Beach Blvd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7785,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 44',
 '12999 Oleander Dr, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7813,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 45',
 '13001 Oleander Dr, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7813,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 46',
 '13013 Oleander Dr, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7814,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 47',
 '13221 Oleander Dr, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7835,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 48',
 '13213 Oleander Dr, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7834,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 49',
 '13401 Oleander Dr, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7853,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 50',
 '13407 Oleander Dr, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7854,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 51',
 '14531 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.7968,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 52',
 '15401 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8056,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 53',
 '16101 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8127,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 54',
 '16101 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8128,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 55',
 '16101 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8129,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 56',
 '16101 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8130,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 57',
 '16101 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8131,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 58',
 '16303 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8151,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 59',
 '16317 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8153,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 60',
 '16325 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8154,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 61',
 '16423 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8164,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 62',
 '16429 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8164,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 63',
 '16691 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8191,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 64',
 '17001 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8222,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 65',
 '17101 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8232,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 66',
 '17305 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8252,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 67',
 '17485 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8270,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 68',
 '17501 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8272,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 69',
 '17545 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8276,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 70',
 '17561 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8278,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 71',
 '17609 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8283,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 72',
 '17643 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8286,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 73',
 '17735 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8295,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 74',
 '17698 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8292,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 76',
 '17787 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8301,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 76A',
 '17807 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8303,
 ARRAY['bonfire','picnic'], true),

('Public Beach Access 76B',
 '17885 Front Beach Rd, Panama City Beach, FL',
 'PCB', 'PCB', 30.1648, -85.8311,
 ARRAY['bonfire','picnic'], true),

-- ============================================================
-- WALTON COUNTY / 30A LOCATIONS (zone='30A', county='Walton')
-- ============================================================

('Inlet Beach',
 '438 W Park Place Ave, Inlet Beach, FL 32461',
 '30A', 'Walton', 30.2682, -86.0249,
 ARRAY['bonfire','picnic','social_fire'], true),

('Walton Dunes',
 '320 Beachfront Trail, Santa Rosa Beach, FL 32459',
 '30A', 'Walton', 30.3322, -86.1798,
 ARRAY['bonfire','picnic'], true),

('Santa Clara',
 '3468 E County Highway 30A, Santa Rosa Beach, FL 32459',
 '30A', 'Walton', 30.3215, -86.1312,
 ARRAY['bonfire','picnic'], true),

('Grayton Dunes',
 '288 Garfield Street, Santa Rosa Beach, FL 32459',
 '30A', 'Walton', 30.3148, -86.1610,
 ARRAY['bonfire','picnic'], true),

('Blue Mountain',
 '475 Blue Mountain Rd, Santa Rosa Beach, FL 32459',
 '30A', 'Walton', 30.3068, -86.2052,
 ARRAY['bonfire','picnic'], true),

('Gulfview Heights',
 '186 Gulfview Heights St, Santa Rosa Beach, FL 32459',
 '30A', 'Walton', 30.3032, -86.2158,
 ARRAY['bonfire','picnic'], true),

('Ed Walline',
 '4447 W County Highway 30A, Santa Rosa Beach, FL 32459',
 '30A', 'Walton', 30.2962, -86.2645,
 ARRAY['bonfire','picnic'], true),

('Fort Panic',
 '5753 W County Highway 30A, Santa Rosa Beach, FL 32459',
 '30A', 'Walton', 30.2960, -86.3131,
 ARRAY['bonfire','picnic'], true),

('Dune Allen',
 '5999 W County Highway 30A, Santa Rosa Beach, FL 32459',
 '30A', 'Walton', 30.2901, -86.3328,
 ARRAY['bonfire','picnic'], true);

-- ============================================================
-- After inserting, run scripts/geocode-locations.js and apply
-- the output UPDATE statements to replace approximate coords.
-- ============================================================
