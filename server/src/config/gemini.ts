import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './env.js';

const apiKey = env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('[Gemini] Warning: GEMINI_API_KEY / GOOGLE_API_KEY not configured. Live AI endpoints will return advisory error.');
} else {
  console.log('[Gemini] Google Gemini client initialized with model: gemini-3.5-flash');
}

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Primary and fallback models verified available on current API version
export const GEMINI_MODELS = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-flash-latest'];

export async function callGemini(
  prompt: string,
  systemInstruction?: string,
  temperature = 0.7
): Promise<string> {
  if (!genAI || !apiKey) {
    throw new Error('Gemini API key is not configured in server environment.');
  }

  let lastError: Error | null = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction ? { role: 'system', parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: {
          temperature,
          maxOutputTokens: 2048,
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) {
        return text;
      }
    } catch (err: any) {
      console.warn(`[Gemini] Model ${modelName} failed, trying next fallback:`, err?.message || err);
      lastError = err;
      
      // Fallback to direct REST fetch if SDK throws
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const bodyPayload: any = {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature, maxOutputTokens: 2048 }
        };
        if (systemInstruction) {
          bodyPayload.systemInstruction = { parts: [{ text: systemInstruction }] };
        }
        
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload)
        });
        
        const data = (await res.json()) as any;
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (restErr: any) {
        lastError = restErr;
      }
    }
  }

  throw lastError || new Error('Failed to generate content from all Gemini models.');
}

