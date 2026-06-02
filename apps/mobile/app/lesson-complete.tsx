import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Redirect, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';

const celebrationArt = require('../assets/images/figma-lesson-complete-art.png');

export default function LessonCompleteScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isLoading, onboardingComplete, token } = useAuth();
  const params = useLocalSearchParams<{
    lessonId?: string;
    lessonTitle?: string;
    score?: string;
    total?: string;
    xpEarned?: string;
    courseId?: string;
  }>();

  const scale = Math.min(width / 375, 1) * 0.84;
  const horizontal = 22 * scale;
  const score = Number(params.score || 0);
  const total = Number(params.total || 0);
  const xpEarned = Number(params.xpEarned || 0);
  const normalizedLessonId = typeof params.lessonId === 'string' && params.lessonId.length > 0 ? params.lessonId : undefined;
  const normalizedCourseId = typeof params.courseId === 'string' && params.courseId.length > 0 ? params.courseId : undefined;
  const insetBottom = Math.max(insets.bottom, 16);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.centeredState}>
          <Ionicons name="hourglass-outline" size={24} color="#00bd50" />
        </View>
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.backButton, { width: 42 * scale, height: 42 * scale, borderRadius: 21 * scale, top: insets.top + 8 * scale, left: horizontal }]}
          onPress={() =>
            router.replace({
              pathname: '/lesson',
              params: { lessonId: normalizedLessonId },
            })
          }>
          <Ionicons name="chevron-back" size={21 * scale} color="#050018" />
        </TouchableOpacity>

        <View style={[styles.heroWrap, { marginTop: 72 * scale + insets.top }]}>
          <Image source={celebrationArt} style={{ width: 196 * scale, height: 196 * scale }} resizeMode="contain" />
        </View>

        <Text style={[styles.title, { marginTop: 2 * scale, fontSize: 21 * scale, lineHeight: 29 * scale }]}>Hoàn thành bài học</Text>
        <Text style={[styles.lessonName, { fontSize: 15 * scale, lineHeight: 19 * scale, marginTop: 8 * scale }]}>{params.lessonTitle || 'Các loại danh từ'}</Text>

        <View
          style={[
            styles.statsCard,
            { marginHorizontal: horizontal, marginTop: 24 * scale, borderRadius: 20 * scale, paddingHorizontal: 20 * scale, paddingVertical: 22 * scale },
          ]}>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { fontSize: 12 * scale }]}>Độ khó</Text>
            <Text style={[styles.statValue, { fontSize: 14 * scale }]}>Dễ</Text>
          </View>
          <View style={[styles.statRow, { marginTop: 20 * scale }]}>
            <Text style={[styles.statLabel, { fontSize: 12 * scale }]}>Số câu đúng</Text>
            <Text style={[styles.statValue, { fontSize: 14 * scale }]}>{score || total}</Text>
          </View>
          <View style={[styles.statRow, { marginTop: 20 * scale }]}>
            <Text style={[styles.statLabel, { fontSize: 12 * scale }]}>Thưởng liên tiếp</Text>
            <Text style={[styles.statValue, { fontSize: 14 * scale }]}>{xpEarned > 0 ? 1 : 0}</Text>
          </View>
        </View>

        <View style={[styles.bottomBar, { paddingHorizontal: horizontal, paddingBottom: insetBottom + 8 * scale }]}>
          <TouchableOpacity
            style={[styles.primaryButton, { borderRadius: 999, height: 48 * scale }]}
            onPress={() => {
              if (normalizedCourseId) {
                router.replace({
                  pathname: '/course',
                  params: { courseId: normalizedCourseId },
                });
                return;
              }

              router.replace({
                pathname: '/lesson',
                params: { lessonId: normalizedLessonId },
              });
            }}>
            <Text style={[styles.primaryButtonText, { fontSize: 15 * scale }]}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, backgroundColor: '#ffffff' },
  centeredState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  backButton: {
    position: 'absolute',
    backgroundColor: '#faf8f8',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  heroWrap: { alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Fonts.medium, color: '#969696', textAlign: 'center' },
  lessonName: { fontFamily: Fonts.bold, color: '#373346', textAlign: 'center' },
  statsCard: { backgroundColor: '#faf8f8' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { fontFamily: Fonts.medium, color: '#000000' },
  statValue: { fontFamily: Fonts.semiBold, color: '#000000' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#ffffff' },
  primaryButton: { backgroundColor: '#55ba5d', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { fontFamily: Fonts.bold, color: '#ffffff' },
});
