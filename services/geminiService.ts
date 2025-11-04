
import { GoogleGenAI } from "@google/genai";
import { Airport } from '../types';

// This service is responsible for communicating with the Gemini AI model.

// Initialize the Google GenAI client.
// The API key is securely managed by the environment and not hardcoded.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Generates an eco-friendly travel plan using the Gemini AI model.
 * @param fromAirport The departure airport.
 * @param toAirport The arrival airport.
 * @param distance The flight distance in kilometers.
 * @param emissions The estimated CO2 emissions in kilograms.
 * @returns A string containing the AI-generated travel plan.
 */
export async function generateEcoPlan(
  fromAirport: Airport,
  toAirport: Airport,
  distance: number,
  emissions: number
): Promise<string> {
  // We create a detailed prompt for the AI to ensure it gives a relevant and helpful response.
  const prompt = `
    You are an expert eco-travel assistant for a project called "EcoFly".
    A user is planning a flight from ${fromAirport.name} (${fromAirport.city}, ${fromAirport.iata}) to ${toAirport.name} (${toAirport.city}, ${toAirport.iata}).
    The flight distance is approximately ${Math.round(distance)} km, producing about ${emissions.toFixed(1)} kg of CO₂ per passenger.

    Please provide a concise, actionable, and encouraging eco-friendly travel plan for this specific trip.
    Structure your response in Markdown.
    Include a friendly introductory sentence.
    Then, provide 3-4 bullet points with practical tips covering topics like:
    - Choosing more sustainable airlines or routes if possible.
    - Packing light.
    - Carbon offsetting.
    - Using public transport at the destination city (${toAirport.city}).
    Keep the tone positive and helpful.
  `;

  try {
    // We send the prompt to the Gemini model and ask for a response.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    // We extract the text content from the AI's response.
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to generate the eco-plan from AI. The service may be temporarily unavailable.");
  }
}
