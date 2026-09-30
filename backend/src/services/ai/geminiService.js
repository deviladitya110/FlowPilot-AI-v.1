const { GoogleGenAI } = require('@google/genai');
const { aiAnalysisSchema } = require('../../validators/aiValidator');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
You are an organizational workflow classification engine.

Analyze the incoming request.

Return ONLY valid JSON.

Do not return markdown.
Do not return explanations outside JSON.

Determine:

category
priority
department
intent
recommendedAction
requiresHumanReview
confidence
reason

Allowed category values:
- IT_SUPPORT
- HR
- FINANCE
- ACADEMIC
- ADMINISTRATION
- GENERAL

Allowed priority values:
- LOW
- MEDIUM
- HIGH
- CRITICAL

Allowed actions:
- AUTO_APPROVE
- AUTO_ROUTE
- CREATE_SUPPORT_TICKET
- REQUEST_INFORMATION
- HUMAN_REVIEW

Base your decision only on the provided request and configured business rules.
If the request is ambiguous or potentially high-risk, requiresHumanReview should be true.
`;

const analyzeRequest = async (requestText) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: requestText,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      }
    });

    const jsonText = response.text;
    const parsedData = JSON.parse(jsonText);
    
    // Validate with Zod
    const validatedData = aiAnalysisSchema.parse(parsedData);
    
    return validatedData;
  } catch (error) {
    console.error('Gemini API Error or Validation Error:', error);
    throw new Error('AI Analysis Failed');
  }
};

module.exports = { analyzeRequest };
