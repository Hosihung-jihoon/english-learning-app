// =============================================================
// SHARED CONSTANTS — Dùng chung cho cả API và Mobile
// =============================================================

// --- API Routes ---
// Dùng ở: api/ (định nghĩa route), mobile/ (gọi fetch)
export const API_ROUTES = {
  // Auth
  AUTH_REGISTER:  '/api/auth/register',
  AUTH_LOGIN:     '/api/auth/login',
  AUTH_ME:        '/api/auth/me',

  // Lessons
  LESSONS:        '/api/lessons',
  LESSON_BY_ID:   (id: string) => `/api/lessons/${id}`,

  // Vocabulary
  VOCABULARY:           '/api/vocabulary',
  VOCABULARY_BY_LESSON: (lessonId: string) => `/api/vocabulary?lessonId=${lessonId}`,

  // Quiz
  QUIZ:           '/api/quiz',
  QUIZ_BY_LESSON: (lessonId: string) => `/api/quiz?lessonId=${lessonId}`,
  QUIZ_SUBMIT:    '/api/quiz/submit',

  // Progress
  PROGRESS:       '/api/progress',
} as const;

// --- Error Codes ---
export const ERROR_CODES = {
  UNAUTHORIZED:    'UNAUTHORIZED',
  NOT_FOUND:       'NOT_FOUND',
  VALIDATION:      'VALIDATION_ERROR',
  SERVER_ERROR:    'SERVER_ERROR',
} as const;

// --- App Constants ---
export const APP_CONFIG = {
  APP_NAME: 'English Learning App',
  VERSION:  '1.0.0',
  LEVELS:   ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const,
} as const;
