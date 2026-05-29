import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Fonts } from '@/constants/theme';

export default function LessonCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    lessonId?: string;
    lessonTitle?: string;
    score?: string;
    total?: string;
    xpEarned?: string;
    courseId?: string;
  }>();

  const score = Number(params.score || 0);
  const total = Number(params.total || 0);
  const xpEarned = Number(params.xpEarned || 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.celebrationBubble}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
        </View>
        <Text style={styles.resultTitle}>Hoàn thành bài học!</Text>
        <Text style={styles.resultDescription}>
          Bạn đã hoàn thành {score}/{total} câu hỏi trong bài `{params.lessonTitle}`.
        </Text>

        <View style={styles.resultStats}>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>ĐÚNG</Text>
            <Text style={[styles.resultValue, { color: '#00bd50' }]}>
              {score}/{total}
            </Text>
          </View>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>THƯỞNG</Text>
            <Text style={[styles.resultValue, { color: '#fda085' }]}>+{xpEarned} XP</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            router.replace({
              pathname: '/lesson',
              params: { lessonId: params.lessonId },
            })
          }>
          <Text style={styles.primaryButtonText}>Trở về bài học</Text>
        </TouchableOpacity>

        {params.courseId ? (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              router.replace({
                pathname: '/course',
                params: { courseId: params.courseId },
              })
            }>
            <Text style={styles.secondaryButtonText}>Quay lại khóa học</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },
  celebrationBubble: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  celebrationEmoji: { fontSize: 48 },
  resultTitle: { fontFamily: Fonts.bold, fontSize: 28, color: '#050018', marginBottom: 8 },
  resultDescription: { fontFamily: Fonts.medium, fontSize: 14, color: '#929292', lineHeight: 22, textAlign: 'center', marginBottom: 36 },
  resultStats: { width: '100%', flexDirection: 'row', gap: 12, marginBottom: 36 },
  resultCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 20, paddingVertical: 20, alignItems: 'center' },
  resultLabel: { fontFamily: Fonts.bold, fontSize: 11, color: '#bebebe', marginBottom: 6 },
  resultValue: { fontFamily: Fonts.bold, fontSize: 18 },
  primaryButton: { width: '100%', backgroundColor: '#00bd50', borderRadius: 999, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
  secondaryButton: { width: '100%', backgroundColor: '#ffffff', borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  secondaryButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#050018' },
});
