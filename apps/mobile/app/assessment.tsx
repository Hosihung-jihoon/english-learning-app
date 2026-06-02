import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Redirect, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Assessment } from '../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getAssessment, submitAssessment } from '@/services/content-service';

const assessmentArt = require('../assets/images/figma-assessment-art.png');

export default function AssessmentScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isLoading: authLoading, onboardingComplete, token } = useAuth();
  const { targetType } = useLocalSearchParams<{ targetType?: string }>();
  const normalizedTargetType = typeof targetType === 'string' && targetType.length > 0 ? targetType : undefined;
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; total: number; recommendedCourseId: string } | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [savedQuestionIds, setSavedQuestionIds] = useState<string[]>([]);

  useEffect(() => {
    setAssessment(null);
    setError(null);
    setStarted(false);
    setIndex(0);
    setSelectedAnswer(null);
    setAnswers({});
    setChecked(false);
    setSubmitting(false);
    setSubmitError(null);
    setResult(null);
    setSavedQuestionIds([]);

    if (!token || !onboardingComplete || !normalizedTargetType) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const accessToken = token;
    const selectedTargetType = normalizedTargetType;
    let mounted = true;

    getAssessment(accessToken, selectedTargetType)
      .then((data) => {
        if (mounted) {
          setAssessment(data);
        }
      })
      .catch((loadError) => {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : 'Không tải được bài đánh giá');
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [token, onboardingComplete, normalizedTargetType]);

  const scale = Math.min(width / 375, 1) * 0.84;
  const horizontal = 20 * scale;
  const question = assessment?.questions[index];
  const hasQuestions = (assessment?.questions.length ?? 0) > 0;
  const isLast = index === Math.max((assessment?.questions.length ?? 1) - 1, 0);
  const progressPercent = ((index + 1) / Math.max(assessment?.questions.length ?? 1, 1)) * 100;
  const insetBottom = Math.max(insets.bottom, 16);

  const resetQuiz = () => {
    setStarted(false);
    setIndex(0);
    setSelectedAnswer(null);
    setAnswers({});
    setChecked(false);
    setSubmitError(null);
    setResult(null);
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

  if (!normalizedTargetType) {
    return <Redirect href="/(tabs)" />;
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (!assessment) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <Text style={styles.errorText}>{error || 'Không tải được bài đánh giá.'}</Text>
      </SafeAreaView>
    );
  }

  if (result) {
    const resultPercent = Math.round((result.score / Math.max(result.total, 1)) * 100);

    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.screen}>
          <View style={[styles.topBar, { paddingHorizontal: horizontal, paddingTop: 12 * scale }]}>
            <TouchableOpacity style={[styles.roundButton, { width: 40 * scale, height: 40 * scale, borderRadius: 20 * scale }]} onPress={() => router.replace('/(tabs)')}>
              <Ionicons name="chevron-back" size={21 * scale} color="#050018" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { fontSize: 18 * scale }]}>Kết quả đánh giá</Text>
            <View style={{ width: 40 * scale }} />
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: horizontal, paddingTop: 24 * scale, paddingBottom: insetBottom + 18 * scale }} showsVerticalScrollIndicator={false}>
            <View style={[styles.resultHero, { borderRadius: 26 * scale, paddingHorizontal: 20 * scale, paddingTop: 24 * scale, paddingBottom: 22 * scale }]}>
              <Image source={assessmentArt} style={{ width: 116 * scale, height: 80 * scale }} resizeMode="contain" />
              <Text style={[styles.resultHeadline, { fontSize: 23 * scale, marginTop: 18 * scale }]}>Đánh giá hoàn tất</Text>
              <Text style={[styles.resultCaption, { fontSize: 13 * scale, lineHeight: 20 * scale, marginTop: 10 * scale }]}>
                Bạn đã hoàn thành bài test đầu vào. Kết quả này sẽ giúp hệ thống gợi ý lộ trình phù hợp hơn.
              </Text>

              <View style={[styles.scoreCard, { borderRadius: 20 * scale, marginTop: 20 * scale, paddingHorizontal: 16 * scale, paddingVertical: 14 * scale }]}>
                <View style={[styles.scoreBubble, { width: 64 * scale, height: 64 * scale, borderRadius: 32 * scale }]}>
                  <Text style={[styles.scoreBubbleText, { fontSize: 16 * scale }]}>{resultPercent}%</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 * scale }}>
                  <Text style={[styles.scoreTitle, { fontSize: 16 * scale }]}>
                    {result.score}/{result.total} câu đúng
                  </Text>
                  <Text style={[styles.scoreSubtitle, { fontSize: 12 * scale, lineHeight: 19 * scale, marginTop: 7 * scale }]}>
                    Tiếp tục với khóa học gợi ý để đi nhanh hơn và đúng trình độ.
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { borderRadius: 24 * scale, height: 50 * scale, marginTop: 24 * scale }]}
              onPress={() => router.replace({ pathname: '/course', params: { courseId: result.recommendedCourseId } })}>
              <Text style={[styles.primaryButtonText, { fontSize: 15 * scale }]}>Vào khóa học gợi ý</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.secondaryButton, { borderRadius: 24 * scale, height: 50 * scale, marginTop: 12 * scale }]} onPress={resetQuiz}>
              <Text style={[styles.secondaryButtonText, { fontSize: 15 * scale }]}>Làm lại bài đánh giá</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  if (!started) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.screen}>
          <View style={[styles.topBar, { paddingHorizontal: horizontal, paddingTop: 12 * scale }]}>
            <TouchableOpacity style={[styles.roundButton, { width: 40 * scale, height: 40 * scale, borderRadius: 20 * scale }]} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={21 * scale} color="#050018" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { fontSize: 18 * scale }]}>Bài đánh giá</Text>
            <TouchableOpacity style={[styles.roundButton, { width: 40 * scale, height: 40 * scale, borderRadius: 20 * scale }]} onPress={() => setShowInfo((current) => !current)}>
              <Ionicons name="alert-circle" size={20 * scale} color="#292d32" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: horizontal, paddingTop: 22 * scale, paddingBottom: insetBottom + 18 * scale }} showsVerticalScrollIndicator={false}>
            {showInfo ? (
              <View style={[styles.inlineInfoCard, { borderRadius: 16 * scale, marginBottom: 16 * scale, padding: 15 * scale }]}>
                <Text style={[styles.inlineInfoTitle, { fontSize: 14 * scale }]}>Thông tin bài đánh giá</Text>
                <Text style={[styles.inlineInfoText, { marginTop: 6 * scale, fontSize: 12 * scale, lineHeight: 19 * scale }]}>
                  Bài test này dùng để ước lượng nhanh trình độ hiện tại và gợi ý khóa học phù hợp ngay sau khi hoàn thành.
                </Text>
              </View>
            ) : null}

            <View style={[styles.introHero, { borderRadius: 26 * scale, paddingHorizontal: 20 * scale, paddingTop: 20 * scale, paddingBottom: 20 * scale }]}>
              <Text style={[styles.introTitle, { fontSize: 23 * scale, lineHeight: 31 * scale }]}>Bài đánh giá năng lực</Text>
              <Text style={[styles.introSubtitle, { fontSize: 13 * scale, lineHeight: 20 * scale, marginTop: 11 * scale }]}>{assessment.description}</Text>

              <View style={[styles.introButtonChip, { borderRadius: 16 * scale, paddingHorizontal: 28 * scale, paddingVertical: 12 * scale, marginTop: 20 * scale }]}>
                <Text style={[styles.introButtonChipText, { fontSize: 14 * scale }]}>Test</Text>
              </View>

              <Image source={assessmentArt} style={{ position: 'absolute', right: 12 * scale, bottom: 10 * scale, width: 116 * scale, height: 80 * scale }} resizeMode="contain" />
            </View>

            <View style={[styles.infoCard, { borderRadius: 22 * scale, marginTop: 22 * scale, paddingHorizontal: 16 * scale, paddingVertical: 16 * scale }]}>
              <Text style={[styles.infoTitle, { fontSize: 16 * scale }]}>Bạn sẽ nhận được gì?</Text>
              <Text style={[styles.infoLine, { fontSize: 13 * scale, lineHeight: 21 * scale, marginTop: 12 * scale }]}>• Đánh giá nhanh trình độ đầu vào theo mục tiêu hiện tại.</Text>
              <Text style={[styles.infoLine, { fontSize: 13 * scale, lineHeight: 21 * scale, marginTop: 8 * scale }]}>• Gợi ý khóa học phù hợp sau khi hoàn thành.</Text>
              <Text style={[styles.infoLine, { fontSize: 13 * scale, lineHeight: 21 * scale, marginTop: 8 * scale }]}>• {assessment.questions.length} câu hỏi ngắn, trả lời trực tiếp trên app.</Text>
            </View>

            {!hasQuestions ? (
              <View style={[styles.emptyQuestionCard, { borderRadius: 18 * scale, marginTop: 18 * scale, padding: 16 * scale }]}>
                <Text style={[styles.emptyQuestionTitle, { fontSize: 14 * scale }]}>Chưa có câu hỏi đánh giá</Text>
                <Text style={[styles.emptyQuestionText, { marginTop: 6 * scale, fontSize: 12 * scale, lineHeight: 19 * scale }]}>
                  Bài đánh giá này hiện chưa có câu hỏi để bắt đầu. Hãy quay lại sau hoặc chọn mục tiêu học khác.
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.primaryButton, { borderRadius: 24 * scale, height: 50 * scale, marginTop: 24 * scale }, !hasQuestions && styles.primaryButtonDisabled]}
              disabled={!hasQuestions}
              onPress={() => setStarted(true)}>
              <Text style={[styles.primaryButtonText, { fontSize: 15 * scale }]}>Bắt đầu đánh giá</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  if (!question) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <Text style={styles.errorText}>Không tìm thấy câu hỏi đánh giá.</Text>
      </SafeAreaView>
    );
  }

  const isCorrect = checked && selectedAnswer === question.correctAnswer;
  const isWrong = checked && selectedAnswer !== question.correctAnswer;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.screen}>
        <View style={[styles.topBar, { paddingHorizontal: horizontal, paddingTop: 12 * scale }]}>
          <TouchableOpacity style={[styles.roundButton, { width: 40 * scale, height: 40 * scale, borderRadius: 20 * scale }]} onPress={resetQuiz}>
            <Ionicons name="chevron-back" size={21 * scale} color="#050018" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: 18 * scale }]}>Làm bài đánh giá</Text>
          <View style={{ width: 40 * scale }} />
        </View>

        <View style={{ paddingHorizontal: horizontal, marginTop: 22 * scale }}>
          <Text style={[styles.progressLabel, { fontSize: 13 * scale }]}>
            Câu hỏi {index + 1} trong {assessment.questions.length}
          </Text>
          <View style={[styles.progressTrack, { marginTop: 10 * scale, height: 8 * scale, borderRadius: 999 }]}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: horizontal, paddingTop: 18 * scale, paddingBottom: 156 * scale + insetBottom }}>
          <View style={[styles.questionCard, { borderRadius: 16 * scale, paddingHorizontal: 18 * scale, paddingTop: 18 * scale, paddingBottom: 20 * scale }]}>
            <Text style={[styles.questionIndex, { fontSize: 12 * scale }]}>Đánh giá đầu vào</Text>
            <Text style={[styles.questionInstruction, { fontSize: 12 * scale, marginTop: 7 * scale }]}>{question.instruction}</Text>
            <Text style={[styles.questionPrompt, { fontSize: 17 * scale, lineHeight: 24 * scale, marginTop: 11 * scale }]}>{question.prompt}</Text>
          </View>

          <View style={{ gap: 11 * scale, marginTop: 16 * scale }}>
            {question.options.map((option) => {
              const active = selectedAnswer === option;
              const optionCorrect = checked && option === question.correctAnswer;
              const optionWrong = checked && active && option !== question.correctAnswer;

              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.answerRow,
                    { borderRadius: 13 * scale, minHeight: 52 * scale, paddingHorizontal: 15 * scale },
                    active && !checked && styles.answerRowSelected,
                    optionCorrect && styles.answerRowSelected,
                    optionWrong && styles.answerRowWrong,
                  ]}
                  disabled={checked}
                  activeOpacity={0.9}
                  onPress={() => setSelectedAnswer(option)}>
                  <View
                    style={[
                      styles.answerRadio,
                      { width: 22 * scale, height: 22 * scale, borderRadius: 11 * scale, marginRight: 14 * scale },
                      active && !checked && styles.answerRadioSelected,
                      optionCorrect && styles.answerRadioSelected,
                      optionWrong && styles.answerRadioWrong,
                    ]}>
                    {active || optionCorrect ? <View style={[styles.answerRadioDot, { width: 7 * scale, height: 7 * scale, borderRadius: 3.5 * scale }]} /> : null}
                  </View>
                  <Text
                    style={[
                      styles.answerText,
                      { fontSize: 15 * scale },
                      active && !checked && styles.answerTextSelected,
                      (optionCorrect || optionWrong) && styles.answerTextSelected,
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
            styles.bottomActionArea,
            { paddingHorizontal: horizontal, paddingTop: 14 * scale, paddingBottom: insetBottom + 12 * scale },
            isCorrect && styles.bottomActionAreaCorrect,
            isWrong && styles.bottomActionAreaWrong,
          ]}>
          {submitError ? <Text style={[styles.submitErrorText, { marginBottom: 12 * scale, fontSize: 13 * scale }]}>{submitError}</Text> : null}
          {checked ? (
            <View style={styles.feedbackWrap}>
              <View style={[styles.feedbackIcon, { width: 40 * scale, height: 40 * scale, borderRadius: 20 * scale, backgroundColor: isCorrect ? '#55ba5d' : '#eb5757' }]}>
                <Ionicons name={isCorrect ? 'checkmark' : 'close'} size={21 * scale} color="#ffffff" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 * scale }}>
                <Text style={[styles.feedbackTitle, { fontSize: 16 * scale, color: isCorrect ? '#48a05d' : '#eb5757' }]}>{isCorrect ? 'Chính xác!' : 'Chưa đúng'}</Text>
                <Text style={[styles.feedbackBody, { fontSize: 12 * scale, lineHeight: 18 * scale, marginTop: 6 * scale }]}>
                  {isCorrect ? 'Bạn đang đi đúng hướng. Tiếp tục thêm một câu nữa.' : question.explanation}
                </Text>
              </View>
            </View>
          ) : null}

          <View style={[styles.bottomButtonRow, { marginTop: checked ? 14 * scale : 4 * scale, gap: 12 * scale }]}>
            <TouchableOpacity
              style={[styles.secondaryAction, { width: 64 * scale, height: 48 * scale, borderRadius: 24 * scale }]}
              onPress={() => {
                setSavedQuestionIds((current) => (current.includes(question.id) ? current.filter((id) => id !== question.id) : [...current, question.id]));
              }}>
              <Ionicons name={savedQuestionIds.includes(question.id) ? 'bookmark' : 'bookmark-outline'} size={21 * scale} color={savedQuestionIds.includes(question.id) ? '#00bd50' : '#292d32'} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryAction,
                { borderRadius: 24 * scale, height: 48 * scale },
                !checked && !selectedAnswer && styles.primaryActionDisabled,
                isWrong && styles.primaryActionWrong,
              ]}
              disabled={(!checked && !selectedAnswer) || submitting}
              onPress={async () => {
                if (!checked) {
                  setAnswers((prev) => ({
                    ...prev,
                    [question.id]: selectedAnswer || '',
                  }));
                  setSubmitError(null);
                  setChecked(true);
                  return;
                }

                if (isLast) {
                  setSubmitting(true);
                  setSubmitError(null);
                  try {
                    const assessmentResult = await submitAssessment(token, {
                      assessmentId: assessment.id,
                      answers: Object.entries({
                        ...answers,
                        [question.id]: selectedAnswer || answers[question.id] || '',
                      }).map(([questionId, selected]) => ({
                        questionId,
                        selectedAnswer: selected,
                      })),
                    });
                    setResult(assessmentResult);
                  } catch (submitErrorValue) {
                    setSubmitError(submitErrorValue instanceof Error ? submitErrorValue.message : 'Không nộp được kết quả đánh giá.');
                  } finally {
                    setSubmitting(false);
                  }
                  return;
                }

                setIndex((prev) => prev + 1);
                setSelectedAnswer(null);
                setChecked(false);
              }}>
              <Text style={[styles.primaryButtonText, { fontSize: 15 * scale }]}>{submitting ? 'Đang nộp...' : checked ? (isLast ? 'Xem kết quả' : 'Tiếp tục') : 'Kiểm tra'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  screen: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  errorText: { fontFamily: Fonts.medium, fontSize: 14, color: '#ea573f', textAlign: 'center', paddingHorizontal: 24 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roundButton: { backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: Fonts.bold, color: '#050018' },
  introHero: { minHeight: 188, overflow: 'hidden', backgroundColor: '#2f40c9' },
  introTitle: { fontFamily: Fonts.bold, color: '#ffffff', maxWidth: 170 },
  introSubtitle: { fontFamily: Fonts.regular, color: '#eff3ff', maxWidth: 180 },
  introButtonChip: { alignSelf: 'flex-start', backgroundColor: '#08bd4e' },
  introButtonChipText: { fontFamily: Fonts.bold, color: '#ffffff' },
  inlineInfoCard: { backgroundColor: '#ffffff' },
  inlineInfoTitle: { fontFamily: Fonts.bold, color: '#050018' },
  inlineInfoText: { fontFamily: Fonts.regular, color: '#5f5d72' },
  infoCard: { backgroundColor: '#ffffff' },
  infoTitle: { fontFamily: Fonts.bold, color: '#050018' },
  infoLine: { fontFamily: Fonts.regular, color: '#5f5d72' },
  emptyQuestionCard: { backgroundColor: '#f7f4f4' },
  emptyQuestionTitle: { fontFamily: Fonts.bold, color: '#050018' },
  emptyQuestionText: { fontFamily: Fonts.regular, color: '#5f5d72' },
  primaryButton: { backgroundColor: '#55ba5d', alignItems: 'center', justifyContent: 'center' },
  primaryButtonDisabled: { backgroundColor: '#b6d7b9' },
  primaryButtonText: { fontFamily: Fonts.bold, color: '#ffffff' },
  secondaryButton: { backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { fontFamily: Fonts.bold, color: '#373346' },
  resultHero: { backgroundColor: '#ffffff', alignItems: 'center' },
  resultHeadline: { fontFamily: Fonts.bold, color: '#050018' },
  resultCaption: { fontFamily: Fonts.regular, color: '#666272', textAlign: 'center' },
  scoreCard: { width: '100%', backgroundColor: '#f7faf8', flexDirection: 'row', alignItems: 'center' },
  scoreBubble: { backgroundColor: '#dff8e5', alignItems: 'center', justifyContent: 'center' },
  scoreBubbleText: { fontFamily: Fonts.bold, color: '#14a34f' },
  scoreTitle: { fontFamily: Fonts.bold, color: '#050018' },
  scoreSubtitle: { fontFamily: Fonts.regular, color: '#666272' },
  progressLabel: { fontFamily: Fonts.medium, color: '#636363' },
  progressTrack: { backgroundColor: '#eaeaea', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#55ba5d', borderRadius: 999 },
  questionCard: { backgroundColor: '#ffffff' },
  questionIndex: { fontFamily: Fonts.medium, color: '#9995a7' },
  questionInstruction: { fontFamily: Fonts.medium, color: '#55ba5d' },
  questionPrompt: { fontFamily: Fonts.bold, color: '#130031' },
  answerRow: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaeaea', flexDirection: 'row', alignItems: 'center' },
  answerRowSelected: { backgroundColor: '#f1fdf0', borderColor: '#55ba5d' },
  answerRowWrong: { backgroundColor: '#fdf4f2', borderColor: '#eb5757' },
  answerRadio: { borderWidth: 2, borderColor: '#bababa', alignItems: 'center', justifyContent: 'center' },
  answerRadioSelected: { backgroundColor: '#55ba5d', borderColor: '#55ba5d' },
  answerRadioWrong: { backgroundColor: '#eb5757', borderColor: '#eb5757' },
  answerRadioDot: { backgroundColor: '#ffffff' },
  answerText: { fontFamily: Fonts.medium, color: '#373346' },
  answerTextSelected: { fontFamily: Fonts.semiBold, color: '#48a05d' },
  bottomActionArea: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#faf8f8' },
  bottomActionAreaCorrect: { backgroundColor: '#dff9d8' },
  bottomActionAreaWrong: { backgroundColor: '#fdf0ef' },
  feedbackWrap: { flexDirection: 'row', alignItems: 'flex-start' },
  feedbackIcon: { alignItems: 'center', justifyContent: 'center' },
  feedbackTitle: { fontFamily: Fonts.bold },
  feedbackBody: { fontFamily: Fonts.medium, color: '#5c596a' },
  bottomButtonRow: { flexDirection: 'row' },
  secondaryAction: { backgroundColor: '#e9e9e9', alignItems: 'center', justifyContent: 'center' },
  primaryAction: { flex: 1, backgroundColor: '#55ba5d', alignItems: 'center', justifyContent: 'center' },
  primaryActionDisabled: { backgroundColor: '#bebebe' },
  primaryActionWrong: { backgroundColor: '#eb5757' },
  submitErrorText: { fontFamily: Fonts.medium, color: '#eb5757' },
});
