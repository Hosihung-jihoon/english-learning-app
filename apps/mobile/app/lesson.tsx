import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Flashcard, LessonContent, QuizQuestion } from '../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getLesson, getLessonQuiz, getLessonVocabulary, markLessonAccess, submitLessonQuiz } from '@/services/content-service';

export default function LessonInfoScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [vocabulary, setVocabulary] = useState<Flashcard[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Lý thuyết' | 'Hướng dẫn'>('Lý thuyết');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token || !lessonId) {
      return;
    }
    const accessToken = token;
    const selectedLessonId = lessonId;

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
        await markLessonAccess(accessToken, { courseId: lessonData.courseId, lessonId: lessonData.id });
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
  }, [token, lessonId]);

  const question = quiz[currentIndex];
  const hasVocabularyPreview = lesson?.contentType === 'vocabulary' && vocabulary.length > 0;

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setChecked(false);
    setAnswers({});
  };

  const handleCheck = () => {
    if (!selectedOption || !question) {
      return;
    }
    setAnswers((prev) => ({
      ...prev,
      [question.id]: selectedOption,
    }));
    setChecked(true);
  };

  const handleNext = async () => {
    if (!lesson || !question || !token) {
      return;
    }

    const isLast = currentIndex === quiz.length - 1;
    if (isLast) {
      setSubmitting(true);
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
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setChecked(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <Text style={styles.errorText}>{error || 'Không tải được bài học.'}</Text>
      </SafeAreaView>
    );
  }

  if (quizStarted && question) {
    const isCorrect = selectedOption === question.correctAnswer;
    const progressPercent = ((currentIndex + 1) / Math.max(quiz.length, 1)) * 100;

    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.iconButton} onPress={resetQuiz}>
              <Ionicons name="close" size={24} color="#050018" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Làm Quiz</Text>
            <View style={{ width: 42 }} />
          </View>

          <View style={styles.quizProgressContainer}>
            <View style={[styles.quizProgressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.quizProgressCaption}>
            Câu hỏi {currentIndex + 1}/{quiz.length}
          </Text>

          <View style={styles.quizBody}>
            <Text style={styles.quizInstruction}>{question.instruction}</Text>
            <View style={styles.promptCard}>
              <Text style={styles.promptText}>{question.prompt}</Text>
            </View>

            <View style={styles.optionsList}>
              {question.options.map((option) => {
                const active = selectedOption === option;
                const isAnswer = checked && option === question.correctAnswer;
                const isWrong = checked && active && option !== question.correctAnswer;

                return (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.88}
                    disabled={checked}
                    style={[
                      styles.optionButton,
                      active && styles.optionButtonActive,
                      isAnswer && styles.optionButtonCorrect,
                      isWrong && styles.optionButtonWrong,
                    ]}
                    onPress={() => setSelectedOption(option)}>
                    <Text
                      style={[
                        styles.optionButtonText,
                        active && styles.optionButtonTextActive,
                        (isAnswer || isWrong) && styles.optionButtonTextInvert,
                      ]}>
                      {option}
                    </Text>
                    {isAnswer ? <Ionicons name="checkmark-circle" size={20} color="#ffffff" /> : null}
                    {isWrong ? <Ionicons name="close-circle" size={20} color="#ffffff" /> : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.quizBottomBar}>
            {checked ? (
              <View style={[styles.feedbackBanner, isCorrect ? styles.feedbackBannerCorrect : styles.feedbackBannerWrong]}>
                <Ionicons name={isCorrect ? 'checkmark-circle' : 'alert-circle'} size={22} color={isCorrect ? '#27ae60' : '#eb5757'} />
                <Text style={[styles.feedbackText, { color: isCorrect ? '#27ae60' : '#eb5757' }]}>
                  {isCorrect ? 'Chính xác! Làm tốt lắm.' : question.explanation}
                </Text>
              </View>
            ) : null}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                !checked && !selectedOption && styles.primaryButtonDisabled,
                checked && !isCorrect && styles.primaryButtonWrong,
              ]}
              disabled={(!checked && !selectedOption) || submitting}
              onPress={checked ? handleNext : handleCheck}>
              <Text style={styles.primaryButtonText}>{submitting ? 'Đang nộp...' : checked ? 'Tiếp tục' : 'Kiểm tra'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#050018" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thông tin bài học</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Thông tin bài học' } } as never)}>
            <Ionicons name="information-circle-outline" size={22} color="#292d32" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.lessonEyebrow}>Bài học</Text>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <View style={styles.lessonMetaRow}>
            <View style={styles.metaBadge}>
              <Ionicons name="trophy-outline" size={16} color="#00bd50" />
              <Text style={styles.metaBadgeText}>{lesson.label}</Text>
            </View>
            <View style={styles.metaBadgeOutline}>
              <Text style={styles.metaBadgeOutlineText}>{lesson.questionCount} câu hỏi</Text>
            </View>
          </View>
          <Text style={styles.lessonDescription}>{lesson.description}</Text>

          <View style={styles.tabRow}>
            {(['Lý thuyết', 'Hướng dẫn'] as const).map((tab) => (
              <TouchableOpacity key={tab} style={styles.tabButton} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                {activeTab === tab ? <View style={styles.tabIndicator} /> : null}
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'Lý thuyết' ? (
            <View style={styles.contentStack}>
              {lesson.theory.map((paragraph) => (
                <Text key={paragraph} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}
              <View style={styles.exampleCard}>
                <Text style={styles.exampleEnglish}>Ex: {lesson.example.english}</Text>
                <Text style={styles.exampleVietnamese}>{lesson.example.vietnamese}</Text>
              </View>
              {hasVocabularyPreview ? (
                <View style={styles.vocabularySection}>
                  <Text style={styles.vocabularyTitle}>Từ khóa liên quan</Text>
                  {vocabulary.slice(0, 3).map((item) => (
                    <View key={item.id} style={styles.vocabularyCard}>
                      <Text style={styles.vocabularyWord}>{item.word}</Text>
                      <Text style={styles.vocabularyMeaning}>{item.meaning}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ) : (
            <View style={styles.contentStack}>
              {lesson.guidance.map((paragraph) => (
                <Text key={paragraph} style={styles.paragraph}>
                  {'\u2022'} {paragraph}
                </Text>
              ))}
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setQuizStarted(true)}>
            <Text style={styles.primaryButtonText}>Làm quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  errorText: { fontFamily: Fonts.medium, fontSize: 14, color: '#ea573f', textAlign: 'center', paddingHorizontal: 24 },
  container: { flex: 1, backgroundColor: '#faf8f8' },
  header: { paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: Fonts.bold, fontSize: 20, color: '#050018' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 12 },
  lessonEyebrow: { fontFamily: Fonts.medium, fontSize: 12, color: '#929292', marginBottom: 4 },
  lessonTitle: { fontFamily: Fonts.bold, fontSize: 24, color: '#050018', marginBottom: 12 },
  lessonMetaRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  metaBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ffffff', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  metaBadgeText: { fontFamily: Fonts.medium, fontSize: 12, color: '#00bd50' },
  metaBadgeOutline: { backgroundColor: '#ffffff', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  metaBadgeOutlineText: { fontFamily: Fonts.medium, fontSize: 12, color: '#00bd50' },
  lessonDescription: { fontFamily: Fonts.regular, fontSize: 14, color: '#373346', lineHeight: 20, marginBottom: 20 },
  tabRow: { flexDirection: 'row', gap: 24, marginBottom: 24 },
  tabButton: { paddingVertical: 8 },
  tabText: { fontFamily: Fonts.medium, fontSize: 14, color: '#bababa' },
  tabTextActive: { fontFamily: Fonts.semiBold, color: '#00bd50' },
  tabIndicator: { marginTop: 8, height: 2, borderRadius: 2, backgroundColor: '#00bd50' },
  contentStack: { gap: 16 },
  paragraph: { fontFamily: Fonts.regular, fontSize: 14, color: '#373346', lineHeight: 22 },
  exampleCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16 },
  exampleEnglish: { fontFamily: Fonts.semiBold, fontSize: 14, color: '#050018', marginBottom: 6 },
  exampleVietnamese: { fontFamily: Fonts.regular, fontSize: 14, color: '#6c5f80' },
  vocabularySection: { gap: 10 },
  vocabularyTitle: { fontFamily: Fonts.bold, fontSize: 16, color: '#050018' },
  vocabularyCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 14 },
  vocabularyWord: { fontFamily: Fonts.bold, fontSize: 15, color: '#050018', marginBottom: 4 },
  vocabularyMeaning: { fontFamily: Fonts.medium, fontSize: 13, color: '#6c5f80' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 24, paddingBottom: 40, backgroundColor: '#faf8f8' },
  primaryButton: { backgroundColor: '#00bd50', borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  primaryButtonDisabled: { backgroundColor: '#bebebe' },
  primaryButtonWrong: { backgroundColor: '#ea573f' },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
  quizProgressContainer: { marginHorizontal: 24, height: 6, backgroundColor: '#eeedef', borderRadius: 3, overflow: 'hidden' },
  quizProgressFill: { height: '100%', backgroundColor: '#00bd50', borderRadius: 3 },
  quizProgressCaption: { fontFamily: Fonts.medium, fontSize: 12, color: '#929292', marginTop: 12, marginHorizontal: 24 },
  quizBody: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  quizInstruction: { fontFamily: Fonts.semiBold, fontSize: 16, color: '#929292', marginBottom: 12 },
  promptCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 24, marginBottom: 32, alignItems: 'center' },
  promptText: { fontFamily: Fonts.bold, fontSize: 18, color: '#050018', textAlign: 'center', lineHeight: 26 },
  optionsList: { gap: 12 },
  optionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionButtonActive: { borderWidth: 2, borderColor: '#00bd50', backgroundColor: '#f2faf4', paddingVertical: 14, paddingHorizontal: 18 },
  optionButtonCorrect: { backgroundColor: '#00bd50', borderWidth: 0 },
  optionButtonWrong: { backgroundColor: '#ea573f', borderWidth: 0 },
  optionButtonText: { fontFamily: Fonts.semiBold, fontSize: 16, color: '#373346' },
  optionButtonTextActive: { color: '#00bd50' },
  optionButtonTextInvert: { color: '#ffffff' },
  quizBottomBar: { padding: 24, paddingBottom: 40, backgroundColor: '#faf8f8' },
  feedbackBanner: { padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  feedbackBannerCorrect: { backgroundColor: '#f2faf4' },
  feedbackBannerWrong: { backgroundColor: '#fdf4f2' },
  feedbackText: { flex: 1, fontFamily: Fonts.semiBold, fontSize: 14 },
});
