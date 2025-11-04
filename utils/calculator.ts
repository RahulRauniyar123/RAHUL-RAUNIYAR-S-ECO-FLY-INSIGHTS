
import { EMISSION_FACTOR } from '../constants';

/**
 * Calculates the great-circle distance between two points on the earth (specified in decimal degrees).
 * This is the Haversine formula.
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns The distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

/**
 * Converts degrees to radians.
 * @param deg The angle in degrees
 * @returns The angle in radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calculates the estimated CO2 emissions for a given distance.
 * @param distance The flight distance in kilometers
 * @returns The estimated CO2 emissions in kilograms
 */
export function calculateEmissions(distance: number): number {
  return distance * EMISSION_FACTOR;
}
