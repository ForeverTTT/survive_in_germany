
import { GoogleGenAI, Type } from "@google/genai";
import { GameStats, Scenario } from "../data/types";
import { SYSTEM_INSTRUCTION } from "../config/constants";

// 获取 API Key（Vite 环境变量）
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// 调试信息
if (!apiKey) {
  console.error("❌ 未找到 VITE_GEMINI_API_KEY！");
  console.log("请检查：");
  console.log("1. .env 文件是否存在");
  console.log("2. 文件中是否有：VITE_GEMINI_API_KEY=你的密钥");
  console.log("3. 是否重启了服务（npm run all）");
} else {
  console.log("✅ API Key 已加载，长度:", apiKey.length);
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateNextScenario = async (currentStats: GameStats, lastAction: string): Promise<Scenario> => {
  if (!ai) {
    console.error("❌ Cannot generate scenario: API key not configured");
    throw new Error("API_KEY_MISSING: Please configure your Gemini API key in .env file");
  }

  const model = 'gemini-3-flash-preview';
  const prompt = `
    当前状态: ${JSON.stringify(currentStats)}
    上一步操作: ${lastAction}
    请生成下一个充满挑战的德国留学场景。
  `;

  try {
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
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    if (err.message?.includes('quota') || err.message?.includes('429')) {
      throw new Error("API_QUOTA_EXCEEDED: Gemini API quota exceeded");
    }
    throw err;
  }
};

export const generateScenarioImage = async (prompt: string): Promise<string> => {
  if (!ai) {
    console.warn("⚠️ Cannot generate image: API key not configured, using fallback");
    return 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1920&q=80';
  }

  try {
    console.log("🎨 开始生成图片，场景:", prompt);
    const model = 'gemini-2.5-flash-image';
    
    // 参考提供的格式：强化德国阴冷抑郁风格
    const enhancedPrompt = `A photorealistic, cinematic movie still of: ${prompt} in Germany. 
    Cinematic lighting, melancholic German city vibe, cold atmosphere, overcast grey sky, 
    desaturated colors, winter or autumn season, documentary photography style, 
    depressing mood, lonely feeling, harsh weather, German architecture visible.
    16:9 aspect ratio, high quality, detailed.`;
    
    console.log("📝 完整提示词:", enhancedPrompt);
    
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: enhancedPrompt }]
      }
    });

    console.log("📦 收到AI响应");

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = `data:image/png;base64,${part.inlineData.data}`;
        console.log("✅ 图片生成成功！数据长度:", part.inlineData.data.length);
        return imageData;
      }
    }
    
    console.warn("⚠️ 响应中没有图片数据，使用fallback");
    return 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1920&q=80';
  } catch (err: any) {
    console.error("❌ 图片生成失败:", err.message);
    console.error("错误详情:", err);
    if (err.message?.includes('quota') || err.message?.includes('429')) {
      console.error("💸 API quota 已用完");
    }
    return 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1920&q=80';
  }
};
