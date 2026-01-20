
import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  // Fix: Initializing GoogleGenAI strictly following the requirement to use named parameter with process.env.API_KEY
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const editImageWithAI = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image,
              mimeType: 'image/png',
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("AI Image Edit Error:", error);
    return null;
  }
};

export const getAIChatResponse = async (message: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: "You are the BLOXGAME AI assistant. You help users understand games and the platform. Keep it short and cool."
      }
    });
    return response.text || "I'm busy at the moment, try again later!";
  } catch (error) {
    return "Something went wrong with my circuits.";
  }
};
