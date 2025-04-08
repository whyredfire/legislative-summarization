import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../configs/vars";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const geminiApi = async (prompt) => {
  return await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
};

export default geminiApi;
