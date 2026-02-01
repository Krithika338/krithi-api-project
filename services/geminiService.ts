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

export const analyzeAudio = async (base64Audio: string): Promise<AnalysisResponse> =>{

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ audio: base64Audio }),
  });

  if (!response.ok) {
    throw new Error("Analysis failed");
  }

  return await response.json();
};
  
