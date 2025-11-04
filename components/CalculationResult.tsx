import React from 'react';

// Define the properties this component expects to receive.
interface CalculationResultProps {
  emissions: number | null;
  isGeneratingPlan: boolean;
  ecoPlan: string;
  onGeneratePlan: () => void;
  showPlanGenerator: boolean;
}

// A simple component to display a single eco-tip.
const EcoTip: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <div className="flex items-start space-x-3">
    <span className="text-xl">{icon}</span>
    <p className="text-gray-300">{text}</p>
  </div>
);

// Formats a simple subset of Markdown (specifically bullet points) into HTML.
const formatMarkdownToHtml = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/^\* (.*$)/gm, '<li>$1</li>')
    .replace(/(<\/li><li>)/gm, '</li><li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc list-inside space-y-2">$1</ul>')
    .replace(/\n/g, '<br />');
};

// This component shows the results of the CO2 calculation and provides eco-friendly tips.
export default function CalculationResult({
  emissions,
  isGeneratingPlan,
  ecoPlan,
  onGeneratePlan,
  showPlanGenerator
}: CalculationResultProps): React.ReactElement {

  // If there are no emissions calculated yet, we don't show anything.
  if (emissions === null) {
    return null;
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Result Display */}
      <div className="text-center bg-gray-800 p-6 rounded-lg border border-gray-700">
        <p className="text-lg text-gray-200">Your flight emits approximately:</p>
        <p className="text-4xl md:text-5xl font-bold text-green-500 my-2">
          {emissions.toFixed(1)} kg CO₂
        </p>
        <p className="text-sm text-gray-400">per passenger</p>
      </div>

      {/* Eco Tips Section */}
      <div className="grid md:grid-cols-3 gap-6 text-center">
         <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h4 className="font-bold text-lg mb-2">🌱 Fly Smarter</h4>
            <EcoTip icon="✈️" text="Book nonstop on fuel-efficient carriers and fly economy." />
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h4 className="font-bold text-lg mb-2">🧳 Pack Lighter</h4>
            <EcoTip icon="♻️" text="Pack light and bring reusable items onboard to reduce weight and waste." />
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h4 className="font-bold text-lg mb-2">🌍 Travel Less</h4>
            <EcoTip icon="🤔" text="Avoid unnecessary flights; consider lower-emission alternatives like trains." />
        </div>
      </div>

      {/* AI Eco Plan Generator */}
      {showPlanGenerator && (
        <div className="text-center pt-4">
          <button
            onClick={onGeneratePlan}
            disabled={isGeneratingPlan}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isGeneratingPlan ? '💡 Generating...' : '💡 Get AI Eco-Plan'}
          </button>
        </div>
      )}

      {/* Display the AI-generated plan */}
      {ecoPlan && (
         <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg max-w-none text-left">
            <h3 className="text-blue-400 text-xl font-bold mb-4">Your Personal Eco-Plan</h3>
            <div className="space-y-3 text-gray-200" dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(ecoPlan) }} />
        </div>
      )}
    </div>
  );
}