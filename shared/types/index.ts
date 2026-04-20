// =============================================================
// SHARED TYPES — Dùng chung cho cả API (backend) và Mobile
// Thêm type mới tại đây, KHÔNG định nghĩa lại ở api/ hay mobile/
// =============================================================

// --- User ---
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  createdAt: string;
}

// --- Lesson ---
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  level: Level;
  thumbnailUrl?: string;
  createdAt: string;
}

// --- Vocabulary ---
export interface Vocabulary {
  _id: string;
  lessonId: string;
  word: string;
  meaning: string;        // nghĩa tiếng Việt
  pronunciation: string;  // phiên âm IPA
  examples: string[];     // câu ví dụ
  audioUrl?: string;
}

// --- Quiz ---
export interface QuizQuestion {
  _id: string;
  lessonId: string;
  question: string;
  options: string[];      // 4 đáp án
  correctIndex: number;   // index của đáp án đúng (0-3)
  explanation?: string;
}

export interface QuizResult {
  userId: string;
  lessonId: string;
  score: number;          // số câu đúng
  total: number;          // tổng số câu
  completedAt: string;
}

// --- Progress ---
export interface UserProgress {
  userId: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  lastAccessedAt: string;
}

// --- API Response wrapper ---
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
}
