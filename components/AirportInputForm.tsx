import React, { useState } from 'react';
import { Airport } from '../types';
import { AIRPORTS } from '../constants';

// Define the properties that this component receives from its parent (App.tsx)
interface AirportInputFormProps {
  fromAirport: Airport | null;
  setFromAirport: (airport: Airport | null) => void;
  toAirport: Airport | null;
  setToAirport: (airport: Airport | null) => void;
  onCalculate: () => void;
}

// A reusable input component with autocomplete functionality
const AutocompleteInput: React.FC<{
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  placeholder: string;
}> = ({ value, onChange, placeholder }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Airport[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery.length > 0) {
      const filtered = AIRPORTS.filter(airport =>
        airport.name.toLowerCase().includes(newQuery.toLowerCase()) ||
        airport.city.toLowerCase().includes(newQuery.toLowerCase()) ||
        airport.iata.toLowerCase().includes(newQuery.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
      onChange(null);
    }
  };

  const handleSelectSuggestion = (airport: Airport) => {
    setQuery(`${airport.name} (${airport.iata})`);
    onChange(airport);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={value ? `${value.name} (${value.iata})` : query}
        onChange={handleInputChange}
        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-gray-800 border border-gray-600 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
          {suggestions.map(airport => (
            <li
              key={airport.iata}
              onClick={() => handleSelectSuggestion(airport)}
              className="p-3 hover:bg-gray-700 cursor-pointer"
            >
              {airport.name}, {airport.city} ({airport.iata})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


// This component is the main form where users input their flight route.
export default function AirportInputForm({
  fromAirport,
  setFromAirport,
  toAirport,
  setToAirport,
  onCalculate,
}: AirportInputFormProps): React.ReactElement {
  return (
    <div className="space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-300 mb-1">🌍 From</label>
        <AutocompleteInput
          value={fromAirport}
          onChange={setFromAirport}
          placeholder="e.g., Kathmandu or KTM"
        />
      </div>
      <div className="hidden md:block text-2xl pt-6">→</div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-300 mb-1">✈️ To</label>
        <AutocompleteInput
          value={toAirport}
          onChange={setToAirport}
          placeholder="e.g., London or LHR"
        />
      </div>
      <div className="pt-0 md:pt-6">
        <button
          onClick={onCalculate}
          className="w-full md:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300 shadow"
        >
          Calculate
        </button>
      </div>
    </div>
  );
}