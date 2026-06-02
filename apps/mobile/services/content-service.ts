import type {
  Assessment,
  AssessmentResult,
  CollectionSummary,
  CourseContent,
  Flashcard,
  LessonContent,
  MistakeReviewItem,
  ProfileSummary,
  ProgressSnapshot,
  QuizQuestion,
  QuizSubmissionResult,
  TargetContent,
  UserProgressRecord,
} from '../../../shared/types';
import {
  defaultTargets,
  defaultCourses,
  defaultLessons,
  defaultCollections,
  defaultFlashcards,
  defaultAssessments,
  defaultAchievements,
} from '../../../shared/seed/default-content';

export const filterLabels: Record<CollectionSummary['filter'], string> = {
  vocabulary: 'Từ vựng',
  'sentence-pattern': 'Mẫu câu',
  grammar: 'Ngữ pháp',
  'listening-speaking': 'Nghe nói',
};

// In-memory state for offline operations
const userProgressRecords: UserProgressRecord[] = [
  {
    id: 'pr-1',
    userId: '507f1f77bcf86cd799439011',
    courseId: 'toeic-nouns',
    lessonId: 'noun-types',
    status: 'completed',
    lastAccessedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    score: 3,
    totalQuestions: 3,
    xpEarned: 30,
  },
];

const customCollections: CollectionSummary[] = [];
const customFlashcards: Flashcard[] = [];
const reviewMistakes: MistakeReviewItem[] = [
  {
    id: 'm1',
    lessonId: 'noun-types',
    lessonTitle: 'Các loại danh từ',
    questionId: 'nq2',
    prompt: 'She bought a beautiful book yesterday.',
    selectedAnswer: 'beautiful',
    correctAnswer: 'book',
    explanation: '`book` là danh từ chỉ sự vật.',
  },
  {
    id: 'm2',
    lessonId: 'noun-position',
    lessonTitle: 'Vị trí danh từ',
    questionId: 'np2',
    prompt: 'We finished the report yesterday.',
    selectedAnswer: 'finished',
    correctAnswer: 'report',
    explanation: '`report` là tân ngữ của động từ `finished`.',
  },
];

let totalXp = 1200;

export async function getTargets(token: string): Promise<TargetContent[]> {
  await new Promise((r) => setTimeout(r, 100));
  return defaultTargets;
}

export async function getTarget(token: string, type: string): Promise<TargetContent> {
  await new Promise((r) => setTimeout(r, 100));
  const t = defaultTargets.find((x) => x.type === type);
  if (!t) throw new Error('Target not found');
  return t;
}

export async function getCourses(token: string): Promise<CourseContent[]> {
  await new Promise((r) => setTimeout(r, 100));
  return defaultCourses.map((course) => {
    const courseLessons = defaultLessons.filter((l) => l.courseId === course.id);
    const completedCount = courseLessons.filter((l) =>
      userProgressRecords.some((rec) => rec.lessonId === l.id && rec.status === 'completed')
    ).length;
    const progressPercent = courseLessons.length > 0
      ? Math.round((completedCount / courseLessons.length) * 100)
      : 0;
    return {
      ...course,
      progressPercent,
    };
  });
}

export async function getCourse(token: string, courseId: string): Promise<CourseContent> {
  await new Promise((r) => setTimeout(r, 100));
  const course = defaultCourses.find((c) => c.id === courseId);
  if (!course) throw new Error('Course not found');

  const courseLessons = defaultLessons.filter((l) => l.courseId === course.id);
  const completedCount = courseLessons.filter((l) =>
    userProgressRecords.some((rec) => rec.lessonId === l.id && rec.status === 'completed')
  ).length;
  const progressPercent = courseLessons.length > 0
    ? Math.round((completedCount / courseLessons.length) * 100)
    : 0;

  return {
    ...course,
    progressPercent,
  };
}

export async function getLessons(token: string, courseId?: string): Promise<LessonContent[]> {
  await new Promise((r) => setTimeout(r, 100));
  if (courseId) {
    return defaultLessons.filter((l) => l.courseId === courseId);
  }
  return defaultLessons;
}

export async function getLesson(token: string, lessonId: string): Promise<LessonContent> {
  await new Promise((r) => setTimeout(r, 100));
  const l = defaultLessons.find((x) => x.id === lessonId);
  if (!l) throw new Error('Lesson not found');
  return l;
}

export async function getLessonVocabulary(token: string, lessonId: string): Promise<Flashcard[]> {
  await new Promise((r) => setTimeout(r, 100));
  const all = [...defaultFlashcards, ...customFlashcards];
  return all.filter((f) => f.lessonId === lessonId);
}

export async function getLessonQuiz(token: string, lessonId: string): Promise<QuizQuestion[]> {
  await new Promise((r) => setTimeout(r, 100));
  const l = defaultLessons.find((x) => x.id === lessonId);
  return l ? l.quiz : [];
}

