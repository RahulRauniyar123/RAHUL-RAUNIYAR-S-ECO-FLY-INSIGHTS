import React, { useState, useEffect, useMemo } from 'react';
import { FlightState } from '../types';
import { fetchLiveFlights } from '../services/openskyService';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Define the keys of a FlightState object that we want to allow sorting on.
type SortableKey = 'callsign' | 'origin_country' | 'velocity' | 'baro_altitude';

/**
 * A controller component that uses react-leaflet's `useMap` hook to interact with the map instance.
 * This is the standard way to add imperative logic like fitting bounds or flying to a location.
 */
const MapController = ({ flights, centerTarget }: { flights: FlightState[], centerTarget: L.LatLngExpression | null }) => {
  const map = useMap();

  // This effect runs whenever the list of flights changes.
  // It calculates the bounding box of all flights and zooms the map to fit them.
  useEffect(() => {
    if (flights.length > 0) {
      const validFlights = flights.filter(f => f.latitude != null && f.longitude != null);
      if (validFlights.length > 0) {
        const bounds = L.latLngBounds(
          validFlights.map(f => [f.latitude!, f.longitude!])
        );
        map.fitBounds(bounds, { padding: [50, 50] }); // Add padding so markers aren't on the edge
      }
    }
  }, [flights, map]);

  // This effect runs when a user clicks the 'Center on Flight' button.
  // It smoothly flies the map view to the selected flight's coordinates.
  useEffect(() => {
    if (centerTarget) {
      map.flyTo(centerTarget, 10); // Fly to the location with a zoom level of 10
    }
  }, [centerTarget, map]);

  return null; // This component does not render any visible elements.
};


