import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Redirect, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MistakeReviewItem } from '../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getReviewMistakes } from '@/services/content-service';

export default function ReviewMistakesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isLoading: authLoading, onboardingComplete, token } = useAuth();
  const [items, setItems] = useState<MistakeReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems([]);
    setError(null);

    if (!token || !onboardingComplete) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let mounted = true;

    getReviewMistakes(token)
      .then((data) => {
        if (mounted) {
          setItems(data);
        }
      })
      .catch((loadError) => {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : 'Không tải được danh sách lỗi sai.');
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
  }, [onboardingComplete, token]);

  const scale = Math.min(width / 375, 1) * 0.88;
  const horizontal = 22 * scale;
  const insetBottom = Math.max(insets.bottom, 16);
  const groupedItems = useMemo(() => {
    return items.reduce<Record<string, MistakeReviewItem[]>>((acc, item) => {
      acc[item.lessonTitle] = [...(acc[item.lessonTitle] || []), item];
      return acc;
    }, {});
  }, [items]);

  if (authLoading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#55ba5d" />
      </SafeAreaView>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/(auth)/onboarding-intro-1" />;
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#55ba5d" />
      </SafeAreaView>
    );
  }

  if (error && items.length === 0) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingHorizontal: horizontal, paddingTop: 14 * scale }]}>
        <TouchableOpacity style={[styles.iconButton, { width: 42 * scale, height: 42 * scale, borderRadius: 21 * scale }]} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22 * scale} color="#050018" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: 19 * scale }]}>Ôn tập lỗi sai</Text>
        <View style={{ width: 42 * scale }} />
      </View>

      {items.length === 0 ? (
        <View style={[styles.emptyWrap, { paddingHorizontal: horizontal }]}>
          <View style={[styles.emptyCard, { borderRadius: 30 * scale, paddingHorizontal: 22 * scale, paddingVertical: 26 * scale }]}>
            <View style={[styles.emptyIcon, { width: 62 * scale, height: 62 * scale, borderRadius: 31 * scale }]}>
              <Ionicons name="sparkles" size={30 * scale} color="#55ba5d" />
            </View>
            <Text style={[styles.emptyTitle, { fontSize: 24 * scale, marginTop: 18 * scale }]}>Chưa có lỗi sai nào</Text>
            <Text style={[styles.emptyText, { fontSize: 14 * scale, lineHeight: 21 * scale, marginTop: 10 * scale }]}>
              Hãy hoàn thành thêm một bài quiz để hệ thống lưu lại các câu cần ôn tập.
            </Text>
          </View>

          <TouchableOpacity style={[styles.primaryButton, { borderRadius: 26 * scale, height: 54 * scale, marginTop: 26 * scale }]} onPress={() => router.replace('/(tabs)/collection')}>
            <Text style={[styles.primaryButtonText, { fontSize: 16 * scale }]}>Về thư viện</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: horizontal, paddingTop: 16 * scale, paddingBottom: insetBottom + 18 * scale }} showsVerticalScrollIndicator={false}>
          <View style={[styles.heroCard, { borderRadius: 30 * scale, paddingHorizontal: 22 * scale, paddingVertical: 22 * scale }]}>
            <Text style={[styles.heroTitle, { fontSize: 24 * scale, lineHeight: 32 * scale }]}>Lỗi sai cần ôn lại</Text>
            <Text style={[styles.heroCaption, { fontSize: 14 * scale, lineHeight: 21 * scale, marginTop: 12 * scale }]}>
              Tập trung vào những câu bạn từng trả lời sai để củng cố nhanh hơn.
            </Text>
            <View style={[styles.heroBadge, { borderRadius: 16 * scale, marginTop: 16 * scale, paddingHorizontal: 16 * scale, paddingVertical: 10 * scale }]}>
              <Text style={[styles.heroBadgeText, { fontSize: 14 * scale }]}>{items.length} lỗi sai đang chờ</Text>
            </View>
          </View>

          <View style={{ gap: 16 * scale, marginTop: 20 * scale }}>
            {Object.entries(groupedItems).map(([lessonTitle, lessonItems]) => (
              <View key={lessonTitle} style={[styles.groupCard, { borderRadius: 24 * scale, paddingHorizontal: 18 * scale, paddingVertical: 18 * scale }]}>
                <View style={styles.groupHeader}>
                  <View style={[styles.groupIcon, { width: 42 * scale, height: 42 * scale, borderRadius: 21 * scale }]}>
                    <Ionicons name="alert-circle" size={21 * scale} color="#eb5757" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 * scale }}>
                    <Text style={[styles.groupTitle, { fontSize: 17 * scale }]}>{lessonTitle}</Text>
                    <Text style={[styles.groupCount, { fontSize: 13 * scale, marginTop: 4 * scale }]}>{lessonItems.length} câu cần xem lại</Text>
                  </View>
                </View>

                <View style={{ gap: 12 * scale, marginTop: 14 * scale }}>
                  {lessonItems.map((item) => (
                    <View key={item.id} style={[styles.itemCard, { borderRadius: 16 * scale, paddingHorizontal: 16 * scale, paddingVertical: 16 * scale }]}>
                      <Text style={[styles.itemPrompt, { fontSize: 15 * scale, lineHeight: 22 * scale }]}>{item.prompt}</Text>
                      <Text style={[styles.itemWrong, { fontSize: 13 * scale, marginTop: 12 * scale }]}>Bạn đã chọn: {item.selectedAnswer || 'Chưa trả lời'}</Text>
                      <Text style={[styles.itemCorrect, { fontSize: 13 * scale, marginTop: 6 * scale }]}>Đáp án đúng: {item.correctAnswer}</Text>
                      <Text style={[styles.itemExplanation, { fontSize: 13 * scale, lineHeight: 19 * scale, marginTop: 8 * scale }]}>{item.explanation}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.secondaryButton, { borderRadius: 24 * scale, height: 48 * scale, marginTop: 18 * scale }]}
                  onPress={() => router.push({ pathname: '/lesson', params: { lessonId: lessonItems[0].lessonId } })}>
                  <Text style={[styles.secondaryButtonText, { fontSize: 15 * scale }]}>Mở lại bài học</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  errorText: { fontFamily: Fonts.medium, fontSize: 14, color: '#ea573f', textAlign: 'center', paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: Fonts.bold, color: '#050018' },
  emptyWrap: { flex: 1, justifyContent: 'center' },
  emptyCard: { backgroundColor: '#ffffff', alignItems: 'center' },
  emptyIcon: { backgroundColor: '#e8f9eb', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontFamily: Fonts.bold, color: '#050018', textAlign: 'center' },
  emptyText: { fontFamily: Fonts.regular, color: '#696674', textAlign: 'center' },
  heroCard: { backgroundColor: '#59be5b' },
  heroTitle: { fontFamily: Fonts.bold, color: '#ffffff' },
  heroCaption: { fontFamily: Fonts.regular, color: '#eff8ef' },
  heroBadge: { alignSelf: 'flex-start', backgroundColor: '#ffffff' },
  heroBadgeText: { fontFamily: Fonts.bold, color: '#59be5b' },
  groupCard: { backgroundColor: '#ffffff' },
  groupHeader: { flexDirection: 'row', alignItems: 'center' },
  groupIcon: { backgroundColor: '#fff2f1', alignItems: 'center', justifyContent: 'center' },
  groupTitle: { fontFamily: Fonts.bold, color: '#050018' },
  groupCount: { fontFamily: Fonts.medium, color: '#8b8697' },
  itemCard: { backgroundColor: '#faf8f8' },
  itemPrompt: { fontFamily: Fonts.semiBold, color: '#2d2540' },
  itemWrong: { fontFamily: Fonts.medium, color: '#eb5757' },
  itemCorrect: { fontFamily: Fonts.medium, color: '#00bd50' },
  itemExplanation: { fontFamily: Fonts.regular, color: '#696674' },
  primaryButton: { backgroundColor: '#55ba5d', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { fontFamily: Fonts.bold, color: '#ffffff' },
  secondaryButton: { backgroundColor: '#f2f0f0', alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { fontFamily: Fonts.bold, color: '#373346' },
});
