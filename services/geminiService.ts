import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse, Classification } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is missing. The service requires a valid API key.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    classification: {
      type: Type.STRING,
      enum: ["AI_GENERATED", "HUMAN"],
      description: "The final verdict of the analysis."
    },
    confidence: {
      type: Type.NUMBER,
      description: "A decimal value strictly between 0 and 1 representing the combined confidence score."
    },
    language: {
      type: Type.STRING,
      description: "The detected language of the audio."
    },
    explanation: {
      type: Type.STRING,
      description: "A concise justification for the classification based on the three analysis components."
    }
  },
  required: ["classification", "confidence", "language", "explanation"]
};

export const analyzeAudio = async (base64Audio: string): Promise<AnalysisResponse> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Unauthorized request.");
  }

  const model = "gemini-2.5-flash"; 

  const prompt = `
    Act as Swara Sethu, a secure, high-precision AI voice detection service.
    
    You are a REST-based expert system composed of exactly three independent analysis components. 
    You must analyze the provided audio file to detect if it is AI_GENERATED or HUMAN.

    Input Constraints:
    - Language Support: Only Tamil, Telugu, Malayalam, Hindi, and English.
    - If the language is not one of these, throw an error or classify as 'UNKNOWN' language in the explanation and set confidence to 0.

    Analysis Architecture (Simulate these models deeply):
    
    1. CNN-based Acoustic Analyzer (Sound Engineer Persona):
       - Scan for synthetic smoothness, lack of background noise floor, spectral artifacts, and unnatural harmonic consistency.
       - Detect phase coherence issues common in vocoders.
       
    2. LSTM-based Temporal & Emotional Analyzer (Psychologist Persona):
       - Analyze emotional uniformity (flat affect), unnatural repetition of cadence, and rigid temporal patterns.
       - Detect lack of micro-tremors in pitch associated with human emotion.
       
    3. XGBoost-based Physiological Analyzer (Doctor Persona):
       - Detect missing breathing cues (inspiratory gasps), abnormal pause behavior (too short/long), and unrealistic speech continuity (speaking too long without air).

    Decision Logic:
    - Generate an internal probability score (0-1) for each of the three components.
    - Combine these into a single final 'confidence' score (0-1).
    - If Confidence > 0.5 and traits match synthetic patterns, classify as AI_GENERATED.
    - If Confidence > 0.5 and traits match natural physiological patterns, classify as HUMAN.

    Output Rules:
    - Return a strictly JSON object.
    - The JSON must match the schema provided.
    - 'explanation' should briefly mention the findings of the CNN, LSTM, and XGBoost components.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
            { text: prompt },
            {
                inlineData: {
                    mimeType: "audio/mp3",
                    data: base64Audio
                }
            }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.1, // Low temperature for deterministic, analytical output
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("Empty response from analysis service.");
    }

    const json = JSON.parse(text) as AnalysisResponse;
    return json;

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    // Transform generic errors into domain-specific messages if possible
    throw new Error(error.message || "Failed to analyze audio. Please ensure the file is a valid MP3 and try again.");
  }
};