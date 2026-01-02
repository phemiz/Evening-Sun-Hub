import { GoogleGenAI } from "@google/genai";
import { SERVICE_CATEGORIES, MOCK_PRODUCTS, MOCK_SERVICES } from "../constants";

// Helper to generate AI response for the concierge chat following strict @google/genai guidelines
export const generateAIResponse = async (userMessage: string): Promise<string> => {
  // Always verify that the API_KEY is present as per guidelines
  if (!process.env.API_KEY) {
    return "I'm currently offline (API Key missing). Please check back later!";
  }

  // Initialize the client using the correct named parameter syntax
  // Instantiate inside the function to ensure the current environment variable value is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Construct context from app data to guide the concierge
  const context = `
    You are the 'Evening Sun Concierge', a helpful AI assistant for the Evening Sun Hub application in Badagry, Lagos.
    The hub includes:
    1. Eatery & Supermarket: ${MOCK_PRODUCTS.map(p => p.name).join(', ')}.
    2. Beauty Salon & Barbing: ${Object.values(MOCK_SERVICES).flat().map(s => s.name).join(', ')}.
    3. Club & Lounge: Friday Night Grooves, Sunday Live Band.
    4. Marine Services: Boat rentals and island trips.
    
    Your goal is to be polite, use Nigerian warmth, and help users find services.
    Keep answers short (under 50 words) and direct.
    
    User Query: ${userMessage}
  `;

  try {
    // Generate content using the recommended model for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: context,
    });
    
    // Extract text from the GenerateContentResponse object's text property (not a method)
    return response.text || "I didn't catch that. Could you try again?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the server. Please try again.";
  }
};