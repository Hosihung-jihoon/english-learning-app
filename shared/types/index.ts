export type UserRole = 'student' | 'admin';
export type TargetType = 'toeic' | 'ielts';
export type LessonContentType = 'vocabulary' | 'grammar' | 'sentence-pattern';
export type CollectionFilter = 'vocabulary' | 'sentence-pattern' | 'grammar' | 'listening-speaking';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface ExampleSentence {
  english: string;
  vietnamese: string;
}

export interface QuizQuestion {
  id: string;
  instruction: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Flashcard {
  id: string;
  collectionId: string;
  word: string;
  meaning: string;
  example?: ExampleSentence;
  note?: string;
  lessonId?: string;
}

export interface LessonContent {
  id: string;
  courseId: string;
  title: string;
  label: string;
  questionCount: number;
  duration: string;
  contentType: LessonContentType;
  description: string;
  theory: string[];
  example: ExampleSentence;
  guidance: string[];
  quiz: QuizQuestion[];
}

export interface CourseContent {
  id: string;
  targetType: TargetType;
  unitLabel: string;
  title: string;
  description: string;
  progressPercent: number;
  duration: string;
  lessonIds: string[];
  lockedAssessmentTitle?: string;
}

export interface TargetContent {
  type: TargetType;
  title: string;
  badge: string;
  modules: string;
  hours: string;
  description: string;
  courseIds: string[];
}

export interface CollectionSummary {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  filter: CollectionFilter;
  flashcardCount: number;
  accentColor: string;
  softColor: string;
  colors: [string, string];
  icon: string;
  previewWord: string;
  previewMeaning: string;
  relatedLessonId?: string;
}

export interface CategorySummary {
  id: string;
  title: string;
  countLabel: string;
  filter: CollectionFilter;
  collectionId: string;
  colors: [string, string];
  icon: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  avatarUrl?: string;
  planLabel: string;
  scoreLabel: string;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
}

export interface QuizAnswerPayload {
  questionId: string;
  selectedAnswer: string;
}

export interface MistakeReviewItem {
  id: string;
  lessonId: string;
  lessonTitle: string;
  questionId: string;
  prompt: string;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export interface QuizSubmissionResult {
  lessonId: string;
  lessonTitle: string;
  score: number;
  total: number;
  xpEarned: number;
  correctQuestionIds: string[];
  incorrectQuestionIds: string[];
  mistakes: MistakeReviewItem[];
}

export interface UserProgressRecord {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  status: ProgressStatus;
  lastAccessedAt: string;
  completedAt?: string;
  score?: number;
  totalQuestions?: number;
  xpEarned: number;
}

export interface ProgressSnapshot {
  streakDays: number;
  coursesStarted: number;
  lessonsCompleted: number;
  totalXp: number;
  records: UserProgressRecord[];
}

export interface ProfileMetric {
  name: string;
  value: number;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  level: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  subtitle: string;
  targetType: TargetType;
  unlocked: boolean;
}

export interface ProfileSummary {
  user: UserProfile;
  progress: ProgressSnapshot;
  metrics: ProfileMetric[];
  achievements: Achievement[];
  certificates: Certificate[];
}

export interface Assessment {
  id: string;
  targetType: TargetType;
  title: string;
  description: string;
  recommendedCourseId: string;
  questions: QuizQuestion[];
}

export interface AssessmentResult {
  assessmentId: string;
  targetType: TargetType;
  score: number;
  total: number;
  recommendedCourseId: string;
}

export interface OnboardingAnswer {
  id: string;
  label: string;
  description?: string;
}
