
// This file defines the "shape" of our data objects.

// Represents an airport with its details.
export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

// Represents the raw data array we get for each flight from the OpenSky API.
// Each element in the array corresponds to a specific piece of flight information.
export type FlightStateVector = [
  string,       // 0: icao24
  string,       // 1: callsign
  string,       // 2: origin_country
  number,       // 3: time_position
  number,       // 4: last_contact
  number | null,// 5: longitude
  number | null,// 6: latitude
  number | null,// 7: baro_altitude
  boolean,      // 8: on_ground
  number | null,// 9: velocity (m/s)
  number | null,// 10: true_track (degrees)
  number | null,// 11: vertical_rate
  number[] | null, // 12: sensors
  number | null,// 13: geo_altitude
  string | null,// 14: squawk
  boolean,      // 15: spi
  number,       // 16: position_source
];

// A more readable object structure for a flight's state after we process the raw array.
export interface FlightState {
  icao24: string;
  callsign: string;
  origin_country: string;
  longitude: number | null;
  latitude: number | null;
  baro_altitude: number | null; // in meters
  velocity: number | null; // in m/s
  true_track: number | null; // in degrees
}