// This component fetches and displays live flight data for the Nepal region.
export default function LiveFlightsDisplay(): React.ReactElement {
  // State to store the list of flights
  const [flights, setFlights] = useState<FlightState[]>([]);
  // State to manage loading status
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to store the last update time
  const [lastUpdated, setLastUpdated] = useState<string>('');
  // State for the filter input
  const [filterQuery, setFilterQuery] = useState<string>('');
  // State for the table sorting configuration
  const [sortConfig, setSortConfig] = useState<{ key: SortableKey | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
  // State to track which flight the user wants to center on.
  const [centerTarget, setCenterTarget] = useState<L.LatLngExpression | null>(null);

  // This function fetches the flight data from the service.
  const getFlightData = async () => {
    setIsLoading(true);
    const flightData = await fetchLiveFlights();
    setFlights(flightData);
    setLastUpdated(new Date().toLocaleTimeString());
    setIsLoading(false);
  };

  // useEffect hook to fetch data when the component first loads,
  // and then set up a timer to refresh the data every 60 seconds.
  useEffect(() => {
    getFlightData(); // Fetch initial data

    const intervalId = setInterval(() => {
      getFlightData();
    }, 60000); // Refresh every 60 seconds (60000 milliseconds)

    // Cleanup function to clear the interval when the component is unmounted.
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Memoized function to filter and sort the flight data.
  // This ensures the complex logic only runs when data or settings change.
  const processedFlights = useMemo(() => {
    let processableFlights = [...flights];

    // 1. Filtering Logic
    if (filterQuery) {
      const lowercasedQuery = filterQuery.toLowerCase();
      processableFlights = processableFlights.filter(flight =>
        flight.callsign.toLowerCase().includes(lowercasedQuery) ||
        flight.origin_country.toLowerCase().includes(lowercasedQuery)
      );
    }

    // 2. Sorting Logic
    if (sortConfig.key) {
      const { key, direction } = sortConfig;
      processableFlights.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];

        if (valA === null) return 1;
        if (valB === null) return -1;

        if (valA < valB) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return processableFlights;
  }, [flights, filterQuery, sortConfig]);

  // Handles click on a table header to set sorting state.
  const requestSort = (key: SortableKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Helper function to render sort indicators in table headers.
  const getSortIndicator = (key: SortableKey) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };

  // Helper function to convert speed from m/s to km/h for readability.
  const formatSpeed = (speedMs: number | null): string => {
    if (speedMs === null) return 'N/A';
    return `${Math.round(speedMs * 3.6)} km/h`;
  };

  // Helper function to format altitude from meters to feet.
  const formatAltitude = (altMeters: number | null): string => {
    if (altMeters === null) return 'N/A';
    return `${Math.round(altMeters * 3.28084)} ft`;
  };

  // Creates a custom divIcon for a flight, allowing rotation.
  const createFlightIcon = (rotation: number | null) => {
    return L.divIcon({
        html: `<span style="transform: rotate(${rotation || 0}deg); display: inline-block; font-size: 24px;">✈️</span>`,
        className: 'bg-transparent border-0',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
  };

  const nepalCenter: L.LatLngExpression = [28.3949, 84.1240];

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-md border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-100">📡 Live Flights Over Nepal</h2>
        <div className="text-right">
          <button onClick={getFlightData} disabled={isLoading} className="text-sm text-blue-400 hover:underline disabled:text-gray-500">
            {isLoading ? 'Refreshing...' : 'Refresh Now'}
          </button>
          {lastUpdated && <p className="text-xs text-gray-400">Last updated: {lastUpdated}</p>}
        </div>
      </div>
      
      {/* Map visualization - shows all flights regardless of filter */}
      <div className="h-[450px] w-full rounded-lg overflow-hidden border border-gray-700 mb-6 relative bg-gray-800">
        <MapContainer center={nepalCenter} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapController flights={flights} centerTarget={centerTarget} />
          {flights.map(flight => (
            flight.latitude && flight.longitude && (
              <Marker
                key={flight.icao24}
                position={[flight.latitude, flight.longitude]}
                icon={createFlightIcon(flight.true_track)}
              >
                <Popup>
                    <div className="text-sm -m-1">
                      <p className="font-bold font-mono m-0 p-0">{flight.callsign}</p>
                      <hr className="my-1 border-gray-500" />
                      <p className="m-0 p-0"><strong>Origin:</strong> {flight.origin_country}</p>
                      <p className="m-0 p-0"><strong>Speed:</strong> {formatSpeed(flight.velocity)}</p>
                      <p className="m-0 p-0"><strong>Altitude:</strong> {formatAltitude(flight.baro_altitude)}</p>
                      <button 
                        onClick={() => setCenterTarget([flight.latitude!, flight.longitude!])}
                        className="w-full text-center text-white bg-blue-600 rounded-md mt-2 px-2 py-1 text-xs hover:bg-blue-700 transition"
                      >
                        Center on Flight
                      </button>
                    </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>

      {/* Filter Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by callsign or origin..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="overflow-x-auto">
        {isLoading && flights.length === 0 ? (
          <p className="text-center text-gray-400 py-4">Fetching live flight data...</p>
        ) : flights.length > 0 ? (
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-800 text-gray-300 text-sm">
              <tr>
                <th className="p-3 font-semibold cursor-pointer select-none" onClick={() => requestSort('callsign')}>
                  Callsign{getSortIndicator('callsign')}
                </th>
                <th className="p-3 font-semibold cursor-pointer select-none" onClick={() => requestSort('origin_country')}>
                  Origin{getSortIndicator('origin_country')}
                </th>
                <th className="p-3 font-semibold cursor-pointer select-none" onClick={() => requestSort('velocity')}>
                  Speed{getSortIndicator('velocity')}
                </th>
                <th className="p-3 font-semibold cursor-pointer select-none" onClick={() => requestSort('baro_altitude')}>
                  Altitude{getSortIndicator('baro_altitude')}
                </th>
                <th className="p-3 font-semibold">Coordinates</th>
              </tr>
            </thead>
            <tbody>
              {processedFlights.map((flight) => (
                <tr key={flight.icao24} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="p-3 font-mono">{flight.callsign}</td>
                  <td className="p-3">{flight.origin_country}</td>
                  <td className="p-3">{formatSpeed(flight.velocity)}</td>
                  <td className="p-3">{formatAltitude(flight.baro_altitude)}</td>
                  <td className="p-3 text-xs font-mono">
                    {flight.latitude?.toFixed(4)}, {flight.longitude?.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-400 py-4">No live flights detected in the region currently.</p>
        )}
        {flights.length > 0 && processedFlights.length === 0 && (
          <p className="text-center text-gray-400 py-4">No flights match your filter criteria.</p>
        )}
      </div>
    </div>
  );
}