import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

const getTrendingServicesDeclaration: FunctionDeclaration = {
  name: 'getTrendingServices',
  parameters: {
    type: Type.OBJECT,
    description: 'Query the Hub station for currently trending services and available stock.',
    properties: {
      category: {
        type: Type.STRING,
        description: 'Optional category filter (EATERY, SALON, MARINE, CLUB).',
      },
    },
  },
};

const checkHubLoadDeclaration: FunctionDeclaration = {
  name: 'checkHubLoad',
  parameters: {
    type: Type.OBJECT,
    description: 'Check the current demand at specific stations to advise on wait times.',
    properties: {
      station: {
        type: Type.STRING,
        description: 'Station ID to check.',
      },
    },
  },
};

export const generateAIResponse = async (userMessage: string, history: any[] = []): Promise<string> => {
  if (!process.env.API_KEY) return "Service Offline: System connection failed.";
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const hubIntel = `
    IDENTITY: You are the "Evening Sun Hub Assistant" based in Lagos, Nigeria.
    COMMUNICATION STYLE:
    - Language: Formal Nigerian English. Do NOT use Pidgin English.
    - Tone: Highly respectful, professional, and sophisticated.
    - Honorifics: Address the user as "Boss", "Chairman", "Madam", or "Sir" where appropriate.
    - Terminology: Use "Station" or "Unit" instead of Node. Use "Record" or "History" instead of Manifest. Use "Conference Room" and "VIP Room".
    - Context: Refer to the Kitchen, Salon, and Jetty as "Stations" or "Units".
    
    GUIDELINES:
    - If the user asks for food, suggest a premium drink or a gaming session for relaxation.
    - If the user expresses interest in the Club, suggest visiting the Salon first for grooming.
    - If the user plans a Marine trip, recommend ordering a refreshment hamper.
    - When a station is busy, politely advise the user to browse the supermarket while they wait.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.text }]
        })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: hubIntel,
        tools: [{ functionDeclarations: [getTrendingServicesDeclaration, checkHubLoadDeclaration] }],
      }
    });

    if (response.functionCalls) {
      const call = response.functionCalls[0];
      if (call.name === 'getTrendingServices') {
        return "Respected Boss, our 'Marching Ground Special' is currently the most requested delicacy at the Kitchen Station. Would you like to place an order?";
      }
      if (call.name === 'checkHubLoad') {
        return "Sir, the Kitchen Unit is currently experiencing high demand. While we prepare your meal, you might consider a professional grooming session at the Salon. How would you like to proceed?";
      }
    }

    return response.text || "I apologize Boss, the connection was interrupted. Kindly try again.";
  } catch (error) {
    console.error("AI Error:", error);
    return "The system is currently unavailable. Kindly try again later, Boss.";
  }
};
