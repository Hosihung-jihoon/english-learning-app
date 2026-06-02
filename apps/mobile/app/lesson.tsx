import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Redirect, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Flashcard, LessonContent, QuizQuestion } from '../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getLesson, getLessonQuiz, getLessonVocabulary, markLessonAccess, submitLessonQuiz } from '@/services/content-service';

const lessonIllustration = require('../assets/images/figma-lesson-illustration.png');

function buildPhonetic(word: string) {
  return `/${word.toLowerCase()}/`;
}

function getRelatedWords(theory: string[]) {
  return theory
    .slice(0, 3)
    .map((paragraph) => paragraph.replace(/^[•-]\s*/, '').trim())
    .filter(Boolean);
}

export default function LessonInfoScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isLoading: authLoading, onboardingComplete, token } = useAuth();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const normalizedLessonId = typeof lessonId === 'string' && lessonId.length > 0 ? lessonId : undefined;
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [vocabulary, setVocabulary] = useState<Flashcard[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showQuizInfo, setShowQuizInfo] = useState(false);
  const [savedQuestionIds, setSavedQuestionIds] = useState<string[]>([]);

  useEffect(() => {
    setLesson(null);
    setVocabulary([]);
    setQuiz([]);
    setError(null);
    setQuizStarted(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setChecked(false);
    setAnswers({});
    setSubmitting(false);
    setSubmitError(null);
    setShowQuizInfo(false);
    setSavedQuestionIds([]);

    if (!token || !onboardingComplete || !normalizedLessonId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const accessToken = token;
    const selectedLessonId = normalizedLessonId;
    let mounted = true;

    async function load() {
      try {
        const [lessonData, vocabularyData, quizData] = await Promise.all([
          getLesson(accessToken, selectedLessonId),
          getLessonVocabulary(accessToken, selectedLessonId),
          getLessonQuiz(accessToken, selectedLessonId),
        ]);

        if (!mounted) {
          return;
        }

        setLesson(lessonData);
        setVocabulary(vocabularyData);
        setQuiz(quizData);

        try {
          await markLessonAccess(accessToken, { courseId: lessonData.courseId, lessonId: lessonData.id });
        } catch {
          // Keep lesson content available even if background progress tracking fails.
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : 'Không tải được bài học');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [token, onboardingComplete, normalizedLessonId]);

  const scale = Math.min(width / 375, 1) * 0.92;
  const horizontal = 24 * scale;
  const question = quiz[currentIndex];
  const leadFlashcard = vocabulary[0];
  const heroWord = leadFlashcard?.word || lesson?.title || 'Accommodation';
  const heroMeaning = leadFlashcard?.meaning || lesson?.description || 'Nơi để ở hoặc sinh sống';
  const heroPhonetic = buildPhonetic(heroWord);
  const relatedWords = useMemo(() => getRelatedWords(lesson?.theory ?? []), [lesson]);
  const hasQuiz = quiz.length > 0;
  const progressPercent = ((currentIndex + 1) / Math.max(quiz.length, 1)) * 100;
  const insetBottom = Math.max(insets.bottom, 16);

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setChecked(false);
    setAnswers({});
    setSubmitting(false);
    setSubmitError(null);
  };

  const handleCheck = () => {
    if (!question || !selectedOption) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [question.id]: selectedOption,
    }));
    setSubmitError(null);
    setChecked(true);
  };

  const handleNext = async () => {
    if (!lesson || !question || !token) {
      return;
    }

    const isLast = currentIndex === quiz.length - 1;

    if (isLast) {
      setSubmitting(true);
      setSubmitError(null);

      try {
        const result = await submitLessonQuiz(token, {
          lessonId: lesson.id,
          answers: Object.entries({
            ...answers,
            [question.id]: selectedOption ?? answers[question.id] ?? '',
          }).map(([questionId, selectedAnswer]) => ({
            questionId,
            selectedAnswer: String(selectedAnswer),
          })),
        });

        router.replace({
          pathname: '/lesson-complete',
          params: {
            lessonId: result.lessonId,
            lessonTitle: result.lessonTitle,
            score: String(result.score),
            total: String(result.total),
            xpEarned: String(result.xpEarned),
            courseId: lesson.courseId,
          },
        });
      } catch (submitErrorValue) {
        setSubmitError(submitErrorValue instanceof Error ? submitErrorValue.message : 'Không nộp được kết quả bài học.');
      } finally {
        setSubmitting(false);
      }

      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setChecked(false);
  };

  if (authLoading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/(auth)/onboarding-intro-1" />;
  }

  if (!normalizedLessonId) {
    return <Redirect href="/(tabs)" />;
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <Text style={styles.errorText}>{error || 'Không tải được bài học.'}</Text>
      </SafeAreaView>
    );
  }

  if (quizStarted && question) {
    const isCorrect = selectedOption === question.correctAnswer;

    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.screen}>
          <View style={[styles.quizHeader, { paddingHorizontal: horizontal, paddingTop: 12 * scale }]}>
            <TouchableOpacity style={[styles.roundButton, { width: 42 * scale, height: 42 * scale, borderRadius: 21 * scale }]} onPress={resetQuiz}>
              <Ionicons name="chevron-back" size={24 * scale} color="#050018" />
            </TouchableOpacity>
            <Text style={[styles.quizHeaderTitle, { fontSize: 20 * scale }]}>Làm quiz</Text>
            <TouchableOpacity style={[styles.roundButton, { width: 42 * scale, height: 42 * scale, borderRadius: 21 * scale }]} onPress={() => setShowQuizInfo((current) => !current)}>
              <Ionicons name="alert-circle" size={22 * scale} color="#292d32" />
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: horizontal, marginTop: 22 * scale }}>
            <Text style={[styles.progressLabel, { fontSize: 14 * scale }]}>
              Câu hỏi {currentIndex + 1} trong {quiz.length}
            </Text>
            <View style={[styles.quizProgressTrack, { marginTop: 14 * scale, height: 8 * scale, borderRadius: 999 }]}>
              <View style={[styles.quizProgressFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: horizontal, paddingTop: 22 * scale, paddingBottom: 198 * scale + insetBottom }}>
            {showQuizInfo ? (
              <View style={[styles.quizInfoCard, { borderRadius: 18 * scale, padding: 18 * scale, marginBottom: 16 * scale }]}>
                <Text style={[styles.quizInfoTitle, { fontSize: 16 * scale }]}>Thông tin quiz</Text>
                <Text style={[styles.quizInfoText, { marginTop: 8 * scale, fontSize: 14 * scale, lineHeight: 21 * scale }]}>
                  Quiz này giúp củng cố lại bài vừa học. Bạn có thể kiểm tra từng câu, xem phản hồi ngay và hoàn tất để ghi nhận tiến độ.
                </Text>
              </View>
            ) : null}

            <View style={[styles.questionCard, { borderRadius: 16 * scale, paddingHorizontal: 20 * scale, paddingTop: 20 * scale, paddingBottom: 24 * scale }]}>
              <Text style={[styles.questionInstruction, { fontSize: 13 * scale }]}>{question.instruction}</Text>
              <Text style={[styles.questionText, { fontSize: 18 * scale, lineHeight: 26 * scale, marginTop: 12 * scale }]}>{question.prompt}</Text>
            </View>

            <View style={{ gap: 14 * scale, marginTop: 20 * scale }}>
              {question.options.map((option) => {
                const active = selectedOption === option;
                const selectedCorrect = checked && option === question.correctAnswer;
                const selectedWrong = checked && active && option !== question.correctAnswer;

                return (
                  <TouchableOpacity
                    key={option}
                    disabled={checked}
                    activeOpacity={0.9}
                    style={[
                      styles.optionRow,
                      { borderRadius: 12 * scale, paddingHorizontal: 16 * scale, minHeight: 54 * scale },
                      active && !checked && styles.optionRowSelected,
                      selectedCorrect && styles.optionRowSelected,
                      selectedWrong && styles.optionRowWrong,
                    ]}
                    onPress={() => setSelectedOption(option)}>
                    <View
                      style={[
                        styles.radioOuter,
                        { width: 24 * scale, height: 24 * scale, borderRadius: 12 * scale, marginRight: 16 * scale },
                        active && !checked && styles.radioOuterSelected,
                        selectedCorrect && styles.radioOuterSelected,
                        selectedWrong && styles.radioOuterWrong,
                      ]}>
                      {active || selectedCorrect ? <View style={[styles.radioInner, { width: 8 * scale, height: 8 * scale, borderRadius: 4 * scale }]} /> : null}
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        { fontSize: 16 * scale },
                        active && !checked && styles.optionTextSelected,
                        (selectedCorrect || selectedWrong) && styles.optionTextSelected,
                      ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View
            style={[
              styles.quizBottomArea,
              { paddingBottom: insetBottom + 12 * scale },
              checked && (isCorrect ? styles.quizBottomAreaCorrect : styles.quizBottomAreaWrong),
            ]}>
            {submitError ? <Text style={[styles.submitErrorText, { marginBottom: 12 * scale, fontSize: 13 * scale }]}>{submitError}</Text> : null}
            {checked ? (
              <View style={[styles.feedbackWrap, { marginBottom: 18 * scale }]}>
                <View style={[styles.feedbackIconCircle, { width: 48 * scale, height: 48 * scale, borderRadius: 24 * scale }, !isCorrect && styles.feedbackIconCircleWrong]}>
                  <Ionicons name={isCorrect ? 'checkmark' : 'close'} size={24 * scale} color="#ffffff" />
                </View>
                <Text style={[styles.feedbackHeadline, { fontSize: 18 * scale, marginLeft: 14 * scale, color: isCorrect ? '#48a05d' : '#eb5757' }]}>
                  {isCorrect ? 'Chính xác!' : 'Chưa đúng'}
                </Text>
                {isCorrect ? <Text style={[styles.feedbackXp, { fontSize: 18 * scale }]}> (+10 XP)</Text> : null}
                {!isCorrect ? (
                  <Text style={[styles.feedbackBody, { fontSize: 13 * scale, lineHeight: 18 * scale, marginTop: 10 * scale }]}>{question.explanation}</Text>
                ) : null}
              </View>
            ) : null}

            <View style={styles.quizButtonRow}>
              <TouchableOpacity
                style={[styles.bookmarkButton, { width: 72 * scale, height: 56 * scale, borderRadius: 28 * scale }]}
                onPress={() => {
                  setSavedQuestionIds((current) => (current.includes(question.id) ? current.filter((id) => id !== question.id) : [...current, question.id]));
                }}>
                <Ionicons name={savedQuestionIds.includes(question.id) ? 'bookmark' : 'bookmark-outline'} size={24 * scale} color={savedQuestionIds.includes(question.id) ? '#00bd50' : '#292d32'} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.quizPrimaryButton,
                  { borderRadius: 54 * scale, height: 56 * scale },
                  !checked && !selectedOption && styles.quizPrimaryDisabled,
                  checked && !isCorrect && styles.quizPrimaryWrong,
                ]}
                disabled={(!checked && !selectedOption) || submitting}
                onPress={checked ? handleNext : handleCheck}>
                <Text style={[styles.quizPrimaryText, { fontSize: 16 * scale }]}>{submitting ? 'Đang nộp...' : checked ? 'Tiếp tục' : 'Kiểm tra'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 * scale + insetBottom }}>
          <View style={[styles.lessonTopBar, { paddingHorizontal: horizontal, paddingTop: 12 * scale }]}>
            <TouchableOpacity style={[styles.roundButton, { width: 48 * scale, height: 48 * scale, borderRadius: 24 * scale }]} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24 * scale} color="#373346" />
            </TouchableOpacity>
            <View style={[styles.lessonProgressTrack, { height: 14 * scale, borderRadius: 999, marginHorizontal: 18 * scale }]}>
              <View style={[styles.lessonProgressFill, { width: '34%' }]} />
              <View style={[styles.lessonProgressBubble, { left: '28%', width: 22 * scale, height: 22 * scale, borderRadius: 11 * scale }]}>
                <Text style={[styles.lessonProgressBubbleText, { fontSize: 12 * scale }]}>2</Text>
              </View>
              <View style={[styles.lessonProgressTailBubble, { right: -2 * scale, width: 22 * scale, height: 22 * scale, borderRadius: 11 * scale }]}>
                <Text style={[styles.lessonProgressTailText, { fontSize: 12 * scale }]}>10</Text>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: horizontal, alignItems: 'center', marginTop: 24 * scale }}>
            <Image source={lessonIllustration} style={{ width: 164 * scale, height: 164 * scale }} resizeMode="contain" />

            <View style={[styles.badgeRow, { marginTop: 26 * scale }]}>
              <View style={[styles.levelBadge, { borderRadius: 10 * scale, paddingHorizontal: 16 * scale, paddingVertical: 10 * scale }]}>
                <Text style={[styles.levelBadgeText, { fontSize: 14 * scale }]}>B1</Text>
              </View>
              <View style={styles.badgeDot} />
              <View style={[styles.topicBadge, { borderRadius: 10 * scale, paddingHorizontal: 18 * scale, paddingVertical: 10 * scale }]}>
                <Text style={[styles.topicBadgeText, { fontSize: 14 * scale }]}>{lesson.label}</Text>
              </View>
            </View>

            <Text style={[styles.heroWord, { fontSize: 32 * scale, lineHeight: 38 * scale, marginTop: 26 * scale }]}>{heroWord}</Text>
            <Text style={[styles.heroPhonetic, { fontSize: 20 * scale, lineHeight: 30 * scale, marginTop: 8 * scale }]}>{heroPhonetic}</Text>

            <View style={[styles.soundButtonsRow, { marginTop: 26 * scale, gap: 16 * scale }]}>
              <TouchableOpacity style={[styles.soundButton, { width: 48 * scale, height: 48 * scale, borderRadius: 24 * scale }]}>
                <Ionicons name="volume-high" size={22 * scale} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.soundButton, { width: 48 * scale, height: 48 * scale, borderRadius: 24 * scale }]}>
                <Ionicons name="leaf-outline" size={22 * scale} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.heroMeaning, { fontSize: 18 * scale, lineHeight: 26 * scale, marginTop: 22 * scale }]}>{heroMeaning}</Text>
          </View>

          <View style={{ paddingHorizontal: horizontal, marginTop: 16 * scale }}>
            {lesson.theory.slice(0, 2).map((paragraph) => (
              <Text key={paragraph} style={[styles.exampleBullet, { fontSize: 16 * scale, lineHeight: 24 * scale, marginBottom: 10 * scale }]}>
                • {paragraph.replace(/^[•-]\s*/, '').trim()}
              </Text>
            ))}
          </View>

          <View style={[styles.relatedCard, { marginHorizontal: horizontal, marginTop: 18 * scale, borderRadius: 24 * scale, paddingHorizontal: 24 * scale, paddingTop: 22 * scale, paddingBottom: 26 * scale }]}>
            <Text style={[styles.relatedTitle, { fontSize: 18 * scale }]}>Từ liên quan</Text>

            <View style={{ marginTop: 18 * scale, gap: 18 * scale }}>
              {relatedWords.map((item) => (
                <View key={item}>
                  <Text style={[styles.relatedWord, { fontSize: 16 * scale, lineHeight: 24 * scale }]}>• {item}</Text>
                </View>
              ))}
            </View>
          </View>

          {!hasQuiz ? (
            <View style={[styles.emptyQuizCard, { marginHorizontal: horizontal, marginTop: 18 * scale, borderRadius: 18 * scale, padding: 16 * scale }]}>
              <Text style={[styles.emptyQuizTitle, { fontSize: 14 * scale }]}>Chưa có quiz cho bài học này</Text>
              <Text style={[styles.emptyQuizText, { marginTop: 6 * scale, fontSize: 12 * scale, lineHeight: 19 * scale }]}>
                Bạn vẫn có thể xem nội dung bài học, nhưng phần kiểm tra cuối bài hiện chưa sẵn sàng.
              </Text>
            </View>
          ) : null}
        </ScrollView>

        <View style={[styles.lessonBottomBar, { paddingHorizontal: 24 * scale, paddingBottom: insetBottom + 12 * scale, paddingTop: 16 * scale }]}>
          <TouchableOpacity
            style={[styles.lessonPrimaryButton, { borderRadius: 50 * scale, height: 48 * scale }, !hasQuiz && styles.lessonPrimaryButtonDisabled]}
            disabled={!hasQuiz}
            onPress={() => setQuizStarted(true)}>
            <Text style={[styles.lessonPrimaryText, { fontSize: 16 * scale }]}>Tiếp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  screen: { flex: 1, backgroundColor: '#ffffff' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  errorText: { fontFamily: Fonts.medium, fontSize: 14, color: '#ea573f', textAlign: 'center', paddingHorizontal: 24 },
  roundButton: { backgroundColor: '#faf8f8', alignItems: 'center', justifyContent: 'center' },
  lessonTopBar: { flexDirection: 'row', alignItems: 'center' },
  lessonProgressTrack: { flex: 1, backgroundColor: '#faf8f8', position: 'relative', overflow: 'visible' },
  lessonProgressFill: { height: '100%', width: '34%', backgroundColor: '#55ba5d', borderRadius: 999 },
  lessonProgressBubble: { position: 'absolute', top: -4, backgroundColor: '#55ba5d', alignItems: 'center', justifyContent: 'center' },
  lessonProgressBubbleText: { fontFamily: Fonts.semiBold, color: '#ffffff' },
  lessonProgressTailBubble: { position: 'absolute', top: -4, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  lessonProgressTailText: { fontFamily: Fonts.semiBold, color: '#9b99a3' },
  badgeRow: { flexDirection: 'row', alignItems: 'center' },
  levelBadge: { backgroundColor: '#f4b43e' },
  levelBadgeText: { fontFamily: Fonts.medium, color: '#050018' },
  badgeDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#d9d9d9', marginHorizontal: 16 },
  topicBadge: { backgroundColor: '#0085e8' },
  topicBadgeText: { fontFamily: Fonts.medium, color: '#ffffff' },
  heroWord: { fontFamily: Fonts.bold, color: '#373346', textAlign: 'center' },
  heroPhonetic: { fontFamily: Fonts.medium, color: '#696674', textAlign: 'center' },
  soundButtonsRow: { flexDirection: 'row' },
  soundButton: { backgroundColor: '#0085e8', alignItems: 'center', justifyContent: 'center' },
  heroMeaning: { fontFamily: Fonts.bold, color: '#373346', textAlign: 'center' },
  exampleBullet: { fontFamily: Fonts.regular, color: '#696674' },
  relatedCard: { backgroundColor: '#dcebfa' },
  relatedTitle: { fontFamily: Fonts.bold, color: '#373346', textAlign: 'center' },
  relatedWord: { fontFamily: Fonts.bold, color: '#696674' },
  emptyQuizCard: { backgroundColor: '#f7f4f4' },
  emptyQuizTitle: { fontFamily: Fonts.bold, color: '#373346' },
  emptyQuizText: { fontFamily: Fonts.regular, color: '#696674' },
  lessonBottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#ffffff' },
  lessonPrimaryButton: { backgroundColor: '#55ba5d', alignItems: 'center', justifyContent: 'center' },
  lessonPrimaryButtonDisabled: { backgroundColor: '#b6d7b9' },
  lessonPrimaryText: { fontFamily: Fonts.bold, color: '#ffffff' },
  quizHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  quizHeaderTitle: { fontFamily: Fonts.bold, color: '#050018' },
  progressLabel: { fontFamily: Fonts.medium, color: '#636363' },
  quizProgressTrack: { backgroundColor: '#eaeaea', overflow: 'hidden' },
  quizProgressFill: { height: '100%', backgroundColor: '#55ba5d', borderRadius: 999 },
  questionCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaeaea' },
  quizInfoCard: { backgroundColor: '#f7f4f4' },
  quizInfoTitle: { fontFamily: Fonts.bold, color: '#050018' },
  quizInfoText: { fontFamily: Fonts.regular, color: '#5c596a' },
  questionInstruction: { fontFamily: Fonts.medium, color: '#636363' },
  questionText: { fontFamily: Fonts.bold, color: '#130031' },
  optionRow: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaeaea', flexDirection: 'row', alignItems: 'center' },
  optionRowSelected: { backgroundColor: '#f1fdf0', borderColor: '#55ba5d' },
  optionRowWrong: { backgroundColor: '#fdf4f2', borderColor: '#eb5757' },
  radioOuter: { borderWidth: 2, borderColor: '#bababa', alignItems: 'center', justifyContent: 'center' },
  radioOuterSelected: { backgroundColor: '#55ba5d', borderColor: '#55ba5d' },
  radioOuterWrong: { backgroundColor: '#eb5757', borderColor: '#eb5757' },
  radioInner: { backgroundColor: '#ffffff' },
  optionText: { fontFamily: Fonts.medium, color: '#373346' },
  optionTextSelected: { fontFamily: Fonts.semiBold, color: '#48a05d' },
  quizBottomArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 34,
    backgroundColor: '#faf8f8',
  },
  quizBottomAreaCorrect: { backgroundColor: '#dff9d8' },
  quizBottomAreaWrong: { backgroundColor: '#fdf0ef' },
  feedbackWrap: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  feedbackIconCircle: { backgroundColor: '#55ba5d', alignItems: 'center', justifyContent: 'center' },
  feedbackIconCircleWrong: { backgroundColor: '#eb5757' },
  feedbackHeadline: { fontFamily: Fonts.bold },
  feedbackXp: { fontFamily: Fonts.bold, color: '#48a05d' },
  feedbackBody: { width: '100%', fontFamily: Fonts.medium, color: '#eb5757' },
  quizButtonRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  bookmarkButton: { backgroundColor: '#eaeaea', alignItems: 'center', justifyContent: 'center' },
  quizPrimaryButton: { flex: 1, backgroundColor: '#55ba5d', alignItems: 'center', justifyContent: 'center' },
  quizPrimaryDisabled: { backgroundColor: '#bebebe' },
  quizPrimaryWrong: { backgroundColor: '#eb5757' },
  quizPrimaryText: { fontFamily: Fonts.bold, color: '#ffffff' },
  submitErrorText: { fontFamily: Fonts.medium, color: '#eb5757' },
});
