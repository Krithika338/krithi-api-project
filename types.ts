export enum Classification {
  AI_GENERATED = "AI_GENERATED",
  HUMAN = "HUMAN",
  UNKNOWN = "UNKNOWN"
}

export interface AnalysisResponse {
  classification: Classification;
  confidence: number;
  language: string;
  explanation: string;
}

export enum ProcessingStage {
  IDLE = "IDLE",
  UPLOADING = "UPLOADING",
  ANALYZING_CNN = "ANALYZING_CNN", // Acoustic
  ANALYZING_LSTM = "ANALYZING_LSTM", // Temporal/Emotional
  ANALYZING_XGB = "ANALYZING_XGB", // Physiological
  DECIDING = "DECIDING",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR"
}

export interface AnalysisError {
  message: string;
  code: string;
}
