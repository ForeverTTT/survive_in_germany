
import { GoogleGenAI, Type } from "@google/genai";
import { GameStats, Scenario } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNextScenario = async (currentStats: GameStats, lastAction: string): Promise<Scenario> => {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    当前状态: ${JSON.stringify(currentStats)}
    上一步操作: ${lastAction}
    请生成下一个充满挑战的德国留学场景。
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          imagePrompt: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                resultDescription: { type: Type.STRING },
                statChanges: {
                  type: Type.OBJECT,
                  properties: {
                    ects: { type: Type.NUMBER },
                    money: { type: Type.NUMBER },
                    sanity: { type: Type.NUMBER },
                    semester: { type: Type.NUMBER },
                  }
                }
              },
              required: ["text", "resultDescription", "statChanges"]
            }
          }
        },
        required: ["title", "description", "imagePrompt", "options"]
      }
    }
  });

  const scenario = JSON.parse(response.text);
  scenario.id = Math.random().toString(36).substr(2, 9);
  return scenario;
};

export const generateScenarioImage = async (prompt: string): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [{ text: `A photorealistic, cinematic movie still of: ${prompt}. Cinematic lighting, melancholic German city vibe, 16:9 aspect ratio.` }]
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return 'https://picsum.photos/1200/800'; // Fallback
};
