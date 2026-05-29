import type {
  Assessment,
  AssessmentResult,
  CollectionSummary,
  CourseContent,
  Flashcard,
  LessonContent,
  ProfileSummary,
  ProgressSnapshot,
  QuizQuestion,
  QuizSubmissionResult,
  TargetContent,
  MistakeReviewItem,
  UserProgressRecord,
} from '../../../shared/types';
import { API_ROUTES, apiRequest } from '@/lib/api';

export const filterLabels: Record<CollectionSummary['filter'], string> = {
  vocabulary: 'Từ vựng',
  'sentence-pattern': 'Mẫu câu',
  grammar: 'Ngữ pháp',
  'listening-speaking': 'Nghe nói',
};

export function getTargets(token: string) {
  return apiRequest<TargetContent[]>(API_ROUTES.TARGETS, { token });
}

export function getTarget(token: string, type: string) {
  return apiRequest<TargetContent>(API_ROUTES.TARGET_BY_TYPE(type), { token });
}

export function getCourses(token: string) {
  return apiRequest<CourseContent[]>(API_ROUTES.COURSES, { token });
}

export function getCourse(token: string, courseId: string) {
  return apiRequest<CourseContent>(API_ROUTES.COURSE_BY_ID(courseId), { token });
}

export function getLessons(token: string, courseId?: string) {
  const route = courseId ? `${API_ROUTES.LESSONS}?courseId=${courseId}` : API_ROUTES.LESSONS;
  return apiRequest<LessonContent[]>(route, { token });
}

export function getLesson(token: string, lessonId: string) {
  return apiRequest<LessonContent>(API_ROUTES.LESSON_BY_ID(lessonId), { token });
}

export function getLessonVocabulary(token: string, lessonId: string) {
  return apiRequest<Flashcard[]>(API_ROUTES.VOCABULARY_BY_LESSON(lessonId), { token });
}

export function getLessonQuiz(token: string, lessonId: string) {
  return apiRequest<QuizQuestion[]>(API_ROUTES.QUIZ_BY_LESSON(lessonId), { token });
}

export function submitLessonQuiz(
  token: string,
  payload: { lessonId: string; answers: Array<{ questionId: string; selectedAnswer: string }> },
) {
  return apiRequest<QuizSubmissionResult>(API_ROUTES.QUIZ_SUBMIT, {
    method: 'POST',
    token,
    body: payload,
  });
}

export function getCollections(token: string) {
  return apiRequest<CollectionSummary[]>(API_ROUTES.COLLECTIONS, { token });
}

export function getCollection(token: string, collectionId: string) {
  return apiRequest<CollectionSummary>(API_ROUTES.COLLECTION_BY_ID(collectionId), { token });
}

export function getCollectionFlashcards(token: string, collectionId: string) {
  return apiRequest<Flashcard[]>(API_ROUTES.FLASHCARDS_BY_COLLECTION(collectionId), { token });
}

export function createCollection(
  token: string,
  payload: { title: string; description?: string; filter: CollectionSummary['filter'] },
) {
  return apiRequest<CollectionSummary>(API_ROUTES.COLLECTIONS, {
    method: 'POST',
    token,
    body: payload,
  });
}

export function createFlashcard(
  token: string,
  collectionId: string,
  payload: {
    word: string;
    meaning: string;
    exampleEnglish?: string;
    exampleVietnamese?: string;
    note?: string;
    lessonId?: string;
  },
) {
  return apiRequest<Flashcard>(API_ROUTES.CREATE_FLASHCARD(collectionId), {
    method: 'POST',
    token,
    body: payload,
  });
}

export function getProfile(token: string) {
  return apiRequest<ProfileSummary>(API_ROUTES.USERS_PROFILE, { token });
}

export function getProgress(token: string) {
  return apiRequest<ProgressSnapshot>(API_ROUTES.PROGRESS_BY_USER, { token });
}

export function markLessonAccess(token: string, payload: { courseId: string; lessonId: string }) {
  return apiRequest<UserProgressRecord>(API_ROUTES.LESSON_ACCESS, {
    method: 'POST',
    token,
    body: payload,
  });
}

export function getReviewMistakes(token: string) {
  return apiRequest<MistakeReviewItem[]>(API_ROUTES.REVIEW_MISTAKES, { token });
}

export function getAssessment(token: string, targetType: string) {
  return apiRequest<Assessment>(API_ROUTES.ASSESSMENT_BY_TARGET(targetType), { token });
}

export function submitAssessment(
  token: string,
  payload: { assessmentId: string; answers: Array<{ questionId: string; selectedAnswer: string }> },
) {
  return apiRequest<AssessmentResult>(API_ROUTES.ASSESSMENT_SUBMIT, {
    method: 'POST',
    token,
    body: payload,
  });
}
