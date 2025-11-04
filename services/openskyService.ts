
import { FlightState, FlightStateVector } from '../types';

// This service handles fetching live flight data from the OpenSky Network API.

// Bounding box coordinates for the Nepal region.
// This tells the API to only send us flights currently within this geographical area.
const NEPAL_BOUNDS = {
  lamin: 26.3, // Minimum Latitude
  lomin: 80.0, // Minimum Longitude
  lamax: 30.5, // Maximum Latitude
  lomax: 88.2, // Maximum Longitude
};

const OPENSKY_API_URL = `https://opensky-network.org/api/states/all?lamin=${NEPAL_BOUNDS.lamin}&lomin=${NEPAL_BOUNDS.lomin}&lamax=${NEPAL_BOUNDS.lamax}&lomax=${NEPAL_BOUNDS.lomax}`;

/**
 * Fetches live flight states for the Nepal region from the OpenSky Network.
 * @returns A promise that resolves to an array of FlightState objects.
 */
export const fetchLiveFlights = async (): Promise<FlightState[]> => {
  try {
    // We make a request to the OpenSky API.
    const response = await fetch(OPENSKY_API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch flight data from OpenSky Network.');
    }
    const data = await response.json();

    // The API returns an array of arrays. We need to process this into a more usable format.
    const states: FlightStateVector[] = data.states || [];

    // We filter out any flights that don't have position data and map them to our FlightState object.
    return states
      .filter(state => state[5] != null && state[6] != null) // Ensure longitude and latitude are not null
      .map((state: FlightStateVector) => ({
        icao24: state[0],
        callsign: state[1]?.trim() || 'N/A', // Clean up callsign
        origin_country: state[2],
        longitude: state[5],
        latitude: state[6],
        baro_altitude: state[7], // Altitude in meters
        velocity: state[9], // Speed in meters/second
        true_track: state[10], // Direction in degrees
      }));
  } catch (error) {
    console.error('Error fetching OpenSky data:', error);
    // Return an empty array if there's an error to prevent the app from crashing.
    return [];
  }
};
