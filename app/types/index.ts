export interface Question {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface MessageState {
  type: "success" | "error";
  text: string;
}

export interface StudySessionStats {
  totalQuestions: number;
  studied: number;
  remaining: number;
  lastStudied?: string; // ID of the last studied question
}