export async function submitLessonQuiz(
  token: string,
  payload: { lessonId: string; answers: Array<{ questionId: string; selectedAnswer: string }> },
): Promise<QuizSubmissionResult> {
  await new Promise((r) => setTimeout(r, 500));
  const lesson = defaultLessons.find((l) => l.id === payload.lessonId);
  if (!lesson) {
    throw new Error('Lesson not found');
  }

  const mistakes: MistakeReviewItem[] = [];
  const correctQuestionIds: string[] = [];
  const incorrectQuestionIds: string[] = [];
  let score = 0;

  for (const item of payload.answers) {
    const question = lesson.quiz.find((q) => q.id === item.questionId);
    if (!question) continue;

    const isCorrect = question.correctAnswer.trim().toLowerCase() === item.selectedAnswer.trim().toLowerCase();
    if (isCorrect) {
      score++;
      correctQuestionIds.push(question.id);
    } else {
      incorrectQuestionIds.push(question.id);
      const mistake: MistakeReviewItem = {
        id: `mistake-${Date.now()}-${Math.random()}`,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        questionId: question.id,
        prompt: question.prompt,
        selectedAnswer: item.selectedAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      };
      mistakes.push(mistake);
      reviewMistakes.push(mistake);
    }
  }

  const xpEarned = score * 10;
  totalXp += xpEarned;

  const existingRecordIndex = userProgressRecords.findIndex((rec) => rec.lessonId === lesson.id);
  const newRecord: UserProgressRecord = {
    id: existingRecordIndex !== -1 ? userProgressRecords[existingRecordIndex].id : `record-${Date.now()}`,
    userId: '507f1f77bcf86cd799439011',
    courseId: lesson.courseId,
    lessonId: lesson.id,
    status: 'completed',
    lastAccessedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    score,
    totalQuestions: lesson.quiz.length,
    xpEarned: (existingRecordIndex !== -1 ? userProgressRecords[existingRecordIndex].xpEarned : 0) + xpEarned,
  };

  if (existingRecordIndex !== -1) {
    userProgressRecords[existingRecordIndex] = newRecord;
  } else {
    userProgressRecords.push(newRecord);
  }

  return {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    score,
    total: lesson.quiz.length,
    xpEarned,
    correctQuestionIds,
    incorrectQuestionIds,
    mistakes,
  };
}

export async function getCollections(token: string): Promise<CollectionSummary[]> {
  await new Promise((r) => setTimeout(r, 100));
  const mappedCustom = customCollections.map((col) => {
    const flashcardsInCol = customFlashcards.filter((f) => f.collectionId === col.id);
    return {
      ...col,
      flashcardCount: flashcardsInCol.length,
      subtitle: `${flashcardsInCol.length} flashcard`,
    };
  });
  return [...defaultCollections, ...mappedCustom];
}

export async function getCollection(token: string, collectionId: string): Promise<CollectionSummary> {
  await new Promise((r) => setTimeout(r, 100));
  const all = [...defaultCollections, ...customCollections];
  const col = all.find((x) => x.id === collectionId);
  if (!col) throw new Error('Collection not found');
  const flashcardsInCol = [...defaultFlashcards, ...customFlashcards].filter((f) => f.collectionId === col.id);
  return {
    ...col,
    flashcardCount: flashcardsInCol.length,
    subtitle: `${flashcardsInCol.length} flashcard`,
  };
}

export async function getCollectionFlashcards(token: string, collectionId: string): Promise<Flashcard[]> {
  await new Promise((r) => setTimeout(r, 100));
  const all = [...defaultFlashcards, ...customFlashcards];
  return all.filter((f) => f.collectionId === collectionId);
}

export async function createCollection(
  token: string,
  payload: { title: string; description?: string; filter: CollectionSummary['filter'] },
): Promise<CollectionSummary> {
  await new Promise((r) => setTimeout(r, 400));
  const newCol: CollectionSummary = {
    id: `custom-col-${Date.now()}`,
    title: payload.title,
    subtitle: '0 flashcard',
    description: payload.description || '',
    filter: payload.filter,
    flashcardCount: 0,
    accentColor: '#55ba5d',
    softColor: '#f6fff6',
    colors: ['#a8f0b2', '#55ba5d'],
    icon: 'folder-open-outline',
    previewWord: 'New Word',
    previewMeaning: 'Nghĩa mới',
  };
  customCollections.push(newCol);
  return newCol;
}

