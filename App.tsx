import React, { useState, useCallback } from 'react';
import { Airport, FlightState } from './types';
import { calculateDistance, calculateEmissions } from './utils/calculator';
import { generateEcoPlan } from './services/geminiService';
import Header from './components/Header';
import AirportInputForm from './components/AirportInputForm';
import CalculationResult from './components/CalculationResult';
import LiveFlightsDisplay from './components/LiveFlightsDisplay';

export default function App(): React.ReactElement {
  // State for the selected airports
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);

  // State for the calculation results
  const [distance, setDistance] = useState<number | null>(null);
  const [emissions, setEmissions] = useState<number | null>(null);

  // State for the AI-generated eco-friendly travel plan
  const [ecoPlan, setEcoPlan] = useState<string>('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // This function is called when the user wants to calculate emissions.
  const handleCalculate = useCallback(() => {
    // Reset previous results and errors
    setDistance(null);
    setEmissions(null);
    setEcoPlan('');
    setError('');

    // Check if both airports are selected
    if (fromAirport && toAirport) {
      // Calculate distance using the Haversine formula
      const dist = calculateDistance(fromAirport.latitude, fromAirport.longitude, toAirport.latitude, toAirport.longitude);
      setDistance(dist);
      
      // Calculate CO2 emissions based on the distance
      const co2 = calculateEmissions(dist);
      setEmissions(co2);
    } else {
      setError('Please select both a departure and an arrival airport.');
    }
  }, [fromAirport, toAirport]);

  // This function calls the Gemini API to get an eco-friendly travel plan.
  const handleGeneratePlan = async () => {
    if (!fromAirport || !toAirport || !distance || !emissions) return;

    setIsGeneratingPlan(true);
    setError('');
    setEcoPlan('');

    try {
      // Call the Gemini service with details about the flight
      const plan = await generateEcoPlan(fromAirport, toAirport, distance, emissions);
      setEcoPlan(plan);
    } catch (e) {
      console.error('Error generating eco plan:', e);
      setError('Could not generate AI eco-plan. Please try again.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        {/* Section 1: CO2 Calculator */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-md border border-gray-700">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">✈️ Flight CO₂ Calculator</h2>
          <AirportInputForm
            fromAirport={fromAirport}
            setFromAirport={setFromAirport}
            toAirport={toAirport}
            setToAirport={setToAirport}
            onCalculate={handleCalculate}
          />
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          
          {/* Display the calculation result and eco tips */}
          <CalculationResult 
            emissions={emissions} 
            isGeneratingPlan={isGeneratingPlan}
            ecoPlan={ecoPlan}
            onGeneratePlan={handleGeneratePlan}
            showPlanGenerator={!!emissions}
          />
        </div>

        {/* Section 2: Live Flight Tracker */}
        <LiveFlightsDisplay />
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>EcoFly &copy; 2024 - Promoting Sustainable Air Travel for Imagine Cup 2026</p>
      </footer>
    </div>
  );
}