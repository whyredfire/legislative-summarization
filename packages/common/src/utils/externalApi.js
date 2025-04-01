import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function addSummaryDetails(text, summary) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Analyze the input text provided below delimited by ---. Extract details *only* from this text related to any legal case mentioned within it.

    ---
    ${text}
    ---
    
    Generate a response containing *only* a single, raw JSON object summarizing the extracted details. The JSON object must strictly adhere to the following schema. Populate the values *using only information explicitly found* within the provided input text. If specific information for a field is not present in the text, use an empty string \\"\\" for string fields or an empty array [] for the timeline field.
    
    JSON Schema:
    {
      "name": "string - The official name of the legal case mentioned in the text. Use an empty string \\"\\" if no name is found.",
      "timeline": "array<string> - An array of strings, where each string describes a key date or significant event related to the case mentioned in the text. Use an empty array [] if no timeline details are found.",
      "lawyer_details": "string - Names of lawyers or legal teams mentioned in the text. Use an empty string \\"\\" if none are found.",
      "court_details": "string - The court(s) involved, as mentioned in the text. Use an empty string \\"\\" if none are found.",
      "verdict": "string - The final decision, judgment, or outcome described in the text. Use an empty string \\"\\" if none is found."
    }
    
    Your response must contain *only* the raw JSON object. Do not include any introductory text, explanations, markdown formatting (like \\\`\\\`\\\`json\\\`\\\`\\\`), or any other characters outside the JSON structure itself.
    `,
  });

  // remove markdown formatting
  var res = JSON.parse(
    response.text.replace(/^\`\`\`json\s*/, "").replace(/\`\`\`$/, "")
  );

  // append summary
  res["summary"] = summary;
  return res;
}
