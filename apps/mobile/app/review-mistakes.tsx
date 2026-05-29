import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import type { MistakeReviewItem } from '../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getReviewMistakes } from '@/services/content-service';

export default function ReviewMistakesScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [items, setItems] = useState<MistakeReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      return;
    }

    let mounted = true;
    getReviewMistakes(token)
      .then((data) => {
        if (mounted) {
          setItems(data);
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
  }, [token]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#55ba5d" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ôn tập lỗi sai</Text>
        <View style={{ width: 42 }} />
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Chưa có lỗi sai nào</Text>
          <Text style={styles.emptyText}>Hãy hoàn thành một bài quiz để hệ thống ghi lại câu cần ôn tập.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(tabs)/collection')}>
            <Text style={styles.primaryButtonText}>Về thư viện</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {items.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.lessonTitle}>{item.lessonTitle}</Text>
              <Text style={styles.prompt}>{item.prompt}</Text>
              <Text style={styles.answerWrong}>Bạn đã chọn: {item.selectedAnswer || 'Chưa trả lời'}</Text>
              <Text style={styles.answerCorrect}>Đáp án đúng: {item.correctAnswer}</Text>
              <Text style={styles.explanation}>{item.explanation}</Text>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push({ pathname: '/lesson', params: { lessonId: item.lessonId } })}>
                <Text style={styles.linkText}>Mở lại bài học</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  iconButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 20, color: '#050018' },
  headerTitle: { fontFamily: Fonts.bold, fontSize: 20, color: '#050018' },
  emptyState: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontFamily: Fonts.bold, fontSize: 24, color: '#050018', marginBottom: 10 },
  emptyText: { fontFamily: Fonts.medium, fontSize: 14, color: '#696674', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  primaryButton: { backgroundColor: '#55ba5d', borderRadius: 999, paddingVertical: 16, paddingHorizontal: 24 },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
  listContent: { paddingHorizontal: 24, paddingBottom: 32, gap: 12 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 18 },
  lessonTitle: { fontFamily: Fonts.bold, fontSize: 16, color: '#050018', marginBottom: 8 },
  prompt: { fontFamily: Fonts.medium, fontSize: 14, color: '#050018', marginBottom: 10 },
  answerWrong: { fontFamily: Fonts.medium, fontSize: 13, color: '#ea573f', marginBottom: 4 },
  answerCorrect: { fontFamily: Fonts.medium, fontSize: 13, color: '#00bd50', marginBottom: 8 },
  explanation: { fontFamily: Fonts.regular, fontSize: 13, color: '#696674', lineHeight: 20, marginBottom: 10 },
  linkButton: { alignSelf: 'flex-start' },
  linkText: { fontFamily: Fonts.bold, fontSize: 13, color: '#55ba5d' },
});
