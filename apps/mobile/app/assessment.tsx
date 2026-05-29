import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import type { Assessment } from '../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getAssessment, submitAssessment } from '@/services/content-service';

export default function AssessmentScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { targetType } = useLocalSearchParams<{ targetType?: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; total: number; recommendedCourseId: string } | null>(null);

  useEffect(() => {
    const accessToken = token;
    const selectedTargetType = targetType ?? undefined;

    if (!accessToken || !selectedTargetType) {
      return;
    }

    let mounted = true;
    getAssessment(accessToken, selectedTargetType)
      .then((data) => {
        if (mounted) {
          setAssessment(data);
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
  }, [token, targetType]);

  if (loading || !assessment) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (result) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Đánh giá hoàn tất</Text>
          <Text style={styles.resultText}>
            Bạn đúng {result.score}/{result.total} câu.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace({ pathname: '/course', params: { courseId: result.recommendedCourseId } })}>
            <Text style={styles.primaryButtonText}>Vào khóa học gợi ý</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const question = assessment.questions[index];
  const isLast = index === assessment.questions.length - 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Text style={styles.iconText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{assessment.title}</Text>
          <View style={{ width: 42 }} />
        </View>

        <View style={styles.promptCard}>
          <Text style={styles.questionIndex}>
            Câu {index + 1}/{assessment.questions.length}
          </Text>
          <Text style={styles.questionInstruction}>{question.instruction}</Text>
          <Text style={styles.questionPrompt}>{question.prompt}</Text>
        </View>

        <View style={styles.answersList}>
          {question.options.map((option) => {
            const active = selectedAnswer === option;
            return (
              <TouchableOpacity key={option} style={[styles.answerButton, active && styles.answerButtonActive]} onPress={() => setSelectedAnswer(option)}>
                <Text style={[styles.answerText, active && styles.answerTextActive]}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, !selectedAnswer && styles.primaryButtonDisabled]}
          disabled={!selectedAnswer}
          onPress={async () => {
            const nextAnswers = { ...answers, [question.id]: selectedAnswer! };
            setAnswers(nextAnswers);

            if (!token) {
              return;
            }

            if (isLast) {
              const assessmentResult = await submitAssessment(token, {
                assessmentId: assessment.id,
                answers: Object.entries(nextAnswers).map(([questionId, answer]) => ({
                  questionId,
                  selectedAnswer: answer,
                })),
              });
              setResult(assessmentResult);
              return;
            }

            setIndex((prev) => prev + 1);
            setSelectedAnswer(null);
          }}>
          <Text style={styles.primaryButtonText}>{isLast ? 'Nộp bài' : 'Câu tiếp'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  container: { flex: 1, padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  iconButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 20, color: '#050018' },
  headerTitle: { flex: 1, textAlign: 'center', fontFamily: Fonts.bold, fontSize: 18, color: '#050018' },
  promptCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 20, marginBottom: 20 },
  questionIndex: { fontFamily: Fonts.medium, fontSize: 12, color: '#929292', marginBottom: 8 },
  questionInstruction: { fontFamily: Fonts.semiBold, fontSize: 15, color: '#00bd50', marginBottom: 10 },
  questionPrompt: { fontFamily: Fonts.bold, fontSize: 20, color: '#050018', lineHeight: 28 },
  answersList: { gap: 12, marginBottom: 20 },
  answerButton: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16 },
  answerButtonActive: { backgroundColor: '#eaf8ee', borderWidth: 1, borderColor: '#00bd50' },
  answerText: { fontFamily: Fonts.medium, fontSize: 15, color: '#050018' },
  answerTextActive: { color: '#00bd50' },
  primaryButton: { marginTop: 'auto', backgroundColor: '#00bd50', borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  primaryButtonDisabled: { backgroundColor: '#b7d6c0' },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  resultTitle: { fontFamily: Fonts.bold, fontSize: 28, color: '#050018', marginBottom: 12 },
  resultText: { fontFamily: Fonts.medium, fontSize: 14, color: '#696674', marginBottom: 24 },
});