export async function createFlashcard(
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
): Promise<Flashcard> {
  await new Promise((r) => setTimeout(r, 400));
  const newFc: Flashcard = {
    id: `custom-fc-${Date.now()}`,
    collectionId,
    word: payload.word,
    meaning: payload.meaning,
    note: payload.note,
    lessonId: payload.lessonId,
  };
  if (payload.exampleEnglish || payload.exampleVietnamese) {
    newFc.example = {
      english: payload.exampleEnglish || '',
      vietnamese: payload.exampleVietnamese || '',
    };
  }
  customFlashcards.push(newFc);

  const colIndex = customCollections.findIndex((c) => c.id === collectionId);
  if (colIndex !== -1) {
    customCollections[colIndex].previewWord = payload.word;
    customCollections[colIndex].previewMeaning = payload.meaning;
  }
  return newFc;
}

export async function getProfile(token: string): Promise<ProfileSummary> {
  await new Promise((r) => setTimeout(r, 200));

  const coursesStarted = new Set(userProgressRecords.map((rec) => rec.courseId)).size;
  const lessonsCompleted = userProgressRecords.filter((rec) => rec.status === 'completed').length;

  const mockSnapshot: ProgressSnapshot = {
    streakDays: 3,
    coursesStarted,
    lessonsCompleted,
    totalXp,
    records: userProgressRecords,
  };

  const userProfile = {
    id: '507f1f77bcf86cd799439011',
    name: 'Hồ Sĩ Hùng',
    email: 'hosihung2@gmail.com',
    role: 'student' as const,
    createdAt: new Date().toISOString(),
    planLabel: 'Premium Student',
    scoreLabel: `${totalXp} XP`,
  };

  return {
    user: userProfile,
    progress: mockSnapshot,
    metrics: [
      { name: 'Bài học', value: lessonsCompleted, color: '#34ca53' },
      { name: 'XP tích lũy', value: totalXp, color: '#ffac33' },
      { name: 'Streak (ngày)', value: 3, color: '#ff5b5b' },
    ],
    achievements: defaultAchievements.map((ach) => ({
      ...ach,
      unlocked: true,
    })),
    certificates: [
      { id: 'cert-1', title: 'TOEIC Foundation', subtitle: 'Hoàn thành chặng danh từ & động từ', targetType: 'toeic', unlocked: false },
      { id: 'cert-2', title: 'IELTS Basic Vocabulary', subtitle: 'Hoàn thành chặng Academic Vocab', targetType: 'ielts', unlocked: false },
    ],
  };
}

export async function getProgress(token: string): Promise<ProgressSnapshot> {
  await new Promise((r) => setTimeout(r, 100));
  const coursesStarted = new Set(userProgressRecords.map((rec) => rec.courseId)).size;
  const lessonsCompleted = userProgressRecords.filter((rec) => rec.status === 'completed').length;

  return {
    streakDays: 3,
    coursesStarted,
    lessonsCompleted,
    totalXp,
    records: userProgressRecords,
  };
}

export async function markLessonAccess(token: string, payload: { courseId: string; lessonId: string }): Promise<UserProgressRecord> {
  await new Promise((r) => setTimeout(r, 100));
  const existingRecordIndex = userProgressRecords.findIndex((rec) => rec.lessonId === payload.lessonId);
  if (existingRecordIndex !== -1) {
    return userProgressRecords[existingRecordIndex];
  }

  const newRecord: UserProgressRecord = {
    id: `record-${Date.now()}`,
    userId: '507f1f77bcf86cd799439011',
    courseId: payload.courseId,
    lessonId: payload.lessonId,
    status: 'in_progress',
    lastAccessedAt: new Date().toISOString(),
    xpEarned: 0,
  };
  userProgressRecords.push(newRecord);
  return newRecord;
}

export async function getReviewMistakes(token: string): Promise<MistakeReviewItem[]> {
  await new Promise((r) => setTimeout(r, 100));
  return reviewMistakes;
}

export async function getAssessment(token: string, targetType: string): Promise<Assessment> {
  await new Promise((r) => setTimeout(r, 100));
  const a = defaultAssessments.find((x) => x.targetType === targetType);
  if (!a) throw new Error('Assessment not found');
  return a;
}

export async function submitAssessment(
  token: string,
  payload: { assessmentId: string; answers: Array<{ questionId: string; selectedAnswer: string }> },
): Promise<AssessmentResult> {
  await new Promise((r) => setTimeout(r, 500));
  const assessment = defaultAssessments.find((a) => a.id === payload.assessmentId);
  if (!assessment) {
    throw new Error('Assessment not found');
  }

  let score = 0;
  for (const item of payload.answers) {
    const question = assessment.questions.find((q) => q.id === item.questionId);
    if (question && question.correctAnswer.trim().toLowerCase() === item.selectedAnswer.trim().toLowerCase()) {
      score++;
    }
  }

  return {
    assessmentId: assessment.id,
    targetType: assessment.targetType,
    score,
    total: assessment.questions.length,
    recommendedCourseId: assessment.recommendedCourseId,
  };
}
