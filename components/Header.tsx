import React from 'react';

// This is the header component for our application.
// It displays the title and a brief description.
export default function Header(): React.ReactElement {
  return (
    <header className="bg-gray-900 shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <h1 className="text-3xl font-bold text-green-500">
          EcoFly ✈️ – Smart CO₂ Calculator for Greener Skies
        </h1>
        <p className="text-gray-300 mt-1">
          Understand your carbon footprint and discover sustainable travel options.
        </p>
      </div>
    </header>
  );
}