
import { Airport } from './types';

// The factor used to estimate CO2 emissions per passenger per kilometer.
// This is a common average used for such calculations.
export const EMISSION_FACTOR = 0.115; // kg CO₂ per passenger-km

// A sample list of airports. In a real-world application, this would come from a database or a larger API.
// We include major hubs and airports in/around Nepal to support the app's focus.
export const AIRPORTS: Airport[] = [
  { iata: 'KTM', name: 'Tribhuvan International Airport', city: 'Kathmandu', country: 'Nepal', latitude: 27.6966, longitude: 85.3592 },
  { iata: 'PKR', name: 'Pokhara International Airport', city: 'Pokhara', country: 'Nepal', latitude: 28.1997, longitude: 83.9942 },
  { iata: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India', latitude: 28.5562, longitude: 77.1000 },
  { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', latitude: 19.0896, longitude: 72.8656 },
  { iata: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', latitude: 25.2532, longitude: 55.3657 },
  { iata: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', latitude: 51.4700, longitude: -0.4543 },
  { iata: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA', latitude: 40.6413, longitude: -73.7781 },
  { iata: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', latitude: 1.3644, longitude: 103.9915 },
  { iata: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', latitude: 13.6900, longitude: 100.7501 },
  { iata: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', latitude: -33.9461, longitude: 151.1772 },
  { iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', latitude: 50.0379, longitude: 8.5622 },
];
