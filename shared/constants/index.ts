export const API_ROUTES = {
  AUTH_REGISTER: '/api/v1/auth/register',
  AUTH_LOGIN: '/api/v1/auth/login',
  AUTH_ME: '/api/v1/auth/me',

  USERS_PROFILE: '/api/v1/users/profile',

  TARGETS: '/api/v1/targets',
  TARGET_BY_TYPE: (type: string) => `/api/v1/targets/${type}`,

  COURSES: '/api/v1/courses',
  COURSE_BY_ID: (id: string) => `/api/v1/courses/${id}`,

  LESSONS: '/api/v1/lessons',
  LESSON_BY_ID: (id: string) => `/api/v1/lessons/${id}`,

  VOCABULARY: '/api/v1/vocabulary',
  VOCABULARY_BY_LESSON: (lessonId: string) => `/api/v1/vocabulary?lessonId=${lessonId}`,

  QUIZ: '/api/v1/quiz',
  QUIZ_BY_LESSON: (lessonId: string) => `/api/v1/quiz?lessonId=${lessonId}`,
  QUIZ_SUBMIT: '/api/v1/quiz/submit',

  COLLECTIONS: '/api/v1/collections',
  COLLECTION_BY_ID: (id: string) => `/api/v1/collections/${id}`,
  FLASHCARDS_BY_COLLECTION: (collectionId: string) => `/api/v1/collections/${collectionId}/flashcards`,
  CREATE_FLASHCARD: (collectionId: string) => `/api/v1/collections/${collectionId}/flashcards`,

  PROGRESS: '/api/v1/progress',
  PROGRESS_BY_USER: '/api/v1/progress/me',
  REVIEW_MISTAKES: '/api/v1/progress/review-mistakes',
  LESSON_ACCESS: '/api/v1/progress/lesson-access',

  ASSESSMENTS: '/api/v1/assessments',
  ASSESSMENT_BY_TARGET: (targetType: string) => `/api/v1/assessments/${targetType}`,
  ASSESSMENT_SUBMIT: '/api/v1/assessments/submit',

  CERTIFICATES: '/api/v1/certificates',
} as const;

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

export const APP_CONFIG = {
  APP_NAME: 'English Learning App',
  VERSION: '1.0.0',
  TOKEN_KEY: 'english-learning-app-token',
  ONBOARDING_KEY: 'english-learning-app-onboarding-complete',
} as const;
